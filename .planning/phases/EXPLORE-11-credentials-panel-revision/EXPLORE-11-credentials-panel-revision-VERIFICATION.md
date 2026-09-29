---
phase: 11-credentials-panel-revision
verified: 2026-09-29T23:38:23+03:00
status: human_needed
score: 41/41 must-haves verified
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "Open /explore at >=768px and switch tabs inside the Credentials panel: click Certifications, then Presentations — and again with the keyboard (focus the tab list, ArrowRight/ArrowLeft, Enter)."
    expected: "The Credentials panel sits to the RIGHT of the Projects stack in row 3 and carries three working tabs. Certifications shows exactly 5 rows as PLAIN TEXT (ISTQB® Foundation Level (CTFL) reads `July 2024 · ID: GRTB-24-1S20-CTFL` on one combined secondary line; the four Anthropic entries read `2026`) — zero anchors, no external arrow, no hover underline; the tab is still keyboard-reachable and arrow-key navigable with aria-selected following focus. Presentations shows the single row `Boosting Your Team's Clarity with Allure Reporting` / `November 2025` as a real external anchor opening in a new tab, with the ArrowUpRight nudging on hover."
    why_human: "The two non-default tab bodies never reach the static export — Radix mounts TabsContent through Presence only while its tab is selected (src/components/ui/tabs.tsx re-exports @radix-ui/react-tabs; no TabsContent opts into forceMount), so the certification/presentation rows render only after hydration. The suite pins them at source/data level by design and NO passing behavioural test executes the switch: this repo installs no DOM/headless tier (jsdom, happy-dom, playwright, puppeteer, @testing-library all absent from node_modules), so the interaction cannot be asserted from this harness."
  - test: "Open /explore at 375px in dark AND light theme and scroll the whole page."
    expected: "The Credentials panel stacks full-width BELOW the Projects stack (single column), with no horizontal scrolling/overflow anywhere; the panel title truncates rather than pushing the row wide; tab triggers may wrap to a second line rather than clip a label; both themes remain legible with no hard-coded colour."
    why_human: "The stacking classes (`grid-cols-1 gap-4 md:grid-cols-2`), the `truncate` on the title and the theme-token-only colour usage are source-verified and the grid child order is verified, but 'no horizontal overflow at 375px' and cross-theme legibility are computed-layout facts that need a real viewport."
  - test: "With the OS/browser set to prefers-reduced-motion: reduce, reload /explore and hover/focus an Articles row, then scroll to the Credentials panel on first paint."
    expected: "The row's ArrowUpRight does not nudge right and the panel entrance does not translate/fade — both are suppressed by the pre-existing `.explore-shell *` guard, with no new exception rule; the panel content swaps instantly."
    why_human: "The guard (`@media (prefers-reduced-motion: reduce) { .explore-shell * { animation: none !important; transition: none !important; } }`) and the `.exp-nudge` transition it must beat are source-verified, but the rendered suppression outcome under a real OS setting is a browser behaviour."
---

# Phase 11: credentials-panel-revision Verification Report

**Verification basis.** HEAD `27d3d90` on branch `phase-11`; tracked working tree clean (`git status --porcelain -uno` empty). Phase 11 is the tip of this milestone — no later phase has renewed or superseded any phase-11 construct — so every truth was verified **on the delivered tree itself**, not on a reconstructed ancestor. Nothing in either SUMMARY.md was accepted as evidence: every number below was produced by a command run in this session, and the two SUMMARY tables that could be cross-checked against measurement were (they agree). The one claim that would otherwise have rested on git-history inference — the RED half of the TDD contract — was **executed against a throwaway worktree of the test-only commit** rather than taken on trust (T1-1).

**The gate, re-run independently on the final workspace state:**

```
npm run typecheck            → exit 0
npm run build                → exit 0   (6/6 static pages; routes / /_not-found /explore /resume all ○ Static;
                                          out/index.html, out/explore.html, out/resume.html emitted)
node --test tests/*.test.mjs → exit 0   267 tests, 267 pass, 0 fail, 0 skipped, 0 todo — 13 test files
git status --porcelain -uno  → empty (no tracked source/test write after the run)
```

The gate was re-run **after this report was written**, so the green run below covers the final workspace state including the report itself — no write of any kind follows it. CI ground truth checked: `.github/workflows/deploy.yml` runs `npm install` + build on Node 20 and **never runs the test suite**, so the node --test gate above is the local suite that the phase's own acceptance criteria name.

