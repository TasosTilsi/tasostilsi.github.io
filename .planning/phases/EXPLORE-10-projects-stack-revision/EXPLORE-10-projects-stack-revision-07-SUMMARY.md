---
phase: 10-projects-stack-revision
plan: 07
subsystem: explore/projects-stack
status: complete
tags: [gap-closure, tdd, ring-buffer, swipe-stack, r6, ap-13, pure-module]
dependency_graph:
  requires:
    - EXPLORE-10-projects-stack-revision-06
  provides:
    - src/components/explore/projects-card-state.ts#ringStep
    - src/components/explore/projects-card-state.ts#advanceFront
    - src/components/explore/projects-card-state.ts#ringDepth
    - src/components/explore/projects-card-state.ts#RingStep
    - tests/projects-stack.test.mjs#ring-step-contract
    - tests/explore-visuals.test.mjs#EXPLORE-10-call-site-pins
  affects:
    - src/components/explore/sections/projects-stack-stage.tsx
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-VERIFICATION.md
tech_stack:
  - TypeScript erasable-syntax pure module (zero runtime imports)
  - React 18 client island / framer-motion 13.4.3 drag="x" (single sanctioned import site)
  - node --test (Node 24 type stripping, direct .ts import)
key_files:
  created: []
  modified:
    - src/components/explore/projects-card-state.ts
    - src/components/explore/sections/projects-stack-stage.tsx
    - tests/projects-stack.test.mjs
    - tests/explore-visuals.test.mjs
  deleted: []
decisions:
  - "Gap R6 resolved in CODE (verification option R1), not by amending the contract (option R2): the directive (TASK.md req 3/req 7) and the stage's own comments already state the intended mapping, so the wiring was wrong, not the text"
  - "assumption_delta: PROMOTE the ring advance to the named pure ringStep(source, gesture) -> { ringDelta, exitSign } and DEMOTE the fly-off side to a presentation-only field; add-alongside NO - the one-sign formulation is deleted at all three call sites"
  - "Swipe on either side is ringDelta +1 with exitSign = gesture; the swipe arm must never branch on the gesture for the delta - that identity IS the fix"
  - "Previous is the exact inverse (ringDelta -1, exitSign +1) per directive req 7 'mirrored directions' and REV-18 'step the same ring buffer'; its one recorded consequence is that the departing foreground card lands at depth 1 (the peek) at ring-1"
  - "The counter and the throttled aria-live were NOT changed - they derive from frontIndex + 1, so they read forward again by construction once Next advances the ring forward"
  - "AP-13 closes by making the code match the two comments at the keyboard map, never by deleting them: both fields are named inline on the same lines so the coupling cannot be reintroduced"
  - "D-01/D-05 as amended, D-02/D-04/D-06, the LEVELS table, the curated variant table + name-hash fallback (plan 04) and the mount-gated reduced motion (plan 05) are all untouched"
  - "Commit scope is the zero-padded 10-07 the plan's own <gap_resolution> prescribes (matching lib/_agents.js {phase}-{plan} and plans 04/05/06), not the spawn prompt's long form; the phase-level skip_gates: [tdd_audit] decision from plan 06 is unaffected and not re-litigated"
metrics:
  duration_minutes: 25
  completed_date: "2026-10-02"
  tasks: 3
  commits: 3
actuals:
  tokens: null
  tasks: 3
  commits: 3
---

# Phase 10 Plan 07: Ring-Step Decoupling (gap R6) Summary

Closed the phase's only verification gap by promoting the ring advance to a pure, unit-tested mapping and demoting the fly-off side to a presentation field — so an accepted swipe on **either** side, and the Next control, now send the departing foreground card to the BACK of the stack while Previous exactly inverts Next.

## What changed

Four files, three atomic commits, no new dependency, no layout/geometry/a11y change.

### `src/components/explore/projects-card-state.ts` (411 lines, was 344; **67 insertions / 0 deletions**)

Added the ring-step contract immediately after `swipeAccepts`, in the module's existing docstring voice and its erasable-syntax discipline (no `enum`, no `namespace`, no runtime import — `grep -cE "^import|require\("` = 0):

