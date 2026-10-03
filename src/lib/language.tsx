import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface AgentLanguage {
  code: string;
  label: string;
  /** BCP-47 tag handed to the ElevenLabs agent config */
  agentLocale: string;
  short: string;
}

export const LANGUAGES: AgentLanguage[] = [
  { code: "en", label: "English", agentLocale: "en-US", short: "EN" },
  { code: "es", label: "Español", agentLocale: "es-ES", short: "ES" },
  { code: "fr", label: "Français", agentLocale: "fr-FR", short: "FR" },
  { code: "de", label: "Deutsch", agentLocale: "de-DE", short: "DE" },
  { code: "ja", label: "日本語", agentLocale: "ja-JP", short: "JA" },
  { code: "pt", label: "Português", agentLocale: "pt-BR", short: "PT" },
];

const STORAGE_KEY = "knf-language";

interface LanguageContextValue {
  language: AgentLanguage;
  setLanguage: (code: string) => void;
}

const DEFAULT_LANGUAGE = LANGUAGES[0]!;

const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AgentLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const match = LANGUAGES.find((l) => l.code === stored);
    if (match) setLanguageState(match);
  }, []);

  const setLanguage = (code: string) => {
    const match = LANGUAGES.find((l) => l.code === code);
    if (!match) return;
    setLanguageState(match);
    window.localStorage.setItem(STORAGE_KEY, match.code);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
