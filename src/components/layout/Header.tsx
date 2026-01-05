'use client';

import { useUIStore } from '@/store/uiStore';
import { useAIStore } from '@/store/aiStore';
import { WORKSPACE_MODES, AI_PERSONALITIES } from '@/config';
import { Command, Mic, Video, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Header - Status bar with AI state, mode selector, and controls
 * Premium glassmorphism design
 */
export default function Header() {
  const { currentMode, setCurrentMode, toggleCommandPalette } = useUIStore();
  const { status, currentTask } = useAIStore();

  const getStatusIcon = () => {
    switch (status) {
      case 'thinking':
        return <Brain className="h-4 w-4 animate-pulse text-primary-600" />;
      case 'speaking':
        return <Mic className="h-4 w-4 animate-pulse text-accent-600" />;
      case 'analyzing':
        return <Zap className="h-4 w-4 animate-pulse text-yellow-600" />;
      default:
        return <Brain className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getStatusText = () => {
    if (currentTask) return currentTask;
    switch (status) {
      case 'thinking':
        return 'Thinking...';
      case 'speaking':
        return 'Speaking...';
      case 'analyzing':
        return 'Analyzing...';
      default:
        return 'Ready';
    }
  };

  return (
    <header className="glass relative z-10 border-b border-neutral-200/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: AI Status */}
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 shadow-sm"
            animate={{ scale: status !== 'idle' ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 1, repeat: status !== 'idle' ? Infinity : 0 }}
          >
            {getStatusIcon()}
            <span className="text-sm font-medium text-neutral-700">{getStatusText()}</span>
          </motion.div>

          {/* Thinking Dots Animation */}
          {status === 'thinking' && (
            <div className="flex gap-1">
              <div className="thinking-dot h-2 w-2 rounded-full bg-primary-600" />
              <div className="thinking-dot h-2 w-2 rounded-full bg-primary-600" />
              <div className="thinking-dot h-2 w-2 rounded-full bg-primary-600" />
            </div>
          )}
        </div>

        {/* Center: Workspace Mode Selector */}
        <div className="flex items-center gap-2 rounded-xl bg-white/50 p-1 shadow-sm">
          {Object.entries(WORKSPACE_MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => setCurrentMode(mode.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                currentMode === mode.id
                  ? 'bg-white text-primary-700 shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Voice Toggle */}
          <button
            className="rounded-xl bg-white/50 p-3 text-neutral-600 shadow-sm transition-all hover:bg-white hover:text-primary-600 hover:shadow-md"
            aria-label="Toggle voice"
          >
            <Mic className="h-5 w-5" />
          </button>

          {/* Avatar Toggle */}
          <button
            className="rounded-xl bg-white/50 p-3 text-neutral-600 shadow-sm transition-all hover:bg-white hover:text-accent-600 hover:shadow-md"
            aria-label="Toggle avatar"
          >
            <Video className="h-5 w-5" />
          </button>

          {/* Command Palette */}
          <button
            onClick={toggleCommandPalette}
            className="flex items-center gap-2 rounded-xl bg-white/50 px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-white hover:shadow-md"
          >
            <Command className="h-4 w-4" />
            <span className="hidden md:inline">Command</span>
            <kbd className="hidden rounded bg-neutral-200 px-2 py-1 text-xs md:inline">⌘K</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
