# Phase 12 — REV-22 Route Swap Sweep Table (D-04, falsifiable)

**Phase:** 12-route-swap-promotion · **Plan:** 03 · **Requirement:** REV-22
**Grid:** exactly 8 rows — {375, 768, 1440, 1920} × {/ , /cli} — one row per {breakpoint × route}, replacing phase 05's {/ , /explore} grid because `/explore` no longer exists to sweep.

## Legend

### Check taxonomy (D-04, RESEARCH §1.8)

- **P — programmatic/static:** a source-invariant or arithmetic check implemented in a `node --test` suite. Every P row cites its owning test file; every check in this phase's suites comments its sweep row id where the suite predates this table.
- **E — export-level:** asserted against the static export in `out/` after `npm run build` (the three live routes export statically; the header Terminal link and the chip SSR). Owned by `tests/route-swap.test.mjs` rows 10-12 and `tests/explore-sweep.test.mjs` E-1..E-5.
- **M — manual-visual:** rendered appearance only a human can confirm. Every M row is marked `manual — user final pass` per D-04 — these rows are the user's final visual pass, not the executor's claim.

### Disposition rule (OQ-5 — defect ownership)

- A defect **on THIS phase's surfaces** (the landing route files `src/app/(home)/*`, `src/app/cli/layout.tsx`, `src/components/explore/explore-status-bar.tsx`, `src/components/explore/constants.ts`, `src/components/explore/explore-header.tsx`, `src/components/cli/outputs/WelcomeMessage.tsx`, `src/components/cli/TerminalInterface.tsx`, `src/app/not-found.tsx`) → disposition **`fixed`**: red-first fix (write or tighten the owning test BEFORE the code), and the row names its pinning test.
- A defect **inside panels/visualizations/wizard** or any other non-phase surface → disposition **`deferred`**: the row names the out-of-scope surface plus a one-line pointer for a later phase; NOT fixed here (boundary, UI-SPEC §9 + CONTEXT deferred list).
- No defect → **`pass`** (M rows additionally carry the manual marker, and are never recorded as `pass` by the executor).

### Row owners

- `tests/route-swap.test.mjs` (plan 01) — this phase's new acceptance suite: the route tree (row 1), the CLI shell travelled verbatim (row 2), the landing-not-the-CLI-shell guard (row 3), the route-scoped theme script + the root-layout ban (row 4), the landing metadata (row 5), the six cross-surface link sites (row 6), the breadcrumb + chip constants (row 7), the chip anatomy + status-bar row structure (row 8), the stale quoted-literal sweep (row 9), the export shape (row 10), the SCOPED `out/` residue scan (row 11: `out/*.html` + `out/*.txt` clean, exactly one `out/_next/static/chunks/**` hit), the `og:title` branding (row 12), the six-leg composite (row 13), the dependency pin (row 14).
- `tests/explore-sweep.test.mjs` (renewed by plan 02) — the P structural rows for the panels grid/shell/intro/status-bar tokens and the CLI layout invariants, plus the renewed E-1..E-5 export rows and the six-leg routing composite.
- `tests/explore-shell.test.mjs` (renewed by plan 02) — the landing export frame (`:460`), the breadcrumb/status-bar rows, the before-paint theme-script row and the `h-screen` ban.

## Sweep table

