# Data Refresh Draft — REV-01 — FOR APPROVAL (D-01)

**Status:** DRAFT — **nothing has been written to `src/data/portfolio-main-data.json` yet.**
**Process (D-01):** draft → approve → write. This file holds the COMPLETE data-file diff, transcribed verbatim from `resume-docx-extraction.md`, presented for your approval. Personal resume copy never enters the data file unseen.
**External verification (D-03):** npm registry + Medium profile fetched live this phase (RESEARCH §1.4.1) — numbers below are registry-verified, not docx-echoed.
**Scope guard:** nothing is deleted. Every untouched collection is ledgered in §9. One deliberate replacement happens by design (experience responsibilities, D-02) — called out in §4 and §9.

> ## APPROVAL BOX (to be filled by the user before the write)
> **Approved:** 2026-09-22 — user approved via interactive decision round: (a) **B** launch-week number; (d) **d2** add real Part 1; all remaining items approved as recommended (title/summary/competencies/bullets verbatim, U-4 flip, deepindex-first flagship order, Anthropic cert defaults, keywords refresh, chips stay, TaasOutput pipe sentence seen-and-accepted).
> - (a) Downloads wording: ~~A~~ / **B (spike-scoped) ✓ APPROVED** / C
> - (b) Flagship order per U-6 (deepindex → Clarif-AI): **✓ confirmed**
> - (c) Anthropic cert dates & links: **✓ defaults accepted (date `2026`, `link: null`)**
> - (d) Geo-article reconciliation: d1 / **d2 ✓ APPROVED** / d3
> - (e) meta.keywords refresh: **✓ yes**
> - (f) Skill chips stay under the /explore competency cards: **✓ confirmed**
> - U-4 Smartup PCC `isTechRelated` flip true→false: **✓ approved**

---

## 1. Title / branding — `about.title` (+ meta per OQ-4)

**about.title** ← docx line 2, verbatim:

```json
"title": "Test Automation Architect | Principal Test Automation Engineer"
```

(current value: `"Senior Software Engineer in Test"` — replaced; every surface listed in §11 then derives from data.)

**meta.description** (OQ-4 proposal — branding consistency on SEO surfaces; root `layout.tsx` reads it for OG/Twitter):

```
"Interactive CLI portfolio of Anastasios Tilsizoglou — Test Automation Architect and Principal Test Automation Engineer, part-time freelance consultant (TAaS). Test automation architecture, AI-driven QA, Playwright, CI/CD, and full-stack engineering."
```

**meta.keywords** (OQ-4 proposal — DECISION (e)): replace the segment `Senior Software Engineer in Test` with `Test Automation Architect, Principal Test Automation Engineer`; all other keywords untouched.

---

## 2. Summary — `about.description`

← docx line 5, verbatim:

```
Test automation engineer with 7+ years designing frameworks and platforms now standard across an entire QA organization. Recognized internally as the go-to authority for QA automation architecture and technical direction, translating strategy into shared tooling adopted by 12+ engineering teams. Builds AI-driven QA infrastructure — MCP servers, agentic coding workflows, and RAG-based tooling — bridging emerging AI practice with governed engineering standards. ISTQB-certified; MSc in Applied Informatics; open-source contributor with a published npm package generating 400+ weekly downloads.
```

**DECISION (a) coupling:** the final sentence's tail `…generating 400+ weekly downloads.` changes with the downloads decision in §5:
- (a)=A → summary stays exactly as the docx line above.
- (a)=B → tail becomes: `…open-source contributor with a published npm package that debuted at 600+ downloads in its launch week.`
- (a)=C → tail becomes: `…open-source contributor with a published npm package.`

---

## 3. core_competencies — 9→8 decomposition (D-02)

