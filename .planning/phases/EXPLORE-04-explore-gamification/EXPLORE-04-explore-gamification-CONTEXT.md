# Phase 4: explore-gamification - Context

**Gathered:** 2026-09-21T21:36:58.191Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Spotlight wizard tour on /explore: 7-step locked sequence with box-shadow cut-out overlay, scroll-settle measuring, auto-placed summary cards (bottom-dock fallback at 375px), manual Next/Back + dots + step counter, X/ESC dismiss; auto-open once + header Tour button; live N/5 section counter wired from anchors/scroll/wizard with localStorage persistence; finish card linking to the CLI.
**Out of scope:** Spin-the-wheel, achievements/easter-egg systems, milestone toasts, any change to panels/grid/chrome/visualizations, CLI command prefill (phase 5), new dependencies, edits to CLI, /resume, or data files, GA event wiring.
</domain>

<decisions>
## Decisions
### Spotlight mechanics
- **D-01:** Spotlight overlay = one fixed full-viewport dim layer with a cut-out over the active panel, built via the box-shadow technique: an absolutely-positioned hole element (rounded corners, small padding around the measured panel rect) with `box-shadow: 0 0 0 100vw rgba(0,0,0,0.7)` — one element, no SVG mask, pointer-events pass through the hole to the real panel.
- **D-02:** Step sequence locked: Welcome → About → Experience → Skills → Projects → Contact → finish card (7 steps). Each content step calls scrollIntoView({behavior:'smooth'}) on its panel, waits for scroll to settle (scrollend event with a timeout fallback), THEN measures the rect and renders the cut-out — no flicker, no mid-scroll mis-position. Arriving at a section marks it visited.
- **D-03:** Summary card auto-placement (user answer): below the target when space allows, above when not; at 375px (or whenever neither fits) it docks as a fixed bottom card. Card anatomy: section label (EXPLORE_SECTIONS) as heading, 1-2 sentence chrome summary, controls row (Back | dots + 'Step N of 7' | Next or Finish), X dismiss. Fully manual pacing — no timers (user decision).
- **D-04:** Finish card: congratulation chrome line + internal <Link href="/"> pointing to the CLI + one-line hint that the terminal holds the full information (e.g. 'the full story lives in the terminal — start with help'). Sets the completed flag.
### Triggers & persistence
- **D-05:** Auto-open exactly once for first-time visitors: explore-scoped localStorage flag `portfolio-explore-tour` ('seen' on any dismissal, 'completed' on finish) — disjoint from all CLI keys; auto-open suppressed once any flag exists; header 'Tour' button (44px px-based ghost, lucide Compass icon) re-opens at step 1 for everyone.
- **D-06:** Live section counter: explore-scoped key `portfolio-explore-visited` (JSON array of visited section ids); marking via drawer anchor clicks, IntersectionObserver on panels (root = the <main> scroll container, ~50% visibility), and wizard-step arrivals; the status bar subscribes and renders 'N/5 sections visited' live; persists across reloads; CLI keys and counter untouched.
### Constraints
- **D-08:** Zero new dependencies; all new components under src/components/explore/; SSG-safe (overlay renders client-only, measured at activation); reduced motion via the existing CSS guard; 375px no-horizontal-scroll invariant preserved; CLI + /resume byte-untouched; no spin-the-wheel, no achievements system (skipped by user).
### Claude's Discretion
- Exact chrome wording of welcome/step/finish summaries (playful-chrome register, professional)
- Compass vs alternative lucide icon for the Tour button
- Dots vs step-counter visual weighting in the controls row
- Spotlight dim color/opacity and cut-out padding (12-16px ring)
- Welcome card content (60-second-tour framing)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Augment targets
- `src/components/explore/explore-status-bar.tsx — the static '0/5 sections visited' counter to wire live (phase-1 D-03 deferral)`
- `src/components/explore/explore-header.tsx — gains the 44px Tour button beside theme + drawer toggles`
- `src/components/explore/constants.ts — EXPLORE_SECTIONS (names/ids/order) reused for wizard steps`
### Storage isolation
- `src/components/explore/constants.ts — explore-scoped localStorage key precedent (EXPLORE_THEME_STORAGE_KEY, disjoint from CLI)`
- `src/components/cli/constants.ts — CLI keys ('portfolio-theme', 'portfolioCliFoundEasterEggs') that must stay disjoint and untouched`
### Primitives + locked spec
- `src/components/ui/dialog.tsx / sheet.tsx — Radix primitives for focus-trap/ESC patterns`
- `.planning/phases/EXPLORE-04-explore-gamification/EXPLORE-04-explore-gamification-SPEC.md`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- The main scroll container is <main> inside ExploreShell — scroll position and IntersectionObserver root must target it, not the window
- Panels carry stable DOM ids (about…contact) and aria-labels from PanelShell — the wizard targets these ids directly
- The drawer's anchor navigation (onClick scroll + href) already exists — visited-marking must hook the same path the drawer uses, not duplicate it
- Reduced-motion CSS guard (globals.css:573-586) suppresses transitions inside .explore-shell — spotlight cut-out movement should avoid relying on animated transitions
- scrollIntoView smooth-scroll exists via body scroll-behavior — scroll-settle detection needs scrollend event with rAF/timeout fallback (Safari lacks scrollend)
- GA G-TLWL6FDZE7 in root layout; no wizard-funnel tracking in this phase
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
  _Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._
  ### Req EXPLORE-04
  - **Current:** No tour exists on /explore.
  - **Target:** A step-by-step spotlight wizard tour (Welcome → About → Experience → Skills → Projects → Contact → finish card) — each step scrolls to and highlights the real panel with a short plain-language summary card — built with existing primitives (Radix Dialog/Sheet patterns), Next/Back navigation, progress indicator, dismissible at any step.
  - **Acceptance:** Overlay dims the page except the active panel; the summary card positions adjacent to the highlighted panel (never off-screen at 375px); Next/Back + step counter + progress dots work; X/ESC dismiss mid-tour without blocking the page.
  ### Req EXPLORE-04b
  - **Current:** No tour entry point exists.
  - **Target:** Tour trigger: auto-open once for first-time visitors + a 'Tour' button in the header bar (44px, ghost, px-based per phase-1 trap) that re-opens the wizard.
  - **Acceptance:** First visit auto-opens the tour exactly once (explore-scoped localStorage flag); dismissal marks 'seen'; the header Tour button re-opens the tour at any time for any visitor.
  ### Req EXPLORE-04c
  - **Current:** Status bar shows a static '0/5 sections visited' (phase-1 D-03 placeholder).
  - **Target:** Wire the status-bar section counter live: visiting a section (drawer anchor, scroll, or wizard step) marks it visited; the counter displays 'N/5 sections visited' with real N, persisted in localStorage.
  - **Acceptance:** Counter shows real N/5 from anchor clicks, manual scroll-into-view, and wizard visits; persists across reloads via an explore-scoped localStorage key; the CLI counter/keys remain disjoint and untouched.
  ### Req EXPLORE-04d
  - **Current:** No cross-surface pointer exists (phase-2 decided pointers stay static text).
  - **Target:** The wizard's finish card points to the CLI at / for the full information — an internal link + one-line hint, per the user's 'point for more and full information if someone wants to go in the cli interface'.
  - **Acceptance:** The finish card renders an internal link to / with a one-line chrome hint that the terminal holds the full information; clicking navigates in the same tab; the link is the only new cross-surface pointer.
