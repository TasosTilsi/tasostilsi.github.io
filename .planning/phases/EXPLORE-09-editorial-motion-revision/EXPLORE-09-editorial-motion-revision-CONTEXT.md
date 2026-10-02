# Phase 9: editorial-motion-revision - Context

**Gathered:** 2026-09-24T14:42:01.395Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Grid reflow (About first), About package (3 new data fields via draft-approve-write + presentation), education-on-arc (5 entries, type-aware, engine untouched), projects editorial scroll (framer-motion, top-6), stale-test renewal.
**Out of scope:** Data deletions, new dependencies beyond the already-adopted framer-motion, CLI/resume/PDF changes, Experience stage engine changes, wheel hijacking, panel chrome/token changes.
</domain>

<decisions>
## Decisions
### Reflow & About package
- **D-01:** Grid reflow (user): [About+Contact | Skills] row 1, Experience full-width row 2, Projects row 3; drawer anchors/wizard scroll targets/counter re-derive from the new DOM order; the tour's CONTENT step order is unchanged (About→Experience→Skills→Projects).
- **D-02:** About package (user: 'Everything'): positioning lead = NEW about.positioning field pinned to two lines ('I design test automation frameworks and AI-driven QA infrastructure that entire engineering organizations adopt.' + '— not just run.'); full summary demoted below it (smaller/muted); about.metrics = NEW typed array of 4 {value,label} transcribed from the proofs ('12+' teams, '30+' engineers, '7+' years, '600+' npm launch week); about.availability = NEW field, verbatim from the user's CLI banner ('Open to selective part-time work'), rendered as an accent chip; avatar from about.profileImageUrl (rounded crop, graceful-hide); all 9 contact rows kept, tightened (compact row height). ALL THREE new fields go through draft→approve→write (D-01 phase-6 precedent) — the draft is tiny (3 fields) but the approval round is not skipped for personal copy.
### Arc + editorial systems
- **D-03:** Education-on-arc (user): the arc entries = roles.filter(isTechRelated) ∪ education.filter(featured), merged and sorted by start date → 5 entries (BEng 2012, Netcompany 2019, MSc 2021, Upstream 2022, Chubb 2023); marker = start year; content template is type-aware (role: title > company > dates > location > bullets; education: degree > institution > dates > specialization); the derivation hook generalizes to a typed entries array with a type discriminator — the phase-8 tests renew, the engine stays hand-rolled (zero framer-motion in the stage files).
- **D-04:** Projects editorial scroll (user brief): framer-motion useScroll/useTransform drives a sticky ~100vh stage (md+ only) where the top-6 curated projects (data order) render as rows — year + name + first-sentence description (split at the first period, ≤120 chars) + link line, thin dividers — entering from below and coexisting during transitions; single progress value, continuous interpolation (no discrete thresholds); Editorial-calm character (no bounce/springs); reduced motion = opacity-only swaps via useReducedMotion; stat tiles stay above the stage; mobile = the existing compact list (stage is md+ only).
### Constraints
- **D-05:** Dual-engine grep ban extended (framer-motion only in the projects composition + About motion; NOT in the Experience stage files); the three new data fields go through draft→approve→write; zero new dependencies beyond the already-adopted framer-motion; stale-test renewal for the reflow + arc extension; 375px invariant + 44px targets hold.
### Claude's Discretion
- Positioning lead typography (size/weight within text-sm..text-base range)
- Metric row layout (inline chips vs mini-tiles) within the panel width
- Row height for the tightened contact rows
- The projects stage's exact sticky wrapper length (~100vh pin) and row spacing
- Arc entry-type iconography (a small degree glyph vs plain year label for education markers)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Revision targets
- `src/components/explore/about-section.tsx — the merged panel to enhance (positioning/metrics/availability/avatar/contacts)`
- `src/components/explore/sections/experience-section.tsx + the phase-8 stage files — the arc gaining 5 entries (byte-untouched engine)`
- `src/components/explore/sections/projects-section.tsx — the panel gaining the editorial scroll`
### Data sources
- `src/data/portfolio-main-data.json — competency proofs (metric sources), featured education (2), projects (top-6 in data order), about.profileImageUrl`
### Availability source + locked spec
- `src/components/cli/outputs/WelcomeMessage.tsx — the CLI banner carrying 'Open to selective part-time work' verbatim (the availability line's source)`
- `.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-SPEC.md`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- framer-motion v13.4.3 is already a dependency (39th) — useScroll/useTransform are the editorial-scroll APIs; useReducedMotion exists for the RM fallback
- The phase-8 stage (useExperienceTimeline hook + arc renderer) needs only an entry-list extension: the derivation functions take a roles array — extend to a unified entries array (type discriminator role|education)
- The metric values exist verbatim in the competency proofs and Chubb bullets ('12+ engineering teams', '30+ engineers', '7+ years' in the summary, '600+ downloads in launch week' in the deepindex description) — the about.metrics array transcribes them (approved at the data write)
- The isTechRelated filter + featured education flags are the pinned selection contracts (phases 6/7) — the merged arc consumes both
- PanelShell's index prop renders the 01–04 device — the reflow re-numbers automatically if the panels array order changes
- The wizard's step sequence (welcome→about→experience→skills→projects→finish) is CONTENT order — the DOM order change re-derives scroll targets, not step order
- The projects top-6 = the existing card grid's render set (data order, post-refresh: DeepIndex, Clarif-AI, SDK4ED-TD, …)
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
  _Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._
  ### Req REV-14
  - **Current:** Grid renders [EXPERIENCE full-width] / [About+Contact | Skills] / [Projects].
  - **Target:** Reflow: [About+Contact | Skills] row 1, Experience full-width row 2, Projects row 3 — flows re-mapped.
  - **Acceptance:** grep-verifiable grid order (About+Contact and Skills in row 1, Experience col-span-2 row 2, Projects row 3) + drawer/wizard/counter re-mapping tests green.
  ### Req REV-15
  - **Current:** The merged panel is a summary paragraph wall + meta + contacts.
  - **Target:** The About presentation package with three new data fields (about.positioning, about.metrics, about.availability) — all user-approved before write.
  - **Acceptance:** The About panel renders the pinned positioning lead (new about.positioning field), the 4-stat metrics row (new typed about.metrics array, graceful-hide), the availability badge from the new data field, the avatar (graceful-hide), 9 tightened contact rows; the full summary renders demoted below the lead; all new fields typed in .d.ts same-commit and approved via draft→approve→write.
  ### Req REV-16
  - **Current:** The arc carries only the 3 tech roles.
  - **Target:** Education merges onto the semicircular arc — 5 chronological entries, type-aware content templates.
  - **Acceptance:** The arc carries 5 markers with year labels derived from entry data; the content column renders the type-aware template for the active entry (role vs education); the stage files keep zero framer-motion imports; keyboard/reduced-motion/mobile contracts hold for 5 entries.
  ### Req REV-17
  - **Current:** Projects shows stat tiles + a static card grid.
  - **Target:** The Projects panel gains the framer-motion-driven editorial scroll composition for its top-6 projects.
  - **Acceptance:** Projects renders stat tiles + the editorial scroll stage (top-6 rows, dividers, coexistence transitions, first-sentence descriptions); framer-motion imported only there; reduced-motion degrades to opacity swaps; 375px-safe (sticky stage md+ only).
