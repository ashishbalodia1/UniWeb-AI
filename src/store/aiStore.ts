/**
 * AI Store - Manages AI conversation state, messages, and interactions
 * Central store for all AI-related state
 */

import { create } from 'zustand';
import { Message, Conversation, AIPersonality } from '@/types';
import { nanoid } from 'nanoid';

interface AIState {
  // AI Status
  status: 'idle' | 'thinking' | 'speaking' | 'listening' | 'analyzing' | 'error';
  currentTask?: string;
  progress?: number;
  error?: string;

  // Conversations
  conversations: Conversation[];
  activeConversationId?: string;
  messages: Message[];

  // Personality
  currentPersonality: AIPersonality;

  // Actions
  setStatus: (
    status: AIState['status'],
    task?: string,
    progress?: number
  ) => void;
  setError: (error: string) => void;
  clearError: () => void;

  // Message actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;

  // Conversation actions
  createConversation: () => string;
  setActiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;

  // Personality
  setPersonality: (personality: AIPersonality) => void;

  // Streaming
  appendToLastMessage: (content: string) => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  // Initial state
  status: 'idle',
  conversations: [],
  messages: [],
  currentPersonality: 'teacher',

  // Status actions
  setStatus: (status, task, progress) =>
    set({ status, currentTask: task, progress }),

  setError: (error) => set({ status: 'error', error }),

  clearError: () => set({ status: 'idle', error: undefined }),

  // Message actions
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: nanoid(),
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),

  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    })),

  clearMessages: () => set({ messages: [] }),

  // Conversation actions
  createConversation: () => {
    const id = nanoid();
    const newConversation: Conversation = {
      id,
      userId: 'user-1', // TODO: Get from auth
      title: 'New Conversation',
      mode: get().currentPersonality === 'ceo' ? 'focus' : 'general',
      messages: [],
      context: {
        longTermMemory: [],
        recentTopics: [],
        userGoals: [],
        keyInsights: [],
      },
      metadata: {
        totalMessages: 0,
        totalTokens: 0,
        averageLatency: 0,
        tags: [],
        starred: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      conversations: [...state.conversations, newConversation],
      activeConversationId: id,
    }));

    return id;
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((conv) => conv.id !== id),
      activeConversationId:
        state.activeConversationId === id ? undefined : state.activeConversationId,
    })),

  // Personality
  setPersonality: (personality) => set({ currentPersonality: personality }),

  // Streaming support
  appendToLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content += content;
      }
      return { messages };
    }),
}));
