# Roadmap — Explore Visual Landing (v1.0)

13 phase(s) | requirements mapped per phase

| # | Phase | Goal | Requirements |
|---|-------|------|--------------|
| 01 | explore-shell | Scaffold the /explore route with an IDE-like layout shell (sidebar, panels, consolas/mono typography, typewriter intro) that establishes the techy-but-visual identity. | EXPLORE-01 … EXPLORE-06 |
| 02 | explore-content | Render the data-driven content sections (About, Experience, Skills, Projects, Contact) on /explore from portfolio-main-data.json with clear, visible navigation. | EXPLORE-03 … EXPLORE-07 |
| 03 | explore-visuals | Add the visualizations — a skills chart, an experience timeline, and project stats — built with recharts from the existing portfolio data. | EXPLORE-02 |
| 04 | explore-gamification | Add light gamification to /explore — a guided spin-the-wheel tour picker, exploration progress/achievements, and light humor in the copy. | EXPLORE-04 |
| 05 | explore-routing | Add a non-blocking toggle/link routing visitors between the CLI (/) and /explore, and polish responsive behaviour across breakpoints. | EXPLORE-05 … EXPLORE-06 |
| 06 | explore-revision | Refresh the portfolio data to the user's current resume (docx) as source of truth and revise the visual surfaces accordingly — /resume + PDF rebuilt to the docx structure, About+Contact merged, skills as competency + proof cards, projects year-grid calendar — per the user's pre-ship revision list. | REV-01 … REV-07 |
| 07 | look-and-feel-revision | Overall UI/UX look-and-feel revision under the newly installed design skills (motion-design + design-taste-frontend + redesign-existing-projects): both Gantt-style charts removed, skills cards' presentation redesigned, audit-first polish pass and restrained micro-motion across /explore — IDE aesthetic preserved. | REV-08 … REV-11 |
| 08 | experience-showcase-revision | The Experience panel becomes a full-width interactive semicircular career timeline per the user's detailed brief — mathematically positioned arc with year markers for the 3 docx roles, scroll-driven timelineProgress driving positions/emphasis/content transitions, hand-rolled rAF (zero new deps), keyboard + reduced-motion contracts, mobile-adapted compact form — IDE aesthetic preserved. | REV-07 … REV-12 … REV-13 |
| 09 | editorial-motion-revision | Panel order (About first), the About presentation package (positioning lead, impact metrics, availability badge, avatar), education merged onto the semicircular arc (5 entries, type-aware), and the Projects panel converted to a framer-motion-driven editorial scroll composition (top-6 rows entering from below) — experience stage stays hand-rolled. | REV-14 … REV-17 |
| 10 | projects-stack-revision | The Projects panel's editorial scroll is replaced by a curated stacked-card carousel — 6 visual-first cards forming a swipe-driven, loopable ring buffer of physically stacked cards in depth (card appearance = cardState(cardIndex, frontIndex) from the pure projects-card-state module: translateY/scale/opacity/z-index derived from depth off the foreground card, continuous and reversible in both directions), the foreground card draggable with keyboard Prev/Next, Arrow and Home/End stepping the same ring buffer, the panel at natural height with the stack centered in its stage, six distinct deterministic generative IDE-language visuals curated per project (name-hash fallback for uncurated names), curated imperfection, in-card info on the active card, mount-gated reduced-motion and mobile-simplified-stack contracts — framer-motion confined to the projects composition, IDE aesthetic preserved. | REV-18 … REV-20 |
| 11 | credentials-panel-revision | A combined tabbed 'Credentials' panel (Articles | Certifications |
| 12 | route-swap-promotion | The explore experience is promoted to the primary landing: / serves the visual experience, /cli serves the CLI terminal, /explore is deleted, the breadcrumb becomes ~, cross-surface links rewire, and the status bar gains a new-tab cli hyperlink. | REV-22 |
| 13 | [x] mobile-parity-revision | Full mobile parity (real-hardware-tested): the <md simplifications retired - the arc and the full swipe stack render on phones - the avatar removed, and the mobile-native platform pack applied (proper viewport meta with viewport-fit=cover, dvh/svh, overscroll/tap-highlight/safe-areas) - killing the gap-after-footer, the extra scrollbars, and the touch failures. | REV-23 … REV-25 |

## Progress

| # | Phase | Status | Date |
|---|-------|--------|------|
| 01 | explore-shell | pending |  |
| 02 | explore-content | pending |  |
| 03 | explore-visuals | pending |  |
| 04 | explore-gamification | pending |  |
| 05 | explore-routing | pending |  |
| 06 | explore-revision | pending |  |
| 07 | look-and-feel-revision | pending |  |
| 08 | experience-showcase-revision | pending |  |
| 09 | editorial-motion-revision | pending |  |
| 10 | projects-stack-revision | pending |  |
| 11 | credentials-panel-revision | pending |  |
| 12 | route-swap-promotion | pending |  |
| 13 | mobile-parity-revision | [x] Complete | 2026-10-05 |