Docx line 7 carries **NINE** `•`-separated segments. D-02 pins **EIGHT** `{name, proof}` clusters. Proposed merge: **segments 2 + 3** (the two bare tool/language enumerations — the only segments with no competence predicate of their own) merge into one cluster; the full docx enumeration stays visible inside its proof line. New top-level field `core_competencies`, typed in `portfolio-main-data.d.ts` as `{ name: string; proof: string }[]` (required — types land in the same commit as the JSON, R-7).

Docx segments (verbatim): ① Test Automation Architecture & Framework Design ② Playwright, Selenium, Rest Assured, WebdriverIO ③ Java, JavaScript, TypeScript ④ CI/CD (Jenkins, Docker, Bitbucket) ⑤ AI-Driven QA (MCP, RAG, Prompt Engineering, Agentic AI) ⑥ NPM Module & Platform Architecture ⑦ Quality Dashboards & Reporting ⑧ Cross-Team Technical Leadership & Mentorship ⑨ Performance & Load Testing (ReadyAPI, LoadUI, Postman)

Proposed **8 clusters** — every proof composed ONLY from verified data values (12+ teams / 20+ projects / 5 immediate adoptions / 30+ engineers / primary reviewer / real-time dashboards / 100% requirement coverage / published npm package). No invented numbers:

| # | name | proof | source |
|---|------|-------|--------|
| 1 | Test Automation Architecture & Framework Design | Internal NPM framework used by 12+ engineering teams across 20+ projects — 5 adopted it immediately; now the QA chapter standard. | Chubb bullet 1 |
| 2 | Test Automation Stack & Languages *(merged ②+③)* | Playwright, Selenium, Rest Assured, WebdriverIO · Java, JavaScript, TypeScript — the stack the shared framework's 20+ projects are written in. | docx ②③ + Chubb bullet 1 |
| 3 | CI/CD (Jenkins, Docker, Bitbucket) | Rebuilt CI/CD pipelines on open-source tooling — recurring licensing costs eliminated, delivery velocity maintained. | Chubb bullet 5 |
| 4 | AI-Driven QA (MCP, RAG, Prompt Engineering, Agentic AI) | MCP servers and AI agent skills used by 30+ engineers; agentic coding harnesses standardized org-wide. | Chubb bullets 3–4 |
| 5 | NPM Module & Platform Architecture | Published npm package (deepindex); replaced forked, duplicated automation code with one modular NPM dependency model. | Chubb bullet 1 + docx line 26 |
| 6 | Quality Dashboards & Reporting | Real-time quality dashboards giving stakeholders test-health visibility for data-driven prioritization. | Chubb bullet 6 |
| 7 | Cross-Team Technical Leadership & Mentorship | Primary technical point of contact for QA automation architecture across the department; led code reviews as primary reviewer. | Chubb bullet 2 + Netcompany bullet 2 |
| 8 | Performance & Load Testing (ReadyAPI, LoadUI, Postman) | Executed performance and load testing to identify and resolve system bottlenecks. | Netcompany bullet 4 |

Render targets: /explore Skills cards (plan 04), /resume CORE COMPETENCIES (plan 02), PDF (plan 03), CLI `skills` output (this plan, Task 4).

---

## 4. Experience bullets — Chubb / Upstream / Netcompany (docx lines 10–24, verbatim)

Titles, companies, locations, durations stay **byte-untouched**. The 4 non-docx roles (Smartup PCC, Barista, Storekeeper, Washer) stay **byte-untouched** except the single named U-4 flag flip below. Responsibilities of the 3 docx roles are **replaced by the docx bullets** (the one deliberate content replacement per D-02 — the docx is source of truth).

**Chubb — 6 bullets (replaces the current 7):**

