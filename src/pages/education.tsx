import { education } from "@/data/adapters";

// Phase 9 renders Education, Certifications and Community as three
// blocks inside one shared <Section id="background"> (App.tsx). Each
// keeps its own pre-redesign id so the three old deep links
// (#education, #certifications, #extracurricular) keep working; the
// offset that stops them landing under the sticky mobile bar is
// `html { scroll-padding-top }` in index.css, so these three no longer
// carry a scroll-mt of their own.
// The overall Background heading ("Study, credentials and community.",
// plan 8.3) lives here since Education renders first among the three.
export default function Education() {
  return (
    <div id="education">
      <h2 className="max-w-[26ch] text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.015em]">
        Study, credentials and community.
      </h2>

      <h3 className="mt-10 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Education
      </h3>

      <div className="mt-5 flex flex-col gap-8">
        {education.map((edu) => (
          <article
            key={edu.school}
            className="flex flex-col justify-between gap-3 border-b border-border/60 pb-8 last:border-b-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <div className="min-w-0">
              <h4 className="text-lg font-semibold tracking-[-0.01em] md:text-xl">
                {edu.school}
              </h4>
              <p className="mt-1 text-[15px] text-muted-foreground">
                {edu.degree}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {edu.location}
              </p>
            </div>

            <div className="shrink-0 sm:text-right">
              <div className="font-display text-xl font-semibold tabular-nums tracking-[-0.015em] text-foreground">
                {edu.gpa}
              </div>
              <div className="mt-1 text-sm tabular-nums text-muted-foreground">
                {edu.dates}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
