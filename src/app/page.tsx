'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ChatInterface from '@/components/chat/ChatInterface';
import AvatarAssistant from '@/components/avatar/AvatarAssistant';
import WelcomeScreen from '@/components/ui/WelcomeScreen';

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <MainLayout>
      {!hasStarted ? (
        <WelcomeScreen onStart={() => setHasStarted(true)} />
      ) : (
        <>
          <ChatInterface />
          <AvatarAssistant />
        </>
      )}
    </MainLayout>
  );
}
