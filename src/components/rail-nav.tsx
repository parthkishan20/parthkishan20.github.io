import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SECTIONS } from "@/lib/sections";
import { profile } from "@/data/adapters";

interface RailNavProps {
  active: string;
}

// Desktop-only identity rail (notes-from-artifacts.md entry 6). Replaces the
// shadcn SidebarProvider: one <aside>, no provider, no collapse state, no
// icons. Below the `rail` breakpoint this renders nothing (see MobileNav).
//
// `rail:overflow-y-auto` is load-bearing, not decoration. The rail needs
// ~662px of height; it is `sticky top-0` at a hard `h-dvh`, so on a
// shorter viewport the overflow sat below the fold at *every* scroll
// position — no scroll could reach it, because the box itself never
// moves. Measured at 1280x560 the mode toggle was stranded at y 586-622,
// and at rail widths this is the only theme control on the page since
// MobileNav is `rail:hidden`. That is a 1366x768 laptop with a bookmarks
// bar, or any window at 125% zoom — not an exotic case. Deliberately no
// overscroll-behavior: contain here, so the wheel still chains to the
// page when the pointer happens to be over the rail.
export function RailNav({ active }: RailNavProps) {
  const { name, title, email, links } = profile;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <aside className="site-rail hidden rail:flex rail:flex-col rail:sticky rail:top-0 rail:h-dvh rail:overflow-y-auto rail:pt-12 rail:pb-10">
      <div className="flex items-center gap-3.5">
        {/* Phase 13 / D5: the only on-page usage of the profile photo
            is this 52px rail slot (Q8), yet the source file was a
            687 KB 1024x1024 PNG. avatar-104.webp is a 104x104 (2x
            retina) WebP generated from it, 3.7 KB. The original PNG
            stays in public/ unchanged — it's also the og:image /
            twitter:image meta target (index.html), a genuinely
            different use case (a social-preview card wants a large
            image) that this defect isn't about and isn't asked to
            touch. width/height describe the rendered CSS box (52px),
            not the source file's pixel count, so the browser reserves
            the right space before the image loads (no CLS). */}
        <Avatar className="h-[52px] w-[52px]">
          <AvatarImage
            src="/images/profile/avatar-104.webp"
            alt={name}
            width={52}
            height={52}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{title}</p>
        </div>
      </div>

      <nav aria-label="Sections" className="mt-11">
        <ol className="grid gap-0.5">
          {SECTIONS.map((section, index) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive}
                  className="flex min-h-11 items-baseline gap-3 border-l-2 border-border pl-3.5 text-[15px] text-muted-foreground transition-colors duration-[240ms] hover:text-foreground aria-[current=true]:border-l-primary aria-[current=true]:font-medium aria-[current=true]:text-foreground"
                >
                  <span className="font-mono text-[11.5px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.label}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-auto grid gap-2.5 pt-8">
        <a
          href={`mailto:${email}`}
          className="text-sm text-muted-foreground transition-colors duration-[240ms] hover:text-foreground [overflow-wrap:anywhere]"
        >
          {email}
        </a>
        <a
          href={links.github}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground transition-colors duration-[240ms] hover:text-foreground"
        >
          GitHub
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground transition-colors duration-[240ms] hover:text-foreground"
        >
          LinkedIn
        </a>
      </div>
    </aside>
  );
}
