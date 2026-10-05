---
phase: 13-mobile-parity-revision
plan: 02
subsystem: explore projects panel / swipe-stack parity / static export
tags: [rev-23b, tdd, mobile-parity, swipe-stack, retirement, stale-test-renewal, static-export]
dependency_graph:
  requires:
    - "EXPLORE-13-mobile-parity-revision-01 (the arc's <md parity precedent: one contract, no width variant)"
  provides:
    - "ONE swipe-stack contract at every width (projects-stack-stage.tsx) — no mode prop, no width variant, every depth card visible"
    - "the retired compact wrapper gone with a gone-check (projects-mobile-stack.tsx deleted)"
    - "the two-tier height pair on the same constants: base (the phone) 420/690, md+ 560/830"
    - "the inert data-projects-swipe-stage hook the plan-03 touch-action: pan-y rule targets"
    - "renewed one-contract rows in tests/projects-stack.test.mjs, tests/explore-visuals.test.mjs, tests/explore-visuals-server.test.mjs"
  affects:
    - "plan 03 (platform pack) — ships the ONLY consumer of data-projects-swipe-stage (.explore-shell [data-projects-swipe-stage] { touch-action: pan-y; }); its absence reddens plan 04 Task 1's export row, so a slipped wave cannot silently drop the touch contract"
    - "plan 04 — the phone checklist inherits this plan's four user-verifiable touch/visual items"
tech-stack:
  added: []
  patterns:
    - "one contract at every width: the width-specific VALUE (a two-tier class string) replaces the width-specific CODE PATH (a mode prop + a second render branch)"
    - "retirement discipline: a gone-check (existsSync === false, with the house precedent cited) instead of a silent delete, and the surviving literal feeds the assertion rather than being inlined twice"
    - "the mode ban is literal-specific, never identifier-wide: each asserted literal is a real residual form of the plumbing, so unrelated prose cannot false-positive"
    - "load-bearing comments: the retirement prose in the stage source may not use the banned word at all — the ban measures the file, comments included"
key-files:
  created: []
  modified:
    - src/components/explore/sections/projects-stack-stage.tsx
    - src/components/explore/sections/projects-section.tsx
    - src/components/explore/sections/projects-mobile-stack.tsx (DELETED)
    - tests/projects-stack.test.mjs
    - tests/explore-visuals.test.mjs
    - tests/explore-visuals-server.test.mjs
decisions:
  - "D-02 (CONTEXT): the swipe stack is ONE contract at every width — the compact variant retires, not a kept-alongside default"
  - "UI-SPEC §1.3/§3.2a-b: base tier = the phone (420/690), md: tier = desktop (560/830), both satisfying stage = card + PEEK_BAND_PX + PEEK_SAFE_PX"
  - "UI-SPEC §3.2c: the stage carries the inert hook; touch-action lands in plan 03 (the pack ships atomically)"
  - "no new dependency, no new breakpoint, no device sniffing (SPEC constraints)"
metrics:
  duration: "single session, 2026-10-05"
  completed: 2026-10-05
  tasks: 2
  commits: 3
  actuals: { tasks: 2, commits: 3, red: "7 failures / 80 rows (the three renewed suites)", suite: "301/301 npm test; explore-sweep 20/20; typecheck 0; next build 0" }
status: complete
---

# Phase 13 Plan 02: mobile-parity-revision — one swipe-stack contract at every width Summary

The Projects carousel is now a single every-width contract: the 20-line compact wrapper and the entire mode plumbing are gone, the phone renders the same full-depth stack as the desktop (every depth card visible, centred, shadowed, draggable) at 420/690px base heights, and the stage carries the inert `data-projects-swipe-stage` hook that plan 03's `touch-action: pan-y` rule will target.

## Commits (in order)

