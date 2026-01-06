/**
 * Chat API Route - Handles AI chat requests
 * Supports both standard and streaming responses
 * 
 * POST /api/chat
 * Body: { messages: Message[], personality?: string, streaming?: boolean }
 */

import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/lib/ai/orchestrator';
import { Message, AIPersonality } from '@/types';
import { z } from 'zod';
import { initializeAIEngine } from '@/lib/ai/init';

// Ensure AI engine is initialized
initializeAIEngine();

// Request validation schema
const chatRequestSchema = z.object({
  messages: z.array(z.any()), // Message type
  personality: z.string().optional(),
  streaming: z.boolean().optional(),
});

/**
 * POST handler for chat requests
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = chatRequestSchema.parse(body);

    const { messages, personality, streaming } = validatedData;

    // Handle streaming responses
    if (streaming) {
      return handleStreamingResponse(messages, personality as AIPersonality);
    }

    // Handle standard response
    const response = await orchestrator.processChat(messages, {
      personality: personality as AIPersonality,
      streaming: false,
    });

    if (!response.success) {
      return NextResponse.json(
        {
          error: response.error?.message || 'Failed to process chat request',
          code: response.error?.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: response.data?.message,
      metadata: response.data?.metadata,
    });
  } catch (error) {
    console.error('[API] Chat error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request format',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle streaming chat responses using Server-Sent Events
 */
function handleStreamingResponse(messages: Message[], personality?: AIPersonality) {
  // Create a TransformStream for SSE
  const encoder = new TextEncoder();
  
  const stream = new TransformStream({
    async start(controller) {
      try {
        await orchestrator.processChatStream(
          messages,
          {
            onStart: () => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'start' })}\n\n`)
              );
            },
            onChunk: (chunk: string) => {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`
                )
              );
            },
            onComplete: (fullContent: string) => {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'complete', content: fullContent })}\n\n`
                )
              );
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.terminate();
            },
            onError: (error: Error) => {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`
                )
              );
              controller.terminate();
            },
          },
          { personality }
        );
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ 
              type: 'error', 
              message: error instanceof Error ? error.message : 'Stream error' 
            })}\n\n`
          )
        );
        controller.terminate();
      }
    },
  });

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for Nginx
    },
  });
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Allow': 'POST, OPTIONS',
      },
    }
  );
}
