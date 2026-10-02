# Phase 7: look-and-feel-revision - Spec

**Gathered:** 2026-09-23T20:53:06.230Z
**Mode:** interviewed

## Requirements

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

## Boundaries

**In scope:** Overall UI/UX look-and-feel revision under the newly installed design skills (motion-design + design-taste-frontend + redesign-existing-projects): both Gantt-style charts removed, skills cards' presentation redesigned, audit-first polish pass and restrained micro-motion across /explore — IDE aesthetic preserved.
**Out of scope:** (not specified)

## Constraints

- The installed design skills are GUIDANCE, not dependencies: no package installs, no GSAP/Framer Motion, no JS animation libraries; motion is CSS-only within the existing reduced-motion guard
- Audit-first per redesign-existing-projects: the audit (before-state table) is committed BEFORE the fixes; every identified generic pattern gets a recorded disposition (fixed / deliberately kept)
- IDE aesthetic is the hard rail: existing design tokens, JetBrains Mono, PanelShell chrome, dark/light themes, drawer/header/status structure, 375px no-horizontal-scroll, 44px targets — the taste pass tunes WITHIN these, never replaces them
- Static export survives: no client-only rendering introduced for the polish; animations are CSS transitions/keyframes inside .explore-shell (auto-suppressed by the phase-1 guard)
- Stale-test discipline for both chart removals: tests rewritten to the replacement contract or removed with their subjects, gate green chronologically last
- REV-07 remains deferred: no speculative per-company-card layout invention; the screenshot description still drives it

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
- grep-verifiable: no Gantt-style chart markup remains — career-span-chart.tsx and projects-calendar.tsx deleted (or their subjects removed), buildCareerSpan/buildProjectCalendar gone from viz-data.ts, their test suites removed/rewritten to the replacement contract; Projects renders tiles + cards only; Experience renders the polished non-chart showcase
- The Experience showcase redesign is non-chart: refined per-company presentation (company/period framing + responsibilities) audited and restyled under the design-taste-frontend guidance, with the REV-07 screenshot description still awaited (no speculative layout invention beyond taste-level polish)
- The Skills competency cards' presentation is redesigned: audited spacing/hierarchy/accent rhythm per the taste skill, with restrained motion on hover/focus
- The audit-first pass leaves a committed before/after audit table in the phase artefacts (per-region findings + disposition) — the redesign-existing-projects sequence is falsifiable, not vibes
- Micro-motion is CSS-only: hover/focus transitions + at most one entrance choreography; every new animation is suppressed by the existing reduced-motion guard (globals.css .explore-shell block) — grep-verifiable, no JS animation libs introduced
- The IDE aesthetic is preserved: design tokens, JetBrains Mono, panel chrome, dark/light themes, and the 375px no-horizontal-scroll invariant all hold; no new dependencies
- All surfaces (CLI, /resume, PDF) untouched by this phase except where the removed charts' absence ripples (none expected — the charts are /explore-only)

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- User (2026-09-22): 'I don't like the gantt chart at all' — gantt_kill decision: BOTH Gantt-style charts removed (career-span + year-grid calendar).
- User: skills panel — 'something like that for designing skills' referencing the two design-skill repos → skills cards' presentation redesigned with the loaded guidance; cards + chips kept.
- User: 'keep the ide look and feel overall' — IDE aesthetic is the hard rail.
- User: 'what do you think?' → prior-art gate verdict: wire the incumbents (installed 2026-09-22, instruction-only, vetted); motion guidance scoped to CSS-only within the reduced-motion guard.
- Q: gantt scope? A: Kill both Gantts.
- Q: skills depth? A: Redesign cards' presentation.
- Q: motion appetite? A: Restrained micro-motion.
- Q: polish surface? A: /explore full pass.

---

*Phase: 07-look-and-feel-revision*
*Spec gathered: 2026-09-23*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.80 | 0.75 | PASS |
| Boundary Clarity | 0.75 | 0.70 | PASS |
| Constraint Clarity | 0.90 | 0.65 | PASS |
| Acceptance Criteria | 0.78 | 0.70 | PASS |

**Overall Ambiguity:** 0.197  (max 0.2)

**Gate:** PASSING — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
