/**
 * ExplorePanels — the main-area panel grid (phase EXPLORE-02, plan 01).
 *
 * Five panels from EXPLORE_SECTIONS in locked order, each rendered through
 * the shared PanelShell chrome (stable section id + accent chip + label
 * row + body slot, byte-identical to the phase-1 shell) whose body comes
 * from the SECTION_BODIES registry — an adapter-closure map from the whole
 * PortfolioData prop down to each section's slice props, keeping the data
 * flow server-side and SSG-safe (page → panels → sections as typed props,
 * UI-SPEC §2, D-07). Panels whose body is not registered yet render the
 * transitional placeholder body below (humor line + two skeleton lines,
 * phase-1 anatomy minus the About-only third line) until plan 02 task 3
 * removes it (D-06: humor replaced by real content, EXPLORE-07).
 *
 * Responsive grid (EXPLORE-06): 1 column base, 2 at md, 3 at lg; About
 * spans both wider layouts so natural DOM order yields
 * [about about][experience skills][projects contact] at md and
 * [about about experience][skills projects contact] at lg. Full-bleed
 * inside the main scroll container (padding lands via ExploreShell's
 * p-4 md:p-6 — no max-width wrapper here).
 *
 * Panels are static cards (UI-SPEC §17.6) — no interaction states of any
 * kind on the containers; only links inside bodies are interactive
 * (charts phase 3, visited tracking phase 4 — the status-bar counter
 * stays the plan-01 static 0/5, D-03).
 */
import type { ComponentType } from 'react';
import {
  EXPLORE_SECTIONS,
  EXPLORE_PANEL_HUMOR,
  type ExploreSectionId,
} from './constants';
import { PanelShell } from './panel-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { AboutSection } from './sections/about-section';
import { ContactSection } from './sections/contact-section';
import type { PortfolioData } from '@/data/portfolio-main-data';

/** Chip accent per section order: About=chart-1 … Contact=chart-5 (UI-SPEC §6). */
const ACCENTS: Record<ExploreSectionId, string> = {
  about: 'bg-chart-1',
  experience: 'bg-chart-2',
  skills: 'bg-chart-3',
  projects: 'bg-chart-4',
  contact: 'bg-chart-5',
};

type SectionBodyProps = { data: PortfolioData };

/**
 * Adapter-closure registry: section id → body component over the whole
 * PortfolioData. Adapters map the whole data object to each section's
 * slice prop, so a bare component literal would not typecheck — the
 * closure form is the pinned registry shape (plan 01 task 1).
 */
const SECTION_BODIES: Partial<
  Record<ExploreSectionId, ComponentType<SectionBodyProps>>
> = {
  about: ({ data }) => <AboutSection about={data.about} />,
  contact: ({ data }) => <ContactSection contact={data.about.contact} />,
};

/**
 * Transitional placeholder body — the phase-1 placeholder anatomy (humor
 * line + two skeleton lines) for panels whose real body is not registered
 * yet. Removed outright by plan 02 task 3 (D-06: every placeholder humor
 * line replaced by real content).
 */
function PlaceholderBody({ id }: { id: ExploreSectionId }) {
  return (
    <>
      <p className="mt-1 text-xs text-muted-foreground">
        {EXPLORE_PANEL_HUMOR[id]}
      </p>
      <div aria-hidden="true" className="mt-3 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </>
  );
}

export function ExplorePanels({ data }: { data: PortfolioData }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {EXPLORE_SECTIONS.map((section) => {
        const Body = SECTION_BODIES[section.id];
        return (
          <PanelShell
            key={section.id}
            id={section.id}
            label={section.label}
            accent={ACCENTS[section.id]}
            className={
              section.id === 'about' ? 'md:col-span-2 lg:col-span-2' : undefined
            }
          >
            {Body ? <Body data={data} /> : <PlaceholderBody id={section.id} />}
          </PanelShell>
        );
      })}
    </div>
  );
}