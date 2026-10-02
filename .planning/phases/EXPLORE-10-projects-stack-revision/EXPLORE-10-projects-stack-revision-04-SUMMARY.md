---
phase: 10-projects-stack-revision
plan: 04
subsystem: explore/projects-stack
status: complete
tags: [tdd, gap-closure, generative-visuals, distinctness, variant-table]
dependency_graph:
  requires:
    - EXPLORE-10-projects-stack-revision-01
  provides:
    - src/components/explore/projects-card-state.ts#CURATED_VARIANTS
    - src/components/explore/projects-card-state.ts#projectVisualVariant
  affects:
    - src/components/explore/sections/projects-stack-stage.tsx
    - tests/explore-visuals.test.mjs
tech_stack:
  - TypeScript (erasable syntax only, zero runtime imports)
  - Node 24 native type stripping
  - node:test
key_files:
  created: []
  modified:
    - src/components/explore/projects-card-state.ts
    - tests/projects-stack.test.mjs
  deleted: []
decisions:
  - "AP-1 closure: promoted CURATED_VARIANTS (6 entries keyed by project name, anatomy-matched to the delivered components) to the PRIMARY visual assignment and demoted djb2(name) % 4 to the FALLBACK for names outside the curated six"
  - "D-03 amendment: the curated table supersedes the 'name-hash only' clause for the delivered top-6; the hash stays total for any future/uncurated project name"
  - "UI-SPEC §4.4 divergence recorded in the module docstring: shipped identifiers glyph/report/dashboard/network replace the drafted labels architecture-diagram/metrics-dashboard/report-table/route-map; Uom Track ships the dashboard (KPI/progress) composition, not §4.4 row 5's drafted report table"
  - "Retired §3 contract respected: cardState(cardIndex, frontIndex, count, reducedMotion) and the LEVELS depth table are untouched; no retired formula (carouselProgress / LEAVE_EXTRA / activeCenter) was reintroduced"
metrics:
  duration_minutes: 20
  completed_date: "2026-09-29"
  tasks: 2
  commits: 2
---

# Phase 10 Plan 04: Curated Variant Table (AP-1 Gap Closure) Summary

Closed VERIFICATION gap AP-1 by making six-distinct generative visuals a property of the design record instead of a coincidence of a string hash: the shipped `projectVisualVariant` gave only 5 distinct visuals for 6 cards because `ServicedMetricsCalculator` and `Uom Track` both hashed to `'network'`.

## What changed

- `tests/projects-stack.test.mjs` (+108 lines): the pre-existing variant test now pins the frozen six-entry curated map (declared once, keyed by project name, driven off the real `top6` data set), the six-distinct assertion with a collision-naming failure message, determinism + membership in the six dispatchable variant names, and the preserved djb2 hash fallback for an uncurated name. One new test reads `projects-stack-stage.tsx` at test time and asserts a `GenerativeVisual` renderer case exists for every variant the module can return.
- `src/components/explore/projects-card-state.ts` (+50/-9): `FIXED_VARIANTS` (two flagships) became `CURATED_VARIANTS` (all six top-6 projects, data order). `projectVisualVariant` precedence is now explicit: `fixed` curated lookup, then the curated table, then `HASH_VARIANTS[djb2(projectName) % 4]`. The `if (projectName === 'DeepIndex')` / `if (projectName === 'Clarif-AI')` branches are gone. `HASH_VARIANTS`, `cardState`, `LEVELS`, `firstSentence`, `projectYear`, `projectTechnologies`, `swipeAccepts` and the thresholds are unchanged.

## RED / GREEN evidence

- RED (committed at `3f730ca`, before any implementation edit): `node --test tests/projects-stack.test.mjs` → 21 pass / **1 fail**, `AssertionError: REV-19 requires 6 distinct generative visuals, got 5 of 6 - COLLISION: ServicedMetricsCalculator + Uom Track -> 'network'`.
- Independent RED reproduction against the committed pre-fix module (`git show HEAD:src/components/explore/projects-card-state.ts` into a scratch tree): variants `terminal-mock, contract-analysis, report, network, glyph, network` → distinct 5 of 6, exit 1.
- GREEN after the fix: `node --test tests/projects-stack.test.mjs` → **22/22 pass**.

## Commits

1. `3f730ca` `test(10-04): pin six distinct generative variants`
2. `87e69da` `fix(10-04): curated variant table primary, name-hash fallback`

