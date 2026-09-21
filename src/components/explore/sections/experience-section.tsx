/**
 * ExperienceSection — Experience panel body (D-01, UI-SPEC §5).
 *
 * Vertical timeline with a git-log feel (D-04): a continuous rail (the
 * ordered list's left border), one entry per role with an 8px chart-2 dot
 * centered on the rail, then title, company, duration (rendered AS
 * STORED — dash style is never normalized) and the full street-address
 * location exactly as kept (strict data fidelity), followed by up to
 * three responsibility bullets.
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
              <p className="text-xs text-muted-foreground tabular-nums">
                {entry.duration}
              </p>
              <p className="text-xs text-muted-foreground">{entry.location}</p>
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