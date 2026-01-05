'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandPalette from '../ui/CommandPalette';
import { useUIStore } from '@/store/uiStore';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout - Premium single-pane layout
 * Glassmorphism design with smooth transitions
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const { commandPaletteOpen } = useUIStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-neutral-50 via-primary-50/20 to-accent-50/20">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="relative flex-1 overflow-hidden">
          <div className="h-full w-full">{children}</div>
        </main>
      </div>

      {/* Command Palette - Power User Feature */}
      {commandPaletteOpen && <CommandPalette />}

      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute right-0 top-0 h-96 w-96 animate-pulse-slow rounded-full bg-primary-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 animate-pulse-slow rounded-full bg-accent-400/10 blur-3xl animation-delay-1000" />
      </div>
    </div>
  );
}
