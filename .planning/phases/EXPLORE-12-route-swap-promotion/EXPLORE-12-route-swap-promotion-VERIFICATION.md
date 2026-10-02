---
phase: 12-route-swap-promotion
verified: 2026-10-02T17:31:36Z
status: passed
score: 50/50 must-haves verified
behavior_unverified: 0
overrides_applied: 0
---

# Phase 12: route-swap-promotion Verification Report

**Verified:** 2026-10-02T17:31:36Z · **Milestone:** Explore Visual Landing (v1.0) · **Requirement:** REV-22
**Method:** fresh-context verification against the real tree and a freshly rebuilt export. Every row below rests on a command run in this session; SUMMARY.md claims were **not** used as evidence (the one process truth that is only observable in the past — the TDD ordering — is corroborated by git history and by the pre-repair file content, both quoted below).
**Prior verification:** a previous `…-VERIFICATION.md` existed with `status: human_needed` and **no `gaps:` block**, so this is **not** gap re-verification mode — nothing was previously failed. The prior run's only open items were the human sweep rows, which the user then performed and recorded (commit `236dce0`, `status_human: approved`). That record is the input to §Human Verification Required below; it is the user's own verdict, not an executor claim.

**Scope disclosure (recorded, not hidden).** The tree carries a post-phase quick task — `c7b45f7` (single-scrollbar invariant) and its planning commit `9f4149b` — which is **not** phase 12. It changes the landing shell root from `overflow-x-hidden` to `overflow-hidden`, adds a route-scoped document scroll lock to `src/app/(home)/layout.tsx`, and renews `tests/route-swap.test.mjs` row 3 accordingly (see Deviation D-2). This verification was run on the **current tree** (phase tip `b41f914` + that quick task + the human-approval commit), which is the stronger check: every phase truth still holds there, and the single-scrollbar work tightened the 375px invariant rather than weakening it.

**Gate run this session (the finality gate, covering the current workspace state):**

```
rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs
  npm run typecheck → tsc --noEmit                          exit 0
  npm run build     → next build + ✓ Exporting (2/2)         exit 0
  node --test tests/*.test.mjs  → ℹ tests 289 / pass 289 /
                                  fail 0 / cancelled 0 /
                                  skipped 0 / todo 0
                                  across 14 files            exit 0
```

Build route table, verbatim (all four static; **no `/explore` node exists**):

```
┌ ○ /                                    69.7 kB         194 kB
├ ○ /_not-found                            131 B         103 kB
├ ○ /cli                                 4.51 kB         107 kB
└ ○ /resume                              12.8 kB         126 kB
```

---

## Goal Achievement → Observable Truths

**50 must-haves**: 1 roadmap truth (the phase-12 goal line, the only ROADMAP success criterion this milestone records) + 49 plan-level must-haves (12 truths + 7 artifacts + 6 key links from plan 01; 8 truths + 3 artifacts + 3 key links from plan 02; 6 truths + 1 artifact + 3 key links from plan 03).

### Roadmap truth

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 0 | **REV-22 / phase-12 goal:** `/` serves the explore visual experience, `/cli` serves the CLI terminal, `/explore` is deleted, the breadcrumb becomes `~`, cross-surface links rewire, and the status bar gains a new-tab `cli` hyperlink | ✓ VERIFIED | All six clauses proven independently at source **and** at export level: build route table emits `○ /`, `○ /cli`, `○ /resume` and no `/explore`; `out/index.html` carries `explore-shell`, `guest@tasostilsi`, `:~`, `0/5 sections visited`, `aria-label="Open the terminal"`, `href="/cli"` (×2), `target="_blank"`, `rel="noopener noreferrer"`; `out/cli.html` carries `Interactive CLI Portfolio` and **zero** `explore-shell` / `System initialized`; `out/explore.html` and `out/explore.txt` are **absent**; all six link sites grepped at source. Route table + `ls out` + 12 independent greps this session. |

