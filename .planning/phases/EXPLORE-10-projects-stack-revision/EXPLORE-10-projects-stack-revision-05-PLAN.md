---
phase: 10-projects-stack-revision
plan: 05
type: tdd
wave: 4
depends_on:
  - "EXPLORE-10-projects-stack-revision-04"
  - "EXPLORE-10-projects-stack-revision-02"
files_modified:
  - "src/components/explore/sections/projects-stack-stage.tsx"
  - "src/components/explore/explore-panels.tsx"
  - "tests/explore-visuals.test.mjs"
autonomous: true
requirements: ["REV-18", "REV-20"]
gap_closure: true
user_setup: []
must_haves:
  truths:
    - "Reduced motion on the Projects stack is mount-gated: the RM preference read from matchMedia is applied only after a mount-only effect flips a mounted flag, so the first client render reproduces the server's non-RM geometry and a user with OS reduced motion ON gets no hydration style mismatch or first-paint flash (after mount the RM contract takes over unchanged: opacity/zIndex swaps, zero translate/scale/rotation)."
    - "Consequence (W-6 demoted from truth): no stray 'aria-hidden' class token is emitted in the RENDERED card markup — the class name disappears from the delivered DOM while the real aria-hidden attribute stays on every non-front card."
    - "Consequence (W-6 demoted from truth): no hydration mismatch and no first-paint RM flash for a reduced-motion user (the observable outcome of the mount gate)."
    - "explore-panels.tsx documents the delivered placement map — only Experience carries the extended sticky range and its data gate; Projects renders at natural height with the swipe-driven stack; data-editorial-wrapper stays on every grid child as a test-pinned hook that NO file in src/ reads (the Experience stage measures .explore-shell > main through its hand-rolled hook, use-timeline-progress.ts:104)."
    - "The dual-engine comment in tests/explore-visuals.test.mjs names the swipe-driven stack stage (not the retired editorial stage) as the single framer-motion import site, so the allowlist's stated rationale matches the allowlist."
    - "The variant-selection assertion message in tests/explore-visuals.test.mjs names the curated per-project table as the primary selector with the name-hash as fallback, so the suite's stated contract matches the module plan 04 delivers (the assertion predicate stays untouched)."
  artifacts:
    - path: "src/components/explore/sections/projects-stack-stage.tsx"
      provides: "Swipe-driven stack stage with mount-gated reduced motion, attribute-only non-active-card marking, and the unchanged drag/keyboard/aria-live/shadow/generative-dispatch contracts."
      min_lines: 640
      exports: ["ProjectsStackStage", "ProjectsSwipeStack"]
    - path: "src/components/explore/explore-panels.tsx"
      provides: "Panel grid with an accurate module docstring describing the delivered placement map (Experience-only sticky range; Projects at natural height)."
      min_lines: 120
      exports: ["ExplorePanels"]
    - path: "tests/explore-visuals.test.mjs"
      provides: "Cross-cutting integration suite with the AP-3/AP-6 structural pins, the corrected dual-engine rationale comment, and the corrected variant-selection assertion message."
      min_lines: 950
      exports: []
  key_links:
    - from: "tests/explore-visuals.test.mjs"
      to: "src/components/explore/sections/projects-stack-stage.tsx"
      via: "source-invariant assertions: the mount-gated RM derivation is present and the no-op aria-hidden class token is absent"
      pattern: "setMounted\\(true\\)|mounted \\? [A-Za-z]+ : false"
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/use-timeline-progress.ts"
      via: "the Experience placement is the ONE remaining extended sticky range (wrapper md:col-span-2 md:h-[300vh], shell pinned) whose scroll position the hand-rolled hook reads from .explore-shell > main; the wrapper's data-editorial-wrapper attribute is read by nothing, and the docstring/comment must say so"
      pattern: "md:h-\\[calc\\(100dvh-10rem\\)\\]"
---

<objective>
Close two verification findings that are real defects in the delivered tree, plus three stale records that contradict it:

