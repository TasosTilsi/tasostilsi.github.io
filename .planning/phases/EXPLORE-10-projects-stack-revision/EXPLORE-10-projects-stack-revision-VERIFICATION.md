---
phase: 10-projects-stack-revision
verified: 2026-09-30T00:25:06+03:00
status: human_needed
score: 41/43 must-haves verified
behavior_unverified: 2
overrides_applied: 2
human_verification:
  - test: "Swipe/drag feel on desktop (mouse) and touch: grab the foreground card, drag past ~100px or flick past 500px/s, release; then run a full six-swipe cycle."
    expected: "The card flies off, the card behind promotes one level, the flown card loops to the back; a below-threshold drag springs back without overshoot; after six swipes the original arrangement and the 01 / 06 counter return."
    why_human: "Gesture feel, promotion timing and spring restraint are interactive; no static check or unit test observes them (the pure helpers and the loop invariant are asserted, the felt motion is not)."
  - test: "Shadow bloom: confirm the foreground card's --panel-shadow-hover bloom renders visibly onto the cards beneath it in BOTH themes and is not clipped by an ancestor (the overflow-visible chain through stage, panel body and shell)."
    expected: "The shadow reads as depth above the stack in dark and light themes, with no hard cut at a container edge."
    why_human: "Clipping and visibility depend on computed layout plus theme tokens; it was an explicit user-directive item."
  - test: "Visual-first proportion and small-viewport invariant: at md+ measure that the generative visual occupies ~75-85% of the card; at 375px check the compact stack."
    expected: "No horizontal scroll, active card dominant, exactly one peek card, content legible at 100% zoom, IDE aesthetic preserved."
    why_human: "Visual proportion and small-viewport rendering require a real viewport or screenshot; the 75-85% figure is a live REV-19 acceptance number and has never been measured."
  - test: "Reduced motion in a real browser with the OS setting ON: reload /explore, step with the controls, and watch the console."
    expected: "Instant opacity/z-index state swaps with zero translate/scale/rotation; no React hydration warning; no perceptible first-paint swap from the non-RM arrangement."
    why_human: "Needs an OS-level media-query setting plus console inspection. The mount gate makes the SSR and first-client render provably identical (verified structurally and test-pinned), but the end-to-end observable is browser-only."
  - test: "Keyboard-only and screen-reader pass: tab to the stack; Arrow keys, Home/End and the Prev/Next buttons; listen to the live region."
    expected: "Announcements read 'Project NN of 06: <name>'; focus stays on the controls and never lands on a hidden card's link (inactive cards render no links)."
    why_human: "Focus order and live-region announcements are observable only in a browser with a screen reader."
---

# Phase 10: projects-stack-revision Verification Report

**Mode:** re-verification (prior `EXPLORE-10-projects-stack-revision-VERIFICATION.md` carried `gaps_found`, 21/26). Per the re-verification rule, previously failed items are the focus and passed truths get a quick regression.

**Scope.** Verified against the live working tree at `d202546` on branch `phase-11` (`git status --porcelain src/ tests/ .planning/` clean — the tree verified is the committed tree), not against SUMMARY.md. The prior verification ran at `d2f1db5`; everything reviewed here is in the 16 commits `d2f1db5..HEAD` (plans 04, 05, 06 plus their summaries and the plan artefacts).

**What changed since the failed verification.** The prior run found four retired-by-directive truths plus one dead key link, and recommended closing them by reconciling the *live contract chain* to the delivered swipe/ring-buffer interaction rather than restoring scroll. That is what happened: plans 04, 05 and 06 rewrote ROADMAP/REQUIREMENTS/SPEC/UI-SPEC and the executed plan records, and fixed the two code-level defects the prior run raised (AP-1 variant collision; AP-3/AP-6 mount gate and stray class token). All five prior gaps and both code findings are now closed — evidence below.

## Goal Achievement → Observable Truths

Roadmap truths (R1-R10, from the phase-10 goal as amended this phase) + every plan's frontmatter `must_haves.truths`.

