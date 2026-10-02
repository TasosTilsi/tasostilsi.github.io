---
phase: 12-route-swap-promotion
verified: 2026-10-02T17:29:07Z
status: human_needed
score: 50/50 must-haves verified
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "M-1 — open / at 375px in a real browser"
    expected: "The explore IDE shell renders in one column; the status bar reads 'guest@tasostilsi:~' and its right cluster ends with the 'cli ↗' chip; nothing truncates or wraps in the status row; tabbing to the chip paints a fully-visible INSET focus ring (an offset ring would be clipped by the ~24.5px bar)."
    why_human: "Rendered appearance at a specific viewport — computed layout, truncation and ring clipping are paint-level results; no DOM/source assertion can prove them. The suite pins the structural guards (min-w-0/truncate/shrink-0/whitespace-nowrap) instead (RESOLVED-WIDTH-TEST)."
  - test: "M-2 — open / at 768px"
    expected: "Two-column reflow: [About+Contact | Skills] / [Experience full-width] / [Projects stack | Credentials], zero empty cells."
    why_human: "Visual grid composition at md and up — only a human can confirm the reflow reads correctly and no cell is empty."
  - test: "M-3 — open / at 1440px"
    expected: "The 2-column composition still reads correctly at lg (the retired 3-column tier is intentional); the sticky experience stage pins while scrolling."
    why_human: "Sticky-scroll behaviour and visual balance at a wide breakpoint are runtime/interaction properties."
  - test: "M-4 — open / at 1920px"
    expected: "Full-bleed panels stretch without distortion, clipped labels or cramming; the status row has plenty of slack."
    why_human: "Ultra-wide visual integrity is a perception judgement."
  - test: "M-5 — open /cli at 375px"
    expected: "The terminal renders in its full-height frame with the MOBILE banner (ASCII banner hidden); the welcome bracket line fits on one line."
    why_human: "The CLI terminal is a client-only dynamic leaf (ssr:false) — the export deliberately contains no SSR'd terminal content, so its hydrated render is only observable in a browser."
  - test: "M-6 — open /cli at 768px"
    expected: "ASCII banner visible from 640px; the terminal frame scrolls inside main only."
    why_human: "Banner breakpoint visibility and scroll containment are runtime rendering facts."
  - test: "M-7 — open /cli at 1440px"
    expected: "ASCII banner + terminal chrome visually identical to the pre-swap /."
    why_human: "Visual identity with the pre-swap terminal requires human comparison."
  - test: "M-8 — open /cli at 1920px"
    expected: "Same at ultra-wide; no layout shift versus the pre-swap terminal."
    why_human: "Ultra-wide rendering + layout-shift comparison are perception checks."
  - test: "Chip new-tab behaviour (part of the M pass, per the sweep table)"
    expected: "Middle-click/⌘-click on the status-bar 'cli' chip AND Enter on the focused chip both open /cli in a NEW tab; the breadcrumb row's own tab is not navigated."
    why_human: "The mechanism is fully asserted (a plain <a href='/cli' target='_blank' rel='noopener noreferrer'> in source AND in out/index.html), but the actual new-tab outcome is browser behaviour and is declared part of the user's final pass."
---

# Phase 12: route-swap-promotion Verification Report

**Verified:** 2026-10-02T17:29:07Z · **Milestone:** Explore Visual Landing (v1.0) · **Requirement:** REV-22
**Method:** fresh-context verification against the tree and the built export. SUMMARY.md claims were not used as evidence; every row below rests on a command run this session.
**Prior verification:** none (first run — no previous VERIFICATION.md, so no re-verification mode).

**Scope disclosure.** The working tree carries two post-phase commits (`c7b45f7` fix(explore): single-scrollbar invariant; `9f4149b` its planning commit) that are a separate quick task, not part of phase 12. They touch `src/app/(home)/layout.tsx` (adds the document-scroll-lock style), `src/components/explore/explore-shell.tsx` (`overflow-hidden`) and some suites including `tests/route-swap.test.mjs`. This verification was run **on the current tree** (phase commits + that quick task), which is the stronger check: every phase truth still holds there. The phase's own final gate ran on the phase tip `b41f914`; both runs are green.

---

## Goal Achievement → Observable Truths

27 truths from the three plans' `must_haves`. Every one is verified by a command run this session, not by a SUMMARY claim.

