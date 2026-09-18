import type { ReactNode } from "react";
import { RailNav } from "@/components/rail-nav";
import { MobileNav } from "@/components/mobile-nav";
import { useActiveSection } from "@/hooks/use-active-section";
import { SECTION_IDS } from "@/lib/sections";

interface SiteShellProps {
  children: ReactNode;
}

// Replaces SidebarProvider entirely (plan section 4.2 / notes entry 6).
// Two columns at `rail` and up (300px rail + content); a single column
// with the sticky header/chip bar below it (M1: gutter set once, here).
export function SiteShell({ children }: SiteShellProps) {
  const active = useActiveSection(SECTION_IDS);

  return (
    <div className="site-shell mx-auto w-full max-w-[1440px] px-5 sm:px-6 rail:grid rail:grid-cols-[300px_minmax(0,1fr)] rail:gap-[72px] rail:px-10">
      <RailNav active={active} />
      <MobileNav active={active} />
      <main id="main" tabIndex={-1} className="min-w-0">
        {children}
      </main>
    </div>
  );
}
