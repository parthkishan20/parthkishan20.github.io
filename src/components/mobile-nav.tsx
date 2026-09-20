import { useEffect, useRef } from "react";
import { SECTIONS } from "@/lib/sections";
import { profile } from "@/data/adapters";

interface MobileNavProps {
  active: string;
}

// Below the `rail` breakpoint there is no vertical rail (N1: mobile is a
// primary target, not an afterthought — this is new work, not in the
// concept notes). A sticky 56px bar plus a horizontally scrollable row of
// section chips. No hamburger: seven items don't need one (Q6).
export function MobileNav({ active }: MobileNavProps) {
  const chipRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const stripRef = useRef<HTMLElement | null>(null);

  // Keep the active chip in view by scrolling *the strip*, never via
  // scrollIntoView.
  //
  // scrollIntoView walks every scrollable ancestor up to and including
  // the viewport and scrolls each one — `block: "nearest"` only makes
  // the target offset equal the current offset, it does not skip the
  // box. Scrolling the root scroller cancels any scroll animation
  // already running on it, and `html` has `scroll-behavior: smooth`. So
  // tapping a distant chip started a smooth page scroll, useActiveSection
  // then fired once per section crossed, and each of those re-ran this
  // effect and killed the page scroll mid-flight. The page stalled
  // part-way and the chip strip ping-ponged through every chip on the
  // way. It also fired on mount, cancelling the browser's own scroll to
  // a deep-linked fragment.
  //
  // The visibility guard is the other half: without it this yanks the
  // strip back every time the active section changes, even when the
  // reader has deliberately scrolled the strip to look ahead.
  useEffect(() => {
    const chip = chipRefs.current[active];
    const strip = stripRef.current;
    if (!chip || !strip) return;

    const stripRect = strip.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    if (chipRect.left >= stripRect.left && chipRect.right <= stripRect.right) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    strip.scrollTo({
      left: chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [active]);

  return (
    <div className="rail:hidden sticky top-0 z-40 -mx-5 border-b border-border/60 bg-background/95 backdrop-blur-[20px] backdrop-saturate-[180%] supports-[backdrop-filter]:bg-background/80 sm:-mx-6">
      <div className="flex h-14 items-center px-5 sm:px-6">
        <span className="truncate text-sm font-medium text-foreground">
          {profile.name}
        </span>
      </div>
      {/* overscroll-behavior-x: contain — swiping past either end of the
          chip row used to chain to the page and fire the browser's
          back/forward navigation gesture on iOS Safari and Chrome
          Android. The project's other horizontal scroller (ProjectPan)
          already contained it; this one was missed. */}
      <nav
        ref={stripRef}
        aria-label="Sections"
        className="flex gap-2 overflow-x-auto px-5 pb-3 [overscroll-behavior-x:contain] [scrollbar-width:thin] [scroll-snap-type:x_proximity] sm:px-6"
      >
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <a
              key={section.id}
              ref={(el) => {
                chipRefs.current[section.id] = el;
              }}
              href={`#${section.id}`}
              aria-current={isActive}
              className="flex min-h-11 shrink-0 items-center rounded-lg border border-border px-4 text-sm text-muted-foreground [scroll-snap-align:center] transition-colors duration-[240ms] hover:text-foreground aria-[current=true]:border-primary aria-[current=true]:text-foreground"
            >
              {section.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
