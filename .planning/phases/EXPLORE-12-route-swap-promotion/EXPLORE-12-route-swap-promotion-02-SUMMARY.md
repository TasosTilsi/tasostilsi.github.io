---
phase: 12-route-swap-promotion
plan: 02
subsystem: stale-test renewal / route-literal repath / route-prose sweep
tags: [stale-test-triage, route-swap, composite-test, static-export, comment-only-sweep, merge-hold-lift]
dependency_graph:
  requires: ["EXPLORE-12-route-swap-promotion-01"]
  provides:
    - "the full 14-suite house gate green on the swapped route table"
    - "the six-leg two-way routing composite (tests/explore-sweep.test.mjs E-5)"
    - "the trailingSlash tripwire (!existsSync out/cli/index.html)"
    - "the P-1 hardening — an explicit landing-page existence assertion before the h-screen guard"
    - "the merge-hold lift from plan 01"
  affects:
    - "plan 03 — its breakpoint sweep grid and finality gate ride on this green tree; the phase-level finality re-run is plan 03's"
tech-stack:
  added: []
  patterns:
    - "stale-test triage: repath the reader, the test TITLE and the assertion MESSAGE — three independent literal sites per row"
    - "negative-residue assertions kept literal (the deliberate absence falsifier is not silenced to satisfy a grep)"
    - "comment-only prose sweep proved by `git diff -U0` — every added line starts `//` or `*`"
key-files:
  created: []
  modified:
    - tests/credentials-panel.test.mjs
    - tests/explore-shell.test.mjs
    - tests/explore-tour.test.mjs
    - tests/explore-visuals.test.mjs
    - tests/explore-sweep.test.mjs
    - tests/explore-routing.test.mjs
    - tests/explore-header.test.mjs
    - src/components/explore/explore-shell.tsx
    - src/components/explore/use-explore-theme.ts
    - src/components/explore/explore-tour.tsx
    - src/components/explore/sections/skills-section.tsx
    - src/app/layout.tsx
decisions: ["D-04 test/sweep renewal", "D-01 route moves (renewal target)", "D-03 cross-surface rewiring (composite legs 1-6)"]
metrics:
  duration: "single session, 2026-10-02"
  completed: 2026-10-02
  tasks: 3
  commits: 3
  actuals: { tasks: 3, commits: 3, suites: "14/14", tests: "289/289" }
status: complete
---

# Phase 12 Plan 02: route-swap-promotion Summary

The stale test surface is renewed against the swapped route table, the six cross-surface link targets are pinned as one six-leg composite, and the full house gate (typecheck + build + 289 tests across 14 files) is green on the frozen tree — **the plan-01 merge hold is formally lifted**.

## Commits (in order)

| # | Subject | Contents |
|---|---|---|
| 1 | `test(EXPLORE-12-route-swap-promotion-02): renew the export-reader suites to index/cli readers` | `386a55f` — the four export-reading suites, all 24 `out/explore.html` occurrences. No source file. |
| 2 | `test(EXPLORE-12-route-swap-promotion-02): renew the route-target assertions and lock the two-way composite` | `7fbe829` — the three route-target suites, the six-leg composite, the two checker BLOCKERs. No source file. |
| 3 | `docs(EXPLORE-12-route-swap-promotion-02): sweep the stale route prose out of the five src files` | `64c263c` — five comment-only renewals, 1 line each. |
| 4 | `docs(EXPLORE-12-route-swap-promotion-02): plan 02 summary and STATE update [EXPLORE-12-route-swap-promotion-02]` | This SUMMARY + STATE.md. |

## (a) Task 1 — the pre-repath ENOENT RED, verbatim on record

`rm -rf out && npm run build && node --test tests/explore-shell.test.mjs` → **build exit 0**, test **exit 1**:

```
ℹ tests 30
ℹ suites 0
ℹ pass 20
ℹ fail 10
```

The four export rows failed on the deleted artifact, quoted verbatim:

```
AssertionError [ERR_ASSERTION]: out/explore.html missing — run `npm run build` first
    at TestContext.<anonymous> (file:///…/tests/explore-shell.test.mjs:490:10)
AssertionError [ERR_ASSERTION]: out/explore.html missing — run `npm run build` first
    at TestContext.<anonymous> (file:///…/tests/explore-shell.test.mjs:498:10)
```

and the other six failed on the **moved source paths / stale breadcrumb literal** — a distinct cause from the ENOENT one:

```
✖ constants: 5 locked sections after the About+Contact merge, disjoint theme key, breadcrumb strings
✖ explore layout: before-paint script + data-driven metadata
✖ page: h-dvh flex shell with explore-shell marker, panel grid composed
✖ theme: page stays a server component wrapping ExploreShell
✖ panels: ExplorePanels renders stable section ids via PanelShell + total SECTION_BODIES
✖ intro: page composes ExploreIntro between header and main (UI-SPEC §1 order)
✖ static export: /explore IDE frame emitted into out/explore.html
✖ static export: JetBrains Mono self-hosted in emitted CSS (EXPLORE-01c)
✖ static export: theme script + toggle emitted into out/explore.html
✖ static export: intro strip — sr-only h1 full name—title server-rendered
```

This is plan 01's declared merge-hold failure made visible: the suite's reader still pointed at `out/explore.html`, which the route deletion removed. Task 1's repath converts it to GREEN.

**After the repath** — `rm -rf out && npm run build && node --test tests/credentials-panel.test.mjs tests/explore-shell.test.mjs tests/explore-tour.test.mjs tests/explore-visuals.test.mjs` → **exit 0**:

```
ℹ tests 128
ℹ suites 0
ℹ pass 128
ℹ fail 0
```

`tests/explore-tour.test.mjs` needed a sixth edit beyond the five enumerable `out/explore.html` occurrences: its tour-copy digit guard ends with `assert.equal(EXPLORE_TOUR_FINISH.linkHref, '/')` at `:153` — a route **target** literal, red for the same reason as task 2's rows, but living in a task-1 file. It is renewed to `'/cli'` there (the guard's digit-sweep itself is untouched, exactly as the plan's context note requires). Without it the suite could not reach the task's required green.

## (b) Task 2 — the pre-edit semantic RED, verbatim on record

`node --test tests/explore-sweep.test.mjs tests/explore-routing.test.mjs tests/explore-header.test.mjs` → **exit 1**, captured BEFORE any edit:

```
ℹ tests 36
ℹ suites 0
ℹ pass 21
ℹ fail 15
```

The 15 failures are semantic (asserting the OLD destinations), not ENOENT:

```
✖ sweep rows CLI@375/768/1440/1920 (P): (main) layout overflow invariants + pre-wrapped output
✖ sweep row CLI@375 (P): welcome link line fit arithmetic — 30 chars ≤ 42 bound, fits 359px
✖ sweep E-1 (E): all three routes still export statically
✖ sweep E-2 (E): header Terminal link SSRs into out/explore.html — /explore → CLI leg at L3
✖ sweep E-5: two-way routing loop composite — all four legs in one assertion set
✖ sweep E-6 … E-9 (E, phase EXPLORE-09)   [4 rows]
✖ welcome link line: exactly one <Link href="/explore"> in the locked bracket format (D-01)
✖ welcome link: unconditional sibling AFTER the tutorial box, before the trailing <br />
✖ dispatch: explore case returns the navigate sentinel, routed via useRouter (D-02, OQ-2)
✖ guards: zero new dependencies; the /explore → CLI return leg stays intact (D-05)
✖ D-03 Terminal link: aria-label, lucide Terminal, Next Link to / — same tab
✖ finish-card regression guard: EXPLORE_TOUR_FINISH.linkHref stays "/" (D-03 unchanged clause)
```

Distinct assertion messages proving the cause is the route target, not a missing artifact:

