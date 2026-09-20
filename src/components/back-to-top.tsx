import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

// The old animation library's AnimatePresence removed (Phase 11,
// Q10): the element stays mounted and is toggled with the native
// `hidden` attribute
// instead of being conditionally rendered, so a CSS transition (see
// .back-to-top in index.css) can animate it in and out — including the
// exit, via `transition-behavior: allow-discrete` + `@starting-style`,
// which lets a transition run across a display:none boundary. Browsers
// without that support just pop instantly; still fully functional,
// same "CSS enhancement, no library, plain fallback" shape as the
// project pan.
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // rAF-throttled and synced once up front. Without the initial call the
  // listener only ever runs *after* the first user scroll, so a page
  // opened deep-linked (#contact) or restored below the threshold showed
  // no button at all until the reader scrolled again. Without the
  // throttle this ran a layout-flushing window.scrollY read on every
  // scroll event — ~120/s on a high-refresh trackpad — on the same
  // frames the rail nav is already flipping aria-current.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setIsVisible((prev) => {
        // Split thresholds, not one bare `scrollY > 300`. The button is
        // toggled with the `hidden` attribute and .back-to-top animates
        // across that display change over 220ms, so trackpad jitter
        // across a single boundary restarted the transition over and
        // over and the button strobed instead of fading once.
        const next = prev ? window.scrollY > 240 : window.scrollY > 360;
        return next === prev ? prev : next;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    // No explicit `behavior`. Passing "smooth" here overrides the
    // computed scroll-behavior, which is exactly what the reduced-motion
    // block in index.css sets to `auto !important` — so the one user who
    // has asked not to be flung across the page was the one user who
    // got flung. Omitting it defers to that computed value.
    window.scrollTo({ top: 0 });
  };

  return (
    <div hidden={!isVisible} className="back-to-top fixed bottom-8 right-8 z-50">
      <Button
        onClick={scrollToTop}
        size="icon"
        className="rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_6px_28px_rgba(0,0,0,0.12)]"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
}
