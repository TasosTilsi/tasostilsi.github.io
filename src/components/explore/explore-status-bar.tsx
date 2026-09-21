/**
 * ExploreStatusBar — bottom status bar (UI-SPEC §7, D-03).
 *
 * Plain presentational component (no "use client" — it is rendered inside the
 * client shell). Left: locked breadcrumb `guest@tasostilsi:~/explore`
 * (contiguous text, colors only). Right: live theme label + the LIVE
 * `N/5 sections visited` counter (EXPLORE-04c, D-06) — N flows in from
 * ExploreShell's single useExploreVisited instance as the visitedCount prop
 * (drawer anchors, manual scroll, and wizard arrivals all mark through that
 * one IO path); the 5 derives from EXPLORE_SECTIONS and the string format is
 * byte-identical to the pre-phase literal. At 5/5 the counter span renders
 * text-accent — the phase's only celebration visual (E-13; no toast, no
 * confetti — dropped scope).
 *
 * Hydration contract (UI-SPEC §7): SSR/first paint renders "dark" and the
 * literal-0 counter; the one-shot after-mount syncs live in use-explore-theme
 * and use-explore-visited — storage is never read during render.
 */
import {
  EXPLORE_SECTIONS,
  EXPLORE_STATUS_PATH,
  EXPLORE_STATUS_USER,
  ExploreTheme,
} from './constants';

export function ExploreStatusBar({
  theme,
  visitedCount,
}: {
  theme: ExploreTheme;
  visitedCount: number;
}) {
  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t px-3 text-[10px] sm:h-8 sm:px-4 sm:text-xs">
      <p>
        <span className="text-accent">{EXPLORE_STATUS_USER}</span>
        <span className="text-muted-foreground">{EXPLORE_STATUS_PATH}</span>
      </p>
      <p aria-live="polite" className="text-muted-foreground">
        <span>{theme}</span>
        <span>{' · '}</span>
        <span
          className={
            visitedCount === EXPLORE_SECTIONS.length
              ? 'text-accent'
              : 'text-muted-foreground'
          }
        >
          {`${visitedCount}/${EXPLORE_SECTIONS.length} sections visited`}
        </span>
      </p>
    </footer>
  );
}