import siteData from "@/data/siteData.json";

// The only module that reads siteData.json directly (plan section 7.5).
// Pages import from here, never from the JSON directly, so a future
// résumé-sync process (see commit 0e1cef5) can safely overwrite the raw
// JSON without touching any editorial reshaping done here.
//
// `roles` (experience bullets split into lead/rest, 7.1) and
// `skillGroups` (7.2) are added once their own phases author that
// content; the exports below are plain pass-throughs with nothing
// editorial to decide.

export const profile = siteData.profile;
export const education = siteData.education;
export const projects = siteData.projects;
export const certifications = siteData.certifications;
export const community = siteData.extracurricular;
export const resume = siteData.resume;

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
