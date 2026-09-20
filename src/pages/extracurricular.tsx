import { community } from "@/data/adapters";

// notes-from-artifacts.md entry 2, adapted to the soft shape system
// (4.4: 1px border, standard card hover instead of the artifact's hard
// offset shadow + translate; radius now comes from the shared
// apple-design-system --radius scale in index.css). Three parts per
// card, in
// the same order every time: date kicker, role as the heading,
// organisation bolded as the lead-in to the summary sentence. One
// column at base, two from sm, three from lg (this block's own
// breakpoints, not the site-wide `rail` used elsewhere in Background).
export default function Extracurricular() {
  return (
    <div id="extracurricular">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Community
      </h3>

      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {community.map((item) => (
          <article
            key={`${item.org}-${item.dates}`}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6 transition-[border-color,transform] duration-[220ms] hover:-translate-y-[3px] hover:border-muted-foreground-2"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {item.dates}
            </span>
            <h4 className="text-lg font-semibold tracking-[-0.01em]">
              {item.role}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">
                {item.org}.
              </strong>{" "}
              {item.summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
