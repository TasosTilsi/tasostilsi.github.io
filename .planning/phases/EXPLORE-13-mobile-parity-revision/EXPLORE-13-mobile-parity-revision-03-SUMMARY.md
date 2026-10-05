---
phase: 13-mobile-parity-revision
plan: 03
subsystem: document viewport / landing scroll lock / platform CSS pack / About panel / static export
tags: [rev-24, rev-25, tdd, mobile-native, viewport-fit, safe-areas, dvh, avatar-removal, static-export]
dependency_graph:
  requires:
    - "EXPLORE-13-mobile-parity-revision-02 (the inert data-projects-swipe-stage hook this pack's touch-action: pan-y rule targets)"
  provides:
    - "ONE viewport declaration per document: the typed Next viewport export (width/initialScale/viewportFit=cover + the byte-identical themeColor array)"
    - "the landing's height reconciliation (height: 100% + height: 100dvh + overflow: hidden) — document height = body height = shell h-dvh"
    - "the route-scoped mobile-native platform pack at the globals.css tail (tap-highlight, overscroll, touch-action, safe-area bands with height compensation)"
    - "an avatar-free About panel with the summary's mt-3 reflow compensation"
    - "the retired data fields left byte-identical and unconsumed: meta.viewport and about.profileImageUrl"
  affects:
    - "plan 04 — the phone checklist owns every visual/touch claim here (the gap-after-footer, the single scrollbar, the notch/home-indicator bands, the tap flash, vertical scroll over the drag stage, and item 9: content under the notch on /cli + /resume, the accepted root-level side effect)"
    - "any future /cli or /resume route work — the root-level viewport export now lands viewport-fit=cover on both, and their files stay byte-identical by scope"
tech-stack:
  added: []
  patterns:
    - "one declaration path per concern: the framework's typed viewport export replaces the data-file meta line, and the data field survives unconsumed rather than being deleted"
    - "placement is a contract: the platform pack is appended AFTER the reduced-motion guard because the motion-region row scopes every opening-brace line in that span under .explore-shell, and the safe-area block needs a bare @media (min-width: 640px) line"
    - "index-based placement assertion (indexOf(pack marker) > indexOf(guard)) instead of a visual check"
    - "derived-not-restated coupling: the safe-area band literals are derived from the two component sources in the test, so the duplication is self-checking"
    - "the emitted tag is the falsifier, never a substring count — the static export also serializes the head into the RSC flight payload"
    - "banned-word prose: comments are load-bearing in this repo's greps, so the removal note cannot use the words the removal test bans"
key-files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/app/(home)/layout.tsx
    - src/app/globals.css
    - src/components/explore/sections/about-section.tsx
    - tests/route-swap.test.mjs
    - tests/explore-visuals.test.mjs
decisions:
  - "D-05 (CONTEXT): the typed viewport export gains viewportFit: 'cover' and re-declares width/initialScale; the data-file meta line retires; meta.viewport stays in the JSON unconsumed"
  - "D-06 (CONTEXT): the platform pack lives in globals.css, route-scoped with :has(.explore-shell), appended at the file tail; no user-select: none; no landscape insets"
  - "D-04 (CONTEXT): the About block is removed ENTIRELY — no image, no chip, no substituted element"
  - "UI-SPEC §3.5b / UNRESOLVED-D3 (resolved, in scope): height: 100dvh is the required reconciliation, inserted BETWEEN height: 100% and overflow: hidden so both existing lock regexes stay green"
  - "UI-SPEC §3.5c: the safe-area bands pair padding with calc() height compensation (preflight sets box-sizing: border-box)"
  - "no new dependency, no new breakpoint, no device sniffing, never disable zoom (SPEC constraints)"
