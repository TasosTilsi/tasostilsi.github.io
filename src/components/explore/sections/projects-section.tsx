/**
 * ProjectsSection — Projects panel body (phase-10 REV-21).
 *
 * The panel body opens with the three JSON-derived ProjectStatTiles, followed
 * by the swipe-driven stacked-card carousel. Both tiers now use the same
 * Tinder-style ring-buffer drag/keyboard choreography via ProjectsSwipeStack;
 * the md+ stage renders the full-depth composition, while the <md surface
 * renders the simplified compact composition. The TerminalPointer remains LAST.
 *
 * ProjectsSection stays a server component: it imports the client stacks as
 * leaf islands and passes the plain top-6 slice as serializable props. The
 * scroll-driven wrapper and 300vh sticky range are retired.
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
      {/* md+ full-depth swipe stack. */}
      <div className="hidden md:block">
        <ProjectsStackStage projects={cards} />
      </div>
      {/* <md compact swipe stack. */}
      <div className="md:hidden">
        <ProjectsMobileStack projects={cards} />
      </div>
      <TerminalPointer command="projects --all" />
    </div>
  );
}
