---
phase: 10-projects-stack-revision
plan: 03
type: execute
wave: 3
depends_on:
  - "EXPLORE-10-projects-stack-revision-02"
files_modified:
  - "src/components/explore/sections/projects-section.tsx"
  - "src/components/explore/sections/projects-editorial-stage.tsx"
  - "src/components/explore/projects-row-state.ts"
  - "tests/projects-editorial.test.mjs"
  - "tests/explore-visuals.test.mjs"
autonomous: true
requirements: ["REV-18", "REV-19", "REV-20"]
gap_closure: false
user_setup: []
must_haves:
  truths:
    - "projects-section.tsx renders the new stack on md+ and ProjectsMobileStack below md (the phase-9 compact grid is retired), keeping stat tiles and terminal pointer."
    - "The old editorial-row files and their dedicated test are gone from the tree."
    - "tests/explore-visuals.test.mjs allowlists framer-motion only in projects-stack-stage.tsx and asserts the old row contract absent."
    - "npm run typecheck, npm run build, and node --test tests/*.test.mjs all pass on the final tree."
  artifacts:
    - path: "src/components/explore/sections/projects-section.tsx"
      provides: "Projects panel body wiring the stat tiles, stack stage, mobile stack, and terminal pointer; the compact card grid is removed."
      min_lines: 40
      exports: ["ProjectsSection"]
    - path: "tests/explore-visuals.test.mjs"
      provides: "Updated cross-cutting invariants: framer-motion allowlist, gone-checks for old row files, stack-specific integration greps, mobile-stack retirement check."
      min_lines: 50
      exports: []
  key_links:
    - from: "src/components/explore/sections/projects-section.tsx"
      to: "src/components/explore/sections/projects-stack-stage.tsx"
      via: "import and render in the md+ viewport"
      pattern: "import .*ProjectsStackStage.* from ['\"]\\./projects-stack-stage['\"]"
    - from: "src/components/explore/sections/projects-section.tsx"
      to: "src/components/explore/sections/projects-mobile-stack.tsx"
      via: "import and render in the md:hidden block"
      pattern: "import .*ProjectsMobileStack.* from ['\"]\\./projects-mobile-stack['\"]"
---

<objective>
Wire the new stack components into the Projects panel, retire the editorial-row machinery, retire the phase-9 <md compact card grid, and renew the cross-cutting integration tests so the framer-motion allowlist, gone-checks, and data-driven assertions match the delivered stack contract.
</objective>

<assumption_delta_decision>
- primary noun: the stacked-card carousel / `cardState(cardIndex, carouselProgress)` geometry
- decision: promote
- rationale: this phase replaces the editorial-row composition; `cardState` becomes the sole md+ Projects panel derivation, and the row/rowState contract is retired. The mobile simplified stack is the promoted responsive variant, not a parallel UI.
- invariant: every responsive path (md+ scroll-driven stack, <md state-driven stack, reduced-motion opacity-only swap, keyboard step) consumes the same `projects.slice(0, 6)` data slice and the same `cardState` active-index rule.
</assumption_delta_decision>

<context_reconciliation>
- The phase-9 `<md` compact card grid is **retired** in this phase. `projects-section.tsx` must render `ProjectsMobileStack` inside its `md:hidden` block and remove the old compact-grid markup. This aligns the implementation with REV-20 / UI-SPEC §2.3 and the updated D-06 / OQ-5.
</context_reconciliation>

