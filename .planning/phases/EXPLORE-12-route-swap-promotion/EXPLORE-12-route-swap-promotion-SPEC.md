# Phase 12: route-swap-promotion - Spec

**Gathered:** 2026-10-02T16:23:30.271Z
**Mode:** interviewed

## Requirements

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req REV-22

- **Current:** / serves the CLI terminal; /explore serves the visual experience; links point across accordingly; the breadcrumb reads 'guest@tasostilsi:~/explore'.
- **Target:** The route swap: / = the explore visual experience (primary landing), /cli = the CLI terminal, /explore deleted, breadcrumb 'guest@tasostilsi:~', the status-bar 'cli' new-tab hyperlink, all cross-surface links + tests + sweep renewed.
- **Acceptance:** The export emits index.html = the explore experience + /cli = the CLI terminal; NO /explore route exists; all cross-surface links (CLI welcome link, explore command, header Terminal link, wizard finish card, status-bar cli chip) verified navigable via the composite test; metadata/sweep/suites renewed.

## Boundaries

**In scope:** The explore experience is promoted to the primary landing: / serves the visual experience, /cli serves the CLI terminal, /explore is deleted, the breadcrumb becomes ~, cross-surface links rewire, and the status bar gains a new-tab cli hyperlink.
**Out of scope:** (not specified)

## Constraints

- The CLI keeps its (main)-style terminal layout (h-screen overflow-hidden) at /cli; the explore experience keeps its shell layout at /; both layouts move with their pages
- Zero new dependencies; no redirect machinery (the old /explore is deleted outright); GITHUB Pages serves out/ — index.html = the explore experience
- All behavioural invariants survive unchanged: arc/stack/credentials/drawer/wizard/counter flows and all CLI commands — only route paths and link targets change (a path-rename refactor, verified by the existing suites renewed to the new names)
- The status-bar 'cli' hyperlink is the only new element: small chrome chip in the breadcrumb row, target=_blank, rel=noopener, 44px-equivalent touch area, opens /cli in a new tab (user requirement: 'hyperlink opening a new tab for the user to explore the cli version')
- Breadcrumb becomes 'guest@tasostilsi:~' exactly (user decision); the CLI's own headers/banners unchanged
- Draft→approve not needed (no personal copy); cross-surface-links discipline governs: both directions rewired in the same commit set + the composite two-direction test locked

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; the static export emits: index.html = the explore experience, cli.html or /cli/index.html = the CLI terminal, and NO explore.html exists
- Cross-surface links verified rewired (grep + export checks): the CLI welcome hyperlink + the `explore` command navigate to / (the explore home); the header Terminal link and the wizard finish card navigate to /cli; the status bar gains a 'cli' hyperlink opening /cli in a NEW tab (target=_blank rel=noopener)
- The status-bar breadcrumb renders 'guest@tasostilsi:~'; the CLI's own surfaces keep their identity strings unchanged
- Metadata: the home (explore page) carries its own data-driven metadata (the explore experience branding); the /cli page carries its own CLI-branded metadata; the root layout's JSON-LD/schema URLs stay correct
- No redirect machinery needed (GitHub Pages static): the old /explore path simply no longer exists
- The sweep table and route-existence tests renew: rows cover {/, /cli} (replacing /explore), the two-way loop composite test asserts CLI→/→CLI; every discovered defect fixed with a test
- The CLI's behaviour is functionally unchanged (commands/history/themes/achievements); the explore page's behaviour is functionally unchanged (arc, stack, credentials, drawer, wizard, counter) — only paths and link targets moved
- No new dependencies; 375px invariant holds on both new paths

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- User (2026-09-25, promote decision): 'make the /explore to be the landing page in / and the home cli that is now the / to become /cli paths' — overrides the add-alongside assumption-delta on record.
- Q: /explore fate? A: deleted ('the /explore is deleted as it is not live in github pages yet').
- Q: breadcrumb? A: option 2 (~) + 'we could have a hyperlink opening a new tab for the user to explore the cli version of the site' — the status-bar cli link (new tab).

---

*Phase: 12-route-swap-promotion*
*Spec gathered: 2026-10-02*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.90 | 0.75 | PASS |
| Boundary Clarity | 0.75 | 0.70 | PASS |
| Constraint Clarity | 0.90 | 0.65 | PASS |
| Acceptance Criteria | 0.92 | 0.70 | PASS |

**Overall Ambiguity:** 0.133  (max 0.2)

**Gate:** PASSING — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
