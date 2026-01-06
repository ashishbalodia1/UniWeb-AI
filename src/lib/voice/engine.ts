/**
 * Voice Engine - Text-to-Speech and Speech-to-Text integration
 * Supports multiple providers: ElevenLabs, Azure, Browser Web Speech API
 * Now with proper API route integration
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
  useBrowserTTS?: boolean;
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
 * Voice Engine - Main API
 */
export class VoiceEngine {
  private static currentAudio: HTMLAudioElement | null = null;

  /**
   * Text-to-Speech using API route
   */
  static async textToSpeech(
    text: string,
    voice: VoiceProfile,
    settings: VoiceSettings
  ): Promise<TTSResponse> {
    try {
      // Call TTS API route
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: voice.id,
          settings: {
            rate: settings.speed,
            pitch: settings.pitch,
            volume: settings.volume,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      
      // Check if response is audio or JSON
      if (contentType?.includes('audio')) {
        // Got audio from external TTS service
        const audioBlob = await response.blob();
        return {
          audioBlob,
          duration: 0,
          format: 'mp3',
        };
      } else {
        // Got instruction to use browser TTS
        const data = await response.json();
        if (data.useBrowserTTS) {
          return {
            duration: 0,
            format: 'wav',
            useBrowserTTS: true,
          };
        }
        throw new Error('Invalid TTS response');
      }
    } catch (error) {
      console.error('[VoiceEngine] TTS error:', error);
      // Fallback to browser TTS
      return {
        duration: 0,
        format: 'wav',
        useBrowserTTS: true,
      };
    }
  }

  /**
   * Play audio from blob or use browser TTS
   */
  static async playAudio(response: TTSResponse, text?: string): Promise<void> {
    // Stop any currently playing audio
    this.stopAudio();

    if (response.useBrowserTTS && text) {
      // Use browser Web Speech API
      return this.playBrowserTTS(text);
    }

    if (response.audioBlob) {
      // Play audio blob
      const audioUrl = URL.createObjectURL(response.audioBlob);
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve();
        };
        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          reject(error);
        };
        audio.play().catch(reject);
      });
    }

    throw new Error('No audio to play');
  }

  /**
   * Play text using browser Web Speech API
   */
  private static playBrowserTTS(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Browser TTS not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(event.error));

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Stop currently playing audio
   */
  static stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Speech-to-Text using browser Web Speech API
   */
  static async speechToText(audioBlob: Blob, language: string = 'en-US'): Promise<STTResponse> {
    return new Promise((resolve, reject) => {
      // Check browser support
      const windowWithSpeech = window as typeof window & {
        SpeechRecognition?: new () => SpeechRecognitionInterface;
        webkitSpeechRecognition?: new () => SpeechRecognitionInterface;
      };
      
      const SpeechRecognition = 
        windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject(new Error('Speech recognition not supported in this browser'));
        return;
      }

      const recognition = new SpeechRecognition() as SpeechRecognitionInterface;
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const result = event.results[0][0];
        resolve({
          text: result.transcript,
          confidence: result.confidence,
          language,
        });
      };

      recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.start();
    });
  }

  /**
   * Get available voices
   */
  static getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!('speechSynthesis' in window)) {
      return [];
    }
    return window.speechSynthesis.getVoices();
  }
}
