---
phase: 11-credentials-panel-revision
plan: 02
type: execute
wave: 2
subsystem: explore-test-renewal
tags: [explore, credentials, test-renewal, 5-section-contract, stale-test-triage, merge-hold-release]
status: complete
dependency-graph:
  requires:
    - "EXPLORE-11-credentials-panel-revision-01 — the 5-section contract, the typed featured flag, and the 05 Credentials panel this plan renews the suites against"
  provides:
    - "Six stale suites renewed to the 5-section contract (counts AND their titles/messages together)"
    - "The chart-5 credentials accent is now REQUIRED, not forbidden — two contract inversions (drawer digit + panel chip)"
    - "The presenter ledger fixture carries the typed featured flag while deepStrictEqual stays intact"
    - "Release of the plan-01 MERGE HOLD: the repo-wide suite is green as one run"
  affects:
    - "tests/explore-shell.test.mjs, tests/explore-visuals.test.mjs, tests/portfolio-data-integrity.test.mjs, tests/explore-sweep.test.mjs, tests/explore-tour.test.mjs, tests/explore-visuals-skills.test.mjs"
    - "The full `node --test tests/*.test.mjs` gate — 13 files, 267 rows, exit 0"
tech-stack:
  added: []
  patterns:
    - "Stale-test renewal after deliberate contract replacement: widen every count AND the prose that states it in the same edit"
    - "Contract inversion (not deletion) where the replacement makes a previously-forbidden value required"
    - "Export-count renewal against the SCRIPT-STRIPPED static export; SSR-invisible assertions stay source-level"
    - "Ledger-fixture renewal that preserves the assertion's strength (deepStrictEqual untouched)"
key-files:
  created: []
  modified:
    - "tests/explore-shell.test.mjs"
    - "tests/explore-visuals.test.mjs"
    - "tests/portfolio-data-integrity.test.mjs"
    - "tests/explore-sweep.test.mjs"
    - "tests/explore-tour.test.mjs"
    - "tests/explore-visuals-skills.test.mjs"
decisions: [D-01, D-03, D-04, D-05]
metrics:
  duration: "≈7m (RED baseline 22:27 → full-suite gate 22:34 +03:00, 2026-09-29)"
  completed: "2026-09-29"
actuals:
  tasks: 3
  commits: 3
  suites_renewed: 6
  full_suite: "267 passed / 0 failed (13 files)"
---

# Phase 11 Plan 02: Stale-suite renewal to the 5-section contract, and release of the MERGE HOLD

Plan 01 replaced the 4-section world with a 5-section one on purpose; this plan pays the
testing debt that replacement created. Six suites that pinned the retired contract are renewed
to the new one — every count widened *together with the title and message that states it* — the
now-required `chart-5` credentials accent replaces two negative assertions, and the nothing-deleted
presentations ledger gains the typed `featured` flag its own `deepStrictEqual` demands. No
implementation file is touched: this is a test-only plan, and it ends with the full repo-wide suite
green in a single run, which is what lifts the plan-01 MERGE HOLD.

## Commits

| # | Hash | Subject |
|---|---|---|
| 1 | `5b4cce2` | `test(EXPLORE-11-credentials-panel-revision-02): renew shell, export and data-ledger suites to the 5-section contract` |
| 2 | `f7961ac` | `test(EXPLORE-11-credentials-panel-revision-02): renew the section-order sweep and tour suites to the 5-section contract` |
| 3 | `016b20d` | `test(EXPLORE-11-credentials-panel-revision-02): renew the adapter-closure suite to five closures` |

One commit per task, each scoped to that task's declared `<files>` only — never `git add -A`,
never an amend across tasks. The working tree carried no source change after the final gate
(`git status --porcelain` shows only the pre-existing harness artefacts: `.planning/async-jobs.json`
and the untracked `.cursor/ .serena/ .deepindex.db tsconfig.tsbuildinfo doublecheck-report.md`
plus three resume-probe artefacts, all present before this plan started).

## The RED baseline — captured at HEAD `6e8e4d1`, before any edit

