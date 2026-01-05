/**
 * Voice Engine - Text-to-Speech and Speech-to-Text integration
 * Supports multiple providers: ElevenLabs, Azure, OpenAI
 */

import { VoiceProfile, VoiceSettings } from '@/types';

// Web Speech API type declarations
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionResultItem;
  length: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEventInterface {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventInterface {
  error: string;
  message: string;
}

interface SpeechRecognitionInterface {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventInterface) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventInterface) => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognitionInterface;
  }
}

export interface TTSRequest {
  text: string;
  voice: VoiceProfile;
  settings: VoiceSettings;
}

export interface TTSResponse {
  audioUrl?: string;
  audioBlob?: Blob;
  duration: number;
  format: 'mp3' | 'wav' | 'ogg';
}

export interface STTRequest {
  audioBlob: Blob;
  language?: string;
}

export interface STTResponse {
  text: string;
  confidence: number;
  language: string;
}

/**
 * Base Voice Provider Interface
 */
export abstract class VoiceProvider {
  abstract textToSpeech(request: TTSRequest): Promise<TTSResponse>;
  abstract speechToText(request: STTRequest): Promise<STTResponse>;
  abstract getVoices(): Promise<VoiceProfile[]>;
}

/**
 * ElevenLabs Provider - Premium TTS
 */
export class ElevenLabsProvider extends VoiceProvider {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async textToSpeech(request: TTSRequest): Promise<TTSResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${request.voice.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text: request.text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: request.settings.emotion === 'neutral' ? 0 : 0.5,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();

      return {
        audioBlob,
        duration: 0, // Calculate from audio metadata
        format: 'mp3',
      };
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      throw error;
    }
  }

  async speechToText(request: STTRequest): Promise<STTResponse> {
    // ElevenLabs doesn't provide STT, use OpenAI Whisper instead
    throw new Error('STT not supported by ElevenLabs');
  }

  async getVoices(): Promise<VoiceProfile[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const data = await response.json();

      return data.voices.map((voice: { voice_id: string; name: string }) => ({
        id: voice.voice_id,
        name: voice.name,
        provider: 'elevenlabs' as const,
        language: 'en',
        gender: 'neutral' as const,
        style: 'professional' as const,
        isCustom: false,
      }));
    } catch (error) {
      console.error('ElevenLabs get voices error:', error);
      return [];
    }
  }
}

/**
 * OpenAI Provider - Whisper STT
 */
export class OpenAIVoiceProvider extends VoiceProvider {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async textToSpeech(request: TTSRequest): Promise<TTSResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/audio/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'tts-1-hd',
          input: request.text,
          voice: this.mapVoiceToOpenAI(request.voice.gender),
          speed: request.settings.speed,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI TTS error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();

