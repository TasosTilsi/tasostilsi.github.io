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
 * Phase-9 grid reflow (REV-14, D-01, UI-SPEC §1.1): the DOM order IS the
 * visual order — EXPLORE_SECTIONS is reordered to [about, skills, experience,
 * projects], so About+Contact and Skills lead row 1, Experience lands
 * full-width row 2 and Projects spans row 3, EACH now carrying its own
 * sticky range (wrapper span-2 + extended height, shell pinned inside it —
 * the W-3 pair below; two sequential ranges, E-15). The order-first utility
 * RETIRED with the reflow — DOM order = tab order = visual order, the
 * speech-order caveat is gone. The index chips
 * (01 About · 02 Skills · 03 Experience · 04 Projects) and the entrance-
 * stagger nth-child delays re-derive from the array/DOM position — zero
 * literal renumbering. The placement map stays the data-driven Record keyed
 * by ExploreSectionId — no id-comparison conditional. EACH system's sticky
 * placements are conditional on its own data gate (W-3, the phase-9 pair):
 * experience on the selected-entry count (tech roles ∪ featured education,
 * the pure module's ONE derivation) > 1, projects on the top-6 slice > 1 —
 * ≤1 renders natural height with no sticky (E-1/E-2).
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
import { selectTimelineEntries } from './timeline-geometry';
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
  experience: ({ data }) => <ExperienceSection experience={data.experience} education={data.education} />,
  projects: ({ data }) => <ProjectsSection projects={data.projects} />,
  skills: ({ data }) => <SkillsSection skills={data.skills} competencies={data.core_competencies} />,
};

/**
 * Placement map factory (UI-SPEC §1.1/§4.1 — the phase-9 seam): a Record
 * keyed by ExploreSectionId whose values carry the ONLY placement classes
 * of the phase — the Experience AND Projects wrappers (each spans both
 * columns and extends ITS OWN sticky scroll range) and shells (each pins
 * inside its range, above the later siblings via the explicit z-index the
 * research stacking pitfall requires; E-15: two SEQUENTIAL sticky ranges on
 * one page — wrappers never overlap, both shells md:z-10). About and Skills
 * occupy one cell each in row 1. Every value is md:-scoped (R-9). The W-3
 * pair rides IN the map as data-derived gate booleans — experience on the
 * merged timeline entries > 1 (plan-01's ONE derivation preserved),
 * projects on the top-6 slice > 1 (the W-3 mirror; ≤1 project → natural
 * height, no pin, E-1/E-2 honoured) — so the render loop reads
 * placement.gate with NO section-id conditionals (the shell test pin
 * holds). R-3: any wrapper stays a plain div with NO id — the tour hole,
 * the IO threshold and the drawer anchors measure the sticky section by
 * its stable id; the wrapper carries the stage's scroll-target data
 * attribute instead, the
 * projects stage's useScroll target.
 */
function buildPlacement(
  data: PortfolioData,
): Record<ExploreSectionId, { wrapper: string; shell: string; gate: boolean }> {
  const experienceGate =
    selectTimelineEntries(data.experience, data.education).length > 1;
  const projectsGate = data.projects.slice(0, 6).length > 1;
  return {
    about: { wrapper: '', shell: '', gate: false },
    experience: {
      wrapper: 'md:col-span-2 md:h-[300vh]',
      shell: 'md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]',
      gate: experienceGate,
    },
    skills: { wrapper: '', shell: '', gate: false },
    projects: {
      wrapper: 'md:col-span-2 md:h-[300vh]',
      shell: 'md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]',
      gate: projectsGate,
    },
  };
}

export function ExplorePanels({ data }: { data: PortfolioData }) {
  // W-3 pair: each sticky extension is DATA-CONDITIONAL per system — the
  // placement factory carries each gate (no section-id conditionals; the
  // shell test pin holds).
  const PLACEMENT = buildPlacement(data);
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
            className={placement.gate && placement.shell ? placement.shell : undefined}
          >
            <Body data={data} />
          </PanelShell>
        );
        if (!placement.wrapper) {
          return shell;
        }
        // R-3: plain wrapper — no id, no chrome; the scroll-target data
        // attribute below is the projects stage's useScroll target. The
        // entrance stagger animates
        // it as the grid child; the sticky section inside keeps the stable
        // section id the tour/IO/drawer flows measure.
        return (
          <div
            key={section.id}
            className={placement.gate ? placement.wrapper : undefined}
            data-editorial-wrapper="true"
          >
            {shell}
          </div>
        );
      })}
    </div>
  );
}