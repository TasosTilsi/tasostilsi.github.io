# Phase 7: look-and-feel-revision - Context

**Gathered:** 2026-09-23T20:58:34.957Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Both Gantt charts deleted; Experience showcase polished non-chart (taste-level); Projects tiles+cards; Skills cards presentation redesigned; committed audit table; editorial-calm CSS micro-motion (hover lift/bloom, icon nudge, panel-grid stagger entrance); all inside the IDE rail.
**Out of scope:** REV-07 new layout invention, new dependencies/JS animation libs, CLI/resume/PDF changes, panel chrome/token replacement, reduced-motion guard modification.
</domain>

<decisions>
## Decisions
### Design guidance & dials
- **D-01:** The three installed design skills govern execution: redesign-existing-projects sequence drives REV-10 (committed audit table BEFORE fixes: area | generic pattern found | disposition per region); design-taste-frontend drives the taste decisions at dials VARIANCE 5 / MOTION 3 / DENSITY 4 (user pick B); motion-design's Editorial-calm archetype drives REV-11's timing (200-280ms, soft ease-out, no bounce).
- **D-02:** Concrete dial-B effects pinned: section headers gain a subtle oversized mono index (01–04) hierarchy device; competency + project cards lift 2px on hover with a shadow bloom; merged panel's contact rows gain icon nudges on hover; grid gutters widen gap-4→gap-5 at lg; competency card accent-chip positions alternate.
### Chart removal
- **D-03:** Both Gantt-style charts deleted: career-span-chart.tsx + projects-calendar.tsx removed with buildCareerSpan/buildProjectCalendar out of viz-data.ts; their test suites (career-span/projects-calendar tests) rewritten to the replacement contract or dropped with their subjects; Experience showcase = the existing rail+dots text timeline, refined per the taste audit (spacing/hierarchy/typography — NOT a new layout; REV-07 stays open); Projects = stat tiles + cards only.
### Micro-motion vocabulary
- **D-04:** Editorial-calm vocabulary: hover/focus transitions 200-280ms soft ease-out (cards lift 2px + shadow bloom, contact-row icon nudge, link underline), and ONE entrance — a panel-grid stagger on first paint (4 panels, ~40ms stagger, CSS keyframes with backwards fill inside .explore-shell) — every bit CSS-only, zero JS animation APIs, zero new dependencies, auto-suppressed by the phase-1 reduced-motion guard.
### Constraints
- **D-05:** IDE aesthetic is the hard rail (tokens, JetBrains Mono, PanelShell chrome, themes, drawer/header/status, 375px invariant, 44px targets); REV-07 stays deferred; no new dependencies; /resume + PDF + CLI untouched.
### Claude's Discretion
- Exact stagger duration/delay curve within Editorial-calm bounds
- Which regions the audit table flags as generic patterns (the skill's protocol decides)
- Shadow bloom intensity/blur values
- Whether the intro strip participates in the stagger or stays typewriter-only
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Revision targets
- `src/components/explore/sections/career-span-chart.tsx + projects-calendar.tsx — the two charts to delete (REV-08)`
- `src/components/explore/viz-data.ts — buildCareerSpan/buildProjectCalendar to remove`
- `src/components/explore/sections/skills-section.tsx — competency cards to restyle (REV-09)`
### Installed design skills
- `~/.dsh/skills/motion-design/SKILL.md — timing/easing tables, personality archetypes (editorial-calm selected)`
- `~/.dsh/skills/design-taste-frontend/SKILL.md — dials + anti-slop pre-flight`
- `~/.dsh/skills/redesign-existing-projects/SKILL.md — audit-first sequence (scan → identify generic patterns → fix)`
### Motion rail + locked spec
- `src/app/globals.css:572-593 — the reduced-motion guard that suppresses all new motion`
- `.planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-SPEC.md`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- The phase-1 reduced-motion guard (globals.css .explore-shell block) already kills every CSS animation/transition under prefers-reduced-motion — new keyframes need zero extra suppression work
- PanelShell chrome (rounded-md border bg-card p-4) is the hover-lift target for the shadow bloom — pure CSS, no JS
- The entrance stagger must live inside .explore-shell so the guard covers it; initial paint uses CSS animations (fill-mode backwards) — no JS, SSG-safe
- The 4 panels post-merge: [About+Contact | Experience] / [Skills | Projects] — the stagger sequence maps to DOM order
- Editorial-calm persona maps to: 200-280ms durations, ease-out curves (cubic-bezier(0.25, 1, 0.5, 1)-family), no springs/bounces — the motion-design skill's timing tables pick exact values
- Hover shadow blooms need a dark/light-agnostic shadow recipe (colored shadow via hsl token, not black-only)
- REV-07 stays deferred: the Experience panel's non-chart showcase redesign here is taste-level (spacing/hierarchy/accent on the EXISTING rail+dots timeline), not a new layout invention
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
  _Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._
  ### Req REV-08
  - **Current:** Experience carries the phase-3 career-span Gantt (user-disliked); Projects carries the phase-6 year-grid calendar the user now rejects too.
  - **Target:** Remove both Gantt-style charts — Experience's showcase is redesigned as a polished non-chart presentation; Projects reverts to tiles + cards.
  - **Acceptance:** grep-verifiable: career-span-chart.tsx + projects-calendar.tsx and buildCareerSpan/buildProjectCalendar are gone; their suites removed/rewritten; Experience renders the polished non-chart showcase; Projects renders tiles + cards; 200-test suite green on the final tree.
  ### Req REV-09
  - **Current:** Competency cards render phase-6's initial presentation (chip + proof rows).
  - **Target:** Redesign the Skills competency cards' presentation under design-taste-frontend + motion-design guidance.
  - **Acceptance:** The competency cards render with reworked spacing/hierarchy/accent rhythm and restrained hover/focus motion per the taste skill's audit; chips + pointer preserved; IDE tokens intact.
  ### Req REV-10
  - **Current:** No audit artefact exists; polish has been per-feature, never holistic.
  - **Target:** Audit-first look-and-feel pass across /explore applying the redesign-existing-projects sequence.
  - **Acceptance:** A committed audit table (area | generic pattern found | disposition) covers shell/header/intro/panels; every fix carries a test or a recorded no-op disposition; no unrelated refactors.
  ### Req REV-11
  - **Current:** Motion is minimal: phase-3 hover transitions + reduced-motion suppression exist; no entrance choreography.
  - **Target:** Apply a restrained CSS micro-motion vocabulary (hover/focus transitions + one entrance choreography) per the motion-design skill.
  - **Acceptance:** The micro-motion vocabulary is CSS-only (grep-verifiable: no JS animation APIs, no new animation deps) and every new animation is inside .explore-shell (auto-suppressed by the reduced-motion guard).
- **Boundaries (SPEC):**
  **In scope:** Overall UI/UX look-and-feel revision under the newly installed design skills (motion-design + design-taste-frontend + redesign-existing-projects): both Gantt-style charts removed, skills cards' presentation redesigned, audit-first polish pass and restrained micro-motion across /explore — IDE aesthetic preserved.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
  - grep-verifiable: no Gantt-style chart markup remains — career-span-chart.tsx and projects-calendar.tsx deleted (or their subjects removed), buildCareerSpan/buildProjectCalendar gone from viz-data.ts, their test suites removed/rewritten to the replacement contract; Projects renders tiles + cards only; Experience renders the polished non-chart showcase
  - The Experience showcase redesign is non-chart: refined per-company presentation (company/period framing + responsibilities) audited and restyled under the design-taste-frontend guidance, with the REV-07 screenshot description still awaited (no speculative layout invention beyond taste-level polish)
  - The Skills competency cards' presentation is redesigned: audited spacing/hierarchy/accent rhythm per the taste skill, with restrained motion on hover/focus
  - The audit-first pass leaves a committed before/after audit table in the phase artefacts (per-region findings + disposition) — the redesign-existing-projects sequence is falsifiable, not vibes
  - Micro-motion is CSS-only: hover/focus transitions + at most one entrance choreography; every new animation is suppressed by the existing reduced-motion guard (globals.css .explore-shell block) — grep-verifiable, no JS animation libs introduced
  - The IDE aesthetic is preserved: design tokens, JetBrains Mono, panel chrome, dark/light themes, and the 375px no-horizontal-scroll invariant all hold; no new dependencies
  - All surfaces (CLI, /resume, PDF) untouched by this phase except where the removed charts' absence ripples (none expected — the charts are /explore-only)
- User: 'I don't like the gantt chart at all' — kill both Gantts
- User: design the skills with motion-design + taste-skill guidance, 'keep the ide look and feel overall'
- User: Editorial-calm motion persona; panel-grid stagger entrance; taste dials B (5/3/4)
</specifics>

<deferred>
## Deferred Ideas
- REV-07 per-company-card experience redesign — awaits the user's screenshot description (phase 7 delivers taste-level polish on the existing rail+dots timeline, not the new layout)
- Scroll-triggered reveals (fuller motion vocabulary) — not this phase
- CLI/resume/PDF visual polish — out of scope
</deferred>


---

*Phase: 07-look-and-feel-revision*
*Context gathered: 2026-09-23*