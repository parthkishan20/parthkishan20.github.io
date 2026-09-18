import { useCallback, useEffect, useState } from "react";

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

// Replaces the old animation library's `whileInView` fade/slide
// reveals (D12, Q10 — the CSS-plus-IntersectionObserver approach
// adopted once every page is rewritten). One observer per element,
// unobserved as soon as it fires
// once (plan section 4.6: "fire once"). Starts already revealed when
// prefers-reduced-motion is on, so nothing is ever stuck at opacity: 0
// for a user who never triggers the intersection (or whose browser
// never re-renders the transition).
//
// The target is tracked as state behind a callback ref, not a useRef.
// A plain useRef is populated *after* the effect's first run, so a
// consumer that mounts its ref'd node later than the hook — GitHubStats
// renders a skeleton until its fetch resolves, so the ref'd grid does
// not exist on mount — never got an observer at all, and nothing
// re-triggered the effect once the node appeared. The element then sat
// at opacity: 0 permanently. A callback ref re-runs the effect at the
// moment the node actually attaches, whenever that is.
export function useReveal<T extends HTMLElement = HTMLElement>(
  { threshold = 0.15, rootMargin = "0px" }: UseRevealOptions = {}
) {
  const [el, setEl] = useState<T | null>(null);
  const ref = useCallback((node: T | null) => {
    setEl(node);
  }, []);
  const [revealed, setRevealed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (revealed || !el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [el, revealed, threshold, rootMargin]);

  return { ref, revealed };
}
