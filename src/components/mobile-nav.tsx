import { useEffect, useRef } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { SECTIONS } from "@/lib/sections";
import siteData from "@/data/siteData.json";

interface MobileNavProps {
  active: string;
}

// Below the `rail` breakpoint there is no vertical rail (N1: mobile is a
// primary target, not an afterthought — this is new work, not in the
// concept notes). A sticky 56px bar plus a horizontally scrollable row of
// section chips. No hamburger: seven items don't need one (Q6).
export function MobileNav({ active }: MobileNavProps) {
  const chipRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const chip = chipRefs.current[active];
    if (!chip) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    chip.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [active]);

  return (
    <div className="rail:hidden sticky top-0 z-40 -mx-5 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6">
      <div className="flex h-14 items-center justify-between px-5 sm:px-6">
        <span className="truncate text-sm font-medium text-foreground">
          {siteData.profile.name}
        </span>
        <ModeToggle />
      </div>
      <nav
        aria-label="Sections"
        className="flex gap-2 overflow-x-auto px-5 pb-3 [scroll-snap-type:x_proximity] sm:px-6"
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
