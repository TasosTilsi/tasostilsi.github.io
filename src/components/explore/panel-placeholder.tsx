/**
 * PanelPlaceholder — placeholder panel anatomy (D-06, UI-SPEC §6).
 *
 * Top to bottom: header row (8×8px aria-hidden accent chip in the section's
 * chart-N color + the locked section label as text-sm font-medium), the
 * humor line (text-xs muted-foreground — may wrap, never truncate), and the
 * Skeleton placeholder body from the existing ui/skeleton (two h-3 lines at
 * w-3/4 and w-1/2, plus a third h-3 w-2/3 when `extraLine` — the wide About
 * panel gets 3 lines).
 *
 * NON-INTERACTIVE, pinned (UI-SPEC §17.6): no hover affordance, no pointer
 * cursor, not focusable — a hover style would promise navigation that does
 * not exist until later phases. Stable section id lands on the <section>
 * so drawer anchors and no-JS hash navigation resolve against it.
 *
 * `className` carries grid placement (the About panel's responsive span
 * from ExplorePanels); everything else is fixed chrome.
 */
import { Skeleton } from '@/components/ui/skeleton';
import type { ExploreSectionId } from './constants';

export function PanelPlaceholder({
  id,
  label,
  humor,
  accent,
  extraLine,
  className,
}: {
  id: ExploreSectionId;
  label: string;
  humor: string;
  accent: string;
  extraLine?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`rounded-md border bg-card p-4${className ? ` ${className}` : ''}`}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rounded-full ${accent}`}
        />
        <h2 className="text-sm font-medium">{label}</h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{humor}</p>
      <div aria-hidden="true" className="mt-3 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        {extraLine && <Skeleton className="h-3 w-2/3" />}
      </div>
    </section>
  );
}