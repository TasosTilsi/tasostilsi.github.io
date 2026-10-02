# Phase 8 Plan 01: Pure Timeline Derivation Core Summary

The semicircular career timeline's ONE pure derivation module (`timeline-geometry.ts` — 15 exports, zero runtime imports, erasable TS) implementing every NORMATIVE UI-SPEC formula (§1.3 progress, §2.2 geometry, §2.3 carousel, §3 content layers, §7 reduced-motion variants) plus D-06 role selection and D-03/R-14 start-year parsing, proven RED-first by a 19-assertion contract suite that reads the real `portfolio-main-data.json` at test time.

---
phase: EXPLORE-08-experience-showcase-revision
plan: 01
subsystem: explore-timeline
tags: [timeline, arc-geometry, carousel, sticky-range, reduced-motion, keyboard, pure-module, erasable-ts, tdd, R-12, R-13, R-14, REV-12]
requires:
  - ".planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-UI-SPEC.md (§1.3/§2.2/§2.3/§3/§7 formulas — NORMATIVE, implemented verbatim; §12 edge matrix; §14 seam 1)"
  - ".planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-CONTEXT.md (D-01…D-07; D-02 sticky-range, D-03 year labels, D-06 role selection)"
  - "src/components/explore/tour-placement.ts (the R-12 zero-runtime-import / erasable-TS header contract precedent)"
  - "src/components/explore/viz-data.ts:90 (the surviving GLOBAL_YEAR_PATTERN regex precedent — parseDuration/YEAR_PATTERN are deleted and were NOT imported, R-14)"
  - "src/data/portfolio-main-data.json + src/data/portfolio-main-data.d.ts (the real data the suite asserts against at test time)"
provides:
  - "src/components/explore/timeline-geometry.ts — the phase's single derivation site (UI-SPEC §14 seam 1): computeProgress(rel,range) = clamp(−rel/range,0,1) with range≤0→0; continuousIndex(progress,roleCount) = (n−1)·progress (n≤1→0); activeIndexFromContinuous(c,roleCount) = clamp(Math.round(c),0,n−1) (W-2 normative, NOT band if/else); markerAngle(index,c,roleCount) = 180−(i−c′)·(90/(n−1)) (exact-fit Δ, n≤1→180); markerEmphasis(index,c,roleCount) → {opacity 0.65+0.35t, scale 0.7+0.3t}; contentLayer(index,c,reducedMotion=false) → {opacity, translateY clamp(14d,±28), visible |d|<1}; reducedMotionAngle(index,roleCount) = frozen {180,135,90} by index; reducedMotionEmphasis (opacity ladder, scale pinned 1); viewBoxToPx(zone) → {s, offsetX, offsetY, centerX, centerY, radius} mirroring the SVG meet-mapping exactly; markerPoint(geometry,thetaDeg) = locked cos/sin formula, SVG y-down, θ∈[90°,270°] = left-bulging C; progressForRole(index,roleCount) = i/(n−1) (n≤1→0); scrollTargetForRole(scrollTop,rel,index,roleCount,range) = scrollTop+rel+progressForRole·range; startYear(duration|null|undefined) → FIRST /\\b(?:19|20)\\d{2}\\b/ match or null; selectTimelineRoles(entries) → [{year, entry}] isTechRelated-filtered in JSON order; dateLineFits(duration,innerWidthPx) = 6px/char ≤ inner−16, empty label always true"
  - "tests/explore-timeline.test.mjs — 19 contract assertions in the house node --test style: all §2.3 formulas pure, the n=3 exact-fit sweep invariant (every marker angle ∈ [90°,270°] over progress 0→1 step 0.01), generalized n∈{1,2,4}, emphasis ladder + monotonicity, contentLayer state table, RM variants, keyboard round-trips, real-JSON data shaping (2023/2022/2019 + company order), W-4 predicate, E-1/E-2/E-4 edge matrix"
  - "The direct `.ts` import in the test file is itself the R-12 proof: the module loads under node --test via Node 24 type stripping with only a type-only import line"
