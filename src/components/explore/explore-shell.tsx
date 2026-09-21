"use client";

/**
 * ExploreShell — client boundary of the /explore IDE frame (D-01, UI-SPEC §2.1).
 *
 * Owns the single useExploreTheme state and composes the frame in order:
 * header bar → typewriter intro strip (optional `intro` slot) →
 * main (the ONLY scroll container) → status bar → ExploreTour overlay.
 * The theme instance is passed down as props so the header toggle and the
 * status-bar live label share one source of truth (key_link).
 *
 * Tour state is lifted here per RESEARCH OQ-7 (one client boundary, no
 * context): a single useExploreVisited instance, plus tourOpen / tourEpoch —
 * onOpenTour goes to the header, onMarkVisited to the wizard, and
 * ExploreTour composes as the LAST child of the shell root (W-4 paint
 * order: the card must paint above the dim; never portaled, §0 pin).
 * reopenEpoch bumps on every Tour-button click so an open tour resets to
 * step 1 (E-10); auto-open does not bump it.
 *
 * The intro strip is shrink-0 chrome BETWEEN header and main — it must
 * never live inside the scroll container, so it arrives as a dedicated
 * slot prop (server-rendered ExploreIntro passed from the page) rather
 * than through `children`, which render inside <main>.
 *
 * Server-rendered children pass through untouched — the composition pattern
 * keeps panels server components and is static-export-safe.
 */
import { ReactNode, useCallback, useState } from 'react';
import { ExploreHeader } from './explore-header';
import { ExploreStatusBar } from './explore-status-bar';
import { ExploreTour } from './explore-tour';
import { useExploreTheme } from './use-explore-theme';
import { useExploreVisited } from './use-explore-visited';

export function ExploreShell({
  name,
  title,
  intro,
  children,
}: {
  name: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  const { theme, setTheme } = useExploreTheme();
  // Single visited source of truth (OQ-7): markVisited threads to the tour,
  // visitedCount drives the status bar's LIVE N/5 counter (EXPLORE-04c, D-06).
  const { visitedCount, markVisited } = useExploreVisited();
  const [tourOpen, setTourOpen] = useState(false);
  const [tourEpoch, setTourEpoch] = useState(0);
  const openTour = useCallback(() => {
    setTourOpen(true);
    setTourEpoch((epoch) => epoch + 1); // E-10: while open, reset to step 1
  }, []);

  return (
    <div className="explore-shell flex h-dvh flex-col overflow-x-hidden bg-background text-foreground">
      <ExploreHeader
        name={name}
        title={title}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onOpenTour={openTour}
      />
      {intro}
      <main
        aria-label="Portfolio sections"
        tabIndex={0}
        className="flex-1 overflow-y-auto p-4 md:p-6"
      >
        {children}
      </main>
      <ExploreStatusBar theme={theme} visitedCount={visitedCount} />
      <ExploreTour
        open={tourOpen}
        reopenEpoch={tourEpoch}
        onOpenChange={setTourOpen}
        onMarkVisited={markVisited}
      />
    </div>
  );
}