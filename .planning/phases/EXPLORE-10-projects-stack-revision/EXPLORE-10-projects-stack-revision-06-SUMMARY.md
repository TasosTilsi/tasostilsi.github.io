---
phase: 10-projects-stack-revision
plan: 06
subsystem: explore/projects-stack
status: complete
tags: [gap-closure, contract-reconciliation, quarantine-in-place, ship-gate-decision, docs-only]
dependency_graph:
  requires:
    - EXPLORE-10-projects-stack-revision-04
    - EXPLORE-10-projects-stack-revision-05
  provides:
    - .planning/ROADMAP.md#phase-10-goal-ring-buffer
    - .planning/REQUIREMENTS.md#REV-18-19-20-delivered-contract
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md#Contract-sweep
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md#Gap-closure-amendment
  affects:
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-SPEC.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-RESEARCH.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-01-PLAN.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-02-PLAN.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-03-PLAN.md
tech_stack:
  - Markdown planning records only (no source, no test, no dependency change)
  - grep/sed deterministic contract probes
  - "@dsh-gsd bundle lib/gates.js tddAuditGate (reproduced, not restated)"
key_files:
  created: []
  modified:
    - .planning/ROADMAP.md
    - .planning/REQUIREMENTS.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-SPEC.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-CONTEXT.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-RESEARCH.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-01-PLAN.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-02-PLAN.md
    - .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-03-PLAN.md
  deleted: []
decisions:
  - "Quarantine in place, never delete: every retired-mechanism line keeps its text byte-for-byte and gains the literal SUPERSEDED: token; the no-deletion probe (strip the HEAD line, grep -F for it in the new file) returns no LOST line for any of the nine documents"
  - "The only rewrites are the live requirement/acceptance bullets (ROADMAP phase-10 goal cell, REQ-REV-18/19/20, SPEC Requirements/Boundaries/Constraints/Acceptance) and UI-SPEC §4.4's variant-label column, exactly as the plan scoped"
  - "PRIMARY geometry noun promoted to the delivered ring buffer cardState(cardIndex, frontIndex, count, reducedMotion); the retired scroll-progress formulation survives only as quarantined history (assumption_delta: promote, not add-alongside)"
  - "UI-SPEC §4.4 variant column now carries the shipped identifiers (glyph, report, dashboard, network) with an explicit reconciliation note naming the Uom Track anatomy divergence (dashboard composition, row 5's report-table not implemented)"
  - "AP-2 recorded as an ACCEPTED DEVIATION in CONTEXT (projects-mobile-stack.tsx is a 20-line delegate to the shared swipe stack, test-pinned, deliberately not inflated to min_lines: 130)"
  - "Ship gate decided at planning time and reproduced at execution time: phase 10 ships with skip_gates: [tdd_audit] because plan-01's three landed commits carry the long-form scope the gate cannot match - an accepted, recorded skip of one gate for a pre-existing history defect, NOT a claim that the phase satisfies tdd_audit"
metrics:
  duration_minutes: 55
  completed_date: "2026-09-29"
  tasks: 3
  commits: 3
---

# Phase 10 Plan 06: Contract Reconciliation (gap closure) Summary

Made the written phase-10 contract describe the tree that was actually delivered — the swipe-driven ring-buffer stack — by rewriting only the live requirement/acceptance lines and quarantining every retired-mechanism line in place behind `SUPERSEDED:`, then proved it with a deterministic sweep and closed with the phase's ship-gate decision on record.

## What changed

Docs only: no source file, no test, no dependency, no interaction was touched. Nine planning documents were amended across three commits.

