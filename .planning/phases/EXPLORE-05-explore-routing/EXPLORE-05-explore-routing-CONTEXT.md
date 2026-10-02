# Phase 5: explore-routing - Context

**Gathered:** 2026-09-22T05:24:43.276Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Two-way routing: bracket-styled welcome hyperlink + `explore` command on the CLI side; header Terminal link on /explore; falsifiable breakpoint sweep table (375/768/1440/1920 × /,/explore) with every defect fixed and tested; header right-cluster hardening at 375px.
**Out of scope:** CLI command prefill, GA wiring, any panel/grid/visualization/wizard changes, new dependencies, edits to /resume or data files, removal/modification of any existing CLI behaviour.
</domain>

<decisions>
## Decisions
### CLI-side routing
- **D-01:** Welcome link line pinned: exactly `[ NEW → visual tour: explore ]` — one line, JetBrains Mono, brackets + arrow in text-accent, the token `explore` rendered as the clickable link (Next <Link href="/explore">, same tab); placed after the tutorial box in WelcomeMessage; the rest of the welcome renders byte-identical.
- **D-02:** New `explore` command: appended to AVAILABLE_COMMANDS (auto-listed in help via the existing derivation — planner verifies the help/AdvancedHelpOutput description map gets a matching entry); handler case in processCommand prints one chrome line (e.g. '[ opening the visual tour... ]') then navigates via useRouter().push('/explore') — same tab, no window.location.
### Explore-side routing
- **D-03:** Header Terminal link: 44px real-px ghost button, lucide Terminal icon, aria-label 'Open the terminal', placed rightmost in the right cluster (after theme + drawer + tour), Next <Link href="/"> same tab; wizard finish card link unchanged.
### Responsive sweep
- **D-04:** Falsifiable sweep: a committed table in the phase artefacts with one row per {375, 768, 1440, 1920} × {/, /explore}; each row = a programmatic/static check (grid/class/width math in tests where possible) or a manual-visual row marked for the user's final pass; every discovered defect fixed with a test; right-cluster math verified in a test (3×44px + gaps ≤ available width at 375px).
### Constraints
- **D-05:** Additive-only CLI edits (welcome link line, AVAILABLE_COMMANDS entry, command handler case, help description entry); /resume byte-untouched; zero new dependencies; all copy chrome (EXPLORE-07); existing commands/themes/achievements/easter-eggs untouched.
### Claude's Discretion
- Exact welcome-link line position after the tutorial box
- Command output chrome wording
- Terminal-link icon size details within the ghost recipe
- Sweep table row granularity (component-level checks per row)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### CLI augment targets
- `src/components/cli/outputs/WelcomeMessage.tsx — gains the bracket-styled link line after the tutorial box`
- `src/components/cli/constants.ts — AVAILABLE_COMMANDS list to extend`
- `src/components/cli/TerminalInterface.tsx — processCommand switch gains the explore case`
### Explore augment targets
- `src/components/explore/explore-header.tsx — right-cluster gains the Terminal link (theme, drawer, tour order verified at :33-84)`
- `src/components/explore/explore-tour.tsx — finish card link already points to / (phase-4)`
### Locked spec + typing constraint
- `.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SPEC.md`
- `src/components/cli/TypingEffect.tsx — welcome copy renders after typing; the link line must not break the typing flow`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- TerminalInterface is a 'use client' component — useRouter from next/navigation is available for same-tab navigation without window.location hacks
- The help output derives from AVAILABLE_COMMANDS — adding 'explore' auto-lists it; the help/AdvancedHelpOutput components may render command descriptions from a map that needs a matching entry (planner verifies during plan)
- The CLI is NOT server-component-bound: TerminalInterface mounts client-only via dynamic import ssr:false — router navigation inside the command handler is safe
- The explore header right-cluster currently: theme toggle → drawer toggle; phase-4 added Tour → cluster is now 3× 44px buttons; adding Terminal makes 4× 44px + gaps ≈ 148px — title (flex-1 min-w-0) truncates; glyph dots (30px) unaffected; fits 375px but the sweep must verify
- WelcomeMessage typing flow: TypingEffect animates two lines; the new link line renders as static content below the tutorial box — no interaction with the typing animation
- Reduced-motion CSS guard covers .explore-shell; CLI side has its own theme scoping — the bracket link uses CLI tokens (accent), not explore tokens
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
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
- **Boundaries (SPEC):**
  **In scope:** Add a non-blocking toggle/link routing visitors between the CLI (/) and /explore, and polish responsive behaviour across breakpoints.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all three routes still export statically
  - The CLI welcome message renders exactly one added bracket-styled link line — format pinned: `[ NEW → visual tour: explore ]` rendered as a single line in JetBrains Mono with brackets + arrow in `text-accent` and the word `explore` as the clickable link to /explore (same tab) — placed after the tutorial box section of the welcome flow; the rest of the welcome message renders unchanged
  - A new `explore` CLI command exists: added to AVAILABLE_COMMANDS, listed in the help output, and executing it navigates to /explore via the Next router in the same tab
  - /explore header gains exactly one 'Terminal' ghost link (44px real-px touch target, lucide Terminal icon, aria-label 'Open the terminal') navigating to / in the same tab
  - The two routes form a complete two-way loop: CLI → /explore (welcome link + command) and /explore → CLI (header link + wizard finish card)
  - The resume at /resume is byte-untouched by this phase
  - A breakpoint-sweep table is committed to the phase artefacts with one row per {breakpoint × route} for breakpoints {375, 768, 1440, 1920} × routes {/, /explore} — each row records pass or the defect found; every discovered defect is fixed and its fix carries a test; zero horizontal scroll holds at all four widths
  - The /explore header right-cluster (theme toggle, Tour button, Terminal link) fits 375px with all three targets at 44px real px and the truncating title still the only element that truncates
  - No new dependencies; the CLI's existing commands, history, themes, achievements, and easter eggs behave exactly as before (welcome message + command list are additive only)
- User: 'command and hyperlink in the welcome message' (CLI side)
- User: header link for /explore side (ghost, 44px, Terminal icon)
- User: CLI-bracket banner aesthetic for the visible link
- User: breakpoint sweep + fixes, header right-cluster hardening at 375px
- Phase-1 finding (on record): '/explore is an island — no one will know' — this phase closes it
</specifics>

<deferred>
## Deferred Ideas
- CLI command prefill / deep-linking (e.g. /explore?tour=auto) → not this phase
- GA cross-surface navigation events → separate concern
- Explore-side pointer to /resume beyond the Contact panel link (already exists since phase 2)
</deferred>


---

*Phase: 05-explore-routing*
*Context gathered: 2026-09-22*