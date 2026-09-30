# Phase 10: projects-stack-revision - Spec

**Gathered:** 2026-09-25T14:57:30.916Z
**Mode:** interviewed

## Requirements

RETAINED: **Amendment (gap closure, 2026-09-29):** the scroll-driven formulation below was superseded by the user's live-review directive of 2026-09-25 (quick task `2026-09-25-projects-swipe-loop-stack`, commit b39b12c). The requirement IDs, the falsifiable-acceptance discipline and the IDE-aesthetic boundaries are unchanged; only the interaction mechanism is restated as the delivered swipe-driven ring buffer. — retained: this line performs the supersession and therefore names the retired mechanism in order to retire it; it asserts no retired contract, so the sweep exempts it by name rather than quarantining a live amendment.

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req REV-18

- **Current:** Projects shows stat tiles + the phase-9 editorial scroll rows (entering from below, coexisting).
- **Target:** The curated stacked-card carousel replaces the editorial scroll: 6 visual-first cards forming a swipe-driven, loopable ring buffer of physically stacked cards at natural height, card appearance derived continuously from depth off the foreground card (translateY/scale/opacity/z-index), the foreground card draggable and both directions reversible (a full cycle returns the initial arrangement).
- **Acceptance:** grep/test-verifiable against the delivered tree: the editorial rows are gone; the stack stage maps the top-6 slice to stacked cards; card geometry derives from the pure `cardState(cardIndex, frontIndex, count, reducedMotion)` exported by `projects-card-state.ts` and is unit-tested; the swipe helpers `swipeAccepts`/`SWIPE_THRESHOLD`/`SWIPE_VELOCITY_THRESHOLD` are unit-tested; a full cycle of six front-index steps returns the initial arrangement.

### Req REV-19

- **Current:** Cards (phase-6 grid) / rows (phase-9) are text-first without visuals.
- **Target:** Visual-first cards with generative IDE-language visuals and curated imperfection, in-card info on the active card.
- **Acceptance:** Each card renders: rounded corners, compact header (name + tagline), the generative monochrome visual filling 75-85% of the card, token-colored SVG/CSS; DISTINCT visuals per project: the six top-6 project names resolve to six distinct variants through `projectVisualVariant`, with the curated per-project table primary and `djb2(project.name) % 4` as the deterministic fallback for uncurated names; per-index deterministic offsets (±2-4px, ±1°) with no per-render randomness; the ACTIVE card's header expands to description/technologies/links; zero image assets fetched, no gradients, monochrome token-only compositions, `aria-hidden` visuals, and keyboard-accessible links on the active card only.

### Req REV-20

- **Current:** The phase-9 rows carry their own keyboard/RM contract (to be rewritten).
- **Target:** The interaction-quality contract for the stack: keyboard navigation, reduced-motion fallback, cleanup, mobile adaptation, data-driven content.
- **Acceptance:** Keyboard stepping is state-driven — Prev/Next, Arrow keys and Home/End set the ring-buffer front index directly; reduced motion is opacity/zIndex state swaps with no translation/scale/rotation, is mount-gated (applied only after mount so SSR and the first client render agree) and disables drag; listeners cleaned up on unmount; mobile simplified stack; all strings data-driven; the dual-engine grep ban holds.

## Boundaries

**In scope:** the Projects panel's editorial scroll is replaced by a curated stacked-card carousel: 6 visual-first cards forming a swipe-driven, loopable ring buffer of physically stacked cards at natural height, `cardState(cardIndex, frontIndex, count, reducedMotion)` as the pure geometry, framer-motion confined to the projects composition, generative IDE-language visuals, curated imperfection, in-card info on the active card, keyboard + mount-gated reduced-motion contracts, mobile simplified stack — IDE aesthetic preserved.
**Out of scope:** (not specified)

## Constraints

