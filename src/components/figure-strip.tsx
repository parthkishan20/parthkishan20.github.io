interface Figure {
  value: string;
  label: string;
}

interface FigureStripProps {
  figures: readonly Figure[];
}

// Three figures (plan 8.2, Q13 dropped the months figure to two-of-three
// looking arbitrary). Base: one column, each figure a row with the
// number in a fixed 72px column so labels start on a shared edge. `sm`
// and up: three equal columns, number above label. Display face,
// tabular-nums so the digits themselves don't jitter between figures.
export function FigureStrip({ figures }: FigureStripProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
      {figures.map((figure) => (
        <div
          key={figure.label}
          className="flex items-baseline gap-4 sm:flex-col sm:items-start sm:gap-1.5"
        >
          <span className="w-[72px] shrink-0 font-display text-[clamp(28px,4vw,44px)] font-bold leading-none tracking-[-0.03em] tabular-nums text-foreground sm:w-auto">
            {figure.value}
          </span>
          <span className="text-sm text-muted-foreground sm:text-[15px]">
            {figure.label}
          </span>
        </div>
      ))}
    </div>
  );
}