## Supersession of record (not a gap)

One planned narrowing of the SPEC's literal wording, approved at UI-SPEC level during planning and carried into both plans' must_haves. It is judged as deliberate design, not missing coverage, because the DATA was measured and matches the narrowed contract exactly:

| SPEC / CONTEXT wording | Narrowed by | Measured reality | Effect |
|---|---|---|---|
| SPEC acceptance "every row an anchor"; CONTEXT D-02 "compact anchor rows" | UI-SPEC §5.3/§5.4 (CERT-ID-01) | of the 5 featured certifications: **0** links start with `http`, **4** are `null`, **1** is the literal `"ID: GRTB-24-1S20-CTFL"` | The Certifications tab renders 5 plain-text rows and **0 anchors**; Articles and Presentations keep real anchors. No certification anchor is asserted anywhere. |

Also superseded at plan time and verified as implemented: CONTEXT D-01's "≈60%/40%" split (dropped in favour of the existing plain `md:grid-cols-2` two-column split, UI-SPEC LAYOUT-01) and the plan's `<context>` note that CONTEXT D-04's "about, experience, skills" phrasing is stale (the real array order is `about, skills, experience, projects, credentials`).

## Goal Achievement → Observable Truths

### Plan 01 must_haves (15 truths)

| # | Truth | Status | Evidence |
|---|---|---|---|
| T1-1 | The new Credentials acceptance suite fails BEFORE implementation (RED) and passes after (GREEN) | ✓ VERIFIED — **RED reproduced independently in this session** | Not read from SUMMARY: a `git worktree add --detach /tmp/p11-red 9745193` tree (the test-only commit, `git show --stat` = `tests/credentials-panel.test.mjs`, 366 insertions, 1 file) was built (`npm run build` exit 0) and the suite run there → **exit 1, 4 pass / 15 FAIL**, with `credentials-section.tsx` verified **ABSENT** from that tree (`test -f` → absent) and every one of the 15 failing row names matching plan 01's recorded raw output. Same suite on HEAD → `node --test tests/credentials-panel.test.mjs` → **19 pass / 0 fail**. Both sides measured; one passing test per side. |
| T1-2 | Credentials panel sits immediately right of the Projects stack at md+, full-width below it at <md, **no `order-*` utility** | ✓ VERIFIED | `explore-panels.tsx:134` = `grid panel-grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5`; DOM order is the 5-entry array, `experience` carries `md:col-span-2`, so at md+ row 3 = `projects \| credentials` and at <md everything stacks. `grep -rn "order-"` over the three grid-chain files returns only `border-` false positives and doc comments (`credentials-section.tsx:39,73,84`, `explore-panels.tsx:21,34`) — zero `order-*` class. |
| T1-3 | Three tabs (Articles \| Certifications \| Presentations), Articles selected on load, Articles rows are real text in the static export | ✓ VERIFIED | `credentials-section.tsx:163` `defaultValue="articles"`; tabs at `:165-173`. On the **script-stripped** `out/explore.html`: all three labels present, and ALL FIVE featured article names render as text (`Your AI Agent…`, `Your Playwright Tests Take 45 Minutes…`, `Core Design Patterns for Test Automation…`, `Flaky Tests Driving You Crazy?…` — entity-decoded, `&#x27;` — and `A QA Engineer's Guide…`). No `forceMount` on any `TabsContent`. |
| T1-4 | Static-export assertions stay inside the SSR surface, every export row reads the script-stripped document | ✓ VERIFIED | `tests/credentials-panel.test.mjs:50` defines the single reader `readExportMarkup = () => readExport().replace(/<script[\s\S]*?<\/script>/g, '')`; all four export rows (`:303-365`) call it and nothing calls `readExport()` directly in an assertion. `grep -c 'href="#credentials"'` = **0**; the client-only surfaces are asserted only negatively (`:359-364`). |
| T1-5 | Articles tab lists the 5 featured articles as compact rows carrying title, date and an external link | ✓ VERIFIED | Measured on the data: 5 featured articles, **all 5** links start with `http`. On the stripped export, **all 5 article hrefs** are present as real anchors (`href="https://generativeai.pub/…"`, `https://medium.com/startup-insider-edge/…`, `https://medium.com/@tasostilsi/a85a11c2c932?…`, `…/flaky-tests-driving-you-crazy-…`, `…/a-qa-engineers-guide-…`) and **all 5 dates** (`Sep 14, 2026`, `May 26, 2026`, `Sep 17, 2025`, `Jun 28, 2025`, `Dec 23, 2025`) render. Row anatomy source-pinned at `credentials-section.tsx:39-116` (name + verbatim date + arrow). |
| T1-6 | Certifications tab lists the 5 featured certifications with name + date; the ISTQB entry renders `ID: GRTB-24-1S20-CTFL` as plain text on a combined `date · ID` line and is NOT an anchor, as are the 4 null-link entries | ✓ VERIFIED (source + data) | Data measured directly: featured certs = 5; `link` http = **0**, `null` = **4**, `=== 'ID: GRTB-24-1S20-CTFL'` = **1**. `credentials-section.tsx:49-50` single named predicate `isExternalLink` (`typeof link === 'string' && link.startsWith('http')`) is the ONLY anchor gate; `:146-150` builds the combined `date · ID` secondary line. Payload proof that the island actually receives all 5 featured certs: **5/5** featured cert names + the ID string are present in the RAW document and absent from the stripped one (client-only). Browser render of the switched tab → Human Verification 1. |
| T1-7 | Supersession of record (SPEC "every row an anchor" / D-02 narrowed FOR THE CERTIFICATIONS TAB) is recorded in SUMMARY | ✓ VERIFIED | `EXPLORE-11-…-01-SUMMARY.md` §"Supersession of record" states it verbatim in meaning, with the measured 5/0/4/1 counts; restated in the plan-02 SUMMARY. Matches the data measured in this session exactly. |
| T1-8 | Presentations tab lists the single Allure Reporting presentation with its date and a real external link | ✓ VERIFIED (source + data) | `presentations[0]` = `"Boosting Your Team's Clarity with Allure Reporting"`, `date: "November 2025"`, `link: "https://tasostilsi.github.io/presentations/allure-reporting/"`, `featured: true`; `presentationRows` filters on `featured` and gates the href with the same URL predicate (`:153-160`). Name absent from the stripped export = hydration-only as designed; name + `Allure Reporting` present in RAW (props delivered). Browser render → Human Verification 1. |
| T1-9 | The drawer derives 5 anchors ending in `05 Credentials`; the status bar renders `0/5 sections visited` in the no-JS static export | ✓ VERIFIED | `explore-drawer.tsx` maps `EXPLORE_SECTIONS` (5 entries) with `href={\`#${section.id}\`}` `:62` and `String(i + 1).padStart(2, '0')` `:70`, plus `credentials: 'text-chart-5'` in `DIGIT_ACCENTS` — so item 5 is `05 Credentials`. `explore-status-bar.tsx:49` renders `${visitedCount}/${EXPLORE_SECTIONS.length} sections visited` → `0/5` in the export (measured: `0/5 sections visited` present, `0/4` absent elsewhere in the repo). `use-explore-visited.ts` untouched and derives its id list from the same constant. |
| T1-10 | Nothing was deleted: articles 15, certifications 45, presentations 1 | ✓ VERIFIED | `node -e` over `src/data/portfolio-main-data.json`: **15 / 45 / 1**. The ledger suite that exists to catch deletions (`assert.deepStrictEqual(data.presentations, PRE_PRESENTATIONS)`) passes at full strength. |
| T1-11 | An empty featured list renders exactly one calm non-link row with the three pinned dash-free strings | ✓ VERIFIED | `credentials-section.tsx:69-79`: single `<div>` row on the same `ROW_BASE` (44px) rhythm, icon slot kept muted + `aria-hidden`, message in `text-muted-foreground`. The three literals (`No featured articles.` / `No featured certifications.` / `No featured presentations.`) are present at `:176,179,182` and asserted by the suite. Unreachable with the current 5/5/1 featured data by design. |
| T1-12 | Every tab trigger and every row meets a 44px-equivalent target; the whole row is the link hit target | ✓ VERIFIED | `min-h-[44px]` on each `TabsTrigger` (`:165,168,171`, with `h-auto flex-wrap` so the shadcn `h-10` cannot clip it) and on `ROW_BASE` (`:39`). The anchor branch (`:102-111`) applies `rowClass + ROW_INTERACTIVE` to the `<a>` itself, so the whole row is the hit target with the shared `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` recipe. |
| T1-13 | 375px: Credentials full-width below the Projects stack, no horizontal overflow (title truncates); both themes legible via theme tokens only | ✓ VERIFIED (source) / ⚠ visual confirm outstanding | Stacking comes from `grid-cols-1` (see T1-2); the title carries `min-w-0 flex-1 truncate` (`:88`); `credentials-section.tsx` contains **zero** hard-coded colours (`grep -nE "#[0-9a-fA-F]{3,6}\|rgb\(\|hsl\("` → none) — every class is a theme token (`text-foreground`, `text-muted-foreground`, `bg-muted/40`, `border-border`, `ring-ring`). The rendered no-overflow claim is perceptual → Human Verification 2. |
| T1-14 | Reduced motion removes the row hover nudge and the panel entrance through the pre-existing guard, with no new exception added | ✓ VERIFIED (source) / ⚠ browser confirm outstanding | `globals.css:648-662` guard is unchanged and still matches `.explore-shell *` + the portaled Sheet selectors; `.exp-nudge` (`:635-641`) and the `.panel-grid > *` entrance (`:601-608`) both live inside `.explore-shell`. Phase 11's only CSS addition is one `animation-delay` line — no new exception rule was introduced. Rendered outcome → Human Verification 3. |
| T1-15 | Prohibitions hold: no framer-motion import in any Credentials file, no new dependency, no `order-*` utility, no carousel/stack machinery | ✓ VERIFIED | `grep -c 'framer-motion' src/components/explore/sections/credentials-section.tsx` = **0**; `git diff --stat 9bab3f3..HEAD -- package.json package-lock.json` = **empty** (no dependency added); no `order-*` class (T1-2); the panel contains no carousel/drag/stack code — it is `Tabs` + one static row list. |

