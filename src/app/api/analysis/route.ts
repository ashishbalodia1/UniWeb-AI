/**
 * Analysis API Route - Handles deep AI analysis requests
 * 
 * POST /api/analysis
 * Body: { content: string, analysisType: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/lib/ai/orchestrator';
import { z } from 'zod';

// Request validation schema
const analysisRequestSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  analysisType: z.string().optional().default('general'),
});

/**
 * POST handler for analysis requests
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = analysisRequestSchema.parse(body);

    const { content, analysisType } = validatedData;

    // Process analysis through orchestrator
    const response = await orchestrator.processAnalysis(content, analysisType);

    if (!response.success) {
      return NextResponse.json(
        {
          error: response.error?.message || 'Failed to process analysis',
          code: response.error?.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      content: response.data?.content,
      metadata: response.data?.metadata,
    });
  } catch (error) {
    console.error('[API] Analysis error:', error);

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