### Plan 01 truths (route move + rewires) — 12/12

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A failing acceptance suite is on record BEFORE any implementation file is edited | ✓ VERIFIED | `git log --oneline 2145def..HEAD` order: `833a7d6 test(12-01): add failing route-swap acceptance suite` precedes `0bacb6a feat(12-01): promote the explore experience to /, move the CLI to /cli`. Mechanism independently corroborated: the suite's reader helper is guarded (`assert.ok(has(p), p + ' missing …')`) and read `src/app/cli/*`, `src/app/(home)/*` — paths that did not exist until `0bacb6a` — so the RED was deterministic, not incidental. |
| 2 | `/` renders the explore visual experience and `out/index.html` carries the explore-shell marker | ✓ VERIFIED | Build emits `○ /`; `grep -c` on `out/index.html`: `explore-shell` 1, `guest@tasostilsi` 1, `:~` 1, `0/5 sections visited` 1, `aria-label="Open the terminal"` 1. `tests/route-swap.test.mjs` row 10 (E) passes. |
| 3 | `/cli` renders the CLI terminal in its existing `h-screen overflow-hidden` frame | ✓ VERIFIED | `diff` of `git show 2145def:src/app/(main)/page.tsx` against `src/app/cli/page.tsx` → **byte-identical** (`'use client'`, `dynamic(…, { ssr: false })`). `src/app/cli/layout.tsx:32` carries `flex flex-col h-screen … font-mono overflow-hidden`, `:35` `<main … overflow-auto>`, `:8` `import '../globals.css'`. The hydrated terminal's visible render is the user's M-5…M-8 pass (client-only leaf by design). |
| 4 | `/explore` no longer exists: no route folder, no `out/explore.*`, no `/explore` in `out/*.html`/`out/*.txt`, exactly ONE occurrence across the whole `out/` tree | ✓ VERIFIED | `find src/app -maxdepth 2` → only `(home)/`, `cli/`, `resume/`, `layout.tsx`, `not-found.tsx`, `globals.css`, `favicon.png`. `ls out` → no `explore.*`. Residue tier (a): `grep -rl '/explore' out/*.html out/*.txt` → **0 files**. Tier (b): `grep -ro '/explore' out/_next/static/chunks \| wc -l` → **1**, in `chunks/app/(home)/page-ec5095a720327eb6.js`, context `children:"~/explore"` — the drawer `SheetTitle` (`explore-drawer.tsx:55`), the declared accepted debt (RESEARCH §3.7/OQ-7, UI-SPEC §9). Row 11 asserts this count-exact. |
| 5 | Every cross-surface link resolves to the surface it names (6 sites) | ✓ VERIFIED | Source greps: `WelcomeMessage.tsx:71 href="/"`; `TerminalInterface.tsx:298 { navigate: "/" }`; `explore-header.tsx:107 href="/cli"`; `constants.ts:122 linkHref: "/cli"` (consumed by `explore-tour.tsx:435`); `explore-status-bar.tsx` chip anchor; `not-found.tsx:105 href="/cli"`. Export: `out/index.html` `href="/cli"` ×2 (header link + chip, the P-9 expectation), `out/404.html` `href="/cli"` ×1. Row 13 + `explore-sweep` E-5 pass. |
| 6 | Breadcrumb renders `guest@tasostilsi:~`; right cluster is theme → live counter → new `cli` chip opening `/cli` in a NEW tab | ✓ VERIFIED | `constants.ts:48-49` (`EXPLORE_STATUS_USER`, `EXPLORE_STATUS_PATH = ":~"`), `:62-66` `EXPLORE_STATUS_CLI_LINK`. `explore-status-bar.tsx` renders a plain `<a href={…} target="_blank" rel="noopener noreferrer" aria-label={…}>` with `ArrowUpRight`. Export greps: `guest@tasostilsi` 1, `:~` 1, `target="_blank"` 1, `rel="noopener noreferrer"` 1 — all in `out/index.html`. |
| 7 | The before-paint theme script runs on the landing route only, ahead of the shell markup, and is absent from `src/app/layout.tsx` | ✓ VERIFIED | `grep -c 'portfolio-explore-theme\|EXPLORE_THEME_STORAGE_KEY' src/app/layout.tsx` → **0**. The script lives in `src/app/(home)/layout.tsx` (`:26` `localStorage.getItem("${EXPLORE_THEME_STORAGE_KEY}")`, `:27` `classList.remove("dark","light")`, `:107` emitted via `dangerouslySetInnerHTML`). Byte order in `out/index.html`: theme key **7450** < `classList.remove` **7504** < `explore-shell` **7774** → strictly ahead of the shell markup. |
| 8 | The landing's social metadata is explore-branded — `out/index.html`'s `og:title` carries `Visual Portfolio Explorer` | ✓ VERIFIED | `<meta property="og:title" content="Anastasios Tilsizoglou \| Test Automation Architect \| Principal Test Automation Engineer \| Visual Portfolio Explorer">` and `<title>` match. `src/app/(home)/layout.tsx:77` `openGraph`, `:93` `twitter` both declared explicitly — the RESEARCH §3.4 inheritance trap is closed. `out/cli.html` carries `Interactive CLI Portfolio`. Row 12 passes. |
| 9 | The four pinned chrome tokens are unchanged, `aria-live="polite"` stays on the counter `<p>`, and the chip sits outside that live region | ✓ VERIFIED | `explore-status-bar.tsx:38` footer class still `flex h-7 shrink-0 items-center justify-between border-t px-3 text-[10px] sm:h-8 sm:px-4 sm:text-xs`; the `aria-live="polite"` sits on the counter `<p>` only; the chip `<a>` is a sibling *after* that `<p>` inside the right-cluster `<div>` — outside the live region. Row 8 + `explore-sweep` status-bar token rows pass. |
| 10 | No behavioural change lands on either surface: zero new deps (39 keys), no new CSS rule in `globals.css`, CLI + explore feature sets untouched | ✓ VERIFIED | `git diff --name-only 2145def..b41f914 -- src/data package.json public scripts .github` → **EMPTY**. `git diff --stat 2145def..b41f914 -- src/app/globals.css` → **EMPTY**. `node -e` on `package.json` → **39** dependency keys, `recharts` undefined. The prose-sweep commit `64c263c` touches 5 files 5 insertions/5 deletions and its non-comment diff is **empty**. No panel/drawer/wizard/arc/stack/credentials/counter source is in the phase's touched-file inventory. |
| 11 | The 375px invariant holds on BOTH new paths by structure | ✓ VERIFIED | Landing shell root `explore-shell flex h-dvh flex-col overflow-hidden …` (`explore-shell.tsx:65`) — horizontal scroll structurally impossible; `explore-panels.tsx:156` `grid panel-grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5` (1-col base, md-scoped); status-bar breadcrumb `<p className="min-w-0 truncate">`, right cluster `flex shrink-0 items-center gap-3`, counter `whitespace-nowrap`. Row 3 + the `explore-sweep` EXPLORE@375 / CLI@375 rows pass. |
| 12 | No redirect machinery is introduced | ✓ VERIFIED | No `src/middleware.ts` / `middleware.ts` (both `ls` → No such file); `next.config.ts:5` plain `output: 'export'` with **no `trailingSlash`**; `src/app/explore/` deleted outright with no stub. `out/cli/index.html` absent (tripwire asserted at `explore-sweep.test.mjs:270-271`). |

