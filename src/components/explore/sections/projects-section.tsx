/**
 * ProjectsSection — Projects panel body (phase-10 REV-18/19/20).
 *
 * The panel body opens with the three JSON-derived ProjectStatTiles, followed
 * by the curated stacked-card carousel. The md+ tier renders the scroll-driven
 * framer-motion stage (ProjectsStackStage) inside the pinned viewport; the <md
 * tier renders the simplified state-driven ProjectsMobileStack. The
 * TerminalPointer remains LAST in both tiers. ProjectsSection stays a server
 * component: it imports the client stacks as leaf islands and passes the plain
 * top-6 slice as serializable props.
 *
 * The phase-9 editorial rows and the below-md compact card grid are retired in
 * this phase (stale-test discipline).
 */
import type { PortfolioData } from '@/data/portfolio-main-data';
import { projectStats } from '../viz-data';
import { TerminalPointer } from './terminal-pointer';
import { ProjectStatTiles } from './project-stat-tiles';
import { ProjectsStackStage } from './projects-stack-stage';
import { ProjectsMobileStack } from './projects-mobile-stack';

export function ProjectsSection({
  projects,
}: {
  projects: PortfolioData['projects'];
}) {
  const cards = projects.slice(0, 6);
  if (cards.length === 0) {
    return null;
  }
  const stats = projectStats(projects);
  return (
    <div className="space-y-2">
      <div className="mb-3">
        <ProjectStatTiles stats={stats} />
      </div>
      {/* md+ stack viewport: the pinned stage with the scroll-driven carousel. */}
      <div className="hidden md:block md:h-[calc(100dvh-14.5rem)] md:overflow-hidden">
        <ProjectsStackStage projects={cards} />
      </div>
      {/* <md simplified state-driven stack — replaces the phase-9 compact grid. */}
      <div className="md:hidden">
        <ProjectsMobileStack projects={cards} />
      </div>
      <TerminalPointer command="projects --all" />
    </div>
  );
}