1. Designed an internal NPM automation framework now used by 12+ engineering teams across 20+ projects; after an internal presentation, 5 projects adopted it immediately, and it went on to become the standard framework across the entire QA chapter, replacing duplicated, forked automation code org-wide.
2. Serve as the primary technical point of contact for QA automation architecture and design decisions across the department, advising teams on framework structure, tooling choices, and test strategy.
3. Deployed MCP servers and AI agent skills used by 30+ engineers, making testing know-how and technical context retrievable at the point of work instead of buried in documentation.
4. Standardized agentic AI coding harnesses org-wide (rules, hooks, sub-agent workflows), converting ad hoc AI tool usage into governed engineering practice.
5. Defined CI hosting requirements for the DevOps team and rebuilt CI/CD pipelines on open-source tooling, eliminating recurring licensing costs while maintaining delivery velocity.
6. Designed real-time quality dashboards giving stakeholders visibility into test health for data-driven prioritization.

**Upstream Systems — 3 bullets (replaces the current 3, docx wording):**

1. Integrated automated smoke and regression suites into daily CI/CD delivery cycles.
2. Designed custom test execution tooling that reduced manual overhead and expanded automated coverage to new product modules.
3. Influenced “shift-left” strategy by feeding UX and performance findings into design phases before development began.

**Netcompany-Intrasoft — 4 bullets (replaces the current 3, docx order):**

1. Initiated and built the team’s first Jenkins CI pipelines for test automation, introducing scheduled overnight regression runs where none had previously existed.
2. Led code reviews as primary reviewer, holding automation scripts to consistent architectural standards across the team.
3. Authored test artifacts and traceability matrices achieving 100% requirement coverage.
4. Executed performance and load testing (LoadUI, Java) to identify and resolve system bottlenecks.

Notes: docx curly quotes (“shift-left”, team’s) are transcribed verbatim into the JSON (valid UTF-8 JSON). The current JSON bullet order for Netcompany differs (Performance first) — the docx order replaces it wholesale.

### U-4 flag flip (UI-SPEC §7.3.4 line 246 / UAT table line 396 — named data-write obligation)

`experience[3]` **Smartup PCC ("Android Developer")** — `isTechRelated` flips **true → false**.

- Why: `/resume` + the PDF select roles via the untouched `.filter((job) => job.isTechRelated)`; today 4 entries are `true` (Chubb, Upstream, Netcompany-Intrasoft, Smartup PCC) but the docx carries exactly 3 roles. The flip restores the 3-role contract without touching any component.
- **Nothing deleted:** the Smartup PCC entry itself stays fully in the data and remains CLI-reachable via `experience --all` — this is a flag change, not a row removal. Its 5 responsibility lines stay byte-identical.
- Exactly 3 `isTechRelated: true` entries remain: Chubb, Upstream Systems, Netcompany-Intrasoft.

---

## 5. Projects — flagship enrichment + U-6 ordering + downloads DECISION BOX

### U-6 flagship ordering (RESOLVED — presented for confirmation, DECISION (b))

Per UI-SPEC line 398 / checker B-1 fix: `featured: true` on **DeepIndex and Clarif-AI only**, and the projects array is **reordered deepindex → Clarif-AI** (data order = render order; no client-side sorting). The other 12 projects keep their current relative order and gain no flag. /resume + the PDF render featured projects only (plan 02/03).

New head of the array: `DeepIndex` (position 0), `Clarif-AI` (position 1), then SDK4ED-TD … Portfolio Website unchanged.

### Enriched descriptions (docx lines 26–27)

**DeepIndex** (position 0):

```
Open-source, npm-published RAG-based context engine for AI coding assistants — hybrid semantic and entity-graph code search (tree-sitter, SQLite, embeddings), self-healing and token-efficient, with an MCP server and bundled dashboard. Published on npm. [DOWNLOADS WORDING — see decision (a)]
```

**Clarif-AI** (position 1):

```
AI-powered contract analyzer for freelancers — scans contracts to surface red flags and hidden terms in under two minutes. Personal product, currently in alpha. Live at clarif-ai.net.
```

### DECISION (a) — downloads claim (registry-verified vs docx)

