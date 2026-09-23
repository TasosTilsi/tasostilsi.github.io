/**
 * ProjectsCalendar — pure CSS year-grid bars calendar (D-07, UI-SPEC §5).
 *
 * The Gantt precedent (career-span-chart.tsx): a dumb server renderer of the
 * percentages precomputed by viz-data's buildProjectCalendar. No client
 * directive, no hooks, no chart library; fully present in the static export
 * without JS.
 *
 * Geometry: full-year columns from the data's minimum year through the
 * render-time year; a 'Month YYYY' ship date places a one-month-cell bar, a
 * year-only date spans its full year (OQ-1 — the year is the precision the
 * data carries, no month invented; recorded override of the stale UI-SPEC
 * §5.4 no-bar reading), and a date-less project ('Ongoing') renders its row
 * with the track and NO bar — geometry is never invented (E-1). Rows render
 * in JSON order (R-4/E-6 — no sorting). Zero rows with geometry → the whole
 * calendar graceful-hides (E-2, the projects-section wrapper gates with it).
 *
 * Data fidelity: name and date render VERBATIM AS STORED. Accessibility
 * (§5.5): tracks and bars are aria-hidden; year ticks and row text are real
 * DOM text — assistive tech gets a natural project+date list, no ARIA
 * duplication, no role="img". Static chrome: no hover, focus, cursor, or
 * animation affordances (§17.6).
 */
import type { ProjectCalendarData } from '../viz-data';

export function ProjectsCalendar({ calendar }: { calendar: ProjectCalendarData }) {
  const hasBars = calendar.rows.some((row) => row.leftPct !== null);
  if (!hasBars) {
    return null; // E-2: no parseable ship date → the calendar hides entirely
  }
  const totalColumns = calendar.endYear - calendar.startYear + 1;
  return (
    <div
      aria-label={`Projects calendar — ${calendar.rows.length} projects across ${totalColumns} years.`}
    >
      <div className="relative mb-2 h-4 border-b border-border">
        {calendar.yearColumns.map((year) => (
          <span
            key={year}
            className="absolute top-0 -translate-x-1/2 text-[10px] tabular-nums text-muted-foreground"
            style={{ left: `${((year - calendar.startYear) / totalColumns) * 100}%` }}
          >
            {year}
          </span>
        ))}
      </div>
      <div className="space-y-3">
        {calendar.rows.map((row) => (
          <div key={`${row.name}-${row.index}`}>
            <div className="flex justify-between gap-2">
              <span className="min-w-0 text-xs font-medium text-foreground">
                {row.name}
              </span>
              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                {row.date}
              </span>
            </div>
            <div
              className="relative mt-1 h-2 w-full rounded-full bg-muted"
              aria-hidden="true"
            >
              {row.leftPct !== null && row.widthPct !== null && (
                <div
                  className="absolute inset-y-0 rounded-full bg-chart-4"
                  style={{
                    left: `${row.leftPct}%`,
                    width: `${row.widthPct}%`,
                    minWidth: 2,
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}