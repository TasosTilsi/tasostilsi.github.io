---
phase: 10-projects-stack-revision
plan: 08
type: tdd
wave: 7
depends_on:
  - "EXPLORE-10-projects-stack-revision-07"
files_modified:
  - "src/components/explore/projects-card-state.ts"
  - "src/components/explore/explore-panels.tsx"
  - "src/components/explore/sections/projects-section.tsx"
  - "src/components/explore/sections/projects-mobile-stack.tsx"
  - "tests/projects-stack.test.mjs"
  - "tests/explore-visuals.test.mjs"
  - "tests/explore-shell.test.mjs"
  - "tests/explore-sweep.test.mjs"
  - ".planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md"
autonomous: true
requirements: ["REV-18", "REV-19", "REV-20"]
gap_closure: true
user_setup: []
must_haves:
  truths:
    - "Every REV-21 citation in src/ and tests/ names the requirement it actually describes: the thirteen phase-10 Projects-stack references cite REV-18 (or REV-20 where the sentence is about the interaction-quality contract), and the twenty-three credentials / 5-section-grid / chart-5 references keep REV-21, which belongs to phase 11 — so no source file or test title labels the Projects stack work with another phase's requirement id (phase-10 VERIFICATION AP-12)."
    - "The corrected citations are executable-pinned, not merely edited: a traceability test fails while a projects-stack REV-21 citation exists and passes once every one of the thirteen is reclassified, so the same mis-citation cannot be reintroduced by a later phase."
    - "The phase-10 decision record states WHY the gap was closed in code rather than by amending the contract — the user's own directive (TASK.md req 3 and req 7) already states the ring-buffer contract, and the stage's two comments stated it too, so the contract text was right and the wiring was wrong — and records that no live requirement text (REQUIREMENTS.md, ROADMAP.md, SPEC.md, UI-SPEC.md) changed in this gap closure."
    - "The full gate runs chronologically last over the final workspace state of this wave: `npm run typecheck`, `npm run build` and the full `node --test tests/*.test.mjs` suite are all green with zero failures and zero skips, and the measured test count is recorded rather than asserted from memory."
    - "Behaviour anchor (so a verifier re-derives the ids from delivered behaviour, not from wording): the corrected REV-18/REV-20 citations are asserted in the same gate run that exercises plan 07's ring contract — `node --test tests/projects-stack.test.mjs` proves a Next step sends the foreground card to the BACK (ringStep('next') → ringDelta 1, exit sign -1; the departed card lands at depth count−1, i.e. cardState(0, 1, 6, false) → translateY -190, scale 0.80, opacity 0.30, zIndex 50) and that six successive steps on EITHER swipe side restore the initial arrangement — so the REV-18 label on the Projects stack surfaces names executable behaviour, not a comment edit."
  artifacts:
    - path: "tests/explore-visuals.test.mjs"
      provides: "The new traceability test pinning the REV-21 citation budget of the phase-10 surfaces (0 in each source surface; exactly the four phase-11 credential lines in this file's PRE-TRACEABILITY corpus, measured by slicing the file at the test's own marker and never counted over the whole file), plus its phase-10 citations renamed to REV-18."
      min_lines: 950
      exports: []
    - path: "src/components/explore/projects-card-state.ts"
      provides: "The pure module with its header citation corrected to phase-10 REV-18 (behaviour, geometry, variants and the ring-step contract unchanged by this plan)."
      min_lines: 344
      exports: ["cardState", "ringStep", "advanceFront", "ringDepth", "projectVisualVariant", "djb2", "firstSentence", "projectYear", "projectTechnologies", "swipeAccepts", "SWIPE_THRESHOLD", "SWIPE_VELOCITY_THRESHOLD"]
    - path: "src/components/explore/explore-panels.tsx"
      provides: "The panel-grid module whose three phase-10 stack citations (natural-height placement) are corrected to REV-18; the phase-11 credentials/Layout-01 statements untouched."
      min_lines: 120
      exports: ["ExplorePanels"]
    - path: "src/components/explore/sections/projects-section.tsx"
      provides: "The Projects panel body with its header citation corrected to phase-10 REV-18."
      min_lines: 40
      exports: ["ProjectsSection"]
    - path: "src/components/explore/sections/projects-mobile-stack.tsx"
      provides: "The compact mobile stack wrapper with its header citation corrected to phase-10 REV-18."
      min_lines: 20
      exports: ["ProjectsMobileStack"]
    - path: "tests/projects-stack.test.mjs"
      provides: "The pure-module suite with its header citation corrected to phase-10 REV-18; every assertion untouched."
      min_lines: 444
      exports: []
    - path: "tests/explore-shell.test.mjs"
      provides: "The shell suite with the projects-natural-height assertion message citing REV-18 instead of phase 11's REV-21; every assertion untouched."
      min_lines: 505
      exports: []
    - path: "tests/explore-sweep.test.mjs"
      provides: "The sweep suite with both projects-natural-height assertion messages citing REV-18; every assertion untouched."
      min_lines: 393
      exports: []
    - path: ".planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md"
      provides: "The gap-closure resolution record: R1 (code fix) chosen over R2 (contract amendment) with the reason, the R6/AP-12 closure provenance, and the unchanged-deviation list."
      min_lines: 187
      exports: []
  key_links:
    - from: "tests/explore-visuals.test.mjs"
      to: "src/components/explore/projects-card-state.ts, src/components/explore/explore-panels.tsx, src/components/explore/sections/projects-section.tsx, src/components/explore/sections/projects-mobile-stack.tsx"
      via: "the traceability test reads all four phase-10 source surfaces and asserts their REV-21 citation count is zero while REV-18 is cited at least once"
      pattern: "REV-21|REV-18"
    - from: ".planning/REQUIREMENTS.md"
      to: "src/components/explore/sections/projects-stack-stage.tsx"
      via: "the corrected citations name the requirement that actually governs the delivered stack (REV-18 stack mechanism, REV-20 interaction-quality) instead of phase 11's REV-21"
      pattern: "REV-18"