- `.planning/ROADMAP.md`: the phase-10 goal cell rewritten to the delivered contract (`cardState(cardIndex, frontIndex)`, "ring buffer", natural height, curated six distinct visuals, mount-gated reduced motion). No other row or the progress table changed; `grep -c "projects-stack-revision"` = 2 and the phase/progress row count stays 22.
- `.planning/REQUIREMENTS.md`: only REV-18/19/20 (lines 32-34) rewritten to the delivered, falsifiable contract, preserving the `- [x]` state and the IDs. REV-17 (line 31) is byte-identical and remains the file's only pinning-wording line.
- `SPEC.md`: an amendment block under `## Requirements` naming the directive provenance (quick task `2026-09-25-projects-swipe-loop-stack`, commit `b39b12c`); REV-18/19/20 Target/Acceptance restated against the delivered tree (pure `cardState(cardIndex, frontIndex, count, reducedMotion)`, `swipeAccepts`/`SWIPE_THRESHOLD`/`SWIPE_VELOCITY_THRESHOLD`, six distinct curated variants with `djb2` fallback, mount-gated reduced motion); `In scope`, the continuous-derivation constraint and the two sticky/scroll acceptance bullets rewritten; the verbatim 2026-09-24 user brief in the Interview Log kept byte-identical behind a `SUPERSEDED:` prefix.
- `UI-SPEC.md`: §4.4's variant-label column carries the SHIPPED identifiers (`glyph`, `report`, `dashboard`, `network`) and a reconciliation note records that the composition column stays the anatomy record and that Uom Track ships the `dashboard` (KPI/progress) composition rather than §4.4 row 5's drafted report table. Four identical superseded banners sit under the title and at the head of §2, §3 and §6; all 18 retired-contract lines are quarantined in place (table rows inside their last cell, code-block lines via a trailing comment). The design record's composition column, depth table, motion layers and accessibility sections are intentionally left as the drafting record.
- `CONTEXT.md`: a `## Gap-closure amendment (2026-09-29)` section (D-01/D-03/D-05 amended with provenance, D-02/D-04/D-06 re-affirmed, resize remeasurement declared obsolete, AP-2 recorded) plus a `### Contract sweep (2026-09-29)` subsection carrying the seven sweep classes, the acceptance-to-suite mapping, the `VALIDATION.md` tooling note, the open items and the ship-gate decision. All 11 retired lines in the decision blocks above are quarantined in place.
- `RESEARCH.md`: four superseded banners (title, §1.1, §4, §5), 11 lines quarantined, and the two §5 rows that assert retired wiring corrected as LIVE rows — the geometry row now names `cardState(cardIndex, frontIndex, count, reducedMotion)` and the keyboard row now names `aria-label="Projects carousel"` (the shipped stage label).
- `-01-PLAN.md`, `-02-PLAN.md`, `-03-PLAN.md`: the primary noun in each `<assumption_delta_decision>` block promoted to the ring-buffer contract with the old wording on a following `SUPERSEDED:` line; plan-02's retired `data-editorial-wrapper` key_link replaced by the delivered mobile-stack delegation (`pattern: ProjectsSwipeStack`); plan-02's four retired truths replaced in place (8 truths before and after) and its two artifact `provides` strings corrected; plan-03's stale `data-editorial-wrapper` instruction quarantined with the measured fact beside it; a `Gap-closure amendment (2026-09-29)` pointer added to each file.

## Commits

1. `b27b6ef` `docs(10-06): rewrite the live contract chain to the delivered ring buffer` (ROADMAP, REQUIREMENTS, SPEC, UI-SPEC)
2. `899e886` `docs(10-06): amend the decision, research and executed plan records` (CONTEXT, RESEARCH, plans 01/02/03)
3. `7de635b` `docs(10-06): record the contract sweep and the tdd_audit ship-gate decision` (CONTEXT)

## RED / GREEN evidence

This plan is `type: execute` and docs-only, so the falsifiable contract is the plan's own deterministic sweep, not a unit test.

- RED (measured from the committed pre-edit tree, i.e. `git show HEAD:<file>`, before any edit): 69 retired-contract token lines across the nine documents, of which **67 were live/unquarantined** — ROADMAP 1, REQUIREMENTS 2, SPEC 7, UI-SPEC 18, CONTEXT 11, RESEARCH 11, 01-PLAN 2, 02-PLAN 13, 03-PLAN 2. This reproduces the plan's `<red_evidence>` per-file counts exactly.
- GREEN (measured after the third commit, on the final tree): `grep -nE "carouselProgress|carouselPosition|main\.scrollTo|ResizeObserver|useScroll|300vh|sticky" DOC | grep -v "SUPERSEDED:"` → **no output for all nine documents** (REQUIREMENTS.md swept with the narrower four-token set, per its documented REV-17 exception).

