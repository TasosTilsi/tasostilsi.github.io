# Phase 5: explore-routing - Spec

**Gathered:** 2026-09-22T05:23:20.327Z
**Mode:** interviewed

## Requirements

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req EXPLORE-05

- **Current:** The CLI has zero references to /explore — the welcome message and command set are untouched (island problem, user's original finding).
- **Target:** CLI-side routing: a visible bracket-styled hyperlink in the CLI welcome message + a new `explore` command, both routing to /explore in the same tab, additive only.
- **Acceptance:** WelcomeMessage renders the bracket-styled link line (mono, brackets, accent border/brackets per the banner aesthetic) pointing to /explore, same tab; the new `explore` command appears in AVAILABLE_COMMANDS + help and navigates to /explore; all existing CLI commands behave identically.

### Req EXPLORE-05b

- **Current:** Only the wizard finish card points to the CLI (phase-4).
- **Target:** /explore-side routing: a small 'Terminal' link in the /explore header bar completing the two-way loop.
- **Acceptance:** Header gains a 44px real-px ghost Terminal link to /; the wizard finish card link remains; both navigate same-tab; the header right-cluster still fits 375px.

### Req EXPLORE-06

- **Current:** Each phase verified its own breakpoints; no dedicated ultra-wide pass exists and the header cluster now gains a third control.
- **Target:** Responsive polish: a breakpoint sweep across 375/768/1440/ultra-wide over /explore and the new entry points, fixing any overflow/spacing/layout defects found, including right-cluster hardening at 375px.
- **Acceptance:** Sweep evidence on record for 375/768/1440/ultra-wide covering both routes and new entry points; every discovered defect fixed with a test; no horizontal scroll at any breakpoint; header right-cluster fits 375px.

## Boundaries

**In scope:** Add a non-blocking toggle/link routing visitors between the CLI (/) and /explore, and polish responsive behaviour across breakpoints.
**Out of scope:** (not specified)

## Constraints

- Additive-only CLI changes: the `explore` command + welcome-message hyperlink are additions; no existing command, theme, achievement, easter egg, or output is modified or removed; /resume is not edited at all
- Navigation is same-tab via Next's router (no window.location hacks); no new dependencies; no changes to panels/grid/chrome/visualizations/wizard
- The /explore header right-cluster must keep every target at 44px real px (the ≤640px rem-shrink trap) and fit 375px together with the new Terminal link
- Breakpoint sweep covers 375 / 768 / 1440 / ultra-wide on both routes plus the new entry points; discovered defects are fixed and their fixes carry tests
- All copy is chrome; the welcome link + command + header link use locked phrases; no invented portfolio content (EXPLORE-07)

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all three routes still export statically
- The CLI welcome message renders a visible, bracket-styled hyperlink line pointing to /explore (CLI aesthetic: mono, brackets, accent) — clicking navigates to /explore in the same tab; the welcome message otherwise renders unchanged
- A new `explore` CLI command exists: listed in AVAILABLE_COMMANDS and the help output, and executing it navigates to /explore in the same tab
- /explore header gains a small 'Terminal' link (ghost, 44px real-px touch target, lucide Terminal icon) navigating back to / in the same tab
- The two routes form a complete non-blocking two-way loop: CLI → /explore (welcome link + command) and /explore → CLI (header link + wizard finish card)
- The resume at /resume remains fully intact and untouched by this phase
- Breakpoint sweep executed and on record: /explore and both new entry points verified at 375, 768, 1440 and ultra-wide; any overflow/spacing/layout defects found are fixed; the /explore header right-cluster (theme, tour, terminal) fits at 375px with all 44px targets intact
- No new dependencies; the CLI's existing commands, history, themes, achievements, and easter eggs behave exactly as before (the welcome message and command list are additive changes only)

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- Q: CLI-side entry? A (user custom): 'command and hyperlink in the welcome message' — new `explore` command + visible hyperlink in WelcomeMessage.
- Q: /explore side? A (user): Header link (ghost, 44px, Terminal icon).
- Q: button style? A (user): CLI-bracket banner aesthetic (applied to the welcome-message link line).
- Q: polish scope? A (user): Breakpoint sweep + fixes (incl. header right-cluster hardening at 375px).

---

*Phase: 05-explore-routing*
*Spec gathered: 2026-09-22*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.78 | 0.75 | PASS |
| Boundary Clarity | 0.74 | 0.70 | PASS |
| Constraint Clarity | 0.90 | 0.65 | PASS |
| Acceptance Criteria | 0.78 | 0.70 | PASS |

**Overall Ambiguity:** 0.206  (max 0.2)

**Gate:** OVERRUN — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
