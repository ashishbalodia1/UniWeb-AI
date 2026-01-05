'use client';

import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import {
  MessageSquare,
  Settings,
  History,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Sidebar - Elegant collapsible navigation
 * Premium feel with smooth animations
 */
export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, currentMode } = useUIStore();

  const menuItems = [
    { icon: MessageSquare, label: 'Chat', active: true },
    { icon: Sparkles, label: 'Analysis', active: false },
    { icon: History, label: 'History', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarOpen ? 280 : 72,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass relative z-10 flex flex-col border-r border-neutral-200/50 p-4"
    >
      {/* Logo / Brand */}
      <div className="mb-8 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {sidebarOpen ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-900">UniWeb AI</h1>
                <p className="text-xs text-neutral-500">Premium Platform</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="logo-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600"
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* New Chat Button */}
      <button className="btn-primary mb-6 flex items-center justify-center gap-2">
        <Plus className="h-5 w-5" />
        {sidebarOpen && <span>New Chat</span>}
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              item.active
                ? 'bg-primary-50 text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* User Profile (Bottom) */}
      <div className="mt-4 border-t border-neutral-200 pt-4">
        <div className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-neutral-100">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-sm font-bold text-white">
            U
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-semibold text-neutral-900">User</p>
                <p className="text-xs text-neutral-500">Premium Account</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
