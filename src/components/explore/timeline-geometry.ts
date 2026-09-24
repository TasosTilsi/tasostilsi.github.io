/**
 * Pure derivation module for the semicircular career timeline — plan
 * EXPLORE-08-experience-showcase-revision-01 (phase 8).
 *
 * RED-phase stub (TDD Task 1): every export throws until Task 2 (GREEN)
 * implements the NORMATIVE UI-SPEC formulas (§1.3 sticky-range progress,
 * §2.2 arc geometry, §2.3 carousel, §3 content layers, §7 reduced-motion
 * variants) plus role selection and start-year parsing (D-03/D-06,
 * R-13/R-14). The stub exists only so the contract suite EXECUTES and fails
 * on its assertions/throws — red for the missing behavior, never a
 * module-resolution crash.
 *
 * Contract (R-12, tour-placement.ts precedent): ZERO runtime imports — the
 * ONLY import line is the type-only ExperienceEntry import, erased at
 * runtime so Node 24 type stripping loads this file directly under
 * `node --test`. Erasable TS syntax only: type annotations and interfaces;
 * no enums, namespaces or parameter properties.
 *
 * R-13: this module is the phase's ONE derivation site (UI-SPEC §14 seam 1)
 * — it intentionally supersedes the viz-data "single data-shaping site"
 * header for phase-8 derivations; viz-data.ts itself is NOT edited.
 * R-14: startYear is a NEW pure function following the surviving
 * GLOBAL_YEAR_PATTERN regex precedent (viz-data.ts:90) — parseDuration and
 * YEAR_PATTERN no longer exist and must not be imported.
 */
import type { ExperienceEntry } from '@/data/portfolio-main-data';

/** A timeline role: the parsed start year (or null) + the raw entry. */
export interface TimelineRole {
  year: string | null;
  entry: ExperienceEntry;
}

/** Marker emphasis pair: opacity + scale, both pure functions of |i − c′|. */
export interface MarkerEmphasis {
  opacity: number;
  scale: number;
}

/** One content-layer state in the §3 grid stack. */
export interface ContentLayerState {
  opacity: number;
  translateY: number;
  visible: boolean;
}

/** Arc geometry resolved from the measured arc-zone size (§2.2). */
export interface ArcGeometry {
  s: number;
  offsetX: number;
  offsetY: number;
  centerX: number;
  centerY: number;
  radius: number;
}

export function computeProgress(_rel: number, _range: number): number {
  throw new Error('not implemented');
}

export function continuousIndex(_progress: number, _roleCount: number): number {
  throw new Error('not implemented');
}

export function activeIndexFromContinuous(_c: number, _roleCount: number): number {
  throw new Error('not implemented');
}

export function markerAngle(_index: number, _c: number, _roleCount: number): number {
  throw new Error('not implemented');
}

export function markerEmphasis(_index: number, _c: number, _roleCount: number): MarkerEmphasis {
  throw new Error('not implemented');
}

export function contentLayer(
  _index: number,
  _c: number,
  _reducedMotion?: boolean,
): ContentLayerState {
  throw new Error('not implemented');
}

export function reducedMotionAngle(_index: number, _roleCount: number): number {
  throw new Error('not implemented');
}

export function reducedMotionEmphasis(
  _index: number,
  _c: number,
  _roleCount: number,
): MarkerEmphasis {
  throw new Error('not implemented');
}

export function viewBoxToPx(_zone: { width: number; height: number }): ArcGeometry {
  throw new Error('not implemented');
}

export function markerPoint(
  _geometry: { centerX: number; centerY: number; radius: number },
  _thetaDeg: number,
): { x: number; y: number } {
  throw new Error('not implemented');
}

export function progressForRole(_index: number, _roleCount: number): number {
  throw new Error('not implemented');
}

export function scrollTargetForRole(
  _scrollTop: number,
  _rel: number,
  _index: number,
  _roleCount: number,
  _range: number,
): number {
  throw new Error('not implemented');
}

export function startYear(_duration: string | null | undefined): string | null {
  throw new Error('not implemented');
}

export function selectTimelineRoles(_entries: ExperienceEntry[]): TimelineRole[] {
  throw new Error('not implemented');
}

export function dateLineFits(_duration: string, _innerWidthPx: number): boolean {
  throw new Error('not implemented');
}