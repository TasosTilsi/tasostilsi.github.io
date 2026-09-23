/**
 * ExploreHeader — IDE header bar (UI-SPEC §3, D-01).
 *
 * Left: decorative window glyphs + truncating data-driven title.
 * Right cluster, in order: the Tour trigger (LEFTMOST, UI-SPEC §5 — re-opens
 * the spotlight wizard, D-05), theme toggle, drawer toggle, then the
 * Terminal link — rightmost since phase-5 (D-03) — all real 44×44 px touch
 * targets, ghost-styled, press feedback via the active-state muted tint on
 * all four controls (EXPLORE-07 U-4); the theme swap itself stays instant —
 * never animated (UI-SPEC §9.1; icon is the TARGET theme: Sun while dark →
 * light, Moon while light).
 * The drawer toggle is passed as ExploreDrawer's SheetTrigger child —
 * Radix supplies aria-expanded/aria-controls and focus return (EXPLORE-01b).
 *
 * Toggle state comes from ExploreShell's single useExploreTheme instance
 * via props. The px-based h-[52px] bar and h-[44px] buttons are immune to
 * the ≤640px html{font-size:14px} rem shrink (UI-SPEC §3/§11/§13) — never
 * convert to rem.
 */
import Link from 'next/link';
import { Compass, Menu, Moon, Sun, Terminal } from 'lucide-react';
import { ExploreDrawer } from './explore-drawer';
import { ExploreTheme } from './constants';

export function ExploreHeader({
  name,
  title,
  theme,
  onToggleTheme,
  onOpenTour,
}: {
  name: string;
  title: string;
  theme: ExploreTheme;
  onToggleTheme: () => void;
  onOpenTour: () => void;
}) {
  return (
    <header className="flex h-[52px] shrink-0 items-center gap-2 border-b bg-background px-4">
      {/* Window glyphs: decorative traffic-light dots — aria-hidden, never interactive */}
      <div aria-hidden="true" className="flex shrink-0 items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: 'hsl(var(--chart-5))' }}
        />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: 'hsl(var(--chart-3))' }}
        />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: 'hsl(var(--chart-2))' }}
        />
      </div>
      {/* Title: name-only below md, name — title at md+; exactly one span visible */}
      <span className="min-w-0 flex-1 truncate text-sm text-foreground md:hidden">
        {name}
      </span>
      <span className="hidden min-w-0 flex-1 truncate text-sm text-foreground md:inline">
        {`${name} — ${title}`}
      </span>
      {/* Tour trigger: LEFTMOST of the right cluster (UI-SPEC §5, D-05) —
          re-opens / resets the wizard at step 1 for every visitor; the theme
          + drawer pair below stays byte-identical so the drawer stays
          RIGHTMOST (locked phase-1 pin). */}
      <button
        id="explore-tour-trigger"
        type="button"
        onClick={onOpenTour}
        aria-label="Start the guided tour"
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-muted/80"
      >
        <Compass className="h-5 w-5" aria-hidden="true" />
      </button>
      {/* Theme toggle: target-theme icon, 44px real px touch target */}
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={
          theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        }
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-muted/80"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Moon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
      {/* Drawer toggle: penultimate right-cluster control (the Terminal link
          after it is rightmost, phase-5 D-03) — SheetTrigger supplies a11y attrs */}
      <ExploreDrawer
        trigger={
          <button
            type="button"
            aria-label="Open section navigation"
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-muted/80"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        }
      />
      {/* Terminal link: rightmost (phase-5, D-03) — Next Link back to the CLI,
          44px ghost recipe copied verbatim, same-tab navigation */}
      <Link
        href="/"
        aria-label="Open the terminal"
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-muted/80"
      >
        <Terminal className="h-5 w-5" aria-hidden="true" />
      </Link>
    </header>
  );
}