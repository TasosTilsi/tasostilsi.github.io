---
phase: 03-explore-visuals
plan: 02
subsystem: explore-viz-skills-charts
tags: [recharts, bar-chart, treemap, skills-panel, d-01, d-04, d-06, d-08, client-components, light-theme-overrides, data-derived]
requires:
  - src/components/explore/viz-data.ts (plan-01 exports: skillsGroupCounts, techMentions, skillGroupFill via SkillGroupCount.fill, TreemapCell)
  - .planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md (§1 augment order, §2 bar anatomy + B-1, §3 treemap contract, §6 interaction, §7 motion, §9 aria, §10 corpus boundary)
  - .planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-CONTEXT.md (D-01/D-04/D-05/D-06/D-07/D-08 locked)
provides:
  - src/components/explore/sections/skills-chart.tsx — 'use client' recharts horizontal BarChart (6 rows, data-derived fills + aria-label, static printed counts)
  - src/components/explore/sections/skills-treemap.tsx — 'use client' recharts Treemap (flat cells, depth-0 root guard, label ladder + clipPath, honesty caption)
  - src/components/explore/sections/skills-section.tsx — augmented section: chart first, treemap second, grouping single-sourced to skillsGroupCounts, chips byte-stable
  - src/components/explore/explore-panels.tsx — skills adapter closure threads experience={data.experience} for the treemap corpus (one line)
  - src/app/globals.css — scoped .light .explore-shell --chart-2/--chart-3 fill-contrast overrides (B-1)
  - tests/explore-visuals-skills.test.mjs — plan-02 source-invariant carrier (10 tests, node --test)
affects:
  - "plan 04 (cross-plan export gate): asserts the pinned aria-label pair formats ('label count' / 'name count') and hydration shells in out/explore.html"
  - "verify phase: R-7 rendered-order and both-theme legibility checks consume the probe record below"
tech-stack: [recharts 2.15.4, 'use client' boundary, ResponsiveContainer, Tailwind tokens, node --test]
key-files:
  created:
    - src/components/explore/sections/skills-chart.tsx
    - src/components/explore/sections/skills-treemap.tsx
    - tests/explore-visuals-skills.test.mjs
  modified:
    - src/components/explore/sections/skills-section.tsx
    - src/components/explore/explore-panels.tsx
    - src/app/globals.css
decisions:
  - "R-7 deviation, probe-verified then committed: the plan pinned a YAxis order-flipping prop assuming first-datum-at-bottom, but an SSR probe against installed recharts 2.15.4 proved the vertical-layout band default already renders row 1 at TOP (labels y≈19→176; the prop inverts it to the bottom) — the prop is ABSENT and the contract (top→bottom JSON group order) is met by the default"
  - "Treemap custom content uses the recharts-documented element form content={<TreemapCellContent />} (the d.ts types content as React.ReactElement; a fn prop would need a double cast) — the element IS the plan's typed pure render fn, and cloneElement passes the probe-verified node props (name/count/fill/x/y/width/height/depth/index) as props"
  - "The honesty caption renders OUTSIDE the role=img wrapper so it stays real, readable text for AT (§9), while the aria-label enumerating every cell's name+count sits on the treemap wrapper"
  - "Belt-and-braces guards kept at both levels: SkillsChart returns null on empty rows; SkillsTreemap returns null on zero cells (E-13, caption hides with the block); the section's groups.length === 0 graceful-hide governs the whole body (§1)"
  - "Mid-task lesson (Task 3): an inline CSS comment inside .light .explore-shell carried the literal --chart-1 token name and tripped the phase-1 substring bans (both suites red); comments inside the shell blocks must avoid --chart-N literals — reworded, suites green again"
  - "Test greps follow the explore-shell suite convention of comment-stripping (codeOf helper) so banned-literal checks judge code, not prose"
metrics:
  duration: "~25 min wall-clock (single executor session, estimate)"
  completed: 2026-09-21T14:46:39Z
status: complete
actuals:
  tasks: 3
  commits: 3
  tests: 10
