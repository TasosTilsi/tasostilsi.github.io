# Phase 11: credentials-panel-revision - Spec

**Gathered:** 2026-09-26T07:45:13.582Z
**Mode:** interviewed

## Requirements

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req REV-21

- **Current:** No Credentials panel exists; articles/certs/presentations are CLI-only surfaces.
- **Target:** The calm tabbed Credentials panel beside the Projects stack, completing the /explore credibility story.
- **Acceptance:** The Credentials panel renders with 3 working tabs (Articles | Certifications | Presentations) beside the Projects stack; each tab lists its curated items as anchor rows (title + date + link); the new presentation featured flag is typed and applied; drawer/counter re-mapped to 5 sections with tests; stale tests renew.

## Boundaries

**In scope:** A combined tabbed 'Credentials' panel (Articles
**Out of scope:** (not specified)

## Constraints

- Calm by design: no stack/carousel machinery, no new motion vocabulary — the panel uses the existing phase-7 hover vocabulary (link underline, icon nudge where present) and the Tabs keyboard pattern (Radix)
- Reuse the existing featured-flag mechanism (certifications/articles precedent); the presentations entry gains the same typed flag in the .d.ts same-commit (R-7)
- The grid rebalance narrows the Projects stack's column — the stack's geometry (arc of cards, centered composition) must remain functional at the narrower width; 375px invariant holds (the Credentials panel stacks below the stack at <md)
- All copy data-driven from the featured collections (EXPLORE-07); every row is a real link (article URLs, cert IDs, presentation link); nothing deleted (full collections stay CLI-reachable)
- The drawer/visited-counter/wizard re-mapping: drawer + counter include Credentials (5 sections, N/5); the tour's step sequence stays unchanged

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
- The grid renders row 3 as [Projects stack | Credentials side-by-side] — the stack narrows within its column (the card stack stays centered and functional in the narrower zone); the Credentials panel carries 3 tabs: Articles | Certifications | Presentations
- The Articles tab lists the 5 featured articles (title + date + external link); the Certifications tab lists the 5 featured certifications (name + date + ID where present); the Presentations tab lists the 1 featured presentation (Allure Reporting + date + link) — every row an anchor, keyboard-accessible
- A NEW featured:true flag on the presentations collection's single entry (Allure Reporting) is typed in .d.ts same-commit (R-7); nothing deleted; the full collections stay CLI-reachable
- The drawer grows a Credentials anchor (5 sections); the visited counter renders N/5 (counter/IO re-mapped); the wizard step sequence stays 6 steps unchanged
- The Credentials panel is CALM: no carousel/stack machinery, no entrance choreography beyond the phase-7 panel stagger; tabs are keyboard-operable (arrow-key tab navigation per Radix Tabs), 44px-equivalent tab targets, rows are links with hover/focus states from the phase-7 vocabulary
- 375px invariant holds on the rebalanced grid (the Credentials panel stacks below the Projects stack at <md); both themes legible; the stale tests renew (the drawer/counter/visited suites to 5 sections)
- SSR/no-JS: the default tab (Articles) renders its 5 rows as real text; tab switching is client-side

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- User (2026-09-24): 'should we do something similar for the articles, certifications and presentations all in one? or maybe selected items from those sections?'
- Q: shape? A: Tabbed panel (Articles | Certifications | Presentations).
- Q: placement? A: Beside the Projects stack (row 3 split).
- Q: item selection? A: Featured-only (~12 items; the 1 existing presentation gets the featured flag).
- Agent recommendation on record: the Credentials panel is CALM (no stack machinery) — text rows are the taste-correct treatment; the user's shape choice (tabs) matches.

---

*Phase: 11-credentials-panel-revision*
*Spec gathered: 2026-09-26*
## Ambiguity Report

**Status:** UNAVAILABLE

_The ambiguity-scoring subagent could not score this draft. Cause: unknown. The SPEC.md is still written; the planner should treat the un-scored clarity dimensions as assumptions and re-clarify them._
