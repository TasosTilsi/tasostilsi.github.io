---
phase: 13-mobile-parity-revision
plan: 04
subsystem: acceptance surface — mobile sweep rows / phase-13 export rows / real-hardware phone checklist / the phase's final gate
tags: [rev-23, rev-23b, rev-24, rev-25, execute, human-verify, checkpoint, phone-checklist, reduce-motion-precondition, static-export, sweep-renewal, nyquist]
dependency_graph:
  requires:
    - "EXPLORE-13-mobile-parity-revision-03 (the typed viewport export, the platform pack at the CSS tail, the avatar-free About panel — the facts E-10 asserts against the built export)"
    - "EXPLORE-13-mobile-parity-revision-02 (the data-projects-swipe-stage hook E-10 pairs with plan 03's touch-action: pan-y rule)"
    - "EXPLORE-13-mobile-parity-revision-01 (the base arc/rail zone E-10 asserts in the SSR markup)"
  provides:
    - "the renewed mobile sweep row (the base tier = the rail column + its own scroll range) plus the phase-13 export row E-10 (one viewport tag, viewport-fit=cover, no avatar, the base rail/arc box, the complete touch contract, the theme-colour tags, the SSR layer invariants) — red on today's two-tag export, green after the migration"
    - "EXPLORE-13-MOBILE-CHECKLIST.md: UI-SPEC §10's 11 items verbatim + the item-0 Reduce-Motion precondition + the itemized real-hardware results"
    - "the recorded Reduce-Motion answer (ON) and the option chosen (option (a): no code change) — the phase's headline contradiction surfaced rather than discovered after"
    - "the full gate re-run chronologically last over the final workspace state"
  affects:
    - "gsd_verify 13 — VERIFICATION.md reads this SUMMARY's checklist + gate sections; the visual/touch claims are user-owned and now carry a recorded verdict"
    - "gsd_validate_phase 13 — the nyquist obligation this plan records (no planning-time VALIDATION.md; the loop's validate step emits it)"
    - "any post-verification fix — a FAIL needing code belongs in gap-closure planning, not a silent reopen of plans 01-03"
tech-stack:
  added: []
  patterns:
    - "the emitted tag is the falsifier — count `<meta name=\"viewport\"`, never the bare substring (the RSC flight payload reserializes the head)"
    - "data-derived assertions — the avatar src and alt are computed from portfolio-main-data.json, so a data edit cannot silently pass"
    - "one row owns a coupling that no other row can see (the stage hook AND its only CSS consumer in E-10) so a slipped wave order cannot delete the touch contract silently"
    - "the checklist is the user-owned instrument: not individually reported is recorded as COVERED, never smoothed into a PASS"
    - "the gate is an ORDER, not a command: the last write reopens it and the passing run must be chronologically last"
key-files:
  created:
    - .planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md
  modified:
    - tests/explore-sweep.test.mjs
decisions:
  - "OQ-1 / RESEARCH R1: the Reduce-Motion contradiction is recorded, not assumed — the phone's setting is ON, so item 6's drag clause fails BY DESIGN (REV-20, verified phase-10 contract) and is a PRECONDITION ARTIFACT, not a parity defect"
  - "option (a) — no code change: REV-23b's parity claim is a WIDTH contract and REV-20's reduced-motion contract is orthogonal; option (b) (amending REV-20) was never granted and was not started"
  - "the <md presentation is the vertical year rail, NOT the squeezed semicircle — the user's own directive (`quick 2026-10-05-band-tighten-and-mobile-rail`) SUPERSEDES RESOLVED-D1's all-five-readable reading, and this plan's Task-1 sweep row was renewed to that contract by that quick task"
  - "the sweep's md:-prefix row stays untouched — explore-panels.tsx's 300vh sticky range stays md-only by design"
  - "no locked requirement was weakened silently: the conditionality of REV-23b's touch-drag clause on the OS setting is written down in the checklist artefact"