| # | Subject | Contents |
|---|---|---|
| 1 | `test(13-02): retire the compact-mode pins and add the one-contract stack rows (REV-23b)` | `34316b0` — 3 test files: the positional height reader replacing `heightMap`, the two-tier arithmetic row, the literal-specific mode ban, the gone-check row, the one-render section rows, the stage-hook + no-`touch-action: none` row, and the traced REV-23b citation beside the retained REV-18 clause. The RED on record, committed before any implementation edit. |
| 2 | `feat(13-02): one swipe-stack contract at every width (REV-23b)` | `99d7068` — the wrapper deleted; `projects-section.tsx` renders one unconditional stack; `projects-stack-stage.tsx` loses `SwipeMode`, both Record constants, every `compact` branch, the `mode` props and the 320px cap, and gains the two-tier class pair + the hook attribute. |
| 3 | `docs(13-02): plan 02 summary — one swipe-stack contract at every width (REV-23b)` | This SUMMARY (the executor's artefact commit). |

## TDD Gate Compliance

**PASSED.** The plan is `type: tdd`; the first scope-matching commit is `test(13-02): …` (`34316b0`), and the first `feat:`/`fix:` commit (`99d7068`) comes after it. No implementation file was touched before the RED was committed and re-run — the RED run below is the `HEAD = 34316b0` tree.

## Task 1 — RED on record (verbatim)

`node --test tests/projects-stack.test.mjs tests/explore-visuals.test.mjs tests/explore-visuals-server.test.mjs; echo "exit=$?"` → **exit 1**:

```
✖ projects-section: ProjectStatTiles composed BEFORE the one stack render with an mb-3 wrapper
✖ EXPLORE-10 invariant (REV-18): projects stack is swipe-driven, centered, loopable and shadowed
✖ REV-23b retirement: the compact mobile-stack wrapper is gone (gone-check)
✖ REV-23b swipe-stage contract: the stage carries the stable hook and no touch-action: none exists in the shell CSS
✖ traceability: phase-10 projects-stack surfaces cite REV-18/REV-20, never phase-11 REV-21 (VERIFICATION AP-12)
✖ stage containment: the fixed stage height IS the arithmetic card + peek band + safe margin
✖ REV-23b: the mode plumbing is retired — no SwipeMode, no compact branch, no compact width cap
ℹ tests 80 / ℹ pass 73 / ℹ fail 7 / ℹ skipped 0
```

The seven assertion messages, verbatim:

```
AssertionError [ERR_ASSERTION]: exactly ONE stack render at every width — the two viewport branches collapse to one (REV-23b/D-02)
AssertionError [ERR_ASSERTION]: the compact mobile wrapper retires with the parity contract (REV-23b)
AssertionError [ERR_ASSERTION]: projects-mobile-stack.tsx retired with the parity contract (REV-23b)
AssertionError [ERR_ASSERTION]: the stage box carries the stable data-projects-swipe-stage hook — the selector target for touch-action: pan-y (REV-23b)
AssertionError [ERR_ASSERTION]: src/components/explore/sections/projects-section.tsx cites no phase-13 requirement id — the renewal must ADD REV-23b beside the retained REV-18 clause
AssertionError [ERR_ASSERTION]: CARD_HEIGHT_CLASS: the single class-string height constant is present — the mode-keyed Record is retired (REV-23b)
AssertionError [ERR_ASSERTION]: SwipeMode absent: the SwipeMode union and its Record<>/prop annotations are retired — one contract, no mode key
```

Every failure is a missing-behaviour failure: no `SyntaxError`, no `Cannot find module`, no unguarded `ENOENT`, and all 73 retained rows stayed green (RED-locality held — the retired wrapper's path is now read by nothing: `grep -c "read('.*projects-mobile-stack"` prints **0** for both suites, and `grep -c 'projects-mobile-stack'` prints **2** in `explore-visuals.test.mjs` — the retained `const mobilePath` feeding the gone-check plus its own message — and **0** in `explore-visuals-server.test.mjs`).

## Task 2 — GREEN: the wrapper and the mode plumbing are gone

- **`projects-mobile-stack.tsx`** — deleted (`git rm`, 20 lines). Its only content was `mode="compact"`.
- **`projects-section.tsx`** — the wrapper import and both viewport branches (`hidden md:block` / `md:hidden` with their comments) are replaced by ONE unconditional `<ProjectsStackStage projects={cards} />`; the header doc comment states the one-contract fact and cites **REV-23b** while the existing **REV-18** citation is retained (the phase-10 traceability clause is never substituted). `ProjectStatTiles` (+ its `mb-3` wrapper) and `<TerminalPointer command="projects --all" />` are unchanged and in place.
- **`projects-stack-stage.tsx`** — `type SwipeMode` gone; the two `Record<SwipeMode, string>` constants collapse to one class string each (`CARD_HEIGHT_CLASS = 'h-[420px] md:h-[560px]'`, `STAGE_HEIGHT_CLASS = 'h-[690px] md:h-[830px]'` — the old `full` tier's unreachable 520/790 pair retires with it); `SwipeCardProps.mode` / `ProjectsSwipeStackProps.mode` / the `mode={mode}` pass / `ProjectsSwipeStack({ projects, mode })` / `ProjectsStackStage(… mode="full")` all deleted; the four `compactHidden` computations, their `opacity` uses and the `mode` dependency-array entry all deleted; `widthClass` is the single `max-w-[540px]`; the stage box gains `data-projects-swipe-stage="true"` and nothing else (no `touch-action` utility, no negative margin, no inset); the header/prose is renewed to the one-contract fact. Left byte-unchanged: the drag choreography, the ring buffer, `PROMOTE_TRANSITION`, `EXIT_X`/`EXIT_ROTATION`, the 500ms announcement throttle, `aria-live`, `role="group"`, `aria-label="Projects carousel"`, the bottom-anchored card box, per-card `aria-hidden`/`pointer-events-none` on non-front cards, the bloom (`--panel-shadow-hover`) + `overflow-visible` on the front card, and both 44px controls.

Task-2 acceptance, all verified on the tree after commit `99d7068`:

| Check | Result |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm test` | exit 0 · **301/301** (all 14 suites) |
| `npm run build` | exit 0 · 6/6 static pages, 2/2 exported |
| `test -f …/projects-mobile-stack.tsx` | exit 1 (gone) |
| `grep -rc 'ProjectsMobileStack\|projects-mobile-stack' src/` | 0 for every file |
| `grep -c '<ProjectsStackStage'` in the section | 1 |
| `grep -c 'hidden md:block\|md:hidden'` in the section | 0 |
| `grep -c 'SwipeMode\|compactHidden\|max-w-\[320px\]'` in the stage | 0 |
| `grep -c 'h-\[690px\] md:h-\[830px\]'` / `'h-\[420px\] md:h-\[560px\]'` | 1 / 1 |
| `grep -c '\${widthClass} \${stageHeightClass} overflow-hidden'` | 1 |
| `grep -c 'data-projects-swipe-stage'` (source / `out/index.html`) | 2 (attribute + doc prose) / 1 |
| `out/index.html`: `h-[520px]`/`h-[790px]` / `max-w-[320px]` | 0 / 0 |
| `out/index.html` stage box | `relative mx-auto w-full max-w-[540px] h-[690px] md:h-[830px] overflow-hidden` |
| `node --test tests/explore-sweep.test.mjs` | 20/20 |

## Verification Gate (last chronological action)

Gate order per UI-SPEC §9.3 / D-07 — the build precedes the `out/` rows:

```
npm run typecheck                                  → exit 0
npm test                                           → exit 0 · ℹ tests 301 / pass 301 / fail 0
npm run build                                      → exit 0 · ● (Static) prerendered; ✓ Exporting (2/2)
node --test tests/explore-sweep.test.mjs           → exit 0 · ℹ tests 20 / pass 20 / fail 0
```

Run over the final committed tree; the `out/` rows re-read the freshly built export. Re-run after this SUMMARY's commit as the plan's literal last action (a `.planning/`-only write cannot change a source-grep or export result) — see the completion report for the final HEAD.

## Deviations

- **D-1 — commit scope is `13-02`, not the orchestrator's suggested `(EXPLORE-13-mobile-parity-revision-02)` nor the plan prose's `(phase-13)`.** The `tdd_audit` ship gate derives its scope token from the plan's structured fields as `{phase}-{plan}` zero-padded (`@dsh-gsd/bundle/lib/gates.js: planScope` → `(13-02)`) and only inspects subjects matching `\(13-02\)`; either suggested form would have been invisible to the gate, which would then report "missing test: commit before feat:/fix:" on a fully compliant plan. Repo precedent (`test(13-01)`, `test(10-07)`, `fix(10-07)`) agrees.
- **D-2 — the gone-check was split into its own test row.** The plan places it at the end of the `EXPLORE-10 invariant (REV-18)` row, but that row's earlier one-contract assertions throw first on the current tree, so the gone-check never executed and the RED output lacked the failure the acceptance criteria explicitly require. Splitting it into `REV-23b retirement: the compact mobile-stack wrapper is gone (gone-check)` makes it redden independently (confirmed: it is one of the seven RED rows) while keeping the `const mobilePath` + the `projects-mobile-stack.tsx retired` message the criteria pin.
- **D-3 — the retirement prose cannot use the banned word.** The `compact` literal is in the ban list, and the ban measures the raw file *including comments*, so every occurrence of the word had to leave the stage source — including the doc comments that used to explain the retired variant. The prose now reads "the retired <md wrapper (a 320px width cap that hid every card deeper than depth 1)" and "the former width-variant split"; the historical name survives in CONTEXT/UI-SPEC/research, and the retirement is still documented where a reader needs it. This is the ban working as specified, not a lost record.
- **D-4 — `depth` is retained AND consumed, by a 1-line change to the visibility expression.** The compact cap was `depth`'s only consumer. Leaving `const depth = useMemo(() => ringDepth(...))` unreferenced would be a dead local; deleting it and the `ringDepth` import would have reddened an existing, un-renewed pin (`tests/explore-visuals.test.mjs`: `stack.includes('ringDepth(') && stack.includes('advanceFront(')`, "the stage consumes the pure ring step and depth instead of re-deriving them"). Resolution: `const visibility = depth === 0 || state.visible ? 'visible' : 'hidden';` — the foreground card is never hidden (a transient animation state cannot blank it) and every other card follows the pure `cardState()` derivation alone. Behaviour-identical (`ringDepth(...) === 0 ⇔ index === frontIndex` for in-range indices) and it makes the surviving depth contract explicit. **Flagged for the verifier:** this is the one line in the plan's "leave byte-identical" neighbourhood that changed; the named items of that list (per-card `aria-hidden`, `pointer-events-none`, the bloom, the 44px controls, the drag choreography) are untouched.
- **D-5 — `depth` dropped from the promotion effect's dependency array.** It was listed only because the retired `hidden` branch read it; the effect body no longer does, so the array is `[frontIndex, reducedMotion, count, isExiting, isDragging, isFront, controls, index]`. No lint/typecheck signal (no ESLint config in this repo), and the array now matches the body.
- **`explore-panels.tsx` deliberately untouched**, as the plan requires: the Projects placement map is pinned by `tests/projects-stack.test.mjs:549-560` and the `md:`-prefix sweep row stays green because its `h-[300vh]`/sticky range is `md:`-scoped already.

## Handed to the phone checklist (plan 04 — not CI-verifiable)

1. A touch drag on the phone actually swipes the foreground card away (the reported "swipe stack dead on touch" symptom).
2. The behind-cards peek visibly at every depth — no card is suppressed (the retired `depth > 1` cap).
3. The depth shading and the foreground bloom render on the phone.
4. Vertical page scroll still works on a gesture that starts on the card (the reason `touch-action: none` is banned and `pan-y` is the pinned form).
5. **Reduce-Motion precondition (carried from plan 01):** with the OS Reduce Motion ON, the drag gesture is off by design (the phase-10 REV-20 contract). The swipe items are PASS/FAIL only with that setting's value in hand, recorded by plan 04 Task 2.

## Declared temporal coupling (plan → plan 03)

This plan adds the inert `data-projects-swipe-stage` attribute and asserts only the ABSENCE of `touch-action: none`. Plan 03 ships its only consumer (`.explore-shell [data-projects-swipe-stage] { touch-action: pan-y; }` in the platform pack's `globals.css` tail), and plan 04 Task 1's export row asserts BOTH halves in the final tree (the attribute present in `out/index.html` AND the `pan-y` rule present in `globals.css`) — so a dropped plan 03 cannot silently delete the touch contract with no failing test.

## Known Stubs

None. No `TODO`/`FIXME`/`XXX` marker and no skipped test exists in any of the six touched paths (scanned after commit `99d7068`). The two `placeholder` matches are pre-existing, untouched rows in `tests/explore-visuals-server.test.mjs` (`E-9 em-dash placeholder` — the stat tiles' "no date parses" grid placeholder), not stubs left by this plan.

## Threat Flags

None. The diffs are Tailwind classes, deletions, one inert `data-*` attribute and JSX restructuring inside one existing client component. No `dangerouslySetInnerHTML`, no `eval`, no new inline script, no new remote origin and no new dependency (`framer-motion` was already the file's single sanctioned import site). The security-sensitive surfaces the stack touches are byte-identical: the `rel="noopener noreferrer"` + `target="_blank"` pair on every external card link (asserted present in the stage source by the renewed server row) and the four existing `dangerouslySetInnerHTML` sites elsewhere in the tree. `npm run build` emits the same three static routes; the `out/` delta is the stage's class strings plus the new hook attribute.

## Self-Check: PASSED

| Assertion | Evidence |
|---|---|
| The 6 declared paths match reality | 2 modified source files + 1 deletion + 3 modified test files; `git show --stat 99d7068` lists exactly the 3 implementation paths and `34316b0` exactly the 3 test paths |
| The 3 commits exist on the branch | `34316b0`, `99d7068`, and this SUMMARY's commit (`git log --oneline -3`) |
| Every task's `<files>` list respected | Task 1 staged only the 3 test files; Task 2 only the 2 edits + 1 `git rm` |
| Nothing outside the plan's scope was staged | `git status --short` shows only the orchestrator's `.planning/async-jobs.json`, untouched by this plan |
| The final gate is green over the final tree | typecheck 0 · 301/301 · build 0 · sweep 20/20, working tree clean of source edits |

*Phase: 13-mobile-parity-revision · plan 02 · executed 2026-10-05*