---

# Phase 03 Plan 02: Skills Bar Chart + Mention Treemap Summary

Delivered the D-01 + D-08 skills visualization slice end-to-end: the 'use client' recharts horizontal bar chart and the 'use client' recharts mention treemap, both fed zero-shaping data from plan-01's viz-data module and mounted as the first two children of the Skills panel above the byte-identical chips — plus the user-confirmed scoped light-theme chart-2/chart-3 contrast overrides (UI-SPEC §2 B-1).

## What was built

- **`src/components/explore/sections/skills-chart.tsx`** (77 lines) — D-01 bar chart per UI-SPEC §2 anatomy: `ResponsiveContainer width="100%" height={192}` (fixed height reserves the SSG box — no CLS), `BarChart layout="vertical"` with the pinned margins, hidden numeric XAxis, `YAxis type="category" dataKey="label" width={88}` with 10px muted-foreground ticks, `Bar dataKey="count" barSize={12} radius={[0,2,2,0]} isAnimationActive={false}` with one `Cell` per row filled from the shared viz-data map, and a permanent `LabelList position="right"` printing the counts (D-04 mechanism — no tooltip). The AT summary is the render-time aria-label in the pinned `label count` pair format. Zero data shaping; zero hardcoded labels or counts.
- **`src/components/explore/sections/skills-treemap.tsx`** (168 lines) — D-08 treemap per UI-SPEC §3: `ResponsiveContainer height={120}`, `Treemap data={cells} dataKey="count" isAnimationActive={false}` on flat data, custom content `<TreemapCellContent />` with the **B-1 depth-0 root guard** (probe-verified: recharts' first content call is the synthetic root carrying no name/count/fill), `fillOpacity 0.35` + full-strength 1px stroke per cell, the §3 label ladder (≥64×40 name+count → ≥44×16 name-only → bare area) with the 6.6px/char overflow estimate and a per-cell `clipPath` for the clipped-name rung, `pointerEvents="none"` on every cell group, SVG primitives only, zero interaction handlers, and the honesty caption "Mentions in role responsibilities" rendered outside the `role="img"` wrapper.
- **`src/components/explore/sections/skills-section.tsx`** (72 lines) — the inline grouping builder is replaced by `skillsGroupCounts(skills)` (§10 single source: chart and chips can never drift); the section signature extends with `experience: PortfolioData['experience']`; cells come from `techMentions(experience, skills)` server-side; `<SkillsChart>` composes first, `<SkillsTreemap cells={cells} />` second, the groups loop and TerminalPointer stay byte-identical; graceful-hide unchanged.
- **`src/components/explore/explore-panels.tsx`** — one line changed: the skills adapter closure threads `experience={data.experience}` (the treemap corpus reaches the section server-side; the registry is the data spine, not chrome). Every other closure is byte-unchanged (test-pinned).
- **`src/app/globals.css`** — inside `.light .explore-shell`: `--chart-2: 160 65% 32%;` (4.49:1) and `--chart-3: 30 75% 38%;` (4.75:1) per §2 B-1, user-confirmed, hue-preserving; dark shell values untouched; no chart-token-1 override added to either block; the stale "Chart-1..5 remain inherited" block comment corrected.
- **`tests/explore-visuals-skills.test.mjs`** (164 lines, 10 tests) — plan-02's source-invariant carrier: single-source grouping + augment order, client boundaries, chart anatomy pins, banned-literal greps (Tooltip/CartesianGrid/matchMedia/onClick/onMouseEnter) over comment-stripped code, data-derived aria-label formats, R-7 mechanism pin, treemap root-guard/ladder/clip pins, corpus thread, registry byte-stability, and the two B-1 css invariants.

## Verification

- Per-task red/green on record: Task 1 RED 0/4 → green 4/4; Task 2 RED 4 fail → green 8/8; Task 3 RED 1 fail → green 10/10 (`node --test tests/explore-visuals-skills.test.mjs`).
- `npm run typecheck` clean after every task.
- Phase-1 regression: `node --test tests/explore-shell.test.mjs` → 30 pass, 0 fail (OQ-6 holds).
- Probe evidence (scratch SSR renders against installed recharts 2.15.4, /tmp — not committed): vertical-layout default band order is top→bottom JSON order; the Treemap content contract (root call shape, leaf props, squarify geometry — all four cells ≥64×40 at current data) and the LabelList printed-values mechanism were verified live before implementation.

## Deviations from the plan text (all probe- or evidence-backed)

1. **R-7 order mechanism (Task 1):** the plan assumed the YAxis needed the order-flipping prop; the probe proved the opposite (the prop would put Soft Skills at the BOTTOM). Implemented without it — the plan's own clause "verify against rendered output, never silently accept either order" authorized this; the order contract itself is intact and pinned by the source test.
2. **Treemap content form (Task 2):** the plan sketched `content={renderTreemapCell}`; the installed d.ts types `content?: React.ReactElement`, so the typed pure render function ships as a function component passed in the documented element form (no double casts). Behavior identical; the depth-0 guard, ladder, and clipPath are exactly as pinned.
3. **Acceptance-criteria grep count (Task 2):** the plan's bullet "grep -c experience={data.experience} returns exactly 1" is stale against reality — the experience adapter already threads the same slice, so the file-wide count is **2** (lines 60 and 62). The pinned intent (skills closure threads the corpus; other closures byte-unchanged) is what the test asserts, scoped to the skills closure line.

## TDD Gate Compliance

Plan type is `execute` (not `tdd`); red/green discipline followed per task: each task's invariants were written first and observed failing on record (module absent / section unchanged / css block unchanged) before the implementing edit, and the suite was re-run green before each atomic commit. First scope-matching commit is `feat(…)` because each task's test additions + implementation land as one atomic unit (plan-01 precedent); no `test:`/`feat:` split required for this plan type.

## Known Stubs

None — stub scan (TODO/FIXME/placeholder/XXX/HACK/.skip) over all six changed files returns nothing.

## Threat Flags

None — both chart components render SVG primitives only, carry no `dangerouslySetInnerHTML`, no event handlers, no network/DOM globals; the CSS change is two token-value lines inside an existing scoped block; the adapter change threads typed data slices.

## Self-Check: PASSED

- Files exist with all pinned exports: skills-chart.tsx (77 ≥ 50 lines, exports SkillsChart), skills-treemap.tsx (168 ≥ 70, exports SkillsTreemap), skills-section.tsx (72 ≥ 60), globals.css (593 ≥ 580, both overrides exactly once), tests/explore-visuals-skills.test.mjs (164 ≥ 140, 10 tests).
- key_links verified by source greps: `<SkillsChart`/`<SkillsTreemap` composition order; `skillsGroupCounts|techMentions` in the section; `experience={data.experience}` in the skills closure; both B-1 override strings inside `.light .explore-shell`.
- Commits verified: 8098930 (Task 1), f792342 (Task 2), f76e015 (Task 3) — one atomic conventional commit per task, scope `EXPLORE-03-explore-visuals-02`.
- Final gate over the settled tree (both suites + typecheck) — see the on-record run in the session log; the authoritative cross-plan build/export gate remains plan 04 Task 3 per the wave-2 note.

## Notes for plan-04 (export gate)

- The static export contains only the recharts ResponsiveContainer hydration shells for the skills charts (no SVG until measured) — assert `recharts-responsive-container` presence in out/explore.html, NOT rendered bars/cells.
- The aria-label pair formats are pinned exactly: bar chart `Skills by category. ${label} ${count}, ….` and treemap `Technology mentions across role responsibilities. ${name} ${count}, ….` — assert data-derived substrings ("Soft Skills 6", "CI/CD 2", …) computed from the JSON at test time.
- The treemap caption is real DOM text in the export (server-rendered); the Gantt/tiles siblings (plan 03) are likewise fully server-rendered.
- Rebuild regenerates the treemap only if data changed — cells derive from techMentions over the same JSON.