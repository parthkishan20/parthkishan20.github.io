import { useEffect, useRef, useState } from "react";

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
export function useReveal<T extends HTMLElement = HTMLElement>(
  { threshold = 0.15, rootMargin = "0px" }: UseRevealOptions = {}
) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (revealed) return;
    const el = ref.current;
    if (!el) return;

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
  }, [revealed, threshold, rootMargin]);

  return { ref, revealed };
}
