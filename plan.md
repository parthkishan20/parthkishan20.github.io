# Portfolio UI Redesign — Implementation Plan

**Written by:** Claude Opus 5, 2026-09-18
**Revision 2:** 2026-09-18, all fourteen review questions answered and folded in. No open
questions remain. The answers are recorded in section 13.
**To be executed by:** Claude Sonnet (this plan is the single source of truth for the build)
**Source of design decisions:** [`notes-from-artifacts.md`](./notes-from-artifacts.md), entries 1 to 8
**Repo:** `parth-portfolio/website/my-app` — React 19 + TypeScript + Vite 7 + Tailwind v4 + shadcn/ui

> **Revision 2 changed these things.** Read them even if you read revision 1.
> 1. `npm run build` **deploys the site**. It is banned as a routine check. See rule 2 and Phase 0.1.
> 2. Playwright is now in scope for responsive screenshots (Q4). New Phase 1.5.
> 3. The project pan uses **no animation library at all** (Q10). `framer-motion` is removed
>    from the project entirely. See Phase 7 and Phase 11.
> 4. The figure strip has **three** figures, not four (Q13).
> 5. Copy now says graduate, not student, and names the roles being targeted (Q12).

---

## 0. Executor protocol — read this first

You are implementing a design that has already been decided. Your job is faithful
execution, not redesign.

**Rules:**

1. **Work one phase at a time, in order.** Do not start Phase N+1 until Phase N's
   acceptance criteria all pass. Phases 1 to 3 are foundations; everything else depends
   on them.
2. **Never run `npm run build` as a check.** In this project `vite build` is wired to the
   `ghPages()` plugin, so **a build publishes the site to the live gh-pages branch.**
   Phase 0.1 unwires that; until it is done, and as a habit afterwards, the per-phase gate
   is:
   ```bash
   npx tsc -b --pretty    # types
   npm run lint           # eslint
   npm run shots          # Playwright screenshots, once Phase 1.5 exists
   ```
   All three must pass before a phase is done. `npm run build` is run once, deliberately,
   at the end, and only when the site is meant to go live.
3. **Never invent content.** Every visible string comes from `src/data/siteData.json` or
   from the Copy Deck in section 8 of this plan. If you need a string that is in neither,
   stop and ask.
4. **Never invent numbers.** Every figure on the page traces to the résumé data. Section 8
   lists each figure and its derivation.
5. **Do not add dependencies** beyond what section 7.4 authorises. In this revision that is
   exactly one addition, `@playwright/test` as a dev dependency, and two removals.
6. **Do not touch:** `public/CNAME`, the `base` value in `vite.config.ts`, or
   `package.json`'s `homepage`. The site is live at `parthkumar.me` and a change there
   breaks it. The one authorised exception is the `ghPages()` plugin line, changed in
   Phase 0.1 and nowhere else.
7. **Preserve every section `id`.** They are deep links and anchor targets already in the
   wild. Section 3 lists which ids survive and where they move to.
8. **Responsive is the highest-priority requirement.** Every phase has a responsive
   acceptance check. A phase is not done until it passes at all eight widths in the test
   matrix (section 5.5). This is not a final polish step; it is a per-phase gate.
9. **When this plan and your instinct disagree, follow the plan.** If the plan is
   genuinely wrong or ambiguous, stop and report it rather than improvising.
10. **Commit per phase** with the message `redesign(phase-N): <short summary>`. Do not
    push. Do not open a PR unless asked.

**Marker convention in this document:**
Revision 1 used `▶ Qn` markers for points that depended on an unanswered question. All
fourteen are now answered, so no markers remain. Where an answer changed the plan, the
paragraph says so in bold, for example **(Q3: confirmed, soft.)** Section 13 keeps the
full record.

---

## 1. Non-negotiables

| # | Requirement | Why |
| --- | --- | --- |
| N1 | **Works on phone and desktop equally well.** Not "mobile also works". Both are primary. | Stated by the site owner as the single highest requirement. |
| N2 | No horizontal page scroll at any width from 320px up. | The most common mobile defect and the easiest to detect. |
| N3 | Every interactive target at least 44 x 44 CSS px, with at least 8px between adjacent targets. | Touch accuracy. |
| N4 | Text contrast at least 4.5:1 in both themes; large text at least 3:1. | Entry 7 of the notes already measured the palette and found one failure; the fix is in this plan. |
| N5 | Everything works with `prefers-reduced-motion: reduce`. Pins, blinks and reveals all collapse to a static final state. | Accessibility, and several effects here are infinite loops. |
| N6 | Keyboard reachable in DOM order, visible focus ring on every focusable element. | The rail and the horizontal pan are both easy to get wrong here. |
| N7 | One accent colour across the whole site. No second brand hue, no gradients. | Entry 7. |
| N8 | No fabricated content: no invented testimonials, no invented metrics, no placeholder people. | Entry 7's "Verified" principle; also the reason the Testimonials section is being deleted. |

---

## 2. Current state audit

### 2.1 What exists

```
src/
  App.tsx                  11 <section> wrappers, each min-h-screen, SectionDivider between
  main.tsx                 imports index.css + styles/print.css
  index.css                204 lines: @theme inline, LinkedIn-blue palette, Playfair headings
  components/
    layout.tsx             shadcn SidebarProvider + sticky header + window.scroll listener
    app-sidebar.tsx        11 icon nav items
    theme-provider.tsx     class-based .dark, localStorage key "vite-ui-theme", default dark
    mode-toggle.tsx  scroll-progress.tsx  back-to-top.tsx  section-divider.tsx
    seo-head.tsx     error-boundary.tsx   github-stats.tsx  github-stats-skeleton.tsx
    ui/                    17 shadcn primitives
  pages/                   home about education experience projects skills certifications
                           extracurricular testimonials resume contact
  data/siteData.json       307 lines, the only content source
  styles/print.css         64 lines, imported globally
```

### 2.2 Defects this redesign fixes

| ID | Defect | Evidence |
| --- | --- | --- |
| D1 | **13 files use `min-h-screen` per section.** On a phone this produces eleven full-viewport screens of mostly empty space and a page that feels endless. | `grep -rl min-h-screen src/` |
| D2 | **Hardcoded brand hex in 9 files.** `#0077B5` / `#00A0DC` are written inline in class names, so changing `index.css` alone will not change the site. | `index.css`, `github-stats.tsx`, `scroll-progress.tsx`, `experience.tsx`, `projects.tsx`, `about.tsx`, `testimonials.tsx`, `education.tsx`, `home.tsx` |
| D3 | **Scroll work on the main thread.** `layout.tsx` runs a `window.scroll` listener comparing `offsetTop` for all 11 sections on every frame. | `layout.tsx` lines 30 to 50 |
| D4 | **Testimonials section is a "Coming Soon" placeholder** with no data behind it. It costs a nav slot and a full screen. | `pages/testimonials.tsx`, and `siteData.json` has no testimonials key |
| D5 | **`avatar.png` is 687 KB.** It is the largest asset on the site and is rendered as the hero image. | `ls -lh public/images/profile/` |
| D6 | **Résumé is an `<iframe>` PDF preview.** iOS Safari does not reliably render PDFs in an iframe; on a phone this is often a blank grey box. | `pages/resume.tsx` |
| D7 | **Font payload is mostly unused.** `index.html` requests 7 Inter weights and 6 Playfair weights. | `index.html` line 24 |
| D8 | **Skills are ~60 equal-weight chips.** No hierarchy between a daily tool and a coursework mention. | `pages/skills.tsx` |
| D9 | **Gradient text and animated blobs** in the hero, a look the design direction explicitly drops. | `pages/home.tsx` lines 10 to 16, 60 |
| D10 | **`npm run build` deploys.** `vite.config.ts` registers `ghPages()`, so any build publishes `dist` to the live gh-pages branch. Meanwhile `package.json` also has `predeploy` + `deploy` doing the same job through the `gh-pages` package, so publishing happens twice by two mechanisms. | `vite.config.ts` line 8; verified by running `npm run build`, which printed `Published dist to branch gh-pages` |
| D11 | **Bundle is 163 KB gzipped JS** (518 KB raw), over Vite's 500 KB chunk warning. Heavy for a static portfolio whose audience includes recruiters on phones. | measured `npm run build` output, 2026-09-18 |
| D12 | **`framer-motion` is imported in 15 files** for what are, in every case, fade and slide reveals. After this redesign those are CSS plus one IntersectionObserver hook. | `grep -rl framer-motion src/` |

