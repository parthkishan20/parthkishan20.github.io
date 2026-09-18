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

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div hidden={!isVisible} className="back-to-top fixed bottom-8 right-8 z-50">
      <Button
        onClick={scrollToTop}
        size="icon"
        className="rounded-full shadow-lg transition-shadow hover:shadow-xl"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
}
