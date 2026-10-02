# Phase 8: experience-showcase-revision - Context

**Gathered:** 2026-09-24T12:24:19.074Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Full-width Experience panel with the sticky-range semicircular timeline (SVG arc + cos/sin-positioned year markers + active-role content column), timelineProgress hook + pure derivation functions + tests, grid rebalance, keyboard/reduced-motion/mobile contracts, stale-test renewal.
**Out of scope:** Data-file changes, new dependencies, CLI/resume/PDF changes, wizard/drawer/counter flow changes beyond the scroll-target check, wheel-event hijacking, the arc for non-tech roles, education/cert extensions on the arc.
</domain>

<decisions>
## Decisions
### Stage & layout
- **D-01:** Full-width stage (user AAA): the Experience panel spans both grid columns at md+ — [EXPERIENCE full-width] row + [About+Contact | Skills] row below; at <md everything stacks 1-col. The stage inside the panel: arc zone ~40% left, content ~60% right at md+.
- **D-02:** Scroll mechanism = sticky-range progress (pinned, per the re-seal): the panel wrapper extends over an extended scroll range (≈300vh-equivalent at md+); the stage pins via position:sticky; timelineProgress = scroll fraction through the wrapper range — NO wheel/touch event hijacking; normal scrolling flows in at the range ends naturally. Keyboard buttons/arrows step roles directly (set progress to the role's band).
- **D-03:** Arc construction: an SVG arc path (thin stroke, border token color, aria-hidden) with the year markers positioned via the cos/sin math as absolutely-positioned real-text elements; marker label = role START YEAR derived from the existing duration parser patterns ('2023', '2022', '2019' — data-derived, no invented labels); active marker = darkest/largest with a filled dot; inactive = muted/smaller.
### Interaction & motion
- **D-04:** timelineProgress hook (typed, pure derivation functions unit-testable): scroll fraction → progress → activeIndex, marker angles/opacity/scale, content interpolation. Content transitions = Editorial-calm transform/opacity (200-280ms soft ease-out — the phase-7 vocabulary) driven by the progress delta; NO instant text swaps. Reduced motion: no spatial movement — markers/content swap with opacity-only transitions, arc static at the active role's position; keyboard navigation unaffected.
- **D-05:** Interaction-quality contract (REV-13): ArrowUp/ArrowDown or Prev/Next buttons step roles; the content is real text (role/company/dates/location/bullets readable by AT); listeners (scroll/rAF loop) cleaned up on unmount; transform-based writes, no re-render loops; mobile (<md) collapses to a compact vertical form — year markers + role content stacked (no cramped arc), same content hierarchy.
### Content & data
- **D-06:** Roles = the 3 docx tech roles via the existing isTechRelated filter; content from the refreshed quantified bullets; the brief's Experience shape maps onto existing fields (role→title, company, duration parsed, location, responsibilities→achievements) — zero data-file changes expected (planner verifies; any missing field surfaces at plan time).
- **D-07:** SSG/export: role 1 (Chubb) renders as real static text (title/company/dates/location/bullets) in out/explore.html — the interaction activates on hydration. Stale text-timeline tests rewritten/removed per the replacement discipline (stale-test triage).
### Claude's Discretion
- Exact sticky-range length (≈300vh-equivalent — tuned so 3 roles feel unhurried)
- Arc radius/center offsets within the 40% zone at md+
- Marker typography scale (active vs inactive deltas)
- Content column padding/spacing within the 60% zone
- SVG stroke width/dash detail
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Revision target + data
- `src/components/explore/sections/experience-section.tsx — the panel body this phase replaces (rail+dots timeline)`
- `src/data/portfolio-main-data.json — experience entries with the refreshed docx bullets (Chubb 6, Upstream 3, Netcompany 4), duration strings, isTechRelated filter (3 roles)`
- `src/data/portfolio-main-data.d.ts — PortfolioData types`
### Grid + flow interplay
- `src/components/explore/explore-panels.tsx — grid to rebalance (Experience full-width)`
- `src/components/explore/explore-tour.tsx — the EXPERIENCE step must still scroll to + mark the panel`
- `src/components/explore/explore-status-bar.tsx — visited counter unchanged`
### Spec + motion rail + parsing precedent
- `.planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-SPEC.md — the user's brief quoted in full`
- `src/app/globals.css:572-593 — reduced-motion guard (spatial transitions suppressed)`
- `src/components/explore/viz-data.ts — parseDuration/monthIndex precedents for date parsing`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- The phase-7 micro-motion vocabulary (Editorial-calm, 200-280ms soft ease-out) governs the content transitions — transform/opacity only
- The reduced-motion guard suppresses transitions inside .explore-shell — the arc stage must live in-shell so reduced motion gets static positioning automatically
- parseDuration/YEAR_PATTERN exist in viz-data.ts — the year markers derive from the existing parser patterns (role start year)
- The isTechRelated filter (3 roles: Chubb/Upstream/Netcompany) is the pinned role-selection contract from phase 6 (Smartup PCC flipped false)
- The sticky-range mechanism works inside the <main> scroll container: the panel wrapper spans an extended scroll range (e.g. ~300vh at md+), the stage pins via position:sticky top, progress = scrollY fraction through the wrapper range — no wheel hijack, natural release at the ends
- The wizard's EXPERIENCE step scrollIntoView targets the panel id — with a taller sticky wrapper it lands on the wrapper start (the stage's first role); visited-marking via IntersectionObserver keeps working (threshold on the stage element)
- The brief's Experience record maps to existing data fields: role=title, company, duration→startDate/endDate (parsed), location, responsibilities=achievements — NO data-file changes expected
- SSG: the export renders role 1 (Chubb) content as real text; the arc geometry is client-computed
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
  _Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._
  ### Req REV-07
  - **Current:** The Experience panel is a half-width card with the polished rail+dots text timeline (phase-7 state).
  - **Target:** The Experience panel becomes a full-width interactive semicircular career timeline per the user's brief — the arc is the defining visual element, active role at the focal point, content beside it.
  - **Acceptance:** The panel spans full grid width at md+ with the arc left ~40% and content right ~60%; the arc carries exactly 3 year markers positioned by the cos/sin math; the active role's content (title > company > dates > location > bullets) renders beside it; the grid rebalances with no empty cells.
  ### Req REV-12
  - **Current:** n/a (new interaction).
  - **Target:** The timelineProgress interaction model: scroll input → normalized progress → active index → arc positions → content interpolation, as one deterministic system with a typed hook — implemented as a sticky-range stage (the panel pins within an extended scroll range and progress derives from scroll position through that range; NO wheel-event hijacking), which naturally releases normal scrolling at the range ends.
  - **Acceptance:** Scroll progress through the section's pinned range maps to timelineProgress (0→1); marker positions/emphasis, active index, and content transitions derive from that single value as pure functions of that value (unit-testable); the arc ends release normal scrolling; no scroll-jacking outside the section.
  ### Req REV-13
  - **Current:** n/a (new interaction).
  - **Target:** The interaction-quality contract: hand-rolled rAF (no new deps), keyboard + accessible alternative, reduced-motion fallback, listener cleanup, mobile compact adaptation.
  - **Acceptance:** Keyboard role navigation works (arrows/buttons); reduced motion swaps spatial transitions for opacity/state changes; listeners cleaned up; mobile renders the compact adapted form; all strings from the data file.
