# Phase 11: credentials-panel-revision - Context

**Gathered:** 2026-09-26T07:45:45.113Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** The tabbed Credentials panel beside the Projects stack (3 tabs, featured rows), the presentation featured flag (.d.ts + data), the 5-section drawer/counter re-mapping, stale-test renewal.
**Out of scope:** Carousel/stack machinery for the Credentials panel, new dependencies, data deletions, wizard step changes, CLI/resume/PDF changes, Experience/Projects/About/Skills content changes beyond the grid reflow.
</domain>

<decisions>
## Decisions
### Panel & grid
- **D-01:** Row 3 reflows to [Projects stack | Credentials side-by-side]: the Projects stack's column narrows (~60%), the Credentials panel takes ~40% at md+; <md stacks Credentials below the stack full-width. The stack's centered composition compresses but stays functional (cards re-center in the narrower zone — the cardState geometry is container-derived and adapts).
- **D-02:** The Credentials panel = 3 tabs via the existing shadcn Tabs (Articles | Certifications | Presentations), default tab = Articles; each tab renders its curated items as compact anchor rows (title + date + external link, hover underline, 44px-equivalent row height); the rows are the phase-7 calm vocabulary (no stack/carousel machinery, no new animation).
### Data & flows
- **D-03:** Featured flag on the presentations collection: the single entry (Allure Reporting) gains featured:true — same typed mechanism as certifications/articles (d.ts same-commit, R-7); the flag is trivially the whole set (1 entry) — no selection ambiguity; the data write is covered by the flag's one-line change (the map-content-surfaces draft round collapses to a diff-approval in the plan).
- **D-04:** Flows re-mapped: EXPLORE_SECTIONS grows to 5 (credentials appended) — drawer anchors list 5, visited counter renders N/5 (IO marks the credentials panel), the wizard's step sequence stays 6 steps unchanged (it predates Credentials; walking it marks 4 of 5 — acceptable, pinned), the status-bar counter derives from the sections constant (auto).
### Constraints
- **D-05:** Calm by design (no new motion), zero new dependencies, nothing deleted (full collections CLI-reachable), 375px invariant + both themes + reduced-motion guard coverage, stale-test renewal (drawer/counter/visited suites 4→5 sections), SSR renders the default tab's rows as real text.
### Claude's Discretion
- Tab label wording (Articles / Certifications / Presentations — or Writing / Credentials / Talks)
- Row spacing and date formatting within the compact pattern
- Which panel id the Credentials section takes ('credentials')
- Credentials panel accent (chart-5 is free post-merge — the projects stack lost its chart-5 drawer digit)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Revision targets
- `src/components/explore/sections/projects-section.tsx + projects-stack-stage.tsx — the row-3 sibling the Credentials panel sits beside`
- `src/components/explore/constants.ts — EXPLORE_SECTIONS (5-entry re-map: about, experience, skills, projects, credentials)`
- `src/components/explore/explore-drawer.tsx + explore-status-bar.tsx — anchors + counter to 5 sections`
### Data + primitives
- `src/data/portfolio-main-data.json — articles (5 featured), certifications (5 featured), presentations (1: Allure Reporting, gains featured:true)`
- `src/components/ui/tabs.tsx — shadcn Tabs for the 3-tab panel`
### Locked spec
- `.planning/phases/EXPLORE-11-credentials-panel-revision/EXPLORE-11-credentials-panel-revision-SPEC.md`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- The featured-flag mechanism exists on certifications + articles (phase 6) — presentations gain the same typed flag (one entry: Allure Reporting)
- shadcn Tabs (src/components/ui/tabs.tsx) is installed and unused — first usage; Radix Tabs gives the keyboard pattern (arrow keys, aria-selected) free
- The drawer anchors, visited counter (IO), and wizard scroll targets derive from EXPLORE_SECTIONS — appending the credentials id re-derives them (the 5-entry merge precedent from phase 9)
- The Projects stack's column narrows to ~60% of the row — the stack's centered composition compresses but stays functional (the cardState geometry is container-relative); the Credentials panel takes the remaining ~40%
- The phase-7 panel stagger + hover vocabulary apply to the new panel automatically (in-shell)
- SSG: the default tab (Articles) renders its rows server-side; tab switching is client-side Radix
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
  _Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._
  ### Req REV-21
  - **Current:** No Credentials panel exists; articles/certs/presentations are CLI-only surfaces.
  - **Target:** The calm tabbed Credentials panel beside the Projects stack, completing the /explore credibility story.
  - **Acceptance:** The Credentials panel renders with 3 working tabs (Articles | Certifications | Presentations) beside the Projects stack; each tab lists its curated items as anchor rows (title + date + link); the new presentation featured flag is typed and applied; drawer/counter re-mapped to 5 sections with tests; stale tests renew.
- **Boundaries (SPEC):**
  **In scope:** A combined tabbed 'Credentials' panel (Articles
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
  - The grid renders row 3 as [Projects stack | Credentials side-by-side] — the stack narrows within its column (the card stack stays centered and functional in the narrower zone); the Credentials panel carries 3 tabs: Articles | Certifications | Presentations
  - The Articles tab lists the 5 featured articles (title + date + external link); the Certifications tab lists the 5 featured certifications (name + date + ID where present); the Presentations tab lists the 1 featured presentation (Allure Reporting + date + link) — every row an anchor, keyboard-accessible
  - A NEW featured:true flag on the presentations collection's single entry (Allure Reporting) is typed in .d.ts same-commit (R-7); nothing deleted; the full collections stay CLI-reachable
  - The drawer grows a Credentials anchor (5 sections); the visited counter renders N/5 (counter/IO re-mapped); the wizard step sequence stays 6 steps unchanged
  - The Credentials panel is CALM: no carousel/stack machinery, no entrance choreography beyond the phase-7 panel stagger; tabs are keyboard-operable (arrow-key tab navigation per Radix Tabs), 44px-equivalent tab targets, rows are links with hover/focus states from the phase-7 vocabulary
  - 375px invariant holds on the rebalanced grid (the Credentials panel stacks below the Projects stack at <md); both themes legible; the stale tests renew (the drawer/counter/visited suites to 5 sections)
  - SSR/no-JS: the default tab (Articles) renders its 5 rows as real text; tab switching is client-side
- User: 'should we do something similar for the articles, certifications and presentations all in one? or maybe selected items from those sections?'
- User decisions: tabbed panel / beside Projects / featured-only
</specifics>

<deferred>
## Deferred Ideas
- Presentations beyond the single entry (future talks → the flag mechanism extends)
- Tab state persistence across reloads (default Articles on each load)
- A Credentials step in the wizard tour
</deferred>


---

*Phase: 11-credentials-panel-revision*
*Context gathered: 2026-09-26*