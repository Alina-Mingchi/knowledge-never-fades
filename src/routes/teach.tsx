import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, RotateCcw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSpokenCaption } from "@/hooks/use-spoken-caption";
import { AmbientBackground, TopRail, GlassPanel } from "@/components/chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/lib/language";
import { getTeachCopy } from "@/lib/agentCopy";
import {
  DEFAULT_TUTOR,
  getSelectedTutorId,
  getTutors,
  setSelectedTutorId,
  type Tutor,
} from "@/lib/tutors";
import { requiresManagerApproval } from "@/lib/tutorial";

export const Route = createFileRoute("/teach")({
  head: () => ({
    meta: [
      { title: "Teach — Knowledge Never Fades" },
      {
        name: "description",
        content:
          "A voice tutor coaches the new hire on their own screen and steps in before a guardrail is broken.",
      },
      { property: "og:title", content: "Teach — Knowledge Never Fades" },
      {
        property: "og:description",
        content: "Coaching the next generation with the expert's own reasoning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Teach,
});

function Teach() {
  const { language } = useLanguage();
  const copy = getTeachCopy(language.code);
  const [costCenter, setCostCenter] = useState("4711");
  const [blocked, setBlocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [finished, setFinished] = useState(false);
  const [vendor, setVendor] = useState("Brightline Media AG");
  const [amount, setAmount] = useState("12400");
  const [tutors, setTutors] = useState<Tutor[]>([DEFAULT_TUTOR]);
  const [selectedTutorId, setSelectedTutor] = useState(DEFAULT_TUTOR.id);
  const { caption, isSpeaking, speak, cancel } = useSpokenCaption();
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [alertSpoken, setAlertSpoken] = useState(false);
  const spokenOnceRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setTutors([DEFAULT_TUTOR, ...getTutors()]);
    setSelectedTutor(getSelectedTutorId());
  }, []);

  const speakLine = (key: string, index: number, text: string) => {
    setActiveLine(index);
    speak(text, { locale: language.agentLocale });
    spokenOnceRef.current.add(key);
  };

  // Greet with the first coaching line once per language.
  useEffect(() => {
    const key = `intro-${language.code}`;
    if (spokenOnceRef.current.has(key)) return;
    const timer = globalThis.setTimeout(() => speakLine(key, 0, copy.coaching[0] ?? ""), 800);
    return () => globalThis.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language.code, language.agentLocale]);

  // Speak the guardrail alert when a save is blocked.
  useEffect(() => {
    if (!blocked) {
      setAlertSpoken(false);
      return;
    }
    if (alertSpoken) return;
    setAlertSpoken(true);
    speakLine(`alert-${language.code}`, 2, copy.guardrailAlert);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocked, alertSpoken]);

  // Cancel speech when leaving the page or switching language.
  useEffect(() => cancel, [cancel, language.code]);

  const onFieldFocus = (key: string, index: number, text: string) => {
    const onceKey = `${key}-${language.code}`;
    if (spokenOnceRef.current.has(onceKey)) return;
    speakLine(onceKey, index, text);
  };

  const amountValue = Number(amount);
  const selectedTutor = tutors.find((tutor) => tutor.id === selectedTutorId) ?? DEFAULT_TUTOR;

  const resetResult = () => {
    setBlocked(false);
    setSaved(false);
    setFinished(false);
  };

  const trySave = () => {
    if (requiresManagerApproval(amountValue)) {
      setBlocked(true);
      return;
    }
    setSaved(true);
  };

  const mastered = (costCenter === "0400" ? 2 : 1) + (saved ? 1 : 0);

  if (finished) {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-6 font-body text-white">
        <AmbientBackground />
        <GlassPanel className="relative z-20 w-full max-w-xl text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-electric" />
          <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-electric">Tutorial complete</p>
          <h1 className="mt-3 font-display text-4xl">Knowledge transferred.</h1>
          <p className="mt-3 text-sm text-white/60">
            {selectedTutor.name} coached this case to completion. Mastery: {mastered}/3.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => {
                setFinished(false);
                setBlocked(false);
                setSaved(false);
              }}
              variant="outline"
              className="rounded-full"
            >
              <RotateCcw /> Try another case
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/">Return home</Link>
            </Button>
          </div>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink font-body text-white">
      <AmbientBackground />
      <TopRail part="Module 3 / 3 · Teach" />

      <main className="relative z-20 px-6 pb-16 md:px-12 lg:px-16">
        <div className="mb-8 enter-up">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-electric/90">
            <span className="h-px w-8 bg-electric/60" /> New hire · invoice 5203
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-tight">
            A new case.
            <br />
            <span className="text-electric">The expert's reasoning.</span>
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* New hire screen */}
          <div className="lg:col-span-7 enter-up" style={{ animationDelay: "0.08s" }}>
            <GlassPanel className="h-full">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                  New hire's screen · ledger app
                </span>
                <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-electric/80">
                  <span className="h-2 w-2 rounded-full bg-electric pulse-dot" /> tutor watching
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-ink/60 p-5 outline-1 outline-white/10">
                <p className="font-display text-2xl tracking-tight">Invoice #5203</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="rounded-xl bg-white/5 p-3 outline-1 outline-white/10">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Vendor</span>
                    <Input
                      value={vendor}
                      onFocus={() => onFieldFocus("vendor", 0, copy.coaching[0] ?? "")}
                      onChange={(event) => {
                        setVendor(event.target.value);
                        resetResult();
                      }}
                      className="mt-1 h-8 border-0 bg-transparent px-0 shadow-none"
                    />
                  </label>
                  <label className="rounded-xl bg-white/5 p-3 outline-1 outline-white/10">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Amount (€)</span>
                    <Input
                      type="number"
                      min="0"
                      value={amount}
                      onFocus={() => onFieldFocus("amount", 2, copy.coaching[2] ?? "")}
                      onChange={(event) => {
                        setAmount(event.target.value);
                        resetResult();
                      }}
                      className="mt-1 h-8 border-0 bg-transparent px-0 text-electric shadow-none"
                    />
                  </label>
                  <label className="rounded-xl bg-white/5 p-3 outline-1 outline-electric/40 sm:col-span-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      Cost center
                    </span>
                    <select
                      value={costCenter}
                      onFocus={() => onFieldFocus("costCenter", 1, copy.coaching[1] ?? "")}
                      onChange={(e) => {
                        setCostCenter(e.target.value);
                        resetResult();
                      }}
                      className="mt-1 block w-full rounded-md bg-ink px-2 py-1.5 text-sm outline-1 outline-white/15"
                    >
                      <option value="4711">4711 · General admin</option>
                      <option value="0400">0400 · Marketing</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={trySave}
                  disabled={saved || !vendor.trim() || !amount || amountValue < 0}
                  variant="outline"
                  className="h-11 rounded-full px-6"
                >
                  Save invoice
                </Button>
                {blocked && (
                  <Button
                    onClick={() => {
                      setBlocked(false);
                      setSaved(true);
                    }}
                    className="h-11 rounded-full px-6 font-bold"
                  >
                    Ask manager, then save
                  </Button>
                )}
                {saved && (
                  <Button onClick={() => setFinished(true)} className="h-11 rounded-full px-6 font-bold">
                    Finish tutorial
                  </Button>
                )}
              </div>

              {blocked && (
                <div className="enter-up mt-5 rounded-2xl bg-destructive/15 p-4 outline-1 outline-destructive/60">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-destructive">
                    Save blocked · guardrail
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed">{copy.guardrailAlert}</p>
                  <p className="mt-3 rounded-xl bg-ink/60 p-3 text-[13px] italic text-electric/90 outline-1 outline-white/10">
                    ▶ Expert replay · 01:12 — "Anything above €10,000 — I always check with the
                    manager first."
                  </p>
                </div>
              )}
              {saved && (
                <p className="enter-up mt-5 flex items-center gap-2 text-[13px] text-electric">
                  <span className="h-2 w-2 rounded-full bg-electric" /> Saved after manager
                  approval.
                </p>
              )}
            </GlassPanel>
          </div>

          {/* Tutor panel */}
          <div className="lg:col-span-5 enter-up" style={{ animationDelay: "0.14s" }}>
            <GlassPanel className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-electric/15 outline-1 outline-electric/30">
                    <span className="h-2 w-2 rounded-full bg-electric pulse-dot" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{selectedTutor.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                      Coaching · {language.agentLocale}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-electric/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-electric outline-1 outline-electric/30">
                  {language.short}
                </span>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Select tutor
                </span>
                <Select
                  value={selectedTutorId}
                  onValueChange={(value) => {
                    setSelectedTutor(value);
                    setSelectedTutorId(value);
                  }}
                >
                  <SelectTrigger className="h-10 bg-ink/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tutors.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {tutor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <div className="mt-4 space-y-2">
                {copy.coaching.map((c, i) => (
                  <p
                    key={i}
                    className={`rounded-2xl rounded-tl-md px-3 py-2 text-[13px] leading-relaxed outline-1 ${
                      i === 2 && blocked
                        ? "bg-destructive/15 outline-destructive/50"
                        : "bg-white/5 text-white/80 outline-white/10"
                    }`}
                  >
                    {c}
                  </p>
                ))}
              </div>

              <div className="mt-auto pt-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Mastery summary
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-display text-3xl">
                    {mastered}
                    <span className="text-base text-white/40">/3</span>
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-2 rounded-full bg-electric transition-all duration-700"
                      style={{ width: `${(mastered / 3) * 100}%` }}
                    />
                  </span>
                </div>
                <p className="mt-2 text-[12px] text-white/50">{copy.masteryNote}</p>
                <Link
                  to="/"
                  className="mt-5 block rounded-full bg-white/5 px-5 py-3 text-center text-sm font-semibold outline-1 outline-white/15 transition hover:outline-electric/50"
                >
                  ← Change language
                </Link>
              </div>
            </GlassPanel>
          </div>
        </div>
      </main>
    </div>
  );
}
