import { useEffect, useRef } from "react";
import { createAgentField } from "@/lib/agent-field/engine";

// Decorative layer of AI agent cursors - an orchestrator handing out
// tasks, workers typing terminal logs, and pairs trading chat bubbles,
// working on the real elements of the page (see
// src/lib/agent-field/engine.ts). It sits above the content at z-30,
// under the mobile nav bar (z-40) and back-to-top (z-50), and never
// takes pointer events, so every link and button still works through
// it. 60% opacity keeps it between quiet and noticeable. Under
// prefers-reduced-motion it paints one still frame.
export function AgentField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let destroy = createAgentField(canvas, { still: mq.matches, above: true });
    const onChange = () => {
      destroy();
      destroy = createAgentField(canvas, { still: mq.matches, above: true });
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      destroy();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="agent-field pointer-events-none fixed inset-0 z-30 h-full w-full opacity-60 print:hidden"
    />
  );
}
