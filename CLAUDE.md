# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check then build to dist/
npm run lint      # ESLint
npm run preview   # Serve production build locally
npm run deploy    # Build and push to GitHub Pages (gh-pages -d dist)
```

There are no tests in this project.

## Architecture

This is a single-page portfolio site — no router. All sections live in `src/App.tsx` as a single scrolling page with `<section id="...">` anchors. Navigation is handled by smooth-scrolling to section IDs rather than URL changes.

**Data layer:** All portfolio content (profile, experience, education, skills, projects, certifications, etc.) lives in `src/data/siteData.json`. Page components import this JSON directly — there is no API or state management for content.

**Layout:** `src/components/layout.tsx` wraps everything in a shadcn `SidebarProvider`. It tracks the active section by listening to `window.scroll` and comparing element offsets, passing `activeSection` down to `AppSidebar` for highlighting. The sticky header shows the current section name.

**Pages vs components:**
- `src/pages/` — one file per resume section (Home, About, Experience, etc.), each reads from `siteData.json`
- `src/components/` — shared layout and utility components (`layout.tsx`, `app-sidebar.tsx`, `scroll-progress.tsx`, etc.)
- `src/components/ui/` — shadcn/ui primitives (do not hand-edit; add new ones via `npx shadcn@latest add <component>`)

**Theming:** Dark/light mode via `ThemeProvider` (wraps the app in `App.tsx`), persisted to `localStorage` under key `vite-ui-theme`. CSS variables defined in `src/index.css` using Tailwind v4's `@theme inline` block. The shadcn style is `new-york` with `neutral` base color.

**Animations:** Framer Motion is used across page components for entrance animations (`motion.div` with `whileInView` + `viewport={{ once: true }}`).

**GitHub stats:** `src/components/github-stats.tsx` fetches live data from the GitHub public API (unauthenticated) on mount and shows a skeleton while loading.

**Images:** Profile photo and project images go in `public/images/`. The profile avatar is expected at `public/images/profile/avatar.png`.

**Deployment:** The site deploys to GitHub Pages at `https://parthkishan20.github.io/`. `public/CNAME` and `dist/CNAME` point to the custom domain `parthkumar.me`. Vite base is `/`.

**Path alias:** `@/` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).
