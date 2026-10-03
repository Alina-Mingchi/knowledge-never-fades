import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AmbientBackground, TopRail, GlassPanel } from "@/components/chrome";
import { useLanguage } from "@/lib/language";
import { getCaptureCopy } from "@/lib/agentCopy";
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
  useEffect(() => {
    setVisible(0);
    const timers = exchanges.map((_, i) =>
      window.setTimeout(() => setVisible(i + 1), 1200 + i * 2600),
    );
    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language.code]);

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

              {/* Simulated ledger screen */}
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
                    <p className="mt-1 text-sm font-medium text-electric">€12,400</p>
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

              {/* Detected events */}
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
                      {copy.status} · {language.agentLocale}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-electric/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-electric outline-1 outline-electric/30">
                  {language.short}
                </span>
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
                    <p className="rounded-2xl rounded-tl-md bg-white/5 px-3 py-2 text-[13px] leading-relaxed text-white/80 outline-1 outline-white/10">
                      <span className="mr-1 text-electric/70">Agent:</span>
                      {ex.q}
                    </p>
                    <p className="ml-8 rounded-2xl rounded-tr-md bg-electric/10 px-3 py-2 text-[13px] leading-relaxed text-white/90 outline-1 outline-electric/25">
                      <span className="mr-1 text-electric/70">Expert:</span>
                      {ex.a}
                    </p>
                  </div>
                ))}
                {visible < exchanges.length && (
                  <p className="flex items-center gap-2 text-[12px] text-white/35">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric pulse-dot" />
                    Waiting for a natural pause…
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <Link
                  to="/map"
                  className="group relative block overflow-hidden rounded-full bg-electric px-5 py-3 text-center text-sm font-bold text-ink shadow-[0_0_34px_-6px_rgba(0,229,255,0.7)]"
                >
                  <span className="relative z-10">End task · start debrief →</span>
                  <span className="sheen absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </Link>
              </div>
            </GlassPanel>
          </div>
        </div>
      </main>
    </div>
  );
}
