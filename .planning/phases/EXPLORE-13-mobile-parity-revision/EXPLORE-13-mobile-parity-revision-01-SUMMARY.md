---
phase: 13-mobile-parity-revision
plan: 01
subsystem: explore timeline arc / responsive parity / label geometry
tags: [rev-23, tdd, mobile-parity, arc, discrete-step, anchor-budget, static-export]
dependency_graph:
  requires: []
  provides:
    - "the semicircular arc renders, positions its markers and STEPS at every width (experience-section.tsx + use-timeline-progress.ts)"
    - "the <md discrete step as the derivation input (steppedIndexRef) + the scheduleRef re-derivation bridge"
    - "the pure labelAnchorBudget + LABEL_RADIUS_RATIO single source (timeline-geometry.ts)"
    - "the hook's measured anchorBudget surface (TimelineProgress.anchorBudget)"
    - "7 new REV-23 suite rows (tests/explore-visuals.test.mjs) + the §14 anchor-budget row (tests/explore-timeline.test.mjs)"
  affects:
    - "plan 02 (swipe stack) — the same <md parity contract, non-overlapping files; the arc's base 200px box is the precedent for the stage's container-derived height"
    - "plan 03 (platform pack) — carries the Reduce-Motion precondition answer on to the checklist; the arc's measured geometry is what viewport-fit=cover must not disturb"
    - "plan 04 — the phone checklist inherits this plan's three user-verifiable items (375px arc readability, the step's visible result, no horizontal scrollbar at the arc)"
tech-stack:
  added: []
  patterns:
    - "one derivation site per concern: the budget is a pure function beside the predicate it feeds, never inline in JSX"
    - "the carousel index is BRANCHED, not duplicated — continuousIndex(progress) at md+ vs the stepped index at <md feed the SAME markerAngle chain"
    - "layer ownership as the ONLY surviving md gate (the arc gate retires; the layer loop and the per-pass state write stay md-only)"
    - "RED-locality: the new pure export is consumed through the existing dynamic namespace handle, never a static import"
key-files:
  created: []
  modified:
    - src/components/explore/sections/experience-section.tsx
    - src/components/explore/use-timeline-progress.ts
    - src/components/explore/timeline-geometry.ts
    - tests/explore-visuals.test.mjs
    - tests/explore-timeline.test.mjs
decisions: ["D-01 arc renders at every width", "D-06 the <md boundary (sites 3 + 6 deliberately stay md-only)", "D-07 the programmatic half is the repo's half — the phone items hand off to plan 04", "UI-SPEC RESOLVED-D1 (the four pin) + RESOLVED-D2/D5", "OQ-4 (the hook exposes the derived budget, not the raw width)"]
metrics:
  duration: "single session, 2026-10-05"
  completed: 2026-10-05
  tasks: 3
  commits: 5
  actuals: { tasks: 3, commits: 5, suite: "298/298 npm test; explore-sweep 20/20; typecheck 0; next build 0" }
status: complete
---

# Phase 13 Plan 01: mobile-parity-revision — arc parity at every width Summary

The semicircular career arc now renders, positions all five year markers and steps on a 375px phone — the `hidden md:flex` pin, the hook's three `<md` dormancy returns and the zone-width label budget are all retired, the arc's `<md` step became a real derivation input that moves the focal marker, and the date-line predicate is fed the measured anchor budget so no label can paint outside the arc zone.

## Commits (in order)

