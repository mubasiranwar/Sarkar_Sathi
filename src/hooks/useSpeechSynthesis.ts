import { useCallback, useEffect, useRef, useState } from 'react';

export type SpeechLanguage = 'urdu' | 'roman_urdu' | 'english';

function languageCode(language: SpeechLanguage): string {
  return language === 'urdu' || language === 'roman_urdu' ? 'ur-PK' : 'en-US';
}

function cleanSpeechText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[`*_#~>]/g, '')
    .replace(/^\s*[-•]\s+/gm, '')
    .replace(/---/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n+/g, '. ')
    .trim();
}

export function prepareUrduSpeechText(text: string): string {
  return cleanSpeechText(text)
    .replace(/\bBISP\b/gi, 'بے نظیر انکم سپورٹ')
    .replace(/\bNADRA\b/gi, 'نادرا')
    .replace(/\bCNIC\b/gi, 'شناختی کارڈ')
    .replace(/\bPKR\b/gi, 'روپے')
    .replace(/\bSMS\b/gi, 'میسج')
    .replace(/\bQwen\b/gi, 'قوین')
    .trim();
}

function splitSpeechText(text: string, maxLength = 180): string[] {
  const sentences = text.split(/(?<=[۔.!؟?])\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  sentences.forEach(sentence => {
    if ((current + ' ' + sentence).trim().length <= maxLength) {
      current = `${current} ${sentence}`.trim();
    } else {
      if (current) chunks.push(current);
      current = sentence;
    }
  });

  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [text.slice(0, maxLength)];
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const audioTokenRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => setVoices(window.speechSynthesis.getVoices());
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
  }, []);

  const stopAudio = useCallback(() => {
    audioTokenRef.current += 1;
    audioQueueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  }, []);

  const speak = useCallback((text: string, language: SpeechLanguage) => {
    if (typeof window === 'undefined' || !text.trim()) return;

    window.speechSynthesis?.cancel();
    stopAudio();
    const availableVoices = window.speechSynthesis?.getVoices() || [];
    const currentVoices = availableVoices.length > 0 ? availableVoices : voices;
    const preparedText = language === 'urdu' ? prepareUrduSpeechText(text) : cleanSpeechText(text);
    const preferredPrefix = language === 'roman_urdu' ? 'en' : language === 'urdu' ? 'ur' : 'en';
    const preferredVoice = language === 'urdu'
      ? currentVoices.find(voice => /^(ur|ar|pa)([-_]|$)/i.test(voice.lang))
      : currentVoices.find(voice => voice.lang.toLowerCase() === 'en-us' && voice.name.toLowerCase().includes('natural'))
        || currentVoices.find(voice => voice.lang.toLowerCase().startsWith(preferredPrefix));

    if (language === 'urdu' && !preferredVoice) {
      const token = ++audioTokenRef.current;
      audioQueueRef.current = splitSpeechText(preparedText).map(chunk =>
        `https://translate.google.com/translate_tts?ie=UTF-8&tl=ur&client=tw-ob&q=${encodeURIComponent(chunk)}`
      );
      setIsSpeaking(true);
      setIsPaused(false);

      const playNextChunk = () => {
        if (token !== audioTokenRef.current || audioQueueRef.current.length === 0) {
          if (token === audioTokenRef.current) {
            setIsSpeaking(false);
            setIsPaused(false);
          }
          return;
        }

        const audio = new Audio(audioQueueRef.current.shift());
        audioRef.current = audio;
        audio.onended = playNextChunk;
        audio.onerror = () => {
          if (token === audioTokenRef.current) {
            setIsSpeaking(false);
            setIsPaused(false);
          }
        };
        audio.play().catch(() => {
          if (token === audioTokenRef.current) {
            setIsSpeaking(false);
            setIsPaused(false);
          }
        });
      };

      playNextChunk();
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(preparedText);
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
  }, [voices, stopAudio]);

  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    else window.speechSynthesis?.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => undefined);
    } else {
      window.speechSynthesis?.resume();
    }
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    stopAudio();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [stopAudio]);

  useEffect(() => stop, [stop]);

  return { isSpeaking, isPaused, speak, pause, resume, stop };
}