### 2.3 What is already good and must survive

- `siteData.json` as the single content source. Keep that discipline.
- `ThemeProvider` with class-based dark mode and `localStorage` persistence. Keep as is.
- `ErrorBoundary`, `SEOHead`, skip link, `print.css`. Keep.
- shadcn primitives that are actually used after the rewrite: `button`, `badge`,
  `separator`, `toast`/`toaster`, `avatar`, `tooltip`. Section 9 lists what gets deleted.

---

## 3. Target information architecture

Nine current sections become **seven navigation entries**. No content is lost; four
sections merge into two.

| # | Rail label | Section `id` | Contains | Old ids preserved inside |
| --- | --- | --- | --- | --- |
| 01 | Opening | `home` | Hero, status pill, three figures | — |
| 02 | About | `about` | Bio prose, optional GitHub activity | — |
| 03 | Experience | `experience` | Two roles, sticky meta, bold leads | — |
| 04 | Projects | `projects` | 4 featured in the pan, 5 in the short list | — |
| 05 | Skills | `skills` | 7 definition rows | — |
| 06 | Background | `background` | Education, certifications, community | `#education`, `#certifications`, `#extracurricular` as inner anchors |
| 07 | Contact | `contact` | Résumé access, contact lines, footer | `#resume` as an inner anchor |

**Deep-link preservation.** `#education`, `#certifications`, `#extracurricular` and
`#resume` stay as `id` attributes on the sub-blocks inside sections 06 and 07, each with
`scroll-margin-top` applied. An old link keeps working and lands in the right place.

**`#testimonials` is removed.** It is the only id that dies. It pointed at a "Coming Soon"
placeholder, so nothing of value is lost. **(Q1: confirmed, delete.)**

**Rail count rationale:** entry 6 of the notes caps the rail at roughly seven items before
it stops reading as a nameplate and starts reading as app chrome. Seven is the ceiling,
not a target to grow past.

---

## 4. The design system

This is Phase 1 and everything else depends on it. Implement it exactly.

### 4.1 Colour tokens

From entry 7 of the notes, **with the `--ink-3` contrast fix already applied**. Do not use
the original `--ink-3` values from the artifact; they fail WCAG AA.

| Role | Light | Dark | Contrast on ground (L / D) |
| --- | --- | --- | --- |
| ground | `#F3F5F3` | `#0C100E` | — |
| raised (cards, inputs) | `#FFFFFF` | `#141A17` | — |
| ink (body, headings) | `#121816` | `#E7ECE9` | 16.41 / 16.03 |
| ink-2 (secondary prose) | `#4C5853` | `#9BA6A1` | 6.78 / 7.63 |
| ink-3 (dates, meta, stacks) | `#656F6A` | `#838E89` | 4.75 / 5.65 |
| line (control borders) | `#DCE1DD` | `#222A26` | — |
| line-2 (section hairlines) | `#E7EBE7` | `#1A211D` | — |
| accent | `#0F6B4F` | `#58C79B` | 5.92 / 9.18 |
| accent-ink (text on accent) | `#FFFFFF` | `#07100C` | 6.49 / 9.24 |
| wash (tinted fill) | `rgba(15,107,79,0.08)` | `rgba(88,199,155,0.12)` | — |
| ok (availability dot) | `#15803D` | `#4ADE80` | — |

### 4.2 Mapping onto the shadcn tokens in `index.css`

| This palette | shadcn token |
| --- | --- |
| ground | `--background` |
| raised | `--card`, `--popover` |
| ink | `--foreground`, `--card-foreground`, `--popover-foreground` |
| ink-2 | `--muted-foreground` |
| ink-3 | **new** `--muted-foreground-2` (no shadcn equivalent; do not reuse `--muted-foreground`) |
| line | `--border`, `--input` |
| accent | `--primary`, `--ring` |
| accent-ink | `--primary-foreground` |
| wash | `--accent` |
| ok | **new** `--ok` |

> **Trap, do not get this wrong.** shadcn's `--accent` is the *hover / selected surface*,
> not the brand accent. The green goes in `--primary`. Putting it in `--accent` turns every
> hover state into a solid green block.

Also: restate `--chart-1` through `--chart-5` in greens, and **delete the entire
`--sidebar-*` block** in both `:root` and `.dark`, plus its `@theme inline` mappings, since
the shadcn sidebar is being removed in Phase 2.

### 4.3 Typography

| Role | Family | Loaded weights |
| --- | --- | --- |
| Display (all headings, all figures) | **Bricolage Grotesque** (`opsz` 12..96) | 400, 600, 700 |
| Body / UI | **Geist** | 400, 500, 600 |
| Mono (kickers, dates, stack lines, rail numerals) | **Geist Mono** | 400, 500 |

Replace `index.html` line 24 with:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" />
```

All three families and axes were verified live on Google Fonts on 2026-09-18.
The two `preconnect` hints on lines 20 and 21 already exist; keep them.

**The tracking ladder** (entry 8). Tracking tightens as size grows. Body stays at 0. Never
apply negative tracking below 18px.

| Role | Size | Weight | Tracking | Line height |
| --- | --- | --- | --- | --- |
| Hero | `clamp(36px, 6.4vw, 76px)` | 700 | `-0.045em` | 1.02 |
| Closing statement | `clamp(32px, 7.4vw, 88px)` | 700 | `-0.05em` | 0.98 |
| Section head | `clamp(26px, 3.6vw, 40px)` | 600 | `-0.04em` | 1.08 |
| Sub head | `clamp(21px, 3vw, 30px)` | 600 | `-0.035em` | 1.15 |
| Card title | `19px` → `20px` at md | 600 | `-0.025em` | 1.25 |
| Figure / GPA | `clamp(28px, 4vw, 44px)` | 700 | `-0.03em` | 1 |
| Body | `17px` | 400 | 0 | 1.62 |
| Small / meta | `13px` → `14px` | 400/500 | 0 | 1.5 |
| Mono kicker | `11px` → `12px` | 500 | `0.14em` | 1.4 |

Note the hero and closing minimums are lowered from the artifact values (38 → 36, 36 → 32)
so they do not overflow at 320px. Verify at 320px.

Do not set `font-optical-sizing: none` and do not pin `'opsz'`. The optical axis is the
reason this face was chosen.

### 4.4 Shape language — the one conflict in the notes, resolved

The notes mix two shape systems. Entries 1 and 2 come from a brutalist concept (0px
radius, 2px borders, hard offset shadows); entries 5, 6 and 7 come from a soft concept
(6px radius, 1px borders). Shipping both produces an incoherent page.

**Resolution: unify on the soft system.** It is the majority (palette, rail, skills all
come from it) and entry 2 already documents the adaptation ("on a rounded design use a
soft shadow and drop the translate, but keep the three-part card structure").
**(Q3: confirmed, soft.)**

| Property | Value |
| --- | --- |
| Radius | `6px` on every surface and control, one scale, no exceptions |
| Border | `1px solid var(--border)` on controls and cards |
| Hairline | `1px solid` line-2 for section separation |
| Card hover | `border-color` to ink-3 plus `translateY(-3px)`, 220ms. No hard offset shadow, no scale |
| Shadow | None by default. Elevation is carried by `--card` against `--background` |

**Adaptations this forces on the notes:**

- Entry 1 status pill: 6px radius instead of 0, 1px border instead of 2px, and the dot
  becomes a 8px circle (`border-radius: 50%`) instead of a square.
- Entry 2 community cards: 1px border, 6px radius, hover is the standard card hover above,
  and the mono heading becomes the display face at card-title size.

### 4.5 Spacing scale

```
--s1: 8px   --s2: 16px  --s3: 24px  --s4: 36px
--s5: 56px  --s6: 88px  --s7: 128px
```

Section vertical rhythm: `--s6` on phone, `--s7` from `md` up. Never `min-h-screen`.

### 4.6 Motion

| Effect | Where | Spec |
| --- | --- | --- |
| Section reveal | every section | opacity 0 → 1, `translateY(20px)` → 0, 700ms `cubic-bezier(0.16,1,0.3,1)`, IntersectionObserver, fire once |
| Hero load stagger | Opening only | same easing, 880ms, children delayed 40 / 130 / 220 / 310ms |
| Status dot blink | hero pill | `blink 2s steps(1, end) infinite`, 1 → 0.25 opacity at the 60% mark |
| Card hover | cards, tiles | 220ms `translateY(-3px)` plus border colour |
| Active nav | rail and mobile chips | 240ms colour and border transition only |
| Project pan | Projects | scroll-scrubbed horizontal translate, desktop only, section 6.7 |

**Every one of these collapses under `prefers-reduced-motion: reduce`.** Implement the
global block in `index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