---

<objective>
Close phase-10 VERIFICATION AP-12 (WARNING, new in the `gaps_found` run): five phase-10 surfaces cite the wrong requirement id — they label the Projects stack work "phase-10 REV-21", but REV-21 is phase 11's Credentials panel (`REQUIREMENTS.md:35`, `ROADMAP.md:17`); phase 10's ids are REV-18, REV-19 and REV-20. The verification report enumerated five source files and four test sites; the exhaustive enumeration below (36 REV-21 occurrences across 12 files, measured in this planning session with `grep -rn "REV-21" src/ tests/`) found THREE more projects-stack mis-cites the report's list missed — the projects-natural-height assertion messages in `tests/explore-shell.test.mjs:369` and `tests/explore-sweep.test.mjs:57,87`.

Classification (measured, pre-edit): 36 occurrences = **13 phase-10 Projects-stack mis-cites to rewrite** + **23 phase-11 credentials/grid citations to leave untouched**.

| # | file : position (pre-plan-07) | content | correct id |
|---|---|---|---|
| 1 | `src/components/explore/projects-card-state.ts:3` | "Tinder-style ring buffer (phase-10 REV-21, user directive 2026-09-25)" | REV-18 |
| 2 | `src/components/explore/explore-panels.tsx:30` | "data gate left is the Experience one (W-3, amended by phase-10 REV-21)" | REV-18 |
| 3 | `src/components/explore/explore-panels.tsx:35` | "is the phase-10 REV-21 fact: Projects returned to natural height when the panel became the swipe-driven ring-buffer stack" | REV-18 |
| 4 | `src/components/explore/explore-panels.tsx:112` | "Placement map factory (UI-SPEC §1.1/§4.1 — the phase-9 seam, amended by phase-10 REV-21)" | REV-18 |
| 5 | `src/components/explore/sections/projects-section.tsx:2` | "ProjectsSection — Projects panel body (phase-10 REV-21)" | REV-18 |
| 6 | `src/components/explore/sections/projects-mobile-stack.tsx:5` | "ProjectsSwipeStack (phase-10 REV-21)" | REV-18 |
| 7 | `tests/explore-visuals.test.mjs:617` | "re-worded by phase-10 REV-21 when the projects stage became the swipe-driven stack" | REV-18 |
| 8 | `tests/explore-visuals.test.mjs:936` | test title "EXPLORE-10 invariant (REV-21): projects stack is swipe-driven, centered, loopable and shadowed" | REV-18 |
| 9 | `tests/explore-visuals.test.mjs:950` | assertion message "projects placement returned to natural height — no wrapper/shell/sticky classes (REV-21)" | REV-18 |
| 10 | `tests/projects-stack.test.mjs:3` | "Pure card-state contract suite for the projects swipe-driven stacked-card carousel — phase-10 REV-21" | REV-18 |
| 11 | `tests/explore-shell.test.mjs:369` | assertion message "exactly one span-2 grid child — the experience wrapper only; projects returned to natural height (REV-21)" | REV-18 |
| 12 | `tests/explore-sweep.test.mjs:57` | assertion message "exactly one span-2 grid child — the experience wrapper only; projects returned to natural height (REV-21)" | REV-18 |
| 13 | `tests/explore-sweep.test.mjs:87` | assertion message "exactly one span-2 grid child — the experience wrapper only; projects is a natural-height panel (REV-21)" | REV-18 |