### Plan 02 truths (test/sweep renewal) — 8/8

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 13 | The stale-suite RED is observed and recorded before it is repaired | ✓ VERIFIED (mechanism corroborated) | Independent corroboration of the RED's cause, without trusting the SUMMARY: at the plan-01 tip (`2bd0faa`) the suites still read the deleted artifact — `git show 2bd0faa:tests/explore-shell.test.mjs` → `:21 const exportHtml = join(root, 'out/explore.html')`, `:453 assert.ok(existsSync(exportHtml), 'out/explore.html missing — run \`npm run build\` first')`; `git show 2bd0faa:tests/credentials-panel.test.mjs:39` → `const exportHtmlPath = join(root, 'out/explore.html')`. Since plan 01 deletes that artifact, failure was deterministic at that commit. The renewal commits `386a55f` / `7fbe829` convert it to green (current 289/289). The verbatim RED transcription itself rests on the SUMMARY; the mechanism does not. |
| 14 | The full house gate passes: typecheck + build + all 14 suites green | ✓ VERIFIED | Run this session on the current tree: typecheck **exit 0**, build **exit 0**, `node --test tests/*.test.mjs` **exit 0** with `ℹ tests 289 / pass 289 / fail 0` across **14** files (`ls tests/*.test.mjs \| wc -l` → 14). |
| 15 | No pre-existing suite reads the deleted artifact or a deleted source route | ✓ VERIFIED (with recorded deviation D-3) | `grep -rn 'src/app/explore\|src/app/(main)' tests/ --exclude=route-swap.test.mjs` → **nothing** (exit 1). A read-specific grep filtered to `out/explore` returns **NONE**. The truth's printed predicate `grep -rn 'out/explore.html' tests/ --exclude=route-swap.test.mjs` does return 2 lines (`explore-sweep.test.mjs:259-260`) — both are `!existsSync(...)` **negative absence assertions that the same plan (task 2, E-1) explicitly required**. The operative clause ("no read") holds; the literal predicate cannot return empty. |
| 16 | The renewed composite pins both directions + the 404 leg + the chip leg in ONE assertion set | ✓ VERIFIED | `tests/explore-sweep.test.mjs:306` `test('sweep E-5: two-way routing loop composite — all six legs in one assertion set')` — one body carrying legs 1-6 (`:312` welcome, `:316-321` command + no `window.location`, `:324` header, `:328` `EXPLORE_TOUR_FINISH.linkHref === '/cli'`, `:338` `EXPLORE_STATUS_CLI_LINK.href === '/cli'`, `:349-350` not-found). `tests/route-swap.test.mjs` row 13 is the same six-leg contract with both source and export halves. |
| 17 | The CLI-side export row reads `out/cli.html` (asserted free of SSR'd CLI content) and `out/resume.html` is still asserted | ✓ VERIFIED | `grep -c 'System initialized' out/cli.html` → **0**; `grep -c 'explore-shell' out/cli.html` → **0**; `out/resume.html` emitted by the build and asserted. `explore-sweep` E-3 passes. |
| 18 | Two stale-source-path traps are closed: an explicit landing-page existence assertion, and `out/cli/index.html` asserted absent | ✓ VERIFIED | `tests/explore-shell.test.mjs:104` → `'landing page present — the h-screen guard must not silently degrade'` immediately before the `.filter(existsSync)` list (closes P-1/R-4). `tests/explore-sweep.test.mjs:270-271` → `!existsSync(join(root, 'out/cli/index.html'))`, `'out/cli/index.html absent — trailingSlash is unset, so /cli emits cli.html (R-8)'`. |
| 19 | Every remaining `/explore` reference in `src/` is a legitimate class; the only residual is `globals.css:496` as accepted prose debt | ✓ VERIFIED | `grep -rnE '[[:space:]]/explore[[:space:]]' src/ --exclude=globals.css` → **nothing** (exit 1). `grep -rn 'out/explore' src/` → **nothing** (exit 1). `grep -n '/explore' src/app/globals.css` → exactly **1**, line **496** (`/* Dark IDE theme is the default for the /explore shell (UI-SPEC §9.2).`), the declared debt — UI-SPEC §9 / RESEARCH §9.1-9.2 forbid editing that file this phase. |
| 20 | The prose sweep is comment-only and `globals.css`-free; `src/app/globals.css` is byte-untouched by the whole phase | ✓ VERIFIED | `git show --stat 64c263c` → 5 files, 5 insertions/5 deletions. Filtering its `-U0` diff to non-comment additions/removals (`grep -vE '^[+-]\s*(//\|\*\|/\*)'`) → **empty**. `git diff --stat 2145def..b41f914 -- src/app/globals.css` → **EMPTY**, and the post-phase quick task did not touch it. |

### Plan 03 truths (sweep table + finality) — 6/6

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 21 | The breakpoint matrix is renewed to the new route grid: exactly 8 rows — {375,768,1440,1920} × {/, /cli} | ✓ VERIFIED | `grep -cE '^\| [0-9] \| (375\|768\|1440\|1920) \|' …-SWEEP.md` → **8**; the rows enumerate route `/` (rows 1-4) and `/cli` (rows 5-8), and the file's own header states the grid replaces phase 05's `{/ , /explore}`. |
| 22 | Every one of the 8 rows carries the taxonomy marker and, for its manual half, the exact phrase `manual — user final pass` | ✓ VERIFIED | `grep -c 'manual — user final pass'` → **10** (8 sweep rows + the M-table preamble + the legend): every one of the 8 rows carries `P+M` in the check-type column and the phrase in its disposition cell; the 8 M rows are tabulated separately with the same marker, and no M row is recorded as `pass`. |
| 23 | The export-level section records the real artifact facts, with the `/explore` residue confined to its two-tier measured result (0 in `out/*.html`+`out/*.txt`, exactly 1 across chunks) | ✓ VERIFIED | Re-measured this session against the fresh build: tier (a) **0 files**; tier (b) **1** occurrence, `children:"~/explore"` in `chunks/app/(home)/page-ec5095a720327eb6.js`. The file's E-8 row records exactly this two-tier result with the drawer pointer, and `ls out` matches its E-1 list verbatim. |
| 24 | The chip's width arithmetic is recorded as a note while the asserted contract stays structural — no estimated-px assertion is added to any suite | ✓ VERIFIED | SWEEP row 1 records `338px used of 351px available … 362px zero-truncation floor` and cites `RESOLVED-WIDTH-TEST` (`grep -c` → 1). No suite asserts a chip-width pixel figure; the asserted chip contract is structural — `tests/route-swap.test.mjs:338` `min-w-0 truncate`, `:339` `whitespace-nowrap`, `:340` `flex shrink-0 items-center gap-3`, `:314` `shrink-0`. (`explore-sweep.test.mjs:203`'s `estPx <= 359` is the **pre-existing phase-05 CLI welcome-line** row, not a chip-width assertion, and was not added here.) |
| 25 | The guard row proves the phase's negative space with a git inventory | ✓ VERIFIED | Re-measured: `git diff --name-only 2145def..HEAD -- src/data package.json public scripts .github` → **EMPTY**; `git diff --stat -- src/app/globals.css` (and over the phase range) → **EMPTY**; `package.json` deps **39**; the touched-file inventory contains no panel/drawer/wizard/arc/stack/credentials/counter source. The `globals.css:496` line is recorded as accepted debt with its UI-SPEC §9 / RESEARCH pointer, never edited. |
| 26 | The final full gate is the LAST action on a frozen tree, covering the state that includes this SWEEP.md | ✓ VERIFIED | Re-run this session on the current tree (which includes SWEEP.md, all summaries and the human-approval commit): typecheck 0 / build 0 / 289-of-289 green. `git status --porcelain -- src tests .planning/phases/EXPLORE-12-route-swap-promotion` → **EMPTY** (no uncommitted phase or source change). The write-order claim is corroborated by `git log`: the last two phase commits (`727c03a`, `b41f914`) are planning-artefact-only, and no `src/` or `tests/` write follows them. |
| 27 | The phase's known post-ship perception trap is recorded for the ship step (deployed site lags the repo) | ✓ VERIFIED | `…-SWEEP.md:102` `### R-12 perception note (for the ship step)` — states the live `/` title still reads `Senior Software Engineer in Test` while the repo data carries the refreshed docx branding, so the first deploy ships the route swap AND the REV-01 data refresh and the changed copy is not a phase-12 defect. |