and, separately, ensure reveal elements render at their final state (never stuck at
`opacity: 0`) when the query matches — see the `useReveal` hook in Phase 3.

---

## 5. THE RESPONSIVE CONTRACT

**This is the highest-priority section of the plan.** Read it before writing any JSX.

### 5.1 Authoring rule

**Mobile first, always.** Base classes describe the phone. Add `md:`, `lg:`, `rail:` to
build up. Do not use `max-*` variants except in the two places this plan explicitly names.
If you find yourself writing `max-md:` to undo a desktop style, the base style was wrong.

### 5.2 Breakpoint ladder

| Name | Min width | Role |
| --- | --- | --- |
| base | 320px | phone portrait. **The design must work at 320, not just 375.** |
| `sm` | 640px | large phone landscape, small tablet portrait |
| `md` | 768px | tablet portrait. First two-column layouts appear |
| `lg` | 1024px | tablet landscape, small laptop |
| `rail` | **1160px** | **custom.** The identity rail appears. Below this it is a header |
| `xl` | 1280px | laptop |
| `2xl` | 1536px | large desktop. Content caps at 1440px and centres |

Add the custom breakpoint in `src/index.css` as a **separate plain `@theme` block** (not
inside the existing `@theme inline`):

```css
@theme {
  --breakpoint-rail: 1160px;
}
```

That generates the `rail:` variant. Tailwind v4 reads breakpoints from theme variables;
there is no `tailwind.config.js` in this project and none should be added.

### 5.3 Per-section responsive behaviour

| Section | Phone (320 to 767) | Tablet (768 to 1159) | Desktop (1160+) |
| --- | --- | --- | --- |
| Shell | single column, sticky header 56px + chip nav row | same as phone, wider gutters | two columns: 300px rail + content, no header |
| Opening | headline `clamp` floor 36px, CTAs full-width stacked, figures stacked one per row | CTAs inline, figures in one row of 3 | figures in one row of 3 |
| About | one column, prose 100% | prose + aside stacked | prose 1.1fr / aside 1fr |
| Experience | meta block above bullets, **sticky off** | same, sticky off | 0.8fr / 2fr, meta sticky at `top: 24px` |
| Projects | native horizontal scroll-snap row, one panel at `88vw` with the next peeking | same row, panel `min(70vw, 480px)` | pinned section, scroll-scrubbed pan |
| Skills | term above description, stacked | same | 210px term column, baseline aligned |
| Background | one column throughout | education 1 col, certs 2 col | education + community left, certs right |
| Contact | buttons full width stacked, contact lines wrapped | buttons inline | two column, footer row |
| Résumé | **download / open buttons only, no iframe** | iframe at 4:3 | iframe at 8.5:11 |

### 5.4 Global mobile rules

| # | Rule |
| --- | --- |
| M1 | Page gutter is `20px` at base, `24px` at `sm`, `40px` at `rail`. Set once on the shell, never per section. |
| M2 | `overflow-x` is `hidden` on nothing. If the page scrolls sideways, find the offending child. The **only** element allowed `overflow-x: auto` is the project pan viewport. |
| M3 | No fixed `width` or `min-width` above 280px on any element. Use `max-width` plus `minmax(0, 1fr)` in grids. |
| M4 | Every grid child that holds text gets `min-width: 0`, otherwise long unbroken strings (URLs, `linkedin.com/in/parthkishan20`) blow out the track. |
| M5 | Long identifiers use `overflow-wrap: anywhere`. Applies to email, profile URLs, and project stack lines. |
| M6 | Use `100dvh`, never `100vh`. The rail is the only element with a viewport height at all. |
| M7 | Sticky header and any fixed element respect `env(safe-area-inset-*)` via `padding-inline` and `padding-bottom`. |
| M8 | Touch targets: `min-height: 44px` on every link, button, chip and nav item. Inline prose links are exempt. |
| M9 | Nothing may depend on hover alone. Every hover affordance has a focus and an active equivalent. |
| M10 | Tap highlight: set `-webkit-tap-highlight-color: transparent` globally and rely on the `:active` state instead. |
| M11 | `html { -webkit-text-size-adjust: 100%; }` so iOS does not inflate text in landscape. |
| M12 | Images carry explicit `width` and `height` attributes to reserve space and avoid layout shift. |
| M13 | Section anchors use `scroll-margin-top: 72px` on phone and tablet (clears the sticky header), `24px` at `rail` (no header). |
| M14 | The mobile chip nav scrolls horizontally inside its own container and must not push the page wide. |

### 5.5 Test matrix — the per-phase gate

Every phase must be checked at **all eight widths** before it is marked done:

| Width | Represents | Also check |
| --- | --- | --- |
| 320 | iPhone SE 1, smallest realistic | no text clipping, no overflow |
| 375 | iPhone SE 2/3, iPhone 13 mini | |
| 390 | iPhone 14/15 | |
| 768 | iPad portrait | two-column transitions |
| 1024 | iPad landscape | still header, not rail |
| 1160 | rail threshold | rail appears cleanly, no overlap |
| 1280 | laptop | |
| 1440 | desktop, content cap | content centres, gutters even |

Two heights also matter because of the pinned section and the rail:
**720px** (short laptop) and **844px** (iPhone 14 viewport).

**How to check.** In the browser devtools device toolbar, set the width, then:

1. Scroll the whole page. No sideways movement at any point.
2. Run this in the console to find any overflowing element:
   ```js
   [...document.querySelectorAll('*')].filter(el => el.scrollWidth > document.documentElement.clientWidth).map(el => el.className || el.tagName)
   ```
   It must return `[]` (the project pan viewport is the one allowed exception; if it
   appears, confirm it is `.pan-viewport` and move on).
3. Tab through the section. Focus ring visible on every stop, order matches reading order.
4. Toggle the theme. Check the section in both.
5. In devtools rendering panel, enable `prefers-reduced-motion: reduce` and reload. Nothing
   is invisible, nothing animates.

**Automated (Q4).** Phase 1.5 sets up a Playwright screenshot harness, so from Phase 2
onward `npm run shots` captures all eight widths in both themes in one command. The
console overflow check and the keyboard pass stay manual, because a screenshot cannot see
either.

---

## 6. Implementation phases

### Phase 0 — Baseline

**Steps**
1. `git checkout -b redesign/ui-v2`
2. `npm install`, then `npx tsc -b` to confirm a clean starting point.
   **Do not run `npm run build` here.** It would publish.
3. `npm run dev` and screenshot the current site at 375 and 1440 for before/after
   comparison. Save to `docs/before/` (create the folder; it is not deployed).

**Acceptance:** types clean, branch created, baseline shots saved.

---

### Phase 0.1 — Stop the build from deploying (do this before anything else)

**Why.** `vite.config.ts` registers `ghPages()`, which publishes `dist` to the live
gh-pages branch at the end of every `vite build`. `package.json` separately defines
`predeploy: npm run build` and `deploy: gh-pages -d dist`, so publishing is wired twice by
two different mechanisms. Left alone, the thirteen build checks in this plan would each
push an unfinished redesign to the live site.

**Files:** `vite.config.ts`

**Steps**
1. Remove `ghPages()` from the `plugins` array and delete its import. Leave `base`,
   `react()`, `tailwindcss()` and the `@` alias exactly as they are.
2. Leave `package.json` untouched. `npm run deploy` still works and still publishes,
   because `predeploy` builds and `gh-pages -d dist` uploads. That was always the intended
   route; it was just being shadowed.
3. Confirm: `npm run build` now prints bundle sizes and **does not** print
   `Published dist to branch gh-pages`.

**Acceptance**
- [ ] `npm run build` completes without publishing.
- [ ] `git diff vite.config.ts` shows only the plugin import and the array entry removed.
- [ ] Deployment still happens on `npm run deploy` when the site is ready to go live.

> Note for the record: a build was run during planning on 2026-09-18 and it published. The
> source was unchanged at the time, so the live site's content did not change, but this is
> exactly the failure this phase prevents.

---

### Phase 1 — Design tokens and fonts

**Files:** `src/index.css`, `index.html`

**Steps**

