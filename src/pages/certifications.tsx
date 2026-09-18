import { ExternalLink } from "lucide-react";
import { certificationGroups } from "@/data/adapters";

// Nine certifications in three issuer groups (plan 9). One column at
// base, two from md, three at rail. Each card links to its
// verification URL — target="_blank" rel="noopener" exactly as
// specified (not the noopener-noreferrer pattern used elsewhere on the
// site; verification services can reasonably want the referrer).
export default function Certifications() {
  return (
    <div id="certifications" className="scroll-mt-[72px] rail:scroll-mt-6">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Certifications
      </h3>

      <div className="mt-5 flex flex-col gap-8">
        {certificationGroups.map((group) => (
          <div key={group.label}>
            <h4 className="text-sm font-medium text-muted-foreground">
              {group.label}
            </h4>
            {/* [@media(min-width:1160px)] instead of rail: — Tailwind v4
                orders this custom breakpoint's generated rules before
                md:'s in the stylesheet (confirmed via computed-style
                testing, not assumed), so at >=1160px the later md:
                rule was winning the cascade and grid-cols-3 never
                applied. An arbitrary media variant sidesteps whatever
                sorts named custom breakpoints incorrectly, since it's
                inserted as a literal at-rule rather than going through
                that ordering. */}
            <div className="mt-3 grid gap-4 md:grid-cols-2 [@media(min-width:1160px)]:grid-cols-3">
              {group.certifications.map((cert) => (
                <a
                  key={cert.name}
                  href={cert.link}
                  target="_blank"
                  rel="noopener"
                  className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 transition-[border-color,transform] duration-[220ms] hover:-translate-y-[3px] hover:border-muted-foreground-2"
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                    <h5 className="min-w-0 flex-1 font-semibold leading-snug tracking-tight">
                      {cert.name}
                    </h5>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {cert.year}
                    </span>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    {cert.issuer}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
