---
phase: 10-projects-stack-revision
plan: 08
subsystem: explore/projects-stack
status: complete
tags: [gap-closure, tdd, traceability, ap-12, rev-18, comments-only, gate-last]
dependency_graph:
  requires:
    - EXPLORE-10-projects-stack-revision-07
  provides:
    - tests/explore-visuals.test.mjs#REV-21-citation-budget-traceability-pin
    - src/components/explore/projects-card-state.ts#phase-10-REV-18-header
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md#gap-closure-resolution-2026-09-30
  affects:
    - src/components/explore/explore-panels.tsx
    - src/components/explore/sections/projects-section.tsx
    - src/components/explore/sections/projects-mobile-stack.tsx
    - tests/projects-stack.test.mjs
    - tests/explore-shell.test.mjs
    - tests/explore-sweep.test.mjs
tech_stack:
  - TypeScript / Next.js 15 static export (no source behaviour touched)
  - React 18 (unchanged)
  - node --test (Node 24 type stripping, direct .ts import)
key_files:
  created: []
  modified:
    - tests/explore-visuals.test.mjs
    - src/components/explore/projects-card-state.ts
    - src/components/explore/explore-panels.tsx
    - src/components/explore/sections/projects-section.tsx
    - src/components/explore/sections/projects-mobile-stack.tsx
    - tests/projects-stack.test.mjs
    - tests/explore-shell.test.mjs
    - tests/explore-sweep.test.mjs
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md
  deleted: []
decisions:
  - "AP-12 closed as a TRACEABILITY correction, not a contract change: each of the 13 phase-10 mis-cites is REPLACED by the id it actually describes (REV-18, or REV-20 where the sentence is about the interaction-quality contract), with no dual citation and no compatibility wording - per the plan's add-alongside: no"
  - "The pin is a self-excluding budget, not a whole-file count: the traceability test slices tests/explore-visuals.test.mjs at its own block marker, so its own literals (the title names phase 11's REV-21 in order to retire it) never enter the corpus it measures; a whole-file count is unsatisfiable (>=10 by construction) and a hand-maintained allowance would stop detecting a reintroduced mis-cite"
  - "The natural-height clause is pinned in BOTH word forms because tests/explore-sweep carries 'natural height' on one line and 'natural-height' on another; the space-only pattern sees only one of them (the plan-checker W-2 blind spot), measured in Node: 1 and 2 pre-edit, 0 and 0 post-edit"
  - "Commit scope is the zero-padded 10-08 that lib/gates.js planScope derives (and that the plan's own <done> lines prescribe), not the spawn prompt's long form; tddAuditGate re-run on the real subjects returns {status: pass}"
  - "Two plan acceptance greps are unsatisfiable as written and are reported with the value actually delivered rather than satisfied by damaging the message text (see Deviations 2)"
  - "Plan 07's ring-step contract, the LEVELS table, the curated variant table, the mount-gated reduced motion and the dual-engine ban are untouched by this plan: it edits comment, header and assertion-message strings plus one new test block"
metrics:
  duration_minutes: 30
  completed_date: "2026-10-02"
  tasks: 3
  commits: 3
actuals:
  tokens: null
  tasks: 3
  commits: 3
---

# Phase 10 Plan 08: REV-21 Citation Reclassification (AP-12 gap closure) Summary

Closed phase-10 VERIFICATION **AP-12** (WARNING): every phase-10 Projects-stack surface cited phase 11's `REV-21` for work that is governed by `REV-18`/`REV-20`. Thirteen mis-cites are reclassified to the id they actually describe — including three the verification report's own list missed — and a red-first traceability test now pins the budget so the mis-cite cannot return.

## What changed

Nine files, three atomic commits, no behaviour, geometry, layout, data or requirement text change.

### `tests/explore-visuals.test.mjs` (1206 lines, was 1092) — the RED commit, then three reclassifications

**Task 1 (RED)** appends ONE test, `traceability: phase-10 projects-stack surfaces cite REV-18/REV-20, never phase-11 REV-21 (VERIFICATION AP-12)`, using the file's existing `read('…')` helper (no new helper, no new import). Six clauses:

