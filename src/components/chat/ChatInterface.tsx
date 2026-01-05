'use client';

import { useState, useRef, useEffect } from 'react';
import { useAIStore } from '@/store/aiStore';
import { Send, Paperclip, Mic, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';

/**
 * ChatInterface - Main conversation UI
 * Handles message input, display, and interactions
 */
export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, addMessage, status, setStatus } = useAIStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      role: 'user',
      content: input.trim(),
      type: 'text',
      metadata: {},
    });

    const userMessage = input.trim();
    setInput('');

    // Simulate AI response
    setStatus('thinking', 'Processing your request...');

    // TODO: Replace with actual AI API call
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: `I received your message: "${userMessage}". This is a placeholder response. The AI engine will be connected next.`,
        type: 'text',
        metadata: {
          model: 'gpt-4-turbo',
          latency: 1200,
        },
      });
      setStatus('idle');
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-500 shadow-lg">
                  <span className="text-3xl">✨</span>
                </div>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-neutral-900">
                Welcome to UniWeb AI
              </h2>
              <p className="text-neutral-600">
                Start a conversation with the most advanced AI assistant
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <button className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-neutral-700 shadow-md transition-all hover:shadow-lg">
                  Ask a question
                </button>
                <button className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-neutral-700 shadow-md transition-all hover:shadow-lg">
                  Analyze document
                </button>
                <button className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-neutral-700 shadow-md transition-all hover:shadow-lg">
                  Research topic
                </button>
              </div>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      {/* Typing Indicator */}
      <AnimatePresence>
        {status === 'thinking' && <TypingIndicator />}
      </AnimatePresence>

      {/* Input Area */}
      <div className="glass border-t border-neutral-200/50 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="relative flex items-end gap-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-neutral-200 transition-all focus-within:ring-2 focus-within:ring-primary-500">
            {/* Attachment Button */}
            <button
              className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message UniWeb AI..."
              className="max-h-32 flex-1 resize-none bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              rows={1}
            />

            {/* Voice Input Button */}
            <motion.button
              onClick={toggleRecording}
              className={`rounded-lg p-2 transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
              animate={{ scale: isRecording ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </motion.button>

            {/* Send Button */}
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || status === 'thinking'}
              className="rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 p-3 text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Help Text */}
          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>⌘K for commands</span>
          </div>
        </div>
      </div>
    </div>
  );
}