Sweep results on the final tree (all measured, recorded verbatim in CONTEXT's `### Contract sweep (2026-09-29)`):

| sweep | measurement |
|---|---|
| 1 retired-token quarantine | 0 unquarantined lines in all nine documents; `SUPERSEDED:` lines: UI-SPEC 22, CONTEXT 24, 02-PLAN 24, RESEARCH 15, 03-PLAN 3, 01-PLAN 2, SPEC 1, ROADMAP 0, REQUIREMENTS 0 |
| 2 primary-noun coverage | `frontIndex\|ring buffer\|ring-buffer` ≥ 1 in all nine (ROADMAP 1, REQUIREMENTS 1, SPEC 9, UI-SPEC 7, CONTEXT 8, RESEARCH 5, 01-PLAN 2, 02-PLAN 6, 03-PLAN 3) |
| 3 contract vs code | `export function cardState` in `projects-card-state.ts` = 1; source signature at `projects-card-state.ts:275-280` is `cardState(cardIndex, frontIndex, count, reducedMotion)` |
| 4 executable-code absence | `grep -rn` for the retired hook/progress noun under `src/components/explore/` filtered to non-comment lines = **0**; the ONE permitted comment is `projects-card-state.ts:12`; `explore-panels.tsx` count = 0 (plan 05); `MAIN_SELECTOR = '.explore-shell > main'` count = 1 |
| 5 cross-file scope | `git diff --name-only HEAD~2 HEAD` = the nine `.planning/` documents only; non-`.planning/` paths = 0 |
| 6 acceptance-to-suite mapping | recorded as a table in the sweep subsection (REV-18 → `tests/projects-stack.test.mjs` + the EXPLORE-10 invariant; REV-19 → the six-distinct/curated-precedence/fallback/dispatch assertions from plan 04; REV-20 → plan 05's AP-3/AP-6 pins + the static-export check) |
| 7 ship gate | reproduced, both directions (below) |

Ship-gate reproduction (`tddAuditGate` imported from `~/.dsh/profiles/web/node_modules/@dsh-gsd/bundle/lib/gates.js`, plans shaped as `listPlans` emits them — `phase: "10"`, `plan: "01"/"04"/"05"`, `type: "tdd"`):

- post-revision, on the real landed subjects → `{"status":"fail","findings":[{"planId":"EXPLORE-10-projects-stack-revision-01","reason":"missing test: commit before feat:/fix:"}]}` — fails on **01 only**.
- pre-revision counter-probe (long-form scope prescribed for 04/05 too) → fails on **01, 04 and 05**.
- Decision recorded: ship phase 10 with `skip_gates: ["tdd_audit"]`, leaving `security` and `broken_windows` enabled. Cause: plan-01's three landed commits carry `test(EXPLORE-10-projects-stack-revision-01)` / `feat(EXPLORE-10-projects-stack-revision-01)`, which match no derived scope, and a landed history cannot be fixed by editing a plan document. Declined alternative: rewording needs a force-push of `origin/phase-11` (`git branch -r --contains e936b20` → `origin/phase-11`) and remote writes here are gated on an explicit per-action user command. This is recorded as an accepted gate skip for a pre-existing defect, not as evidence that the phase satisfies `tdd_audit`.

## Verification

Full gate run on the final tree, in the plan's order (`npm run typecheck` → `npm run build` → `node --test tests/*.test.mjs`):

- `npm run typecheck` → **exit 0**, clean.
- `npm run build` → **exit 0**; static export of `/`, `/_not-found`, `/explore`, `/resume`.
- `node --test tests/*.test.mjs` → **269 pass, 0 fail, 0 skipped** (exit 0).

### Pre-build environment check (plan-required)

`ss -ltnp` shows a listener on `:3000` (pid 23130, `node .../node_modules/.bin/serve ./out`, parent `sh -c serve ./out`) — the repo's static server over the exported `out/`, **not** a Next.js dev server. `ps` shows no `next dev` process and `npm run dev` uses port 9002 (free), so the `nextjs-dev-build-conflict` skill does not apply and the build ran without stopping the user's static server. No sibling plan was executing.

### Ordering (green-gate finality)

The task-3 commit and this SUMMARY were both written **before** the final gate run, so the complete gate (typecheck + build + full suite) is the chronologically last action of the plan and covers the final workspace state. No workspace write follows it.

## Deviations

1. **Commit scope.** The spawn prompt asked for `(EXPLORE-10-projects-stack-revision-06)`; the three commits carry the zero-padded `(10-06)` scope, which is what the plan's own `<ship_gate_decision>` block prescribes ("its `done` field still uses the conventional scope (`docs(10-06): …`) for consistency with `lib/_agents.js:160` (`{phase}-{plan}`)") and what plans 04/05 already used. Measured: `new RegExp('\\(10-06\\)')` matches `docs(10-06): x` → `true`, and `docs(EXPLORE-10-projects-stack-revision-06): x` → `false`.
2. **UI-SPEC §3.2 heading.** The quarantine token sits after the section number (`### 3.2 SUPERSEDED: \`carouselProgress\` derivation`) so the numbered heading survives; every other quarantine is at the line's first content position. The token is present on the line, which is what the sweep checks.
3. **Fenced-block comment style.** Retired tokens inside fenced code blocks are marked with a trailing `# SUPERSEDED: …` rather than the prescribed `// SUPERSEDED: …`, because the blocks are bash and `//` would not be a valid comment; the token text is identical and the commands stay copy-pasteable.
4. **Self-referential measure correction.** The sweep subsection's own marked block adds `SUPERSEDED:` lines to CONTEXT.md, so the recorded CONTEXT row (24) and sweep-2 CONTEXT count (8) were re-measured after the subsection was written rather than left at their pre-subsection values (15 / 3). The table therefore matches a re-run.
5. **`data-editorial-wrapper` scope.** Plan-02's context-reference line naming the attribute was quarantined as well as the instruction lines, because the plan's acceptance grep covers the plain attribute (`grep -n "data-editorial-wrapper" | grep -v "SUPERSEDED:"` → no output).
6. **Task-3 commit subject** is `docs(10-06): record the contract sweep and the tdd_audit ship-gate decision` rather than the `<done>` field's example sentence; scope and type match (`docs(10-06)`, `type: execute`).
7. **Not touched, recorded for clarity:** `.planning/async-jobs.json` was already modified in the working tree before this plan started (runtime artefact); it was not added to any commit. Plan 05's files and all `src/`/`tests/` paths are untouched.

## TDD Gate Compliance

Not applicable to this plan: `type: execute`, so `tddAuditGate` never evaluates it. The plan's three `test:`/`fix:`-prefixed commits are absent by design — this plan writes no code. Its `docs(10-06)` subjects are convention-matching for the phase, and the phase-level `tdd_audit` outcome (fail on plan-01 only; ship with `skip_gates: ["tdd_audit"]`) is reproduced and recorded in `CONTEXT.md` rather than hand-waved. Plans 04 and 05 do satisfy the gate (their `test:` commits precede their `fix:` commits).

## Known Stubs

None. `grep -nE "TODO|FIXME|XXX|placeholder|HACK"` is empty on all nine changed files, and no `.skip`/`.todo`/`.only` marker was introduced (this plan touches no test file).

## Threat Flags

None. The change is documentation-only: no source file, no dependency, no network, filesystem, secret or user-input surface is added. The `SUPERSEDED:` quarantine deliberately preserves historical text rather than deleting it, so no security-relevant wording was dropped from the record. The one gate that is being skipped (`tdd_audit`) is orthogonal to `security` and `broken_windows`, both of which stay enabled and are not weakened by it.

## Deferred / not claimed

- **The five human-verification items remain open** (VERIFICATION.md items 1-5): swipe feel, shadow bloom in both themes, the 75-85% visual-area proportion with the 375px invariant, OS reduced-motion browser parity with a clean console, and the keyboard/screen-reader pass. This plan claims no browser-verified or visually-measured result.
- AP-2 stays an accepted deviation (the delegated mobile stack), and AP-3's browser confirmation remains human item 4.
- Deferred ideas untouched and still unowned: real screenshots replacing the generative visuals, cards for the other 8 projects (CLI-reachable), and the terminal/command-driven About-skill direction.
- `STATE.md` and `VERIFICATION.md` were deliberately not modified (re-verification rewrites the latter); the `-04`/`-05`/`-06` plan files and all `SUMMARY.md` files outside this one were left alone.

## Self-Check: PASSED

- All three commits exist in `git log` with the gate-matching `(10-06)` scope: `b27b6ef` (4 files), `899e886` (5 files), `7de635b` (1 file). `git status --short` shows no modified tracked `.planning/` file other than the pre-existing `async-jobs.json` runtime artefact.
- Every modified file named in this SUMMARY exists and carries the expected amendment: amendment block (`SPEC.md` 1), reconciliation note (`UI-SPEC.md` 1), `Gap-closure amendment (2026-09-29)` (CONTEXT 1, plans 01/02/03 1 each), `### Contract sweep (2026-09-29)` (CONTEXT 1), `skip_gates` (CONTEXT 1), `tdd_audit` (CONTEXT 3), `origin/phase-11` (CONTEXT 1), AP-2 (CONTEXT 1), shipped variant identifiers in UI-SPEC §4.4 rows 241-246 (0 drafted labels, 4 shipped identifiers).
- Sweep 1 is green on the final tree (0 unquarantined retired-token lines in all nine documents) and the no-deletion probe reports no `LOST:` line for any of them.
- Full gate green on the final tree, chronologically last: typecheck exit 0, build exit 0 with `/`, `/explore`, `/resume` exported, 269 tests passing with 0 failures and 0 skips.
