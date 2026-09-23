---
phase: EXPLORE-06-explore-revision
plan: 04
type: execute
wave: 3
depends_on:
  - "EXPLORE-06-explore-revision-01"
  - "EXPLORE-06-explore-revision-02"
  - "EXPLORE-06-explore-revision-03"
# files_modified scope note (checker D-5 override): 17 listed paths exceed the ≤10 guideline — 3 are pure deletions (skills-chart.tsx, skills-treemap.tsx, ui/chart.tsx), 2 are dependency-graph sync (package.json, package-lock.json), and 3 are stale-test rewrites this phase's own edits force (explore-shell/explore-routing/explore-sweep — checker BLOCKER fix: no other plan owns them, the gate must pass them on the final tree), so the effective authored-edit surface is ~9 files; kept whole for cohesion (one viz overhaul, one dependency removal + the phase green gate), not split.
files_modified:
  - "src/components/explore/viz-data.ts"
  - "src/components/explore/sections/projects-calendar.tsx"
  - "src/components/explore/sections/projects-section.tsx"
  - "src/components/explore/sections/skills-section.tsx"
  - "src/components/explore/sections/skills-chart.tsx"
  - "src/components/explore/sections/skills-treemap.tsx"
  - "src/components/ui/chart.tsx"
  - "src/components/explore/explore-panels.tsx"
  - "src/components/explore/constants.ts"
  - "package.json"
  - "package-lock.json"
  - "tests/projects-calendar.test.mjs"
  - "tests/explore-visuals-skills.test.mjs"
  - "tests/explore-visuals.test.mjs"
  - "tests/explore-shell.test.mjs"
  - "tests/explore-routing.test.mjs"
  - "tests/explore-sweep.test.mjs"
autonomous: true
requirements: ["REV-05", "REV-06"]
user_setup: []
must_haves:
  truths:
    - "The Skills panel renders 8 competency cards (accent chip with the cluster name + one-line quantified proof from data.core_competencies) and contains NO bar chart and NO treemap; the grouped skill chips and terminal pointer remain below the cards"
    - "The Projects panel renders the year-grid bars calendar between the stat tiles and the cards — year columns 2016→present derived from data, month-known projects get a one-month-cell bar, year-only projects (Clarif-AI, DeepIndex) get a full-year-span bar, date-less projects ('Ongoing') get no bar — with the cards byte-unchanged below"
    - "The calendar geometry is never invented: all parsing lives in viz-data.ts as a pure typed builder with injectable now, zero recharts, zero client directives — fully present in the static export"
    - "recharts is removed from package.json (dependencies 39→38) with ui/chart.tsx deleted, and tsc --noEmit + npm run build + the full explicit 11-suite node --test run are green on the final tree, chronologically last — including the three pre-existing suites this phase rewrites to the post-merge/post-refresh contracts (explore-shell: 4-id section loop, no ContactSection, 2×2 grid, 0/4 counter, new export title; explore-routing + explore-sweep E-4: 38 deps)"
    - "The tour's skills step copy no longer mentions the treemap; experience-section.tsx and career-span-chart.tsx remain byte-untouched (D-09)"
  artifacts:
    - path: "src/components/explore/viz-data.ts"
      provides: "New pure buildProjectCalendar geometry builder (injectable now, geometry-never-invented); techMentions machinery deleted"
      min_lines: 300
    - path: "src/components/explore/sections/projects-calendar.tsx"
      provides: "Pure server renderer of the year-grid bars calendar (career-span-chart precedent)"
      min_lines: 50
    - path: "src/components/explore/sections/skills-section.tsx"
      provides: "Competency + proof cards composing first, chips + pointer preserved"
      min_lines: 60
    - path: "tests/projects-calendar.test.mjs"
      provides: "Unit tests on buildProjectCalendar: month parsing, year-only spans, Ongoing null, column range"
      min_lines: 60
    - path: "tests/explore-visuals-skills.test.mjs"
      provides: "Rewritten skills suite: cards anatomy, no recharts, chips/pointer intact"
      min_lines: 60
  key_links:
    - from: "src/data/portfolio-main-data.json"
      to: "src/components/explore/viz-data.ts"
      via: "buildProjectCalendar parses project.date strings into bar geometry — no component parses dates inline"
      pattern: "buildProjectCalendar"
    - from: "src/components/explore/viz-data.ts"
      to: "src/components/explore/sections/projects-calendar.tsx"
      via: "renderer consumes precomputed leftPct/widthPct — components never parse strings (viz-data single-site rule)"
      pattern: "buildProjectCalendar"
    - from: "src/data/portfolio-main-data.json"
      to: "src/components/explore/sections/skills-section.tsx"
      via: "competency cards render data.core_competencies threaded through the panels adapter"
      pattern: "core_competencies"
    - from: "package.json"
      to: "tests/explore-visuals.test.mjs"
      via: "dependency-count test updated to 38 with recharts absent — the gate proves zero remaining usages"
      pattern: "recharts"