Left untouched (phase 11 owns REV-21): `src/components/explore/constants.ts:69`, `tests/portfolio-data-integrity.test.mjs:113`, `tests/explore-shell.test.mjs:31,247,270,275,353,357,459`, `tests/explore-visuals.test.mjs:314,332,341,775`, `tests/explore-sweep.test.mjs:52,77`, `tests/explore-visuals-skills.test.mjs:163,167,172`, `tests/explore-tour.test.mjs:64,181,187,235,637` (23 occurrences).

Line positions 7-13 are PRE-PLAN-07 positions: plan 07 appends assertions to `tests/explore-visuals.test.mjs`, so positions drift after it runs. **Reclassify by CONTENT, never by line number** — the classification rule is: a REV-21 reference whose sentence is about the PROJECTS stack (swipe-driven ring buffer, natural height, the stack stage, curated variants, loop) is a phase-10 mis-cite → REV-18 (or REV-20 when the sentence is about the interaction-quality contract: keyboard stepping, reduced motion, mobile, cleanup); a reference about the CREDENTIALS panel, the 5-section grid, chart-5, the drawer/visited counter or the tour copy keeps REV-21.

This plan also runs the FULL gate as the chronologically last action of the wave, after plan 07's behaviour change — so the green run covers the final workspace state of both plans.

No behaviour, geometry, layout, data or requirement text changes in this plan: the source edits are comment/header/message strings only, and every assertion predicate stays exactly as delivered.
</objective>

<assumption_delta_decision>
- primary noun: the phase-10 requirement id set — REV-18 (the stack mechanism: ring buffer, loop-to-the-back, natural height, keyboard stepping) and REV-20 (the interaction-quality contract) — as the ids that name the Projects stack work.
- demoted detail: REV-21, which keeps its role as phase 11's Credentials-panel id and is no longer borrowed by the Projects stack surfaces.
- decision: correct-and-promote (the phase-10 surfaces cite the phase-10 ids) — a traceability correction, not a behaviour change; no contract text is amended.
- rationale: the delivered stack satisfies REV-18/REV-20 (re-verified 46/47 with gap R6 now closed in plan 07), so every projects-stack citation must resolve to those ids; leaving REV-21 on those surfaces makes the requirement→code graph point at another phase's requirement and hides which contract governs the stack.
- add-alongside: no. Each of the 13 mis-cites is REPLACED by the id it should carry; no dual citation and no compatibility wording is introduced — no accepted debt is added by this plan.
- invariant: after this plan each citation resolves to a real requirement — the four phase-10 source surfaces carry zero REV-21 occurrences and at least one REV-18 each, and the only REV-21 lines left in `tests/explore-visuals.test.mjs` BEFORE the traceability test's own block are the four phase-11 credential/registry lines (pinned by content over the sliced pre-existing corpus, never by line number and never over the whole file).
</assumption_delta_decision>

<context>
Read before implementing:
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-VERIFICATION.md — AP-12 in `## Anti-Patterns Found` and the `## Gaps Summary` block; the frontmatter `gaps:` entry is gap R6, closed by plan 07.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/REQUIREMENTS.md — lines 32-34 (REV-18/19/20, phase 10) vs line 35 (REV-21, phase 11); line 31 is REV-17's own phase-9 text and is NOT touched.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/ROADMAP.md — the phase-10 row cites REV-18 … REV-20; the phase-11 row cites REV-21.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/explore-visuals.test.mjs — the EXPLORE-10 invariant test and the cross-cutting suite this plan extends with the traceability pin; the `read('…')` / `codeOf('…')` helpers and the `root` constant already exist there.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/explore-shell.test.mjs, tests/explore-sweep.test.mjs — the two sibling suites carrying mis-cited projects-natural-height assertion messages (positions measured above; re-grep before editing).
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md — the amendment block this plan appends the resolution record to; the `SUPERSEDED:` quarantine lines must stay exactly as they are.
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md — requirements 3 and 7, the directive text quoted in the resolution record.
</context>