1. Zero `REV-21` in each of the four phase-10 SOURCE surfaces (`match(/REV-21/g)` per file, file named in the message) — measured pre-edit 1 / 3 / 1 / 1.
2. At least one `REV-18` in each of those four — measured pre-edit 0 / 0 / 0 / 0.
3. Zero `REV-21` in `tests/projects-stack.test.mjs` — measured pre-edit 1.
4. This file's own budget over its **pre-existing corpus only**: `const TRACE_MARKER = "test('traceability:"`, `const at = ownFile.indexOf(TRACE_MARKER)`, an `assert.ok(at > 0, …)` guard, then `const corpus = ownFile.slice(0, at)` — asserted `(corpus.match(/REV-21/g) || []).length === 4`, with every offending line required to match `/credentials|registry spine|5-section|five panel headers/i` and quoted in the failure message. Measured pre-edit over that slice: **7**.
5. `tests/explore-shell.test.mjs` and `tests/explore-sweep.test.mjs` free of any line naming both a projects-natural-height claim and `REV-21`, via `/REV-21[^\n]*natural[ -]height|natural[ -]height[^\n]*REV-21/i` — measured pre-edit 1 and **2**.
6. The positive half: the file contains `EXPLORE-10 invariant (REV-18)` — false pre-edit.

**Task 2 (GREEN)** rewrites three of this file's lines: the dual-engine rationale comment at `:617`, the EXPLORE-10 invariant TEST TITLE, and the natural-height assertion message. Every assertion predicate is byte-identical; the four phase-11 lines (registry spine, credentials adapter, 5-section grid, five panel headers) are untouched.

### The four source surfaces — header/comment strings only

| file | change | behaviour grep |
|---|---|---|
| `projects-card-state.ts:3` | ring-buffer header → `phase-10 REV-18` | `grep -c "REV-21"` → **0**; `grep -c "^import\|require("` → **0** (module stays runtime-free) |
| `explore-panels.tsx:30,38,115` | three natural-height/placement sentences → `phase-10 REV-18` | every `LAYOUT-01` / credentials statement untouched |
| `projects-section.tsx:2` | panel-body header → `phase-10 REV-18` | — |
| `projects-mobile-stack.tsx:5` | compact-stack header → `phase-10 REV-18` | — |

`git diff HEAD -- src/ | grep -cE "^[-+].*(LEVELS|IMPERFECTION|CURATED_VARIANTS|SWIPE_THRESHOLD|aria-|className|drag=|onClick)"` → **0**: no geometry constant, threshold, layout class or aria attribute appears on a changed line.

### `tests/projects-stack.test.mjs:3` and the two sibling suites

Suite header → `phase-10 REV-18`. `tests/explore-shell.test.mjs:377` and `tests/explore-sweep.test.mjs:57,87` — the three projects-natural-height **assertion messages** only: `(REV-21)` → `(REV-18)`. No predicate, regex or expected value changed; the credentials / chart-5 / tour / counter citations in those files are untouched.

### `…-CONTEXT.md` (250 lines, was 209) — the resolution record

Appends `## Gap-closure resolution (2026-09-30)` after the Contract sweep section: R6 closed by **option R1 (code fix)** rather than option R2 (contract amendment), with the reason quoted verbatim from `.planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md` req 3 and req 7; the delivered ring-step table; the what-did-not-change list; AP-12's measured 36 = 13 + 23 enumeration with the rewritten and untouched lists; the measured plan-text correction; and the still-open items. It restates no figure already in the 2026-09-29 sweep — those are cited.

## Commits

1. `bfbf81d` `test(10-08): pin the phase-10 REV-21 citation budget` — 1 file, +114
2. `8c36b66` `docs(10-08): reclassify the phase-10 projects-stack citations to REV-18` — 8 files, +13 / −13
3. `6a44d2c` `docs(10-08): record the gap-closure resolution (R6 resolved in code, AP-12 reclassified)` — 1 file, +42

`git diff --name-only bfbf81d~1 HEAD` lists exactly the plan's nine `files_modified` entries — no other path touched.

## RED / GREEN evidence

**RED (measured, task 1, committed at `bfbf81d`).** `node --test tests/explore-visuals.test.mjs` → **exit non-zero: 33 tests, 32 pass, 1 fail, 0 skipped**, the single failure being the new traceability test, verbatim:

```
test at tests/explore-visuals.test.mjs:1094:1
✖ traceability: phase-10 projects-stack surfaces cite REV-18/REV-20, never phase-11 REV-21 (VERIFICATION AP-12) (1.004207ms)
  AssertionError [ERR_ASSERTION]: src/components/explore/projects-card-state.ts still cites phase 11's REV-21 — the ring-buffer card-state module is phase-10 REV-18 (AP-12)

  1 !== 0

      at TestContext.<anonymous> (file:///home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/explore-visuals.test.mjs:1113:10)
```

The failure names a real mis-cited file, and it is an assertion about a genuine source defect, not a broken test: the module really did carry the wrong id at that moment.

**GREEN (measured, tasks 2-3).** Per suite, after the reclassification:

| suite | tests | pass | fail | skipped |
|---|---:|---:|---:|---:|
| `tests/explore-visuals.test.mjs` | 33 | **33** | 0 | 0 |
| `tests/projects-stack.test.mjs` | 29 | **29** | 0 | 0 |
| `tests/explore-shell.test.mjs` | 30 | **30** | 0 | 0 |
| `tests/explore-sweep.test.mjs` | 20 | **20** | 0 | 0 |
| **full suite (`tests/*.test.mjs`)** | **293** | **293** | **0** | **0** |

`npm run typecheck` → exit **0**. The 293 total is greater than the plan's 269 baseline and is +1 over plan 07's recorded 292 — the single new traceability test; no pre-existing test was deleted, renamed or skipped (`grep -c "^test(" tests/explore-visuals.test.mjs` → 33; skip markers → 0).

