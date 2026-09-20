import { CalendarCheck, PartyPopper, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { community, getCommunityBlurb } from "@/data/adapters";

// Card anatomy matches certifications.tsx's promo-card recipe
// (apple-content-hierarchy): eyebrow -> headline -> body -> metadata,
// not the date-first/bolded-org-in-prose layout this used to have. The
// date was sitting in the eyebrow slot even though it's metadata, not
// a category, and `org` was bolded mid-sentence in the body instead of
// getting its own slot — neither is a real Apple pattern. Now org is
// the eyebrow (same mono/uppercase/tracked treatment certifications
// gives its issuer), role is the headline, the body is one tightened
// benefit-led sentence (see communityBlurbs in adapters.ts), and dates
// move to a quiet metadata row at the bottom, same spot certifications
// puts its year. Three parts, same order every time. One column at
// base, two from sm, three from lg (this block's own breakpoints, not
// the site-wide `rail` used elsewhere in Background).
//
// The badge is a category glyph, not the letter-monogram certifications
// falls back to. None of these clubs are a real, identifiable brand
// with a verifiable mark the way an issuer in brand-icons.tsx is
// (nominative use of an actual logo) — a monogram there would just be
// standing in for a missing brand asset. A glyph instead names *what
// the role was*, the same job an SF Symbol does in an Apple feature
// tile: Sparkles for the AI club's workshops/speaker circuit,
// CalendarCheck for the 30+-event logistics role, PartyPopper for the
// cultural-festival team. Users is the drift-guard default so a future
// entry with no mapping still renders a sensible glyph instead of
// nothing.
const communityIcons: Record<string, LucideIcon> = {
  "SPY – The Graduate AI Club, Stevens Institute of Technology": Sparkles,
  "Student Club IDE, GEC Gandhinagar": CalendarCheck,
  "Event Management, GEC Gandhinagar": PartyPopper,
};

function getCommunityIcon(org: string): LucideIcon {
  return communityIcons[org] ?? Users;
}

export default function Extracurricular() {
  return (
    <div id="extracurricular">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Community
      </h3>

      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {community.map((item) => {
          const Icon = getCommunityIcon(item.org);
          return (
            <article
              key={`${item.org}-${item.dates}`}
              className="flex flex-col gap-3 rounded-lg bg-card p-6 transition-transform duration-[220ms] hover:-translate-y-[3px]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <Icon className="h-6 w-6" />
              </div>

              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {item.org}
                </p>
                <h4 className="mt-1 text-lg font-semibold leading-snug tracking-[-0.01em]">
                  {item.role}
                </h4>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {getCommunityBlurb(item.org, item.summary)}
              </p>

              <span className="mt-auto pt-2 text-xs tabular-nums text-muted-foreground">
                {item.dates}
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}