| # | Breakpoint | Route | Check type | Check | Result | Disposition | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | 375 | / | P+M | Panels grid `grid grid-cols-1 gap-4 md:grid-cols-2` (1 col base) · intro strip `min-h-[60px]` reserves the two-line name—title wrap · `.explore-shell` root carries `overflow-x-hidden`, so horizontal scroll is structurally impossible · status-bar right cluster is `flex shrink-0 items-center gap-3` holding theme label · live counter · the new `cli` chip. **Chip arithmetic (recorded as a note, NOT asserted):** 338px used of 351px available in light theme (13px slack; 332px in dark); 362px is the zero-truncation floor for light, so 360px ellipsizes only the LEFT breadcrumb by ~2px. The asserted contract is structural instead — `min-w-0`, `truncate`, `shrink-0`, `whitespace-nowrap` (RESOLVED-WIDTH-TEST). · [M] nothing truncates or wraps in the status row; the chip's inset ring is fully visible when tabbed to | P parts green — `tests/explore-sweep.test.mjs` EXPLORE@375 rows (grid, shell, intro, status-bar tokens) + `tests/route-swap.test.mjs` row 8 (chip anatomy + row-fit guards) all pass in the final 14-suite run (289/289). M part: manual — user final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs EXPLORE@375 (grid, shell, intro, status-bar tokens); tests/route-swap.test.mjs (row 8 chip anatomy + `min-w-0 truncate` / `shrink-0` / `whitespace-nowrap` guards); tests/explore-shell.test.mjs:460+ (landing export frame) |
| 2 | 768 | / | P+M | Panels `md:grid-cols-2` (2 cols) with the phase-9 reflow: row 1 = About+Contact \| Skills, row 2 = Experience full-width (`md:col-span-2`, exactly one span-2 child), row 3 = Projects stack \| Credentials — zero empty cells, zero `md:order-first` (DOM order = visual order) · `md:gap` only: `lg:gap-5` is a gap, never a column count — no `lg:grid-cols-3` anywhere · [M] two-column layout, panel order and reflow at 768 | P parts green — `tests/explore-sweep.test.mjs` EXPLORE@768/1440/1920 rows pass in the final 14-suite run (289/289). M part: manual — user final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs EXPLORE@375/768/1440/1920 (grid + rebalance structure); tests/explore-sweep.test.mjs EXPLORE@375 (md-scoped placement utilities); tests/route-swap.test.mjs (row 3 landing `h-dvh`, no `h-screen`) |
| 3 | 1440 | / | P+M | Same 2-column contract at `lg` — the phase-9 `lg:grid-cols-3` tier is deliberately gone (`tests/route-swap.test.mjs` and `tests/explore-sweep.test.mjs` both assert its absence), so 1440 renders the same 3-row / 2-col composition as 768 · sticky experience stage (`md:sticky md:top-0`) keeps attaching to `<main>`'s scrollport (zero `overflow-*` on the grid chain) · [M] three-column expectation retired — confirm the 2-col reflow reads correctly at 1440 | P parts green — the `lg:grid-cols-3` absence and the sticky/overflow audits pass in the final 14-suite run (289/289). M part: manual — user final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs (no `lg:grid-cols-3`, sticky-breaker audit, 3-row rebalance); tests/route-swap.test.mjs (row 3 shell frame) |
| 4 | 1920 | / | P+M | Full-bleed panels — zero `max-w-` wrapper by design (explore-panels.tsx doc block) · grid stays 2-col at `lg`+ (no third column) · status-bar row has ≥211px slack at `sm:` so nothing truncates · [M] chart/arc/stage stretch at ultra-wide: a defect INSIDE a visualization or the stack is `deferred` per the disposition rule (OQ-5), anything on the status row is `fixed` | P parts green — the `max-w-` absence, the 2-col grid and the shell frame rows pass in the final 14-suite run (289/289). M part: manual — user final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs EXPLORE@1920 (`no max-w- wrapper`, full-bleed); tests/route-swap.test.mjs (row 3 landing shell); tests/explore-sweep.test.mjs (status-bar tokens, unchanged) |
| 5 | 375 | /cli | P+M | Mobile banner renders: ASCII `<pre>` `hidden sm:block`, mobile banner div `sm:hidden` · welcome link-line fit arithmetic: rendered line `[ NEW → visual tour: explore ]` = 30 chars ≤ 42 bound; 30 × ~8.5px ≈ 255px ≤ 359px content width (375 − 2×8px `p-2`) · CLI layout invariants: wrapper `overflow-hidden` (cli/layout.tsx), main `overflow-auto`, output lines `whitespace-pre-wrap` · [M] CLI banner + bracket link render at 375px inside the full-height terminal frame | P parts green — `tests/explore-sweep.test.mjs` CLI@375 rows + `tests/route-swap.test.mjs` row 2 (shell verbatim) pass in the final 14-suite run (289/289). M part: manual — user final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs CLI@375 (mobile banner, welcome-link fit arithmetic); tests/route-swap.test.mjs (row 2 cli shell verbatim); tests/explore-sweep.test.mjs E-3 (welcome client-only → L2-only by design) |
| 6 | 768 | /cli | P+M | ASCII banner visible from 640px (`sm:block`) · CLI layout invariants unchanged (wrapper `overflow-hidden`, main `overflow-auto`, `whitespace-pre-wrap` output) · welcome link-line inherits `text-sm md:text-base`, no size-class override on the line · [M] ASCII banner + bracket link visual at 768 | P parts green — the banner-class and CLI-invariant rows pass in the final 14-suite run (289/289). M part: manual — user final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs CLI@375 vs CLI≥768 (banner classes); tests/explore-sweep.test.mjs CLI@375/768/1440/1920 (layout overflow invariants); tests/route-swap.test.mjs (row 2) |
| 7 | 1440 | /cli | P+M | ASCII banner visible · CLI layout invariants as row 5 · the terminal frame is byte-identical to the pre-swap `/` shell (the move carried `overflow-hidden` / `overflow-auto` / `font-mono` / `'use client'` + `dynamic ssr:false` unchanged) · [M] terminal visual pass at 1440 | P parts green — the CLI layout invariant and shell-verbatim rows pass in the final 14-suite run (289/289). M part: manual — user final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs CLI@375/768/1440/1920; tests/route-swap.test.mjs (row 2 byte-identical move); tests/explore-sweep.test.mjs E-3 |
| 8 | 1920 | /cli | P+M | ASCII banner visible · CLI layout invariants as row 5 · the CLI stays a client-only leaf at its new path — `out/cli.html` carries no SSR'd terminal content (no `System initialized`, no `explore-shell` marker) · [M] terminal visual pass at 1920 | P parts green — the layout-invariant rows and `tests/route-swap.test.mjs` row 10 (export shape) pass in the final 14-suite run (289/289). M part: manual — user final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs CLI@375/768/1440/1920 + E-3 (out/cli.html carries no SSR'd CLI content); tests/route-swap.test.mjs (row 10 `out/cli.html` shape) |

