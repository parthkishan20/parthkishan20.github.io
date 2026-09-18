import { useEffect, useState } from "react";

// Replaces the window.scroll + offsetTop comparison that used to live in
// layout.tsx (D3). One IntersectionObserver, no work on scroll frames.
// `ids` must be a module-level constant array — see src/lib/sections.ts —
// so this effect does not re-subscribe on every render.
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
