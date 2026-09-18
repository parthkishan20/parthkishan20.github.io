import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile, resume } from "@/data/adapters";

// Copy verbatim from plan 8.4. "One label per intent" across the
// whole page: the résumé link is always "Read the résumé" wherever it
// appears as a single link (here and in Home's secondary CTA) — the
// Résumé block below has its own two distinct labels ("Open the
// résumé" / "Download PDF") because it offers two different actions,
// not the same one twice.
const contactLines = [
  {
    icon: Mail,
    label: "Email",
    display: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    display: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Location",
    display: profile.location,
    href: null,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    display: "linkedin.com/in/parthkishan20",
    href: profile.links.linkedin,
  },
  {
    icon: Github,
    label: "GitHub",
    display: "github.com/parthkishan20",
    href: profile.links.github,
  },
] as const;

export default function Contact() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.04em]">
        Hiring a full stack developer?
      </h2>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Open to software engineering, AI and machine learning, and
        forward deployed engineer roles. Email reaches me fastest, and
        I answer the same day.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="h-12">
          <a href={`mailto:${profile.email}`}>Email Parth</a>
        </Button>
        <Button variant="outline" asChild size="lg" className="h-12">
          <a href={resume.pdfPath} target="_blank" rel="noopener noreferrer">
            Read the résumé
          </a>
        </Button>
      </div>

      {/* A <ul>, not a <dl>: this is a list of contact methods (each
          with a decorative icon, a label and a value), not a strict
          term/description pairing — axe-core's definition-list rule
          requires a <dl>'s content to be flatly dt/dd/div/script/
          template, and the icon sitting alongside the label+value
          here would violate that (found via Phase 12's Lighthouse
          accessibility audit, not assumed). A plain list sidesteps
          the constraint entirely and is the more accurate semantic
          fit for "ways to reach me" besides. */}
      <ul className="mt-12 grid gap-5">
        {contactLines.map(({ icon: Icon, label, display, href }) => (
          <li key={label} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <span className="block text-xs uppercase tracking-wide text-muted-foreground-2">
                {label}
              </span>
              {/* M5: long identifiers (email, profile URLs) use
                  overflow-wrap: anywhere so they can't blow out the
                  layout at narrow widths. */}
              <span className="mt-0.5 block [overflow-wrap:anywhere]">
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    className="text-foreground transition-colors hover:text-primary"
                  >
                    {display}
                  </a>
                ) : (
                  <span className="text-foreground">{display}</span>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
