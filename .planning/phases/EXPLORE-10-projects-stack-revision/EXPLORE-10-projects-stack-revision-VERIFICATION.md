---
phase: 10-projects-stack-revision
verified: 2026-09-30T08:45:31+03:00
status: gaps_found
score: 46/47 must-haves verified
behavior_unverified: 0
overrides_applied: 3
verification_tree: "HEAD 501da05 on branch phase-11 — src/ and tests/ byte-identical to d202546, the tree the prior verification and the 2026-09-25 batch human approval covered (`git diff --name-only d202546..HEAD -- src tests` → empty; `git status --porcelain --untracked-files=no` → clean). Every number below was produced by a command run in this session."
human_verification_status: "discharged — recorded user batch approval for phases 7-11 (`c97b0e8`), appended to this phase's own verification record as `status_human: approved`"
gaps:
  - truth: "REV-18 / user directive req 3 + req 7 — the swiped foreground card LOOPS TO THE BACK of the stack (directive req 3: `depth = last level, zIndex lowest, offsets reset`): Next = front card to back with a left fly-off, Previous = bring the back card forward with a right fly-off."
    status: failed
    reason: "Measured from the pure module: the ring rotation is inverted relative to the fly-off side, so the loop-to-the-back clause holds in ONE direction only. `projects-stack-stage.tsx:591-607` maps the Next button / ArrowDown / ArrowRight to `cycle(-1)` and the Prev button / ArrowUp / ArrowLeft to `cycle(1)`; `performExit` (:439-460) and `handleSwipe` (:573-576) derive the new front index from that same sign (`newFront = (frontIndex + direction + count) % count`). With the delivered depth formula `depth = (i - front) mod 6` (projects-card-state.ts:298), the +1 step puts the swiped card at depth 5 = the back, and the -1 step puts it at depth 1 = the peek. Concretely, imported and evaluated against the real module: `cardState(0, 1, 6, false)` → translateY -190, opacity 0.30, zIndex 50 (depth 5, the back); `cardState(0, 5, 6, false)` → translateY -38, opacity 0.95, zIndex 90 (depth 1, the peek). So on the Next / left-swipe path the card the user just swiped returns as the visible peek card, while the card that was at the very back (previously `visibility: hidden`, opacity 0.30 in compact mode) is promoted to the front — the exact mirror of directive req 7. The stage's own comments assert the intended mapping and contradict the code they sit above: `:594` says 'Previous: right-fly-off, back card forward' and `:597` says 'Next: left-fly-off, front card to back', while the code makes +1 (Prev) the front-to-back step and -1 (Next) the back-to-front step. Two further measured consequences of the same inversion: the control labelled `aria-label=\"Next project\"` DECREMENTS the `NN / 06` counter and the aria-live announcement (01 -> 06, i.e. 'Project 06 of 06: Uom Track'), and the `aria-label=\"Previous project\"` control increments it (01 -> 02). The recorded batch approval (`status_human: approved`) covers the felt swipe/shadow interaction; it does not change this geometry, which is checkable without a browser."
    artifacts:
      - path: "src/components/explore/sections/projects-stack-stage.tsx"
        issue: "`cycle`/`handleKeyDown`/`performExit` tie the fly-off side and the ring-rotation sign together, so the Next/left path lands the swiped card at depth 1 instead of depth 5; the comments at :594 and :597 describe the opposite of the delivered mapping."
      - path: "src/components/explore/projects-card-state.ts"
        issue: "The depth formula `(i - front) mod count` plus `LEVELS` makes +1 the front-to-back rotation; nothing in the module enforces 'the departing card lands at the last level' independently of the step sign."
    missing:
      - "Decouple the fly-off side from the ring-rotation sign (or invert the rotation delta) so the swiped card lands at `depth = count - 1` (last level, lowest zIndex, offsets reset) for BOTH directions, with Prev/Next and the counter/aria-live reading forward again."
      - "Or amend the live contract text (REQUIREMENTS REV-18 'loops to the back', the CONTEXT directive amendment) to the delivered mirrored-rotation contract, stating explicitly that one direction promotes the ring tail and returns the swiped card as the peek, and restate the counter semantics in the same edit."
---

# Phase 10: projects-stack-revision Verification Report

