# Notes from artifacts

Effects worth keeping from the portfolio design concepts, written down so they can be
lifted into the real React site later. One entry per effect: what it is, why it works,
the exact source, and the port into this repo's stack (React 19 + Tailwind v4 + shadcn).

---

## 1. Availability status pill with a blinking dot

**From:** *Patel Spec Sheet* concept, hero section
(https://claude.ai/artifact/TVWpQoRbPHRLcCSbWhuozQ)

**What it is:** a small uppercase mono label in a hard-bordered pill, led by a square
dot that blinks on and off like an LED, reading `Open to full-time · Spring 2026`.

**Why it works**

- The blink is `steps(1, end)`, not a fade. It snaps between two opacity values, which
  reads as a status indicator rather than decoration. An eased pulse would look like a
  loading spinner; a hard switch looks like hardware.
- The cycle is asymmetric: bright for 60% of 2s, dimmed for 40%. Even on-off timing
  reads as a warning; weighted-on reads as healthy.
- It dims to `0.25` opacity instead of disappearing. The dot never leaves a hole in the
  layout, and the eye is drawn without being nagged.
- The dot is square, matching the page's 0px radius everywhere else. Shape consistency is
  what keeps it from looking like a bolted-on widget.
- Colour carries a second signal (green = available) but the text says the same thing, so
  the meaning survives for anyone who cannot see the colour.

### Markup

```html
<span class="status">
  <span class="pulse" aria-hidden="true"></span>
  Open to full-time · Spring 2026
</span>
```

The dot is `aria-hidden` on purpose: it is decorative, the text next to it is the content.

### CSS, as written in the artifact

Depends on these tokens: `--mono`, `--rule: 2px`, `--border`, `--card`, `--ok`.

```css
.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: var(--rule) solid var(--border);
  padding: 7px 10px;
  background: var(--card);
}

.status .pulse {
  width: 8px;
  height: 8px;
  background: var(--ok);
  display: block;
  animation: blink 2s steps(1, end) infinite;
}

@keyframes blink {
  0%, 60%   { opacity: 1; }
  61%, 100% { opacity: 0.25; }
}
```

### Standalone version, no tokens

```css
.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 2px solid #09090b;      /* dark mode: #f4f4f5 */
  background: #ffffff;            /* dark mode: #141417 */
  padding: 7px 10px;
}
.status .pulse {
  width: 8px;
  height: 8px;
  display: block;
  background: #15803d;            /* dark mode: #4ade80 */
  animation: blink 2s steps(1, end) infinite;
}
@keyframes blink {
  0%, 60%   { opacity: 1; }
  61%, 100% { opacity: 0.25; }
}
```

Colour values used in the concept:

| Token | Light | Dark |
| --- | --- | --- |
| `--ok` (dot) | `#15803D` | `#4ADE80` |
| `--border` | `#09090B` | `#F4F4F5` |
| `--card` (pill fill) | `#FFFFFF` | `#141417` |

### Port into this repo

This site uses Tailwind v4 with CSS variables in `src/index.css`. Add the keyframes and
an `--ok` colour there, then the component is one span.

In `src/index.css`, inside `@layer base`:

```css
:root  { --ok: oklch(0.52 0.14 150); }   /* green, light mode */
.dark  { --ok: oklch(0.80 0.18 150); }   /* brighter on dark */

@keyframes status-blink {
  0%, 60%   { opacity: 1; }
  61%, 100% { opacity: 0.25; }
}
.animate-status-blink { animation: status-blink 2s steps(1, end) infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-status-blink { animation: none; }
}
```

Component:

```tsx
export function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 border-2 border-foreground bg-card
                     px-2.5 py-[7px] font-mono text-[11px] font-bold uppercase tracking-[0.12em]">
      <span
        aria-hidden="true"
        className="block h-2 w-2 bg-[var(--ok)] animate-status-blink"
      />
      {children}
    </span>
  );
}
```

Usage in `src/pages/home.tsx`, replacing the current `Sparkles` + "Open to Full-Time
Opportunities" badge:

```tsx
<StatusPill>Open to full-time · Spring 2026</StatusPill>
```

### Do not lose these details when porting

- **Reduced motion.** An infinite loop must stop under `prefers-reduced-motion: reduce`.
  The artifact handles it with a global reduce block; the Tailwind port above needs its
  own media query, included.
- **Keep `steps(1, end)`.** Swapping in a default ease turns a status light into a
  breathing animation and loses the whole point.
- **Keep the text.** The dot alone is not a message. If the pill ever shrinks to just a
  dot, it needs a `title` or visually hidden text.
- **Match the radius to the page.** Square dot on a 0px-radius page; if this moves onto a
  rounded design, round both the pill and the dot together.
- **One per page.** A status dot next to every nav item or list row is noise. It earns its
  place because exactly one thing on the page has live status.

---

## 2. Extracurricular / community entries — DECIDED FORMAT for the final build

**From:** *Patel Spec Sheet* concept, `#community` section
(https://claude.ai/artifact/TVWpQoRbPHRLcCSbWhuozQ)

**Decision:** the final site uses this layout for the extracurricular section. Three equal
cards in a row, each one: date kicker on top, role as the heading, organisation bolded as
the lead-in to the summary sentence.

**Why it works**

- **Role is the heading, not the club.** "Co-Founder / Event Head" is the credential a
  recruiter scans for; the organisation is context and belongs in the sentence.
- **The organisation leads the paragraph in bold**, so it still reads first within the
  prose without competing with the heading for the type hierarchy.
- **Dates sit above as a small mono kicker**, out of the reading path. They answer "when"
  for anyone who asks, and stay invisible to anyone who doesn't.
- **Every card holds exactly three parts** in the same order, so the three read as one
  object rather than three unrelated boxes. Card height is set by content, and a flex
  column with `gap: 12px` keeps baselines aligned across the row.
- Three cards for three entries. If a fourth is ever added, it goes to a 2x2, never a row
  of three with one orphan underneath.

### Markup pattern

```html
<article class="card">
  <span class="kicker">Mar 2026 – May 2026</span>
  <h3>Volunteer / Organizer</h3>
  <p><strong>SPY, The Graduate AI Club, Stevens.</strong> Supported event planning,
  speaker coordination and community engagement; handled logistics for workshops,
  guest lectures and networking events.</p>
</article>
```

### CSS from the artifact

```css
.grid { display: grid; gap: var(--space-3); }
.g3   { grid-template-columns: 1fr; }
@media (min-width: 680px)  { .g3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1040px) { .g3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

.card {
  border: var(--rule) solid var(--border);
  background: var(--card);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 150ms linear, transform 150ms linear;
}
.card:hover { box-shadow: var(--hard-sm); transform: translate(-2px, -2px); }
.card h3 {
  margin: 0;
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.card p { margin: 0; font-size: 14.5px; color: var(--muted-fg); }

.kicker {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted-fg);
}
```

The hover is a hard offset shadow plus a 2px diagonal nudge, no blur, no scale. It belongs
to that concept's brutalist shape language; on a rounded design use a soft shadow and drop
the translate, but keep the three-part card structure, which is the part being adopted.

### Field mapping from `src/data/siteData.json`

The `extracurricular[]` entries already carry everything this layout needs:

| Card slot | JSON field | Example |
| --- | --- | --- |
| kicker | `dates` | `"May 2021 – Aug 2022"` |
| heading | `role` | `"Co-Founder/Event Head"` |
| bold lead-in | `org` | `"Student Club IDE, GEC Gandhinagar"` |
| body | `summary` | the sentence that follows |

`name` duplicates `role` in the current data, so the card ignores it. Either drop `name`
from the JSON or leave it unused; do not print both or the heading repeats itself.

### Port into this repo

```tsx
import siteData from "@/data/siteData.json";

export default function Extracurricular() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {siteData.extracurricular.map((item) => (
        <article
          key={`${item.org}-${item.dates}`}
          className="flex flex-col gap-3 border-2 border-foreground bg-card p-6
                     transition-[box-shadow,transform] duration-150
                     hover:-translate-x-0.5 hover:-translate-y-0.5
                     hover:shadow-[4px_4px_0_var(--foreground)]"
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]
                           text-muted-foreground">
            {item.dates}
          </span>
          <h3 className="font-mono text-lg font-extrabold tracking-tight">{item.role}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">{item.org}.</strong> {item.summary}
          </p>
        </article>
      ))}
    </div>
  );
}
```

### Caveats

- Keep the summaries to roughly the length they are now. The cards align on their top
  edges; one paragraph running to twice the others' length breaks the row visually.
- The hover lift must not be the only affordance if a card ever becomes clickable. These
  are not links today, which is why hover is decoration rather than a control.
- Section heading stays "Community" or "Extracurricular", not a cute label.

---

## 3. Work / experience section — DECIDED FORMAT for the final build

**From:** *Parth Patel Portfolio* concept, `#work` section
(https://claude.ai/artifact/Y1m4DCRjemKSYVUn3gSAKa)

**Decision:** the final site uses this layout for experience. A narrow left column holding
company, role and dates that **sticks** while the bullets scroll past it on the right.
Each bullet opens with a bolded verb phrase. No cards, no borders around the entries, just
a hairline between jobs.

**Why it works**

- **The sticky meta column solves the long-bullet problem.** Six bullets is a lot of
  scrolling; without the pin, a reader halfway down has lost track of which employer they
  are reading about. The company name stays on screen the whole time, at zero cost to the
  reading column.
- **The bold lead-in is the scan layer.** A recruiter reads only the bolded phrases first
  ("Shipped two greenfield React single page apps", "Architected the front ends",
  "Built the organiser CMS") and gets the whole job in five seconds. The detail after it
  is there for whoever wants it.
- **The last bullet is deliberately not bolded.** Process work (standups, Trello, code
  review) is real but it is not an achievement, so it does not get the emphasis. That one
  unbolded line is what stops the bold from becoming wallpaper.
- **68ch measure on the bullets.** Long lines are where dense resume prose goes to die.
- **No card.** The entries are separated by one hairline and generous space. Boxing them
  would add four borders per job and make the section look like a dashboard.
- Asymmetric column ratio `0.8fr / 2fr`: the meta column is deliberately narrower than a
  half split, so the prose keeps the visual weight.

### CSS from the artifact

```css
.role { display: grid; gap: 20px; padding-top: 40px; }
@media (min-width: 900px) {
  .role { grid-template-columns: minmax(0, 0.8fr) minmax(0, 2fr); gap: 56px; padding-top: 56px; }
  .role .meta { position: sticky; top: 96px; align-self: start; }
}
.role + .role { border-top: 1px solid var(--line-2); }

.role h3     { font-size: clamp(22px, 3vw, 30px); letter-spacing: -0.035em; }
.role .where { color: var(--ink-2); font-size: 15px; margin-top: 8px; }
.role .when  { color: var(--ink-3); font-size: 14px; margin-top: 4px;
               font-variant-numeric: tabular-nums; }

.role ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 18px; }
.role li { max-width: 68ch; color: var(--ink-2); }
.role li strong { color: var(--ink); font-weight: 600; }
```

`align-self: start` is what makes the sticky work inside a grid row; without it the meta
column stretches to the row height and never pins. `top: 96px` clears the sticky header,
so that value has to match whatever header height the final build lands on.

### Markup pattern

```html
<article class="role">
  <div class="meta">
    <h3>EventEase</h3>
    <div class="where">Software Development Intern, remote and New Jersey</div>
    <div class="when">Sept 2025 to Dec 2025</div>
  </div>
  <ul>
    <li><strong>Shipped two greenfield React single page apps</strong> and extended an
    existing codebase for charity golf live scoring, delivering layouts that work on a
    phone and on a 4K TV in the clubhouse.</li>
    <!-- ... -->
    <li>Worked Scrum in a remote team on weekly standups, Trello and GitHub reviews.</li>
  </ul>
</article>
```

### The one thing that needs a data change

`siteData.json` stores each bullet as a single plain string, so there is nothing to bold.
The concept split each bullet by hand. Pick one of these before building:

1. **Split the field** (preferred): `bullets: [{ lead: "Shipped two greenfield React single
   page apps", rest: "and extended an existing codebase for..." }]`. Explicit, no parsing,
   and it forces the lead to be written as a real verb phrase.
2. **Mark it inline**: `"**Shipped two greenfield React single page apps** and extended..."`
   and render with a tiny bold-splitter. Keeps the JSON flat, costs a render helper.
3. **Bold the first clause automatically** by splitting on the first comma or preposition.
   Rejected: it produces awkward breaks like "Integrated end to end REST workflows with
   Axios across authentication" and cannot know which bullet should stay unbolded.

Whichever way, keep one bullet per job unbolded for the process work.

### Port into this repo

```tsx
import siteData from "@/data/siteData.json";

export default function Experience() {
  return (
    <div className="divide-y divide-border">
      {siteData.experience.map((job) => (
        <article
          key={job.company}
          className="grid gap-5 pt-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] md:gap-14 md:pt-14"
        >
          <div className="self-start md:sticky md:top-24">
            <h3 className="text-2xl tracking-tight md:text-3xl">{job.company}</h3>
            <div className="mt-2 text-[15px] text-muted-foreground">
              {job.role}, {job.location}
            </div>
            <div className="mt-1 text-sm tabular-nums text-muted-foreground">{job.dates}</div>
          </div>
          <ul className="grid gap-[18px]">
            {job.bullets.map((b, i) => (
              <li key={i} className="max-w-[68ch] text-muted-foreground">
                {/* render lead in <strong className="font-semibold text-foreground"> */}
                {b}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
```

### Caveats

- **Sticky needs room to work.** If a job only has two bullets, the meta column pins for a
  few pixels and looks broken. Below roughly four bullets, drop the sticky for that entry
  or keep the section uniform by not sticking at all.
- **`top` must match the real header height**, and the section needs `scroll-margin-top`
  to match, or anchor jumps land under the header.
- **Mobile drops to one column** with the meta stacked above; sticky is off below 900px on
  purpose, since on a phone the pinned block would eat a third of the screen.
- **Bold is for the claim, never the tools.** Bolding "React 19, Vite, TypeScript" inside
  the detail would double the emphasis and kill the scan layer.

---

## 4. Selected work — scroll-driven horizontal pan — DECIDED FORMAT for the final build

**From:** *Patel Build Index* concept, `#projects` section
(https://claude.ai/artifact/Pv8RHLnvpU5Dws1epSqrsk)

**Decision:** the projects section pins to the viewport and the reader keeps scrolling
down as normal, while the four featured builds travel sideways. Vertical scroll input,
horizontal movement. On phones and without JavaScript the exact same markup stays a native
swipeable row, so nothing is lost.

**Why it works**

- **Each project stays full size.** Four projects in a normal grid means four shrunken
  cards; panning sideways gives every build a 560px panel with its description, stack and
  four real metrics, and the reader still sees them one at a time.
- **The input never changes.** The reader scrolls down, which is what they were already
  doing. No drag, no arrows to hunt for, no hijack that fights the trackpad.
- **`scrub: 1` ties the movement to the scrollbar** with a one second catch-up, so it
  tracks the finger rather than playing an animation at the reader.
- **A thin progress line under the track** gives the "how much is left" feedback that a
  pinned section otherwise steals from the scrollbar. It is a progress bar, not a
  "1 of 4" counter, so it never turns into pagination chrome.
- **It degrades into the same thing it already is.** The fallback is not a second layout,
  it is the unenhanced layout: `overflow-x: auto` plus `scroll-snap-type: x mandatory`.

### CSS

```css
.pan { padding-block: var(--s6) var(--s5); }
@media (min-width: 900px) { .pan { padding-block: var(--s7) var(--s6); } }

/* class added by JS only when the pin actually engages */
.pan.is-pinned {
  min-height: 100dvh;
  display: flex; flex-direction: column; justify-content: center;
  padding-block: var(--s4);
}
.pan.is-pinned .pan-head { margin-bottom: var(--s3); }
.pan.is-pinned .panel    { padding: var(--s3); }

.pan-viewport { overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: thin; }
.pan.is-pinned .pan-viewport { overflow: hidden; scroll-snap-type: none; }

.pan-track { display: flex; gap: var(--s3); padding-inline: var(--gutter); padding-bottom: var(--s2); }
@media (min-width: 1360px) {
  .pan-track { padding-inline: calc((100vw - var(--shell)) / 2 + var(--gutter)); }
}

.panel {
  scroll-snap-align: start;
  flex: none;
  width: min(88vw, 560px);
  background: var(--raised);
  border: 1px solid var(--rule);
  border-radius: var(--r);
  padding: var(--s4);
  display: flex; flex-direction: column; gap: var(--s2);
}

.pan-progress { height: 2px; background: var(--rule-2); margin-top: var(--s3); }
.pan-progress i { display: block; height: 100%; width: 0; background: var(--accent);
                  transition: width 120ms linear; }
```

### The GSAP half

```js
if (window.gsap && window.ScrollTrigger && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1000px)', () => {
    pan.classList.add('is-pinned');
    const distance = () => track.scrollWidth - viewport.clientWidth;

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pan,
        start: 'top top',
        end: () => '+=' + distance(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => progress(self.progress),
      },
    });

    return () => {                         // matchMedia cleanup
      pan.classList.remove('is-pinned');
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(track, { clearProps: 'x' });
    };
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
```

The five things that make it behave:

| Setting | Why |
| --- | --- |
| `start: 'top top'` | pins when the section's top meets the viewport top. `'top center'` or `'top 80%'` starts the pan halfway through and shows half a panel. |
| `end: () => '+=' + distance()` | scroll length equals the horizontal travel, so the pan finishes exactly as the section releases. As a function, not a string, so it recalculates. |
| `invalidateOnRefresh` | recomputes on resize and after fonts load, otherwise the track under or overshoots. |
| `scrub: 1` | ties motion to the scrollbar with a gentle catch-up. `true` is snappier, above 1.5 feels laggy. |
| `ScrollTrigger.refresh()` on load | web fonts change `scrollWidth`; without this the distance is measured against fallback metrics. |

`gsap.matchMedia()` is doing the responsive work: the pin only exists at 1000px and up, and
its return function fully undoes it below that, including removing `is-pinned` and clearing
the inline transform.

### Port into this repo

**This needs a dependency.** `package.json` currently has `framer-motion` but no GSAP:

```bash
npm install gsap @gsap/react
```

In React, wrap it in `useGSAP` so cleanup is automatic:

```tsx
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ProjectPan({ children }: { children: React.ReactNode }) {
  const pan = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1000px)', () => {
      // same body as above, using the refs
    });
    return () => mm.revert();
  }, { scope: pan });

  return (/* section > head > viewport > track > panels, markup as in the CSS above */);
}
```

Alternative if the extra dependency is unwanted: `framer-motion` is already installed and
can do this with `useScroll` plus `useTransform` on the track's `x`, with the section
`position: sticky` instead of GSAP's pin. Slightly less precise at the edges, no new
package. GSAP's pin is the better behaviour if the dependency is acceptable.

### Caveats

- **Do not pin more than one section per page.** Two pinned sections make the whole page
  feel like it is fighting the scroll.
- **Keep the section's height to what fits.** Pinning at `100dvh` means the head, the
  tallest panel and the progress line must all fit in a short laptop window, roughly 700px.
  That is why `is-pinned` tightens the padding, and it needs a check at 1280x720.
- **Everything must stay reachable without the pan.** The viewport keeps `tabindex="0"` and
  an `aria-label` so keyboard users can scroll the row directly, and the panels stay in DOM
  order for screen readers.
- **Reduced motion turns the pin off entirely**, not just the easing. The row is then a
  plain swipeable list.
- **The progress line has two drivers**: `onUpdate` while pinned, and a passive `scroll`
  listener on the viewport when it is not. Keep both, or the fallback row loses its
  feedback.

---

## 5. Skills as definition rows — DECIDED FORMAT for the final build

**From:** *Parth Patel Ships* concept, `#how` section, "How I work"
(https://claude.ai/artifact/33ZF5sSLpNn9XtQk9CJQJ6)

**Decision:** the skills section becomes a definition list. One row per area: a small mono
term on the left, and on the right a sentence whose opening clause, set in the accent
colour, names the tools actually reached for, with the rest of the sentence carrying the
breadth.

**This replaces the badge grid.** `src/pages/skills.tsx` currently renders every skill as a
`<Badge variant="secondary">` with a hover scale, roughly sixty chips across six groups.
That is the pattern being retired.

**Why it works**

- **Sentences say what chips cannot.** A wall of equal-weight chips claims that
  `Adobe Photoshop` and `React 19` are the same kind of fact. The sentence form separates
  "what I build with daily" from "what I have touched", which is the thing a hiring
  manager is actually trying to work out.
- **The accent lead is real information, not styling.** Only the first clause is coloured,
  and it holds the primary tools. That encodes a hierarchy the chip grid flattens.
- **`<dl>` is the correct element.** Term and description is literally what this is, so the
  semantics come for free rather than being simulated with divs.
- **Seven rows, one hairline each.** Compare with sixty chips: the reader's eye lands on
  seven things, and the detail is inside a sentence they can skim or read.
- **The mono term column at a fixed 210px** keeps every description starting on the same
  vertical line, baseline aligned. Ragged left edges are what make list sections look
  unplanned.
- **No proficiency bars, no percentages, no star ratings.** "React 85%" is a number nobody
  can defend in an interview. The concept deliberately has no such device, and neither
  should the build.

### CSS from the artifact

```css
.defs { display: grid; gap: 0; margin-top: 8px; }

.def {
  display: grid;
  gap: 8px;
  padding-block: 26px;
  border-bottom: 1px solid var(--line-2);
}
@media (min-width: 820px) {
  .def { grid-template-columns: 210px minmax(0, 1fr); gap: 48px; align-items: baseline; }
}

.def dt { font-family: var(--mono); font-size: 12.5px; color: var(--ink-3); letter-spacing: 0.04em; }
.def dd { margin: 0; font-size: 17px; line-height: 1.7; max-width: 62ch; }
.def dd b { font-weight: 600; color: var(--accent); }
```

`align-items: baseline` is the detail that sells it: the mono term sits on the same
baseline as the first line of its description, not centred against the whole block.

### Markup pattern

```html
<dl class="defs">
  <div class="def">
    <dt>Languages</dt>
    <dd><b>TypeScript, JavaScript, Python.</b> Java, C++ and C# from coursework and .NET work.</dd>
  </div>
  <div class="def">
    <dt>Interface</dt>
    <dd><b>React 19, Tailwind CSS, shadcn/ui.</b> Redux Toolkit, Vite, React Hook Form, Zod
    and TanStack Table, with Vue and AngularJS earlier on.</dd>
  </div>
  <!-- ... -->
</dl>
```

The wrapping `<div>` around each `dt`/`dd` pair is deliberate: it is valid in HTML5 and it
is what lets each row be its own grid.

### The data change this needs

`siteData.json` stores skills as six flat arrays keyed by kind:

```json
"skills": {
  "languages": [...], "frameworks": [...], "databases": [...],
  "cloud": [...], "tools": [...], "other": [...]
}
```

Flat arrays cannot express the primary / secondary split, and the concept's seven groups do
not match the six JSON keys. Restructure to carry both:

```json
"skills": [
  { "label": "Languages", "primary": ["TypeScript", "JavaScript", "Python"],
    "rest": "Java, C++ and C# from coursework and .NET work." },
  { "label": "Interface", "primary": ["React 19", "Tailwind CSS", "shadcn/ui"],
    "rest": "Redux Toolkit, Vite, React Hook Form, Zod and TanStack Table, with Vue and AngularJS earlier on." }
]
```

Groups used in the concept, which read better than the current keys: Languages, Interface,
Services and data, Applied AI, Shipping, Verification, Daily tools. Note that Verification
(pytest, Playwright, coverage.py, MutPy) has no equivalent in the current JSON at all, and
it is one of the strongest groups, so it is worth adding.

### Port into this repo

```tsx
import siteData from "@/data/siteData.json";

export default function Skills() {
  return (
    <dl className="grid">
      {siteData.skills.map((group) => (
        <div
          key={group.label}
          className="grid gap-2 border-b border-border py-7
                     md:grid-cols-[210px_minmax(0,1fr)] md:items-baseline md:gap-12"
        >
          <dt className="font-mono text-[12.5px] tracking-wide text-muted-foreground">
            {group.label}
          </dt>
          <dd className="m-0 max-w-[62ch] text-[17px] leading-[1.7]">
            <b className="font-semibold text-primary">{group.primary.join(", ")}.</b>{" "}
            {group.rest}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

### Caveats

- **The `rest` sentence has to be written, not generated.** Joining an array with commas
  produces "MongoDB, PostgreSQL, AWS S3, IIS, GitHub Pages, CI/CD" which is a chip grid
  with the chips taken off. It needs to read as prose.
- **Three primary items per row, four at most.** The accent clause stops working as a
  signal once it runs to a full line.
- **Do not colour anything else in the row.** One accent, at the head of the sentence.
- **Keep the row count near seven.** Twelve rows of this and it becomes the wall it was
  meant to replace.

---

## 6. Vertical identity rail as the navigation — DECIDED FORMAT for the final build

**From:** *Parth Patel Ships* concept, the `.rail` aside
(https://claude.ai/artifact/33ZF5sSLpNn9XtQk9CJQJ6)

**Decision:** navigation lives in a sticky left rail that holds the photo, name, role, a
numbered section index, the contact lines and the theme toggle. No sticky top bar at all.
Below 1160px the rail flattens into a compact header.

**This replaces the shadcn sidebar.** The current build wraps everything in
`SidebarProvider` (`src/components/layout.tsx`) with `app-sidebar.tsx` rendering eleven
icon-and-label items, plus a separate sticky header that repeats the active section name.
The rail does that job with one `<aside>`, no provider, no collapse state, no icons.

**Why it works**

- **The identity never leaves the screen.** Name, role, email and GitHub sit in view for
  the entire visit. On a portfolio that is the single most useful thing to keep fixed, and
  it removes the need for a header repeating the same name.
- **The active indicator is a 2px left border that only changes colour.** No pill, no
  filled background, no sliding element. Cheap to paint and quiet enough to live beside
  body text.
- **The numbers are an index, not decoration.** The page is a sequence read top to bottom,
  so 01 to 06 is true information. On a page whose sections had no order, they would be
  noise and should be dropped.
- **`height: 100dvh` plus `margin-top: auto` on the foot** pins contact details to the
  bottom of the viewport, so the rail reads as one composed column rather than a stack that
  ran out.
- **It buys the content column real width.** With navigation off the top, the reading
  column starts at the very top of the page and the hero gets the full height.
- **Labels are full phrases** ("Where I have worked", "What I have built") because a
  vertical rail has the horizontal room a top bar never has.

### CSS from the artifact

```css
:root { --rail: 300px; }

.page { max-width: 1440px; margin: 0 auto; padding-inline: 22px; }
@media (min-width: 1160px) {
  .page {
    display: grid;
    grid-template-columns: var(--rail) minmax(0, 1fr);
    gap: 72px;
    padding-inline: 40px;
  }
}

.rail { padding-block: 28px 0; }
@media (min-width: 1160px) {
  .rail {
    position: sticky; top: 0; height: 100dvh;
    padding-block: 48px 40px;
    display: flex; flex-direction: column;
  }
}

.rail-top { display: flex; align-items: center; gap: 14px; }

.rail-nav { display: none; margin-top: 44px; }
@media (min-width: 1160px) { .rail-nav { display: block; } }
.rail-nav ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.rail-nav a {
  display: flex; align-items: baseline; gap: 12px;
  min-height: 44px;                      /* touch target */
  padding-left: 14px;
  border-left: 2px solid var(--line-2);  /* the indicator track */
  color: var(--ink-3); font-size: 15px; text-decoration: none;
  transition: color 240ms cubic-bezier(0.16,1,0.3,1),
              border-color 240ms cubic-bezier(0.16,1,0.3,1);
}
.rail-nav a:hover { color: var(--ink); }
.rail-nav a[aria-current="true"] {
  color: var(--ink);
  border-left-color: var(--accent);
  font-weight: 550;
}
.rail-nav .n { font-family: var(--mono); font-size: 11.5px; color: var(--ink-3); }

.rail-foot { margin-top: auto; padding-top: 32px; display: grid; gap: 10px; }

/* under 1160px the rail becomes a header and the index is dropped */
@media (max-width: 1159px) {
  .rail { border-bottom: 1px solid var(--line-2); padding-bottom: 22px; }
  .rail-foot { margin-top: 20px; grid-auto-flow: column; justify-content: start;
               gap: 22px; align-items: center; flex-wrap: wrap; }
}
```

### The active-section script

```js
const links = [...document.querySelectorAll('.rail-nav a')];
const targets = links.map(a => document.querySelector(a.getAttribute('href')));

const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a, i) => {
      a.setAttribute('aria-current', targets[i] === e.target ? 'true' : 'false');
    });
  });
}, { rootMargin: '-35% 0px -60% 0px' });

