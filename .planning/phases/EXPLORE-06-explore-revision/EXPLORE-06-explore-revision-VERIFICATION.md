---
phase: EXPLORE-06-explore-revision
verified: 2026-10-02T20:36:40+03:00
status: human_needed
score: 27/30 must-haves verified
behavior_unverified: 3
overrides_applied: 0
human_verification:
  - test: "Print /resume at A4 (or ?print=true) and inspect the printed output end-to-end."
    expected: "A single-column A4 document in docx order (SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE → PROJECTS → EDUCATION → CERTIFICATIONS → SELECTED WRITING) with no sidebar-width overflow, no clipped sections, and no page-break splitting a section heading from its body."
    why_human: "Print-media rendering cannot be asserted from source or static HTML, and this environment has no headless browser (no chromium/chrome/firefox, no playwright/puppeteer, no ms-playwright cache). The structural print CSS is test-pinned (`resume: print CSS is single-column (no sidebar widths), A4 + max-w-none retained`), but the rendered result is perceptual. This surface is STILL LIVE and unchanged since phase 6, so the check is directly actionable today."
  - test: "Visual pass on the phase-6 /explore 2×2 panel grid at 768 and 1440 (and note the 375 stack) — re-checkable only against the archived phase-6 tree (git commit 14491e1), not the current working tree."
    expected: "Four panels fill a 2×2 grid with no wide empty space and no empty cells at 768/1440; at 375 the panels stack to a single column."
    why_human: "The zero-empty-cells / zero-col-span structure is deterministically pinned by named passing tests (`sweep rows EXPLORE@* (P): 2×2 zero-empty-cells structure`), but 'no wide empty space' is an aesthetic judgement no source test can assert. NOTE: this surface has since been superseded — /explore was deleted in phase 12 (the experience now serves /), and the grid was reflowed in phases 8/9/11 to a 5-section layout — so it can only be re-inspected by checking out 14491e1. The user's live view of this surface is nevertheless on record: phase 7's SPEC ('the user now rejects too', gantt_kill decision) was written from feedback on the phase-6 output."
  - test: "Check the phase-6 year-grid Projects calendar at 375px width — re-checkable only against the archived phase-6 tree (14491e1)."
    expected: "14 project rows with their bars render inside the panel at 375px with no horizontal overflow and no unreadable labels."
    why_human: "Responsive overflow of a rendered chart is not assertable without a browser. The calendar's geometry and server-render are pinned by tests (`buildProjectCalendar` unit suite 11/11; `export: year-grid calendar server-rendered — aria label + project rows + year ticks`), but not its 375px appearance. NOTE: this artefact was deliberately REMOVED by the later requirement REV-08 (phase 7) — the check is historical only."
---

# Phase 6: explore-revision Verification Report

**Goal:** Refresh the portfolio data to the user's current resume (docx) as source of truth and revise the visual surfaces accordingly — /resume + PDF rebuilt to the docx structure, About+Contact merged, skills as competency + proof cards, projects year-grid calendar — per the user's pre-ship revision list. (Requirements REV-01 … REV-07; REV-07 explicitly deferred.)

## Method & Verification Scope

This is the **first** verification of phase 6. No `VERIFICATION.md` was ever produced for it and no verify commit exists for the phase (`git log --all` shows verify artefacts for phases 5 and 7–12 only) — execution ran straight into phase 7. This report therefore verifies the phase retroactively.

**Verification object.** Phase 6's execute head is `14491e1` (33 commits on top of base `97cc064^`, 2026-09-23 23:39), and it is an ancestor of HEAD. Phases 7–12 legitimately superseded several phase-6 surfaces, so verifying the *current* working tree would manufacture false gaps. All phase-6 claims were therefore checked against a **pristine extraction of that tree**:

```
git archive 14491e1 | tar -x -C /tmp/p6     # node_modules symlinked; no repo mutation
```

and the data/resume truths were **re-confirmed against the current tree** where they are still live.

**Independent reproduction (not a SUMMARY claim).** On the extracted tree I ran the phase's own gate:
`npm run typecheck` → exit 0 · `npm run build` → exit 0 (static export, 6 pages, routes `/`, `/explore`, `/resume`) · `npm run build:resume` → exit 0 · `node scripts/verify-resume-content.js` → exit 0, 39/39 PASS · explicit 11-suite `node --test` enumeration → **200 tests, 200 pass, 0 fail, 0 skipped**. This matches plan 04's claimed 200/200.