---

<objective>
Replace the Skills panel's recharts bar chart + treemap with competency + proof cards from the refreshed data (REV-05, D-06), add the year-grid bars calendar to the Projects panel (REV-06, D-07) as a pure-CSS viz-data-fed renderer, remove recharts entirely once zero usages remain (OQ-2, gate-verified), and land the phase's final chronological green gate over the whole tree.
</objective>

<assumption_delta_decision>
- noun: the Projects panel's project visualization (cards → cards + year-grid calendar) and the Skills panel's visualization (chart+treemap → cards).
- decision: add-alongside for the Projects calendar (locked by D-07/SPEC REV-06 "alongside the unchanged cards" — accepted debt: two parallel renderings of the same 14 projects, mitigated by single-site derivation in viz-data); promote for Skills — the competency card is the primary skills rendering, the chart/treemap are removed (not kept alongside), per D-06.
- rationale: the user judged the charts "not valuable" (removal locked) but explicitly wanted the calendar added next to the cards (addition locked).
- accepted debt: calendar + cards must stay consistent — both derive from the same JSON through viz-data builders; no component-side parsing.
- invariant companion: buildProjectCalendar unit tests + the export-level presence check round-trip every rendered bar through portfolio-main-data.json (no hardcoded geometry anywhere).
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-SPEC.md (Req REV-05/REV-06)
@.planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-RESEARCH.md (OQ-1, OQ-2, OQ-10, OQ-11, OQ-12, R-5, R-10)
@src/components/explore/viz-data.ts
@src/components/explore/sections/skills-section.tsx
@src/components/explore/sections/skills-chart.tsx
@src/components/explore/sections/skills-treemap.tsx
@src/components/explore/sections/career-span-chart.tsx
@src/components/explore/sections/projects-section.tsx
@src/components/explore/explore-panels.tsx
@src/components/explore/constants.ts
@src/components/ui/chart.tsx
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — buildProjectCalendar geometry + year-grid renderer wired into Projects</name>
    <files>tests/projects-calendar.test.mjs, src/components/explore/viz-data.ts, src/components/explore/sections/projects-calendar.tsx, src/components/explore/sections/projects-section.tsx</files>
    <read_first>src/components/explore/viz-data.ts (parseMonthYear, YEAR_PATTERN, monthIndex, buildCareerSpan precedent lines 288-358), src/components/explore/sections/career-span-chart.tsx, src/components/explore/sections/projects-section.tsx, src/data/portfolio-main-data.json (projects dates)</read_first>
    <action>RED first: write tests/projects-calendar.test.mjs (zero-dep node --test; import buildProjectCalendar directly from the TS module like tests/explore-visuals.test.mjs imports buildCareerSpan) pinning, with fixed now = new Date('2026-09-21T00:00:00Z'): year columns span 2016..2026 (11 columns — min data year from 'November 2016', max = injectable now's year); rows in JSON order for all 14 projects (no sorting); each 'Month YYYY' date yields a one-month-cell bar (spot-check two concrete projects' leftPct/widthPct arithmetic against monthIndex); year-only dates ('2026' — Clarif-AI, DeepIndex) yield a full-year-span bar (12 months) inside their year column; 'Ongoing' (Portfolio Website) yields a row with null leftPct/widthPct and its date string copied verbatim; unparseable dates never throw (geometry-never-invented, E-1 precedent). Run it — the import fails because buildProjectCalendar does not exist; capture the failure on record. GREEN: in viz-data.ts add export interface ProjectCalendarRow { index: number; name: string; date: string; leftPct: number | null; widthPct: number | null } and export interface ProjectCalendarData { startYear: number; endYear: number; yearColumns: number[]; rows: ProjectCalendarRow[] } plus export function buildProjectCalendar(projects: PortfolioData['projects'], now: Date = new Date()): ProjectCalendarData — reuse parseMonthYear/YEAR_PATTERN/monthIndex in-module; axis = months from startYear January through endYear December (endYear = now.getFullYear()); month-known → start monthIndex(year, month), width 1 month (D-07: single ship month); year-only → start year*12, width 12 months (OQ-1: precision the data carries, no month invented); no year → null geometry, row kept, date verbatim; percentages over the total month span; rows in JSON order. Create src/components/explore/sections/projects-calendar.tsx as a PURE server component (no 'use client', no hooks, no recharts — career-span-chart.tsx precedent): year header row (yearColumns labels) then one row per calendar row — verbatim project name + track with the bar positioned by inline style left/width percentages, hsl(var(--chart-1)) fill, min-width 2px degenerate guard, rows with null geometry render the name with an empty track; data-derived aria-label; graceful-hide (empty rows → render nothing). Wire it into projects-section.tsx composing as the MIDDLE child per OQ-11: stat tiles (mb-3 wrapper, byte-unchanged) → ProjectsCalendar → the existing cards map (byte-unchanged) → TerminalPointer. Re-run the suite to green; npm run typecheck.</action>
    <verify>npm run typecheck && node --test tests/projects-calendar.test.mjs && ! grep -c "use client" src/components/explore/sections/projects-calendar.tsx && ! grep -c "recharts" src/components/explore/sections/projects-calendar.tsx</verify>
    <acceptance_criteria>
      - RED on record: tests/projects-calendar.test.mjs failed (missing buildProjectCalendar) before the viz-data edit
      - node --test tests/projects-calendar.test.mjs exits 0: 11 year columns, 14 rows JSON order, one-month bars for month dates, full-year bars for '2026', null for 'Ongoing'
      - projects-calendar.tsx has no 'use client', no hooks, no recharts import (pure server renderer)
      - projects-section.tsx composes ProjectsCalendar after the tiles wrapper and before the cards map; the cards JSX block is byte-unchanged (git diff scoped to the insertion)
      - npm run typecheck exits 0
    </acceptance_criteria>
    <done>The calendar renders real ship-month geometry from the data, above the cards and below the tiles, static-export-safe, with the unit contract pinned.</done>
  </task>

  <task type="auto">
    <name>Task 2: Skills competency cards + chart/treemap/techMentions removal (D-06, OQ-10)</name>
    <files>tests/explore-visuals-skills.test.mjs, src/components/explore/sections/skills-section.tsx, src/components/explore/sections/skills-chart.tsx, src/components/explore/sections/skills-treemap.tsx, src/components/explore/viz-data.ts, src/components/explore/explore-panels.tsx, src/components/explore/constants.ts, tests/explore-visuals.test.mjs</files>
    <read_first>src/components/explore/sections/skills-section.tsx, src/components/explore/viz-data.ts (lines 193-260 techMentions), src/components/explore/explore-panels.tsx (skills closure), src/components/explore/constants.ts (line 100), tests/explore-visuals-skills.test.mjs, tests/explore-visuals.test.mjs (lines 29-36 import, 232-360 techMentions block, 475-530 clientChartFiles + client-boundary, 551-603 stat-literals + treemap-keywords, 600-620 spine, 660-704 export rows — numbers pre-drift, locate by content)</read_first>
    <action>RED first: rewrite tests/explore-visuals-skills.test.mjs to the NEW contract BEFORE the removal — suites asserting: skills-section.tsx composes the competency cards FIRST (cards block before the groups loop), maps data.core_competencies with zero hardcoded competency strings (codeOf greps for the nine docx segment names return nothing), no 'recharts' import anywhere under src/components/explore/, the grouped chips + font-normal pointer-events-none overrides + TerminalPointer command="skills" remain byte-stable, the panels adapter skills closure carries competencies={data.core_competencies} and no experience prop, skills-chart.tsx and skills-treemap.tsx do not exist, viz-data.ts no longer exports techMentions; also rewrite the FULL invalidated surface of tests/explore-visuals.test.mjs (line numbers drift after plan 02's wave-1 spine edits — locate by content): prune the techMentions entry from the top import list (lines 29-36 — deleting the viz-data export otherwise fails the whole suite at load); remove the techMentions unit block (lines ~232-360, every techMentions.* test); update the clientChartFiles array (lines ~475-478) and the client-boundary tests (lines ~488-530) that codeOf() the two deleted files (drop the deleted paths from clientChartFiles and the phaseTouchedComponents loops); rewrite the zero-stat-literals block (lines ~551-586) which explicitly stripAll('skills-treemap.tsx') at line 574 and loops clientChartFiles at ~581 (keep it for the surviving phase-touched files, drop the deleted-file reads); delete the treemap-keywords test (lines ~589-603 — reads the deleted file); rewrite the export-level rows to the post-removal contract: the hydration-shells test (lines 664-673) asserts ZERO recharts-responsive-container occurrences in out/explore.html and drops the treemap-caption check, and the bar-aria test (lines 675-689) plus treemap-aria test (lines 691-704) are removed (their recharts/techMentions subjects are deleted) with their successor recorded in the same commit — an export test asserting out/explore.html carries the competency-card and calendar markup instead; also update the registry-spine test in tests/explore-visuals.test.mjs (lines 605-620) to the new skills closure with 4 closures total; run both files and capture the failures on record. GREEN: skills-section.tsx — drop the SkillsChart/SkillsTreemap/techMentions imports and composition, add a competencies prop (PortfolioData['core_competencies']), render the cards block FIRST: a grid (grid grid-cols-1 gap-2 lg:grid-cols-2 per UI-SPEC §4.2 — density keys on lg, never on md/sm: the panel body is ≈320px at md, too narrow for two cards, and §13 E-20 pins 8 cards = 4×2 at lg) of 8 cards, each an accent chip (existing outline Badge with the font-normal pointer-events-none overrides) carrying the cluster name plus the one-line proof beneath in text-xs text-muted-foreground; graceful-hide: empty competencies renders no cards block while the chips block below stays independent; keep the groups chips + headers + TerminalPointer byte-identical below. U-2 ADJUDICATION ON RECORD (UI-SPEC §4.2/U-2 override): the spec's §4.2 default — line 128 'the skills chip groups … are removed from the panel body … planner default is REMOVED' and line 129 'skillsGroupCounts/skillGroupFill … with the default they are deleted too' — is OVERRIDDEN per RESEARCH OQ-10: D-06 names ONLY the BarChart + Treemap for removal ('recharts BarChart + Treemap components and their tests removed; viz-data mention machinery reduced accordingly'), the chips are not part of what the user judged 'not valuable', so the chips stay (the only /explore rendering of the full hard-skills lists), skillsGroupCounts + skillGroupFill survive with them, and ONLY techMentions dies. This sentence is the recorded contract the executor and ui-review implement against. (OQ-10 — chips are the only /explore rendering of the full hard-skills lists). explore-panels.tsx — skills closure becomes skills: ({ data }) => <SkillsSection skills={data.skills} competencies={data.core_competencies} /> (experience prop reverts; the adapter closure test in task 1's RED covers it). constants.ts line 100 — replace the skills step body's treemap sentence with a cards sentence (chrome copy, zero invented facts: 'Competency cards with the quantified proof behind each — full inventory below.'). Delete src/components/explore/sections/skills-chart.tsx and skills-treemap.tsx. viz-data.ts — delete techMentions, TreemapCell, escapeRegExp, WORD_CHAR_PATTERN, countOccurrences (lines 193-260); skillsGroupCounts + skillGroupFill stay (chips consume them). Update the export-level rows in tests/explore-visuals.test.mjs (full range per the RED enumeration above — hydration-shells 664-673, bar-aria 675-689, treemap-aria 691-704; they only pass at task 3's gate): zero recharts-responsive-container in out/explore.html, competency card content present, calendar markup present.</action>
    <verify>npm run typecheck && node --test tests/explore-visuals-skills.test.mjs tests/explore-visuals.test.mjs && ! test -f src/components/explore/sections/skills-chart.tsx && ! test -f src/components/explore/sections/skills-treemap.tsx && ! grep -rn "recharts" src/components/explore/ && ! grep -q "techMentions" src/components/explore/viz-data.ts</verify>
    <acceptance_criteria>
      - RED on record: the rewritten skills + spine suites failed against the pre-removal tree before the edits
      - node --test tests/explore-visuals-skills.test.mjs and tests/explore-visuals.test.mjs exit 0 (export-level rows may report the build hint — acceptable until task 3's gate)
      - tests/explore-visuals.test.mjs loads and exits 0 with techMentions absent from its imports, no skills-chart.tsx/skills-treemap.tsx reads anywhere, and the export rows asserting zero recharts-responsive-container
      - skills-chart.tsx and skills-treemap.tsx deleted; grep 'recharts' across src/components/explore/ returns nothing
      - grep 'techMentions' in viz-data.ts returns nothing; skillsGroupCounts and skillGroupFill still exported
      - skills-section.tsx keeps 'font-normal pointer-events-none' and '<TerminalPointer command="skills" />' (chips + pointer intact)
      - constants.ts skills step body no longer contains 'treemap'
    </acceptance_criteria>
    <done>The Skills panel is competency + proof cards over the surviving chips/pointer; the chart, treemap and their mention machinery are gone atomically with their tests rewritten.</done>
  </task>

  <task type="auto">
    <name>Task 3: recharts dependency removal + phase final green gate (OQ-2, green-gate-finality)</name>
    <files>src/components/ui/chart.tsx, package.json, package-lock.json, tests/explore-visuals.test.mjs, tests/explore-shell.test.mjs, tests/explore-routing.test.mjs, tests/explore-sweep.test.mjs</files>
    <read_first>src/components/ui/chart.tsx, package.json, tests/explore-visuals.test.mjs (lines 620-626), tests/explore-shell.test.mjs (lines 27-36, 299-321, 385, 424-432), tests/explore-routing.test.mjs (lines 197-202), tests/explore-sweep.test.mjs (lines 174-178), .planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-RESEARCH.md (§2)</read_first>
    <action>RED first: update the dependency pins to the NEW contract in three suites — tests/explore-visuals.test.mjs (lines 622-626), tests/explore-routing.test.mjs (lines 197-202, the D-05 zero-new-dependencies guard), tests/explore-sweep.test.mjs (lines 174-178, sweep E-4) — each to Object.keys(pkg.dependencies).length === 38 and pkg.dependencies.recharts === undefined; run all three and capture the failures on record (current tree: 39 deps, recharts pinned). Also rewrite tests/explore-shell.test.mjs to the post-merge/post-refresh contracts this phase's earlier plans invalidated (checker BLOCKER fix — these sites break at wave 3 when recharts leaves and no other plan owns the file): (a) the constants locked-sections loop (lines 27-36) iterates ['about','experience','skills','projects'] — 4 ids, no contact; (b) the explore-panels registration loop (lines 299-301) drops 'ContactSection'; (c) the grid test (lines 303-321) pins 'grid-cols-1 gap-4 md:grid-cols-2' with NO lg:grid-cols-3, flips the col-span-count assertion to (src.match(/(md|lg):col-span-2/g) || []).length === 0, deletes the span-conditional assertion (lines 317-319 — its successor, zero col-span classes anywhere, is already pinned by plan 02's updated sweep rows), and runs the accent loop chart-1..chart-4; (d) the static-export counter pin (line 385) becomes '0/4 sections visited' (the source counter derives from EXPLORE_SECTIONS.length post-merge); (e) the intro-strip export pin (line 428) becomes 'Anastasios Tilsizoglou — Test Automation Architect | Principal Test Automation Engineer' (plan 01's refreshed about.title). Capture the shell-suite failures on record too. GREEN: verify zero consumers first — grep -rn "ui/chart" src/ must return nothing and grep -rn "recharts" src/ must return nothing (task 2 removed the last usages); delete src/components/ui/chart.tsx (the consumerless shadcn wrapper — R-5); remove the "recharts": "^2.15.1" line from package.json and run npm install to sync package-lock.json (dependencies 39→38). Then run the PHASE FINAL GATE chronologically last on the settled tree, after plans 01-03 and tasks 1-2 of this plan are all committed: npm run build (regenerates out/ so the export-level rows read fresh artifacts) && npm run typecheck && node --test tests/explore-visuals-server.test.mjs tests/explore-visuals-skills.test.mjs tests/explore-visuals.test.mjs tests/explore-shell.test.mjs tests/explore-tour.test.mjs tests/explore-routing.test.mjs tests/explore-header.test.mjs tests/explore-sweep.test.mjs tests/portfolio-data-integrity.test.mjs tests/resume-docx-order.test.mjs tests/projects-calendar.test.mjs (the explicit 11-file form — the 8 pre-existing suites PLUS the 3 suites this phase creates: tests/portfolio-data-integrity.test.mjs [plan 01 task 3], tests/resume-docx-order.test.mjs [plan 03 task 1], tests/projects-calendar.test.mjs [this plan's task 1] — the directory form 'node --test tests/' is NOT supported by this Node runner, verified at plan time). If anything is red, fix and re-run the complete gate — the gate run must postdate every write in the phase.</action>
    <verify>npm run build && npm run typecheck && node --test tests/explore-visuals-server.test.mjs tests/explore-visuals-skills.test.mjs tests/explore-visuals.test.mjs tests/explore-shell.test.mjs tests/explore-tour.test.mjs tests/explore-routing.test.mjs tests/explore-header.test.mjs tests/explore-sweep.test.mjs tests/portfolio-data-integrity.test.mjs tests/resume-docx-order.test.mjs tests/projects-calendar.test.mjs</verify>
    <acceptance_criteria>
      - RED on record: the three updated dependency pins (visuals, routing, sweep E-4) failed (39 deps + recharts present) before the removal, and the rewritten shell-suite assertions failed against the pre-merge/pre-refresh tree
      - tests/explore-shell.test.mjs green with the 4-id section loop, no ContactSection pin, 2×2 grid assertions (no lg:grid-cols-3, col-span match count === 0, accent loop chart-1..4), '0/4 sections visited' and the new-title export pin
      - tests/explore-routing.test.mjs and tests/explore-sweep.test.mjs E-4 green with dependencies === 38 and recharts absent
      - package.json has no recharts key; Object.keys(dependencies).length === 38 (pin test green)
      - src/components/ui/chart.tsx deleted; grep -rn "recharts" src/ returns nothing
      - npm run build exits 0 and out/explore.html carries competency cards + calendar markup with no recharts-responsive-container (export-level rows green)
      - npm run typecheck exits 0 and the explicit 11-file node --test enumeration (8 pre-existing suites + tests/portfolio-data-integrity.test.mjs + tests/resume-docx-order.test.mjs + tests/projects-calendar.test.mjs) exits 0 on the final tree — the gate run is the chronologically last action of the phase; the directory form 'node --test tests/' is not used (MODULE_NOT_FOUND on this runner)
    </acceptance_criteria>
    <done>recharts is gone with its last consumer, the dependency graph is honest (38), and the entire phase is covered by one final chronological green run: build + typecheck + the full explicit 11-suite node --test gate.</done>
  </task>
</tasks>