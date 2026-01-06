/**
 * AI Engine Initialization
 * Configures and initializes AI providers on server startup
 * This runs server-side only and ensures providers are ready
 */

import { AIEngine, AIProviderConfig } from './engine';

let isInitialized = false;

/**
 * Initialize AI providers with environment configuration
 * Safe to call multiple times - will only initialize once
 */
export function initializeAIEngine(): void {
  if (isInitialized) {
    return;
  }

  const configs: Record<string, AIProviderConfig> = {};

  // OpenAI configuration
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey !== 'your_openai_key_here') {
    configs.openai = {
      apiKey: openaiKey,
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 2000,
    };
  }

  // Anthropic configuration
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey && anthropicKey !== 'your_anthropic_key_here') {
    configs.anthropic = {
      apiKey: anthropicKey,
      model: 'claude-3-opus-20240229',
      temperature: 0.7,
      maxTokens: 2000,
    };
  }

  // Initialize with available providers
  if (Object.keys(configs).length > 0) {
    AIEngine.initialize(configs);
    isInitialized = true;
    console.log('[AI Engine] Initialized with providers:', Object.keys(configs).join(', '));
  } else {
    console.log('[AI Engine] Running in DEMO MODE - No API keys configured');
    console.log('[AI Engine] Add OPENAI_API_KEY to enable real AI responses');
    // Demo mode - will use fallback responses
  }
  
  isInitialized = true;
}

/**
 * Get initialization status
 */
export function isAIEngineInitialized(): boolean {
  return isInitialized;
}

// Auto-initialize if running on server
if (typeof window === 'undefined') {
  initializeAIEngine();
}
