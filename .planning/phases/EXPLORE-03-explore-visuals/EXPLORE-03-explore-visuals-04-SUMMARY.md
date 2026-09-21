---
phase: 03-explore-visuals
plan: 04
subsystem: explore-viz-verification
tags: [cross-plan-gate, layer-2-invariants, layer-3-export-invariants, node-test, static-export, green-gate-finality, d-04, d-05, d-07, d-08, oq-1, oq-4, oq-6]
requires:
  - tests/explore-visuals.test.mjs (plan-01 Layer-1 suite being extended)
  - tests/explore-visuals-skills.test.mjs + tests/explore-visuals-server.test.mjs (wave-2 carriers the final gate runs alongside)
  - src/components/explore/viz-data.ts (skillsGroupCounts/techMentions/projectStats/parseDuration/buildCareerSpan — test-time derivation source)
  - src/data/portfolio-main-data.json (every export expectation derived from it at test time, EXPLORE-07/OQ-1)
  - out/explore.html (built by npm run build — Layer-3 assertion target, OQ-4)
provides:
  - tests/explore-visuals.test.mjs — the phase's main proof surface: 23 Layer-1 unit tests + 9 cross-cutting Layer-2 source invariants + 6 Layer-3 export-level invariants (38 in this file, 93 across all four suites)
  - "Gate evidence: npm run build + npm run typecheck + all four node --test suites green on the final tree"
affects:
  - "gsd_verify phase: consumes this proof surface + the four deliberately-manual checks listed below (rendered row order, area∝mentions, 375px, both-theme legibility)"
  - "future data edits: Layer-3 derives every expected string through viz-data at test time, so the gate survives data changes without literal updates"
tech-stack: [node --test, Next.js static export (output: export), recharts 2.15.4 hydration shells, tsc --noEmit]
key-files:
  created: []
  modified:
    - tests/explore-visuals.test.mjs
decisions:
  - "Green-gate finality sequencing: the six-command gate ran twice — run #1 as on-record evidence, then the SUMMARY written + committed, then run #2 as the chronological-last anchored action so the completion claim covers the final workspace state (Task 3's 'nothing written after' acceptance)"
  - "Stat-literal grep scoping: full banned set {14, 9, 2016, 2026} over every component except skills-treemap, which is exempt from the standalone-9 check ONLY for its documented chrome font constants (COUNT_FONT = 9 — a label size, never a stat); the treemap's data-side ban is carried by the count[=:] numeric-shape invariant (mirrors the wave-2 carriers' precedent)"
  - "Export expectations derive through viz-data at test time (assumption-delta promotion honored): aria pairs from skillsGroupCounts/techMentions, axis-start year from parseDuration (cross-checked against buildCareerSpan), tile values from projectStats (cross-checked against a raw-JSON derivation so the module cannot drift from its data)"
  - "Tile value assertions pinned as adjacent value→label pairs (>value</p><p …>Label</p> regex) — non-vacuous without over-pinning the value-paragraph class list"
  - "Layer-2 invariants are proof-of-delivery assertions expected green immediately per the plan text (any failure = real defect in the owning plan's scope, fix in source, never weaken the assertion) — all nine passed first run on the settled tree"
metrics:
  duration: "~20 min wall-clock (single executor session, estimate)"
  completed: 2026-09-21T15:55:00Z
status: complete
actuals:
  tasks: 3
  commits: 3
  tests: 93
---

# Phase 03 Plan 04: Cross-plan proof surface — Layer-2/Layer-3 invariants + the chronological-last green gate Summary

Proved the phase rather than finishing it: appended the cross-cutting Layer-2 source invariants and the Layer-3 export-level invariants to tests/explore-visuals.test.mjs, then ran the complete six-command gate green over the final tree — with the anchoring run executed after the last write of any kind.

## What was built