Plan 01's SUMMARY named five suites in its "plan-02 handoff" table and six in its prose; the
repo-wide sweep and the red runs confirm **six** are genuinely broken — the UI-SPEC §9 note naming
only two files by name was incomplete, and a green run requires all six. Captured per suite
(`node --test tests/<file>.test.mjs`, failing rows / passing rows):

| Suite | RED (fail/pass) | First raw assertion |
|---|---|---|
| `explore-shell.test.mjs` | 7 / 27 | `!src.includes('text-chart-5')` — the digit the Credentials panel now requires |
| `explore-visuals.test.mjs` | 5 / 29 | `strictEqual: actual 5, expected 4` — the panel index spans |
| `portfolio-data-integrity.test.mjs` | 3 / 22 | `deepStrictEqual` — the `PRE_PRESENTATIONS` fixture lacks `featured` |
| `explore-sweep.test.mjs` | 3 / 19 | `deepEqual: actual [about, skills, experience, projects, credentials], expected [about, skills, experience, projects]` |
| `explore-tour.test.mjs` | 7 / 42 | `welcome.includes('four sections')` — the copy inversion |
| `explore-visuals-skills.test.mjs` | 3 / 9 | `strictEqual: actual 5, expected 4` — the second closure-count copy |

Every failure was an assertion-class failure for absent/retired behaviour — no syntax error, no
crash. These six numbers match plan 01's handoff table (7/5/3/3/7/3 by suite), which is a second,
independent record of the same baseline.

## Task 1 — shell, export, and data-ledger renewal

**`tests/explore-shell.test.mjs`** — title `4 locked sections` → 5 and the membership loop widened
to `about, skills, experience, projects, credentials`; the status-bar counter title `LIVE N/4` → N/5
and its `4/4 celebration accent` comment → 5/5; the drawer title `4 anchor items` → 5 with the
`01…04` comment → `01…05`; **two contract inversions** — `assert.ok(!src.includes('text-chart-5'))`
became a positive requirement for `credentials: 'text-chart-5'`, and
`assert.ok(!src.includes('chart-5'))` became a positive requirement for
`credentials: 'bg-chart-5'` with the accent loop widened `i <= 4` → `i <= 5`; and the export row
`0/4 sections visited` → `0/5 sections visited`. The `!lg:grid-cols-3` and
`!src.includes('ContactSection')` assertions still describe real behaviour and are byte-unchanged.

**`tests/explore-visuals.test.mjs`** — the registry-spine title `four total closures … (plan 04)`
→ `five total closures … (phase-11 REV-21)`, with the credentials adapter assertion added
(`credentials: ({ data }) => <CredentialsSection articles={…} certifications={…} presentations={…} />,`
plus `credentials: 'bg-chart-5'`) and the closure count `4` → `5` under the renewed message; the
export row title `the four panel headers … 01-04` → five / 01-05, `spans.length` `4` → `5`, and the
expected digits array gained `'05'`.

**`tests/portfolio-data-integrity.test.mjs`** — the `PRE_PRESENTATIONS` entry gained
`featured: true`. This is the one renewal that is *not* a 4-section literal: the ledger test at
`tests/portfolio-data-integrity.test.mjs:451` deep-equals the whole presentations collection against
the fixture, and plan 01's deliberate typed addition (D-03 / R-7) added an own key the fixture did
not carry. The fixture now mirrors the contract; **the assertion is untouched** — still a full
`assert.deepStrictEqual(data.presentations, PRE_PRESENTATIONS)` over the whole collection, never
narrowed to a length or `Object.keys` check. A one-line comment records that this is a typed
ADDITION, not the deletion the ledger exists to catch.

Green after the task (`npm run build` first, so export rows measure the real artefact):

```
npm run build                                   → exit 0
node --test tests/explore-shell.test.mjs        → exit 0, 30 passed / 0 failed
node --test tests/explore-visuals.test.mjs      → exit 0, 31 passed / 0 failed
node --test tests/portfolio-data-integrity.test.mjs → exit 0, 23 passed / 0 failed
```