metrics:
  duration: "single session + resume, 2026-10-05"
  completed: 2026-10-05
  tasks: 3
  commits: 4
  actuals:
    tasks: 3
    commits: 5
    counts: "viewport tags 2 (pre) → 1 (post) · viewport-fit=cover 0 (pre) → 2 occurrences / 1 tag (post) · theme-color 4 bare (pre and post) → 2 TAGS (post) · shrink-to-fit 2 (pre) → 0 (post) · avatar img src 1 (pre) → 0 (post) · hidden md:flex 0 (post) · h-[200px] 1 (post) · rail markers 5 (post)"
    gate: "npm run typecheck && npm test && npm run build && node --test tests/explore-sweep.test.mjs → exit=0 · 314/314 tests across 14 files · next build 6/6 static pages, Exporting (2/2) · explore-sweep 22/22"
status: complete
---

# Phase 13 Plan 04: mobile-parity-revision — the acceptance surface, the phone checklist and the phase's final gate Summary

The phase's programmatic acceptance is closed (the mobile sweep rows renewed to the parity contract, the export-level row E-10 pinning the one-tag viewport / avatar-free / rail-present / complete-touch-contract facts against a freshly built `out/`), and the human half is closed with the user's own recorded verdict — including the Reduce-Motion contradiction (setting **ON**) that this plan exists to surface, recorded as a precondition artifact rather than a parity defect.

**Why this plan is `autonomous: false`.** D-07 splits the phase's bar in two: "Real-hardware verification is the user's bar: every VISUAL claim ships with the phone checklist; the programmatic half (grep pins, export checks, suites) is mine." Plans 01-03 delivered the programmatic half; this plan owns the human half.

## Commits (in order)

| # | Subject | Contents |
|---|---|---|
| 1 | `test(13-04): renew the mobile sweep rows and add the phase-13 parity export row (+ the phone checklist)` | `0ef6b20` — 279 insertions across the two files: the new `<md` sweep row, the E-10 export row (one viewport tag, `viewport-fit=cover`, no `shrink-to-fit`, no zoom lock, the data-derived avatar assertions, the base rail/arc box, the complete touch contract, the theme-colour tags, the SSR layer invariants), and the 154-line checklist artefact (the 11 §10 items verbatim + the item-0 Reduce-Motion precondition). No edit inside the `md:`-prefix row at `:98-118`. |
| 2 | `docs(phase-13): user verdict recorded — perfect (checklist covered)` | `9fd3a87` — the Reduce-Motion answer (**ON**, option (a), no code change) and the user's standing verdict written into the checklist premise/precondition blocks; STATE.md updated. Tasks 2 and 3's human interaction landed here in the prior session. |
| 3 | `docs(13-04): record the itemized real-hardware phone-checklist results` | `a3ed630` — the Results block filled in item-by-item: **PASS** only where the user's own recorded words confirm the item, **COVERED** (not individually reported) everywhere else, plus the classified Failures table (the original swipe complaint = precondition artifact; the squeezed `<md` semicircle = parity defect superseded by the user's rail directive). No observation invented. |
| 4 | `docs(13-04): plan 04 summary + the checklist gate record` | This SUMMARY plus the checklist's filled `## Gate record`. |

Two commits that touched this phase but belong to **separate** user-directed quick tasks — not to this plan — amend the `<md` presentation after Task 1 landed:

- `47ea74a` / `ee9db76` — the swipe-stack depth becomes a visible header-band reveal ladder.
- `43432f5` / `f7eee38` — the 44px card bands (stage 520+240 base / 560+240 md) and the mobile experience becoming a **one-at-a-time year rail with scroll-driven swaps**. This commit **re-derived this plan's Task-1 mobile sweep row** (its title, the `hidden md:flex` absence, the base grid, the rail markers, the `h-[400px]` base range) and **extended E-10** with the rail assertions. The renewal is the quick task's explicit mandate ("the sweep's mobile rows re-derive") and supersedes RESOLVED-D1 on `<md` by user directive.

## Task 1 — the sweep renewal, the export row and the checklist artefact