### Plan 01 truths (route move + rewires)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A failing acceptance suite is on record BEFORE any implementation file is edited | ✓ VERIFIED | `tests/route-swap.test.mjs` committed at `833a7d6` ("add failing route-swap acceptance suite"), which precedes the implementation commit `0bacb6a` (git log order). SUMMARY-01 quotes the RED verbatim: `exit 1`, `tests 14 / pass 1 / fail 13`, each failure the named missing-path/chip message — no ENOENT, no SyntaxError. |
| 2 | `/` renders the explore visual experience and `out/index.html` carries the explore-shell marker | ✓ VERIFIED | Build route table emits `○ /`; `out/index.html` contains `explore-shell`, `guest@tasostilsi`, `:~`, `0/5 sections visited`, `aria-label="Open the terminal"`, `href="/cli"`. Independent greps + `node --test tests/route-swap.test.mjs` row 10 pass. |
| 3 | `/cli` renders the CLI terminal in its existing h-screen overflow-hidden frame | ✓ VERIFIED | `src/app/cli/page.tsx` is **byte-identical** to the pre-swap `src/app/(main)/page.tsx` (independent `diff` against `git show 2145def:…`). `src/app/cli/layout.tsx` differs from the pre-swap layout ONLY by an added `metadata` block + its imports (additions only; no shell line removed) and still carries `flex flex-col h-screen … overflow-hidden` + `<main … overflow-auto>`. Build emits `○ /cli`. The hydrated terminal's visible render is the M-5…M-8 human pass (client-only leaf by design). |
| 4 | `/explore` no longer exists: no route folder, no `out/explore.html`, no `out/explore.txt`, no `/explore` in any `out/*.html` or `out/*.txt`, and exactly ONE occurrence across the whole `out/` tree (the drawer's retained `~/explore`) | ✓ VERIFIED | `find src/app` shows no `explore/` and no `(main)/`. `ls out/` has no `explore.*`. Independent residue scan: `grep -l '/explore' out/*.html out/*.txt` → **0 files**; `grep -ro '/explore' out/_next/static/chunks/` → **1**, in `out/_next/static/chunks/app/(home)/page-*.js`, whose sole occurrence is `children:"~/explore"` — the `SheetTitle` of `src/components/explore/explore-drawer.tsx:55`, the declared accepted debt (RESEARCH §3.7/OQ-7, UI-SPEC §9). `assert.equal(hits, 1)` in row 11 is count-exact, so a second leak fails loudly. |
| 5 | Every cross-surface link resolves to the surface it names (6 sites) | ✓ VERIFIED | Independently grepped at source: `WelcomeMessage.tsx:71 <Link href="/">`; `TerminalInterface.tsx:297-298 case "explore": return { navigate: "/" }`; `explore-header.tsx:107 href="/cli"`; `EXPLORE_TOUR_FINISH.linkHref = "/cli"` (`constants.ts:122`, consumed by `explore-tour.tsx:435`); `explore-status-bar.tsx:72 href=/cli`; `not-found.tsx:105 href="/cli"`. Export-level: `out/index.html` carries `href="/cli"` (×2) and `aria-label="Open the terminal"`. Row 13 (six-leg composite) passes. |
| 6 | Breadcrumb renders `guest@tasostilsi:~` and the right cluster is theme label → live counter → new `cli` chip that opens `/cli` in a NEW tab (`target="_blank" rel="noopener noreferrer"`) | ✓ VERIFIED | `constants.ts:49 EXPLORE_STATUS_PATH = ":~"`; `constants.ts:62-66 EXPLORE_STATUS_CLI_LINK = { label: "cli", href: "/cli", ariaLabel: "cli — open the terminal in a new tab" }`. `explore-status-bar.tsx:71-83` renders a plain `<a>` with literal `target="_blank"` and `rel="noopener noreferrer"`. `out/index.html` contains `guest@tasostilsi`, `:~`, `target="_blank"` and `rel="noopener noreferrer"` (independent greps). Rows 7/8/10/13 pass. |
| 7 | The before-paint theme script runs on the landing route only, ahead of the shell markup, and is NOT present in `src/app/layout.tsx` | ✓ VERIFIED | `grep -c 'portfolio-explore-theme' src/app/layout.tsx` → **0**; the identifier lives in `(home)/layout.tsx:24-32` as the first child. Export ordering: `portfolio-explore-theme` at byte 7450, `classList.remove("dark","light")` at 7504, `explore-shell` at 7774 → script strictly ahead of the shell markup. Row 4 + row 10 pass. |
| 8 | The landing's social metadata is explore-branded — `out/index.html`'s `og:title` carries `Visual Portfolio Explorer` | ✓ VERIFIED | Independent grep: `<meta property="og:title" content="Anastasios Tilsizoglou \| Test Automation Architect \| Principal Test Automation Engineer \| Visual Portfolio Explorer">`; `<title>` matches. `(home)/layout.tsx:74-98` declares `openGraph` + `twitter` explicitly (the §3.4 inheritance trap is closed). `out/cli.html` carries `… \| Interactive CLI Portfolio`. Row 12 passes. |
| 9 | The four pinned chrome tokens are unchanged, `aria-live="polite"` stays on the counter `<p>`, and the chip sits outside that live region | ✓ VERIFIED | `explore-status-bar.tsx:38` keeps `h-7 … sm:h-8 … text-[10px] … sm:text-xs`; `:47` is the `aria-live="polite"` `<p>` wrapping theme + counter; `:43` right-cluster `<div>` holds the counter `<p>` and then the chip anchor — chip outside the live region. Row 8 passes; `explore-sweep` status-bar token rows pass. |
| 10 | No behavioural change lands on either surface: zero new deps (39 keys), no new CSS rule in `globals.css`, CLI commands/themes/achievements and explore arc/stack/credentials/drawer/wizard/counter untouched | ✓ VERIFIED | `git diff --name-only 2145def..b41f914 -- src/data package.json public scripts .github` → **EMPTY**; `git diff --stat 2145def..b41f914 -- src/app/globals.css` → **EMPTY** (byte-untouched). The 5-file prose sweep (`64c263c`) is **comment-only** — diff filtered to non-comment lines is empty, 5 insertions/5 deletions. `route-swap` row 14 asserts 39 dependency keys and no recharts; passes. CLI page byte-identical (row 3 above); the feature sources (panels, drawer, wizard, arc, stack, credentials, counter) appear nowhere in the phase's touched-file inventory. |
| 11 | The 375px invariant holds on BOTH new paths by structure | ✓ VERIFIED | Landing shell root: `explore-shell flex h-dvh flex-col overflow-hidden …` (no horizontal scroll structurally possible); status bar keeps `min-w-0 truncate` on the breadcrumb `<p>` and a `shrink-0` right cluster with `whitespace-nowrap` on the counter. `explore-sweep` rows `EXPLORE@375`/`CLI@375` (grid-cols-1 base, md-scoped utilities, shell overflow, welcome-line fit arithmetic, CLI overflow invariants) all pass. |
| 12 | No redirect machinery is introduced | ✓ VERIFIED | No `middleware.ts`/`src/middleware.ts`; `next.config.ts:5` is still plain `output: 'export'` with **no `trailingSlash`**; no stub route; `src/app/explore/` is deleted outright. `out/cli/index.html` absent (trailingSlash tripwire asserted in `explore-sweep` E-1). |

### Plan 02 truths (test/sweep renewal)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 13 | The stale-suite RED is observed and recorded before it is repaired | ✓ VERIFIED | SUMMARY-02 §(a) quotes the verbatim ENOENT RED (`ℹ fail 10`, `AssertionError: out/explore.html missing — run npm run build first`) captured BEFORE the repath, and §(b) the semantic RED of the three route-target suites (`ℹ fail 15`) captured before their edit. Both were re-observed implicitly by the phase's own merge-hold narrative; SUMMARY-01 §"intermediate state" (`pass 11 / fail 3`) corroborates the red→green progression. |
| 14 | The full house gate passes: typecheck + build + all 14 suites green | ✓ VERIFIED | Run this session on the current tree: `npm run typecheck` exit **0**; `npm run build` exit **0** (route table `/`, `/_not-found`, `/cli`, `/resume`, all static); `node --test tests/*.test.mjs` exit **0** with `ℹ tests 289 / pass 289 / fail 0` across 14 files. |
| 15 | No pre-existing suite reads the deleted artifact or a deleted source route | ✓ VERIFIED (with a recorded deviation — see Deviations) | A read-specific grep (`readFileSync|read(` filtered to `out/explore`) returns **NONE**. `grep -rn 'src/app/explore\|src/app/(main)' tests/ --exclude=route-swap.test.mjs` → **nothing**. The truth's printed grep predicate is over-broad: `grep -rn 'out/explore.html' tests/ --exclude=route-swap.test.mjs` actually returns 2 lines (`tests/explore-sweep.test.mjs:259-260`) — both are `!existsSync(...)` NEGATIVE absence assertions that the SAME plan (task 2, E-1) explicitly required. The operative clause ("no read") holds; the printed check cannot. |
| 16 | The renewed composite pins both directions + the 404 leg + the chip leg in ONE assertion set | ✓ VERIFIED | `tests/explore-sweep.test.mjs` E-5 "two-way routing loop composite — all six legs in one assertion set" passes; `tests/route-swap.test.mjs` row 13 is the same six-leg contract. Independent grep confirms the 404 leg (`not-found.tsx`) is present. |
| 17 | The CLI-side export row reads the CLI's real artifact (`out/cli.html` asserted free of SSR'd CLI content) and `out/resume.html` is still asserted | ✓ VERIFIED | `explore-sweep` E-3 passes against `out/cli.html`; independent grep: `grep -c 'System initialized' out/cli.html` → **0**. `out/resume.html` emitted and asserted. |
| 18 | Two stale-source-path traps are closed: an explicit landing-page existence assertion, and `out/cli/index.html` asserted absent | ✓ VERIFIED | `tests/explore-shell.test.mjs:104` carries `'landing page present — the h-screen guard must not silently degrade'` immediately before the `.filter(existsSync)` list (closes P-1/R-4). `tests/explore-sweep.test.mjs:270-271` asserts `!existsSync(join(root, 'out/cli/index.html'))` (R-8 trailingSlash tripwire). |
| 19 | Every remaining `/explore` reference in `src/` is a legitimate class; the only residual is `globals.css:496` as accepted prose debt | ✓ VERIFIED | `grep -rnE '[[:space:]]/explore[[:space:]]' src/ --exclude=globals.css` → **nothing**; `grep -rn 'out/explore' src/` → **nothing**. Remaining `/explore` hits in `src/` are directory paths (`src/components/explore/…`), relative import specifiers, the drawer's deliberate `~/explore` title, and `src/app/globals.css:496` — the declared accepted debt. |
| 20 | The prose sweep is comment-only and `globals.css`-free; `src/app/globals.css` is byte-untouched by the entire phase | ✓ VERIFIED | Commit `64c263c` touches exactly 5 files with 5 insertions/5 deletions; filtering its diff to non-comment lines yields **empty**. `git diff --stat 2145def..b41f914 -- src/app/globals.css` → **EMPTY**, and the post-phase quick task did not touch it either. |