| # | Truth | Status | Evidence |
|---|---|---|---|
| R1 | The Projects panel's editorial scroll is replaced by a curated stacked-card carousel over the top-6 projects | ✓ VERIFIED | `projects-row-state.ts`, `projects-editorial-stage.tsx`, `tests/projects-editorial.test.mjs` absent from disk; `projects-section.tsx:33-38` renders the stack (md+) and mobile stack; no `ProjectsEditorialStage` string remains |
| R2 | Six visual-first cards physically stacked in depth inside the stage | ✓ VERIFIED | `projects-stack-stage.tsx:538-660`; cards `position:absolute; inset:0` with `x/y/scale/rotate/opacity` from `cardState` (`:411-421`, `:508-521`); `projects-section.tsx:20` slices the top 6 |
| R3 | Card appearance = `cardState(cardIndex, frontIndex)` from the pure `projects-card-state` module; translateY/scale/opacity/z-index derived from depth off the foreground card; reversible in both directions | ✓ VERIFIED | `projects-card-state.ts:275-280` signature `cardState(cardIndex, frontIndex, count, reducedMotion)`; `LEVELS` depth table `:56-63`; loop invariant + reversibility + monotonicity tests pass (`tests/projects-stack.test.mjs:342,357,375`); module has zero runtime imports |
| R4 | Six distinct deterministic generative IDE-language visuals curated per project, name-hash fallback | ✓ VERIFIED | `CURATED_VARIANTS` `:198-205` carries six distinct entries; `projectVisualVariant` `:222-228` (curated primary, `djb2 % 4` fallback); the suite asserts `distinct.size === 6` and names collisions in the failure message (`tests/projects-stack.test.mjs:227-236`) — **prior AP-1 closed** |
| R5 | Curated imperfection: deterministic per-index offsets (±2-4px, ±1°) | ✓ VERIFIED | `IMPERFECTION_X`/`IMPERFECTION_ROTATION` `:51-52`, applied at `:284-289`, forced to 0 under reduced motion; no `Math.random` in any phase file |
| R6 | In-card info on the ACTIVE card only | ✓ VERIFIED | `CardExpandedPanel` returns `null` when `!visible` (`:106-164`), mounted for the front card only (`:523`); carries first-sentence description, ≤4 lexicon technology chips, `link` and conditional `sourceUrl`, both `rel="noopener noreferrer"` (`:148,159`) |
| R7 | Keyboard Prev/Next, Arrow keys and Home/End step the ring buffer; 44px focusable controls | ✓ VERIFIED | `handleKeyDown` `:591-607` (`cycle(1)`, `cycle(-1)`, `goTo(0)`, `goTo(count-1)`), `role="group" aria-label="Projects carousel"` `:637`, `h-[44px] min-w-[44px]` buttons `:665,676` — **prior gap 3 closed** |
| R8 | Mount-gated reduced-motion contract | ✓ VERIFIED | `useReducedMotion()` `:541`, gate `:550` (`mounted ? prefersReduced : false`), mount effect `:568-570`; RM branch of `cardState` pins translate/scale/rotation to 0 (`:264-289`); drag disabled under RM (`:518`); test-pinned |
| R9 | Mobile collapses to a simplified stacked composition | ✓ VERIFIED | `projects-section.tsx:36-38` `md:hidden` → `ProjectsMobileStack`; `ProjectsSwipeStack mode="compact"` hides depth > 1 so exactly active + one peek show (`:416,464,499`); no `overflow-x-*` in any projects file |
| R10 | IDE aesthetic preserved | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Token classes present throughout (`bg-card`, `border-border`, `text-muted-foreground`, `font-mono`, `rounded-lg`) and zero image/gradient assets; but the "IDE look" and the live REV-19 "75-85% visual area" number are visual judgements no static check can make → Human Verification 3 |
| P01-1 | Unit suite loads `projects-card-state.ts` directly under `node --test` and passes | ✓ VERIFIED | static `.ts` import (`tests/projects-stack.test.mjs:25-36`); `node --test` → 22/22 pass |
| P01-2 | `cardState(0,0,6,false)` is foreground geometry | ✓ VERIFIED | depth-0 branch `:257-273`; test `frontIndex 0 geometry` passes |
| P01-3 | Indices > 0 return behind geometry (negative y, scale < 1, opacity < 1, lower z) | ✓ VERIFIED | `LEVELS` `:56-63`; `zIndex = 100 - depth*10` `:290`; test passes |
| P01-4 | Reduced-motion branch pins translate/scale/rotation to 0 | ✓ VERIFIED | `:264-289`; dedicated test passes |
| P02-1 | Desktop stack renders all 6 cards as a swipe-driven ring buffer **at natural height** with geometry from `cardState(cardIndex, frontIndex, count, reducedMotion)` | ✓ VERIFIED | **prior gap 2 closed.** `ProjectsStackStage` sits in the `md:block` div; `explore-panels.tsx:134` `projects: { wrapper: '', shell: '', gate: false }`; the stage is `relative mx-auto w-full ... h-[520px] md:h-[560px]` `:644` — a centered fixed-height block, no sticky wrapper, no 300vh range |
| P02-2 | Foreground DeepIndex card renders name, tagline and terminal visual as real SSR markup | ✓ VERIFIED | `out/explore.html` (rebuilt this run, exit 0) contains all six JSON project names exactly once, the terminal-mock string `query_context`, and 50 inline `<svg>`; the single `<img>` belongs to the About avatar (REV-15) |
| P02-3 | Six curated variants distinct, hash fallback for uncurated names | ✓ VERIFIED | `CURATED_VARIANTS` six entries + `HASH_VARIANTS` fallback; precedence, frozen-map size (6), uniqueness and stable-fallback assertions all pass |
| P02-4 | Keyboard steps the ring buffer by setting the front index; 44px controls; throttled aria-live | ✓ VERIFIED | **prior gap 3 closed.** `setFrontIndex` via `cycle`/`goTo` (`:561-607`); `aria-live="polite"` region `:641` with `ANNOUNCEMENT_THROTTLE_MS` `:63`; no `main.scrollTo` or scroll-band formula exists in the file |
| P02-5 | Reduced motion = opacity/zIndex swaps with no translate/scale/rotation | ✓ VERIFIED | `:518` (drag off), RM branch `:264-289`; the AP-3/AP-6 invariant in `tests/explore-visuals.test.mjs` passes |
| P02-6 | `<md` renders the new simplified stack; the phase-9 compact card grid is retired | ✓ VERIFIED | `projects-mobile-stack.tsx:20-22`; no compact-card-grid markup or old class names remain in `projects-section.tsx` |
| P02-7 | The stack is layout-independent, so no resize remeasurement is required | ✓ VERIFIED | **prior gap 4 closed.** `grep ResizeObserver\|addEventListener` over the stage and the pure module → **0 matches**; geometry is a pure function of index/count and the stage is fixed-height with absolutely positioned cards |
| P02-8 | A single-project data set renders one static active card without carousel chrome | ✓ VERIFIED | `count <= 1` short-circuit `:609-627` renders one card with `CardExpandedPanel visible` and no controls |
| P03-1 | `projects-section.tsx` wires stack + mobile stack, keeps stat tiles and terminal pointer | ✓ VERIFIED | `:26-42` — tiles → md+ stack → mobile stack → `TerminalPointer command="projects --all"` |
| P03-2 | The old editorial-row files and their dedicated test are gone | ✓ VERIFIED | `ls` → all three "No such file or directory" |
| P03-3 | `explore-visuals.test.mjs` allowlists framer-motion only in `projects-stack-stage.tsx` and asserts the old row contract absent | ✓ VERIFIED | allowlist loop + gone-checks in the suite; `grep -rl "from 'framer-motion'" src/` → exactly one file; suite 32/32 pass |
| P03-4 | `npm run typecheck`, `npm run build`, `node --test tests/*.test.mjs` all pass on the final tree | ✓ VERIFIED | reproduced this run: typecheck exit 0; build exit 0 (4 static routes, `Exporting (2/2)`); full suite 269/269 pass, 0 fail, 0 skipped |
| P04-1 | All six rendered cards carry DISTINCT generative visuals | ✓ VERIFIED | **prior AP-1 closed.** `assert.ok(distinct.size === top6.length)` with a collision-naming message (`tests/projects-stack.test.mjs:227-236`) passes; the six map to `terminal-mock`, `contract-analysis`, `glyph`, `report`, `network`, `dashboard` |
| P04-2 | Variant selection stays deterministic, no per-render randomness | ✓ VERIFIED | pure `djb2` + frozen records; repeated-call identity asserted; no `Math.random` in the module |
| P04-3 | The curated per-project table is PRIMARY, its six entries frozen and anatomy-matched; `djb2 % 4` remains the fallback | ✓ VERIFIED | `CURATED_VARIANTS` `:198-205` with the anatomy record in the docstring `:178-197`; precedence asserted against every top-6 name; the uncurated probe asserts `fallback === HASH_VARIANTS[djb2(name) % 4]` |
| P04-4 | Every returnable variant is dispatched by a real renderer (no silent fall-through) | ✓ VERIFIED | `GenerativeVisual` switch cases `:372-383` cover all six; the test reads the stage source and asserts a `case` exists for every reachable variant |
| P05-1 | Reduced motion is mount-gated: the `matchMedia` read is consumed only after a mount-only effect, so the first client render reproduces the server's non-RM geometry | ✓ VERIFIED | `:540-550` and `:568-570`; the gate structure is pinned by the AP-3/AP-6 invariant. The only browser-global mentions in the file are inside a comment (`:542`) — no `window`/`document`/`matchMedia` access in render |
| P05-2 | No stray `'aria-hidden'` class token in the rendered card markup; the real attribute stays on every non-front card | ✓ VERIFIED | **prior AP-6 closed.** `aria-hidden` appears only as JSX props (`:152,163,178,222,256,280,314,346,521,667,678`); the card marks non-front cards by attribute alone at `:521`; test-pinned |
| P05-3 | No hydration mismatch and no first-paint RM flash for a reduced-motion user (the observable outcome of the mount gate) | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | The mismatch half is structurally proven and test-pinned (SSR and the first client render both resolve `reducedMotion === false`, so their output is identical). The "no first-paint flash" half is a timing/perception outcome only a browser can confirm → Human Verification 4 |
| P05-4 | `explore-panels.tsx` documents the delivered placement map: only Experience carries the extended sticky range; Projects renders at natural height; `data-editorial-wrapper` is read by nothing in `src/` | ✓ VERIFIED | docstring `:8-13, 36-40, 119`; placement map `:134`; `grep -rn data-editorial-wrapper src/` → comments plus the attribute emission `:175` only; the Experience hook still reads `MAIN_SELECTOR = '.explore-shell > main'` (count 1) |
| P05-5 | The dual-engine comment in `explore-visuals.test.mjs` names the swipe-driven stack stage as the single framer-motion import site | ✓ VERIFIED | **prior AP-4 closed.** `:620-624` reads "the projects swipe-driven stack stage is the ONE framer-motion import site"; `grep "projects editorial scroll\|the editorial stage is the"` → 0 |
| P05-6 | The variant-selection assertion message names the curated per-project table as primary with the name-hash as fallback | ✓ VERIFIED | `tests/explore-visuals.test.mjs:972` reads "generative visuals selected by the curated per-project table (name-hash fallback for uncurated names)"; the predicate is untouched |
| P06-1 | The live contract chain (ROADMAP goal, REV-18/19/20, SPEC) describes the delivered interaction; no live line demands scroll progress, a sticky Projects stage, `main.scrollTo` stepping or resize remeasurement | ✓ VERIFIED | ROADMAP phase-10 row reads "swipe-driven, loopable ring buffer … cardState(cardIndex, frontIndex) … at natural height"; REV-18/19/20 rewritten; SPEC `:8,16,32,39,49` restated; sweep below |
| P06-2 | Retired wording is preserved but quarantined in place behind a literal `SUPERSEDED:` prefix; only the live bullets and UI-SPEC §4.4's variant column were rewritten | ✓ VERIFIED | reproduced sweep 1 (table below): 0 unquarantined retired-token lines in all nine documents except the recorded REV-17 exception; the retired text survives behind the prefix (e.g. `CONTEXT.md:8,15,21,64,65`) |
| P06-3 | CONTEXT records the D-01/D-03/D-05 amendments with provenance (quick task + `b39b12c`) and re-affirms D-02/D-04/D-06 | ✓ VERIFIED | `CONTEXT.md:100-110` amendment block; provenance and the re-affirmation sentence present |
| P06-4 | The executed plan records no longer assert retired wiring: plan-02's key links carry the mobile delegation instead of the deleted wrapper discovery | ✓ VERIFIED | **prior gap 5 closed.** plan-02 frontmatter key_links = card-state import, mobile delegation, framer-motion; `grep closest(\|querySelector` over the stage → 0 matches; plan-03's stale instruction is quarantined |
| P06-5 | UI-SPEC §4.4 carries the shipped identifiers plus a reconciliation note; RESEARCH's retired guidance carries superseded banners | ✓ VERIFIED | UI-SPEC `:243-256` variant rows carry `glyph`/`report`/`dashboard`/`network` + the reconciliation note; RESEARCH carries 15 `SUPERSEDED:` lines and 5 `frontIndex` mentions |
| P06-6 | AP-2 is recorded as an accepted deviation rather than silently dropped | ✓ VERIFIED | plan-02's artifact description and `CONTEXT.md:110` both record the 20-line delegate as accepted, test-pinned, deliberately not inflated |
| P06-7 | The ship path is decided in writing rather than discovered at ship time | ✓ VERIFIED | `CONTEXT.md` Sweep 7 (`:167-180`) records `skip_gates: ["tdd_audit"]`, the reproduced gate failure on plan-01's landed long-form commit scope, and the honest framing that this is a recorded skip, not a satisfied gate — it overrides no phase truth |

