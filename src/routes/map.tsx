import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LiveAgentPanel } from "@/components/LiveAgentPanel";
import { useEffect, useRef, useState } from "react";
import { RotateCcw, Volume2 } from "lucide-react";
import { AmbientBackground, TopRail, GlassPanel } from "@/components/chrome";
import { Button } from "@/components/ui/button";
import { useSpokenCaption } from "@/hooks/use-spoken-caption";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/language";
import { getCaptureCopy, getMapCopy } from "@/lib/agentCopy";
import { saveTutor } from "@/lib/tutors";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Work Map — Knowledge Never Fades" },
      {
        name: "description",
        content:
          "A spoken debrief turns the expert's session into a clickable Work Map of steps, reasons and guardrails.",
      },
      { property: "og:title", content: "Work Map — Knowledge Never Fades" },
      {
        property: "og:description",
        content: "Every step links to a screen moment and the expert's own words.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

interface Step {
  time: string;
  kind: "step" | "decision" | "guardrail";
  title: string;
  decision: string;
  reason: string;
  guardrail?: string;
}

function MapPage() {
  const { language } = useLanguage();
  const capture = getCaptureCopy(language.code);
  const map = getMapCopy(language.code);
  const [confirmed, setConfirmed] = useState(false);
  const [tutorName, setTutorName] = useState("");
  const [visibleQuestions, setVisibleQuestions] = useState(0);
  const [activeSpeech, setActiveSpeech] = useState<number | null>(null);
  const [teachBackVisible, setTeachBackVisible] = useState(false);
  const { caption, isSpeaking, speak, cancel } = useSpokenCaption();
  const navigate = useNavigate();

  const speakQuestion = (index: number) => {
    const text = map.debriefQuestions[index];
    if (!text) return;
    setActiveSpeech(index);
    setVisibleQuestions((count) => Math.max(count, index + 1));
    speak(text, {
      locale: language.agentLocale,
      onComplete: () => setActiveSpeech(null),
    });
  };

  const speakTeachBack = () => {
    setTeachBackVisible(true);
    setActiveSpeech(map.debriefQuestions.length);
    speak(map.teachBack, {
      locale: language.agentLocale,
      onComplete: () => setActiveSpeech(null),
    });
  };

  useEffect(() => {
    cancel();
    setVisibleQuestions(0);
    setActiveSpeech(null);
    setTeachBackVisible(false);
    return () => cancel();
  }, [cancel, language.agentLocale, language.code]);

  const createTutor = () => {
    const tutor = saveTutor(tutorName, language.code);
    if (!tutor) return;
    void navigate({ to: "/teach" });
  };

  const steps: Step[] = [
    {
      time: "00:04",
      kind: "step",
      title: capture.events[0] ?? "",
      decision: "Open the oldest invoice in the batch first",
      reason: capture.answers[0] ?? "",
    },
    {
      time: "00:41",
      kind: "decision",
      title: capture.events[1] ?? "",
      decision: "Book to the cost center that owns the vendor contract",
      reason: capture.answers[1] ?? "",
    },
    {
      time: "01:12",
      kind: "guardrail",
      title: capture.events[2] ?? "",
      decision: "Pause before saving — escalate to the manager",
      reason: capture.answers[2] ?? "",
      guardrail: "Stop & ask if amount > $10,000",
    },
  ];
  const [active, setActive] = useState(0);
  const s = steps[active] ?? steps[0]!;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink font-body text-white">
      <AmbientBackground />
      <TopRail part="Module 2 / 3 · Map" />

      <main className="relative z-20 px-6 pb-16 md:px-12 lg:px-16">
        <div className="mb-8 enter-up">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-electric/90">
            <span className="h-px w-8 bg-electric/60" /> Debrief · Work Map
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-tight">
            Every step,
            <br />
            <span className="text-electric">in the expert's words.</span>
          </h1>
        </div>

        <LiveAgentPanel
          role="captureMap"
          title="Debrief & teach-back"
          onStart={cancel}
          onOfflineStart={() => speakQuestion(0)}
          dynamicVariables={{ module: "map" }}
          context={`Module: Map debrief. Work Map steps: ${steps.map((st, i) => `${i + 1}. ${JSON.stringify(st)}`).join(" ")}. Ask at least three follow-up questions not answered during capture, then explain the whole process back and ask the expert to confirm or correct it.`}
        />

        {/* Timeline */}
        <div className="enter-up" style={{ animationDelay: "0.06s" }}>
          <div className="relative grid gap-4 md:grid-cols-3">
            <div
              className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-electric/60 via-primary/40 to-accent/60 md:block"
              aria-hidden="true"
            />
            {steps.map((st, i) => {
              const isActive = i === active;
              const isGuard = st.kind === "guardrail";
              return (
                <button
                  key={i}
                  onClick={() => {
                    setActive(i);
                    speakQuestion(i);
                  }}
                  className={`relative rounded-3xl p-5 text-left backdrop-blur-xl transition outline-1 ${
                    isActive
                      ? isGuard
                        ? "bg-destructive/15 outline-destructive/60"
                        : "bg-electric/10 outline-electric/50"
                      : "bg-glass outline-glass-border hover:outline-electric/30"
                  }`}
                >
                  <span
                    className={`relative z-10 grid h-3 w-3 place-items-center rounded-full ${
                      isGuard ? "bg-destructive" : "bg-electric"
                    } ${isActive ? "pulse-dot" : ""}`}
                  />
                  <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
                    {String(i + 1).padStart(2, "0")} · {st.time} · {st.kind}
                  </p>
                  <p className="mt-1 text-[15px] font-semibold leading-snug">{st.title}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              onClick={speakTeachBack}
              className="group relative h-11 overflow-hidden rounded-full px-8 font-bold"
            >
              <span className="relative z-10">Summary</span>
              <span className="sheen absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </Button>
          </div>
        </div>

        {/* Step detail + debrief */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 enter-up" style={{ animationDelay: "0.1s" }}>
            <GlassPanel className="h-full">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-electric/90">
                Screen moment · {s.time}
              </p>
              <div className="mt-4 rounded-2xl bg-ink/60 p-5 outline-1 outline-white/10">
                <p className="font-display text-xl tracking-tight">Invoice #4471</p>
                <p className="mt-2 text-sm text-white/60">{s.title}</p>
              </div>
              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-white/40">Decision</dt>
                  <dd className="mt-1 text-[15px]">{s.decision}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Reason · expert's words
                  </dt>
                  <dd className="mt-1 text-[15px] italic text-electric/90">"{s.reason}"</dd>
                </div>
                {s.guardrail && (
                  <div className="rounded-2xl bg-destructive/15 p-4 outline-1 outline-destructive/50">
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-destructive">
                      Guardrail
                    </dt>
                    <dd className="mt-1 text-[15px] font-semibold">{s.guardrail}</dd>
                  </div>
                )}
              </dl>
            </GlassPanel>
          </div>

          <div className="lg:col-span-5 enter-up" style={{ animationDelay: "0.14s" }}>
            <GlassPanel className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-electric/90">
                  {isSpeaking ? "Speaking" : "Spoken debrief"} · {language.agentLocale}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (activeSpeech === map.debriefQuestions.length) speakTeachBack();
                    else if (activeSpeech !== null) speakQuestion(activeSpeech);
                  }}
                  aria-label="Replay spoken debrief"
                  title="Replay spoken debrief"
                >
                  {isSpeaking ? <Volume2 /> : <RotateCcw />}
                </Button>
              </div>
              <ol className="mt-4 space-y-2">
                {map.debriefQuestions.slice(0, visibleQuestions).map((q, i) => (
                  <li
                    key={i}
                    className={`min-h-10 rounded-2xl px-3 py-2 text-[13px] leading-relaxed outline-1 transition ${
                      activeSpeech === i
                        ? "bg-electric/10 text-white/90 outline-electric/30"
                        : "bg-white/5 text-white/80 outline-white/10"
                    }`}
                  >
                    <span className="mr-1 text-electric/70">Q{i + 1}.</span>
                    {activeSpeech === i ? caption || "…" : q}
                    {activeSpeech === i && isSpeaking && (
                      <span className="ml-1 inline-block h-3 w-px bg-electric pulse-dot" aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ol>
              <div className="mt-5 rounded-2xl bg-electric/10 p-4 outline-1 outline-electric/30">
                <p className="text-[10px] uppercase tracking-[0.2em] text-electric">Teach-back</p>
                <p className="mt-2 min-h-10 text-[13px] leading-relaxed text-white/85">
                  {teachBackVisible
                    ? activeSpeech === map.debriefQuestions.length
                      ? caption || "…"
                      : map.teachBack
                    : "The agent will explain the process after the debrief questions."}
                  {activeSpeech === map.debriefQuestions.length && isSpeaking && (
                    <span className="ml-1 inline-block h-3 w-px bg-electric pulse-dot" aria-hidden="true" />
                  )}
                </p>
              </div>
              <div className="mt-auto pt-5">
                {confirmed ? (
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-[13px] text-electric">
                      <span className="h-2 w-2 rounded-full bg-electric" /> {map.confirm}
                    </p>
                    <label className="block">
                      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45">
                        Give your tutor a name
                      </span>
                      <Input
                        value={tutorName}
                        onChange={(event) => setTutorName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") createTutor();
                        }}
                        placeholder="e.g. Invoice Navigator"
                        maxLength={40}
                        className="h-11 rounded-lg bg-ink/60"
                      />
                    </label>
                    <Button
                      onClick={createTutor}
                      disabled={!tutorName.trim()}
                      className="group relative h-11 w-full overflow-hidden rounded-full font-bold"
                    >
                      <span className="relative z-10">Create tutor →</span>
                      <span className="sheen absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-foreground/40 to-transparent" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setConfirmed(true)}
                    className="group relative h-11 w-full overflow-hidden rounded-full font-bold"
                  >
                    <span className="relative z-10">Confirm teach-back</span>
                    <span className="sheen absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  </Button>
                )}
              </div>
            </GlassPanel>
          </div>
        </div>
      </main>
    </div>
  );
}