### Plan 02 must_haves (8 truths)

| # | Truth | Status | Evidence |
|---|---|---|---|
| T2-1 | No assertion anywhere in `tests/` still encodes the retired 4-section contract | ✓ VERIFIED | Repo-wide sweep (counts of matches in `tests/`): `0/4 sections visited` **0**, `!src.includes('text-chart-5')` **0**, `!src.includes('chart-5')` **0**, `spans.length, 4` **0**, `exactly four adapter closures` **0**, `four total closures` **0**, `N/4` **0**, `01-04` **0**, `01–04` **0**, `4 locked sections` **0**, `4 anchor items` **0**. The 3 surviving `four sections` hits are live ABSENCE assertions (`credentials-panel.test.mjs:103,111`; `explore-tour.test.mjs:190` `!welcome.includes('four sections')`) and the 2 `4 sections` hits are history comments in `explore-shell.test.mjs:271,353`. No live positive assertion of the retired count remains. |
| T2-2 | No test TITLE or message still says "four total closures" / "exactly four adapter closures" | ✓ VERIFIED | Both renewed with their counts: `explore-visuals.test.mjs:341` and `explore-visuals-skills.test.mjs:172` both read `exactly five adapter closures — the registry is total over the 5-section grid (D-04/D-07; phase-11 REV-21)`; the suite title at `explore-visuals.test.mjs` now reads `five total closures … (phase-11 REV-21)`. `grep -c "four total closures"` = **0**. |
| T2-3 | The drawer suite asserts 5 anchors including the credentials digit accent; the counter suites assert the live N/5 template and the static `0/5 sections visited` string | ✓ VERIFIED | `grep -c "credentials: 'text-chart-5'" tests/explore-shell.test.mjs` = **1** (and both former negative assertions are now positive requirements — `grep -c "!src.includes('chart-5')"` = 0); `0/5 sections visited` asserted in `explore-shell.test.mjs` and `explore-tour.test.mjs`; the N/5 template derives from `EXPLORE_SECTIONS.length` and the shell suite passes 30/30. |
| T2-4 | The export suite asserts 5 panel index spans 01-05 and 5 adapter closures (CredentialsSection is the 5th) | ✓ VERIFIED | `explore-visuals.test.mjs:773` title `…five panel headers… 01-05`; `:782` `assert.equal(spans.length, 5, …)`; digits `['01','02','03','04','05']`. Independently reproduced on the freshly built export with the pinned full class signature: **spans = `["01","02","03","04","05"]`, count 5**. Closure rows added at `:331` (`credentials: ({ data }) => <CredentialsSection … />`) + `credentials: 'bg-chart-5'`. |
| T2-5 | The tour suite asserts the welcome copy says "five sections" and no longer asserts "four sections" | ✓ VERIFIED | `explore-tour.test.mjs:186` `welcome.includes('five sections')`, `:190` `!welcome.includes('four sections')`; source matches (`constants.ts:133` body text reads "A 60-second lap of the five sections"), so the copy is truthful about the panel count (UI-SPEC §9 TOUR-01). |
| T2-6 | The sweep suite asserts the 5-entry EXPLORE_SECTIONS order including credentials; both adapter-closure suites assert 5 | ✓ VERIFIED | `explore-sweep.test.mjs:76` `['about','skills','experience','projects','credentials']`; closure count asserted `5` in BOTH `explore-visuals.test.mjs:341` and `explore-visuals-skills.test.mjs:172`; both suites pass (20/20 and 10/10). |
| T2-7 | The `PRE_PRESENTATIONS` ledger fixture gains the typed featured flag while `deepStrictEqual` stays intact | ✓ VERIFIED | `tests/portfolio-data-integrity.test.mjs:119-129` fixture carries `featured: true`; `:451` still `assert.deepStrictEqual(data.presentations, PRE_PRESENTATIONS)` — full-collection deep equality, NOT narrowed to a length or `Object.keys`. Suite passes 23/23. |
| T2-8 | The full `node --test tests/*.test.mjs` suite passes on the final tree after a fresh `npm run build`, and that run is chronologically the last action | ✓ VERIFIED | Independently re-run here in that order: `npm run build` → exit 0, then `node --test tests/*.test.mjs` → **267 pass / 0 fail / 0 skipped**, 13 files. `git status --porcelain -uno` immediately after = **empty**; the later planning commits in the log (`a5d52c2`, phase 7–10 verify artefacts) are docs-only and touch no source or test file. |

