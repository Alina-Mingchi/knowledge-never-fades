import { createFileRoute, Link } from "@tanstack/react-router";
import { AmbientBackground, TopRail, GlassPanel } from "@/components/chrome";
import { LANGUAGES, useLanguage } from "@/lib/language";
import waveform from "@/assets/waveform.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Knowledge Never Fades — Choose your agent's language" },
      {
        name: "description",
        content:
          "Pick the language your ElevenLabs voice agents will speak, then capture, map and teach expert knowledge.",
      },
      { property: "og:title", content: "Knowledge Never Fades" },
      {
        property: "og:description",
        content:
          "The AI Apprentice — capture what an expert knows, map it into a workflow, teach it to the next generation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink font-body text-white">
      <AmbientBackground />
      <TopRail part="Part 1 / 3 · Language" />

      {/* Hero: language gate */}
      <section className="relative z-20 px-6 pt-10 pb-16 md:px-12 lg:px-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: headline + picker */}
          <div className="relative lg:col-span-7">
            <div
              className="absolute -top-8 -left-6 h-40 w-40 rotate-45 rounded-3xl bg-gradient-to-br from-electric/20 to-indigo-500/10 outline-1 outline-electric/20 drift-b"
              aria-hidden="true"
            />
            <p className="enter-up relative mb-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-electric/90">
              <span className="h-px w-8 bg-electric/60" /> Step one · Set the voice
            </p>
            <h1
              className="enter-up relative font-display text-[clamp(2.9rem,7.5vw,6rem)] leading-[0.9] tracking-tight"
              style={{ animationDelay: "0.05s" }}
            >
              Pick the language
              <br />
              your agents will
              <br />
              <span className="text-electric">speak.</span>
            </h1>
            <p
              className="enter-up relative mt-6 max-w-md text-[15px] leading-relaxed text-white/55"
              style={{ animationDelay: "0.1s" }}
            >
              Your choice is handed straight to the ElevenLabs agents — they'll
              think, respond and narrate back in this exact language.
            </p>

            <div
              className="enter-up relative mt-8 flex flex-wrap gap-2.5"
              style={{ animationDelay: "0.14s" }}
            >
              {LANGUAGES.map((lang) => {
                const active = lang.code === language.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={
                      active
                        ? "group relative overflow-hidden rounded-full bg-electric px-5 py-2.5 text-sm font-bold text-ink shadow-[0_0_34px_-6px_rgba(0,229,255,0.7)]"
                        : "rounded-full bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 outline-1 outline-white/15 transition hover:outline-electric/50 hover:text-white"
                    }
                  >
                    <span className="relative z-10">{lang.label}</span>
                    {active && (
                      <span className="sheen absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    )}
                  </button>
                );
              })}
            </div>

            <div
              className="enter-up relative mt-8 flex items-center gap-3 text-[13px] text-white/45"
              style={{ animationDelay: "0.18s" }}
            >
              <span className="h-2 w-2 rounded-full bg-electric/80 pulse-dot" />
              <span>
                Locked in:{" "}
                <span className="text-electric/90">
                  {language.label} ({language.agentLocale})
                </span>{" "}
                — the agent will speak this language in every module.
              </span>
            </div>
          </div>

          {/* Right: agent preview card */}
          <div className="enter-up relative lg:col-span-5" style={{ animationDelay: "0.12s" }}>
            <div
              className="absolute -top-6 -right-4 h-28 w-28 rotate-45 rounded-2xl bg-gradient-to-br from-fuchsia-500/25 to-transparent outline-1 outline-fuchsia-400/25 drift-a"
              aria-hidden="true"
            />
            <GlassPanel>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-electric/15 outline-1 outline-electric/30">
                    <span className="h-2 w-2 rounded-full bg-electric" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Mira · Voice agent</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                      Live preview
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-electric/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-electric outline-1 outline-electric/30">
                  {language.short}
                </span>
              </div>

              <div className="relative mt-5 overflow-hidden rounded-2xl bg-ink/60 outline-1 outline-white/10">
                <img
                  src={waveform}
                  alt="Agent voice waveform"
                  width={1088}
                  height={608}
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 flex items-end gap-1">
                  <span className="h-4 w-1 rounded-full bg-electric/80 pulse-dot" />
                  <span
                    className="h-6 w-1 rounded-full bg-electric/60 pulse-dot"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="h-3 w-1 rounded-full bg-electric/80 pulse-dot"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>

              <p className="mt-4 text-[14px] leading-relaxed text-white/70">
                "Got it — I'll answer every question in{" "}
                <span className="text-electric">{language.label}</span> and keep the
                tone warm and precise. Ready when you are."
              </p>

              <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/35">
                <span>Latency 240ms</span>
                <span className="text-electric/70">↑ handoff to next part</span>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* Module entry cards */}
      <section className="relative z-20 px-6 pb-10 md:px-12 lg:px-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              to: "/capture",
              step: "01",
              title: "Capture",
              desc: "The expert shares their screen while the agent asks why at natural pauses.",
            },
            {
              to: "/map",
              step: "02",
              title: "Map",
              desc: "A spoken debrief turns the session into a clickable Work Map.",
            },
            {
              to: "/teach",
              step: "03",
              title: "Teach",
              desc: "A voice tutor coaches the new hire on their own screen.",
            },
          ].map((m, i) => (
            <Link
              key={m.to}
              to={m.to}
              className="enter-up group relative overflow-hidden rounded-3xl bg-glass p-6 outline-1 outline-glass-border backdrop-blur-xl transition hover:outline-electric/40"
              style={{ animationDelay: `${0.2 + i * 0.06}s` }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-electric/90">
                {m.step}
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight">{m.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{m.desc}</p>
              <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-electric/70 transition group-hover:text-electric">
                Open module →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Launch strip */}
      <section className="relative z-20 px-6 pb-16 md:px-12 lg:px-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-electric/25 via-indigo-500/15 to-fuchsia-500/25 outline-1 outline-white/15">
          <div className="absolute inset-0 bg-ink/55" aria-hidden="true" />
          <div
            className="sheen absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-center justify-between gap-6 p-8 md:flex-row lg:p-10">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-electric/90">
                Ready · {language.label}
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
                Start the capture session.
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/60">
                Language is locked. The agent spins up in seconds and stays fluent
                across every reply.
              </p>
            </div>
            <Link
              to="/capture"
              className="group relative shrink-0 overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink"
            >
              <span className="relative z-10">Continue →</span>
              <span className="sheen absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
