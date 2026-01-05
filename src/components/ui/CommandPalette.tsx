'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { Search, Command, X } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  action: () => void;
  shortcut?: string;
}

/**
 * CommandPalette - Power user feature for quick actions
 * Inspired by VS Code and Spotlight
 */
export default function CommandPalette() {
  const { toggleCommandPalette } = useUIStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      action: () => console.log('New chat'),
      shortcut: '⌘N',
    },
    {
      id: 'clear-chat',
      label: 'Clear Chat',
      description: 'Clear current conversation',
      action: () => console.log('Clear chat'),
      shortcut: '⌘K',
    },
    {
      id: 'toggle-voice',
      label: 'Toggle Voice',
      description: 'Enable/disable voice features',
      action: () => console.log('Toggle voice'),
      shortcut: '⌘V',
    },
    {
      id: 'toggle-avatar',
      label: 'Toggle Avatar',
      description: 'Show/hide AI avatar',
      action: () => console.log('Toggle avatar'),
      shortcut: '⌘A',
    },
    {
      id: 'settings',
      label: 'Open Settings',
      description: 'Configure preferences',
      action: () => console.log('Settings'),
      shortcut: '⌘,',
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleCommandPalette();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          toggleCommandPalette();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredCommands, toggleCommandPalette]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-32 backdrop-blur-sm"
        onClick={toggleCommandPalette}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-neutral-200/50 p-4">
            <Search className="h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search commands..."
              className="flex-1 bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              autoFocus
            />
            <button onClick={toggleCommandPalette} className="text-neutral-400 hover:text-neutral-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center text-neutral-500">No commands found</div>
            ) : (
              filteredCommands.map((command, index) => (
                <motion.button
                  key={command.id}
                  onClick={() => {
                    command.action();
                    toggleCommandPalette();
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                    index === selectedIndex
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <Command className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{command.label}</div>
                      <div className="text-xs text-neutral-500">{command.description}</div>
                    </div>
                  </div>
                  {command.shortcut && (
                    <kbd className="rounded bg-neutral-200 px-2 py-1 text-xs font-mono">
                      {command.shortcut}
                    </kbd>
                  )}
                </motion.button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200/50 p-3">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Use ↑↓ to navigate</span>
              <span>Press Enter to select</span>
              <span>ESC to close</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
