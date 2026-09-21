/**
 * ExploreHeader — IDE header bar (UI-SPEC §3, D-01).
 *
 * Left: decorative window glyphs + truncating data-driven title.
 * Right: theme toggle only (the drawer toggle arrives in plan 02) — a real
 * 44×44 px touch target, ghost-styled, no transition classes (instant theme
 * swap, UI-SPEC §9.1). Icon is the TARGET theme: Sun while dark (click →
 * light), Moon while light. Toggle state comes from ExploreShell's single
 * useExploreTheme instance via props.
 *
 * The px-based h-[52px] bar and h-[44px] button are immune to the ≤640px
 * html{font-size:14px} rem shrink (UI-SPEC §3/§11/§13) — never convert to rem.
 */
import { Moon, Sun } from 'lucide-react';
import { ExploreTheme } from './constants';

export function ExploreHeader({
  name,
  title,
  theme,
  onToggleTheme,
}: {
  name: string;
  title: string;
  theme: ExploreTheme;
  onToggleTheme: () => void;
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
      {/* Theme toggle: target-theme icon, 44px real px touch target */}
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={
          theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        }
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Moon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </header>
  );
}