---

## Score

**50 / 50 must-haves verified** (`behavior_unverified: 0`).

- Roadmap truth (REV-22 / phase-12 goal): 1/1.
- Plan 01: 12/12 truths · 7/7 artifacts · 6/6 key links.
- Plan 02: 8/8 truths · 3/3 artifacts · 3/3 key links.
- Plan 03: 6/6 truths · 1/1 artifact · 3/3 key links.
- Automated gate this session: typecheck **0**, build **0**, `289/289` tests across **14** files, exit **0**.
- Behaviour-dependent truths: **0 left unverified** — every behaviour-carrying truth has a passing named test row (`route-swap` rows 1-14; `explore-sweep` E-1…E-8 + the EXPLORE@/CLI@ viewport rows + the six-leg E-5 composite; `explore-shell` export frame + hardened existence guard).
- Human verification: 8 manual sweep rows + the chip's new-tab behaviour — **performed by the user and recorded** (see below), so they are not outstanding and do not hold the status at `human_needed`.

---

## Deferred Items

The phase's CONTEXT deferred list was filtered against the milestone's later phases. Phase 12 is the **final phase of milestone v1.0** (ROADMAP lists 12 phases, none after 12), so no later phase exists to carry anything — each item is either resolved, or recorded as accepted debt with a pointer.

| Item | Source | Disposition |
|---|---|---|
| Old-path redirect stubs | CONTEXT deferred / SPEC | **Resolved** — `/explore` never shipped to GitHub Pages (live `…/explore` → HTTP 404 at research time), so `out/404.html` is the correct behaviour and no redirect machinery exists in the tree. |
| `sitemap.xml` / `robots.txt` SEO additions | CONTEXT deferred | **Deferred, out of scope** — `public/sitemap.xml`'s single `<loc>` already points at `https://tasostilsi.github.io/`, i.e. the new landing; no action needed. Its pre-existing unevaluated `${new Date()…}` `lastmod` is untouched by this phase. |
| CLI deep-linking (`?cmd=` prefill) | CONTEXT deferred | **Deferred to a future milestone** — explicitly out of scope; no partial implementation exists in the tree. |
| Drawer `SheetTitle` still reads `~/explore` | RESEARCH §3.7 / OQ-7, UI-SPEC §9 | **Accepted cosmetic debt** — the single surviving `/explore` string in the artifact, deliberately untouched (UI-SPEC §9 forbids touching the drawer) and pinned count-exact by `route-swap` row 11. No later phase exists in this milestone; pointer carried for a future chrome pass. |
| `src/app/globals.css:496` stale route prose | plan 02 truth 7, plan 03 guard row | **Accepted prose debt** — UI-SPEC §9 + RESEARCH §9.1/§9.2 forbid editing `globals.css` in this phase (`git diff` → EMPTY). Pointer recorded; no later phase exists in this milestone. |
| `PRODUCT.md` (untracked) still documents `/explore` as the visual surface | RESEARCH R-11 / OQ-13 | **Out of the tracked deliverable** — the file is untracked (`?? PRODUCT.md`); optional doc-hygiene follow-up, never a phase task. |

---

## Required Artifacts

All eleven declared artifacts exist, are substantive, and are wired. Every one was read or diffed this session. No artifact is a stub: each carries its declared exports/contract and its named rows.

