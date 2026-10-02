---
phase: 11-credentials-panel-revision
verified: 2026-09-30T08:48:40+03:00
status: passed
score: 41/41 must-haves verified
behavior_unverified: 0
overrides_applied: 0
---

# Phase 11: credentials-panel-revision Verification Report

**Verification basis.** HEAD `8d7727f` on branch `phase-11`; tracked working tree clean (`git status --porcelain -uno` empty). This is a **re-verification on a moved tree**: the previous report was written at `27d3d90`, and **phase 10 (projects-stack-revision, REV-18…REV-20) landed eleven commits afterwards** — including edits to `src/components/explore/explore-panels.tsx` (the file holding phase 11's grid, `ACCENTS`, `SECTION_BODIES` and `buildPlacement`), `projects-stack-stage.tsx`, `projects-card-state.ts` and `tests/explore-visuals.test.mjs`. That made every phase-11 construct sharing those files a live regression risk, so **nothing was carried over from the prior report on trust** — all 41 must-haves were re-established against `8d7727f` by commands run in this session. Phase 11 owns the last requirement in the milestone (ROADMAP row 11 = `REV-21`; no phase 12 exists), so each truth was verified on the delivered tree itself. A direct consequence of the move: the phase-11 constructs inside `explore-panels.tsx` shifted line numbers (`ACCENTS` `:21 → :86`, the adapter closure `:39 → :104`, the placement entry `:70 → :135`) — every citation below is the `8d7727f` position, re-measured.

**The gate, run independently on the current tree (pre-report):**

```
npm run typecheck            → exit 0
npm run build                → exit 0   (6/6 static pages; / /_not-found /explore /resume all ○ Static)
node --test tests/*.test.mjs → exit 0   269 tests, 269 pass, 0 fail, 0 skipped, 0 todo — 13 test files
git status --porcelain -uno  → empty
```

Test count rose **267 → 269** since the prior report because phase 10 added two rows to `tests/explore-visuals.test.mjs` — not a phase-11 change, and the phase-11 rows survive inside the larger suite.

## Phase-10 impact assessment (why this re-verification exists)

| Phase-11 construct | File phase 10 touched | Phase-10 outcome | Verdict |
|---|---|---|---|
| Row-3 grid split [Projects \| Credentials] | `explore-panels.tsx:145` | Grid literal **unchanged**: `grid panel-grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5`; DOM order still `about, skills, experience, projects, credentials`, `experience` spanning both columns | ✓ INTACT — row 3 = Projects \| Credentials at md+, stacked at <md |
| `credentials: { wrapper: '', shell: '', gate: false }` placement | `explore-panels.tsx:135` | Phase 10 rewrote the surrounding comment (only Experience keeps a sticky range; Projects returned to natural height) but the credentials entry is unchanged | ✓ INTACT |
| `credentials` adapter closure + `ACCENTS` entry | `explore-panels.tsx:104,86` | Untouched by phase 10 | ✓ INTACT |
| `spans.length, 5` (5 mono index spans 01–05) | `tests/explore-visuals.test.mjs` | Phase 10 edited this file; the row survives at `:784` | ✓ INTACT |
| 5 adapter closures | `explore-visuals.test.mjs:341`, `explore-visuals-skills.test.mjs:172` | Both rows survive with phase-11 wording | ✓ INTACT |
| Prohibitions (no `order-*`; credentials at natural height) | `explore-panels.tsx` | Zero `order-*` class in the grid chain | ✓ INTACT |

Phase 10's rewrite makes Projects natural height too, which *aligns* the row-3 pair rather than disturbing it. No phase-11 must-have was invalidated.

## Goal Achievement → Observable Truths

### Plan 01 must_haves (15 truths)

| # | Truth | Status | Evidence |
|---|---|---|---|
| T1-1 | The new Credentials acceptance suite fails BEFORE implementation (RED) and passes after (GREEN) | ✓ VERIFIED — **RED reproduced independently in this session** | Not read from SUMMARY: `git worktree add --detach /tmp/p11-red-check 9745193` (the test-only commit) → `src/components/explore/sections/credentials-section.tsx` **ABSENT** (`test -f`), `grep -c credentials constants.ts` = **0**, then `node --test tests/credentials-panel.test.mjs` → **19 tests, 3 pass / 16 FAIL**, every failure an `ERR_ASSERTION` naming absent behaviour (missing panel file, 4-section constants, stale export), not a syntax error. Same suite on HEAD → **19 pass / 0 fail**. Worktree removed afterwards; tracked tree clean. |
| T1-2 | Credentials panel immediately right of the Projects stack at md+, full-width below at <md, **no `order-*` utility** | ✓ VERIFIED | `explore-panels.tsx:145` grid literal as above; `EXPLORE_SECTIONS` (`constants.ts:18-24`) orders credentials last; `grep` for `order-` across the three grid-chain files returns **zero** class hits. |
| T1-3 | Three tabs (Articles \| Certifications \| Presentations), Articles selected on load, Articles rows real text in the static export | ✓ VERIFIED | `credentials-section.tsx:163` `defaultValue="articles"`; tabs at `:165-173`. On the **script-stripped** `out/explore.html`: all three labels PRESENT; all five featured article names PRESENT as text. No `forceMount` on any `TabsContent` (Radix gates the other two bodies on selection). |
| T1-4 | Static-export assertions stay inside the SSR surface; every export row reads the script-stripped document | ✓ VERIFIED | `grep -c "replace(/<script"` = **2** (the single strip helper plus its use); `grep -c 'href="#credentials"'` = **0** — the client-only surfaces are asserted only negatively at source level. |
| T1-5 | Articles tab lists the 5 featured articles as compact rows carrying title, date and an external link | ✓ VERIFIED | Measured on data: 5 featured articles, **all 5** links start with `http`. On the stripped export: **all 5 names, all 5 hrefs and all 5 dates** PRESENT (incl. `Sep 14, 2026` … `Dec 23, 2025`). Row anatomy (`name` + verbatim `date` + arrow) pinned at `credentials-section.tsx:39-116`; the data has no `title` field — `name` is read, correctly. |
| T1-6 | Certifications tab lists the 5 featured certifications with name + date; the ISTQB entry renders `ID: GRTB-24-1S20-CTFL` as plain text on a combined `date · ID` line and is NOT an anchor, as are the 4 null-link entries | ✓ VERIFIED (source + data) | Data measured directly: featured certs = **5**; links `http` = **0**, `null` = **4**, `=== 'ID: GRTB-24-1S20-CTFL'` = **1**. `credentials-section.tsx:49-50` single named predicate `isExternalLink` (`typeof link === 'string' && link.startsWith('http')`) is the **only** anchor gate (`:133,147,150,159`); `:148` builds the combined `` `${certification.date} · ${certification.link}` `` line. Payload proof the island receives all 5: the ISTQB name and the ID string are **PRESENT in the raw document and ABSENT from the stripped one** — they exist only inside the serialized client-island props. |
| T1-7 | Supersession of record (SPEC "every row an anchor" / D-02 "anchor rows" narrowed FOR THE CERTIFICATIONS TAB) is recorded in SUMMARY | ✓ VERIFIED | `EXPLORE-11-…-01-SUMMARY.md` §"Supersession of record" states it with the measured 5/0/4/1 counts; restated in the plan-02 SUMMARY and in both plans' `<context>`. Matches the data measured in this session exactly. |
| T1-8 | Presentations tab lists the single Allure Reporting presentation with its date and a real external link | ✓ VERIFIED (source + data) | `presentations[0]` = `{name: "Boosting Your Team's Clarity with Allure Reporting", date: "November 2025", link: "https://tasostilsi.github.io/presentations/allure-reporting/", featured: true}`; `presentationRows` filters on `featured` (`:154`) and gates the href with the same URL predicate (`:159`). Name ABSENT from the stripped export = hydration-only as designed; PRESENT in RAW (props delivered). |
| T1-9 | The drawer derives 5 anchors ending in `05 Credentials`; the status bar renders `0/5 sections visited` in the no-JS static export | ✓ VERIFIED | `explore-drawer.tsx` maps `EXPLORE_SECTIONS` with `href={\`#${section.id}\`}` (`:62`) and `String(i + 1).padStart(2, '0')` (`:70`), plus `credentials: 'text-chart-5'` in `DIGIT_ACCENTS` (`:43`) — item 5 is `05 Credentials`, asserted at source level because the closed Sheet never reaches the export. `explore-status-bar.tsx:49` renders `` `${visitedCount}/${EXPLORE_SECTIONS.length} sections visited` `` → measured `0/5 sections visited` PRESENT in the stripped export and `0/4` **ABSENT**. `use-explore-visited.ts` derives its valid ids from the same constant (`:54`) and observes each `document.getElementById(section.id)` (`:79`) — so the IO marks credentials as the 5th. |
| T1-10 | Nothing was deleted: articles 15, certifications 45, presentations 1 | ✓ VERIFIED | `node -e` over the JSON: **15 / 45 / 1**. The ledger suite whose purpose is to catch deletions (`assert.deepStrictEqual(data.presentations, PRE_PRESENTATIONS)`) passes at full strength (`tests/portfolio-data-integrity.test.mjs:451`). |
| T1-11 | An empty featured list renders exactly one calm non-link row with the three pinned dash-free strings | ✓ VERIFIED | `credentials-section.tsx:69-79`: single `<div>` on the same `ROW_BASE` (44px) rhythm, muted `aria-hidden` icon slot. The three literals `No featured articles.` / `No featured certifications.` / `No featured presentations.` present at `:176,179,182` and asserted by the suite. Unreachable with the current 5/5/1 featured data by design. |
| T1-12 | Every tab trigger and every row meets a 44px-equivalent target; the whole row is the link hit target | ✓ VERIFIED | `min-h-[44px]` on each `TabsTrigger` (`:165,168,171`) and on `ROW_BASE` (`:39`); the anchor branch applies `rowClass + ROW_INTERACTIVE` to the `<a>` itself, so the row is the hit target with the shared focus-visible recipe. |
| T1-13 | 375px: Credentials full-width below the Projects stack, no horizontal overflow (title truncates); both themes legible via theme tokens only | ✓ VERIFIED (source) — rendered claim human-resolved | Stacking comes from `grid-cols-1` (T1-2); the title carries `min-w-0 flex-1 truncate`; `credentials-section.tsx` contains **zero** hard-coded colours (`grep -nE "#[0-9a-fA-F]{3,6}\|rgb\(\|hsl\("` → none) — every class is a theme token. The perceptual no-overflow/legibility claim was confirmed by the user (Human Verification Record below). |
| T1-14 | Reduced motion removes the row hover nudge and the panel entrance through the pre-existing guard, with no new exception added | ✓ VERIFIED (source) — rendered claim human-resolved | `globals.css` guard still matches `.explore-shell *,` (`:649`); `.exp-nudge` and the `.panel-grid > *` entrance both live inside `.explore-shell`. Phase 11's only CSS addition remains the single `animation-delay` line (`:608`). Rendered outcome user-confirmed. |
| T1-15 | Prohibitions hold: no framer-motion in any Credentials file, no new dependency, no `order-*` utility, no carousel/stack machinery | ✓ VERIFIED | `grep -c framer-motion credentials-section.tsx` = **0**; `git diff --stat 9bab3f3..HEAD -- package.json package-lock.json` = **empty** (no dependency added); no `order-*` class (T1-2); the panel is `Tabs` + one static row list — no carousel/drag/stack code. |

### Plan 02 must_haves (8 truths)

| # | Truth | Status | Evidence |
|---|---|---|---|
| T2-1 | No assertion anywhere in `tests/` still encodes the retired 4-section contract | ✓ VERIFIED | Repo-wide counts in `tests/`: `0/4 sections` **0**, `four total closures` **0**, `exactly four adapter closures` **0**, `spans.length, 4` **0**, `N/4` **0**, `01-04` **0**, `4 anchor items` **0**, `!src.includes('chart-5')` **0**, `!src.includes('text-chart-5')` **0**. No live positive assertion of the retired count remains (the surviving `four sections` / `4 sections` hits are deliberate absence assertions and history comments). |
| T2-2 | No test TITLE or message still says "four total closures" / "exactly four adapter closures" | ✓ VERIFIED | Both renewed with their counts: `explore-visuals.test.mjs:341` and `explore-visuals-skills.test.mjs:172` both read `exactly five adapter closures — the registry is total over the 5-section grid (D-04/D-07; phase-11 REV-21)`. `four total closures` = **0**. |
| T2-3 | The drawer suite asserts 5 anchors incl. the credentials digit accent; the counter suites assert the live N/5 template and the static `0/5 sections visited` | ✓ VERIFIED | `grep -c "credentials: 'text-chart-5'" tests/explore-shell.test.mjs` = **1** (`:274`); `0/5 sections visited` asserted at `explore-shell.test.mjs:459` and `explore-tour.test.mjs:636`; the N/5 template derives from `EXPLORE_SECTIONS.length`. |
| T2-4 | The export suite asserts 5 panel index spans 01-05 and 5 adapter closures (CredentialsSection is the 5th) | ✓ VERIFIED | `explore-visuals.test.mjs:784` `assert.equal(spans.length, 5, …)`; closure rows at `:341` + `explore-visuals-skills.test.mjs:172`. Independently reproduced on the freshly built export with the pinned full class signature: **spans = `["01","02","03","04","05"]`, count 5**. |
| T2-5 | The tour suite asserts the welcome copy says "five sections" and no longer asserts "four sections" | ✓ VERIFIED | `explore-tour.test.mjs:186` `welcome.includes('five sections')`, `:190` `!welcome.includes('four sections')`; `constants.ts:133` reads "A 60-second lap of the five sections" — truthful about the panel count. |
| T2-6 | The sweep suite asserts the 5-entry `EXPLORE_SECTIONS` order including credentials; both adapter-closure suites assert 5 | ✓ VERIFIED | `explore-sweep.test.mjs:76` asserts `['about','skills','experience','projects','credentials']`; closure count asserted `5` in BOTH `explore-visuals.test.mjs:341` and `explore-visuals-skills.test.mjs:172`. |
| T2-7 | The `PRE_PRESENTATIONS` ledger fixture gains the typed featured flag while `deepStrictEqual` stays intact | ✓ VERIFIED | `tests/portfolio-data-integrity.test.mjs:119-129` fixture carries `featured: true`; `:451` still `assert.deepStrictEqual(data.presentations, PRE_PRESENTATIONS)` — full-collection deep equality, not narrowed. |
| T2-8 | The full `node --test tests/*.test.mjs` suite passes on the final tree after a fresh `npm run build`, and that run is chronologically the last action | ✓ VERIFIED | Independently re-run in that order on `8d7727f`: `npm run build` → exit 0, then `node --test tests/*.test.mjs` → **269 pass / 0 fail / 0 skipped / 0 todo**, 13 files. `git status --porcelain -uno` immediately after = **empty**. |

## Score

**41/41 must-haves verified** — 23 from plan 01 (15 truths + 4 artifacts + 4 key links) and 18 from plan 02 (8 truths + 6 artifacts + 4 key links).

- Truths verified: **23/23**
- Artifacts present + substantive + wired: **10/10**
- Key links WIRED: **8/8**
- `behavior_unverified`: **0** — no truth is left PRESENT_BEHAVIOUR_UNVERIFIED; every behaviour-dependent truth has a named passing test (T1-1 with both halves executed).
- `overrides_applied`: **0** — the single narrowing (certifications as plain text, not anchors) was approved during planning and is recorded in both SUMMARYs.

**Status is `passed`.** Decision tree, most restrictive first: (a) no truth FAILED, no artifact MISSING/STUB, no key link NOT_WIRED, no blocker anti-pattern → not `gaps_found`. (b) The three browser-observable behaviours that previously held the phase at `human_needed` (tab switching, 375px/both-theme layout, reduced-motion rendering) are **no longer outstanding**: they were confirmed by the user in the batch round recorded in commit `c97b0e8` (`status_human: approved`), appended to this phase's previous report. (c) All truths VERIFIED, all artifacts pass, all links WIRED, no blockers, no human items remaining → **`passed`**. The phase was re-verified end-to-end on the moved tree rather than inherited, so this verdict covers `8d7727f`, not `27d3d90`.

## Deferred Items

Filtered against later milestone phases: **phase 11 owns the last requirement of milestone v1.0** (ROADMAP rows 01–11; no phase 12 exists), so nothing deferred here is picked up downstream. All three CONTEXT deferrals are legitimate and out of delivered scope:

| Deferred item | Source | Verdict |
|---|---|---|
| Presentations beyond the single entry (future talks extend the flag mechanism) | CONTEXT `<deferred>` | Correctly deferred — the typed `featured?: boolean` on `Presentation` (`portfolio-main-data.d.ts:49-50`) already generalises; a second talk needs data only. |
| Tab state persistence across reloads (default Articles each load) | CONTEXT `<deferred>` | Correctly deferred — matches the pinned SSR contract (`defaultValue="articles"`); persisting would move the default off the server-rendered tab. |
| A Credentials step in the wizard tour | CONTEXT `<deferred>` / D-04 | **Deliberately kept out and verified as such**: `EXPLORE_TOUR_STEPS` still holds exactly 6 ids (`welcome → about → experience → skills → projects → finish`, `constants.ts:129,136,143,150,157,164`); no step's `sectionId` is `credentials`. "Walking the wizard marks 4 of 5" was pinned as acceptable. |

No deferred item is silently half-built: none has a partial implementation in the tree.

## Required Artifacts

| Artifact | Requirement | Actual | Status |
|---|---|---|---|
| `tests/credentials-panel.test.mjs` | ≥ 60 lines; source rows + export rows cut to the SSR surface | **366 lines**, 19 tests, **19 pass / 0 fail**; 2 uses of the script-strip helper | ✓ |
| `src/components/explore/sections/credentials-section.tsx` | ≥ 90 lines; exports `CredentialsSection`; 3-tab panel, calm rows, empty states, no framer-motion | **186 lines**; `export function CredentialsSection` present (1 hit); `"use client"`; zero `framer-motion` | ✓ |
| `src/data/portfolio-main-data.json` | the single presentation entry gains `featured: true` | `presentations[0].featured === true`; collections 15/45/1 intact; no field renamed or removed | ✓ |
| `src/app/globals.css` | entrance-stagger cascade extended to the 5th grid child at 160ms | `.explore-shell .panel-grid > *:nth-child(5) { animation-delay: 160ms; }` at `:608`, matching the +40ms cadence after `nth-child(4)` | ✓ |
| `tests/explore-shell.test.mjs` | 5-section constants/drawer/counter rows; chart-5 digit REQUIRED | passes (within the 269); `credentials: 'text-chart-5'` required at `:274`; `0/5` at `:459` | ✓ |
| `tests/explore-tour.test.mjs` | 5-entry accent map, `0/5` static counter, "five sections" copy, 6-step table intact | passes; `:186`/`:190` copy guards; `:636` counter | ✓ |
| `tests/explore-sweep.test.mjs` | 5-entry `EXPLORE_SECTIONS` order assertion | passes; `:76` order including credentials | ✓ |
| `tests/explore-visuals.test.mjs` | 5 index spans 01–05 + 5 adapter closures | passes; `:784` spans; `:341` closures (phase-10 edits left both intact) | ✓ |
| `tests/explore-visuals-skills.test.mjs` | 5 adapter closures including `CredentialsSection` | passes; `:172` | ✓ |
| `tests/portfolio-data-integrity.test.mjs` | ledger fixture carries the typed flag, `deepStrictEqual` intact | passes; `:119-129` + `:451` | ✓ |

## Key Link Verification

| # | From → To | Via (pinned pattern) | Status |
|---|---|---|---|
| K1 | `constants.ts` → `explore-panels.tsx` | `EXPLORE_SECTIONS` 5th entry drives `ACCENTS`, `SECTION_BODIES` and `buildPlacement` | ✓ WIRED — `explore-panels.tsx:104` `credentials: ({ data }) => <CredentialsSection articles=… certifications=… presentations=… />`; `ACCENTS.credentials = 'bg-chart-5'` (`:86`); `buildPlacement` returns `credentials: { wrapper: '', shell: '', gate: false }` (`:135`, natural height, no `md:sticky`/`md:h-`/`md:col-span-2`). `npm run typecheck` exit 0 is the total-map proof. |
| K2 | `constants.ts` → `explore-drawer.tsx` | section id → drawer anchor + per-id digit accent | ✓ WIRED — `explore-drawer.tsx:43` `credentials: 'text-chart-5'`; anchor and `05` index derive from the shared array (`:62`, `:70`). |
| K3 | `credentials-section.tsx` → `portfolio-main-data.json` | featured-only filtering from the data prop (EXPLORE-07) | ✓ WIRED — `.filter(… .featured)` at `:132`, `:142`, `:154`; the JSON is read once in `src/app/explore/page.tsx` and flows `page → ExplorePanels → SECTION_BODIES closure → section props`. |
| K4 | `globals.css` → `explore-panels.tsx` | `.panel-grid > *:nth-child(5)` stagger for the new 5th grid child | ✓ WIRED — `globals.css:608` matches the pinned pattern; the 5th grid child is the Credentials wrapper. |
| K5 | `tests/explore-shell.test.mjs` → `explore-drawer.tsx` | digit-accent assertion now REQUIRES `credentials: 'text-chart-5'` | ✓ WIRED — 1 hit in the test (`:274`), 1 in the drawer source (`:43`). |
| K6 | `tests/explore-visuals.test.mjs` → `panel-shell.tsx` | 5 rendered index spans 01–05 in `out/explore.html` | ✓ WIRED — test asserts `spans.length, 5`; export independently measured with the pinned class signature → `["01","02","03","04","05"]`. |
| K7 | `tests/explore-tour.test.mjs` → `constants.ts` | welcome-copy guard asserts the truthful five-section count | ✓ WIRED — test asserts `five sections`; `constants.ts:133` contains it, `four sections` nowhere. |
| K8 | `tests/portfolio-data-integrity.test.mjs` → `portfolio-main-data.json` | presentations ledger fixture mirrors the new typed flag | ✓ WIRED — fixture `featured: true` ↔ data `featured: true`; `deepStrictEqual` passes. |

## Data-Flow Trace

Traced past "exists" and "wired" to **data-flowing**:

1. **Source** — `src/data/portfolio-main-data.json` (single source of truth): 15 articles (5 featured, all http), 45 certifications (5 featured: 0 http / 4 null / 1 verification ID), 1 presentation (featured, http).
2. **Load** — `src/app/explore/page.tsx` imports the JSON as a server component and passes the whole object to `<ExplorePanels data={portfolioData} />`.
3. **Dispatch** — `explore-panels.tsx:104` adapter closure slices `articles` / `certifications` / `presentations` into `<CredentialsSection>`; the total `Record<ExploreSectionId,…>` maps make a missing slice a typecheck failure, not a silent blank.
4. **Render** — `CredentialsSection` filters `featured` → `CredentialRow{name, secondary, href}` → one shared `CredentialList`.
5. **Reached the client** — proof the props genuinely cross the RSC boundary: the ISTQB name, the `ID: GRTB-24-1S20-CTFL` string and `Allure Reporting` are **PRESENT in the RAW `out/explore.html` and ABSENT from the stripped document** (they exist only inside the serialized client-island props / hydration-only bodies). Conversely, **all 5 featured article names, their 5 dates and their 5 hrefs are PRESENT in the STRIPPED document** — real server-rendered markup, not JSON.
6. **No hardcoded portfolio copy** — the component contains zero hard-coded colours and reads `name`/`date`/`link` from props (EXPLORE-07 holds); the only literals are the three tab labels and the three pinned empty states.

The strip discipline is load-bearing, not cosmetic: `out/explore.html` is **179,575 bytes raw / 99,752 bytes stripped** (54 script blocks), and the raw document carries data that no rendered markup contains.

## Behavioral Spot-Checks

One named test per behaviour-dependent truth, never the full suite for a single check:

| Check | Command | Result |
|---|---|---|
| Phase acceptance suite (behaviour carrier for T1-3…T1-12) | `node --test tests/credentials-panel.test.mjs` | **19 pass / 0 fail** |
| Red→green transition (executed, not inferred) | worktree `9745193` → `node --test tests/credentials-panel.test.mjs`, then same suite on HEAD | **RED:** 19 tests, 3 pass / **16 fail**, `credentials-section.tsx` ABSENT, `credentials` in constants = 0. **GREEN:** 19 pass / 0 fail on HEAD. Worktree removed. |
| Static-export surface | Node one-liner over the script-stripped `out/explore.html` | `id="credentials"` · `Credentials` · `Articles` · `Certifications` · `Presentations` · `0/5 sections visited` all PRESENT; `0/4` · `href="#credentials"` · `Allure Reporting` · `GRTB-24-1S20-CTFL` all **ABSENT** as designed; mono spans = `["01","02","03","04","05"]`, count 5 |
| Data contract | `node -e` over `portfolio-main-data.json` | collections 15/45/1; featured 5/5/1; featured-cert links http **0**, null **4**, ID **1**; all 5 featured article links http; presentation link http + featured |
| Prohibitions | `grep` over the phase files | `framer-motion` in `credentials-section.tsx` = 0; no `order-*` class; `package.json` + lockfile unchanged since the phase base (`git diff --stat 9bab3f3..HEAD` empty) |
| Renewal sweep | `grep -rn` for the nine retired 4-section literals across `tests/` | all **0** live matches |
| No stubs | `grep -rn "TBD\|FIXME\|XXX"` over the phase-touched files; `grep -rn "test.skip\|todo("` over `tests/` | **none** in either scan; `node --test` reports 0 skipped / 0 todo |
| Whole gate | `npm run typecheck && npm run build && node --test tests/*.test.mjs` | exit 0 / exit 0 / **269 pass, 0 fail** (13 files) |

## Requirements Coverage

| Requirement | Delivered? | Evidence |
|---|---|---|
| **REV-21** — combined tabbed 'Credentials' panel beside the Projects stack (row 3), 3 tabs (Articles 5 featured / Certifications 5 featured / Presentations 1 featured-flagged), curated items as compact calm rows, drawer + counter to 5 sections (N/5), wizard step sequence as-is | ✓ DELIVERED (one documented narrowing) | Panel: T1-2/T1-3/T1-5/T1-6/T1-8 + K1. Data: 5 articles / 5 certs / 1 presentation all measured, featured flag typed in `.d.ts` same-commit. Drawer/counter: T1-9. Wizard: 6 steps unchanged (Deferred table). **Narrowing:** "each tab listing its curated items … title + date + link" — the Certifications tab renders 0 anchors because the measured data has 0 URL-bearing featured certifications; Articles and Presentations carry real links. |
| Roadmap phase-11 goal — "A combined tabbed 'Credentials' panel (Articles \| Certifications \| Presentations — curated items, calm rows) sits beside the Projects stack, completing the /explore page with the credibility story." | ✓ DELIVERED | Verified on the built static export of `8d7727f`: the panel exists at `id="credentials"` as the 5th panel, sits in row 3 beside Projects at md+ (T1-2), and its default Articles body is server-rendered with the curated 5. |

No other REQ-ID is mapped to phase 11 in ROADMAP.md (row 11: `REV-21` only). Prior requirements (EXPLORE-*, REV-01…REV-20) remain satisfied by their own phases; the only phase-11 impact on them was the section-count widening, and every suite that pinned the old count was renewed and is green (T2-1…T2-8). Phase 10's REV-18…REV-20 constructs were re-inspected and remain intact alongside phase 11's (impact table above).

## Anti-Patterns Found

No BLOCKER. No `TBD`/`FIXME`/`XXX` debt marker, no placeholder, no skipped test, and no unreferenced stub exists in any file phase 11 touched (scans above).

| ID | Severity | Finding |
|---|---|---|
| AP-1 | INFO | Stale doc comment: `src/components/explore/explore-status-bar.tsx:7-11` still says `` `N/4 sections visited` ``, "the merged grid has 4 sections" and "At 4/4 the counter span renders text-accent". The code derives `${visitedCount}/${EXPLORE_SECTIONS.length}` (`:49`) and now renders N/5. Documentation drift only — no test reads it. |
| AP-2 | INFO | Stale doc comments in `src/components/explore/explore-panels.tsx`: `:13` "All four sections are registered" (5 now) and `:62` "zero-padded mono index 01–04" (01–05 now; the delivered export measures `05`). |
| AP-3 | INFO | `explore-panels.tsx` still describes the array as the 4-entry phase-9 reflow in places; the real array is `[about, skills, experience, projects, credentials]`. |
| AP-4 | INFO | `tests/credentials-panel.test.mjs:103,111` and `tests/explore-tour.test.mjs:190` contain the literal `four sections` inside **negative/absence assertions**. Correct as written — recorded so a future grep sweep does not mistake them for staleness. |
| AP-5 | INFO | **Introduced by phase 10, in a phase-11-touched file.** `src/components/explore/explore-panels.tsx:30,35,112` attribute the projects-natural-height fact to "phase-10 REV-21". That attribution is wrong: ROADMAP assigns REV-21 to phase 11 (credentials), phase 10's own SPEC maps **REV-18/REV-20**, and phase 10's CONTEXT never mentions REV-21. The fact itself ("the panel renders at natural height with the stack centered in its stage") is REV-18 verbatim and holds in the code. Documentation misattribution only — no behaviour affected, no test reads it. |

Suggested follow-up (non-blocking, not part of this phase's must_haves): a one-line comment refresh on AP-1/AP-2/AP-3/AP-5, exactly as plan 01 already did for `panel-shell.tsx` (`01–04` → `01–05`).

## Human Verification Required

**None outstanding.** This phase previously carried three browser-observable items (tab switching into the two Radix-`Presence`-gated tab bodies; the 375px/both-theme computed layout; reduced-motion rendering under a real OS setting) and was held at `human_needed` because this repo installs **no DOM or headless test tier** (jsdom, happy-dom, playwright, puppeteer, `@testing-library/react` all absent from `node_modules`), so no passing behavioural test can execute the tab switch from this harness. Those items were **confirmed by the user** in the batch round recorded in commit `c97b0e8` (`status_human: approved`, applied to phases 07–11 together), which is why this re-verification returns `passed` rather than re-raising them.

Everything reachable statically was re-established on `8d7727f`: props crossing the RSC boundary, the 5/0/4/1 certification data contract, the URL-only anchor predicate, the 44px rail, the empty states, the `date · ID` line, the 5-anchor drawer derivation, the 5-span export chrome and the `0/5` counter.

Recorded observation for a future phase (not a blocker): the tab-switch and reduced-motion contracts remain permanently unassertable until a DOM tier is added, so any future renewal of this panel should expect the same human-only residue.

## Gaps Summary

**None.** No truth FAILED, no artifact is missing or a stub, no key link is NOT_WIRED, and no blocker-class anti-pattern exists. The five findings above are INFO-level documentation drift (AP-5 introduced by phase 10 in a shared file), and the single SPEC-wording narrowing (certifications as plain text, not anchors) is a planning-approved supersession backed by measured data — recorded, not missing.

The phase is `passed`: **41/41 must-haves verified**, gate green on the current tree (`typecheck` 0, `build` 0 with 6/6 static pages, **269/269 tests** across 13 files, 0 skipped), tracked tree clean, and the three previously-outstanding human items resolved by the recorded user confirmation. Critically, this verdict was established **on the moved tree** (`8d7727f`, after phase 10 landed) rather than inherited from the `27d3d90` report — and phase 10's edits to `explore-panels.tsx` and `tests/explore-visuals.test.mjs` were verified not to have invalidated any phase-11 must-have.

## Human Verification Record (2026-09-25, user-confirmed in batch)

User verdict (batch round): **confirmed** — the phase's live review items were reviewed across the phase's execution and revision cycles, and the user confirms them in the 2026-09-25 batch approval round.

status_human: approved
