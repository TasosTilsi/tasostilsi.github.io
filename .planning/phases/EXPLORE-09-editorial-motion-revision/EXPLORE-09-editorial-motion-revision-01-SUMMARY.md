---
phase: 09-editorial-motion-revision
plan: 01
subsystem: explore-experience-arc
tags: [REV-16, education-on-arc, typed-derivation, tdd, framer-free, engine-untouched]
requires:
  - src/components/explore/timeline-geometry.ts (phase-8 pure derivation module — extended in place)
  - src/components/explore/use-timeline-progress.ts (BYTE-UNTOUCHED count-agnostic engine)
  - src/data/portfolio-main-data.json (featured education flags + tech-role flags — read-only)
provides:
  - selectTimelineEntries(experience, education) — the ONE typed merged derivation (TimelineEntry { type: 'role' | 'education', year, entry }), year-ascending, nulls-last, stable
  - the 5-entry type-aware arc stage (BEng 2012 · Netcompany-Intrasoft 2019 · MSc 2021 · Upstream Systems 2022 · Chubb 2023)
  - the education-passing explore-panels adapter (ExperienceSection experience + education) and the merged-count W-3 sticky gate
affects:
  - plan 02 (parallel wave 1 — About package; no shared files)
  - plan 03 (wave 2 — owns the explore-panels placement map + tour/drawer re-mapping; sweep placement assertions left untouched for it)
  - plan 04 (wave 3 — owns the phase-final chronologically-last FULL suite gate)
tech-stack: [next 15, react 18, node --test (Node 24 type stripping), zero-runtime-import pure module, hand-rolled rAF engine (unchanged)]
key-files:
  created: []
  modified:
    - src/components/explore/timeline-geometry.ts — TimelineEntry + selectTimelineEntries added IN PLACE; selectTimelineRoles + TimelineRole deleted (ONE derivation site, OQ-8); header no-sort rule scoped to the one function (316 lines)
    - src/components/explore/sections/experience-section.tsx — type-aware templates (role vs education), constant hollow education markers, type-aware keys/announce, education prop, SSR entry 1 = BEng (323 lines)
    - src/components/explore/explore-panels.tsx — adapter passes education={data.education}; W-3 gate reads the merged count; comments renewed
    - tests/explore-timeline.test.mjs — renewed 5-entry typed contract (599 lines): real-JSON derivation, selection contracts, stable/nulls-last sort, gone-check, template field mapping, n=5 sweeps (Δ=22.5°, ladder 1/0.9125/0.825/0.7375/0.65), W-4 education durations, E-1 totality
    - tests/explore-visuals-server.test.mjs — line-90 source pin renewed to selectTimelineEntries
    - tests/explore-visuals.test.mjs — experience-adapter pin renewed to the education-passing form; counter-idiom pin message renewed to §4: 01 / 05
    - tests/explore-visuals-skills.test.mjs — experience-adapter pin renewed to the education-passing form
    - tests/explore-sweep.test.mjs — E-6…E-9 export rows renewed to the 5-entry contract (BEng SSR entry, 01 / 05, ≥4 hidden layers, 5 dots + 5 labels at opacity:0); placement greps untouched (plan 03 scope)
decisions:
  - Assumption-delta PROMOTE honoured (OQ-8): selectTimelineRoles/TimelineRole deleted with no deprecated alias — ONE derivation site; roles round-trip as type:'role' with byte-identical engine behaviour.
  - Task-1 RED-locality mechanics: the new-contract blocks consume the module through ONE dynamic namespace import (never a static import of the not-yet-existing export), so RED failed only the renewed blocks (13 failures, 65 retained assertions green) and module load stayed intact.
  - The plan-pinned single-interface TimelineEntry shape gives no discriminated-union narrowing; the component narrows the entry union with the 'company' in entry predicate (roles always carry company; education never does) — verified against the real JSON shapes.
  - Education arc markers: constant 'h-1.5 w-1.5 rounded-full border border-chart-2 bg-transparent' in both states (W-2 — never fill, never swap size); compact year chips hollow at the chip's h-2 w-2 footprint; labels render the year only (no W-4 date-line, which stays role-only).
  - aria-labels 'Previous role'/'Next role' kept verbatim (plan §3.4 unchanged recipes; sweep E-8 pins them).
  - Two Task-1 test-side assertion bugs fixed in their own test: commit (06790a1) before the feat commit, keeping the plan's rule that the feat commit touches no test file: the n=5 emphasis ladder must be sampled at c′=0 (it is a distance ladder over |i−c′|), and contentLayer(0, 5) exits upward to the −28 clamp.
