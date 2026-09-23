/**
 * ProjectsSection — Projects panel body (D-01, UI-SPEC §7).
 *
 * Top-6 mini-cards in JSON order (the resume-modal cap precedent), each a
 * single anchor when linked — name with the ↗ arrow plus an optional date
 * tag, opening externally in a new tab — with the full description
 * wrapping and never clipped (§17.5). Hover moves ONLY the name and arrow
 * to the accent color, via the group class on the anchor (W-2 pin). The
 * secondary source link stays out of the card — one link per card (§17.11)
 * — and remains reachable through the terminal pointer below (D-02).
 *
 * ProjectsCalendar (D-07, plan EXPLORE-06) opens the body as the FIRST
 * child — the year-grid bars calendar above the tiles (UI-SPEC §5.1) inside
 * its own mb-5 wrapper exactly like the career-span Gantt's; it hides
 * entirely (wrapper included) when no project date yields geometry (E-2).
 *
 * ProjectStatTiles (D-03) follows — the three JSON-derived summary tiles
 * above the cards — values from viz-data's projectStats (EXPLORE-07); the
 * wrapper's mb-3 gives the intentional 12px tiles→cards gap versus the 8px
 * card-card rhythm (§1). The card map below stays byte-identical.
 *
 * Server component (UI-SPEC §2): no client directive, no hooks — copy
 * arrives entirely from the portfolio data via props (D-07). Graceful-hide
 * (UI-SPEC §11): the date tag renders only when present, an unlinked
 * project renders as a plain div with no hover affordance, and an empty
 * list renders nothing at all — no fallback copy is invented.
 */
import { ArrowUpRight } from 'lucide-react';
import type { PortfolioData } from '@/data/portfolio-main-data';
import { buildProjectCalendar, projectStats } from '../viz-data';
import { TerminalPointer } from './terminal-pointer';
import { ProjectStatTiles } from './project-stat-tiles';
import { ProjectsCalendar } from './projects-calendar';

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
  const calendar = buildProjectCalendar(projects);
  const hasCalendar = calendar.rows.some((row) => row.leftPct !== null);
  return (
    <div className="space-y-2">
      {hasCalendar && (
        <div className="mb-5">
          <ProjectsCalendar calendar={calendar} />
        </div>
      )}
      <div className="mb-3">
        <ProjectStatTiles stats={stats} />
      </div>
      {cards.map((project) => {
        const header = (
          <div className="flex items-baseline justify-between gap-2">
            {project.link ? (
              <span className="flex min-w-0 items-center gap-1 text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                {project.name}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 group-hover:text-accent transition-colors"
                />
              </span>
            ) : (
              <span className="min-w-0 text-sm font-medium text-foreground">
                {project.name}
              </span>
            )}
            {project.date && (
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {project.date}
              </span>
            )}
          </div>
        );
        const body = (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        );
        return project.link ? (
          <a
            key={project.name}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-md border border-border p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          >
            {header}
            {body}
          </a>
        ) : (
          <div
            key={project.name}
            className="block rounded-md border border-border p-3"
          >
            {header}
            {body}
          </div>
        );
      })}
      <TerminalPointer command="projects --all" />
    </div>
  );
}