```
AssertionError: leg 1: welcome bracket link href="/explore"
AssertionError: the link targets /explore exactly once
AssertionError: the case returns the navigate sentinel (house idiom: resume openModal sentinel, RESEARCH §1.2)
AssertionError: a Next <Link href="/"> routes back to the CLI (D-03)
AssertionError: the tour finish card still links the CLI at / (unchanged clause of D-03, constants.ts:92)
AssertionError: the wizard finish card still links the CLI at / (src/components/explore/constants.ts:92)
```

Note the last two: `explore-header.test.mjs:61`'s live regex `/<Link\b[^>]*?href="\/"/` was the checker's **BLOCKER 1** — a live assertion pinning the old target that no enumerated context item renewed. Renewed to `href="\/cli"` (detection criteria now `grep -c 'href="/cli"' ≥ 1` AND `grep -c 'href="/"' = 0`). The checker's **BLOCKER 2**, `explore-sweep.test.mjs:174`'s `block.includes('<Link href="/explore"')`, is renewed to `'<Link href="/"'` (the welcome line's new destination).

## Task 3 — the prose-sweep RED, then GREEN

The task's own falsifier is the plan's predicate grep; captured BEFORE the five edits:

```
$ grep -rnE '[[:space:]]/explore[[:space:]]' src/ --exclude=globals.css
src/components/explore/explore-shell.tsx:4: * ExploreShell — client boundary of the /explore IDE frame (D-01, UI-SPEC §2.1).
src/components/explore/use-explore-theme.ts:4: * useExploreTheme — hand-rolled dark/light theme state for the /explore shell
src/components/explore/sections/skills-section.tsx:14: * categories / languages, the only /explore rendering of the full
src/components/explore/explore-tour.tsx:4: * ExploreTour — the spotlight wizard tour on /explore (phase EXPLORE-04).
src/app/layout.tsx:19:// D-04: JetBrains Mono for the /explore IDE shell, exposed as --font-jetbrains.
scoped-exit=0
```

After the five renewals:

```
$ grep -rnE '[[:space:]]/explore[[:space:]]' src/ --exclude=globals.css
scoped-exit=1                                    ← empty, as required
$ grep -rnE '[[:space:]]/explore[[:space:]]' src/
src/app/globals.css:496:/* Dark IDE theme is the default for the /explore shell (UI-SPEC §9.2).
unscoped-exit=0                                  ← exactly ONE line: the recorded debt
$ grep -rn 'out/explore' src/
outpath-exit=1                                   ← empty, as required
$ grep -rn '/explore' src/ --exclude=globals.css | grep -vc 'explore-\|components/explore\|~/explore'
0                                                ← every residual is a legitimate class
$ git diff --name-only HEAD -- src/app/globals.css | wc -l
0                                                ← byte-untouched
```

The exclusion is proven honest, not a hiding place: the unscoped predicate shows only `src/app/globals.css:496`, and the file has a zero diff. **Recorded as accepted debt with a pointer**, exactly as the drawer's `~/explore` title is — UI-SPEC §9 ("`globals.css` is not edited") plus RESEARCH §9.1/§9.2 forbid editing that file at all in this phase, so its stale route-prose comment was deliberately not renewed. Not touched, not even its comment.

**Comment-only proof** — every line ADDED across the five files (`git diff -U0`, excluding the `+++` headers), verbatim:

```
+// JetBrains Mono for the landing IDE shell, exposed as --font-jetbrains.
+ * ExploreShell — client boundary of the landing IDE frame (D-01, UI-SPEC §2.1).
+ * ExploreTour — the spotlight wizard tour on the landing page (phase EXPLORE-04).
+ * categories / languages, the only landing rendering of the full
+ * useExploreTheme — hand-rolled dark/light theme state for the landing shell
```

Five added lines, five removed lines, every added line a comment. Zero executable tokens changed; zero CSS file in the diff.

The root layout's `D-04:` prefix was **dropped**, not carried: that token is a phase-01 identifier (`tests/explore-shell.test.mjs:131` still qualifies it as `(D-04, EXPLORE-01c)`), while this phase's CONTEXT holds only D-01…D-04 — leaving a bare `D-04` on a line this plan renews would read as this phase's sweep-renewal decision and create exactly the dangling-reference hazard the plan calls out. `JetBrains Mono` and `--font-jetbrains` are kept verbatim.

## (c) The final full house gate — verbatim, chronologically last on `src/` + `tests/`

`rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs`:

```
> tsc --noEmit
typecheck-exit=0

Route (app)                                 Size  First Load JS
┌ ○ /                                    69.7 kB         194 kB
├ ○ /_not-found                            131 B         103 kB
├ ○ /cli                                 4.51 kB         107 kB
└ ○ /resume                              12.8 kB         126 kB
+ First Load JS shared by all             103 kB
build-exit=0

ℹ tests 289
ℹ suites 0
ℹ pass 289
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
gate-exit=0
```

**14 test files** (`ls tests/*.test.mjs | wc -l` → 14): the 13 pre-existing suites + plan 01's `tests/route-swap.test.mjs`. The route table lists `/`, `/cli`, `/resume` as prerendered static content and **no `/explore` node**. Plan 01 measured 289 tests with 38 failing; the same 289 now pass with 0 failing — the renewal removed failures without adding or dropping a single test.

Plan 01's own suite row 11 (the scoped residue scan) and row 13 (the six-leg composite) are green in this run, quoted from its tail:

```
✔ row 11 (E): /explore residue — out/*.html + out/*.txt clean, chunks count-exact at 1
✔ row 12 (E): landing og:title is explore-branded; /cli carries CLI branding
✔ row 13 (P + E): six-leg cross-surface composite — CLI -> landing -> CLI in one assertion set
✔ row 14 (P): zero new dependencies — 39 keys, no recharts (SPEC constraint)
```

**Timing note (finality).** This gate run is the chronologically last action touching `src/` or `tests/`. `git status --porcelain -- src tests` is **empty** at SUMMARY-write time and `git diff HEAD -- src tests` is empty — the committed tree is byte-identical to the gated tree (a commit does not alter content). The only write that follows is this SUMMARY plus the STATE line, both planning artefacts under `.planning/`; plan 03 re-runs the complete gate as the phase-level finality action, so nothing is left uncovered.

## (d) The commit touch-list inventory (verbatim `git show --stat`)

```
$ git show --stat --format='%s' 386a55f
 tests/credentials-panel.test.mjs |  8 +++----
 tests/explore-shell.test.mjs     | 47 +++++++++++++++++++++++++---------------
 tests/explore-tour.test.mjs      | 12 +++++-----
 tests/explore-visuals.test.mjs   | 23 +++++++++++---------
 4 files changed, 52 insertions(+), 38 deletions(-)

$ git show --stat --format='%s' 7fbe829
 tests/explore-header.test.mjs  |  16 +++---
 tests/explore-routing.test.mjs |  22 ++++----
 tests/explore-sweep.test.mjs   | 113 ++++++++++++++++++++++++++++-------------
 3 files changed, 97 insertions(+), 54 deletions(-)

$ git show --stat --format='%s' 64c263c
 src/app/layout.tsx                                 | 2 +-
 src/components/explore/explore-shell.tsx           | 2 +-
 src/components/explore/explore-tour.tsx            | 2 +-
 src/components/explore/sections/skills-section.tsx | 2 +-
 src/components/explore/use-explore-theme.ts        | 2 +-
 5 files changed, 5 insertions(+), 5 deletions(-)
```

Exactly the 7 enumerated test files and the 5 enumerated source files — 12 paths, no more. **No panel, drawer, wizard, arc, stack, counter, data or dependency file appears**: `src/data/portfolio-main-data.json`, `package.json`, `public/`, `scripts/`, `.github/` are all untouched by all three commits, and `src/app/globals.css` has a zero diff over the whole plan.

## The six-leg composite (tests/explore-sweep.test.mjs E-5)

One `test(...)` body, six legs, both directions of the loop asserted together so no half-rewire can pass:

| Leg | Direction | Assertion site and form |
|---|---|---|
| 1 | CLI welcome → `/` | `WelcomeMessage.tsx` contains `href="/"`; and no `target=` (same tab) |
| 2 | CLI `explore` command → `/` | `TerminalInterface.tsx` contains `{ navigate: "/" }` + `router.push(result.navigate)`; no `window.location` |
| 3 | landing header Terminal link → `/cli` | `explore-header.tsx` contains `href="/cli"` |
| 4 | wizard finish card → `/cli` | `EXPLORE_TOUR_FINISH.linkHref === '/cli'` — the constant imported directly, no JSX parsing |
| 5 | status-bar `cli` chip → `/cli` NEW tab | source: `target="_blank"` + `rel` carrying BOTH `noopener` and `noreferrer` + `EXPLORE_STATUS_CLI_LINK.href === '/cli'`; export: `out/index.html` carries `target="_blank"` and `rel="noopener noreferrer"` |
| 6 | 404 "Return to Terminal" → `/cli` | `not-found.tsx` contains `href="/cli"` |

`grep -c 'leg 6' tests/explore-sweep.test.mjs` → 2 · `grep -c 'not-found.tsx' tests/explore-sweep.test.mjs` → 2 · `grep -c 'two-way routing loop composite' tests/explore-sweep.test.mjs` → **1** (the single `test(` declaration).

## Two traps closed deliberately

- **P-1/R-4 — the silent `.filter(existsSync)` no-op.** `tests/explore-shell.test.mjs` built its source list as `['src/app/explore/page.tsx', …].filter((p) => existsSync(...))`. After the move the array silently dropped the page and the `!code.includes('h-screen')` guard degraded to checking `explore-shell.tsx` alone. Repathed to `src/app/(home)/page.tsx` **and** hardened: `assert.ok(existsSync(join(root, 'src/app/(home)/page.tsx')), 'landing page present — the h-screen guard must not silently degrade')` now runs before the list is built. Measured: `grep -c 'existsSync' tests/explore-shell.test.mjs` went 12 → 14.
- **R-8 — the `trailingSlash` tripwire.** E-1 asserts `existsSync(out/cli.html)` **and** `!existsSync(out/cli/index.html)`. `next.config.ts` leaves `trailingSlash` unset (the `/resume` → `out/resume.html` precedent), so all four `/cli` hrefs are slash-free; a future flip now fails loudly instead of silently 404-ing the chip on GitHub Pages. Verified on this build: `out/cli.html` exists, `out/cli/index.html` does not.

E-1 also carries the explicit negatives the deletion requires — `!existsSync(out/explore.html)` and `!existsSync(out/explore.txt)` — which are the route-level falsifiers for REV-22's "NO /explore route exists".

## W-5 prose sweep — where the four test-prose sites landed

The plan names four comment/title-only renewals spanning two task scopes. They rode the task that already owned each file, so both tasks' `git show --stat` pins held:

- **task 1's files** — `tests/explore-shell.test.mjs:139` (`scoped to /explore (D-04, EXPLORE-01c)` → *the landing shell*; the `EXPLORE-01c` qualifier is kept because it disambiguates a phase-01 decision id) and `tests/explore-visuals.test.mjs:691` (test title `export: /explore is recharts-free` → `export: the landing is recharts-free`).
- **task 2's files** — `tests/explore-routing.test.mjs:19` (`{ navigate: "/explore" }` in the pinned-contract header → `{ navigate: "/" }`) and `:26` (`the /explore → CLI finish-card return leg` → `the landing → /cli finish-card return leg`).

Zero assertion predicates changed at any of the four sites.

## Merge hold — LIFTED

Plan 01 recorded the branch as **knowingly RED** with 38 failures across seven pre-existing suites and stated: "the branch must NOT be merged, pushed, or handed off as green until plan 02's `npm run build && node --test tests/*.test.mjs` full-suite run is on record." That run is the one quoted in section (c): **typecheck exit 0, build exit 0, 289/289 pass, 0 fail, 14 suites**. The hold is lifted.

The **remote-write hold stands**: no push, no PR, no deploy was performed by this plan. `master` is the only branch the deploy workflow triggers on, and a remote mutation remains gated behind an explicit per-action user command.

## Deviations (recorded, not silently taken)

- **DEV-1 — commit scope token.** The plan pins `test(phase-12): …`; the orchestrator's dispatch for this plan specifies the scope `(EXPLORE-12-route-swap-promotion-02)`. Commits use the orchestrator's scope with the plan's pinned wording kept **verbatim** after the colon, so the plan's message text is searchable unchanged. Plan 02 is `type: execute` (not `tdd`), so the ship-time `tdd_audit` gate — which evaluates `type: tdd` plans by their first scope-matching commit — does not read these subjects.
- **DEV-2 — task 1's `<action>` and its acceptance criterion pin two different commit messages** (`…renew the route-literal suites` vs `…renew the export-reader suites to index/cli readers`). Used the acceptance-criterion message: it is the later checker-W-1 fold and the one a checker actually evaluates. The action-line wording is not on record anywhere.
- **DEV-3 — task 1's `grep -rn 'src/app/(main)' tests/ --exclude=route-swap.test.mjs returns nothing` cannot hold at task 1's commit.** The single hit is `tests/explore-sweep.test.mjs:151`, a file in task 2's scope; fixing it in task 1 would have broken task 1's `git show --stat` pin (exactly four files). The criterion is satisfied at plan end — re-measured empty, exit 1.
- **DEV-4 — task 2's `grep -c 'out/explore.html' tests/explore-sweep.test.mjs` → 0 is unsatisfiable together with task 2's own mandated E-1 rows**, which require the literal `!existsSync(join(root, 'out/explore.html'))`. Same conflict for the plan-level `grep -rn 'out/explore.html' tests/ --exclude=route-swap.test.mjs → nothing`. **Kept the negative rows**: they are the route-deletion falsifier, and the plan itself warns against deleting such literals in `tests/route-swap.test.mjs` for exactly that reason. The criterion's *substance* holds: zero stale **readers, titles or messages** mention the artifact. Measured residue is exactly two lines, both inside the deliberate absence assertion:
  ```
  tests/explore-sweep.test.mjs:246:    !existsSync(join(root, 'out/explore.html')),
  tests/explore-sweep.test.mjs:247:    'out/explore.html absent — the /explore route is deleted (D-01)',
  ```
  (`grep -c "test('.*out/explore" tests/explore-sweep.test.mjs` → 0; `grep -n "read('out/explore"` → no match.)
- **DEV-5 — task 2's `grep -n 'two-way routing loop composite' returns exactly one line` initially read 2**, because the file's pre-existing header prose at `:8` also used the phrase. Renewed that prose to *the six-leg two-way routing composite* (a comment inside task 2's own file) → the grep now returns exactly 1, and the six legs provably sit inside the single `test(...)` body.
- **DEV-6 — task 3's `grep -c 'G-TLWL6FDZE7' src/app/layout.tsx returns 1` is 2, at HEAD and now.** Both occurrences are pre-existing and load-bearing (`:117` the gtag `src` query param, `:125` the `gtag('config', …)` call); the criterion's count was an assumption, not a measurement. The real invariant holds: the root layout's only change is the single comment line, and `git diff` over the file shows one `-`/`+` pair. GA, `application/ld+json` (1), the `Person` schema url (1), the `viewport` export and `!includes('EXPLORE_THEME_STORAGE_KEY')` (0) are all confirmed.
- **DEV-7 — task 1's `tests/explore-tour.test.mjs` green required a sixth edit** beyond the five enumerable `out/explore.html` occurrences: the route-target literal at `:153` (`EXPLORE_TOUR_FINISH.linkHref === '/'` → `'/cli'`). It is a route-target renewal living in a task-1 file. The digit-guard sweep above it is untouched, as the plan requires.
- **DEV-8 — E-5 leg 5 required an additive import.** `import { EXPLORE_STATUS_CLI_LINK, EXPLORE_TOUR_FINISH } from '../src/components/explore/constants.ts';` — the plan's leg-5 text (`EXPLORE_STATUS_CLI_LINK.href === '/cli'`) needs the symbol; the constants module has zero runtime imports, so the suite's Node-native `.ts` type-stripping path is unaffected.

## Known Stubs

None. No `TODO`/`FIXME`/`PLACEHOLDER`/`XXX` marker and no skipped test was introduced: `node --test` reports `skipped 0` / `todo 0` on every run above, and the three commits' diffs introduce no such marker (all added lines are shown verbatim in the comment-only proof above). No suite was weakened to reach green — every renewal moves an expectation to the *new* contract, and the two checker BLOCKERs were fixed by tightening (an href regex, a `block.includes` literal), never by deletion.

Three deliberate, recorded non-fixes (accepted debt, not stubs):

1. `src/app/globals.css:496`'s stale route prose — the single line the unscoped predicate still shows. UI-SPEC §9 and RESEARCH §9.1/§9.2 forbid editing that file in this phase; the file is byte-untouched and the debt carries that pointer. Plan 03's sweep table records it the same way.
2. `src/components/explore/explore-drawer.tsx:55`'s `~/explore` `SheetTitle` — deliberately unchanged (UI-SPEC §9; RESEARCH §3.7/OQ-7) and pinned by plan 01's `assert.equal(hits, 1)` residue row. Editing it would turn `tests/route-swap.test.mjs` red.
3. `tests/explore-sweep.test.mjs:246-247` and `tests/route-swap.test.mjs`'s negative rows intentionally keep the literal `out/explore.html` — see DEV-4.

## Threat Flags

- **Reverse tabnabbing on the chip — now regression-guarded.** The phase's only new `target="_blank"` control is asserted at **both** tiers in one place: the source-level `rel` must carry `noopener` *and* `noreferrer`, and the built `out/index.html` must carry the literal `rel="noopener noreferrer"`. A future edit that drops either token fails composite leg 5.
- **Theme-script blast radius — re-asserted.** The `localStorage`-writing script stays route-scoped to the landing. `tests/explore-shell.test.mjs` reads `src/app/(home)/layout.tsx` for the class-strip behaviour and `tests/route-swap.test.mjs` row 4 asserts `EXPLORE_THEME_STORAGE_KEY` appears **0** times in the shared `src/app/layout.tsx` — re-confirmed on this tree (0), so neither `/cli` nor `/resume` has its `<html>` classes rewritten from the explore key.
- **The `trailingSlash` tripwire is the security-adjacent availability guard**: a silent `href="/cli"` 404 on the live host would be invisible to the suite without `!existsSync(out/cli/index.html)`.
- **No new threat surface.** Zero new dependencies (`package.json` dependencies = 39, `recharts` absent — pinned by two suites), zero new CSS, no redirect/middleware machinery, and no user-, query- or data-derived URL anywhere. This plan's edits are string literals in tests plus five comments — no executable line in `src/` changed at all.

## Self-Check: PASSED

- **Created files:** none (this plan creates no file; it renews and deletes none). **Modified files exist and are exactly the 12 enumerated paths** — verified by the three `git show --stat` inventories in section (d).
- **Commits exist:** `386a55f` → `7fbe829` → `64c263c`, one per completed task, each atomically scoped to its task's `<files>` with no blanket `git add -A` and no amend across tasks.
- **The committed tree is the gated tree:** `git status --porcelain -- src tests` → empty (exit 0); `git diff HEAD -- src tests` → empty. Nothing under `src/` or `tests/` was written after the section-(c) run.
- **`src/app/globals.css` is byte-untouched by the entire plan** (`git diff --name-only HEAD -- src/app/globals.css` → empty), so the pre-existing CSS-contract rows in `tests/explore-shell.test.mjs` and `tests/explore-sweep.test.mjs` stay green with zero edits to those assertions.
- **The predicate set is on record**, each with its measured result: scoped-empty (exit 1), unscoped-single-line (`globals.css:496`), `out/explore` empty (exit 1), residual-class filter 0, `globals.css` diff empty.
- **The final gate run is the chronologically last action on the code range**; its results are the ones quoted in section (c).