1. In `index.html`, replace the Inter + Playfair `<link>` on line 24 with the three-family
   link from section 4.3. Keep both `preconnect` lines.
2. In `index.html`, update `<meta name="theme-color">` to `#F3F5F3`, and add a second one
   for dark:
   ```html
   <meta name="theme-color" content="#F3F5F3" media="(prefers-color-scheme: light)" />
   <meta name="theme-color" content="#0C100E" media="(prefers-color-scheme: dark)" />
   ```
3. In `src/index.css`:
   - Replace every colour value in `:root` and `.dark` with the section 4.1 palette,
     using the section 4.2 mapping.
   - Add `--muted-foreground-2` and `--ok` to both blocks, and map them in `@theme inline`
     as `--color-muted-foreground-2` and `--color-ok`.
   - Delete the whole `--sidebar-*` group from `:root`, `.dark`, and `@theme inline`.
   - Set `--radius: 6px`.
   - Add the separate `@theme { --breakpoint-rail: 1160px; }` block.
   - Add `--font-display`, `--font-sans`, `--font-mono` theme variables so Tailwind's
     `font-display` / `font-sans` / `font-mono` utilities resolve to the new families.
   - Replace the `h1..h6` rule: display family, weight 600, `letter-spacing: -0.03em`,
     `text-wrap: balance`.
   - Set `body` to the body family, 17px, line-height 1.62.
   - Add `html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }` and
     `* { -webkit-tap-highlight-color: transparent; }`.
   - Add the `@keyframes status-blink` and the `.animate-status-blink` utility.
   - Add the global reduced-motion block from section 4.6.
   - **Delete** the `blob` keyframes, `.animate-blob`, and the `animation-delay-*`
     utilities. Nothing will use them after Phase 4.
4. Colour values go in as **hex**, not oklch. The existing file uses oklch, but hex is what
   the notes measured and what this plan specifies; mixing notations invites drift.
   **(Q5: confirmed, hex.)**

**Acceptance**
- [ ] `npx tsc -b` and `npm run lint` pass. (Not `npm run build`; see rule 2.)
- [ ] In devtools, `body` computed `font-family` resolves to Geist and an `h1` to
      Bricolage Grotesque. Confirm in the Network panel that all three font files load.
- [ ] Toggling the theme switches ground and ink. No element keeps an old blue.
- [ ] No console warnings about unknown Tailwind utilities.

---

### Phase 1.5 — Responsive screenshot harness (Q4 answer: yes, add Playwright)

Set this up early, not at the end. From here on every phase can be eyeballed at all eight
widths with one command, which is what makes the per-phase responsive gate practical.

**Files:** new `playwright.config.ts`, new `tests/shots.spec.ts`, `package.json`

**Steps**

1. `npm install -D @playwright/test` then `npx playwright install chromium firefox`.
   Chromium is the main target; Firefox is there to verify the project-pan fallback in
   Phase 7 and 12.
2. `playwright.config.ts`: a `webServer` block running `npm run dev` on port 5173 with
   `reuseExistingServer: true`, and two projects, `chromium` and `firefox`. Screenshot
   output goes to `docs/shots/` which is **not** deployed; add it to `.gitignore` if the
   images should not be committed, or commit them deliberately as a visual record.
3. `tests/shots.spec.ts`: for each width in `[320, 375, 390, 768, 1024, 1160, 1280, 1440]`
   and each theme in `["light", "dark"]`, load `/`, set the theme by writing
   `localStorage["vite-ui-theme"]` before navigation, wait for fonts with
   `document.fonts.ready`, and take a `fullPage` screenshot named
   `<width>-<theme>.png`.
4. Add the script: `"shots": "playwright test"`.

**Setting the theme matters.** `ThemeProvider` reads `localStorage["vite-ui-theme"]` and
applies a `.dark` class. Use `page.addInitScript` so the value is present before React
mounts, otherwise the first paint is in the wrong theme and every dark screenshot is
wrong.

**What this harness is and is not.** It catches layout breakage, overflow, clipped text and
theme mistakes across widths in one pass. It cannot see keyboard order, focus rings, or
whether reduced motion works. Those three stay manual in section 5.5.

**Acceptance**
- [ ] `npm run shots` produces 16 chromium screenshots without failing.
- [ ] The dark screenshots are actually dark.
- [ ] Fonts are loaded in the images, not fallbacks.
- [ ] The run does not leave a dev server behind.

---

### Phase 2 — Layout shell: rail on desktop, header plus chips on mobile

**Files:** new `src/components/site-shell.tsx`, new `src/components/rail-nav.tsx`,
new `src/components/mobile-nav.tsx`, new `src/hooks/use-active-section.ts`;
modify `src/App.tsx`; **delete** `src/components/layout.tsx`, `src/components/app-sidebar.tsx`.

This is the largest structural change. It replaces `SidebarProvider` entirely.

**2.1 `use-active-section.ts`** — replaces the `window.scroll` listener in `layout.tsx`.

```ts
import { useEffect, useState } from "react";

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
```

Pass `ids` as a module-level constant array so the effect does not re-run every render.

**2.2 `rail-nav.tsx`** — desktop only, `hidden rail:flex`. Structure per entry 6:
photo, name, role, numbered `<ol>` index, contact lines, theme toggle pinned to the bottom
with `mt-auto`. Active item: `aria-current="true"`, accent left border, ink colour, weight
550. No icons.

**2.3 `mobile-nav.tsx`** — **this is new work, not in the notes.** Below `rail:` there is
no vertical rail, and the notes' concept simply dropped navigation on mobile. Given
requirement N1, mobile gets real navigation:

- A sticky top bar, 56px tall, holding the name (left) and the theme toggle (right).
- Directly under it, a horizontally scrollable row of seven chips, one per section,
  `scroll-snap-type: x proximity`, each chip 44px tall.
- The active chip gets the accent border and scrolls itself into view via
  `scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" })` when the
  active section changes. Guard that call behind a reduced-motion check.
- The whole bar is `rail:hidden`.
- No hamburger. Entry 6 of the notes rules it out and a seven-item row does not need one.
**(Q6: confirmed, header plus chips.)**

**2.4 `site-shell.tsx`** — the grid wrapper:

```tsx
<div className="mx-auto w-full max-w-[1440px] px-5 sm:px-6 rail:grid rail:grid-cols-[300px_minmax(0,1fr)] rail:gap-[72px] rail:px-10">
  <RailNav active={active} />          {/* hidden below rail */}
  <MobileNav active={active} />        {/* hidden at rail and above */}
  <main id="main" className="min-w-0">{children}</main>
</div>
```

`min-w-0` on `<main>` is rule M4 and is not optional; without it the pan section forces the
grid wider than the viewport.

**2.5 `App.tsx`** — replace `Layout` with `SiteShell`, drop all eleven `min-h-screen`
classes, drop every `<SectionDivider />`, and reduce to the seven sections from section 3.
Keep `ErrorBoundary`, `SEOHead`, `BackToTop`, `Toaster` and the skip link. **Remove
`<ScrollProgress />` and delete `components/scroll-progress.tsx` (Q7: confirmed).**

**Acceptance**
- [ ] At 1160px and above: rail visible, mobile bar gone, content starts at the top.
- [ ] Below 1160px: header plus chips visible, rail gone, chips scroll horizontally
      **without the page scrolling sideways** (rule M14).
- [ ] Active state tracks the scroll position in both navigations.
- [ ] Tab order: skip link, then nav, then content. Focus ring visible on every chip.
- [ ] All eight widths in the matrix pass the console overflow check.
- [ ] `npx tsc -b` and `npm run lint` pass. (Not `npm run build`; see rule 2.)

---

### Phase 3 — Section primitives and reveal

**Files:** new `src/components/section.tsx`, new `src/hooks/use-reveal.ts`;
**delete** `src/components/section-divider.tsx`.

**3.1 `use-reveal.ts`** — one IntersectionObserver per element, unobserve after firing, and
**start in the visible state when reduced motion is on** so nothing is ever stuck at
`opacity: 0`.

**3.2 `section.tsx`** — a single component every section uses, so rhythm and anchor offsets
are defined once:

```tsx
export function Section({ id, label, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-[72px] border-t border-border/60 py-[88px] first:border-t-0 md:py-32 rail:scroll-mt-6"
    >
      {children}
    </section>
  );
}
```

**Acceptance**
- [ ] No section uses `min-h-screen` anywhere in the codebase (`grep -r min-h-screen src/`
      returns nothing).
