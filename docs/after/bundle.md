# Bundle size - Phase 13

`npm run build`, 2026-09-18, after Phase 11's cleanup (framer-motion +
4 unused Radix packages removed) and Phase 13's avatar optimization.

| | Raw | Gzipped |
| --- | --- | --- |
| Baseline (2026-09-18, recorded in plan.md D11) | 517.92 KB | 163.44 KB |
| After this redesign | **312.57 KB** | **98.21 KB** |
| Change | −205.35 KB | −65.23 KB |
| | **−39.6%** | **−39.9%** |

Confirmed the drop is real and not a fluke of what got measured: the
JS bundle size dropped by close to 40% in both raw and gzipped terms,
consistent with removing `framer-motion` (used in 15 files, all for
fades/slides now done in plain CSS + `useReveal`) and the four
now-unused `@radix-ui/*` packages (`react-collapsible`,
`react-dialog`, `react-progress`, plus the shadcn primitives that
pulled them in) in Phase 11. Nothing left in `src/` still imports any
of them (verified by grep in Phase 11, re-confirmed clean here since
the number moved in the expected direction rather than staying flat -
per Phase 13's own instruction, a flat number would have meant
something was still importing what was meant to be gone).

`npm run build` printed no "Published dist to branch gh-pages" line -
Phase 0.1's fix confirmed still holding on this, the final build of
the redesign.

## Assets (Phase 13 step 1, D5)

`avatar.png` was a 687 KB, 1024×1024 PNG used as the profile photo -
its only on-page usage is the rail's 52px slot (Q8: rail only, no
larger photo elsewhere). Generated `avatar-104.webp`, a 104×104 (2x
retina for the 52px CSS box) WebP resized from the original: **3.7
KB**, a ~185x reduction for the image actually rendered on the page.
`width`/`height` attributes on the `<img>` describe the 52px rendered
box (not the file's own pixel count), so the browser reserves the
correct space before it loads - no layout shift.

The original `avatar.png` was **not** deleted or resized: it's also
the `og:image` / `twitter:image` target in `index.html` (social-share
link previews), a different use case this defect isn't about and
wasn't asked to touch - shrinking or removing it would have broken
link previews on LinkedIn/Twitter/etc. for a save that only benefits a
page section already rendering at 52px.

## Font weights (Phase 13 step 2)

Already correct since Phase 1, reconfirmed here: the font link
requests exactly 8 weight/family combinations - Bricolage Grotesque
400/600/700 (3, display), Geist 400/500/600 (3, body), Geist Mono
400/500 (2, mono) - matching the tracking ladder exactly, nothing
extra.

## GitHubStats (Phase 13 step 4)

Confirmed by source review (browser-verified in both branches back in
Phase 5): `GitHubStatsSkeleton` reserves the same Card
padding/icon-size/value-size/label-size as the loaded state, so the
live fetch resolving can't shift layout. The error path (an
unauthenticated GitHub API call, real rate limits apply) renders a
sensible inline message with a working link to the GitHub profile -
not an empty box. Hit organically again during this phase's own
Lighthouse run (see lighthouse.md's Best Practices note) from the
volume of automated testing today against GitHub's real API.