## Export-level (E) rows

_Build record: `rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs` — **typecheck exit 0, build exit 0, test exit 0** on **2026-10-02** (plan-03 Task 1 baseline, re-confirmed by the Task 2 finality run). Build route table verbatim:_

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    69.7 kB         194 kB
├ ○ /_not-found                            131 B         103 kB
├ ○ /cli                                 4.51 kB         107 kB
└ ○ /resume                              12.8 kB         126 kB
+ First Load JS shared by all             103 kB
○  (Static)  prerendered as static content
```

_Suite totals verbatim: `ℹ tests 289 · ℹ suites 0 · ℹ pass 289 · ℹ fail 0 · ℹ cancelled 0 · ℹ skipped 0 · ℹ todo 0` across **14 test files** (`ls tests/*.test.mjs | wc -l` → 14)._

| E# | Check | Result | Evidence |
|---|---|---|---|
| E-1 | The three live routes export statically as `out/index.html`, `out/cli.html`, `out/resume.html`; the deleted route leaves nothing behind and the trailingSlash tripwire holds: `out/explore.html` ABSENT, `out/explore.txt` ABSENT, `out/cli/index.html` ABSENT (a directory form would mean every `/cli` href 404s on GitHub Pages) | pass — `ls out` shows `404.html cli.html cli.txt index.html index.txt resume-export.html resume.html resume.txt robots.txt sitemap.xml _next`; no explore artifact of any kind | tests/route-swap.test.mjs row 10; tests/explore-sweep.test.mjs E-1 |
| E-2 | The header Terminal link SSRs into the LANDING artifact and points at `/cli` — the landing → CLI leg provable at export level | pass — `out/index.html` contains `aria-label="Open the terminal"` and `href="/cli"` | tests/explore-sweep.test.mjs E-2; tests/route-swap.test.mjs row 10 (export token list) + row 13 leg 3 |
| E-3 | The CLI is still client-only at its new path — `out/cli.html` does NOT contain `System initialized` (and carries no `explore-shell` marker). This is why the CLI welcome link and the `explore` command stay source-asserted plus composite-asserted rather than export-asserted | pass — `TerminalInterface` mounts `ssr:false`, so the export legitimately carries no CLI content | tests/explore-sweep.test.mjs E-3; tests/route-swap.test.mjs row 10 |
| E-4 | Zero new dependencies — `package.json` dependencies length still 39 and `recharts` still absent | pass — `node -e` on package.json: `deps 39 recharts undefined`; pinned by two suites | tests/route-swap.test.mjs row 14; tests/explore-sweep.test.mjs E-4 (the same 39-count pin) |
| E-5 | The six-leg two-way composite in ONE assertion set: CLI welcome link + `explore` command → `/`; header Terminal link + wizard finish card + 404 "Return to Terminal" + status-bar chip → `/cli`; the chip additionally `target="_blank"` + `rel="noopener noreferrer"` in BOTH source and export, so no half-rewire can pass | pass — all six legs green in one `test(...)` body in each of the two suites that carries it | tests/route-swap.test.mjs row 13 (six legs, source + export); tests/explore-sweep.test.mjs E-5 (six legs, both directions) |
| E-6 | The landing's social card is explore-branded — the `og:title` meta in `out/index.html` contains `Visual Portfolio Explorer`, while `out/cli.html` carries `Interactive CLI Portfolio` (the §3.4 inheritance trap: a landing layout that declared only `title` would silently keep the root's CLI-branded card) | pass — the landing layout declares `openGraph` + `twitter` explicitly and the built `og:title` reads the explore branding | tests/route-swap.test.mjs row 12; tests/route-swap.test.mjs row 5 (landing layout declares `openGraph` + `twitter`) |
| E-7 | The before-paint theme script is route-scoped and AHEAD of the shell markup — present in `out/index.html` before `explore-shell`, and ABSENT from `src/app/layout.tsx`, so `/cli` and `/resume` keep their own `<html>` theme classes | pass — the root layout references `EXPLORE_THEME_STORAGE_KEY` 0 times and strips no `dark`/`light` classes; the landing layout holds the script and renders it before `{children}` | tests/route-swap.test.mjs row 4 (positive + direct falsifier); tests/route-swap.test.mjs row 10 (script emitted into out/index.html); tests/explore-shell.test.mjs:500 (theme script emitted) |
| E-8 | The `/explore` residue — TWO measured facts, neither a bare whole-tree zero. **Fact (a):** ZERO `/explore` string in any `out/*.html` or `out/*.txt` — `grep -rl '/explore' out/*.html out/*.txt` returns nothing (exit 1) across all 9 documents, which covers the deleted `explore.html` + `explore.txt` and also `out/404.html` (the page GitHub Pages serves FOR the deleted path — it is clean). **Fact (b):** EXACTLY ONE occurrence remains across `out/_next/static/chunks/**` — `grep -ro '/explore' out/_next/static/chunks \| wc -l` → 1, in `out/_next/static/chunks/app/(home)/page-2e94d4a623ffa073.js`, and it is the drawer's retained `~/explore` SheetTitle (`src/components/explore/explore-drawer.tsx:55`). Pre-phase the same scan found 4 artifact files carrying `/explore`: `explore.html`, `explore.txt`, the landing chunk (then `_next/static/chunks/app/explore/page-*.js`, 2 hits: that SheetTitle plus the since-renewed `:~/explore` status path) and the shared `_next/static/chunks/37.*.js` navigate sentinel chunk. Post-build result: 0 in html/txt, 1 under chunks/** — accepted debt per RESEARCH §3.7 / OQ-7 + UI-SPEC §9 ("do not touch the drawer"), not a defect and not a zero | pass — tier (a) 0 files, tier (b) assert-equal-1 file, both green | tests/route-swap.test.mjs row 11 (scoped residue scan: `out/*.html` + `out/*.txt` empty; `assert.equal(hits, 1)` with `explore-drawer.tsx:55` named inline); tests/route-swap.test.mjs row 9 (no stale QUOTED `/explore` route literal survives in `src/`) |

## Manual (M) rows — the user's final visual pass

All 8 M rows are `manual — user final pass`: rendered appearance only a human can confirm. The P/E machinery behind them is green (289/289 across 14 suites + the 8 E rows); these eight checks close the sweep. **The chip's new-tab behaviour is part of the user's pass** — middle-click/⌘-click AND `Enter` on the focused chip must both open `/cli` in a new tab.

| M# | Breakpoint | Route | Manual check |
|---|---|---|---|
| M-1 | 375 | / | IDE shell renders one column; the status bar reads `guest@tasostilsi:~` and the right cluster ends with the `cli ↗` chip |
| M-2 | 768 | / | Two-column reflow: [About+Contact \| Skills] / [Experience full-width] / [Projects stack \| Credentials], zero empty cells |
| M-3 | 1440 | / | The 2-col composition still reads correctly at `lg` (the retired 3-column tier is intentional); the sticky experience stage pins while scrolling |
| M-4 | 1920 | / | Full-bleed panels stretch without distortion, clipped labels or cramming; the status row has plenty of slack |
| M-5 | 375 | /cli | Terminal renders in its full-height frame with the MOBILE banner (ASCII hidden); the welcome bracket line fits on one line |
| M-6 | 768 | /cli | ASCII banner visible from 640px; the terminal frame scrolls inside `main` only |
| M-7 | 1440 | /cli | ASCII banner + terminal chrome visually identical to the pre-swap `/` |
| M-8 | 1920 | /cli | Same, at ultra-wide; no layout shift versus the pre-swap terminal |

Chip-specific M checks folded into M-1..M-4: the chip's **inset** focus ring is fully visible when tabbed to (an offset ring would be clipped by the 28px bar), and at 375px nothing truncates or wraps in the status row.

## Guard row — the phase's negative space (D-05)

**PASS on the phase's own code range.** The plan's literal command uses `git merge-base master HEAD`, which resolves to `b9ed9ab` — an older `master` that predates phases 01–11, so that base is NOT the phase's base and the command is non-empty over it (measured: `package.json`, `public/resume-export.html`, `scripts/generate-static-resume.js`, `scripts/verify-resume-content.js`, `src/data/portfolio-main-data.d.ts`, `src/data/portfolio-main-data.json`). **Recorded deviation:** the phase-12 code range is `2145def..HEAD` (`2145def` = the last pre-phase-12 commit, `docs(phase-12): fold plan-checker …`), 11 commits. Over that range:

```
$ git diff --name-only 2145def..HEAD -- src/data package.json public scripts .github
                                                                  ← EMPTY (exit 0)
$ git diff --stat 2145def..HEAD -- src/app/globals.css
                                                                  ← EMPTY (exit 0)
$ git diff --stat -- src/app/globals.css                          ← EMPTY (exit 0), working tree
```

- **`globals.css` is byte-untouched by the whole phase** (both over the phase range and in the working tree). Its stale route-prose comment at **`src/app/globals.css:496`** is therefore **accepted debt with a UI-SPEC §9 + RESEARCH §9.1/§9.2 pointer** — those two documents forbid editing that file at all in this phase, so the line is not renewed, not even as a comment. No row of this table claims a comment edit to `src/app/globals.css`.
- **The touched-file inventory equals the enumeration in plans 01 + 02's `files_modified` lists.** `git diff --name-only 2145def..HEAD -- src tests` (24 paths, git rename detection collapsing the two byte-identical route moves):
  - source (16): `src/app/cli/layout.tsx`, `src/app/cli/page.tsx`, `src/app/(home)/layout.tsx`, `src/app/(home)/page.tsx`, `src/app/explore/layout.tsx` (deleted), `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/components/cli/outputs/WelcomeMessage.tsx`, `src/components/cli/TerminalInterface.tsx`, `src/components/explore/constants.ts`, `explore-header.tsx`, `explore-shell.tsx`, `explore-status-bar.tsx`, `explore-tour.tsx`, `sections/skills-section.tsx`, `use-explore-theme.ts`
  - tests (8): `tests/route-swap.test.mjs` (new), `tests/credentials-panel.test.mjs`, `tests/explore-shell.test.mjs`, `tests/explore-tour.test.mjs`, `tests/explore-visuals.test.mjs`, `tests/explore-sweep.test.mjs`, `tests/explore-routing.test.mjs`, `tests/explore-header.test.mjs`
  - **No panel, drawer, wizard, arc, stack, credentials or counter source appears**: `explore-drawer.tsx`, `credentials-section.tsx`, `projects-stack-stage.tsx`, `explore-panels.tsx`, `experience-section.tsx` and `use-explore-visited.ts` are all absent from the range. The four comment-only prose files (`explore-shell.tsx`, `use-explore-theme.ts`, `explore-tour.tsx`, `sections/skills-section.tsx`) plus `src/app/layout.tsx` each carry exactly one added `//`/`*` line — comment-only, proved by plan 02's `git diff -U0` dump.
- **No dependency, data, asset or CI change**: `package.json`, `package-lock.json` (outside the enumerated guard paths but checked), `src/data/**`, `public/**`, `scripts/**`, `.github/**` are all untouched over `2145def..HEAD`.

### R-12 perception note (for the ship step)

The deployed site currently lags the repo — the live `/` title still reads `Senior Software Engineer in Test` while the repo data carries the refreshed docx branding. The first deploy after this phase ships the route swap AND the REV-01 data refresh together; the changed landing copy is **not a phase-12 defect**.

## Finality