      return {
        audioBlob,
        duration: 0,
        format: 'mp3',
      };
    } catch (error) {
      console.error('OpenAI TTS error:', error);
      throw error;
    }
  }

  async speechToText(request: STTRequest): Promise<STTResponse> {
    try {
      const formData = new FormData();
      formData.append('file', request.audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      if (request.language) {
        formData.append('language', request.language);
      }

      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`OpenAI STT error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        text: data.text,
        confidence: 1.0, // Whisper doesn't provide confidence scores
        language: request.language || 'en',
      };
    } catch (error) {
      console.error('OpenAI STT error:', error);
      throw error;
    }
  }

  async getVoices(): Promise<VoiceProfile[]> {
    // Return static OpenAI voices
    return [
      {
        id: 'alloy',
        name: 'Alloy',
        provider: 'openai',
        language: 'en',
        gender: 'neutral',
        style: 'professional',
        isCustom: false,
      },
      {
        id: 'nova',
        name: 'Nova',
        provider: 'openai',
        language: 'en',
        gender: 'female',
        style: 'warm',
        isCustom: false,
      },
    ];
  }

  private mapVoiceToOpenAI(gender: string): string {
    const voiceMap: Record<string, string> = {
      male: 'onyx',
      female: 'nova',
      neutral: 'alloy',
    };
    return voiceMap[gender] || 'alloy';
  }
}

/**
 * Browser Web Speech API Provider - Free, offline-capable
 */
export class WebSpeechProvider extends VoiceProvider {
  async textToSpeech(request: TTSRequest): Promise<TTSResponse> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Web Speech API not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(request.text);
      utterance.rate = request.settings.speed;
      utterance.pitch = request.settings.pitch;

      // Find matching voice
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.name === request.voice.name);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        resolve({
          duration: 0,
          format: 'wav',
        });
      };

      utterance.onerror = (error) => {
        reject(error);
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  async speechToText(request: STTRequest): Promise<STTResponse> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window)) {
        reject(new Error('Web Speech Recognition not supported'));
        return;
      }

      // @ts-expect-error - webkit prefix
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = request.language || 'en-US';

      recognition.onresult = (event: SpeechRecognitionEventInterface) => {
        const result = event.results[0][0];
        resolve({
          text: result.transcript,
          confidence: result.confidence,
          language: recognition.lang,
        });
      };

      recognition.onerror = (error: SpeechRecognitionErrorEventInterface) => {
        reject(error);
      };

      recognition.start();
    });
  }

  async getVoices(): Promise<VoiceProfile[]> {
    if (!('speechSynthesis' in window)) {
      return [];
    }

    const voices = window.speechSynthesis.getVoices();

    return voices.map((voice) => ({
      id: voice.name,
      name: voice.name,
      provider: 'browser',
      language: voice.lang,
      gender: 'neutral' as const,
      style: 'professional' as const,
      isCustom: false,
    }));
  }
}

/**
 * Voice Engine - Main interface for voice operations
 */
export class VoiceEngine {
  private static providers: Map<string, VoiceProvider> = new Map();
  private static activeAudio: HTMLAudioElement | null = null;

  static initialize(config: {
    elevenLabsKey?: string;
    openAIKey?: string;
  }) {
    if (config.elevenLabsKey) {
      this.providers.set('elevenlabs', new ElevenLabsProvider(config.elevenLabsKey));
    }

    if (config.openAIKey) {
      this.providers.set('openai', new OpenAIVoiceProvider(config.openAIKey));
    }

    // Always available
    this.providers.set('browser', new WebSpeechProvider());
  }

  static async textToSpeech(
    text: string,
    voice: VoiceProfile,
    settings: VoiceSettings
  ): Promise<TTSResponse> {
    const provider = this.providers.get(voice.provider);
    if (!provider) {
      throw new Error(`Voice provider ${voice.provider} not initialized`);
    }

    return provider.textToSpeech({ text, voice, settings });
  }

  static async playAudio(response: TTSResponse): Promise<void> {
    // Stop any currently playing audio
    this.stopAudio();

    if (!response.audioBlob && !response.audioUrl) {
      throw new Error('No audio data available');
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio();
      this.activeAudio = audio;

      if (response.audioBlob) {
        audio.src = URL.createObjectURL(response.audioBlob);
      } else if (response.audioUrl) {
        audio.src = response.audioUrl;
      }

      audio.onended = () => {
        this.activeAudio = null;
        resolve();
      };

      audio.onerror = (error) => {
        this.activeAudio = null;
        reject(error);
      };

      audio.play().catch(reject);
    });
  }

  static stopAudio(): void {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
  }

  static async speechToText(audioBlob: Blob, language?: string): Promise<STTResponse> {
    // Try OpenAI first, fallback to browser
    const provider = this.providers.get('openai') || this.providers.get('browser');
    if (!provider) {
      throw new Error('No STT provider available');
    }

    return provider.speechToText({ audioBlob, language });
  }

  static async getVoices(providerName?: string): Promise<VoiceProfile[]> {
    if (providerName) {
      const provider = this.providers.get(providerName);
      return provider ? provider.getVoices() : [];
    }

    // Get voices from all providers
    const allVoices: VoiceProfile[] = [];
    for (const provider of this.providers.values()) {
      const voices = await provider.getVoices();
      allVoices.push(...voices);
    }
    return allVoices;
  }
}
