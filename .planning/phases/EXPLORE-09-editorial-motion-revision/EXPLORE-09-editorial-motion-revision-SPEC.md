# Phase 9: editorial-motion-revision - Spec

**Gathered:** 2026-09-24T14:38:41.195Z
**Mode:** interviewed

## Requirements

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req REV-14

- **Current:** Grid renders [EXPERIENCE full-width] / [About+Contact | Skills] / [Projects].
- **Target:** Reflow: [About+Contact | Skills] row 1, Experience full-width row 2, Projects row 3 — flows re-mapped.
- **Acceptance:** grep-verifiable grid order (About+Contact and Skills in row 1, Experience col-span-2 row 2, Projects row 3) + drawer/wizard/counter re-mapping tests green.

### Req REV-15

- **Current:** The merged panel is a summary paragraph wall + meta + contacts.
- **Target:** The About presentation package (positioning lead, impact metrics, availability badge, avatar, tightened contacts) with the new about.availability data field.
- **Acceptance:** The About panel renders the positioning lead, the 4-stat metric row, the availability badge from the new data field, the avatar (graceful-hide), and 9 tightened contact rows; the full summary renders demoted below the lead.

### Req REV-16

- **Current:** The arc carries only the 3 tech roles.
- **Target:** Education merges onto the semicircular arc — 5 chronological entries, type-aware content templates.
- **Acceptance:** The arc carries 5 markers with year labels derived from entry data; the content column renders the type-aware template for the active entry (role vs education); the stage files keep zero framer-motion imports; keyboard/reduced-motion/mobile contracts hold for 5 entries.

### Req REV-17

- **Current:** Projects shows stat tiles + a static card grid.
- **Target:** The Projects panel gains the framer-motion-driven editorial scroll composition for its top-6 projects.
- **Acceptance:** Projects renders stat tiles + the editorial scroll stage (top-6 rows, dividers, coexistence transitions); framer-motion imported only there; reduced-motion degrades to opacity swaps; 375px-safe (sticky stage md+ only).

## Boundaries

**In scope:** Panel order (About first), the About presentation package (positioning lead, impact metrics, availability badge, avatar), education merged onto the semicircular arc (5 entries, type-aware), and the Projects panel converted to a framer-motion-driven editorial scroll composition (top-6 rows entering from below) — experience stage stays hand-rolled.
**Out of scope:** (not specified)

## Constraints

- Dual-engine discipline: framer-motion imports appear ONLY in the projects editorial composition (and any About motion); a grep-verified ban keeps framer-motion out of the Experience stage files (explore-visuals.test.mjs:595 precedent extended)
- The availability data field is ONE line transcribed from the user's own CLI banner text (their authorship, not invented); typed in .d.ts same-commit (R-7); consumer table (map-content-surfaces) enumerates its single new consumer (the About panel)
- The metric row derives its numbers from the refreshed competency-proof/bullet strings at render time (or from pinned data fields if the planner extracts them) — zero invented numbers (EXPLORE-07)
- The Experience stage (arc math, hook, content transitions) is byte-untouched except the entry list extension (3→5 entries, type-aware templates) — the phase-8 tests renew, not rewrite
- The editorial projects scroll is 375px-safe: rows are flow text, the sticky stage is md+ only (mobile = the existing compact list), no horizontal scroll, 44px targets on any link rows
- The avatar renders with graceful-hide (missing URL/broken image → no avatar block); the impact-metric row likewise hides when its source strings are absent
- Static export: framer-motion's useScroll works on hydration; SSR renders the first composition state as real text

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
- The grid renders [About+Contact | Skills] as row 1, Experience full-width row 2, Projects row 3 — drawer anchors, wizard step targets, and the visited counter re-mapped to the new order (grep-verifiable)
- The About panel leads with a two-line positioning statement (above the full summary, which renders smaller/demoted); an impact-metric row shows 4 data-derived stats (12+ teams, 30+ engineers, 7+ years, npm launch week) — every number traceable to competency-proof data; the availability badge renders 'Open to selective part-time work' from a NEW data field transcribed from the user's CLI banner line; the avatar renders from about.profileImageUrl in a rounded crop; all 9 contact rows present and tightened
- The Experience arc carries 5 chronological entries — BEng (2012), Netcompany (2019), MSc (2021), Upstream (2022), Chubb (2023) — with type-aware content templates (roles: title > company > dates > location > bullets; education: degree > institution > dates > specialization); year markers derive from the entry data
- The Experience stage keeps its hand-rolled rAF engine (grep: no framer-motion import under src/components/explore/sections/experience*); the framer-motion import appears ONLY in the projects editorial composition
- The Projects panel renders the top-6 curated projects as editorial rows (year + name + one-line description + link, thin dividers) inside a sticky ~100vh stage with framer-motion-driven scroll-linked interpolation: rows enter from below and coexist during transitions; reduced motion degrades to opacity-only swaps; motion character Editorial-calm (no bounce/springs/dramatic scaling)
- Both scroll-driven systems (experience sticky range + projects sticky stage) work inside the <main> scroll container without wheel-event hijacking; normal scrolling releases at range ends; 375px invariant holds on the rebalanced grid
- The new data field (availability) is typed in the .d.ts in the same commit (R-7); nothing deleted; the wizard/drawer/counter re-mapping is tested

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- User: 'I like that but I want the about section to be first on the top of the page. also the projects section must be use the below animation and ui enhancement' — panel order + projects editorial (REV-14/17).
- User delivered the editorial-scroll animation brief (scroll-driven pinned rows entering from below, coexisting, thin dividers, continuous scroll-linked interpolation, 'the content isn't being replaced, the viewport is moving through a designed composition').
- User: 'what I also want to share / merge in the experience timeline scrollable animation is the education' — REV-16 (5 chronological entries, type-aware).
- Engine comparison: two live prototypes (/motion-demo, deleted after decision) — user picked framer-motion 'but not for the experience'; Engine A's demo silence was a prototype scroll-source bug (window vs <main>), noted for correct implementation.
- Q: About package? A: Everything — positioning lead, metric row, availability badge, avatar, all 9 contacts (user).

---

*Phase: 09-editorial-motion-revision*
*Spec gathered: 2026-09-24*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.83 | 0.75 | PASS |
| Boundary Clarity | 0.72 | 0.70 | PASS |
| Constraint Clarity | 0.76 | 0.65 | PASS |
| Acceptance Criteria | 0.85 | 0.70 | PASS |

**Overall Ambiguity:** 0.207  (max 0.2)

**Gate:** OVERRUN — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