- AP-3 (WARNING, reduced-motion hydration parity): `ProjectsSwipeStack` reads `useReducedMotion()` directly (`projects-stack-stage.tsx:537`). Framer's hook initialises from `matchMedia` during the first client render — `node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs` does `const [shouldReduceMotion] = useState(prefersReducedMotion.current)` — while the server render always resolves `false`. For a user with OS reduced motion ON, the first client render therefore produces different card geometry than the SSR markup (a hydration style mismatch and a visible flash). The verifier's own conclusion: "Requires a browser check (see Human Verification 4)"; this plan removes the structural cause and leaves the browser confirmation as the recorded human item.
- AP-6 (INFO): `projects-stack-stage.tsx:504` puts the literal class token `'aria-hidden'` in the card className — a no-op class. The real `aria-hidden` prop is already correct at line 518.
- AP-5 (INFO): `explore-panels.tsx:19-21` and `28-31` still state that every panel carries its own sticky range and that Projects is gated on the top-6 slice, while the delivered placement map sets `projects: { wrapper: '', shell: '', gate: false }` (line 121-124) and `data-editorial-wrapper` now serves the Experience stage only.
- AP-4 (INFO): `tests/explore-visuals.test.mjs:616-622` still calls the framer-motion import site "the projects editorial scroll's framer-motion stage" / "the editorial stage is the ONE import site" — the stage has been swipe-driven since commit b39b12c.
- Variant-selector message drift (same class as AP-4, measured): `tests/explore-visuals.test.mjs:970` asserts the message "generative visuals selected by the name-hash helper", while plan 04 (which lands FIRST — wave 1) makes the curated per-project table the primary selector and demotes the hash to the fallback. The assertion predicate is correct; only its stated contract is stale.

RED is on record (measured against this tree before planning):

  FAIL  mount-gated reduced motion (AP-3)          -> regex /mounted ? [A-Za-z]+ : false/ absent, 'setMounted(true)' absent
  FAIL  no no-op aria-hidden class token (AP-6)    -> "isFront ? '' : 'aria-hidden'" present at line 504
  (stale-record checks: 'EACH now carrying its own' @explore-panels.tsx:19, 'projects on the top-6' @:30,
   'projects editorial scroll' @explore-visuals.test.mjs:619, 'the editorial stage is the' @:621,
   'name-hash helper' @explore-visuals.test.mjs:970 — all present, count 1 each)

Why this plan is wave 2, not wave 1: it runs `npm run build` and the full suite at the end of each task, and this phase executes in a single worktree (`use_worktrees: false`). Two concurrent `next build` runs race on `.next/` — the exact hazard this plan's own verify block warns about (`nextjs-dev-build-conflict`) — and this plan's task 2 asserts that plan 04's dispatch-coverage test still passes, so plan 04's suite must be final before that assertion runs. Sequencing 04 (wave 1) → 05 (wave 2) → 06 (wave 3) removes both races; the dependency is declared in `depends_on` rather than assumed.

Scope guard: this plan does NOT touch variant selection, `projects-card-state.ts` or `tests/projects-stack.test.mjs` (plan 04 owns those), does NOT touch the GenerativeVisual dispatch or any variant name, does NOT re-open the swipe interaction, and does NOT add ResizeObserver/window listeners or the retired scroll band. The Experience panel stays untouched — its sticky range is the one the docstring must describe.
</objective>

<assumption_delta_decision>
- primary noun: the mount-gated reduced-motion read (`const reducedMotion = mounted ? prefersReduced : false`) as the single RM input for the stack.
- demoted noun: the raw first-render `useReducedMotion()` value as a render-time input.
- decision: promote
- rationale: the raw value is the SSR-unsafe representation (it can differ from the server on the very first client render); the mount-gated derivation is the general representation that holds for every supported variant — RM on, RM off, no-JS/SSR, and hydration — because the server-rendered and first-client-rendered trees are then identical by construction.
- invariant (every supported variant round-trips through the primary path): SSR/no-JS renders the non-RM geometry; first client render reproduces it exactly; after mount, an RM-on user gets the opacity/zIndex-only state swaps and an RM-off user gets the fly-off/loop choreography; `prefers-reduced-motion` CSS suppression is untouched. The suite pins the structural gate; the visual parity itself is the recorded human item.
- NOT add-alongside: the raw pre-mount value is not consumed anywhere afterwards, so no accepted debt is created.
</assumption_delta_decision>

