---
phase: EXPLORE-06-explore-revision
plan: "02"
subsystem: explore-chrome
tags: [explore, grid, merge, tour, rev-04, rev-07-deferral]
requires:
  - "src/components/explore/constants.ts — EXPLORE_SECTIONS is the 4-section spine every consumer derives from"
  - "src/components/explore/sections/contact-section.tsx (pre-merge) — the absorbed anatomy source"
provides:
  - "Merged About+Contact panel (src/components/explore/sections/about-section.tsx) in UI-SPEC §3.2 pinned order"
  - "2×2 explore grid (grid-cols-1 / md:grid-cols-2, no col-spans) in explore-panels.tsx"
  - "6-step derived tour with length-derived counters (constants.ts + explore-tour.tsx)"
  - "4-section stale-test surface (sweep / visuals / tour / shell / skills suites renewed)"
affects:
  - "src/components/explore/explore-drawer.tsx — DIGIT_ACCENTS trimmed to 4 (E-14)"
  - "src/components/explore/explore-status-bar.tsx — N/4 counter (auto, verified only)"
  - "src/components/explore/use-explore-visited.ts — stale 'contact' ids filter (verified only)"
  - "out/explore.html — rebuilt; SSRs '0/4 sections visited', no id=contact"
tech-stack: [next-15, react-18, tailwind-3, node-test-runner]
key-files:
  created:
    - "(none — merge absorbed contact-section.tsx into about-section.tsx; no new files)"
  modified:
    - "src/components/explore/constants.ts"
    - "src/components/explore/explore-panels.tsx"
    - "src/components/explore/sections/about-section.tsx"
    - "src/components/explore/explore-tour.tsx"
    - "src/components/explore/explore-drawer.tsx"
    - "tests/explore-sweep.test.mjs"
    - "tests/explore-visuals.test.mjs"
    - "tests/explore-tour.test.mjs"
    - "tests/explore-shell.test.mjs"
    - "tests/explore-visuals-skills.test.mjs"
  deleted:
    - "src/components/explore/sections/contact-section.tsx"
decisions:
  - "Merged panel composes in UI-SPEC §3.2 pinned order: description → meta row → divider → 9 channel rows → Full-resume link LAST (moved from the old contact first-row position), mt-3 above the link; About's chart-1 accent and grid identity kept (D-05)."
  - "Grid rebalanced to grid-cols-1 / md:grid-cols-2 (lg tier drops from 3 to 2); every col-span class removed — zero empty cells at 375px (1 col) and 768/1440/1920 (2×2) (D-04)."
  - "Tour derived, not edited: EXPLORE_TOUR_STEPS auto-derives 6 steps from the 4-section map; both counters (sr-only + visible) derive from EXPLORE_TOUR_STEPS.length — the 'of 7' literal is gone (OQ-9/E-14)."
  - "PRIMARY_LABELS shrinks to the pinned 6: ['Start','Next','Next','Next','Finish','Done'] — projects is the last content step (§14.3)."
  - "Skills/projects tour-step copy (treemap sentence, 'six projects') left byte-untouched — plan 04 owns that copy atomically with the chart removal (task-2 acceptance)."
  - "About tour-step body rewritten to the merged-panel reality: bio + role + location + every contact channel + the resume export (checker W-3a)."
  - "Deviation (documented scope extension): tests/explore-shell.test.mjs + tests/explore-visuals-skills.test.mjs contact/grid rows renewed to their 4-section successors — they pin assertions invalidated by THIS merge (stale-test discipline, CONTEXT D-06), while plan 04 owns both files for its own later rewrite."
  - "Deviation (documented scope extension): explore-drawer.tsx DIGIT_ACCENTS trimmed to 4 — the plan's 'drop if TS forces it' conditional assumed a Record, but the array is positional (TS never forces); UI-SPEC §3.1/E-14 pins DIGIT_ACCENTS → 4 and the 5th entry was dead on arrival of the 4-section switch."
metrics:
  duration: ~65 min (executor session, 2026-09-23T06:38Z→06:47Z commit window; timestamps +03:00 local)
  completed: 2026-09-23
status: complete
actuals:
  tokens: ~95000
  tasks: 3
  commits: 5
---

# Phase EXPLORE-06 Plan 02: About+Contact merge & 2×2 grid rebalance Summary