targets.forEach(t => t && spy.observe(t));
```

`rootMargin: '-35% 0px -60% 0px'` leaves a narrow band in the upper middle of the viewport;
a section counts as active only while it crosses that band. This is the part the current
site does with a `window.scroll` listener comparing `offsetTop` in `layout.tsx`. The
observer version does no work on scroll frames and is the one to carry forward.

`aria-current` is the state, not a CSS class, so assistive tech reads it too.

### Port into this repo

Replaces `SidebarProvider` / `AppSidebar` / the sticky header in `layout.tsx`:

```tsx
const SECTIONS = [
  { id: "opening",    label: "Opening" },
  { id: "work",       label: "Where I have worked" },
  { id: "built",      label: "What I have built" },
  { id: "how",        label: "How I work" },
  { id: "background", label: "Study and credentials" },
  { id: "contact",    label: "Contact" },
];

<div className="mx-auto grid max-w-[1440px] px-[22px] xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-[72px] xl:px-10">
  <aside className="pt-7 xl:sticky xl:top-0 xl:flex xl:h-[100dvh] xl:flex-col xl:py-12">
    {/* rail-top: avatar + name + role */}
    <nav className="mt-11 hidden xl:block" aria-label="Sections">
      <ol className="grid gap-0.5">
        {SECTIONS.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id}
              className="flex min-h-11 items-baseline gap-3 border-l-2 border-border pl-3.5
                         text-[15px] text-muted-foreground transition-colors
                         hover:text-foreground
                         aria-[current=true]:border-l-primary aria-[current=true]:text-foreground"
            >
              <span className="font-mono text-[11.5px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
    {/* rail-foot: email, github, linkedin, ModeToggle, mt-auto */}
  </aside>
  <main className="min-w-0">{children}</main>
