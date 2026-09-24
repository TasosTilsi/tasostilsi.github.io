# Phase 8 Plan 03: Falsifiability Hardening + Green-Gate Finality Summary

The finished phase proven, not assumed: the interaction-quality and no-hijack contracts pinned as 7 permanent source-invariant suite rows, the §9 SSR/export contract pinned as 4 data-derived Type-E rows, and the phase closed with the complete green gate (typecheck + build + all 11 suites) — this plan wrote tests and ran gates only, zero implementation edits.

---
phase: EXPLORE-08-experience-showcase-revision
plan: 03
subsystem: explore-timeline-tests
tags: [source-invariants, export-contract, no-hijack, cleanup-tokens, reduced-motion, md-gate, a11y-contract, geometry-provenance, data-derived-expectations, green-gate-finality, REV-07, REV-12, REV-13]
requires:
  - "src/components/explore/use-timeline-progress.ts + sections/experience-section.tsx + explore-panels.tsx (plan 02's delivered stage/hook/grid — the invariant targets)"
  - "src/components/explore/timeline-geometry.ts (plan 01's pure module — Math.cos/Math.sin provenance target)"
  - "src/data/portfolio-main-data.json (the data-derived export expectations)"
  - ".planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-UI-SPEC.md (§2.4/§4/§5/§7/§9/§10/§12/§13 — NORMATIVE grounding for every row)"
provides:
  - "tests/explore-visuals.test.mjs — the phase-8 source-invariant block (7 tests): R-3 id placement (wrapper anonymous, id={section.id} flow), D-02/R-5 no-hijack greps (no wheel/touchmove/touchstart, no document/window listeners), E-7 cleanup tokens (removeEventListener ×2+, disconnect(), cancelAnimationFrame), E-13 single RM read + no change listener on the RM query, §8 B-1 md gate add/remove change listener, §2.4/§4/§10 marker non-interactivity + two-control a11y contract, REV-07 cos/sin provenance with no hardcoded ≥3-digit translate coordinates"
  - "tests/explore-sweep.test.mjs — the phase-8 Type-E export rows (4 tests, E-6…E-9): role-1 real text DATA-DERIVED from the JSON at test time, visibility:hidden ≥ 2, stage anatomy markers (group label / Prev / Next / 01 / 03 counter / arc path d), inline opacity:0 ≥ 6 with the precise 3-dot + 3-label mechanism pin"
  - "The phase's green evidence: gate run 1 (typecheck 0 + build 0 + all 11 suites green, 212 assertions) recorded before the SUMMARY/STATE writes; the final gate re-run anchors the completion claim on the exact final tree"
affects:
  - "Verify/ship steps consume these suites as the phase's permanent enforcement layer — a regression to any interaction contract (hijack, leak, aria, geometry hardcoding, export text) now fails the suite, not plan prose"
  - "Milestone close: the §9 export rows double as the cross-phase UAT anchor for the timeline's no-JS posture"
tech-stack: [node-test, source-grep-invariants, static-export-contract, zero-new-deps]
key_files:
  created: []
  modified:
    - "tests/explore-visuals.test.mjs"
    - "tests/explore-sweep.test.mjs"
decisions:
  - "DEV-1 (plan row-6 reconciliation): the plan pinned '\"hover:\" occurs EXACTLY twice (both on the Prev/Next buttons)' but the delivered source holds the tour's GHOST_INTERACTION recipe verbatim in ONE shared const interpolated by BOTH buttons — hover: ×1 + ${GHOST_INTERACTION} ×2. Duplicating the recipe inline to satisfy the literal count would degrade the source (two copies of the recipe string) and fight the const's own doc pin, so the SAME §4 contract was asserted against the delivered shape: hover: exactly once (inside the shared const, hence nowhere else hoverable) + both controls interpolate GHOST_INTERACTION. Recorded in the test's comment; no assertion was weakened — the contract (hover affordance on exactly the two controls) is enforced."
  - "DEV-2 (counter serialization): the plan's E-row pinned the contiguous string '01 / 03', but React SSR inserts <!-- --> text-node separators between adjacent expressions ('01<!-- --> / <!-- -->03'). The exportText helper (the suite's entity-decode convention extended with a separator drop) normalizes before matching — the §4 counter contract is pinned at the rendered-text level, not the serialization accident."
  - "DEV-3 (row-4 strengthening): beyond the plan's 'opacity:0 ≥ 6' raw count, the row also pins the precise mechanism — exactly 3 data-timeline-dot spans and exactly 3 data-timeline-label spans at style=\"opacity:0\" — so a stray opacity:0 elsewhere can no longer mask a missing marker."
  - "DEV-4 (gate sequencing): gate run 1 (typecheck + build + all 11 suites) executed BEFORE the SUMMARY/STATE writes; the final gate re-runs as the chronologically last action (run 2) covering the exact final tree — green-gate finality, same sequencing as plan 02."
metrics:
  duration: "~20 min (pre-verified greps → 2 test commits → gate run 1 → SUMMARY/STATE → gate run 2)"
  completed: "2026-09-24T16:15:12+03:00"
  tasks: 3
  commits: 2
  suite_delta: "201 → 212 assertions (+11: 7 EXPLORE-08 invariant rows + 4 Type-E export rows)"
  gate_run_1: "typecheck exit 0; build exit 0; all 11 suites green — header 9, routing 7, shell 30, sweep 20, timeline 19, tour 44, visuals-server 11, visuals-skills 10, visuals 30, data-integrity 18, docx-order 14 (212 total, 0 skipped)"