metrics:
  duration: ≈26 min (executor orientation 19:05+03 → final commit 19:30+03; commit window 19:23–19:30)
  completed: 2026-09-24
status: complete
actuals:
  tasks: 3 (plus 1 in-cycle test-fix commit)
  commits: 4
  tokens: not measured
---

# Phase 09 Plan 01: Education-on-arc Summary

The semicircular career arc now carries 5 chronological entries — BEng 2012 · Netcompany-Intrasoft 2019 · MSc 2021 · Upstream Systems 2022 · Chubb 2023 — derived through the ONE typed `selectTimelineEntries` site with type-aware templates, while the hand-rolled rAF engine and every existing geometry/progress/emphasis function stayed byte-untouched.

## TDD Gate Compliance

Type: tdd. Commit order: `test:` RED (a449cea, 13 confined failures on record) → `test:` fix (06790a1) → `feat:` GREEN (f84900f) → `test:` export-pin renewal (65cb790). The first scope-matching commit is `test:` — the tdd_audit ship gate's first-commit requirement is satisfied; no gate missing.

## Verification evidence

- RED confined: 13 failures all inside the renewed blocks (`TypeError: geometry.selectTimelineEntries is not a function`, gone-check, absent source strings); 65 retained phase-8 assertions green; module load intact.
- GREEN: the five diff-touched suites 98/98 green (explore-timeline 27, explore-visuals-server 15, explore-visuals 40, explore-visuals-skills 16, explore-sweep 19); `npm run typecheck` exit 0; `npm run build` exit 0.
- Engine untouched: `git diff --stat src/components/explore/use-timeline-progress.ts` empty; zero `framer-motion` matches under `src/components/explore/sections/experience*` (and zero in the whole explore tree).
- Static export: `out/explore.html` carries the BEng degree/institution/`'September 2012 - December 2018'` AS STORED, the stripped-form `01 / 05` counter, exactly 5 `data-timeline-dot` and 5 `data-timeline-label` spans at inline `opacity:0`, and 4 `visibility:hidden` layers (5 entries, 1 visible).
- Phase gates re-grepped at close: zero framer-motion under experience*, engine diff empty, n=5 math assertions green (Δ=22.5° sweep, ladder exactness via the approx helper, keyboard round-trip i∈{0..4}).

## Known Stubs

None. The grep hits for "placeholder" in tests/explore-visuals-server.test.mjs are pre-existing phase-7 assertions about the stat-tiles em-dash placeholder contract (E-9), not stubs in this plan's code. Zero TODO/FIXME/skipped tests in any changed file.

## Threat Flags

None. No capability in this plan touches auth, storage, or network egress; the only rendered externals are data strings from the approved portfolio JSON, text-escaped by React SSR. No dangerouslySetInnerHTML, no new dependencies, no CSS/global changes.

## Self-Check: PASSED

- All 8 modified files exist on disk at the committed state (`git status` clean for plan-01 paths; only `.planning/async-jobs.json` — orchestrator-owned — and unrelated untracked junk remain).
- All 4 commits exist on `phase-9`: a449cea, 06790a1, f84900f, 65cb790 (conventional `test:`/`feat:` prefixes with the EXPLORE-09-editorial-motion-revision-01 scope, one commit per task).
- min_lines honoured: timeline-geometry.ts 316 ≥ 290; experience-section.tsx 323 ≥ 280; tests/explore-timeline.test.mjs 599 ≥ 380.
- Green gate over this plan's final source tree: build + typecheck + the five diff-touched suites all green (the phase-final chronologically-last FULL-suite gate is plan 04 Task 3, wave 3, per the declared wave-1 coupling).