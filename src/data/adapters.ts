import siteData from "@/data/siteData.json";

// The only module that reads siteData.json directly (plan section 7.5).
// Pages import from here, never from the JSON directly, so a future
// résumé-sync process (see commit 0e1cef5) can safely overwrite the raw
// JSON without touching any editorial reshaping done here.
//
// `roles` (experience bullets split into lead/rest, 7.1) is added once
// Phase 6 authors that content; the exports below are plain
// pass-throughs with nothing editorial to decide.

export const profile = siteData.profile;
export const about = siteData.about;
export const education = siteData.education;
export const projects = siteData.projects;
export const certifications = siteData.certifications;
export const community = siteData.extracurricular;
export const resume = siteData.resume;

export type SkillGroup = { label: string; primary: string[]; rest: string };

// Authored, not derived from siteData.json's raw `skills` object (7.2):
// the grouping and the "reached for first" hierarchy are editorial
// decisions a flat list of strings can't carry. The raw `skills` object
// stays untouched in the JSON for whatever a future résumé sync does
// with it; this adapter doesn't read it at all. Brought forward from
// its Phase 8 (Skills) content now because About's aside (Phase 5)
// needs the same `primary` tools and there is exactly one place these
// strings should live.
export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    primary: ["TypeScript", "JavaScript", "Python"],
    rest: "Java, C++ and C# from coursework and .NET work.",
  },
  {
    label: "Interface",
    primary: ["React 19", "Tailwind CSS", "shadcn/ui"],
    rest: "Redux Toolkit, Vite, React Hook Form, Zod and TanStack Table, with Vue and AngularJS earlier on.",
  },
  {
    label: "Services and data",
    primary: ["FastAPI", "Node.js", "Express"],
    rest: "Flask, PostgreSQL, MongoDB, SQLite, REST design and Server Sent Events.",
  },
  {
    label: "Applied AI",
    primary: ["LiteLLM", "prompt engineering", "multi agent workflows"],
    rest: "Machine learning through model training, evaluation and imbalanced data handling.",
  },
  {
    label: "Shipping",
    primary: ["Docker", "AWS S3", "GitHub Pages"],
    rest: "IIS, CI/CD pipelines, Git and GitHub review flow, production build management.",
  },
  {
    label: "Verification",
    primary: ["pytest", "Playwright", "coverage.py"],
    rest: "MutPy for mutation analysis, ESLint, and deterministic mock modes so suites stay CI safe.",
  },
  {
    label: "Daily tools",
    primary: ["Claude Code", "GitHub Copilot", "Cursor"],
    rest: "Visual Studio, n8n, and the habit of reading the diff before the agent commits it.",
  },
];

// The three figures for the Opening hero (plan section 8.2, Q13 — no
// months figure). GPA is derived live from education[0].gpa
// ("3.9/4.0" -> "3.9") so it can't drift from the actual data. The test
// count is authored here because it isn't a discrete field anywhere in
// siteData.json: it's the sum of two numbers inside a highlight
// sentence on the "AI Resume Tailoring Platform" project ("89 backend
// unit tests and 13 Playwright end-to-end tests"). Re-derive from that
// project's highlights before changing this number.
export const homeFigures = [
  {
    value: education[0].gpa.split("/")[0],
    label: "Graduate GPA at Stevens, out of 4.0",
  },
  {
    value: "102",
    label: "Automated tests on one platform, backend and browser",
  },
  {
    value: String(projects.length),
    label: "Projects shipped and documented",
  },
] as const;