Merged the standalone Contact panel into About (full 9-channel anatomy + Full-resume link LAST, UI-SPEC §3.2 pinned order), rebalanced the /explore grid to the locked 2×2 with zero empty cells at every width, and derived every section-count consumer (panels, drawer, tour, status bar, visited filter) from the 5→4 EXPLORE_SECTIONS switch — with the experience showcase byte-untouched (REV-07/D-09).

## What was done (per task)

**Task 1 — 4-section spine, merged panel, 2×2 grid (commit 3d14442)**
- RED on record (2026-09-23T06:42:16Z, /tmp/red-task1.log): 4 `not ok` rows against the pre-merge tree — sweep grid (1→2→2 contract), visuals registry spine (4 closures/no contact), shell constants (4 ids), skills registry-neighbours (no contact closure).
- GREEN: `constants.ts` — contact removed from `EXPLORE_SECTIONS` + `EXPLORE_TOUR_ACCENTS` + the `TourStep['id']` union; ABOUT step body rewritten to the merged-panel reality (W-3a). `about-section.tsx` — absorbed the ContactSection anatomy verbatim (CHANNELS table, ROW_CLASS, row template, mailto-vs-noopener split) composed description → meta row → `my-3 border-t` divider → 9 channel rows → Full-resume link LAST with `mt-3`. `contact-section.tsx` deleted. `explore-panels.tsx` — 4 closures, `grid grid-cols-1 gap-4 md:grid-cols-2`, zero col-span, contact accent key gone (TS Record narrowing). `explore-tour.tsx` — PRIMARY_LABELS → 6 (§14.3).
- Verify: typecheck ✓, sweep ✓, visuals scoped `^(?!.*techMentions)` ✓, skills ✓, shell ✓ (after renewing two further stale rows — see deviations), absence greps ✓ (`ContactSection` count 0 in panels — one doc-comment literal tripped the verify and was reworded).

