"use client";

/**
 * useExploreVisited — the data tier of the explore tour
 * (plan EXPLORE-04-explore-gamification-01, D-06).
 *
 * The ONLY module in the phase allowed to touch localStorage for
 * EXPLORE_TOUR_STORAGE_KEY / EXPLORE_VISITED_STORAGE_KEY (RESEARCH §5 tier
 * map) — that confinement is what makes the CLI-key-disjointness invariant
 * mechanically greppable (tests/explore-tour.test.mjs tier-confinement suite).
 * The keys stay disjoint from every CLI key (D-05/D-06); private mode keeps
 * everything per-session via guarded try/catch access (E-7; the
 * use-explore-theme precedent).
 *
 * Hydration contract (R-5, theme-hook precedent): state initializes to a
 * LITERAL empty array — localStorage is never read during render — and a
 * one-shot after-mount effect syncs from the persisted value.
 *
 * Marking path (OQ-3 resolution): ONE IntersectionObserver PER PANEL rooted
 * at the explore <main> scroll container ('.explore-shell > main', never the
 * window), each with its own height-aware threshold (IO applies a single
 * threshold list to all targets, so per-target thresholds require per-panel
 * observers — UI-SPEC §5 as amended by R-2). Drawer anchors, manual scroll,
 * and wizard scrollIntoView all arrive through this one path — no drawer
 * edit, no duplicate marking path. Dedupe in the store makes IO + wizard +
 * drawer double-marking harmless. Observers are created once (mount-only)
 * and all disconnected on cleanup (§5b).
 */
import { useCallback, useEffect, useState } from 'react';
import {
  EXPLORE_SECTIONS,
  EXPLORE_TOUR_STORAGE_KEY,
  EXPLORE_VISITED_STORAGE_KEY,
  ExploreSectionId,
} from './constants';
import { parseVisitedIds, serializeVisitedIds, visitThreshold } from './tour-placement';

export function useExploreVisited(): {
  visitedIds: ExploreSectionId[];
  visitedCount: number;
  markVisited: (id: ExploreSectionId) => void;
} {
  const [visitedIds, setVisitedIds] = useState<ExploreSectionId[]>([]);

  // One-shot after-mount sync from localStorage (never read during render —
  // the SSR literal stays `0/5 sections visited`; R-5 hydration contract).
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(EXPLORE_VISITED_STORAGE_KEY);
    } catch {
      raw = null; // storage unavailable (private mode) — per-session only (E-7)
    }
    const valid = EXPLORE_SECTIONS.map((section) => section.id);
    setVisitedIds(parseVisitedIds(raw, valid) as ExploreSectionId[]);
  }, []);

  const markVisited = useCallback((id: ExploreSectionId) => {
    setVisitedIds((prev) => {
      if (prev.includes(id)) return prev; // dedupe — double-marking is harmless
      const next = [...prev, id];
      try {
        localStorage.setItem(EXPLORE_VISITED_STORAGE_KEY, serializeVisitedIds(next));
      } catch {
        // storage unavailable (private mode) — state stays per-session (E-7)
      }
      return next;
    });
  }, []);

  // IO mount effect: per-panel observers with height-aware thresholds (R-2),
  // root = the explore <main> scroll container (D-06).
  useEffect(() => {
    const main = document.querySelector<HTMLElement>('.explore-shell > main');
    if (!main) return; // no-JS / non-shell context safe (E-6/R-9 spirit)
    const observers: IntersectionObserver[] = [];
    const halfVisible = main.clientHeight * 0.5;
    for (const section of EXPLORE_SECTIONS) {
      const el = document.getElementById(section.id);
      if (!el) continue; // E-6: missing panel → simply never marks
      const threshold = visitThreshold(el.offsetHeight, halfVisible);
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
              markVisited(section.id);
            }
          }
        },
        { root: main, threshold: [threshold] },
      );
      observer.observe(el);
      observers.push(observer);
    }
    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, [markVisited]);

  return { visitedIds, visitedCount: visitedIds.length, markVisited };
}

/**
 * Tour trigger flag read (D-05): returns ANY non-null stored value as-is —
 * garbage included — so the auto-open check `!== null` suppresses per E-8;
 * null when the key is absent or storage is unavailable.
 */
export function readTourFlag(): 'seen' | 'completed' | null {
  try {
    return localStorage.getItem(EXPLORE_TOUR_STORAGE_KEY) as 'seen' | 'completed' | null;
  } catch {
    return null;
  }
}

/**
 * Tour trigger flag write (D-05): guarded, and NEVER downgrades 'completed' —
 * a post-completion dismissal must not erase the completed flag (D-04/D-05).
 */
export function writeTourFlag(next: 'seen' | 'completed'): void {
  if (readTourFlag() === 'completed') return;
  try {
    localStorage.setItem(EXPLORE_TOUR_STORAGE_KEY, next);
  } catch {
    // storage unavailable (private mode) — per-session only (E-7)
  }
}