import { roles, type Role } from "@/data/adapters";
import { useReveal } from "@/hooks/use-reveal";

// Opacity-only fade, not the usual opacity+translateY reveal: this
// article's meta column is `rail:sticky`, and a transform on an
// ancestor changes a sticky element's containing block in most
// browsers, silently breaking the stick. Opacity doesn't have that
// side effect, so it's the one motion property safe to animate here.
function JobEntry({ job }: { job: Role }) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <article
      ref={ref}
      className={`grid gap-5 py-10 first:pt-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] md:gap-14 md:py-14 ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="rail:sticky rail:top-6 rail:self-start">
        <h3 className="text-2xl tracking-tight md:text-3xl">{job.company}</h3>
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
  );
}

// notes-from-artifacts.md entry 3. Base: meta stacked above bullets, no
// sticky. md: two columns (0.8fr/2fr), still no sticky — a sticky meta
// column fights nothing at md, since there's no header there either,
// but the plan reserves sticky for rail only where it's guaranteed a
// long job actually has room to pin against. rail: meta becomes sticky,
// self-start required or the sticky silently does nothing inside a grid
// row (6.3 acceptance).
export default function Experience() {
  return (
    <div className="flex flex-col gap-10 md:gap-14">
      <h2 className="max-w-[42ch] text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.015em]">
        Two internships, both spent putting software in front of
        strangers.
      </h2>

      <div className="divide-y divide-border/60">
        {roles.map((job) => (
          <JobEntry key={job.company} job={job} />
        ))}
      </div>
    </div>
  );
}
