# Phase 2: explore-content - Spec

**Gathered:** 2026-09-21T08:03:34.333Z
**Mode:** interviewed

## Requirements

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req EXPLORE-03

- **Current:** All 5 panels are placeholders: accent chip + section title + one humor line + skeleton blocks (phase 1).
- **Target:** Each panel renders curated real content a recruiter can scan in ~30 seconds, with per-section internal layouts redesigned now (timeline for experience, chips for skills, cards for projects, link-cards for contact) inside the locked panel grid.
- **Acceptance:** About shows real description+location+title; Experience shows exactly 3 roles as a vertical timeline (title/company/period + 2-3 highlights); Skills shows grouped chips; Projects shows exactly 6 cards (name, one-line description, link, date); Contact shows all contact links + 'Full resume →' to /resume. No placeholder humor line remains in any panel.

### Req EXPLORE-03b

- **Current:** n/a (new).
- **Target:** Sections with a matching CLI command end with a visible 'view all in the terminal' pointer (Experience → `experience --all`, Projects → `projects --all`, Skills → `skills`), keeping the playful register that phase-1 humor established.
- **Acceptance:** Cap logic selects from the JSON (top-3 experience by recency, top-6 projects matching the resume-modal cap); pointer copy is chrome and consistent in both themes; About and Contact carry no pointer (no matching CLI command).

### Req EXPLORE-07

- **Current:** Content lives only in the data file; placeholder copy was literal.
- **Target:** All rendered portfolio copy comes from src/data/portfolio-main-data.json via the existing PortfolioData type — zero hardcoded portfolio content.
- **Acceptance:** grep of the new explore components shows no hardcoded portfolio content; all copy from the JSON import.

### Req EXPLORE-03c

- **Current:** Panels are visually complete but empty.
- **Target:** The page remains scannable end-to-end in ~30 seconds: caps enforce density (Experience top-3, Projects top-6, Skills grouped highlights, About full description, Contact all links).
- **Acceptance:** A visitor moving section-to-section via the drawer lands on readable, complete-feeling sections within one screenful each at 768px and 1440px.

## Boundaries

**In scope:** Render the data-driven content sections (About, Experience, Skills, Projects, Contact) on /explore from portfolio-main-data.json with clear, visible navigation.
**Out of scope:** (not specified)

## Constraints

- Reuse the existing phase-1 shell, grid slots, panel chrome, tokens and JetBrains Mono — this phase works INSIDE panels
- SSG-compatible static export; no new dependencies; no data-file edits (content is rendered as-is; genuine data gaps surface at discuss, never silently patched)
- All copy from portfolio-main-data.json via the existing PortfolioData type (src/data/portfolio-main-data.d.ts); terminal-pointer strings and structural labels are the only literals (chrome)
- Wrap, never truncate, for content text; the 375px no-horizontal-scroll invariant from phase 1 is preserved

## Acceptance Criteria

- `npm run build` (CI gate) and `npm run typecheck` pass after implementation; /explore still exports statically
- About panel shows the real description + location/title from `about`; no placeholder humor line remains in any panel
- Experience panel: exactly 3 roles, each with title/company/period + 2-3 highlight bullets, rendered as a vertical timeline; terminal pointer 'experience --all' present
- Skills panel: skills rendered as grouped chips from the JSON's own grouping (soft_skills / hard_skills groups / languages) — no flattened dump; terminal pointer 'skills' present
- Projects panel: exactly 6 project cards (name + one-line description + external link when present, date); terminal pointer 'projects --all' present
- Contact panel: all contact links from data + a prominent 'Full resume →' link to /resume; no terminal pointer (none exists in CLI)
- Every rendered string originates from portfolio-main-data.json or phase-locked chrome labels — grep shows no new hardcoded portfolio copy
- 375px: no horizontal scroll; all new internal layouts wrap (never truncate) and keep the phase-1 grid spans intact
- Panels with a terminal pointer render it as styled chrome that reads naturally in both themes

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- Q: How much content per panel? A: Curated caps + a 'view all in the terminal' pointer per section (user: Caps + terminal pointer).
- Q: Fill the phase-1 grid or redesign layouts? A: Redesign layouts now — per-section internal layouts (timeline/chips/cards) before phase 3 charts (user: Redesign layouts now); outer grid slots stay phase-1-locked.
- Q: Cross-link to /resume from Contact? A: Yes, prominent 'Full resume →' link (user: Include resume link).

---

*Phase: 02-explore-content*
*Spec gathered: 2026-09-21*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.85 | 0.75 | PASS |
| Boundary Clarity | 0.72 | 0.70 | PASS |
| Constraint Clarity | 0.88 | 0.65 | PASS |
| Acceptance Criteria | 0.82 | 0.70 | PASS |

**Overall Ambiguity:** 0.182  (max 0.2)

**Gate:** PASSING — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
