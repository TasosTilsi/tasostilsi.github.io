---
phase: 03-explore-visuals
plan: 04
type: execute
wave: 3
depends_on: ["EXPLORE-03-explore-visuals-02", "EXPLORE-03-explore-visuals-03"]
files_modified: [tests/explore-visuals.test.mjs]
autonomous: true
requirements: ["EXPLORE-02", "EXPLORE-02b", "EXPLORE-02c", "EXPLORE-02d"]
user_setup: []
must_haves:
  truths:
    - "Cross-cutting source invariants are green on the final tree: 'use client' ONLY on skills-chart.tsx and skills-treemap.tsx; isAnimationActive={false} in both and nowhere true; no Tooltip or matchMedia in any chart/section file this phase touched; viz-data.ts the sole duration/date/mention parsing site; zero stat literals; zero-invented treemap keywords; dependencies unchanged (39 keys, recharts ^2.15.1); the pinned light overrides present and chart-1 absent from both shell blocks (D-04/D-05/D-07/D-08, OQ-6)"
    - "npm run build emits out/explore.html containing at least 2 recharts-responsive-container hydration shells (bar + treemap), the server-rendered treemap caption 'Mentions in role responsibilities', and the data-derived aria-label substrings for all 6 bar rows and all treemap cells — /explore still exports statically (SPEC acceptance, OQ-4)"
    - "The Gantt and tiles are fully server-rendered in out/explore.html: all 7 company names, the axis-start year tick derived from the JSON, and the JSON-derived tile strings (total, span, linked — computed at test time, never the stale literal 9 or a pinned 14) (OQ-1/U-1)"
    - "out/index.html and out/resume.html are still emitted — the CLI terminal and printable resume remain fully intact (EXPLORE-05/D-07)"
    - "The full gate is green in one chronological-last run on the final tree — npm run build, npm run typecheck, node --test tests/explore-shell.test.mjs, node --test tests/explore-visuals.test.mjs, node --test tests/explore-visuals-skills.test.mjs, node --test tests/explore-visuals-server.test.mjs — and nothing is written after it; the phase's completion claim anchors on THIS run (green-gate finality)"
  artifacts:
    - path: tests/explore-visuals.test.mjs
      provides: "The phase's main proof surface: plan-01 Layer-1 unit suites + Layer-2 cross-cutting source invariants + Layer-3 export-level invariants (appended this plan)"
      min_lines: 320
  key_links:
    - from: tests/explore-visuals.test.mjs
      to: out/explore.html
      via: "export-level assertions after npm run build (existsSync guard + 'run npm run build' hint, suite convention)"
      pattern: "recharts-responsive-container"
    - from: tests/explore-visuals.test.mjs
      to: package.json
      via: "D-07 zero-new-deps assertion — dependencies object still has exactly 39 keys with recharts '^2.15.1'"
      pattern: "recharts"
    - from: tests/explore-visuals.test.mjs
      to: src/data/portfolio-main-data.json
      via: "export expectations derived from the JSON at test time (skillsGroupCounts/techMentions/company names/tile values) — survives future data edits (OQ-1)"
      pattern: "portfolio-main-data.json"
---

<objective>
Prove the phase, not just finish it: append the cross-cutting Layer-2 source invariants and the Layer-3 export-level invariants to tests/explore-visuals.test.mjs (mirroring tests/explore-shell.test.mjs conventions), then run the complete six-command gate — build, typecheck, and all four test files — as the chronological-last action on the final tree, so the last green run covers exactly what ships and nothing is written after it.
</objective>