metrics:
  duration: "single session, 2026-10-05"
  completed: 2026-10-05
  tasks: 3
  commits: 5
  actuals: { tasks: 3, commits: 5, red: "6 failures / 58 rows (exit 1, all ERR_ASSERTION)", suite: "306/306 npm test; explore-sweep 20/20; portfolio-data-integrity 23/23; typecheck 0; next build 0" }
status: complete
---

# Phase 13 Plan 03: mobile-parity-revision — the mobile-native platform pack and the avatar removal Summary

The landing now declares exactly one viewport (`width=device-width, initial-scale=1, viewport-fit=cover`), reconciles html/body height with the shell's `h-dvh` so no strip survives below the footer, carries a route-scoped platform pack (tap-highlight, overscroll, touch-action, safe-area insets with height compensation) at the `globals.css` tail, and renders an About panel with no image block at all — while `meta.viewport` and `about.profileImageUrl` stay byte-identical in the JSON, unconsumed.

## Commits (in order)

| # | Subject | Contents |
|---|---|---|
| 1 | `test(13-03): add failing viewport, platform-pack and avatar-removal assertions (REV-24/REV-25)` | `0022c53` — both suites: the row-3 lock-order assertions, the row-4 typed-export fields, the new REV-25b placement+pack+derived-band row, the new REV-25a emitted-tag row, and the three REV-24 rows. Pure additions (357 insertions, 0 deletions) — the retained lock regex is byte-unchanged. The RED on record, committed before any implementation edit. |
| 2 | `test(13-03): refine the viewport row to the tag count (the flight payload duplicates the substring)` | `e2861c4` — the build falsified the plan's `viewport-fit=cover`-occurrence expectation; the row now asserts the emitted TAG carries the fit (the real falsifier) plus the documented 2-occurrence fact. Precedent: `test(13-01): refine the goToRole row to the early-return form`. |
| 3 | `feat(13-03): the mobile-native platform pack — viewport-fit, dvh lock, safe areas (REV-25)` | `b5451ec` — the typed viewport export, the retired data meta line, the dvh lock line + its renewed doc comment, and the 80-line platform pack at the CSS tail. |
| 4 | `feat(13-03): remove the About avatar and reflow the panel (REV-24)` | `6451d70` — the image block and its comment deleted, the summary gains `mt-3` on both branches, and all five stale doc-comment sites renewed so the file's prose matches the DOM. |
| 5 | `docs(13-03): plan 03 summary — the mobile-native platform pack and the avatar removal (REV-25/REV-24)` | This SUMMARY (the executor's artefact commit). |

## TDD Gate Compliance

**PASSED.** The plan is `type: tdd`; the first scope-matching commit is `test(13-03): …` (`0022c53`), and the first `feat:` commit (`b5451ec`) comes two commits later. No implementation file was touched before the RED was committed and run — the RED run below is the `HEAD = 0022c53` tree, and the only write before it was the test commit itself.

## Task 1 — RED on record (verbatim)

`npm run build && node --test tests/route-swap.test.mjs tests/explore-visuals.test.mjs; echo "exit=$?"` → **exit 1**:

```
✖ REV-24 avatar removal: the About panel renders no image and no initials chip
✖ REV-24 export: the built About panel carries no avatar image and no portrait alt
✖ row 3 (P): landing does not inherit the CLI h-screen wrapper (UI-SPEC §2.1 hard constraint)
✖ row 4 (P): before-paint theme script is route-scoped to the landing and NOT in the root layout (R-2)
✖ REV-25b: the platform pack is appended AFTER the reduced-motion guard and adds no second suppressor
✖ REV-25a (E): the built landing declares exactly ONE viewport meta — the fit declared, the legacy directives gone
ℹ tests 58 / ℹ suites 0 / ℹ pass 52 / ℹ fail 6 / ℹ cancelled 0 / ℹ skipped 0 / ℹ todo 0
```

The six assertion messages, verbatim — one per named cause the plan's acceptance requires:

```
AssertionError [ERR_ASSERTION]: no <img> element survives in the About panel (the removed avatar was its only one)
AssertionError [ERR_ASSERTION]: no <img> carries the retired avatar source (id derived from the JSON: 5cfm72u7) — found 1
AssertionError [ERR_ASSERTION]: REV-25b: the landing lock gains height: 100dvh — document/body height tracks the dynamic viewport exactly like the shell
AssertionError [ERR_ASSERTION]: REV-25a: the typed viewport export declares viewportFit: 'cover' — env(safe-area-inset-*) resolves to 0px without it, so the meta and the CSS pack are inert apart
AssertionError [ERR_ASSERTION]: REV-25b: the platform pack exists — its first marker is the inherited tap-highlight reset
AssertionError [ERR_ASSERTION]: exactly ONE <meta name="viewport"> is emitted — the data-rendered `meta.viewport` line must retire; the phone otherwise runs on an undefined multi-tag tie-break
```

All six are missing-behaviour failures: `grep -c 'ERR_ASSERTION'` = 6 and `grep -nE 'SyntaxError|Cannot find module|ENOENT|TypeError'` prints **none** — no invalid red. RED-locality held: 52 retained rows stayed green.

Task-1 acceptance, all verified on the `0022c53` tree:

| Check | Result |
|---|---|
| Both suites fail non-zero | exit 1 (before the refinement commit) |
| Causes are missing behaviour | 6 × `ERR_ASSERTION`, 0 × SyntaxError/ENOENT/TypeError |
| avatar row scoped, not global | `grep -c profileImageUrl tests/explore-visuals.test.mjs` = 8; the row's inline comment names the three head-metadata consumers; **no** repo-wide `src/` walk asserts the field absent |
| export row scoped | `grep -c 5cfm72u7 tests/explore-visuals.test.mjs` = **1** (the data assertion; the export row derives the id from the JSON); no assertion bans the bare `tinyurl` substring |
| pack-placement row index-based | `grep -c indexOf tests/route-swap.test.mjs` = 10; the row asserts the pack marker index > the guard index |
| the existing lock regex is UNCHANGED | `git diff -U0 tests/route-swap.test.mjs \| grep '^-'` prints nothing — the whole commit is additions |
| `git show --stat HEAD` | exactly `tests/route-swap.test.mjs` + `tests/explore-visuals.test.mjs` |

## Task 2 — GREEN: the platform pack

- **`src/app/layout.tsx`** — the typed export gains `width: 'device-width'`, `initialScale: 1`, `viewportFit: 'cover'` (with a doc comment stating the intent rationale and explicitly NOT a regression claim — RESEARCH R4), and the `themeColor` array stays byte-identical. The `<meta name="viewport" content={portfolioData.meta.viewport} />` line is deleted; `<meta charSet>` and the `portfolioData` import (still live for `metadata` + the JSON-LD) stay.
- **`src/app/(home)/layout.tsx`** — `height: 100dvh;` inserted BETWEEN `height: 100%;` and `overflow: hidden;`, and the lock's doc comment renewed with the reconciliation reasoning. Nothing else touched (theme script, metadata consumers, og:image all byte-identical).
- **`src/app/globals.css`** — 80 lines appended after the reduced-motion guard: `html:has(.explore-shell)` tap-highlight; `html:has(...), body:has(...)` overscroll (with the "the html half is load-bearing" note); the three control selectors → `touch-action: manipulation`; `[data-projects-swipe-stage]` → `touch-action: pan-y`; the header/footer safe-area bands with `calc()` height compensation; the `@media (min-width: 640px)` footer override. One declaration per line; no motion declarations; no second suppressor; no comment naming the suppressed query.

Task-2 acceptance, all verified on the tree after commit `b5451ec`:

| Check | Result |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 · 6/6 static pages, 2/2 exported |
| `npm test` | route-swap **16/16**; full suite **304/306** — the only 2 failures are the REV-24 rows Task 3 owns (see D-3) |
| `grep -o '<meta name="viewport"' out/index.html \| wc -l` | **1** (was 2) |
| the emitted tag | `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>` |
| `grep -o 'shrink-to-fit' out/index.html \| wc -l` | 0 (was 2) |
| `grep -oE 'user-scalable\|maximum-scale' \| wc -l` | 0 |
| `grep -o '<meta name="theme-color"' \| wc -l` | 2 (survives) |
| `grep -c 'portfolioData.meta.viewport'` (both layouts) | 0 / 0 |
| lock order | `height: 100%` (67) → `height: 100dvh` (68) → `overflow: hidden` (69); both retained lock regexes green |
| pack is at the tail | guard line **681** < pack marker line **714** |
| `grep -o 'prefers-reduced-motion' globals.css \| wc -l` | **1** (no comment contains it) |
| `grep -o 'touch-action: none' globals.css \| wc -l` | 0 |
| `grep -oE 'transition:\|animation:' globals.css \| wc -l` | **7 before / 7 after** — the pack adds zero motion |
| `env(safe-area-inset-top, 0px)` / `...-bottom, 0px` | **2** / **3** (one declaration per line) |
| untouched proof | `git show --stat` = exactly the 3 implementation files; `git diff --name-only` for `explore-header.tsx`, `explore-status-bar.tsx`, `cli/layout.tsx`, `resume/page.tsx` = **0** |
| compiled CSS ships the pack | `grep -l 'safe-area-inset-top' out/_next/static/css/*.css \| wc -l` = 1 |

## Task 3 — GREEN: the avatar removal

- **`src/components/explore/sections/about-section.tsx`** — the `{about.profileImageUrl && (<img … />)}` block and its `{/* §2.1 item 4 … */}` comment deleted (no element, no placeholder mark, no substitute); the summary `<p>` gains `mt-3 ` on BOTH branches of its conditional class string; and all five stale doc-comment sites are renewed — the pinned-order line, the graceful-hide matrix clause, the chrome parenthetical `(lead/metrics/chip)`, the DOM-order sentence, and the deleted block's own comment. The paragraph recording that `about.profileImageUrl` stays in the JSON and the `.d.ts` (with its three head-metadata consumers still live) replaces the removed clause. The dangling `tinyurl` / `next/image` rationale goes with it.

Task-3 acceptance, all verified on the tree after commit `6451d70`:

| Check | Result |
|---|---|
| `npm run typecheck` / `npm run build` / `npm test` | 0 / 0 · 6/6 + 2/2 / **306 passes, 0 fails** |
| `<img` / `Portrait of` / `initials` / `avatar` / `{about.profileImageUrl` in the panel source | 0 / 0 / 0 / 0 / 0 |
| `profileImageUrl` mentions in the panel source | **1** (the survival sentence only) |
| summary reflow by shape | both exact strings present — `'mt-3 text-xs leading-relaxed text-muted-foreground'` and `'mt-3 text-sm leading-relaxed text-foreground'` |
| export | `grep -oE '<img[^>]*src="[^"]*5cfm72u7' \| wc -l` = 0; `grep -o 'Portrait of' \| wc -l` = 0 |
| data untouched | `git diff HEAD --stat -- src/data/…json src/data/…d.ts` empty; `node --test tests/portfolio-data-integrity.test.mjs` 23/23 |
| neighbours | resume link still last (source index after every `href={value}`), `ROW_CLASS` keeps `min-h-[44px]`, both `exp-nudge` hooks present; retained `explore-visuals` row at `:555-585` unmodified and green |
| no client directive | `grep -c 'use client'` = 0 |
| `git show --stat HEAD` | exactly the one implementation file |

## Verification Gate (final chronological action)

Gate order per UI-SPEC §9.3 / D-07, and the build precedes the `out/` rows:

```
npm run typecheck                                  → exit 0
npm run build                                      → exit 0 · 6/6 static pages, ✓ Exporting (2/2)
npm test                                           → exit 0 · ℹ tests 306 / pass 306 / fail 0
node --test tests/explore-sweep.test.mjs           → exit 0 · ℹ tests 20 / pass 20 / fail 0
grep -o '<meta name="viewport"[^>]*>' out/index.html → exactly one tag, viewport-fit=cover, no shrink-to-fit
```

Run over the final committed tree, after this SUMMARY's commit (a `.planning/`-only write cannot change a source-grep, an export or a suite result) — see the completion report for the final HEAD.

## Deviations

- **D-1 — commit scope is `13-03`, not the orchestrator's suggested `(EXPLORE-13-mobile-parity-revision-03)` nor the plan prose's `(phase-13)`.** The `tdd_audit` ship gate derives its scope token from the plan's structured fields as `{phase}-{plan}` zero-padded (`@dsh-gsd/bundle/lib/gates.js:124-126`: `planScope` → `13-03`) and only inspects subjects matching `\(13-03\)`; either suggested form would be invisible to the gate, which would then report "missing test: commit before feat:/fix:" on a fully compliant plan. Plan 02's D-1 and repo precedent (`test(13-01)`, `test(10-07)`) agree.
- **D-2 — the plan's `viewport-fit=cover` occurrence expectation is FALSIFIED, and the row was refined.** Task 2's acceptance states `grep -o 'viewport-fit=cover' out/index.html | wc -l` is 1. The measured value is **2**: the head tag plus a copy inside the RSC flight payload (`self.__next_f.push` serializes the resolved metadata — the same mechanism that duplicates `5cfm72u7` eight times). A `=== 1` substring count is therefore unsatisfiable by construction. Fix: a separate `test(13-03)` refinement commit (the `test(13-01): refine the goToRole row …` precedent) that asserts the **emitted TAG** carries the fit — the real falsifier the plan itself names — and records the 2-occurrence fact. The single-tag assertion (`<meta name="viewport"` count === 1) is untouched and remains the row's primary contract.
- **D-3 — Task 2's gate could not be "all 14 suites green", by construction.** The single RED commit planted the rows of BOTH implementation tasks, so the two REV-24 avatar rows were still red when Task 2 completed. Task 2's gate was therefore: `typecheck` 0, `build` 0, `node --test tests/route-swap.test.mjs` **16/16**, and the full suite with **exactly** the two REV-24 rows failing (Task 3's own rows, named in the output). Task 3's gate then ran the full suite green (306/306), and the plan-level gate re-ran it over the final tree. No red was allowed to survive past the task that owns it.
- **D-4 — the safe-area band literals are derived from each element's OWN className line, not from a file-level first regex match.** The plan prescribes `/h-\[(\d+)px\]/` → 52 against `explore-header.tsx`. Applied file-wide that regex matches `h-[52px]` on the header's **doc-comment** line 16 (which also carries `h-[44px]`), so a change to the real bar height on line 39 would leave the derived value — and the test — unchanged: the exact failure the derivation exists to catch. The row therefore extracts from the `<header className=…>` / `<footer className=…>` element lines with the plan's regexes. Values are identical (52px / 1.75rem / 2rem) and the intent (self-checking duplication) now holds.
- **D-5 — one row was added beyond the plan's Task-1 item list: `REV-25a (E)`.** `node:test` reports only the FIRST failed assertion per test, and row 4 fails at `viewportFit` before its `portfolioData.meta.viewport` assertion can run — so the acceptance requirement that the RED output *name* "`meta.viewport` still rendered" was unmeetable inside row 4. The new export-level row is the plan's own stated "real falsifier" ("pin the **emitted** string"), reads `out/index.html`, and its message names the data line verbatim. Same class as plan 02's D-2 (splitting the gone-check into its own row so it reddens independently).
- **D-6 — the removal note cannot use the words the removal test bans.** Comments are load-bearing in this repo's greps (the ban measures the raw file), so every occurrence of `avatar` and `initials` had to leave `about-section.tsx` — including the prose explaining the removal. The header now reads "the image block that used to separate the availability chip from the summary is REMOVED ENTIRELY — no element, no placeholder mark, no substitute". Same class as plan 02's D-3. The historical name survives in CONTEXT/UI-SPEC/research.
- **`explore-header.tsx` / `explore-status-bar.tsx` deliberately untouched**, as the plan requires: the CSS selector out-specifies the utilities ((0,1,1) vs (0,1,0)), so the header's px-based geometry pins (`tests/explore-header.test.mjs:118-168`) stay untouched — which is also the cleanest proof of "untouched".

## Handed to the phone checklist (plan 04 — not CI-verifiable)

1. No gap below the footer at rest, while the URL bar hides/shows, and after scrolling to the bottom of the main area (`height: 100dvh` + `overscroll-behavior: none`).
2. Exactly one scrollbar — no window scrollbar, no horizontal scrollbar anywhere.
3. Safe areas on a notched device: the header reaches the top edge and the footer the bottom edge, their content is NOT under the notch / home indicator, and the 44px controls are not squeezed.
4. Tapping a control no longer flashes the grey highlight.
5. Vertical page scroll still works when the gesture starts on the drag card (`touch-action: pan-y`, never `none`).
6. Both themes legible, including the strips behind the notch and above the home indicator.
7. Item 9 (accepted side effect, not a defect): `/cli` and `/resume` now receive `viewport-fit=cover` from the root-level export while their files stay byte-identical — check their top/bottom edges for content under the notch.
8. The wizard's docked card buttons are not under the home indicator (the overlay measures a now-taller viewport).

## Known Stubs

None. No `TODO`/`FIXME`/`XXX`/`HACK` marker and no skipped or `.only` test exists in any of the six touched paths (scanned after commit `6451d70`). The single `placeholder` match is this plan's own prose in the removal note ("no placeholder mark"), not a stub.

## Threat Flags

None. The diffs are an import-free metadata object, one CSS declaration line inside an existing `<style>` template, Tailwind-free CSS appended to the stylesheet tail, deletions, and JSX removal inside one existing server component. The diff adds **no** `dangerouslySetInnerHTML`, no `eval`, no new inline script, no new remote origin and no new dependency (`grep -nE '^\+.*(dangerouslySetInnerHTML|eval\(|new Function|http://|https://[a-z]|import )'` over the source diff prints nothing). The security-sensitive surfaces the plan touches are byte-identical: the `rel="noopener noreferrer"` + `target="_blank"` pair on every external link, the four existing inline-script sites, and the `portfolioData` import (still live for `metadata` + the Person-schema JSON-LD). `npm run build` emits the same three static routes.

## Self-Check: PASSED

| Assertion | Evidence |
|---|---|
| The 6 declared paths match reality | `git diff --stat 2b89380..HEAD` lists exactly the 6 paths in the plan's `files_modified`; nothing else changed |
| The 5 commits exist on the branch | `0022c53`, `e2861c4`, `b5451ec`, `6451d70`, and this SUMMARY's commit (`git log --oneline -5`) |
| Every task's `<files>` list respected | Task 1 staged only the 2 test files; Task 2 only the 3 implementation files; Task 3 only the 1 component file; the refinement commit only `tests/route-swap.test.mjs` |
| Nothing outside the plan's scope was staged | `git status --short` shows only the orchestrator's `.planning/async-jobs.json`, untouched by this plan; the four named sibling files and `src/data/` have **zero** diff |
| The final gate is green over the final tree | typecheck 0 · build 0 (6/6 + 2/2) · 306/306 · sweep 20/20 · data-integrity 23/23 · exactly one emitted viewport tag |

*Phase: 13-mobile-parity-revision · plan 03 · executed 2026-10-05*
