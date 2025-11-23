import { useState, useEffect, useCallback, useRef } from "react";

interface UseSpeechSynthesisOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  id?: string; // Unique identifier for the audio being played
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
    
    // Cleanup on unmount
    return () => {
      if (isSupported && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const speak = useCallback((
    text: string,
    options: UseSpeechSynthesisOptions = {}
  ) => {
    if (!isSupported || !text) return;

    const { id, ...speechOptions } = options;

    // If we're currently playing the same audio, stop it (toggle off)
    if (id && activeId === id && currentUtteranceRef.current) {
      window.speechSynthesis.cancel();
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
      setActiveId(null);
      return;
    }

    // Stop any ongoing speech before starting new one
    // Synchronously reset state to prevent stuck UI
    if (currentUtteranceRef.current) {
      window.speechSynthesis.cancel();
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
      setActiveId(null);
    }

    // Create a new utterance for this specific speech request
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;
    
    // Set language based on the language code
    utterance.lang = speechOptions.lang || 'es-ES';
    utterance.rate = speechOptions.rate || 0.9; // Slightly slower for learning
    utterance.pitch = speechOptions.pitch || 1.0;
    utterance.volume = speechOptions.volume || 1.0;

    // Attach callbacks for this specific utterance
    utterance.onstart = () => {
      // Only update state if this is still the current utterance
      if (currentUtteranceRef.current === utterance) {
        setIsSpeaking(true);
        setActiveId(id || null);
      }
    };
    
    utterance.onend = () => {
      // Only update state if this is still the current utterance
      if (currentUtteranceRef.current === utterance) {
        setIsSpeaking(false);
        setActiveId(null);
        currentUtteranceRef.current = null;
      }
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      // Always reset state on error, even if not the current utterance
      // This prevents UI from getting stuck in "playing" state
      if (currentUtteranceRef.current === utterance) {
        setIsSpeaking(false);
        setActiveId(null);
        currentUtteranceRef.current = null;
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, activeId]);

  const stop = useCallback(() => {
    if (isSupported) {
      // Synchronously reset state before canceling
      // This ensures UI updates immediately even if cancel fails
      const wasPlaying = currentUtteranceRef.current !== null;
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
      setActiveId(null);
      
      // Cancel any ongoing speech
      if (wasPlaying) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    activeId,
  };
}

// Helper function to get language code from language name
// Supports common language names and provides fallback
export function getLanguageCode(language: string): string {
  const languageCodes: Record<string, string> = {
    spanish: 'es-ES',
    french: 'fr-FR',
    mandarin: 'zh-CN',
    chinese: 'zh-CN',
    english: 'en-US',
    german: 'de-DE',
    italian: 'it-IT',
    portuguese: 'pt-PT',
    japanese: 'ja-JP',
    korean: 'ko-KR',
  };
  
  const normalizedLang = language.toLowerCase();
  return languageCodes[normalizedLang] || 'en-US'; // Fallback to English
}