## Verification

Run in the plan's order against the final workspace state (last run chronologically after the fix commit):

- `node --test tests/projects-stack.test.mjs` → 22 pass, 0 fail, 0 skip (exit 0).
- `npm run typecheck` → exit 0, clean.
- `npm run build` → exit 0; `/`, `/explore`, `/resume` exported statically (plus `/_not-found`).
- `node --test tests/*.test.mjs` → **268 pass, 0 fail, 0 skip** (exit 0) — the pre-gap baseline of 267 plus the one new dispatch-coverage test.
- Post-build spot check on the static export: `grep -o "query_context" out/explore.html` matches (the DeepIndex terminal mock still renders for the SSR foreground card) and all six project names appear in `out/explore.html`.
- `tddAuditGate` (imported from the GSD bundle, real subjects in chronological order) → `{"status":"pass","findings":[]}`.

### Pre-build environment check (plan-required)

`ss -ltnp` showed a listener on `:3000`, but it is **not** a Next.js dev server: pid 23130 is `node .../node_modules/.bin/serve ./out` (parent `sh -c serve ./out`), i.e. the repo's static `serve` script over the exported `out/` directory. The `nextjs-dev-build-conflict` skill's `.next`-manifest conflict needs `next dev` on the same worktree, which is absent (`npm run dev` uses port 9002), so the build was run without stopping the user's static server. Consequence: `serve` reads `out/` from disk, so it picks up the rebuilt export; a request that lands during the export window may briefly see a partially written file. No concurrent sibling build ran — plans 05 (wave 2, sequenced after this one) and 06 (wave 3) were not executing, and `git status` showed only untracked non-source artefacts.

## Commit-scope deviation from the spawn prompt

The orchestrator's spawn line asked for scope `(EXPLORE-10-projects-stack-revision-04)`; the commits were emitted with the zero-padded pair scope `(10-04)`. This is deliberate and evidence-backed, not an oversight:

- `gates.js:planScope` builds `${String(plan.phase).padStart(2,'0')}-${String(plan.plan).padStart(2,'0')}` = `10-04`, and `tddAuditGate` filters subjects with `new RegExp('\(10-04\)')`.
- Measured: `new RegExp('\\(10-04\\)').test('fix(EXPLORE-10-projects-stack-revision-04): x')` → `false`. A full-plan-id subject matches nothing, so the ship gate would report `missing test: commit before feat:/fix:` and `gsd_ship` would block — exactly the state plan-01's commits are in.
- With the `(10-04)` subjects the gate returns `status: pass` (verified above, using the real commit subjects).

The plan's `<residual_notes>` block prescribes this scope verbatim and explains the failure mode; that instruction was followed over the generic spawn-prompt parenthesis.

## Known Stubs

None. `grep -nE "TODO|FIXME|XXX|placeholder|HACK"` is empty on both changed files, and `grep -nE "\.skip|\.todo|describe\.only|test\.only"` is empty on the test file (0 skipped tests, confirmed by the runner's own counters).

## Threat Flags

None. The changed production module is a pure, zero-runtime-import function table with no DOM, network, filesystem, secret or user-input surface; the only new I/O is a test-side `readFileSync` of a repository source file.

## Deferred / not claimed

- The 75-85% visual-area proportion and the swipe/shadow feel remain human-verification items (no claim made here).
- UI-SPEC §4.4's variant-label column is reconciled to the shipped identifiers by plan 06; no task in this plan edited the UI-SPEC.
- AP-2 (`projects-mobile-stack.tsx` line count) is deliberately not inflated by this plan.

## Self-Check: PASSED

- `src/components/explore/projects-card-state.ts` exists and is committed at `87e69da` (modified, 344 lines, zero runtime imports).
- `tests/projects-stack.test.mjs` exists and is committed at `3f730ca` (modified, 22 tests).
- Both commits exist in `git log` with the gate-matching `(10-04)` scope; `git status --short src tests` is clean.
- All Task 1 and Task 2 acceptance greps re-measured on the final tree and satisfied (special-case branch 0, `CURATED_VARIANTS` 6, frozen Uom entry 1, hash-fallback line 1, `UI-SPEC §4.4` 2, `anatomy` 3, `case '` 0 in the test / 6 in the stage, retired names outside comments 0, `frontIndex` 5).
- Full gate green on the committed tree: 268/268 tests, typecheck clean, build + static export clean.
