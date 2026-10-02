---
phase: 10-projects-stack-revision
plan: 05
subsystem: explore/projects-stack
status: complete
tags: [tdd, gap-closure, reduced-motion, hydration-parity, a11y, record-hygiene]
dependency_graph:
  requires:
    - EXPLORE-10-projects-stack-revision-04
    - EXPLORE-10-projects-stack-revision-02
  provides:
    - src/components/explore/sections/projects-stack-stage.tsx#mounted-gated reducedMotion
    - tests/explore-visuals.test.mjs#EXPLORE-10 invariant (AP-3/AP-6)
  affects:
    - src/components/explore/sections/projects-stack-stage.tsx
    - src/components/explore/explore-panels.tsx
    - tests/explore-visuals.test.mjs
tech_stack:
  - Next.js 15 App Router (static export)
  - React 18.3.1 (client island, mount-gated state)
  - TypeScript 5 (erasable syntax)
  - framer-motion@13.4.3 (useReducedMotion, useAnimationControls, drag)
  - node:test + Node 24 type stripping
key_files:
  created: []
  modified:
    - src/components/explore/sections/projects-stack-stage.tsx
    - src/components/explore/explore-panels.tsx
    - tests/explore-visuals.test.mjs
  deleted: []
decisions:
  - "AP-3 closure (assumption_delta promote): the mount-gated derivation `mounted ? prefersReduced : false` is the single reduced-motion input for the stack; the raw first-render useReducedMotion value is demoted to a pre-mount-only read and is consumed nowhere else"
  - "AP-6 closure: non-active cards are marked by the real `aria-hidden` attribute only - the no-op 'aria-hidden' class token was deleted from the className template while the conditional overflow logic stayed byte-identical"
  - "Record hygiene: the explore-panels docstring now describes the delivered placement map (ONE extended sticky range, Experience-only gate, Projects at natural height, data-editorial-wrapper read by nothing under src/)"
  - "The dual-engine comment names the swipe-driven stack stage as the ONE framer-motion import site; the explainer was reflowed so the pinned clause sits on one line"
  - "The variant-selector assertion message now names the curated per-project table as the primary selector with the name-hash as fallback; the predicate `stack.includes('projectVisualVariant')` is byte-identical"
metrics:
  duration_minutes: 3
  completed_date: "2026-09-29"
  tasks: 3
  commits: 3
---

# Phase 10 Plan 05: Mount-Gated Reduced Motion (AP-3/AP-6 Gap Closure) Summary

Closed AP-3 (reduced-motion hydration parity) and AP-6 (no-op `aria-hidden` class token) as real defects in the delivered tree, and aligned three stale records (AP-4, AP-5, and the variant-selector message drift) with what the tree actually ships.

## What changed

- `tests/explore-visuals.test.mjs` (+24 lines): one new test `EXPLORE-10 invariant (AP-3/AP-6): the stack mount-gates reduced motion and marks non-active cards by attribute only`, placed immediately after the existing REV-21 swipe invariant (which is untouched). It pins five structural facts: `setMounted(true)`, the `/mounted \? [A-Za-z]+ : false/` derivation, `useReducedMotion` still used, the no-op class token absent, and the real `aria-hidden={isFront ? undefined : 'true'}` prop present.
- `src/components/explore/sections/projects-stack-stage.tsx` (+22/-5): `ProjectsSwipeStack` now holds `const [mounted, setMounted] = useState(false)`, reads `const prefersReduced = useReducedMotion() ?? false` and consumes `const reducedMotion = mounted ? prefersReduced : false`. A mount-only effect (`useEffect(() => { setMounted(true); }, [])`) sits next to the existing announcement effect, and the module docstring records the gate and its reason. The card `className` lost the no-op `${isFront ? '' : 'aria-hidden'}` interpolation and now ends at `${isFront ? 'overflow-visible' : 'pointer-events-none overflow-hidden'}`; the real attribute prop is unchanged. Nothing downstream of `reducedMotion` changed: `cardState(..., reducedMotion)`, the `cycle()` instant-swap branch, and `drag={isFront && !reducedMotion ? 'x' : false}` all keep their semantics.
- `src/components/explore/explore-panels.tsx` (comments only): the module docstring no longer claims every panel carries its own sticky range or that Projects is gated on the top-6 slice. It now states that only Experience keeps the extended sticky range, that `experienceGate` is the only data gate, that about/skills/projects/credentials carry `{ wrapper: '', shell: '', gate: false }`, and it carries the required clause `no sticky range; Projects renders at natural height`. It records the provenance (user directive 2026-09-25, quick task `2026-09-25-projects-swipe-loop-stack`, commit b39b12c) and the measured truth that `data-editorial-wrapper="true"` stays on every grid child (test-pinned at `tests/explore-visuals.test.mjs:945`) but is read by NO file under `src/` - the Experience stage's hand-rolled hook measures `.explore-shell > main` (`MAIN_SELECTOR`, `use-timeline-progress.ts:104`). The stale wrapper comment above the JSX dropped its "the Experience stage's useScroll target" claim (`grep -c useScroll` in that file is now 0).
- `tests/explore-visuals.test.mjs` (comments + one message): the dual-engine comment names the swipe-driven stack stage as the ONE framer-motion import site and the assertion message at the REV-21 invariant now reads `generative visuals selected by the curated per-project table (name-hash fallback for uncurated names)`.

