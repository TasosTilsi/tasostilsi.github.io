---
phase: 03-explore-visuals
plan: 04
type: execute
wave: 3
depends_on: ["EXPLORE-03-explore-visuals-02", "EXPLORE-03-explore-visuals-03"]
files_modified: [tests/explore-visuals.test.mjs]
autonomous: true
requirements: ["EXPLORE-02"]
user_setup: []
must_haves:
  truths:
    - "Layer-2 source invariants are green on the final tree: augment order in all three sections, client boundary only on skills-chart.tsx, isAnimationActive={false} present, no Tooltip or matchMedia in any chart file, viz-data.ts the sole parsing site, zero hardcoded stat literals, package.json dependencies unchanged (D-04/D-05/D-07)"
    - "npm run build emits out/explore.html containing the recharts-responsive-container hydration shell, the data-derived skills aria-label, all 7 Gantt company rows with year ticks, and the JSON-derived tile values — /explore still exports statically (SPEC acceptance)"
    - "out/index.html and out/resume.html are still emitted — the CLI terminal and printable resume remain fully intact (EXPLORE-05/D-07)"
    - "The full gate is green on the final tree in one chronological-last run: npm run build, npm run typecheck, node --test tests/explore-shell.test.mjs, node --test tests/explore-visuals.test.mjs"
  artifacts:
    - path: tests/explore-visuals.test.mjs
      provides: "Layer-2 source-invariant suites + Layer-3 export-invariant suites appended to the Layer-1 unit suite — the phase's automated proof surface"
      min_lines: 250
  key_links:
    - from: tests/explore-visuals.test.mjs
      to: out/explore.html
      via: "export-level assertions after npm run build (existsSync guard + 'run npm run build' hint, suite convention)"
      pattern: "recharts-responsive-container"
    - from: tests/explore-visuals.test.mjs
      to: package.json
      via: "D-07 zero-new-deps assertion over the dependencies block (recharts ^2.15.1, audited count 39)"
      pattern: "recharts"
---

<objective>
Prove the phase, not just finish it: append the Layer-2 source-invariant and Layer-3 export-invariant suites to tests/explore-visuals.test.mjs (mirroring tests/explore-shell.test.mjs conventions), then run the complete SPEC gate — build, typecheck, both suites — as the chronological-last action on the final tree, so the last green run covers exactly what ships.
</objective>