- **Boundaries (SPEC):**
  **In scope:** Panel order (About first), the About presentation package (positioning lead, impact metrics, availability badge, avatar), education merged onto the semicircular arc (5 entries, type-aware), and the Projects panel converted to a framer-motion-driven editorial scroll composition (top-6 rows entering from below) — experience stage stays hand-rolled.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
  - The grid renders [About+Contact | Skills] as row 1, Experience full-width row 2, Projects row 3 — drawer anchors, wizard step targets, and the visited counter re-mapped to the new order (grep-verifiable)
  - The About panel leads with the pinned two-line positioning statement: line 1 'I design test automation frameworks and AI-driven QA infrastructure that entire engineering organizations adopt.' line 2 '— not just run.' rendered as the lead; the full docx summary renders below it demoted (smaller, muted); the positioning text is a NEW data field (about.positioning) transcribed verbatim from this spec and approved at the data write
  - An impact-metric row renders exactly 4 stats from a NEW data array (about.metrics: [{value, label}] typed in .d.ts same-commit): '12+' engineering teams, '30+' engineers, '7+' years, '600+' npm launch week — values transcribed from the approved competency-proof/bullet strings, never computed at render time; graceful-hide when the array is empty
  - The availability badge renders about.availability ('Open to selective part-time work') as an accent chip under the positioning lead
  - The avatar renders from about.profileImageUrl in a rounded crop (h-16 w-16 md:h-20 md:w-20, object-cover); missing URL → graceful-hide
  - All 9 contact rows render tightened (compact row height, existing anatomy)
  - The Experience arc carries 5 chronological entries — BEng (2012), Netcompany (2019), MSc (2021), Upstream (2022), Chubb (2023) — with type-aware content templates (roles: title > company > dates > location > bullets; education: degree > institution > dates > specialization); year markers derive from entry data
  - The Experience stage keeps its hand-rolled rAF engine (grep: no framer-motion import under src/components/explore/sections/experience*); framer-motion imports appear ONLY in the projects editorial composition
  - The Projects panel renders the top-6 curated projects as editorial rows (year + name + one-line description + link, thin dividers) inside a sticky ~100vh stage with framer-motion-driven scroll-linked interpolation: rows enter from below and coexist; reduced motion degrades to opacity-only swaps; the row description = the FIRST SENTENCE of the project's description field (pinned split rule: up to the first period, max 120 chars)
  - Both scroll-driven systems work inside <main> without wheel-event hijacking; 375px invariant holds on the rebalanced grid; the new data fields (availability, metrics, positioning) are typed in the .d.ts same-commit (R-7); nothing deleted; the wizard/drawer/counter re-mapping is tested
- User: About first on top; projects editorial animation (REV-14/17)
- User: education merged into the timeline (REV-16)
- User: 'Everything' About package
- User: framer-motion for editorial compositions, not for the Experience stage
- The full editorial-scroll brief quoted in SPEC background
</specifics>

<deferred>
## Deferred Ideas
- Editorial scroll for the remaining 8 projects (CLI-reachable)
- Arc extensions beyond education (certifications etc. — the brief's future note)
- Scroll-triggered reveals beyond the pinned compositions
</deferred>


---

*Phase: 09-editorial-motion-revision*
*Context gathered: 2026-09-24*