affects:
  - "EXPLORE-08-experience-showcase-revision-02 (stage component + hook consume these derivations; see API notes below — especially the keyboard round-trip form and contentLayer's RM param)"
  - "EXPLORE-08-experience-showcase-revision-03 (grid/wrapper consumes selectTimelineRoles length for the W-3 data-conditional wrapper height)"
tech-stack: [typescript-erasable-only, node-test, zero-runtime-imports]
key_files:
  created:
    - "src/components/explore/timeline-geometry.ts"
    - "tests/explore-timeline.test.mjs"
  modified: []
decisions:
  - "DEV-1 (recorded): plan Task 1 item 9's shorthand `activeIndexFromContinuous(progressForRole(i,3)) === i` is not mathematically consistent with item 3's NORMATIVE Math.round(c′) form — progressForRole returns progress space (role 2 → progress 1) where Math.round(1) = 1 ≠ 2. Implemented + tested the full-pipeline round-trip the must-have names ('round-trip through the primary derivation'): activeIndexFromContinuous(continuousIndex(progressForRole(i,n),n),n) === i for i∈{0,1,2} including the legitimate edges, PLUS the direct c′=i form activeIndexFromContinuous(i,n) === i (UI-SPEC §2.3: stepping to role i sets c′ = i). Both green; downstream keyboard stepping must use scrollTargetForRole (progress space) which the round-trip proves correct."
  - "DEV-2 (recorded): dateLineFits gained one totality guard — `if (!duration) return true` — so the empty label unconditionally fits even below the 16px padding floor (plan Task 3(e); the bare formula would return false for innerWidth < 16). The W-4 formula itself is untouched for non-empty strings."
  - "Task 3's RED run found exactly ONE missing guard (dateLineFits empty label, 18/19 pass → 1 fail); every other E-1/E-2/E-4 edge was already total from Task 2's guards — verified by the failing run, then closed, then green 19/19. Committed atomically (tests + guard in one commit) per the plan's explicit single-commit instruction; the plan's first commit (Task 1) is already the test: commit so tdd ordering holds."
  - "Signatures pinned for downstream plans: roleCount is the LAST parameter of every carousel function; contentLayer/reducedMotion* take no roleCount beyond what's listed; ArcGeometry carries s/offsets/center/radius; TimelineRole = {year: string|null, entry}; markerPoint takes (geometry {centerX,centerY,radius}, thetaDeg) — label anchors = markerPoint({...g, radius: g.radius*0.88}, θ)."
metrics:
  duration: "~20 min (RED run → 3 commits → 2× full gate)"
  completed: "2026-09-24T13:40:00+03:00"
  tasks: 3
  commits: 3
  suite_delta: "180 → 199 (+19: the explore-timeline contract suite)"
  gate_run_1: "typecheck exit 0 + full node --test suite 199/199"
status: complete
---

## What was built

**Task 1 (RED, commit `2af7f88`)** — `tests/explore-timeline.test.mjs`: the pure derivation contract suite in the house node --test style (runner note header, `node:assert/strict`, `readFileSync` of the REAL `src/data/portfolio-main-data.json` — expectations derived from the real data, never copied literals). 13 tests pinning UI-SPEC §2.3 verbatim: computeProgress clamp/monotonic/totality, continuousIndex, activeIndexFromContinuous Math.round boundaries (0.49→0, 0.5→1, 1.5→2, 2→2, clamped), the markerAngle exact-fit sweep (n=3: every angle ∈ [90°,270°] for progress 0→1 step 0.01; Δ=45; c′=i → 180° focal; generalized n∈{1,2,4}), viewBoxToPx meet-mapping (zone 250×520 → s=2.5, centerX 250, centerY 260, radius 250) + markerPoint with SVG y-down (θ=90 → BOTTOM vy=200, θ=270 → top vy=0, θ=180 → left bulge vx=0) + the 0.88 label inset, the emphasis ladder (1/1, 0.825/0.85, 0.65/0.7, monotone in |i−c′|), the contentLayer state table (d=0/±0.5/±1/2, translateY clamped ±28), reduced-motion variants (frozen {180,135,90}, scale 1, translateY≡0, opacity-only), keyboard targets, startYear FIRST-match on the real durations ('2023','2022','2019'; 'Sept 2022 — Aug 2023'→'2022' never max/min), selectTimelineRoles ([Chubb, Upstream Systems, Netcompany-Intrasoft] in JSON order, 4 non-tech excluded), dateLineFits (19-char Chubb: fits 200, not 100). Plus the not-implemented stub module so the suite EXECUTES and fails on its assertions/throws — never a module-resolution crash. RED evidence: `ℹ tests 13 · pass 0 · fail 13 · exit 1`, every failure `Error: not implemented` from a stub body.

