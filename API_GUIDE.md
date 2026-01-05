# API Integration Guide

## Overview

This guide explains how to integrate AI providers, voice services, and other APIs into UniWeb AI.

## Table of Contents

1. [AI Providers](#ai-providers)
2. [Voice Services](#voice-services)
3. [Avatar Services](#avatar-services)
4. [Environment Setup](#environment-setup)
5. [Custom Providers](#custom-providers)

---

## AI Providers

### OpenAI Integration

**1. Get API Key:**
- Visit [OpenAI Platform](https://platform.openai.com/)
- Create account and generate API key
- Set usage limits to control costs

**2. Configuration:**
```bash
# .env
OPENAI_API_KEY=sk-proj-...
```

**3. Initialize:**
```typescript
// In your app initialization
AIEngine.initialize({
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
  }
});
```

**4. Models Available:**
- `gpt-4-turbo-preview` - Most capable (128K context)
- `gpt-4` - High quality (8K context)
- `gpt-3.5-turbo` - Fast and affordable (16K context)
- `gpt-4-vision-preview` - Image understanding

**5. Cost Optimization:**
- Use gpt-3.5-turbo for simple tasks
- Implement token counting
- Set max_tokens limits
- Cache common responses

### Anthropic (Claude) Integration

**1. Get API Key:**
- Visit [Anthropic Console](https://console.anthropic.com/)
- Request API access
- Generate API key

**2. Configuration:**
```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
```

**3. Initialize:**
```typescript
AIEngine.initialize({
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: 'claude-3-opus-20240229',
  }
});
```

**4. Models:**
- `claude-3-opus` - Most intelligent
- `claude-3-sonnet` - Balanced
- `claude-3-haiku` - Fast and cheap

### Google AI (Gemini) - Coming Soon

```typescript
AIEngine.initialize({
  google: {
    apiKey: process.env.GOOGLE_AI_API_KEY!,
    model: 'gemini-pro',
  }
});
```

---

## Voice Services

### ElevenLabs (Premium TTS)

**1. Setup:**
- Sign up at [ElevenLabs](https://elevenlabs.io/)
- Generate API key from dashboard

**2. Configuration:**
```bash
# .env
ELEVEN_LABS_API_KEY=...
```

**3. Initialize:**
```typescript
VoiceEngine.initialize({
  elevenLabsKey: process.env.ELEVEN_LABS_API_KEY,
});
```

**4. Features:**
- Ultra-realistic voices
- Emotion control
- Voice cloning (with consent)
- Multi-language support

**5. Usage:**
```typescript
const response = await VoiceEngine.textToSpeech(
  'Hello, I am your AI assistant',
  {
    id: 'voice-id',
    provider: 'elevenlabs',
    // ... voice profile
  },
  settings
);
```

### Azure Speech Services

**1. Setup:**
- Create Azure account
- Create Speech resource
- Get key and region

**2. Configuration:**
```bash
# .env
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=eastus
```

**3. Features:**
- High-quality TTS
- Real-time STT
- Neural voices
- Custom voice training

### OpenAI TTS & Whisper

**1. Already configured** with OpenAI API key

**2. TTS Usage:**
```typescript
// Automatic with OpenAI provider
const audio = await VoiceEngine.textToSpeech(text, {
  provider: 'openai',
  voice: 'alloy', // or nova, shimmer, etc.
});
```

**3. STT (Whisper) Usage:**
```typescript
const result = await VoiceEngine.speechToText(audioBlob);
console.log(result.text);
```

**4. Voices:**
- `alloy` - Neutral
- `echo` - Male, clear
- `fable` - British accent
- `onyx` - Deep male
- `nova` - Warm female
- `shimmer` - Bright female

### Browser Web Speech API (Free)

**1. No setup required** - works offline

**2. Features:**
- Built into modern browsers
- Free and offline-capable
- Decent quality for basic use

**3. Limitations:**
- Voice quality lower than premium services
- Limited voice options
- Browser-dependent

---

## Avatar Services

### D-ID (Video Avatars) - Future Integration

```bash
# .env
D_ID_API_KEY=...
```

### Synthesia - Future Integration

```bash
# .env
SYNTHESIA_API_KEY=...
```

### Three.js (Custom 3D) - Current Scaffold

- No API key needed
- Load custom 3D models (.glb, .gltf)
- Animate with Blendshapes
- Full control over appearance

---

## Environment Setup

### Development

**1. Copy environment template:**
```bash
cp .env.example .env
```

**2. Add your API keys:**
```bash
# Required for full functionality
OPENAI_API_KEY=sk-...
ELEVEN_LABS_API_KEY=...

# Optional
ANTHROPIC_API_KEY=sk-ant-...
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=eastus
```

**3. Feature flags:**
```bash
# Enable/disable features
FEATURE_VOICE_ENABLED=true
FEATURE_AVATAR_ENABLED=true
FEATURE_ANALYTICS_ENABLED=false
```

### Production

**1. Use secure environment variables:**
- Never commit `.env` to git
- Use platform-specific secrets management
  - Vercel: Environment Variables
  - AWS: Secrets Manager
  - Azure: Key Vault

**2. Rotate keys regularly:**
- Set up key rotation schedule
- Monitor for suspicious activity
- Use separate keys for dev/prod

---

## Custom Providers

### Adding a New AI Provider

**1. Extend the base class:**
```typescript
// src/lib/ai/providers/custom.ts
import { AIProvider, ChatCompletionRequest, ChatCompletionResponse } from '../engine';

export class CustomAIProvider extends AIProvider {
  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    // Your implementation
    const response = await fetch('https://your-api.com/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        messages: request.messages,
        // ... other params
      }),
    });
    
    const data = await response.json();
    
    return {
      content: data.message,
      model: 'custom-model',
      tokens: data.usage,
      latency: 0,
    };
  }

  async streamChat(...) {
    // Streaming implementation
  }

  async getModels() {
    return [/* your models */];
  }
}
```

**2. Register in factory:**
```typescript
// src/lib/ai/engine.ts
private static createProvider(name: string, config: AIProviderConfig) {
  switch (name.toLowerCase()) {
    case 'openai':
      return new OpenAIProvider(config);
    case 'anthropic':
      return new AnthropicProvider(config);
    case 'custom':
      return new CustomAIProvider(config); // Add this
    default:
      return null;
  }
}
```

**3. Initialize:**
```typescript
AIEngine.initialize({
  custom: {
    apiKey: process.env.CUSTOM_API_KEY!,
    model: 'custom-model-v1',
  }
});
```

### Adding a New Voice Provider

Similar process:

```typescript
// src/lib/voice/providers/custom.ts
export class CustomVoiceProvider extends VoiceProvider {
  async textToSpeech(request: TTSRequest): Promise<TTSResponse> {
    // Implementation
  }

  async speechToText(request: STTRequest): Promise<STTResponse> {
    // Implementation
  }

  async getVoices(): Promise<VoiceProfile[]> {
    // Implementation
  }
}
```

---

## Rate Limiting & Cost Management

### OpenAI
- Default: 3,500 requests/minute
- Set `max_tokens` to control cost
- Monitor usage in dashboard

### ElevenLabs
- Free tier: 10,000 characters/month
- Pro: 30,000 characters/month
- Cache audio responses when possible

### Best Practices
1. Implement client-side caching
2. Debounce user inputs
3. Set maximum message lengths
4. Use cheaper models for simple tasks
5. Monitor usage with analytics

---

## Error Handling

### API Errors

```typescript
try {
  const response = await AIEngine.chat('openai', request);
} catch (error) {
  if (error.code === 'rate_limit_exceeded') {
    // Wait and retry
  } else if (error.code === 'invalid_api_key') {
    // Show configuration error
  } else {
    // Generic fallback
  }
}
```

### Fallback Strategy

```typescript
// Try primary provider
try {
  return await AIEngine.chat('openai', request);
} catch (error) {
  // Fallback to secondary
  console.warn('Primary provider failed, using fallback');
  return await AIEngine.chat('anthropic', request);
}
```

---

## Testing API Integration

### Test OpenAI Connection

```typescript
// test/api.test.ts
describe('OpenAI Integration', () => {
  it('should complete chat request', async () => {
    const response = await AIEngine.chat('openai', {
      messages: [{ role: 'user', content: 'Hello' }],
    });
    
    expect(response.content).toBeDefined();
    expect(response.tokens.total).toBeGreaterThan(0);
  });
});
```

### Test Voice Synthesis

```typescript
describe('Voice Integration', () => {
  it('should generate audio', async () => {
    const response = await VoiceEngine.textToSpeech(
      'Test',
      voiceProfile,
      settings
    );
    
    expect(response.audioBlob).toBeDefined();
  });
});
```

---

## Troubleshooting

### Common Issues

**1. "Invalid API Key"**
- Check `.env` file exists
- Verify key is correct (no extra spaces)
- Ensure key has proper permissions

**2. "Rate Limit Exceeded"**
- Implement exponential backoff
- Reduce request frequency
- Upgrade API tier

**3. "Network Error"**
- Check internet connection
- Verify API endpoint URLs
- Check CORS settings (if using proxy)

**4. "Context Length Exceeded"**
- Reduce message history
- Implement conversation trimming
- Use models with larger context windows

---

## Security Best Practices

1. **Never expose API keys** in client-side code
2. **Use environment variables** for all secrets
3. **Implement rate limiting** on client side
4. **Validate all inputs** before sending to APIs
5. **Monitor usage** for unusual activity
6. **Rotate keys** regularly
7. **Use HTTPS** for all API calls

---

## Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude Documentation](https://docs.anthropic.com/)
- [ElevenLabs API Docs](https://docs.elevenlabs.io/)
- [Azure Speech Documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/)

---

**Questions?** Open an issue on GitHub or contact support@uniweb-ai.com