**Score: 41/43** — 41 verified, 0 failed, 2 present-behaviour-unverified. Every previously failed truth is now verifiable against the amended contract and passes.

## Deferred Items

| Item (from CONTEXT `<deferred>`) | Status vs later phases |
|---|---|
| Real screenshots replacing the generative visuals (user supplies assets later) | Still deferred — no later phase owns it. Phase 11 delivered the Credentials panel only and did not touch the Projects visuals |
| Terminal/command-driven About-skill idea | Still deferred — future direction, unowned by any milestone phase |
| Cards for the other 8 projects (CLI-reachable) | Still deferred — the top-6 slice remains the delivered contract |

No deferred item was consumed by a later phase; phase 11 (credentials-panel-revision) appended a panel beside the stack and did not re-open the Projects mechanism.

## Required Artifacts

| Path | Exists | Substantive | Wired | Notes |
|---|---|---|---|---|
| `src/components/explore/projects-card-state.ts` | ✓ | ✓ 344 lines (plan 01 min 80, plan 04 min 280); exports `CardState`, `cardState`, `firstSentence`, `projectYear`, `projectTechnologies`, `projectVisualVariant`, `djb2`, `swipeAccepts`, `SWIPE_THRESHOLD`, `SWIPE_VELOCITY_THRESHOLD` | ✓ static-imported by the stage and by the unit suite | zero runtime imports (asserted by the suite) |
| `tests/projects-stack.test.mjs` | ✓ | ✓ 444 lines (min 120/300); 22 tests, all passing | ✓ run by `node --test` | includes the six-distinct, curated-precedence, hash-fallback and dispatch-coverage assertions |
| `src/components/explore/sections/projects-stack-stage.tsx` | ✓ | ✓ 689 lines (min 220/640); exports `ProjectsStackStage` and `ProjectsSwipeStack` | ✓ rendered by `ProjectsSection` (md+) and by the mobile wrapper | the single `framer-motion` import site under `src/` |
| `src/components/explore/sections/projects-mobile-stack.tsx` | ✓ | ⚠️ 20 lines vs `min_lines: 130` — **accepted deviation AP-2** (override 1), not a stub | ✓ rendered in the `md:hidden` block; delegates to the shared swipe stack | the compact composition (2-card visibility, `h-[420px]`, `max-w-[320px]`) lives in the shared stack; test-pinned |
| `src/components/explore/sections/projects-section.tsx` | ✓ | ✓ 47 lines (min 40); exports `ProjectsSection` | ✓ stack + mobile stack + tiles + pointer | compact card grid removed |
| `tests/explore-visuals.test.mjs` | ✓ | ✓ 1026 lines (min 50/950); 32 tests passing | ✓ run by `node --test` | carries the EXPLORE-10 invariant, the AP-3/AP-6 invariant and the framer allowlist |
| `src/components/explore/explore-panels.tsx` | ✓ | ✓ 182 lines (min 120); exports `ExplorePanels` | ✓ renders all five panels | docstring now matches the delivered placement map |
| `.planning/ROADMAP.md` (plan 06) | ✓ | ✓ 33 lines (min 30) | ✓ phase-10 row cites REV-18…20 | delivered wording |
| `.planning/REQUIREMENTS.md` (plan 06) | ✓ | ✓ 35 lines (min 30) | ✓ REV-18/19/20 rewritten, same IDs, same checked state | REV-17 untouched |
| `…-SPEC.md` (plan 06) | ✓ | ✓ 79 lines (min 70) | ✓ requirements/boundaries/constraints/acceptance restated | amendment provenance block at `:8` |
| `…-UI-SPEC.md` (plan 06) | ✓ | ✓ 412 lines (min 300) | ✓ §4.4 variant column matches the shipped module | 22 quarantined lines |
| `…-CONTEXT.md` (plan 06) | ✓ | ✓ 187 lines (min 110) | ✓ amendment + contract sweep | 24 quarantined lines |
| `…-RESEARCH.md` (plan 06) | ✓ | ⚠️ 179 lines vs `min_lines: 200` — **advisory deviation** (override 2); 23,422 bytes, superseded banners and 15 quarantined lines present, so the artifact's purpose (not steering a fresh executor back to scroll) is met | ✓ | new finding AP-8, not a stub |
| `…-01-PLAN.md` | ✓ | ✓ 122 lines (min 100) | ✓ assumption_delta names the ring-buffer contract | 2 quarantined lines |
| `…-02-PLAN.md` | ✓ | ✓ 182 lines (min 120) | ✓ key links and truths match the delivered wiring | 24 quarantined lines |
| `…-03-PLAN.md` | ✓ | ✓ 134 lines (min 110) | ✓ stale instruction quarantined and replaced | 3 quarantined lines |

