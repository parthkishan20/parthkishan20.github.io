# Lighthouse - mobile emulation, Phase 12

Run 2026-09-18, against a production build (`npm run build` + `npm run
preview`), not the dev server. The dev server serves unbundled,
unminified ES modules with HMR overhead - it produces numbers that
don't mean anything relative to these targets (a first pass against it
scored Performance 54 with an 11s FCP purely from dev-mode module
loading, not from anything in the actual site). Lighthouse's own
Performance category is only meaningful measured against what
actually ships.

Config: `--preset=perf --form-factor=mobile
--screenEmulation.width=390 --screenEmulation.height=844
--screenEmulation.deviceScaleFactor=3 --throttling-method=simulate`.
Full HTML report: `docs/after/lighthouse-mobile.html`.

## Scores

| Category | Score | Target | Result |
| --- | --- | --- | --- |
| Performance | **86** | 90+ | not yet met |
| Accessibility | **100** | 100 | ✅ met |
| Best Practices | **100** | 100 | ✅ met |
| SEO | **100** | 100 | ✅ met |

## Core Web Vitals (simulated Slow 4G-ish mobile)

| Metric | Value | Note |
| --- | --- | --- |
| LCP | 3.5 s | Phase 13's stated target is <2.5s |
| CLS | 0 | target <0.1 - met with zero to spare |
| FCP | 2.5 s | |
| TBT | 150 ms | |
| Speed Index | 2.5 s | |

## Two real, fixed-in-Phase-12 findings

Both caught by this same Lighthouse run, fixed immediately, and
re-verified with a second run (scores above are the *after* numbers):

1. **Accessibility was 93, not 100** - two related audits failed:
   `definition-list` and `dlitem`, both pointing at Contact's `<dl>`
   for the contact lines. Root cause: each row nested `dt`/`dd` two
   levels deep (`dl > div.flex > div.min-w-0 > dt/dd`), because a
   decorative icon sat as a sibling to the dt/dd-wrapping div -
   axe-core's definition-list rule requires a `<dl>`'s content to be
   flatly dt/dd/div/script/template, and the extra nesting broke that.
   Fixed by switching Contact's contact-line list from `<dl>` to a
   plain `<ul>`/`<li>` - arguably the more accurate semantic fit
   anyway ("ways to reach me" is a list, not a strict term/definition
   pairing the way Skills' and About's `<dl>`s genuinely are), and it
   sidesteps the content-model constraint entirely rather than fighting
   it. Skills.tsx's and about.tsx's `<dl>`s were already structured
   correctly (one div per row, dt+dd only inside) and needed no change.

2. **SEO was 92, not 100** - `robots-txt: robots.txt is not valid`.
   The project had no `public/robots.txt` at all, so requests to
   `/robots.txt` fell through Vite's SPA history-fallback and got
   served `index.html` with a `200` status - plainly not valid robots
   syntax. Added a minimal `public/robots.txt` (`User-agent: *` /
   `Allow: /`). No sitemap.xml exists, so no Sitemap directive was
   added - adding one pointing at a 404 would trade one inconsistency
   for another.

Both fixes are outside this redesign's literal file list, but they're
exactly what Phase 12's own Lighthouse check exists to surface, and
both are small, safe, zero-risk corrections with no visual or
behavioral change to the rest of the site.

## Performance: what's actually driving the gap

