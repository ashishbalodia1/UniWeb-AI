/**
 * AI Engine - Modular abstraction layer for AI providers
 * Supports multiple LLM providers with unified interface
 */

import { Message, AIModel, StreamChunk } from '@/types';

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
}

export interface ChatCompletionRequest {
  messages: Message[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
  systemPrompt?: string;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  latency: number;
  metadata?: Record<string, unknown>;
}

/**
 * Base AI Provider Interface
 * All providers must implement this interface
 */
export abstract class AIProvider {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  abstract chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;

  abstract streamChat(
    request: ChatCompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void>;

  abstract getModels(): Promise<AIModel[]>;
}

/**
 * OpenAI Provider
 */
export class OpenAIProvider extends AIProvider {
  private baseUrl = 'https://api.openai.com/v1';

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || this.config.model,
          messages: this.formatMessages(request),
          temperature: request.temperature ?? this.config.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? this.config.maxTokens ?? 2000,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      return {
        content: data.choices[0].message.content,
        model: data.model,
        tokens: {
          prompt: data.usage.prompt_tokens,
          completion: data.usage.completion_tokens,
          total: data.usage.total_tokens,
        },
        latency,
        metadata: {
          finishReason: data.choices[0].finish_reason,
        },
      };
    } catch (error) {
      console.error('OpenAI chat error:', error);
      throw error;
    }
  }

  async streamChat(
    request: ChatCompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || this.config.model,
          messages: this.formatMessages(request),
          temperature: request.temperature ?? this.config.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? this.config.maxTokens ?? 2000,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let index = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onChunk({ type: 'text', data: '', index, done: true });
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                onChunk({ type: 'text', data: content, index, done: false });
                index++;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('OpenAI stream error:', error);
      throw error;
    }
  }

  async getModels(): Promise<AIModel[]> {
    // Return static list of OpenAI models
    return [
      {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        capabilities: ['text-generation', 'code-generation', 'function-calling', 'streaming'],
        contextWindow: 128000,
        costPer1kTokens: 0.01,
        maxOutputTokens: 4096,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        capabilities: ['text-generation', 'code-generation', 'streaming'],
        contextWindow: 16385,
        costPer1kTokens: 0.001,
        maxOutputTokens: 4096,
      },
    ];
  }

  private formatMessages(request: ChatCompletionRequest) {
    const messages = [...request.messages];
    
    // Add system prompt if provided
    if (request.systemPrompt) {
      messages.unshift({
        id: 'system',
        role: 'system',
        content: request.systemPrompt,
        type: 'text',
        metadata: {},
        timestamp: new Date(),
      });
    }

    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }
}

/**
 * Anthropic Provider (Claude)
 */
export class AnthropicProvider extends AIProvider {
  private baseUrl = 'https://api.anthropic.com/v1';

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: request.model || this.config.model,
          messages: request.messages.map((msg) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content,
          })),
          max_tokens: request.maxTokens ?? this.config.maxTokens ?? 2000,
          temperature: request.temperature ?? this.config.temperature ?? 0.7,
          system: request.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      return {
        content: data.content[0].text,
        model: data.model,
        tokens: {
          prompt: data.usage.input_tokens,
          completion: data.usage.output_tokens,
          total: data.usage.input_tokens + data.usage.output_tokens,
        },
        latency,
      };
    } catch (error) {
      console.error('Anthropic chat error:', error);
      throw error;
    }
  }

  async streamChat(
    request: ChatCompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void> {
    // Similar implementation to OpenAI with Anthropic's streaming format
    throw new Error('Streaming not yet implemented for Anthropic');
  }

  async getModels(): Promise<AIModel[]> {
    return [
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        capabilities: ['text-generation', 'code-generation', 'vision'],
        contextWindow: 200000,
        costPer1kTokens: 0.015,
        maxOutputTokens: 4096,
      },
    ];
  }
}

/**
 * AI Engine Factory
 * Creates provider instances based on configuration
 */
export class AIEngine {
  private static providers: Map<string, AIProvider> = new Map();

  static initialize(configs: Record<string, AIProviderConfig>) {
    for (const [name, config] of Object.entries(configs)) {
      const provider = this.createProvider(name, config);
      if (provider) {
        this.providers.set(name, provider);
      }
    }
  }

  static getProvider(name: string): AIProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} not initialized`);
    }
    return provider;
  }

  private static createProvider(name: string, config: AIProviderConfig): AIProvider | null {
    switch (name.toLowerCase()) {
      case 'openai':
        return new OpenAIProvider(config);
      case 'anthropic':
        return new AnthropicProvider(config);
      default:
        console.warn(`Unknown provider: ${name}`);
        return null;
    }
  }

  static async chat(
    providerName: string,
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const provider = this.getProvider(providerName);
    return provider.chat(request);
  }

  static async streamChat(
    providerName: string,
    request: ChatCompletionRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void> {
    const provider = this.getProvider(providerName);
    return provider.streamChat(request, onChunk);
  }
}
