# Parthkumar Patel - Portfolio

One page. Everything that matters.

A single-scroll portfolio for a full-stack engineer - profile, experience, projects, skills, education, and resume, in one fast-loading page: one idea per section, real numbers instead of adjectives, and nothing between the reader and the content.

Live at [parthkumar.me](https://parthkumar.me).

## Why it's built this way

- **One page, no router.** Every section is a `<section id="...">` anchor. The nav scrolls you there - no page loads, no broken back button, links stay shareable.
- **One data file.** All content - profile, experience, education, skills, projects, certifications - lives in `src/data/siteData.json`. Update the JSON, not the components.
- **An achromatic design system.** A restrained black-and-white palette, a clean system-font type stack, and a consistent content hierarchy, applied the same way across every section.
- **100 / 100 / 100 on Lighthouse.** Accessibility, Best Practices, and SEO all score perfect on the production build - verified, not assumed. Full report in `docs/after/`.
- **Live GitHub activity.** `github-stats.tsx` pulls real contribution data from the GitHub public API on load - no backend, no stale numbers.
- **Checked at real widths.** A Playwright harness captures the site at eight breakpoints, from a 320px phone to a 1440px desktop, so layout regressions show up before a reviewer finds them.

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · shadcn/ui (Radix primitives) · Playwright

## Getting started

```sh
npm install       # install dependencies
npm run dev       # start the dev server with HMR
npm run build     # type-check, then build to dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
npm run deploy    # build and push to GitHub Pages
```

There are no unit tests in this project. `npm run shots` runs a Playwright harness that captures the site at eight widths for visual review - it's a screenshot tool, not a test suite.

## How it's organized

```
src/
  pages/       one file per resume section (Home, About, Experience, ...)
  components/  layout and shared UI (site-shell, rail-nav, mobile-nav, section, ...)
  components/ui/  shadcn/ui primitives - add new ones via `npx shadcn@latest add <component>`
  data/        siteData.json - every word and number on the site
  hooks/       active-section tracking, theme, toast
  lib/         section config, utilities
public/
  images/      profile photo and project images
  Parthkumar_Patel_Resume.pdf
```

Full architecture notes - the design system, theming, and file-by-file responsibilities - live in [`CLAUDE.md`](./CLAUDE.md).

## Deployment

The site ships to GitHub Pages at a custom domain, `parthkumar.me` (see `public/CNAME`). `npm run deploy` builds and pushes `dist/` with `gh-pages`. The same `dist/` build runs cleanly on Vercel or Netlify if you'd rather host it there.

## License

MIT - fork it, learn from it, or reach out if you want to build something together.