- [ ] Anchor jumps from the nav land with the heading visible, not under the header, at
      both phone and desktop.
- [ ] With reduced motion on, every section is visible immediately on load.

---

### Phase 4 — Opening (hero)

**Files:** rewrite `src/pages/home.tsx`, new `src/components/status-pill.tsx`,
new `src/components/figure-strip.tsx`.

**Steps**
1. `StatusPill` per entry 1, with the Phase 4.4 shape adaptation: 6px radius, 1px border,
   round 8px dot, `aria-hidden` on the dot, text carries the meaning.
2. Hero content in this order, and **no more than these four blocks** (the figure strip is
   a separate sibling below the hero, not part of it):
   status pill → headline → one-sentence lede → two CTAs.
3. `FigureStrip`: **three** figures (Q13 removed the months figure). Responsive shape:
   - base (320 to 639): one column. Each figure is a row, number on the left in a fixed
     72px tabular column, label on the right. Three long labels stacked in a 2x2 grid at
     320px would wrap to five lines each.
   - `sm` and up: three equal columns, number above label.
   Display face, `font-variant-numeric: tabular-nums`.
4. **Delete** the animated blob background, the gradient headline text, and the emoji in
   the location and contact lines.
5. The 687 KB `avatar.png` is **not** used in the hero. The photo lives in the rail at 52px
   (entry 6). **(Q8: confirmed, rail only at 52px.)**

**Copy:** section 8.1. **Figures and their derivation:** section 8.2.

**Acceptance**
- [ ] At 320px the headline does not clip or overflow and the CTAs are full width, stacked.
- [ ] Both CTAs are 48px tall and 8px apart.
- [ ] The status dot blinks; with reduced motion it sits static at full opacity.
- [ ] Hero fits within the viewport at 390x844 without the figure strip pushing the CTAs
      off screen.

---

### Phase 5 — About

**Files:** rewrite `src/pages/about.tsx`

Two-column at `lg` (prose 1.1fr, aside 1fr), single column below. Prose at `max-w-[64ch]`.
The aside carries the "what I reach for first" list. Strip all hardcoded hex.

**`GitHubStats` stays in About (Q9: confirmed),** with a reserved-height skeleton so the
live fetch cannot shift layout. Strip its hardcoded hex and its `framer-motion` import;
the fade becomes a CSS transition.

**Acceptance:** prose never exceeds 64ch; no hex literals remain in the file; passes all
eight widths.

---

### Phase 6 — Experience

**Files:** rewrite `src/pages/experience.tsx`; `src/data/siteData.json` (section 7.1).

Implement entry 3 exactly, with these responsive specifics:

- Base: meta block stacked above the bullets, **no sticky**.
- `md:` two columns `minmax(0,0.8fr) minmax(0,2fr)`, gap 56px, **still no sticky**.
- `rail:` meta becomes `sticky top-6 self-start`. Sticky only exists where there is no
  sticky header to fight, which is exactly the rail breakpoint. This differs from the note
  (which used `top: 96px` under a header) because this layout has no desktop header.
- Bullets: `max-w-[68ch]`, 18px gap, bold lead in ink, rest in ink-2.
- One bullet per job stays unbolded (the process one). Enforced by the data, section 7.1.

**Acceptance**
- [ ] `align-self: start` present, or the sticky silently does nothing.
- [ ] At 1160px, scrolling a long job keeps the company name in view; at 1024px it does not
      stick at all.
- [ ] Bold appears only on the lead clause, never on tool names inside the detail.

---

### Phase 7 — Projects

**Files:** rewrite `src/pages/projects.tsx`, new `src/components/project-pan.tsx`.

**7.1 Baseline, which is also the mobile and no-JS experience.** Build the scroll-snap row
first and make sure it is good on its own:

- `.pan-viewport`: `overflow-x: auto`, `scroll-snap-type: x mandatory`,
  `overscroll-behavior-x: contain` (stops the swipe chaining to browser back).
- Panels: `width: min(88vw, 560px)` at base so the next panel peeks, `min(70vw, 480px)`
  from `md`. The peek is the affordance; do not add arrows.
- A 2px progress line under the track, driven by a passive `scroll` listener on the
  viewport.
- `tabindex="0"` and `aria-label="Featured projects, scrollable"` on the viewport so
  keyboard users can scroll it directly.

**7.2 Desktop enhancement: no animation library at all. (Q10, decided for you.)**

Neither GSAP nor framer-motion. The pan is built with **CSS scroll-driven animation**, and
`framer-motion` is removed from the project entirely in Phase 11.

*Why this is the right call for this site, rather than either library:*

1. **The fallback is not a downgrade, it is the mobile experience.** A browser without
   `animation-timeline` support gets the scroll-snap row, which is a first-class
   experience by requirement N1. Nothing is broken and no project is unreachable. That is
   a very unusual luxury, and it is what makes shipping a newer CSS feature safe here.
2. **The bundle is already the problem.** 163 KB gzipped (D11) on a static portfolio read
   by recruiters on phones. Spending 25 to 40 KB more on one desktop-only decorative
   effect is the wrong trade. Removing `framer-motion` instead moves that number the right
   way.
3. **`framer-motion` has no other job left.** It appears in 15 files today (D12), but every
   one is a fade or slide reveal, and Phase 3 replaces all of them with `useReveal` plus
   CSS. After the rewrite only `BackToTop` and `GitHubStats` would still import it, and
   both are a `transition: opacity` away from not needing it.
4. **The distance maths is pure CSS.** The track is a flex row, so its own width is `100%`
   and the travel is `calc(-100% + 100vw)`. No JavaScript measurement, nothing to
   recompute on resize, nothing to refresh after the fonts load, which are the three
   things that make the ScrollTrigger version fiddly.

*Shape of the implementation:*

```css
/* the section is taller than the viewport; the inner frame sticks while it passes */
.pan          { height: 320vh; }                 /* travel budget, tune to panel count */
.pan-frame    { position: sticky; top: 0; height: 100dvh;
                display: flex; flex-direction: column; justify-content: center; }
.pan-viewport { overflow: hidden; }               /* only while enhanced; see below */
.pan-track    { display: flex; gap: var(--s3); }

@supports (animation-timeline: scroll()) {
  @media (min-width: 1160px) and (prefers-reduced-motion: no-preference) {
    .pan       { view-timeline-name: --pan; }
    .pan-track { animation: pan-x linear both; animation-timeline: --pan;
                 animation-range: contain 0% contain 100%; }
    @keyframes pan-x {
      to { transform: translateX(calc(-100% + 100vw - var(--gutter) * 2)); }
    }
  }
}
```

Everything outside that `@supports` block is the scroll-snap row from 7.1. The enhanced
path must not change the DOM, only the CSS, so there is no JavaScript branch and no
hydration flash.

*Browser reality, stated plainly:* `animation-timeline` is supported in Chromium since 115
and in Safari since 26. Firefox is the uncertain one. Firefox users get the scroll-snap
row. Verify this deliberately in Phase 12 by running the Playwright screenshot pass against
the `firefox` project as well as `chromium`, and confirm the row is usable there rather
than assuming it.

*If it turns out badly:* the row alone is a legitimate shipping state. Delete the
`@supports` block and the section is still complete. Do not reach for a library as the
recovery move without asking first.

**7.3 Content.** Four featured panels (Résumé Platform, MRTD, SortBoard, Mini Search
Engine) with their real metrics; the remaining five projects in a two-column short list
below.

**7.4 The progress line has two drivers, matching the two paths.**
In the fallback row it is a passive `scroll` listener on the viewport setting
`--pan-progress`. In the enhanced path the listener never fires, because the viewport is
`overflow: hidden`, so the line is driven by the same `--pan` timeline with a `scaleX`
keyframe. Implement both; the notes flag losing one of them as a known failure.

**Acceptance**
- [ ] With JavaScript disabled the row still scrolls and every project is reachable.
- [ ] At 320px one panel fills the screen with the next peeking; no page-level sideways
      scroll (the viewport is the allowed exception in rule M2).
- [ ] Swiping the row at the left edge does not trigger browser back.
- [ ] At 1280x720 the pinned section fits: heading, tallest panel and progress line all
      visible without inner scrolling.
- [ ] With reduced motion on, the pin never engages; the row is a plain scroll-snap list.
- [ ] **In Firefox** (`npm run shots -- --project=firefox`) the section renders as the
      scroll-snap row and every panel is reachable by scrolling it.