</div>
```

The avatar slot in the rail is where `public/images/profile/avatar.png` goes. It is 52px
square in the concept, which is deliberately small: the rail is a nameplate, not a hero.

### Caveats

- **The breakpoint is 1160px, not `lg`.** Below that the rail plus a readable content
  column no longer fit side by side. Tailwind's `xl` (1280px) is the closest default;
  either accept 1280 or add a custom screen at 1160.
- **The index is hidden on mobile**, which is fine for six sections on a page people scroll
  anyway. If the section count climbs back toward eleven, a horizontal scroll-snap row of
  the same labels under the header is the fallback, not a hamburger.
- **`height: 100dvh` will clip** if the rail's content ever outgrows the viewport, for
  example on a short laptop with more nav items. Add `overflow-y: auto` to the rail at that
  point, or drop the fixed height and let it size to content.
- **No icons.** Numbers and text carry it. Icons next to every item is the pattern being
  replaced, and it makes the rail look like an app chrome sidebar rather than a nameplate.
- **One highlight only.** The active item gets colour plus border plus a half-step of
  weight. Adding a background fill on top would make it the loudest thing on the page.

---

## 7. Colour palette — DECIDED PALETTE for the final build

**From:** *Parth Patel Ships* concept
(https://claude.ai/artifact/33ZF5sSLpNn9XtQk9CJQJ6)

**Decision:** cool neutrals biased green, with a single deep green accent. Replaces the
LinkedIn blue palette currently in `src/index.css` (`#0077B5` / `#00A0DC` with the
`#313335` / `#86888A` / `#CACCCE` greys).

