/**
 * UI Store - Global UI state management with Zustand
 * Handles sidebar, modals, themes, and workspace modes
 */

import { create } from 'zustand';
import { WorkspaceMode } from '@/types';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Command Palette
  commandPaletteOpen: boolean;
  toggleCommandPalette: () => void;

  // Avatar
  avatarVisible: boolean;
  toggleAvatar: () => void;

  // Workspace Mode
  currentMode: WorkspaceMode;
  setCurrentMode: (mode: WorkspaceMode) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Active Panel
  activePanel: 'chat' | 'analysis' | 'timeline' | 'settings';
  setActivePanel: (panel: 'chat' | 'analysis' | 'timeline' | 'settings') => void;

  // Fullscreen
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  sidebarOpen: true,
  commandPaletteOpen: false,
  avatarVisible: true,
  currentMode: 'general',
  theme: 'light',
  activePanel: 'chat',
  isFullscreen: false,

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  toggleAvatar: () => set((state) => ({ avatarVisible: !state.avatarVisible })),

  setCurrentMode: (mode) => set({ currentMode: mode }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  setActivePanel: (panel) => set({ activePanel: panel }),

  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
}));
