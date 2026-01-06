/**
 * Voice Hook - React hook for voice interactions
 * Manages TTS, STT, and audio playback
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { VoiceEngine } from '@/lib/voice/engine';
import { VoiceProfile, VoiceSettings } from '@/types';
import { VOICE_DEFAULTS } from '@/config';

interface UseVoiceReturn {
  isPlaying: boolean;
  isRecording: boolean;
  transcript: string;
  speak: (text: string, voice?: VoiceProfile) => Promise<void>;
  stopSpeaking: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
}

export function useVoice(settings: VoiceSettings = VOICE_DEFAULTS as VoiceSettings): UseVoiceReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const speak = useCallback(
    async (text: string, voice?: VoiceProfile) => {
      if (!settings.enabled || !text.trim()) return;

      try {
        setIsPlaying(true);

        const voiceProfile = voice || {
          id: 'alloy',
          name: 'Alloy',
          provider: 'browser' as const,
          language: 'en',
          gender: 'neutral' as const,
          style: 'professional' as const,
          isCustom: false,
        };

        const response = await VoiceEngine.textToSpeech(text, voiceProfile, settings);

        if (settings.autoPlay) {
          await VoiceEngine.playAudio(response, text);
        }
      } catch (error) {
        console.error('Speech synthesis error:', error);
        // Try fallback browser TTS
        if ('speechSynthesis' in window && text) {
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        }
      } finally {
        setIsPlaying(false);
      }
    },
    [settings]
  );

  const stopSpeaking = useCallback(() => {
    VoiceEngine.stopAudio();
    setIsPlaying(false);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const result = await VoiceEngine.speechToText(audioBlob, settings.language || 'en-US');
          
          setTranscript(result.text);
          setIsRecording(false);
          
          // Stop all tracks
          mediaRecorder.stream.getTracks().forEach((track) => track.stop());
          
          resolve(result.text);
        } catch (error) {
          console.error('Speech recognition error:', error);
          setIsRecording(false);
          reject(error);
        }
      };

      mediaRecorder.stop();
    });
  }, [settings.language]);

  return {
    isPlaying,
    isRecording,
    transcript,
    speak,
    stopSpeaking,
    startRecording,
    stopRecording,
  };
}