<red_evidence>
Measured on this tree before planning (one-shot structural probe over the delivered sources, exit code 1):

  FAIL  mount-gated reduced motion (AP-3)
  FAIL  no no-op aria-hidden class token (AP-6)
  PASS  panels docstring: per-panel sticky-range claim
  PASS  panels docstring: Projects sticky claim
  PASS  dual-engine comment: swipe stack named
  RED: 2 assertion(s) FAIL today          [exit code 1]

Two corrections the probe forced into this plan, both verified with line-level `grep -n` before writing the acceptance criteria:

1. The two PASSes above are FALSE GREENS produced by whitespace-naive substring checks: `explore-panels.tsx` wraps its JSDoc with a leading `*`, and `tests/explore-visuals.test.mjs` wraps its comment with `//`, so a single-string `includes()` over a comment block silently misses the phrase. The stale text is real and verified line-by-line: `explore-panels.tsx:19` "EACH now carrying its own", `:20` "sticky range (wrapper span-2 + extended height, shell pinned inside it —", `:27` "EACH system's", `:30` "projects on the top-6"; `explore-visuals.test.mjs:619` "projects editorial scroll's framer-motion stage", `:621` "the framer-motion ban becomes the ALLOWLIST — the editorial stage is the". Every acceptance check in this plan therefore uses LINE-LEVEL fragments, never a whitespace-naive substring check over a comment block.
2. `data-editorial-wrapper="true"` is written at `explore-panels.tsx:161` and READ BY NOTHING under `src/` — the only other reference in the repo is the assertion message at `tests/explore-visuals.test.mjs:945`. The Experience stage's hand-rolled hook measures `.explore-shell > main` (`MAIN_SELECTOR = '.explore-shell > main'`, `use-timeline-progress.ts:104`) and does not use framer's scroll hook at all. The comment at `explore-panels.tsx:153-156` claiming the attribute is "the Experience stage's useScroll target" is therefore stale on both counts and is corrected by task 3; the attribute itself is left in place (removing it would touch a pinned assertion) and is recorded as a residual observation.
3. The variant-selector message drift is measured today, not inferred: `grep -n "name-hash helper" tests/explore-visuals.test.mjs` returns exactly one line, 970, inside the EXPLORE-10 swipe-driving invariant test. Plan 04 (wave 1) makes `CURATED_VARIANTS` primary and keeps `djb2 % 4` as the fallback, so the message must be corrected in the same phase that changes the mechanism. The assertion's predicate (`stack.includes('projectVisualVariant')`) stays exactly as it is.
</red_evidence>

<context>
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/sections/projects-stack-stage.tsx (line 24 React imports; line 502-506 className; line 518 aria-hidden prop; line 537 `const reducedMotion = useReducedMotion() ?? false;`; 364-383 GenerativeVisual dispatch — read-only)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/explore-panels.tsx (docstring 16-34; placement map 118-124; data-editorial-wrapper at 161)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/explore-visuals.test.mjs (dual-engine comment 616-622; the EXPLORE-10 swipe invariant at 934-988 including the stale variant-selector message at 970; the allowlist loop at 629-640)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs (the `useState(prefersReducedMotion.current)` init that makes the raw read SSR-unsafe)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/app/globals.css (647-660 — the CSS reduced-motion guard, untouched)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-VERIFICATION.md (AP-3, AP-4, AP-5, AP-6 and Human Verification 4)
</context>

<retired_contract_note>
This plan declares `depends_on` plan 02 as well as plan 04 (both are wave-2 edits to `src/components/explore/sections/projects-stack-stage.tsx`; plan 02 authored that file earlier in this phase, so the coupling is declared rather than left as a same-wave overlap). Consequence to read correctly: the executor is handed plan 02's SUMMARY as prior-wave context, and that SUMMARY records the RETIRED scroll-driven design — it carries 5 lines matching plan 06's retired-token sweep set. Treat every one of them as history. The delivered contract for the file this plan edits is the swipe-driven ring buffer `cardState(cardIndex, frontIndex, count, reducedMotion)`; this plan's own scope guard already forbids the retired additions, and plan 06 quarantines the retired wording in the contract documents.
</retired_contract_note>