- **Boundaries (SPEC):**
  **In scope:** Add light gamification to /explore — a guided spin-the-wheel tour picker, exploration progress/achievements, and light humor in the copy.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; /explore still exports statically
  - A spotlight overlay tour exists with the locked step sequence: Welcome → About → Experience → Skills → Projects → Contact → finish card; each content step smooth-scrolls to its real panel, dims the rest of the page, and shows a short plain-language summary card near the target
  - Wizard controls: Next / Back buttons, progress dots or step counter, dismiss anytime via X and ESC; finishing or dismissing never blocks the page
  - Auto-opens once for first-time visitors (localStorage explore-scoped flag, disjoint from CLI keys); a 'Tour' button in the header re-opens it for returning visitors
  - The finish card points visitors to the CLI at / for the full information (internal link + one-line hint) — the only cross-surface pointer in this phase
  - The status-bar counter becomes LIVE: sections visited update from drawer anchors, manual scrolling, and wizard steps; count persists across reloads via an explore-scoped localStorage key; renders as 'N/5 sections visited'
  - No separate achievements/easter-egg system is added; no spin-the-wheel exists; the CLI and /resume remain untouched
  - Spotlight step cards are keyboard-operable (focus lands on the card, focus is not lost behind the overlay); reduced-motion suppresses transition animations via the existing CSS guard; 375px: no horizontal scroll, card fits and is touch-usable
  - All wizard copy is chrome (structural labels + short summaries); section names come from EXPLORE_SECTIONS; no portfolio content invented beyond one-line orientation text
- User: 'should we skip this? and rethink it?' (wheel + achievements dropped)
- User: 'we should create a step by step wizard to showcase my website and portfolio and in the end of it we should point for more and full information if someone wants to go in the cli interface'
- User: Spotlight overlay tour (scrolls to the real panel and highlights it)
- User: Auto once + button (auto-opens for first-time visitors, header Tour button re-opens)
- User: Live counter only (no separate achievements)
- User: Auto-place card + phone fallback; fully manual pacing
</specifics>

<deferred>
## Deferred Ideas
- CLI command prefill / deep-linking the tour end-card into a CLI command → phase 5 (explore-routing)
- Milestone toasts / achievements — dropped per user (live counter only)
- Spin-the-wheel — dropped per user
- Wizard funnel analytics → not in this phase (GA wiring is a separate concern)
</deferred>


---

*Phase: 04-explore-gamification*
*Context gathered: 2026-09-21*