## Score

**41/41 must-haves verified** — 23 from plan 01 (15 truths + 4 artifacts + 4 key links) and 18 from plan 02 (8 truths + 6 artifacts + 4 key links).

- Truths verified: **23/23**
- Artifacts present + substantive + wired: **10/10**
- Key links WIRED: **8/8**
- `behavior_unverified`: **0** — no truth is left as PRESENT_BEHAVIOUR_UNVERIFIED; the three items that need a real browser are visual/hydration confirmations (Human Verification), not missing behavioural tests.
- `overrides_applied`: **0** — no user-directive override was needed; the one narrowing (certifications not anchors) was approved during planning and is documented above.

Status is `human_needed` per decision rule (b): no truth FAILED, no artifact is missing or a stub, no key link is NOT_WIRED, and no blocker anti-pattern exists — but three phase behaviours are only observable in a browser, matching the house precedent for the interactive phases (07 `human_needed` 34/34, 08 `human_needed` 39/39, 09 `human_needed` 58/58).

## Deferred Items

Filtered against later milestone phases: **phase 11 is the last phase of milestone v1.0** (ROADMAP table rows 01–11, all statuses `pending`; no phase 12 exists), so nothing deferred here is picked up downstream. All three deferrals from CONTEXT are legitimate and out of the delivered scope:

| Deferred item | Source | Verdict |
|---|---|---|
| Presentations beyond the single entry (future talks extend the flag mechanism) | CONTEXT `<deferred>` | Correctly deferred — the typed `featured?: boolean` on `Presentation` already generalises, so a second talk needs no code change beyond data. |
| Tab state persistence across reloads (default Articles each load) | CONTEXT `<deferred>` | Correctly deferred — matches the pinned SSR contract (`defaultValue="articles"`); persisting would move the default off the server-rendered tab. |
| A Credentials step in the wizard tour | CONTEXT `<deferred>` / D-04 | **Deliberately kept out**: verified — `EXPLORE_TOUR_STEPS` still has exactly 6 entries (`welcome → about → experience → skills → projects → finish`), `TourStep["id"]` union is unchanged, and both the tour suite and the acceptance suite assert no `credentials` step. "Walking the wizard marks 4 of 5" was pinned as acceptable. |

No deferred item is silently half-built: none of the three has a partial implementation in the tree.

## Required Artifacts

| Artifact | Requirement | Actual | Status |
|---|---|---|---|
| `tests/credentials-panel.test.mjs` | ≥ 60 lines; source-level rows + export rows cut to the SSR surface | **366 lines**, 19 tests, all passing; helper `readExportMarkup` strips scripts for every export row | ✓ |
| `src/components/explore/sections/credentials-section.tsx` | ≥ 90 lines; exports `CredentialsSection`; 3-tab panel, calm rows, empty states, no framer-motion | **186 lines**; `export function CredentialsSection` at `:122`; `"use client"` at `:1`; zero `framer-motion` | ✓ |
| `src/data/portfolio-main-data.json` | the single presentation entry gains `featured: true` | `presentations[0].featured === true`; no field renamed or removed | ✓ |
| `src/app/globals.css` | entrance-stagger cascade extended to the 5th grid child at 160ms | `.explore-shell .panel-grid > *:nth-child(5) { animation-delay: 160ms; }` at `:608`, matching the +40ms cadence, placed after the `nth-child(4)` rule | ✓ |
| `tests/explore-shell.test.mjs` | 5-section constants/drawer/counter export rows; chart-5 digit REQUIRED | passes 30/30 | ✓ |
| `tests/explore-tour.test.mjs` | 5-entry accent map, widened valid ids, truthful "five sections" copy, `0/5` static counter, 6-step table intact | passes 45/45 | ✓ |
| `tests/explore-sweep.test.mjs` | 5-entry `EXPLORE_SECTIONS` order assertion | passes 20/20 | ✓ |
| `tests/explore-visuals.test.mjs` | 5 index spans 01–05 + 5 adapter closures | passes 31/31 | ✓ |
| `tests/explore-visuals-skills.test.mjs` | 5 adapter closures including CredentialsSection | passes 10/10 | ✓ |
| `tests/portfolio-data-integrity.test.mjs` | ledger fixture carries the typed flag, deepStrictEqual intact | passes 23/23 | ✓ |

