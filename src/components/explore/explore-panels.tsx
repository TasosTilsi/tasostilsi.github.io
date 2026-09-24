/**
 * ExplorePanels — the main-area panel grid (phase EXPLORE-02; phase-8 D-01
 * rebalance).
 *
 * Four panels from EXPLORE_SECTIONS in locked DOM order — About and Contact
 * are merged into one panel (D-05: the contact panel's anatomy lives inside
 * AboutSection; the standalone Contact panel is gone) — each rendered through
 * the shared PanelShell chrome (stable section id + accent chip + label
 * row + body slot, byte-identical to the phase-1 shell) whose body comes
 * from the SECTION_BODIES registry — a total adapter-closure map from the
 * whole PortfolioData prop down to each section's slice props, keeping the
 * data flow server-side and SSG-safe (page → panels → sections as typed
 * props, UI-SPEC §2, D-07). All four sections are registered: every panel
 * renders its data-driven body and nothing else (D-06, EXPLORE-07).
 *
 * Phase-8 grid rebalance (D-01, UI-SPEC §1.1): at md+ the Experience panel
 * spans both columns as row 1 — its PanelShell is wrapped in a plain div
 * (the extended sticky-range wrapper) carrying the order-first + span-2 +
 * extended-height classes, while the sticky + pin-viewport classes ride the
 * existing PanelShell className param (R-1: the chrome itself is
 * byte-identical; R-3: the wrapper is a plain div with NO id — the tour
 * hole, the IO threshold and the drawer anchors all measure the sticky
 * section by its stable id). Projects spans row 3 full-width — the derived
 * completion of D-01's two named rows under the no-empty-cells acceptance
 * (4 panels − 2×(span-2) = rows [EXP] / [About|Skills] / [Projects], zero
 * empties). Placement is a data-driven Record lookup keyed by
 * ExploreSectionId — no id-comparison conditional — and BOTH Experience
 * placements are conditional on the filtered timeline roles (W-3):
 * selectTimelineRoles(...).length > 1 extends the wrapper into the sticky
 * range; ≤1 role renders natural height with no sticky (E-1/E-2). DOM
 * order, the map-derived index chips (02 stays on Experience) and the
 * entrance-stagger nth-child delays are untouched (R-1/R-2);
 * the order-first placement only re-sorts grid auto-placement (visual-only
 * per CSS
 * Grid §4.4 — speech order and navigation stay on the source order).
 *
 * Responsive grid: 1 column base, 2 columns from md up, gutters widen
 * gap-4 → gap-5 at the lg tier ONLY (D-02, UI-SPEC §1.2 — no max-width
 * wrapper here; full-bleed inside the main scroll container, padding lands
 * via ExploreShell's p-4 md:p-6). Every placement/height utility is
 * md:-scoped so the base grid stays 1-col at 375px (R-9); no overflow
 * utility exists anywhere on the wrapper/stage/grid chain — the
 * sticky-breaker audit (UI-SPEC §1.1) keeps position:sticky attaching to
 * the <main> scrollport.
 *
 * The panel-grid class is the DOM hook the phase-3 entrance stagger targets
 * (UI-SPEC §6.2): four grid children in DOM order (the wrapper counts as
 * one), animated purely by CSS keyframes in globals.css under the
 * .explore-shell scope — zero JSX animation wiring, SSG-safe.
 *
 * D-02 hierarchy device (UI-SPEC §5): each PanelShell header receives the
 * zero-padded mono index 01–04 derived from the EXPLORE_SECTIONS map index
 * (String(index + 1).padStart(2, '0')) — data-driven, no literals in JSX.
 *
 * Panels are static cards (UI-SPEC §17.6) — no interaction states on the
 * containers; only links and the timeline stage's two controls inside
 * bodies are interactive.
 */
import type { ComponentType } from 'react';
import { EXPLORE_SECTIONS, type ExploreSectionId } from './constants';
import { selectTimelineRoles } from './timeline-geometry';
import { PanelShell } from './panel-shell';
import { AboutSection } from './sections/about-section';
import { ExperienceSection } from './sections/experience-section';
import { ProjectsSection } from './sections/projects-section';
import { SkillsSection } from './sections/skills-section';
import type { PortfolioData } from '@/data/portfolio-main-data';

/** Chip accent per section order: About=chart-1 … Projects=chart-4 (UI-SPEC §6). */
const ACCENTS: Record<ExploreSectionId, string> = {
  about: 'bg-chart-1',
  experience: 'bg-chart-2',
  skills: 'bg-chart-3',
  projects: 'bg-chart-4',
};

type SectionBodyProps = { data: PortfolioData };

/**
 * Total adapter-closure registry: section id → body component over the
 * whole PortfolioData. Adapters map the whole data object to each
 * section's slice prop, so a bare component literal would not typecheck —
 * the closure form is the pinned registry shape (plan 01 task 1). Total
 * since the REV-04 merge: four closures over four sections, no fallback
 * body path (D-04/D-05).
 */
const SECTION_BODIES: Record<
  ExploreSectionId,
  ComponentType<SectionBodyProps>
> = {
  about: ({ data }) => <AboutSection about={data.about} />,
  experience: ({ data }) => <ExperienceSection experience={data.experience} />,
  projects: ({ data }) => <ProjectsSection projects={data.projects} />,
  skills: ({ data }) => <SkillsSection skills={data.skills} competencies={data.core_competencies} />,
};

/**
 * Placement map (UI-SPEC §1.1 — the phase-8 seam 4): a data-driven Record
 * keyed by ExploreSectionId whose values carry the ONLY three placement
 * classes of the phase — the Experience wrapper (leads row 1, spans both
 * columns, extends the sticky scroll range) and shell (pins inside the
 * range, above the later siblings via the explicit z-index the research
 * stacking pitfall requires), plus the Projects shell (spans row 3). About
 * and Skills occupy one cell each. Every value is md:-scoped (R-9) and
 * applied CONDITIONALLY on the filtered role count (W-3): ≤1 timeline role
 * → natural height, no pin, E-1/E-2 honoured.
 */
const PLACEMENT: Record<ExploreSectionId, { wrapper: string; shell: string }> = {
  about: { wrapper: '', shell: '' },
  experience: {
    wrapper: 'md:order-first md:col-span-2 md:h-[300vh]',
    shell: 'md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]',
  },
  skills: { wrapper: '', shell: '' },
  projects: { wrapper: '', shell: 'md:col-span-2' },
};

export function ExplorePanels({ data }: { data: PortfolioData }) {
  // W-3: the extension is DATA-CONDITIONAL, not a static class — the
  // filtered timeline roles decide whether the sticky range exists at all.
  const extended = selectTimelineRoles(data.experience).length > 1;
  return (
    <div className="grid panel-grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
      {EXPLORE_SECTIONS.map((section, index) => {
        const Body = SECTION_BODIES[section.id];
        const placement = PLACEMENT[section.id];
        const shell = (
          <PanelShell
            key={section.id}
            id={section.id}
            label={section.label}
            accent={ACCENTS[section.id]}
            index={String(index + 1).padStart(2, '0')}
            className={extended && placement.shell ? placement.shell : undefined}
          >
            <Body data={data} />
          </PanelShell>
        );
        if (!placement.wrapper) {
          return shell;
        }
        // R-3: plain wrapper — no id, no chrome. The entrance stagger
        // animates it as the grid child; the sticky section inside keeps
        // the stable section id the tour/IO/drawer flows measure.
        return (
          <div key={section.id} className={extended ? placement.wrapper : undefined}>
            {shell}
          </div>
        );
      })}
    </div>
  );
}