/**
 * ExplorePanels — the main-area placeholder grid (D-01, D-06, UI-SPEC §6).
 *
 * Five panels from EXPLORE_SECTIONS in locked order, each with a stable
 * section id (the drawer's anchor target + no-JS hash fallback, UI-SPEC
 * §14#15), the §6 anatomy via PanelPlaceholder, a fixed chart-N accent
 * (About=chart-1 … Contact=chart-5 — same mapping as the drawer digits),
 * the locked humor line from EXPLORE_PANEL_HUMOR, and Skeleton bodies.
 *
 * Responsive grid (EXPLORE-06): 1 column base, 2 at md, 3 at lg; About
 * spans both wider layouts so natural DOM order yields
 * [about about][experience skills][projects contact] at md and
 * [about about experience][skills projects contact] at lg. Full-bleed
 * inside the main scroll container (padding lands via ExploreShell's
 * p-4 md:p-6 — no max-width wrapper here).
 *
 * Panels are static cards (UI-SPEC §17.6) — no interaction states of any
 * kind; real content is phase 2, charts phase 3, visited tracking phase 4
 * (the status-bar counter stays the plan-01 static 0/5, D-03).
 */
import {
  EXPLORE_SECTIONS,
  EXPLORE_PANEL_HUMOR,
  type ExploreSectionId,
} from './constants';
import { PanelPlaceholder } from './panel-placeholder';

/** Chip accent per section order: About=chart-1 … Contact=chart-5 (UI-SPEC §6). */
const ACCENTS: Record<ExploreSectionId, string> = {
  about: 'bg-chart-1',
  experience: 'bg-chart-2',
  skills: 'bg-chart-3',
  projects: 'bg-chart-4',
  contact: 'bg-chart-5',
};

export function ExplorePanels() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {EXPLORE_SECTIONS.map((section) => (
        <PanelPlaceholder
          key={section.id}
          id={section.id}
          label={section.label}
          humor={EXPLORE_PANEL_HUMOR[section.id]}
          accent={ACCENTS[section.id]}
          extraLine={section.id === 'about'}
          className={
            section.id === 'about' ? 'md:col-span-2 lg:col-span-2' : undefined
          }
        />
      ))}
    </div>
  );
}