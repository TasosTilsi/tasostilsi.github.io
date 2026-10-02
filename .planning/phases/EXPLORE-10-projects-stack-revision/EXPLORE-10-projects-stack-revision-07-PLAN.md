---
phase: 10-projects-stack-revision
plan: 07
type: tdd
wave: 6
depends_on:
  - "EXPLORE-10-projects-stack-revision-06"
files_modified:
  - "src/components/explore/projects-card-state.ts"
  - "src/components/explore/sections/projects-stack-stage.tsx"
  - "tests/projects-stack.test.mjs"
  - "tests/explore-visuals.test.mjs"
autonomous: true
requirements: ["REV-18", "REV-20"]
gap_closure: true
user_setup: []
must_haves:
  truths:
    - "Every accepted swipe — left OR right — sends the foreground card to the BACK of the stack: the card flies off in the swipe direction and is re-laid-out at the last depth level (at count 6: translateY -190, scale 0.80, opacity 0.30, zIndex 50), so the card the visitor just dismissed never returns immediately as the visible peek card (REV-18 'the foreground card is draggable and loops to the back'; directive req 3 'depth = last level, zIndex lowest, offsets reset')."
    - "The Next control (button, ArrowRight, ArrowDown) advances the ring FORWARD: the foreground card flies off to the LEFT and lands at the back, and the counter + throttled aria-live read 01 → 02 → … (directive req 7 'Next = send front card to back with a left-fly-off')."
    - "The Previous control (button, ArrowLeft, ArrowUp) is the exact inverse of Next: the card that was at the BACK (depth 5) is promoted to the foreground and the departing foreground card flies off to the RIGHT, with the counter reading 01 → 06 (directive req 7 'Previous = bring the back card forward with a right-fly-off — mirrored directions')."
    - "The fly-off SIDE and the ring-advance DELTA are separate inputs, not one shared sign: the mapping is the pure, unit-tested ringStep(source, gesture) in projects-card-state.ts, so the coupling that produced verification gap R6 is unrepresentable rather than merely corrected."
    - "Round-trip invariant over every supported variant: for each of the six rendered cards (all six curated visual variants) and every foreground index, a six-step forward cycle — by Next, or by six accepted swipes on EITHER side — restores the initial arrangement, and previous exactly inverts next (advanceFront(advanceFront(f, -1, 6), 1, 6) === f)."
    - "Reduced motion keeps the identical ring semantics with no fly-off: swipe, Next and Previous each reorder instantly (opacity/zIndex only, no translate/scale/rotation), so the reduced-motion path cannot disagree with the motion path about which card comes forward."
  artifacts:
    - path: "src/components/explore/projects-card-state.ts"
      provides: "The pure ring-step contract (ringStep/advanceFront/ringDepth) alongside the unchanged cardState geometry, curated variant table, lexicon, swipe thresholds and imperfection arrays; still zero runtime imports."
      min_lines: 344
      exports: ["cardState", "ringStep", "advanceFront", "ringDepth", "projectVisualVariant", "djb2", "firstSentence", "projectYear", "projectTechnologies", "swipeAccepts", "SWIPE_THRESHOLD", "SWIPE_VELOCITY_THRESHOLD"]
    - path: "src/components/explore/sections/projects-stack-stage.tsx"
      provides: "The swipe stack stage with the three step paths (drag, Next/Prev buttons, arrow keys) consuming the pure ring step: exit sign drives the fly-off, ring delta drives the rotation; geometry, layout, a11y attributes and the mount-gated reduced-motion branch unchanged."
      min_lines: 640
      exports: ["ProjectsStackStage", "ProjectsSwipeStack"]
    - path: "tests/projects-stack.test.mjs"
      provides: "Unit contract for the pure ring step: the direction map, the departing card's landing depth for every path and front index, the Next/Previous inverse, the six-step round trip on both swipe sides, and totality of advanceFront/ringDepth."
      min_lines: 444
      exports: []
    - path: "tests/explore-visuals.test.mjs"
      provides: "The EXPLORE-10 invariant extended with the call-site mapping pins: the Next/Previous/drag paths consume ringStep, the stage consumes ringDepth, and the one-sign cycle(1)/cycle(-1) coupling is gone."
      min_lines: 950
      exports: []
  key_links:
    - from: "tests/projects-stack.test.mjs"
      to: "src/components/explore/projects-card-state.ts"
      via: "static import with explicit .ts extension (Node 24 type stripping) — the RED/GREEN path for this plan"
      pattern: "from '\\.\\./src/components/explore/projects-card-state\\.ts'"
    - from: "src/components/explore/sections/projects-stack-stage.tsx"
      to: "src/components/explore/projects-card-state.ts"
      via: "named imports of the ring-step contract, consumed by the button, keyboard and drag paths"
      pattern: "ringStep\\(|advanceFront\\(|ringDepth\\("
    - from: "src/components/explore/sections/projects-stack-stage.tsx (drag path)"
      to: "src/components/explore/sections/projects-stack-stage.tsx (ring advance)"
      via: "the accepted swipe sign supplies ONLY the exit sign; the ring delta is taken from ringStep('swipe', accepted)"
      pattern: "ringStep\\('swipe', accepted\\)"
    - from: "tests/explore-visuals.test.mjs"
      to: "src/components/explore/sections/projects-stack-stage.tsx"
      via: "source-invariant assertions pinning each control path to its ring step and the retired one-sign coupling absent"
      pattern: "ringStep\\('(next|previous)'\\)"
