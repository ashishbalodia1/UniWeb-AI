'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIStore } from '@/store/aiStore';
import { useUIStore } from '@/store/uiStore';
import { X, Minimize2, Maximize2 } from 'lucide-react';

/**
 * AvatarAssistant - Floating AI avatar with animations
 * Premium WebGL-ready scaffold for future 3D avatars
 */
export default function AvatarAssistant() {
  const { avatarVisible, toggleAvatar } = useUIStore();
  const { status } = useAIStore();
  const [minimized, setMinimized] = useState(false);

  const getAvatarAnimation = () => {
    switch (status) {
      case 'thinking':
        return 'animate-thinking';
      case 'speaking':
        return 'avatar-speaking';
      case 'listening':
        return 'animate-pulse-slow';
      default:
        return '';
    }
  };

  const getAvatarEmoji = () => {
    switch (status) {
      case 'thinking':
        return '🤔';
      case 'speaking':
        return '😊';
      case 'listening':
        return '👂';
      case 'analyzing':
        return '🔍';
      default:
        return '✨';
    }
  };

  if (!avatarVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <div className="relative">
          {/* Avatar Container */}
          <motion.div
            className={`glass overflow-hidden rounded-3xl shadow-2xl ${
              minimized ? 'h-20 w-20' : 'h-80 w-64'
            } transition-all duration-300`}
          >
            {!minimized && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200/50 p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-neutral-700">AI Assistant</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setMinimized(true)}
                      className="rounded-lg p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={toggleAvatar}
                      className="rounded-lg p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Avatar Visual */}
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
                  <motion.div
                    className={`relative ${getAvatarAnimation()}`}
                    animate={{
                      scale: status === 'speaking' ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: status === 'speaking' ? Infinity : 0,
                    }}
                  >
                    {/* Placeholder Avatar - Replace with 3D model */}
                    <div className="relative h-32 w-32">
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 opacity-30 blur-xl" />
                      
                      {/* Avatar circle */}
                      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-600 text-6xl shadow-2xl">
                        {getAvatarEmoji()}
                      </div>

                      {/* Status indicator */}
                      {status !== 'idle' && (
                        <motion.div
                          className="absolute -bottom-2 -right-2 rounded-full bg-white p-2 shadow-lg"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <div className="h-3 w-3 rounded-full bg-primary-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Status Text */}
                <div className="p-4 text-center">
                  <p className="text-sm font-medium text-neutral-700">
                    {status === 'idle' && 'Ready to help'}
                    {status === 'thinking' && 'Thinking...'}
                    {status === 'speaking' && 'Speaking...'}
                    {status === 'listening' && 'Listening...'}
                    {status === 'analyzing' && 'Analyzing...'}
                  </p>
                </div>
              </>
            )}

            {minimized && (
              <button
                onClick={() => setMinimized(false)}
                className="flex h-full w-full items-center justify-center"
              >
                <motion.span
                  className="text-4xl"
                  animate={{
                    scale: status === 'speaking' ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: status === 'speaking' ? Infinity : 0,
                  }}
                >
                  {getAvatarEmoji()}
                </motion.span>
              </button>
            )}
          </motion.div>

          {/* Tooltip for minimized state */}
          {minimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -left-32 top-1/2 -translate-y-1/2 rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg"
            >
              AI Assistant
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