### Tokens

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--bg` | `#F3F5F3` | `#0C100E` | page ground |
| `--raised` | `#FFFFFF` | `#141A17` | cards, inputs |
| `--ink` | `#121816` | `#E7ECE9` | body and headings |
| `--ink-2` | `#4C5853` | `#9BA6A1` | secondary prose |
| `--ink-3` | `#79847F` | `#6E7A75` | dates, meta, stack lines (see the fix below) |
| `--line` | `#DCE1DD` | `#222A26` | borders on controls |
| `--line-2` | `#E7EBE7` | `#1A211D` | hairlines between sections |
| `--accent` | `#0F6B4F` | `#58C79B` | the one accent |
| `--accent-ink` | `#FFFFFF` | `#07100C` | text on the accent |
| `--wash` | `rgba(15,107,79,0.08)` | `rgba(88,199,155,0.12)` | tinted fills |

**Why it works**

- **The neutrals are not grey.** Every neutral carries a small green bias toward the
  accent, so the page reads as one temperature instead of a coloured button dropped onto
  default slate. This is the difference between a palette and a default.
- **The accent flips brightness between modes rather than staying put.** `#0F6B4F` is dark
  enough to be readable *as text* on a light ground; `#58C79B` is light enough on the dark
  one. A single mid green would fail on one of the two.