**Task 2 (GREEN, commit `357989a`)** — `src/components/explore/timeline-geometry.ts` (273 lines ≥ 120): every stub body replaced with the NORMATIVE UI-SPEC formulas, keeping the test-imported signatures. Header cites §14 seam 1 / R-12 (zero runtime imports — the sole import line is `import type { ExperienceEntry } from '@/data/portfolio-main-data'`, erased at runtime) / R-13 (the phase's ONE derivation site, superseding the viz-data header for phase-8 derivations; viz-data.ts NOT edited) / R-14 (startYear re-derived from the surviving GLOBAL_YEAR_PATTERN precedent, non-global so the first match wins). Erasable TS only. Acceptance greps: `Math.cos`/`Math.sin` present (locked positioning), only import is `import type`, `isTechRelated` in the module (D-06 selection lives here, not in components). Suite 13/13 green, exit 0.

**Task 3 (RED→GREEN, commit `6ce577c`)** — edge hardening: 6 new tests over the E-1/E-2/E-4 matrix (hyphen-U+002D non-tech durations parse via startYear yet stay filter-excluded; E-1 zero-role totality `[]`; the full n=1 guard set — c′≡0, focal 180°, emphasis {1,1}, active layer, divide-by-zero-free; contentLayer |d|>2 clamps ±28 at any offset; computeProgress release clamps far beyond ±range with no NaN; dateLineFits/startYear nullish totality). RED run: 19 tests, 18 pass, 1 fail — `dateLineFits('', 10)` failed the bare formula below the 16px floor. GREEN: one totality guard (`if (!duration) return true`). Suite 19/19, exit 0.

## TDD Gate Compliance

Plan type is `tdd`. Ordering on record: `test:` commit `2af7f88` (RED suite + stub) precedes the first `feat:` commit `357989a` — the tdd_audit gate's first-scope-matching-commit check passes. Task 3 committed atomically (test additions + guard in ONE commit `6ce577c`) exactly as its <action> prescribes, with the plan's test: commit already in place. No gates missing.

## Known Stubs

None. Stub scan (`TODO|FIXME|placeholder|not implemented|XXX|HACK`) over both plan files returns zero hits — the Task 1 stub's throws were fully replaced in Task 2. No skipped tests (`ℹ skipped 0` on every run).

## Threat Flags

None. Pure math module: no network, no eval/child_process, no DOM/window/localStorage access, no process.env, no dangerouslySetInnerHTML (grep clean); the only regex (`/\b(?:19|20)\d{2}\b/`, non-global, linear) runs on data-file strings; zero new dependencies (module imports nothing at runtime); input surface is the typed portfolio data file — no untrusted input.

## Self-Check: PASSED

- Both created files exist: `src/components/explore/timeline-geometry.ts` (273 lines ≥ min 120; 15/15 planned exports present), `tests/explore-timeline.test.mjs` (409 lines ≥ min 140; direct `.ts` import + real-JSON readFileSync both on record) ✓.
- Commits on `phase-8`: `2af7f88` (test: suite + stub, exactly its two files) → `357989a` (feat: module implementation, exactly its one file) → `6ce577c` (test: edge-hardening + guard, exactly its two files) — three atomic commits, no blanket adds, no amends ✓.
- Full gate run 1 green on the tree: `npm run typecheck` exit 0 + full node --test suite 199/199 across all 11 test files (baseline 180 → 199, +19) ✓.
- Green-gate-finality: SUMMARY + STATE written next, then the gate re-runs as the chronologically last action (run 2) anchoring green on the exact final tree ✓.

---

*Executed 2026-09-24 · plan EXPLORE-08-experience-showcase-revision-01 · wave 1 of the phase-8 loop*