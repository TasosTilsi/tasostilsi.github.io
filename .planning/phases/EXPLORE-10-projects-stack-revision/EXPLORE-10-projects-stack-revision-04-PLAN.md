---
phase: 10-projects-stack-revision
plan: 04
type: tdd
wave: 2
depends_on:
  - "EXPLORE-10-projects-stack-revision-01"
files_modified:
  - "src/components/explore/projects-card-state.ts"
  - "tests/projects-stack.test.mjs"
autonomous: true
requirements: ["REV-19"]
gap_closure: true
user_setup: []
must_haves:
  truths:
    - "All six rendered project cards carry DISTINCT generative visuals: DeepIndex, Clarif-AI, SDK4ED-TD, ServicedMetricsCalculator, Avoid Traffic Extended and Uom Track resolve to six different variant names (REV-19 acceptance: '6 distinct variants')."
    - "Variant selection stays deterministic and index/name-seeded: repeated calls in the same process and repeated builds return the identical variant per project, with no per-render randomness."
    - "The curated per-project assignment is the PRIMARY representation and its six entries are the frozen contract: they match the anatomy of the six DELIVERED components, not a drafted label set (the pinned map below is final — the executor does not re-derive it). The djb2 name-hash remains the fallback for any project outside the curated six, so an uncurated name still resolves without a hard-coded entry."
    - "Every variant the module can return is dispatched by a real renderer: the stage's GenerativeVisual switch covers all six variant names, so no project can fall through to the default glyph visual silently."
  artifacts:
    - path: "src/components/explore/projects-card-state.ts"
      provides: "Curated per-project variant table (primary, anatomy-matched to the delivered components) over the retained djb2 fallback map, plus the unchanged cardState/firstSentence/projectYear/projectTechnologies/swipeAccepts contracts."
      min_lines: 280
      exports: ["cardState", "projectVisualVariant", "djb2", "firstSentence", "projectYear", "projectTechnologies", "swipeAccepts", "SWIPE_THRESHOLD", "SWIPE_VELOCITY_THRESHOLD"]
    - path: "tests/projects-stack.test.mjs"
      provides: "Red-first unit contract for the pure module, now pinning six-distinct variant assignment, curated-table precedence, hash fallback and stage dispatch coverage."
      min_lines: 300
      exports: []
  key_links:
    - from: "tests/projects-stack.test.mjs"
      to: "src/components/explore/projects-card-state.ts"
      via: "static import with explicit .ts extension (Node 24 type stripping) — the RED/GREEN path for this plan"
      pattern: "from '\\.\\./src/components/explore/projects-card-state\\.ts'"
    - from: "src/components/explore/projects-card-state.ts"
      to: "src/components/explore/sections/projects-stack-stage.tsx"
      via: "the unit suite reads the stage source and asserts a renderer case exists for every variant the module can return"
      pattern: "case '(terminal-mock|contract-analysis|glyph|report|dashboard|network)'"
---

<objective>
Close verification gap AP-1 (WARNING): the delivered `projectVisualVariant` produced only FIVE distinct visuals for the SIX stacked cards — `ServicedMetricsCalculator` and `Uom Track` both hashed to `network` (`djb2('ServicedMetricsCalculator') % 4 === 3`, `djb2('Uom Track') % 4 === 3`), which fails the REV-19 acceptance criterion "6 distinct variants — e.g. terminal-mock for DeepIndex, contract-analysis mock for Clarif-AI, architecture/glyph panels for the rest" and leaves REV-19 at PARTIAL in the phase-10 VERIFICATION.md.

This plan restores a curated per-project variant table as the PRIMARY representation and demotes the name-hash to the FALLBACK for projects outside the curated six. It is the only plan in this gap-closure phase that touches production geometry/variant code and its unit suite. It is a fix plan: it must change the delivered behaviour, not restate it.

Scope guard: the six SVG components in `projects-stack-stage.tsx` are already written and dispatched — this plan does NOT rewrite them, does NOT rename any variant, and does NOT touch the Experience panel, the data file, the sticky/placement map, or dependencies. The curated table's six entries are FIXED by the delivered anatomy (see <curated_table_decisions>); the executor does not re-derive them from the UI-SPEC's drafted label column.
</objective>

