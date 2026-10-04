import { useCallback, useEffect, useRef, useState } from "react";

interface SpeakOptions {
  locale: string;
  onComplete?: () => void;
}

export function useSpokenCaption() {
  const [caption, setCaption] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const completionRef = useRef<(() => void) | undefined>(undefined);

  const stopTyping = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    stopTyping();
    completionRef.current = undefined;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [stopTyping]);

  const speak = useCallback(
    (text: string, { locale, onComplete }: SpeakOptions) => {
      cancel();
      setCaption("");
      setIsSpeaking(true);
      completionRef.current = onComplete;

      let character = 0;
      const typingDelay = Math.max(28, Math.min(55, Math.round(2400 / Math.max(text.length, 1))));
      intervalRef.current = window.setInterval(() => {
        character += 1;
        setCaption(text.slice(0, character));
        if (character >= text.length) stopTyping();
      }, typingDelay);

      const finish = () => {
        stopTyping();
        setCaption(text);
        setIsSpeaking(false);
        const complete = completionRef.current;
        completionRef.current = undefined;
        complete?.();
      };

      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        globalThis.setTimeout(finish, Math.max(1600, text.length * typingDelay));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale;
      utterance.rate = 0.96;
      utterance.pitch = 1.02;
      const localePrefix = locale.split("-")[0]?.toLowerCase();
      const matchingVoice = window.speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.toLowerCase().startsWith(localePrefix ?? locale.toLowerCase()));
      if (matchingVoice) utterance.voice = matchingVoice;
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    },
    [cancel, stopTyping],
  );

  useEffect(() => cancel, [cancel]);

  return { caption, isSpeaking, speak, cancel };
}