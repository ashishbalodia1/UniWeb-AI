'use client';

import { motion } from 'framer-motion';

/**
 * TypingIndicator - Animated "AI is typing" indicator
 * Premium animation for thinking state
 */
export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="px-6 py-2"
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-md">
            <span className="text-lg">✨</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-white px-6 py-4 shadow-sm">
            <div className="thinking-dot h-2 w-2 rounded-full bg-primary-600" />
            <div className="thinking-dot h-2 w-2 rounded-full bg-primary-600" />
            <div className="thinking-dot h-2 w-2 rounded-full bg-primary-600" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
