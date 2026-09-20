import type { ReactNode } from "react";

interface StatusPillProps {
  children: ReactNode;
}

// notes-from-artifacts.md entry 1, adapted to the soft shape system
// (plan 4.4): a 1px border instead of the artifact's 2px brutalist one,
// and a round dot instead of a square one. Full pill radius (apple-
// design-system) instead of a fixed px value now that it's a StatusPill
// in name and shape both. The blink stays `steps(1, end)` (see
// .animate-status-blink in index.css) — a status light, not a
// breathing pulse — and the dot is aria-hidden since the text next to
// it already carries the meaning.
export function StatusPill({ children }: StatusPillProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-[7px] font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-foreground">
      <span
        aria-hidden="true"
        className="block h-2 w-2 shrink-0 rounded-full bg-ok animate-status-blink"
      />
      {children}
    </span>
  );
}