<tasks>
  <task type="test">
    <name>Task 1: RED — pin the mount-gated RM derivation and the real aria-hidden marker in tests/explore-visuals.test.mjs</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>src/components/explore/sections/projects-stack-stage.tsx, tests/explore-visuals.test.mjs</read_first>
    <action>
      Add ONE new test to `tests/explore-visuals.test.mjs`, immediately after the existing `EXPLORE-10 invariant (REV-21): projects stack is swipe-driven, centered, loopable and shadowed` test, titled exactly:
      `EXPLORE-10 invariant (AP-3/AP-6): the stack mount-gates reduced motion and marks non-active cards by attribute only`.
      Use the file's existing `read()` helper (the same one the neighbouring EXPLORE-10 test uses) to load `src/components/explore/sections/projects-stack-stage.tsx` into a local `stack` constant, then assert:
      1. `stack.includes('setMounted(true)')` with message 'the mount-only effect flips the mounted flag (AP-3 hydration parity)'.
      2. The mount-gated derivation matches the regex `/mounted \? [A-Za-z]+ : false/` with message 'the reduced-motion value consumed by cardState is gated on the mounted flag (AP-3)'.
      3. `stack.includes('useReducedMotion')` with message 'framer reduced-motion detection is still used (D-05 contract survives)'.
      4. `!stack.includes("isFront ? '' : 'aria-hidden'")` with message 'the className carries no no-op aria-hidden class token (AP-6)'.
      5. `stack.includes("aria-hidden={isFront ? undefined : 'true'}")` with message 'the real aria-hidden prop remains on non-front cards (AP-6)'.
      Do not modify or delete the existing EXPLORE-10 invariant test in that file, and do not touch any other assertion (the variant-selector message at line 970 is corrected by task 3, not here). Assertions 1 and 2 (and 4) are the RED signal; 3 and 5 already pass and must stay passing.
    </action>
    <verify>Run `node --test tests/explore-visuals.test.mjs`. Expect RED: the new test fails on the mount-gate assertions (and on the no-op class token), while every pre-existing test in the file still passes.</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals.test.mjs` exits non-zero, and the only failing test is the new `EXPLORE-10 invariant (AP-3/AP-6)` test.
      - `grep -c "EXPLORE-10 invariant (AP-3/AP-6)" tests/explore-visuals.test.mjs` returns 1.
      - `grep -c "setMounted(true)" tests/explore-visuals.test.mjs` returns at least 1.
      - `grep -c "EXPLORE-10 invariant (REV-21)" tests/explore-visuals.test.mjs` still returns 1 (the existing invariant was not replaced).
      - No test is skipped: `grep -c "test.skip\|describe.skip" tests/explore-visuals.test.mjs` returns 0.
    </acceptance_criteria>
    <done>RED commit landed: test(10-05): pin mount-gated reduced motion and the real aria-hidden marker — suite fails only for the missing gate.</done>
  </task>

  <task type="fix">
    <name>Task 2: GREEN — mount-gate the stack's reduced-motion value and drop the no-op aria-hidden class token</name>
    <files>src/components/explore/sections/projects-stack-stage.tsx</files>
    <read_first>src/components/explore/sections/projects-stack-stage.tsx, node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-VERIFICATION.md</read_first>
    <action>
      Edit `src/components/explore/sections/projects-stack-stage.tsx` only. No new imports are needed — line 24 already imports `useEffect, useMemo, useRef, useState` from 'react'.

      1. Hydration parity (AP-3, per D-05 — the reduced-motion clause of the interaction-quality contract). Inside `ProjectsSwipeStack` (the function starting at line 535), replace the single line 537 `const reducedMotion = useReducedMotion() ?? false;` with three statements (W-1 wording note: the prescribed explanatory comment must say "framer's useReducedMotion hook" WITHOUT the call parenthesisation, so the acceptance's single-direct-code-read count stays 1):
         - a mount flag: `const [mounted, setMounted] = useState(false);`
         - the raw detection kept under its own name: `const prefersReduced = useReducedMotion() ?? false;`
         - the gated value consumed by the rest of the component: `const reducedMotion = mounted ? prefersReduced : false;`
         Add a mount-only effect immediately after the existing announcement effect: `useEffect(() => { setMounted(true); }, []);` — empty dependency array, no cleanup needed (it writes a constant). Verify no other consumer reads `useReducedMotion()` directly anywhere in the file after the edit; the only call site stays inside `ProjectsSwipeStack`.
         Add a three-line comment above the gated value recording WHY: framer's `useReducedMotion()` initialises from `matchMedia` on the first client render (see `node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs`, which uses `useState(prefersReducedMotion.current)`) while SSR resolves false, so the gate makes the first client render identical to the server render and applies RM immediately after mount.
         Do not change what RM means downstream: `cardState(..., reducedMotion)` keeps its reduced-motion branch, `cycle()` keeps its instant-swap branch, and `drag={isFront && !reducedMotion ? 'x' : false}` keeps disabling drag once RM is active.
      2. Real attribute only (AP-6). The card className template currently spans lines 502-506 and ends with a second interpolation `${isFront ? '' : 'aria-hidden'}` whose value is the literal class name `aria-hidden` (a no-op class). Delete that entire second interpolation so the className becomes exactly `${CARD_SHELL} ${isFront ? 'overflow-visible' : 'pointer-events-none overflow-hidden'}` — keep the conditional overflow logic byte-identical, and leave the `aria-hidden={isFront ? undefined : 'true'}` prop at line 518 untouched.
      3. Update the module docstring (lines 3-23) to record the mount-gated RM read in the motion-contract paragraph, in place of any implication that the RM value is read at render time.
      4. Do NOT touch: the six SVG visual components, the `GenerativeVisual` dispatch and its case labels, `projectVisualVariant` usage, `cardState`'s arguments or geometry, the drag/threshold/keyboard/aria-live logic, the shadow bloom, `ProjectsStackStage`, or `projects-mobile-stack.tsx`.
    </action>
    <verify>Run in this order: `node --test tests/explore-visuals.test.mjs` (expect all tests including the new AP-3/AP-6 test green), then `node --test tests/projects-stack.test.mjs` (plan 04's suite, which landed in wave 1 and must already be green), then `npm run typecheck`, then `npm run build`, then `node --test tests/*.test.mjs` (full suite green — this must be the last action). Before `npm run build`: confirm no Next.js dev server is serving this worktree (`ss -ltnp | grep :3000`) — a production build wipes a live dev server's `.next` manifests and makes it serve 500s (skill: nextjs-dev-build-conflict); if one is running, stop it first or defer the build and record the reason in the task's done note. This plan is wave 2 and no sibling plan runs concurrently (04 finished in wave 1; 06 waits in wave 3), so the `.next` directory is uncontended.</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals.test.mjs` exits 0 with the AP-3/AP-6 test passing.
      - `npm run typecheck` exits 0 and `npm run build` exits 0 (static export of `/`, `/explore`, `/resume`).
      - `node --test tests/*.test.mjs` exits 0 with zero failures and zero skips.
      - `grep -c "mounted ? prefersReduced : false" src/components/explore/sections/projects-stack-stage.tsx` returns 1.
      - `grep -c "setMounted(true)" src/components/explore/sections/projects-stack-stage.tsx` returns 1 and `grep -c "useReducedMotion()" src/components/explore/sections/projects-stack-stage.tsx` returns 1 (single direct read).
      - `grep -c "isFront ? '' : 'aria-hidden'" src/components/explore/sections/projects-stack-stage.tsx` returns 0.
      - `grep -c "aria-hidden={isFront ? undefined : 'true'}" src/components/explore/sections/projects-stack-stage.tsx` returns 1.
      - `grep -c "case 'terminal-mock'" src/components/explore/sections/projects-stack-stage.tsx` returns 1 and the other five case labels are present (the dispatch is untouched) — plan 04's dispatch-coverage test, which this plan depends on and which is green on entry, must still pass.
    </acceptance_criteria>
    <done>GREEN commit landed: fix(10-05): mount-gate reduced motion on the projects stack — full gate green and chronologically last.</done>
  </task>

  <task type="auto">
    <name>Task 3: Align the three stale records with the delivered tree (panel-grid docstring + dual-engine rationale + variant-selector message)</name>
    <files>src/components/explore/explore-panels.tsx, tests/explore-visuals.test.mjs</files>
    <read_first>src/components/explore/explore-panels.tsx, tests/explore-visuals.test.mjs, src/components/explore/sections/projects-section.tsx, src/components/explore/projects-card-state.ts</read_first>
    <action>
      Documentation corrections plus ONE assertion-message correction — no executable logic, no assertion semantics, no styling change.

      1. `src/components/explore/explore-panels.tsx`, module docstring (do not touch the code below it, including the placement map at 118-124 and the wrapper JSX at 161):
         - Replace the phrase "EACH now carrying its own sticky range (wrapper span-2 + extended height, shell pinned inside it — the W-3 pair below; two sequential ranges, E-15)" (lines 19-21) with an accurate statement that the phase-9 per-panel sticky pairs were later narrowed: only the Experience panel keeps the extended sticky range (wrapper `md:col-span-2 md:h-[300vh]`, shell `md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]`), so exactly one extended range remains.
         - Replace the phase-9 gate sentence "EACH system's sticky placements are conditional on its own data gate (W-3, the phase-9 pair): experience on the selected-entry count (tech roles ∪ featured education, the pure module's ONE derivation) > 1, projects on the top-6 slice > 1 — ≤1 renders natural height with no sticky (E-1/E-2)." (lines 27-31) with: the Experience gate (`experienceGate`, keyed on the selected-entry count — tech roles ∪ featured education) is the only data gate; About, Skills, Projects and Credentials carry `{ wrapper: '', shell: '', gate: false }`. Record the phase-10 fact and its provenance in that sentence: Projects returned to natural height when the panel became the swipe-driven ring-buffer stack (user directive 2026-09-25, quick task `2026-09-25-projects-swipe-loop-stack`, commit b39b12c).
         - The rewritten docstring MUST contain the exact clause `no sticky range; Projects renders at natural height`, and MUST state the measured truth about the wrapper hook: `data-editorial-wrapper="true"` stays on every grid child (test-pinned at `tests/explore-visuals.test.mjs:945`) but is read by NO file under `src/` — the Experience stage's hand-rolled hook measures `.explore-shell > main` instead (`MAIN_SELECTOR`, `use-timeline-progress.ts:104`).
         - Correct the neighbouring stale comment at lines 153-156 of the same file (immediately above the wrapper JSX; do NOT touch the JSX itself): it currently claims "the scroll-target data attribute below is the Experience stage's useScroll target". That claim is false on both counts — nothing in `src/` reads the attribute, and the Experience stage uses a hand-rolled rAF hook, not framer's scroll hook — so the clause must be removed (after this edit the file contains no `useScroll` claim). Replace that clause with the measured truth (the attribute is a stable grid-child hook that nothing in `src/` reads; the Experience stage measures `.explore-shell > main`). Keep the rest of that comment unchanged (R-3: plain wrapper, no id, no chrome; the entrance stagger animates it as the grid child; the sticky section inside keeps the stable section id the tour/IO/drawer flows measure).
      2. `tests/explore-visuals.test.mjs`, the dual-engine comment block at lines 616-622 (immediately above the `.animate(`/`gsap`/`lottie` ban loop; do not touch the loop itself or the allowlist at 629-640):
         - Replace "the projects editorial scroll's framer-motion stage" and "the framer-motion ban becomes the ALLOWLIST — the editorial stage is the ONE import site" with wording naming the delivered site: the framer-motion allowlist's ONE import site is the swipe-driven stack stage (`projects-stack-stage.tsx`).
         - Keep the comment's substance intact: two sanctioned JS engines (the hand-rolled rAF channels pinned below, and the projects stack's framer-motion), the universal `.animate(`/`gsap`/`lottie` bans unchanged over every explore `.ts`/`.tsx`, and the allowlist semantics (the stack stage must contain framer-motion; every other explore file must not).
         - The rewritten comment MUST contain the exact clause `swipe-driven stack stage is the ONE framer-motion import site`.
      3. `tests/explore-visuals.test.mjs:970` — the ONE assertion-message correction. The line currently reads `assert.ok(stack.includes('projectVisualVariant'), 'generative visuals selected by the name-hash helper');`. Keep the predicate byte-identical (`stack.includes('projectVisualVariant')`) and replace only the message string with `'generative visuals selected by the curated per-project table (name-hash fallback for uncurated names)'`, so the suite states the selector plan 04 (wave 1) actually delivers. This is the only non-comment line either file may change in this task.
      4. Do not reword, rename, delete or reorder any assertion or any other assertion message; the only edits in the test file are comment lines plus the single message string named in step 3.
    </action>
    <verify>Run: `grep -c "EACH now carrying its own" src/components/explore/explore-panels.tsx` (expect 0); `grep -c "projects on the top-6" src/components/explore/explore-panels.tsx` (expect 0); `grep -c "no sticky range; Projects renders at natural height" src/components/explore/explore-panels.tsx` (expect 1); `grep -c "Experience stage's useScroll target" src/components/explore/explore-panels.tsx` (expect 0); `grep -c "useScroll" src/components/explore/explore-panels.tsx` (expect 0); `grep -c ".explore-shell > main" src/components/explore/explore-panels.tsx` (expect at least 1); `grep -c "projects editorial scroll" tests/explore-visuals.test.mjs` (expect 0); `grep -c "the editorial stage is the" tests/explore-visuals.test.mjs` (expect 0); `grep -c "swipe-driven stack stage is the ONE framer-motion import site" tests/explore-visuals.test.mjs` (expect 1); `grep -c "name-hash helper" tests/explore-visuals.test.mjs` (expect 0); `grep -c "generative visuals selected by the curated per-project table" tests/explore-visuals.test.mjs` (expect 1); `grep -c "stack.includes('projectVisualVariant')" tests/explore-visuals.test.mjs` (expect 1 — the predicate survived). Then `npm run typecheck` and — last — `node --test tests/*.test.mjs`.</verify>
    <acceptance_criteria>
      - All twelve grep counts above return exactly the expected values.
      - `npm run typecheck` exits 0 and `node --test tests/*.test.mjs` exits 0 with zero failures and zero skips (this run is the last action before the commit).
      - `git diff --stat` for this commit touches only `src/components/explore/explore-panels.tsx` and `tests/explore-visuals.test.mjs` **(W-4 precondition: at task start the tree is clean except this task's edits; no interleaved commits between waves — the check scopes to this task's own commit via `git show --stat HEAD`)**.
      - Non-comment changes in this commit are limited to exactly one line: the assertion message at `tests/explore-visuals.test.mjs:970`. Every other added/removed line is inside a comment (JSDoc `*` block or `//` line) — check with `git diff -U0` and confirm that the only changed line carrying code tokens is the one whose content includes `generative visuals selected by the curated per-project table`.
    </acceptance_criteria>
    <done>Hygiene commit landed: chore(10-05): align panel-grid, dual-engine and variant-selector records with the delivered stack.</done>
  </task>
</tasks>

<residual_notes>
- Commit-scope contract (do not "improve" it): this plan is `type: tdd`, so the ship-time `tdd_audit` gate derives its commit scope as the zero-padded `{phase}-{plan}` pair — `(10-05)` — and filters subjects with `new RegExp('\\(10-05\\)')` (`gates.js:planScope`/`tddAuditGate`). The `done` fields therefore prescribe `test(10-05): …` before `fix(10-05): …` (and the hygiene `chore(10-05): …`, which the gate ignores because it matches neither `test(` nor `feat(`/`fix(`). A subject carrying the full plan id matches nothing and makes the gate report `missing test: commit before feat:/fix:`, blocking `gsd_ship`. Emit the subjects above verbatim.
- Measured during gap-closure planning and NOT fixed by this plan: `data-editorial-wrapper="true"` (`explore-panels.tsx:161`) is written but read by nothing under `src/` — the only other reference in the repo is a test assertion message (`tests/explore-visuals.test.mjs:945`, "for the Experience sticky range"). Removing the attribute, or retargeting the Experience stage onto it, is a behaviour change that touches a pinned assertion, so it is recorded here as an observation for a future phase. This plan only makes the comments tell the truth about it.
- The browser-side half of AP-3 stays a human item (VERIFICATION Human Verification 4): OS reduced-motion ON, reload `/explore`, step the controls, confirm instant opacity/zIndex swaps and a console free of hydration warnings. This plan removes the structural cause and pins it; it does not claim the browser check was performed.
- `explore-panels.tsx:13` also says "All four sections are registered" while five panels now render (Credentials landed in phase 11). That sentence belongs to phase 11's record, not this gap-closure plan, so it is deliberately left untouched.
- Swipe/shadow feel, the 75-85% visual-area proportion and the mobile 375px rendering remain human-verification items from the phase-10 VERIFICATION.md.
- The variant-selector message fix is a RECORD fix, not a behaviour change: plan 04 delivers the curated-primary mechanism in wave 1; this task makes the suite's message agree with it. Re-verification should treat any residual "name-hash" wording elsewhere as a documentation gap, not a code defect.
</residual_notes>