RESEARCH §1.4.1, fetched live from `api.npmjs.org` this phase:
- **docx claims:** "400+ weekly downloads" (in BOTH the summary, §2, and the deepindex line).
- **Registry, current week (2026-09-15 → 2026-09-21): 18 downloads.**
- **Registry, spike week (2026-09-09 → 2026-09-14): 646 downloads** (241+176+35+157+27+10).

| Option | deepindex project line reads | Summary tail reads | Tradeoff |
|--------|------------------------------|--------------------|----------|
| **A** | `…Generating 400+ weekly downloads.` | verbatim docx | Matches the docx exactly; contradicts the live registry today (18/week). |
| **B (recommended)** | `…600+ downloads in launch week (Sep 2026).` | `…published npm package that debuted at 600+ downloads in its launch week.` | Keeps an impressive number that is registry-verifiable; wording defensible. |
| **C** | `…Published on npm.` (no number) | `…published npm package.` | Zero exposure; drops the strongest stat. |

The chosen wording is pinned by the integrity suite (`deepindex` description contains the approved string).

---

## 6. Certifications — featured flags + 4 new Anthropic Academy entries (docx lines 31–33)

- **ISTQB® Foundation Level (CTFL)** (existing entry, JSON line 196): gains `featured: true`. No other field touched (`link` stays `"ID: GRTB-24-1S20-CTFL"`, date `July 2024`).
- **FOUR NEW entries** from docx line 33, all `featured: true`, inserted **immediately after ISTQB** so ISTQB stays first in data order among featured (UI-SPEC line 249 — /resume renders data order; the CLI re-sorts by parsed date anyway):

```json
{ "name": "Claude 101", "link": null, "date": "2026", "featured": true },
{ "name": "Claude Code in Action", "link": null, "date": "2026", "featured": true },
{ "name": "Introduction to Claude Cowork", "link": null, "date": "2026", "featured": true },
{ "name": "Introduction to Agent Skills", "link": null, "date": "2026", "featured": true }
```

**DECISION (c):** dates default to year-only `"2026"` (parseable by `CertsOutput` — accepts `"MMMM yyyy" | "MMM yyyy" | "yyyy"`); links default `null` (established pattern, JSON lines 206/218–229). If you supply exact months (e.g. "March 2026") or Academy URLs, the draft write uses them verbatim.

Result: 45 certifications total — all 41 originals intact + 4 new. Exactly 5 featured.

---

## 7. Articles — selected writing (docx lines 34–39): featured flags + 2 new entries + geo reconciliation (DECISION (d))

- **featured: true** on the 2 unambiguous existing matches: `Core Design Patterns for Test Automation: From Chaos to Maintainable Frameworks` (JSON line 278) and `Flaky Tests Driving You Crazy? Here's How to Fix and Prevent Them!` (line 285). No other field touched.
- **TWO NEW entries** (titles/dates verified live on the Medium profile, RESEARCH §1.4.1; per-article links fetched at write time):

```json
{ "name": "Your AI Agent Keeps Re-Discovering Your Codebase. I Built the Tool That Stops It.",
  "platform": "Medium", "link": "<per-article URL — fetched at write time>",
  "summary": "The context engine that stops AI agents re-discovering the same codebase every session.",
  "date": "Sep 14, 2026" },
{ "name": "Your Playwright Tests Take 45 Minutes? Cut That to 12.",
  "platform": "Medium", "link": "<per-article URL — fetched at write time>",
  "summary": "Practical cuts that took a 45-minute Playwright suite down to 12 minutes.",
  "date": "May 26, 2026" }
```

Insertion position: top of the `articles` array (newest first), all 12 existing entries keep their current relative order — never re-sorted.

**DECISION (d) — geo entry.** The docx selects **Part 1** ("A QA Engineer's Guide to Testing Geo-Specific Features (Without Flying to 30 Countries) — Part 1", Dec 23 2025). The existing JSON entry `Testing Geo-Specific Features` (line 250, date `Jan 2026`) corresponds to the real **Part 2** (verified on the Medium profile: Part 1 = Dec 23 2025, Part 2 = Jan 25 2026). Options:

| Option | What happens | Featured count | Ledger impact |
|--------|--------------|----------------|---------------|
| d1 | Flag the existing entry featured as-is (title/date stay Part-2-flavoured). | 5 | Zero changes beyond flags; docx Part-1 selection represented only loosely. |
| **d2 (recommended)** | Add the real **Part 1** as a third NEW entry (featured); the existing Part-2 entry stays, unfeatured. | 5 (Core, Flaky, AI-Agent, Playwright-45, Geo Part 1) | Docx-faithful AND nothing deleted — all 12 original names intact. |
| d3 | Rename the existing entry to the real Part 1 title + date Dec 2025 + per-article link; feature it. | 5 | Docx-exact, but one original name is replaced (ledger records the approved replacement; Part 2 stays Medium-reachable). |

If d2: featured = Core Design Patterns, Flaky Tests, Geo Part 1 (new), AI Agent (new), Playwright 45 (new) — exactly the docx's 5, and the Part-2 entry remains CLI-reachable unfeatured.

---

## 8. Education — featured flags (checker B-2 fix, UI-SPEC line 248)

The data carries THREE entries; the docx lists two. Per the nothing-deleted invariant the High School row stays; /resume + the PDF render **featured entries only**:

- `featured: true` on entry 0 — MSc, "Master of Science in Computer Science", University of Macedonia.
- `featured: true` on entry 1 — BEng, "Bachelor of Computer Engineering", TEI of Central Macedonia.
- High School Degree (entry 2) — **no flag**, fully CLI-reachable via the `education` command.

No degree/institution/duration/courses strings change. (`featured?: boolean` typed on `EducationEntry` in the same commit.)

---

## 9. Nothing-deleted ledger (every untouched collection, pinned by the integrity suite)

| Collection | Disposition |
|------------|-------------|
| `interests` (8) | byte-identical |
| `favorite_games` (4 groups) | byte-identical |
| `presentations` (1) | byte-identical |
| `skills` (soft 6 / hard 4 groups / languages 2) | byte-identical |
| `education` (3) | degrees/institutions/durations/courses byte-identical; featured flags added per §8 |
| Experience — 4 non-docx roles (Smartup PCC, Barista, Storekeeper, Washer) | byte-identical EXCEPT the single U-4 `isTechRelated` flip on Smartup PCC (§4); prose untouched |
| Experience — Chubb/Upstream/Netcompany titles/companies/locations/durations | byte-identical; responsibilities REPLACED per D-02 (§4) — the one deliberate replacement |
| `certifications` — 41 originals | all 41 names/links/dates intact (ISTQB gains a flag); 4 added per §6 → 45 |
| `articles` — 12 originals | all 12 intact (2 gain featured flags; geo entry per decision (d)); 2–3 added per §7 |
| `projects` — all 14 | all present; 2 enriched + reordered per §5; 12 untouched |
| `meta` charset/viewport/author | byte-identical |

---

## 10. Rendering notes (awareness — no action unless you say so)

- **TaasOutput.tsx:18** renders `I work full-time as a {about.title} and…` → with the pipe-bearing title it will read *"…as a Test Automation Architect | Principal Test Automation Engineer and take a small number of…"*. Data-driven; no code change planned (CLI styling changes are out of scope). Flagged so it is a seen-and-approved consequence, not a surprise.
- **AboutOutput ASCII box**: fixed 59-char rule + `padEnd(57)` vs the 62-char title → box width becomes data-derived (Task 4 of this plan).
- **explore-intro strip**: the `name — title` line grows to ≈91 chars → 3-line min-height reserve at 375px (Task 4, checker B-6) so the no-CLS invariant holds.
- **WelcomeMessage banner** (desktop line 32 + mobile line 41): hardcoded `Senior Software Engineer in Test` → data-driven `about.title` (Task 4).
- Root `layout.tsx` metadata + JSON-LD, `/explore` header/intro, wizard intro: auto-derive from data — no edit.