| Artifact | min_lines / exports | Actual | Wired | Verdict |
|---|---|---|---|---|
| `tests/route-swap.test.mjs` | 120 | **533** lines, 14 named rows (rows 1-14 read verbatim from the file) | Run in the suite — 14/14 pass; reads the real rebuilt output | ✓ SUBSTANTIVE |
| `src/app/(home)/layout.tsx` | 45 · `metadata` (`:74`), `default` (`:100`) | **111** lines; both exports present | Consumed by `/`; theme script + metadata emitted into `out/index.html` (byte-order verified) | ✓ SUBSTANTIVE |
| `src/app/(home)/page.tsx` | 45 · `default` (`:46`) | **60** lines; imports `portfolioData`, composes `ExploreShell` → `ExploreIntro` + `ExplorePanels data={portfolioData}` | Build emits `○ /`; export carries `explore-shell` | ✓ SUBSTANTIVE |
| `src/app/cli/layout.tsx` | 22 · `metadata` (`:18`), `default` (`:23`) | **42** lines; both exports present | Shell SSR'd into `out/cli.html`; `../globals.css` resolves (build exit 0) | ✓ SUBSTANTIVE |
| `src/app/cli/page.tsx` | 20 · `default` (`:17`) | **25** lines; **byte-identical** to the pre-swap `(main)/page.tsx` (diffed) | Dynamic `ssr:false` leaf mounts at `/cli` | ✓ SUBSTANTIVE |
| `src/components/explore/explore-status-bar.tsx` | 48 · `ExploreStatusBar` (`:30`) | **86** lines | Rendered by the shell (`explore-shell.tsx:81`); breadcrumb + chip emitted into `out/index.html` | ✓ SUBSTANTIVE |
| `src/components/explore/constants.ts` | `EXPLORE_STATUS_PATH` (`:49`), `EXPLORE_STATUS_CLI_LINK` (`:62`), `EXPLORE_TOUR_FINISH` (`:119`) | **190** lines; all 3 exports present | Imported by the status bar (chip), the tour card (finish href), the landing layout (theme key), and asserted directly by the suites | ✓ SUBSTANTIVE |
| `tests/explore-sweep.test.mjs` | 380 | **449** lines | Run — green; carries the six-leg E-5 composite | ✓ SUBSTANTIVE |
| `tests/explore-shell.test.mjs` | 500 | **516** lines | Run — green; `out/index.html` reader + the hardened landing existence guard (`:104`) | ✓ SUBSTANTIVE |
| `tests/explore-routing.test.mjs` | **220** | **213** lines — 7 short of the declared heuristic | Run — green; delivers its stated provides (`href="/"` rows at `:74`/`:96`/`:115`, `linkHref '/cli'` at `:210-211`) | ✓ SUBSTANTIVE + WIRED — **7 lines under its declared `min_lines`, recorded as Deviation D-1** |
| `…-SWEEP.md` | 45 | **148** lines — 8 grid rows + 8 M rows + E-1…E-8 + guard row + Finality + R-12 note | Cited by every row's Evidence column; contains the real build baseline | ✓ SUBSTANTIVE |

---

## Key Link Verification

All 12 declared key links are **WIRED** (each verified by reading both endpoints, not by trusting the frontmatter).

| # | From → To | Via (declared) | Verdict | Evidence |
|---|---|---|---|---|
| L1 | `tests/route-swap.test.mjs` → `out/index.html` + `out/cli.html` | export rows read the built artifacts (after `rm -rf out && npm run build`) | **WIRED** | Pattern `out/cli\.html` present; rows 10-13 read both artifacts against a rebuild completed this session. |
| L2 | `src/components/explore/constants.ts` → `explore-status-bar.tsx` | `EXPLORE_STATUS_CLI_LINK` single-sources the chip | **WIRED** | `constants.ts:62` defines `{label, href, ariaLabel}`; the component consumes `.href`, `.label`, `.ariaLabel` off it — no inline `/cli` literal in the component. |
| L3 | `src/app/(home)/layout.tsx` → `constants.ts` | the before-paint script interpolates `EXPLORE_THEME_STORAGE_KEY` | **WIRED** | `(home)/layout.tsx:3` imports it, `:26` interpolates it into the `dangerouslySetInnerHTML` template; emitted at byte 7450 of `out/index.html`. |
| L4 | `src/app/cli/page.tsx` → `TerminalInterface.tsx` | `dynamic(…, { ssr: false })` keeps the CLI client-only | **WIRED** | `cli/page.tsx:9-10`; `out/cli.html` contains no `System initialized` (grep → 0), proving the leaf stayed client-only. |
| L5 | `src/app/cli/layout.tsx` → `src/app/globals.css` | relative `../globals.css` import still resolves | **WIRED** | `cli/layout.tsx:8` `import '../globals.css';` — same relative depth as the old `(main)` folder; the build compiles and emits CSS with no unresolved-import error. |
| L6 | `src/components/explore/constants.ts` → `explore-tour.tsx` | `EXPLORE_TOUR_FINISH.linkHref` drives the finish card | **WIRED** | `explore-tour.tsx:49` imports it, `:435` `<Link href={EXPLORE_TOUR_FINISH.linkHref}>`; asserted by `explore-sweep` leg 4 and `route-swap` row 13. |
| L7 | `tests/explore-sweep.test.mjs` → `constants.ts` | imports `EXPLORE_TOUR_FINISH`, asserts `linkHref === '/cli'` (no JSX parsing) | **WIRED** | 3 hits; `:32` `import { EXPLORE_STATUS_CLI_LINK, EXPLORE_TOUR_FINISH } from '../src/components/explore/constants.ts'`; `:328` asserts the value. |
| L8 | `tests/explore-shell.test.mjs` → `out/index.html` | export reader repointed from the deleted `out/explore.html` | **WIRED** | 7 hits; the reader constant now targets `out/index.html`; the suite's export rows pass green. |
| L9 | `tests/explore-sweep.test.mjs` → `src/app/cli/layout.tsx` | CLI overflow-invariant row reads the new layout path | **WIRED** | Pattern present; the CLI@375/768/1440/1920 row asserts `overflow-hidden` + `overflow-auto` survive the move. |
| L10 | `…-SWEEP.md` → `tests/route-swap.test.mjs` | every P/E row's Evidence cites its owning falsifier | **WIRED** | 19 citations in the Evidence column, plus the row-owners block. |
| L11 | `…-SWEEP.md` → `out/index.html` | build record + E rows cite the rebuilt artifacts | **WIRED** | 4 citations, including the E-2 row and the Finality section's route table — both reproduced this session. |
| L12 | `…-SWEEP.md` → phase-05 SWEEP | same taxonomy (P/E/M), same disposition rule, same 8-row shape, renewed route axis | **WIRED** | Pattern `manual — user final pass` present (10×). Both endpoints verified: `EXPLORE-05-…-SWEEP.md` exists, carries the same marker 10× and the same 8-row grid (`grep -cE '^\| [1-8] \|'` → 8). *Minor note:* the target's file path is not cited literally in the table — the relation is expressed as "replacing phase 05's grid" plus the identical taxonomy — but the linked contract is real and was checked at both ends. |

