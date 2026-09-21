"use client";

/**
 * ExploreShell — client boundary of the /explore IDE frame (D-01, UI-SPEC §2.1).
 *
 * Owns the single useExploreTheme state and composes the frame in order:
 * header bar → main (the ONLY scroll container) → status bar. The theme
 * instance is passed down as props so the header toggle and the status-bar
 * live label share one source of truth (key_link).
 *
 * Server-rendered children pass through untouched — the composition pattern
 * keeps panels server components and is static-export-safe.
 */
import { ReactNode } from 'react';
import { ExploreHeader } from './explore-header';
import { ExploreStatusBar } from './explore-status-bar';
import { useExploreTheme } from './use-explore-theme';

export function ExploreShell({
  name,
  title,
  children,
}: {
  name: string;
  title: string;
  children: ReactNode;
}) {
  const { theme, setTheme } = useExploreTheme();

  return (
    <div className="explore-shell flex h-dvh flex-col overflow-x-hidden bg-background text-foreground">
      <ExploreHeader
        name={name}
        title={title}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <main
        aria-label="Portfolio sections"
        tabIndex={0}
        className="flex-1 overflow-y-auto p-4 md:p-6"
      >
        {children}
      </main>
      <ExploreStatusBar theme={theme} />
    </div>
  );
}