import { useCallback, useEffect, useRef, useState } from "react";

// Minimal typings for the Web Speech API (not in lib.dom for all targets).
interface SpeechRecognitionResultLike {
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

const RecognitionCtor: SpeechRecognitionCtor | undefined =
  typeof window !== "undefined"
    ? window.SpeechRecognition ?? window.webkitSpeechRecognition
    : undefined;

const synthAvailable =
  typeof window !== "undefined" && "speechSynthesis" in window;

export interface UseVoice {
  /** True when SpeechRecognition exists in this browser. */
  supported: boolean;
  /** True if speech synthesis (read-aloud) is available. */
  canSpeak: boolean;
  /** True while the mic is actively listening. */
  listening: boolean;
  /** Begin a single-utterance listen; `onTranscript` gets the heard text. */
  listen: (onTranscript: (text: string) => void) => void;
  /** Stop listening early. */
  stop: () => void;
  /** Read text aloud (no-op if synthesis unavailable). */
  speak: (text: string) => void;
}

/**
 * Voice I/O for the companion. Feature-detects the Web Speech API and degrades
 * gracefully: when unsupported, `supported`/`canSpeak` are false and callers
 * hide the mic button.
 */
export function useVoice(): UseVoice {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const listen = useCallback(
    (onTranscript: (text: string) => void) => {
      if (!RecognitionCtor) return;
      // Cancel any in-flight session before starting a new one.
      recognitionRef.current?.stop();

      const recognition = new RecognitionCtor();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onresult = (e) => {
        const transcript = e.results[0]?.[0]?.transcript ?? "";
        if (transcript) onTranscript(transcript);
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
      setListening(true);
      try {
        recognition.start();
      } catch {
        setListening(false);
      }
    },
    [],
  );

  const speak = useCallback((text: string) => {
    if (!synthAvailable) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Clean up on unmount.
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (synthAvailable) window.speechSynthesis.cancel();
    };
  }, []);

  return {
    supported: Boolean(RecognitionCtor),
    canSpeak: synthAvailable,
    listening,
    listen,
    stop,
    speak,
  };
}
