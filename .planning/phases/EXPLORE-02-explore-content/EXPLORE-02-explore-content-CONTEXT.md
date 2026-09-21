# Phase 2: explore-content - Context

**Gathered:** 2026-09-21T08:30:42.416Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Replace the 5 placeholder panel bodies with real, curated, data-driven content: About (text-only full description), Experience (3-role timeline with full addresses + 3 bullets each), Skills (grouped chips), Projects (6 cards), Contact (9 link rows + 'Full resume →' to /resume); static terminal pointers on Experience/Projects/Skills; fresh IDE-native section components under src/components/explore/sections/.
**Out of scope:** Charts/visualizations (phase 3), gamification (phase 4), routing/CLI↔explore links or interactive pointers (phase 5), any edit to portfolio-main-data.json, the CLI terminal, /resume, Resume* components, or sheet.tsx; new dependencies; outer grid redesign.
</domain>

<decisions>
## Decisions
### Content & caps
- **D-01:** Caps locked: About = full description + title + location (text-only, no photo). Experience = first 3 entries in JSON order, each showing title, company, location EXACTLY as stored (full street address, user choice), duration, and the first 3 responsibilities as bullets. Skills = grouped chips using the JSON's own grouping. Projects = first 6 (matches resume-modal cap), each: name, one-line description (wraps), external link when present, date. Contact = all 9 channels from about.contact.
- **D-02:** Terminal pointers are STATIC styled text in chrome register: Experience → '// more: experience --all in the terminal', Projects → '// more: projects --all in the terminal', Skills → '// more: skills in the terminal'. About and Contact carry none (no matching CLI command). No link behaviour — phase 5 may make pointers interactive.
- **D-03:** Contact panel includes a prominent 'Full resume →' link to /resume (user choice) — the only outbound navigation in phase 2, opening in the same tab (internal route).
### Layout & components
- **D-04:** Fresh IDE-native section components under src/components/explore/sections/ (user chose option A after visual comparison): Experience = vertical timeline (rail + node dots, git-log feel); Skills = grouped chips via shadcn Badge; Projects = mini-cards (name, description, ↗ link icon, date tag); Contact = link rows with lucide icons. Resume* components untouched and unreused.
- **D-05:** About panel is text-only: description, title, location from data — no profile image (user choice).
- **D-06:** All placeholder humor lines are REPLACED by real content; the playful register survives only in terminal-pointer copy. Panel chrome (accent chip + title row) from phase 1 stays.
### Constraints
- **D-07:** All rendered portfolio copy from portfolio-main-data.json via the existing PortfolioData type; literals limited to chrome labels and pointer strings (EXPLORE-07).
- **D-08:** Zero new dependencies; SSG-compatible; 375px no-horizontal-scroll invariant preserved; content text wraps, never truncates; phase-1 grid spans and panel chrome unchanged.
### Claude's Discretion
- Exact pointer phrasing (register locked: '// more: <cmd> in the terminal')
- Timeline rail/dot styling details within existing tokens
- Chip density — render every group as-is from JSON (they are compact); no cap on groups
- Contact icon-per-channel mapping (lucide equivalents)
- Project card internal spacing/order of name/description/date
- Bullet count fallback if a role has fewer than 3 responsibilities (render what exists)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data source
- `src/data/portfolio-main-data.json — experience (7, reverse-chronological, responsibilities[] per role, full street addresses), projects (14), skills {soft_skills, hard_skills{Languages,Testing,...}, languages}, about.contact (9 channels)`
- `src/data/portfolio-main-data.d.ts — PortfolioData types`
### Phase-1 shell
- `src/components/explore/panel-placeholder.tsx — phase-1 panel chrome (accent chip + title row) that section components replace the body of`
- `src/components/explore/explore-panels.tsx — locked 1/2/3-col grid with About spans (untouched this phase)`
### Primitives
- `src/components/ui/badge.tsx — shadcn Badge for skill chips`
- `src/components/ui/skeleton.tsx — removed once content renders`
- `lucide-react — contact channel icons`
### Locked spec
- `.planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-SPEC.md`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- experience array order is reverse-chronological (verified: entry[0] = Chubb Sept 2023 — Present) — caps take the first N without sorting
- responsibilities[] is the highlight source per role; arrays can run 4+ items — cap at first 3
- The in-app resume modal already caps projects at top-6 — same cap reused in /explore for surface consistency
- Resume* components are print-styled (white bg, print classes) and stay untouched — that coupling is exactly what this phase avoids
- skills JSON already groups (soft_skills / hard_skills{Languages, Testing, ...} / languages) — chips render the JSON's own grouping, no re-shaping
- GA (G-TLWL6FDZE7) is in the root layout; no per-section tracking in this phase
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
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
- **Boundaries (SPEC):**
  **In scope:** Render the data-driven content sections (About, Experience, Skills, Projects, Contact) on /explore from portfolio-main-data.json with clear, visible navigation.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate) and `npm run typecheck` pass after implementation; /explore still exports statically
  - About panel shows the real description + location/title from `about`; no placeholder humor line remains in any panel
  - Experience panel: exactly 3 roles, each with title/company/period + 2-3 highlight bullets, rendered as a vertical timeline; terminal pointer 'experience --all' present
  - Skills panel: skills rendered as grouped chips from the JSON's own grouping (soft_skills / hard_skills groups / languages) — no flattened dump; terminal pointer 'skills' present
  - Projects panel: exactly 6 project cards (name + one-line description + external link when present, date); terminal pointer 'projects --all' present
  - Contact panel: all contact links from data + a prominent 'Full resume →' link to /resume; no terminal pointer (none exists in CLI)
  - Every rendered string originates from portfolio-main-data.json or phase-locked chrome labels — grep shows no new hardcoded portfolio copy
  - 375px: no horizontal scroll; all new internal layouts wrap (never truncate) and keep the phase-1 grid spans intact
  - Panels with a terminal pointer render it as styled chrome that reads naturally in both themes
- User: 'Caps + terminal pointer' for content depth
- User: 'Redesign layouts now' (per-section internal layouts before phase 3 charts)
- User: include 'Full resume →' link in Contact
- User: terminal hint = static text (no link, no prefill)
- User: About = text only (no photo)
- User: location = full address as-is (strict data fidelity)
- User: option A — IDE-native sections (timeline-as-git-log, chips-as-dependency-tags, cards-as-file-explorer) after comparing both looks
</specifics>

<deferred>
## Deferred Ideas
- Charts/visualizations inside panels → phase 3 (explore-visuals)
- Making terminal pointers interactive (link/prefill to CLI) → phase 5 (explore-routing)
- Profile photo in About (rejected this round — revisit only if user asks)
- Education/certifications/interests panels (not among the 5 locked sections)
</deferred>


---

*Phase: 02-explore-content*
*Context gathered: 2026-09-21*