---

<objective>
Close verification gap R6 (the ONLY gap in `EXPLORE-10-projects-stack-revision-VERIFICATION.md`, `status: gaps_found`, 46/47): REV-18's "the foreground card is draggable and loops to the back" holds in ONE direction only, because the fly-off side and the ring-rotation sign are the same value.

Measured on the delivered tree (HEAD `2d2ff53`, `src/` byte-identical to the tree the verification measured). `SwipeCard.performExit` (`projects-stack-stage.tsx:439-460`) and `ProjectsSwipeStack.handleSwipe` (`:573-576`) both derive the new front index from the same `direction` that drives the exit animation (`newFront = (frontIndex + direction + count) % count`), and `handleKeyDown` (`:591-607`) maps Next/ArrowDown/ArrowRight to `cycle(-1)` while its own comment at `:597` says "Next: left-fly-off, front card to back". With the delivered depth rule `((i - front) % count + count) % count`:

- `cardState(0, 1, 6, false)` → translateY -190, scale 0.80, opacity 0.30, zIndex 50 = depth 5 = the BACK (the clause met, on the +1 step only).
- `cardState(0, 5, 6, false)` → translateY -38, scale 0.96, opacity 0.95, zIndex 90 = depth 1 = the PEEK (the clause unmet, on the -1 step — the delivered Next path and a left swipe).

Two further measured consequences of the same inversion: the control labelled `aria-label="Next project"` DECREMENTS the `NN / 06` counter and the aria-live announcement (01 → 06), and `aria-label="Previous project"` increments it (01 → 02).

This plan PROMOTES the ring advance to a named pure function and DEMOTES the fly-off side to a presentation-only field, then rewires the three step paths to it:

| path | ring delta | exit sign (fly-off) | departing card lands at |
|---|---|---|---|
| accepted swipe, either side | +1 | the gesture side | depth `count - 1` (the back) |
| Next (button, ArrowRight, ArrowDown) | +1 | -1 (left) | depth `count - 1` (the back) |
| Previous (button, ArrowLeft, ArrowUp) | -1 | +1 (right) | depth 1 (the peek) — and the card that was at the back is promoted to the foreground |

The Previous row is the exact inverse, not a second loop-to-the-back: directive req 7 defines it as "bring the back card forward with a right-fly-off — mirrored directions", and REV-18 says Prev/Next "step the same ring buffer", so Prev must step it BACKWARD. One consequence is recorded rather than hidden: on Previous the departing foreground card flies off right and is re-laid-out at depth 1 (the peek), which is what "mirrored" means at ring-1. The counter and aria-live need no change — they DERIVE from `frontIndex + 1`, so they read forward again the moment the Next control advances the ring forward.

Resolution choice (recorded): the verification offered R1 (fix the mapping) or R2 (amend the contract text to the delivered mirrored rotation). R1 is taken. R2 is declined because the user's own directive — `.planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md` req 3 ("then LOOPS to the BACK of the stack (depth = last level, zIndex lowest, offsets reset)"; "Swipe left AND right both cycle (the fly-off direction follows the swipe side)") and req 7 ("Next = send front card to back with a left-fly-off, Previous = bring the back card forward with a right-fly-off — mirrored directions") — already states the contract this plan implements, and the stage's two comments at `:594`/`:597` state it too. The contract text is right; the wiring is wrong. Amending the text would enshrine a wiring slip as the delivered behaviour, and the recorded batch human approval (`c97b0e8`) covers the felt swipe/shadow interaction, not this geometry.

No requirement text, ROADMAP row, SPEC or UI-SPEC line changes in this plan. No new dependency, no image asset, no data-file change, no geometry/LEVELS/threshold change, no layout or a11y-attribute change, no second framer-motion import site.
</objective>