- **`tests/explore-visuals.test.mjs`** (765 lines, 38 tests) — the phase's main proof surface, extended in two atomic blocks:
  - **Layer-2 cross-cutting invariants (9 tests, Task 1):** (a) client boundary — `'use client'` + recharts only in skills-chart.tsx/skills-treemap.tsx; the five server files carry neither (D-06); (b) motion — `isAnimationActive={false}` in both chart files, `isAnimationActive={true}` nowhere under src/components/explore (recursive walk), no `matchMedia` in the seven phase-touched files (explore-intro's pre-existing matchMedia untouched — OQ-2); (c) interaction prohibition — no Tooltip/CartesianGrid/onClick/onMouseEnter/onMouseLeave in the four chart components (D-04/§6); (d) sole parsing site — no `new Date(`, `getFullYear`, `getMonth`, `.match(`, `RegExp(`, `parseDuration(` in any of the seven component files; viz-data.ts hosts all six shapers + YEAR_PATTERN (D-05); (e) zero stat literals (EXPLORE-07/OQ-1/U-1, scoped per the decision above); (f) zero-invented treemap keywords — no JSON technology-name quoted literal in the component (D-08); (g) registry spine — skills closure threads `experience={data.experience}`, exactly five total closures (D-07); (h) dependencies — exactly 39 keys with recharts `^2.15.1` (D-07); (i) the two pinned light overrides inside `.light .explore-shell`, neither in the dark block, `--chart-1` override absent from both blocks (B-1/OQ-6).
  - **Layer-3 export invariants (Task 2, after `npm run build`):** out/explore.html guarded by existsSync + the suite's 'run npm run build' hint; ≥2 `recharts-responsive-container` shells (bar + treemap — the SPEC's shells-only acceptance, OQ-4); the server-rendered treemap caption; every bar aria-label `label count` pair derived from skillsGroupCounts at test time; every treemap `name count` pair derived from techMentions; the Gantt fully server-rendered — all 7 company names + the axis-start year tick derived from parseDuration (cross-checked against buildCareerSpan); the tiles as adjacent derived value→label pairs (total/linked cross-checked against raw-JSON counts, span against an independent en-dash min/max derivation — the stale SPEC "(9)" and a pinned 14 asserted nowhere); out/index.html + out/resume.html still emitted (EXPLORE-05/D-07).

## Verification (Task 3 gate)

- **Evidence run (run #1)**, all six commands in pinned order, all exit 0: `npm run build` 0; `npm run typecheck` 0; `node --test tests/explore-shell.test.mjs` 30/0; `node --test tests/explore-visuals.test.mjs` 38/0; `node --test tests/explore-visuals-skills.test.mjs` 10/0; `node --test tests/explore-visuals-server.test.mjs` 15/0. 93 tests, 0 failures.
- **Anchoring run (run #2, chronological-last):** identical six-command sequence executed AFTER the SUMMARY was written and committed — the completion claim anchors on this run; nothing written after it. (Same final tree as run #1 except this planning document.)
- Per-task commits: ec86437 (Task 1 Layer-2), e075db2 (Task 2 Layer-3), plus the docs(planning) SUMMARY commit. Task 3 is verification-only — no code change, no commit needed (gate green on the first try; had anything failed the plan's fix-and-full-rerun rule would apply).
- out/explore.html emitted by the gate's build step — /explore still exports statically; / and /resume intact.

## TDD Gate Compliance

Plan type is `execute` (not `tdd`); no `test:`/`feat:` split required. Layer-2/3 assertions are proof-of-delivery invariants the plan expects to pass immediately (they pin already-shipped behavior; a red would mean a real defect, not a missing implementation). Each task's suite run was green on record before its atomic commit; the first scope-matching commits are `test(EXPLORE-03-explore-visuals-04): …` — the honest conventional type for test-only diffs. No missing gates.

## Known Stubs

None — stub scan (TODO/FIXME/placeholder/XXX/HACK/.skip, case-insensitive) over tests/explore-visuals.test.mjs returns nothing.

## Threat Flags

None — the only changed artifact is a test file: no `dangerouslySetInnerHTML`, no child_process/eval/exec, no network calls. The one RegExp constructed from data (tile values) escapes via a local escapeRe helper; every other regex is a static literal.

## Self-Check: PASSED

- tests/explore-visuals.test.mjs exists at 765 lines (must_haves min_lines 320 met), imports skillsGroupCounts + techMentions (derivation requirement), and contains no pinned linked literal (acceptance greps "linked, 9" / "linked).toBe(14" return nothing).
- Commits verified in git log: ec86437, e075db2 (scope `EXPLORE-03-explore-visuals-04`, one per task, only tests/explore-visuals.test.mjs staged each time).
- Gate run #1 on record: six commands, six exit-0 codes (93 tests). Gate run #2 (anchor) follows this SUMMARY — see the completion report.

## Notes for verify (manual pass — automation cannot prove these on static HTML)

- §12.2 rendered bar row order: top→bottom in JSON group order (probe-proven default; the export test pins the aria-label pairs, not the visual band order).
- §12.3 treemap area ∝ mentions (squarify on the four cells: Java 1, CI/CD 2, MCP 1, RAG 1).
- §12.8 375px no horizontal scroll by eye (charts scale with their panel).
- §12.9 both-theme legibility beyond the recomputed contrast math (light overrides 4.49:1 / 4.75:1 verified in RESEARCH §1.4).