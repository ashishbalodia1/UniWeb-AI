/**
 * Chat Service - High-level API for chat interactions
 * Handles conversation management and AI responses
 */

import { Message, AIPersonality } from '@/types';
import { AIEngine, ChatCompletionRequest } from './engine';
import { AI_PERSONALITIES } from '@/config';

export interface SendMessageOptions {
  personality?: AIPersonality;
  streaming?: boolean;
  onStream?: (content: string) => void;
}

/**
 * ChatService - Main interface for chat functionality
 */
export class ChatService {
  private defaultProvider = 'openai';
  private defaultModel = 'gpt-4-turbo-preview';

  /**
   * Send a message and get AI response
   */
  async sendMessage(
    messages: Message[],
    options: SendMessageOptions = {}
  ): Promise<Message> {
    const { personality = 'teacher', streaming = false, onStream } = options;

    const personalityConfig = AI_PERSONALITIES[personality];
    if (!personalityConfig) {
      throw new Error(`Unknown personality: ${personality}`);
    }

    const request: ChatCompletionRequest = {
      messages,
      systemPrompt: personalityConfig.systemPrompt,
      temperature: personalityConfig.creativity,
      streaming,
    };

    try {
      if (streaming && onStream) {
        let content = '';
        
        await AIEngine.streamChat(this.defaultProvider, request, (chunk) => {
          if (chunk.type === 'text' && !chunk.done) {
            content += chunk.data;
            onStream(chunk.data);
          }
        });

        return this.createMessage(content, 'assistant');
      } else {
        const response = await AIEngine.chat(this.defaultProvider, request);

        return this.createMessage(response.content, 'assistant', {
          model: response.model,
          tokens: response.tokens.total,
          latency: response.latency,
        });
      }
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  /**
   * Analyze content with deep reasoning
   */
  async analyzeContent(
    content: string,
    analysisType: string
  ): Promise<string> {
    const systemPrompt = `You are an expert analyst. Perform a ${analysisType} analysis on the provided content. Be thorough, structured, and insightful.`;

    const request: ChatCompletionRequest = {
      messages: [
        this.createMessage(
          `Please analyze this content:\n\n${content}`,
          'user'
        ),
      ],
      systemPrompt,
      temperature: 0.3, // Lower temperature for analysis
    };

    const response = await AIEngine.chat(this.defaultProvider, request);
    return response.content;
  }

  /**
   * Generate voice-friendly response
   */
  async generateVoiceResponse(
    message: string,
    personality: AIPersonality = 'teacher'
  ): Promise<string> {
    const personalityConfig = AI_PERSONALITIES[personality];
    
    const systemPrompt = `${personalityConfig.systemPrompt}\n\nIMPORTANT: Format your response to be spoken aloud. Use natural speech patterns, avoid special characters, and be conversational.`;

    const request: ChatCompletionRequest = {
      messages: [this.createMessage(message, 'user')],
      systemPrompt,
    };

    const response = await AIEngine.chat(this.defaultProvider, request);
    return response.content;
  }

  /**
   * Create a formatted message
   */
  private createMessage(
    content: string,
    role: 'user' | 'assistant',
    metadata?: Record<string, unknown>
  ): Message {
    return {
      id: `msg-${Date.now()}-${Math.random()}`,
      role,
      content,
      type: 'text',
      metadata: metadata || {},
      timestamp: new Date(),
    };
  }
}

// Export singleton instance
export const chatService = new ChatService();