- `export type RingSource = 'swipe' | 'next' | 'previous'`
- `export interface RingStep { ringDelta: -1 | 1; exitSign: -1 | 1 }`
- `export function ringStep(source, gesture?): RingStep` — `next` → `{ ringDelta: 1, exitSign: -1 }`; `previous` → `{ ringDelta: -1, exitSign: 1 }`; `swipe` → **always** `{ ringDelta: 1, exitSign: gesture === -1 ? -1 : 1 }`. The swipe arm does not branch on the gesture for the delta; an absent, `0` or non-finite gesture defaults the exit sign to `+1`, so the return is always a finite ±1.
- `export function advanceFront(frontIndex, ringDelta, count): number` — the module's ONE index-advance site, `((front + delta) % c + c) % c` over the safe values (non-finite front/delta → `0`; non-finite or `<= 0` count → a one-card ring), always a finite integer in `[0, count)`.
- `export function ringDepth(cardIndex, frontIndex, count): number` — the module's ONE cyclic-depth site, same guards.

Untouched and byte-identical: `cardState`, `LEVELS`, `IMPERFECTION_*`, `CURATED_VARIANTS`/`HASH_VARIANTS`/`projectVisualVariant`, `TECH_LEXICON`/`projectTechnologies`, `firstSentence`, `projectYear`, `swipeAccepts`, `SWIPE_THRESHOLD`, `SWIPE_VELOCITY_THRESHOLD`. Measured: `git diff -U0` added non-comment lines matching `LEVELS|IMPERFECTION|CURATED_VARIANTS|SWIPE_THRESHOLD` = **0**; deleted lines = **0**.

### `src/components/explore/sections/projects-stack-stage.tsx` (752 lines, was 748; 35 insertions / 31 deletions)

The three step paths now consume the pure mapping; nothing else changed (no geometry constant, no layout class, no aria attribute, no reduced-motion gate, no visual):

| path | before | after |
|---|---|---|
| drag (`handleDragEnd`) | `performExit(accepted)` — one sign drove both exit and rotation | `const step = ringStep('swipe', accepted); performExit(step.exitSign, step.ringDelta)` |
| Next (button, ArrowRight, ArrowDown) | `cycle(-1)` | `cycle(ringStep('next'))` — ring **+1**, exit **-1** |
| Previous (button, ArrowLeft, ArrowUp) | `cycle(1)` | `cycle(ringStep('previous'))` — ring **-1**, exit **+1** |

- `performExit(exitSign: SwipeDirection, ringDelta: -1 | 1)`: `x/rotate` use `exitSign`; `newFront = advanceFront(frontIndex, ringDelta, count)`; the compact re-layout rule is `ringDepth(index, newFront, count) > 1`; `onSwipe(ringDelta)`.
- `pendingSwipe: SwipeDirection | null` → `pendingStep: RingStep | null` (state, prop, destructure, pending effect).
- `handleSwipe(ringDelta)` → `setFrontIndex((i) => advanceFront(i, ringDelta, count))`; `cycle(step: RingStep)` keeps the reduced-motion instant-reorder branch (`handleSwipe(step.ringDelta)`) and the single-pending guard unchanged.
- The two inline `((index - frontIndex) % count + count) % count` derivations were replaced by `ringDepth(...)`.
- `goTo`, the `NN / 06` counter, the throttled `aria-live` announcement, `SwipeDirection` (now documented as the fly-off side only), all a11y attributes, the 44px controls, the bloom shadow and the drag prop are unchanged.

### `tests/projects-stack.test.mjs` (766 lines, was 621) — the RED commit

Three new tests, 26 → 29 total, no existing test or assertion removed or weakened:

1. `ringStep: the Next step sends the foreground card to the back (tracer)` — the thinnest end-to-end slice: pure export → `advanceFront(0, 1, 6) === 1` → `ringDepth(0, 1, 6) === COUNT - 1`, plus the user-visible geometry `cardState(0, 1, 6, false)` → `zIndex 50 / opacity 0.30 / translateY -190 / scale 0.80 / visible true`.
2. `ringStep: the direction map — both swipe sides advance the ring, the fly-off side is presentation only` — both swipe sides yield `ringDelta 1` and differ only in the exit sign; the three defensive defaults; and depth `count - 1` for **every** front index on **every** advancing path.
3. `ringStep: Previous is the exact inverse of Next and promotes the back card` — `advanceFront(advanceFront(f, ±1), ∓1) === f`; the promoted card WAS at depth `count - 1` and IS at depth 0; the six-step round trip over all six real top-6 projects (all six curated variants) on all three advancing paths; and totality probes over `NaN`/`±Infinity`/`0`/`1`/`5` for every argument.

### `tests/explore-visuals.test.mjs` (1092 lines, was 1044) — the call-site pins

