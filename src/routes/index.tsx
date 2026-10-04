import { createFileRoute, Link } from "@tanstack/react-router";
import { AmbientBackground, TopRail, GlassPanel } from "@/components/chrome";
import { LANGUAGES, useLanguage } from "@/lib/language";

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
        <div className="relative max-w-3xl">
            <div
              className="absolute -top-8 -left-6 h-40 w-40 rotate-45 rounded-3xl bg-gradient-to-br from-electric/20 to-primary/10 outline-1 outline-electric/20 drift-b"
              aria-hidden="true"
            />
            <h1
              className="enter-up relative font-display text-[clamp(2rem,5.2vw,3.9rem)] leading-[0.95] tracking-tight"
              style={{ animationDelay: "0.05s" }}
            >
              Actively learning apprentice
              <br />
              for the experienced +
              <br />
              <span className="text-electric">Patient tutor for the new hire</span>
            </h1>
            <p className="enter-up relative mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-electric/90">
              <span className="h-px w-8 bg-electric/60" /> Step one · Set the voice
            </p>
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
                        ? "group relative overflow-hidden rounded-full bg-electric px-5 py-2.5 text-sm font-bold text-ink shadow-lg shadow-primary/20"
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-electric/25 via-primary/15 to-accent/25 outline-1 outline-white/15">
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