---

## Data-Flow Trace

Where the phase-12 values come from and how they reach the artifact — traced by reading the chain, not the plan.

```
EXPLORE-07 data spine (untouched by this phase — `git diff 2145def..HEAD -- src/data` EMPTY)
  src/data/portfolio-main-data.json
        │  imported by the landing server component
        ▼
  src/app/(home)/page.tsx:41,58   <ExplorePanels data={portfolioData} />
        │
        ▼
  src/components/explore/explore-shell.tsx:81
        │  <ExploreStatusBar theme={theme} visitedCount={visitedCount} />
        ▼
  src/components/explore/explore-status-bar.tsx
        ├── breadcrumb text   ← constants.ts:48-49  (guest@tasostilsi · ":~")
        └── cli chip anchor   ← constants.ts:62-66  (label / href="/cli" / aria-label)
                                  + literal target="_blank" rel="noopener noreferrer"
        ▼
  SSR → out/index.html   (verified: all four token families present; href="/cli" ×2)
```

1. **Portfolio data is untouched.** `src/data/portfolio-main-data.json` does not appear in `git diff --name-only 2145def..b41f914`. EXPLORE-07 survives: the landing still reads the JSON at build time (`(home)/page.tsx:41`) and passes it through the client boundary to `ExplorePanels`.
2. **Metadata is data-driven.** `(home)/layout.tsx` imports the same JSON and derives its `title` / `og:title` / `twitter:title`, confirmed end-to-end in `out/index.html`, which carries the refreshed branding (`Test Automation Architect | Principal Test Automation Engineer | Visual Portfolio Explorer`). `cli/layout.tsx` derives its own CLI-branded title from the same JSON, confirmed in `out/cli.html`.
3. **Chrome values flow from one derivation site.** `EXPLORE_STATUS_PATH`, `EXPLORE_STATUS_CLI_LINK` and `EXPLORE_TOUR_FINISH` live in the plain-TS `constants.ts`; the tests import the constant directly rather than parsing JSX, so the leg-4 assertion cannot drift from the render.
4. **The chip's href is static** (a module constant) → no open-redirect surface, and the anchor works with JS disabled; it is a plain `<a>`, never a router `Link` — verified in source and in the export.
5. **Route table data flow:** `src/app/(home)/` → `/`, `src/app/cli/` → `/cli`, `src/app/resume/` → `/resume`; the filesystem is the route table (no middleware, no route config module), and the build's own route listing is the falsifier. No `/explore` node exists.
6. **Both directions of the cross-surface loop are pinned in one assertion set** in two suites (`route-swap` row 13 source+export; `explore-sweep` E-5), so a half-rewire cannot pass:

```
CLI welcome link (WelcomeMessage.tsx:71 href="/")  ──┐
CLI `explore` command (TerminalInterface.tsx:298)  ──┼──▶  /  (explore landing)
                                                     │
explore header (explore-header.tsx:107 href="/cli") ─┤
wizard finish card (constants.ts:122 → tour:435)    ─┼──▶  /cli  (terminal)
404 "Return to Terminal" (not-found.tsx:105)        ─┤
status-bar chip (target="_blank")                   ─┘
```

---

## Behavioral Spot-Checks

Per-behaviour named rows, all executed as part of the single gate invocation on the current tree (the full suite was run once as the repo's declared gate; the row names below are the per-behaviour falsifiers harvested from that run's output — none quoted from a SUMMARY):