## Key Link Verification

| # | From → To | Via (pinned pattern) | Status |
|---|---|---|---|
| K1 | `constants.ts` → `explore-panels.tsx` | `EXPLORE_SECTIONS` 5th entry drives `ACCENTS`, `SECTION_BODIES` (total `Record<ExploreSectionId,…>`) and `buildPlacement` | ✓ WIRED — `explore-panels.tsx:39` matches `credentials: ({ data }) => <CredentialsSection …` (1 hit); `ACCENTS.credentials = 'bg-chart-5'` at `:21`; `buildPlacement` returns `credentials: { wrapper: '', shell: '', gate: false }` at `:70` (natural height, no `md:sticky`/`md:h-`/`md:col-span-2`). `npm run typecheck` exit 0 is the total-map proof. |
| K2 | `constants.ts` → `explore-drawer.tsx` | section id → drawer anchor + per-id digit accent | ✓ WIRED — `explore-drawer.tsx:43` `credentials: 'text-chart-5'` (1 hit); the anchor and its `05` index derive from the shared array (`:62`, `:70`). |
| K3 | `credentials-section.tsx` → `portfolio-main-data.json` | featured-only filtering from the data prop (EXPLORE-07) | ✓ WIRED — 3 matches of `.filter((x) => x.featured)` (`:132`, `:142`, `:154`); the JSON is read once in `src/app/explore/page.tsx:33` and flows `page → ExplorePanels → SECTION_BODIES closure → section props`. |
| K4 | `globals.css` → `explore-panels.tsx` | `.panel-grid > *:nth-child(5)` stagger for the new 5th grid child | ✓ WIRED — `globals.css:608` matches the pinned pattern (1 hit); the 5th grid child is the Credentials wrapper. |
| K5 | `tests/explore-shell.test.mjs` → `explore-drawer.tsx` | digit-accent assertion now REQUIRES `credentials: 'text-chart-5'` | ✓ WIRED — 1 hit in the test, 1 in the drawer source. |
| K6 | `tests/explore-visuals.test.mjs` → `panel-shell.tsx` | 5 rendered index spans 01–05 in `out/explore.html` | ✓ WIRED — test asserts `spans.length, 5`; export independently measured with the pinned class signature → `["01","02","03","04","05"]`. |
| K7 | `tests/explore-tour.test.mjs` → `constants.ts` | welcome-copy guard asserts the truthful five-section count | ✓ WIRED — test asserts `five sections`; `constants.ts:133` contains it, `four sections` nowhere. |
| K8 | `tests/portfolio-data-integrity.test.mjs` → `portfolio-main-data.json` | presentations ledger fixture mirrors the new typed flag | ✓ WIRED — fixture `featured: true` ↔ data `featured: true`; `deepStrictEqual` passes. |

## Data-Flow Trace

Traced end to end, past "exists" and "wired" to **data-flowing**:

1. **Source** — `src/data/portfolio-main-data.json` (the single source of truth): 15 articles (5 featured, all http), 45 certifications (5 featured: 0 http / 4 null / 1 verification ID), 1 presentation (featured, http).
2. **Load** — `src/app/explore/page.tsx:33` imports the JSON as a server component; `:50` passes the whole object to `<ExplorePanels data={portfolioData} />`.
3. **Dispatch** — `explore-panels.tsx:39` adapter closure slices `articles` / `certifications` / `presentations` into `<CredentialsSection>`; total `Record<ExploreSectionId,…>` maps make a missing slice a typecheck failure, not a silent blank.
4. **Render** — `CredentialsSection` filters `featured`, maps to `CredentialRow{name, secondary, href}` and renders through one shared `CredentialList`.
5. **Reached the client** — proof the props genuinely cross the RSC boundary: **all 5 featured certification names, the `ID: GRTB-24-1S20-CTFL` string and `Allure Reporting` are present in the RAW `out/explore.html` and absent from the stripped document** (they exist only inside the serialized client-island props / hydration-only bodies). Conversely, **all 5 featured article names, their 5 dates and their 5 hrefs are present in the STRIPPED document** — real server-rendered markup, not JSON.
6. **No hardcoded portfolio copy** — `grep -c 'Allure Reporting'` = 0 and `grep -c 'GRTB-24-1S20-CTFL'` = 0 in the component source (EXPLORE-07 holds); every visible string except the tab labels and the three pinned empty states comes from the data.

The strip discipline is confirmed load-bearing rather than cosmetic: `out/explore.html` is **179,335 bytes raw / 99,512 bytes stripped** (52 `<script>` blocks), and the raw document carries data that no rendered markup contains.

## Behavioral Spot-Checks

One named test per behaviour-dependent truth, never the full suite for a single check:

| Check | Command | Result |
|---|---|---|
| Phase acceptance suite (the behaviour carrier for T1-3…T1-12) | `node --test tests/credentials-panel.test.mjs` | **19 pass / 0 fail** |
| Red→green transition (executed, not inferred) | `git worktree add --detach /tmp/p11-red 9745193` → `npm run build` → `node --test tests/credentials-panel.test.mjs`, then the same suite on HEAD | **RED:** exit 1, 4 pass / **15 fail** at the test-only commit (no `credentials-section.tsx` in that tree). **GREEN:** exit 0, **19 pass / 0 fail** on HEAD. Worktree removed afterwards; tracked tree clean. |
| Static-export surface | Node one-liner over the script-stripped `out/explore.html` | `id="credentials"` · `Credentials` · `Articles` · `Certifications` · `Presentations` · `0/5 sections visited` all present; `0/4` · `href="#credentials"` · `Allure Reporting` · `GRTB-24-1S20-CTFL` all **absent** as designed; mono index spans = `["01","02","03","04","05"]`, count 5 |
| Data contract | `node -e` over `portfolio-main-data.json` | 15/45/1 collections; featured 5/5/1; featured-cert links http **0**, null **4**, ID **1**; presentation link http |
| Prohibitions | `grep` over the phase files | `framer-motion` in `credentials-section.tsx` = 0; no `order-*` class; `package.json` + lockfile unchanged since the phase base (`git diff --stat 9bab3f3..HEAD -- package.json package-lock.json` empty) |
| Renewal sweep | `grep -rn` for the eight retired 4-section literals across `tests/` | all **0** live matches; survivors are explicit absence assertions/comments only |
| No stubs | `grep -rn "TBD\|FIXME\|XXX"` over the 8 phase-touched files; `grep -rn "test.skip\|todo("` over `tests/` | **none** in either scan; `node --test` reports 0 skipped / 0 todo |
| Whole gate | `npm run typecheck && npm run build && node --test tests/*.test.mjs` | exit 0 / exit 0 / **267 pass, 0 fail** (13 files) |

## Requirements Coverage

| Requirement | Delivered? | Evidence |
|---|---|---|
| **REV-21** — combined tabbed 'Credentials' panel beside the Projects stack (row 3), 3 tabs, curated items as compact calm rows, drawer + counter to 5 sections (N/5), wizard step sequence as-is | ✓ DELIVERED (one documented narrowing) | Panel: T1-2/T1-3/T1-5/T1-6/T1-8 + K1. Drawer/counter: T1-9. Wizard: 6 steps unchanged (Deferred table). Featured sets: 5 articles, 5 certifications (ISTQB + 4 Anthropic), 1 presentation — all measured. **Narrowing:** "each tab listing its curated items … title + date + link" — the Certifications tab renders 0 anchors because the measured data has 0 URL-bearing featured certifications (Supersession section above); Articles and Presentations carry real links. |
| Roadmap phase-11 goal — "A combined tabbed 'Credentials' panel (Articles \| Certifications \| Presentations — curated items, calm rows) sits beside the Projects stack, completing the /explore page with the credibility story." | ✓ DELIVERED | Verified on the built static export: the panel exists at `id="credentials"` as the 5th panel, sits in row 3 beside Projects at md+ (T1-2), and its default Articles body is server-rendered with the curated 5. |