---

## 11. Consumer propagation table (D-03 — map-content-surfaces, derived before the write)

CLI outputs enumerated: About, Experience, Projects, Certs, Articles, Skills (the RESEARCH ×6) + WelcomeMessage + TaasOutput (branding-adjacent). Each row carries its propagation disposition:

| # | Surface | File(s) | Refreshed field(s) read | Propagation |
|---|---------|---------|--------------------------|-------------|
| 1 | CLI welcome banner (desktop + mobile) | `src/components/cli/outputs/WelcomeMessage.tsx` | `about.title` | handled-in-task-4 |
| 2 | CLI About ASCII box | `src/components/cli/outputs/AboutOutput.tsx` | `about.title` (+ derived width) | handled-in-task-4 |
| 3 | CLI skills output | `src/components/cli/outputs/SkillsOutput.tsx` | `core_competencies` (new block) | handled-in-task-4 |
| 4 | CLI taas output | `src/components/cli/outputs/TaasOutput.tsx` | `about.title` | auto-derived (see §10 note) |
| 5 | CLI experience output | `src/components/cli/outputs/ExperienceOutput.tsx` | responsibilities, isTechRelated | auto-derived |
| 6 | CLI projects output | `src/components/cli/outputs/ProjectsOutput.tsx` | descriptions, order, featured | auto-derived |
| 7 | CLI certs output | `src/components/cli/outputs/CertsOutput.tsx` | 4 new Anthropic entries, featured, date formats | auto-derived |
| 8 | CLI articles output | `src/components/cli/outputs/ArticlesOutput.tsx` | featured flags, 2 new entries | auto-derived |
| 9 | In-app resume modal | `src/components/cli/ResumeModal.tsx` | `about.*`, projects, certs, articles | auto-derived |
| 10 | /resume page components | `src/components/resume/*` | full refreshed data (docx structure) | needs-nothing (plan 02 rebuilds; flags typed here) |
| 11 | PDF template | `scripts/generate-static-resume.js` | full refreshed data | needs-nothing (plan 03 rebuilds) |
| 12 | Wizard intro | `src/components/explore/explore-header.tsx`, `explore-intro.tsx` | `about.name — title` | auto-derived (intro reserve bump handled-in-task-4, B-6) |
| 13 | Root layout metadata + JSON-LD | `src/app/layout.tsx` | `about.title`, `meta.description/keywords` | auto-derived |
| 14 | Explore header/intro + layout metadata | `src/app/explore/*` | `about.title` | auto-derived |

Task 4's edit list (rows 1–3 + the row-12 reserve) and its verify-only list (everything else) derive from this table.

---

## 12. Decision boxes summary — resolve all before the write (Task 2)

- **(a)** Downloads wording: A (docx 400+ verbatim) / **B (recommended: 600+ launch week, registry-verified)** / C (soften).
- **(b)** Flagship order per U-6: deepindex → Clarif-AI, `featured: true` on exactly those two — confirm (recommended) / override.
- **(c)** Anthropic certs: defaults date `"2026"`, `link: null` — or supply exact dates/URLs.
- **(d)** Geo reconciliation: d1 / **d2 (recommended — add real Part 1, nothing deleted)** / d3 (rename per docx).
- **(e)** `meta.keywords` refresh: yes (recommended) / no.
- **(f)** Skill chips stay under the /explore competency cards — plan 04's recorded U-2 adjudication (chips STAY) is confirmed or overridden here in the same approval round (checker W-1).
- **U-4** Smartup PCC `isTechRelated` true→false — approve as part of this diff.
- **Awareness** TaasOutput pipe sentence (§10) — seen and accepted.