## Task 2 — sweep and tour renewal

**`tests/explore-sweep.test.mjs`** — the parsed `EXPLORE_SECTIONS` id assertion became
`['about', 'skills', 'experience', 'projects', 'credentials']` with the message naming 5 ids and the
credentials panel as the row-3 sibling of the Projects stack. The `md:grid-cols-2`, `md:col-span-2`
count and `md:order-first`-absence checks below it all still describe real behaviour and are intact.

**`tests/explore-tour.test.mjs`** — `EXPLORE_TOUR_ACCENTS` gained `credentials: 'bg-chart-5'` with
its message renewed from "4 sections" to 5; the **copy inversion**: the welcome-body guard now
asserts `includes('five sections')` and `!includes('four sections')`, the two assertions swapped and
the test renamed (UI-SPEC §9 TOUR-01 — the copy must not lie about the panel count); `VALID_IDS`
widened to include `'credentials'`; the counter title `LIVE N/4` → N/5 with its `4/4` comment → 5/5;
the export row `0/4 sections visited` → `0/5 sections visited`. The locked 6-step table
(`welcome → about → experience → skills → projects → finish`, `EXPLORE_TOUR_STEPS.length === 6`) is
byte-unchanged — the guard that the wizard gains **no** Credentials step (D-04/D-05), and it passes.

The `parseVisitedIds` expectations at ~365-373 were re-read rather than edited: their explicit
inputs/outputs are unaffected by the widened valid-id set, and they pass unchanged.

```
npm run build                              → exit 0
node --test tests/explore-sweep.test.mjs   → exit 0, 20 passed / 0 failed
node --test tests/explore-tour.test.mjs    → exit 0, 45 passed / 0 failed
```

## Task 3 — the second closure-count copy, and the full gate

**`tests/explore-visuals-skills.test.mjs`** — the closure-count row at
`tests/explore-visuals-skills.test.mjs:161` is the **second** copy of the registry count (the first
lives in `explore-visuals.test.mjs`); renewing only one would have left the full-suite gate
unsatisfiable. Count `4` → `5` with the message naming five closures, plus the credentials adapter
assertion and an assertion that `explore-panels.tsx` imports `CredentialsSection`. The existing
negative check (the absent contact closure) is not weakened.

## The release gate — full suite on record

Run as the plan's last source-affecting action, over the committed tree:

```
npm run typecheck                → exit 0
npm run build                    → exit 0
  emits out/404.html, out/explore.html (179,489 B), out/index.html (20,645 B),
  out/resume.html (18,690 B), out/resume-export.html — all routes still static
node --test tests/*.test.mjs     → exit 0, 267 passed / 0 failed, 13 test files
```

The 13 files are the 12 pre-existing suites plus plan 01's `tests/credentials-panel.test.mjs`
(19 rows). No suite was skipped and none was weakened to reach green; if any suite outside the six
renewed here had failed, it would have been reported as a gap instead of touched.

## MERGE HOLD released

Plan 01 declared: **"MERGE HOLD — do not merge or hand this branch off as green"**, because the
branch was knowingly red on six suites. That hold lifts here. The condition plan 01 named — its
own full-suite run `npm run build && node --test tests/*.test.mjs` on record — is satisfied above,
and it covers the **final workspace state**: the six renewed suites, plan 01's new acceptance suite,
and the seven suites that were already green. The branch is mergeable on the strength of that run.

## Repo-wide stale-contract sweep (all measured on the final tree)

```
grep -rn "0/4 sections visited"  tests/  → 0
grep -rn "!src.includes('text-chart-5')" tests/ → 0
grep -rn "!src.includes('chart-5')" tests/ → 0
grep -rn "spans.length, 4"       tests/  → 0
grep -rn "exactly four adapter closures" tests/ → 0
grep -rn "four total closures"   tests/  → 0
grep -rn "N/4"                   tests/  → 0
grep -rn "01-04"                 tests/  → 0
grep -rn "four sections"         tests/  → 3  (1 explained below + 2 in credentials-panel.test.mjs)
grep -rn "five sections"         tests/explore-tour.test.mjs → 1
grep -rn "credentials"           tests/explore-tour.test.mjs → 4 (accent map, VALID_IDS, 2 prose)
```

