/**
 * ProjectsSection — Projects panel body (phase-10 REV-18).
 *
 * The panel body opens with the three JSON-derived ProjectStatTiles, followed
 * by the swipe-driven stacked-card carousel. ONE contract at every width
 * (phase 13 REV-23b / D-02): the same Tinder-style ring-buffer drag/keyboard
 * choreography renders unconditionally — the <md wrapper that delegated to a
 * 320px-capped variant is retired, so the phone gets the full-depth
 * composition (every depth card visible, centred, shadowed, draggable). The
 * TerminalPointer remains LAST.
 *
 * ProjectsSection stays a server component: it imports the client stack as a
 * leaf island and passes the plain top-6 slice as serializable props. The
 * scroll-driven wrapper and 300vh sticky range are retired.
 */
import type { PortfolioData } from '@/data/portfolio-main-data';
import { projectStats } from '../viz-data';
import { TerminalPointer } from './terminal-pointer';
import { ProjectStatTiles } from './project-stat-tiles';
import { ProjectsStackStage } from './projects-stack-stage';

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
      {/* ONE swipe stack at every width (REV-23b) — no viewport branch. */}
      <ProjectsStackStage projects={cards} />
      <TerminalPointer command="projects --all" />
    </div>
  );
}
