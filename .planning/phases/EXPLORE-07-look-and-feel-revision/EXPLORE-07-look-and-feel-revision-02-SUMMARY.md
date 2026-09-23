---
phase: EXPLORE-07-look-and-feel-revision
plan: 02
subsystem: explore-chrome + skills-cards
tags: [explore, REV-09, REV-10, D-02, index-device, competency-cards, micro-motion-hook, panel-grid]
requires:
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-01-SUMMARY.md (chart-free tree + audit table A-01..A-20 this plan's fixes belong to)"
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-UI-SPEC.md (§1.1/§1.2 gutter, §4 card restyle, §5 index device, §10.6 export assertion)"
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-CONTEXT.md (D-01..D-05)"
  - "src/components/explore/panel-shell.tsx sole caller verification (explore-panels.tsx:69 — required index prop is safe)"
provides:
  - "The D-02 hierarchy device end-to-end: four aria-hidden oversized mono index spans (01-04) on the PanelShell headers, zero-padded from the EXPLORE_SECTIONS map index"
  - "The panel-grid stagger hook class on the panels container + the lg-only gap-5 gutter — the DOM hooks plan 03's motion CSS targets"
  - "The REV-09 competency card presentation: exp-lift hook (inert until plan 03 defines it), parity-alternating chip position, mt-2 proof rhythm"
  - "Extended test contracts: explore-shell (index device source pins), explore-visuals (index export test), explore-visuals-skills (REV-09 anatomy pins)"
affects:
  - "EXPLORE-07-look-and-feel-revision-03 (motion vocabulary — defines .exp-lift/.panel-grid CSS under the .explore-shell scope; must not re-order or re-scope these hooks)"
tech-stack: [next, react, tailwindcss, node-test]
key_files:
  created: []
  modified:
    - "src/components/explore/panel-shell.tsx"
    - "src/components/explore/explore-panels.tsx"
    - "src/components/explore/sections/skills-section.tsx"
    - "tests/explore-shell.test.mjs"
    - "tests/explore-visuals.test.mjs"
    - "tests/explore-visuals-skills.test.mjs"
decisions:
  - "Required `index: string` prop on PanelShell — the single caller (explore-panels.tsx:69, verified by grep) always feeds it; never optional, so a future second caller must supply the device"
  - "Index fed data-driven via String(index + 1).padStart(2, '0') — zero literals in JSX (R3); drawer items, tour card headings, status bar untouched (UI-SPEC §5 scope)"
  - "Container class `grid panel-grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5` — gutter widening lg-only per D-02; panel-grid is the plan-03 stagger hook; no max-w- (R12)"
  - "exp-lift deliberately inert in this plan: the class lands on the competency <li> now, its CSS definition belongs to plan 03 under the .explore-shell scope (auto-suppressed by the existing reduced-motion guard)"
  - "Chip-parity ternary written with double quotes exactly as the acceptance grep pins it (`self-start\" : \"self-end`); lint ignored during builds (next.config.ts:8-9) so the quote style cannot break the build"
metrics:
  duration: "~25 min (2 tasks, 2 commits)"
  completed: "2026-09-24T01:02:14+03:00"
  baseline_tests: 176
  final_tests: 177
  suite_delta: "+1 (the panel-index export test in explore-visuals; per-task pins extend existing tests, no new test functions in the shell/skills suites)"
status: complete
actuals:
  tasks: 2
  commits: 2
---

# Phase EXPLORE-07 Plan 02: Index Device + lg Gutter + Competency Card Redesign Summary

**One-liner:** The D-02 dial-B static effects shipped — quiet oversized mono index 01-04 on the four panel headers (data-driven, aria-hidden, R2-clean), lg-only gutter widening with the `panel-grid` stagger hook planted for plan 03, and the REV-09 competency cards redesigned (alternating chip position by index parity, `exp-lift` hook, mt-2 proof rhythm) — full gate green (build + typecheck + 177/177).

## What shipped (per task)

- **Task 1 — `e16af86` (D-02, UI-SPEC §5/§1.2):** `PanelShell` gains a REQUIRED `index: string` prop and appends the aria-hidden span `ml-auto select-none font-mono text-2xl font-medium leading-none tabular-nums text-muted-foreground/50` after the h2 in the header row — chrome otherwise byte-identical, still hover-inert (no hover/cursor/tabIndex; the anatomy test's bans hold with the device present). `ExplorePanels` feeds `index={String(index + 1).padStart(2, '0')}` from the map index (data-derived, no literals in JSX); container now `grid panel-grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5` — gutter widening lg-only, `panel-grid` is the plan-03 stagger hook.
- **Task 2 — `bffe021` (REV-09/D-02, UI-SPEC §4):** competency cards redesigned: `exp-lift` hook on the `<li>` (inert until plan 03 defines it), chip wrapper alternates `self-start`/`self-end` by index parity (column-wise zigzag in the lg 4×2 grid, alternating left/right down the stack at base), proof rhythm `mt-1.5` → `mt-2` (left-aligned both ways). Chips groups, both Badge overrides, TerminalPointer `skills`, grid `gap-2` and graceful-hide byte-identical; cursor stays default (cards non-interactive, no new focusables).

## Verification evidence

| Run | Result |
|---|---|
| Task-1 RED (test-first) | 48 pass / 2 fail — exactly the two new pins (`index: string` prop absent; 0 index spans in export), against the unedited tree (fresh build) |
| Task-1 GREEN | build ✓ + `node --test` shell/visuals/sweep → **64/64** |
| Task-2 RED (test-first) | 9 pass / 1 fail — the anatomy test fails on the first REV-09 pin (no `exp-lift`) |
| Task-2 GREEN | `npm run typecheck` ✓ + skills/visuals suites → **30/30** |
| Full gate (run A, pre-SUMMARY) | `rm -rf out && npm run build` ✓ → `npm run typecheck` ✓ → `node --test tests/*.mjs` **177/177** (baseline 176 + 1 new export test) |
| Acceptance greps (task 1) | index prop 1 · class recipe 1 · panel-grid 2 · lg:gap-5 1 · max-w- 0 · index feed ≥1 · four aria-hidden spans 01-04 in export (test-asserted exactly 4) |
| Acceptance greps (task 2) | exp-lift ≥1 · parity conditional 1 · mt-2 proof 1 · Badge override 1 · cursor-pointer 0 · grid pin 1 |
| min_lines | panel-shell.tsx 66 (≥55) · explore-panels.tsx 91 (≥85) · skills-section exports SkillsSection ✓ |

## TDD Gate Compliance

Plan type is `execute` (not `tdd`), so no `test:`/`feat:` split is required and the tdd_audit ship gate does not apply. The plan's own in-task red/green discipline was enforced: each task's test pins were written and run FIRST against the unedited tree (RED recorded above with the exact failing assertions), then the implementation landed, then the same commands ran GREEN — each commit carries tests + code together, so every commit is green on the tree it creates. An additional failing run (48/2) was recorded mid-task-1, between the two implementation edits, so a failing run stayed on record at every implementation point.

## Known Stubs

None. Stub scan (`TODO|FIXME|placeholder|\.skip`) over the changed surface returns only pre-existing prose: the test name describing the removed placeholder-humor machinery and its section comment. No skipped tests, no debug artefacts.

## Threat Flags

None. No new external surface: the index span is aria-hidden decorative chrome; no JS animation APIs, no raw-HTML sinks, no new dependencies (38 keys unchanged, pinned by test); outbound links untouched; the reduced-motion guard block is byte-untouched (no CSS was edited in this plan — the `.panel-grid`/`.exp-lift` hooks are inert class names until plan 03 defines them under the `.explore-shell` scope, where the existing guard auto-suppresses them).

## Deviations & notes

- **DEV-1 (recorded, INFO for verify):** Tailwind's `fontFamily` has NO override in `tailwind.config.ts` (verified by grep), so the index span's pinned `font-mono` class resolves to the Tailwind default mono stack rather than inheriting the shell's JetBrains Mono. The class recipe is the UI-SPEC §5 binding contract (implemented verbatim); both are monospace and the numeral is an aria-hidden 50%-muted ghost, but the verify step's visual pass should confirm the numeral reads as the intended quiet ghost in both themes.
- **DEV-2 (recorded):** audit rows 3/4/5 (Skills REV-09, panel-grid gutters, panel headers index) are now FIXED with test linkage in this plan's commits, but `EXPLORE-07-AUDIT.md` is not in this plan's `files_modified` list — the table's disposition update is left to the verify step / plan-03 wave (REV-10 forbids unrelated edits here).
- **DEV-3 (recorded):** the index feed string `String(index + 1).padStart(2, '0')` appears twice in `explore-panels.tsx` (header comment + code); the acceptance grep ≥1 is satisfied and the JSX itself carries no index literals (R3 honored).
- Suite count 176 → 177 (+1: the panel-index export test); recorded per UI-SPEC §2.2 "Suite count".

## Self-Check: PASSED

- Modified files all exist and carry the target contract: `panel-shell.tsx` (66 lines ≥ 55), `explore-panels.tsx` (91 ≥ 85), `skills-section.tsx` (REV-09 anatomy), three extended test suites ✓.
- Commits on `phase-7`: `e16af86` (task 1, exactly its four files) → `bffe021` (task 2, exactly its two files), atomic, no blanket adds, no amends ✓.
- RED evidence recorded before each implementation edit; full suite 177/177 on the final tree (gate rerun after the SUMMARY write anchors green on the exact final tree) ✓.

---

*Executed 2026-09-24 · plan EXPLORE-07-look-and-feel-revision-02 · wave 2 of the phase-7 loop*