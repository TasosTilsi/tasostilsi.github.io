/**
 * ExperienceSection — Experience panel body (D-01/D-03, UI-SPEC §3.1).
 *
 * Vertical timeline with a git-log feel (D-04): a continuous rail (the
 * ordered list's left border), one entry per role with an 8px chart-2 dot
 * centered on the rail, then title, company, ONE merged meta line — the
 * duration (tabular-nums) and the full street-address location joined by an
 * aria-hidden " · " separator, both rendered AS STORED (dash style never
 * normalized, strict data fidelity; U-8) — followed by up to three
 * responsibility bullets.
 *
 * The career-span Gantt is GONE (EXPLORE-07 REV-08/D-03): the rail+dots
 * timeline is the first body child and the section imports no chart
 * machinery. REV-07 stays deferred — this is taste-level polish on the
 * existing presentation, not a new layout (D-03/D-05).
 *
 * Caps (D-01): the first three entries in JSON order — the array is
 * reverse-chronological, so NO sorting and NO tech-relatedness filter
 * (the Resume* filter pattern must not leak in). Bullets: first three of
 * the variable-length responsibilities list — fewer renders what exists,
 * absent/empty omits the whole list (graceful-hide, UI-SPEC §11; no
 * padding, no invented copy). An empty role list renders nothing at all.
 * A static terminal pointer (D-02) closes the body.
 *
 * Server component (UI-SPEC §2): no client directive, no hooks. All
 * timeline elements are static — no hover/press/cursor affordance
 * (§17.6). Content text wraps fully, never clipped (UI-SPEC §3).
 */
import type { PortfolioData } from '@/data/portfolio-main-data';
import { TerminalPointer } from './terminal-pointer';

export function ExperienceSection({
  experience,
}: {
  experience: PortfolioData['experience'];
}) {
  const roles = experience.slice(0, 3);
  if (roles.length === 0) {
    return null; // whole list empty → block renders nothing (§11)
  }
  return (
    <div>
      <ol className="relative space-y-5 border-l border-border">
        {roles.map((entry, index) => {
          const bullets = (entry.responsibilities ?? []).slice(0, 3);
          return (
            <li
              key={`${entry.company}-${entry.duration}-${index}`}
              className="relative pl-4"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-chart-2"
              />
              <h3 className="text-sm font-medium text-foreground">
                {entry.title}
              </h3>
              <p className="mt-0.5 text-xs text-foreground">{entry.company}</p>
              <p className="text-xs text-muted-foreground">
                <span className="tabular-nums">{entry.duration}</span>
                <span aria-hidden="true"> · </span>
                {entry.location}
              </p>
              {bullets.length > 0 && (
                <ul className="mt-2 space-y-1.5 list-disc pl-4 marker:text-muted-foreground">
                  {bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-xs leading-relaxed text-muted-foreground"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
      <TerminalPointer command="experience --all" />
    </div>
  );
}