**Mode:** re-verification. The prior report for this phase carried `gaps_found` (21/26), which was closed by plans 04-06; the run after that carried `human_needed` (41/43, no `gaps:` block) and its five human items were then batch-approved by the user (`c97b0e8`, recorded on this phase's own file as `status_human: approved`). This run re-derives every must-have from the code and the gate, discharges the perceptible items by that recorded approval, and reports what the measurements actually show.

**No SUMMARY.md claim was trusted.** Every line reference, count, geometry value and test result below was produced by reading the file or running the command in this session, at HEAD `501da05`, whose `src/` and `tests/` are byte-identical to the tree the prior verification measured (`git diff --name-only d202546..HEAD -- src tests` → empty).

**What changed vs the prior pass:** nothing in code. The only deltas since `d202546` are `.planning/` documents (five VERIFICATION.md files and STATE.md). The prior pass's 2 behaviour-unverified truths and 5 human items are discharged by the recorded user approval; the residual `min_lines` deviations are recorded as overrides. One new gap is raised (see frontmatter) from a measurement the prior pass folded into a human item rather than testing: the loop-to-the-back choreography is direction-dependent.

## Goal Achievement → Observable Truths

Roadmap truths (the phase-10 goal row of `.planning/ROADMAP.md` + its REV-18…20 requirements, loaded as `roadmap_truths`) and every plan's frontmatter `must_haves.truths` (33 plan truths across plans 01-06).

| # | Truth | Status | Evidence |
|---|---|---|---|
| R1 | The Projects panel's editorial scroll is replaced by a curated stacked-card carousel over the top-6 projects | ✓ VERIFIED | `projects-row-state.ts`, `projects-editorial-stage.tsx`, `tests/projects-editorial.test.mjs` all `No such file or directory`; `projects-section.tsx:26-43` renders tiles → md+ stack → mobile stack → terminal pointer; no `ProjectsEditorialStage` string remains in `src/` |
| R2 | Six visual-first cards physically stacked in depth | ✓ VERIFIED | `projects-section.tsx:26` `projects.slice(0, 6)`; `projects-stack-stage.tsx:645-657` maps all six; each card is `position: absolute; inset: 0` (`:509-515`) with `zIndex` from `cardState`; `CARD_SHELL` carries `aspect-[4/3] rounded-lg border border-border bg-card` (`:52-53`) |
| R3 | Card appearance = the pure `cardState(cardIndex, frontIndex)` from `projects-card-state.ts` | ✓ VERIFIED | `projects-card-state.ts:275-280` signature `cardState(cardIndex, frontIndex, count, reducedMotion)`; module has **zero** import/require statements (`grep -nE "^(import\|require)"` → none); consumed at `projects-stack-stage.tsx:411-425, 448, 468, 493` |
| R4 | Geometry derived from depth off the foreground card, continuous and reversible in both directions (a full six-step cycle returns the initial arrangement) | ✓ VERIFIED | depth `= ((i - front) % count + count) % count` (`:298`); `LEVELS` table `:56-63` (y −38/level, scale −0.04, opacity keyframes); own probe: a forward six-step cycle and a reverse six-step cycle **both** restore the depth-0 arrangement (`forward +1 cycle returns initial: true`, `reverse -1 cycle returns initial: true`); suite pins the loop invariant (`tests/projects-stack.test.mjs:342-355`) |
| R5 | The foreground card is draggable | ✓ VERIFIED | `:518` `drag={isFront && !reducedMotion ? 'x' : false}`; `:519-520` drag start/end handlers; `:486-502` `handleDragEnd` → `swipeAccepts(info.offset.x, info.velocity.x)`; thresholds pinned (`SWIPE_THRESHOLD 100`, `SWIPE_VELOCITY_THRESHOLD 500`, `:66-67`) and unit-tested (8 threshold assertions) |
| R6 | **The swiped card loops to the back of the stack (depth = last level, zIndex lowest) — REV-18 + directive req 3/req 7** | ✗ **FAILED** | Only the +1 step loops to the back. Measured from the real module: `cardState(0, 1, 6, false)` → y −190 / scale 0.80 / opacity 0.30 / zIndex 50 (depth 5 = back) vs `cardState(0, 5, 6, false)` → y −38 / opacity 0.95 / zIndex 90 (depth 1 = peek). `handleKeyDown` (`:591-607`) sends Next/ArrowDown/ArrowRight to `cycle(-1)` (the depth-1 path) while its own comment at `:597` claims 'front card to back'. See the frontmatter gap and Gaps Summary |
| R7 | Keyboard Prev/Next, Arrow keys and Home/End step the ring buffer; 44px focusable controls | ✓ VERIFIED | `:591-607` `cycle(1)` / `cycle(-1)` / `goTo(0)` / `goTo(count-1)` with `preventDefault`; `role="group" aria-label="Projects carousel"` (`:635-639`, `:612-615` single-project branch); buttons `h-[44px] min-w-[44px]` (`:665`, `:676`) with `aria-label="Previous project"` / `"Next project"`; the group's `onKeyDown` fires while focus is on the buttons (children of the group) |
| R8 | The panel renders at natural height with the stack centered in its stage | ✓ VERIFIED | `explore-panels.tsx:134` `projects: { wrapper: '', shell: '', gate: false }` — no wrapper element and no sticky/300vh class is emitted for Projects; the stage `:636` `flex h-full flex-col justify-center`, `:644` `relative mx-auto w-full max-w-[540px] h-[520px] md:h-[560px]`; `explore-panels.tsx:129-131` keeps the extended sticky range for Experience only; export retains two `300vh` occurrences, both the Experience placement |
| R9 | Six distinct deterministic generative IDE-language visuals, curated per project with a name-hash fallback for uncurated names | ✓ VERIFIED | `CURATED_VARIANTS` six frozen entries (`projects-card-state.ts:198-205`, data order, anatomy-documented `:165-197`); `HASH_VARIANTS` + `djb2 % 4` fallback (`:208, 222-228`); `GenerativeVisual` dispatches all six (`projects-stack-stage.tsx:369-387`); suite asserts `distinct.size === 6` with a collision-naming message and curated-precedence + hash-fallback + dispatch-coverage (22/22 green) |
| R10 | Curated imperfection: deterministic per-index offsets (±2-4px, ±1°), never random | ✓ VERIFIED | `IMPERFECTION_X = [-4,-2,2,4,3,-3]` / `IMPERFECTION_ROTATION = [-1,-0.5,0.5,1,0.75,-0.75]` (`:51-52`) applied `:325-330`, forced to 0 under reduced motion; no `Math.random` anywhere in the phase files; the ±1° rotation values are visible in the frontIndex-3 geometry assertions (`tests/projects-stack.test.mjs:326-338`) |
| R11 | In-card info on the ACTIVE card only | ✓ VERIFIED | `CardExpandedPanel` returns `null` when `!visible` (`:110-120`) and is mounted with `visible={isFront}` (`:526`); it renders the first-sentence description, up to 4 lexicon-derived technology chips and the `link` + conditional `sourceUrl`, both `rel="noopener noreferrer"` (`:143-166`); inactive cards expose no links |
| R12 | Mount-gated reduced motion (server render and first client render agree) | ✓ VERIFIED | `:540-550` `mounted ? prefersReduced : false` + `:569-571` mount-only effect; RM branch pins translate/scale/rotation (`projects-card-state.ts:305-330`); `drag` off under RM (`:518`); `cycle` bypasses the fly-off under RM (`:578-585`); test-pinned (`tests/explore-visuals.test.mjs:988-1010`) |
| R13 | Mobile collapses to a simplified stacked composition | ✓ VERIFIED | `projects-section.tsx:41-43` `md:hidden` → `ProjectsMobileStack`; `projects-mobile-stack.tsx:19` delegates to `ProjectsSwipeStack mode="compact"`; `:421` `compactHidden = mode === 'compact' && depth > 1` → `:433, 469, 499, 504` hide every card deeper than 1, so exactly the active card + one peek render (`max-w-[320px] h-[420px]`); `grep overflow-x` in the four projects files → 0 |
| R14 | framer-motion confined to the projects composition (IDE aesthetic preserved) | ✓ VERIFIED (structural) | `grep -rl "from 'framer-motion'" src/` → exactly `src/components/explore/sections/projects-stack-stage.tsx`; no `requestAnimationFrame`/`gsap`/`lottie`/`.animate(` in any of the four phase files; `use-timeline-progress.ts` keeps its hand-rolled rAF and `MAIN_SELECTOR = '.explore-shell > main'` (count 1). The perceptible half of "IDE aesthetic preserved" and the live "75-85% visual area" figure were never measured in a browser; they are discharged by the recorded user approval, not by this run |
| P01-1 | The unit suite loads `projects-card-state.ts` directly under `node --test` and passes | ✓ VERIFIED | static import with the explicit `.ts` extension (`tests/projects-stack.test.mjs:30-40`); `node --test tests/projects-stack.test.mjs` → **22/22 pass**, 0 fail, 0 skipped |
| P01-2 | `cardState(0,0,6,false)` is foreground geometry | ✓ VERIFIED | depth-0 branch `:310-316`; asserted y 0 / scale 1 / opacity 1 / zIndex 100 / activeAmount 1 / visible true (`tests/projects-stack.test.mjs:318-322`) — green |
| P01-3 | Indices > 0 return behind geometry (negative y, scale < 1, opacity < 1, lower z) | ✓ VERIFIED | `LEVELS` + `zIndex = 100 - depth * 10` (`:331`); the frontIndex-3 table asserts all five behind cards (`:326-338`) — green |
| P01-4 | Reduced-motion branch pins translate/scale/rotation to 0 | ✓ VERIFIED | `:305-330`; dedicated sweep over all 36 index/front pairs (`:385-397`) — green |
| P02-1 | Desktop stack renders all 6 cards as a swipe-driven ring buffer **at natural height** with geometry from `cardState(cardIndex, frontIndex, count, reducedMotion)` | ✓ VERIFIED | `ProjectsStackStage` (`:687-689`) inside the `md:block` div (`projects-section.tsx:37-39`); placement map carries no wrapper/shell for Projects; stage is a centered fixed-height block (`:636, 644`) — no sticky element, no 300vh range, no scroll-derived progress in the file |
| P02-2 | The foreground DeepIndex card renders name, tagline and the terminal visual as real SSR markup | ✓ VERIFIED | rebuilt export (this run, exit 0): all six JSON project names present twice in HTML (md+ stack and mobile stack) plus once in the RSC flight payload; `query_context` twice; **50** inline `<svg>`; **1** `<img>`, and it is the About avatar (`src="https://tinyurl.com/5cfm72u7" alt="Portrait of Anastasios Tilsizoglou"`) — the Projects cards fetch zero image assets |
| P02-3 | Six curated variants distinct; hash fallback for uncurated names | ✓ VERIFIED | six-entry `CURATED_VARIANTS` + `HASH_VARIANTS` fallback; precedence/`distinct.size === 6`/stable-fallback assertions green |
| P02-4 | Keyboard steps the ring buffer by setting the front index, with 44px controls and the throttled aria-live | ✓ VERIFIED | `setFrontIndex` via `cycle`/`goTo` (`:573-607`); `aria-live="polite" aria-atomic` sr-only region (`:641-643`) with `ANNOUNCEMENT_THROTTLE_MS = 500` (`:63`) announcing `Project NN of 06: <name>` (`:561-565`); no `main.scrollTo` and no scroll-band formula in the file (grep → 0) |
| P02-5 | Reduced motion = opacity/zIndex swaps with no translate/scale/rotation | ✓ VERIFIED | `cycle` → direct `handleSwipe` under RM (`:578-582`); RM target values are the pinned zeros; `drag` false; AP-3/AP-6 invariant green |
| P02-6 | `<md` renders the new simplified stack; the phase-9 compact card grid is retired | ✓ VERIFIED | `projects-section.tsx:41-43`; no compact-grid markup or old class names remain |
| P02-7 | The stack is layout-independent, so no resize remeasurement is required | ✓ VERIFIED | `grep -nE "ResizeObserver\|addEventListener\|closest\(\|querySelector"` over the four phase files → **0 matches**; geometry is a pure function of index/count and the cards are absolutely positioned in a fixed-height stage |
| P02-8 | A single-project data set renders one static active card without carousel chrome | ✓ VERIFIED | `count <= 1` branch `:609-629` renders one card with `CardExpandedPanel visible` and no controls/live region; `cardState(0,0,1,false)` pinned by the count-edge-case test (`tests/projects-stack.test.mjs:416-422`) — green. The branch itself is a render path with no DOM tier in this repo; source-determined |
| P03-1 | `projects-section.tsx` wires stack + mobile stack, keeping stat tiles and the terminal pointer | ✓ VERIFIED | `:14-19, 30-44` — tiles → md+ stack → mobile stack → `TerminalPointer command="projects --all"` |
| P03-2 | The old editorial-row files and their dedicated test are gone | ✓ VERIFIED | `ls` on all three paths → `No such file or directory` |
| P03-3 | `explore-visuals.test.mjs` allowlists framer-motion only in `projects-stack-stage.tsx` and asserts the old row contract absent | ✓ VERIFIED | allowlist loop (`tests/explore-visuals.test.mjs:634-635`) + the EXPLORE-10 invariant's gone-checks and `!useScroll` / `!main.scrollTo` assertions (`:936-986`); `node --test tests/explore-visuals.test.mjs` → **32/32 pass** |
| P03-4 | `npm run typecheck`, `npm run build` and `node --test tests/*.test.mjs` all pass on the final tree | ✓ VERIFIED | reproduced this run at HEAD: typecheck exit 0 (no output); build exit 0 (routes `/`, `/_not-found`, `/explore`, `/resume`; `Exporting (2/2)`); full suite **269/269 pass**, 0 fail, 0 skipped |
| P04-1 | All six rendered cards carry DISTINCT generative visuals | ✓ VERIFIED | `CURATED_VARIANTS` maps the six real top-6 names to `terminal-mock`, `contract-analysis`, `glyph`, `report`, `network`, `dashboard`; the suite asserts uniqueness against the real JSON slice with a collision-naming message (`tests/projects-stack.test.mjs:227-236`) — green |
| P04-2 | Variant selection stays deterministic, no per-render randomness | ✓ VERIFIED | pure `djb2` + frozen records + a repeated-call identity assertion; no `Math.random` in the module |
| P04-3 | The curated per-project table is PRIMARY and frozen; `djb2 % 4` remains the fallback | ✓ VERIFIED | `:198-205` with the anatomy record in the docstring (`:165-197`); precedence asserted for every top-6 name; the uncurated probe asserts `fallback === HASH_VARIANTS[djb2(name) % 4]` — green |
| P04-4 | Every returnable variant is dispatched by a real renderer | ✓ VERIFIED | `GenerativeVisual` switch covers all six (`:371-387`); the test reads the stage source and asserts a `case` for every reachable variant — green |
| P05-1 | Reduced motion is mount-gated so the first client render reproduces the server's non-RM geometry | ✓ VERIFIED | `:540-550` + `:569-571`; the only browser-global mentions in the file are inside the explanatory comment (`:542-549`) — no `window`/`document`/`matchMedia` access in render |
| P05-2 | No stray `'aria-hidden'` class token; the real attribute stays on every non-front card | ✓ VERIFIED | `aria-hidden` appears only as JSX props/icons plus the attribute-only card marker `:521` (`aria-hidden={isFront ? undefined : 'true'}`); the AP-6 invariant asserts both halves — green |
| P05-3 | No hydration mismatch and no first-paint RM flash for a reduced-motion user | ✓ VERIFIED (structural; observable discharged) | SSR and the first client render both resolve `reducedMotion === false`, so their trees are identical by construction, and the gate is test-pinned. The end-to-end observable needs a browser with the OS setting ON; no headless/DOM tier exists in this repo (`playwright`, `puppeteer`, `jsdom`, `happy-dom` all absent from `node_modules`) — discharged by the recorded user approval |
| P05-4 | `explore-panels.tsx` documents the delivered placement map and nobody under `src/` reads `data-editorial-wrapper` | ✓ VERIFIED | docstring `:19-45, 110-119`; placement map `:126-136`; `grep -rn data-editorial-wrapper src/` → the emission at `:175` plus three comments, no reader; Experience hook still measures `.explore-shell > main` (count 1) |
| P05-5 | The dual-engine comment names the swipe-driven stack stage as the single framer-motion import site | ✓ VERIFIED | `tests/explore-visuals.test.mjs:634-635` reads "...the ONE sanctioned projects-stack import site"; `grep "projects editorial scroll\|the editorial stage is the"` → 0 hits |
| P05-6 | The variant-selection assertion message names the curated per-project table as primary with the name-hash as fallback | ✓ VERIFIED | `tests/explore-visuals.test.mjs:972` reads "generative visuals selected by the curated per-project table (name-hash fallback for uncurated names)"; the predicate is unchanged |
| P06-1 | The live contract chain (ROADMAP goal, REV-18/19/20, SPEC) describes the delivered interaction | ✓ VERIFIED | ROADMAP `:16` reads "swipe-driven, loopable ring buffer … cardState(cardIndex, frontIndex) … at natural height"; REQUIREMENTS `:32-34` and SPEC `:11-25` restate the delivered mechanism; the sweep below finds no live line demanding scroll progress, a sticky Projects stage, `main.scrollTo` stepping or resize remeasurement |
| P06-2 | Retired wording is preserved but quarantined behind `SUPERSEDED:` | ✓ VERIFIED | reproduced sweep (my own run, this session): 0 unquarantined retired-token lines in all nine documents except the recorded REV-17 exception; quarantined retired-token lines: SPEC 1, UI-SPEC 22, CONTEXT 18, RESEARCH 11, 01-PLAN 2, 02-PLAN 13, 03-PLAN 3, ROADMAP 0. (`plan 06`'s published figures count every `SUPERSEDED:` line, including those without a retired token — hence 24/15/24 there vs 18/11/13 here; both agree on the invariant, 0 unquarantined) |
| P06-3 | CONTEXT records the D-01/D-03/D-05 amendments with provenance and re-affirms D-02/D-04/D-06 | ✓ VERIFIED | `CONTEXT.md:100-110` — amendment block cites quick task `2026-09-25-projects-swipe-loop-stack` and commit `b39b12c`, lists D-01/D-03/D-05 amended and re-affirms D-02/D-04/D-06 + AP-2 |
| P06-4 | The executed plan records no longer assert retired wiring | ✓ VERIFIED | `02-PLAN.md` frontmatter key_links = card-state import, mobile delegation, framer-motion; `grep "closest(\|querySelector"` over the stage → 0; `03-PLAN.md`'s stale instruction is quarantined behind `SUPERSEDED:` |
| P06-5 | UI-SPEC §4.4 carries the shipped identifiers plus a reconciliation note; RESEARCH carries superseded banners | ✓ VERIFIED | `UI-SPEC.md:247-252` variant column = `terminal-mock` / `contract-analysis` / `glyph` / `report` / `dashboard` / `network`, with the reconciliation note at `:256` (Uom Track's `dashboard` anatomy vs row 5's unimplemented drafted table); RESEARCH carries 11 quarantined retired-token lines and 5 `frontIndex`/ring-buffer mentions |
| P06-6 | AP-2 is recorded as an accepted deviation rather than silently dropped | ✓ VERIFIED | `02-PLAN.md` artifact description + `CONTEXT.md:110` both record the 20-line delegate as accepted, test-pinned, deliberately not inflated |
| P06-7 | The ship path is decided in writing rather than discovered at ship time | ✓ VERIFIED | `CONTEXT.md` Sweep 7 records `skip_gates: ["tdd_audit"]`, the reproduced gate failure on plan-01's landed long-form commit scope, and the honest framing that this is a recorded skip, not a satisfied gate |

**Score: 46/47** — 46 verified, **1 FAILED** (R6). All 33 plan truths pass; the failure is a roadmap/requirement-level clause (REV-18) about the loop-to-the-back choreography.

## Score

| Group | Count | Verified |
|---|---:|---:|
| Roadmap truths (goal row + REV-18…20) | 14 | 13 |
| Plan 01 truths | 4 | 4 |
| Plan 02 truths | 8 | 8 |
| Plan 03 truths | 4 | 4 |
| Plan 04 truths | 4 | 4 |
| Plan 05 truths | 6 | 6 |
| Plan 06 truths | 7 | 7 |
| **Total truths** | **47** | **46** |

Artifacts: 16 declared entries, all present and substantive (two line-count deviations, both recorded as overrides). Key links: 12 declared, all WIRED. Neither group contributes a failure beyond R6.

## Deferred Items

| Item (from CONTEXT `<deferred>`) | Status vs later phases |
|---|---|
| Real screenshots replacing the generative visuals (user supplies assets later) | Still deferred — phase 11 (credentials-panel-revision) appended a panel beside the stack and did not touch the Projects visuals; no phase owns it |
| Terminal/command-driven About-skill idea | Still deferred — future direction, unowned by any milestone phase |
| Cards for the other 8 projects (CLI-reachable) | Still deferred — the top-6 slice remains the delivered contract (`projects-section.tsx:26`) |

No deferred item was consumed or re-opened by a later phase. Phase 11's only interaction with this phase is placement: `explore-panels.tsx:43-45` appends the Credentials panel as the 5th grid child beside the stack (row 3), leaving the stack mechanism untouched — confirmed by `git diff --name-only d202546..HEAD -- src tests` (empty) and by the projects files' last code commits (`b870b05`/`3175f47`, phase-10 plan 05).

## Required Artifacts

| Path | Exists | Substantive | Wired | Notes |
|---|---|---|---|---|
| `src/components/explore/projects-card-state.ts` | ✓ | ✓ 344 lines (plan 01 min 80, plan 04 min 280); exports `CardState`, `cardState`, `firstSentence`, `projectYear`, `projectTechnologies`, `projectVisualVariant`, `djb2`, `swipeAccepts`, `SWIPE_THRESHOLD`, `SWIPE_VELOCITY_THRESHOLD` | ✓ static-imported by the stage (`:37-44`) and by the unit suite (`:30-40`) | **zero** import/require statements — the runtime-free contract holds |
| `tests/projects-stack.test.mjs` | ✓ | ✓ 444 lines (min 120 / 300); 22 tests, all passing | ✓ run by `node --test`; imports the real module and the real JSON | includes six-distinct, curated-precedence, hash-fallback, dispatch-coverage, loop-invariant, reversibility, RM and swipe-threshold assertions |
| `src/components/explore/sections/projects-stack-stage.tsx` | ✓ | ✓ 689 lines (min 220 / 640); exports `ProjectsStackStage`, `ProjectsSwipeStack` | ✓ rendered by `ProjectsSection` (md+) and by the mobile wrapper | the only `framer-motion` import site under `src/` |
| `src/components/explore/sections/projects-mobile-stack.tsx` | ✓ | ⚠️ 20 lines vs `min_lines: 130` — **accepted deviation AP-2** (override 1); delegates to `ProjectsSwipeStack mode="compact"`, capability test-pinned — not a stub | ✓ rendered in the `md:hidden` block | compact composition (single-peek visibility, `h-[420px]`, `max-w-[320px]`) lives in the shared stack |
| `src/components/explore/sections/projects-section.tsx` | ✓ | ✓ 47 lines (min 40); exports `ProjectsSection` | ✓ tiles + md+ stack + mobile stack + terminal pointer | compact card grid removed |
| `tests/explore-visuals.test.mjs` | ✓ | ✓ 1026 lines (min 50 / 950); 32 tests passing | ✓ run by `node --test` | carries the EXPLORE-10 invariant, the AP-3/AP-6 pin and the framer-motion allowlist |
| `src/components/explore/explore-panels.tsx` | ✓ | ✓ 183 lines (min 120); exports `ExplorePanels` | ✓ renders all five panels | docstring matches the delivered placement map |
| `.planning/ROADMAP.md` | ✓ | ✓ 33 lines (min 30) | ✓ phase-10 row cites REV-18…20 | delivered wording, no retired tokens |
| `.planning/REQUIREMENTS.md` | ✓ | ✓ 35 lines (min 30) | ✓ REV-18/19/20 rewritten, same IDs, still `[x]` | REV-17 untouched (`sticky` on line 31 is its own phase-9 text) |
| `…-SPEC.md` | ✓ | ✓ 79 lines (min 70) | ✓ requirements/boundaries/constraints/acceptance restated | amendment provenance block at `:8` |
| `…-UI-SPEC.md` | ✓ | ✓ 412 lines (min 300) | ✓ §4.4 variant column matches the shipped module | 22 quarantined lines |
| `…-CONTEXT.md` | ✓ | ✓ 187 lines (min 110) | ✓ amendment + contract sweep | 18 quarantined retired-token lines |
| `…-RESEARCH.md` | ✓ | ⚠️ 179 lines vs `min_lines: 200` — **advisory deviation AP-8** (override 2); 23,422 bytes, superseded banners and 11 quarantined retired-token lines present, so its purpose (not steering an executor back to scroll) is met | ✓ | not a stub |
| `…-01-PLAN.md` | ✓ | ✓ 122 lines (min 100) | ✓ assumption_delta names the ring-buffer contract | 2 quarantined lines |
| `…-02-PLAN.md` | ✓ | ✓ 182 lines (min 120) | ✓ key_links match the delivered wiring | 13 quarantined lines |
| `…-03-PLAN.md` | ✓ | ✓ 134 lines (min 110) | ✓ stale instruction quarantined and replaced | 3 quarantined lines |

## Key Link Verification

| # | From | To | Via | Status | Evidence |
|---|---|---|---|---|---|
| 1 | `tests/projects-stack.test.mjs` | `projects-card-state.ts` | static import with the explicit `.ts` extension | ✓ WIRED | `:30-40`; the suite executes the real module (22/22) |
| 2 | `projects-card-state.ts` | `portfolio-main-data.json` shape | runtime-free consumer contract (type-only) | ✓ WIRED | zero import statements in the module; consumers pass `PortfolioData['projects'][number]` |
| 3 | `projects-stack-stage.tsx` | `projects-card-state.ts` | named imports (`cardState`, `firstSentence`, `projectTechnologies`, `projectYear`, `projectVisualVariant`, `swipeAccepts`) | ✓ WIRED | `:37-44`; used at `:87-88, 118-119, 370, 423, 448, 468, 493` |
| 4 | `projects-mobile-stack.tsx` | `projects-stack-stage.tsx` (shared stack) | delegation to `ProjectsSwipeStack mode="compact"` | ✓ WIRED | `:13, 19`; the retired `closest('[data-editorial-wrapper]')` discovery has 0 matches anywhere in the stage |
| 5 | `projects-stack-stage.tsx` | `framer-motion` | the only sanctioned JS motion engine in the projects composition | ✓ WIRED | `:30-35`; exactly one `src/` file imports it; allowlist test green |
| 6 | `projects-section.tsx` | `projects-stack-stage.tsx` / `projects-mobile-stack.tsx` | import + render per viewport | ✓ WIRED | `:18-19, 37-43` |
| 7 | `tests/projects-stack.test.mjs` | `projects-stack-stage.tsx` (source) | reads the stage source and asserts a `case` for every returnable variant | ✓ WIRED | dispatch-coverage test green (`STACK_STAGE_PATH` at `:48`) |
| 8 | `.planning/ROADMAP.md` | `.planning/REQUIREMENTS.md` | the phase-10 row's REV-18…20 ids resolve to the rewritten entries | ✓ WIRED | ROADMAP `:16` ↔ REQUIREMENTS `:32-34` |
| 9 | `.planning/REQUIREMENTS.md` | `…-SPEC.md` | same ids, same delivered wording | ✓ WIRED | both carry the `frontIndex`/ring-buffer formulation (REQUIREMENTS 1 hit, SPEC 9 hits) |
| 10 | `…-02-PLAN.md` | `projects-card-state.ts` | the plan's key_links name the pure module the delivered stage consumes | ✓ WIRED | frontmatter key_link 1 |
| 11 | `…-UI-SPEC.md` §4.4 | `projects-card-state.ts` | §4.4 carries the identifiers the shipped module returns | ✓ WIRED | `:247-252` identical to `CURATED_VARIANTS`, with the reconciliation note at `:256` |
| 12 | `explore-panels.tsx` | `use-timeline-progress.ts` | the Experience placement is the ONE remaining extended sticky range, read from `.explore-shell > main` | ✓ WIRED | `MAIN_SELECTOR = '.explore-shell > main'` count 1; `explore-panels.tsx:129-131` is the only wrapper/shell pair emitted |

## Data-Flow Trace

Traced end to end (level 4 — data-flowing, not merely wired):

`src/data/portfolio-main-data.json` → `src/app/explore/page.tsx` (static import) → `ExplorePanels` adapter `projects: ({ data }) => <ProjectsSection projects={data.projects} />` (`explore-panels.tsx:106`) → `ProjectsSection` `projects.slice(0, 6)` (`projects-section.tsx:26`) → `ProjectsStackStage` / `ProjectsMobileStack` → `ProjectsSwipeStack` → `SwipeCard` → `GenerativeVisual(project.name)` / `CardHeader` / `CardExpandedPanel`.

- The rebuilt export (this run, exit 0) contains all six JSON project names in real server-rendered markup, plus the DeepIndex terminal string `query_context`, plus `Projects carousel`, `aria-live` and `h-[520px]` — so the SSR card is genuine markup, not a client-only shell.
- `firstSentence`, `projectYear`, `projectTechnologies` and `projectVisualVariant` consume the project's own `description`/`date`/`name` and are asserted against the real JSON (no copied literals) in the unit suite.
- No hardcoded portfolio content in the stage or the section: the only project-name strings in `projects-stack-stage.tsx` are two doc comments labelling the flagship visuals (`:171`, `:215`); variant selection runs through `projectVisualVariant(project.name)`.
- The single `<img>` in the export is the About avatar (REV-15); the Projects cards fetch zero image assets and contain no gradients (`grep gradient` over the export → 0).

## Behavioral Spot-Checks

One named check per behaviour-dependent group; the full suite only because plan 03's acceptance criterion demands it.

| # | Check | Command (this session) | Result |
|---|---|---|---|
| 1 | Pure geometry + variant contract (plans 01, 04) | `node --test tests/projects-stack.test.mjs` | **22/22 pass**, exit 0 — six-distinct variants, curated precedence, hash fallback, dispatch coverage, frontIndex-0/3 geometry, loop invariant, monotonicity/clamping, reversibility, RM branch, visibility cutoff, totality, count edge case, swipe thresholds |
| 2 | Phase integration pins (plans 02, 03, 05) | `node --test tests/explore-visuals.test.mjs` | **32/32 pass**, exit 0 — includes the EXPLORE-10 swipe/centered/loopable/shadow invariant (`:936-986`) and the AP-3/AP-6 mount-gate + attribute-only invariant (`:988-1010`) |
| 3 | Full gate (plan 03 criterion) | `node --test tests/*.test.mjs` | **269/269 pass**, 0 fail, 0 skipped, exit 0 |
| 4 | Type gate | `npm run typecheck` | exit 0, no output |
| 5 | Build + static export (also the SSR evidence source) | `npm run build` | exit 0; `/`, `/_not-found`, `/explore`, `/resume` prerendered; `Exporting (2/2)`; no `next dev` server is running against this worktree (port 3000 is `serve ./out`), so no dev-server/build race |
| 6 | Export content probe | `node -e` over `out/explore.html` | six project names ×2 in HTML + once in the flight payload; `query_context` ×2; 50 inline `<svg>`; 1 `<img>` (the About avatar); `Projects carousel` / `aria-live` / `h-[520px]` present; 0 gradients; `300vh` ×2 (both the Experience placement) |
| 7 | Ring-buffer arithmetic (independent of the suite) | `node --input-type=module -e "import {...} from './src/components/explore/projects-card-state.ts'"` | forward six-step cycle returns the initial arrangement: **true**; reverse six-step cycle: **true**; `cardState(0,1,6,false)` → y −190 / opacity 0.30 / zIndex 50 (back); `cardState(0,5,6,false)` → y −38 / opacity 0.95 / zIndex 90 (peek) — the measurement behind R6's failure |
| 8 | Retired-token sweep (plan 06's claim, re-measured) | `grep -nE "$RETIRED" DOC \| grep -v "SUPERSEDED:"` over the nine documents | 0 unquarantined lines in all nine; the only retired-token hit in `REQUIREMENTS.md` is line 31 (REV-17, its own phase-9 text) — the documented exception |

Probe execution: not applicable (presentation-layer phase, no migration/tooling step).

## Requirements Coverage

| REQ | Status | Basis |
|---|---|---|
| REV-18 | **PARTIAL — one clause FAILED** | Delivered: editorial rows replaced by the 6-card stack (R1, P03-2); geometry from the pure, unit-tested `cardState(cardIndex, frontIndex, count, reducedMotion)` plus the swipe helpers (R3, P01-1…4); swipe-driven ring buffer at natural height, stack centered (R8, P02-1); keyboard Prev/Next + Arrow + Home/End set the front index with 44px controls (R7, P02-4); both directions reversible — a full six-step cycle returns the initial arrangement, verified in both rotation directions (R4). **Not delivered:** "the foreground card is draggable and loops to the back" holds for one direction only — on the Next/left path the swiped card lands at depth 1 (the peek) and the card from the tail is promoted, contradicting the directive's req 3 ("`depth = last level, zIndex lowest, offsets reset`") and the stage's own comment at `:597` (R6, gap in frontmatter) |
| REV-19 | **VERIFIED** | Rounded corners, compact header (name + tagline, first sentence ≤120), monochrome token-only visuals with `aria-hidden` and zero image assets/no gradients, six DISTINCT curated variants with the hash fallback (R9, P04-1…4), deterministic ±2-4px / ±1° imperfection (R10), active-card expansion carrying description + up to 4 technology chips + links with `rel="noopener noreferrer"` (R11). Residual: the live "75-85% visual area" figure is not measured by this run (no browser tier in the repo) — discharged by the recorded user approval |
| REV-20 | **VERIFIED** | Keyboard stepping sets the front index with an accessible non-scroll alternative (R7, P02-4); reduced motion = opacity/zIndex swaps, mount-gated so the first client render matches SSR, drag disabled (R12, P02-5, P05-1); no listeners or observers are added at all (`grep addEventListener\|ResizeObserver` over the four phase files → 0), so nothing can leak; mobile compact stack with one peek and no horizontal scroll (R13, P02-6); all content from `portfolio-main-data.json` (Data-Flow Trace); dual-engine ban holds (0 rAF/gsap/lottie/`.animate(`, one framer-motion site) |

## Anti-Patterns Found

No debt markers: zero `TBD`/`FIXME`/`XXX`/`TODO` in any file this phase created or modified. No skipped or focused tests (`grep "\.skip(\|\.only(\|todo(\|describe\.skip"` over both phase suites → 0). No stubbed assertions. Findings:

| ID | Severity | Finding |
|---|---|---|
| AP-12 | **WARNING (new)** | Five phase-10 files mis-cite the requirement ID: `projects-card-state.ts:3`, `projects-section.tsx:2`, `projects-mobile-stack.tsx:5`, `explore-panels.tsx:30, 35, 112` and the test titles at `tests/explore-visuals.test.mjs:936, 988, 947-950` label the Projects stack work "phase-10 REV-21". REV-21 is phase 11's Credentials panel (`REQUIREMENTS.md:35`, `ROADMAP.md:17`); the phase-10 requirement ids are REV-18…20. Documentation/traceability only — no behaviour is affected and no truth depends on it — but the delivered source names the wrong contract |
| AP-13 | **BLOCKER-adjacent, reported as gap R6** | The stage's own comments (`projects-stack-stage.tsx:594` "Previous: right-fly-off, back card forward"; `:597` "Next: left-fly-off, front card to back") describe the opposite of the delivered mapping. This is the code-level evidence that the ring rotation is inverted relative to intent, not a deliberate design choice. Recorded as the frontmatter gap rather than a separate anti-pattern |
| AP-2 | WARNING (accepted) | `projects-mobile-stack.tsx` is 20 lines against plan-02's `min_lines: 130`. The capability is delivered by delegation to `ProjectsSwipeStack mode="compact"` and test-pinned; recorded as an accepted deviation in the plan, CONTEXT and here (override 1) |
| AP-8 | INFO | `RESEARCH.md` is 179 lines against plan-06's `min_lines: 200`. 23,422 bytes of substantive content, superseded banners and quarantine all present and sweep-clean; the threshold over-estimated the long-table format (override 2) |
| AP-9 | INFO | The single unquarantined retired-token hit in the sweep is `REQUIREMENTS.md:31` — REV-17, the phase-9 requirement, which keeps its own-phase "sticky ~100vh stage" wording describing work phase 9 already shipped. It makes no claim about phase 10 (plan 06 swept REQUIREMENTS with a narrower token set for this reason) |
| AP-10 | INFO | Residual wording tension in the live REV-18 text: "no discrete state swaps as the primary mechanism". The depth input is an integer `frontIndex`, so continuity comes from the framer fly-off/`controls.start` motion between arrangements rather than from a continuous progress variable. Carried over unchanged from the prior report; the amended SPEC acceptance ("card geometry derives from the pure cardState(...) and is unit-tested") is what is verified |
| AP-11 | INFO | `CardState.activeAmount` is still produced by the pure module but consumed by nothing outside the module and its tests (`grep -rn activeAmount src/` → 0 hits). Part of the pinned UI-SPEC §3 contract; carried over unchanged |
| AP-4/5/6 | RESOLVED | Prior stale dual-engine comment, prior stale `explore-panels.tsx` docstring and prior no-op `'aria-hidden'` class token are all fixed and test-pinned (P05-2, P05-4, P05-5) |

## Human Verification Required

None re-opened by this run. The five items the prior report raised are **discharged by the recorded user approval** — commit `c97b0e8` ("record batch human confirmation for phases 7-11") appends `status_human: approved` to this phase's own verification record, the convention already applied to phases 1, 2, 4, 5, 7 and 8, and the tree is unchanged since that approval (`git diff --name-only d202546..HEAD -- src tests` → empty). For the record, the discharged items were:

1. Swipe/drag feel (fly-off, promotion, spring restraint, six-swipe cycle) — interactive only.
2. Shadow bloom (`--panel-shadow-hover`) visible onto the cards beneath, in both themes, unclipped.
3. Visual-first proportion (~75-85% at md+) and the 375px compact-stack invariant — **note: this figure is not measured anywhere in this run or the prior one; it rests on the recorded approval alone.**
4. Reduced motion in a real browser with the OS setting ON (instant swaps, no hydration warning, no first-paint swap).
5. Keyboard + screen-reader pass (announcements `Project NN of 06: <name>`, focus stays on the controls, no focus into a hidden card).

No headless/DOM tier exists in this repo (`playwright`, `puppeteer`, `jsdom`, `happy-dom`, `@testing-library` all absent from `node_modules`), so none of the five could be converted into a passing behavioural test from this harness. They are not why the status is `gaps_found`; R6 is.

## Gaps Summary

**One gap.**

**The ring rotation is inverted relative to the fly-off side, so REV-18's "the foreground card is draggable and loops to the back" / directive req 3's "`depth = last level, zIndex lowest, offsets reset`" holds for one of the two directions.** `handleKeyDown` (`projects-stack-stage.tsx:591-607`) maps Next/ArrowDown/ArrowRight to `cycle(-1)` and Prev/ArrowUp/ArrowLeft to `cycle(1)`; `performExit` (`:439-460`) and `handleSwipe` (`:573-576`) both derive the new front index from the same sign, so the fly-off side and the rotation direction are locked together. With the delivered depth formula `(i - front) mod 6` (`projects-card-state.ts:298`), the measured result is:

- **+1 step** (Prev button, right drag, ArrowDown/ArrowRight, `cycle(1)`): `cardState(0, 1, 6, false)` → translateY −190, scale 0.80, opacity 0.30, zIndex 50 = depth 5 = **the back, lowest zIndex — the clause met**.
- **−1 step** (Next button, left drag, ArrowUp/ArrowLeft, `cycle(-1)`): `cardState(0, 5, 6, false)` → translateY −38, opacity 0.95, zIndex 90 = depth 1 = **the peek, not the back** — the clause unmet; the card promoted to the front is the one that was at the tail (previously `visibility: hidden` at opacity 0.30 in compact mode), and the swiped card returns immediately as the visible peek.

The two code comments at `:594` and `:597` assert the intended pairing ("Previous: right-fly-off, back card forward", "Next: left-fly-off, front card to back") and are contradicted by the code beneath them — evidence of a wiring slip rather than a design decision. Two measured consequences of the same inversion: the control labelled `aria-label="Next project"` **decrements** the `NN / 06` counter and the aria-live announcement (01 → 06, "Project 06 of 06: Uom Track") while `aria-label="Previous project"` increments it (01 → 02).

Everything else the phase set out to do is delivered and independently re-verified at HEAD: the editorial scroll is gone, the stack renders six distinct curated visual-first cards at natural height with pure, unit-tested geometry, keyboard/Home/End stepping, mount-gated reduced motion, a one-peek mobile composition, a single framer-motion site, and both ring directions reversible (a full six-step cycle restores the initial arrangement in each direction). 46 of 47 must-haves verified; 12/12 key links wired; 16/16 artifacts present; zero debt markers.

**Resolution options (either closes the gap, neither is a code-plus-doc change):**
- **(R1) Fix the mapping** — decouple the fly-off side from the rotation sign so a left swipe flies left *and* advances the ring forward (the swiped card lands at depth `count - 1`), with Prev/Next and the counter/aria-live then reading forward. Small, local to `cycle`/`handleSwipe`/`performExit`, and the existing loop-invariant/reversibility tests keep passing; new assertions would pin the departing card's depth per direction.
- **(R2) Amend the contract text** as plan 06 did for the other retired clauses — restate REV-18 and the CONTEXT directive amendment as the delivered mirrored-rotation contract (one direction promotes the peek and sends the swiped card to the back; the other promotes the tail and returns the swiped card as the peek), and state the counter semantics in the same edit.

**Overrides applied: 3.** (1) AP-2's `projects-mobile-stack.tsx` line-count deviation — the capability is delivered by delegation and test-pinned. (2) AP-8's `RESEARCH.md` line-count deviation — substantive, sweep-clean, purpose met. (3) The recorded user approval (`c97b0e8`, `status_human: approved`) discharging the five perceptible human items listed above.

**Green-gate note.** The full gate (typecheck + build + 269/269 suite + static export) was run **after** all code reading and **before** this report was written, and then re-run as the chronological last action of the verification session (this paragraph was the final file write before that confirmation run) — measured results: `npm run typecheck` exit 0; `npm run build` exit 0 with `Exporting (2/2)`; `node --test tests/*.test.mjs` 269/269 pass, 0 fail, 0 skipped. The report itself changes no code, config or plan document. `git status --porcelain --untracked-files=no` shows only this file (uncommitted, by instruction). The `--skip-gates tdd_audit` decision recorded in CONTEXT Sweep 7 remains a ship-time gate decision; this report makes no claim that the phase satisfies `tdd_audit`, and `gaps_found` independently blocks shipping until R6 is resolved.
