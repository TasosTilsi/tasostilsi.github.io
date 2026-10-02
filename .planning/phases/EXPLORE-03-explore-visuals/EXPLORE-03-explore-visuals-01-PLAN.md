---
phase: 03-explore-visuals
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [src/components/explore/viz-data.ts, tests/explore-visuals.test.mjs]
autonomous: true
requirements: ["EXPLORE-02", "EXPLORE-02b", "EXPLORE-02c", "EXPLORE-02d"]
user_setup: []
must_haves:
  truths:
    - "All 7 real duration strings from portfolio-main-data.json parse to exact start/end months under both dash styles (em-dash U+2014 and hyphen U+002D), the 4-letter 'Sept' token, and 'Present' semantics (D-05, R-5)"
    - "skillsGroupCounts applied to the JSON yields exactly Soft Skills 6, Languages 9, Testing 6, Infrastructure 6, Innovation 7, Languages 2 in JSON group order, duplicate 'Languages' preserved, with the shared category→token fill on every group (chart-1..5 for contentful positions 0-4, muted-foreground from position 5 — the single map consumed by BOTH the bar chart and the treemap per UI-SPEC §2)"
    - "techMentions applied to the JSON yields exactly the cells CI/CD 2, Java 1, MCP 1, RAG 1 in flattened keyword-set order (JSON group order), colored by owning group's fill, with every cell name provably present in the JSON's own technology names — zero invented keywords (D-08, UI-SPEC §0/§10)"
    - "projectStats applied to the JSON yields total 14, active-years span '2016–2026' (en-dash), and a linked count derived from the JSON at test time — the stale SPEC literal 9 (and any pinned 14) never appears in module or tests (OQ-1/U-1)"
    - "buildCareerSpan with an injected now places WashPark's bar left edge at 0%, extends Present rows to 100%, emits year ticks from the axis-start year through the axis-end year, and keeps rows in JSON order — no sorting anywhere (D-02, R-4/E-6)"
  artifacts:
    - path: src/components/explore/viz-data.ts
      provides: "Pure typed data-shaping module — parseDuration, skillsGroupCounts, projectStats, techMentions, buildCareerSpan, skillGroupFill; the ONLY duration/date/mention-matching site under src/components/explore/ (D-05/D-08)"
      min_lines: 170
      exports: ["parseDuration", "skillsGroupCounts", "projectStats", "techMentions", "buildCareerSpan", "skillGroupFill", "ParsedDuration", "SkillGroupCount", "TreemapCell", "ProjectStats", "CareerSpanRow", "YearTick", "CareerSpanData"]
    - path: tests/explore-visuals.test.mjs
      provides: "Layer-1 unit suite importing the pure .ts module directly under node --test (Node 24 type stripping, OQ-5), every expectation derived from the real JSON at test time"
      min_lines: 200
  key_links:
    - from: tests/explore-visuals.test.mjs
      to: src/data/portfolio-main-data.json
      via: "fs read of the real JSON — every expectation derived from the data at test time (EXPLORE-07)"
      pattern: "portfolio-main-data.json"
    - from: src/components/explore/viz-data.ts
      to: src/data/portfolio-main-data.d.ts
      via: "type-only aliased import — erased at runtime under node --test, resolved by tsc (OQ-5)"
      pattern: "import type \{ PortfolioData \} from '@/data/portfolio-main-data'"
---

<objective>
Deliver the pure, typed data-shaping module every phase-3 visualization consumes, plus the unit harness that proves it. This is the D-05 domain tier: parseDuration() normalizes both dash styles and 'Present', skillsGroupCounts() becomes the single source of the skills grouping AND of the shared category→token fill map, techMentions() implements the D-08 whole-word mention matcher (zero-invented keywords over the responsibilities corpus), projectStats() computes the three tile values, and buildCareerSpan() turns duration strings into Gantt percentages with an injectable now (OQ-7). Everything here is pure and unit-tested under the repo's node --test convention before any component consumes it.
</objective>