- [ ] The progress line moves on both paths.
- [ ] Tab reaches every project link in DOM order.
- [ ] `grep -rn "framer-motion" src/pages/projects.tsx src/components/project-pan.tsx`
      returns nothing.

---

### Phase 8 — Skills

**Files:** rewrite `src/pages/skills.tsx`; `src/data/siteData.json` (section 7.2).

Entry 5 exactly. Base: term above description. `md:` `grid-cols-[210px_minmax(0,1fr)]`
with `items-baseline`. Seven rows. Accent on the primary clause only.

**Acceptance**
- [ ] No `<Badge>` remains in the file.
- [ ] Description column never exceeds 62ch.
- [ ] At 320px the term sits above its description with no cramped two-column squeeze.

---

### Phase 9 — Background (education, certifications, community)

**Files:** rewrite `src/pages/education.tsx`, `src/pages/certifications.tsx`,
`src/pages/extracurricular.tsx`; they become three blocks rendered inside one `Section`.

- Education: two entries, hanging layout, GPA right-aligned at `sm` and above, stacked
  below.
- Certifications: nine entries in issuer groups (Anthropic / Engineering and web /
  Adjacent). One column at base, two from `md`, three at `rail`. Each is a link to its
  verification URL with `target="_blank" rel="noopener"`.
- Community: entry 2's three-part card. One column at base, two from `sm`, three at `lg`.

Each block keeps its old `id` (`education`, `certifications`, `extracurricular`) with
`scroll-mt`.

**Acceptance**
- [ ] The three old anchors still work.
- [ ] Certification rows wrap without the issuer text colliding with the title at 320px.
- [ ] Community cards align on their top edges at every width where they sit in a row.

---

### Phase 10 — Contact, résumé, footer

**Files:** rewrite `src/pages/contact.tsx`, `src/pages/resume.tsx` (résumé becomes a block
inside the contact section, keeping `id="resume"`).

**The résumé needs a mobile-specific answer (defect D6).**

- Base and `md`: **no iframe.** Two buttons, "Open the résumé" and "Download PDF", plus the
  last-updated line. iOS Safari will not reliably render a PDF in an iframe and a blank
  grey box is worse than a clear button.
- `lg:` and above: the iframe preview, `aspect-ratio: 8.5/11`, `max-height: 75vh`, with the
  two buttons still present above it.
- Implement the switch with a CSS `hidden lg:block` on the preview, not a JS width check,
  so there is no hydration flash.

Contact: the five contact lines, `overflow-wrap: anywhere` on the URLs (rule M5), buttons
full width and stacked at base, inline from `sm`.

**Acceptance**
- [ ] No iframe is present in the DOM below 1024px.
- [ ] Email and profile URLs never overflow at 320px.
- [ ] `tel:` and `mailto:` links work on a phone.

---

### Phase 11 — Cleanup sweep

**Steps**
1. **Delete** `src/pages/testimonials.tsx` and its import, section and nav entry.
2. `grep -rn "0077B5\|00A0DC" src/` must return nothing. Nine files currently match (D2).
3. `grep -rn "min-h-screen\|h-screen" src/` must return nothing.
4. `grep -rn "bg-gradient" src/` must return nothing (N7).
5. **Remove `framer-motion` (Q10).** Order matters:
   a. `grep -rn "framer-motion" src/` and fix every remaining import. The last two are
      `back-to-top.tsx` (uses `AnimatePresence`, becomes an `opacity` plus `translateY`
      transition with the element toggled by `hidden`) and `github-stats.tsx` (uses
      `motion.div`, becomes the standard `useReveal` treatment).
   b. Only when that grep is empty: `npm uninstall framer-motion`.
   c. `npx tsc -b` and `npm run lint` again. A missed import fails the type check, which
      is the point of doing it in this order.
6. `grep -rn "siteData.json" src/pages src/components` must return nothing. Everything
   reads through `@/data/adapters` (section 7.5).
7. Delete now-unused shadcn primitives: `sidebar.tsx`, `sheet.tsx`, `breadcrumb.tsx`,
   `collapsible.tsx`, `progress.tsx`, `skeleton.tsx` **only if** nothing imports them.
   Verify each with grep before deleting. Remove the matching `@radix-ui/*` dependencies
   from `package.json` in the same commit, then `npm install` to update the lockfile.
8. Delete `src/components/section-divider.tsx`, `src/components/app-sidebar.tsx`,
   `src/components/layout.tsx`, `src/components/scroll-progress.tsx` if Phase 2 has not
   already.
9. Check `src/styles/print.css` against the new class names and update the selectors it
   targets. It is imported globally and currently references the old structure. A
   recruiter printing the page is a real use for this site, so give it one actual print
   preview rather than assuming.
10. `src/types/types.ts` is empty (0 lines). Either populate it from section 7.5 or delete
    it.

**Acceptance:** all six greps return nothing; `npx tsc -b` and `npm run lint` pass; the dev
server shows no missing-module errors; `npm run shots` still renders every section.

---

### Phase 12 — Responsive and accessibility verification

Run the full section 5.5 matrix against the **finished page**, not section by section.

**Steps**
1. `npm run shots` in both projects: `--project=chromium` and `--project=firefox`. Review
   all 32 images. This replaces eyeballing sixteen widths by hand and is where layout
   breakage shows up.
2. Eight widths x two themes: the overflow console check from 5.5. A screenshot cannot see
   a 1px horizontal overflow, so this one stays manual.
3. Two heights (720, 844) for the pinned section and the rail.
4. Full keyboard traversal of the page, top to bottom, at 375 and at 1280. Focus ring
   visible at every stop, order matches reading order, the project row reachable.
5. Reduced-motion reload at both widths. Nothing invisible, nothing animating, the pan not
   pinned.
6. Lighthouse on mobile emulation. Record the four scores in `docs/after/lighthouse.md`.
   Targets: Performance 90+, Accessibility 100, Best Practices 100, SEO 100.
7. Zoom the browser to 200% at 1280 and confirm nothing is cut off (WCAG 1.4.4).
8. Print preview at A4, since `print.css` ships globally and a recruiter printing this page
   is a real scenario.

**Acceptance:** every check passes, results recorded in `docs/after/`.

---

### Phase 13 — Performance

**Steps**
1. **`avatar.png` is 687 KB (D5).** Produce a 104px WebP (2x of the 52px rail slot) and,
   if Q8 puts a photo anywhere larger, a second size for that. Keep the PNG as a fallback
   only if a `<picture>` element is used. Add explicit `width` and `height`.
2. Confirm the font link requests only the weights in the ladder (3 display, 3 body,
   2 mono). Nothing else.
3. `npm run build` (safe now that Phase 0.1 has unwired the publish) and compare against
   the measured baseline: **517.92 KB raw, 163.44 KB gzipped JS** on 2026-09-18. Removing
   `framer-motion` and the four unused Radix packages should move this down materially.
   Record the new number in `docs/after/bundle.md`. If it has not dropped, something is
   still importing what was meant to be deleted; find it rather than shipping.
4. Confirm `GitHubStats` (kept in About, Q9) has a skeleton with a reserved height so the
   live fetch cannot shift layout. It is an unauthenticated GitHub API call, so also
   confirm the error path renders something sensible rather than an empty box when the
   request is rate limited.

**Acceptance:** LCP element identified and under 2.5s on a simulated Fast 3G mobile run;
CLS under 0.1.

---

## 7. Data model changes

All changes are to `src/data/siteData.json`. **This file may be generated from
`master-resume.yaml` by an existing sync process** (see commit `0e1cef5`). If it is, these
shape changes have to go into the generator too, or the next sync will overwrite them.
**(Q11: resolved.)** There is no generator inside this repo. `master-resume.yaml` does not
exist here, there is no `scripts/` directory, and the only trace is the commit message on
`0e1cef5`, so the sync came from outside this repository and could recur. The chosen
answer is therefore the adapter layer: **the raw shape of `siteData.json` is left alone**
and every reshape happens in a new `src/data/adapters.ts`. That keeps the file
sync-compatible no matter what writes it next. Sections 7.1 and 7.2 below describe the
shapes the adapters must **return**, not the shapes to write into the JSON.

### 7.1 `experience[].bullets` — the adapter returns `{ lead, rest }`

Entry 3's scan layer needs a bolded lead clause and a plain string has nothing to bold.
**`siteData.json` keeps its plain strings.** The split lives in `src/data/adapters.ts` as
a lookup keyed by company and bullet index, so a future résumé sync cannot destroy it and
cannot silently un-bold the page either. Shape the adapter returns:

```json
"bullets": [
  {
    "lead": "Shipped two greenfield React single page apps",
    "rest": "and extended an existing codebase for charity golf live scoring and tournament operations, with layouts that hold from a phone in a cart to a 4K television in the clubhouse."
  },
  { "lead": "", "rest": "Worked Scrum in a remote team through weekly standups, Trello and GitHub review, and helped with production builds, deployments and testing." }
]
```

An empty `lead` renders the bullet unbolded. **Exactly one bullet per job must have an
empty lead** — the process bullet. The renderer treats `lead === ""` as "no strong".

Full split text for all ten bullets across the two jobs: take it verbatim from the
*Parth Patel Ships* artifact, which is already written this way. Do not re-split by hand.

**Drift guard.** If the adapter has no entry for a bullet, or if the source string in the
JSON has changed so the `lead` is no longer a prefix of it, the adapter returns
`{ lead: "", rest: <the raw string> }`. The bullet then renders unbolded rather than
showing stale text. Never let the adapter print a lead that is not actually the opening of
the current source string.

### 7.2 `skills` — the adapter returns an array of groups

```json
"skills": [
  { "label": "Languages",        "primary": ["TypeScript", "JavaScript", "Python"], "rest": "Java, C++ and C# from coursework and .NET work." },
  { "label": "Interface",        "primary": ["React 19", "Tailwind CSS", "shadcn/ui"], "rest": "Redux Toolkit, Vite, React Hook Form, Zod and TanStack Table, with Vue and AngularJS earlier on." },
  { "label": "Services and data","primary": ["FastAPI", "Node.js", "Express"], "rest": "Flask, PostgreSQL, MongoDB, SQLite, REST design and Server Sent Events." },
  { "label": "Applied AI",       "primary": ["LiteLLM", "prompt engineering", "multi agent workflows"], "rest": "Machine learning through model training, evaluation and imbalanced data handling." },
  { "label": "Shipping",         "primary": ["Docker", "AWS S3", "GitHub Pages"], "rest": "IIS, CI/CD pipelines, Git and GitHub review flow, production build management." },
  { "label": "Verification",     "primary": ["pytest", "Playwright", "coverage.py"], "rest": "MutPy for mutation analysis, ESLint, and deterministic mock modes so suites stay CI safe." },
  { "label": "Daily tools",      "primary": ["Claude Code", "GitHub Copilot", "Cursor"], "rest": "Visual Studio, n8n, and the habit of reading the diff before the agent commits it." }
]
```

Note **Verification is a new group** with no equivalent in the current JSON. It is one of
the strongest groups given the MRTD mutation testing and the 102 tests on the résumé
platform, and it is currently invisible on the site. The `rest` sentences are prose and
must not be generated by joining arrays.

This array is **authored in `adapters.ts`**, not in the JSON. The raw `skills` object stays
exactly as it is. The adapter does not read it at all, because the grouping and the prose
are editorial decisions that a flat list cannot carry. Keep the raw object in the file so
a future sync has somewhere to land, and so nothing downstream breaks.

### 7.5 `src/data/adapters.ts` — the contract

One new file, the only place that knows about both shapes.

```ts
import siteData from "@/data/siteData.json";

export type Bullet = { lead: string; rest: string };
export type Role   = { company: string; role: string; dates: string; location: string; bullets: Bullet[] };
export type SkillGroup = { label: string; primary: string[]; rest: string };

export const roles: Role[] = /* siteData.experience mapped through the bullet lookup */;
export const skillGroups: SkillGroup[] = /* authored here, see 7.2 */;
export const profile = siteData.profile;
export const projects = siteData.projects;
export const education = siteData.education;
export const certifications = siteData.certifications;
export const community = siteData.extracurricular;
```

**Rules for this file.**

- Pages import from `@/data/adapters`, never from `@/data/siteData.json` directly. One
  `grep -rn "siteData.json" src/pages src/components` should return nothing when the
  rewrite is finished.
- Pass-through exports exist so that a later shape change has exactly one place to absorb
  it.
- Populate `src/types/types.ts` (currently empty, 0 lines) with these types, or define
  them here and delete that file. Do not leave both.

### 7.3 `extracurricular[].name`

`name` duplicates `role` in all three entries. The card renders `role`, so leave `name`
unused or delete the key. Do not render both.

### 7.4 Dependencies

**Add, exactly one:** `@playwright/test` as a **dev** dependency (Phase 1.5). It never
reaches the browser bundle.

**Remove:**

| Package | When | Why |
| --- | --- | --- |
| `framer-motion` | Phase 11, after every import is gone | Q10. Reveals move to `useReveal` plus CSS, the pan needs no library, `ScrollProgress` and `SectionDivider` are deleted. Confirm with `grep -rn "framer-motion" src/` returning nothing **before** uninstalling. |
| `@radix-ui/react-collapsible` | Phase 11 | only `ui/collapsible.tsx` imports it, which the sidebar used |
| `@radix-ui/react-progress` | Phase 11 | only `ui/progress.tsx`, unused after the skills rewrite |
| `@radix-ui/react-dialog` | Phase 11, **only if** `ui/sheet.tsx` is deleted | the mobile sidebar drawer used it |

Everything else stays. Removing a package means editing `package.json` and running
`npm install` in the same commit so the lockfile matches.

---

## 8. Copy deck

Use these strings verbatim. They are already written and vetted in the artifacts.

### 8.1 Opening

| Slot | String |
| --- | --- |
| Status pill | `Open to full-time roles` |
| Headline | `I build the part people actually touch.` with `touch.` in accent |
| Lede | `React and TypeScript in front, FastAPI and Python behind, tested before anyone else sees it.` |
| Primary CTA | `See what I have built` → `#projects` |
| Secondary CTA | `Read the résumé` → the PDF |

**Q12: the site must not call him a student.** He graduated in May 2026. Three strings in
the current build assume otherwise and are replaced, not edited:

| Where | Current, wrong | Replace with |
| --- | --- | --- |
| `home.tsx` hero paragraph | `MS Computer Science student at Stevens Institute of Technology with 1.5 years of full-stack development experience...` | the Lede above. The degree belongs in About and in Background, where it is stated as held, not in progress. |
| `home.tsx` badge | `Open to Full-Time Opportunities` | `Open to full-time roles` |
| `siteData.json` `profile.summary` | `...Seeking Software Developer and Full Stack Developer roles.` | `...Open to Software Developer, AI and machine learning, and Forward Deployed Engineer roles.` |

`about.bio` already opens "I hold an MS in Computer Science", which is correct as it
stands. Do not touch it.

### 8.2 The three figures, and where each number comes from

| Figure | Label | Derivation |
| --- | --- | --- |
| `3.9` | Graduate GPA at Stevens, out of 4.0 | `education[0].gpa` |
| `102` | Automated tests on one platform, backend and browser | 89 backend unit tests + 13 Playwright tests, both from the résumé platform highlights |
| `9` | Projects shipped and documented | `projects.length` |

**The months figure is gone (Q13).** The artifact printed "19 months of paid development
work", but EventEase ran Sept to Dec 2025 (4 months) and TechBilv Jan 2023 to Aug 2024
(20 months), which totals 24. Rather than print a number that would have to be walked back
in an interview, the strip carries three figures. Do not reintroduce it, and do not
substitute 24 without being asked.

### 8.3 Section headings

| Section | Heading |
| --- | --- |
| About | `How I build.` |
| Experience | `Two internships, both spent putting software in front of strangers.` |
| Projects | `What I have built.` |
| Skills | `How I work.` |
| Background | `Study, credentials and community.` |
| Contact | `Hiring a full stack developer?` |

### 8.4 Contact

| Slot | String |
| --- | --- |
| Lede | `Open to software engineering, AI and machine learning, and forward deployed engineer roles. Email reaches me fastest, and I answer the same day.` |
| Primary CTA | `Email Parth` |
| Secondary CTA | `Read the résumé` |

**One label per intent** across the whole page: contact is always `Email Parth`, the
résumé is always `Read the résumé`, the work is always `See what I have built`.

---

## 9. Component inventory

### New

