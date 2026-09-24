/**
 * ProjectsSection — Projects panel body (phase-9 REV-17, UI-SPEC §4).
 *
 * The §4.1 literal DOM sequence (W-1): ProjectStatTiles opens the body —
 * the three JSON-derived summary tiles ABOVE the rows, values from
 * viz-data's projectStats (EXPLORE-07; the wrapper's mb-3 keeps the
 * intentional 12px tiles→rows gap, §1) — then the md+ rows viewport
 * (hidden below md; the explicit U-15 inner height — the sticky recipe
 * minus the measured chrome stack, tunable by design — plus the ONE
 * sanctioned descendant overflow clipping the ±H row sweeps, §1.3) hosting
 * the editorial scroll stage, then the compact card grid (the below-md
 * tier, byte-identical, wrapped in its own container), and
 * TerminalPointer LAST in both tiers (the Experience pointer precedent).
 * The editorial stage is the phase's only scroll-engine import site;
 * ProjectsSection itself stays a server component (no client directive,
 * no hooks — copy arrives entirely from the portfolio data via props,
 * D-07) and hands the client stage the plain top-6 slice as serializable
 * props. md+ rows = the top-6 curated projects in data order as editorial
 * rows (year + name + first-sentence description + link line, thin
 * dividers) entering from below under ONE continuous scroll-linked
 * progress value; both tiers consume the SAME top-6 slice in data order
 * (the promote decision: one data slice, one row identity, two viewport
 * tiers). The card map JSX below stays byte-identical. The phase-6
 * year-grid calendar is GONE (EXPLORE-07 REV-08/D-03) — the body renders
 * tiles + the two tiers only, with no chart import or geometry gate.
 *
 * The unlinked div card stays static — hover must never promise
 * interactivity (§3.2/W-2). The secondary source link stays out of the
 * card — one link per card (§17.11) — and remains reachable through the
 * terminal pointer below (D-02). Graceful-hide (UI-SPEC §11): the date tag
 * renders only when present, an unlinked project renders as a plain div
 * with no hover affordance, and an empty list renders nothing at all — no
 * fallback copy is invented.
 */
import { ArrowUpRight } from 'lucide-react';
import type { PortfolioData } from '@/data/portfolio-main-data';
import { projectStats } from '../viz-data';
import { TerminalPointer } from './terminal-pointer';
import { ProjectStatTiles } from './project-stat-tiles';
import { ProjectsEditorialStage as EditorialStage } from './projects-editorial-stage';

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
      {/* md+ rows viewport: the U-15 explicit inner height (tunable
      13.5–15.5rem by design) + the one sanctioned descendant overflow
      clipping the ±H sweeps — below md the stage is CSS-hidden and the
      compact list owns the surface. */}
      <div className="hidden md:block md:h-[calc(100dvh-14.5rem)] md:overflow-hidden">
        <EditorialStage projects={cards} />
      </div>
      <div className="md:hidden">
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
              className="group block rounded-md border border-border p-3 exp-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
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
      </div>
      <TerminalPointer command="projects --all" />
    </div>
  );
}