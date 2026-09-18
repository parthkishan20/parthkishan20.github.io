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

    // rootMargin leaves a detection band between 35% and 40% of the
    // viewport height. Sections are far taller than that band, so at a
    // section boundary two adjacent sections intersect at once and the
    // observer has to pick one.
    //
    // The rule is "the lower of the two wins", and the reason it has to
    // be evaluated against a running set rather than against `entries`
    // is that the callback is only handed the targets whose state
    // *changed* this tick. The other half of an overlap is usually a
    // section that crossed into the band seconds ago and is not in the
    // batch at all, so a loop over `entries` alone cannot see it. The
    // previous version looped over `entries` and kept the last
    // intersecting one, which resolved to DOM order only when both
    // sections happened to cross in the same frame and was otherwise
    // decided by whichever crossing arrived last.
    //
    // Deliberately a Set of ids, not stored IntersectionObserverEntry
    // geometry: with the default threshold of [0] a target's
    // intersectionRect is only sampled at the moment it crosses the
    // band edge, so a still-intersecting section's rect is stale and
    // comparing those rects would be measuring nothing.
    //
    // Net behaviour, and it is symmetric: the highlight moves to the
    // next section once that section covers everything below the band —
    // about 60% of the viewport — whether the reader is scrolling down
    // or up.
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) intersecting.add(id);
          else intersecting.delete(id);
        }

        // Last in DOM order == lowest on the page.
        let lowest: string | undefined;
        for (const id of ids) {
          if (intersecting.has(id)) lowest = id;
        }

        // Nothing in the band — a fast fling, or the gap above the first
        // section. Keep the last answer rather than blanking the nav.
        if (lowest) setActive(lowest);
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
