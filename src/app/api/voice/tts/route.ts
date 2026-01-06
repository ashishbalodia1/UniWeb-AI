/**
 * Voice API Route - Handles text-to-speech requests
 * 
 * POST /api/voice/tts
 * Body: { text: string, voice?: string, settings?: VoiceSettings }
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schema
const ttsRequestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  voice: z.string().optional(),
  settings: z.object({
    rate: z.number().optional(),
    pitch: z.number().optional(),
    volume: z.number().optional(),
  }).optional(),
});

/**
 * POST handler for text-to-speech
 * Uses browser's Web Speech API or external TTS service
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = ttsRequestSchema.parse(body);

    const { text, voice, settings } = validatedData;

    // Check for API keys
    const elevenLabsKey = process.env.ELEVEN_LABS_API_KEY;
    const azureSpeechKey = process.env.AZURE_SPEECH_KEY;

    // If we have ElevenLabs API key, use that
    if (elevenLabsKey && elevenLabsKey !== 'your_elevenlabs_key_here') {
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': elevenLabsKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: settings?.pitch || 0.5,
              similarity_boost: settings?.volume || 0.75,
            },
          }),
        });

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          return new Response(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioBuffer.byteLength.toString(),
            },
          });
        }
      } catch (error) {
        console.error('[API] ElevenLabs TTS error:', error);
        // Fall through to browser TTS
      }
    }

    // If we have Azure Speech API key, use that
    if (azureSpeechKey && azureSpeechKey !== 'your_azure_speech_key_here') {
      try {
        const region = process.env.AZURE_SPEECH_REGION || 'eastus';
        const response = await fetch(
          `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
          {
            method: 'POST',
            headers: {
              'Ocp-Apim-Subscription-Key': azureSpeechKey,
              'Content-Type': 'application/ssml+xml',
              'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
            },
            body: `
              <speak version='1.0' xml:lang='en-US'>
                <voice xml:lang='en-US' name='en-US-JennyNeural'>
                  ${text}
                </voice>
              </speak>
            `,
          }
        );

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          return new Response(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioBuffer.byteLength.toString(),
            },
          });
        }
      } catch (error) {
        console.error('[API] Azure TTS error:', error);
        // Fall through to browser TTS
      }
    }

    // Fallback: Return instructions for browser-side TTS
    return NextResponse.json({
      success: true,
      useBrowserTTS: true,
      text,
      voice: voice || 'default',
      settings,
      message: 'Use browser Web Speech API for text-to-speech',
    });
  } catch (error) {
    console.error('[API] Voice TTS error:', error);

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
