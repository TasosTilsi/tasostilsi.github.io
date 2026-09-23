# Requirements

## EXPLORE

- [x] EXPLORE-01: A new /explore route renders a techy-but-visual landing page with an IDE-like layout (sidebar, panels, consolas/mono typography, typewriter intro) that presents the portfolio content clearly.
- [x] EXPLORE-02: The page presents the work with visualizations — a skills chart, an experience timeline, and project stats — built with recharts from the existing portfolio data.
- [x] EXPLORE-03: The page has clear, visible navigation sections (About, Experience, Skills, Projects, Contact) that a non-technical visitor can scan in ~30 seconds without typing any commands.
- [x] EXPLORE-04: The page includes light gamification — a guided 'spin the wheel' tour picker, exploration progress/achievements, and light humor in the copy.
- [x] EXPLORE-05: The existing CLI terminal (/) and printable resume (/resume) remain fully intact, and a non-blocking toggle/link routes visitors between the CLI and /explore.
- [x] EXPLORE-06: The /explore page is responsive and works well on mobile, since recruiters are often on phones.
- [x] EXPLORE-07: All content on /explore is data-driven from src/data/portfolio-main-data.json, with no hardcoded portfolio content.

## REV

- [x] REV-01: The portfolio data file is refreshed to the user's current resume (docx) as source of truth — new branding ("Test Automation Architect | Principal Test Automation Engineer"), business-value summary, 8 core-competency clusters with proof lines, quantified experience bullets, enriched Clarif-AI/DeepIndex entries, featured-flagged certifications, and selected-writing curation — flowing consistently to ALL surfaces (CLI, /explore, /resume, PDF export), with nothing deleted (full lists stay in the CLI).
- [ ] REV-02: The /resume page is rebuilt to the docx structure — SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE (quantified bullets) → PROJECTS → EDUCATION → CERTIFICATIONS → SELECTED WRITING — print-optimized.
- [ ] REV-03: The static PDF export (scripts/generate-static-resume.js → public/resume-export.html) is rebuilt to the same docx structure, replacing its hardcoded sections.
- [x] REV-04: The About and Contact panels merge into one panel on /explore, reclaiming the empty space the oversized About section left, with the panel grid rebalanced.
- [ ] REV-05: The Skills panel's bar chart and treemap are replaced by competency + proof cards — 8 core-competency clusters, each with a one-line quantified proof drawn from the refreshed data.
- [ ] REV-06: The Projects panel gains a year-grid bars calendar (year columns, project bars spanning their active months) alongside the existing cards.
- [x] REV-07: The Experience showcase is redesigned per the user's reference screenshot (layout description pending from the user — this requirement is scoped when the description arrives; the current text timeline + Gantt remain until then).
