# Phase 4: explore-gamification - Spec

**Gathered:** 2026-09-21T21:27:11.963Z
**Mode:** interviewed

## Requirements

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req EXPLORE-04

- **Current:** No tour exists on /explore.
- **Target:** A step-by-step spotlight wizard tour (Welcome → About → Experience → Skills → Projects → Contact → finish card) — each step scrolls to and highlights the real panel with a short plain-language summary card — built with existing primitives (Radix Dialog/Sheet patterns), Next/Back navigation, progress indicator, dismissible at any step.
- **Acceptance:** Overlay dims the page except the active panel; the summary card positions adjacent to the highlighted panel (never off-screen at 375px); Next/Back + step counter + progress dots work; X/ESC dismiss mid-tour without blocking the page.

### Req EXPLORE-04b

- **Current:** No tour entry point exists.
- **Target:** Tour trigger: auto-open once for first-time visitors + a 'Tour' button in the header bar (44px, ghost, px-based per phase-1 trap) that re-opens the wizard.
- **Acceptance:** First visit auto-opens the tour exactly once (explore-scoped localStorage flag); dismissal marks 'seen'; the header Tour button re-opens the tour at any time for any visitor.

### Req EXPLORE-04c

- **Current:** Status bar shows a static '0/5 sections visited' (phase-1 D-03 placeholder).
- **Target:** Wire the status-bar section counter live: visiting a section (drawer anchor, scroll, or wizard step) marks it visited; the counter displays 'N/5 sections visited' with real N, persisted in localStorage.
- **Acceptance:** Counter shows real N/5 from anchor clicks, manual scroll-into-view, and wizard visits; persists across reloads via an explore-scoped localStorage key; the CLI counter/keys remain disjoint and untouched.

### Req EXPLORE-04d

- **Current:** No cross-surface pointer exists (phase-2 decided pointers stay static text).
- **Target:** The wizard's finish card points to the CLI at / for the full information — an internal link + one-line hint, per the user's 'point for more and full information if someone wants to go in the cli interface'.
- **Acceptance:** The finish card renders an internal link to / with a one-line chrome hint that the terminal holds the full information; clicking navigates in the same tab; the link is the only new cross-surface pointer.

## Boundaries

**In scope:** Add light gamification to /explore — a guided spin-the-wheel tour picker, exploration progress/achievements, and light humor in the copy.
**Out of scope:** (not specified)

## Constraints

- Augment-only: /explore panels, grid, chrome, and phase-3 visualizations untouched by the wizard's page rendering; the CLI and /resume stay byte-untouched; wizard lives under src/components/explore/
- Spotlight overlay implemented SSG-safely: measure the target panel's bounding rect at step-activation time (client-only); the overlay is a fixed full-viewport layer with a cut-out (box-shadow/clip technique) around the highlighted panel; no horizontal scroll introduced at 375px
- All localStorage keys explore-scoped and disjoint from CLI keys (precedent: phase-1 theme key isolation, verified in tests)
- Auto-open fires once per visitor via the flag; dismissal before finishing also sets a 'seen' flag so it never nags
- Wizard step summaries are chrome copy (short, plain-language, one or two sentences per section); section NAMES come from EXPLORE_SECTIONS; zero invented portfolio facts
- Reduced motion: spotlight transitions are CSS-only and already suppressed by the phase-1 guard; no recharts coupling; no new dependencies

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; /explore still exports statically
- A spotlight overlay tour exists with the locked step sequence: Welcome → About → Experience → Skills → Projects → Contact → finish card; each content step smooth-scrolls to its real panel, dims the rest of the page, and shows a short plain-language summary card near the target
- Wizard controls: Next / Back buttons, progress dots or step counter, dismiss anytime via X and ESC; finishing or dismissing never blocks the page
- Auto-opens once for first-time visitors (localStorage explore-scoped flag, disjoint from CLI keys); a 'Tour' button in the header re-opens it for returning visitors
- The finish card points visitors to the CLI at / for the full information (internal link + one-line hint) — the only cross-surface pointer in this phase
- The status-bar counter becomes LIVE: sections visited update from drawer anchors, manual scrolling, and wizard steps; count persists across reloads via an explore-scoped localStorage key; renders as 'N/5 sections visited'
- No separate achievements/easter-egg system is added; no spin-the-wheel exists; the CLI and /resume remain untouched
- Spotlight step cards are keyboard-operable (focus lands on the card, focus is not lost behind the overlay); reduced-motion suppresses transition animations via the existing CSS guard; 375px: no horizontal scroll, card fits and is touch-usable
- All wizard copy is chrome (structural labels + short summaries); section names come from EXPLORE_SECTIONS; no portfolio content invented beyond one-line orientation text

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- Q (roadmap): spin-the-wheel + achievements? A (user): 'should we skip this? and rethink it?' — wheel and achievements SKIPPED.
- Q: what instead? A (user): 'we should create a step by step wizard to showcase my website and portfolio and in the end of it we should point for more and full information if someone wants to go in the cli interface' — the wizard IS the guided tour; the CLI pointer is the finish card.
- Q: shape? A (user): Spotlight overlay tour (scrolls to the real panel, highlights it).
- Q: trigger? A (user): Auto once + button (auto-opens for first-time visitors, header Tour button re-opens).
- Q: counter/achievements? A (user): Live counter only (wire the 0/5 counter live via navigation + wizard steps; no separate achievements system).
- Q: humor tone? A: unanswered — register stays playful-chrome per established precedent, discretion.

---

*Phase: 04-explore-gamification*
*Spec gathered: 2026-09-21*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.78 | 0.75 | PASS |
| Boundary Clarity | 0.72 | 0.70 | PASS |
| Constraint Clarity | 0.88 | 0.65 | PASS |
| Acceptance Criteria | 0.86 | 0.70 | PASS |

**Overall Ambiguity:** 0.199  (max 0.2)

**Gate:** PASSING — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
