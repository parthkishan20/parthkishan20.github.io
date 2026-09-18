import { roles } from "@/data/adapters";

// notes-from-artifacts.md entry 3. Base: meta stacked above bullets, no
// sticky. md: two columns (0.8fr/2fr), still no sticky — a sticky meta
// column fights nothing at md, since there's no header there either,
// but the plan reserves sticky for rail only where it's guaranteed a
// long job actually has room to pin against. rail: meta becomes sticky,
// self-start required or the sticky silently does nothing inside a grid
// row (6.3 acceptance).
export default function Experience() {
  return (
    <div className="divide-y divide-border/60">
      {roles.map((job) => (
        <article
          key={job.company}
          className="grid gap-5 py-10 first:pt-0 md:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] md:gap-14 md:py-14"
        >
          <div className="rail:sticky rail:top-6 rail:self-start">
            <h3 className="text-2xl tracking-tight md:text-3xl">
              {job.company}
            </h3>
            <div className="mt-2 text-[15px] text-muted-foreground">
              {job.role}, {job.location}
            </div>
            <div className="mt-1 text-sm tabular-nums text-muted-foreground">
              {job.dates}
            </div>
          </div>

          <ul className="grid gap-[18px]">
            {job.bullets.map((bullet, i) => (
              <li
                key={i}
                className="max-w-[68ch] leading-relaxed text-muted-foreground"
              >
                {bullet.lead && (
                  <strong className="font-semibold text-foreground">
                    {bullet.lead}
                  </strong>
                )}
                {bullet.rest}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