- Dual-engine discipline maintained: framer-motion powers the stack (replacing the phase-9 rows composer in the projects files); a grep ban keeps framer-motion out of the Experience stage files (unchanged); the Experience hand-rolled rAF engine is untouched
- Zero new dependencies: framer-motion is already the 39th dependency; the generative visuals are pure SVG/CSS in the design tokens — no image files, no icon additions
- Continuous derivation: geometry is a pure function of `(cardIndex, frontIndex, count, reducedMotion)` (unit-testable); `frontIndex` is the single geometry input, advanced by swipe, keyboard or the control buttons; the panel is layout-independent (fixed-height stage, absolutely positioned cards) so no resize remeasurement exists; no wheel/touch hijacking (the single scroll source stays .explore-shell > main)
- Curated imperfection is deterministic: per-index offsets computed from the project index (seeded by index, never random-per-render)
- The IDE rail holds: design tokens, JetBrains Mono, PanelShell chrome, dark/light themes, 375px no-horizontal-scroll, 44px targets on controls, reduced-motion guard coverage, static export (SSR renders the foreground card's content as real text)
- Stale-test discipline: the phase-9 editorial-rows tests rewrite to the stack contract (or drop with their subjects); the projects panel's tiles remain; the dual-engine and dependency pins stay green
- The data file is unchanged this phase: the generative visuals derive from the project's existing fields (name/description/link) via a deterministic variant map — no new data fields required; the card tagline derives from the project's existing description first-sentence rule

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
- The Projects panel renders the stacked-card carousel: the 6 top-6 cards form a swipe-driven, loopable ring buffer of overlapping cards in depth at natural height, centered in a fixed-height stage (md+); the foreground card is largest/fully opaque with the highest z-index; cards behind it show their upper portions with progressively smaller scale/lower opacity/greater offset
- Card appearance derives continuously from cardIndex + frontIndex (a typed pure function, unit-testable): translateY, translateX, scale, opacity, zIndex, rotation — no discrete state swaps as the primary mechanism; a full six-step cycle returns the initial arrangement; the swipe helpers `swipeAccepts`/`SWIPE_THRESHOLD`/`SWIPE_VELOCITY_THRESHOLD` are unit-tested; the panel is layout-independent, so no resize remeasurement is required
- The generative visuals: each card's visual area carries a deterministic monochrome IDE-language composition keyed to the project (6 distinct variants — e.g. terminal-mock for DeepIndex, contract-analysis mock for Clarif-AI, architecture/glyph panels for the rest), aria-hidden, no image assets fetched, no gradients, rendered in SVG/CSS with the design tokens
- Curated imperfection is deterministic: per-index offsets (±2-4px translate, ±1° rotation) computed from the index (no randomization at render); the composition reads as curated, not scattered
- In-card info: the ACTIVE card's header expands to carry the project's one-line description, technologies, and links (GitHub/demo) — inactive cards show name + tagline only; links keyboard-accessible
- The stat tiles remain above the stage; the phase-9 editorial rows are removed with their tests rewritten/removed per the replacement discipline; framer-motion imports confined to the projects composition (the dual-engine grep ban extended)
- prefers-reduced-motion replaces physical movement with state transitions (opacity/state swaps, no translation/scale motion) and is applied only after mount so SSR and the first client render agree (no hydration mismatch), with drag disabled; keyboard Prev/Next buttons and Arrow/Home/End step the ring buffer with an accessible non-scroll alternative; listeners cleaned up on unmount
- Mobile (<md) collapses to a simplified stacked composition (active card dominant, behind-cards hinted, content readable); no horizontal scroll; 375px invariant holds
- SSR/no-JS: the foreground card (DeepIndex) renders with its name/tagline/visual as real text/markup; hydration activates the carousel; all content data-driven from portfolio-main-data.json (EXPLORE-07)

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- SUPERSEDED: User delivered the COMPLETE projects-showcase brief (2026-09-24, quoted at length in the interview log below): curated stacked-card gallery — depth-stacked overlapping cards, card appearance = f(cardIndex, carouselProgress) with configurable offsets, scroll-driven continuous carouselProgress, foreground card moving away while the next promotes, curated imperfection (deterministic ±2-4px/±1° by index), visual-first cards (75-85% visual), in-card info on activation, framer-motion engine, keyboard + reduced-motion contracts, mobile simplified stack, editorial anti-slop language, 'the content isn't being replaced — the viewport moves through a designed composition'.
- User vision note: three spatial interaction patterns sharing one design language (semicircle career, stacked-cards projects, terminal about) — recorded as direction, not scope.
- Q: card visuals? A: Generative IDE visuals (no assets).
- Q: how many cards? A: Top-6.
- Q: info placement? A: In-card info (active card's header expands).

---

*Phase: 10-projects-stack-revision*
*Spec gathered: 2026-09-25*
## Ambiguity Report

**Status:** UNAVAILABLE

_The ambiguity-scoring subagent could not score this draft. Cause: unknown. The SPEC.md is still written; the planner should treat the un-scored clarity dimensions as assumptions and re-clarify them._
