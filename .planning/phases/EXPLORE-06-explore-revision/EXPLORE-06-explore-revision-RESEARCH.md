Research complete. Here is the full RESEARCH.md for the orchestrator to write to disk:

---

```markdown
# RESEARCH — Phase 6: explore-revision (EXPLORE-06)

**Gathered:** 2026-09-23 · Researcher: gsd-phase-researcher (fresh context)
**Phase goal:** Refresh portfolio data to the docx as source of truth and revise the visual surfaces — /resume + PDF rebuilt to docx structure, About+Contact merged, skills as competency + proof cards, projects year-grid calendar. (REV-01; REV-07 deferred.)
**Method note:** Every claim below is provenance-tagged. In-repo discrete values were read this session and carry path + line range. External entities (npm registry, Medium) were fetched live.

---

## 1. Domain analysis

### 1.1 Stack (all [VERIFIED: read this session])

| Layer | Fact | Source |
|---|---|---|
| Framework | Next.js ^15.5.10, React ^18.3.1, static export (`output: 'export'` emits `out/`; CI uploads `./out`) | `package.json:45,47`; `.github/workflows/deploy.yml:60-64` [VERIFIED] |
| Styling | Tailwind ^3.4.1, shadcn/ui primitives, chart tokens `--chart-1…5` scoped to `.explore-shell` | `package.json:62`; `src/app/globals.css` (light shell overrides at `tests/explore-visuals-skills.test.mjs:143-154`) [VERIFIED] |
| Charts | recharts ^2.15.1 — used ONLY by `skills-chart.tsx`, `skills-treemap.tsx`, and the consumer-less shadcn wrapper `src/components/ui/chart.tsx` | `package.json:51`; grep session-wide (see §2) [VERIFIED] |
| Tests | Node built-in runner, zero npm deps; per-file convention `node --test tests/<file>.mjs`; 8 test files, 2668 lines total; export-level tests read `out/*.html` and fail with a build hint until `npm run build` runs | `tests/*.mjs` headers (e.g. `tests/explore-visuals-skills.test.mjs:4`, `tests/explore-visuals.test.mjs:649-651`) [VERIFIED] |
| Scripts | `npm run build:resume` = `node scripts/generate-static-resume.js` → writes `public/resume-export.html` | `package.json:12`; `scripts/generate-static-resume.js:4-5,467` [VERIFIED] |
| CI | `deploy.yml` runs `npm install` + `npm run build` only (no typecheck, no tests); triggers on push to `master` → GitHub Pages deploy | `.github/workflows/deploy.yml:8-10,59-64` [VERIFIED] |

### 1.2 Established repo patterns the planner must reuse (confidence: high)

- **Pure data-shaping module** — `src/components/explore/viz-data.ts` is "the ONLY duration/date parsing and mention-matching site under src/components/explore/ — components never parse strings inline" (`viz-data.ts:5-8`). The new year-grid calendar geometry MUST live here as a new pure exported builder (the `buildCareerSpan` precedent, `viz-data.ts:307-358`), typed, zero runtime imports, erasable-syntax-only so `node --test` can import it directly (`viz-data.ts:9-13`). [VERIFIED]
- **Existing date parsing to build on** — `parseMonthToken` (first-3-letter prefix, `viz-data.ts:54-59`), `parseMonthYear` (`viz-data.ts:63-75`), `YEAR_PATTERN = /\b(?:19|20)\d{2}\b/` (`viz-data.ts:61`), `monthIndex(year, month) = year*12 + (month-1)` (`viz-data.ts:288-290`). A project-ship-date parser is a *single-side* variant of `parseMonthYear` — the machinery half-exists. [VERIFIED]
- **Geometry-never-invented convention** — unparseable dates yield `null` geometry, no bar, no throw (E-1/E-2, `viz-data.ts:296-303`; `projectStats` skips year-less dates like `'Ongoing'`, `viz-data.ts:167-175`). The calendar must follow this. [VERIFIED]
- **Graceful-hide** — empty/missing content renders nothing, no fallback copy (pinned across all explore sections). [VERIFIED: component doc-comments]
- **JSON order is render order — no sorting** (R-4/E-6, `viz-data.ts:16-17`, grepped "no .sort(" in `tests/explore-visuals-server.test.mjs:92`). [VERIFIED]
- **Data-driven, zero hardcoded content** (EXPLORE-07) — every rendered number traces to the JSON through viz-data. [VERIFIED]
- **Stale-test discipline** — when machinery is deliberately removed, its tests are removed/rewritten atomically with it (CONTEXT D-06; the `tests/` suite is the enforcement surface). [VERIFIED: CONTEXT.md]
- **Draft → approve → write for personal copy** (CONTEXT D-01): the complete data diff is transcribed from the docx extraction, presented for user approval, only then written. `scripts/verify-resume-content.js` is the *previous* revamp's acceptance script and encodes the OLD data contract (see §3 risk R-4). [VERIFIED: CONTEXT.md + script read]
- **CSS-Gantt-over-recharts precedent** — `career-span-chart.tsx` is a "dumb server renderer" of viz-data percentages, no client directive, no hooks, no chart library, fully present in the static export without JS (`career-span-chart.tsx:1-24`). The year-grid calendar (D-07 "pure CSS following the existing Gantt pattern") extends this exact pattern. [VERIFIED]

### 1.3 Pitfalls specific to this phase (confidence: high — each traced to code)

1. **Hardcoded CLI banner titles** — the data change alone does NOT propagate to the CLI: `WelcomeMessage.tsx:32` (desktop ASCII banner) and `:41` (mobile) both hardcode `Senior Software Engineer in Test`. `AboutOutput.tsx:26` renders `about.title` but inside a fixed-width box (see R-1). The explore surfaces auto-propagate (`explore/page.tsx:41-47`, `explore-header.tsx:57-58`, `explore-intro.tsx:32`, `explore/layout.tsx` metadata, root `layout.tsx:31,79`). [VERIFIED]
2. **ASCII box overflow** — `AboutOutput.tsx:24-27` draws a fixed 59-char `╔═…═╗` box and pads the title with `.padEnd(57)`. The new title `"Test Automation Architect | Principal Test Automation Engineer"` is 62 chars — the content line will outgrow the border. Banner width must become data-derived. [VERIFIED]
3. **Stale "Current" in the SPEC** — SPEC REV-03 says the PDF template "renders NO projects"; the template DOES render two projects (`generate-static-resume.js:442-457`, `projects.slice(0, 2)`). Plan against the real file. The hardcoded-skills claim IS accurate (`:376-385`). [VERIFIED — falsified the SPEC claim against the file]
4. **`verify-resume-content.js` is stale-by-construction** — it asserts the pre-docx data contract (Chubb 7 responsibilities, summary containing "Clarif-AI (clarif-ai.net)" + "DeepIndex CLI", export containing `PROJECTS.BIN`, education-in-sidebar, merged 2-group skills). It is standalone (not in `package.json` scripts, not in CI) and will fail after the refresh. Must be rewritten to the new contract or retired. [VERIFIED: `scripts/verify-resume-content.js:24-39,49-81`; reference check via grep]
5. **Section-count coupling on /explore** — `EXPLORE_SECTIONS` (`constants.ts:10-16`) drives panels, drawer anchors, visited tracking, tour steps, and the status-bar counter. Merging to 4 sections changes: tour 7→6 steps, status counter N/5→N/4 (auto via `EXPLORE_SECTIONS.length`, `explore-status-bar.tsx:49`), drawer items (auto), `EXPLORE_TOUR_ACCENTS` (`constants.ts:62-68`), panels `ACCENTS` + `SECTION_BODIES` (`explore-panels.tsx:37-63`). One hardcoded literal bypasses derivation: `explore-tour.tsx:409` `` `Step ${stepIndex + 1} of 7 — …` `` (line 464 already uses the dynamic form). Stale stored `contact` visited-ids are harmless — `parseVisitedIds` filters to valid ids (`constants.ts:51-53`). [VERIFIED]
6. **Tour copy goes stale** — `constants.ts:100` ("…then the treemap of what the actual work proves…"), `:101` ("Stat tiles up top, six projects underneath."), `:117` ("A 60-second lap of the five sections…"). All chrome copy in the locked step table. [VERIFIED]
7. **Export-level tests need a build first** — `tests/explore-visuals.test.mjs:664+` and the sweep's Type-E rows read `out/explore.html`; run `npm run build` before the full suite on a changed tree. [VERIFIED]
8. **Type file coupling** — components import `PortfolioData` from `src/data/portfolio-main-data.d.ts` and cast the JSON import (`as PortfolioData`). New JSON fields (`core_competencies`, cert/article `featured`) fail typecheck everywhere unless the `.d.ts` gains them. [VERIFIED: `portfolio-main-data.d.ts:27-39,50-98`]
9. **PDF template hardcodes contact URLs** — LinkedIn/GitHub/Website links are string literals, not `about.contact` (`generate-static-resume.js:357-365`; note the hardcoded LinkedIn form `https://linkedin.com/in/tasostilsi` differs from the data's `http://www.linkedin.com/in/tasostilsi`, JSON line 19). The rebuild should go data-driven here. [VERIFIED]
10. **TaasOutput sentence** — renders `I work full-time as a {portfolioData.about.title}` (`TaasOutput.tsx:18`); with the pipe-bearing new title it reads "as a Test Automation Architect | Principal Test Automation Engineer and…". Data-driven, no code change required; flag as a rendering note for the draft. [VERIFIED]

### 1.4 Data-refresh content mapping (from the locked extraction + decisions)

Canonical source: `resume-docx-extraction.md` (read this session, 39 lines). [VERIFIED]

- **Branding** — docx line 2: `Test Automation Architect | Principal Test Automation Engineer` → `about.title` (JSON line 12 currently `Senior Software Engineer in Test`). Also present verbatim in `meta.description`/`meta.keywords` (JSON lines 6-7) and hardcoded in `WelcomeMessage.tsx:32,41` — see OQ-4/R-1.
- **Summary** — docx line 5 → `about.description` (replaces the "Aspiring Test Solutions Architect…" text, JSON line 16).
- **Core competencies** — docx line 7 is ONE line with NINE `•`-separated segments ("Test Automation Architecture & Framework Design", "Playwright, Selenium, Rest Assured, WebdriverIO", "Java, JavaScript, TypeScript", "CI/CD (Jenkins, Docker, Bitbucket)", "AI-Driven QA (MCP, RAG, Prompt Engineering, Agentic AI)", "NPM Module & Platform Architecture", "Quality Dashboards & Reporting", "Cross-Team Technical Leadership & Mentorship", "Performance & Load Testing (ReadyAPI, LoadUI, Postman)"). D-02 pins EIGHT clusters `{name, proof}`. The per-cluster quantified proofs are NOT in the docx — they are composed from the refreshed data's quantified lines (e.g. Chubb bullets). The 9→8 decomposition and every proof line are draft-approve content (D-01). [VERIFIED: extraction line 7; CONTEXT D-02]
- **Experience bullets** — docx gives Chubb 6 bullets (lines 10-15), Upstream 3 (17-19), Netcompany 4 (21-24). JSON Chubb currently 7, Upstream 3 (reworded), Netcompany 3 (different order). The 4 non-docx roles (Smartup PCC, Barista, Storekeeper, Washer) are untouched (nothing deleted). Titles/companies/durations/`isTechRelated` unchanged → the `buildCareerSpan` test that pins `['Chubb','Senior Software Engineer in Test','Sept 2023 — Present',true]` rows survives (`tests/explore-visuals.test.mjs:359-378` asserts only company/title/duration/isTechRelated). [VERIFIED both sides]
- **Projects enrichment** — docx lines 26-27: deepindex ("…hybrid semantic and entity-graph code search; 400+ weekly downloads. npmjs.com/package/deepindex") and Clarif-AI (alpha) ("…scans contracts to surface red flags and hidden terms in under two minutes. Personal product, currently in alpha. clarif-ai.net"). JSON lines 173-174 already carry both as `projects[0]`/`projects[1]` with links `https://clarif-ai.net` and `https://www.npmjs.com/package/deepindex`. **Registry-disputed claim:** see OQ-6 — the "400+ weekly downloads" figure does not match the registry's current week. [VERIFIED]
- **Certifications** — JSON has exactly 41 entries (lines 189-229). Docx certifies: ISTQB® CTFL (already in JSON at line 196, `link: "ID: GRTB-24-1S20-CTFL"`) + 4 Anthropic Academy items ("Claude 101", "Claude Code in Action", "Introduction to Claude Cowork", "Introduction to Agent Skills" — extraction line 33) which match NO existing JSON entry by name. Reading of D-02 "certifications gain featured:true on ISTQB + the Anthropic Academy items (all 41 remain)": the 4 Anthropic items are NEW entries added with `featured: true` (→ 45 total, all 41 intact + 4 new), not re-tags of existing June-2025 LinkedIn-style certs. Exact entries/links/dates go through the draft gate. CLI `CertsOutput` date parsing accepts `"MMMM yyyy"`, `"MMM yyyy"`, `"yyyy"` (`CertsOutput.tsx:16-27`) — new entries must fit one of those formats to sort correctly; `link: null` is an established pattern (JSON lines 206, 218-229). [VERIFIED]
- **Selected writing** — 12 JSON articles (`:241-326`). Docx 5 (lines 35-39): two exist ONLY on Medium, not in JSON — both verified live (§OQ-7); three match existing JSON entries ("Core Design Patterns…", "Flaky Tests…", geo-specific — note the JSON geo entry (`:250-255`, name "Testing Geo-Specific Features", date "Jan 2026") actually corresponds to real Part 2; the docx selects Part 1, real date Dec 23 2025). Reconciliation = featured flags + 2 new entries, never replacement (D-02). [VERIFIED]
- **Education** — D-02 locked "verified already-matching (no change)". FYI: docx line 29 says "MSc, Computer Science (Applied Informatics)" while JSON `degree` is "Master of Science in Computer Science" + `specialization` "Software Quality Assurance Engineering" — the JSON's own fields stand (data fidelity; surfaces render the JSON). [VERIFIED: extraction line 29 vs JSON lines 112-116]
- **Untouched-by-design** — `interests`, `favorite_games`, `presentations`, `skills` (soft/hard/languages), education, the 4 non-docx experience roles, all 12→14 articles, all 41 certs: nothing deleted; CLI keeps full lists. [VERIFIED: CONTEXT D-02 + deferrals]

### 1.4.1 Verified external entities (D-03 requires verification before drafting)

- **npm weekly downloads (deepindex)** — registry API `https://api.npmjs.org/downloads/point/last-week/deepindex` returned `{"downloads":18,"start":"2026-09-15","end":"2026-09-21","package":"deepindex"}`. The month range (`/downloads/range/last-month/deepindex`) shows the spike that produced the docx claim: Sep 9-14 = 241+176+35+157+27+10 = **646 downloads in that week**, collapsing to 18 in the current week (Sep 15-21). [VERIFIED: registry API responses, fetched this session] → The docx's "400+ weekly downloads" is spike-era, not current. The draft must present this discrepancy to the user (OQ-6). Package existence corroborated: `https://www.npmjs.com/package/deepindex` is the JSON's own link (`portfolio-main-data.json:174`) and deepindex@0.3.2 is published [VERIFIED: prior session record; registry range endpoint responded for the package].
- **Medium articles** — profile `https://medium.com/@tasostilsi` (fetched this session) confirms both docx-only articles verbatim: "Your AI Agent Keeps Re-Discovering Your Codebase. I Built the Tool That Stops It." (In Generative AI · Sep 14 [2026]) and "Your Playwright Tests Take 45 Minutes? Cut That to 12." (In StartupInsider · May 26 [2026]). Also visible: "The Contract That Cost My Friend €10,000 (And Why I Built Something to Stop It From Happening to…)" (Mar 2) — the real title behind JSON's paraphrased "The €10,000 Contract Mistake"; geo guide Part 1 (Dec 23, 2025) and Part 2 (Jan 25, 2026). [VERIFIED: Medium profile page] → per-article slug extraction happens at draft time (most JSON links are profile-level, `:245,252,259`).
- **Anthropic Academy course names** — no public registry page verified this session (web search returned only generic Anthropic pages). The docx (user's own record) is the source of truth per D-01/D-02; entries carry `link: null` unless the user supplies URLs in the draft. [ASSUMED→user-owned; flagged in the draft checklist]

---

## 2. Package legitimacy

**No new dependencies are proposed.** The only dependency question is *removal*:

- `recharts ^2.15.1` (`package.json:51`). Post-removal usage inventory (grep, this session): consumers = `src/components/explore/sections/skills-chart.tsx:27` and `skills-treemap.tsx:34` (both deleted this phase) + `src/components/ui/chart.tsx:4` — a shadcn chart wrapper whose import `grep -rn "ui/chart" src/` shows **zero consumers**. Therefore recharts becomes removable **iff** `chart.tsx` is deleted with it; otherwise `tsc --noEmit`/`next build` fail on the dangling import. [VERIFIED: grep inventory]
- Existing pinned version claim in tests: `tests/explore-visuals.test.mjs:622-626` asserts `Object.keys(pkg.dependencies).length === 39` and `recharts === '^2.15.1'` — this test must be updated if the dependency is removed (dependency count 39→38, assertion inverted to absent). [VERIFIED]
- No registry lookups needed for additions — there are none. This section's conclusion: removal is a plan-time decision (CONTEXT discretion) with the gate as proof; see OQ-2 for the recommendation.

---

## 3. Risks

| # | Risk | Evidence | Correct behaviour |
|---|---|---|---|
| R-1 | CLI welcome/About banners break or go stale with the new title | `WelcomeMessage.tsx:32,41` hardcoded; `AboutOutput.tsx:24-27` fixed-width box + `padEnd(57)` vs 62-char title | Welcome banner switches to data-driven `about.title` (two sites); About box width derives from the rendered strings |
| R-2 | Docx claim "400+ weekly downloads" contradicts the live registry (18/week) | §1.4.1 registry fetch | Draft-approve step presents the discrepancy; user decides the wording before write (D-01/D-03) |
| R-3 | Section-count change ripples through 6+ consumers | §1.3 pitfall 5 inventory | Every consumer updated in the merge task; tests updated with them (stale-test discipline) |
| R-4 | `scripts/verify-resume-content.js` asserts the old contract and will fail red | §1.3 pitfall 4 | Rewrite to the docx-structure contract (or retire) in the same phase; never leave a red standalone script |
| R-5 | Removing chart components strands `ui/chart.tsx` + the dependency-count test | §2 | Remove-or-keep decided once, gate-verified (`tsc`, `build`, updated tests) |
| R-6 | Export-level tests read `out/` — stale artifacts silently pass/fail | `tests/explore-visuals.test.mjs:649-651` | Full suite runs after `npm run build` on the final tree (chronological green-gate) |
| R-7 | New cert/article/project fields missing from `.d.ts` → typecheck failures across 15+ consumers | §1.3 pitfall 8 | `.d.ts` updated in the same commit as the JSON (types first or together) |
| R-8 | Year-only project dates contradict D-07's "single months" premise | OQ-1 | Render exactly the precision the data carries (full-year bars); never invent months |
| R-9 | Two-column /resume print layout breaks the docx section ORDER in print | `ResumeView.tsx:124-149` (sidebar interleaves Skills/Articles/Certs before main Summary) | Single-column docx-order flow (OQ-5) |
| R-10 | Hydration/SSG contracts: explore panels are server components; the calendar must be static-export-safe (no client directive, no hooks) | `career-span-chart.tsx` precedent; `viz-data.ts:9-13` | Calendar = pure CSS server renderer fed by viz-data precomputed geometry |
| R-11 | `ResumeView` props contract (`showCertifications/showProjects/showArticles`, `isDarkMode`) is consumed by `ResumeModal.tsx:117-123` | [VERIFIED] | Rebuilt sections keep the modal contract working (or the modal is updated in the same task) |

---

## 4. Open Questions

**OQ-1 — Year-grid calendar: what do year-only and missing dates render? (RESOLVED)**
Data: Clarif-AI `"date": "2026"` (`portfolio-main-data.json:173`), DeepIndex `"date": "2026"` (`:174`), Portfolio Website `"date": "Ongoing"` (`:186`); the other 11 projects carry `"Month YYYY"`. D-07's "ship dates are single months — bars span one month cell" holds for 11 of 14 projects only.
**Resolution:** render the precision the data carries — month-known projects get a one-month-cell bar; year-only projects (Clarif-AI, DeepIndex) get a full-year-span bar inside their year column (no month invented); "Ongoing" gets no bar (matches `projectStats` E-8 skipping year-less dates, `viz-data.ts:171-175`, and career-span E-1 "geometry is never invented"). This keeps both flagships visible — the alternative (no bar for the two flagships) visibly falsifies the panel. The exact rendering still passes through the D-01 draft/approve visibility since it's a visual rule, but it is no longer a planning blocker.

**OQ-2 — Remove recharts from package.json? (RESOLVED — recommendation for the planner's discretion point)**
**Resolution (recommended):** yes, conditionally and atomically — delete `skills-chart.tsx` + `skills-treemap.tsx` (required by D-06), delete the now-consumerless `src/components/ui/chart.tsx`, remove `recharts` from `package.json` (deps 39→38), and update `tests/explore-visuals.test.mjs:622-626` (dependency-count + recharts assertion). Gate = `tsc --noEmit` + `npm run build` + updated full suite. Ponytail-consistent: zero usages remain, proven by the gate. Fallback (also acceptable): keep `chart.tsx` + recharts untouched — zero risk, dead code. The CONTEXT discretion explicitly reserves this call for plan time with the gate as proof.

**OQ-3 — Does `core_competencies` render in the CLI? (RESOLVED — recommendation)**
Acceptance REV-01: "…all present in portfolio-main-data.json and rendering consistently on CLI, /explore, /resume, and the PDF export". Current `SkillsOutput` renders only soft/hard/languages (`SkillsOutput.tsx:10-39`).
**Resolution (recommended):** add a data-driven competencies block to the CLI `skills` output using the existing list-chip pattern (name + proof line) — pure data-driven text, no styling change, within the "CLI output styling changes beyond data-driven text" exclusion. The existing soft/hard/languages lists stay byte-unchanged (nothing deleted). Alternative: competencies only on the three visual surfaces — but that reads against "rendering consistently on CLI".

**OQ-4 — Do `meta.description` / `meta.keywords` refresh with the branding? (RESOLVED — recommendation)**
`meta.description` (JSON `:6`) and `meta.keywords` (`:7`) still carry "Senior Software Engineer in Test"; they feed root metadata/OG/Twitter (`layout.tsx:32,37,54`). D-02's mapping is silent on `meta.*`.
**Resolution (recommended):** include a `meta.description` refresh in the draft diff (branding consistency on SEO surfaces, cheap, data-only); offer the `meta.keywords` update in the same draft. User approves via the standard D-01 gate — no separate decision process.

**OQ-5 — /resume layout: keep the two-column sidebar split or linearize to docx order? (RESOLVED — recommendation)**
Current `ResumeView` renders sidebar (Skills, Articles, Certs) + main (Summary, Experience, Education, Projects-when-articles-off) — section order is NOT the docx order and breaks in print. D-08 keeps the page chrome (dark/printer toggle, print/save, `?print=true`).
**Resolution (recommended):** single-column linear flow in exact docx order (SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE → PROJECTS → EDUCATION → CERTIFICATIONS → SELECTED WRITING), print-optimized; keep the toggle/print chrome and the `ResumeView` props contract. The docx is a linear document; order fidelity is the acceptance criterion ("renders the docx section order"). Two-column retention would interleave and contradict REV-02's acceptance.

**OQ-6 — "400+ weekly downloads" claim. (RESOLVED — process)**
Registry-verified: current week 18; spike week (Sep 9-14, 2026) 646 (`api.npmjs.org`, §1.4.1). **Resolution:** the draft (D-01) presents the verified numbers and proposes wording — e.g. keep the docx claim, soften to "published npm package" (docx SUMMARY already says only "400+ weekly downloads" in one place; the project line repeats it), or another user-chosen phrasing. The user approves the exact string. Planning proceeds with the draft gate as the decision point; no blocker.

**OQ-7 — Article reconciliation details. (RESOLVED — process)**
Verified live (§1.4.1): both docx-only articles exist; the JSON geo entry maps to real Part 2 (Jan 2026) while the docx selects Part 1 (Dec 23, 2025); most JSON article links are profile-level, not per-article slugs. **Resolution:** the draft step (a) flags the 3 matching JSON entries `featured: true`, (b) adds the 2 new entries with real titles/dates and per-article links fetched at execute time, (c) reconciles the geo entry per docx (Part 1, real title/date) with user approval, (d) leaves all other articles untouched. Not a planning blocker — it is the D-01 process operating as designed.

**OQ-8 — Featured-flag field naming for articles. (RESOLVED — recommendation)**
D-02 pins `featured: true` for certifications; articles are "flagged/marked". **Resolution:** one mechanism — optional `featured?: boolean` on both `Certification` and `Article` in `portfolio-main-data.d.ts:27-39`; zero current usages of "featured" in src/tests (grep-verified), so no collision.

**OQ-9 — Tour/counter/copy staleness with 4 sections. (RESOLVED)**
Sites enumerated (all read this session): `constants.ts:10-16` (5→4 sections), `:77` (TourStep id union — drop `"contact"`), `:97-103` (step bodies: treemap line + "six projects" line + welcome "five sections"), `:111-133` (steps 7→6, derived from `EXPLORE_SECTIONS.map` — auto), `explore-tour.tsx:409` (hardcoded `"of 7"` → derive from `EXPLORE_TOUR_STEPS.length`, matching `:464`), `explore-panels.tsx:37-43` (ACCENTS `Record<ExploreSectionId,…>` — TS forces contact removal), `:54-63` (SECTION_BODIES — contact closure removed; skills closure may lose the `experience` prop per OQ-10), `explore-status-bar.tsx:49` (auto N/4), `explore-drawer.tsx:33-39` (5 accents, 4 used — fine), `use-explore-visited.ts` (auto via EXPLORE_SECTIONS; stale stored ids filtered). `EXPLORE_TOUR_STEPS.length` assertions in `tests/explore-tour.test.mjs:69,72` updated to 6/id-list without contact.

**OQ-10 — Do the skill chips below the cards survive? (RESOLVED — recommendation)**
D-06 names ONLY the BarChart + Treemap for removal ("recharts BarChart + Treemap components and their tests removed; viz-data mention machinery reduced accordingly"). The grouped badge chips + TerminalPointer are a separate body part (`skills-section.tsx:56-70`).
**Resolution (recommended):** cards replace the chart+treemap; the grouped chips and the terminal pointer REMAIN (chips are the only /explore rendering of the full hard-skills lists; `skillsGroupCounts` stays alive for them; only `techMentions` dies). Consequently the skills section's `experience` prop (used solely for the treemap corpus) becomes unused and the panels adapter reverts to `skills={data.skills}` — updating the closure-threading tests (`tests/explore-visuals-skills.test.mjs:123-134`, `tests/explore-visuals.test.mjs:605-616`). If the planner prefers cards-only (chips deleted), that contradicts nothing explicitly — but chips are not part of what the user judged "not valuable", so keep them.

**OQ-11 — Calendar position vs stat tiles. (RESOLVED)**
Acceptance REV-06: calendar "above the cards"; D-07: "stat tiles + cards unchanged below". **Resolution:** order = stat tiles (unchanged, `mb-3` wrapper) → year-grid calendar (new) → cards (unchanged); the calendar composes as the middle child in `projects-section.tsx`'s `space-y-2` body.

**OQ-12 — Calendar geometry shape. (RESOLVED — recommendation)**
"Year columns 2016→present" = 11 columns (min data year 2016 — `:184-185` "November 2016"/"October 2016"; max = current year via the injectable-`now` pattern of `buildCareerSpan`, `viz-data.ts:307-310`). **Resolution (recommended):** GitHub-style grid — one row per project (14 rows), 11 year columns each subdivided into 12 month cells; each project's bar sits at its ship month's cell (or spans its full year row for year-only dates). This follows the Gantt precedent (row-per-entry, shared axis, `min-width: 2px` degenerate guard) while being "columns = years" like a calendar, as the user distinguished from the experience Gantt. Geometry builder `buildProjectCalendar(projects, now?)` lives in `viz-data.ts`; renderer is a pure server component. Color mapping per year or per project type = Claude's Discretion (chart tokens `hsl(var(--chart-N))` pattern exists, `viz-data.ts:119-124`).

No open question remains blocking. Every resolution above is either evidence-derived or a marked recommendation the planner may adopt.

---

## 5. Architectural Responsibility Map

| Capability | Tier | Home (existing file to touch) | Notes |
|---|---|---|---|
| Data refresh (title, summary, competencies, bullets, project enrichment, featured flags, selected writing) | **data** | `src/data/portfolio-main-data.json` + `portfolio-main-data.d.ts` (types: `core_competencies: { name: string; proof: string }[]`; `featured?: boolean` on Certification + Article) | Draft-approve-write per D-01; nothing deleted |
| Calendar/ship-date parsing + geometry | **domain** | `src/components/explore/viz-data.ts` (new `buildProjectCalendar`, single-side date parser) | Pure, typed, zero runtime imports, injectable `now`, geometry-never-invented |
| Treemap/mention machinery removal | **domain** | `viz-data.ts` (`techMentions` deleted), `skills-section.tsx` | `skillsGroupCounts` survives (chips) — OQ-10 |
| Competency cards + merged About+Contact + 2×2 grid + calendar renderer + tour/drawer/status updates | **presentation** | `skills-section.tsx`, `about-section.tsx` (+ contact anatomy absorption), `explore-panels.tsx`, `projects-section.tsx`, `constants.ts`, `explore-tour.tsx`, `explore-status-bar.tsx` (auto) | Server components; grid `grid-cols-1 md:grid-cols-2` (lg stays 2), About col-span removed |
| /resume docx-structure rebuild | **presentation** | `src/components/resume/*` (ResumeView order; new core-competencies section; curated certs = featured; selected writing = featured articles) + `resume/page.tsx` chrome preserved | Keeps `ResumeView` props contract (R-11) |
| PDF rebuild | **presentation** (node script) | `scripts/generate-static-resume.js` | Same docx structure from refreshed data; contact URLs go data-driven (§1.3); hardcoded ISTQB sidebar block and Languages/Testing/Infrastructure/Innovation skill block replaced |
| CLI branding propagation | **presentation** (CLI) | `WelcomeMessage.tsx` (2 hardcoded sites → data-driven), `AboutOutput.tsx` (box width derivation), optionally `SkillsOutput.tsx` competencies block (OQ-3) | CLI behaviour otherwise untouched; REV-07 deferral keeps `experience-section.tsx` + `career-span-chart.tsx` byte-untouched |
| Metadata / JSON-LD / SEO | **integration** | `src/app/layout.tsx` (auto via data: title `:31`, jobTitle `:79`, description `:32,37,54`), `src/app/explore/layout.tsx` (auto) | Only `meta.description/keywords` need a data decision (OQ-4); `knowsAbout` untouched unless competencies are added there (not required) |
| External entity verification | **integration** | npm registry API, Medium profile | Done this session (§1.4.1); per-article slugs at draft time |

**Security-sensitive placement check:** no auth, no secrets, no user input handling in this phase — no security-tier conflict. The npm-registry verification is read-only integration research feeding the draft, correctly placed outside the domain tier.

---

## 6. Validation Architecture

Automated checks that prove each behaviour (carrier: `node --test tests/`, zero-dep, source-invariant + export-level per suite convention; export-level rows run after `npm run build`):

| Behaviour | Proof |
|---|---|
| Data refresh on record, nothing deleted | New data-integrity suite reading `portfolio-main-data.json`: title equals docx line 2 verbatim; 8 competency clusters each with non-empty `proof`; Chubb/Upstream/Netcompany responsibilities equal the docx bullets (count + first-bullet spot checks); certs length ≥ 41 with exactly 5 featured (ISTQB + 4 Anthropic); articles: ≥ 12 entries with exactly 5 featured; projects length ≥ 14; `interests`/`favorite_games`/`presentations` deep-equal the pre-phase values (nothing-deleted pin); education entries unchanged |
| Draft-approve integrity | The execute step commits the approved draft (diff artifact) before the write; the suite's data assertions above double as the write's acceptance |
| Surface propagation | Source-level: `WelcomeMessage.tsx` contains no hardcoded title literal + renders `about.title` (two sites); `AboutOutput.tsx` box width derived, no fixed `padEnd(57)`; root `layout.tsx` untouched (auto) — verified by absence-of-literal greps; export-level: `out/index.html`/`out/explore.html`/`out/resume.html` carry the new title where statically rendered |
| /resume docx order | Source-order test on `ResumeView` (rendered section sequence = SUMMARY → CORE COMPETENCIES → EXPERIENCE → PROJECTS → EDUCATION → CERTIFICATIONS → SELECTED WRITING); chrome preserved: `?print=true` timer, toggle buttons, print/save handler present in `resume/page.tsx`; print CSS (`@page`, `.resume-container` width) present |
| PDF rebuild | Run `npm run build:resume`; assert `public/resume-export.html` contains docx section markers in order, no `Languages`/`Testing`/`DevOps`-style hardcoded skill block, projects present, featured-only certs, `about.title` rendered; rewrite `scripts/verify-resume-content.js` to this contract (R-4) — keep it runnable standalone |
| Grid 2×2 merge | Source assertions: `grid-cols-1 md:grid-cols-2` + `lg:grid-cols-2` (no `lg:grid-cols-3`), About col-span absent, exactly 4 `SECTION_BODIES` closures, no standalone contact panel; updated sweep rows (`tests/explore-sweep.test.mjs:33-42` grid pins) |
| Skills cards | 8 cards from `core_competencies` (name chip + proof line, zero hardcoded competency strings); no `recharts` import in `skills-section.tsx`; `skills-chart.tsx`/`skills-treemap.tsx` files absent; chips + terminal pointer intact (OQ-10); `techMentions` gone from `viz-data.ts` with its tests |
| recharts removal (if adopted) | `package.json` deps = 38, `recharts` absent, `ui/chart.tsx` absent; `tsc --noEmit` + `npm run build` green (updated `tests/explore-visuals.test.mjs:622-626`) |
| Year-grid calendar | Unit tests on `buildProjectCalendar`: month parsing for all 11 `"Month YYYY"` dates; year-only → full-year span; `"Ongoing"` → no geometry; columns 2016→injectable-now; component source test (pure server, no recharts, no client directive, composes above cards below tiles); export-level presence in `out/explore.html` |
| Tour/counter/drawer | Updated: `EXPLORE_TOUR_STEPS.length === 6`, id list without `contact`, welcome body "four sections", `"of 7"` literal absent (derived), status-bar `N/EXPLORE_SECTIONS.length` (auto), drawer anchors = 4 |
| Final gate | `npm run build` + `npm run typecheck` + full `node --test tests/` green, chronologically last on the final tree (green-gate-finality) |

Manual-only rows (cannot be automated on static HTML): 375px/768/1440 visual no-empty-space pass on the merged grid, print-width PDF check, both-theme legibility — carried to the verify step's human pass as in prior phases.

---

## 7. Project constraints (from project conventions and planning artefacts)

- No root `AGENTS.md`; conventions live in the phase artefacts. [VERIFIED: `ls AGENTS.md` empty; `.planning/PROJECT.md` read]
- Atomic commits, one per task; planning docs are part of the gated tree (green gate covers docs too — a green run must postdate every write). [CITED: `.planning` discipline + green-gate-finality]
- Tests are zero-dep `node --test` files under `tests/`; runner per file documented in each file's header. [VERIFIED]
- Data-driven only — no hardcoded portfolio content anywhere (EXPLORE-07 discipline); JSON order is render order; graceful-hide; verbatim display strings (parsers touch geometry only). [VERIFIED: `viz-data.ts:16-17`, component headers]
- Remote writes are user-gated: `deploy.yml` deploys on push to `master` — never push without an explicit per-action user command. [VERIFIED: `.github/workflows/deploy.yml:8-10`; user memory]
- Personal resume copy never enters the data file unseen (D-01) — the draft gate is a hard process requirement, not a nicety. [CITED: CONTEXT.md D-01]
- REV-07: `experience-section.tsx` + `career-span-chart.tsx` stay byte-untouched; the `buildCareerSpan` test asserting role rows survives the responsibilities swap (it pins company/title/duration/isTechRelated only). [VERIFIED: `tests/explore-visuals.test.mjs:359-380`]

---

### Confidence summary

- All in-repo discrete values, file inventories, and coupling points: **[VERIFIED]** — read this session with path+line.
- External entities: npm downloads **[VERIFIED]** via registry API responses quoted verbatim; Medium article existence **[VERIFIED]** via profile fetch; Anthropic Academy course names **[ASSUMED→user-owned]** (docx is the user's own record; links left null unless supplied).
- Runner invocation for the *full* suite (`node --test tests/`): **[ASSUMED]** from per-file headers + acceptance wording — no machine-recorded full-suite command exists (deja-vu `how` returned nothing); per-file runner form is **[VERIFIED]** from test-file headers.
- SPEC "Current" for REV-03 partially falsified against the code (projects DO render in the PDF today) — planners must use §1.3 pitfall 3, not the SPEC Current line.
```

**Summary of what I did and found** (for the orchestrator):

- **Swept every canonical ref** plus the full consumer graph: data file, `.d.ts`, PDF script, all 9 resume components, all explore panels/sections/hooks/tour/drawer/status-bar, CLI outputs, root/explore layouts, all 8 test files, `verify-resume-content.js`, and CI.
- **Falsified one SPEC claim**: the PDF template *does* render projects today (`generate-static-resume.js:442-457`) — plan against the real file.
- **Verified external entities per D-03**: registry shows deepindex at **18 downloads last week** (spike week ≈646) — the docx "400+" claim is stale and must go through the draft gate; both docx-only Medium articles confirmed live on the profile.
- **Enumerated every 4-section merge coupling** (panels, drawer, tour "of 7" hardcoded literal, status counter, visited storage) and the full stale-test/standalone-script surface (`explore-visuals-skills.test.mjs` whole file, dependency-count pin, `verify-resume-content.js`).
- **Resolved all 12 open questions** with evidence or marked recommendations — none block planning; the two genuinely user-owned calls (downloads wording, Anthropic links) route through the locked D-01 draft-approve process.