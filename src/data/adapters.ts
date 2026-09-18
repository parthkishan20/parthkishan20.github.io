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

export type Bullet = { lead: string; rest: string };
export type Role = {
  company: string;
  role: string;
  dates: string;
  location: string;
  bullets: Bullet[];
};

// The bullet prose is authored here, keyed by company, not derived from
// siteData.json's raw experience[].bullets (7.1's stated shape, applying
// 7.2's precedent). The plan's own worked example under 7.1 quotes this
// exact EventEase lead bullet verbatim, confirming this is the intended
// source text — transcribed from the "Parth Patel Ships" artifact via a
// screenshot the site owner supplied directly on 2026-09-18, since the
// artifact itself is sandboxed against automated reading. It is a
// tighter, portfolio-specific rewrite of the same two jobs — 10 bullets
// total (6 + 4) versus the raw JSON's 12 more résumé-formal ones — not a
// verbatim substring split of the JSON text, so the 7.1 "lead must be a
// prefix of the current JSON string" drift guard does not apply the way
// it would for a same-text split. `company`/`role`/`dates`/`location`
// below are still pulled live from siteData.experience (not
// re-hardcoded) so a future résumé sync to those fields stays
// authoritative; only the bullet prose is independent of the sync.
//
// Exactly one bullet per job carries an empty lead (the process bullet)
// so it renders unbolded, per 7.1. `rest` includes its own leading
// space or comma so `<strong>{lead}</strong>{rest}` reconstructs the
// original sentence with correct punctuation — do not insert an
// additional space when rendering.
const roleBulletsByCompany: Record<string, Bullet[]> = {
  EventEase: [
    {
      lead: "Shipped two greenfield React single page apps",
      rest: " and extended an existing codebase for charity golf live scoring, delivering layouts that work on a phone and on a 4K TV in the clubhouse.",
    },
    {
      lead: "Architected the front ends",
      rest: " in React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui and Redux Toolkit, with reusable component patterns behind live leaderboards, dashboards and admin workflows.",
    },
    {
      lead: "Wired end to end REST workflows",
      rest: " with Axios covering authentication, team onboarding, score submission, leaderboard retrieval, messaging, media uploads and sponsor content, with centralised error handling and toast feedback.",
    },
    {
      lead: "Kept leaderboards near real time",
      rest: " through tuned polling and refresh logic for both web and TV views, including sponsor carousels and animated transitions.",
    },
    {
      lead: "Built the organiser CMS",
      rest: " with data rich tables, CSV and XLSX import flows and validated forms using React Hook Form, Zod and TanStack Table.",
    },
    {
      lead: "",
      rest: "Worked Scrum in a remote team on weekly standups, Trello and GitHub reviews, and helped with production builds and deployments.",
    },
  ],
  "TechBilv Solutions LLP": [
    {
      lead: "Rebuilt parts of client facing React applications",
      rest: ", redesigning modals, reworking layouts and improving navigation.",
    },
    {
      lead: "Integrated the Hoori AI chatbot",
      rest: ", restructured link systems and added alphabetical scrolling to make long directories usable.",
    },
    {
      lead: "Owned production deployments",
      rest: " through Visual Studio 2022, publishing builds to AWS-connected IIS hosting servers.",
    },
    {
      lead: "",
      rest: "Hosted and configured static sites on AWS S3, and coordinated with cross functional teams to keep client delivery on schedule.",
    },
  ],
};

export const roles: Role[] = siteData.experience.map((exp) => ({
  company: exp.company,
  role: exp.role,
  dates: exp.dates,
  location: exp.location,
  // Drift guard: if a future sync adds/renames a company with no entry
  // above, fall back to the raw JSON bullets, each unbolded, rather than
  // silently dropping content or showing stale prose.
  bullets:
    roleBulletsByCompany[exp.company] ??
    exp.bullets.map((rest) => ({ lead: "", rest })),
}));

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

export type ProjectMetric = { value: string; label: string };

// Real metrics only (N8: "no invented metrics"), each traceable
// straight to a number already sitting in that project's own
// highlights in siteData.json — never generated or estimated. A
// project whose highlights don't contain four genuinely quantifiable
// numbers (Mini Search Engine has exactly one: the 10-page crawl
// limit) gets fewer metrics rather than padded ones.
const featuredProjectMetrics: Record<string, ProjectMetric[]> = {
  "AI Resume Tailoring Platform": [
    { value: "23", label: "REST/SSE endpoints" },
    { value: "7", label: "FastAPI route modules" },
    { value: "89", label: "Backend unit tests" },
    { value: "13", label: "Playwright end-to-end tests" },
  ],
  "MRTD Validation System (ICAO TD3)": [
    { value: "15", label: "Automated unit tests, 100% pass rate" },
    { value: "86%", label: "Line coverage achieved" },
    { value: "406", label: "Mutants generated for testing" },
    { value: "156K", label: "Decodes benchmarked per second" },
  ],
  SortBoard: [
    { value: "6", label: "Sorting algorithms visualized" },
    { value: "4", label: "Live visual states tracked" },
    { value: "100", label: "Max array size configurable" },
    { value: "100", label: "Max animation speed, steps/sec" },
  ],
  "Mini Search Engine": [
    { value: "10", label: "Wikipedia pages crawled and indexed" },
  ],
};

// featured (exactly 4: Résumé Platform, SortBoard, MRTD, Mini Search
// Engine, per plan 7.3) go in the pan; the rest in the short list.
export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);

export function getProjectMetrics(name: string): ProjectMetric[] {
  return featuredProjectMetrics[name] ?? [];
}

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

export type CertificationGroup = {
  label: string;
  certifications: typeof certifications;
};

// Grouped into the three issuer groups plan Phase 9 names ("Anthropic /
// Engineering and web / Adjacent") — that grouping doesn't exist in
// siteData.json and isn't derivable mechanically, so it's an editorial
// call, keyed by name (not array index) so it can't silently misgroup
// if a future sync reorders the raw array:
// - Anthropic: the four certs actually issued by Anthropic.
// - Engineering and web: software/web skills from other providers (an
//   AI coding-agent course, prompt engineering, React, a web dev
//   bootcamp).
// - Adjacent: Bloomberg Market Concepts — a finance credential, related
//   to a tech career but not itself a software/AI skill.
// A cert with no entry here falls into Adjacent by default rather than
// being silently dropped if a future sync adds one.
const certificationGroupNames: Record<string, string> = {
  "Claude 101": "Anthropic",
  "Claude Code 101": "Anthropic",
  "Claude Code in Action": "Anthropic",
  "AI Fluency Framework & Foundations": "Anthropic",
  "AI Coder: Complete Claude Code & Coding Agents Course":
    "Engineering and web",
  "Advanced Prompt Engineering": "Engineering and web",
  "React Essential Training": "Engineering and web",
  "100 Days of Code - 2023 Web Development Bootcamp": "Engineering and web",
  "Bloomberg Market Concept": "Adjacent",
};

const CERTIFICATION_GROUP_ORDER = ["Anthropic", "Engineering and web", "Adjacent"];

export const certificationGroups: CertificationGroup[] = CERTIFICATION_GROUP_ORDER.map(
  (label) => ({
    label,
    certifications: certifications.filter(
      (c) => (certificationGroupNames[c.name] ?? "Adjacent") === label
    ),
  })
).filter((group) => group.certifications.length > 0);