### Plan 03 truths (sweep table + finality)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 21 | The breakpoint matrix is renewed to exactly 8 rows — {375, 768, 1440, 1920} × {/ , /cli} | ✓ VERIFIED | `grep -c '^\| [1-8] \|' …-SWEEP.md` → **8**; the table names the two routes across the four breakpoints, replacing phase 05's {/ , /explore} grid. |
| 22 | Every one of the 8 rows carries the taxonomy marker and, for its manual half, the exact phrase `manual — user final pass`; no M row is recorded as `pass` | ✓ VERIFIED | `grep -c 'manual — user final pass' …-SWEEP.md` → **10** (≥8); the Manual section states all 8 M rows are the user's final visual pass and none is upgraded. |
| 23 | The export section records the real artifact facts from a fresh build, including the TWO-TIER residue (0 in `out/*.html` + `out/*.txt`; exactly 1 under `out/_next/static/chunks/**`) | ✓ VERIFIED | Table has 8 `E-` rows. `grep -c 'out/_next/static/chunks'` → ≥1; `grep -c 'explore-drawer'` → 2; the E-8 row names the single accepted hit and does not report a whole-tree zero. Independently confirmed by my own scan (0 files / 1 occurrence) and by `route-swap` row 11. |
| 24 | Chip width arithmetic is recorded as a note while the ASSERTED contract stays structural (no estimated-px assertion) | ✓ VERIFIED | `grep -c '338'` → 1 and `grep -c '362'` → 1 in the sweep table (the 338/351 and 362px figures, recorded as arithmetic); the same row names `min-w-0`/`truncate`/`shrink-0`/`whitespace-nowrap` as the asserted guards. No suite gained an estimated-px assertion (the phase's test diffs are literal renewals + structural guards). |
| 25 | The guard row proves the negative space with a git inventory | ✓ VERIFIED | The table carries `git diff --stat 2145def..HEAD -- src/app/globals.css` → EMPTY. I re-ran the inventory independently: `git diff --name-only 2145def..b41f914` = 30 paths, all planning artefacts plus exactly the plans' `files_modified`; `src/data`, `package.json`, `public`, `scripts`, `.github` → EMPTY; `globals.css` → EMPTY. |
| 26 | The final full gate is the LAST action on a frozen tree | ✓ VERIFIED | The Finality section records `git status --porcelain -- src tests` EMPTY before the run, the verbatim command sequence with exit 0/0/0, the build route table, `289/289`, and a **post-commit re-run** (checker W-3) after the commit that carries the section. My own re-run on the later tree (which includes the post-phase quick task) is also exit 0/0/0. |
| 27 | The R-12 perception trap is recorded for the ship step | ✓ VERIFIED | `grep -c 'not a phase-12 defect' …-SWEEP.md` → **1**, in the sense required: the deployed site lags the repo, and the first deploy ships the route swap AND the REV-01 data refresh together. |

---

## Score

**50/50 must-haves verified** — 27 truths ✓, 11 artifacts ✓, 12 key links ✓. `behavior_unverified: 0`. No `overrides_applied`.

All automated must-haves pass. The phase is **not** `passed` because its own sweep table declares 9 human-verification items that no agent can claim (8 breakpoint rows + the chip's new-tab behaviour) — see Human Verification Required.

---

## Deferred Items

Filtered against the roadmap: **phase 12 is the last phase of milestone v1.0** (ROADMAP lists 12 phases, none after 12), so nothing here can be deferred into a later milestone phase. Both residuals are therefore in-phase *accepted debt* with pointers, exactly as the plans record them.

| Item | Disposition | Pointer |
|---|---|---|
| The drawer's `~/explore` `SheetTitle` (`src/components/explore/explore-drawer.tsx:55`) still reads `~/explore` while the breadcrumb reads `:~` | **Accepted cosmetic debt → a future chrome pass.** Not a defect: it is the SINGLE `/explore` occurrence the residue scan permits, pinned count-exact by `tests/route-swap.test.mjs` row 11 (`assert.equal(hits, 1)`). | RESEARCH §3.7 / OQ-7; UI-SPEC §9 ("do not touch the drawer"); `tests/explore-shell.test.mjs:241` pins the string. |
| The stale route prose at `src/app/globals.css:496` ("Dark IDE theme is the default for the /explore shell") | **Accepted prose debt, NOT renewed** — not even as a comment, because editing `globals.css` at all is forbidden in this phase. File is byte-untouched across the phase range (verified independently). | UI-SPEC §9; RESEARCH §9.1/§9.2; recorded in the sweep table's guard row. |
| `PRODUCT.md` (untracked) still describes `/explore` as the visual surface | **Out of the tracked deliverable** — optional doc-hygiene follow-up. | RESEARCH R-11 / OQ-13. |
| `public/sitemap.xml` `<lastmod>` carries a literal un-evaluated template string | **Pre-existing bug, out of scope** — its single `<loc>` already points at the new landing. | RESEARCH §2.6 / OQ-12; CONTEXT deferred list. |

---

## Required Artifacts

All 11 artifacts: **exists ✓ · substantive ✓ · wired ✓**.

| Artifact | min_lines / exports | Actual | Wired | Verdict |
|---|---|---|---|---|
| `tests/route-swap.test.mjs` | 120 | **533** lines, 14 named rows | Run in the suite — 14/14 pass; reads the real build output | ✓ |
| `src/app/(home)/layout.tsx` | 45 · `metadata`, `default` | **111** lines; both exports present | Consumed by the `/` route; theme script + metadata emitted into `out/index.html` (independent index ordering check) | ✓ |
| `src/app/(home)/page.tsx` | 45 · `default` | **60** lines; `default` present | Build route table emits `○ /`; export carries `explore-shell` | ✓ |
| `src/app/cli/layout.tsx` | 22 · `metadata`, `default` | **42** lines; both exports present | Shell wrapper SSR'd into `out/cli.html`; `../globals.css` resolves | ✓ |
| `src/app/cli/page.tsx` | 20 · `default` | **25** lines; byte-identical to pre-swap `(main)/page.tsx` | Dynamic `ssr:false` leaf mounts at `/cli` | ✓ |
| `src/components/explore/explore-status-bar.tsx` | 48 · `ExploreStatusBar` | **86** lines; export present | Rendered by the shell; chip + breadcrumb emitted into `out/index.html` | ✓ |
| `src/components/explore/constants.ts` | `EXPLORE_STATUS_PATH`, `EXPLORE_STATUS_CLI_LINK`, `EXPLORE_TOUR_FINISH` | all 3 exports present | Imported by the status bar (chip), the tour card (finish href), the landing layout (theme key), and asserted directly by the suites | ✓ |
| `tests/explore-sweep.test.mjs` | 380 | **449** lines | Run — green | ✓ |
| `tests/explore-shell.test.mjs` | 500 | **516** lines | Run — green | ✓ |
| `tests/explore-routing.test.mjs` | 220 | **213** lines — 7 short of the declared heuristic | Run — green; delivers its stated provides (`href="/"` rows at :74/:96/:115, `linkHref '/cli'` at :210-211) | ✓ (substantive + wired; the `min_lines` figure is a plan estimate — the file was 213 lines BEFORE the phase too, so no content was lost. See Deviations.) |
| `…-SWEEP.md` | 45 | **148** lines, 8 grid rows + 8 E rows + M section + guard + Finality | Cited by every row's Evidence column; contains the real build baseline | ✓ |

---

## Key Link Verification

All 12 declared key links: **WIRED**.

| # | From → To | Via (declared) | Verdict | Evidence |
|---|---|---|---|---|
| 1 | `tests/route-swap.test.mjs` → `out/index.html` + `out/cli.html` | export rows read the built artifacts | **WIRED** | Rows 10-13 read both artifacts; verified against a fresh `npm run build` this session. |
| 2 | `constants.ts` → `explore-status-bar.tsx` | `EXPLORE_STATUS_CLI_LINK` single-sources the chip | **WIRED** | `explore-status-bar.tsx:24` imports it; `:72/:75` consume `.href`/`.ariaLabel`; `:78` consumes `.label`. No inline `/cli` literal in the component. |
| 3 | `(home)/layout.tsx` → `constants.ts` | the before-paint script interpolates `EXPLORE_THEME_STORAGE_KEY` | **WIRED** | `(home)/layout.tsx:3` imports it; `:26` interpolates it into the script string; the emitted `out/index.html` contains `portfolio-explore-theme` at byte 7450. |
| 4 | `cli/page.tsx` → `TerminalInterface.tsx` | `dynamic(…, { ssr: false })` keeps the CLI client-only | **WIRED** | `cli/page.tsx:8-15`; `out/cli.html` contains no `System initialized` (grep → 0), proving the leaf stayed client-only. |
| 5 | `cli/layout.tsx` → `globals.css` | relative `../globals.css` import still resolves | **WIRED** | `cli/layout.tsx:8`; the build compiles and emits CSS (`out/_next/static/css`) with no unresolved-import error. |
| 6 | `constants.ts` → `explore-tour.tsx` | `EXPLORE_TOUR_FINISH.linkHref` drives the finish card | **WIRED** | `explore-tour.tsx:435 <Link href={EXPLORE_TOUR_FINISH.linkHref}>`; asserted directly by `explore-sweep` leg 4 and `route-swap` row 13. |
| 7 | `explore-sweep.test.mjs` → `constants.ts` | imports `EXPLORE_TOUR_FINISH`, asserts `linkHref === '/cli'` | **WIRED** | Suite passes; independent grep of the assertion. |
| 8 | `explore-shell.test.mjs` → `out/index.html` | export reader repointed from the deleted `out/explore.html` | **WIRED** | `const exportHtml = join(root, 'out/index.html')`; the suite's export rows pass green. |
| 9 | `explore-sweep.test.mjs` → `src/app/cli/layout.tsx` | CLI overflow-invariant row reads the new layout path | **WIRED** | The `sweep rows CLI@375/768/1440/1920` test passes and asserts `overflow-hidden` + `overflow-auto`. |
| 10 | `…-SWEEP.md` → `tests/route-swap.test.mjs` | every P/E row's Evidence cites its owning falsifier | **WIRED** | `grep -c 'tests/route-swap.test.mjs'` ≥1; the row-owners block names the suite. |
| 11 | `…-SWEEP.md` → `out/index.html` | build record + E rows cite the rebuilt artifacts | **WIRED** | The Finality section quotes the real route table and `289/289`; I reproduced both. |
| 12 | `…-SWEEP.md` → phase-05 SWEEP | same taxonomy, same 8-row shape, renewed route axis | **WIRED** | Same P/E/M legend, same disposition rule, same 8-row grid with {/ , /cli}. |

---

## Data-Flow Trace

The phase is a **route/link rename**, not a data change, so the trace is about the link paths and the metadata chain rather than new data plumbing.

1. **Portfolio data is untouched.** `src/data/portfolio-main-data.json` does not appear in `git diff --name-only 2145def..b41f914`. EXPLORE-07 survives: the landing page still reads the JSON at build time (`(home)/page.tsx:41`) and passes it through `ExploreShell` → `ExplorePanels`.
2. **Metadata is data-driven.** `(home)/layout.tsx:2` imports the same JSON and derives `title`/`og:title`/`twitter:title` from `portfolioData.about.name` + `about.title` — confirmed end-to-end in `out/index.html`, which carries the refreshed REV-01 branding (`Test Automation Architect | Principal Test Automation Engineer | Visual Portfolio Explorer`). `cli/layout.tsx` derives its own CLI-branded title from the same JSON, confirmed in `out/cli.html`.
3. **Chrome values flow from one derivation site.** `EXPLORE_STATUS_PATH`, `EXPLORE_STATUS_CLI_LINK` and `EXPLORE_TOUR_FINISH` live in the plain-TS `constants.ts` and are consumed by the status bar, the tour card and the suites — no duplicate `/cli` literal is inlined into a component, and the tests import the constant directly rather than parsing JSX (so the leg-4 assertion cannot drift from the render).
4. **The chip's href is static** (a module constant), so the anchor has no open-redirect surface and works with JS disabled; it is a plain `<a>`, never a router `Link` — verified in source and in the export.
5. **No orphaned consumer of the old route.** Independent greps find no `href="/explore"`, no `{ navigate: "/explore" }`, no `out/explore` read in `src/` or the pre-existing suites; the only `/explore` string left in the artifact is the drawer's title (accepted debt) — so no data path can still point at the deleted surface.

---

## Behavioral Spot-Checks

Commands run this session against the real tree; none of these results is quoted from a SUMMARY.

| Check | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | **exit 0** |
| Build (the only CI gate) + export | `rm -rf out && npm run build` | **exit 0**; route table `○ /`, `○ /_not-found`, `○ /cli`, `○ /resume` — all static; no `/explore` node |
| Phase acceptance suite | `node --test tests/route-swap.test.mjs` | **14/14 pass**, exit 0 |
| Renewed route + export suites | `node --test tests/explore-sweep.test.mjs tests/explore-shell.test.mjs tests/explore-routing.test.mjs tests/explore-header.test.mjs` | **66/66 pass**, exit 0 |
| Full house gate suite | `node --test tests/*.test.mjs` | **`ℹ tests 289 · pass 289 · fail 0`**, exit 0, 14 files |
| Export shape | `ls out/` | `index.html`, `cli.html`, `cli.txt`, `index.txt`, `resume.html`, `resume-export.html`, `404.html`, `robots.txt`, `sitemap.xml`, `_next/` — **no `explore.*`**, no `cli/` directory |
| Residue, tier A | `grep -l '/explore' out/*.html out/*.txt \| wc -l` | **0** |
| Residue, tier B | `grep -ro '/explore' out/_next/static/chunks/ \| wc -l` | **1** — `out/_next/static/chunks/app/(home)/page-*.js`, the drawer's `~/explore` (accepted debt) |
| Breadcrumb + chip in the export | greps on `out/index.html` | `guest@tasostilsi`, `:~`, `target="_blank"`, `rel="noopener noreferrer"` all present |
| Theme script ordering | byte-index comparison in `out/index.html` | script (7450/7504) **before** `explore-shell` (7774) |
| Theme key absent from root layout | `grep -c 'portfolio-explore-theme' src/app/layout.tsx` | **0** |
| og:title branding | grep `out/index.html` / `out/cli.html` | `… \| Visual Portfolio Explorer` / `… \| Interactive CLI Portfolio` |
| CLI stays client-only | `grep -c 'System initialized' out/cli.html` | **0** (as designed — asserted as an absence, not a failure) |
| Phase negative space | `git diff --name-only 2145def..b41f914 -- src/data package.json public scripts .github` | **EMPTY** |
| `globals.css` untouched | `git diff --stat 2145def..b41f914 -- src/app/globals.css` | **EMPTY** |
| Prose sweep is comment-only | `git show 64c263c` filtered to non-comment lines | **EMPTY** (5 files, 5+/5-) |
| No redirect machinery | `ls middleware.ts src/middleware.ts`; `grep trailingSlash next.config.ts` | no middleware; `trailingSlash` unset |
| CLI byte-identity | `diff <(git show 2145def:'src/app/(main)/page.tsx') src/app/cli/page.tsx` | **identical** (layout differs only by added `metadata` block — additions only, shell untouched) |

---

## Requirements Coverage

| REQ-ID | Clause | Delivered | Evidence |
|---|---|---|---|
| **REV-22** | `/` serves the explore visual experience (the primary landing) | ✓ | `○ /` in the build route table; `out/index.html` carries `explore-shell` + the IDE chrome |
| **REV-22** | `/cli` serves the CLI terminal | ✓ | `○ /cli`; `out/cli.html`; `src/app/cli/*` byte-identical to the pre-swap CLI files |
| **REV-22** | `/explore` is deleted (never shipped to GitHub Pages) | ✓ | no route folder; no `out/explore.*`; 0 `/explore` in `out/*.html` + `out/*.txt` (which includes `out/404.html`) |
| **REV-22** | The breadcrumb becomes `guest@tasostilsi:~` | ✓ | `EXPLORE_STATUS_PATH = ":~"`; `:~` present in `out/index.html` |
| **REV-22** | Every cross-surface link rewires: CLI welcome link + `explore` command → `/`; header Terminal link + wizard finish card → `/cli` | ✓ | all four greps + the six-leg composite passing |
| **REV-22** | The status bar gains a `cli` hyperlink opening `/cli` in a NEW tab | ✓ | `EXPLORE_STATUS_CLI_LINK` + literal `target="_blank" rel="noopener noreferrer"`, present in source AND in `out/index.html` |
| **REV-22** | Metadata/suites/sweep renew to the new route names | ✓ | OG/Twitter declare explore branding explicitly; 14 suites green; the 8-row {/ , /cli} sweep table committed |

No requirement in this phase is unmet or partially met.

---

## Anti-Patterns Found

| Class | Result |
|---|---|
| Unreferenced `TBD` / `FIXME` / `XXX` debt markers in the phase-touched files | **NONE** — `grep -rn 'TBD\|FIXME\|XXX'` over `src/app/cli`, `src/app/(home)`, the four explore components, the two CLI components, `not-found.tsx` and `tests/route-swap.test.mjs` returns nothing. No BLOCKER-class debt marker. |
| Stale quoted `/explore` route literal in `src/` | **NONE** — `grep -rn '"/explore"\|/explore"' src/` returns nothing; `route-swap` row 9 enforces this. |
| Softened assertions to reach green | **NONE FOUND** — the phase's test diffs are literal renewals (old target → new target), structural guards, and two HARDENINGS (the explicit landing-page existence assertion, the `out/cli/index.html` tripwire). `assert.equal(hits, 1)` in row 11 was not relaxed. |
| Over-broad assertion (`> 0`) where a count-exact check is needed | **NONE** — the residue row is `assert.equal(hits, 1)` with the single accepted hit named inline. |
| `trailingSlash` regression risk | **Guarded** — asserted absent in both directions (`out/cli.html` exists AND `out/cli/index.html` does not). |

### Plan-declaration deviations (INFO — recorded, not blocking)

Two plan-authored declarations are imprecise about the tree they describe. Neither affects the product deliverable, and both are reported here so nothing is concealed:

1. **Plan 02 truth 3's printed grep predicate is over-broad and self-contradictory.** It requires `grep -rn 'out/explore.html' tests/ --exclude=route-swap.test.mjs` to return nothing, but the same plan (task 2, item E-1) explicitly instructs adding `!existsSync(join(root, 'out/explore.html'))` to `tests/explore-sweep.test.mjs`. Both cannot hold; the executor correctly chose the negative absence falsifier (which is the more valuable artifact and duplicates nothing harmful). The truth's operative clause is satisfied — a read-specific grep proves no pre-existing suite READS the deleted artifact. **Recommended follow-up (non-blocking, future hygiene):** narrow that truth's predicate to a read-specific grep, or move the negative existence rows into `tests/route-swap.test.mjs` where every other absence falsifier already lives.
2. **Plan 02's `min_lines: 220` for `tests/explore-routing.test.mjs` is inaccurate** — the file is 213 lines and was 213 lines before the phase (verified via `git show 2145def:`), so the renewals were literal-for-literal swaps with no content loss. The artifact is substantive and delivers every stated `provides` entry; the heuristic threshold was simply an over-estimate, not evidence of a stub.

---

## Human Verification Required

The phase's own sweep table (`…-SWEEP.md`, "Manual (M) rows") declares **8 M rows as `manual — user final pass`** and states: "these rows are the user's final visual pass, not an executor claim." None has been performed. The chip's new-tab behaviour is explicitly part of that pass. These are the reason the status is `human_needed` rather than `passed` — every automated check is green.

| # | Test | Expected | Why human |
|---|---|---|---|
| 1 | `/` at **375px** | One-column IDE shell; status bar reads `guest@tasostilsi:~` ending with the `cli ↗` chip; nothing truncates or wraps; tabbing to the chip shows a fully-visible **inset** focus ring | Paint-level layout, truncation and ring clipping at a specific viewport |
| 2 | `/` at **768px** | Two-column reflow `[About+Contact \| Skills] / [Experience full-width] / [Projects stack \| Credentials]`, zero empty cells | Visual grid composition |
| 3 | `/` at **1440px** | 2-column composition reads correctly at `lg`; the sticky experience stage pins while scrolling | Sticky/interaction behaviour |
| 4 | `/` at **1920px** | Full-bleed panels stretch without distortion, clipped labels or cramming | Ultra-wide perception |
| 5 | `/cli` at **375px** | Terminal in its full-height frame with the MOBILE banner (ASCII hidden); welcome bracket line fits on one line | The CLI is a client-only leaf (`ssr:false`) — its hydrated render is browser-only |
| 6 | `/cli` at **768px** | ASCII banner visible from 640px; the frame scrolls inside `main` only | Runtime banner breakpoint + scroll containment |
| 7 | `/cli` at **1440px** | ASCII banner + chrome visually identical to the pre-swap `/` | Visual comparison with the pre-swap terminal |
| 8 | `/cli` at **1920px** | Same at ultra-wide; no layout shift | Ultra-wide + layout-shift perception |
| 9 | **Chip new-tab behaviour** | Middle-click/⌘-click AND `Enter` on the focused chip both open `/cli` in a NEW tab; the landing tab is not navigated | The mechanism is fully asserted (`<a href="/cli" target="_blank" rel="noopener noreferrer">` in source and export) but the actual new-tab outcome is browser behaviour, declared part of the user's pass |

---

## Gaps Summary

**No gaps.** Every automated must-have across the three plans is verified against the real tree and the built export:

- **Route swap complete.** `/` = the explore visual experience, `/cli` = the CLI terminal, `/explore` deleted outright. The build's route table, the export artifacts, and the residue scan (0 in `out/*.html` + `out/*.txt`; exactly the 1 declared drawer hit across `out/_next/static/chunks/**`) all agree.
- **All six cross-surface link sites rewired** and locked by a single six-leg composite test, so no half-rewire can pass.
- **The chip is correctly built and safe:** single-sourced href, literal `target="_blank"`, literal `rel="noopener noreferrer"`, inset focus ring, outside the counter's live region, inside the pinned four-token bar.
- **No collateral change:** `globals.css` byte-untouched, `src/data`/`package.json`/`public`/`scripts`/`.github` untouched, dependency count still 39, prose sweep comment-only, CLI shell files unchanged in behaviour.
- **Gate green:** typecheck 0, build 0 (all four routes static), `289/289` tests pass across 14 files on the current tree.
- **No blocker anti-patterns;** two plan-declaration deviations recorded as INFO above.

**Two residuals are accepted debt, not gaps** (the drawer's `~/explore` title and the `globals.css:496` prose line) — both carry their UI-SPEC §9 / RESEARCH §3.7 pointers, and since phase 12 is the final phase of milestone v1.0 there is no later phase to carry them; they belong to a future chrome pass.

**Status is `human_needed`, not `passed`,** solely because the phase's own sweep table requires the user's 8-row visual pass plus the chip's new-tab behaviour — items that no agent can legitimately claim. Once those are confirmed, the phase is ready to ship; the remote-write hold (no push, no PR, no deploy without an explicit per-action user command) continues to apply, and the first deploy will carry both the route swap and the REV-01 data refresh (RESEARCH R-12).