## Key Link Verification

| From | To | Via | Status | Evidence |
|---|---|---|---|---|
| `tests/projects-stack.test.mjs` | `projects-card-state.ts` | static import with explicit `.ts` extension | ✓ WIRED | `:25-36`; the suite executes the real module (22/22) |
| `projects-card-state.ts` | `portfolio-main-data.json` shape | runtime-free consumer contract (type-only) | ✓ WIRED | zero import statements in the module (asserted); consumers pass `PortfolioData['projects'][number]` |
| `projects-stack-stage.tsx` | `projects-card-state.ts` | named imports (`cardState`, `firstSentence`, `projectTechnologies`, `projectVisualVariant`, `swipeAccepts`, …) | ✓ WIRED | `:32-44`; used at `:88,118-119,411,488,521` |
| **replaced**: `projects-mobile-stack.tsx` → shared stack | (the retired `closest('[data-editorial-wrapper]')` scroll-target discovery) | the delegation link replaces the dead key link | ✓ WIRED | **prior gap 5 closed.** `grep closest(\|querySelector` in the stage → 0; `projects-mobile-stack.tsx:20-22` returns `ProjectsSwipeStack mode="compact"`; plan-02's key_link now names this contract |
| `projects-stack-stage.tsx` | `framer-motion` | the only sanctioned JS motion engine in the projects composition | ✓ WIRED | `:24-44`; allowlist test passes; exactly one `src/` file imports it |
| `projects-section.tsx` | `projects-stack-stage.tsx` / `projects-mobile-stack.tsx` | import + render per viewport | ✓ WIRED | `:13-14, 33-38` |
| `tests/projects-stack.test.mjs` | `projects-stack-stage.tsx` (source) | reads the stage source and asserts a `case` for every returnable variant | ✓ WIRED | dispatch-coverage test passes |
| `.planning/ROADMAP.md` | `.planning/REQUIREMENTS.md` | the phase-10 row's REV-18…20 ids resolve to the rewritten entries | ✓ WIRED | ROADMAP phase row + REQUIREMENTS `:32-34` |
| `.planning/REQUIREMENTS.md` | `…-SPEC.md` | same ids, same delivered wording | ✓ WIRED | both carry the `frontIndex`/ring-buffer formulation (REQUIREMENTS 1 hit, SPEC 9) |
| `…-02-PLAN.md` | `projects-card-state.ts` | the plan's key links name the pure module the delivered stage consumes | ✓ WIRED | frontmatter key_link 1 |
| `…-UI-SPEC.md` §4.4 | `projects-card-state.ts` | §4.4 carries the identifiers the shipped module returns | ✓ WIRED | `glyph`/`report`/`dashboard`/`network` at `:249-256`, identical to `CURATED_VARIANTS` |
| `explore-panels.tsx` | `use-timeline-progress.ts` | the Experience placement is the ONE remaining extended sticky range, read from `.explore-shell > main` | ✓ WIRED | `MAIN_SELECTOR = '.explore-shell > main'` count 1; the Experience timeline invariant test passes |

