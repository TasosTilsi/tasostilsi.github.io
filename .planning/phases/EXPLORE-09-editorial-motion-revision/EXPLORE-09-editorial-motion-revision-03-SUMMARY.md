---
phase: 09-editorial-motion-revision
plan: 03
subsystem: explore-navigation-chrome
tags: [REV-14, grid-reflow, real-DOM-order, id-keyed-tour, per-id-accents, tdd, order-first-retired]
requires:
  - src/components/explore/constants.ts (EXPLORE_SECTIONS — the single ordering source, reordered)
  - src/components/explore/explore-panels.tsx (plan-01's selectTimelineEntries W-3 gate — preserved byte-for-byte in behaviour)
  - .planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md §1 (normative order table + re-mapped flows)
provides:
  - EXPLORE_SECTIONS reordered to [about, skills, experience, projects] — the ONE ordering identity (DOM = visual = drawer = chips = stagger derive from it)
  - the id-keyed literal 6-step EXPLORE_TOUR_STEPS table (content order welcome → about → experience → skills → projects → finish unchanged; the positional EXPLORE_SECTIONS.map zip + EXPLORE_TOUR_STEP_BODIES deleted)
  - the per-id DIGIT_ACCENTS Record<ExploreSectionId, string> in the drawer (accents follow the section, OQ-7)
  - the order-first-free PLACEMENT map (experience wrapper 'md:col-span-2 md:h-[300vh]', Experience lands row 2 naturally)
affects:
  - plan 04 (wave 3 — owns the projects wrapper/shell placement deltas next wave; the sweep col-span-2 count message text stays 'projects shell' until then)
  - the tour card rendering (constants consumers) — heading/announce now derive via the id-keyed tourLabel lookup
tech-stack: [next 15, react 18, node --test (Node 24 type stripping), pure class-string surgery, zero new dependencies]
key-files:
  created: []
  modified:
    - src/components/explore/constants.ts — EXPLORE_SECTIONS reordered; positional tour generation replaced by the id-keyed literal table + tourLabel() id lookup; positional bodies array deleted (155 lines)
    - src/components/explore/explore-drawer.tsx — DIGIT_ACCENTS positional array → per-id Record consumed as DIGIT_ACCENTS[section.id]; ExploreSectionId type import (81 lines)
    - src/components/explore/explore-panels.tsx — PLACEMENT.experience.wrapper drops md:order-first; header/placement comment blocks renewed to the phase-9 reflow story (169 lines)
    - tests/explore-tour.test.mjs — step-table assertions renewed to the id-keyed contract (per-id sectionId/heading/announce/body pairing); NEW positional-zip gone-check test; U-10 chart-ban test renewed to imported-values mechanism; VALID_IDS listed in the new order (645 lines)
    - tests/explore-sweep.test.mjs — placement blocks renewed: sections order [about, skills, experience, projects], order-first count 0 (both P-row tests); E-6…E-9 (plan-01) untouched
    - tests/explore-shell.test.mjs — drawer digit pins renewed to the per-id Record contract; placement test order-first count 0; the constants membership list renewed to the phase-9 order (Task-3 straggler)
decisions:
  - Assumption-delta PROMOTE honoured: the reordered EXPLORE_SECTIONS array is THE order identity; both positional consumers (drawer accents array, tour body zip) demote to id-keyed lookups over the same identity — no parallel ordering path survives (no EXPLORE_SECTIONS.map generation left in constants.ts).
  - The live RED run demonstrated the trap the plan predicted: with the array reordered but the zip still present, EXPLORE_TOUR_STEPS became [welcome, about, skills, experience, …] and Skills received the 'Roles in order…' body — 7 failures including the mis-paired-body assertions, all on record before the GREEN commit.
  - tourLabel(id) derives content-step heading/announce from the matching section's label BY ID (guarded lookup, throws on unknown id) — labels still never duplicated, now without any positional coupling.
  - The order-first count assertions grep the RAW source (comments included) — the renewed panels header comment initially re-introduced the literal md:order-first and was reworded to 'the order-first utility RETIRED' to keep the grep count honest at 0.
  - Task-3 straggler scope: the only remaining old-order pin outside the three renewed blocks was a membership list (order-irrelevant to its behaviour) in tests/explore-shell.test.mjs — renewed for pin hygiene; the tour suite's ['welcome','about','experience','skills','projects','finish'] deepEqual is the CONTENT order (unchanged by D-01) and was correctly left alone.
metrics:
  duration: ≈12 min (first commit 19:59:46+03 → last commit 20:03:04+03; executor window ~19:55–20:10+03)
  completed: 2026-09-24
status: complete
actuals:
  tasks: 3
  commits: 3
  tokens: not measured
---

# Phase 09 Plan 03: Grid Reflow (REV-14) Summary

The /explore panel grid now reflows by real DOM order — About+Contact | Skills row 1, Experience full-width row 2, Projects row 3 — with the drawer digit accents and the tour's content steps re-pinned by section id, so the reorder re-pairs nothing silently and the tour walk keeps its locked content order.

## TDD Gate Compliance

Type: tdd. Commit order: `test:` RED (0eb1180 — 5 confined failures on record) → `feat:` GREEN (1aef24c) → `test:` straggler renewal (8784244). The first scope-matching commit is `test:` — the tdd_audit ship gate's first-commit requirement is satisfied; no gate missing. A mid-edit re-run (post-reorder, pre-zip-removal) put a fresh 7-failure RED on record against the current tree — including the live mis-paired-body demonstration — before the remaining implementation edits.

## Verification evidence

- RED (0eb1180): exactly 5 failures, all new-contract assertions (drawer per-id Record absent, two order-first-zero pins against count 1, old sections order, positional-zip gone-checks); 90 retained pins green.
- GREEN (1aef24c): the three reflow suites 95/95; `npm run typecheck` exit 0; all Task-2 acceptance greps pass (array order, order-first count 0, EXPLORE_SECTIONS.map count 0 in constants.ts, DIGIT_ACCENTS[section.id] count 1).
- Full gate over the final tree of this plan: `npm run typecheck` exit 0 → `npm run build` exit 0 → `node --test tests/*.test.mjs` 226/226 green, chronologically after the last test edit.
- Export DOM order (fresh build): the four mono index chips appear in document order 01, 02, 03, 04 with chip→section pairs 01→About | 02→Skills | 03→Experience | 04→Projects (programmatic adjacency check against out/explore.html).
- Invariant greps at close: zero positional accent indexing in the drawer; every placement utility md:-scoped (no bare h-[300vh], no unprefixed col-span-2); zero overflow utilities in explore-panels.tsx; EXPLORE_SECTIONS carries exactly 4 ids (sweep pin); the status-bar counter derivation (EXPLORE_SECTIONS.length) untouched.
- Order-independent flows confirmed untouched: tour scroll targets resolve by section id (no EXPLORE_SECTIONS usage in explore-tour.tsx), IO marking is section-id/height-based, the counter is count-based — zero edits to explore-status-bar.tsx, use-explore-visited.ts, explore-tour.tsx.

## Known Stubs

None. Zero TODO/FIXME/placeholder/skipped-test hits in any file this plan touched.

## Threat Flags

None. No auth, storage, or network-egress capability touched; no new dependencies (package.json untouched); the only rendered externals remain the approved data strings, text-escaped by React SSR. No CSS/global changes; the sticky chain carries no new overflow utility.

## Self-Check: PASSED

- All 6 modified files exist on disk at the committed state; `git status` clean for plan-03 paths (only orchestrator-owned/unrelated untracked files remain).
- All 3 commits exist on `phase-9`: 0eb1180 (test RED), 1aef24c (feat GREEN), 8784244 (test straggler renewal) — conventional prefixes with the EXPLORE-09-editorial-motion-revision-03 scope, one commit per task, no amend across tasks.
- min_lines honoured: constants.ts 155 ≥ 120; explore-panels.tsx 169 ≥ 140; explore-drawer.tsx 81 ≥ 70; tests/explore-tour.test.mjs 645 ≥ 560.
- Green gate over this plan's final source tree: build + typecheck + the complete 226-test suite green, with the export-order and invariant greps on record after the build (the phase-final chronologically-last FULL-suite gate remains plan 04 Task 3, wave 3, per the declared wave coupling).