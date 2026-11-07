// Cast and copy for the agent field. Task log lines are not stored
// here - the engine writes them from the real element an agent is
// working on (its text, its link, the page file it lives in). What is
// here is the team, which page file renders each section, and the
// short follow-up exchanges that can happen after a task.

export type AgentName =
  | "Orchestrator"
  | "Researcher"
  | "Coder"
  | "Tester"
  | "Reviewer"
  | "Writer";

export type WorkerName = Exclude<AgentName, "Orchestrator">;

// What the frame tag says each role is doing ("Writer · editing
// headline"). Agents are told apart by icon, not color - the site's
// Apple palette has one accent and keeps the rest for meaning.
export const VERBS: Record<WorkerName, string> = {
  Writer: "editing",
  Coder: "coding",
  Tester: "testing",
  Reviewer: "reviewing",
  Researcher: "reading",
};

// Order matters: small screens take the first three.
export const WORKERS: WorkerName[] = [
  "Writer",
  "Tester",
  "Coder",
  "Reviewer",
  "Researcher",
];

// Section id -> the page file that renders it. `background` and
// `contact` each hold more than one page; the engine picks by the
// nearest sub-heading above the element.
export const SECTION_FILES: Record<string, string> = {
  home: "src/pages/home.tsx",
  about: "src/pages/about.tsx",
  experience: "src/pages/experience.tsx",
  projects: "src/pages/projects.tsx",
  skills: "src/pages/skills.tsx",
  background: "src/pages/education.tsx",
  contact: "src/pages/contact.tsx",
};

export const SUBSECTION_FILES: Record<string, string> = {
  education: "src/pages/education.tsx",
  certifications: "src/pages/certifications.tsx",
  community: "src/pages/extracurricular.tsx",
  extracurricular: "src/pages/extracurricular.tsx",
  resume: "src/pages/resume.tsx",
};

export type Line = [AgentName, string];

// After a task, the worker sometimes reports to a teammate, who walks
// over. `subject` is what the task touched (a quote, a link, a file).
export const FOLLOW_UPS: Record<
  WorkerName,
  { partner: WorkerName; lines: (subject: string) => Line[] }
> = {
  Writer: {
    partner: "Reviewer",
    lines: (s) => [
      ["Writer", `Tightened "${s}".`],
      ["Reviewer", "Reads well. Approved."],
    ],
  },
  Tester: {
    partner: "Coder",
    lines: (s) => [
      ["Tester", `"${s}" works.`],
      ["Coder", "Nice. Next one."],
    ],
  },
  Coder: {
    partner: "Tester",
    lines: (s) => [
      ["Coder", `Pushed ${s}.`],
      ["Tester", "Running checks on it."],
    ],
  },
  Reviewer: {
    partner: "Writer",
    lines: (s) => [
      ["Reviewer", `Spacing on this ${s} looks right.`],
      ["Writer", "Copy is final too."],
    ],
  },
  Researcher: {
    partner: "Writer",
    lines: (s) => [
      ["Researcher", `Notes on "${s}" are ready.`],
      ["Writer", "Send them over."],
    ],
  },
};
