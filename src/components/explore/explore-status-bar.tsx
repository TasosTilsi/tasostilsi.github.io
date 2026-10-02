/**
 * ExploreStatusBar — bottom status bar (UI-SPEC §7, D-03).
 *
 * Plain presentational component (no "use client" — it is rendered inside the
 * client shell). Left: locked breadcrumb `guest@tasostilsi` + `:~` (contiguous
 * text, colors only; `min-w-0 truncate` so the row's width pressure lands here
 * and nowhere else). Right cluster (`flex shrink-0 items-center gap-3`): the
 * live theme label + the LIVE `N/5 sections visited` counter (EXPLORE-04c,
 * D-06; W-1 — the grid has 5 sections after phase 11) followed by the `cli`
 * new-tab chip (phase-12 REV-22, UI-SPEC §2.3) — N flows in from ExploreShell's
 * single useExploreVisited instance as the visitedCount prop (drawer anchors,
 * manual scroll, and wizard arrivals all mark through that one IO path); the 5
 * derives from EXPLORE_SECTIONS. At 5/5 the counter span renders text-accent —
 * the phase's only celebration visual (E-13; no toast, no confetti — dropped
 * scope).
 *
 * Hydration contract (UI-SPEC §7): SSR/first paint renders "dark" and the
 * literal-0 counter; the one-shot after-mount syncs live in use-explore-theme
 * and use-explore-visited — storage is never read during render.
 */
import { ArrowUpRight } from 'lucide-react';
import {
  EXPLORE_SECTIONS,
  EXPLORE_STATUS_CLI_LINK,
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
      <p className="min-w-0 truncate">
        <span className="text-accent">{EXPLORE_STATUS_USER}</span>
        <span className="text-muted-foreground">{EXPLORE_STATUS_PATH}</span>
      </p>
      <div className="flex shrink-0 items-center gap-3">
        {/* Live region stays on the counter <p> ONLY — the chip below is a
            focusable anchor and must sit OUTSIDE it, or every counter change
            would re-announce a control the user may be focused on. */}
        <p aria-live="polite" className="whitespace-nowrap text-muted-foreground">
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
        {/* cli chip (phase-12 REV-22, UI-SPEC §2.3): a PLAIN anchor, never a
            router Link — a route-prefetch primitive is wrong for a new-tab
            affordance — so the static href survives into the export and works
            with JS disabled. target/rel are literals, never computed:
            rel="noopener noreferrer" is the phase's one security-relevant
            token (reverse-tabnabbing guard). The ring is INSET (UI-SPEC §4.3,
            RESOLVED-RING-INSET): an offset ring would paint outside this
            full-bar-height box and be clipped by the bar's top border and the
            viewport edge. `exp-nudge` is the existing shell-scoped hook
            (globals.css) and is the only motion the chip has — no pill, no
            colour ramp, no new CSS. */}
        <a
          href={EXPLORE_STATUS_CLI_LINK.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={EXPLORE_STATUS_CLI_LINK.ariaLabel}
          className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:opacity-80 sm:h-8"
        >
          <span>{EXPLORE_STATUS_CLI_LINK.label}</span>
          <ArrowUpRight
            className="exp-nudge h-3 w-3 text-muted-foreground"
            aria-hidden="true"
          />
        </a>
      </div>
    </footer>
  );
}