/**
 * Core type definitions for UniWeb AI Platform
 * Enterprise-grade type safety across the entire application
 */

// ==================== USER & SESSION ====================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  metadata: Record<string, unknown>;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  aiPersonality: AIPersonality;
  voiceSettings: VoiceSettings;
  avatarSettings: AvatarSettings;
  privacySettings: PrivacySettings;
}

export interface PrivacySettings {
  saveConversations: boolean;
  allowVoiceCloning: boolean;
  shareAnalytics: boolean;
}

// ==================== AI PERSONALITIES ====================

export type AIPersonality =
  | 'ceo'
  | 'teacher'
  | 'therapist'
  | 'developer'
  | 'marketer'
  | 'poet'
  | 'scientist'
  | 'custom';

export interface PersonalityConfig {
  id: AIPersonality;
  name: string;
  description: string;
  systemPrompt: string;
  tone: 'professional' | 'casual' | 'empathetic' | 'creative' | 'analytical';
  creativity: number; // 0-1
  formality: number; // 0-1
}

// ==================== CONVERSATION ====================

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  mode: WorkspaceMode;
  messages: Message[];
  context: ConversationContext;
  metadata: ConversationMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: MessageType;
  attachments?: Attachment[];
  metadata: MessageMetadata;
  timestamp: Date;
}

export type MessageType = 'text' | 'voice' | 'image' | 'document' | 'code' | 'analysis';