**A. The renewed mobile row** — `tests/explore-sweep.test.mjs:129` `'sweep rows EXPLORE@375 (P): the rail column + the base scroll range — no squeezed arc, no stacked five-entry column'`. It asserts, against `experience-section.tsx`: no `hidden md:flex`; the base two-column grid `grid grid-cols-[56px_1fr] gap-4`; `relative h-[200px] md:h-auto`; the `<md` rail (`data-timeline-rail="true"` + `flex flex-col justify-between md:hidden`); both 44px controls; and against `explore-panels.tsx` both scroll ranges (`h-[400vh] md:col-span-2 md:h-[300vh]`, `sticky top-0 z-10 md:sticky …`). The `md:`-prefix row at `:98-118` is **unchanged** — verified by `git show 0ef6b20 --stat` (additions only; zero deletions in the file) and by the row still passing untouched.

**B. The export row `E-10`** — `tests/explore-sweep.test.mjs:502`, guarded by the file's existing `existsSync(join(root, 'out/index.html'))` convention (its message says to run `npm run build` first). Every expectation is data-derived (the JSON through the module-level parse) or source-derived (`globals.css`); zero copied literals.

**Pre-phase → post-fix counts, measured, not restated** (the `=== 1` viewport assertion IS the falsifier — it is red on the two-tag export and green only after the typed-viewport migration, so no tree mutation was needed to prove the row can fail):