<context>
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md — §9 grep-proof audit rules, §11 verification hooks
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-CONTEXT.md — D-04/D-05/D-07 prohibitions this plan asserts
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-RESEARCH.md — §5 validation architecture (Layer 1/2/3), OQ-1 (JSON-derived tile numbers), OQ-4 (shells only in static HTML)
@tests/explore-visuals.test.mjs — the plan-01 Layer-1 suite being extended
@tests/explore-shell.test.mjs — conventions to mirror (lines 368-426 export-level pattern with existsSync + 'run npm run build' hints)
@src/components/explore/sections/skills-section.tsx, @src/components/explore/sections/experience-section.tsx, @src/components/explore/sections/projects-section.tsx — augment-order targets
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Layer-2 source invariants appended to the suite</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>tests/explore-visuals.test.mjs (current Layer-1 content); tests/explore-shell.test.mjs lines 41-80 and 346-366 (indexOf ordering style); UI-SPEC §9, §11</read_first>
    <action>
      Append a clearly-commented Layer-2 section to tests/explore-visuals.test.mjs using the established helpers (read(), assert/strict) and the comment-stripping idiom of tests/explore-shell.test.mjs:172 for the whole-file token greps in suites (c)/(d) (doc-comment prose must never flip a source-invariant assertion). These are regression pins over the CONTRACT plans 02/03 implemented — write them from the UI-SPEC contract, then run; any failure is a real defect to fix before proceeding. Suites: (a) augment order — in skills-section.tsx indexOf('<SkillsChart') < indexOf('groups.map'); in experience-section.tsx indexOf('<CareerSpanChart') < indexOf('<ol'); in projects-section.tsx indexOf('<ProjectStatTiles') < indexOf('cards.map'); (b) client boundary — skills-chart.tsx matches /["']use client["']/ and contains "from 'recharts'"; career-span-chart.tsx and project-stat-tiles.tsx contain neither a use-client directive nor a recharts import; (c) D-04/OQ-2 — skills-chart.tsx includes 'isAnimationActive={false}'; the string 'Tooltip' appears in none of skills-chart.tsx, career-span-chart.tsx, project-stat-tiles.tsx; 'matchMedia' appears in none of the three chart files and none of the three section files; skills-chart.tsx contains no 'CartesianGrid'; (d) D-05 sole-parser — none of the six files under sections/ touched by this phase (skills-chart, career-span-chart, project-stat-tiles, and the three edited sections) contains 'parseDuration', 'new Date(', or a month-token list; the three edited sections instead reference viz-data ('skillsGroupCounts', 'buildCareerSpan', 'projectStats'); (e) EXPLORE-07 literals — project-stat-tiles.tsx contains no '2016' and no '2026'; career-span-chart.tsx contains no '2017' (tick labels come from tick.year); project-stat-tiles.tsx and career-span-chart.tsx contain no hardcoded count of experience/projects entries (no '=== 7', no '=== 14', no '=== 6' guards); (f) D-07 augment-only — package.json dependencies object has exactly 39 entries (the audited pre-phase count, verified programmatically) with recharts '^2.15.1' present and no other entry added or removed; globals.css still has the reduced-motion guard ('animation: none !important') and the two pinned light overrides inside .light .explore-shell while no shell block overrides --chart-1; (g) phase-2 preservation — experience-section.tsx still contains 'slice(0, 3)' and renders 'entry.duration'; projects-section.tsx still contains 'slice(0, 6)'; skills-section.tsx still contains 'font-normal pointer-events-none'.
    </action>
    <verify>node --test tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals.test.mjs` exits 0 including the new Layer-2 suites
      - grep -c "Layer-2" on tests/explore-visuals.test.mjs returns ≥ 1
      - the package.json assertion references the count 39 and 'recharts'
    </acceptance_criteria>
    <done>Every locked prohibition (D-04/D-05/D-07) and augment-order pin is a runnable assertion, green against the implemented tree.</done>
  </task>

  <task type="auto">
    <name>Task 2: Layer-3 export invariants — build then assert out/explore.html</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>tests/explore-shell.test.mjs lines 368-426 (export-level pattern); RESEARCH.md §5 Layer 3 + OQ-1 + OQ-4; src/data/portfolio-main-data.json</read_first>
    <action>
      Red/green ordering: append the export-level suites FIRST and run `node --test tests/explore-visuals.test.mjs` WITHOUT a fresh build if out/ is stale — the existsSync guards fail with the 'run `npm run build` first' message, which is the honest RED for not-yet-proven export behavior; then run npm run build and rerun the suite to green. Mirror tests/explore-shell.test.mjs lines 368-426: every export test starts with assert.ok(existsSync(...), '... — run `npm run build` first').

      Suites against out/explore.html (all expectations DERIVED from the JSON via fs + the viz-data imports already present in this test file — never pinned literals per OQ-1): (a) hydration shell — html includes 'recharts-responsive-container' (the SPEC's pinned acceptance; OQ-4: shells only, no static SVG); (b) skills aria-label — build the exact string the component composes ('Skills by category: ' + the six label-count pairs joined ', ') from the JSON read in the test using the same grouping order as skillsGroupCounts (import and call the real skillsGroupCounts from the .ts module on the JSON skills — single source), and assert html.includes(that string) — this proves the data-derived chart content server-rendered without SVG; (c) Gantt fully server-rendered — for each company from the JSON experience array assert html.includes(company) (all 7); call buildCareerSpan(experience) in the test and assert html.includes(String(span.startYear)) for the axis-start year tick (recomputes if data ever changes); (d) tiles — call projectStats(projects) in the test and assert html.includes(String(stats.total)), html.includes(stats.activeYearsSpan), html.includes(String(stats.linked)); (e) D-04 no-tooltip — html contains neither 'recharts-tooltip' nor 'recharts-default-tooltip'; (f) CLI/resume intact — out/index.html and out/resume.html both exist (EXPLORE-05/D-07).
    </action>
    <verify>npm run build && node --test tests/explore-visuals.test.mjs && node --test tests/explore-shell.test.mjs</verify>
    <acceptance_criteria>
      - `npm run build` exits 0 and regenerates out/explore.html
      - grep -c "recharts-responsive-container" on out/explore.html returns ≥ 1
      - `node --test tests/explore-visuals.test.mjs` exits 0 including the Layer-3 suites; `node --test tests/explore-shell.test.mjs` still exits 0 (phase-1 export assertions unbroken)
    </acceptance_criteria>
    <done>The static export provably contains the hydration shell plus the fully server-rendered Gantt and tiles with JSON-derived values, and /, /resume exports remain.</done>
  </task>

  <task type="auto">
    <name>Task 3: full green gate on the final tree (chronological-last action)</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>SPEC acceptance criteria (CONTEXT.md specifics block); RESEARCH.md §5 gates; .planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md §11</read_first>
    <action>
      Run the complete SPEC gate as ONE sequence on the final tree, with NO source, data, CSS, or planning-file edits after it (green-gate-finality: the last green run must cover the exact delivered state): npm run build (fresh static export with all three visualizations), npm run typecheck, node --test tests/explore-shell.test.mjs, node --test tests/explore-visuals.test.mjs. If anything fails, fix within this plan's scope (only tests/explore-visuals.test.mjs may be edited in this plan; a source fix belongs to the failing plan's scope — flag it in the summary instead) and rerun the ENTIRE four-command sequence. After the green run, record the manual UAT items that automation cannot prove for the verify step: 375px no horizontal scroll with all three charts present; visual row order top→bottom matching the chips order (R-7 rendered-order check); post-hydration: 6 bar bands render with both 'Languages' ticks visible (OQ-3/R-1 rendered duplicate-category check); both-theme legibility beyond the token math.
    </action>
    <verify>npm run build && npm run typecheck && node --test tests/explore-shell.test.mjs && node --test tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - all four commands exit 0 in one uninterrupted sequence on the final tree
      - out/explore.html regenerated by this build contains 'recharts-responsive-container'
      - no file outside tests/explore-visuals.test.mjs changed after this green run (git status clean of uncommitted source edits)
    </acceptance_criteria>
    <done>The SPEC gate is green with the final tree covered; phase 3 is ready for gsd_verify, with the four manual UAT items recorded.</done>
  </task>
</tasks>