- **`--accent-ink` is a paired token, not white.** In dark mode the text on an accent
  button is near black. Hardcoding white there is the usual way this palette breaks.
- **Green reads as pass, build, shipped** for an engineering portfolio, without going near
  the terminal-green cliché, because the saturation stays low and it never sits on black.
- **Two line weights.** `--line` for control borders, `--line-2` for structural hairlines.
  One border token for both makes the section rules too loud or the inputs too faint.

### Measured contrast, both modes

Computed, not estimated. Values are WCAG 2.1 contrast ratios.

| Pair | Light | Dark |
| --- | --- | --- |
| `--ink` on `--bg` | 16.41 AAA | 16.03 AAA |
| `--ink` on `--raised` | 17.98 AAA | 14.77 AAA |
| `--ink-2` on `--bg` | 6.78 AA | 7.63 AAA |
| `--accent` on `--bg` | 5.92 AA | 9.18 AAA |
| `--accent-ink` on `--accent` | 6.49 AA | 9.24 AAA |
| **`--ink-3` on `--bg`** | **3.54 FAIL** | **4.29 FAIL** |

**`--ink-3` does not pass at body sizes in either mode** and it is used for real text:
dates, the inactive rail links, the stack lines, form hints. Fix before shipping:

```diff
- --ink-3: #79847F;   /* light: 3.54 on --bg */
+ --ink-3: #656F6A;   /* light: 4.75 on --bg, 5.20 on --raised */

- --ink-3: #6E7A75;   /* dark: 4.29 on --bg, 3.95 on --raised */
+ --ink-3: #838E89;   /* dark: 5.65 on --bg, 5.21 on --raised */
```