## Commits

1. `b90950b` `test(10-05): pin mount-gated reduced motion and the real aria-hidden marker`
2. `3175f47` `fix(10-05): mount-gate reduced motion on the projects stack`
3. `b870b05` `chore(10-05): align panel-grid, dual-engine and variant-selector records with the delivered stack`

## RED / GREEN evidence

- Pre-fix state measured on the tree before planning, re-read during execution: `projects-stack-stage.tsx` carried `const reducedMotion = useReducedMotion() ?? false;` (formerly line 537) and the no-op token `isFront ? '' : 'aria-hidden'` in the card `className` (formerly lines 503-505).
- RED (committed at `b90950b`, before any implementation edit): `node --test tests/explore-visuals.test.mjs` → 32 tests, 31 pass, **1 fail**, `AssertionError: the mount-only effect flips the mounted flag (AP-3 hydration parity)` at `tests/explore-visuals.test.mjs:988`. Every pre-existing test in the file stayed green.
- GREEN after the fix: `node --test tests/explore-visuals.test.mjs` → **32/32 pass**; `node --test tests/projects-stack.test.mjs` (plan 04's suite) → **22/22 pass**; the new AP-3/AP-6 test passes.

## Verification

Run in the plan's order against the final workspace state:

- `node --test tests/explore-visuals.test.mjs` → 32 pass, 0 fail, 0 skip (exit 0).
- `node --test tests/projects-stack.test.mjs` → 22 pass, 0 fail (plan 04's dispatch-coverage test included, still green).
- `npm run typecheck` → exit 0, clean.
- `npm run build` → exit 0; `/`, `/explore`, `/resume` exported statically (plus `/_not-found`).
- `node --test tests/*.test.mjs` → **269 pass, 0 fail, 0 skip** (exit 0) - the 268 pre-plan baseline plus the one new AP-3/AP-6 test. This run was the last action before the task-3 commit, and the full gate was re-run as the chronologically last action after the summary write.
- Task-2 acceptance greps on the final tree: `mounted ? prefersReduced : false` 1, `setMounted(true)` 1, `useReducedMotion()` 1 (single direct read), no-op class token 0, `aria-hidden={isFront ? undefined : 'true'}` 1, `case 'terminal-mock'` 1, six dispatch case labels present, `framer's useReducedMotion hook` 2 (docstring + inline comment, both unparenthesised).
- Task-3 acceptance greps on the final tree (all twelve): `EACH now carrying its own` 0, `projects on the top-6` 0, `no sticky range; Projects renders at natural height` 1, `Experience stage's useScroll target` 0, `useScroll` 0, `.explore-shell > main` 2, `projects editorial scroll` 0, `the editorial stage is the` 0, `swipe-driven stack stage is the ONE framer-motion import site` 1, `name-hash helper` 0, `generative visuals selected by the curated per-project table` 1, `stack.includes('projectVisualVariant')` 1.
- Non-comment change scope (`git diff -U0 -- src tests` filtered to non-comment lines): exactly ONE code line changed in the whole plan - the assertion message at the REV-21 invariant. Every other added/removed line is inside a JSDoc `*` block or a `//` line.

### Pre-build environment check (plan-required)

`ss -ltnp` showed a listener on `:3000` (pid 23130, `node .../node_modules/.bin/serve ./out`, parent `sh -c serve ./out`) - the repo's static server over the exported `out/` directory, **not** a Next.js dev server. `nextjs-dev-build-conflict` needs `next dev` on the same worktree (absent), so the build ran without stopping the user's static server. No sibling plan was executing (04 finished in an earlier wave; 06 had not started), so `.next/` was uncontended.

## Deviations

1. **Commit scope.** The orchestrator's spawn line asked for `(EXPLORE-10-projects-stack-revision-05)`; the commits carry the zero-padded `(10-05)` scope, per the plan's `<residual_notes>`. Measured with the real gate: `tddAuditGate` derives its scope from `planScope()` as `10-05` and filters subjects with `new RegExp('\\(10-05\\)')` (`gates.js:124-135`). On the real chronological subjects the gate returns `{"status":"pass","findings":[]}`; on the full-plan-id counter-probe it returns `{"status":"fail","findings":[{"planId":"x","reason":"missing test: commit before feat:/fix:"}]}`. The full plan id would have blocked `gsd_ship`.
2. **The plan's `files_modified` list was incomplete - and the fix stayed inside the plan's own scope.** The first task-3 edit broke three pinned suites NOT named in the plan: `tests/explore-shell.test.mjs:367` and `tests/explore-sweep.test.mjs:55,85` each assert `(src.match(/md:col-span-2/g) || []).length === 1` over `explore-panels.tsx` ("exactly one span-2 grid child"). My first docstring wording spelled the literal `md:col-span-2`, adding a second occurrence → `2 !== 1` in all three. Fixed by describing the placement without the counted literal ("its wrapper spans both grid columns at the 300vh extended height"); no test file outside the plan's list was edited. Recorded as a plan-accuracy finding: any future comment work in `explore-panels.tsx` must avoid spelling the counted class literals (`md:col-span-2`, `md:order-first`).
3. **One small superset, comment-only.** The placement-map docstring still closed with "the Experience wrapper carries the stage's scroll-target data attribute" - the same false claim class this plan removes, and one that would have contradicted the required clause added two paragraphs above. It was reworded to the measured truth (a stable hook nothing under `src/` reads). No acceptance criterion checks that line; the change is inside a comment and touched no code.
4. **Not a deviation, recorded for clarity:** `explore-panels.tsx:13` ("All four sections are registered") is left untouched per the plan's `<residual_notes>` (phase-11 record work), and the `data-editorial-wrapper` attribute itself is left in place because removing it would touch a pinned assertion.

## TDD Gate Compliance

Satisfied. `type: tdd` plan; the first scope-matching commit is `test(10-05)` (`b90950b`), the second is `fix(10-05)` (`3175f47`), and the third is `chore(10-05)` (`b870b05`), which the gate ignores. Measured `tddAuditGate` over the real chronological subjects → `{"status":"pass","findings":[]}`.

## Known Stubs

None. `grep -nE "TODO|FIXME|XXX|placeholder|HACK"` is empty on all three changed files, and `grep -cE "\.skip|\.todo|test\.only|describe\.only"` is 0 on the test file (the runner's own counters confirm 0 skipped).

## Threat Flags

None. The production changes are a mount-only boolean flag plus a deleted no-op CSS class token in a client island that already existed; no new network, filesystem, secret, or user-input surface. The new test reads one repository source file with `readFileSync`. The mount gate strictly *reduces* a hydration-mismatch surface (SSR and first client render now agree by construction).

## Deferred / not claimed

- **The browser half of AP-3 is still a human item** (VERIFICATION Human Verification 4): OS reduced-motion ON, reload `/explore`, step the controls, confirm instant opacity/zIndex swaps and a console free of hydration warnings. This plan removes the structural cause and pins it structurally; it does **not** claim the browser check was performed.
- The swipe/shadow feel, the 75-85% visual-area proportion, and the mobile 375px rendering remain human-verification items from the phase-10 VERIFICATION.md.
- `data-editorial-wrapper` being written but read by nothing under `src/` remains an open observation for a future phase; this plan only made the comments tell the truth about it.
- The variant-selector message change is a RECORD fix, not a behaviour change; plan 04 (wave 1) shipped the curated-primary mechanism.

## Self-Check: PASSED

- `src/components/explore/sections/projects-stack-stage.tsx` exists, is committed (`3175f47`), and is 689 lines (artefact contract min 640); exports `ProjectsStackStage` and `ProjectsSwipeStack`.
- `src/components/explore/explore-panels.tsx` exists, is committed (`b870b05`), and is 182 lines (contract min 120); exports `ExplorePanels`.
- `tests/explore-visuals.test.mjs` exists, is committed (`b90950b`, `b870b05`), and is 1026 lines (contract min 950).
- All three commits exist in `git log` with the gate-matching `(10-05)` scope; `git status --short src tests` is clean.
- Full gate green on the committed tree: 269/269 tests, typecheck clean, build + static export clean.
