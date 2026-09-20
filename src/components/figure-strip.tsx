interface Figure {
  value: string;
  label: string;
  shortLabel: string;
}

interface FigureStripProps {
  figures: readonly Figure[];
}

// Three figures (plan 8.2, Q13 dropped the months figure to two-of-three
// looking arbitrary). Went through several mobile treatments before
// this one - a baseline row, a fully stacked column, a divided list -
// each either cramped or too spacious. This merges the two the user
// actually picked from a live A/B/C/D comparison: B's bounded chip
// cards (structure, so the three read as one grouped set) with D's
// short one-word labels (confidence, so the chip doesn't need a full
// sentence to justify its size). The third chip spans the full row
// when the count is odd, so a lone leftover doesn't look stranded.
// `sm` and up reverts to the original 3-column grid with the full
// descriptive sentence - that layout was never the complaint, only
// the mobile one was, and desktop has the room a sentence needs.
export function FigureStrip({ figures }: FigureStripProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {figures.map((figure, index) => (
          <div
            key={figure.label}
            className={`flex flex-col gap-1.5 rounded-xl bg-muted p-4 ${
              index === figures.length - 1 && figures.length % 2 !== 0
                ? "col-span-2"
                : ""
            }`}
          >
            <span className="font-display text-2xl font-semibold leading-none tracking-[-0.03em] tabular-nums text-foreground">
              {figure.value}
            </span>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {figure.shortLabel}
            </span>
          </div>
        ))}
      </div>

      <div className="hidden sm:grid sm:grid-cols-3 sm:gap-6">
        {figures.map((figure) => (
          <div key={figure.label} className="flex flex-col items-start gap-1.5">
            <span className="font-display text-[clamp(28px,4vw,44px)] font-semibold leading-none tracking-[-0.03em] tabular-nums text-foreground">
              {figure.value}
            </span>
            <span className="text-[15px] text-muted-foreground">
              {figure.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