<assumption_delta_decision>
- primary noun: the RING ADVANCE — `ringStep(source, gesture)` → `{ ringDelta, exitSign }`, consumed by `advanceFront` (index advance) and `ringDepth` (cyclic depth). The ring delta is the authority on which card comes forward.
- demoted detail: the fly-off SIDE (the gesture/control direction) — presentation only, one field of the step; it is never the rotation sign.
- decision: promote
- rationale: the delivered code let ONE sign govern both the fly-off side and the ring rotation (`cycle(1)` / `cycle(-1)` / `newFront = front + direction`), which is precisely the coupling that failed REV-18's loop-to-the-back clause on the Next/left path; naming the ring delta and demoting the fly-off side to a field makes the coupling unrepresentable and executable-testable instead of source-greppable.
- add-alongside: no. The retired formulation (one sign for both) is deleted at its three call sites, not kept beside the new one — no accepted debt is added by this plan.
- re-affirmed, no change: the curated per-project variant table stays PRIMARY with `djb2(name) % 4` as the fallback for uncurated names (plan 04 / REV-19); this plan touches no visual selection.
- invariant: every supported variant round-trips through the promoted primary path — for all six cards (all six curated variants) and every front index, `previous` exactly inverts `next`; six successive Next steps, six successive left swipes and six successive right swipes each restore the initial arrangement; both swipe sides yield the SAME ring advance with only the exit sign differing.
- secondary alternative (no change): the accessible non-scroll alternative (keyboard Prev/Next, Arrow keys, Home/End) is NOT demoted — it consumes the same `ringStep` contract as the gesture path, so both paths are proven equivalent by the same unit assertions.
</assumption_delta_decision>

