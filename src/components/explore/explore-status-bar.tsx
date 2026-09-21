/**
 * ExploreStatusBar — bottom status bar (UI-SPEC §7, D-03).
 *
 * Plain presentational component (no "use client" — it is rendered inside the
 * client shell). Left: locked breadcrumb `guest@tasostilsi:~/explore`
 * (contiguous text, colors only). Right: live theme label + the STATIC
 * `0/5 sections visited` counter — the 5 derives from EXPLORE_SECTIONS, the 0
 * is a literal until phase 4 wires real exploration progress (D-03).
 *
 * Hydration contract (UI-SPEC §7): SSR/first paint renders "dark"; the
 * one-shot after-mount sync lives in use-explore-theme — never lazy-init
 * this label from documentElement during render.
 */
import {
  EXPLORE_SECTIONS,
  EXPLORE_STATUS_PATH,
  EXPLORE_STATUS_USER,
} from './constants';

export function ExploreStatusBar({ theme }: { theme: string }) {
  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t px-3 text-[10px] sm:h-8 sm:px-4 sm:text-xs">
      <p>
        <span className="text-accent">{EXPLORE_STATUS_USER}</span>
        <span className="text-muted-foreground">{EXPLORE_STATUS_PATH}</span>
      </p>
      <p aria-live="polite" className="text-muted-foreground">
        <span>{theme}</span>
        <span>{' · '}</span>
        <span>{`0/${EXPLORE_SECTIONS.length} sections visited`}</span>
      </p>
    </footer>
  );
}