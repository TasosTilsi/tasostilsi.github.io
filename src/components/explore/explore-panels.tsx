/**
 * ExplorePanels — the main-area panel grid (phase EXPLORE-02; REV-04 2×2 rebalance).
 *
 * Four panels from EXPLORE_SECTIONS in locked order — About and Contact are
 * merged into one panel (D-05: the contact panel's anatomy lives inside
 * AboutSection; the standalone Contact panel is gone) — each rendered through
 * the shared PanelShell chrome (stable section id + accent chip + label
 * row + body slot, byte-identical to the phase-1 shell) whose body comes
 * from the SECTION_BODIES registry — a total adapter-closure map from the
 * whole PortfolioData prop down to each section's slice props, keeping the
 * data flow server-side and SSG-safe (page → panels → sections as typed
 * props, UI-SPEC §2, D-07). All four sections are registered: every panel
 * renders its data-driven body and nothing else — no humor lines and no
 * loading shimmer anywhere (D-06, EXPLORE-07).
 *
 * Responsive grid (REV-04/D-04): 1 column base, 2 columns from md up (the
 * lg tier drops from 3 to 2) so natural DOM order yields
 * [about+contact | experience] / [skills | projects] — no col-span classes
 * anywhere, hence zero empty cells at 375px (1 col) and at 768/1440/1920
 * (2×2). Full-bleed inside the main scroll container (padding lands via
 * ExploreShell's p-4 md:p-6 — no max-width wrapper here).
 *
 * Panels are static cards (UI-SPEC §17.6) — no interaction states of any
 * kind on the containers; only links inside bodies are interactive.
 */
import type { ComponentType } from 'react';
import { EXPLORE_SECTIONS, type ExploreSectionId } from './constants';
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
  skills: ({ data }) => <SkillsSection skills={data.skills} experience={data.experience} />,
};

export function ExplorePanels({ data }: { data: PortfolioData }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {EXPLORE_SECTIONS.map((section) => {
        const Body = SECTION_BODIES[section.id];
        return (
          <PanelShell
            key={section.id}
            id={section.id}
            label={section.label}
            accent={ACCENTS[section.id]}
          >
            <Body data={data} />
          </PanelShell>
        );
      })}
    </div>
  );
}