| File | Purpose |
| --- | --- |
| `components/site-shell.tsx` | rail + content grid |
| `components/rail-nav.tsx` | desktop identity rail |
| `components/mobile-nav.tsx` | sticky header + chip row |
| `components/section.tsx` | section wrapper, rhythm and anchors |
| `components/status-pill.tsx` | entry 1 |
| `components/figure-strip.tsx` | the three figures |
| `components/project-pan.tsx` | entry 4, CSS scroll-driven, no library |
| `hooks/use-active-section.ts` | IntersectionObserver nav state |
| `hooks/use-reveal.ts` | reveal on scroll, reduced-motion aware |
| `data/adapters.ts` | the only module that reads `siteData.json` (7.5) |
| `playwright.config.ts` | screenshot harness config (Phase 1.5) |
| `tests/shots.spec.ts` | 8 widths x 2 themes |

### Rewritten

`pages/home.tsx`, `about.tsx`, `experience.tsx`, `projects.tsx`, `skills.tsx`,
`education.tsx`, `certifications.tsx`, `extracurricular.tsx`, `contact.tsx`,
`resume.tsx`, plus `App.tsx` and `index.css`.

### Deleted

`components/layout.tsx`, `components/app-sidebar.tsx`, `components/section-divider.tsx`,
`components/scroll-progress.tsx`, `pages/testimonials.tsx`, and the unused shadcn
primitives listed in Phase 11.

### Touched only to remove `framer-motion`

`components/back-to-top.tsx` (its `AnimatePresence` becomes a CSS transition) and
`components/github-stats.tsx` (its `motion.div` becomes `useReveal`, and its hardcoded hex
goes at the same time).

### Untouched

`theme-provider.tsx`, `error-boundary.tsx`, `seo-head.tsx`, `mode-toggle.tsx`,
`use-mobile.ts`, `use-toast.ts`, `lib/utils.ts`, `ui/button.tsx`, `ui/badge.tsx`,
`ui/toast.tsx`, `ui/toaster.tsx`, `ui/avatar.tsx`, `ui/tooltip.tsx`, `ui/separator.tsx`.

---

## 10. Risks and rollback

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| **A stray `npm run build` deploys an unfinished redesign** | High until Phase 0.1 is done | Phase 0.1 removes the `ghPages()` plugin; rule 2 bans the command as a check |
| A future résumé sync overwrites `siteData.json` | Medium | Resolved by design: the adapter layer means the raw JSON shape never changes, so a sync cannot break the UI (7.5) |
| `animation-timeline` unsupported in a target browser | Medium | The fallback is the scroll-snap row, which is a shipping-quality state; verified in Firefox in Phase 7 and 12 |
| The pinned pan does not fit a short laptop | Medium | Phase 7 acceptance tests 1280x720 explicitly |
| Deleting shadcn primitives or `framer-motion` breaks an unnoticed import | Medium | grep before each delete, uninstall only after the grep is empty, `npx tsc -b` after each |
| Removing `#testimonials` breaks an inbound link | Low | Accepted (Q1). If it ever matters, put the id on the contact section |
| Font swap causes layout shift | Low | `display=swap` plus reserved heights; CLS checked in Phase 12 |
| Adapter drift: a bullet's `lead` no longer matches the JSON string | Low | The adapter falls back to the raw string unbolded (7.1) |

**Rollback:** every phase is one commit on `redesign/ui-v2`. `git revert` the phase commit,
or `git checkout main -- <file>` for a single file. `main` stays deployable throughout.

---

## 11. Definition of done

- [ ] All 15 phases complete (0, 0.1, 1, 1.5, 2 to 13), each with its acceptance criteria met.
- [ ] `npx tsc -b` and `npm run lint` clean.
- [ ] `npm run build` runs **without publishing**, and its bundle number is recorded and
      lower than the 163.44 KB gzipped baseline.
- [ ] Section 5.5 matrix passes at eight widths, two heights, two themes.
- [ ] The six Phase 11 greps all return nothing, including `framer-motion` and
      `siteData.json` outside the adapter.
- [ ] `npm run shots` is green in both chromium and firefox.
- [ ] Lighthouse mobile: Accessibility 100, Performance 90+.
- [ ] Every old section id still resolves except `#testimonials`.
- [ ] No fabricated content anywhere on the page, and no string calls him a student.
- [ ] Before and after screenshots at 375 and 1440 saved in `docs/`.
- [ ] The site is **not** deployed. Deployment is a separate, explicit decision by the
      owner, run as `npm run deploy`.

---

## 12. Suggested execution order for a fresh session

If you are picking this up without the conversation history: read
`notes-from-artifacts.md` first (entries 1 to 8 are the design decisions), then this plan
top to bottom, then start at Phase 0 and **do Phase 0.1 immediately after**, before any
other work, because until it is done a build publishes the site.

Order: 0, 0.1, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13.

Sections 5 (the responsive contract) and 8 (the copy deck) are the two you will refer back
to most. Section 13 records why each decision was made, which is worth reading before
proposing a change to any of them.

---

## 13. Decisions (all fourteen questions answered, 2026-09-18)

No open questions remain. This section is the record; the plan body above already reflects
every answer.

| # | Question | Decision | Lives in |
| --- | --- | --- | --- |
| Q1 | Testimonials section | **Delete.** `#testimonials` is the one id that dies | §3, Phase 11 |
| Q2 | Body and mono face | **Geist + Geist Mono** | §4.3 |
| Q3 | Shape language | **Soft.** 6px radius, 1px borders, everywhere. The pill and the community cards adapt | §4.4 |
| Q4 | Verification depth | **Add Playwright** for responsive screenshots. Set up early, in Phase 1.5, so every later phase can use it | Phase 1.5, §5.5, Phase 12 |
| Q5 | Colour notation | **Hex**, matching the measured contrast values | §4.1, Phase 1 |
| Q6 | Mobile navigation | **Sticky 56px header plus a scrollable chip row.** No hamburger | Phase 2.3 |
| Q7 | Scroll progress bar | **Remove** it and delete the component | Phase 2.5, Phase 11 |
| Q8 | Photo placement | **Rail only, 52px.** No hero portrait | Phase 4 |
| Q9 | GitHub stats card | **Keep in About**, with a reserved-height skeleton and a sensible rate-limited state | Phase 5, Phase 13 |
| Q10 | Animation library | **Neither.** CSS scroll-driven animation, and `framer-motion` is removed from the project. Decided on the owner's behalf; full reasoning in Phase 7.2 | Phase 7, Phase 11, §7.4 |
| Q11 | `siteData.json` generator | **Adapter layer.** No generator exists in this repo, but the sync came from outside it and could recur, so the raw JSON shape is never changed | §7, §7.5 |
| Q12 | Dated copy | **Graduate, not student.** Availability line is `Open to full-time roles`; targeted roles are software engineering, AI and machine learning, and forward deployed engineer | §8.1, §8.4 |
| Q13 | The "19 months" figure | **Dropped.** Three figures, not four. The months did not reconcile (4 + 20 = 24) | §8.2, Phase 4 |
| Q14 | Scope | **As planned.** Reverting from git is an acceptable safety net | §10 |

### The two that needed more than a preference

**Q10 was delegated to me.** I chose no library at all. The short version: the bundle is
already 163 KB gzipped on a static portfolio, `framer-motion` turned out to have no job
left after Phase 3 replaces every reveal, the pan's distance maths is expressible in pure
CSS, and the fallback for unsupported browsers is the scroll-snap row that phones get
anyway, so nothing is lost where the feature is missing. Adding GSAP to gain a slightly
crisper pin, or keeping framer-motion for one effect, both cost 25 to 40 KB for a
desktop-only decoration. Full reasoning and the escape hatch are in Phase 7.2.

**Q11 was answered "I think there is no generator".** I checked: there is no
`master-resume.yaml` in this repository, no `scripts/` directory, and no sync tooling. The
only trace is the commit message on `0e1cef5`, which means the sync ran from outside this
repo and could run again. The adapter layer was the right choice regardless, and it now
costs nothing to keep: `siteData.json` is never reshaped, so any future sync is harmless.

### Answers as given

> Q1 delete · Q2 (a) · Q3 (a) · Q4 (b) for now · Q5 (a) · Q6 (a) · Q7 (a) · Q8 (a) ·
> Q9 (a) · Q10 "not sure, take that decision" · Q11 "I think there is no generator, go with
> c" · Q12 "update the necessary details, I already graduated and I am open and available
> for any full time roles which fits my projects I have done in AI-ML, software
> development, Forward deployed Engineer roles" · Q13 "drop the number" · Q14 "nothing, if
> something goes wrong we can revert back"

---

*Revision 2 is final. Phase 0 can start.*
