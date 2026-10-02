---
phase: 12-route-swap-promotion
plan: 01
subsystem: routing / cross-surface links / status-bar chrome
tags: [route-swap, app-router, metadata, tdd, cross-surface-links, static-export]
dependency_graph:
  requires: []
  provides:
    - "/ serves the explore landing (src/app/(home)/{layout,page}.tsx)"
    - "/cli serves the CLI terminal (src/app/cli/{layout,page}.tsx)"
    - "tests/route-swap.test.mjs — the phase's 14-row acceptance suite"
    - "EXPLORE_STATUS_CLI_LINK (the chip's single derivation site)"
  affects:
    - "plan 02 — renews the 7 stale suites; its merge-hold lift is the phase's full-green point"
    - "plan 03 — the breakpoint sweep grid is now {/, /cli} and the finality gate rides on this tree"
tech-stack:
  added: []
  patterns:
    - "Next.js App Router route move by git mv (route groups contribute no URL segment)"
    - "route-scoped before-paint theme script (never the shared root layout)"
    - "module-imported chrome constants (zero runtime imports, test-importable)"
    - "two-tier count-exact residue scan (html/txt = 0; chunks = exactly 1 accepted hit)"
key-files:
  created:
    - tests/route-swap.test.mjs
    - src/app/(home)/layout.tsx
    - src/app/(home)/page.tsx
    - src/app/cli/layout.tsx
    - src/app/cli/page.tsx
  modified:
    - src/app/not-found.tsx
    - src/components/explore/constants.ts
    - src/components/explore/explore-status-bar.tsx
    - src/components/explore/explore-header.tsx
    - src/components/cli/outputs/WelcomeMessage.tsx
    - src/components/cli/TerminalInterface.tsx
  deleted:
    - src/app/explore/layout.tsx
    - src/app/explore/page.tsx
    - src/app/(main)/layout.tsx
    - src/app/(main)/page.tsx
decisions: ["D-01 route moves", "D-02 metadata split", "D-03 cross-surface rewiring + cli chip", "D-04 (partial: the new suite; the sweep rows are plan 03's)"]
metrics:
  duration: "single session, 2026-10-02"
  completed: 2026-10-02
  tasks: 3
  commits: 5
  actuals: { tasks: 3, commits: 5, suite: "14/14 on tests/route-swap.test.mjs" }
status: complete
---

# Phase 12 Plan 01: route-swap-promotion Summary

`/` now serves the explore landing, `/cli` serves the CLI terminal, `/explore` is deleted outright, and all six cross-surface links plus the new status-bar `cli` new-tab chip resolve to the surface they name — test-first, one atomic implementation unit, zero behavioural change on either surface.

## Commits (in order)

| # | Subject | Contents |
|---|---|---|
| 1 | `test(12-01): add failing route-swap acceptance suite` | `tests/route-swap.test.mjs`, 14 rows. The RED on record, committed before any implementation edit. |
| 2 | `feat(12-01): promote the explore experience to /, move the CLI to /cli` | The 13 implementation paths: 4 route pairs moved by `git mv` (2 detected as renames + 1 add/delete pair + 1 rename pair), 5 link-site/constant edits, the landing's Open Graph/Twitter metadata. No test file. |
| 3 | `docs(12-01): keep the phase prose invariant — no out/explore or ' /explore ' text in the renewed comments` | Comment-only repair of 3 comments (see Deviation D-2). |
| 4 | `feat(12-01): add the status-bar cli new-tab chip` | `constants.ts` + `explore-status-bar.tsx`. |
| 5 | `docs(12-01): plan 01 summary and STATE update [EXPLORE-12-route-swap-promotion-01]` | This SUMMARY + STATE.md. |

## Task 1 — RED on record (verbatim)

`rm -rf out && npm run build && node --test tests/route-swap.test.mjs; echo "exit=$?"` → **exit 1**, `ℹ tests 14 / ℹ pass 1 / ℹ fail 13 / ℹ skipped 0`.

