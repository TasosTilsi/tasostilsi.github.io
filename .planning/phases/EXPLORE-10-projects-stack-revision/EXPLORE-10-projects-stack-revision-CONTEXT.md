# Phase 10: projects-stack-revision - Context

**Gathered:** 2026-09-25T14:58:06.765Z
**Status:** Ready for planning

<domain>
## Phase Boundary
SUPERSEDED: **In scope:** Stack carousel replacing the editorial rows: 6 visual-first cards (generative visuals, curated imperfection, in-card info on the active card), cardState(cardIndex, carouselProgress) pure geometry + tests, sticky scroll-driven stage (framer-motion), keyboard/RM/mobile contracts, stale-test renewal.
**Out of scope:** Image assets, new dependencies, Experience stage changes, data-file changes, CLI/resume/PDF changes, wheel hijacking, token/chrome replacement.
</domain>

<decisions>
## Decisions
### Stack construction
- SUPERSEDED: **D-01:** The curated stack replaces the phase-9 editorial rows: 6 cards, one per top-6 project (data order), physically stacked in depth inside the sticky ~100vh stage (md+ only) — card geometry = cardState(cardIndex, carouselProgress): foreground at translateY 0/scale 1/opacity 1/zIndex highest; behind-cards step translateY −30..−45px per level, scale 0.96/0.92/0.88, opacity 0.95/0.85/0.7 — CONTINUOUS interpolation from a single carouselProgress (no discrete thresholds); scrolling forward moves the foreground card away and promotes the next; both directions reversible; normal scrolling releases at the range ends.
- **D-02:** Curated imperfection: per-index deterministic offsets (translateX ±2-4px, rotation ±1°) seeded by the project index (never random-per-render); cards remain recognizably part of one collection (no scatter).
### Card design
- **D-03:** Visual-first cards: rounded corners (token radius), a generative IDE-language visual filling 75-85% of the card (monochrome SVG/CSS compositions in the design tokens, aria-hidden, zero image assets): 6 deterministic variants keyed to the project (DeepIndex = terminal/context-engine mock; Clarif-AI = contract-analysis panel mock; the other 4 = architecture/glyph/report panels selected by a stable `djb2(project.name) % 4` name-hash variant map per OQ-3); compact header: project name + tagline (first-sentence rule ≤120 chars); no paragraphs inside cards.
- **D-04:** In-card info (user decision): the ACTIVE card's header expands to carry the one-line description, technologies, and the project link — inactive cards show name + tagline only; the expansion animates with the same continuous derivation (height/opacity via transform-safe patterns).
### Interaction & constraints
- SUPERSEDED: **D-05:** Scroll-driven: single carouselProgress from the sticky-range scroll position (no wheel/touch hijacking; the single scroll source stays <main>); keyboard Prev/Next buttons step cards (setting progress to the card's band position — the phase-8 keyboard precedent); reduced motion = state transitions (opacity/zIndex swaps, no translation/scale motion) via useReducedMotion; listeners cleaned up on unmount.
- **D-06:** Stat tiles stay above the stage; the phase-9 editorial rows and their tests are replaced by the stack contract (stale-test discipline); the dual-engine grep ban holds (framer-motion only in the projects composition + About motion; never in the Experience stage files); zero new dependencies; mobile (<md) = simplified state-driven stack (`ProjectsMobileStack` per UI-SPEC §2.3; the phase-9 compact card grid is retired); 375px invariant + 44px controls + SSR foreground card (DeepIndex) as real text.
### Claude's Discretion
- The exact SVG compositions for the 6 generative visual variants (the *selection* of which variant applies to the 4 non-fixed projects is locked to the name-hash determinism in D-03 / OQ-3)
- Stack offset/scale constants within the brief's ranges (tunable U-item)
- Card dimensions/aspect ratio within the stage
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Revision targets
- `src/components/explore/sections/projects-section.tsx — the panel whose editorial rows this phase replaces (stat tiles stay)`
- `src/components/explore/viz-data.ts — parsing precedent (firstSentence rule, date parsing)`
- `src/components/explore/constants.ts — EXPLORE_SECTIONS/explore accents (dual-engine grep pins)`
### Data sources
- `src/data/portfolio-main-data.json — the top-6 projects in data order (DeepIndex, Clarif-AI, SDK4ED-TD, …) with name/description/link/date`
- `src/data/portfolio-main-data.d.ts`
### Spec + design skills
- `.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-SPEC.md — the user's brief quoted in full`
- `~/.dsh/skills/motion-design/SKILL.md + design-taste-frontend/SKILL.md — the motion/taste guidance for the stack's motion character`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- SUPERSEDED: framer-motion v13.4.3 is installed — useScroll/useTransform/useReducedMotion drive the stack; the phase-9 rows composer lives in the same projects files and gets replaced
- The projects top-6 = the existing card-grid render set in data order (DeepIndex, Clarif-AI, SDK4ED-TD, …) — same set the brief's 6-project list maps to
- The phase-1 reduced-motion guard suppresses CSS animations inside .explore-shell; framer-motion's useReducedMotion covers the JS side (the phase-9 RM precedent)
- SUPERSEDED: The editorial rows' scroll wiring (useScroll over the wrapper range, sticky recipe md:h-[calc(100dvh-10rem)]) is the reuse base — the stack swaps the row composer for the card-state function
- The generative visuals draw from each project's identity: DeepIndex = terminal/context-engine mock; Clarif-AI = contract-analysis panel; SDK4ED-TD = architecture/glyph panel; the remaining 3 = deterministic variants keyed by the project name (hash → variant)
- The dual-engine grep pin (framer-motion banned under src/components/explore/sections/experience*) stays; the projects files carry the framer-motion imports
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
  _Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._
  ### Req REV-18
  - **Current:** Projects shows stat tiles + the phase-9 editorial scroll rows (entering from below, coexisting).
  - SUPERSEDED: **Target:** The curated stacked-card carousel replaces the editorial scroll: 6 cards physically stacked in depth, continuous geometry from cardIndex + carouselProgress, scroll-driven both directions.
  - SUPERSEDED: **Acceptance:** grep-verifiable: the editorial rows are gone; the stack stage renders 6 overlapping cards; card geometry derives from the pure cardState(cardIndex, carouselProgress) function (unit-testable); scrolling forward promotes the next card and scrolling back reverses identically; sticky stage releases normal scrolling at the ends.
  ### Req REV-19
  - **Current:** Cards (phase-6 grid) / rows (phase-9) are text-first without visuals.
  - **Target:** Visual-first cards with generative IDE-language visuals and curated imperfection, in-card info on the active card.
  - **Acceptance:** Each card renders: rounded corners, compact header (name + tagline), the generative monochrome visual (75-85% of the card, distinct per project, token-colored SVG/CSS); per-index deterministic offsets (±2-4px, ±1°); the ACTIVE card's header expands to description/technologies/links; zero image assets fetched.
  ### Req REV-20
  - **Current:** The phase-9 rows carry their own keyboard/RM contract (to be rewritten).
  - **Target:** The interaction-quality contract for the stack: keyboard navigation, reduced-motion fallback, cleanup, mobile adaptation, data-driven content.
  - **Acceptance:** Keyboard Prev/Next steps the carousel; reduced motion replaces physical motion with state swaps; listeners cleaned up; mobile simplified stack; all strings data-driven; the dual-engine grep ban holds.
- **Boundaries (SPEC):**
  SUPERSEDED: **In scope:** The Projects panel's editorial scroll is replaced by a curated stacked-card carousel per the user's visual brief — 6 visual-first cards physically stacked in depth, continuous cardPosition = f(cardIndex, carouselProgress) with framer-motion, generative IDE-language visuals, curated imperfection, in-card info on the active card, keyboard + reduced-motion contracts, mobile simplified stack — IDE aesthetic preserved.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
  - SUPERSEDED: The Projects panel renders the stacked-card carousel: 6 cards physically overlapping in depth inside a sticky ~100vh scroll-driven stage (md+); the foreground card is largest/fully opaque with the highest z-index; cards behind it show their upper portions with progressively smaller scale/lower opacity/greater offset
  - SUPERSEDED: Card appearance derives continuously from cardIndex + carouselProgress (a typed pure function, unit-testable): translateY, translateX, scale, opacity, zIndex, rotation — NO discrete state swaps as the primary mechanism; scrolling backward reverses the exact same motion; normal scrolling releases at the stage ends
  - The generative visuals: each card's visual area carries a deterministic monochrome IDE-language composition keyed to the project (6 distinct variants — e.g. terminal-mock for DeepIndex, contract-analysis mock for Clarif-AI, architecture/glyph panels for the rest), aria-hidden, no image assets fetched, no gradients, rendered in SVG/CSS with the design tokens
  - Curated imperfection is deterministic: per-index offsets (±2-4px translate, ±1° rotation) computed from the index (no randomization at render); the composition reads as curated, not scattered
  - In-card info: the ACTIVE card's header expands to carry the project's one-line description, technologies, and links (GitHub/demo) — inactive cards show name + tagline only; links keyboard-accessible
  - The stat tiles remain above the stage; the phase-9 editorial rows are removed with their tests rewritten/removed per the replacement discipline; framer-motion imports confined to the projects composition (the dual-engine grep ban extended)
  - prefers-reduced-motion replaces physical movement with state transitions (opacity/state swaps, no translation/scale motion); keyboard Prev/Next buttons step cards with an accessible non-scroll alternative; listeners cleaned up on unmount
  - Mobile (<md) collapses to a simplified stacked composition (active card dominant, behind-cards hinted, content readable); no horizontal scroll; 375px invariant holds
  - SSR/no-JS: the foreground card (DeepIndex) renders with its name/tagline/visual as real text/markup; hydration activates the carousel; all content data-driven from portfolio-main-data.json (EXPLORE-07)
- SUPERSEDED: User brief (full, 2026-09-24): curated stacked-card gallery, depth hierarchy, continuous cardState(cardIndex, carouselProgress), scroll-driven foreground promotion, curated imperfection, visual-first cards, in-card info, framer-motion, keyboard + RM contracts, mobile simplified stack, anti-slop language, 'the viewport moves through a designed composition'
- User decisions: generative IDE visuals / top-6 / in-card info
</specifics>

<deferred>
## Deferred Ideas
- Real screenshots replacing generative visuals (the data field route — user supplies assets later)
- The terminal/command-driven About-skill idea (user's third-pattern note — future direction, not this phase)
- Cards for the other 8 projects (CLI-reachable)
</deferred>


## Gap-closure amendment (2026-09-29)

Phase-10 verification returned `gaps_found`: four must-have truths were retired by the user's live-review directive recorded in `.planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md` and implemented at commit `b39b12c`. The decision blocks above keep their original text byte-for-byte - the amended clauses are quarantined in place behind the literal `SUPERSEDED:` prefix and the delivered contract is stated below.

- **D-01 AMENDED (geometry input).** The single geometry input is the ring-buffer foreground index: `cardState(cardIndex, frontIndex, count, reducedMotion)` derives depth continuously from the cyclic distance to the foreground card, and the LEVELS depth table, the deterministic-imperfection contract and the continuity/reversibility clauses survive unchanged. The one quarantined line in the D-01 block above is the retired scroll-derived-progress formulation.
  SUPERSEDED: the scroll-derived progress contract that lived inside the sticky 300vh range is retired; the panel renders at natural height and `frontIndex` is advanced by swipe, keyboard or the control buttons.
- **D-03 AMENDED (variant assignment).** The curated per-project table is PRIMARY: six entries, one per top-6 project, matching the anatomy of the shipped components - DeepIndex `terminal-mock`, Clarif-AI `contract-analysis`, SDK4ED-TD `glyph`, ServicedMetricsCalculator `report`, Avoid Traffic Extended `network`, Uom Track `dashboard`. `djb2(project.name) % 4` is the deterministic FALLBACK for names outside the curated six. The shipped identifiers are anatomy-equivalent to UI-SPEC §4.4's drafted labels, and the labels themselves were replaced in §4.4 by plan 06 (SDK4ED-TD `architecture-diagram` → `glyph`, ServicedMetricsCalculator `metrics-dashboard` → `report`, Avoid Traffic Extended `route-map` → `network`, Uom Track `report-table` → `dashboard`); Uom Track diverges in anatomy as well as label - it ships the `dashboard` composition (2×2 KPI tiles + three progress bars), not §4.4 row 5's drafted report table. Reason on record: the hash alone collided - ServicedMetricsCalculator and Uom Track both hashed to `network`, giving 5 distinct visuals for 6 cards and failing REV-19's distinctness acceptance (phase-10 VERIFICATION AP-1); plan 04 closed it.
  SUPERSEDED: the earlier clause that assigned the four remaining projects to a name-hash variant map alone is retired as the primary selection rule.
- **D-05 AMENDED (keyboard).** Prev/Next, Arrow keys and Home/End set the ring-buffer front index directly; the 44px focusable controls, the throttled `aria-live` announcement, the no-wheel/touch-hijacking rule and unmount cleanup are unchanged; reduced motion is applied only after mount, so the server render and the first client render agree (the plan-05 hydration-parity fix).
  SUPERSEDED: the keyboard stepping that set a scroll band through `main.scrollTo` is retired - there is no scroll band to target.
- **Obsolete and re-affirmed.** Resize remeasurement is obsolete: no scroll-band formula exists and the stack is layout-independent (fixed-height stage, absolutely positioned cards). D-02 (curated imperfection), D-04 (in-card info on the active card) and D-06 (dual-engine ban, zero new dependencies, stale-test discipline) are re-affirmed unchanged; D-06's mobile clause is confirmed as delivered - a simplified state-driven stack with the active card plus one peek, and the phase-9 compact card grid retired. Accepted deviation **AP-2**: `projects-mobile-stack.tsx` is a 20-line delegate to the shared swipe stack (the capability is delivered by `ProjectsSwipeStack mode="compact"` and is test-pinned); it is deliberately not inflated to the executed plan's `min_lines: 130`.

---

*Phase: 10-projects-stack-revision*
*Context gathered: 2026-09-25*
*Contract amended for gap closure: 2026-09-29*