## Data-Flow Trace

Trace verified end to end (level 4, not "wired"):

`src/data/portfolio-main-data.json` → `src/app/explore/page.tsx` (static import) → `ExplorePanels` adapter `projects: ({ data }) => <ProjectsSection projects={data.projects} />` (`explore-panels.tsx:106`) → `ProjectsSection` `projects.slice(0, 6)` (`projects-section.tsx:20`) → `ProjectsStackStage` / `ProjectsMobileStack` → `ProjectsSwipeStack` → `SwipeCard` → `GenerativeVisual(project.name)` / `CardHeader` / `CardExpandedPanel`.

- `out/explore.html` (rebuilt in this verification run, exit 0) contains all six JSON project names one occurrence each — `DeepIndex`, `Clarif-AI`, `SDK4ED-TD`, `ServicedMetricsCalculator`, `Avoid Traffic Extended`, `Uom Track` — plus the DeepIndex terminal-mock string `query_context`, as real server-rendered markup.
- `firstSentence`, `projectYear` and `projectTechnologies` consume the project's own `description`/`date` and are asserted against the real JSON (no copied literals).
- No hardcoded portfolio content in the stage or section: the only project-name strings in `projects-stack-stage.tsx` are two comments labelling the flagship visuals (`:171`, `:215`); selection runs through `projectVisualVariant(project.name)`.
- The single `<img>` in the export belongs to the About avatar (REV-15); the Projects cards fetch zero image assets.