| Behaviour | Named check run | Result |
|---|---|---|
| Route tree is swapped | `route-swap` **row 1 (P)** | ✔ pass |
| CLI shell travelled verbatim | `route-swap` **row 2 (P)** | ✔ pass |
| Landing does not stack the CLI shell (+ single-scrollbar invariant) | `route-swap` **row 3 (P)** | ✔ pass |
| Theme script route-scoped, root layout clean | `route-swap` **row 4 (P)** | ✔ pass |
| Landing metadata declares its own OG/twitter | `route-swap` **row 5 (P)** | ✔ pass |
| Six cross-surface link targets rewired (source) | `route-swap` **row 6 (P)** | ✔ pass |
| Breadcrumb `~` + chip constant | `route-swap` **row 7 (P)** | ✔ pass |
| Chip anatomy, footer tokens, live region isolated | `route-swap` **row 8 (P)** | ✔ pass |
| No stale quoted `/explore` route literal in `src/` | `route-swap` **row 9 (P)** | ✔ pass |
| Export shape: `index.html` + `cli.html`, no explore artifact | `route-swap` **row 10 (E)** | ✔ pass |
| `/explore` residue two-tier, chunks count-exact at 1 | `route-swap` **row 11 (E)** | ✔ pass |
| Landing `og:title` explore-branded; `/cli` CLI-branded | `route-swap` **row 12 (E)** | ✔ pass |
| Six-leg two-way composite (source + export) | `route-swap` **row 13 (P+E)** | ✔ pass |
| Zero new deps — 39 keys, no recharts | `route-swap` **row 14 (P)** | ✔ pass |
| Six-leg composite, one assertion set | `explore-sweep` **sweep E-5** | ✔ pass |
| Route existence + trailingSlash tripwire | `explore-sweep` **E-1** | ✔ pass |
| CLI export row reads `out/cli.html` | `explore-sweep` **E-3** | ✔ pass |
| Landing export frame / `h-screen` ban / existence guard | `explore-shell` export + guard rows | ✔ pass |

Independent shell checks run outside the suite (results in the tables above): `ls out`, the two-tier residue scan, `href="/cli"` occurrence counts (2 in `index.html`, 1 in `404.html`), the theme-script byte ordering, the `og:title` extraction, the byte-identity `diff` of the CLI page, the CLI/resume/data/globals inventory diffs, the dependency-count check, and the middleware/`trailingSlash` absence checks.

---

## Requirements Coverage

| REQ-ID | Clause | Delivered | Evidence |
|---|---|---|---|
| **REV-22** | `/` serves the explore visual experience (the primary landing) | ✓ | `○ /` in the build route table; `out/index.html` carries `explore-shell` + the IDE chrome. |
| **REV-22** | `/cli` serves the CLI terminal | ✓ | `○ /cli`; `out/cli.html`; `src/app/cli/*` byte-identical to the pre-swap CLI files. |
| **REV-22** | `/explore` is deleted (never shipped to GitHub Pages) | ✓ | No route folder; no `out/explore.*`; 0 `/explore` in `out/*.html` + `out/*.txt` (which includes `out/404.html`); the single surviving occurrence is the declared drawer title. |
| **REV-22** | The breadcrumb becomes `guest@tasostilsi:~` | ✓ | `EXPLORE_STATUS_PATH = ":~"`; `:~` present in `out/index.html`. |
| **REV-22** | Every cross-surface link rewires: CLI welcome link + `explore` command → `/`; header Terminal link + wizard finish card → `/cli` | ✓ | All six source greps + the six-leg composites (source and export) passing. A declared **6th** site (`not-found.tsx` "Return to Terminal") was additionally rewired per RESEARCH §3.6/R-9 — deliberate and flagged in plan 01, not scope creep. |
| **REV-22** | The status bar gains a `cli` hyperlink opening `/cli` in a NEW tab | ✓ | `EXPLORE_STATUS_CLI_LINK` + literal `target="_blank" rel="noopener noreferrer"`, present in source AND in `out/index.html`; the actual new-tab outcome is part of the user's recorded visual pass. |
| **REV-22** | Metadata / suites / sweep renew to the new route names | ✓ | OG + Twitter declare explore branding explicitly; `/cli` carries CLI branding; 14 suites green; the 8-row `{/ , /cli}` sweep table committed with its finality section. |

