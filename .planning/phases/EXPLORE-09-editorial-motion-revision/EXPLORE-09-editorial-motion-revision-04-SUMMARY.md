---
phase: 09-editorial-motion-revision
plan: 04
subsystem: explore-projects-editorial-scroll
tags: [REV-17, framer-motion, editorial-scroll, useScroll, rowState, first-sentence, sticky-stage, ssr-progress-0, dual-engine, tdd]
requires:
  - EXPLORE-09-editorial-motion-revision-03 (the reordered EXPLORE_SECTIONS + the span-2 placement whitelist this plan re-homes from the projects shell to the wrapper)
  - EXPLORE-09-editorial-motion-revision-01 (selectTimelineEntries — the experience W-3 gate preserved byte-for-byte in behaviour inside the new placement factory)
  - .planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md §4 (normative geometry/row anatomy/motion/SSR/mobile contracts)
  - node_modules/framer-motion@13.4.3 (already a dependency — the first real usage in src)
provides:
  - src/components/explore/projects-row-state.ts — the pure, framer-free, zero-import-statement row-state module (firstSentence with OQ-1 reading (b) pinned, rowState §4.3 motion contract with RM variant + H≤0 totality, rowYear E-8 extraction) — node --testable via Node 24 type stripping (the timeline-geometry R-12 precedent)
  - src/components/explore/sections/projects-editorial-stage.tsx — the ONE framer-motion import site of the phase: mount-gated useScroll (container = the discovered .explore-shell > main, target = closest [data-editorial-wrapper], both handed in as ALREADY-HYDRATED ref initial values — the P1 window-fallback/invariant trap unreachable by construction), per-row useTransform consuming the pure rowState, useMotionValueEvent discrete aria channel, useReducedMotion opacity-only fallback, §4.4 constant SSR progress-0 rows
  - the projects placement (wrapper 'md:col-span-2 md:h-[300vh]' + sticky shell recipe verbatim) with the W-3 mirror gate (data.projects.slice(0, 6).length > 1) riding IN the placement factory as a data-derived gate — no section-id conditionals (the shell pin holds); E-15 dual sequential sticky ranges (both shells md:z-10)
  - the §4.1 literal DOM sequence in the server panel: stat tiles → rows viewport (hidden md:block + the U-15 inner height + the ONE sanctioned descendant overflow) → compact card grid byte-identical in the below-md container → TerminalPointer LAST in both tiers
  - the renewed §10.7 dual-engine assertion in tests/explore-visuals.test.mjs ('.animate('/'gsap'/'lottie' universal bans unchanged; framer-motion becomes the allowlist with the positive stage assertion; the projects-row-state.ts zero-import pin) — renewed, never deleted