<assumption_delta_decision>
Noun now primary: the single typed viz-data module (viz-data.ts) as the phase's one data-shaping representation.
Decision: promote — D-05 locks parse-once in this module and UI-SPEC §10 pins "no parallel grouping implementation"; every consumer (bar chart, treemap, Gantt, tiles) receives precomputed values, so the old per-component shaping pattern is demoted/removed rather than added alongside. No accepted debt. Invariant companion: the Layer-1 suite proves every rendered default round-trips through this module for all four visualization variants (counts, cells, geometry, stats).
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-CONTEXT.md — locked decisions D-01…D-08; honour every D-NN cited below
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md — binding design contract; §0 (verified treemap data: 4 cells / 5 mentions), §2 (color map), §3 (matching rule), §4 (axis contract), §10 (data-derived audit + unit-test pins)
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-RESEARCH.md — §1.2 parse inventory (all 7 duration strings, month tokens), §2 Node-toolchain facts, OQ-1/OQ-5/OQ-7 resolutions
@src/data/portfolio-main-data.d.ts — ExperienceEntry.isTechRelated required, responsibilities optional; Project.date/link optional (R-6)
@src/data/portfolio-main-data.json — read-only; source of every expected value
@tests/explore-shell.test.mjs — the established node --test conventions this file mirrors (assert/strict, root-relative read, export-level existsSync guards)
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — parseDuration + harness proof (JSON → pure TS → node --test)</name>
    <files>src/components/explore/viz-data.ts, tests/explore-visuals.test.mjs</files>
    <read_first>src/data/portfolio-main-data.d.ts, src/data/portfolio-main-data.json (experience entries), tests/explore-shell.test.mjs (lines 1-40 for conventions), RESEARCH.md §2 (Node toolchain facts) and §1.2B (parse inventory table)</read_first>
    <action>
      Red/green ordering (session discipline, applies to every task in this plan): the test file is written and RUN first. `node --test tests/explore-visuals.test.mjs` must FAIL on the missing module — that failing run is the on-record RED for the missing parseDuration behavior. Only after observing it, create src/components/explore/viz-data.ts and rerun the same command to green.

      Create src/components/explore/viz-data.ts per D-05. Header doc-comment states: pure data-shaping module — the ONLY duration/date parsing and mention-matching site under src/components/explore/; contains ZERO runtime imports so Node 24 type stripping can import it directly under node --test (OQ-5: erasable TS syntax only — type annotations and interfaces, no enum/namespace/parameter properties); the sole import line is the type-only `import type { PortfolioData } from '@/data/portfolio-main-data'`.

      Export interface ParsedDuration { startYear: number; startMonth: number; endYear: number | null; endMonth: number | null; isPresent: boolean }. Export function parseDuration(raw: string): ParsedDuration | null that: splits on BOTH dash styles — em-dash U+2014 and hyphen-minus U+002D (the JSON carries 'Sept 2023 — Present' with U+2014 and 'March 2017 - June 2017' with U+002D); trims both sides; treats a side equal to 'Present' (case-insensitive) as isPresent true with endYear/endMonth null; matches month tokens case-insensitively by their FIRST THREE LETTERS (resolves all 8 tokens present in the data: sep, aug, jun, apr, may, jul, mar, nov — 'Sept' is 4 letters, 'November'/'June'/'April'/'March' are full words; R-5); parses the year as a 4-digit (19|20)xx; returns null on any malformed side — never throws.

      Create tests/explore-visuals.test.mjs mirroring tests/explore-shell.test.mjs conventions: node:test + node:assert/strict imports, a root-relative read() helper using dirname(fileURLToPath(import.meta.url)). Header doc-comment records: Layer-1 unit suite; runner node --test tests/explore-visuals.test.mjs (no npm test script exists — run directly); local-only gate because CI (.github/workflows/deploy.yml) runs Node 20 and never runs tests, while type stripping needs Node ≥23.6 (OQ-5). Import with an explicit .ts extension: `import { parseDuration } from '../src/components/explore/viz-data.ts'`. Suite 1: read src/data/portfolio-main-data.json via fs and assert parseDuration over all 7 real duration strings — Chubb 'Sept 2023 — Present' → start {2023, 9} isPresent true; Upstream 'Sept 2022 — Aug 2023' → {2022, 9} → {2023, 8}; Netcompany-Intrasoft 'June 2019 — Sept 2022' → {2019, 6} → {2022, 9}; Smartup PCC 'November 2017 - April 2018' → {2017, 11} → {2018, 4}; Sweet Corner 'May 2018 - June 2018' → {2018, 5} → {2018, 6}; Mini Market 'June 2017 - July 2017' → {2017, 6} → {2017, 7}; WashPark 'March 2017 - June 2017' → {2017, 3} → {2017, 6}. Suite 2: malformed inputs — 'garbage', 'March', '2023 — ', empty string, 'March 2017 — someday' — all return null without throwing.
    </action>
    <verify>node --test tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals.test.mjs` exits 0 with all suites passing
      - grep "export function parseDuration" hits src/components/explore/viz-data.ts
      - the ONLY import line in viz-data.ts is the type-only PortfolioData import (grep "^import " returns exactly one match, matching "import type")
      - the test file contains "portfolio-main-data.json" and asserts isPresent true for the Chubb entry
    </acceptance_criteria>
    <done>The tracer is green: the pure-TS-under-node-test harness is proven on the real repo, and the hardest parsing case set (both dashes, Sept, Present) is locked by tests.</done>
  </task>

  <task type="auto">
    <name>Task 2: skillsGroupCounts (+ shared fill map) + projectStats with JSON-derived tests</name>
    <files>src/components/explore/viz-data.ts, tests/explore-visuals.test.mjs</files>
    <read_first>src/components/explore/sections/skills-section.tsx (lines 29-40 — the builder being adopted), src/data/portfolio-main-data.json (skills + projects), UI-SPEC §2 (color map), §5 (tile derivations), §10 (single-source pin), CONTEXT.md D-01/D-03, RESEARCH.md OQ-1</read_first>
    <action>
      Red/green ordering: append the skillsGroupCounts and projectStats expectations to tests/explore-visuals.test.mjs FIRST (they import the not-yet-existing exports) and run the suite to observe those failures — the on-record RED. Then extend viz-data.ts as below and rerun to green.

      Extend viz-data.ts. Export interface SkillGroupCount { id: string; label: string; count: number; items: string[]; fill: string }. Export function skillGroupFill(groupIndex: number): string — the SHARED category→token map pinned once here (UI-SPEC §2): contentful-group positions 0-4 map to 'hsl(var(--chart-1))' … 'hsl(var(--chart-5))' in order; position 5 and above maps to 'hsl(var(--muted-foreground))'. Export function skillsGroupCounts(skills: PortfolioData['skills']): SkillGroupCount[] — adopt the builder logic VERBATIM from skills-section.tsx lines 29-40: soft_skills first with id 'soft_skills' and label 'Soft Skills', then hard_skills Object.entries in insertion order with the category key verbatim as label, then languages with id 'languages' and label 'Languages'; contentful groups only, no sorting, duplicate 'Languages' label preserved; count is items.length; fill is skillGroupFill(position) by contentful-group position (UI-SPEC §10 single source of truth — the bar chart and treemap both consume this fill, so no component ever maps colors in parallel; E-7 counts always match rendered chips once plan 02 moves the section onto this function).

      Export interface ProjectStats { total: number; activeYearsSpan: string | null; linked: number }. Export function projectStats(projects: PortfolioData['projects']): ProjectStats per D-03: total is projects.length; collect 4-digit (19|20)xx matches from the OPTIONAL date strings, skipping entries without date and strings without a year ('Ongoing' excluded, E-8); activeYearsSpan is min and max year joined by the en-dash U+2013 ('2016–2026') or null when no year parses (E-9); linked is the count of entries with a truthy link — COMPUTED from the data, never a literal (OQ-1/U-1: the SPEC's stale '(9)' must not appear in this module, any component, or any test expectation); graceful on missing date/link — never throws (R-6).

      Tests: skillsGroupCounts(JSON.skills) equals the exact label/count sequence Soft Skills 6, Languages 9, Testing 6, Infrastructure 6, Innovation 7, Languages 2 in that order, with id fields 'soft_skills'/'hard_skills.Languages'/'hard_skills.Testing'/'hard_skills.Infrastructure'/'hard_skills.Innovation'/'languages', items equal to the JSON arrays, and fills 'hsl(var(--chart-1))' through 'hsl(var(--chart-5))' for the first five rows and 'hsl(var(--muted-foreground))' for the sixth. Also assert skillGroupFill(5) and skillGroupFill(7) both return the muted-foreground token. projectStats(JSON.projects) has total 14, activeYearsSpan '2016–2026', and linked asserted EQUAL to JSON.projects.filter(p => p.link).length (derived, not a literal). Fixture tests: an array with entries missing date and link, plus a dateless 'Ongoing' entry — no throw, correct skips, activeYearsSpan null when no date carries a year (E-9), linked counts only truthy links.
    </action>
    <verify>node --test tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals.test.mjs` exits 0 with the new suites passing
      - grep "skillsGroupCounts", "projectStats" and "skillGroupFill" all hit src/components/explore/viz-data.ts
      - the test file contains "filter(p => p.link)" deriving the linked expectation from the JSON, and contains no pinned literal for linked (grep for "linked).toBe(9" or "linked, 9" or "linked).toBe(14" returns nothing)
      - viz-data.ts still has zero runtime imports (grep "^import " still returns exactly the one type-only line)
    </acceptance_criteria>
    <done>The bar chart's data contract (with the one shared fill map), the treemap's coloring source, and the tiles' three values are provably JSON-derived (EXPLORE-07), with the OQ-1 stale literal structurally excluded.</done>
  </task>

  <task type="auto">
    <name>Task 3: techMentions — the D-08 whole-word mention engine</name>
    <files>src/components/explore/viz-data.ts, tests/explore-visuals.test.mjs</files>
    <read_first>UI-SPEC §0 (verified 4-cell/5-mention data reality), §3 (matching rule + cell order + E-15/E-17), §10 (techMentions audit rules + boundary-case pins), CONTEXT.md D-08</read_first>
    <action>
      Red/green ordering: append the techMentions expectations to tests/explore-visuals.test.mjs FIRST and run the suite to observe the missing-export failures — the on-record RED. Then extend viz-data.ts as below and rerun to green.

      Extend viz-data.ts. Export interface TreemapCell { name: string; count: number; fill: string }. Export function techMentions(experience: PortfolioData['experience'], skills: PortfolioData['skills']): TreemapCell[] per D-08 and UI-SPEC §10: (1) build the keyword set ONLY from the skills JSON's own technology names by iterating the same group structure skillsGroupCounts produces (soft_skills, then hard_skills categories in insertion order, then languages) — zero hand-written keywords; (2) build the corpus by joining ALL entries' responsibilities arrays — experience.flatMap(entry => entry.responsibilities ?? []).join(' ') — the corpus boundary is experience responsibilities ONLY, never education courses, certifications, projects descriptions, or meta.keywords; (3) for each technology name, count whole-word case-insensitive occurrences: escape regex-special characters (names like 'C++' contain '+'), always apply the leading word boundary, apply the trailing word boundary ONLY when the name ends with a word character (so 'C++' matches via escaped special chars with no bogus trailing boundary, 'Java' must NOT match inside 'Javascript', 'JS' must not match inside 'Javascript', and the phrase 'AI Agents' must not match 'AI agent skills' — singular vs plural differs); multi-word names match as literal phrases; every occurrence event counts (a name appearing twice in one bullet counts twice); (4) aggregate per unique name string — a duplicate technology name across groups (none today) aggregates its counts and takes color from the FIRST group in JSON order that contains it (E-17); (5) attach fill from the owning group's SkillGroupCount.fill (the shared §2 map); (6) filter to count >= 1 (UI-SPEC §0: minimum-mention threshold is 1); (7) emit cells in flattened keyword-set order — JSON group order, ties by first occurrence, NO count-descending sorting (UI-SPEC §3 W-1 pin: squarify renders in array order).

      Tests: techMentions(JSON.experience, JSON.skills) yields EXACTLY the four cells, in this order, with these counts and fills: Java → 'hsl(var(--chart-2))' count 1; CI/CD → 'hsl(var(--chart-4))' count 2; MCP → 'hsl(var(--chart-5))' count 1; RAG → 'hsl(var(--chart-5))' count 1 (UI-SPEC §0 verified reality; chart-1 Soft Skills and chart-3 Testing contribute no cells today — honest, not a bug). Zero-invented proof: every cell name is a member of the JSON's flattened technology names. Boundary fixtures: a corpus where 'Javascript' appears — neither 'Java' nor 'JS' matches it; a corpus containing 'AI agent skills' — 'AI Agents' does not match; a corpus with 'C++' — the escaped name matches cleanly; a bullet repeating the same name twice — count 2 from that bullet; an entry with no responsibilities — contributes nothing; an empty experience array or a zero-match corpus — returns an empty array (E-13 groundwork).
    </action>
    <verify>node --test tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals.test.mjs` exits 0 with all Layer-1 suites passing
      - grep "export function techMentions" hits viz-data.ts
      - the test file asserts the exact cell sequence Java 1, CI/CD 2, MCP 1, RAG 1 and contains a zero-invented membership check against the JSON skills
      - viz-data.ts contains no hand-written technology keyword list (grep for a literal like "CI/CD" or "RAG" inside viz-data.ts returns nothing outside type names)
      - no sorting call in the techMentions path (grep -E "\.sort\(" returns nothing in viz-data.ts)
    </acceptance_criteria>
    <done>The treemap's data contract is locked: sparse-by-design 4-cell output, honest per-occurrence counts, zero invented keywords, shared fill map — ready for the wave-2 client slice.</done>
  </task>

  <task type="auto">
    <name>Task 4: buildCareerSpan — Gantt geometry with injectable now</name>
    <files>src/components/explore/viz-data.ts, tests/explore-visuals.test.mjs</files>
    <read_first>UI-SPEC §4 (axis contract, tick math, E-1…E-6 edges), RESEARCH.md §1.2B (month-index table, JSON-order quirk), CONTEXT.md D-02</read_first>
    <action>
      Red/green ordering: append the buildCareerSpan geometry expectations to tests/explore-visuals.test.mjs FIRST (injected-now fixtures described below) and run the suite to observe the failures for the missing export — the on-record RED. Then extend viz-data.ts as below and rerun to green.

      Extend viz-data.ts. Export interface CareerSpanRow { index: number; title: string; company: string; duration: string; isTechRelated: boolean; leftPct: number | null; widthPct: number | null }. Export interface YearTick { year: number; leftPct: number }. Export interface CareerSpanData { startYear: number; yearTicks: YearTick[]; rows: CareerSpanRow[] }. Export function buildCareerSpan(experience: PortfolioData['experience'], now: Date = new Date()): CareerSpanData per D-02. Month index = year * 12 + (month - 1). axisStart = the minimum parsed start month-index across all entries; axisEnd = now's month-index (injectable for tests; the default new Date() at module evaluation during SSG freezes the export until rebuild — D-02/OQ-7); totalMonths = axisEnd - axisStart; if totalMonths <= 0 every row gets null geometry. Rows render in JSON order — NO sorting of any kind (R-4/E-6: Smartup PCC sits above Sweet Corner exactly as stored). Per row, copy title/company/duration verbatim as stored (the parser never alters display strings — phase-2 data fidelity) and compute geometry via parseDuration: leftPct = (start - axisStart) / totalMonths * 100, widthPct = (min(end, axisEnd) - start) / totalMonths * 100 — 'Present' ends at axisEnd so the bar reaches the right edge (E-3), an end beyond now clamps (E-4), unparseable duration yields leftPct/widthPct null (E-1). yearTicks: first { year: axisStartYear, leftPct: 0 }, then one tick at each January (month-index year * 12) of every subsequent year through the axis-end year, same percentage math; no right-edge tick (UI-SPEC §4).

      Tests with an injected now (e.g. new Date('2026-09-21T00:00:00Z')): rows.length is 7 in JSON company order; the WashPark row (March 2017) has leftPct 0; the Chubb row (Sept 2023 — Present) has leftPct + widthPct ≈ 100 (float tolerance); the Upstream row starts strictly between WashPark and Chubb positions; yearTicks[0] is { year: 2017, leftPct: 0 } and the last tick's year equals the axis-end year; data.startYear is 2017. Edge fixtures: one entry with duration 'unparseable' → that row has null geometry with text fields intact (E-1); an all-unparseable array → every row null (E-2); an entry ending beyond now → its right edge stays ≤ 100 (E-4); a start==end entry still yields a row (min-width handling is the component's job, E-5).
    </action>
    <verify>node --test tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals.test.mjs` exits 0 with all Layer-1 suites passing
      - grep "export function buildCareerSpan" hits viz-data.ts
      - the test file contains "new Date('2026-09-21" (injected-now proof) and asserts a leftPct of 0 for the WashPark row
      - no sorting call in viz-data.ts (grep -E "\.sort\(" returns nothing)
    </acceptance_criteria>
    <done>viz-data.ts is complete: all five D-05/D-08 functions exist, are pure, injectable-where-time-dependent, and unit-tested against the real JSON — ready for the wave-2 component slices.</done>
  </task>
</tasks>