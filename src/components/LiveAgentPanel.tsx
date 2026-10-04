import { useEffect, useRef, useState } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { AudioLines, Mic, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/chrome";
import { useLanguage } from "@/lib/language";
import { getAgentId, type AgentRole } from "@/lib/elevenlabs";

interface LiveAgentPanelProps {
  role: AgentRole;
  title: string;
  /** Plain-text description of what's on screen; sent to the agent whenever it changes. */
  context: string;
  dynamicVariables?: Record<string, string | number | boolean>;
  /** Called when the live session starts, so the page can silence its scripted voice. */
  onStart?: () => void;
  /** Called to start the scripted (offline) voice walkthrough instead of the live agent. */
  onOfflineStart?: () => void;
}

interface Line {
  id: number;
  who: "agent" | "you";
  text: string;
}

export function LiveAgentPanel(props: LiveAgentPanelProps) {
  return (
    <ConversationProvider>
      <LiveAgentInner {...props} />
    </ConversationProvider>
  );
}

function LiveAgentInner({ role, title, context, dynamicVariables, onStart, onOfflineStart }: LiveAgentPanelProps) {
  const { language } = useLanguage();
  const agentId = getAgentId(role);
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);
  const counter = useRef(0);

  const conversation = useConversation({
    onMessage: (m) => {
      const text = m.message?.trim();
      if (!text) return;
      counter.current += 1;
      const id = counter.current;
      setLines((prev) => [...prev.slice(-30), { id, who: m.source === "user" ? "you" : "agent", text }]);
    },
    onError: (e) => setError(typeof e === "string" ? e : "Connection problem with the voice agent."),
  });

  const connected = conversation.status === "connected";
  const connecting = conversation.status === "connecting";

  // Keep the agent aware of what's on screen.
  useEffect(() => {
    if (connected && context) conversation.sendContextualUpdate(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, context]);

  const start = async () => {
    setError(null);
    if (!agentId) return;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone access is needed to talk with the agent.");
      return;
    }
    onStart?.();
    setLines([]);
    conversation.startSession({
      agentId,
      connectionType: "webrtc",
      overrides: { agent: { language: language.code as never } },
      dynamicVariables: {
        language: language.label,
        locale: language.agentLocale,
        ...dynamicVariables,
      },
    });
  };

  return (
    <GlassPanel className="mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary/90">ElevenLabs live agent</p>
          <p className="mt-1 font-display text-xl">{title}</p>
          <p className="mt-1 text-xs text-white/60">
            {!agentId
              ? "Agent not connected yet — using the scripted voice."
              : connected
                ? conversation.isSpeaking
                  ? "Agent is speaking…"
                  : "Listening — just talk."
                : connecting
                  ? "Connecting…"
                  : `Talk live in ${language.label}.`}
          </p>
        </div>
        {connected || connecting ? (
          <Button variant="outline" onClick={() => conversation.endSession()}>
            <PhoneOff className="mr-2 h-4 w-4" /> End conversation
          </Button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button onClick={start} disabled={!agentId}>
              <Mic className="mr-2 h-4 w-4" /> Start live conversation
            </Button>
            {onOfflineStart && (
              <Button variant="outline" onClick={onOfflineStart}>
                <AudioLines className="mr-2 h-4 w-4" /> Start offline conversation
              </Button>
            )}
          </div>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      {lines.length > 0 && (
        <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1 text-sm">
          {lines.map((l) => (
            <p key={l.id} className={l.who === "agent" ? "text-white" : "text-white/60"}>
              <span className="mr-2 text-[10px] uppercase tracking-widest text-primary/80">{l.who}</span>
              {l.text}
            </p>
          ))}
        </div>
      )}
    </GlassPanel>
  );
}