```
✖ row 1 (P): route tree — (home) serves /, cli serves /cli, both old route folders deleted
✖ row 2 (P): CLI shell travelled verbatim to src/app/cli/* (D-01, byte-identical move)
✖ row 3 (P): landing does not inherit the CLI h-screen wrapper (UI-SPEC §2.1 hard constraint)
✖ row 4 (P): before-paint theme script is route-scoped to the landing and NOT in the root layout (R-2)
✖ row 5 (P): landing metadata declares its own openGraph + twitter branding (D-02, R-3/P-11)
✖ row 6 (P): cross-surface link targets rewired at source level (D-03)
✖ row 7 (P): breadcrumb "~" and the chip constant (D-03, UI-SPEC §2.3/§5.1)
✖ row 8 (P): status-bar cli chip anatomy, footer tokens byte-identical, live region isolated
✖ row 9 (P): no stale quoted /explore route literal survives in src/ (RESEARCH P-3)
✖ row 10 (E): export emits index.html (landing) + cli.html (CLI), no explore artifact
✖ row 11 (E): /explore residue — out/*.html + out/*.txt clean, chunks count-exact at 1
✖ row 12 (E): landing og:title is explore-branded; /cli carries CLI branding
✖ row 13 (P + E): six-leg cross-surface composite — CLI -> landing -> CLI in one assertion set
✔ row 14 (P): zero new dependencies — 39 keys, no recharts (SPEC constraint)
```

The 13 failure messages (verbatim, in row order) — every one is the missing behaviour, none is a broken test:

```
src/app/(home)/page.tsx missing — the route swap has not landed (D-01)
src/app/cli/layout.tsx missing — expected before the route swap lands (add `npm run build` for out/ paths)
src/app/(home)/page.tsx missing — expected before the route swap lands (add `npm run build` for out/ paths)
src/app/(home)/layout.tsx missing — expected before the route swap lands (add `npm run build` for out/ paths)
src/app/(home)/layout.tsx missing — expected before the route swap lands (add `npm run build` for out/ paths)
the CLI welcome bracket link targets / exactly once (the explore home)
EXPLORE_STATUS_PATH is exactly ":~" (the user breadcrumb option 2)
chip anatomy token missing from explore-status-bar.tsx: EXPLORE_STATUS_CLI_LINK.href
stale quoted /explore route literals remain: src/components/cli/TerminalInterface.tsx → { navigate: "/explore" }, src/components/cli/outputs/WelcomeMessage.tsx → href="/explore", src/components/explore/constants.ts → ":~/explore"
out/cli.html missing — run `npm run build` first
no out/*.html or out/*.txt may contain "/explore" (includes out/404.html, which GitHub Pages serves for the deleted path) — offending: out/explore.html, out/explore.txt
out/index.html og:title must carry the explore branding (else the root's CLI card survives the metadata merge) — got: Anastasios Tilsizoglou | Interactive CLI Portfolio
leg 1: welcome link href="/" once
```

Row 14 passing at RED is expected and not a defect: it is the zero-new-dependency constraint, which holds before the change by construction. The four missing-path failures on rows 2–5 are a VALID red cause — the route move IS the missing behaviour — and every one of them is the `read()` guard's named message, never a raw `ENOENT`, a `SyntaxError`, or a `Cannot find module`.

The suite deliberately imports the constants module as a NAMESPACE (`import * as exploreConstants`) and destructures: a named import of the not-yet-existing `EXPLORE_STATUS_CLI_LINK` would be a link-time `SyntaxError` that kills all 14 rows — an INVALID red. The row asserts the constant's existence with a named message instead.

## Task 2 — the atomic route swap

