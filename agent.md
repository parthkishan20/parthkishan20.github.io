# Parthkumar Patel Portfolio — Agent

## Project Summary

- A responsive, single-page portfolio website for Parthkumar Patel.
- Built with React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and Lucide React.
- Content is driven primarily from `src/data/siteData.json` and rendered through section-based page components.
- The site showcases profile details, about text, experience, education, skills, projects, certifications, extracurricular activities, resume, testimonials, and contact information.

## Business Requirements

- Present a polished recruiter-friendly portfolio with a clear visual hierarchy and strong first impression.
- Keep content easy to update without touching presentation logic wherever possible.
- Support smooth section navigation, active-section highlighting, dark/light theme switching, and responsive layouts.
- Preserve resume viewing/downloading, GitHub stats, SEO metadata, and contact discovery paths.
- Keep the experience accessible, fast, and stable across mobile and desktop viewports.

## Technical Details

- Frameworks & tooling: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Radix/shadcn UI primitives, Lucide icons.
- App composition: `src/App.tsx` stitches together the full-page sections; `src/components/layout.tsx` tracks the active section and renders the sticky header/sidebar shell.
- Navigation: `src/components/app-sidebar.tsx` provides anchor-based scrolling between sections.
- Content model: `src/data/siteData.json` stores nearly all profile, project, skill, certification, and resume data.
- Notable UI pieces: `src/components/theme-provider.tsx`, `src/components/mode-toggle.tsx`, `src/components/seo-head.tsx`, `src/components/scroll-progress.tsx`, `src/components/back-to-top.tsx`, `src/components/github-stats.tsx`, and `src/components/contact-form.tsx`.
- Scripts from `package.json`:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
npm run deploy
```

- Deployment is configured for GitHub Pages, with `public/CNAME` present for the custom domain.

## Developer Notes & Strategy

1. Treat `src/data/siteData.json` as the source of truth for portfolio content.
2. Keep section ids aligned across `src/App.tsx`, `src/components/layout.tsx`, and `src/components/app-sidebar.tsx`.
3. Preserve the existing design language: soft gradients, card surfaces, motion-based reveals, and theme-aware colors.
4. Prefer small, focused components in `src/components` and section-specific rendering in `src/pages`.
5. When adding a new section, update the sidebar navigation, the active-section map, and the section order in `src/App.tsx` together.
6. Keep network-dependent UI resilient, especially the GitHub stats component, which should fail gracefully.

## Coding Standards

- Use TypeScript and the existing `@/*` import alias.
- Keep components small, readable, and composition-friendly.
- Prefer Tailwind utilities and the existing shadcn/ui primitives over introducing new styling systems.
- Maintain semantic HTML, clear labels, and keyboard-friendly interactions.
- Avoid unnecessary architecture changes; this is a single-page portfolio, not a routed application.
- Match the repository’s formatting style and avoid broad refactors unrelated to the task.

## Performance & UX Considerations

- Keep images optimized and served from `public/images` where practical.
- Avoid expensive client work during initial render unless it materially improves the portfolio experience.
- Preserve smooth scrolling, scroll progress feedback, and back-to-top behavior.
- Keep animations tasteful and consistent rather than adding unrelated motion patterns.
- Ensure the layout stays usable on narrow screens, especially the sidebar and hero section.

## QA / Manual Testing Checklist

- Verify the sidebar scrolls to each section and highlights the active one correctly.
- Check that theme switching persists and loads the expected theme on refresh.
- Confirm the GitHub stats component loads data or falls back cleanly.
- Validate the resume preview, resume download flow, and contact links.
- Review the site on mobile, tablet, and desktop widths for spacing and overflow issues.
- Run lint and build checks after changes that affect shared components or data shapes.

## Where to Look First

- `src/App.tsx` for the top-level section order and wrappers.
- `src/components/layout.tsx` for active-section tracking and the sticky header.
- `src/components/app-sidebar.tsx` for navigation and scroll-to-section behavior.
- `src/data/siteData.json` for portfolio content.
- `src/pages/home.tsx`, `src/pages/projects.tsx`, `src/pages/contact.tsx`, and `src/pages/resume.tsx` for the most user-visible sections.
- `src/components/github-stats.tsx` and `src/components/contact-form.tsx` for network and interaction flows.

## Next Steps

- Add stronger type definitions for the site data if the content schema keeps growing.
- Consider lightweight tests or validation for the JSON content shape.
- Update this agent file whenever the section structure or deployment approach changes.

## Style Preferences

- Keep notes concise, practical, and neutral.
- Prefer clarity over flourish in both code and documentation.
