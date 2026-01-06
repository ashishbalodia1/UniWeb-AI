/**
 * Chat Client - Frontend service for chat API communication
 * Handles HTTP and streaming chat requests with proper error handling
 */

import { Message, AIPersonality } from '@/types';

export interface ChatResponse {
  success: boolean;
  message?: Message;
  error?: string;
  code?: string;
}

export interface StreamCallbacks {
  onStart?: () => void;
  onChunk?: (chunk: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Send a standard (non-streaming) chat request
 */
export async function sendChatMessage(
  messages: Message[],
  personality?: AIPersonality
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        personality,
        streaming: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
    };
  } catch (error) {
    console.error('[Chat Client] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
}

/**
 * Send a streaming chat request using Server-Sent Events
 */
export async function sendStreamingChatMessage(
  messages: Message[],
  callbacks: StreamCallbacks,
  personality?: AIPersonality
): Promise<void> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        personality,
        streaming: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Read stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullContent = '';

    callbacks.onStart?.();

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            callbacks.onComplete?.(fullContent);
            return;
          }

          try {
            const parsed = JSON.parse(data);
            
            if (parsed.type === 'chunk' && parsed.content) {
              fullContent += parsed.content;
              callbacks.onChunk?.(parsed.content);
            } else if (parsed.type === 'error') {
              throw new Error(parsed.message);
            } else if (parsed.type === 'complete') {
              callbacks.onComplete?.(parsed.content);
              return;
            }
          } catch {
            // Skip invalid JSON
            console.warn('[Chat Client] Invalid JSON in stream:', data);
          }
        }
      }
    }
  } catch (error) {
    console.error('[Chat Client] Stream error:', error);
    callbacks.onError?.(error instanceof Error ? error : new Error('Stream failed'));
  }
}

/**
 * Send analysis request
 */
export async function sendAnalysisRequest(
  content: string,
  analysisType: string = 'general'
): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    const response = await fetch('/api/analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        analysisType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      success: data.success,
      content: data.content,
    };
  } catch (error) {
    console.error('[Chat Client] Analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed',
    };
  }
}