status: complete
---

## What was built

**Task 1 (commit `dd9117c`)** — the phase-8 source-invariant block appended to `tests/explore-visuals.test.mjs` (7 tests, all green immediately against the delivered source; header doc updated):

1. **R-3**: `explore-panels.tsx` carries no `<div` with an id attribute (regex `/<div[^>]*\bid=/` absent — the extended wrapper is anonymous) and `id={section.id}` flows into PanelShell → the sticky `<section>` (panel-shell.tsx renders `id={id}`).
2. **D-02/R-5 no-hijack**: hook AND section contain none of wheel/touchmove/touchstart; the hook contains no `document.addEventListener` and no `window.addEventListener`.
3. **E-7 cleanup**: hook carries removeEventListener ≥ 2, `disconnect()`, `cancelAnimationFrame`.
4. **E-13 RM per-pass**: exactly ONE raw `prefers-reduced-motion` occurrence; exactly one `addEventListener('change')` whose nearest preceding matchMedia is `(min-width: 768px)` — never the RM query.
5. **§8 B-1 md gate**: `matchMedia('(min-width: 768px)')` present WITH its change listener AND the corresponding removeEventListener.
6. **§2.4/§4/§10 a11y**: no aria-current / tabIndex / cursor-pointer; hover affordance confined to the shared GHOST_INTERACTION const interpolated by exactly the two Prev/Next controls (DEV-1); `aria-live="polite"` present; the `padStart(2, '0')} /` counter idiom present.
7. **REV-07 geometry provenance**: `Math.cos` + `Math.sin` in timeline-geometry.ts; no `translate(` string carries a hardcoded ≥3-digit coordinate across the module, the hook, and the section.

Suite run: 30/30 green (23 prior + 7 new).

**Task 2 (commit `6f61103`)** — the phase-8 Type-E export rows appended to `tests/explore-sweep.test.mjs` (build-first convention, E-6…E-9 continuing the established numbering):

- **E-6**: role 1 = the FIRST isTechRelated entry loaded from `src/data/portfolio-main-data.json` at test time; `out/explore.html` contains its title/company/duration/location/first bullet — zero copied literals (D-07/§9).
- **E-7**: `visibility:hidden` count ≥ 2 in the export (layers 2–3 SSR-hidden; layer 1 visible — the §9 derivation evaluated at progress 0).
- **E-8**: stage anatomy markers — `aria-label="Career timeline"`, `Previous role`, `Next role`, the counter `01 / 03` (DEV-2 separator handling), and the arc path `d="M 100 0 A 100 100 0 0 0 100 200"`.
- **E-9**: inline `opacity:0` ≥ 6, plus the precise mechanism pin — exactly 3 `data-timeline-dot` spans and exactly 3 `data-timeline-label` spans at `style="opacity:0"` (DEV-3).

`npm run build` exit 0; suite run 20/20 green (16 prior + 4 new).

**Task 3 (gate run 1, verification only — no commit)** — complete gate: `npm run typecheck` exit 0, `npm run build` exit 0, and every `tests/*.test.mjs` green in one sequence (11 suites, 212 assertions, 0 skipped). The full gate re-runs as the chronologically last action after the SUMMARY/STATE writes (run 2) and anchors the completion claim (DEV-4).

## TDD Gate Compliance

Plan type is `execute` (not `tdd`) — no test:-before-feat: ordering requirement applies. Both tasks are `type: test` rows asserting the DELIVERED contract (expected green immediately per the plan's own action text); both ran green before their commits, and Task 3's gate is the chronologically-final enforcement.

## Known Stubs

None. Stub scan (`TODO|FIXME|placeholder|not implemented|XXX|HACK`) over both modified test files returns zero hits; `skipped 0` on every suite run (11/11 checked in gate run 1).

## Threat Flags

None. This plan wrote tests only — no source, no deps (the 38-dependency pin stays green inside the suite). The pinned contracts themselves are the security-adjacent enforcement: the no-hijack greps (no wheel/touch listeners, no document/window listener attachment) and the cleanup-token greps now fail the suite on regression.

## Self-Check: PASSED

- Artifacts exist and exceed the plan's min_lines: `tests/explore-visuals.test.mjs` 895 lines (≥ 720), `tests/explore-sweep.test.mjs` 383 lines (≥ 270). Both carry the plan's required grep tokens ("R-3", "wheel", "cancelAnimationFrame", "prefers-reduced-motion", "min-width: 768px", "aria-current", "portfolio-main-data.json"). ✓
- Commits on `phase-8`: `dd9117c` (Task 1 — exactly tests/explore-visuals.test.mjs) → `6f61103` (Task 2 — exactly tests/explore-sweep.test.mjs). Task 3 is gate-only (no files, no commit). Two atomic commits, no blanket adds, no amends. ✓
- Gate run 1 green on the tree: typecheck 0 + build 0 + all 11 suites (212 assertions). ✓
- Green-gate finality: SUMMARY + STATE written next, then the FULL gate re-runs as the chronologically last action (run 2), anchoring the completion claim on the exact final tree. ✓

---

*Executed 2026-09-24 · plan EXPLORE-08-experience-showcase-revision-03 · wave 3 of the phase-8 loop (final plan of the phase)*