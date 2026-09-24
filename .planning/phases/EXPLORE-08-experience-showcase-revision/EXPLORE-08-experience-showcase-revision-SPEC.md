# Phase 8: experience-showcase-revision - Spec

**Gathered:** 2026-09-24T12:22:26.117Z
**Mode:** interviewed

## Requirements

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req REV-07

- **Current:** The Experience panel is a half-width card with the polished rail+dots text timeline (phase-7 state).
- **Target:** The Experience panel becomes a full-width interactive semicircular career timeline per the user's brief — the arc is the defining visual element, active role at the focal point, content beside it.
- **Acceptance:** The panel spans full grid width at md+ with the arc left ~40% and content right ~60%; the arc carries exactly 3 year markers positioned by the cos/sin math; the active role's content (title > company > dates > location > bullets) renders beside it; the grid rebalances with no empty cells.

### Req REV-12

- **Current:** n/a (new interaction).
- **Target:** The timelineProgress interaction model: scroll input → normalized progress → active index → arc positions → content interpolation, as one deterministic system with a typed hook.
- **Acceptance:** Scrolling inside the section maps to timelineProgress (0→1); marker positions/emphasis, active index, and content transitions derive from that single value (testable as a pure function); the arc ends release normal scrolling; no scroll-jacking outside the section.

### Req REV-13

- **Current:** n/a (new interaction).
- **Target:** The interaction-quality contract: hand-rolled rAF (no new deps), keyboard + accessible alternative, reduced-motion fallback, listener cleanup, mobile compact adaptation.
- **Acceptance:** Keyboard role navigation works (arrows/buttons); reduced motion swaps spatial transitions for opacity/state changes; listeners cleaned up; mobile renders the compact adapted form; all strings from the data file.

## Boundaries

**In scope:** The Experience panel becomes a full-width interactive semicircular career timeline per the user's detailed brief — mathematically positioned arc with year markers for the 3 docx roles, scroll-driven timelineProgress driving positions/emphasis/content transitions, hand-rolled rAF (zero new deps), keyboard + reduced-motion contracts, mobile-adapted compact form — IDE aesthetic preserved.
**Out of scope:** (not specified)

## Constraints

- Zero new dependencies: no framer-motion/GSAP — the rAF interpolation is hand-rolled in a typed hook (the brief's own architecture: timelineProgress → derived state)
- Data-driven: the arc consumes portfolio-main-data.json experience entries (the 3 docx roles filtered by isTechRelated — the phase-6 contract) — no hardcoded portfolio content (EXPLORE-07); the brief's Experience record shape maps onto the existing data (no data-file changes expected — surface at discuss if a field is missing)
- The IDE rail holds: design tokens, JetBrains Mono, PanelShell chrome, dark/light themes, drawer/wizard/counter flows still work (the wizard's ABOUT step targets the merged panel — unaffected; the EXPERIENCE step must still scroll to and mark the panel), 375px no-horizontal-scroll, 44px targets for any new controls
- Static-export safe: the scroll-driven stage is client-side; the SSR/export renders the first role's content (real text, no geometry-dependent layout), hydration activates the interaction
- Reduced motion: spatial transitions become opacity/state swaps; the arc becomes a static positioned indicator; keyboard navigation remains fully functional
- REV-07's brief is the WHAT source: layout geometry, hierarchy (title largest, metadata secondary, bullets readable), editorial styling, no gradients/glassmorphism/generic-SaaS patterns — adapted to IDE tokens rather than the brief's off-white/dark palette verbatim

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
- The Experience panel spans the full grid width (both columns at md+); the grid rebalances to Experience-full-width row + [About+Contact | Skills] below; no empty cells at any width; 375px invariant holds
- A large semicircular arc carries year markers for exactly the 3 docx tech roles, positioned mathematically (x = centerX + radius·cos(angle), y = centerY + radius·sin(angle)) — no hardcoded per-marker positions; the arc's geometry is computed from the container size and stays responsive
- The ACTIVE role sits at the arc's focal point (vertical center, darkest/largest marker + date); inactive markers are lighter/smaller and reposition along the curve as progress changes
- Scrolling inside the section drives timelineProgress (0→1) as the single source of truth: arc angles, marker positions/opacity/scale, active index, and content transitions ALL derive from it (no independent per-element animations); reaching the first/last role releases normal scrolling
- Role content (title largest, company distinct, dates/location secondary, quantified bullets readable) transitions with smooth movement/fade — never instant replacement; transitions animate transform/opacity only
- Hand-rolled rAF implementation: zero new animation dependencies (deps count stays 38); listeners/observers cleaned up on unmount; no unnecessary re-renders (transform-based writes)
- prefers-reduced-motion replaces spatial transitions with simple opacity/state transitions; keyboard users navigate roles (arrow keys or buttons) with an accessible non-scroll alternative; the timeline content is real text (role/company/dates/bullets readable by AT)
- Mobile (<md) collapses to a simplified compact vertical/curved timeline preserving the visual language; content readable; no horizontal scroll
- All content data-driven from portfolio-main-data.json experience entries (names, roles, dates, locations, refreshed quantified bullets) — zero hardcoded portfolio copy (EXPLORE-07); the stale text-timeline tests are rewritten/removed per the replacement discipline

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- User delivered the COMPLETE REV-07 brief (2026-09-22, quoted in full): scroll-driven semicircular timeline, mathematical arc positioning, single timelineProgress source of truth, content hierarchy (title > company > dates/location > bullets), data-driven records, reduced-motion + keyboard contracts, mobile adaptation, editorial styling, 'not a pixel-for-pixel copy of the screenshot but the curved timeline as central visual metaphor'.
- Q: animation engine? A: Hand-rolled rAF (user: AAA — zero new dependencies).
- Q: stage size? A: Full-width panel spanning both grid columns (user: AAA).
- Q: arc roles? A: The 3 docx tech roles (user: AAA; non-tech stay CLI-reachable).
- Adaptation notes (agent, from the brief): the brief's off-white content surface maps to our bg-card token on the dark shell; the brief's full-screen framing adapts to the full-width panel stage; the brief's Framer Motion preference is moot (not installed, hand-rolled per the brief's own 'if using another library, justify why' escape hatch).

---

*Phase: 08-experience-showcase-revision*
*Spec gathered: 2026-09-24*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.82 | 0.75 | PASS |
| Boundary Clarity | 0.68 | 0.70 | UNDER-MIN |
| Constraint Clarity | 0.84 | 0.65 | PASS |
| Acceptance Criteria | 0.80 | 0.70 | PASS |

**Overall Ambiguity:** 0.215  (max 0.2)

**Gate:** OVERRUN — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

**Flagged as planner assumptions:** Boundary Clarity (below min 0.7)