- `git mv "src/app/(main)/layout.tsx" src/app/cli/layout.tsx`, `git mv "src/app/(main)/page.tsx" src/app/cli/page.tsx`, then the empty `(main)` folder removed; the shell is byte-identical (`flex flex-col h-screen … overflow-hidden` wrapper, `flex-grow overflow-auto` main — grep counts 1 / 2 because the file's own comment also names `overflow-auto`).
- `git mv src/app/explore "src/app/(home)"` — the route group contributes nothing to the URL, so the explore shell becomes the primary landing while its before-paint script stays route-scoped.
- CLI metadata added to `src/app/cli/layout.tsx` (title + description identical to the root's today → zero visual delta).
- Landing metadata declares Open Graph + Twitter EXPLICITLY (`grep -c openGraph` = 1, `grep -c twitter` = 1); the base URL, GA, JSON-LD and viewport all stay in the root layout (`grep -c metadataBase` = 0 on the landing).
- Link rewires: welcome link → `/`, `explore` command → `/`, header Terminal link → `/cli`, `EXPLORE_TOUR_FINISH.linkHref` → `/cli`, `EXPLORE_STATUS_PATH` → `:~`, and the declared 6th site `not-found.tsx` "Return to Terminal" → `/cli`.

**Route ordering note (house gate).** `npm run typecheck` reads the generated `.next/types`; after a route move those are stale and `tsc --noEmit` fails with five `TS2307` errors naming the deleted `src/app/explore/*` and `src/app/(main)/*` modules. Running `npm run build` first regenerates them and `npm run typecheck` then exits 0. The plan's pinned verify command puts typecheck first, so the recorded order is build → typecheck → suite; no source or config fix is implied, and CI (which runs `npm run build` only) is unaffected. This will recur for plan 02 only if it re-runs typecheck before a build on this same tree — it does not move routes.

Intermediate state after Task 2 (verbatim): `ℹ tests 14 / ℹ pass 11 / ℹ fail 3` — the only failures are row 7's chip half, row 8, and composite leg 5, exactly as the plan predicted.

## Task 3 — the chip, full GREEN on record

`rm -rf out && npm run typecheck && npm run build && node --test tests/route-swap.test.mjs; echo "exit=$?"` → **exit 0**:

```
✔ row 1 … ✔ row 14   (14 rows, all pass)
ℹ tests 14 / ℹ suites 0 / ℹ pass 14 / ℹ fail 0 / ℹ cancelled 0 / ℹ skipped 0
```

`npm run typecheck` exit 0 · `npm run build` exit 0.

**Build route table (the build's own output):**

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    69.7 kB         194 kB
├ ○ /_not-found                            131 B         103 kB
├ ○ /cli                                 4.51 kB         107 kB
└ ○ /resume                              12.8 kB         126 kB
```

`/` is the explore shell (69.7 kB), `/cli` is the CLI leaf (4.51 kB), and `/explore` is gone from the table.

**SSR contract in `out/index.html`** (the chip's own emitted anchor, verbatim):

```html
<a href="/cli" target="_blank" rel="noopener noreferrer" aria-label="cli — open the terminal in a new tab" class="inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:opacity-80 sm:h-8">
```

Counts in `out/index.html`: `href="/cli"` × 2 (header Terminal link + chip — UI-SPEC §7 P-9 predicted exactly this, so no single-occurrence assertion is used), `aria-label="cli — open the terminal in a new tab"` × 1, `>cli<` × 1, `0/5 sections visited` × 1. `out/cli.html` carries `explore-shell` × 0 and `System initialized` × 0 (the CLI stays a client-only leaf) and its title is CLI-branded.

## The scoped `/explore` residue reconcile (grep evidence)

- `grep -rl '/explore' out/*.html out/*.txt` → **no output** (Tier A clean: `404.html`, `cli.html`, `cli.txt`, `index.html`, `index.txt`, `resume-export.html`, `resume.html`, `resume.txt` all clean).
- `grep -rl '/explore' out/_next/static/chunks/` → exactly **one** file, `out/_next/static/chunks/app/(home)/page-8be211fc92b36061.js`, whose only occurrence is `~/explore` — the drawer's retained `SheetTitle` (`src/components/explore/explore-drawer.tsx:55`), carried into the landing chunk. **Accepted cosmetic debt, not a defect** (RESEARCH §3.7 / OQ-7; UI-SPEC §9 forbids touching the drawer; `tests/explore-shell.test.mjs:241` pins it). The row asserts `assert.equal(hits, 1)` so a second leak fails loudly; a bare whole-tree zero is unreachable without editing the drawer.
- Pre-swap baseline for the same scan: 4 files (`out/explore.html`, `out/explore.txt`, the old route chunk, and the shared `37.*.js` chunk holding the two old route sentinels).
- `out/explore.html` and `out/explore.txt` do not exist; `out/cli/index.html` does not exist (the `trailingSlash` flip guard).

## Before-paint script placement proof (identifier-based, never the single-sourced literal)

| Assertion | Command | Result |
|---|---|---|
| The landing owns the script | `grep -c 'EXPLORE_THEME_STORAGE_KEY' "src/app/(home)/layout.tsx"` | 2 (import + interpolation) |
| Behaviour present | `grep -n 'classList.remove' "src/app/(home)/layout.tsx"` | line 27: `document.documentElement.classList.remove("dark", "light");` |
| Inlined, ahead of the shell | `grep -n 'dangerouslySetInnerHTML' …` | line 81, before the JSX children slot |
| **Root layout must NOT own it (R-2)** | `grep -c 'EXPLORE_THEME_STORAGE_KEY' src/app/layout.tsx` | **0** |
| …and never strips the CLI's classes | classList pattern against `src/app/layout.tsx` | no match |
| Emitted ahead of the shell markup | index of `classList.remove("dark", "light")` (7504) vs `explore-shell` (7707) in `out/index.html` | script first: **true** |

The storage-key literal `portfolio-explore-theme` exists nowhere but `src/components/explore/constants.ts:34` (measured: `grep -c 'portfolio-explore-theme' src/app/layout.tsx` → 0, and the same on the landing layout), so a literal-grep would be vacuous on both sides; the row asserts the IDENTIFIER and the BEHAVIOUR.

## The declared 6th link site

`src/app/not-found.tsx:105` renders `<Link href="/cli">` with the visible label **"Return to Terminal"**. SPEC/CONTEXT enumerate five sites; this one was found in repo evidence (RESEARCH §3.6 / R-9) and rewired under the SPEC's own wording ("all cross-surface links … verified navigable") plus the `cross-surface-links` discipline. `output: 'export'` emits `out/404.html`, which GitHub Pages serves for every unknown path — **including the now-deleted `/explore`** — so leaving it at `/` would have sent a lost visitor to the explore page while promising the terminal. One token; no test pinned the old value. Pinned as composite leg 6.

## Deviations (recorded, not silently taken)

- **D-1 — commit scope token.** The plan pins `test(phase-12): …` / `feat(phase-12): …` subjects. The ship-time `tdd_audit` gate derives its token as `${phase}-${plan}` zero-padded from the numerics-only plan fields (`@dsh-gsd/bundle` `lib/gates.js:planScope()` × `lib/state.js` `listPlans()` → `phase: String(phaseNum)`), i.e. it regexes `\((12-01)\)`; the plan's literal subject matches **no** scope, which is precisely the phase-10 pathology that forced `skip_gates: ["tdd_audit"]`. Commits therefore use the gate-matching `(12-01)` scope with the plan's pinned wording kept verbatim after the colon, and the first commit is `test(12-01):` — so the gate's first-scope-matching-commit rule is satisfied rather than skipped. **Plan 02/03 are `type: execute`, so the gate evaluates this plan alone**; their own `(phase-12)` pins are outside the gate.
- **D-2 — a fourth and fifth commit.** Comment-only repairs live in their own `docs(12-01)` commit and the SUMMARY/STATE in a fifth, because Task 2 and Task 3 each forbid a test-or-extra file in their commit (`Task 2: exactly the 13 paths, no test file`; `Task 3: git diff --name-only HEAD = exactly two files`). Both task commits satisfy their pins exactly.
  - The `docs(12-01)` repair was forced by plan 02's phase-level invariant (`grep -rn 'out/explore' src/` and `grep -rnE '[[:space:]]/explore[[:space:]]' src/ --exclude=globals.css` must both return nothing outside plan 02's own five files, `constants.ts:2`, and the recorded `globals.css:496` debt). Three comments I had renewed in Task 2 reintroduced those literals; they are reworded with no loss of the recorded rationale.
- **D-3 — rename detection.** `git status --porcelain` reports 3 of the 4 route pairs as renames (`R`) and the `explore/layout.tsx → (home)/layout.tsx` pair as `A` + `D`, because that file's content changed enough (metadata block + comment renewal) to fall below git's index-level similarity threshold. `git show --stat --no-renames HEAD` for the Task-2 commit lists exactly the 13 planned paths and no test file; with rename detection on it reports 10 entries (3 renames + 1 add + 1 delete + 5 edits) instead of the plan's predicted 9. Same 13-path commit either way.
- **D-4 — test-vs-comment interaction (found by the red/green loop, fixed in source).** Two of my own rows assert on RAW source text, so my renewal comments tripped them: the landing layout's comment naming `{children}` broke the script-ahead-of-children index comparison, and a comment naming the metadata base token broke `!landing.includes(<token>)`. Both were fixed by rewording the comments (the implementation file I was already editing), **not** by softening the rows — the intended contracts (script ahead of the shell markup; the landing does not declare the base URL) are asserted unchanged. The same class of collision was avoided in the chip by not writing the router-primitive import path in the component's comment.
- **D-5 — `MainLayout` keeps its name.** `src/app/cli/layout.tsx`'s default export is still named `MainLayout`: the plan pins the move as byte-identical apart from the metadata, and no acceptance row or gate asks for a rename. Recorded as intentional, not an oversight.

## Merge hold (mandatory — carried verbatim in meaning)

This plan's own acceptance suite ends green, but the five pre-existing export-reading suites (plus two source-literal suites) are **knowingly RED** here because they still read the deleted `out/explore.html` artifact or pin the old route literals. Measured on this tree, `node --test tests/*.test.mjs`:

```
ℹ tests 289 / ℹ pass 251 / ℹ fail 38 / ℹ skipped 0     (exit 1)
```

The 38 failures are confined to exactly the declared suites and to stale route literals — no unexpected suite is red:

| Suite | Failing rows |
|---|---|
| `tests/explore-shell.test.mjs` | 10 |
| `tests/explore-sweep.test.mjs` | 9 |
| `tests/explore-visuals.test.mjs` | 6 |
| `tests/explore-routing.test.mjs` | 4 |
| `tests/credentials-panel.test.mjs` | 4 |
| `tests/explore-tour.test.mjs` | 3 |
| `tests/explore-header.test.mjs` | 2 |

`npm run build` (the only CI gate, `.github/workflows/deploy.yml`) **is** green here; the local suite is not. **The branch must NOT be merged, pushed, or handed off as green until plan 02's `npm run build && node --test tests/*.test.mjs` full-suite run is on record.** Claiming otherwise would be false.

## Known Stubs

None. No `TODO`/`FIXME`/`PLACEHOLDER` marker and no skipped test was introduced: `grep -rniE 'TODO|FIXME|PLACEHOLDER|XXX'` over the plan's changed files returns only the false positive `isAutoDownload` in the untouched `TerminalInterface.tsx` download logic, and the new suite contains zero `skip`/`todo` calls (`node --test` reports `skipped 0` on every run above).

Two deliberate, recorded non-fixes (accepted debt, not stubs):

1. `explore-drawer.tsx:55`'s `~/explore` `SheetTitle` — the single permitted `/explore` occurrence, pinned by the suite at exactly 1 (RESEARCH §3.7 / OQ-7, UI-SPEC §9).
2. `src/app/globals.css:496`'s stale route prose — UI-SPEC §9 forbids editing that file this phase; plan 02 records it as accepted debt.

## Threat Flags

- **Reverse tabnabbing on the chip — HANDLED.** The phase's only new `target="_blank"` control renders `rel="noopener noreferrer"` literally (never computed) in JSX and appears in the built `out/index.html`; asserted at source level and in the export (row 8, composite leg 5).
- **Theme-script blast radius — HANDLED (the phase's highest-severity risk, R-2).** The `localStorage`-writing script stays route-scoped to the landing; the root layout — shared with `/cli` and `/resume` — contains neither the identifier nor the class strip, so no other surface has its `<html>` classes rewritten from the explore key.
- **No new threat surface.** Zero new dependencies (`package.json` dependencies = 39, `recharts` still absent), zero new CSS, no redirect/middleware machinery, no user-, query- or data-derived URL anywhere (the chip's href is a static constant → no open-redirect surface), and no new network or storage key. The phase's edits are 1–3 tokens per link site plus the enumerated route files.

## Self-Check: PASSED

- Created files exist: `tests/route-swap.test.mjs`, `src/app/(home)/layout.tsx`, `src/app/(home)/page.tsx`, `src/app/cli/layout.tsx`, `src/app/cli/page.tsx`. The four old route files do not exist (`!has` asserted by row 1).
- Commits exist and are in TDD order: `833a7d6` `test(12-01)` → `0bacb6a` `feat(12-01)` → `39c721e` `docs(12-01)` → `690ca67` `feat(12-01)` → the SUMMARY/STATE commit. `git show --stat HEAD` on the Task-2 commit lists exactly the 13 planned paths and no test file.
- The committed suite is byte-identical to the one that went green: `git show HEAD:tests/route-swap.test.mjs | diff - tests/route-swap.test.mjs` → identical.
- `src/app/globals.css` is byte-untouched by the phase (`git diff --name-only HEAD -- src/app/globals.css` empty) and the status bar's four pinned chrome tokens (`h-7`/`sm:h-8`/`text-[10px]`/`sm:text-xs`) survive with the footer's class string byte-identical.
- The final full gate run (typecheck + build + this suite) is the chronologically last action of this task; its results are the ones quoted above.