No requirement mapped to this phase is unmet or partially met. (REV-01…REV-21 belong to phases 06-11 and are not in phase 12's scope.)

---

## Anti-Patterns Found

| Class | Result |
|---|---|
| Unreferenced `TBD` / `FIXME` / `XXX` debt markers | **NONE** — `grep -rnE '\b(TBD\|FIXME\|XXX)\b' src/ tests/route-swap.test.mjs tests/explore-*.test.mjs` → empty. **No BLOCKER-class debt marker.** |
| Redirect machinery / dead route stubs | **NONE** — no `middleware.ts`, no `trailingSlash`, no stub folder; `/explore` is deleted outright and 404s on the static host. |
| Stale quoted `/explore` route literal in `src/` | **NONE** — `grep -rnE "[\"']/explore[\"']" src/` → empty; `route-swap` row 9 enforces this. |
| Security anti-pattern on the phase's one new anchor | **NONE** — literal `rel="noopener noreferrer"` in source **and** in `out/index.html`; static constant href → no open-redirect surface; no `onClick` / `window.open`. |
| Wrong-tier placement (research's R-2 BLOCKER candidate — theme script escaping to the root layout) | **NONE** — the `localStorage`-writing script is in `src/app/(home)/layout.tsx` only; `src/app/layout.tsx` references the storage key **0** times, so `/cli` and `/resume` keep their own theme classes. |
| New animation dependency / motion-library escape | **NONE** — `framer-motion` confined to `projects-stack-stage.tsx` (an unchanged file); the `explore-visuals` ban rows stay green with zero edits. |
| Softened assertions to reach green | **NONE FOUND** — the phase's test diffs are literal renewals (old target → new target), structural guards, and two HARDENINGS (the explicit landing-page existence assertion, the `out/cli/index.html` tripwire). `assert.equal(hits, 1)` in row 11 was not relaxed. |
| Over-broad assertion (`> 0`) where a count-exact check is needed | **NONE** — the residue row is `assert.equal(hits, 1)` with the single accepted hit named inline. |
| `trailingSlash` regression risk | **Guarded** — asserted in both directions (`out/cli.html` exists AND `out/cli/index.html` does not). |

### Plan-declaration deviations (INFO — recorded, not blocking)

- **D-1 — `tests/explore-routing.test.mjs` is 213 lines against its declared `min_lines: 220` (7 short), and the SUMMARY does not flag it.** The artifact's *contract* is fully met (renewed welcome-link rows + finish-card guard, all green), and the file was 213 lines before the phase too, so no content was lost — the heuristic was an over-estimate, not evidence of a stub. Recorded here because the SUMMARY did not.
- **D-2 — the plan-01 shell-root literal `overflow-x-hidden` is superseded by the post-phase quick task `c7b45f7`.** The shell root now reads `explore-shell flex h-dvh flex-col overflow-hidden` (both axes, so the CSS-computed single-axis `auto` cannot paint a shell-owned vertical scrollbar), plus a route-scoped `html, body { height: 100%; overflow: hidden; }` document lock in `(home)/layout.tsx`. `route-swap` row 3 was renewed to assert the new form **and** the stronger invariant (exactly one scroll container; `/cli` and `/resume` must not pick up the lock). The phase truth ("landing does not inherit the CLI shell") and the 375px invariant are strengthened, not weakened.
- **D-3 — plan-02 truth 3's printed grep predicate is over-broad and self-contradictory.** It requires `grep -rn 'out/explore.html' tests/ --exclude=route-swap.test.mjs` to return nothing, but the same plan (task 2, item E-1) explicitly instructs adding `!existsSync(join(root, 'out/explore.html'))` to `tests/explore-sweep.test.mjs:259-260`. Both cannot hold; the executor correctly chose the negative absence falsifier. The truth's operative clause (no pre-existing suite **reads** the deleted artifact) is satisfied — a read-specific grep proves it. *Non-blocking hygiene follow-up:* narrow that predicate to a read-specific grep, or move the negative existence rows into `tests/route-swap.test.mjs`.
- **D-4 — the SWEEP guard row's printed base command is wrong, and the file says so.** `git merge-base master HEAD` resolves to `b9ed9ab` (an older `master` predating phases 01-11), not the phase base; the file records the deviation inline and uses the correct phase range `2145def..HEAD`. Re-measured this session with the correct range: all guard rows pass.
- **D-5 — the landing's CLI-half rows no longer mirror phase 05's literal text.** Phase 05's rows 5-8 described the CLI at `/`; phase 12's rows 5-8 describe `/cli`. This is the intended route-axis renewal (plan-03 truth 1), recorded so it is not mistaken for drift.

---

## Human Verification Required

**None outstanding.** The phase's sweep table declares 8 M rows as `manual — user final pass` plus the chip's new-tab behaviour. Those were **performed by the user**, and the verdict is on record — committed by the user at `236dce0` (`docs(verify): phase-12 human approval recorded (go-live authorization)`, the current HEAD), appended to the prior verification as:

> ## Human Verification Record (2026-09-25, user-approved via the go-live command)
> User verdict: **"this is great now we are ready to merge it into the main branch and go live"** — the route swap, the status-bar chip, and the whole landing were reviewed live (the user also drove the revisions that shaped them: the swipe rework, the centering/overflow fix, the single-scrollbar fix). This approval doubles as the per-action remote-write authorization for the milestone ship (push + PR + merge + deploy).
> `status_human: approved`

The 9 items the prior run listed (8 breakpoint rows + chip new-tab) map onto that live review. **Declaration, stated plainly so it is auditable: I did not personally re-perform the visual pass — no agent can legitimately claim a rendered-appearance check.** The human items are satisfied by the user's own recorded review, and the single-scrollbar quick task (`c7b45f7`) that the review produced precedes the approval commit, so the approval covers the current code state. Every automated must-have is independently green on that same state.

**Still outstanding, and not a human-verification item:** the remote-write hold. No push, PR, merge or deploy without an explicit per-action user command (`gsd_ship` is gated on it). Per RESEARCH R-12, the first deploy after this phase ships the route swap **and** the REV-01 data refresh together, so the changed landing copy must not be read as a phase-12 defect.

---

## Gaps Summary

**No gaps.** All 50 must-haves are verified against the real tree and a freshly rebuilt export; no truth failed, no artifact is missing or a stub, no key link is unwired, and there are no blocker anti-patterns. Status is therefore `passed` — not `gaps_found`, and not `human_needed`, because the human sweep was performed and recorded by the user.

- **Route swap complete and proven at three levels.** Build route table (`○ /`, `○ /cli`, `○ /resume`, no `/explore`), export artifacts (`index.html` = landing, `cli.html` = terminal, no `explore.*`, no `cli/index.html`), and the two-tier residue scan (0 in `out/*.html` + `out/*.txt`; exactly the 1 declared drawer hit across `out/_next/static/chunks/**`).
- **All six cross-surface link sites rewired** and locked by two independent six-leg composites (source + export), so no half-rewire can pass.
- **The chip is correctly built and safe:** single-sourced href from `constants.ts`, literal `target="_blank"`, literal `rel="noopener noreferrer"`, inset focus ring, outside the counter's live region, inside the pinned four-token bar. The new-tab *outcome* was part of the user's recorded pass.
- **No collateral change:** `globals.css` byte-untouched; `src/data` / `package.json` / `public` / `scripts` / `.github` untouched; dependency count still 39; the prose sweep comment-only (non-comment diff empty); the CLI page byte-identical to its pre-swap self.
- **Gate green on the current workspace state:** typecheck 0, build 0 (four static routes), `289/289` tests across 14 files, exit 0.
- **No blocker anti-patterns;** five plan-declaration deviations recorded as INFO above (D-1 was not flagged by the SUMMARY; D-2/D-5 are intended supersessions/renewals; D-3/D-4 are imprecise plan-authored predicates that the artefacts themselves resolve).

**Two residuals are accepted debt, not gaps** — the drawer's `~/explore` title and the `globals.css:496` prose line. Both carry their UI-SPEC §9 / RESEARCH §3.7 pointers. Since phase 12 is the final phase of milestone v1.0, no later phase exists to carry them; they belong to a future chrome pass.