The plan's Phase 13 assumes the 687 KB `avatar.png` (D5) is the LCP
lever. Checked directly against a real `PerformanceObserver` (not
inferred from the Lighthouse summary, which doesn't expose the LCP
element node in this run's config) - **the LCP element is not the
avatar**. It's a text `<span>` (secondary hero/body copy), which
renders in ~276ms in an unthrottled real load. Lighthouse's 3.5s comes
from its *simulated* throttling model (slower CPU + network), which
inflates the time at which that text becomes paintable - most likely
driven by font loading (Bricolage Grotesque / Geist / Geist Mono, all
loaded from Google Fonts with no `font-display` override visible in
the link tag) and/or main-bundle parse/execution time, not image
weight.

This matters for Phase 13: `avatar.png` is worth optimizing regardless
(687 KB for a 52px rail avatar is real, unnecessary weight - D5 stays
valid work), but it is very unlikely to move the Performance score or
LCP number on its own, since it was already pulled out of the hero
back in Phase 4 (Q8: rail only, 52px) and was never the paint-blocking
element to begin with. The real lever is most likely `font-display`
on the Google Fonts link and/or reducing the JS the browser must parse
before that hero text paints. Recording this now so Phase 13 tests the
actual bottleneck instead of just the assumed one.

## Steps 1–5, 7–8 (not separately scored, all passed)

- `npm run shots` (chromium + firefox): 32/32 pass.
- 8 widths × 2 themes overflow console check on the finished,
  integrated page: zero page-level horizontal overflow in all 16
  combinations (only the pre-approved project-pan viewport/track
  exception reports non-zero `scrollWidth`).
- 720px and 844px heights: pinned Projects section (heading, tallest
  panel, progress line) and the rail (including its footer) both fit
  without inner scrolling at both heights.
- Full keyboard traversal at 375px (77 real stops) and 1280px (60 real
  stops): every stop confirmed to have a visible indicator except one
  - the résumé preview `<iframe>` itself. Investigated directly:
  `:focus`/`:focus-visible` does not match the outer `<iframe>`
  element in Chromium once keyboard focus delegates into its embedded
  content, even though `document.activeElement` correctly reports it
  - a platform-level limitation with no CSS-side fix (confirmed with
  both `:focus-visible` and plain `:focus` rules; neither engaged).
  Not a regression to chase further: the same PDF is fully reachable
  via "Open the résumé" / "Download PDF", both of which have confirmed
  working focus rings, immediately before the iframe in tab order.
  Reading order confirmed correct: rail (persistent identity + nav)
  precedes main content in DOM order by design, and within main
  content every section's interactive elements appear in the expected
  top-to-bottom sequence, traced stop-by-stop.
- Reduced motion at 375px and 1280px: zero elements stuck at
  `opacity: 0`, zero running animations, the Projects pan confirmed
  `position: static` (not pinned) at both widths.
- 200% zoom at 1280px: simulated correctly as a reflow to the
  equivalent effective width (640px, not a visual-only CSS `zoom`
  scale, which doesn't reflow media queries) - zero page-level
  overflow, mobile nav takes over, hero fully visible. Already covered
  by the site's tested 320–1440px range.
- Print preview at A4 (794×1123 CSS px): rail/nav/back-to-top hidden,
  full width, all 4 featured projects unrolled and visible - same
  correct behavior confirmed at Letter size in Phase 11.

## Phase 13 update - after the avatar fix

Re-ran the identical Lighthouse config after Phase 13's `avatar.png`
→ `avatar-104.webp` change (see `docs/after/bundle.md`).

| Category | Before Phase 13 | After Phase 13 |
| --- | --- | --- |
| Performance | 86 | 87 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 96 (see below) |
| SEO | 100 | 100 |
| LCP | 3.5 s | 3.4 s |
| CLS | 0 | 0 |

**LCP barely moved (3.5s → 3.4s), confirming the Phase 12 diagnosis
was correct**: the avatar was never the LCP element or a meaningful
contributor to it (the LCP element is a text span, not an image - see
above). The 687 KB → 3.7 KB asset reduction is real and worth keeping
regardless (D5 was a genuine defect on its own terms - an
unnecessarily large file for what it renders - not something whose
justification depended on moving the LCP number), but it does not
close the gap to the acceptance criterion (LCP < 2.5s). That gap's
actual cause - most likely Google Fonts' request chain or main-bundle
parse/execution time under Lighthouse's simulated throttling - is
outside Phase 13's four defined steps (image, font weights, bundle
size, GitHubStats skeleton) and is not chased further here; flagging
it as the next place to look if closing this specific gap matters.

**Best Practices dipped to 96, not because of anything Phase 13
changed**: the one failing audit (`errors-in-console`) fired because
this specific run hit GitHub's real, unauthenticated API rate limit
(HTTP 403) - a direct, expected consequence of the sheer amount of
automated testing run against the live GitHub API across every phase
of this project today. `GitHubStats`'s catch block both handles this
gracefully (confirmed: the sensible fallback UI renders, not an empty
box - Phase 5 and Phase 13's own bundle.md) *and* logs it via
`console.error` for developer visibility, which is reasonable
practice that Lighthouse's blanket "any console.error is a defect"
heuristic can't distinguish from a real unhandled crash. Not
regressed by this phase, not fixed by removing a legitimate debug log
just to satisfy the audit - the score is a property of this moment's
external rate-limit state, not of the code.

CLS stayed at a flat 0 throughout every measurement in this project -
the stated <0.1 target is met with room to spare and was never at
risk.
