# Phase 6: explore-revision - Context

**Gathered:** 2026-09-23T05:48:23.748Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Data refresh (docx → JSON, draft-approve-write, all 4 surfaces consistent, nothing deleted), /resume + PDF export rebuilt to docx structure, About+Contact merged with 2×2 grid, Skills as competency + proof cards (bar chart + treemap removed), Projects year-grid calendar added.
**Out of scope:** REV-07 experience redesign (deferred pending user description), new dependencies, CLI output styling changes beyond data-driven text, panel chrome/token changes beyond the merge, edits to CLI behaviour, deletion of any data content.
</domain>

<decisions>
## Decisions
### Data refresh process & mapping
- **D-01:** Process = draft → approve → write (user decision): the complete data-file diff is transcribed verbatim from the docx extraction, presented to the user for approval, and only then written — personal resume copy never enters the data file unseen.
- **D-02:** Content mapping: about.title → 'Test Automation Architect | Principal Test Automation Engineer'; about.description → docx SUMMARY; NEW core_competencies array (8 clusters, each {name, proof}); experience responsibilities replaced by the docx's quantified bullets per role; projects: Clarif-AI + DeepIndex enriched with docx value lines (npm link, 400+ weekly downloads, red-flags framing), remaining 12 kept; certifications gain featured:true on ISTQB + the Anthropic Academy items (all 41 remain); articles: the docx's 5 selected-writing entries flagged/marked; education verified already-matching (no change).
- **D-03:** Surface propagation checklist per map-content-surfaces: enumerate every consumer (CLI outputs, resume modal, /resume components, PDF template, wizard intro, layout metadata/JSON-LD, /explore header title) and verify each field change propagates or is deliberately scoped; verify external entities against primary sources (npm weekly downloads via the registry, article links) before drafting.
### Visual revisions
- **D-04:** Grid rebalance = 2×2 (user decision): grid-cols-1 / md:grid-cols-2, lg tier drops from 3 to 2 columns — [About+Contact | Experience] / [Skills | Projects]; old About col-spans removed; zero empty cells at every width; 375px invariant unchanged.
- **D-05:** Merged About+Contact panel: keeps About's accent (chart-1) and grid identity, contains description + location + all 9 contact channel rows (existing ContactSection anatomy) + the 'Full resume →' link; the standalone Contact panel disappears from the grid (drawer/wizard/tour sequences update to 4 sections).
- **D-06:** Skills panel = competency + proof cards (user picked option B): 8 cards, each = competency name (accent chip) + one-line quantified proof from the new core_competencies data; recharts BarChart + Treemap components and their tests removed; viz-data mention machinery reduced accordingly (stale-test discipline).
- **D-07:** Projects calendar = year-grid bars (user decision): year columns 2016→present derived from data, each project a bar positioned in its ship month (ship dates are single months — bars span one month cell), pure CSS following the existing Gantt pattern (no recharts); stat tiles + cards unchanged below.
- **D-08:** /resume rebuild keeps the page chrome (dark/printer toggle, print/save button, ?print=true auto-print) and rebuilds the content sections to the docx order; the PDF template is rebuilt to the same structure from the refreshed data (npm run build:resume).
### Deferrals
- **D-09:** REV-07 (experience showcase redesign per the user's screenshot) is DEFERRED — the experience panel stays byte-untouched until the user describes the layout; no speculative redesign ships. The wizard/drawer/counter flows adapt only to the 4-panel grid.
### Claude's Discretion
- Competency card grid density inside the panel (1 vs 2 columns at panel width)
- Calendar bar color mapping (chart tokens per year or per project type)
- Merged panel internal spacing/order (description first, contacts after)
- Resume section typography details within the docx structure
- Whether recharts is removed from package.json (only if zero usages remain — gate-verified)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Content source of truth
- `.planning/phases/EXPLORE-06-explore-revision/resume-docx-extraction.md — the full docx text extraction, the content source of truth for every data edit this phase`
### Data + resume surfaces
- `src/data/portfolio-main-data.json — the single store all surfaces read`
- `scripts/generate-static-resume.js — PDF template (hardcoded skills, no projects) to rebuild`
- `src/components/resume/* — /resume page section components to rebuild`
### Explore revision targets
- `src/components/explore/explore-panels.tsx — grid to rebalance (2×2)`
- `src/components/explore/sections/skills-section.tsx — bar chart + treemap to remove`
- `src/components/explore/sections/projects-section.tsx — calendar augment target`
- `src/components/explore/sections/about-section.tsx + contact-section.tsx — merge targets`
### Locked spec
- `.planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-SPEC.md`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- Data consumers to enumerate before the data write (map-content-surfaces): CLI terminal outputs (About/Experience/Projects/Certs/Articles/Skills outputs), in-app resume modal, /resume page components, PDF template, wizard intro (renders about.name/title), root layout metadata + JSON-LD schema, /explore header title
- Resume page chrome to preserve: dark/printer toggle + Print/Save button + ?print=true auto-print behaviour (resume/page.tsx)
- The docx's 5 selected articles overlap the JSON articles collection partially — reconciliation = featured flags, not replacement
- Clarif-AI + DeepIndex already exist as projects[0..1] — enrichment adds value lines/links, not new entries
- Removing the recharts bar chart + treemap removes the last recharts usage (Gantt is CSS) — the recharts dependency becomes unused and its removal is a decision point at plan time (stale-test + ponytail)
- Experience section (text timeline + CSS Gantt) stays byte-untouched this phase (REV-07 deferred) — the wizard/counter/pointer flows keep working through it
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
  _Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._
  ### Req REV-01
  - **Current:** Data file carries the pre-docx story: old title, old responsibilities, no competencies, 41 flat certs, unflagged articles.
  - **Target:** Data refresh: portfolio-main-data.json adopts the docx as source of truth (branding, summary, core competencies + proofs, quantified bullets, enriched top-2 projects, featured-flag certifications, selected-writing curation) — all four surfaces consistent, nothing deleted.
  - **Acceptance:** Before/after data diff on record; branding + summary + competencies + quantified bullets + enriched projects + featured certs + selected writing all present in portfolio-main-data.json and rendering consistently on CLI, /explore, /resume, and the PDF export; zero content deleted (full lists CLI-reachable); every consumer enumerated per map-content-surfaces before the data write.
  ### Req REV-02
  - **Current:** /resume renders the old structure from the old data.
  - **Target:** Rebuild the /resume page to the docx structure (SUMMARY → CORE COMPETENCIES → EXPERIENCE → PROJECTS → EDUCATION → CERTIFICATIONS → SELECTED WRITING), print-optimized.
  - **Acceptance:** /resume renders the docx section order with quantified bullets and curated certs/writing; print width verified; the dark/printer-mode toggle and print/save behaviour preserved.
  ### Req REV-03
  - **Current:** The PDF template hardcodes Languages/Testing/DevOps skills and renders NO projects.
  - **Target:** Rebuild the static PDF export to the same docx structure from the refreshed data.
  - **Acceptance:** `npm run build:resume` produces public/resume-export.html rendering the docx structure from the refreshed data; the hardcoded skills block is gone; projects appear.
  ### Req REV-04
  - **Current:** About panel is oversized with wide empty space; Contact is a separate panel.
  - **Target:** Merge About + Contact into one panel on /explore and rebalance the grid.
  - **Acceptance:** One merged panel carries about description + all contact links + 'Full resume →'; grid rebalanced for 4 panels; no wide empty space at 768/1440; 375px invariant holds.
  ### Req REV-05
  - **Current:** Skills panel shows a recharts bar chart + recharts treemap the user judged not valuable.
  - **Target:** Replace the skills bar chart + treemap with competency + proof cards from the refreshed core-competencies data.
  - **Acceptance:** Skills panel renders 8 competency clusters each with a one-line quantified proof from the refreshed data; bar chart + treemap absent; their tests removed/updated; no recharts usage remains in the Skills panel.
  ### Req REV-06
  - **Current:** Projects panel shows stat tiles + 6 cards only.
  - **Target:** Add a year-grid bars calendar visualization to the Projects panel.
  - **Acceptance:** Projects panel renders the year-grid bars calendar above the cards — year columns, bars spanning active months from project dates — alongside the unchanged cards; 375px-safe.
  ### Req REV-07
  - **Current:** The experience showcase (text timeline + CSS Gantt) was visually disliked by the user.
  - **Target:** Experience showcase redesign per the user's reference screenshot — DEFERRED until the user describes the layout; scoped as an amendment to this phase when it arrives.
  - **Acceptance:** No speculative experience redesign ships; the panel keeps the current content until the user supplies the screenshot description; REV-07 stays open.
- **Boundaries (SPEC):**
  **In scope:** Refresh the portfolio data to the user's current resume (docx) as source of truth and revise the visual surfaces accordingly — /resume + PDF rebuilt to the docx structure, About+Contact merged, skills as competency + proof cards, projects year-grid calendar — per the user's pre-ship revision list.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
  - Data refresh on record with a before/after diff: about.title = 'Test Automation Architect | Principal Test Automation Engineer'; new summary; 8 core-competency clusters with proof lines; experience responsibilities replaced by the docx's quantified bullets; Clarif-AI + DeepIndex entries carry the docx value lines (400+ weekly downloads, npm link, clarif-ai.net); certifications data gains featured flags (ISTQB + Anthropic Academy featured; full 41 intact); selected-writing curation marked on the 5 docx articles; nothing deleted from the CLI's reach
  - The /resume page renders the docx structure in order: SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE (quantified bullets per role) → PROJECTS (deepindex, Clarif-AI first) → EDUCATION → CERTIFICATIONS (curated) → SELECTED WRITING (the 5 docx articles) — print-optimized and verified at print width
  - The PDF export (npm run build:resume → public/resume-export.html) renders the same docx structure from the refreshed data, replacing the hardcoded Languages/Testing/DevOps skills and adding the projects section
  - About + Contact merge into one panel on /explore: the merged panel contains the about description AND all contact links + the 'Full resume →' link; the grid rebalances (4 panels) with no wide empty space at 768/1440
  - The Skills panel shows competency + proof cards (8 clusters × one-line quantified proof from the refreshed data) and contains NO bar chart and NO treemap (both removed with their tests updated/removed accordingly)
  - The Projects panel shows the year-grid bars calendar (year columns 2016→present, project bars spanning their active months, derived from project dates in the data) above the existing cards
  - The CLI welcome banner, typing lines, and title strings reflect the new branding wherever about.title is rendered; all existing CLI commands still work; the explore header title updates automatically via the data
  - REV-07 (experience showcase redesign) is explicitly deferred pending the user's screenshot description — no speculative redesign ships in its place
- User: 'I didn't like the experience showcase' → REV-07 deferred pending screenshot description
- User: About too big/empty → merge Contact in (REV-04)
- User: treemap + skills chart not valuable → competency + proof cards (REV-05)
- User: projects calendar 'like a calendar not like the one in experience' → year-grid bars (REV-06)
- User: 'My resume need to change and be like this' + docx → REV-01/02/03
- User: 2×2 grid; draft→approve→write data process
</specifics>

<deferred>
## Deferred Ideas
- REV-07 experience redesign — awaits the user's screenshot description
- Any CLI output styling changes beyond the data-driven text changes
- Articles beyond the docx's selected 5 (they stay CLI-reachable)
- recharts dependency removal decision (bar/treemap gone — maybe zero remaining usage) → plan-time decision with the gate as proof
</deferred>


---

*Phase: 06-explore-revision*
*Context gathered: 2026-09-23*