**Task 2 — tour/counter/drawer mechanics + welcome copy (commit cc30b09)**
- RED on record (2026-09-23T06:44:47Z, /tmp/red-task2.log): 4 rows — hardcoded `of 7` (tour), welcome `five sections` (constants), both export rows asserting the stale `0/5` SSR counter.
- GREEN: `EXPLORE_TOUR_STEP_BODIES` trimmed to 4 entries (skills treemap sentence + projects sentence byte-untouched — plan-04-owned); welcome body → "A 60-second lap of the four sections — …"; `explore-tour.tsx:409` sr-only counter now derives from `EXPLORE_TOUR_STEPS.length` like line 464 already did. Tour suite rewritten: 6 steps, no-contact id list, 4-id accents map, slice(1,5), finish `[5]`, VALID_IDS 4 ids, stale-`contact` parseVisitedIds filter assertion, `no 'of 7'` + ≥2 length-derivation greps, `four sections` + no `five sections`, merged about-body pins, N/4 status-bar naming.
- `npm run build` re-ran (the wave's build point) — `out/explore.html` now SSRs `0/4 sections visited`, exactly one `id="about"` and zero `id="contact"`; `Full resume` appears once rendered (+ once in the RSC flight payload, same single link).
- Verify-only sites confirmed with no edits: status-bar counter auto-derives `EXPLORE_SECTIONS.length` (N/4); drawer anchors map EXPLORE_SECTIONS (4 items); visited parse filters stale stored ids.

**Task 3 — stale-test sweep + REV-07 byte-untouched invariant (commit 77d0dea)**
- Sweep suite: new structural row pinning 4 ids in EXPLORE_SECTIONS + `md:grid-cols-2` + zero col-span matches (zero empty cells), and a 375px row pinning the `grid-cols-1` base class.
- Visuals suite: new REV-07 invariant test — `experience-section.tsx` + `career-span-chart.tsx` exist, still feed the Gantt from `buildCareerSpan`, both remain server components; the buildCareerSpan geometry block (lines ~360-460) runs unchanged.
- Verify: `git diff --name-only HEAD -- experience-section.tsx career-span-chart.tsx` → empty (byte-untouched, D-09); sweep+tour ✓ (57/57), visuals scoped ✓ (39/39).

**Addenda (E-14 completion, commits e6daefe + 67157e7)**
- `explore-drawer.tsx` DIGIT_ACCENTS trimmed to 4 (dead `text-chart-5` removed per UI-SPEC §3.1/E-14) — see deviation below.
- The shell suite's drawer test pinned `digit accent chart-5` via a loop (my earlier literal greps missed it); renewed to the 4-anchor contract with a `!text-chart-5` guard. Process slip on record: commit e6daefe landed before its verify ran (shell went red); fixed forward within 2 minutes by 67157e7 — verify-then-commit order restored.

## Red/Green timeline

| Run | Time (UTC) | Result | Evidence |
|---|---|---|---|
| Baseline (pre-edit): typecheck + 5 suites | 06:41 | all green (sweep 12, visuals 38, tour 39, shell 30, skills 10) | session log |
| Task 1 RED | 06:42:16 | 4 failing rows (sweep grid, skills registry, shell constants, visuals spine) | /tmp/red-task1.log |
| Task 1 GREEN | 06:44 | typecheck + sweep + visuals-scoped + skills + shell all green; absence greps pass | /tmp/t1-*.log |
| Task 2 RED | 06:44:47 | 4 failing rows (`of 7`, welcome copy, 2 stale export pins) | /tmp/red-task2.log |
| Task 2 GREEN + rebuild | 06:45 | typecheck + tour + shell + sweep green; export refreshed to 0/4 | /tmp/t2-*.log |
| Task 3 verify | 09:46 | sweep+tour 57/57, visuals-scoped 39/39, byte-untouched diff empty | /tmp/t3-*.log |
| **FINAL GATE** | 09:47+ | **typecheck ✓ + FULL 8-suite `node --test tests/*.test.mjs` 167/167 ✓** | /tmp/final-gate3.log |

## TDD Gate Compliance

Plan type is `execute` (not `tdd`) — no test:-commit-before-feat: gate applies. Red-first discipline was still honoured inside each task: every contract change ran RED on record before its GREEN source edits; RED+GREEN land in the same atomic per-task commit per the plan's one-commit-per-task rule.

## Known Stubs

None. `grep TODO|FIXME|placeholder|.skip|.todo` over all touched files: clean (the two "placeholder" hits are pre-existing test names asserting the OLD humor machinery's removal).

## Threat Flags

None. No auth, secrets, input handling, or network surface touched. The absorbed channel rows keep the exact `target="_blank" rel="noopener noreferrer"` pair on the 8 external rows and `mailto:` same-tab on email; the Full-resume link stays an internal `next/link` `/resume` route.

## Deviations (both documented, both minimal)

1. **Two test suites outside the plan's `<files>` lists were renewed**: `tests/explore-shell.test.mjs` (5-id constants loop → 4 + no-contact guard; grid test → 2×2/zero-col-span contract; drawer test → 4 anchors; N/4 + 0/4 counter naming) and `tests/explore-visuals-skills.test.mjs` (contact-closure pin → no-contact guard). Rationale: these rows pin assertions invalidated by THIS plan's 5→4 merge (plan 04 owns both files only for its own later chart/treemap rewrite) — leaving them red would violate the phase's stale-test discipline (CONTEXT D-06) and the phase acceptance's full-suite gate.
2. **`explore-drawer.tsx` edited** (1 line + comment): the plan scoped the drawer as verify-only with "drop the contact key if TS forces it", but DIGIT_ACCENTS is a positional array, so TS never forces; the UI-SPEC §3.1/E-14 inventory pins 4 entries and the 5th was dead code on arrival. Trimmed with typecheck + suites green.

## Self-Check: PASSED

- Files: about-section.tsx (141 lines, merged anatomy) ✓ exists; explore-panels.tsx (80 lines, 4 closures, 2×2) ✓; contact-section.tsx absent ✓; explore-tour.tsx counters derived ✓; explore-drawer.tsx 4 accents ✓; all 5 test files renewed ✓.
- Commits: 5 on `phase-6` — 3d14442, cc30b09, 77d0dea, e6daefe, 67157e7 — all with scope EXPLORE-06-explore-revision-02 ✓.
- must_haves truths: all 5 verified (4 panels 2×2 / merged anatomy pinned order + link LAST / 6-step derived tour, no 'of 7', N/4 auto, 4 drawer anchors / experience byte-untouched / 'four sections' + stale-id filter) ✓.
- Final gate: `npm run typecheck` ✓ and full `node --test tests/*.test.mjs` 167/167 ✓ on the committed tree; the SUMMARY write below is docs-only (outside the suite's read set) — the gate was re-run after it (see completion note).