<context>
Read before implementing:
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/sections/projects-section.tsx
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/sections/projects-stack-stage.tsx (plan 02 output)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/sections/projects-mobile-stack.tsx (plan 02 output)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/explore-visuals.test.mjs
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/projects-editorial.test.mjs (to be deleted)
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Wire the new stack into ProjectsSection and delete the retired editorial-row files</name>
    <files>src/components/explore/sections/projects-section.tsx, src/components/explore/sections/projects-editorial-stage.tsx, src/components/explore/projects-row-state.ts, tests/projects-editorial.test.mjs</files>
    <read_first>src/components/explore/sections/projects-section.tsx, src/components/explore/sections/projects-editorial-stage.tsx, src/components/explore/projects-row-state.ts, tests/projects-editorial.test.mjs</read_first>
    <action>
      Modify `src/components/explore/sections/projects-section.tsx`:
      - Replace `import { ProjectsEditorialStage as EditorialStage } from './projects-editorial-stage'` with imports for `ProjectsStackStage` from `'./projects-stack-stage'` and `ProjectsMobileStack` from `'./projects-mobile-stack'`;
      - In the md+ viewport div (`className="hidden md:block md:h-[calc(100dvh-14.5rem)] md:overflow-hidden"`), render `<ProjectsStackStage projects={cards} />`;
      - Remove the existing `<div className="md:hidden">` compact card grid markup and replace it with `<ProjectsMobileStack projects={cards} />` inside a clean `md:hidden` wrapper;
      - Keep `ProjectStatTiles` and `TerminalPointer` exactly where they are (D-06: stat tiles stay, pointer last).
      Delete the retired files:
      - `src/components/explore/sections/projects-editorial-stage.tsx`
      - `src/components/explore/projects-row-state.ts`
      - `tests/projects-editorial.test.mjs`
    </action>
    <verify>Run `npm run typecheck` and `npm run build`.</verify>
    <acceptance_criteria>
      - `src/components/explore/sections/projects-section.tsx` no longer imports or references `ProjectsEditorialStage` or `EditorialStage`.
      - The deleted files no longer exist on disk.
      - `npm run build` exits 0 and `out/explore.html` contains the DeepIndex project name as real markup.
    </acceptance_criteria>
    <done>Panel wiring swapped, compact grid retired, and old files removed.</done>
  </task>

  <task type="auto">
    <name>Task 2: Renew the cross-cutting integration tests for the stack contract</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>tests/explore-visuals.test.mjs, src/components/explore/sections/projects-stack-stage.tsx, src/components/explore/projects-card-state.ts</read_first>
    <action>
      Update `tests/explore-visuals.test.mjs` to reflect the stack replacement (stale-test-triage discipline):
      - In the framer-motion allowlist loop, change the allowed file from `projects-editorial-stage.tsx` to `projects-stack-stage.tsx`; assert every other explore .tsx/.ts lacks framer-motion.
      - Change the pure-module zero-import assertion from `projects-row-state.ts` to `projects-card-state.ts`: assert zero import statements and no `'framer-motion'` in the module.
      - Replace row-specific gone-checks with stack-specific checks:
        * assert `src/components/explore/projects-row-state.ts` does not exist;
        * assert `src/components/explore/sections/projects-editorial-stage.tsx` does not exist;
        * assert `ProjectsEditorialStage` string is absent from `projects-section.tsx`;
        * assert `src/components/explore/sections/projects-stack-stage.tsx` exists;
        * assert `src/components/explore/projects-card-state.ts` exists;
        * assert `src/components/explore/sections/projects-mobile-stack.tsx` exists.
      - Update the mobile-tier assertion: assert the `md:hidden` block in `projects-section.tsx` renders `ProjectsMobileStack` (not the retired compact grid) and that `projects-mobile-stack.tsx` does not import `framer-motion`.
      - Keep the `data-editorial-wrapper="true"` assertion on the wrapper (the stack still uses it as the useScroll target).
      - Add/update export-level assertions for the stack:
        * `out/explore.html` contains each of the top-6 project names as real text;
        * the old row-specific strings (`ProjectsEditorialStage`, `projects-row-state`) are gone from source files.
      - Ensure the dependency-count pin stays at 39 and recharts is still absent.
      - Rename/rewrite the stale test at `tests/explore-visuals.test.mjs:358` and its comment at `:363` so the test title and explanatory text refer to framer-motion being adopted for the *projects stack composition* (not the now-deleted "editorial compositions").
      Do not weaken any existing assertion that still applies (e.g., recharts ban, dependency count, client/server boundary, motion vocabulary in CSS).
    </action>
    <verify>Run `npm run typecheck`, then `npm run build`, then `node --test tests/*.test.mjs` (export tests need out/; the verify step must run the full suite so a passing verify cannot mask failures in other test files).</verify>
    <acceptance_criteria>
      - `npm run typecheck` exits 0.
      - `npm run build` exits 0.
      - `node --test tests/*.test.mjs` exits 0 on the final workspace state.
      - No stale assertion referencing `projects-row-state`, `projects-editorial-stage`, or `ProjectsEditorialStage` remains in the test file.
      - The dependency-count test comment no longer uses the phrase "editorial compositions".
    </acceptance_criteria>
    <done>Integration tests renewed and the full suite is green on the final tree.</done>
  </task>
</tasks>