<tasks>
  <task type="test">
    <name>Task 1: RED — pin the REV-21 citation budget of the phase-10 surfaces (traceability test)</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>tests/explore-visuals.test.mjs, src/components/explore/projects-card-state.ts, src/components/explore/explore-panels.tsx, src/components/explore/sections/projects-section.tsx, src/components/explore/sections/projects-mobile-stack.tsx, tests/projects-stack.test.mjs, tests/explore-shell.test.mjs, tests/explore-sweep.test.mjs, .planning/REQUIREMENTS.md</read_first>
    <action>
      Add ONE new test at the end of `tests/explore-visuals.test.mjs`, titled 'traceability: phase-10 projects-stack surfaces cite REV-18/REV-20, never phase-11 REV-21 (VERIFICATION AP-12)'. Use the existing `read('…')` helper if it returns the file text, or the imported `readFileSync`/`join`/`root` form already used in that file — do not add a new helper and do not add an import.

      The test asserts, with a message per clause:
      1. Zero REV-21 in each of the four phase-10 SOURCE surfaces — `src/components/explore/projects-card-state.ts`, `src/components/explore/explore-panels.tsx`, `src/components/explore/sections/projects-section.tsx`, `src/components/explore/sections/projects-mobile-stack.tsx`. Count per file with `(src.match(/REV-21/g) || []).length` and assert `=== 0`, naming the file in the message. (Measured today: 1, 3, 1, 1 — so this half is RED.)
      2. Each of those same four files cites its requirement at least once: `REV-18` count `>= 1`. (Measured today: 0 in all four — RED.)
      3. `tests/projects-stack.test.mjs` carries zero REV-21 (measured today: 1 — RED).
      4. Scope this file's budget to the PRE-EXISTING corpus and never measure it over the whole file: the traceability test is appended at the END of `tests/explore-visuals.test.mjs`, so it must locate its own block first. Load this file's own text into its own constant — `const ownFile = read('tests/explore-visuals.test.mjs');` (or the equivalent `readFileSync(join(...))` form) — and never reuse clause 1's per-surface loop variable for it. Define `const TRACE_MARKER = "test('traceability:";`, then `const at = ownFile.indexOf(TRACE_MARKER);` guarded by `assert.ok(at > 0, 'the traceability test could not locate its own block marker — the budget below would be measured over the traceability test itself')`, then `const corpus = ownFile.slice(0, at);`. Assert `(corpus.match(/REV-21/g) || []).length === 4` (measured today over that slice: 7 — RED). Then derive the offending lines with `corpus.split('\n').filter((line) => line.includes('REV-21'))` and assert every one of them matches `/credentials|registry spine|5-section|five panel headers/i` — the four legitimate phase-11 lines (the registry-spine title, the credentials-adapter message, the 5-section-grid message, the five-panel-headers title) — including the offending line text in the assertion message so a future mis-cite is self-identifying. The test's OWN occurrences (its title, which names phase 11's REV-21, and its `REV-21` probe regexes) all sit AFTER `TRACE_MARKER` and are excluded by construction, so the budget reads exactly 4 both before and after task 2 rewrites the three mis-cites. Do NOT replace this slice with a whole-file count and do NOT add a hand-maintained allowance for the test's own lines: a whole-file count is unsatisfiable (the test's own literals make it ≥10) and an allowance stops detecting a reintroduced mis-cite.
      5. `tests/explore-shell.test.mjs` and `tests/explore-sweep.test.mjs` carry no line that names BOTH a projects-natural-height claim and REV-21: for each file's text `src`, assert `!/REV-21[^\n]*natural[ -]height|natural[ -]height[^\n]*REV-21/i.test(src)` (measured with THIS regex on the delivered tree: 1 matching line in explore-shell, 2 in explore-sweep — RED). The bracketed `[ -]` is load-bearing, and the SPACE-ONLY form is exactly the defect this clause must not repeat (plan-checker W-2): `tests/explore-sweep.test.mjs:57` reads "…projects returned to natural height (REV-21)" while `:87` reads "…projects is a natural-height panel (REV-21)". Measured in Node over both forms, so the pin is provably not blind to one of the two lines it exists to fix: `/REV-21[^\n]*natural height|natural height[^\n]*REV-21/` yields explore-shell **1** / explore-sweep **1**, whereas `natural[ -]height` yields **1** / **2** — the difference is line 87, which the space-only regex never sees and therefore leaves GREEN. Do NOT substitute `natural.height`: it also matches a token like `naturalXheight` and would stop the pin being about the natural-height claim. Include the offending line text in the assertion message (as clauses 1-4 do), so a future mis-cite is self-identifying. If you reproduce this clause from a SHELL rather than a test run, be aware GNU grep does not treat `\n` inside a bracket expression as newline, so `[^\n]` there matches "not backslash/n" and drops lines whose tail contains an `n` (line 87's "panel" is one) — use `grep -cE 'natural[ -]height'` or two `-e` patterns for the shell check and trust the Node regex for the pin itself.
      6. Positive half: the EXPLORE-10 invariant test's title cites the phase-10 id — assert the file text loaded in clause 4 (`ownFile`) contains `EXPLORE-10 invariant (REV-18)`.

      RED signal: clauses 1, 2, 3, 4 and 5 all fail on the delivered tree (13 mis-cited occurrences across 6 files). Do NOT pre-fix any source file in this task: this task touches `tests/explore-visuals.test.mjs` ONLY, so the RED run is a genuine measurement of the mis-citation defect.
    </action>
    <verify>Run `node --test tests/explore-visuals.test.mjs`. Expect RED: the new test fails and its message names a real mis-cited file (the four source surfaces, `tests/projects-stack.test.mjs`, or the natural-height line). Record the exact failure output verbatim in the SUMMARY. Confirm the other 32 tests still pass (the new test is the only failure).</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals.test.mjs` exits non-zero and the failing test is the new traceability test only.
      - The new test block exists exactly once and its own marker constant does not inflate the count: `grep -c "^test(.traceability:" tests/explore-visuals.test.mjs` returns 1 and `grep -c "never phase-11 REV-21 (VERIFICATION AP-12)" tests/explore-visuals.test.mjs` returns 1 (the title; the marker constant is the shorter `test('traceability:` prefix and is not a test line).
      - The self-excluding slice guard is present over this file's own text constant: `grep -c "indexOf(TRACE_MARKER)" tests/explore-visuals.test.mjs` returns 1 and `grep -c "const corpus = ownFile.slice(0, at)" tests/explore-visuals.test.mjs` returns 1.
      - The four source-surface counts are asserted: `grep -c "REV-21/g" tests/explore-visuals.test.mjs` returns at least 5 (one probe per source surface plus the two test-file probes; pre-edit count 0). Those probe literals live inside the new test's own block — after `TRACE_MARKER` — so they are deliberately outside the corpus clause 4 measures.
      - The phase-11 content allowlist is present as the new test's own regex: `grep -c "/credentials|registry spine|5-section|five panel headers/i" tests/explore-visuals.test.mjs` returns 1 (pre-edit count 0 — the four phase-11 lines match that vocabulary but the regex literal does not exist yet).
      - The natural-height clause is pinned in BOTH word forms, because counting the space-only string is the same blind spot W-2 found: `grep -cE "natural[ -]height" tests/explore-visuals.test.mjs` returns at least 2 (pre-edit: 1 — line 950's message; the new test adds at least one more, in its clause-5 regex literal and/or in the offending-line text it quotes). Do NOT assert `grep -c "natural height"` alone: if the clause-5 message quotes `tests/explore-sweep.test.mjs:87`'s text that occurrence is hyphenated and a space-only count would under-report exactly the line the clause exists to pin.
      - No pre-existing test was deleted, renamed or skipped: `grep -c "^test(" tests/explore-visuals.test.mjs` returns 33 (32 measured pre-edit + this one); `grep -c "test.skip\|describe.skip\|test.only" tests/explore-visuals.test.mjs` returns 0.
      - NO source file was edited in this task: `git status --porcelain src/` is empty.
    </acceptance_criteria>
    <done>RED commit landed: test(10-08): pin the phase-10 REV-21 citation budget — the traceability test fails for exactly the mis-cited occurrences, with the failure output on record.</done>
  </task>

  <task type="auto">
    <name>Task 2: GREEN — reclassify the thirteen projects-stack citations to their real phase-10 ids</name>
    <files>src/components/explore/projects-card-state.ts, src/components/explore/explore-panels.tsx, src/components/explore/sections/projects-section.tsx, src/components/explore/sections/projects-mobile-stack.tsx, tests/projects-stack.test.mjs, tests/explore-visuals.test.mjs, tests/explore-shell.test.mjs, tests/explore-sweep.test.mjs</files>
    <read_first>tests/explore-visuals.test.mjs, src/components/explore/projects-card-state.ts, src/components/explore/explore-panels.tsx, src/components/explore/sections/projects-section.tsx, src/components/explore/sections/projects-mobile-stack.tsx, tests/projects-stack.test.mjs, tests/explore-shell.test.mjs, tests/explore-sweep.test.mjs, .planning/REQUIREMENTS.md, .planning/ROADMAP.md</read_first>
    <action>
      1. Re-enumerate before editing (positions have drifted after plan 07 and task 1): `grep -rn "REV-21" src/ tests/ | wc -l` and `grep -rn "REV-21" src/ tests/`. The pre-edit measurement for this plan was 36 occurrences across 12 files (13 phase-10 mis-cites + 23 phase-11 citations); confirm the current count and record it in the SUMMARY with the delta explained. The delta is expected to be the traceability test's OWN new tokens (its title plus its probe regexes), which sit inside the new test's block — AFTER the `TRACE_MARKER` slice — and therefore never enter the corpus budget; those are the only new occurrences this wave may introduce, so any other increase means an edit went wrong.
      2. Apply the CONTENT classification rule from `<objective>` to each occurrence, and rewrite ONLY the projects-stack ones:
        - `src/components/explore/projects-card-state.ts` header (`* Tinder-style ring buffer (phase-10 REV-21, user directive 2026-09-25).`) → `phase-10 REV-18`.
        - `src/components/explore/explore-panels.tsx` — all three stack/placement sentences (`W-3, amended by phase-10 REV-21`; `is the phase-10 REV-21 fact: Projects returned to natural height …`; `the phase-9 seam, amended by phase-10 REV-21`) → `phase-10 REV-18`. Leave every credentials/`LAYOUT-01` statement in that file exactly as it is.
        - `src/components/explore/sections/projects-section.tsx` header → `phase-10 REV-18`.
        - `src/components/explore/sections/projects-mobile-stack.tsx` header → `phase-10 REV-18`.
        - `tests/projects-stack.test.mjs` header → `phase-10 REV-18`.
        - `tests/explore-visuals.test.mjs` — the dual-engine rationale comment (`re-worded by phase-10 REV-21 …`) → REV-18; the EXPLORE-10 invariant TEST TITLE → `EXPLORE-10 invariant (REV-18)`; the natural-height assertion message `(REV-21)` → `(REV-18)`. Leave the four phase-11 lines (registry spine, credentials adapter, 5-section grid, five panel headers) untouched.
        - `tests/explore-shell.test.mjs` and `tests/explore-sweep.test.mjs` — the projects-natural-height assertion MESSAGES only: `projects returned to natural height (REV-21)` → `(REV-18)` and `projects is a natural-height panel (REV-21)` → `(REV-18)`. Do not touch the credentials/chart-5/tour/counter citations in those files.
      3. Edit strings ONLY: no assertion predicate, no regex, no expected value, no component behaviour, no geometry, no layout class, no data field may change. Test-title and message rewrites are free text and must not alter what any test asserts — re-run the suites to prove it.
      4. If the classification of any occurrence is genuinely ambiguous (a sentence that mixes a projects fact and a credentials fact), leave it untouched and record the line, the ambiguity and the reason in the SUMMARY rather than guessing.
      5. Do NOT introduce the string `REV-21` anywhere new outside the traceability test's own block that task 1 landed (that block's title and probe regexes are the only permitted new occurrences, and the runtime marker slice keeps them out of the corpus budget), and do NOT remove any `SUPERSEDED:` quarantine line in any planning document (this plan edits no planning document — the CONTEXT record is task 3).
    </action>
    <verify>Run, in this order: `node --test tests/explore-visuals.test.mjs` (expect GREEN, including the new traceability test), `node --test tests/projects-stack.test.mjs`, `node --test tests/explore-shell.test.mjs`, `node --test tests/explore-sweep.test.mjs`, then `node --test tests/*.test.mjs` (expect the whole suite green — the message-only edits must not change a single assertion outcome). Record the measured pass/fail counts per suite in the SUMMARY.</verify>
    <acceptance_criteria>
      - The four phase-10 source surfaces carry zero REV-21: `grep -c "REV-21" src/components/explore/projects-card-state.ts src/components/explore/explore-panels.tsx src/components/explore/sections/projects-section.tsx src/components/explore/sections/projects-mobile-stack.tsx` returns 0 for every file, and each carries REV-18 at least once.
      - `grep -c "REV-21" tests/projects-stack.test.mjs` returns 0.
      - Every remaining REV-21 line in the PRE-EXISTING corpus of `tests/explore-visuals.test.mjs` is a phase-11 credential/registry line, measured with the traceability test's own block excluded — the same slice the test applies at runtime: `sed '/^test(.traceability: phase-10 projects-stack surfaces/,$d' tests/explore-visuals.test.mjs | grep -c "REV-21"` returns 4, and `sed '/^test(.traceability: phase-10 projects-stack surfaces/,$d' tests/explore-visuals.test.mjs | grep -n "REV-21"` lists exactly those four lines, each matching `credentials|registry spine|5-section|five panel headers`. The traceability test's own REV-21 lines (title and probe regexes) are excluded by the slice by construction; do not substitute a `grep -v` allowance or a hand-maintained exclusion list for the slice.
      - The natural-height pin covers BOTH word forms and is verifiable from the shell as well as from Node (plan-checker W-2): after this task, running the clause-5 regex in Node over each file reports 0 matching lines for both `tests/explore-shell.test.mjs` and `tests/explore-sweep.test.mjs` (the pre-edit Node measurement was 1 and 2), and the hyphenated form is checked separately so the space-only blind spot cannot return: `grep -c "natural-height" tests/explore-sweep.test.mjs` returns 0 (pre-edit: 1, at line 87) and `grep -c "natural height" tests/explore-shell.test.mjs` returns 0.
      - `grep -rc "^import\|require(" src/components/explore/projects-card-state.ts` returns 0 (the module stays runtime-free — this plan must not have touched code, only the header comment).
      - No behaviour drift: `git diff --stat HEAD -- src/` shows only comment-bearing files, and `git diff HEAD -- src/ | grep -cE "^[-+].*(LEVELS|IMPERFECTION|CURATED_VARIANTS|SWIPE_THRESHOLD|aria-|className|drag=|onClick)"` returns 0.
      - Every suite is green on the final workspace state of this task: `node --test tests/*.test.mjs` exits 0 with 0 fail and 0 skipped.
      - The classification is recorded: the SUMMARY contains the re-measured total occurrence count, the per-file after-counts, the list of the 13 rewritten references and the list of the 23 untouched phase-11 ones.
    </acceptance_criteria>
    <done>GREEN commit landed: docs(10-08): reclassify the phase-10 projects-stack citations to REV-18 — the traceability test passes and every suite is green.</done>
  </task>

  <task type="auto">
    <name>Task 3: Record the gap-closure resolution in CONTEXT.md, then run the full gate last</name>
    <files>.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md</files>
    <read_first>.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-VERIFICATION.md, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-07-PLAN.md, .planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md</read_first>
    <action>
      1. APPEND to `src`-free planning record `.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md` a new section `## Gap-closure resolution (2026-09-30)` after the existing `### Contract sweep (2026-09-29)` section, containing:
        - **Gap R6 resolved in code (verification option R1), not by amending the contract (option R2).** Reason on record, quoted verbatim: the user directive `.planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md` req 3 ("then LOOPS to the BACK of the stack (depth = last level, zIndex lowest, offsets reset)"; "Swipe left AND right both cycle (the fly-off direction follows the swipe side)") and req 7 ("Next = send front card to back with a left-fly-off, Previous = bring the back card forward with a right-fly-off — mirrored directions"), plus the stage's own comments at `projects-stack-stage.tsx:594`/`:597` (recorded as AP-13) which described the intended mapping while the code contradicted it. The contract text was right; the wiring was wrong.
        - **The delivered ring-step contract** as a compact table: swipe (either side) → ring +1, exit sign = gesture side, departing card lands at depth count−1; Next → ring +1, exit −1 (left), departing card at depth count−1; Previous → ring −1, exit +1 (right), the card that was at depth count−1 is promoted to the foreground and the departing card lands at depth 1. Name `ringStep(source, gesture)` / `advanceFront` / `ringDepth` in `projects-card-state.ts` as the single mapping site, and record that the counter/aria-live were never changed (they derive from `frontIndex + 1`).
        - **What did NOT change in this gap closure**: no line of `ROADMAP.md`, `REQUIREMENTS.md`, `SPEC.md` or `UI-SPEC.md`; no geometry constant, LEVELS entry, threshold, layout class, aria attribute or reduced-motion branch; no data field; no new dependency. The `SUPERSEDED:` quarantine lines of the 2026-09-29 amendment remain byte-for-byte.
        - **AP-12 closed** (the mis-cited requirement ids), with the measured enumeration: 36 REV-21 occurrences at planning time = 13 phase-10 mis-cites rewritten to REV-18 (naming the three the verification report's list missed: `tests/explore-shell.test.mjs:369`, `tests/explore-sweep.test.mjs:57,87`) + 23 phase-11 citations left untouched; the new traceability test in `tests/explore-visuals.test.mjs` pins the budget.
        - **Still open / unchanged**: the five perceptible human items are discharged only by the recorded batch approval (`c97b0e8`, `status_human: approved`) — this gap closure claims no browser-verified or visually-measured result; AP-2 (delegated 20-line mobile stack) and AP-8 (`RESEARCH.md` line count) stay accepted deviations; AP-10 and AP-11 stay INFO. Human items 1-5 from the verification report remain open as user-facing checks.
        - Do NOT restate or re-derive any figure already in the 2026-09-29 sweep; cite it instead.
      2. THEN run the full gate as the CHRONOLOGICALLY LAST action of this plan and of the wave: `npm run typecheck`, `npm run build`, `node --test tests/*.test.mjs`. Before `npm run build`, confirm no Next.js dev server is serving this worktree (`ss -ltnp | grep :3000`) — a production build wipes a live dev server's `.next` manifests and makes it serve 500s (skill: nextjs-dev-build-conflict); if one is running, stop it first or defer the build with the reason recorded. Confirm the export still contains all six project names and `query_context` in `out/explore.html` (the SSR evidence the verification used). Record every measured number (typecheck exit code, build exit code + `Exporting (n/n)`, the suite's pass/fail/skip counts, the export probe output) in the SUMMARY — never an estimate.
      3. Do NOT commit any other file in this task, and do not touch `STATE.md` (the orchestrator owns the loop position).
    </action>
    <verify>The three gate commands exit 0 in the stated order, with `node --test tests/*.test.mjs` the last command run. `git status --porcelain` shows only `CONTEXT.md` (plus, if the build regenerated it, an already-ignored `out/`). Paste the raw command output blocks into the SUMMARY.</verify>
    <acceptance_criteria>
      - `grep -c "## Gap-closure resolution (2026-09-30)" .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md` returns 1.
      - The resolution record names both options and the chosen one: `grep -c "option R1\|R1 (code fix)" …CONTEXT.md` returns at least 1 and `grep -c "R2" …CONTEXT.md` returns at least 1.
      - The record cites the directive by path: `grep -c "2026-09-25-projects-swipe-loop-stack" …CONTEXT.md` returns at least 1.
      - The quarantine is intact: `grep -nE "carouselProgress|carouselPosition|main\.scrollTo|ResizeObserver|useScroll|300vh" …CONTEXT.md | grep -vc "SUPERSEDED:"` returns 0 (the 2026-09-29 amendment block is unchanged) and `grep -c "SUPERSEDED:" …CONTEXT.md` is unchanged from the pre-edit measurement recorded at the top of the SUMMARY.
      - `npm run typecheck` exits 0; `npm run build` exits 0 and reports static export of `/`, `/explore`, `/resume`; `node --test tests/*.test.mjs` exits 0 with 0 fail and 0 skipped.
      - The measured test total is recorded and is greater than the pre-gap baseline of 269 (the wave's new tests are counted, not assumed).
      - No planning document other than `CONTEXT.md` was modified in this task: `git status --porcelain .planning/` lists only this file.
    </acceptance_criteria>
    <done>docs commit landed: docs(10-08): record the gap-closure resolution (R6 resolved in code, AP-12 reclassified) — full gate green and chronologically last over the final workspace state.</done>
  </task>
</tasks>

<verification_against_gap>
| item from the verification report | closed by |
|---|---|
| Gap R6 — the ring rotation is inverted relative to the fly-off side (REV-18 loop-to-the-back holds one way only) | plan 07 (code fix, red-first): the pure `ringStep`/`advanceFront`/`ringDepth` contract, both swipe sides looping the departing card to depth count−1, Next advancing and Previous inverting, with the independent probe on record |
| AP-13 — the stage comments describe the opposite of the delivered mapping | plan 07 task 2 step 9: the comments are KEPT (they were the correct spec) and the code is made to match them; the acceptance greps pin both strings |
| AP-12 — five phase-10 surfaces cite phase 11's REV-21 (WARNING) | this plan, tasks 1-3: a new traceability test (red first), the 13-reference reclassification (including three the report's list missed), and the recorded enumeration |
| Overrides 1-3 (AP-2 deviation, AP-8 deviation, the recorded batch approval) | unchanged and re-affirmed in the CONTEXT resolution record; no override is re-opened or re-litigated |
| AP-10 / AP-11 (INFO) | unchanged; recorded as INFO in the resolution record |

No claim in this plan set is a browser-verified or visually-measured result. Every number quoted was produced by a command run in the planning session (the 36/13/23 citation enumeration, `cardState(0,1,6,false)` → y -190 / scale 0.80 / opacity 0.30 / z 50, `cardState(0,5,6,false)` → y -38 / scale 0.96 / opacity 0.95 / z 90, and the RED probe `ringStep is not a function`); the plans' verify blocks re-measure each one instead of trusting these.
</verification_against_gap>
