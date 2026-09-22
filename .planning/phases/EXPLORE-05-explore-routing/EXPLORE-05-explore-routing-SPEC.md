# Phase 5: explore-routing - Spec

**Gathered:** 2026-09-22T05:23:56.782Z
**Mode:** interviewed

## Requirements

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req EXPLORE-05

- **Current:** The CLI has zero references to /explore — the welcome message and command set are untouched (island problem, user's original finding).
- **Target:** CLI-side routing: the bracket-styled welcome hyperlink + a new `explore` command, both additive, both routing to /explore in the same tab.
- **Acceptance:** WelcomeMessage renders exactly one added bracket-styled link line ('[ NEW → visual tour: explore ]', accent brackets, 'explore' as the link to /explore, same tab) after the tutorial flow; the `explore` command is in AVAILABLE_COMMANDS + help and routes via the Next router; all existing CLI commands behave identically.

### Req EXPLORE-05b

- **Current:** Only the wizard finish card points to the CLI (phase-4).
- **Target:** /explore-side routing: a small 'Terminal' link in the /explore header bar completing the two-way loop.
- **Acceptance:** Header gains a 44px real-px ghost Terminal link to / with aria-label; the wizard finish card link remains; both navigate same-tab; the right-cluster fits 375px with the title still the only truncating element.

### Req EXPLORE-06

- **Current:** Each phase verified its own breakpoints; no dedicated ultra-wide pass exists and the header cluster now gains a third control.
- **Target:** Responsive polish: a falsifiable breakpoint sweep across 375/768/1440/1920 over /explore and the new entry points, fixing every discovered defect with tests, including right-cluster hardening at 375px.
- **Acceptance:** A committed sweep table covers {375, 768, 1440, 1920} × {/, /explore} with pass/defect per row; every discovered defect fixed with a test; zero horizontal scroll at all four widths; header right-cluster fits 375px.

## Boundaries

**In scope:** Add a non-blocking toggle/link routing visitors between the CLI (/) and /explore, and polish responsive behaviour across breakpoints.
**Out of scope:** (not specified)

## Constraints

- Additive-only CLI changes: the `explore` command + welcome-message hyperlink are additions; no existing command, theme, achievement, easter egg, or output is modified or removed; /resume is not edited at all
- Navigation is same-tab via Next's router (no window.location hacks); no new dependencies; no changes to panels/grid/chrome/visualizations/wizard
- The /explore header right-cluster must keep every target at 44px real px (the ≤640px rem-shrink trap) and fit 375px together with the new Terminal link
- The breakpoint sweep is falsifiable: the committed table (breakpoint × route rows, pass/defect) plus tests for each fix — an unfalsifiable 'looks fine' sweep does not satisfy this phase
- All copy is chrome; the welcome link + command + header link use locked phrases; no invented portfolio content (EXPLORE-07)

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all three routes still export statically
- The CLI welcome message renders exactly one added bracket-styled link line — format pinned: `[ NEW → visual tour: explore ]` rendered as a single line in JetBrains Mono with brackets + arrow in `text-accent` and the word `explore` as the clickable link to /explore (same tab) — placed after the tutorial box section of the welcome flow; the rest of the welcome message renders unchanged
- A new `explore` CLI command exists: added to AVAILABLE_COMMANDS, listed in the help output, and executing it navigates to /explore via the Next router in the same tab
- /explore header gains exactly one 'Terminal' ghost link (44px real-px touch target, lucide Terminal icon, aria-label 'Open the terminal') navigating to / in the same tab
- The two routes form a complete two-way loop: CLI → /explore (welcome link + command) and /explore → CLI (header link + wizard finish card)
- The resume at /resume is byte-untouched by this phase
- A breakpoint-sweep table is committed to the phase artefacts with one row per {breakpoint × route} for breakpoints {375, 768, 1440, 1920} × routes {/, /explore} — each row records pass or the defect found; every discovered defect is fixed and its fix carries a test; zero horizontal scroll holds at all four widths
- The /explore header right-cluster (theme toggle, Tour button, Terminal link) fits 375px with all three targets at 44px real px and the truncating title still the only element that truncates
- No new dependencies; the CLI's existing commands, history, themes, achievements, and easter eggs behave exactly as before (welcome message + command list are additive only)

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- Q: CLI-side entry? A (user custom): 'command and hyperlink in the welcome message' — new `explore` command + visible hyperlink in WelcomeMessage.
- Q: /explore side? A (user): Header link (ghost, 44px, Terminal icon).
- Q: button style? A (user): CLI-bracket banner aesthetic (applied to the welcome-message link line: bracketed, mono, accent).
- Q: polish scope? A (user): Breakpoint sweep + fixes (incl. header right-cluster hardening at 375px).
- Re-seal note: ambiguity 0.206 → gate OVERRUN on the first seal; this version pins the exact link-line format and replaces the open-ended sweep with a committed per-breakpoint×route table to bring the score under 0.20.

---

*Phase: 05-explore-routing*
*Spec gathered: 2026-09-22*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.84 | 0.75 | PASS |
| Boundary Clarity | 0.78 | 0.70 | PASS |
| Constraint Clarity | 0.88 | 0.65 | PASS |
| Acceptance Criteria | 0.90 | 0.70 | PASS |

**Overall Ambiguity:** 0.155  (max 0.2)

**Gate:** PASSING — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