No other REQ-ID is mapped to phase 11 in ROADMAP.md (row 11: `REV-21` only). Prior requirements (EXPLORE-*, REV-01…REV-20) remain satisfied by their own phases; the only phase-11 impact on them was the section-count widening, and every suite that pinned the old count was renewed and is green (T2-1…T2-8).

## Anti-Patterns Found

No BLOCKER. No `TBD`/`FIXME`/`XXX` debt marker, no placeholder, no skipped test, and no unreferenced stub exists in any file phase 11 touched (scans above).

| ID | Severity | Finding |
|---|---|---|
| AP-1 | INFO | Stale doc comment: `src/components/explore/explore-status-bar.tsx:7-11` still says `` `N/4 sections visited` ``, "the merged grid has 4 sections" and "At 4/4 the counter span renders text-accent". The code derives `${visitedCount}/${EXPLORE_SECTIONS.length}` (`:49`) and now renders N/5. Documentation drift only — no behaviour is affected and no test reads it. |
| AP-2 | INFO | Stale doc comments in `src/components/explore/explore-panels.tsx`: `:13` "All four sections are registered" (5 now) and `:51` "zero-padded mono index 01–04" (01–05 now; the delivered export measures `05`). Same class as AP-1. |
| AP-3 | INFO | `explore-panels.tsx:10-12` still describes the array as `[about, skills, experience, projects]` with "Projects spans row 3" — a faithful statement of the phase-9 reflow but not of the current 5-entry array, where Projects shares row 3 with Credentials. |
| AP-4 | INFO | `tests/credentials-panel.test.mjs:103,111` and `tests/explore-tour.test.mjs:190` contain the literal `four sections` inside **negative/absence assertions**. Correct as written (the guards are the point of those rows) — recorded so a future grep sweep does not mistake them for staleness. |

Suggested follow-up (non-blocking, not part of this phase's must_haves): a one-line comment refresh on AP-1/AP-2/AP-3, exactly as plan 01 already did for `panel-shell.tsx:12` (`01–04` → `01–05`).

## Human Verification Required

Listed in the frontmatter as `human_verification`. Summary of why each is human-only:

1. **Tab switching (the phase's core interaction).** The Certifications and Presentations bodies are Radix-`Presence`-gated and therefore absent from the static export by design; the acceptance suite pins them at source/data level, and **this repo installs no DOM or headless test tier** (verified absent from `node_modules`: jsdom, happy-dom, playwright, puppeteer, `@testing-library/react`, `linkedom`, `cheerio`), so no passing behavioural test can execute the switch from this harness. Everything reachable statically is verified (props crossing the boundary, 5/0/4/1 data contract, URL-only anchor predicate, 44px rail, empty states, `date · ID` line).
2. **375px / both themes.** Stacking, truncation and theme-token-only colour are source-verified; "no horizontal overflow" and cross-theme legibility are computed-layout facts.
3. **Reduced motion in a real browser.** The guard and the transitions it must beat are source-verified; the rendered suppression under a real OS setting is a browser behaviour (the same item phases 8 and 9 carried).

None of the three is a gap: each is an observation whose implementing code is present, wired and data-flowing, and whose only unverifiable dimension is perceptual or hydration-time.

## Gaps Summary

**None.** No truth FAILED, no artifact is missing or a stub, no key link is NOT_WIRED, and no blocker-class anti-pattern exists. The four findings above are INFO-level documentation drift, and the single SPEC-wording narrowing (certifications as plain text, not anchors) is a planning-approved supersession backed by measured data — recorded, not missing.

The phase is `human_needed` rather than `passed` solely because three browser-observable behaviours (tab switching, 375px/two-theme layout, reduced-motion rendering) cannot be confirmed from this environment, consistent with how phases 07/08/09 were closed. Everything that *is* programmatically confirmable was confirmed on the delivered tree: **41/41 must-haves verified**, gate green (`typecheck` 0, `build` 0, **267/267 tests**, 13 files), no tracked write after the gate.
