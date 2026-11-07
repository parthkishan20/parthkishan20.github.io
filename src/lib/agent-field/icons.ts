import type { AgentName } from "./script";

// One lucide icon per agent role, as SVG path data on lucide's 24x24
// grid, drawn on the canvas with Path2D (stroke 2, round caps). Copied
// from lucide-react 0.544 (ISC license) because the package exposes
// these only as React components; its <rect> and <circle> elements are
// rewritten here as equivalent paths.
//
//   Orchestrator  network        - the hub that routes work
//   Researcher    book-open      - reads the page
//   Coder         code-xml       - edits the source
//   Tester        flask-conical  - runs experiments, clicks things
//   Reviewer      scan-eye       - inspects and measures
//   Writer        pen-line       - edits the copy
export const AGENT_ICONS: Record<AgentName, string[]> = {
  Orchestrator: [
    "M17 16h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
    "M3 16h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
    "M10 2h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
    "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",
    "M12 12V8",
  ],
  Researcher: [
    "M12 7v14",
    "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
  ],
  Coder: ["m18 16 4-4-4-4", "m6 8-4 4 4 4", "m14.5 4-5 16"],
  Tester: [
    "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
    "M6.453 15h11.094",
    "M8.5 2h7",
  ],
  Reviewer: [
    "M3 7V5a2 2 0 0 1 2-2h2",
    "M17 3h2a2 2 0 0 1 2 2v2",
    "M21 17v2a2 2 0 0 1-2 2h-2",
    "M7 21H5a2 2 0 0 1-2-2v-2",
    "M13 12a1 1 0 1 1-2 0a1 1 0 1 1 2 0",
    "M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0",
  ],
  Writer: [
    "M13 21h8",
    "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
  ],
};
