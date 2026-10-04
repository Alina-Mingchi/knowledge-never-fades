import { createFileRoute, Link } from "@tanstack/react-router";
import { LiveAgentPanel } from "@/components/LiveAgentPanel";
import { useEffect, useRef, useState } from "react";
import { FileVideo, MonitorUp, Play, RotateCcw, Square, Volume2, VolumeX } from "lucide-react";
import { AmbientBackground, TopRail, GlassPanel } from "@/components/chrome";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { getCaptureCopy } from "@/lib/agentCopy";
import { useSpokenCaption } from "@/hooks/use-spoken-caption";
import waveform from "@/assets/waveform.jpg";

export const Route = createFileRoute("/capture")({
  head: () => ({
    meta: [
      { title: "Capture — Knowledge Never Fades" },
      {
        name: "description",
        content:
          "The expert shares their screen while the voice agent listens and asks why at natural pauses.",
      },
      { property: "og:title", content: "Capture — Knowledge Never Fades" },
      {
        property: "og:description",
        content: "A screen-share session where the AI apprentice captures what the expert knows.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Capture,
});

interface Exchange {
  q: string;
  a: string;
  event: string;
}

type CaptureSource = "demo" | "upload" | "record";

function Capture() {
  const { language } = useLanguage();
  const copy = getCaptureCopy(language.code);

  const exchanges: Exchange[] = copy.questions.map((q, i) => ({
    q,
    a: copy.answers[i] ?? "",
    event: copy.events[i] ?? "",
  }));

  // Reveal exchanges one at a time, simulating natural pauses.
  const [visible, setVisible] = useState(0);
  const [activeExchange, setActiveExchange] = useState<number | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [source, setSource] = useState<CaptureSource | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [recordingError, setRecordingError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const sequenceTimers = useRef<number[]>([]);
  const { caption, isSpeaking, speak, cancel } = useSpokenCaption();

  useEffect(() => {
    cancel();
    sequenceTimers.current.forEach(window.clearTimeout);
    sequenceTimers.current = [];
    setVisible(0);
    setActiveExchange(null);
    if (source !== "demo") return;

    const playExchange = (index: number) => {
      const exchange = exchanges[index];
      if (!exchange) return;
      setActiveExchange(index);
      setVisible(index + 1);

      const advance = () => {
        const timer = window.setTimeout(() => playExchange(index + 1), 1500);
        sequenceTimers.current.push(timer);
      };

      if (voiceEnabled) {
        speak(exchange.q, { locale: language.agentLocale, onComplete: advance });
      } else {
        advance();
      }
    };

    const firstTimer = window.setTimeout(() => playExchange(0), 1200);
    sequenceTimers.current.push(firstTimer);
    return () => {
      sequenceTimers.current.forEach(window.clearTimeout);
      sequenceTimers.current = [];
      cancel();
    };
  }, [cancel, language.agentLocale, language.code, speak, voiceEnabled, source]);

  const replayCurrentQuestion = () => {
    if (activeExchange === null) return;
    const exchange = exchanges[activeExchange];
    if (!exchange) return;
    setVoiceEnabled(true);
    speak(exchange.q, { locale: language.agentLocale });
  };

  const toggleVoice = () => {
    if (voiceEnabled) cancel();
    setVoiceEnabled((enabled) => !enabled);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.srcObject = screenStream;
  }, [screenStream, source]);

  useEffect(
    () => () => {
      if (uploadUrl) URL.revokeObjectURL(uploadUrl);
      screenStream?.getTracks().forEach((track) => track.stop());
    },
    [screenStream, uploadUrl],
  );

  const chooseSource = (nextSource: CaptureSource) => {
    if (source === "record" && nextSource !== "record") {
      screenStream?.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }
    setRecordingError("");
    setSource(nextSource);
  };

  const startScreenRecording = async () => {
    setSource("record");
    setRecordingError("");
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      stream.getVideoTracks()[0]?.addEventListener("ended", () => setScreenStream(null));
      setScreenStream(stream);
    } catch {
      setRecordingError("Screen sharing was cancelled. Choose Start screen recording to try again.");
    }
  };

  const stopScreenRecording = () => {
    screenStream?.getTracks().forEach((track) => track.stop());
    setScreenStream(null);
  };

  const selectTutorialVideo = (file?: File) => {
    if (!file) return;
    if (uploadUrl) URL.revokeObjectURL(uploadUrl);
    setUploadUrl(URL.createObjectURL(file));
    setUploadName(file.name);
    setSource("upload");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink font-body text-white">
      <AmbientBackground />
      <TopRail part="Module 1 / 3 · Capture" />

      <main className="relative z-20 px-6 pb-16 md:px-12 lg:px-16">
        <div className="mb-8 enter-up">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-electric/90">
            <span className="h-px w-8 bg-electric/60" /> Live session · invoice 4471
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-tight">
            The expert works.
            <br />
            <span className="text-electric">The agent asks why.</span>
          </h1>
        </div>

        <LiveAgentPanel
          role="captureMap"
          title="Capture apprentice"
          onStart={cancel}
          dynamicVariables={{ module: "capture" }}
          context="Module: Capture. The expert is processing invoice 4471 from Nordlicht Bürobedarf GmbH, $12,400, changing cost center 4711 to 0400, due Friday. Ask why at natural pauses, including at least one guardrail question (e.g. approval limit above $10,000)."
        />

        <div className="mb-6 grid gap-3 sm:grid-cols-3" aria-label="Capture source">
          <Button
            variant={source === "demo" ? "default" : "outline"}
            onClick={() => chooseSource("demo")}
            className="h-auto justify-start rounded-lg px-4 py-3"
          >
            <Play /> Toy example demo
          </Button>
          <label
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
              source === "upload"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-accent"
            }`}
          >
            <FileVideo className="h-4 w-4" /> Upload tutorial video
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(event) => selectTutorialVideo(event.target.files?.[0])}
            />
          </label>
          <Button
            variant={source === "record" ? "default" : "outline"}
            onClick={() => void startScreenRecording()}
            className="h-auto justify-start rounded-lg px-4 py-3"
          >
            <MonitorUp /> Start screen recording
          </Button>
        </div>

        {source && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Shared screen */}
          <div className="lg:col-span-7 enter-up" style={{ animationDelay: "0.08s" }}>
            <GlassPanel className="h-full">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-electric" />
                  <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Shared screen · ledger app
                  </span>
                </div>
                <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-electric/80">
                  <span className="h-2 w-2 rounded-full bg-electric pulse-dot" /> rec
                </span>
              </div>

              {source === "demo" && (
              <div className="mt-5 rounded-2xl bg-ink/60 p-5 outline-1 outline-white/10">
                <div className="flex items-center justify-between">
                  <p className="font-display text-2xl tracking-tight">Invoice #4471</p>
                  <span className="rounded-full bg-electric/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-electric outline-1 outline-electric/30">
                    Open
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/5 p-3 outline-1 outline-white/10">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Vendor</p>
                    <p className="mt-1 text-sm font-medium">Nordlicht Bürobedarf GmbH</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 outline-1 outline-white/10">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Amount</p>
                    <p className="mt-1 text-sm font-medium text-electric">$12,400</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 outline-1 outline-electric/40">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      Cost center
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      <span className="text-white/40 line-through">4711</span>{" "}
                      <span className="text-electric">→ 0400</span>
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 outline-1 outline-white/10">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Due</p>
                    <p className="mt-1 text-sm font-medium">Friday</p>
                  </div>
                </div>
              </div>
              )}

              {source === "upload" && (
                <div className="mt-5 overflow-hidden rounded-2xl bg-ink/60 outline-1 outline-white/10">
                  {uploadUrl ? (
                    <>
                      <video src={uploadUrl} controls className="aspect-video w-full bg-ink object-contain" />
                      <p className="truncate px-4 py-3 text-sm text-white/65">{uploadName}</p>
                    </>
                  ) : (
                    <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-3 px-6 text-center">
                      <FileVideo className="h-8 w-8 text-electric" />
                      <span className="text-sm font-semibold">Choose a tutorial video</span>
                      <span className="text-xs text-white/45">The agent will map the visible workflow.</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="sr-only"
                        onChange={(event) => selectTutorialVideo(event.target.files?.[0])}
                      />
                    </label>
                  )}
                </div>
              )}

              {source === "record" && (
                <div className="mt-5 overflow-hidden rounded-2xl bg-ink/60 outline-1 outline-white/10">
                  {screenStream ? (
                    <>
                      <video ref={videoRef} autoPlay muted playsInline className="aspect-video w-full object-contain" />
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <span className="flex items-center gap-2 text-xs text-electric">
                          <span className="h-2 w-2 rounded-full bg-destructive pulse-dot" /> Recording screen
                        </span>
                        <Button variant="outline" size="sm" onClick={stopScreenRecording}>
                          <Square /> Stop
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center gap-3 px-6 text-center">
                      <MonitorUp className="h-8 w-8 text-electric" />
                      <p className="text-sm text-white/60">
                        {recordingError || "Choose a window or tab for the agent to watch."}
                      </p>
                      <Button onClick={() => void startScreenRecording()}>Start screen recording</Button>
                    </div>
                  )}
                </div>
              )}

              {/* Detected events */}
              {source === "demo" && (
              <div className="mt-5">
                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Detected events
                </p>
                <div className="flex flex-wrap gap-2">
                  {copy.events.map((e, i) => (
                    <span
                      key={e}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-medium outline-1 transition-opacity duration-500 ${
                        visible > i
                          ? "bg-electric/10 text-electric outline-electric/30"
                          : "bg-white/5 text-white/30 outline-white/10"
                      }`}
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              )}
            </GlassPanel>
          </div>

          {/* Voice agent side panel */}
          <div className="lg:col-span-5 enter-up" style={{ animationDelay: "0.14s" }}>
            <GlassPanel className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-electric/15 outline-1 outline-electric/30">
                    <span className="h-2 w-2 rounded-full bg-electric pulse-dot" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{copy.agentName}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                      {isSpeaking ? "Speaking" : copy.status} · {language.agentLocale}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={replayCurrentQuestion}
                    disabled={activeExchange === null}
                    aria-label="Replay current question"
                    title="Replay current question"
                  >
                    <RotateCcw />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleVoice}
                    aria-label={voiceEnabled ? "Mute agent voice" : "Enable agent voice"}
                    title={voiceEnabled ? "Mute agent voice" : "Enable agent voice"}
                  >
                    {voiceEnabled ? <Volume2 /> : <VolumeX />}
                  </Button>
                  <span className="rounded-full bg-electric/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-electric outline-1 outline-electric/30">
                    {language.short}
                  </span>
                </div>
              </div>

              <div className="relative mt-4 h-24 overflow-hidden rounded-2xl bg-ink/60 outline-1 outline-white/10">
                <img
                  src={waveform}
                  alt=""
                  width={1088}
                  height={608}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-70"
                />
              </div>

              <div className="mt-4 flex-1 space-y-3">
                {exchanges.slice(0, visible).map((ex, i) => (
                  <div key={i} className="enter-up space-y-2">
                    <p className="min-h-10 rounded-2xl rounded-tl-md bg-white/5 px-3 py-2 text-[13px] leading-relaxed text-white/80 outline-1 outline-white/10">
                      <span className="mr-1 text-electric/70">Agent:</span>
                      {activeExchange === i ? caption || "…" : ex.q}
                      {activeExchange === i && isSpeaking && (
                        <span className="ml-1 inline-block h-3 w-px bg-electric pulse-dot" aria-hidden="true" />
                      )}
                    </p>
                    <p className="ml-8 rounded-2xl rounded-tr-md bg-electric/10 px-3 py-2 text-[13px] leading-relaxed text-white/90 outline-1 outline-electric/25">
                      <span className="mr-1 text-electric/70">Expert:</span>
                      {ex.a}
                    </p>
                  </div>
                ))}
                {source === "demo" && visible < exchanges.length && (
                  <p className="flex items-center gap-2 text-[12px] text-white/35">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric pulse-dot" />
                    Waiting for a natural pause…
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <Link
                  to="/map"
                  className="group relative block overflow-hidden rounded-full bg-electric px-5 py-3 text-center text-sm font-bold text-ink shadow-lg shadow-primary/20"
                >
                  <span className="relative z-10">End task · start debrief →</span>
                  <span className="sheen absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </Link>
              </div>
            </GlassPanel>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}
