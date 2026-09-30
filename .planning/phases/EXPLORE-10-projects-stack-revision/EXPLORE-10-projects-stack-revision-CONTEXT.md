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
- SUPERSEDED: The exact SVG compositions for the 6 generative visual variants (the *selection* of which variant applies to the 4 non-fixed projects is locked to the name-hash determinism in D-03 / OQ-3)
- Live re-statement of the bullet above: the exact SVG compositions for the 6 generative visual variants remain at Claude's discretion, but the variant SELECTION rule in its parenthetical is retired by the amended D-03 below - the curated per-project table is PRIMARY and `djb2(project.name) % 4` is the FALLBACK for names outside the curated six (quarantined line retained byte-identical; see **D-03 AMENDED** under `## Gap-closure amendment (2026-09-29)`).
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

### Contract sweep (2026-09-29)

Deterministic sweep run by plan 06 task 3 on the final amended tree. Every number below is a measured result, never an estimate. Documents swept (nine): `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, and the phase-10 `SPEC.md`, `UI-SPEC.md`, `CONTEXT.md`, `RESEARCH.md`, `-01-PLAN.md`, `-02-PLAN.md`, `-03-PLAN.md`.

Probe inputs, defined verbatim so the sweep reproduces. Each definition line is itself marked, because it spells retired tokens:

```bash
RETIRED_SET='carouselProgress|carouselPosition|main\.scrollTo|ResizeObserver|useScroll|300vh|sticky'  # SUPERSEDED: sweep-1 token set for ROADMAP.md (verbatim, so the probe is reproducible)
INTERACT_SET='scroll-driven|resize handling|resize-aware|name-hash determinism'  # SUPERSEDED: the four retired PROJECTS-stack INTERACTION tokens, spelled verbatim here ONCE so the prose below need not repeat them; retired for phase-10 descriptions only - phase-08's Experience row uses one of them correctly
RETIRED_SET_EXT="$RETIRED_SET|closest\('\[data-editorial-wrapper\]'\)|$INTERACT_SET"  # SUPERSEDED: sweep-1 token set for the phase-10 documents and the three plan records - the four interaction tokens were added by the 2026-09-30 W-1/W-4 corrections
NARROW_SET='carouselProgress|carouselPosition|main\.scrollTo|ResizeObserver'  # SUPERSEDED: REQUIREMENTS.md probe input only - REV-17 (line 31) keeps its phase-9 pinning wording by design
QUARANTINE_MARK='SUPERSEDED:'    # SUPERSEDED: retired history - the line's text is kept byte-identical behind this prefix
RETAIN_MARK='RETAINED:'          # SUPERSEDED: a LIVE line that names a retired token in order to retire it; exempt by name, reason on the line, bounded at exactly 1 in this phase
SCROLL_HOOK='useScroll'           # SUPERSEDED: the retired framer-motion scroll hook, probed in sweep 4
PROGRESS_NOUN='carouselProgress'  # SUPERSEDED: the retired scroll-progress noun, probed in sweeps 1 and 4
PINNING_KW='sticky'               # SUPERSEDED: the retired pinning keyword, probed in sweep 1
# sweep 1 (per document):             grep -nE "$RETIRED_SET_EXT" DOC | grep -vE "SUPERSEDED:|RETAINED:"
# sweep 1 (ROADMAP.md ONLY):          grep -nE "$RETIRED_SET" .planning/ROADMAP.md | grep -vE "SUPERSEDED:|RETAINED:"
# sweep 1 (REQUIREMENTS.md ONLY):     grep -nE "$NARROW_SET" .planning/REQUIREMENTS.md | grep -vE "SUPERSEDED:|RETAINED:"
# sweep 1b (marker budget, per file): grep -cE '^[[:space:]>*-]*RETAINED:' DOC   # expect exactly 1 summed over the nine documents; ANCHORED to the first content token, because this very section spells the marker in prose while documenting it and a bare substring count reads 10
# sweep 2 (per document):             grep -cE "frontIndex|ring buffer|ring-buffer" DOC
# sweep 3:                            grep -c "export function cardState" src/components/explore/projects-card-state.ts
# sweep 4:                            grep -rn "$SCROLL_HOOK\|$PROGRESS_NOUN" src/components/explore/ | grep -vE ":[[:space:]]*(\*|//)"
# sweep 4 (experience scroll source): grep -c "MAIN_SELECTOR = '.explore-shell > main'" src/components/explore/use-timeline-progress.ts
# sweep 5:                            git diff --name-only HEAD~2 HEAD
# sweep 7:                            tddAuditGate(plans, commitSubjects) from the installed @dsh-gsd bundle
```

**Sweep 1 - retired-token quarantine.** Commands: `grep -nE "$RETIRED_SET_EXT" DOC | grep -vE "SUPERSEDED:|RETAINED:"` for the phase-10 documents and the three plan records; `grep -nE "$RETIRED_SET" .planning/ROADMAP.md | grep -vE "SUPERSEDED:|RETAINED:"` for ROADMAP.md; `grep -nE "$NARROW_SET" .planning/REQUIREMENTS.md | grep -vE "SUPERSEDED:|RETAINED:"` for REQUIREMENTS.md. Result: **no output for all nine documents** (re-measured 2026-09-30 on the tree this revision leaves behind).

| document | unquarantined retired-token lines | `SUPERSEDED:` lines (re-measured, bare `grep -c`) | movement vs the 2026-09-29 record, attributed from `git diff` |
|---|---:|---:|---|
| `.planning/ROADMAP.md` (7-token set) | 0 | 0 | - |
| `.planning/REQUIREMENTS.md` (narrow set) | 0 | 0 | - |
| `SPEC.md` | 0 | 1 | +/-0 (plus the phase's single `RETAINED:` line) |
| `UI-SPEC.md` | 0 | 25 | +3 (W-1: lines 12, 294, 404) |
| `CONTEXT.md` | 0 | 32 | +8 (net of +12 added / -4 reworded, attributed with `git diff`; of the +12 only line 24 is a NEW quarantine - the other 11 are probe-input and record lines that spell the marker while documenting it, e.g. `INTERACT_SET`, the sweep-1 command comments and this section's own prose) |
| `RESEARCH.md` | 0 | 17 | +2 (W-1: lines 11, 84) |
| `-01-PLAN.md` | 0 | 3 | +1 (W-4 revision) |
| `-02-PLAN.md` | 0 | 33 | +9 (W-4 revision) |
| `-03-PLAN.md` | 0 | 4 | +1 (W-4 revision) |

Metric note, so the column is not over-read: the bare `grep -c "SUPERSEDED:"` count is a COVERAGE indicator, not an exact quarantine census - it also counts fenced-code trailing-comment markers, markdown-table-cell markers and lines that merely name the marker (this section alone contributes ~10 such lines in `CONTEXT.md`). The two FALSIFIABLE checks are therefore the ones below, not this count: (a) sweep 1 returns no output for all nine documents under their per-file token sets, and (b) the anchored `RETAINED:` budget (`grep -cE '^[[:space:]>*-]*RETAINED:'`) totals exactly 1 across the nine. Every figure in this table was re-measured on the tree this revision leaves behind; the attribution column comes from `git diff -U0 | grep -c '^+.*SUPERSEDED:'` / `'^-.*SUPERSEDED:'` on each file rather than from memory.

**Revision delta (2026-09-30, plan-checker W-1/W-3/W-4) - re-measured, never estimated.** The 2026-09-29 figures were true of the tree as it stood then; two later revisions moved them and this table carries the re-measured values, so the record again describes the tree it claims to describe.

- **W-4** added the four retired INTERACTION tokens (defined verbatim, once, above as `INTERACT_SET`) to the plan records' token set after six live-sounding lines survived in plans 01/02/03. Movement: `-01-PLAN.md` 2 → 3, `-02-PLAN.md` 24 → 33, `-03-PLAN.md` 3 → 4.
- **W-1** found the same four tokens STILL unquarantined in four DOCUMENT records - 7 measured lines, none of which the 2026-09-29 probe could see: `CONTEXT.md:24` (the retired variant-selection rule, contradicting the amended D-03), `RESEARCH.md:11` and `:84` (the retired stage description and OQ-3's retired selection rule), `SPEC.md:8` (the live amendment block - `RETAINED:`, not quarantined) and `UI-SPEC.md:12`, `:294`, `:404` (the retired stage description and the retired motion-system ownership claim). Movement: `CONTEXT.md` 24 → 25, `RESEARCH.md` 15 → 17, `UI-SPEC.md` 22 → 25; `SPEC.md` stays at 1 with 1 line marked `RETAINED:`.
- The sweep now removes both markers and bounds the exemption: the `RETAINED:` marker is asserted to be **exactly 1** across the nine documents BY FIRST CONTENT TOKEN (`grep -cE '^[[:space:]>*-]*RETAINED:'`, not a bare substring count — this very section spells the marker ~9 times while documenting it, so a bare `grep -c` reads 10 and would be a false RED), so a second unmarked token line cannot hide behind the marker, and the widened set is what makes sweep 1 falsifiable against the interaction vocabulary rather than only against the geometry/plumbing vocabulary.
- The widened set is deliberately NOT applied to `.planning/ROADMAP.md` and `.planning/REQUIREMENTS.md` - see the two scoping exceptions below. Applying it there is what produced the two false positives this delta eliminates.

Two scoping exceptions and one retained line, all recorded by name with a measured reason:

- **`ROADMAP.md` uses the seven-token `$RETIRED_SET`, NOT the extended set.** The four interaction tokens are retired only as descriptions of the **Projects stack** (phase 10). Phase-08's Experience row legitimately describes its own delivered timeline contract with one of them, because that phase's `timelineProgress` really is derived from scroll position: `grep -nE "$INTERACT_SET" .planning/ROADMAP.md` = **1** and it is line 14 = phase 08, so it is excluded by SCOPE, not quarantined - prefixing another phase's correct row would damage an unrelated record.
- **`REQUIREMENTS.md` uses the four-token `$NARROW_SET`.** Line 31 is REV-17, an untouched earlier-phase requirement that legitimately keeps its phase-9 pinning wording. `grep -c "$PINNING_KW" .planning/REQUIREMENTS.md` = **1**, and `grep -n "$PINNING_KW"` lists exactly line 31 - the only surviving occurrence in that file.
- **`SPEC.md:8` is the phase's single `RETAINED:` line.** It is the amendment block, whose whole job is to announce the supersession: it names the retired mechanism in order to retire it and asserts no retired contract, so quarantining a live amendment would be wrong. `grep -cE '^[[:space:]>*-]*RETAINED:'` across the nine documents = **1** (anchor the count to the first content token: the sweep record below spells the marker many times in prose while documenting it).

**Sweep 2 - primary-noun coverage.** Command: `grep -cE "frontIndex|ring buffer|ring-buffer" DOC`. Results (re-measured 2026-09-30, post-revision): ROADMAP 1, REQUIREMENTS 1, SPEC 9, UI-SPEC 7, CONTEXT 8, RESEARCH 5, 01-PLAN **3**, 02-PLAN **9**, 03-PLAN **4** - every document at least 1, so the delivered vocabulary is live in all nine. The three plan-record figures moved with the W-4 revision (previously recorded 2 / 6 / 3); the other six are unchanged.

**Sweep 3 - delivered-contract reality check against the code.** `grep -c "export function cardState" src/components/explore/projects-card-state.ts` = **1**; the source signature read at `projects-card-state.ts:275-280` is `cardState(cardIndex, frontIndex, count, reducedMotion)`. The amended documents name the same parameter order, so the record and the code agree.

**Sweep 4 - retired symbols in executable code.** Command: `grep -rn "$SCROLL_HOOK\|$PROGRESS_NOUN" src/components/explore/ | grep -vE ":[[:space:]]*(\*|//)"` -> **0 matches**: no live code path references the retired tokens. Exactly ONE comment occurrence remains, named: `projects-card-state.ts:12` (the docstring recording that `cardState` takes a ring-buffer `frontIndex` instead of the retired progress input). `grep -c "$SCROLL_HOOK" src/components/explore/explore-panels.tsx` = **0** - plan 05 (wave 2) replaced that stale comment with the measured truth. The Experience scroll source is unchanged and independent of the wrapper attribute: `grep -c "MAIN_SELECTOR = '.explore-shell > main'" src/components/explore/use-timeline-progress.ts` = **1**.

**Sweep 5 - cross-file scope.** `git diff --name-only HEAD~2 HEAD` lists exactly the nine planning documents (`ROADMAP.md`, `REQUIREMENTS.md`, `SPEC.md`, `UI-SPEC.md`, `CONTEXT.md`, `RESEARCH.md`, `-01-PLAN.md`, `-02-PLAN.md`, `-03-PLAN.md`) - non-`.planning/` paths = **0**. Plan 05's files (`projects-stack-stage.tsx`, `explore-panels.tsx`, `tests/explore-visuals.test.mjs`) are untouched by this plan. This is the **2026-09-29 run's** measurement of that commit range; the 2026-09-30 W-1 revision adds its own planning-record changes, so the figure is not re-asserted for the later range - re-run the command for whatever range is being checked.

**Sweep 6 - acceptance-to-suite mapping.**

| requirement | pinned by |
|---|---|
| REV-18 geometry / ring buffer / reversibility | `tests/projects-stack.test.mjs` (`cardState` plus the `swipeAccepts` / `SWIPE_THRESHOLD` / `SWIPE_VELOCITY_THRESHOLD` unit contracts) and the EXPLORE-10 invariant test in `tests/explore-visuals.test.mjs` |
| REV-19 six distinct curated visuals + name-hash fallback + dispatch coverage | `tests/projects-stack.test.mjs` (the six-distinct, curated-precedence, hash-fallback and dispatch-coverage assertions added by plan 04) |
| REV-20 keyboard / mount-gated reduced motion / cleanup / mobile / SSR | `tests/explore-visuals.test.mjs` (the AP-3/AP-6 structural pins added by plan 05 plus the existing swipe-driven invariant) and the static-export check of `out/explore.html` |

Tooling note (verbatim): this phase has no `VALIDATION.md` by design at this point - `gsd_validate_phase` writes `<NN>-VALIDATION.md` AFTER `gsd_verify` passes, so the phase's acceptance-to-suite mapping is recorded here and the tooling artefact is produced post-verify; do not hand-author `VALIDATION.md` in this plan.

**Sweep 7 - the ship-gate decision (reproduced, not restated).** Mechanics, read from the installed plugin and re-run: `planScope` builds each plan's commit scope as `{phase}-{plan}` zero-padded to two digits, so plan-04's scope is `10-04`; `tddAuditGate` keeps only subjects matching `new RegExp('\\(10-04\\)')`; `ship.js` loads EVERY plan in the phase, so all three `type: tdd` plans (-01, -04, -05) are evaluated; `config.json` has no `gates` block and an absent gate defaults to ENABLED, so `tdd_audit` is required here.

Reproduced results on the real landed subjects (chronological):

- post-revision: `{"status":"fail","findings":[{"planId":"EXPLORE-10-projects-stack-revision-01","reason":"missing test: commit before feat:/fix:"}]}` - **fails on 01 only**.
- pre-revision counter-probe (the long-form scope prescribed for 04 and 05 as well): **fails on 01, 04 and 05**.

Decision: this phase ships with `skip_gates: ["tdd_audit"]` (CLI form `--skip-gates tdd_audit`), leaving `security` and `broken_windows` enabled. Neither is weakened by the skip: no secret-glob path is touched, and `brokenWindowsGate` skips `.planning/**` entirely plus every non-code extension, so the `SUPERSEDED:` quarantine prose cannot false-positive on a TODO/FIXME/XXX marker.

Cause: plan-01's three commits are already landed with the long-form scope `test(EXPLORE-10-projects-stack-revision-01)` / `feat(EXPLORE-10-projects-stack-revision-01)`, which match no derived scope; a landed history cannot be fixed by editing a plan document.

Declined alternative: rewording those commits would require a force-push of `origin/phase-11` (`git branch -r --contains e936b20` returns `origin/phase-11`), and remote writes in this project are gated on an explicit per-action user command. Nothing else in the plan set depends on which way this goes.

Honest framing: this is an accepted, recorded skip of one gate for a pre-existing history defect - **not** a claim that the phase satisfies `tdd_audit`. Plans 04 and 05 do satisfy it (their `test:` commits precede their `fix:` commits), and plan 06 is `type: execute`, so the gate never evaluates it.

**Open items (not closed by this plan).** Human Verification items 1-5 from `EXPLORE-10-projects-stack-revision-VERIFICATION.md` remain open: swipe feel; shadow bloom in both themes; the 75-85% visual-area proportion with the 375px invariant; OS reduced-motion browser parity with a clean console; the keyboard/screen-reader pass. AP-2 remains an accepted deviation (the delegated mobile stack). No browser-verified or visually-measured result is claimed anywhere in this sweep.

---

*Phase: 10-projects-stack-revision*
*Context gathered: 2026-09-25*
*Contract amended for gap closure: 2026-09-29*