/**
 * Centralized configuration for UniWeb AI Platform
 * All app-wide constants and settings
 */

import { PersonalityConfig, WorkspaceModeConfig } from '@/types';

// ==================== APP CONFIG ====================

export const APP_CONFIG = {
  name: 'UniWeb AI',
  version: '1.0.0',
  description: 'Enterprise-grade all-in-one AI platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
} as const;

// ==================== FEATURE FLAGS ====================

export const FEATURES = {
  voice: process.env.FEATURE_VOICE_ENABLED === 'true',
  avatar: process.env.FEATURE_AVATAR_ENABLED === 'true',
  analytics: process.env.FEATURE_ANALYTICS_ENABLED === 'true',
  offlineMode: false, // Future feature
  multimodalInput: true,
  realtimeCollaboration: false, // Future feature
} as const;

// ==================== AI PERSONALITIES ====================

export const AI_PERSONALITIES: Record<string, PersonalityConfig> = {
  ceo: {
    id: 'ceo',
    name: 'CEO Advisor',
    description: 'Strategic, decisive, business-focused. Thinks in frameworks and ROI.',
    systemPrompt:
      'You are a seasoned CEO and strategic advisor. Focus on business impact, ROI, and actionable strategies. Be direct, data-driven, and solution-oriented.',
    tone: 'professional',
    creativity: 0.3,
    formality: 0.8,
  },
  teacher: {
    id: 'teacher',
    name: 'Expert Teacher',
    description: 'Patient, clear, educational. Breaks down complex topics simply.',
    systemPrompt:
      'You are an expert teacher who explains complex topics clearly. Use analogies, examples, and step-by-step breakdowns. Adapt to the learner\'s level.',
    tone: 'casual',
    creativity: 0.5,
    formality: 0.5,
  },
  therapist: {
    id: 'therapist',
    name: 'Empathetic Counselor',
    description: 'Warm, understanding, supportive. Helps process thoughts and emotions.',
    systemPrompt:
      'You are a compassionate counselor. Listen actively, validate feelings, ask thoughtful questions, and provide supportive guidance.',
    tone: 'empathetic',
    creativity: 0.6,
    formality: 0.4,
  },
  developer: {
    id: 'developer',
    name: 'Senior Developer',
    description: 'Technical, precise, code-focused. Thinks in architecture and best practices.',
    systemPrompt:
      'You are a senior software engineer. Provide clean, efficient code with best practices. Explain technical concepts clearly and consider scalability.',
    tone: 'professional',
    creativity: 0.4,
    formality: 0.6,
  },
  marketer: {
    id: 'marketer',
    name: 'Creative Marketer',
    description: 'Persuasive, creative, audience-focused. Crafts compelling narratives.',
    systemPrompt:
      'You are a creative marketing expert. Focus on storytelling, audience psychology, and compelling messaging. Be persuasive yet authentic.',
    tone: 'creative',
    creativity: 0.8,
    formality: 0.5,
  },
  poet: {
    id: 'poet',
    name: 'Creative Poet',
    description: 'Artistic, expressive, metaphorical. Finds beauty in language.',
    systemPrompt:
      'You are a creative poet and wordsmith. Use vivid imagery, metaphors, and emotional resonance. Express ideas beautifully and artistically.',
    tone: 'creative',
    creativity: 0.9,
    formality: 0.3,
  },
  scientist: {
    id: 'scientist',
    name: 'Research Scientist',
    description: 'Analytical, evidence-based, methodical. Seeks truth through research.',
    systemPrompt:
      'You are a research scientist. Be rigorous, cite evidence, think critically, and explain methodology. Focus on accuracy and verifiability.',
    tone: 'analytical',
    creativity: 0.3,
    formality: 0.9,
  },
};

// ==================== WORKSPACE MODES ====================

export const WORKSPACE_MODES: Record<string, WorkspaceModeConfig> = {
  focus: {
    id: 'focus',
    name: 'Focus Mode',
    description: 'Minimal distractions, quick responses, action-oriented.',
    features: ['quick-chat', 'voice-commands', 'minimal-ui'],
    uiLayout: 'minimal',
    defaultPersonality: 'ceo',
  },
  creative: {
    id: 'creative',
    name: 'Creative Mode',
    description: 'Brainstorming, ideation, creative exploration.',
    features: ['brainstorming', 'mind-maps', 'idea-generation', 'avatar-visible'],
    uiLayout: 'standard',
    defaultPersonality: 'marketer',
  },
  research: {
    id: 'research',
    name: 'Deep Research',
    description: 'Comprehensive analysis, source verification, deep insights.',
    features: ['multi-source-research', 'citations', 'visualizations', 'export-options'],
    uiLayout: 'expanded',
    defaultPersonality: 'scientist',
  },
  general: {
    id: 'general',
    name: 'General',
    description: 'Balanced mode for everyday conversations.',
    features: ['chat', 'voice', 'avatar', 'basic-analysis'],
    uiLayout: 'standard',
    defaultPersonality: 'teacher',
  },
};

// ==================== AI MODELS ====================

export const DEFAULT_MODELS = {
  llm: {
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    fallback: 'gpt-3.5-turbo',
  },
  tts: {
    provider: 'elevenlabs',
    voice: 'professional-male',
  },
  stt: {
    provider: 'openai',
    model: 'whisper-1',
  },
  vision: {
    provider: 'openai',
    model: 'gpt-4-vision-preview',
  },
} as const;

// ==================== UI CONSTANTS ====================

export const UI_CONSTANTS = {
  sidebarWidth: {
    collapsed: 60,
    expanded: 280,
  },
  avatarSize: {
    small: 80,
    medium: 120,
    large: 180,
  },
  maxMessageLength: 4000,
  streamingDelay: 20, // ms between chunks
  animationDuration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
} as const;

// ==================== PERFORMANCE ====================

export const PERFORMANCE_CONFIG = {
  messageLoadBatchSize: 50,
  virtualScrollThreshold: 100,
  debounceDelay: 300,
  maxConcurrentRequests: 3,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
} as const;

// ==================== VOICE SETTINGS ====================

export const VOICE_DEFAULTS = {
  speed: 1.0,
  pitch: 1.0,
  volume: 1.0,
  emotion: 'neutral' as const,
  language: 'en-US',
  autoPlay: false,
  noiseSuppressionEnabled: true,
};

// ==================== ANALYTICS ====================

export const ANALYTICS_EVENTS = {
  MESSAGE_SENT: 'message_sent',
  VOICE_USED: 'voice_used',
  AVATAR_INTERACTION: 'avatar_interaction',
  MODE_SWITCHED: 'mode_switched',
  PERSONALITY_CHANGED: 'personality_changed',
  ANALYSIS_REQUESTED: 'analysis_requested',
  EXPORT_GENERATED: 'export_generated',
} as const;

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your connection.',
  API_ERROR: 'AI service temporarily unavailable. Please try again.',
  VOICE_ERROR: 'Voice generation failed. Check your audio settings.',
  AVATAR_ERROR: 'Avatar rendering failed. Try refreshing the page.',
  AUTH_ERROR: 'Authentication failed. Please sign in again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  GENERIC: 'Something went wrong. Please try again.',
} as const;

// ==================== ROUTES ====================

export const ROUTES = {
  home: '/',
  chat: '/chat',
  settings: '/settings',
  history: '/history',
  analytics: '/analytics',
} as const;