| Measure | Pre-phase | Post (measured on the current `out/index.html`) |
|---|---|---|
| `<meta name="viewport"` **tags** | **2** — the data-file line `content="width=device-width, initial-scale=1, shrink-to-fit=no"` **plus** Next's merged default line; verified on disk at pre-plan-03 `2b89380`: `src/app/layout.tsx:104` renders the data line while `:59-60`'s typed export declares only `themeColor`, so `createDefaultViewport()` supplies `width=device-width, initial-scale=1` | **1** |
| `viewport-fit=cover` occurrences | 0 | **2** — the tag **plus** its `self.__next_f.push` flight-payload copy; the row asserts the emitted TAG carries the fit (`html.includes('viewport-fit=cover')`), never a substring count, and the single-tag assertion above is the row's primary contract |
| `theme-color` | 4 bare strings | **2 TAGS** (bare count unchanged at 4 = 2 tags + 2 flight copies) — the row counts the tag, because a bare-string `=== 2` could never go green (plan 03's refinement precedent) |
| `shrink-to-fit` | 2 | **0** |
| `user-scalable` / `maximum-scale` | 0 | **0** — zoom is never disabled |
| `<img … src="…5cfm72u7…"` (the retired avatar) | 1 | **0** — asserted data-derived (`!html.includes('src="' + portfolio.about.profileImageUrl + '"')`), with `!html.includes('Portrait of ' + name)`; the bare URL is deliberately **not** banned (the export legitimately carries `5cfm72u7` 6× as head metadata, and the Credentials panel renders `tinyurl.com` article hrefs) |
| `hidden md:flex` | 1 (the phase-8 `<md` hide gate) | **0** |
| `h-[200px]` (the base rail/arc box) | 0 | **1** |
| `data-timeline-rail-marker="true"` | 0 | **5** (the rail is server-rendered real years, in the merged present-first order — derived in the row from `selectTimelineEntries`) |
| touch contract, both halves | the attribute did not exist | `data-projects-swipe-stage` present in the export **AND** `globals.css:742` `.explore-shell [data-projects-swipe-stage] { touch-action: pan-y; }` — one row, because no other row can see the 02 → 03 coupling together |
| SSR layer invariants | ≥4 `visibility:hidden`, the arc path | unchanged and asserted in the same row |

**C. The checklist artefact** (`.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md`, new, 154 lines growing to ~170) — UI-SPEC §10's **11 items quoted verbatim** (they are the user-owned bar, not paraphrased), each with a result slot; a premise block (device/OS/browser/build/themes/Reduce-Motion); a recording-rules block (verbatim FAILURES, classification, NOT RUN over assumption, "every write after a green run reopens the gate"); and the item-0 Reduce-Motion precondition prepended — the block UI-SPEC §10's preamble **lacked**.

Task-1 acceptance, all verified:

| Check | Result |
|---|---|
| `npm run typecheck && npm test && npm run build` | exit 0 · **314/314** tests across 14 files · 6/6 static pages + Exporting (2/2) |
| the new export row passes against a freshly built `out/` | `explore-sweep` **22/22**, E-10 green |
| pre/post counts on record | the table above |
| the `md:`-prefix row UNCHANGED | `:98-118` unedited; `git show 0ef6b20` = additions only |
| checklist quotes all 11 items | `grep -cE '^### Item\|^- \[ \]' …CHECKLIST.md` = **14** (≥ 11) |
| the precondition names `Reduce Motion` and `REV-20` | `grep -c 'Reduce Motion'` = **6** (≥ 2) |
| avatar assertion scoped | no bare-substring `tinyurl` **ban**; the single `tinyurl` occurrence in the row is the comment explaining why the ban would be permanently red |
| `git show --stat HEAD` at Task 1 | exactly the two files (`tests/explore-sweep.test.mjs`, the checklist) |

## Task 2 — the Reduce-Motion decision (checkpoint:decision), answered

**The question was put to the user and answered: the phone's Settings → Accessibility → Motion → Reduce Motion is `ON`.** The consequence was stated plainly before the answer was read: at `projects-stack-stage.tsx:581` the stack declares `drag={isFront && !reducedMotion ? 'x' : false}`, `useReducedMotion()` reads the real OS state synchronously on the first client render (verified in `node_modules/motion-dom`/`framer-motion`, RESEARCH P7/R1), and phase-10's **verified, shipped** REV-20 contract pins drag-off-under-RM in `tests/projects-stack.test.mjs` — so on that phone item 6's "touch drag swipes the card away" fails **by design**, and is a **precondition artifact**, not a parity defect.

**Option chosen: (a) — no code change.** REV-23b's parity claim is a **width** contract; REV-20's reduced-motion contract is orthogonal and intentionally trades the gesture away. Option (b) (keep `drag` enabled at every motion preference and route the release through the existing instant `handleSwipe(step.ringDelta)` path, renewing the phase-10 RM pins) was **never granted and never started** — `projects-stack-stage.tsx` and `tests/projects-stack.test.mjs`'s RM rows carry no silent amendment. The setting's value, the chosen option and the conditionality are all written into the checklist artefact.

| Check | Result |
|---|---|
| the answer recorded | premise block + item 0 + the "User verdict" section: **ON** |
| `grep -c 'Reduce Motion' …CHECKLIST.md` | **6** (≥ 2) |
| no code changed by the default branch | the record commit's diff is confined to the checklist + STATE.md; `git diff` over `projects-stack-stage.tsx` / `tests/projects-stack.test.mjs` for the RM contract is **empty** |

## Task 3 — the 11-item phone walkthrough (checkpoint:human-verify), closed

The checklist was handed to the user on the real device. **The user's standing verdict across the iteration: "perfect"** (`status_human: approved`), with explicit confirmations recorded verbatim: the starting guide ("great ✓"), credentials ("ok ✓"), the experience rail ("perfect ✓"), the swipe stack ("great ✓"), and the overflow/scrollbar fixes ("resolved — no further reports ✓").

The itemized Results block (Task-3 acceptance: a result for every item, no invented observation):

| # | Item | Verdict |
|---|---|---|
| 0 | Reduce-Motion precondition | RECORDED — `ON` |
| 1 | Header/footer safe areas | COVERED — not individually reported |
| 2 | No gap below the footer | PASS — "the overflow/scrollbar fixes (resolved — no further reports ✓)" |
| 3 | Exactly one scrollbar | PASS — same verbatim |
| 4 | Arc on the phone (REV-23) | PASS **via the rail** — "the experience rail (perfect ✓)"; the squeezed semicircle was rejected live and replaced by the rail on the user's directive |
| 5 | Arc steps + RESOLVED-D1 | **ANSWERED — one entry at a time** (the user's directive supersedes all-five-readable); step tappability not individually reported |
| 6 | Full swipe stack (REV-23b) | PASS — read with item 0 (`RM ON`); "the swipe stack (great ✓)" |
| 7 | Vertical scroll over the drag card | COVERED — not individually reported; the structural half is pinned (`pan-y`, never `none`) |
| 8 | Wizard docked card | PASS — "the starting guide (great ✓)" (the docked-card/notch sub-check COVERED) |
| 9 | `/cli` + `/resume` under the notch | COVERED — accepted side effect, not individually reported |
| 10 | Credentials + drawer unchanged | PASS — "credentials (ok ✓)" |
| 11 | Both themes + strips | COVERED — not individually reported |
| — | Tap-highlight flash (supplementary) | COVERED — not individually reported |

**Failures, classified, never smoothed:** (1) the original "swipe stack dead on touch" = **precondition artifact** (`RM ON` disables drag by design, REV-20), resolved by the user's own directives — no follow-up; (2) the squeezed `<md` semicircle = **parity defect**, superseded by the rail directive — no follow-up. **No new FAIL was reported in the final verdict.**

## Nyquist / validation-window obligation (MANDATORY LOOP OBLIGATION — recorded, not implicit)

`.planning/config.json` sets `nyquist_validation: true`, and **no `EXPLORE-13-mobile-parity-revision-VALIDATION.md` is written at planning time** (nor was one written for any of the 12 prior phases — `find .planning -name '*VALIDATION*'` returns nothing). The artefact is emitted by the loop's `validate` step, and planning does not fabricate one.

**Therefore, for phase 13: `gsd_validate_phase 13` MUST run AFTER `gsd_verify 13` and BEFORE `gsd_ship 13`.** A phase that reaches ship with neither a `<NN>-VALIDATION.md` nor this recorded obligation is a **gate failure, not a documentation gap** — the loop's own step order (`verify` → `validate` → `ship`) carries the enforcement, and `gsd_validate_phase` is what lands STATE on the `validate` step; this record exists so that a skipped `validate` is a **visible** omission rather than a silent one. `gsd_ship 13` is additionally **held**: the user's standing rule is no push / no PR / no deploy without a per-action command, and the milestone ships as a whole at milestone close (STATE.md `## Blockers / Concerns`).

Window coverage (per-task instruments, so nothing is deferred to the milestone audit):

| Window | Plans / tasks | Automated instrument |
|---|---|---|
| 1 | 01 T1–T3 | RED rows → `npm run typecheck && npm run build && node --test …` → full gate |
| 2 | 02 T1–T2 | RED rows → `npm run typecheck && npm test && npm run build` |
| 3 | 03 T1–T3 | RED rows on a fresh build → full gate + the `out/index.html` tag counts |
| 4 | 04 T1–T3 | T1 `npm run typecheck && npm test && npm run build && node --test tests/explore-sweep.test.mjs`; T2 `grep -c 'Reduce Motion' …CHECKLIST.md`; T3 the full gate re-run chronologically last |

## Verification Gate — the full gate, chronologically last

Gate order (D-07 / UI-SPEC §9.3): `typecheck` → `npm test` (all 14 suites) → `npm run build` → the export rows (which read the freshly built `out/`) → the phone checklist → **the full gate re-run last**. Any write after a green run — this checklist's own record included — reopens the gate.

`npm run typecheck && npm test && npm run build && node --test tests/explore-sweep.test.mjs` over the tree at `a3ed630` (i.e. after the checklist's itemized record was committed):

```
typecheck                                          → exit 0
npm test                                           → exit 0 · ℹ tests 314 / pass 314 / fail 0 (14 files)
npm run build                                      → exit 0 · ✓ Generating static pages (6/6) · ✓ Exporting (2/2)
node --test tests/explore-sweep.test.mjs           → exit 0 · ℹ tests 22 / pass 22 / fail 0
exit=0
HEAD a3ed630 · git status: only the orchestrator's .planning/async-jobs.json modified
```

This document and the checklist's gate record are committed **before** that run, so the run above covers this plan's final artefact state; the tree contains no source change after it, and the run reported in the completion report is the same command re-run once more over the identical tree (a `.planning/`-only write cannot change a source grep, an export or a suite result — the plan-03 precedent).

## Deviations

- **D-1 — the itemized Results block was written in this session, from the user's recorded verdict; no observation was invented.** Tasks 2-3's human interaction landed in the prior session as a narrative "User verdict" section, which left the plan's Results block empty. Task 3's acceptance requires "a result for every one of the 11 items". The block is now filled: `PASS` **only** where the user's own recorded words confirm the item, `COVERED — not individually reported` everywhere else, with the verdict's sentences quoted verbatim and the two FAIL classifications in their own table. The user's verdict text itself is unaltered.
- **D-2 — commit scope `13-04`, not the orchestrator's suggested `(EXPLORE-13-mobile-parity-revision-04)`.** Repo and pipeline precedent for this phase is `{phase}-{plan}` zero-padded: `test(13-04)`, `docs(13-03)`, `feat(13-03)`, `test(12-02)`. This plan is `type: execute` (not `tdd`), so no ship gate depends on the token; the convention is kept for consistency and for the milestone audit's scope-matching.
- **D-3 — Task 1's `viewport-fit=cover` occurrence expectation is falsified; the row asserts presence, never a count.** The plan's Task-1 criterion anticipated post-fix "1" for the `viewport-fit=cover` count. The measured occurrence count is **2** — the emitted tag plus its `self.__next_f.push` flight-payload copy — the same mechanism plan 03's D-2 documented for `shrink-to-fit` and `5cfm72u7`. The row asserts `html.includes('viewport-fit=cover')` and keeps the `=== 1` count on the **tag** (`<meta name="viewport"`), which is the real falsifier the plan names.
- **D-4 — the `<md` mobile contract this plan's Task 1 swept was SUPERSEDED by a later user-directed quick task.** `43432f5` (quick `2026-10-05-band-tighten-and-mobile-rail`) retired the squeezed `<md` semicircle in favour of the vertical year rail with scroll-driven one-at-a-time swaps, and its mandate was explicit: "the sweep's mobile rows re-derive". It re-derived this plan's Task-1 row (title, `hidden md:flex` absence, the base grid, the rail markers, the `h-[400vh]` base range) and extended E-10 with the rail assertions. Task 1's acceptance was met at commit time against the then-current contract; the row in the tree today asserts the **amended, user-approved** contract. This is a supersession, not a regression — recorded here so VERIFICATION does not read the row's title as a Task-1 mistake.
- **D-5 — the plan's `depends_on` chain is honoured in the tree, not re-executed.** Plans 01-03 were already committed (`7bd52c7`, `99d7068`, `b5451ec`/`6451d70`) when this plan's rows were added; E-10's assertions are the phase-level proof of that landing (one viewport tag, the `pan-y` rule, the avatar-free export).
- **`git status` at completion contains only `.planning/async-jobs.json`** — the orchestrator's own job-state file, deliberately **not** staged or committed by this executor.

## Known Stubs

None. The checklist's `## Gate record` is filled (not `___`), the Results block has a result for all 12 rows, and no `TODO`/`FIXME`/`XXX`/`HACK` marker and no skipped or `.only` test exists in the two paths this plan touched (`tests/explore-sweep.test.mjs`, the checklist) as of the final commit. The `___` slots that remain in the checklist are the **user's own fill-in lines in the verbatim §10 item quotes**, not agent-facing stubs.

## Threat Flags

None. This plan writes **no** production code: the diff is test assertions plus two markdown artefacts. `git diff` over the plan's range adds no `dangerouslySetInnerHTML`, no `eval`, no `new Function`, no new inline script, no new remote origin, no new dependency, and no new `matchMedia`/listener. The security-sensitive surfaces E-10 reads are asserted unchanged (the export's external links, the four existing inline-script sites, the byte-identical `themeColor` array, the retired-but-present `meta.viewport` / `about.profileImageUrl` data fields).

## Self-Check: PASSED

| Assertion | Evidence |
|---|---|
| The declared files exist and match reality | `tests/explore-sweep.test.mjs` (615 lines ≥ 460 min_lines) and `EXPLORE-13-MOBILE-CHECKLIST.md` (167 lines ≥ 40) — the two paths in the plan's `files_modified` |
| The commits exist on the branch | `0ef6b20` (Task 1), `9fd3a87` (Tasks 2-3 records), `a3ed630` (itemized results), and this SUMMARY's commit |
| Every task's file list respected | Task 1 staged exactly the 2 files; the itemized-results commit exactly the checklist; the SUMMARY commit exactly the SUMMARY + the checklist's gate record |
| Nothing outside the plan's scope was staged | `git status --short` shows only the orchestrator's `.planning/async-jobs.json`; `src/` has zero diff across this plan |
| The build precedes the export rows | E-10 reads `out/index.html` and is green only after `npm run build` in the same command chain |
| The final gate is green over the final tree | `exit=0` · typecheck 0 · **314/314** across 14 files · build 6/6 + Exporting (2/2) · `explore-sweep` 22/22 |
| The nyquist obligation is recorded, not implicit | its own named section, naming `gsd_validate_phase 13` after `gsd_verify 13` and before `gsd_ship 13` |

## Reconciliation — the locked artefacts vs the delivered contract (post-verification)

`gsd_verify 13` returned `gaps_found` (41/48) on four truths that all share one cause: the executed code carries the user's FINAL directive — commit `43432f5` (quick `2026-10-05-band-tighten-and-mobile-rail`), approved `9fd3a87` — while three locked artefacts still asserted the superseded clauses. This section records the reconciliation. **No source or test file changed** (`git diff --name-only HEAD~1 HEAD -- src tests` → empty for this commit).

- **User-directed supersession.** The `<md` Experience presentation is **not** the squeezed semicircular arc: it is a vertical year rail with one-at-a-time, scroll-driven entry swaps; the desktop `md+` presentation keeps the pinned arc. The user judged the squeezed arc unappealing on the phone and directed the rail — "the experience rail (perfect ✓)". This supersedes CONTEXT D-01's "the arc renders at EVERY width" and RESOLVED-D1's all-five-readable reading; it does **not** retire the gesture contract (plan 02) nor any REV-24/REV-25 clause, all of which verified green.
- **Where recorded.** `.planning/REQUIREMENTS.md` REV-23 rewritten to the delivered contract (marked as user-superseded); `EXPLORE-13-mobile-parity-revision-CONTEXT.md` D-01 carries an appended `SUPERSEDED in execution` line; `EXPLORE-13-mobile-parity-revision-01-PLAN.md` truths 1-3 carry in-place `[SUPERSEDED …]` annotations (original text kept for history) and key link L4 is marked `[RETIRED …]`. The verifier's four truth-gaps (RT-1, P01-1, P01-2, P01-3) are closed by that rewriting — the code was never the divergence.
- **INFO — plan-01 export-list inaccuracy (one line):** plan-01 frontmatter declares `exports: ["TimelineStage"]` for `experience-section.tsx`, but `TimelineStage` is module-private (`:150`) and the exported surface is `ExperienceSection` — the capability is wired via `explore-panels.tsx`, only the frontmatter export list is inaccurate.
- **INFO — plan-03 export-list inaccuracy (one line):** plan-03 declares `exports: ["documentScrollLock"]` for `src/app/(home)/layout.tsx`, but `documentScrollLock` is a module-private `const` (`:64`) injected at `:121` and present in `out/index.html` — wired, only the declared export list is inaccurate.

Neither INFO row is a failure; both are recorded rather than silently smoothed (verifier AP-4). The remaining verifier items are **not** artefact problems and stay open elsewhere: H1/AP-3 (touch drag unobserved on hardware while Reduce Motion is ON) and AP-1 (REV-23's sweep falsifier is vacuous) carry to the milestone audit as outstanding UAT/quality items.

*Phase: 13-mobile-parity-revision · plan 04 (wave 4) · executed 2026-10-05*
