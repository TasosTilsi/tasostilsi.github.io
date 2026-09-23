# Phase 6: explore-revision - Spec

**Gathered:** 2026-09-23T05:46:25.174Z
**Mode:** interviewed

## Requirements

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

## Boundaries

**In scope:** Refresh the portfolio data to the user's current resume (docx) as source of truth and revise the visual surfaces accordingly — /resume + PDF rebuilt to the docx structure, About+Contact merged, skills as competency + proof cards, projects year-grid calendar — per the user's pre-ship revision list.
**Out of scope:** (not specified)

## Constraints

- The docx is the content source of truth; the data file is the single store — every rendered string still comes from portfolio-main-data.json (EXPLORE-07 survives); the extracted docx text lives in .planning/phases/EXPLORE-06-explore-revision/ as the reference artefact
- Nothing deleted: old projects, full cert list (41), all articles stay in the data and reachable via the CLI; curation happens via featured/selected flags and surface-level filters — map-content-surfaces rules apply (enumerate consumers, verify field coverage per surface, draft data edits for approval before writing)
- The map-content-surfaces skill governs the data refresh: enumerate every consumer (CLI outputs, resume modal, /resume, PDF template, wizard intro, metadata/schema in layout.tsx), flag changes that won't propagate, verify external entities against primary sources (npm downloads count, article links) before drafting
- About+Contact merge and the grid rebalance must keep the 375px no-horizontal-scroll invariant, 44px touch targets, and the phase-1 chrome/tokens; the merged panel keeps the About accent
- Competency cards + year-grid calendar derive every number/date from the refreshed data (EXPLORE-07); the removed bar chart and treemap take their tests with them (stale-test discipline)
- No new dependencies; recharts stays only where used (bar chart/treemap removed — Gantt already CSS); reduced-motion and theme invariants (incl. the scoped light-theme chart overrides) re-audited for the new visuals

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
- Data refresh on record with a before/after diff: about.title = 'Test Automation Architect | Principal Test Automation Engineer'; new summary; 8 core-competency clusters with proof lines; experience responsibilities replaced by the docx's quantified bullets; Clarif-AI + DeepIndex entries carry the docx value lines (400+ weekly downloads, npm link, clarif-ai.net); certifications data gains featured flags (ISTQB + Anthropic Academy featured; full 41 intact); selected-writing curation marked on the 5 docx articles; nothing deleted from the CLI's reach
- The /resume page renders the docx structure in order: SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE (quantified bullets per role) → PROJECTS (deepindex, Clarif-AI first) → EDUCATION → CERTIFICATIONS (curated) → SELECTED WRITING (the 5 docx articles) — print-optimized and verified at print width
- The PDF export (npm run build:resume → public/resume-export.html) renders the same docx structure from the refreshed data, replacing the hardcoded Languages/Testing/DevOps skills and adding the projects section
- About + Contact merge into one panel on /explore: the merged panel contains the about description AND all contact links + the 'Full resume →' link; the grid rebalances (4 panels) with no wide empty space at 768/1440
- The Skills panel shows competency + proof cards (8 clusters × one-line quantified proof from the refreshed data) and contains NO bar chart and NO treemap (both removed with their tests updated/removed accordingly)
- The Projects panel shows the year-grid bars calendar (year columns 2016→present, project bars spanning their active months, derived from project dates in the data) above the existing cards
- The CLI welcome banner, typing lines, and title strings reflect the new branding wherever about.title is rendered; all existing CLI commands still work; the explore header title updates automatically via the data
- REV-07 (experience showcase redesign) is explicitly deferred pending the user's screenshot description — no speculative redesign ships in its place

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- User (image + change list, 2026-09-22): 'I didn't like the experience showcase... something like this inside the box presenting the timeline per company I worked on and my responsibilities' — REV-07, description pending.
- User: 'The about section is too big div and has wide empty space. maybe we might use that empty space and merge in it the contact section.' — REV-04.
- User: 'the treemap and the skills chart are not showing something valuable. we need to reconsider how those might visualized better.' — REV-05; user picked option B: competency + proof cards.
- User: 'the projects are ok, maybe we need to visualize something more in there. or bring the gantt chart in there. but it better be like a calendar not like the one that we have currently in the experience section.' — REV-06; user picked year-grid bars.
- User: 'My resume need to change and be like this to showcase more my experience and what value I bring to the businesses' + docx — REV-01/02/03.
- Q: data refresh scope? A: Full refresh, all surfaces (user).
- Q: skills viz? A: Competency + proof cards (user, from my 3 proposals).
- Q: resume scope? A: Rebuild to docx structure (user).
- Q: projects scope? A: Enrich top 2, keep rest (user).
- Q: PDF export? A: Rebuild PDF too (user).
- Q: certs/writing reconciliation? A: Curated on surfaces, full in CLI (user).
- Q: timeline screenshot? A (user): 'I will describe it later' — REV-07 deferred; phase 6 proceeds without it.

---

*Phase: 06-explore-revision*
*Spec gathered: 2026-09-23*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.85 | 0.75 | PASS |
| Boundary Clarity | 0.72 | 0.70 | PASS |
| Constraint Clarity | 0.85 | 0.65 | PASS |
| Acceptance Criteria | 0.85 | 0.70 | PASS |

**Overall Ambiguity:** 0.182  (max 0.2)

**Gate:** PASSING — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
