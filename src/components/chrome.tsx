import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";

/** Ambient kinetic-glass background: drifting color blobs + faint grid. */
export function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute -top-48 -left-24 h-[36rem] w-[36rem] rounded-full bg-electric/25 blur-[130px] drift-a" />
      <div className="absolute bottom-[-12rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-indigo-500/30 blur-[130px] drift-b" />
      <div className="absolute top-1/3 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-fuchsia-500/15 blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:66px_66px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
    </div>
  );
}

/** Top rail with brand, current part indicator and active agent language. */
export function TopRail({ part }: { part: string }) {
  const { language } = useLanguage();
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12 lg:px-16">
      <Link to="/" className="flex items-center gap-3 enter-up">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-electric/15 outline-1 outline-electric/40">
          <span className="h-2.5 w-2.5 rounded-full bg-electric pulse-dot" />
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/60">
          Knowledge Never Fades
        </span>
      </Link>
      <div className="flex items-center gap-3 enter-up" style={{ animationDelay: "0.08s" }}>
        <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-electric/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-electric outline-1 outline-electric/30">
          Agent · {language.short}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-electric pulse-dot" />
          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
            {part}
          </span>
        </span>
      </div>
    </header>
  );
}

/** Glass panel wrapper used across modules. */
export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-3xl bg-glass backdrop-blur-xl outline-1 outline-glass-border p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] ${className}`}
    >
      {children}
    </div>
  );
}