<curated_table_decisions>
The curated map is the frozen contract of this plan — it is declared ONCE (here and in the test's expected-map) and both representations must agree byte-for-byte:

  DeepIndex                  -> 'terminal-mock'      (TerminalVisual, stage:167)
  Clarif-AI                  -> 'contract-analysis'  (ContractVisual, stage:211)
  SDK4ED-TD                  -> 'glyph'              (GlyphVisual, stage:245 — architecture nodes + edges)
  ServicedMetricsCalculator  -> 'report'             (ReportVisual, stage:269 — three number tiles, five bars, polyline)
  Avoid Traffic Extended     -> 'network'            (NetworkVisual, stage:335 — road grid, accent route, pin, compass)
  Uom Track                  -> 'dashboard'          (DashboardVisual, stage:303 — the remaining composition)

Why these four pairings and no escape hatch: assignment follows the MEASURED anatomy of the six delivered components. SDK4ED-TD's UI-SPEC row drafts an architecture diagram and `GlyphVisual` is that diagram (three circular nodes joined by edges inside a bounding ellipse). UI-SPEC §4.4 row 3 drafts the metrics composition ("three number tiles at top; a bar chart with five bars; a simple line graph (polyline) below") and `ReportVisual` implements it verbatim — so ServicedMetricsCalculator takes `report`. `NetworkVisual` is the road-grid/route composition → Avoid Traffic Extended. Uom Track takes the only remaining variant, `dashboard` (KPI tile grid + progress bars); §4.4 row 5 drafted a report-table anatomy that no shipped component implements.

Consequence, recorded honestly: the shipped IDENTIFIERS (`glyph`, `report`, `dashboard`, `network`) differ from §4.4's drafted labels (`architecture-diagram`, `metrics-dashboard`, `report-table`, `route-map`), and one pairing (Uom Track) diverges in anatomy as well. The delivered components are the authority; the plan writes the divergence into the module docstring, and plan 06 amends UI-SPEC §4.4's variant column to the shipped identifiers with a reconciliation note. No task in this plan may "adjust the mapping to the component whose anatomy matches" — that escape hatch is deleted because it made the plan unexecutable (Task 1's pinned map and Task 2's re-derivation contradicted each other).
</curated_table_decisions>

<assumption_delta_decision>
- primary noun: the curated per-project variant table (`CURATED_VARIANTS`, keyed by project name, six entries, anatomy-matched to the delivered components) — the stack's single source of visual identity.
- demoted noun: the `djb2(project.name) % 4` hash map — retained ONLY as the deterministic fallback for project names outside the curated six.
- decision: promote
- rationale: the falsifiable REV-19 requirement is "6 distinct variants"; the hash is a means, not the requirement, and for the delivered data set it collides twice (`network` for both `ServicedMetricsCalculator` and `Uom Track`). Promoting the curated table makes distinctness a property of the design record instead of a lucky coincidence of a string hash, while the hash keeps the mechanism total for any future project.
- invariant: every card's visual round-trips through the primary path — `projectVisualVariant(project.name)` for each of the six supported names returns a distinct name, and each of those names has a renderer case in `GenerativeVisual` (both asserted in `tests/projects-stack.test.mjs`).
- NOT add-alongside: the hash is not kept as a parallel first-choice path, so no accepted debt is created.
</assumption_delta_decision>

<red_evidence>
Measured on this tree before planning, by importing the real module (`./src/components/explore/projects-card-state.ts`) and the real data file — not by inspecting literals:

  DeepIndex                    -> terminal-mock
  Clarif-AI                    -> contract-analysis
  SDK4ED-TD                    -> report
  ServicedMetricsCalculator    -> network
  Avoid Traffic Extended       -> glyph
  Uom Track                    -> network
  distinct variants = 5 of 6 cards
  COLLISION: network <- ServicedMetricsCalculator + Uom Track
  RED: six-distinct assertion FAILS          [exit code 1]

Raw hash measurements (`djb2(name) % 4`, HASH_VARIANTS = ['glyph','report','dashboard','network']):
  SDK4ED-TD 2207544841 % 4 = 1 -> report   (curated expectation: glyph)
  ServicedMetricsCalculator 2841863995 % 4 = 3 -> network (curated expectation: report)
  Avoid Traffic Extended 710323112 % 4 = 0 -> glyph      (curated expectation: network)
  Uom Track 660244267 % 4 = 3 -> network                 (curated expectation: dashboard)

Two facts the probe establishes that the plan must respect:
1. The collision is real and reproducible through the production path (`projectVisualVariant` on the real top-6 names).
2. The hash disagrees with the curated contract for ALL FOUR hash-driven projects, so the RED signal is stronger than a single collision: the six-distinct assertion AND every curated-precedence assertion (assertion 2 below) fail today. The curated table fixes distinctness and anatomy fidelity in one change — which is why the table is promoted rather than the hash being re-salted with a value that merely happens to be collision-free.
</red_evidence>

<context>
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/projects-card-state.ts (the module being fixed: FIXED_VARIANTS at 166, HASH_VARIANTS at 171, projectVisualVariant at 182-187)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/projects-stack.test.mjs (the suite being extended; the existing variant test is at 159-172)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/sections/projects-stack-stage.tsx (read-only: TerminalVisual 167, ContractVisual 211, GlyphVisual 245, ReportVisual 269, DashboardVisual 303, NetworkVisual 335, GenerativeVisual dispatch 364-383)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/data/portfolio-main-data.json (the top-6 names in data order — the source of the six names, never copied literals)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md (§4.4 at 235-246, the six-row design table whose composition column records the anatomy; its variant-label column is reconciled to the shipped identifiers by plan 06)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-VERIFICATION.md (AP-1, the finding this plan closes)
</context>

<retired_contract_note>
SUPERSEDED: UI-SPEC §3's scroll-driven geometry — the retired contract is `cardState(cardIndex, carouselProgress)`, `activeCenter = (count-1)*clamp(progress,0,1)`, `Y_upcoming = -l*38`, `LEAVE_EXTRA = 56`, the opacity keyframes `0→1, 1→0.95, 2→0.85, 3→0.70, 4→0.50, 5→0.30` and `zIndex = 100 - ceil(abs(s))*10 - (s>0?5:0)`.

The delivered contract is the swipe-driven ring buffer: `cardState(cardIndex, frontIndex, count, reducedMotion)` with cyclic `depth` levels and `zIndex = 100 - depth*10`, pinned by `tests/projects-stack.test.mjs:176-315`. No task in this plan re-applies §3; plan 06 records the supersession in the contract documents. This block exists so the retired formulas are named-and-retired behind the `SUPERSEDED:` prefix (the phase's quarantine convention) rather than left available for re-derivation.

Dependency note: this plan declares `depends_on` plan 01, so the executor is handed plan 01's SUMMARY as prior-wave context. That SUMMARY records the retired geometry contract at its line 26 and the retired progress clamping at its lines 54/59 — read them as history, not as guidance, and never reintroduce that parameter.
</retired_contract_note>

<tasks>
  <task type="test">
    <name>Task 1: RED — pin six distinct variants, the frozen curated map and dispatch coverage in tests/projects-stack.test.mjs</name>
    <files>tests/projects-stack.test.mjs</files>
    <read_first>src/components/explore/projects-card-state.ts, src/data/portfolio-main-data.json, src/components/explore/sections/projects-stack-stage.tsx, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md</read_first>
    <action>
      Extend the existing variant test in `tests/projects-stack.test.mjs` (currently titled 'djb2 and projectVisualVariant: stable, deterministic, flagship names pinned', at 159-172) and add ONE new test, without deleting any assertion that already passes. Both tests must derive the six names from the real data file (`top6`, already loaded in this suite) — no copied name literals beyond the two flagship names the existing test already pins.

      New/extended assertions:
      1. Six-distinct: build a `Set` over `top6.map((p) => projectVisualVariant(p.name))` and assert `new Set(...).size === top6.length` (6) AND `top6.length === 6`. The assertion message must name the collision explicitly so the RED failure is self-explanatory: include the offending pair in the message (you may compute duplicates by grouping names per variant and printing the groups).
      2. Curated precedence — THE FROZEN MAP: assert the exact curated assignment for each of the six names in data order — `DeepIndex` → `'terminal-mock'`, `Clarif-AI` → `'contract-analysis'`, `SDK4ED-TD` → `'glyph'`, `ServicedMetricsCalculator` → `'report'`, `Avoid Traffic Extended` → `'network'`, `Uom Track` → `'dashboard'`. This map is declared ONCE, in the test, as a single expected-map object literal keyed by name; drive each expectation from the data set by name lookup (iterate `top6`, look each name up in that map) so a data reorder cannot silently pass. Do not add any branch or comment that permits an alternative mapping — this map is the contract, and plan 06 reconciles UI-SPEC §4.4 to it, not the reverse.
      3. Determinism: call `projectVisualVariant` twice per name and assert equality (the existing stability loop must survive), and assert that the value is a member of the six-name set `['terminal-mock','contract-analysis','glyph','report','dashboard','network']`.
      4. Hash fallback preserved: assert an uncurated name still resolves through the hash — `projectVisualVariant('NotACuratedProject')` returns a member of `['glyph','report','dashboard','network']` and is stable across two calls. This pins that the fix narrows the hash rather than deleting it.
      5. Dispatch coverage (new test, title prefixed 'projectVisualVariant: every returnable variant has a renderer'): read `src/components/explore/sections/projects-stack-stage.tsx` with `readFileSync(join(root, 'src/components/explore/sections/projects-stack-stage.tsx'), 'utf8')` — the same `readFileSync`/`join`/`root` helper already imported at lines 26–28 and used at line 43; this suite has NO read helper of its own and never reads the stage file today, so use that exact imported form and add no new helper. Then assert that for each of the six variant names the source contains a `case` label naming that variant inside the `GenerativeVisual` switch (build the check by CONCATENATING the variant name into a probe string, in a form whose SOURCE never contains the character sequence `case` + space + single-quote — use exactly `const probe = ['case', "'" + variant + "'" + ':'].join(' ');` followed by `assert.ok(stackSource.includes(probe), '…')`, which yields `case '<variant-name>':` at runtime and nothing greppable in the test source; do NOT use a template literal or any single literal spelling that sequence out, because the acceptance check below greps the test file for it and must return 0 — never hard-code six label literals). This is the end-to-end guard for this plan: a variant the module can return but the stage cannot render would fall through to the default glyph visual.
      6. Keep the existing assertions for `djb2` returning a positive integer and for the two flagship pins — they must remain in the file.

      The new six-distinct and curated-precedence assertions are the RED signal: `Uom Track` currently returns `'network'` (colliding with `ServicedMetricsCalculator`), and all four hash-driven names currently disagree with the frozen map.
    </action>
    <verify>Run `node --test tests/projects-stack.test.mjs`. Expect RED: the six-distinct and/or curated-precedence assertion fails, and the failure message names ServicedMetricsCalculator/Uom Track colliding on 'network'.</verify>
    <acceptance_criteria>
      - `node --test tests/projects-stack.test.mjs` exits non-zero with the distinctness failure.
      - `grep -c "size === top6.length" tests/projects-stack.test.mjs` returns at least 1.
      - The frozen map is present exactly once as the test's expected-map: `grep -c "'Uom Track': 'dashboard'" tests/projects-stack.test.mjs` returns 1, and `grep -c "'ServicedMetricsCalculator': 'report'" tests/projects-stack.test.mjs` returns 1.
      - The dispatch check reads the stage source at runtime: `grep -c "projects-stack-stage.tsx" tests/projects-stack.test.mjs` returns at least 1.
      - The six case labels stay in the stage and are never duplicated as literals in the test: `grep -c "case '" tests/projects-stack.test.mjs` returns 0 AND `grep -cE "^    case '" src/components/explore/sections/projects-stack-stage.tsx` returns 6 (measured pre-edit: 0 in the test file, 6 in the stage — `case 'terminal-mock'` at stage:367 through `case 'network'` at stage:377). The 0-count is what the prescribed join-form probe in the action guarantees: that probe builds `case '<variant>':` at runtime while never writing the sequence in the test source, so if you substituted a template literal or a spelled-out literal the criterion would fail. Do not weaken the criterion to accommodate a differently-written probe — write the probe the action prescribes.
      - The file still contains the previously passing assertions: `grep -c "terminal-mock" tests/projects-stack.test.mjs` ≥ 2 and `grep -c "djb2" tests/projects-stack.test.mjs` ≥ 2.
      - No test is skipped or commented out: `grep -c "test.skip\|describe.skip" tests/projects-stack.test.mjs` is 0.
    </acceptance_criteria>
    <done>RED commit landed: test(10-04): pin six distinct generative variants — the suite fails for exactly the variant-collision reason.</done>
  </task>

  <task type="fix">
    <name>Task 2: GREEN — promote the frozen curated per-project variant table, keep djb2 % 4 as the fallback</name>
    <files>src/components/explore/projects-card-state.ts</files>
    <read_first>src/components/explore/projects-card-state.ts, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md, src/components/explore/sections/projects-stack-stage.tsx</read_first>
    <action>
      Fix `src/components/explore/projects-card-state.ts` so all six top-6 projects resolve to distinct variants matching the delivered components. Do not rename, add or remove any variant name — the six names `terminal-mock`, `contract-analysis`, `glyph`, `report`, `dashboard`, `network` already exist and are dispatched by the stage. Do not re-derive the mapping: the six entries below are the frozen contract that Task 1's test pins.

      CONTRACT GUARD (read before editing): the delivered signature `cardState(cardIndex, frontIndex, count, reducedMotion)` and the `LEVELS` depth table are the contract; do NOT rename the second parameter to `carouselProgress` and do NOT re-apply UI-SPEC §3's retired scroll geometry. The retired §3 formulas are enumerated once, behind the `SUPERSEDED:` prefix in the retired-contract note above; that block is history to avoid, not a specification to implement. The variant-table swap below is the ONLY module change this task makes: no geometry, no level table, no signature, no docstring claim about either.

      1. Replace the `FIXED_VARIANTS` record (declared at line 166, holding only `DeepIndex` and `Clarif-AI`) with a curated table `CURATED_VARIANTS` holding all six entries in data order (per D-03/OQ-3 as amended by this phase's gap-closure record — plan 06 amends the "name-hash only" clause): `DeepIndex: 'terminal-mock'`, `Clarif-AI: 'contract-analysis'`, `SDK4ED-TD: 'glyph'`, `ServicedMetricsCalculator: 'report'`, `Avoid Traffic Extended: 'network'`, `Uom Track: 'dashboard'`. Before finalising, read the six components in `projects-stack-stage.tsx` (TerminalVisual at 167, ContractVisual at 211, GlyphVisual at 245, ReportVisual at 269, DashboardVisual at 303, NetworkVisual at 335) and confirm the recorded pairing: SDK4ED-TD → the architecture glyph (`glyph`); ServicedMetricsCalculator → the three-tiles/five-bars/polyline metrics panel (`report`); Avoid Traffic Extended → the road-grid route panel (`network`); Uom Track → the remaining KPI/progress panel (`dashboard`). Do NOT rewrite SVG components, do NOT rename variants, and do NOT introduce an alternative mapping path.
      2. Keep `HASH_VARIANTS = ['glyph', 'report', 'dashboard', 'network']` (line 171) unchanged as the fallback list.
      3. Rewrite `projectVisualVariant(projectName, fixed = false)` (currently 182-187) so the precedence is explicit: keep the `fixed` parameter's documented semantics exactly as the existing docstring states them (`fixed = true` returns the curated entry for a known name regardless of hash — used by tests to pin flagship contracts); for the default path, return `CURATED_VARIANTS[projectName]` when the name is a key of that record, otherwise return `HASH_VARIANTS[djb2(projectName) % 4]`. The `if (projectName === 'DeepIndex')` / `if (projectName === 'Clarif-AI')` special-cases are removed and become table lookups — no name comparison may remain outside the table.
      4. Update the module docstring: state that the curated table is the primary assignment (six entries, one per top-6 project) and that the djb2 name-hash is the deterministic fallback for names outside the curated set, with the reason recorded in one line (the hash alone collided twice and yielded 5 distinct visuals for 6 cards — phase-10 VERIFICATION AP-1 / REV-19 "6 distinct variants"). Record the two fidelity facts in the same docstring, in one line each: (a) the shipped identifiers `glyph`/`report`/`dashboard`/`network` are the frozen contract and differ from UI-SPEC §4.4's drafted labels (`architecture-diagram`/`metrics-dashboard`/`report-table`/`route-map`) — the composition column of §4.4 remains the anatomy record, and plan 06 reconciles §4.4's variant column to these shipped identifiers; (b) the four assignments are anatomy-matched to the delivered components, except Uom Track → `dashboard`, whose shipped composition is the KPI/progress panel rather than §4.4 row 5's drafted report-table. Also update the `projectVisualVariant` docstring to describe the precedence order rather than the old flagship-only behaviour.
      5. Keep the module zero-runtime-import and erasable-syntax-only: no new imports, no enum/namespace, no dependency. Do not touch `cardState`, `firstSentence`, `projectYear`, `projectTechnologies`, `swipeAccepts`, the thresholds, `IMPERFECTION_*` or `LEVELS`.
    </action>
    <verify>Run, in this order: `node --test tests/projects-stack.test.mjs` (expect green), then `npm run typecheck`, then `npm run build`, then `node --test tests/*.test.mjs` (expect the full suite green — 267 tests at the pre-gap baseline plus the new assertions). All four must exit 0 on the final workspace state. Before `npm run build`: confirm no Next.js dev server is serving this worktree (`ss -ltnp | grep :3000`) — a production build wipes a live dev server's `.next` manifests and makes it serve 500s (skill: nextjs-dev-build-conflict); if one is running, stop it first or defer the build and record the reason in the task's done note. Also confirm no other plan is executing concurrently in this worktree: this phase's plans 05 and 06 are sequenced after this one (05 wave 2, 06 wave 3), so no sibling build may run at the same time.</verify>
    <acceptance_criteria>
      - `node --test tests/projects-stack.test.mjs` exits 0, including the six-distinct assertion and the dispatch-coverage test.
      - `npm run typecheck` exits 0.
      - `npm run build` exits 0 and exports `/`, `/explore`, `/resume` statically.
      - `node --test tests/*.test.mjs` exits 0 with zero failures and zero skips.
      - `grep -c "if (projectName === 'DeepIndex')" src/components/explore/projects-card-state.ts` returns 0 (the special-case branches are gone).
      - `grep -c "CURATED_VARIANTS" src/components/explore/projects-card-state.ts` returns at least 2 (the table plus its consumption in the resolver).
      - `grep -c "'Uom Track': 'dashboard'" src/components/explore/projects-card-state.ts` returns 1 (the frozen map is declared once).
      - `grep -c "HASH_VARIANTS\[djb2(projectName) % 4\]" src/components/explore/projects-card-state.ts` returns 1 (the fallback survives).
      - `grep -c "UI-SPEC §4.4" src/components/explore/projects-card-state.ts` returns at least 1 and `grep -c "anatomy" src/components/explore/projects-card-state.ts` returns at least 1 (the identifier/anatomy reconciliation and the divergence are recorded in the module docstring).
      - `grep -c "^import\|require(" src/components/explore/projects-card-state.ts` returns 0 (zero runtime imports preserved).
      - The retired-contract guard holds in the module (B-3 corrected form): `grep -nE "carouselProgress|LEAVE_EXTRA|activeCenter" src/components/explore/projects-card-state.ts | grep -vE ":[[:space:]]*(\*|//)"` returns **0** (only comment lines carry the retired names — the line-12 changelog entry is HISTORY and **must survive**) AND `grep -c "frontIndex" src/components/explore/projects-card-state.ts` returns at least 2 (the delivered `cardState(cardIndex, frontIndex, count, reducedMotion)` signature is untouched).
      - Post-build spot check: `grep -o "query_context" out/explore.html` still matches (the DeepIndex terminal mock still renders in the static export) and all six project names still appear in `out/explore.html`.
    </acceptance_criteria>
    <done>GREEN commit landed: fix(10-04): curated variant table primary, name-hash fallback — six distinct visuals, full gate green and chronologically last.</done>
  </task>
</tasks>

<residual_notes>
- Commit-scope contract (do not "improve" it): this plan is `type: tdd`, so the ship-time `tdd_audit` gate derives its commit scope as the zero-padded `{phase}-{plan}` pair — `(10-04)` — and it filters subjects with `new RegExp('\\(10-04\\)')` (`gates.js:planScope`/`tddAuditGate`). The `done` fields therefore prescribe `test(10-04): …` before `fix(10-04): …`. A subject carrying the full plan id (`EXPLORE-10-projects-stack-revision-04`) matches nothing, so the gate reports `missing test: commit before feat:/fix:` and `gsd_ship` blocks. `plan-01`'s already-landed commits are in exactly that state; the phase-level consequence is recorded deliberately in plan 06's `<ship_gate_decision>` block. Emit the subjects above verbatim.
- AP-2 (projects-mobile-stack.tsx at 20 lines vs the executed plan's min_lines: 130) is deliberately NOT inflated by this plan: the capability is delivered by delegation to `ProjectsSwipeStack mode="compact"` and is test-pinned. Plan 06 records it as an accepted deviation in the contract documents.
- The 75-85% visual-area proportion and the swipe/shadow feel stay human-verification items; this plan makes no claim about them.
- UI-SPEC §4.4's variant-label column is reconciled to the shipped identifiers by plan 06 (this plan only records the divergence in the module docstring); no task here edits the UI-SPEC.
</residual_notes>