<gap_resolution>
- Gap R6 → resolved in CODE (verification option R1), not by amending the contract (option R2). See `<objective>` for the recorded reason.
- AP-13 closes as a consequence: the comments at `projects-stack-stage.tsx:594` ("Previous: right-fly-off, back card forward") and `:597` ("Next: left-fly-off, front card to back") are CORRECT statements of the intended mapping — they were contradicted by the code beneath them. After this plan the code matches them. They are KEPT (not rewritten), with the two fields of the step named inline so a future reader cannot re-couple them.
- AP-12 (mis-cited requirement ids, WARNING) is NOT in this plan — plan 08 of this wave closes it.
- Untouched by this plan: REV-19's visual contract (plan 04), the mount-gated reduced-motion fix (plan 05), the contract-record sweep (plan 06), and the accepted deviations AP-2 (delegated mobile stack), AP-8 (`RESEARCH.md` line count), AP-10 (residual "no discrete state swaps" wording, INFO) and AP-11 (unconsumed `activeAmount`, INFO).
- Ship-gate note: this plan's commits follow the zero-padded `{phase}-{plan}` scope `10-07` with the `test(10-07):` commit FIRST, so the plan is tdd_audit-compliant on its own terms. The phase-level `skip_gates: ["tdd_audit"]` decision recorded in CONTEXT's Sweep 7 (forced by plan-01's already-landed long-form commit scope, which no document edit can fix) is unaffected and is not re-litigated here.
</gap_resolution>

<context>
Read before implementing:
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-VERIFICATION.md — frontmatter `gaps:` (gap R6), `## Gaps Summary` and `## Anti-Patterns Found` (AP-13) are the authoritative statement of the defect; every number above is reproduced from it and re-measured in this plan's acceptance criteria.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md — requirements 3, 4 and 7 are the directive this plan implements verbatim.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/projects-card-state.ts — the pure module (344 lines, zero runtime imports): `cardState` at 275-344, `LEVELS` at 56-63, `swipeAccepts` at 243-256, `CURATED_VARIANTS` at 198-205.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/sections/projects-stack-stage.tsx — `SwipeCard` 401-530 (`performExit` 439-460, `handleDragEnd` 486-502), `ProjectsSwipeStack` 538-684 (`handleSwipe` 573-576, `cycle` 578-585, `goTo` 587-589, `handleKeyDown` 591-607, controls 659-681), `ProjectsStackStage` 687-689.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/projects-stack.test.mjs — the pure-module suite (22 tests); the import block at 30-40 is where the new exports are added; the loop-invariant test at 342-355 and the reversibility test at 375-383 are the existing ring pins to keep.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/explore-visuals.test.mjs — the EXPLORE-10 invariant test at 936-985 is where the call-site pins are added.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/REQUIREMENTS.md line 32 (REV-18) and line 34 (REV-20) — the live requirement text this plan's behaviour must satisfy.
</context>

<tasks>
  <task type="test">
    <name>Task 1: RED (tracer) — pin the ring-step contract in the pure unit suite, starting with the Next step end-to-end</name>
    <files>tests/projects-stack.test.mjs</files>
    <read_first>src/components/explore/projects-card-state.ts, src/components/explore/sections/projects-stack-stage.tsx, tests/projects-stack.test.mjs, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-VERIFICATION.md</read_first>
    <action>
      Add the ring-step imports to the existing `import { … } from '../src/components/explore/projects-card-state.ts'` block (lines 30-40): `ringStep`, `advanceFront`, `ringDepth`. Do NOT remove or rename any existing import. Then add the assertions below as new `test(...)` cases at the END of the file, keeping every existing test and assertion intact. Every expectation must be computed from `COUNT` (already 6 in this suite) and from the real module — no copied geometry literals beyond the pins the existing frontIndex-0/frontIndex-3 tests already carry.

      TRACER (write this test FIRST — it is the thinnest end-to-end slice: pure export → index advance → the departed card's landing level) — title it 'ringStep: the Next step sends the foreground card to the back (tracer)':
      1. `assert.deepEqual(ringStep('next'), { ringDelta: 1, exitSign: -1 })`.
      2. `const newFront = advanceFront(0, ringStep('next').ringDelta, COUNT)`; assert `newFront === 1`.
      3. Assert the departing card 0 lands at the LAST level from `newFront`: `ringDepth(0, newFront, COUNT) === COUNT - 1`, and — the user-visible half — `cardState(0, newFront, COUNT, false)` returns `zIndex 50`, `opacity 0.30`, `translateY -190`, `scale 0.80`, `visible true`. Assert the same fields against `cardState(0, 5, COUNT, false)` (the delivered -1 landing) with a message that names it as the retired/unmet mapping (depth 1, zIndex 90) so the RED/GREEN difference is self-documenting.

      EXPANSION (same task, after the tracer) — one more test titled 'ringStep: the direction map — both swipe sides advance the ring, the fly-off side is presentation only':
      4. `ringStep('previous')` deep-equals `{ ringDelta: -1, exitSign: 1 }`.
      5. For `gesture` of `-1` and `1`: `ringStep('swipe', gesture).ringDelta === 1` and `ringStep('swipe', gesture).exitSign === gesture` — i.e. the two swipe sides produce the SAME ring advance and differ ONLY in the exit sign. Also assert the defensive default: `ringStep('swipe')`, `ringStep('swipe', 0)` and `ringStep('swipe', NaN)` all return `ringDelta 1` with a finite ±1 `exitSign`.
      6. For EVERY front index `f` in `0..COUNT-1` and for each of the three advancing paths (`ringStep('next')`, `ringStep('swipe', -1)`, `ringStep('swipe', 1)`): `ringDepth(f, advanceFront(f, step.ringDelta, COUNT), COUNT) === COUNT - 1` — the departing foreground card is at the back for every front index, on every advancing path.

      And a third test titled 'ringStep: Previous is the exact inverse of Next and promotes the back card':
      7. For every `f`: `advanceFront(advanceFront(f, -1, COUNT), 1, COUNT) === f` and `advanceFront(advanceFront(f, 1, COUNT), -1, COUNT) === f`.
      8. For every `f`: `const promoted = advanceFront(f, ringStep('previous').ringDelta, COUNT)`; assert `ringDepth(promoted, f, COUNT) === COUNT - 1` (it WAS the back card) and `ringDepth(promoted, promoted, COUNT) === 0` (it IS the foreground now) — directive req 7's "bring the back card forward".
      9. Round-trip over every supported variant: for each of the six names in `top6` (the real data slice, all six curated variants) and for each advancing path, six successive steps restore the initial arrangement — compute `let front = 0; for (let k = 0; k < COUNT; k++) front = advanceFront(front, step.ringDelta, COUNT);` and assert `front === 0` AND `assert.deepEqual(top6.map((_, i) => cardState(i, front, COUNT, false)), top6.map((_, i) => cardState(i, 0, COUNT, false)))`. Do this for `ringStep('next')`, `ringStep('swipe', -1)` and `ringStep('swipe', 1)`.
      10. Totality: `advanceFront` and `ringDepth` never return NaN and never throw — probe `NaN`/`Infinity`/`-Infinity` for each argument, `count` of `0`, `-1` and `1`, and assert every result is a finite number and (for `advanceFront`) `0` when `count <= 1`.

      RED signal: this suite must fail at LOAD/first assertion because `ringStep`, `advanceFront` and `ringDepth` do not exist yet (`grep -c "ringStep" tests/projects-stack.test.mjs` is 0 pre-edit; `grep -c "export function ringStep\|export function advanceFront\|export function ringDepth" src/components/explore/projects-card-state.ts` is 0 pre-edit). Do NOT stub the module in this task — the RED must come from the missing exports.
    </action>
    <verify>Run `node --test tests/projects-stack.test.mjs`. Expect RED: the run fails, and the failure names the missing `ringStep` export (module-exports error), not an assertion inside an unrelated test. Record the exact failure line in the SUMMARY.</verify>
    <acceptance_criteria>
      - `node --test tests/projects-stack.test.mjs` exits non-zero and the failure message names `ringStep`.
      - The suite now imports the contract: `grep -c "ringStep\|advanceFront\|ringDepth" tests/projects-stack.test.mjs` returns at least 12.
      - The tracer assertions are present: `grep -c "deepEqual(ringStep('next')" tests/projects-stack.test.mjs` returns 1; `grep -c "COUNT - 1" tests/projects-stack.test.mjs` returns at least 2.
      - The both-sides assertion is present: `grep -c "ringStep('swipe'" tests/projects-stack.test.mjs` returns at least 4.
      - The inverse and round-trip assertions are present: `grep -c "advanceFront(advanceFront(" tests/projects-stack.test.mjs` returns at least 2.
      - No pre-existing test was deleted or weakened: `grep -c "^test(" tests/projects-stack.test.mjs` returns at least 22 + 3 (the three new tests); `grep -c "test.skip\|describe.skip\|test.only" tests/projects-stack.test.mjs` returns 0.
      - The existing ring pins survive: `grep -c "loop invariant — a full cycle of 6 frontIndex steps" tests/projects-stack.test.mjs` returns 1 and `grep -c "reversibility — same frontIndex yields identical geometry" tests/projects-stack.test.mjs` returns 1.
      - The module was NOT edited in this task: `git status --porcelain src/components/explore/projects-card-state.ts` is empty.
    </acceptance_criteria>
    <done>RED commit landed: test(10-07): pin the ring-step contract (Next to the back, both swipe sides advance, Previous inverts Next) — the suite is red only for the missing exports.</done>
  </task>

  <task type="fix">
    <name>Task 2: GREEN — add ringStep/advanceFront/ringDepth to the pure module and decouple the fly-off side from the ring rotation in the stage</name>
    <files>src/components/explore/projects-card-state.ts, src/components/explore/sections/projects-stack-stage.tsx</files>
    <read_first>src/components/explore/projects-card-state.ts, src/components/explore/sections/projects-stack-stage.tsx, tests/projects-stack.test.mjs, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-VERIFICATION.md, .planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md</read_first>
    <action>
      PART A — `src/components/explore/projects-card-state.ts` (pure module; zero runtime imports, erasable syntax only — no enum, no namespace, no new dependency, no Node/browser global):
      1. Add the contract immediately AFTER `swipeAccepts` (243-256), in the module's existing docstring style:
        - `export type RingSource = 'swipe' | 'next' | 'previous';`
        - `export interface RingStep { ringDelta: -1 | 1; exitSign: -1 | 1; }`
        - `export function ringStep(source: RingSource, gesture?: -1 | 0 | 1): RingStep` — returns `{ ringDelta: 1, exitSign: -1 }` for `'next'`; `{ ringDelta: -1, exitSign: 1 }` for `'previous'`; and for `'swipe'` ALWAYS `{ ringDelta: 1, exitSign: gesture === -1 ? -1 : 1 }` (an absent, `0` or non-finite gesture defaults to `1`). The swipe arm must not branch on the gesture for the delta — that identity is the fix.
        - `export function advanceFront(frontIndex: number, ringDelta: number, count: number): number` — `((front + delta) % c + c) % c` over the safe values, with the module's existing totality discipline (`finiteOr`/`clamp` are already defined at 62-77): non-finite `frontIndex`/`ringDelta` → `0`; `count` non-finite or `<= 0` → treated as `1`; the result is always a finite integer in `[0, count)`.
        - `export function ringDepth(cardIndex: number, frontIndex: number, count: number): number` — the cyclic depth `((i - front) % c + c) % c` under the same guards; this becomes the module's ONE depth derivation site.
        - Docstring each one in the module's voice, and state the contract explicitly: the ring ADVANCE is primary and the fly-off SIDE is presentation-only — the retired coupling (one sign governing both the exit animation and the rotation) is what failed REV-18's loop-to-the-back clause on the Next/left path (phase-10 VERIFICATION gap R6 / AP-13).
      2. Do NOT touch: `cardState`, `LEVELS`, `IMPERFECTION_*`, `CURATED_VARIANTS`/`HASH_VARIANTS`/`projectVisualVariant`, `TECH_LEXICON`/`projectTechnologies`, `firstSentence`, `projectYear`, `swipeAccepts`, `SWIPE_THRESHOLD`, `SWIPE_VELOCITY_THRESHOLD`. Do NOT add a runtime import — the `grep -c "^import\|require(" → 0` invariant must survive.

      PART B — `src/components/explore/sections/projects-stack-stage.tsx` (rewire the three step paths; change NOTHING else — no geometry constant, no layout class, no aria attribute, no reduced-motion gate, no visual):
      3. Extend the named import from `'../projects-card-state'` (37-44) with `advanceFront`, `ringDepth`, `ringStep` and `type RingStep`.
      4. `SwipeCard` depth (417-420): replace the inline `((index - frontIndex) % count + count) % count` with `ringDepth(index, frontIndex, count)`; keep the `compactHidden = mode === 'compact' && depth > 1` rule. `SwipeCardProps` (389-398): `pendingSwipe: SwipeDirection | null` → `pendingStep: RingStep | null`, and `onSwipe: (direction: SwipeDirection) => void` → `onSwipe: (ringDelta: -1 | 1) => void`. Keep `type SwipeDirection = -1 | 1` (line 49) — it now names the EXIT SIGN only. Per D-01 as amended (the geometry input is the ring-buffer foreground index, not a scroll progress), `frontIndex` stays the single geometry input and the LEVELS table, the deterministic-imperfection contract and the continuity clauses are untouched.
      5. `performExit` (439-460): signature `performExit(exitSign: SwipeDirection, ringDelta: -1 | 1)`. The animation keeps `x: exitSign * EXIT_X`, `rotate: exitSign * EXIT_ROTATION`, `opacity: 0`, same transition. Then `const newFront = advanceFront(frontIndex, ringDelta, count)` and the `controls.set(...)` re-layout uses `cardState(index, newFront, count, reducedMotion)` with the compact hidden rule recomputed as `mode === 'compact' && ringDepth(index, newFront, count) > 1`; finally `onSwipe(ringDelta)`.
      6. The pending effect (480-484): `performExit(pendingStep.exitSign, pendingStep.ringDelta)` when `pendingStep !== null && isFront && !reducedMotion && !isExiting`.
      7. `handleDragEnd` (486-502): keep `const accepted = swipeAccepts(info.offset.x, info.velocity.x)`; when `accepted !== 0` write exactly `const step = ringStep('swipe', accepted);` then `performExit(step.exitSign, step.ringDelta);` and return. The rejected branch (spring back) is unchanged. The gesture side must reach ONLY `exitSign`.
      8. `ProjectsSwipeStack` state/handlers: `pendingSwipe` (552) → `pendingStep: RingStep | null`; `handleSwipe` (573-576) takes `ringDelta` and sets `advanceFront(i, ringDelta, count)`; `cycle(step: RingStep)` (578-585) keeps the reduced-motion branch (`handleSwipe(step.ringDelta)` — instant reorder, no fly-off) and the single-pending guard (`if (pendingStep !== null) return; setPendingStep(step);`). `goTo` (587-589) and the counter (`frontIndex + 1`, 670) and the aria-live announcement (`frontIndex + 1`, 561-565) are UNCHANGED — they read forward again by construction once Next advances the ring forward.
      9. `handleKeyDown` (591-607): ArrowLeft/ArrowUp → `cycle(ringStep('previous'))`; ArrowRight/ArrowDown → `cycle(ringStep('next'))`; Home/End keep `goTo(0)` / `goTo(count - 1)`. KEEP the two explanatory comments and make the coupling impossible to reintroduce by naming both fields on the same lines: `cycle(ringStep('previous')); // Previous: right-fly-off (exit +1), ring -1 — brings the back card forward (req 7).` and `cycle(ringStep('next')); // Next: left-fly-off (exit -1), ring +1 — sends the front card to the back (req 7).` Per D-05 as amended: Prev/Next, Arrow keys and Home/End set the ring-buffer front index directly (there is no scroll band to target), the 44px focusable controls and the throttled aria-live announcement are unchanged, and reduced motion stays mount-gated.
      10. The controls (661-668 Prev, 672-679 Next): `onClick={() => cycle(ringStep('previous'))}` and `onClick={() => cycle(ringStep('next'))}`. Keep `aria-label="Previous project"` / `aria-label="Next project"`, the `h-[44px] min-w-[44px]` sizing, the ChevrUp/ChevronDown icons and the counter span exactly as they are.
      11. Per D-06: keep the stage the ONLY framer-motion import site (`useScroll`, `main.scrollTo`, `requestAnimationFrame`, `gsap`, `lottie`, `.animate(` must all stay absent), keep `grep -c "addEventListener\|ResizeObserver" src/components/explore/sections/projects-stack-stage.tsx` at 0, add no dependency (the count stays at 39), touch no data file, and honour the stale-test discipline by UPDATING the ring pins in place rather than deleting them (task 1). D-02 (curated imperfection), D-03 (curated variant table primary, name-hash fallback) and D-04 (in-card info on the active card) are re-affirmed and NOT touched by this plan.
    </action>
    <verify>
      Run, in this order: `node --test tests/projects-stack.test.mjs` (expect green), then `node --test tests/explore-visuals.test.mjs` (expect green — this task changes no pinned string in it), then `npm run typecheck`. Then re-measure the contract independently of the suite with:
      `node --input-type=module -e "import {cardState,advanceFront,ringDepth,ringStep} from './src/components/explore/projects-card-state.ts'; const C=6; const paths={next:ringStep('next'),prev:ringStep('previous'),swipeLeft:ringStep('swipe',-1),swipeRight:ringStep('swipe',1)}; for (const [k,s] of Object.entries(paths)) { const f=advanceFront(0,s.ringDelta,C); const dep=cardState(0,f,C,false); console.log(k, 'ringDelta', s.ringDelta, 'exitSign', s.exitSign, '| departing card 0 -> depth', ringDepth(0,f,C), 'z', dep.zIndex, 'opacity', dep.opacity); } console.log('prev inverts next:', advanceFront(advanceFront(0,-1,C),1,C) === 0);"`
      Expected measured output: `next ringDelta 1 exitSign -1 | departing card 0 -> depth 5 z 50 opacity 0.3`; `prev ringDelta -1 exitSign 1 | departing card 0 -> depth 1 z 90 opacity 0.95`; `swipeLeft ringDelta 1 exitSign -1 | departing card 0 -> depth 5 z 50 opacity 0.3`; `swipeRight ringDelta 1 exitSign 1 | departing card 0 -> depth 5 z 50 opacity 0.3`; `prev inverts next: true`. Paste the real output into the SUMMARY.
    </verify>
    <acceptance_criteria>
      - `node --test tests/projects-stack.test.mjs` exits 0 with zero failures and zero skips.
      - `node --test tests/explore-visuals.test.mjs` exits 0 (32/32 as delivered).
      - `npm run typecheck` exits 0.
      - The module exports the contract exactly once each: `grep -c "export function ringStep" src/components/explore/projects-card-state.ts` returns 1, `grep -c "export function advanceFront" …` returns 1, `grep -c "export function ringDepth" …` returns 1.
      - The module stays runtime-free: `grep -cE "^import|require\(" src/components/explore/projects-card-state.ts` returns 0.
      - The one-sign coupling is GONE from the stage: `grep -cE "cycle\(1\)|cycle\(-1\)" src/components/explore/sections/projects-stack-stage.tsx` returns 0; `grep -c "(frontIndex \+ direction" src/components/explore/sections/projects-stack-stage.tsx` returns 0; `grep -c "pendingSwipe" src/components/explore/sections/projects-stack-stage.tsx` returns 0.
      - Each control path consumes its named step: `grep -c "ringStep('next')" src/components/explore/sections/projects-stack-stage.tsx` returns 2 (key map + Next button); `grep -c "ringStep('previous')" …` returns 2; `grep -c "ringStep('swipe', accepted)" …` returns 1.
      - The pure derivations are consumed, not re-implemented: `grep -c "advanceFront(" src/components/explore/sections/projects-stack-stage.tsx` returns at least 2, `grep -c "ringDepth(" …` returns at least 2, and `grep -c "((index - frontIndex) % count" …` returns 0.
      - The intent comments survive and name both fields: `grep -c "Previous: right-fly-off" src/components/explore/sections/projects-stack-stage.tsx` returns 1 and `grep -c "Next: left-fly-off" …` returns 1 (AP-13 closes by making the code match these, never by deleting them).
      - Untouched contracts: `grep -cE 'aria-label="(Previous|Next) project"' src/components/explore/sections/projects-stack-stage.tsx` returns 2 (measured pre-edit: 2); `grep -c "h-\[44px\] min-w-\[44px\]" …` returns 2 (pre-edit: 2); `grep -c "aria-hidden={isFront ? undefined : 'true'}" …` returns 1 (pre-edit: 1); `grep -c "mounted ? prefersReduced : false" …` returns 1 (pre-edit: 1); `grep -c "drag={" …` returns 1 (pre-edit: 1); `grep -c -- "--panel-shadow-hover" …` returns 3 (pre-edit: 3 — the foreground card inline style, the single-project branch and the stage docstring).
      - The bans still hold: `grep -cE "useScroll|main\.scrollTo|requestAnimationFrame|gsap|lottie|\.animate\(" src/components/explore/sections/projects-stack-stage.tsx` returns 0 (pre-edit: 0), and `grep -cE "addEventListener|ResizeObserver" …` returns 0 (pre-edit: 0).
      - The module's untouched constants are byte-identical: `git diff -U0 src/components/explore/projects-card-state.ts | grep "^+" | grep -vE "^\+\s*(\*|//)" | grep -cE "LEVELS|IMPERFECTION|CURATED_VARIANTS|SWIPE_THRESHOLD"` returns 0 (added COMMENT lines are excluded, so a docstring that mentions LEVELS cannot false-positive; pre-edit `grep -c "frontIndex" src/components/explore/projects-card-state.ts` is 5 and must rise only by the new ring-depth lines).
    </acceptance_criteria>
    <done>GREEN commit landed: fix(10-07): decouple the fly-off side from the ring advance so both swipe sides loop the card to the back — the pure ring-step contract is the single mapping site and the scoped suites + typecheck are green.</done>
  </task>

  <task type="auto">
    <name>Task 3: Pin the call-site mapping in the EXPLORE-10 invariant and run the scoped gate</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>tests/explore-visuals.test.mjs, src/components/explore/sections/projects-stack-stage.tsx, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-VERIFICATION.md</read_first>
    <action>
      Extend the existing EXPLORE-10 invariant test (titled 'EXPLORE-10 invariant (REV-21): projects stack is swipe-driven, centered, loopable and shadowed', at 936 — do NOT renumber or rename it in this task; the id reclassification is plan 08's job) with the call-site mapping pins, so the gap cannot silently return through a call site even with the pure function correct. Read the stage source with the existing `read('…')` helper already used in that test.

      Add these assertions to that test's body, each with a message naming the clause it protects:
      1. Next path: `assert.ok(stack.includes("ringStep('next')"), 'the Next control advances the ring forward through the pure ring step (REV-18 loop-to-the-back; gap R6)')`.
      2. Previous path: the same for `"ringStep('previous')"`, message naming it as the exact inverse (brings the back card forward).
      3. Drag path: `assert.ok(/ringStep\('swipe', accepted\)/.test(stack), 'an accepted swipe supplies ONLY the exit sign; the ring delta comes from ringStep(\'swipe\', accepted)')`.
      4. The retired coupling is absent: `assert.ok(!stack.includes('cycle(1)') && !stack.includes('cycle(-1)'), 'the fly-off side is no longer the ring-rotation sign (the one-sign coupling that failed gap R6 is gone)')`.
      5. The pure derivations are consumed: `assert.ok(stack.includes('ringDepth(') && stack.includes('advanceFront('), 'the stage consumes the pure ring step and depth instead of re-deriving them')`.
      6. The module carries the contract (read `src/components/explore/projects-card-state.ts` with the same helper and assert the three `export function` declarations are present with their names), so a future refactor that moves the mapping back into the stage fails here.

      Keep every existing assertion in the test and in the file intact (the gone-checks, the framer-motion allowlist, the aria/controls/shadow pins, the AP-3/AP-6 pins). Then run the scoped gate in this order: `node --test tests/projects-stack.test.mjs`, `node --test tests/explore-visuals.test.mjs`, `npm run typecheck` — all three must exit 0 on the final workspace state of this plan.
    </action>
    <verify>`node --test tests/explore-visuals.test.mjs` exits 0 with the new mapping assertions present; `node --test tests/projects-stack.test.mjs` exits 0; `npm run typecheck` exits 0. Deliberately re-break the pin once to prove it bites: temporarily change `cycle(ringStep('next'))` to `cycle(ringStep('previous'))` on the Next button, confirm the EXPLORE-10 invariant test FAILS, then restore the file (`git diff` must be empty for that hunk afterwards) — record both runs in the SUMMARY.</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals.test.mjs` exits 0; `grep -c "^test(" tests/explore-visuals.test.mjs` returns at least 32 (no test lost).
      - The five new pins are present: `grep -c "ringStep('next')" tests/explore-visuals.test.mjs` returns at least 1, `grep -c "ringStep('previous')" …` returns at least 1, `grep -c "ringStep\\\\('swipe', accepted\\\\)" …` returns at least 1, `grep -c "cycle(1)" tests/explore-visuals.test.mjs` returns at least 1 (the negation pin) AND `grep -c "cycle(ringStep" src/components/explore/sections/projects-stack-stage.tsx` returns 2, `grep -c "ringDepth(" tests/explore-visuals.test.mjs` returns at least 1.
      - The counter-proof is recorded: the SUMMARY states the deliberate re-break, the observed failure message, and the restored state (`git diff src/components/explore/sections/projects-stack-stage.tsx` empty after restore).
      - No pre-existing EXPLORE-10 pin was removed: `grep -c "Projects carousel" tests/explore-visuals.test.mjs` and `grep -c "overflow-visible" tests/explore-visuals.test.mjs` are each at least 1, and `grep -c "AP-3/AP-6" tests/explore-visuals.test.mjs` returns at least 1.
      - `grep -c "test.skip\|describe.skip\|test.only" tests/explore-visuals.test.mjs` returns 0.
    </acceptance_criteria>
    <done>test commit landed: test(10-07): pin the ring-step call sites in the EXPLORE-10 invariant — the mapping is pinned end to end, the counter-proof is recorded and the scoped gate is green.</done>
  </task>
</tasks>

<verification_against_gap>
Every clause of gap R6 is closed by a measurable assertion, not by prose:

| gap R6 clause | pinned by |
|---|---|
| "the swiped card lands at depth = count - 1 ... for BOTH directions" | Task 1 assertions 5-6 (both swipe sides, every front index) + Task 2's independent probe (depth 5, z 50, opacity 0.30 for swipeLeft AND swipeRight) |
| "with Prev/Next and the counter/aria-live reading forward again" | Task 1 assertion 1 (Next = ring +1) + Task 3 pin 1; the counter derives from `frontIndex + 1` and was never changed — Task 2 step 8 records it as unchanged |
| "Decouple the fly-off side from the ring-rotation sign" | Task 2 steps 4-10 (`exitSign` vs `ringDelta` separate parameters) + acceptance grep `cycle(1)|cycle(-1)` → 0 + Task 3 pins 3-4 |
| "the stage's own comments ... describe the opposite of the delivered mapping" (AP-13) | Task 2 step 9 keeps both comments and makes the code match them; acceptance grep pins both strings |
| directive req 7 "Previous = bring the back card forward with a right-fly-off" | Task 1 assertions 4, 7-8 (`ringStep('previous')` = {ringDelta -1, exitSign 1}; the promoted card WAS at depth count-1) |
| directive req 4 "loopable ring buffer ... after the 6th card is swiped, the 1st returns to the front" | Task 1 assertion 9 (six-step round trip for all six cards on all three advancing paths) + the surviving loop-invariant test at 342 |
| REV-20 "accessible non-scroll alternative" | the keyboard paths consume the same `ringStep` contract as the gesture path (Task 2 steps 9-10, Task 3 pins 1-3); the reduced-motion branch keeps the instant reorder (Task 2 step 8) |

Nothing in this plan claims a browser-verified result. Every number above was measured in this planning session against the real module (`cardState(0,1,6,false)` → y -190, scale 0.80, opacity 0.30, z 50; `cardState(0,5,6,false)` → y -38, scale 0.96, opacity 0.95, z 90) and the arithmetic in Task 2's verify re-measures it from the delivered exports.
</verification_against_gap>
