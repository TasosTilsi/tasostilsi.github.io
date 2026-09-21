/**
 * ProjectStatTiles — the three D-03 summary tiles (UI-SPEC §5).
 *
 * Server component, pure CSS: values arrive precomputed from viz-data's
 * projectStats (D-05) — this file computes nothing (EXPLORE-07). A fixed
 * 3-up grid that never stacks (§5: values are tiny; 3-up holds at 311px);
 * tile anatomy mirrors the project cards for family resemblance. The
 * active-years tile keeps the grid alive with an em-dash placeholder when
 * no project date parses (E-9). Plain-text values and labels read as pairs
 * in DOM order (§9); static chrome — no hover, focus, cursor (§6).
 */
import type { ProjectStats } from '../viz-data';

export function ProjectStatTiles({ stats }: { stats: ProjectStats }) {
  const tiles = [
    { value: String(stats.total), label: 'Projects' },
    { value: stats.activeYearsSpan ?? '—', label: 'Active Years' },
    { value: String(stats.linked), label: 'Linked' },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-md border border-border p-2.5">
          <p className="text-sm font-medium leading-none tabular-nums text-foreground">
            {tile.value}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            {tile.label}
          </p>
        </div>
      ))}
    </div>
  );
}