## Behavioral Spot-Checks

One named check per behaviour-dependent group; the full suite only where a plan's acceptance criterion demands it.

| # | Check | Command | Result |
|---|---|---|---|
| 1 | Pure geometry + variant contract (plans 01, 04) | `node --test tests/projects-stack.test.mjs` | **22/22 pass**, exit 0 — includes six-distinct variants, curated precedence, hash fallback, dispatch coverage, `cardState` loop invariant, reversibility, RM branch, totality, `swipeAccepts` thresholds |
| 2 | Phase integration pins (plans 02, 03, 05) | `node --test tests/explore-visuals.test.mjs` | **32/32 pass**, exit 0 — includes the EXPLORE-10 swipe/centered/loopable/shadow invariant and the new AP-3/AP-6 mount-gate + attribute-only invariant |
| 3 | Full gate claimed by plans 03/04/05/06 | `node --test tests/*.test.mjs` | **269/269 pass**, 0 fail, 0 skipped (prior verification: 267 — the two new assertions landed) |
| 4 | Type gate | `npm run typecheck` | exit 0, no output |
| 5 | Build + static export (also the SSR evidence source) | `npm run build` | exit 0; `/`, `/explore`, `/resume` exported static, `Exporting (2/2)`; no dev server was serving this worktree at build time |

