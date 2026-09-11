import { useCallback, useEffect, useState } from 'react';

export type SpeechLanguage = 'urdu' | 'roman_urdu' | 'english';

function languageCode(language: SpeechLanguage): string {
  return language === 'urdu' ? 'ur-PK' : 'en-US';
}

function cleanSpeechText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_]/g, '')
    .replace(/---/g, '')
    .replace(/\n+/g, '. ')
    .trim();
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => setVoices(window.speechSynthesis.getVoices());
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
  }, []);

  const speak = useCallback((text: string, language: SpeechLanguage) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text.trim()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText(text));
    const preferredPrefix = language === 'urdu' ? 'ur' : 'en';
    const preferredVoice = voices.find(voice => voice.lang.toLowerCase().startsWith(preferredPrefix));
    utterance.voice = preferredVoice || null;
    utterance.lang = preferredVoice?.lang || languageCode(language);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const pause = useCallback(() => {
    window.speechSynthesis?.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis?.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  useEffect(() => stop, [stop]);

  return { isSpeaking, isPaused, speak, pause, resume, stop };
}
