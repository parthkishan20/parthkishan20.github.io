import { GitHubStats } from "@/components/github-stats";
import { aboutHighlights, aboutIntro, skillGroups } from "@/data/adapters";

export default function About() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="max-w-[64ch]">
          <h2 className="text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.015em]">
            How I build.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {aboutIntro}
          </p>
          <ul className="mt-6 grid gap-4">
            {aboutHighlights.map((item, i) => (
              <li key={i} className="leading-relaxed text-muted-foreground">
                {item.lead && (
                  <strong className="font-semibold text-foreground">
                    {item.lead}
                  </strong>
                )}
                {item.rest}
              </li>
            ))}
          </ul>
        </div>

        <aside>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            What I reach for first
          </h3>
          <dl className="mt-4 grid gap-4">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  {group.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-primary">
                  {group.primary.join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          GitHub activity
        </h3>
        <div className="mt-4">
          <GitHubStats />
        </div>
      </div>
    </div>
  );
}