Probe execution: not applicable (presentation-layer phase, no migration/tooling step).

**Document sweep reproduced** (plan 06's claims, re-measured independently against the final tree). Retired-token set `carouselProgress|carouselPosition|main\.scrollTo|ResizeObserver|useScroll|300vh|sticky`, excluding lines whose first content token is `SUPERSEDED:`:

| Document | Unquarantined hits | `SUPERSEDED:` lines | `frontIndex`/ring-buffer hits |
|---|---:|---:|---:|
| `ROADMAP.md` | 0 | 0 | 1 |
| `REQUIREMENTS.md` | **1 — line 31 (REV-17, see AP-9)** | 0 | 1 |
| `SPEC.md` | 0 | 1 | 9 |
| `UI-SPEC.md` | 0 | 22 | 7 |
| `CONTEXT.md` | 0 | 24 | 8 |
| `RESEARCH.md` | 0 | 15 | 5 |
| `01-PLAN.md` | 0 | 2 | 2 |
| `02-PLAN.md` | 0 | 24 | 6 |
| `03-PLAN.md` | 0 | 3 | 3 |

Also reproduced: `grep -rn "useScroll|carouselProgress" src/components/explore/` excluding comments → **0 live matches** (one docstring at `projects-card-state.ts:12`); `MAIN_SELECTOR = '.explore-shell > main'` count **1** (Experience untouched); `framer-motion` import sites under `src/` = **1**.

## Requirements Coverage

| REQ | Status | Basis |
|---|---|---|
| REV-18 | **VERIFIED** | Editorial rows replaced by the 6-card stack (R1, P03-2); geometry from the pure unit-tested `cardState(cardIndex, frontIndex, count, reducedMotion)` with the swipe helpers (R3, P01-1…4); swipe-driven ring buffer at natural height (P02-1); draggable foreground card with Prev/Next, Arrow and Home/End (R7, P02-4); 44px focusable controls (R7); a full six-step cycle returns the initial arrangement (loop-invariant test). All four prior gaps closed by the amended contract chain (P06-1/2/4) |
| REV-19 | **VERIFIED** | Rounded corners, compact header (name + tagline, first-sentence ≤120), monochrome token-only visuals with `aria-hidden` and zero image assets, six DISTINCT curated variants with the hash fallback (R4, P04-1…4), deterministic ±2-4px/±1° imperfection (R5), active-card expansion carrying description + technologies + links with `rel="noopener noreferrer"` (R6). Residual: the live "75-85% visual area" figure is unmeasured → Human Verification 3 |
| REV-20 | **VERIFIED** | Keyboard stepping sets the front index with an accessible non-scroll alternative (R7, P02-4); reduced motion = opacity/zIndex swaps, mount-gated so the first client render matches SSR, drag disabled (R8, P02-5, P05-1); no listeners added, so nothing leaks (grep: 0 `addEventListener`); mobile compact stack with one peek and no horizontal scroll (R9, P02-6); all content from `portfolio-main-data.json` (Data-Flow Trace); dual-engine ban holds (0 rAF/gsap/lottie/`.animate(` in the projects files, one framer-motion site). Residual: the browser-observable half of the hydration/flash claim → Human Verification 4 |

## Anti-Patterns Found

No debt markers: zero `TBD`/`FIXME`/`XXX`/`TODO` in any file this phase created or modified. No skipped tests, no stubbed assertions, no `describe.skip`/`todo(`. Advisory findings only:

| ID | Severity | Finding |
|---|---|---|
| AP-2 | WARNING (accepted) | `projects-mobile-stack.tsx` is 20 lines against plan-02's `min_lines: 130`. The capability is delivered by delegation to `ProjectsSwipeStack mode="compact"` and test-pinned; recorded as an accepted deviation in the plan, CONTEXT and here (override 1) |
| AP-8 | INFO | `RESEARCH.md` is 179 lines against plan-06's `min_lines: 200`. 23,422 bytes of substantive content with the required superseded banners and quarantine are present and sweep-clean, so the artifact's purpose is met; the plan's threshold over-estimated the line count of the long-table format (override 2) |
| AP-9 | INFO | The single unquarantined retired-token hit in the sweep is `REQUIREMENTS.md:31` — REV-17, the phase-9 requirement, which keeps its own-phase "sticky ~100vh stage" wording and describes work phase 9 already shipped. Recorded as the documented exception (plan 06 swept REQUIREMENTS with a narrower token set for this reason); it makes no claim about phase 10 |
| AP-10 | INFO | Residual wording tension in the live REV-18/SPEC acceptance: "no discrete state swaps as the primary mechanism". The depth input is an integer `frontIndex`, so continuity comes from the framer-motion fly-off/`controls.start` movement between arrangements rather than from a continuous progress variable. This is the mechanism the amendment deliberately adopted and the primary path is physical movement, but the phrase now reads more loosely than it did under the retired scroll contract |
| AP-11 | INFO | `CardState.activeAmount` is still produced by the pure module but consumed by nothing in the stage (only the module and its tests mention it). It remains part of the pinned UI-SPEC §3 contract; carried over unchanged from the prior report |
| AP-4 | RESOLVED | Prior stale comment ("the editorial stage is the ONE import site") — `tests/explore-visuals.test.mjs:620-624` now names the swipe-driven stack stage |
| AP-5 | RESOLVED | Prior stale docstring — `explore-panels.tsx` now documents the Experience-only sticky range and Projects at natural height |
| AP-6 | RESOLVED | Prior no-op `'aria-hidden'` class token — the card now marks non-front cards by attribute only (`:521`), test-pinned |

## Human Verification Required

These are behavioural/visual outcomes that cannot be established from source or static export. They are why the status is `human_needed` rather than `passed` — nothing here is a defect, and no truth is FAILED.

1. **Swipe/drag feel** — drag or flick the foreground card; confirm fly-off, one-level promotion, loop-to-back, sub-threshold spring-back, and that six swipes restore the original arrangement and counter. Gesture feel and spring restraint are interactive only.
2. **Shadow bloom in both themes** — confirm `--panel-shadow-hover` renders onto the cards beneath in dark and light, unclipped through the stage → panel body → shell chain.
3. **Visual-first proportion + 375px invariant** — measure the ~75-85% visual area at md+; check the compact stack at 375px (no horizontal scroll, active card dominant, one peek, legible).
4. **Reduced motion in a real browser** — OS setting ON: instant opacity/z-index swaps, no translate/scale/rotation, no hydration warning in the console, no perceptible first-paint swap. (The structural parity is verified; this confirms the observable.)
5. **Keyboard + screen-reader pass** — announcements read `Project NN of 06: <name>`, focus stays on the controls, no focus lands on a hidden card's link.

## Gaps Summary

**No gaps.** All five prior gaps are closed:

1. *Continuous `f(cardIndex, carouselProgress)` scroll geometry* → the contract chain now defines `cardState(cardIndex, frontIndex, count, reducedMotion)` as the geometry, and the delivered module implements exactly that (R3, P02-1). Verified against code, not against the record.
2. *The sticky md+ scroll stage* → replaced by the natural-height centered stage; the roadmap goal, REV-18 and the SPEC acceptance now say so, and `explore-panels.tsx:134` proves the sticky range is gone for Projects while Experience keeps its own (P05-4).
3. *Keyboard stepping by `main.scrollTo` to a scroll band* → replaced by direct front-index stepping (R7, P02-4); zero `main.scrollTo` in the projects files, and the live requirement now describes state-driven stepping.
4. *Resize remeasurement* → obsolete by construction and now a positive assertion in the amended contract: the stack is layout-independent with no `ResizeObserver`/`addEventListener` anywhere in the phase files (P02-7).
5. *Key link `projects-stack-stage.tsx → closest('[data-editorial-wrapper]')`* → retired; plan-02's key link is replaced by the real mobile-stack delegation, and no `src/` file reads the attribute (P06-4). The attribute survives as an inert, test-pinned hook documented as such.

Both code-level findings are also closed: the six-variant collision (prior AP-1 → five distinct visuals for six cards) is fixed by the curated table with an explicit six-distinct assertion, and the reduced-motion hydration risk (prior AP-3) plus the no-op class token (prior AP-6) are fixed by the mount gate and attribute-only marking, both test-pinned.

The phase returns `human_needed` on the five browser-observable items above — dominated by the interactive motion feel, the shadow depth, the unmeasured 75-85% visual-area figure, and the end-to-end reduced-motion/console behaviour. Two plan-declared thresholds are waived and recorded (overrides): AP-2 (the delegated mobile stack, 20 vs 130 lines) and AP-8 (`RESEARCH.md`, 179 vs 200 lines) — neither is a stub, and both the capability and the content are delivered and verified.

**Green-gate note.** The full gate (typecheck + build + 269/269 suite + static export) was run last against this tree at `d202546`; the only artefact written afterwards is this report, which changes no code, config or plan document. The recorded `--skip-gates tdd_audit` decision (P06-7) is a ship-time gate decision, not a verified property of this phase — this report makes no claim that the phase satisfies `tdd_audit`.