export interface MessageMetadata {
  model?: string;
  tokens?: number;
  latency?: number;
  confidence?: number;
  emotion?: EmotionType;
  thinkingProcess?: string[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface ConversationContext {
  longTermMemory: MemoryEntry[];
  recentTopics: string[];
  userGoals: string[];
  keyInsights: string[];
}

export interface MemoryEntry {
  id: string;
  content: string;
  importance: number; // 0-1
  timestamp: Date;
  references: string[]; // Message IDs
}

export interface ConversationMetadata {
  totalMessages: number;
  totalTokens: number;
  averageLatency: number;
  tags: string[];
  starred: boolean;
}

// ==================== WORKSPACE MODES ====================

export type WorkspaceMode = 'focus' | 'creative' | 'research' | 'general';

export interface WorkspaceModeConfig {
  id: WorkspaceMode;
  name: string;
  description: string;
  features: string[];
  uiLayout: 'minimal' | 'standard' | 'expanded';
  defaultPersonality: AIPersonality;
}

// ==================== VOICE SYSTEM ====================

export interface VoiceSettings {
  enabled: boolean;
  voice: VoiceProfile;
  speed: number; // 0.5 - 2.0
  pitch: number; // 0.5 - 2.0
  volume: number; // 0.0 - 1.0
  emotion: EmotionType;
  language?: string; // Optional override language
  autoPlay: boolean;
  noiseSuppressionEnabled: boolean;
}

export interface VoiceProfile {
  id: string;
  name: string;
  provider: VoiceProvider;
  language: string;
  gender: 'male' | 'female' | 'neutral';
  style: 'professional' | 'warm' | 'authoritative' | 'casual';
  isCustom: boolean;
}

export type VoiceProvider = 'elevenlabs' | 'azure' | 'google' | 'openai' | 'browser' | 'custom';

export type EmotionType =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'excited'
  | 'serious'
  | 'empathetic'
  | 'confident';

export interface VoiceGenerationRequest {
  text: string;
  voice: VoiceProfile;
  settings: VoiceSettings;
  streaming?: boolean;
}

export interface VoiceGenerationResponse {
  audioUrl?: string;
  audioBlob?: Blob;
  duration: number;
  format: 'mp3' | 'wav' | 'ogg';
  streaming?: boolean;
}

// ==================== AVATAR SYSTEM ====================

export interface AvatarSettings {
  enabled: boolean;
  avatar: AvatarProfile;
  position: 'bottom-right' | 'bottom-left' | 'center' | 'floating';
  size: 'small' | 'medium' | 'large';
  showDuringChat: boolean;
  lipSyncEnabled: boolean;
  expressionsEnabled: boolean;
}

export interface AvatarProfile {
  id: string;
  name: string;
  type: '2d' | '3d';
  modelUrl?: string;
  textureUrl?: string;
  thumbnailUrl: string;
  appearance: AvatarAppearance;
  animations: AvatarAnimation[];
  isCustom: boolean;
}

export interface AvatarAppearance {
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'middle' | 'senior';
  ethnicity: string;
  style: 'realistic' | 'stylized' | 'cartoon';
  outfit: string;
}

export interface AvatarAnimation {
  id: string;
  name: string;
  type: 'idle' | 'speaking' | 'listening' | 'thinking' | 'gesture';
  duration: number;
  loop: boolean;
}

export interface AvatarState {
  currentAnimation: string;
  emotion: EmotionType;
  isSpeaking: boolean;
  isListening: boolean;
  eyePosition: { x: number; y: number };
  mouthOpenAmount: number; // 0-1 for lip sync
}

// ==================== AI PROVIDERS ====================

export interface AIProvider {
  id: string;
  name: string;
  type: 'llm' | 'tts' | 'stt' | 'vision' | 'image-generation';
  models: AIModel[];
  config: ProviderConfig;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  capabilities: ModelCapability[];
  contextWindow: number;
  costPer1kTokens: number;
  maxOutputTokens: number;
}

export type ModelCapability =
  | 'text-generation'
  | 'code-generation'
  | 'vision'
  | 'function-calling'
  | 'streaming'
  | 'embeddings';

export interface ProviderConfig {
  apiKey: string;
  endpoint?: string;
  organization?: string;
  customHeaders?: Record<string, string>;
}

// ==================== ANALYSIS ENGINE ====================

export interface AnalysisRequest {
  type: AnalysisType;
  input: string | string[];
  options: AnalysisOptions;
}

export type AnalysisType =
  | 'research'
  | 'summary'
  | 'comparison'
  | 'swot'
  | 'decision-framework'
  | 'sentiment'
  | 'financial'
  | 'strategic';

export interface AnalysisOptions {
  depth: 'brief' | 'standard' | 'comprehensive';
  includeVisuals: boolean;
  includeSources: boolean;
  format: 'text' | 'structured' | 'presentation';
}

export interface AnalysisResult {
  id: string;
  type: AnalysisType;
  summary: string;
  sections: AnalysisSection[];
  visualizations?: Visualization[];
  sources?: Source[];
  confidence: number;
  createdAt: Date;
}

export interface AnalysisSection {
  title: string;
  content: string;
  subsections?: AnalysisSection[];
  metadata?: Record<string, unknown>;
}

export interface Visualization {
  type: 'chart' | 'graph' | 'timeline' | 'mindmap' | 'flowchart';
  data: unknown;
  config: Record<string, unknown>;
}

export interface Source {
  title: string;
  url?: string;
  author?: string;
  date?: Date;
  relevance: number;
}

// ==================== UI STATE ====================

export interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  avatarVisible: boolean;
  currentMode: WorkspaceMode;
  activePanel: 'chat' | 'analysis' | 'timeline' | 'settings';
  theme: 'light' | 'dark';
  isFullscreen: boolean;
}

export interface AIState {
  status: 'idle' | 'thinking' | 'speaking' | 'listening' | 'analyzing' | 'error';
  currentTask?: string;
  progress?: number;
  error?: string;
}

// ==================== API RESPONSES ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: Record<string, unknown>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ==================== STREAMING ====================

export interface StreamChunk {
  type: 'text' | 'audio' | 'metadata';
  data: unknown;
  index: number;
  done: boolean;
}

export interface StreamingMessage {
  id: string;
  content: string;
  isComplete: boolean;
  metadata?: MessageMetadata;
}