Both corrected values keep the same green-grey character and clear 4.5:1 against the
raised surface as well as the page ground, which matters because stack lines sit inside
cards. The concept files still carry the original values; these are the ones to build with.

`--line` at 1.21 against the ground is fine and is not a failure: hairlines are decorative
separators, not meaningful boundaries, and non-text contrast rules do not apply to them.
Any border that *does* carry state, such as a focus ring or an input in an error state,
uses `--accent` or a semantic colour instead.

### Mapping onto this repo's tokens

`src/index.css` uses the shadcn token names. The mapping is mostly direct, with one trap:

| This palette | shadcn token in `index.css` |
| --- | --- |
| `--bg` | `--background` |
| `--raised` | `--card`, `--popover` |
| `--ink` | `--foreground`, `--card-foreground`, `--popover-foreground` |
| `--ink-2` | `--muted-foreground` |
| `--line` | `--border`, `--input` |
| `--accent` | `--primary` **and** `--ring` |
| `--accent-ink` | `--primary-foreground` |
| `--wash` | `--accent` (see trap) |

**The trap:** in shadcn, `--accent` does not mean brand accent. It is the hover and
selected surface colour. Putting the green there turns every hover state into a solid
green block. Brand accent goes to `--primary`; `--wash` is what belongs in `--accent`.

