import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { SECTIONS } from "@/lib/sections";
import siteData from "@/data/siteData.json";

interface RailNavProps {
  active: string;
}

// Desktop-only identity rail (notes-from-artifacts.md entry 6). Replaces the
// shadcn SidebarProvider: one <aside>, no provider, no collapse state, no
// icons. Below the `rail` breakpoint this renders nothing (see MobileNav).
export function RailNav({ active }: RailNavProps) {
  const { name, title, email, links } = siteData.profile;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <aside className="hidden rail:flex rail:flex-col rail:sticky rail:top-0 rail:h-dvh rail:pt-12 rail:pb-10">
      <div className="flex items-center gap-3.5">
        <Avatar className="h-[52px] w-[52px]">
          <AvatarImage src="/images/profile/avatar.png" alt={name} />
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
        <ModeToggle />
      </div>
    </aside>
  );
}
