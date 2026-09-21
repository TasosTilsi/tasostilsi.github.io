/**
 * Pure decision module for the explore tour — plan EXPLORE-04-explore-gamification-01.
 *
 * The ONLY placement / visited-threshold / visited-parse site under
 * src/components/explore/. ZERO runtime imports so Node 24 type stripping
 * imports it directly under `node --test` (OQ-5): erasable TS syntax only —
 * annotations, interfaces and type aliases; no enums, namespaces or parameter
 * properties. The sole import line is the type-only ExploreSectionId import
 * (erased at runtime, resolved by tsc).
 */

import type { ExploreSectionId } from './constants';

/** Plain rect (callers convert DOMRects — the module never touches the DOM). */
export type TourRect = { left: number; top: number; width: number; height: number };

/** Resolved card geometry: fixed top/left plus the decided width. */
export type TourCardPlacement = {
  mode: 'below' | 'above' | 'dock' | 'center';
  top: number;
  left: number;
  width: number;
};

/**
 * UI-SPEC §3 card-placement table with the R-10 visibility-bounds amendment
 * (plan-checker blocker fix, recorded in the plan): a viewport-intersection
 * gate runs FIRST so a panel scrolled fully off-viewport resolves dock
 * deterministically — the pinned below/above rows alone would admit
 * off-screen or no-anchor placements. Never throws; no DOM access.
 */
export function placeCard(input: {
  panelRect: TourRect | null;
  cardSize: { width: number; height: number };
  viewport: { width: number; height: number };
}): TourCardPlacement {
  const { panelRect, cardSize, viewport } = input;
  const vw = viewport.width;
  const vh = viewport.height;
  const cardH = cardSize.height;
  const dock = (): TourCardPlacement => ({
    mode: 'dock',
    top: vh - 16 - cardH,
    left: 16,
    width: vw - 32,
  });

  // No-target steps (welcome/finish): <640px docks; ≥640px centers, width 384.
  if (panelRect === null) {
    if (vw < 640) return dock();
    const width = 384;
    return {
      mode: 'center',
      top: (vh - cardH) / 2,
      left: (vw - width) / 2,
      width,
    };
  }

  // R-10 gate FIRST: no vertical overlap with the viewport → no on-screen
  // anchor to attach to → dock. (fully above: bottom ≤ 0; fully below: top ≥ vh)
  if (panelRect.top + panelRect.height <= 0 || panelRect.top >= vh) {
    return dock();
  }

  // Targeted steps: width = min(384, panel width), left-aligned to the panel
  // and clamped into the 16px gutters on both edges (§3).
  const width = Math.min(384, panelRect.width);
  const left = Math.min(Math.max(panelRect.left, 16), vw - 16 - width);
  const bottom = panelRect.top + panelRect.height;

  // below first: top = panel.bottom + 12; valid when the card fits fully
  // on-screen (top ≥ 0 AND top + cardH ≤ vh − 16). Both explicit bounds are
  // kept deliberately — they are the card-fully-on-screen guarantee for
  // intersecting rects and must not be "simplified" away.
  const belowTop = bottom + 12;
  if (belowTop >= 0 && belowTop + cardH <= vh - 16) {
    return { mode: 'below', top: belowTop, left, width };
  }

  // else above: top = panel.top − 12 − cardH; valid when top ≥ 8 (no header
  // exclusion zone — the card may paint over the dimmed header) AND the card
  // does not cross the viewport's bottom margin (top + cardH ≤ vh − 16) — the
  // added bottom bound rejects near-bottom sliver panels (R-10).
  const aboveTop = panelRect.top - 12 - cardH;
  if (aboveTop >= 8 && aboveTop + cardH <= vh - 16) {
    return { mode: 'above', top: aboveTop, left, width };
  }

  // else dock: fixed bottom card, 16px insets all around (§3 / D-03 fallback).
  return dock();
}

/**
 * R-2 height-aware visit threshold (UI-SPEC §5 amendment): the IO threshold
 * is a ratio against the TARGET's own bounding box, so a fixed 0.5 could
 * never mark a panel taller than 2× the visible root. `min(0.5, rootHalfVisible
 * / panelHeight)` preserves the ~50%-of-visible-root intent; the 0.05 floor
 * keeps extreme panels observable at all.
 */
export function visitThreshold(panelHeight: number, rootHalfVisible: number): number {
  return Math.max(0.05, Math.min(0.5, rootHalfVisible / panelHeight));
}

/**
 * E-8 garbage-input contract: null / '' / unparseable / non-array JSON → [];
 * entries filtered to the valid EXPLORE_SECTIONS ids; deduped preserving
 * first-occurrence order (UI-SPEC §7).
 */
export function parseVisitedIds(raw: string | null, valid: readonly ExploreSectionId[]): string[] {
  if (raw === null || raw === '') return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  const allowed: readonly string[] = valid;
  for (const entry of parsed) {
    if (typeof entry !== 'string' || !allowed.includes(entry) || seen.has(entry)) continue;
    seen.add(entry);
    out.push(entry);
  }
  return out;
}

/** Inverse of parseVisitedIds: JSON string array of the deduped ids. */
export function serializeVisitedIds(ids: readonly string[]): string {
  return JSON.stringify([...new Set(ids)]);
}