- **Boundaries (SPEC):**
  **In scope:** The Experience panel becomes a full-width interactive semicircular career timeline per the user's detailed brief — mathematically positioned arc with year markers for the 3 docx roles, scroll-driven timelineProgress driving positions/emphasis/content transitions, hand-rolled rAF (zero new deps), keyboard + reduced-motion contracts, mobile-adapted compact form — IDE aesthetic preserved.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
  - The Experience panel spans the full grid width (both columns at md+); the grid rebalances to Experience-full-width row + [About+Contact | Skills] below; no empty cells at any width; 375px invariant holds
  - A large semicircular arc carries year markers for exactly the 3 docx tech roles, positioned mathematically (x = centerX + radius·cos(angle), y = centerY + radius·sin(angle)) — no hardcoded per-marker positions; geometry derives from the container size and is responsive
  - The ACTIVE role sits at the arc's focal point (vertical center, darkest/largest marker + date); inactive markers are lighter/smaller and reposition along the curve as progress changes
  - Scroll progress through the section's pinned range maps to timelineProgress (0→1) as the single source of truth: arc angles, marker positions/opacity/scale, active index, and content transitions ALL derive from it as pure functions of that value (unit-testable); reaching the first/last role releases normal scrolling
  - Role content (title largest, company distinct, dates/location secondary, quantified bullets readable) transitions with smooth transform/opacity movement — never instant replacement
  - Hand-rolled rAF implementation: zero new animation dependencies (deps count stays 38); listeners/observers cleaned up on unmount; transform-based writes, no unnecessary re-renders
  - prefers-reduced-motion replaces spatial transitions with simple opacity/state transitions; keyboard users navigate roles (arrow keys or buttons) with an accessible non-scroll alternative; the timeline content is real text readable by AT
  - Mobile (<md) collapses to a compact vertical form with year markers (no cramped arc attempt); content readable; no horizontal scroll
  - The static export renders role 1's full content as real text (no geometry-dependent layout); hydration activates the interaction
  - All content data-driven from portfolio-main-data.json experience entries — zero hardcoded portfolio copy (EXPLORE-07); stale text-timeline tests rewritten/removed per the replacement discipline
- User brief (full, 2026-09-22): semicircular scroll-driven timeline, mathematical positioning, timelineProgress single source of truth, content hierarchy, data-driven records, reduced-motion + keyboard contracts, mobile adaptation, editorial styling, 'the curved timeline should be the central visual metaphor'
- User AAA: hand-rolled rAF / full-width panel / 3 docx roles
</specifics>

<deferred>
## Deferred Ideas
- Extending the arc to Education/Certifications/Projects/Open Source (the brief's 'you can later add' note — not this phase)
- Wheel-event hijacking variant (explicitly rejected for sticky-range)
- Arc on mobile (compact vertical form instead)
</deferred>


---

*Phase: 08-experience-showcase-revision*
*Context gathered: 2026-09-24*