| # | Subject | Contents |
|---|---|---|
| 1 | `test(13-01): add failing arc-parity, discrete-step and anchor-budget assertions (REV-23)` | 2 test files: the §14 anchor-budget row + 6 new REV-23 rows, plus the renewed md-query messages. The RED on record, committed before any implementation edit. |
| 2 | `test(13-01): refine the goToRole row to the early-return form (REV-23)` | Test-only correction of an over-broad assertion (Deviation D-2) — still before any implementation edit. |
| 3 | `feat(13-01): render and step the arc at every width (REV-23)` | `experience-section.tsx` + `use-timeline-progress.ts`: the gate retirement, the branched carousel index, the md-only layer/state gates, the re-deriving compact branch, the `<md` step with its schedule bridge. |
| 4 | `fix(13-01): feed the label predicate the measured anchor budget (REV-23)` | `timeline-geometry.ts` (`labelAnchorBudget` + the moved `LABEL_RADIUS_RATIO`), the hook's `anchorBudget` plumbing, the component's call site. |
| 5 | `docs(13-01): plan 01 summary — arc parity at every width (REV-23)` | This SUMMARY (the executor's artefact commit). |

## TDD Gate Compliance

**PASSED.** The plan is `type: tdd`; the first scope-matching commit is `test(13-01): …` (`68fd5d1`), the second is also `test:` (`8430eff`), and the first `feat:`/`fix:` commit (`126ee79`) comes after both. No implementation file was touched before the RED was committed and re-run.

## Task 1 — RED on record (verbatim)

`node --test tests/explore-visuals.test.mjs tests/explore-timeline.test.mjs; echo "exit=$?"` → **exit 1**, `ℹ tests 65 / ℹ pass 59 / ℹ fail 6 / ℹ skipped 0`.

```
✖ REV-23 anchor budget: labelAnchorBudget is the px budget the date-line predicate consumes — 375 suppressed, 1440 shown, boundary-sensitive
  TypeError: geometry.labelAnchorBudget is not a function
✖ cross-cutting: motion — never isAnimationActive={true} under explore; matchMedia confined to the interaction hook (OQ-2, EXPLORE-08 rewrite)
  AssertionError: the md query never returns early from derive() — the arc and its markers render at every width (REV-23)
✖ REV-23 arc parity: the <md gate is retired — no hidden md:flex, base arc box + base container mode
  AssertionError: the arc-zone gate `hidden md:flex` is retired — the semicircle renders at every width (REV-23/D-01)
✖ REV-23 hook gate: the marker derivation is width-agnostic, the layer loop is md-only, clearLayerStyles is the <md readable-stack mechanism
  AssertionError: the marker derivation is width-agnostic — the <md dormancy return is retired so markers position at every width (REV-23)
✖ REV-23 discrete step: the derive path cannot stomp the stepped index below md
  AssertionError: the derive path writes the active index ONLY at md+ … expected /if \(mdMedia\.matches && active !== activeIndexRef\.current\) \{/
✖ REV-23 discrete step: the <md carousel index IS the stepped index, the marker loop is not md-gated, and the step re-derives
  AssertionError: the stepped index is hook-scope state (useRef(0)) — the <md carousel-index source
```

Every failure is a missing-behaviour failure: no `SyntaxError`, no `Cannot find module`, and all 59 retained rows stayed green (RED-locality held — the new export is consumed only through `geometry.` / the namespace handle; `grep -c "import { labelAnchorBudget" tests/explore-timeline.test.mjs` prints `0`; `grep -c "await import(\|geometry\." tests/explore-timeline.test.mjs` prints `25`, floor 18).

## Task 2 — GREEN: the arc renders and steps at every width

Nine edits, all in the two listed files, plus the doc-header renewals:

- **component** — base container mode `flex flex-col gap-4 md:grid …` (`gap-4` was inert without it); the arc wrapper drops the gate to `flex flex-col`; the arc zone becomes `relative h-[200px] md:h-auto md:flex-1` (an unprefixed `flex-1` would have stretched the box past the pinned 200px at `<md` and broken the label arithmetic); the control-row and file-header comments renewed. The SVG, dot/label anatomy, marker ladder, `md:hidden` year chip and the layer render's `md:col-start-1 md:row-start-1` are byte-unchanged — site 3 staying put is what keeps all five entries readable at `<md`.
- **hook** — two new hook-scope refs (`steppedIndexRef`, `scheduleRef`); `derive()` loses its dormancy return and the carousel index becomes the branched `mdMedia.matches ? continuousIndex(progress, roleCount) : steppedIndexRef.current`; the layer write loop and the per-pass `setActiveIndex` write become md-only; `onMdChange`'s compact branch re-derives instead of clearing every marker to the arc origin; the mount `else` branch schedules its own first pass (the third §3.1c trigger); `goToRole`'s `<md` branch writes `steppedIndexRef`/`activeIndexRef`, calls `scrollIntoView({ block: 'nearest' })` and re-runs the derivation through the bridge; `handleKeyDown` steps at every width.

Task-2 acceptance, all verified on the tree after this commit:

| Check | Result |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `grep -c 'hidden md:flex'` in the section (raw file) | 0 |
| `grep -c 'h-\[200px\]'` / `flex flex-col gap-4 md:grid` | 1 / 1 |
| `grep -c 'if (!mdMedia.matches) return;'` / `matchMedia('(min-width: 768px)').matches) return` | 0 / 0 |
| `grep -c 'steppedIndexRef'` / unbranched `const c = continuousIndex(progress, roleCount);` | 4 / 0 |
| `grep -c 'scheduleRef.current = schedule'` / `'scheduleRef.current?.()'` | 1 / 1 |
| `grep -c 'dot.style.transform'` / `for (const el of [...dots, ...labels]) {` / `clearLayerStyles` | 1 / 2 / 3 |
| `node --test tests/explore-sweep.test.mjs` | 20/20 (≥4 `visibility:hidden`, 5 dots, 5 labels, the arc path) |
| two renewed suites | 64/65 — only the anchor-budget row red (Task 3's scope, declared in the plan) |

## Task 3 — GREEN: the predicate consumes the measured anchor budget

- `labelAnchorBudget(geometry)` returns `centerX − 0.88·R` (≡ `W/2 − 0.38·R` on a height-limited box) and lives beside `dateLineFits` in the pure module; `LABEL_RADIUS_RATIO` moved there from the hook so the ratio and the predicate share one literal (plain `const` — the module keeps zero runtime imports and stays `node --test` type-strippable).
- The hook imports both instead of declaring the ratio, and exposes `anchorBudget` (interface + state + a write inside `measureGeometry` on **every** measurement, so a URL-bar collapse cannot leave a stale budget).
- The call site feeds `anchorBudget ?? 250` and its comment records that the predicate owns its 16px floor. `dateLineFits` is byte-unchanged (one `- 16`, signature kept); no `overflow-hidden` was added to the arc zone and no `hidden md:block` to the date-line span (UI-SPEC §3.1d Option 1 and §11 both declined).

Verified: `grep -c 'export function labelAnchorBudget'` 1, `'export const LABEL_RADIUS_RATIO = 0.88'` 1, `'const LABEL_RADIUS_RATIO'` in the hook 0, `'anchorBudget ?? 250'` 1, `'dateLineFits(active.entry.duration, arcZoneWidth'` 0, `'export function dateLineFits'` 1, the `- 16` floor count inside its body 1, and the Task-2 contracts survive (`steppedIndexRef` 4, `scheduleRef.current?.()` 1).

## Verification Gate (last chronological action)

Run over the final committed tree, `HEAD = 7bd52c7` (working tree clean apart from the orchestrator's own `.planning/async-jobs.json`):

```
npm run typecheck                                  → exit 0
npm test                                           → exit 0 · ℹ tests 298 / pass 298 / fail 0
npm run build                                      → exit 0 · ● (Static) prerendered as static content
node --test tests/explore-sweep.test.mjs           → exit 0 · ℹ tests 20 / pass 20 / fail 0
```

All 14 suites green (the 298 count includes every suite), the export rows re-read the freshly built `out/`, and all three routes still export statically.

## Deviations

- **D-1 — commit scope is `13-01`, not the plan prose's `phase-13`.** The `tdd_audit` ship gate derives its scope token from the plan's structured fields as `{phase}-{plan}` zero-padded (`@dsh-gsd/bundle/lib/gates.js:125 planScope` → `(13-01)`) and only inspects subjects matching `\(13-01\)`. A `(phase-13)` subject would have been invisible to the gate, which would then report "missing test: commit before feat:/fix:" on a fully compliant plan. Same reasoning for the orchestrator's `EXPLORE-13-mobile-parity-revision-01` suggestion. Repo precedent (`test(10-07)`, `fix(10-07)`) agrees.
- **D-2 — an extra `test:` commit (2 of 4) refining one Task-1 row.** The row-10 assertion banned `(min-width: 768px)` from `goToRole`'s body, which **no** valid implementation can satisfy: the `<md` step is a *branch* on that query (only the early *return* retires — the plan's own Task 2 acceptance bans the literal `matchMedia('(min-width: 768px)').matches) return`). Refined to the early-return form before any implementation edit, so the RED→GREEN ordering is intact and the plan's gate is unaffected.
- **D-3 — one comment reworded to keep a grep honest.** The retirement comment first read "the phase-8 `` `hidden md:flex` `` pin is retired", which made the plan's acceptance grep `grep -c 'hidden md:flex' <section>.tsx` print `1` (a prose hit, not a class). Reworded to "the phase-8 below-md hide pin (`` `hidden` `` + `` `md:flex` ``)" — the retirement is still documented, and the grep now prints `0` against the raw file (the suite row asserts absence in code via `codeOf`, so both hold).
- **D-4 — `arcZoneWidth` is kept, exported and set, with no consuming row.** Plan-directed ("keep `arcZoneWidth` exported and set — it is still the W-4 re-evaluation trigger"), so the hook now sets two measurement-derived state values. Flagged for the verifier: nothing in this repo currently reads `arcZoneWidth` (no suite references it), so the second write is a redundant re-render trigger unless plan 02/03 picks it up. Deleting it would contradict the plan text; it is left as a deliberate carry.

## Pre-execute precondition (OQ-1) — ANSWER NOT OBTAINED

The plan's `<pre_execute_precondition>` asks the user, before wave 1 runs: *"On the phone you test with, is Settings → Accessibility → Motion → Reduce Motion ON?"* (10 seconds).

**Status: not answered.** This executor is a fresh-context subagent with no channel to the user, so the question could not be put. Per the plan's own rule the **DEFAULT (option (a))** therefore applies: **no code change**; REV-23b's parity claim is a **width** contract, and REV-20's reduced-motion contract (which intentionally trades the drag gesture away) is orthogonal and unchanged. Option (b) — amending REV-20 to keep `drag` enabled at every motion preference — was **not** started and requires an explicit user grant.

**Carried to plan 04 Task 2**: ask the question, record the setting's value + the precondition in `EXPLORE-13-MOBILE-CHECKLIST.md`, and read the swipe items as PASS/FAIL only with that value in hand. This plan's arc contract does not depend on the answer — the arc's step is keyboard/button-driven and reads the reduced-motion mode only for `scrollIntoView`/`scrollTo` behaviour (`'auto'` under reduce), which is mode-correct on either answer.

## Real-hardware items handed to the phone checklist (plan 04 — not CI-verifiable)

1. At 375px the arc strip renders above the content: the stroke, all five year markers on the curve, the active role at the focal point, the year labels readable and not overlapping.
2. A Prev/Next tap at `<md` visibly moves the **focal marker** to the stepped-to entry (not merely the counter) and brings that entry into view without yanking the page.
3. No horizontal scrollbar anywhere at the arc, at 375px and at 768px (the retired zone-width call admitted a 19-char date line at 375px).
4. The `<md` step survives a URL-bar collapse (tap, then scroll a little): the arc must not snap back to entry 0.
5. Both themes legible at 375px; the 44px targets hold on the two controls.

## Known Stubs

None. No `TODO`/`FIXME`/`XXX`/placeholder marker and no skipped test exists in any of the five touched files (scanned after the final commit). The one intentionally non-obvious carry is D-4 (`arcZoneWidth`), documented above rather than marked in code.

## Threat Flags

None. The plan adds no `dangerouslySetInnerHTML`, no `eval`, no new inline script, no new remote origin and no new dependency — the diffs are Tailwind classes, one pure function, one `useRef` pair and a `scrollIntoView` call on an element already in the DOM (an inert `data-timeline-layer` hook). The two existing security-sensitive surfaces the arc touches are untouched: the `rel="noopener noreferrer"` link pairs and the four `dangerouslySetInnerHTML` sites (theme init, the lock `<style>`, JSON-LD, GA bootstrap) are byte-identical. `npm run build` emits the same three static routes; the only `out/` delta is the arc's class strings.

## Self-Check: PASSED

| Assertion | Evidence |
|---|---|
| The 5 declared files exist | `experience-section.tsx`, `use-timeline-progress.ts`, `timeline-geometry.ts`, `tests/explore-visuals.test.mjs`, `tests/explore-timeline.test.mjs` — all present |
| The 4 commits exist on the branch | `68fd5d1`, `8430eff`, `126ee79`, `7bd52c7` (`git log --oneline -4`) |
| Diffstat matches the declared file set | `git diff --stat e5dc0d7 7bd52c7` → exactly those 5 files, 477 insertions / 65 deletions |
| Every task's `<files>` list respected | Task 1 touched only the 2 test files; Task 2 only the 2 implementation files; Task 3 only the 3 implementation files (each `git show --stat` verified) |
| Nothing outside the plan's scope was staged | `git status --short` shows only the orchestrator's `.planning/async-jobs.json` untouched by this plan |
| The final gate is green over the final tree | `HEAD=7bd52c7`, working tree clean of source edits, typecheck 0 / 298 of 298 / build 0 / sweep 20 of 20 |

*Phase: 13-mobile-parity-revision · plan 01 · executed 2026-10-05*
