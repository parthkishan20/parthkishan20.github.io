import { ArrowUpRight } from "lucide-react";
import { AnthropicIcon, LinkedInIcon, UdemyIcon } from "@/components/brand-icons";
import { certificationGroups } from "@/data/adapters";

// Nine certifications in three issuer groups (plan 9). One column at
// base, two from md, three at rail. Each card links to its
// verification URL — target="_blank" rel="noopener" exactly as
// specified (not the noopener-noreferrer pattern used elsewhere on the
// site; verification services can reasonably want the referrer).
//
// Card anatomy follows Apple's spec-list recipe (group heading, then
// label:value rows) rather than its promo-card recipe: this is proof
// content — real credential titles and verification links — not
// marketing copy, so the layout leads with the issuer as a plain
// eyebrow and ends with a clear "Verify" action instead of fusing the
// issuer and the link into one decorative line.
//
// The tile shows a real issuer mark where one exists at a safe source
// (see brand-icons.tsx) and falls back to a plain letter monogram
// otherwise — Bloomberg has no such source, so it stays type-only.
function getIssuerIcon(issuer: string) {
  if (issuer === "Anthropic") return AnthropicIcon;
  if (issuer.startsWith("Udemy")) return UdemyIcon;
  if (issuer === "LinkedIn Learning") return LinkedInIcon;
  return null;
}

export default function Certifications() {
  return (
    <div id="certifications">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Certifications
      </h3>

      <div className="mt-5 flex flex-col gap-8">
        {certificationGroups.map((group) => (
          <div key={group.label}>
            <h4 className="text-base font-semibold text-foreground">
              {group.label}
            </h4>
            {/* Plain `rail:` again. This used to need an arbitrary
                [@media(min-width:1160px)] variant because the custom
                breakpoint sorted before md: and lost the cascade — that
                was the px/rem unit bug, now fixed at the source in
                index.css, so the workaround is no longer needed here. */}
            <div className="mt-3 grid gap-4 md:grid-cols-2 rail:grid-cols-3">
              {group.certifications.map((cert) => {
                const Icon = getIssuerIcon(cert.issuer);
                return (
                  <a
                    key={cert.name}
                    href={cert.link}
                    target="_blank"
                    rel="noopener"
                    className="flex flex-col gap-3 rounded-lg bg-card p-4 transition-transform duration-[220ms] hover:-translate-y-[3px]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                      {Icon ? (
                        <Icon className="h-4 w-4" />
                      ) : (
                        <span className="font-mono text-sm font-semibold">
                          {cert.issuer.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {cert.issuer}
                      </p>
                      <h5 className="mt-1 font-semibold leading-snug tracking-[-0.01em]">
                        {cert.name}
                      </h5>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {cert.year}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                        Verify
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