### Supersession map (why phase-6 visuals are absent from the current tree)

| Phase-6 deliverable | Current state | Superseding requirement |
|---|---|---|
| 2×2 four-panel grid with About+Contact merged | Reflowed to 3 panels (phase 8), then 5 sections incl. Credentials (phase 11) | REV-14, REV-21 |
| Year-grid Projects calendar (`projects-calendar.tsx`, `buildProjectCalendar`) | **Deleted** — absent from the current tree | REV-08 (phase 7: "both Gantt-style charts removed") |
| Competency cards (BarChart/Treemap already removed; cards introduced) | Data + cards survive; presentation redesigned | REV-09 |
| `/explore` route | Deleted; the experience now serves `/` | REV-22 (phase 12) |
| Refreshed data (`portfolio-main-data.json`) | **Persists** (docx title, 8 competencies, 3 `isTechRelated`) | — |
| /resume docx order + PDF export | **Persists** — `node scripts/verify-resume-content.js` still exits 0 on the current tree | — |

## Goal Achievement → Observable Truths

Statuses: ✓ VERIFIED (passing named test and/or direct reproduction) · ⚠️ PRESENT_BEHAVIOR_UNVERIFIED (implementation present; the claim needs human confirmation).

### Roadmap / requirement truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| R1 | **REV-01** — the data file adopts the docx as source of truth (branding, summary, 8 competencies + proofs, quantified bullets, enriched flagships, featured certs, selected writing), flows to all surfaces, nothing deleted | ✓ VERIFIED | `portfolio-main-data.json` @14491e1: title = docx line 2 (62 chars), `core_competencies` 8 with all proofs non-empty, Chubb 6 / Upstream 3 / Netcompany 4 docx bullets, projects reordered DeepIndex→Clarif-AI both `featured`, certs 41→45 (5 featured), articles 12→15 (5 featured), education MSc+BEng featured. **Nothing-deleted ledger re-derived by diff against the pre-refresh JSON (`b59efee^`)**: interests / favorite_games / presentations / skills byte-equal, all 41 cert names, all 12 article titles, all 7 company+title pairs, all 14 project names, and Smartup PCC's 5 responsibility lines intact — all PASS. Named tests: `ledger: interests / favorite_games / presentations / skills byte-identical`, `certifications: 41 originals intact + 4 Anthropic entries`, `articles: 12 originals intact + 3 new entries`. |
| R2 | **REV-02** — /resume rebuilt to the docx order, print-optimized; chrome + print behaviour preserved | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED (print-width clause) | Order/chrome/curation all ✓ VERIFIED: source order Header → Summary → CoreCompetencies → Experience → Projects → Education → Certifications → Articles (`ResumeView.tsx:117-132`), pinned by `resume: ResumeView renders the docx section order, ascending`; chrome pinned by `resume/page.tsx keeps the print chrome: ?print=true timer + toggle + print buttons`; print CSS pinned by `resume: print CSS is single-column (no sidebar widths), A4 + max-w-none retained`. **The SPEC's "print width verified" clause is not machine-checkable here** (no browser) → human item H1. |
| R3 | **REV-03** — the static PDF export rebuilt to the same docx structure from the refreshed data; hardcoded skills block gone; projects present | ✓ VERIFIED | Reproduced: `npm run build:resume` exit 0 + `node scripts/verify-resume-content.js` exit 0 (39/39 PASS). Independent probe of `public/resume-export.html` (not the project's script): section markers found and **ascending** — SUMMARY 8614 < CORE COMPETENCIES 9353 < PROFESSIONAL EXPERIENCE 12292 < PROJECTS 16055 < EDUCATION 17909 < CERTIFICATIONS 18998 < SELECTED WRITING 20276; Chubb/Upstream/Netcompany present, **Smartup PCC absent from the PDF** (CLI-reachable), ISTQB + 4 Anthropic present, legacy markers (`SKILLS.SYS`, `skill-group-title`, `ARTICLES.LOG`, `CERTS.KEY`, `EDUCATION.BIN`, `PROJECTS.BIN`, `sidebar`) all absent; `grep -c 'https://linkedin.com/in/tasostilsi' scripts/generate-static-resume.js` → 0 while `about.contact` → 5. |
| R4 | **REV-04** — About + Contact merge into one panel; grid rebalanced; no wide empty space at 768/1440; 375px invariant holds | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED (aesthetic clause) | Merge + rebalance ✓ VERIFIED: `contact-section.tsx` deleted, `CHANNELS` (9 rows) absorbed into `about-section.tsx`, panels grid `grid grid-cols-1 gap-4 md:grid-cols-2`, zero `lg:grid-cols-3`, the only `col-span` hit is a doc-comment; named tests `sweep rows EXPLORE@* (P): 2×2 zero-empty-cells structure — 4 sections, 2 cols at md+, no col-span anywhere` and `sweep row EXPLORE@375 (P): grid-cols-1 base class present`. Export: `out/explore.html` carries exactly one `id="about"`, zero `id="contact"`, `0/4 sections visited`. "No wide empty space" is perceptual → human item H2 (surface since superseded). |
| R5 | **REV-05** — Skills bar chart + treemap replaced by competency + proof cards; no recharts usage remains | ✓ VERIFIED | `skills-chart.tsx`, `skills-treemap.tsx`, `ui/chart.tsx` all absent; `techMentions` count in `viz-data.ts` = 0; `skills-section.tsx` renders `data.core_competencies` as cards FIRST with chips + TerminalPointer retained; `package.json` deps = 38, `recharts` undefined. Named tests: `skills-section: competency cards compose FIRST`, `skills-section: zero hardcoded competency strings`, `cross-cutting: recharts removed — 38 dependency keys, no recharts key`, `export: competency cards render every cluster name + proof from the refreshed data`. |
| R6 | **REV-06** — year-grid bars calendar added to the Projects panel above the existing cards, derived from project dates | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED (375px clause) | Implementation ✓ VERIFIED: `projects-calendar.tsx` (pure server component, no `use client`, no recharts) composes FIRST in the Projects body above the tiles and the cards; `buildProjectCalendar` in `viz-data.ts` (injectable `now`); independent probe of `out/explore.html`: calendar aria = **"14 projects across 11 years"**, 28 `bg-chart-4` bar occurrences. Named tests: 11/11 `projects-calendar` unit rows (`11 year columns 2016..2026`, `Month YYYY → one-month-cell bar`, `year-only dates`, `Ongoing`, `unparseable dates never throw`) + `export: year-grid calendar server-rendered`. The **375px appearance** is not assertable without a browser → human item H3 (artefact since removed by REV-08). |
| R7 | **REV-07** — the experience showcase redesign is deferred; no speculative redesign ships; the panel keeps its content | ✓ VERIFIED | `git diff --name-only 97cc064^ 14491e1 -- experience-section.tsx career-span-chart.tsx` → **empty** (byte-untouched across the whole phase). Named test `cross-cutting: REV-07 deferral — the experience showcase stays byte-untouched`. The requirement was later scoped and delivered as phase 8 (REV-12/REV-13) per the REQUIREMENTS annotation — no longer outstanding. |
| R8 | **SPEC acceptance gate** — `npm run build`, `npm run typecheck` and the full suite pass on the final tree; all routes export statically | ✓ VERIFIED | Independently reproduced on the extracted tree: typecheck 0, build 0 with static export of all routes, and the explicit 11-suite run **200/200, 0 fail, 0 skipped**. |

### Plan must-have truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| P1.1 | New branding is data-driven on the CLI welcome banner (desktop + mobile), CLI About box, explore header/intro, root metadata + JSON-LD; zero hardcoded old-title literals in `src/` | ✓ VERIFIED | `grep -rn 'Senior Software Engineer in Test' src/components src/app` → **0**; `WelcomeMessage.tsx` ×2 `portfolioData.about.title`; `out/index.html` contains the new title and 0 old-title literals; `out/explore.html` contains the new title twice. |
| P1.2 | The CLI About ASCII box derives its width; the 62-char title fits with no `padEnd(57)` | ✓ VERIFIED | `AboutOutput.tsx:22` `boxWidth = Math.max(name.length, title.length) + 2` with `'═'.repeat(boxWidth)`; `grep -c 'padEnd(57)'` → 0. |
| P1.3 | CLI `skills` output shows the 8 competency clusters (name + proof) with soft/hard/languages lists unchanged | ✓ VERIFIED | `SkillsOutput.tsx` references `core_competencies` ×2 and prepends the block via the existing chip pattern; typecheck 0; soft/hard/languages blocks untouched in the diff. |
| P1.4 | Nothing deleted: interests, favorite_games, presentations, skills, education, 4 non-docx roles, all 41 original certs, all 12 original articles | ✓ VERIFIED | Ledger re-derived by JSON diff against `b59efee^` — all 10 checks PASS (details under R1). |
| P1.5 | U-4: exactly 3 `isTechRelated: true` entries (Smartup PCC flipped false); the entry stays CLI-reachable | ✓ VERIFIED | JSON: `true` count = **3** (Chubb, Upstream Systems, Netcompany-Intrasoft); Smartup PCC entry present with `isTechRelated: false` and 5 responsibilities byte-identical; named tests `U-4: exactly 3 isTechRelated:true entries` and `resume: exactly 3 isTechRelated:true entries and ResumeExperience keeps the filter`. |
| P1.6 | The downloads wording was approved by the user before the data write | ✓ VERIFIED | `data-refresh-draft.md:9` carries `**Approved:** 2026-09-22 …` with option **B** (spike-scoped launch-week number) chosen; registry numbers on record (line 142–143: current week 18, spike week 646 vs the docx's 400+); ancestry confirmed `96cd16f` (draft) → `ad03775` (approval) → `b59efee` (JSON write). |
| P2.1 | Exactly 4 panels [About+Contact / Experience] [Skills / Projects]; zero empty cells at 375/768/1440/1920; no `lg:grid-cols-3` | ✓ VERIFIED | `EXPLORE_SECTIONS` = 4 ids (about, experience, skills, projects), no contact; grid `grid-cols-1 md:grid-cols-2`; named tests `sweep rows EXPLORE@375/768/1440/1920 (P): panels grid 1→2→2 cols, merged 2×2 with zero empty cells (REV-04)` and `sweep rows EXPLORE@* (P): 2×2 zero-empty-cells structure`. |
| P2.2 | The merged panel carries the pinned order — description → meta row → divider → 9 channel rows → Full-resume link LAST; no standalone Contact panel | ✓ VERIFIED | `about-section.tsx` (142 lines) read directly: description (L72) → meta row (L75-88) → divider (L90) → `CHANNELS.map` 9 rows (L92-128) → `Full resume` `<Link>` last (L132-139). `contact-section.tsx` absent; export has one `id="about"`, zero `id="contact"`. |
| P2.3 | Tour runs 6 steps, every counter derives from `EXPLORE_TOUR_STEPS.length`, status bar N/4, drawer lists 4 anchors | ✓ VERIFIED | `explore-tour.tsx` `EXPLORE_TOUR_STEPS.length` ×7, `grep -c 'of 7'` → 0; named tests `step table: locked 6-entry sequence welcome → … → finish, no contact`, `step counter: fully derived — no hardcoded "of 7" anywhere in the tour`, `status bar: breadcrumb + live theme label + LIVE N/4 counter`, `drawer: 4 anchor items from EXPLORE_SECTIONS`. |
| P2.4 | Tour/counter/drawer/visited flows keep working through the untouched Experience panel (D-09) | ✓ VERIFIED | Byte-untouched diff empty (see R7) + `cross-cutting: REV-07 deferral`. |
| P2.5 | Welcome copy says "four sections"; stale stored `contact` visited-ids are harmlessly filtered | ✓ VERIFIED | `constants.ts` `four sections` ×1, `five sections` ×0; named tests `welcome copy: the lap covers FOUR sections after the merge` and `parseVisitedIds: null and empty raw → []`. |
| P3.1 | /resume renders the docx order in a single-column linear flow | ✓ VERIFIED | `ResumeView.tsx:117-132` ascending; named test `resume: ResumeView renders the docx section order, ascending` + `resume: single-column flow — sidebar grid and 33/67 split gone`. |
| P3.2 | Page chrome preserved (dark/printer toggle, Print/Save, `?print=true` auto-print timer) | ✓ VERIFIED | Named test `resume/page.tsx keeps the print chrome: ?print=true timer + toggle + print buttons` (green). |
| P3.3 | CERTIFICATIONS shows the featured 5 (ISTQB + 4 Anthropic) and SELECTED WRITING the 5 featured; the CLI modal's props contract is unchanged | ✓ VERIFIED | `featuredOnly` ×4 in `ResumeView.tsx`; named tests `resume: CERTIFICATIONS render exactly the featured five when curated`, `resume: SELECTED WRITING renders exactly the 5 featured articles, ignoring any slice limit`, `resume: ResumeViewProps contract intact (data, isDarkMode, 3 section toggles)`; `ResumeModal.tsx` untouched. |
| P3.4 | PROFESSIONAL EXPERIENCE renders exactly 3 roles via the untouched `isTechRelated` filter | ✓ VERIFIED | Named test `resume: exactly 3 isTechRelated:true entries and ResumeExperience keeps the filter`; PDF probe confirms Smartup PCC absent. |
| P3.5 | `npm run build:resume` produces the docx structure from refreshed data; hardcoded skills + LinkedIn/GitHub/Website literals gone; projects present | ✓ VERIFIED | Reproduced (R3): script exit 0, `about.contact` ×5 in the template, hardcoded LinkedIn → 0, `isTechRelated` → 2, projects markers present in the export. |
| P3.6 | `node scripts/verify-resume-content.js` passes on the new contract (standalone, exit 0) | ✓ VERIFIED | Reproduced: exit 0, all 39 PASS (and still exits 0 on the current tree). |
| P4.1 | Skills panel renders 8 competency cards, no bar chart/treemap; chips + terminal pointer remain | ✓ VERIFIED | See R5; chips/pointer pinned by `skills-section: card anatomy pinned — ul/li grid` + `TerminalPointer` ×3 in source. |
| P4.2 | The calendar renders above the existing cards — month-known → one-month bar, year-only (Clarif-AI/DeepIndex) → full-year span, `Ongoing` → no bar; cards unchanged | ✓ VERIFIED (with recorded ordering deviation) | All three geometry rules pinned by the 11/11 unit suite; `projects-section.tsx` calendar FIRST, tiles, then cards. **Deviation (documented, not a gap):** the plan text said "between the stat tiles and the cards"; the delivered order is calendar **above the tiles**, resolved by UI-SPEC §5.1 checker pin B-4, recorded in the plan-04 SUMMARY, and pinned by `projects-section.tsx: calendar composes FIRST, above the tiles wrapper and the cards`. The binding requirement wording ("above the existing cards") is met. |
| P4.3 | Calendar geometry lives in `viz-data.ts` as a pure typed builder with injectable `now`; no recharts, no client directive | ✓ VERIFIED | `buildProjectCalendar` present with `now: Date = new Date()`; `projects-calendar.tsx` has no `use client` and no recharts; named test `projects-calendar.tsx: pure server renderer — no use client, no hooks, no recharts`. |
| P4.4 | recharts removed (39→38); `tsc` + build + the full suite green on the final tree, chronologically last | ✓ VERIFIED | `package.json` deps = 38, `recharts` undefined; `ui/chart.tsx` deleted; three suites pin it (`cross-cutting: recharts removed — 38 dependency keys, no recharts key`, `sweep E-4 (E): recharts removed — package.json dependencies length stays 38`, routing guard); the full gate reproduced at **200/200**. |
| P4.5 | Tour skills copy no longer mentions the treemap; the experience panel stays byte-untouched | ✓ VERIFIED | `constants.ts` skills step body names the cards; byte-untouched diff empty (R7). |

## Score

**27/30 must-haves verified** (22 plan truths + 8 roadmap/requirement truths = 30). The 3 unverified truths are the three whose residual clause is perceptual, not structural: R2's print-width confirmation, R4's "no wide empty space", R6's calendar 375px appearance. `behavior_unverified: 3` counts exactly those. No truth FAILED; no artifact MISSING or STUB; no key link NOT_WIRED; no blocker anti-pattern.

## Deferred Items

| Deferred at phase 6 | Status now |
|---|---|
| REV-07 (experience showcase redesign) — deferred pending the user's screenshot description | **Resolved outside this phase**: scoped 2026-09-22 and delivered as phase 8 (`REV-12`/`REV-13`). Nothing further outstanding for phase 6. |
| recharts dependency-removal decision (plan-time discretion) | **Resolved in phase 6** plan 04 — removed, deps 38, gate-proven. |
| "Do the grouped skill chips stay below the cards?" (checker W-1 decision box) | **Resolved in phase 6** — the draft approval records "chips stay"; implemented. |
| Articles beyond the docx's selected 5 stay CLI-reachable | **Still true** (15 articles; 5 featured). |
| CLI output styling beyond data-driven text | Correctly not done (out of scope). |
| Plan 04 routed a `ui-review` of the skills cards (U-2) and calendar (OQ-1) | **Not performed**: no `UI-REVIEW.md` exists for phase 6. `ui-review` is an advisory soft gate and did not block; recorded here as a process observation only, not a gap. |

## Required Artifacts

All artifacts exist, are substantive (min_lines met), and are wired:

| Artifact | Lines (min) | Exists | Substantive / wired |
|---|---|---|---|
| `data-refresh-draft.md` | 276 (60) | ✓ | Full verbatim diff; approval header; consumer propagation table (§11, 14 disposition markers); registry numbers; U-4 flip; nothing-deleted ledger; decision boxes |
| `src/data/portfolio-main-data.json` | 369 (300) | ✓ | Valid JSON; docx contract confirmed by data probe + integrity suite |
| `src/data/portfolio-main-data.d.ts` | 102 (100) | ✓ | `core_competencies` (L82) + `featured?` ×4 |
| `tests/portfolio-data-integrity.test.mjs` | 477 (60) | ✓ | 18+ assertions incl. ledger rows |
| `about-section.tsx` | 141 (100) | ✓ | Merged anatomy, 9 channels, link last |
| `explore-panels.tsx` | 80 (55) | ✓ | 4 closures, `EXPLORE_SECTIONS.map` |
| `tests/explore-sweep.test.mjs` | 242 (180) | ✓ | Grid + 375 + calendar-less rows |
| `ResumeView.tsx` | 138 (100) | ✓ | Single-column docx order |
| `ResumeCoreCompetencies.tsx` | 45 (30) | ✓ | Renders `data.core_competencies` (L19) |
| `tests/resume-docx-order.test.mjs` | 283 (60) | ✓ | 14 rows |
| `scripts/generate-static-resume.js` | 437 (300) | ✓ | Data-driven contacts, `isTechRelated` selection |
| `scripts/verify-resume-content.js` | 142 (60) | ✓ | Standalone, exit 0 |
| `viz-data.ts` | 381 (300) | ✓ | `buildProjectCalendar`, techMentions removed |
| `projects-calendar.tsx` | 77 (50) | ✓ | Real renderer (year ticks, per-row tracks, chart-4 bars, `minWidth: 2`) — no stub |
| `skills-section.tsx` | 82 (60) | ✓ | Cards FIRST, chips + pointer below |
| `tests/projects-calendar.test.mjs` | 188 (60) | ✓ | 11 rows |
| `tests/explore-visuals-skills.test.mjs` | 180 (60) | ✓ | Cards anatomy + removal absence |

Deleted-as-designed: `contact-section.tsx`, `skills-chart.tsx`, `skills-treemap.tsx`, `ui/chart.tsx`, `ResumeSkills.tsx`.

## Key Link Verification

Every declared key link is WIRED (not merely pattern-present):

| From → To | Via | Status |
|---|---|---|
| JSON → `.d.ts` | `core_competencies: {name, proof}[]` typed in the same atomic set | WIRED |
| JSON → `WelcomeMessage.tsx` | `portfolioData.about.title` ×2 (banner + mobile) | WIRED |
| JSON → `SkillsOutput.tsx` | `core_competencies` block, chip + proof, graceful-hide | WIRED |
| JSON → `ResumeExperience.tsx` | untouched `.filter(job => job.isTechRelated)` reads exactly 3 true; PDF probe confirms only 3 roles | WIRED |
| `constants.ts` → `explore-panels.tsx` | `EXPLORE_SECTIONS.map` (L66) drives the panel map | WIRED |
| `contact-section.tsx` → `about-section.tsx` | `CHANNELS` table + `ROW_CLASS` + Full-resume link absorbed | WIRED |
| `constants.ts` → `explore-tour.tsx` | counters derive from `EXPLORE_TOUR_STEPS.length` (×7, no literal) | WIRED |
| JSON → `ResumeView.tsx`/`ResumeCoreCompetencies.tsx` | section consumes `data.core_competencies` (L19) | WIRED |
| `ResumeView` → `ResumeModal.tsx` | `ResumeViewProps` unchanged (test-pinned); modal byte-untouched | WIRED |
| JSON → `generate-static-resume.js` | `about.contact` ×5; hardcoded LinkedIn literal → 0 | WIRED |
| JSON → `viz-data.ts` | `buildProjectCalendar(projects, now)` parses `project.date`; no component parses dates inline | WIRED |
| `viz-data.ts` → `projects-calendar.tsx` | renderer consumes precomputed `leftPct`/`widthPct`/`yearColumns` | WIRED |
| JSON → `skills-section.tsx` | panels closure `competencies={data.core_competencies}` | WIRED |
| `package.json` → `tests/explore-visuals.test.mjs` | dependency pin 38 + recharts absent, proven green after removal | WIRED |

## Data-Flow Trace

Level reached: **data-flowing** end-to-end for the data and resume surfaces; **wired + server-rendered** for the explore visuals.

1. **docx → data**: `resume-docx-extraction.md` → `data-refresh-draft.md` (verbatim diff, user-approved 2026-09-22) → `portfolio-main-data.json` (`b59efee`, after the approval commit `ad03775`; ancestry checked). Registry-verified downloads figures replaced the docx's stale "400+"; the user chose option B.
2. **data → types → consumers**: `.d.ts` types → CLI outputs, resume components, PDF script, explore sections (all links above).
3. **data → rendered output**: `out/explore.html` server-renders the 8 competency cluster names + proofs (e.g. "Test Automation Architecture &amp; Framework Design" with proof "Internal NPM framework used by 12+ engineering teams across 20+ projects…"), the calendar at "14 projects across 11 years", the `0/4 sections visited` counter, and **zero** `recharts-responsive-container`. `out/index.html` carries the new title and zero old-title literals.
4. **data → PDF**: reproduced `build:resume` + independent marker-order probe (R3).
5. **current tree**: the data contract still holds (title, 8 competencies, exactly 3 `isTechRelated`, 5 featured certs, 5 featured articles) and `verify-resume-content.js` still exits 0.

## Behavioral Spot-Checks

Per the phase's own convention (zero-dependency `node --test`, source-invariant + export-level), the phase's named behavioural tests were executed as one explicit enumeration rather than the full directory glob (the directory form is documented as `MODULE_NOT_FOUND` on this runner):

- `npm run typecheck` → 0
- `npm run build` → 0 (static export, 6 pages)
- `npm run build:resume` → 0
- `node scripts/verify-resume-content.js` → 0 (39/39 PASS)
- `node --test tests/{explore-visuals-server,explore-visuals-skills,explore-visuals,explore-shell,explore-tour,explore-routing,explore-header,explore-sweep,portfolio-data-integrity,resume-docx-order,projects-calendar}.test.mjs` → **200 pass / 0 fail / 0 skipped**

Representative named rows behind the truths: `about.title equals docx line 2 verbatim`; `core_competencies: 8 clusters, docx names in order, every name+proof non-empty`; `ledger: interests / favorite_games / presentations / skills byte-identical`; `U-4: exactly 3 isTechRelated:true entries`; `sweep rows EXPLORE@* (P): 2×2 zero-empty-cells structure`; `step counter: fully derived — no hardcoded "of 7"`; `resume: ResumeView renders the docx section order, ascending`; `buildProjectCalendar: 11 year columns 2016..2026`; `cross-cutting: recharts removed — 38 dependency keys, no recharts key`; `cross-cutting: REV-07 deferral — the experience showcase stays byte-untouched`.

**Migration/script probe (step 7c):** the data migration was probed by structural diff pre/post JSON (10/10 checks), and the tooling script was executed twice (build + verify), not merely read.

## Requirements Coverage

| REQ-ID | Delivered? | Evidence |
|---|---|---|
| REV-01 | ✓ | Data probe + ledger diff + branding greps + export probes |
| REV-02 | ✓ (print-width human) | Order/chrome/curation tests; H1 outstanding |
| REV-03 | ✓ | Reproduced build + independent marker-order probe |
| REV-04 | ✓ (aesthetic human) | Merge + grid tests; H2 outstanding |
| REV-05 | ✓ | File absence + card tests + deps 38 |
| REV-06 | ✓ (375px human) | Unit suite 11/11 + export probe; H3 outstanding |
| REV-07 | ✓ deferred | Byte-untouched diff empty; later scoped to phase 8 |

## Anti-Patterns Found

- **0** unreferenced `TBD`/`FIXME`/`XXX` across the 44 non-planning files changed in phase 6.
- **0** `.skip`/`.todo`/`it.skip`/`test.skip` in the new/renewed suites.
- One benign grep trip: `career-span-chart.tsx:4` contains the word "recharts" only inside a doc-comment asserting the chart is *not* a recharts chart. That file is D-09 byte-untouched, so usage-scoped greps (not raw grep) are the faithful check — recorded in the plan-04 SUMMARY (§Deviations 4). Not a debt marker.
- Process observation (not a blocker): phase 6 never ran `code-review` or `ui-review`, produced no `UI-REVIEW.md`, and was never verified at the time; the 2×2 grid's supersession by phase 8 also means its human visual pass never happened against a live tree.

## Human Verification Required

1. **/resume print-width fidelity (REV-02)** — print the live resume at A4 and confirm a single-column, unclipped, unbroken docx-ordered document. Still actionable today; no browser is available in this environment to automate it.
2. **Phase-6 /explore 2×2 grid — no wide empty space at 768/1440** — only re-inspectable against the archived phase-6 tree (`14491e1`), since phases 8/9/11/12 reflowed or removed the surface. Structurally pinned (`2×2 zero-empty-cells structure`), aesthetically unconfirmed.
3. **Phase-6 year-grid calendar at 375px** — historical only; the artefact was deliberately deleted by REV-08 (phase 7).

## Gaps Summary

**No gaps found.** Every programmatically checkable must-have is verified, and the phase's own gate was independently reproduced (200/200) on a pristine extraction of its execute head. All three phase-6 SUMMARY files' central claims survived scrutiny — including the ones most likely to hide stubs (nothing-deleted ledger, key-link wiring, PDF structure, dependency removal).

Two things must not be misread as gaps:

1. **The current tree does not contain the phase-6 calendar, the 2×2 grid, or `/explore`.** These were deliberately superseded by later, explicitly-requested requirements (REV-08 removed both Gantt-style charts including the phase-6 calendar; REV-14/REV-21 reflowed the grid to 5 sections; REV-22 deleted `/explore` in favour of `/`). Phase 6 delivered them; later phases legitimately replaced them.
2. **The one plan-text/code divergence** — the calendar sits above the stat tiles rather than between tiles and cards — was resolved at plan time by UI-SPEC §5.1/B-4, recorded in the plan-04 SUMMARY, and pinned by a passing test. The binding requirement wording ("above the existing cards") is satisfied.

Residual risk is limited to the three perceptual clauses (human items H1–H3); no correctness, security, data-integrity, or wiring risk was found.

---

*Verification object: phase-6 execute head `14491e1` (pristine extraction, no repo mutation) + current-tree persistence probes. VERIFICATION.md deliberately not committed — the orchestrator bundles it.*

## Human Verification Record (2026-09-25, user-confirmed in the batch + go-live round)

Phase 6's surfaces (the docx data refresh on all four surfaces, the /resume + PDF docx rebuilds, the merged About+Contact panel, the competency cards, the calendar) were reviewed live by the user across phases 7-12; the user's revisions (kill the Gantts, swipe stack, credentials panel) shaped them further. User verdict in the go-live round: **"this is great now we are ready to merge it into the main branch and go live"** — the confirmation for this phase's items.

status_human: approved
