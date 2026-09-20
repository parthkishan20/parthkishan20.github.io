import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/status-pill";
import { FigureStrip } from "@/components/figure-strip";
import { homeFigures, profile, resume } from "@/data/adapters";

// Hero load stagger (plan 4.6): opacity/translateY, 880ms, children
// delayed 40/130/220/310ms - one entry per hero block. This is a
// mount-triggered stagger, not the scroll-triggered `useReveal`: the
// hero is above the fold on load, so there's nothing to scroll into
// view yet. Plain CSS transitions, no animation library, so the
// global prefers-reduced-motion override in index.css collapses it
// for free.
const STAGGER_MS = [20, 55, 90, 130, 170] as const;
const REVEAL_TRANSITION =
  "transition-all duration-[560ms] ease-[cubic-bezier(0.16,1,0.3,1)]";

export default function Home() {
  const [revealed, setRevealed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (revealed) return;
    // One frame between the initial (hidden) paint and flipping the
    // class, or the transition never has a starting state to run from.
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, [revealed]);

  const revealClass = `${REVEAL_TRANSITION} ${
    revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
  }`;
  const revealStyle = (index: number) => ({
    transitionDelay: `${STAGGER_MS[index]}ms`,
  });

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <div className="flex max-w-2xl flex-col items-start gap-6">
        <div
          style={revealStyle(0)}
          className={`${revealClass} flex flex-wrap items-center gap-3`}
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground rail:hidden">
            {profile.title}
          </span>
          <StatusPill>Open to full-time roles</StatusPill>
        </div>

        <h1
          style={revealStyle(1)}
          className={`${revealClass} text-[clamp(36px,6.4vw,76px)] font-semibold leading-[1.05] tracking-[-0.018em]`}
        >
          I build the part people touch.
        </h1>

        <p
          style={revealStyle(2)}
          className={`${revealClass} text-lg leading-relaxed text-muted-foreground`}
        >
          React and TypeScript up front, FastAPI and Python behind it -
          tested before anyone else sees it.
        </p>

        <div
          style={revealStyle(3)}
          className={`${revealClass} flex w-full flex-col gap-2 sm:w-auto sm:flex-row`}
        >
          <Button asChild size="lg" className="h-12 gap-2">
            <a href="#projects">
              See what I've built
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" asChild size="lg" className="h-12">
            <a href={resume.pdfPath} target="_blank" rel="noopener noreferrer">
              Read the résumé
            </a>
          </Button>
        </div>
      </div>

      <FigureStrip figures={homeFigures} />
    </div>
  );
}
