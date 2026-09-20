import { skillGroups } from "@/data/adapters";

// notes-from-artifacts.md entry 5. Definition list, not a badge grid —
// the accent lead clause carries real hierarchy (what's reached for
// daily) that a wall of equal-weight chips can't. Base: term above
// description. md: 210px term column, items-baseline so the mono term
// sits on the same baseline as the description's first line, not
// centred against the whole block. Seven rows, one hairline each.
export default function Skills() {
  return (
    <div className="flex flex-col gap-10">
      <h2 className="max-w-[24ch] text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.015em]">
        How I work.
      </h2>

      <dl className="grid">
        {skillGroups.map((group) => (
          <div
            key={group.label}
            className="grid gap-2 border-b border-border/60 py-7 first:pt-0 md:grid-cols-[210px_minmax(0,1fr)] md:items-baseline md:gap-12"
          >
            <dt className="font-mono text-[12.5px] tracking-wide text-muted-foreground-2">
              {group.label}
            </dt>
            <dd className="m-0 max-w-[62ch] text-[17px] leading-[1.7]">
              <strong className="font-semibold text-primary">
                {group.primary.join(", ")}.
              </strong>{" "}
              {group.rest}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
