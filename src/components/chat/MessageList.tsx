'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

/**
 * MessageList - Scrollable message display with animations
 * Premium message bubbles with smooth transitions
 */
export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Assistant Avatar */}
              {message.role === 'assistant' && (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[80%] ${
                  message.role === 'user' ? 'order-first' : ''
                }`}
              >
                <div
                  className={`${
                    message.role === 'user'
                      ? 'message-user'
                      : 'message-assistant'
                  } whitespace-pre-wrap break-words`}
                >
                  {message.content}
                </div>

                {/* Message Actions */}
                <div
                  className={`absolute top-full mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 ${
                    message.role === 'user' ? 'right-0' : 'left-0'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <>
                      <button
                        className="rounded-lg bg-white p-2 text-neutral-500 shadow-sm transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                        aria-label="Copy message"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg bg-white p-2 text-neutral-500 shadow-sm transition-colors hover:bg-neutral-100 hover:text-green-600"
                        aria-label="Good response"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg bg-white p-2 text-neutral-500 shadow-sm transition-colors hover:bg-neutral-100 hover:text-red-600"
                        aria-label="Bad response"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Metadata */}
                {message.metadata && (
                  <div className="mt-1 text-xs text-neutral-400">
                    {message.metadata.latency && `${message.metadata.latency}ms`}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {message.role === 'user' && (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