affects:
  - the phase-final green gate (this plan's Task 3 run is the chronologically-last full-suite gate plans 01-03 declared)
  - verify/ship: the framer isolation grep gate (only the stage file), the tdd_audit first-commit gate (test: RED first — satisfied), the 375px invariant (all new utilities md:-scoped)
tech-stack: [next 15, react 18, framer-motion 13.4.3 (first usage), node --test (Node 24 type stripping), zero new dependencies]
key-files:
  created:
    - src/components/explore/projects-row-state.ts — the pure row-state module (125 lines; zero import statements of any kind, erasable TS only)
    - src/components/explore/sections/projects-editorial-stage.tsx — the 'use client' editorial stage (326 lines; the phase's only framer-motion import site)
    - tests/projects-editorial.test.mjs — the RED-first pure-module + integration suite over the real JSON (264 lines, 13 tests)
  modified:
    - src/components/explore/sections/projects-section.tsx — §4.1 literal DOM sequence (117 lines; card map JSX byte-identical inside the below-md container)
    - src/components/explore/explore-panels.tsx — the placement factory (per-system W-3 gates + data-editorial-wrapper on the generic wrapper; 176 lines)
    - tests/explore-visuals.test.mjs — the §10.7 loop renewed to the dual-engine contract (framer-motion allowlist + positive stage assertion + row-state zero-import pin)
    - tests/explore-sweep.test.mjs — the span-2 count message renewed to name the projects WRAPPER (the wave-2→3 handoff; count assertion untouched)
    - tests/explore-shell.test.mjs — the same message renewal (count assertion untouched)
decisions:
  - The P1 mount gate is structural: the outer stage renders the §4.4 constant progress-0 stack until a mount effect discovers BOTH .explore-shell > main and closest [data-editorial-wrapper]; the Inner motion child receives them as useRef INITIAL VALUES so no framer effect ever sees a pending ref (useScroll's invariant throw / permanent window-fallback cache are unreachable by construction).
  - Per-row useTransform lives in a module-private MotionRow component (hooks per component instance, no hooks-in-map) calling rowState twice — the pure module is the only math site; the stage never inlines row math (grep-counted 4 rowState( call sites: SSR stack, both per-row transforms, the discrete visible-set derivation).
  - The discrete a11y channel (aria-hidden/visibility at |d| ≥ 1) derives its visible-row set THROUGH rowState(...).visible and writes React state only when the SET changes (useMotionValueEvent + ref comparison) — the phase-8 discrete-only contract carried over; no aria-live on the stage.
  - firstSentence pins OQ-1 reading (b): the terminal period is KEPT for complete sentences (counts toward 120) and REPLACED by the ellipsis when truncating (never '….'); the four short top-6 rows render whole, DeepIndex (234) and Clarif-AI (122) truncate at a word boundary + '…' — verified against the real JSON before writing the suite.
  - Comment grep-hygiene carried over from plan-03: the docstrings were reworded ('no snap points' not 'no scroll-snap'; 'the below-md container' not the literal md:hidden; 'the stage's scroll-target data attribute' not the attribute name) so the unanchored acceptance greps stay honest — the attribute/substring appears exactly where the contract counts it.
  - The stage import in the server panel is aliased (ProjectsEditorialStage as EditorialStage) so the pinned grep -c "ProjectsEditorialStage" = 1 holds (the canonical name on the import line only).
  - W-3 split: the single `extended` boolean became a per-system gate pair riding IN the placement map (buildPlacement(data)) — experience on selectTimelineEntries > 1 (plan-01's derivation preserved byte-for-byte in behaviour), projects on slice(0, 6).length > 1 — with the render loop reading placement.gate and no section-id conditionals (the shell test pin holds).
  - §10.7 was RENEWED, not deleted: the '.animate('/'gsap'/'lottie' universal bans keep iterating every explore .ts/.tsx; the framer-motion ban became the allowlist (the stage file must CONTAIN it, every other file bans it) plus the projects-row-state.ts zero-import pin — the phase-8 wholesale ban renewed to the dual-engine reality.
metrics:
  duration: ≈40 min (RED commit 8ad8198 → GREEN 6e0f61a → integration 1fe9eb7; executor window single session)
  completed: 2026-09-24
status: complete
actuals:
  tasks: 3
  commits: 3
  tokens: not measured
---

# Phase 09 Plan 04: Projects Editorial Scroll (REV-17) Summary

The Projects panel now carries the framer-motion-driven editorial scroll — a sticky ~100vh stage inside a 300vh wrapper where the top-6 curated projects enter from below and coexist under ONE continuous scroll-linked progress value, with reduced-motion opacity-only swaps, SSR row-0 real text, and the existing compact card grid preserved byte-identical below md — with the row math in a pure framer-free module and framer-motion imported ONLY in the stage file.

## TDD Gate Compliance

Type: tdd. Commit order: `test:` RED (8ad8198 — the suite's failed static import, ERR_MODULE_NOT_FOUND for exactly projects-row-state.ts, exit 1 on record) → `feat:` GREEN (6e0f61a — module + stage, suite 12/12) → `feat:` integration (1fe9eb7 — source wiring + test renewals). The first scope-matching commit is `test:` — the tdd_audit first-commit requirement is satisfied. A second red/green loop is on record inside Task 3: the integration-grep block was written and run against the pre-edit tree (12 pass / 1 fail — the failure clustering exactly on the not-yet-wired sources) before the explore-panels/projects-section edits, with the renewed §10.7 + span-2 messages green throughout that red run.

## Verification evidence

- RED (8ad8198): `node --test tests/projects-editorial.test.mjs` exit 1, the single failure = the module import (not assertion drift).
- GREEN (6e0f61a): the pure suite 12/12; typecheck exit 0; all Task-2 acceptance greps pass (framer isolation — only the stage file matches under src/components/explore/; no-springs/hijack grep 0; rowState( count 4; 'use client' count 1 on line 1; zero `^import\s` matches in the row-state module).
- Integration (1fe9eb7): the editorial suite 13/13; every Task-3 acceptance grep on record — ProjectsEditorialStage count 1 in the section (alias import), data-editorial-wrapper count 1 in panels, both 300vh wrappers, the W-3 mirror gate, the whole-src framer isolation grep 0, both renewed span-2 messages, the §10.7 allowlist with the '.animate(' ban retained and the row-state zero-import pin, `node --test tests/explore-visuals.test.mjs` 30/30.
- FULL green gate over the final tree, chronologically after the last source/test edit: `npm run typecheck` exit 0 → `npm run build` exit 0 → `node --test tests/*.test.mjs` 239/239 (the complete suite, all plans 01-03 renewals included).
- Fresh-export checks (out/explore.html): the W-1 literal DOM order holds in the export (projects wrapper → row-0 truncated first-sentence text ending '…' → compact div → 'projects --all' pointer LAST); the rows viewport height class (calc(100dvh-14.5rem)) present; 5 parked rows with visibility:hidden + row 0 visibility:visible (the §4.4 SSR contract); the compact tier renders the full descriptions and all six names (byte-identical); the truncated row-0 text is NOT the raw full sentence (the first-sentence split is live).
- Invariant greps at close: framer-motion matches under src/ only in projects-editorial-stage.tsx (whole-tree grep -v count 0); zero overflow utilities in explore-panels.tsx (the sticky-breaker audit); md:col-span-2 raw count exactly 2; md:order-first count 0; every new placement utility md:-scoped.

## Known Stubs

None. Zero TODO/FIXME/placeholder/skipped-test hits in any file this plan touched.

## Threat Flags

None. No auth, storage, or network-egress capability touched; no new dependencies (package.json untouched — framer-motion 13.4.3 was already declared); the only rendered externals remain the approved data strings (text-escaped by React SSR) and the existing project links (target=_blank + rel=noopener noreferrer carried over). No wheel/touch listeners, no scroll-snap, no springs; the single scroll source stays .explore-shell > main; the rows-viewport overflow utility is the UI-SPEC §1.3-sanctioned descendant clip (the sticky-breaker audit's explore-panels.tsx grep stays at 0).

## Self-Check: PASSED

- All 8 files_modified exist on disk at the committed state: the 3 created files (row-state module, stage, test suite) and the 5 modified files; `git status` clean for plan-04 paths (only orchestrator-owned async-jobs.json + pre-existing untracked files remain).
- All 3 commits exist on `phase-9`: 8ad8198 (test RED), 6e0f61a (feat GREEN), 1fe9eb7 (feat integration) — conventional prefixes with the EXPLORE-09-editorial-motion-revision-04 scope, one commit per task, no amend across tasks.
- min_lines honoured: projects-row-state.ts 125 ≥ 80; projects-editorial-stage.tsx 326 ≥ 140; tests/projects-editorial.test.mjs 264 ≥ 120.
- The green gate covers the final workspace state: typecheck + build + the complete 239-test suite ran chronologically after the last code/test edit (commit 1fe9eb7) with the export checks on the fresh build; the SUMMARY write post-dates that run (plans 01-03's declared wave coupling makes this plan's Task-3 gate the phase-final one — the orchestrator's verify step re-runs the checks over the post-SUMMARY tree).