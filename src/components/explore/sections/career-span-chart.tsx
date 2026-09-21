/**
 * CareerSpanChart — pure CSS career-span Gantt (D-02, UI-SPEC §4).
 *
 * The approved roadmap deviation: NOT a recharts chart — a dumb server
 * renderer of the percentages precomputed by viz-data's buildCareerSpan
 * (D-05). No client directive, no hooks, no chart library; fully present
 * in the static export without JS.
 *
 * Geometry: shared year axis from the parsed duration strings; 'Present'
 * extends to the axis end; an end beyond now clamps (E-4); degenerate
 * spans stay visible via min-width 2px (E-5). An unparseable duration
 * renders its row text with the full-span track and NO bar — geometry is
 * never invented (E-1). When every row lacks geometry the whole chart
 * graceful-hides (E-2).
 *
 * Data fidelity: role title, company, and duration render VERBATIM AS
 * STORED — dash styles are display data, never normalized; the parser
 * touches geometry only. Rows render in JSON order (R-4/E-6 — no sorting).
 *
 * Accessibility (§9): bars and tracks carry no text and are aria-hidden;
 * year ticks and all row text are real DOM text, giving assistive tech a
 * natural 7-item role+duration list with no ARIA duplication. Static
 * chrome: no hover, focus, cursor, or animation affordances (§6/D-04).
 */
import type { CareerSpanData } from '../viz-data';

export function CareerSpanChart({ span }: { span: CareerSpanData }) {
  const hasBars = span.rows.some((row) => row.leftPct !== null);
  if (!hasBars) {
    return null; // E-2: no parseable duration → the Gantt hides entirely
  }
  return (
    <div>
      <div className="relative mb-2 h-4 border-b border-border">
        {span.yearTicks.map((tick) => (
          <span
            key={tick.year}
            className="absolute top-0 -translate-x-1/2 text-[10px] tabular-nums text-muted-foreground"
            style={{ left: `${tick.leftPct}%` }}
          >
            {tick.year}
          </span>
        ))}
      </div>
      <div className="space-y-3">
        {span.rows.map((row) => (
          <div key={`${row.company}-${row.index}`}>
            <div className="flex justify-between gap-2">
              <span className="min-w-0 text-xs font-medium text-foreground">
                {row.title}
              </span>
              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                {row.duration}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">{row.company}</p>
            <div
              className="relative mt-1 h-2 w-full rounded-full bg-muted"
              aria-hidden="true"
            >
              {row.leftPct !== null && row.widthPct !== null && (
                <div
                  className={`absolute inset-y-0 rounded-full ${
                    row.isTechRelated ? 'bg-chart-2' : 'bg-muted-foreground'
                  }`}
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