<assumption_delta_decision>
Noun now primary: the viz-data module as the one data-shaping representation (see plan 01).
Decision: promote — this plan's export tests derive every expected string through the viz-data module at test time (counts, cells, company rows, tile values), proving the promoted representation round-trips into the rendered HTML for all four visualization variants; nothing is asserted against parallel paths. No accepted debt.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md — §10 data-derived audit (grep-proof rules), §12 verification hooks 1-9
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-CONTEXT.md — D-04/D-05/D-07/D-08 prohibitions this plan asserts
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-RESEARCH.md — §5 validation architecture (Layer 1/2/3), OQ-1 (JSON-derived tile numbers), OQ-3 (6 bands), OQ-4 (shells only in static HTML)
@tests/explore-visuals.test.mjs — the plan-01 Layer-1 suite being extended
@tests/explore-visuals-skills.test.mjs, @tests/explore-visuals-server.test.mjs — the wave-2 carriers the final gate runs alongside
@tests/explore-shell.test.mjs — conventions to mirror (export-level existsSync + 'run npm run build' hint pattern)
@src/components/explore/explore-panels.tsx, @src/app/globals.css, @package.json — invariant targets
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Cross-cutting Layer-2 source invariants (append + run on the settled wave-2 tree)</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>UI-SPEC §10 (grep-proof audit rules) and §12 (hooks), CONTEXT.md D-04/D-05/D-07/D-08, tests/explore-visuals.test.mjs (the Layer-1 file being extended), package.json (dependencies block)</read_first>
    <action>
      These are proof-of-delivery invariants against the now-complete wave-2 tree — they are expected to pass immediately (the behavior exists). Any failure is a REAL defect in the owning plan's scope: fix it in source with the smallest change honouring that plan's pinned D-NN rules, then rerun — never weaken the assertion to pass.

      Append a Layer-2 block to tests/explore-visuals.test.mjs asserting, across the files this phase touched: (a) client boundary — 'use client' appears ONLY in src/components/explore/sections/skills-chart.tsx and skills-treemap.tsx among the section/chart files; career-span-chart.tsx and project-stat-tiles.tsx contain neither 'use client' nor a recharts import (D-06); (b) motion — isAnimationActive={false} present in both chart files; grep for 'isAnimationActive={true}' under src/components/explore returns nothing; no 'matchMedia' in the four chart components or the three section bodies (explore-intro.tsx's existing matchMedia stays out of scope and untouched — scope greps to the seven files this phase edits, OQ-2); (c) interaction prohibition — no 'Tooltip' import and no 'onClick'/'onMouseEnter' in any of the four chart components (D-04/§6); (d) sole parsing site — the four chart components and the three section bodies contain no 'new Date(' and no duration/date regex parsing; every parse lives in viz-data.ts (D-05); (e) zero stat literals — the doc-comment-stripped sources of the four chart components contain no standalone 14, 9, 2016, 2026 driving rendered values (values arrive via props/module, EXPLORE-07); (f) zero-invented keywords — skills-treemap.tsx contains no hand-written technology name strings (its keyword source is viz-data's cells only, D-08); (g) registry spine — explore-panels.tsx's skills closure contains experience={data.experience} and all five closures still map their original slices with no other registry change (D-07); (h) dependencies — parse package.json and assert the dependencies object has exactly 39 keys including recharts '^2.15.1' (D-07 zero-new-deps; no dependency added or removed this phase); (i) css — the .light .explore-shell block contains '--chart-2: 160 65% 32%;' and '--chart-3: 30 75% 38%;', the dark .explore-shell block contains neither, and no '--chart-1' override appears in either block (OQ-6: the phase-1 assertions stay meaningful). Run the whole file — Layer-1 units plus the new invariants — and confirm it exits 0.
    </action>
    <verify>node --test tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals.test.mjs` exits 0 with the Layer-2 block appended
      - the test file contains assertions for: 39 dependency keys, recharts '^2.15.1', no 'Tooltip' under the chart components, no 'new Date(' in the seven phase-touched component files, and the two pinned css override strings
    </acceptance_criteria>
    <done>Cross-cutting prohibitions (client boundary, motion, tooltips, parsing site, literals, deps, css) are pinned by automated assertions on the settled tree.</done>
  </task>

  <task type="auto">
    <name>Task 2: Layer-3 export-level invariants (build, then assert out/explore.html)</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>RESEARCH.md OQ-4 (shells-only acceptance) and §5 Layer 3, tests/explore-shell.test.mjs export-level block (~lines 368-426 — existsSync guard + hint convention), src/data/portfolio-main-data.json</read_first>
    <action>
      Run `npm run build` FIRST (the export must exist for these assertions). Then append a Layer-3 block to tests/explore-visuals.test.mjs mirroring the suite's export-level convention: guard out/explore.html with existsSync and fail with a 'run npm run build' hint when absent. Assertions: (a) out/explore.html contains the string 'recharts-responsive-container' at least TWICE (bar + treemap hydration shells — the SPEC's shells-only acceptance, OQ-4); (b) the server-rendered treemap caption 'Mentions in role responsibilities' appears; (c) the bar chart's aria-label carries every 'label count' pair — import skillsGroupCounts from '../src/components/explore/viz-data.ts' (Node 24 strips the types, proven in Layer 1), derive `${label} ${count}` for all six rows, and assert each substring appears in out/explore.html; (d) the treemap's aria-label carries every `${name} ${count}` pair derived from techMentions(JSON.experience, JSON.skills) the same way; (e) the Gantt is fully server-rendered: all 7 company names from JSON.experience appear, and the axis-start year tick (derived as String of the minimum parsed start year — '2017' with current data) appears; (f) the tiles are present with JSON-derived strings: total = JSON.projects.length, span = the min/max 4-digit years across projects[].date joined by the en-dash, linked = JSON.projects.filter(p => p.link).length — derive ALL three at test time and assert each appears (never pin the stale SPEC literal 9 or a hardcoded 14, OQ-1/U-1); (g) out/index.html and out/resume.html both exist (EXPLORE-05/D-07: CLI + resume untouched). Run the file — green. Manual checks deliberately NOT asserted here (static HTML has no chart SVG, OQ-4): §12.2 bar row order (reversed YAxis), §12.3 treemap area ∝ mentions, §12.8 375px no-scroll, §12.9 both-theme legibility — these are listed for the verify step's human pass.
    </action>
    <verify>npm run build && node --test tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - `npm run build` exits 0 and emits out/explore.html
      - `node --test tests/explore-visuals.test.mjs` exits 0 with the Layer-3 block passing
      - the test file derives the tile strings and aria-label pairs from the JSON/viz-data at test time (contains 'skillsGroupCounts' and 'techMentions' imports) and contains no pinned linked literal (grep for "linked, 9" or "linked).toBe(14" returns nothing)
      - out/index.html and out/resume.html exist on disk after the build
    </acceptance_criteria>
    <done>The static export provably contains the hydration shells, the server-rendered Gantt/tiles, and the data-derived aria labels — /explore still exports statically with / and /resume intact.</done>
  </task>

  <task type="auto">
    <name>Task 3: Full gate — the chronological-last green run on the final tree</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>tests/explore-shell.test.mjs (regression target), STATE.md blockers note (milestone ships as a whole — this gate is the phase's completion proof)</read_first>
    <action>
      Run the COMPLETE six-command gate in this exact order, as the LAST actions on the final tree, with NO file writes of any kind after it (any later write — code, docs, or planning artefacts — re-opens the gate): 1. npm run build; 2. npm run typecheck; 3. node --test tests/explore-shell.test.mjs; 4. node --test tests/explore-visuals.test.mjs; 5. node --test tests/explore-visuals-skills.test.mjs; 6. node --test tests/explore-visuals-server.test.mjs. All six must exit 0 in this single chronological-last run. If anything fails: make the smallest source fix that honours the owning plan's D-NN pins, commit it atomically, and rerun the FULL six-command sequence from step 1 — never declare the phase done on a gate that predates the last write. This run is the phase's completion evidence: /explore still exports statically (out/explore.html emitted by step 1), and the CLI (/) and /resume suites still pass.
    </action>
    <verify>npm run build && npm run typecheck && node --test tests/explore-shell.test.mjs && node --test tests/explore-visuals.test.mjs && node --test tests/explore-visuals-skills.test.mjs && node --test tests/explore-visuals-server.test.mjs</verify>
    <acceptance_criteria>
      - each of the six commands exits 0 in the same chronological-last run
      - out/explore.html exists after the final build (SSG acceptance)
      - no file in the workspace is modified after this run completes (the completion claim anchors on this run)
    </acceptance_criteria>
    <done>The phase gate is green chronologically-last on the final tree: build, typecheck, and all four suites pass together — the phase is provably done, not merely finished.</done>
  </task>
</tasks>