`--ink-3` has no shadcn equivalent. Add it as a custom token rather than reusing
`--muted-foreground`, since the two are doing different jobs.

The existing file also defines `--chart-1` through `--chart-5` and the whole `--sidebar-*`
block. The chart tokens should be restated in greens, and the sidebar tokens can be deleted
outright if the rail from entry 6 replaces the shadcn sidebar.

### Caveats

- **One accent, whole page.** No second colour for a status badge, no blue link colour
  surviving from the old palette. Check `home.tsx`, `projects.tsx` and `skills.tsx` for
  hardcoded `#0077B5` / `#00A0DC` values, which are currently written inline in class
  names rather than read from tokens.
- **The green dot in entry 1 is a semantic colour, not this accent.** Availability green
  and brand green both being green is acceptable only because the dot is small and paired
  with text. If they ever clash visually, the dot moves to a distinct hue.
- **Do not add a gradient.** The old palette leaned on `from-[#0077B5] to-[#00A0DC]` for
  headings and blobs. Flat accent only.

---

## 8. Heading typeface: Bricolage Grotesque — LOCKED for all headings and titles

**From:** *Parth Patel Portfolio* concept, hero and every section head
(https://claude.ai/artifact/Y1m4DCRjemKSYVUn3gSAKa)

**Decision:** every heading and title on the site is Bricolage Grotesque. Replaces
Playfair Display, which `src/index.css` currently applies to `h1` through `h6`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&display=swap">
```

```css
--display: 'Bricolage Grotesque', 'Instrument Sans', system-ui, sans-serif;
h1, h2, h3, h4 { font-family: var(--display); font-weight: 600; letter-spacing: -0.03em; }
```

**Why it works**

- **It has an optical size axis, `opsz` 12 to 96.** The letterforms are drawn differently
  at 14px than at 76px: tighter spacing and thinner joins as it grows, more open at small
  sizes. Most Google fonts have only a weight axis, so they look slightly wrong at one end
  of the scale. This is the single strongest reason to pick it for headings.
- **It is a grotesque with character.** Slightly irregular widths and a squared-off feel,
  so a heading has personality without reaching for a serif or a display novelty face.
- **It holds up tight.** At `-0.045em` on a 76px line it stays readable, which is what lets
  the hero set large and dense rather than large and airy.
- **It pairs by contrast, not by similarity.** Against a neutral body face it is clearly
  the voice; two characterful faces together would fight.

### The tracking ladder

Tracking tightens as size grows. This is the part that has to carry over, not just the
family name.

| Role | Size | Weight | Tracking | Line height |
| --- | --- | --- | --- | --- |
| Hero | `clamp(38px, 6.4vw, 76px)` | 700 | `-0.045em` | 1.02 |
| Closing statement | `clamp(36px, 7.4vw, 88px)` | 700 | `-0.05em` | 0.98 |
| Section head | `clamp(26px, 3.6vw, 40px)` | 600 | `-0.04em` | 1.08 |
| Sub head | `clamp(22px, 3vw, 30px)` | 600 | `-0.035em` | 1.15 |
| Card title | 19 to 20px | 600 | `-0.025em` | 1.25 |
| Figures and GPA | 20 to 48px | 700 | `-0.03em` | 1 |

Body text keeps tracking at 0. Never apply negative tracking below roughly 18px; it closes
the counters and the text stops being readable at a glance.

`font-optical-sizing: auto` is the browser default and is what activates `opsz`. Do not
set `font-optical-sizing: none`, and do not pin `font-variation-settings: 'opsz' 14` on a
heading, since either one throws away the reason for choosing this face.

### Numerals

The concept uses the display face for large figures (GPA, project metrics) with
`font-variant-numeric: tabular-nums` so columns of numbers line up. Keep that pairing:
figures are titles too.

### Open question: the body face

The heading choice is locked. The body face is not yet decided, because the palette in
entry 7 came from a different concept:

- **Geist** is what the palette concept uses, it covers body and mono in one superfamily,
  and it is deliberately neutral, which is the right partner for a characterful heading.
  This is the recommendation.
- **Instrument Sans** is what this concept pairs Bricolage with, and it is already the
  fallback in the `--display` stack above.

Either works. Pick one and put it in `--body`; do not let both end up in the stylesheet.

### Port into this repo

`src/index.css` currently has, in `@layer base`:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
}
```

Replace with the display variable and drop the blanket 700, since the ladder above sets
weight per role:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--display);
  font-weight: 600;
  letter-spacing: -0.03em;
  text-wrap: balance;
}
```

`index.html` line 24 currently loads Inter and Playfair Display together:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
```

That single link is replaced by the Bricolage link above plus whichever body face wins the
open question. Both `preconnect` hints are already in place on lines 20 and 21, so they
stay. Dropping the two unused families is also a real payload win: the current link pulls
seven Inter weights and six Playfair weights, most of which nothing uses.

### Caveats

- **Request only the weights in the ladder.** 400, 600 and 700 for the display face. Asking
  for the full 100..900 variable range costs bytes the design never spends.
- **Check the swap in the network panel, not by eye.** Georgia is close enough to Playfair
  at a glance that a failed load can pass an eyeball test.
- **`text-wrap: balance` on headings only.** On body paragraphs it is wasted work.
- **Do not use it for body text.** The character that makes it a good heading face makes a
  long paragraph tiring.
- **Do not add a third family.** Heading, body, and at most one mono for figures and code.

---

<!-- Next entry goes here. Keep the same shape: source, why it works, code, port, caveats. -->