The existing `EXPLORE-10 invariant (REV-21)` test (not renumbered, not renamed — the id reclassification is plan 08's) gained the call-site mapping pins: `ringStep('next')` / `ringStep('previous')` present, the drag path matches `/ringStep\('swipe', accepted\)/`, **exactly two** call sites per control (key map + button — the pin that bites), the retired `cycle(1)`/`cycle(-1)` coupling absent, `ringDepth(`/`advanceFront(` consumed by the stage, and the three `export function` declarations present in the pure module. Every pre-existing assertion (gone-checks, framer-motion allowlist, aria/controls/shadow pins, AP-3/AP-6 pins) is intact; 32 tests before and after.

## Commits

1. `320c7a0` `test(10-07): pin the ring-step contract (Next to the back, both swipe sides advance, Previous inverts Next)` — 1 file, +145
2. `7547bee` `fix(10-07): decouple the fly-off side from the ring advance so both swipe sides loop the card to the back` — 2 files, +102 / -31
3. `ce5f495` `test(10-07): pin the ring-step call sites in the EXPLORE-10 invariant` — 1 file, +48

`git diff --name-only HEAD~3 HEAD` lists exactly the plan's four `<files_modified>` entries — no other path touched.

## RED / GREEN evidence

**RED (measured, task 1, committed at `320c7a0`).** `node --test tests/projects-stack.test.mjs` → **exit 1**, 0 pass / 1 fail, from a module-resolution error at the new import block:

```
file:///home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/projects-stack.test.mjs:38
  advanceFront,
  ^^^^^^^^^^^^
SyntaxError: The requested module '../src/components/explore/projects-card-state.ts' does not provide an export named 'advanceFront'
```

Re-measured immediately before the first implementation edit (same output, exit 1) on the unmodified module. The RED is a missing-export error naming the ring-step contract, not an assertion inside an unrelated test.

**GREEN (measured, task 2/3).** `node --test tests/projects-stack.test.mjs` → **29 pass, 0 fail, 0 skipped** (was 26). `node --test tests/explore-visuals.test.mjs` → **32 pass, 0 fail, 0 skipped**. `npm run typecheck` → **exit 0**.

**Independent probe (task 2's `<verify>`, run against the delivered exports, not the suite):**

```
next       ringDelta  1 exitSign -1 | departing card 0 -> depth 5 z 50  opacity 0.3
prev       ringDelta -1 exitSign  1 | departing card 0 -> depth 1 z 90  opacity 0.95
swipeLeft  ringDelta  1 exitSign -1 | departing card 0 -> depth 5 z 50  opacity 0.3
swipeRight ringDelta  1 exitSign  1 | departing card 0 -> depth 5 z 50  opacity 0.3
prev inverts next: true
```

Exactly the expected output in the plan (the `prev` row is the recorded ring-1 consequence: the departing foreground card lands at the peek, and the card that WAS at the back is promoted).

**Counter-proof (task 3 `<verify>`, deliberate re-break).** Temporarily changed the Next button's `cycle(ringStep('next'))` to `cycle(ringStep('previous'))` and re-ran the EXPLORE-10 invariant:

```
✖ EXPLORE-10 invariant (REV-21): projects stack is swipe-driven, centered, loopable and shadowed
  AssertionError [ERR_ASSERTION]: exactly two Next call sites — the ArrowDown/ArrowRight key map and the Next button (a swapped control fails here)
  1 !== 2
      at TestContext.<anonymous> (file:///home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/explore-visuals.test.mjs:1017:10)
ℹ pass 31 / ℹ fail 1
```

Restored with `git checkout -- src/components/explore/sections/projects-stack-stage.tsx`: `git diff <stage>` → **empty**, and the suite returned to **32/32**.

**Full gate on the final tree (chronologically last action, re-run after this SUMMARY was written):** `npm run typecheck` exit 0 → `npm run build` exit 0 (`✓ Exporting (2/2)`; static routes `/`, `/_not-found`, `/cli`, `/resume`) → `node --test tests/*.test.mjs` **292 pass, 0 fail, 0 skipped**. The deltas attributable to this plan are `tests/projects-stack.test.mjs` 26 → 29 (+3) and `tests/explore-visuals.test.mjs` 32 → 32 (0); the remaining suite growth came from work landed on this branch after the phase-10 verification.

**Pre-build environment check.** `ss -ltnp` shows a listener on `:3000` (pid 17178, `node .../node_modules/.bin/serve ./out`, cwd = this repo) — the repo's static server over the exported `out/`, **not** a Next.js dev server; `ps` shows no `next dev`/`next-server` process and `npm run dev` uses port 9002 (free), so the `nextjs-dev-build-conflict` skill does not apply and the build ran without stopping the user's static server.

## Requirement / must-have coverage

| must-have truth | pinned by |
|---|---|
| Every accepted swipe, left or right, sends the foreground card to the back | Task 1 assertions 5-6 (both sides, every front index) + the independent probe (`swipeLeft` AND `swipeRight` → depth 5, z 50, opacity 0.30) + Task 3 pins 3-4 |
| The Next control advances the ring FORWARD (counter `01 → 02`) | Task 1 assertion 1-2 + Task 3 count pin; the counter derives from `frontIndex + 1` and was never changed |
| The Previous control is the exact inverse (counter `01 → 06`, back card promoted) | Task 1 assertions 4, 7-8 + Task 3 pin 2 |
| Fly-off SIDE and ring DELTA are separate inputs, not one shared sign | `ringStep`/`RingStep` in the pure module + acceptance grep `cycle(1)\|cycle(-1)` → 0 + `pendingSwipe` → 0 + Task 3 pins 1-3, 6 |
| Round-trip over every supported variant | Task 1 assertion 9 (six cards / all six curated variants, three advancing paths, deep-equality of the arrangement) + the surviving `loop invariant` and `reversibility` tests |
| Reduced motion keeps identical ring semantics with no fly-off | `cycle`'s unchanged RM branch calls `handleSwipe(step.ringDelta)` — the same ring step as the motion path, minus the fly-off |

REV-18 (loop-to-the-back, both directions) and REV-20 (keyboard/RM/cleanup/mobile contracts) are the covered requirement ids; the stage's a11y attributes, 44px controls, throttled announcement, unmount behaviour and the dual-engine ban are measured unchanged.

## Deviations

1. **Two task acceptance greps were unsatisfiable as literally written; both were measured and are reported with the value actually delivered.**
   - Task 1: "the failure message names `ringStep`". Node reports the **alphabetically first** missing export of the merged import specifiers, so with all three new exports absent the message names `advanceFront`. Probed directly: with `ringStep` as the only missing import the message is `does not provide an export named 'ringStep'`, and splitting the imports into separate statements does not change the order. The criterion's intent — a module-exports error naming the ring-step contract, not an unrelated assertion — is met and evidenced above.
   - Task 3: "`grep -c "cycle(ringStep" …` returns 2". It returns **4** — the key map and the button for each of the two controls. This is what the plan's own Task 2 steps 9-10 prescribe, and it is consistent with the sibling criteria in the same list (`ringStep('next')` = 2 and `ringStep('previous')` = 2); a count of 2 would contradict those. The measured 4 is reported.
2. **Commit scope.** The spawn prompt asked for `(EXPLORE-10-projects-stack-revision-07)`; the three commits carry the zero-padded `(10-07)`, which is what the plan's own `<gap_resolution>` prescribes ("this plan's commits follow the zero-padded `{phase}-{plan}` scope `10-07` with the `test(10-07):` commit FIRST"), what `lib/_agents.js:160` derives, and what plans 04/05/06 already used. Measured: `new RegExp('\\(10-07\\)')` matches `fix(10-07): x` → `true`; `(EXPLORE-10-projects-stack-revision-07)` → `false`.
3. **Counter-proof mutation method.** The deliberate re-break was applied with an edit and reverted with `git checkout -- <path>` (a working-tree restore of a committed file, not `reset --hard`/`clean`/`stash`). Verified afterwards: `git diff` for the stage is empty and the suite is 32/32.
4. **Intermediate edit slip, no trace in the delivered artefact.** One docstring line of `cardState` ("`foreground is frontIndex across count cards.`") was clipped by a malformed edit while inserting the contract and restored byte-identically before the GREEN commit: `git diff -U0 src/components/explore/projects-card-state.ts` reports **67 insertions, 0 deletions**, so nothing was removed from the module.
5. **`cycle(ringStep` count in the counter-proof message.** The pin's failure message names the two Next call sites; the count assertion is what fails, which is the intended bite (a corrected module plus a swapped control is still broken).

## TDD Gate Compliance

`type: tdd`, and the gate's requirement is satisfied on this plan's own terms: the **first** scope-matching commit is `320c7a0 test(10-07): …`, followed by `7547bee fix(10-07): …` and `ce5f495 test(10-07): …`. RED precedes GREEN, and the RED was re-measured on the unmodified module immediately before the first implementation edit.

The phase-level decision recorded in `CONTEXT.md` Sweep 7 — ship phase 10 with `skip_gates: ["tdd_audit"]` because plan-01's already-landed long-form commit scope cannot be matched by the gate and a landed history cannot be fixed by editing a plan document — is unaffected by this plan, is not re-litigated here, and makes **no** claim that the phase satisfies `tdd_audit` as a whole.

## Known Stubs

None. `grep -nE "TODO|FIXME|XXX|placeholder|HACK|@ts-ignore"` is empty across all four changed files, and no `test.skip`/`describe.skip`/`test.only` marker exists in either suite (measured: 0 in both, before and after).

## Threat Flags

None. The change is a pure-module addition plus a call-site rewiring in one already-sanctioned client island: no new dependency (`package.json` dependencies still 39), no data-file change, no network/filesystem/user-input surface, no `<img>`/`url(`/asset fetch, no new event listener or `ResizeObserver` (measured 0), and no second `framer-motion` import site (`useScroll`, `main.scrollTo`, `requestAnimationFrame`, `gsap`, `lottie`, `.animate(` all measured 0 in the stage). External links and their `rel` attributes were not touched.

## Deferred / not claimed

- **No browser-verified or visually-measured result is claimed.** The five human-verification items from `EXPLORE-10-projects-stack-revision-VERIFICATION.md` (swipe feel; shadow bloom in both themes; the 75-85% visual-area proportion with the 375px invariant; OS reduced-motion browser parity with a clean console; keyboard/screen-reader pass) remain open. Every number in this SUMMARY is a shell measurement or a test result.
- **One behaviour change for the `<md` compact stack is a consequence, not a side effect to be hidden:** after a swipe the departing card now sits at depth 5 and is `compactHidden`, so the mobile peek shows the card that was at depth 2 rather than the one just swiped. That is the delivered ring semantics (`REV-18` loop-to-the-back) applied to the shared stack, and the compact mode is the same `ProjectsSwipeStack` delegate already recorded as accepted deviation AP-2.
- `VERIFICATION.md` was deliberately not modified (re-verification rewrites it), `STATE.md` was not modified, and no other plan's files or SUMMARYs were touched. The pre-existing modified `.planning/async-jobs.json` runtime artefact and the untracked working-tree files (`.cursor/`, `.serena/`, `.deepindex.db`, `tsconfig.tsbuildinfo`, `PRODUCT.md`, `doublecheck-report.md`, `resume-*.pdf/png`) were not added to any commit.
- Deferred ideas untouched: real screenshots replacing the generative visuals; cards for the other 8 projects; the terminal/command-driven About-skill direction.

## Self-Check: PASSED

- All three commits exist in `git log` with the gate-matching `(10-07)` scope: `320c7a0` (1 file), `7547bee` (2 files), `ce5f495` (1 file); `git status --porcelain` shows no modified tracked file under `src/` or `tests/`.
- Every file named in this SUMMARY exists with the expected line count: `projects-card-state.ts` **411** (min 344), `projects-stack-stage.tsx` **752** (min 640), `tests/projects-stack.test.mjs` **766** (min 444), `tests/explore-visuals.test.mjs` **1092** (min 950).
- The module's export surface is complete: live `import()` probe lists all 12 required exports (`cardState`, `ringStep`, `advanceFront`, `ringDepth`, `projectVisualVariant`, `djb2`, `firstSentence`, `projectYear`, `projectTechnologies`, `swipeAccepts`, `SWIPE_THRESHOLD`, `SWIPE_VELOCITY_THRESHOLD`) → `missing: none`.
- All key links are wired: `tests/projects-stack.test.mjs` imports the pure module by static relative `.ts` path; the stage consumes `ringStep(` / `advanceFront(` / `ringDepth(`; the drag path matches `ringStep('swipe', accepted)`; `tests/explore-visuals.test.mjs` pins `ringStep('next'|'previous')` and the exact per-control call-site counts.
- Both RED/GREEN and the counter-proof are measured, not remembered, and the counter-proof's restore was verified (`git diff` empty, suite back to 32/32).
- The full gate (typecheck + build + full suite) was re-run **after** this SUMMARY was written and is the chronologically last action of the plan: typecheck exit 0, build exit 0 with `✓ Exporting (2/2)`, **292 pass / 0 fail / 0 skipped**.