The single remaining `four sections` outside plan 01's suite is the **negative guard itself**
(`tests/explore-tour.test.mjs:190`, `!welcome.includes('four sections')`) — the literal is
unavoidable in the assertion the plan explicitly requires, and its message was reworded so the
retired count is not echoed there. The other two are in `tests/credentials-panel.test.mjs:103,111`,
plan 01's new suite asserting the *absence* of stale copy — a scope boundary this plan does not touch.

## Deviations from the plan

1. **Commit scope** — the dispatch prompt named `(EXPLORE-11-credentials-panel-revision-02)` and
   that exact scope is used. Plan 01 committed the short `(11-01)` because the ship-time `tdd_audit`
   gate regexes `\((11-01)\)` for `type: tdd` plans; plan 02 is `type: execute`, so no gate applies,
   and the long form is what the surrounding tooling actually derives:
   `lib/execute.js:132` emits `(${base}-${zeroPad(plan)})` and `lib/undo.js:335` builds its
   plan-scope regex as `\(phaseBase-PP\)`. Using the long form keeps this plan's commits findable
   by `gsd_undo`.
2. **Two extra prose renewals in `explore-sweep.test.mjs`** beyond the sites the plan named
   literally: the placement-whitelist comment `[Projects full-width]` → `[Projects stack |
   Credentials]` (the row-3 description the plan asked to renew, which lives on the row-1 test's
   comment rather than on the sweep row itself) and the `grid-cols-1` row's message `4 panels stack
   at 375px` → `5 panels`. Both are the renewal-completeness rule in action — prose that states a
   count changes with the count — and neither touches an assertion.
3. **`grep -c "'credentials'" tests/explore-tour.test.mjs` returns 1, not 2.** The task's acceptance
   expected that single grep to demonstrate both the widened `VALID_IDS` and the accent-map entry,
   but the accent map uses a **bare** key (`credentials: 'bg-chart-5'`, `tests/explore-tour.test.mjs:62`)
   while only `VALID_IDS` carries the quoted form
   (`tests/explore-tour.test.mjs:236`). Both are present and asserted by the suite; the grep simply
   cannot see the bare key. Verified directly rather than assumed.
4. **`tests/credentials-panel.test.mjs` deliberately untouched**, per the plan's scope boundary —
   including its two `four sections` occurrences, which are absence assertions, not stale ones.

## Known Stubs

None. No `TODO`/`FIXME`/placeholder/skipped test was introduced. Every renewal either widened a
count, widened an array, added a positive assertion for newly-required behaviour, or renewed a
fixture to the deliberately-changed data contract. `node --test` reports 0 skipped rows across all
13 files.

## Threat Flags

None. This plan edits test files only: no dependency added, no network surface, no new listener, no
production code path changed, no assertion weakened — and the one assertion that could have been
weakened (the presentations ledger `deepStrictEqual`) was explicitly preserved at full strength
while only its fixture was renewed.

## Self-Check: PASSED

- **Created files exist**: none — this plan creates no file, exactly as its frontmatter declares
  (`key-files.created: []`); all six targets were modified in place.
- **Commits exist on `phase-11`**: `5b4cce2`, `f7961ac`, `016b20d` — all three carry the
  `(EXPLORE-11-credentials-panel-revision-02)` scope; one per task, each limited to that task's
  declared files (`git show --stat` per commit).
- **RED on record** before any edit: 7/5/3/3/7/3 failing rows across the six suites.
- **GREEN on record** after: the six renewed suites run 30/31/23/20/45/10 rows passing, 0 failing;
  the full suite runs 267 passed / 0 failed over 13 files, exit 0.
- **Gates**: `npm run typecheck` exit 0, `npm run build` exit 0 with all routes exported statically.
- **Working tree clean** of source/test writes after the recorded gate command.
