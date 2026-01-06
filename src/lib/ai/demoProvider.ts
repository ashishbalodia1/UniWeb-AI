/**
 * Demo AI Provider - Works without API keys
 * Simulates real AI responses for demonstration
 */

import { Message } from '@/types';

export class DemoAIProvider {
  private responses = [
    "Hello! I'm the UniWeb AI assistant. I'm currently running in demo mode. To enable real AI responses, add your OPENAI_API_KEY to the environment variables.",
    "I understand you're testing the platform. The streaming feature you're seeing is working perfectly! All animations, voice, and avatar features are production-ready.",
    "This is a fully functional AI platform with:\n\n• Real-time streaming chat\n• Voice synthesis\n• Animated avatar\n• Multiple AI personalities\n• Deep analysis mode\n\nJust add your OpenAI API key to unlock real AI intelligence!",
    "Great question! The architecture includes:\n\n1. AI Orchestrator for coordination\n2. Modular provider system\n3. Streaming SSE responses\n4. Complete error handling\n5. Production-ready deployment\n\nEverything is built and ready to go!",
    "I can help with that! The platform supports:\n\n✓ Chat with streaming\n✓ Voice input/output\n✓ Avatar animations\n✓ Dark mode design\n✓ Real-time updates\n\nAdd OPENAI_API_KEY to enable full AI capabilities.",
  ];

  private currentIndex = 0;

  async generateResponse(messages: Message[]): Promise<string> {
    // Simulate thinking delay
    await this.delay(500);

    // Get last user message
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    // Generate contextual response
    if (lastMessage.toLowerCase().includes('hello') || lastMessage.toLowerCase().includes('hi')) {
      return this.responses[0];
    }
    
    if (lastMessage.toLowerCase().includes('test') || lastMessage.toLowerCase().includes('demo')) {
      return this.responses[1];
    }
    
    if (lastMessage.toLowerCase().includes('feature') || lastMessage.toLowerCase().includes('what can')) {
      return this.responses[2];
    }
    
    if (lastMessage.toLowerCase().includes('how') || lastMessage.toLowerCase().includes('architecture')) {
      return this.responses[3];
    }
    
    // Cycle through responses
    const response = this.responses[this.currentIndex % this.responses.length];
    this.currentIndex++;
    
    return response;
  }

  async *streamResponse(messages: Message[]): AsyncGenerator<string> {
    const response = await this.generateResponse(messages);
    const words = response.split(' ');
    
    for (const word of words) {
      yield word + ' ';
      await this.delay(50); // Simulate streaming delay
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const demoProvider = new DemoAIProvider();
