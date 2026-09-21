"use client";

/**
 * useExploreTheme — hand-rolled dark/light theme state for the /explore shell
 * (D-05, UI-SPEC §9.1/§14).
 *
 * Contract:
 * - State initializes to the LITERAL "dark" — never lazy-init from
 *   documentElement during render (hydration mismatch risk, UI-SPEC §7/§14).
 *   A one-shot after-mount effect syncs from the class the before-paint
 *   script (explore/layout.tsx) applied pre-hydration.
 * - setTheme swaps the class on <html> (strips dark/light first) and
 *   persists under EXPLORE_THEME_STORAGE_KEY; storage writes are guarded so
 *   private-mode failures keep the toggle working per-session (UI-SPEC §14#4).
 * - No OS-level color-scheme detection anywhere — dark is the unconditional
 *   default (UI-SPEC §17.7).
 * - Never reads or writes the CLI theme storage key (see
 *   src/components/cli/constants.ts:65) — D-05/D-10; the CLI
 *   self-heals its own classes via useCliTheme.
 */
import { useCallback, useEffect, useState } from 'react';
import { EXPLORE_THEME_STORAGE_KEY, ExploreTheme } from './constants';

export function useExploreTheme(): {
  theme: ExploreTheme;
  setTheme: (next: ExploreTheme) => void;
} {
  const [theme, setThemeState] = useState<ExploreTheme>('dark');

  // One-shot mount sync: documentElement already carries the pre-hydration
  // class (before-paint script). Briefly-wrong label right after load with
  // persisted light is the accepted tradeoff (UI-SPEC §7).
  useEffect(() => {
    setThemeState(
      document.documentElement.classList.contains('light') ? 'light' : 'dark',
    );
  }, []);

  const setTheme = useCallback((next: ExploreTheme) => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(next);
    try {
      localStorage.setItem(EXPLORE_THEME_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private mode) — toggle still works per-session
    }
    setThemeState(next);
  }, []);

  return { theme, setTheme };
}