**The clause actually bites (task 2's own probe).** The pre-edit Node measurement of clause 5 was 1 matching line in `explore-shell` and 2 in `explore-sweep`; post-edit it is **0 and 0**, and `grep -cE 'natural[ -]height.*REV-21|REV-21.*natural[ -]height'` is **0 per file**. The plan's own note is confirmed: the space-only pattern `/natural height/` sees only line 57 in `explore-sweep` and never line 87 (the hyphenated one), which is exactly the line the report's enumeration had missed.

**Reclassification measured, before and after.** `grep -rn "REV-21" src/ tests/ | wc -l`: **36** pre-plan → **57** after task 1 (the traceability test's own 21 new tokens, all after the marker) → **44** after task 2 (the 13 rewrites landed). Per file after task 2: the four source surfaces **0** each; `tests/projects-stack.test.mjs` **0**; `tests/explore-visuals.test.mjs` **25** (4 phase-11 lines in the pre-existing corpus + the pin's own 21); `tests/explore-shell.test.mjs` **7**; `tests/explore-sweep.test.mjs` **2**; the phase-11 files unchanged (`constants.ts` 1, `portfolio-data-integrity` 1, `explore-visuals-skills` 3, `explore-tour` 5).

## Requirement / must-have coverage

| must-have truth | pinned by |
|---|---|
| Every phase-10 Projects-stack citation names REV-18/REV-20 | clauses 1-3 and 5 of the traceability test (source surfaces, the stack suite, both sibling suites in both word forms) |
| The correction is executable-pinned, not merely edited | clauses 1-3 are RED on the delivered pre-fix tree and GREEN after; clause 4 fixes the pre-existing corpus budget at exactly the four phase-11 lines |
| Phase 11's REV-21 is untouched | clause 4's allowlist `/credentials\|registry spine\|5-section\|five panel headers/i` over the sliced corpus; the 23 untouched occurrences are listed in the CONTEXT record |
| The decision record states WHY the gap closed in code, not by amending the contract | `CONTEXT.md` `### R6 - …` with the directive quoted verbatim (req 3, req 7) and AP-13's two stage comments named |
| No live requirement text changed | no line of `ROADMAP.md`, `REQUIREMENTS.md`, `SPEC.md`, `UI-SPEC.md` was touched by any of the three commits |
| Full gate green and chronologically last | `npm run typecheck` 0 → `npm run build` 0 (`✓ Exporting (2/2)`) → `node --test tests/*.test.mjs` 293/293/0/0, run as the final action after this SUMMARY was written |
| Behaviour anchor: the corrected ids name executable behaviour | the same gate run exercises plan 07's ring contract — `tests/projects-stack.test.mjs` 29/29 including `cardState(0, 1, 6, false)` → translateY −190, scale 0.80, opacity 0.30, zIndex 50 and the six-step round trip on either swipe side |

## Deviations

1. **Commit scope.** The spawn prompt asked for `(EXPLORE-10-projects-stack-revision-08)`; the three commits carry the zero-padded `(10-08)`, which is what the plan's own `<done>` lines prescribe and what `planScope` actually derives — `lib/gates.js:124-126` builds `${phase.padStart(2,'0')}-${plan.padStart(2,'0')}` from the stored numeric phase/plan fields (`lib/state.js:772-775`), i.e. `10-08`. Re-run for the record: `tddAuditGate([{phase:'10',plan:'08',type:'tdd',…}], <real subjects>)` → `{"status":"pass","findings":[]}`, and the three `(10-08)` subjects are the only scope matches. The long form would match no derived scope and would make plan 08 a second `tdd_audit` finding on top of plan 01's already-recorded one.
2. **Two task-3 acceptance greps are unsatisfiable as written; both were measured and are reported with the value actually delivered.** The criterion asked `grep -c "natural-height" tests/explore-sweep.test.mjs` and `grep -c "natural height" tests/explore-shell.test.mjs` to return **0**. Both return **1** after the rewrite, and they must: "natural height" IS the claim those messages assert, and task 2's own edit list changes only the `(REV-21)` token to `(REV-18)`. Reaching 0 would require deleting the phrase from the assertion messages — i.e. damaging the very text the plan prescribes — so it was not done. The criterion's falsifiable intent (neither word form may sit on a `REV-21` line) is satisfied and measured two independent ways: the Node clause-5 pattern reports 0 matching lines per file (pre-edit 1 and 2), and `grep -cE 'natural[ -]height.*REV-21|REV-21.*natural[ -]height'` reports 0 per file.
3. **`/explore` is not a route on this branch; the SSR export probe reads `out/index.html`.** The task-3 criterion expected the build to report `/`, `/explore` and `/resume` and the probe to read `out/explore.html`. Measured: the build exports `/`, `/_not-found`, `/cli`, `/resume`, and `out/explore.html` does not exist — the phase-12 route swap promoted the explore landing to `/`, which `tests/route-swap.test.mjs` row 11 pins ("/explore residue clean"). The equivalent SSR evidence was taken from `out/index.html` (183,639 bytes): all six top-6 project names PRESENT, `query_context` PRESENT, inline `<svg>` PRESENT. Plan 07's SUMMARY recorded the same four-route list on this same tree, so this is branch state, not an export regression.
4. **The plan's line numbers are pre-plan-07 and drifted, as the plan itself warns.** All reclassification was done by CONTENT with a re-grep first, per instruction: the measured positions were `explore-panels.tsx:30,38,115` (plan said `30,35,112`), `tests/explore-shell.test.mjs:377` (plan said `:369`), and `tests/explore-visuals.test.mjs:939,957` (plan said `936,950`). One mis-cite position in the plan's table is also short: the `explore-visuals` test title, the natural-height message and the dual-engine comment are three separate sites, all three rewritten.
5. **The plan's `min_lines` for `tests/explore-visuals.test.mjs` is 950 and the file is 1206** — not a deviation, but recorded so the artefact table's numbers are not read as ceilings. All other `min_lines` thresholds are met exactly as delivered: `projects-card-state.ts` 411 ≥ 344, `explore-panels.tsx` 197 ≥ 120, `projects-section.tsx` 47 ≥ 40, `projects-mobile-stack.tsx` 20 ≥ 20 (the accepted AP-2 deviation, unchanged), `tests/projects-stack.test.mjs` 766 ≥ 444, `explore-shell` 516 ≥ 505, `explore-sweep` 449 ≥ 393, `CONTEXT.md` 250 ≥ 187.

## TDD Gate Compliance

`type: tdd`, and the gate's requirement is satisfied on this plan's own terms: the **first** scope-matching commit is `bfbf81d test(10-08): …`, followed by two `docs(10-08):` commits. RED precedes GREEN, and the RED was a real measurement of the defect — 32 pass / 1 fail — taken on the unmodified source surfaces, with `git status --porcelain src/` empty when the RED commit landed.

Reproduced, not restated: `tddAuditGate` from the installed bundle over the real landed subjects returns `{"status":"pass","findings":[]}` for plan 08. The phase-level decision recorded in the CONTEXT Contract sweep — ship phase 10 with `skip_gates: ["tdd_audit"]` because plan-01's already-landed long-form commit scope cannot be matched by the gate — is unaffected by this plan, is not re-litigated here, and makes **no** claim that the phase as a whole satisfies `tdd_audit`. This plan's own two `docs:` commits are not `feat:`/`fix:`, so they neither satisfy nor trip the gate's ordering rule; the `test:` commit comes first regardless.

## Known Stubs

None introduced. `grep -nE "TODO|FIXME|XXX|placeholder|HACK|@ts-ignore"` over the nine changed files returns 3 hits, all **pre-existing and untouched**: `tests/explore-shell.test.mjs:313` and `:317` ("placeholder humor machinery removed", a plan-02 comment and test title), plus the Contract sweep's own sentence at `CONTEXT.md:195` that names the marker vocabulary while explaining why `brokenWindowsGate` cannot false-positive on it. Measured additions by this plan: `git diff bfbf81d~1..HEAD -- src/ tests/ | grep -cE "^\+.*(TODO|FIXME|XXX|placeholder|HACK|@ts-ignore)"` → **0**; the new CONTEXT section → **0**. Skip markers (`test.skip|describe.skip|test.only`) across the nine files → **0**.

## Threat Flags

None. The three commits change comment, header and assertion-message strings plus one pure-tracing test block: no runtime code path, no data file, no dependency (`package.json` dependencies still **39**), no network, filesystem or user-input surface, no new event listener, and no second `framer-motion` import site. `src/components/explore/projects-card-state.ts` remains runtime-free (`grep -c "^import\|require("` → 0). The build and the full suite both ran green over exactly this surface.

## Deferred / not claimed

- **No browser-verified and no visually-measured result is claimed.** The five human-verification items of `EXPLORE-10-projects-stack-revision-VERIFICATION.md` remain open as user-facing checks, discharged only by the recorded batch approval (`c97b0e8`, `status_human: approved`). Every number in this SUMMARY is a shell or test-run measurement.
- Gap **R6** is closed by plan 07's code fix (this plan only records it); AP-2, AP-8, AP-10 and AP-11 stay as they were — accepted deviation or INFO, no override re-opened.
- `VERIFICATION.md` was deliberately not modified (re-verification rewrites it), `STATE.md` was not modified, and no other plan's files or SUMMARYs were touched. The pre-existing modified `.planning/async-jobs.json` runtime artefact and the untracked working-tree files (`.cursor/`, `.serena/`, `.deepindex.db`, `tsconfig.tsbuildinfo`, `PRODUCT.md`, `doublecheck-report.md`, `resume-*.pdf/png`) were not added to any commit.
- Deferred ideas untouched: real screenshots replacing the generative visuals; cards for the other 8 projects; the terminal/command-driven About-skill direction.

## Self-Check: PASSED

- All three commits exist in `git log` with the gate-matching `(10-08)` scope: `bfbf81d` (1 file, +114), `8c36b66` (8 files, +13/−13), `6a44d2c` (1 file, +42). `git diff --name-only bfbf81d~1 HEAD` lists exactly the plan's nine `files_modified` paths.
- `git status --porcelain src/ tests/` is **empty** — every source and test edit is committed.
- Every file exists with the expected line count: `projects-card-state.ts` **411**, `explore-panels.tsx` **197**, `projects-section.tsx` **47**, `projects-mobile-stack.tsx` **20**, `tests/projects-stack.test.mjs` **766**, `tests/explore-visuals.test.mjs` **1206**, `tests/explore-shell.test.mjs` **516**, `tests/explore-sweep.test.mjs` **449**, `CONTEXT.md` **250**.
- The pin is present and self-excluding: `grep -c "^test(.traceability:"` → 1, `grep -c "indexOf(TRACE_MARKER)"` → 1, `grep -c "const corpus = ownFile.slice(0, at)"` → 1, `grep -c "REV-21/g"` → 6, the corpus budget measured at runtime as exactly 4 phase-11 lines.
- The quarantine is intact: `CONTEXT.md` `SUPERSEDED:` line count **32 before and after**, the retired-token probe over CONTEXT.md returns **0** unquarantined lines, and the widened interaction-token probe returns **0** as well.
- RED and GREEN are measured, not remembered, with the verbatim failure output quoted above; the full gate was re-run after this SUMMARY was written and is the chronologically last action of the plan: typecheck exit **0**, build exit **0** with `✓ Exporting (2/2)`, full suite **293 pass / 0 fail / 0 skipped**.
