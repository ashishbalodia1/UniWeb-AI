/**
 * AI Orchestrator - Central coordination layer for all AI operations
 * 
 * This is the brain of the platform. It:
 * - Routes requests to appropriate AI services
 * - Manages streaming responses
 * - Handles error recovery
 * - Coordinates state updates
 * - Ensures type safety across the system
 * 
 * @module AIOrchestrator
 */

import { Message, AIPersonality } from '@/types';
import { ChatService, SendMessageOptions } from './chatService';
import { demoProvider } from './demoProvider';

export interface OrchestratorRequest {
  type: 'chat' | 'analysis' | 'voice' | 'completion';
  messages?: Message[];
  content?: string;
  personality?: AIPersonality;
  streaming?: boolean;
  analysisType?: string;
}

export interface OrchestratorResponse {
  success: boolean;
  data?: {
    message?: Message;
    content?: string;
    audioUrl?: string;
    metadata?: Record<string, unknown>;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface StreamCallback {
  onStart?: () => void;
  onChunk?: (chunk: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Main Orchestrator Class
 * Singleton pattern for centralized AI coordination
 */
class AIOrchestrator {
  private chatService: ChatService;
  private static instance: AIOrchestrator;

  private constructor() {
    this.chatService = new ChatService();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  /**
   * Process a chat request with full error handling
   */
  async processChat(
    messages: Message[],
    options: SendMessageOptions = {}
  ): Promise<OrchestratorResponse> {
    try {
      // Check if we have API keys configured
      const hasApiKey = process.env.OPENAI_API_KEY && 
                        process.env.OPENAI_API_KEY !== 'your_openai_key_here';
      
      if (!hasApiKey) {
        // Use demo mode
        const response = await demoProvider.generateResponse(messages);
        const demoMessage: Message = {
          id: `demo-${Date.now()}`,
          role: 'assistant',
          content: response,
          type: 'text',
          metadata: {
            model: 'demo-mode',
            isDemo: true,
          },
          timestamp: new Date(),
        };
        
        return {
          success: true,
          data: {
            message: demoMessage,
            metadata: {
              timestamp: new Date().toISOString(),
              personality: options.personality || 'teacher',
              demoMode: true,
            },
          },
        };
      }

      const message = await this.chatService.sendMessage(messages, options);

      return {
        success: true,
        data: {
          message,
          metadata: {
            timestamp: new Date().toISOString(),
            personality: options.personality || 'teacher',
          },
        },
      };
    } catch (error) {
      console.error('[Orchestrator] Chat error:', error);
      return this.handleError(error, 'CHAT_ERROR');
    }
  }

  /**
   * Process a streaming chat request
   */
  async processChatStream(
    messages: Message[],
    callbacks: StreamCallback,
    options: SendMessageOptions = {}
  ): Promise<void> {
    try {
      callbacks.onStart?.();

      // Check if we have API keys configured
      const hasApiKey = process.env.OPENAI_API_KEY && 
                        process.env.OPENAI_API_KEY !== 'your_openai_key_here';
      
      if (!hasApiKey) {
        // Use demo streaming mode
        let fullContent = '';
        
        for await (const chunk of demoProvider.streamResponse(messages)) {
          fullContent += chunk;
          callbacks.onChunk?.(chunk);
        }
        
        callbacks.onComplete?.(fullContent);
        return;
      }

      let fullContent = '';

      await this.chatService.sendMessage(messages, {
        ...options,
        streaming: true,
        onStream: (chunk: string) => {
          fullContent += chunk;
          callbacks.onChunk?.(chunk);
        },
      });

      callbacks.onComplete?.(fullContent);
    } catch (error) {
      console.error('[Orchestrator] Stream error:', error);
      callbacks.onError?.(error as Error);
    }
  }

  /**
   * Process deep analysis request
   */
  async processAnalysis(
    content: string,
    analysisType: string = 'general'
  ): Promise<OrchestratorResponse> {
    try {
      const result = await this.chatService.analyzeContent(content, analysisType);

      return {
        success: true,
        data: {
          content: result,
          metadata: {
            analysisType,
            timestamp: new Date().toISOString(),
          },
        },
      };
    } catch (error) {
      console.error('[Orchestrator] Analysis error:', error);
      return this.handleError(error, 'ANALYSIS_ERROR');
    }
  }

  /**
   * Generate voice-optimized response
   */
  async processVoiceRequest(
    message: string,
    personality?: AIPersonality
  ): Promise<OrchestratorResponse> {
    try {
      const response = await this.chatService.generateVoiceResponse(
        message,
        personality
      );

      return {
        success: true,
        data: {
          content: response,
          metadata: {
            optimizedForVoice: true,
            timestamp: new Date().toISOString(),
          },
        },
      };
    } catch (error) {
      console.error('[Orchestrator] Voice request error:', error);
      return this.handleError(error, 'VOICE_ERROR');
    }
  }

  /**
   * Centralized error handling
   */
  private handleError(error: unknown, code: string): OrchestratorResponse {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: {
        code,
        message: this.getUserFriendlyError(errorMessage),
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
    };
  }

  /**
   * Convert technical errors to user-friendly messages
   */
  private getUserFriendlyError(error: string): string {
    if (error.includes('API key')) {
      return 'AI service configuration error. Please check your settings.';
    }
    if (error.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    if (error.includes('network') || error.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Health check for AI services
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    services: Record<string, boolean>;
  }> {
    const services: Record<string, boolean> = {
      chat: false,
      streaming: false,
    };

    try {
      // Test basic chat
      const testMessage: Message = {
        id: 'health-check',
        role: 'user',
        content: 'Health check',
        type: 'text',
        metadata: {},
        timestamp: new Date(),
      };

      const response = await this.processChat([testMessage]);
      services.chat = response.success;
      services.streaming = true; // If chat works, streaming should work

      return {
        healthy: services.chat,
        services,
      };
    } catch (error) {
      console.error('[Orchestrator] Health check failed:', error);
      return {
        healthy: false,
        services,
      };
    }
  }
}

// Export singleton instance
export const orchestrator = AIOrchestrator.getInstance();

// Export class for testing
export { AIOrchestrator };
