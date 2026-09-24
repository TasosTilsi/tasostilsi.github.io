/**
 * Pure derivation module for the semicircular career timeline — plan
 * EXPLORE-08-experience-showcase-revision-01 (phase 8).
 *
 * This is the phase's ONE derivation site (UI-SPEC §14 seam 1 / R-13): every
 * formula in UI-SPEC §1.3 (sticky-range progress), §2.2 (arc geometry and
 * the meet-mapping), §2.3 (the carousel derivation — the REV-12 "single
 * source of truth") and §3 (content-layer states), plus the §7 reduced-
 * motion variants, entry selection (D-06, generalized in phase 9 to the
 * typed role|education merge — D-03) and start-year parsing (D-03, R-14)
 * lives here as pure functions. Components never shape timeline data
 * inline; they receive precomputed values from the functions below. This
 * module intentionally supersedes the viz-data "single data-shaping site"
 * header for phase-8/9 derivations — viz-data.ts itself is NOT edited.
 *
 * Contract (R-12, tour-placement.ts precedent): ZERO runtime imports — the
 * ONLY import line is the type-only ExperienceEntry import, erased at
 * runtime so Node 24 type stripping loads this file directly under
 * `node --test` (tests/explore-timeline.test.mjs). Erasable TS syntax only:
 * type annotations and interfaces; no enums, namespaces or parameter
 * properties.
 *
 * R-14: parseDuration/YEAR_PATTERN were deleted in EXPLORE-07 and do NOT
 * exist — startYear is a NEW pure function following the surviving
 * GLOBAL_YEAR_PATTERN regex precedent (viz-data.ts:90), non-global so the
 * FIRST year match wins ('Sept 2022 — Aug 2023' → '2022', never max/min).
 *
 * No sorting of data-derived arrays anywhere (D-06: JSON order is render
 * order) — with the ONE phase-9 scoped exception: selectTimelineEntries
 * sorts its merged entries year-DESCENDING, present-first (user directive:
 * the experience is shown from the present to the past — Chubb 2023 first,
 * BEng 2012 last; the contradiction is scoped and documented on that
 * function below, UI-SPEC §3.1). All functions are total
 * over their documented edge matrix (UI-SPEC §12 E-2/E-3/E-4) and never
 * touch the DOM.
 */
import type {
  EducationEntry,
  ExperienceEntry,
} from '@/data/portfolio-main-data';

/** A timeline entry: the type discriminator + the parsed start year (or
 * null) + the raw entry. The phase-9 generalization of the phase-8 role-only
 * representation — the ONE merged-arc noun (D-03/REV-16). */
export interface TimelineEntry {
  type: 'role' | 'education';
  year: string | null;
  entry: ExperienceEntry | EducationEntry;
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

const clamp = (v: number, lo: number, hi: number): number =>
  Math.min(Math.max(v, lo), hi);

/**
 * First-year pattern — the surviving GLOBAL_YEAR_PATTERN precedent
 * (viz-data.ts:90), NON-global so `match` returns only the first (start)
 * year: 'Sept 2022 — Aug 2023' → 2022, never max/min of the two years.
 * Dash style (em-dash U+2014 vs hyphen U+002D) is irrelevant to the regex.
 */
const YEAR_PATTERN = /\b(?:19|20)\d{2}\b/;

/**
 * §1.3 sticky-range progress: `rel` is the signed wrapper engage offset
 * ((wrapperRect.top − mainRect.top) − mainPaddingTop), `range` the scrollable
 * range (wrapperHeight − stageHeight). rel=0 (engage) → 0; rel=−range
 * (release) → 1; clamped outside — scrolling past the range flows naturally,
 * no hijack. range ≤ 0 → 0 (total, no NaN).
 */
export function computeProgress(rel: number, range: number): number {
  if (range <= 0) return 0;
  return clamp(-rel / range, 0, 1);
}

/**
 * §2.3 continuous carousel index c′ = (n−1)·progress ∈ [0, n−1]; n=1 → 0
 * (E-2: the single-role stage has no carousel travel).
 */
export function continuousIndex(progress: number, roleCount: number): number {
  if (roleCount <= 1) return 0;
  return (roleCount - 1) * progress;
}

/**
 * §2.3 active index = Math.round(c′) clamped to [0, n−1] — the W-2 NORMATIVE
 * form (NOT band if/else): Math.round boundaries sit at c′ = 0.5/1.5 for
 * n=3. n=1 → 0.
 */
export function activeIndexFromContinuous(c: number, roleCount: number): number {
  if (roleCount <= 1) return 0;
  return clamp(Math.round(c), 0, roleCount - 1);
}

/**
 * §2.3 marker angle θᵢ = 180° − (i − c′)·Δ with the exact-fit spacing
 * Δ = 90°/(n−1): max offset (n−1)·Δ = 90° keeps EVERY marker on the arc
 * (θ ∈ [90°, 270°]) for every c′ — the train never leaves the curve. The
 * active role sits at θ=180° (the left-bulge focal point, vertical center)
 * whenever c′ is an integer. Generalizes to any n ≥ 2 (the data yields 3;
 * the math is not 3-hardcoded, E-3); n=1 → 180 (E-2 single marker at the
 * focal point).
 */
export function markerAngle(index: number, c: number, roleCount: number): number {
  if (roleCount <= 1) return 180;
  return 180 - (index - c) * (90 / (roleCount - 1));
}

/**
 * §2.3 emphasis ladder: t = 1 − min(|i − c′|, n−1)/(n−1); opacity =
 * 0.65 + 0.35·t, scale = 0.7 + 0.3·t. Ladder for n=3: active 1/1, adjacent
 * 0.825/0.85, farthest 0.65/0.7 — monotone in |i − c′|. n=1 → {1, 1} (E-2).
 */
export function markerEmphasis(index: number, c: number, roleCount: number): MarkerEmphasis {
  if (roleCount <= 1) return { opacity: 1, scale: 1 };
  const t = 1 - Math.min(Math.abs(index - c), roleCount - 1) / (roleCount - 1);
  return { opacity: 0.65 + 0.35 * t, scale: 0.7 + 0.3 * t };
}

/**
 * §3 content-layer state: d = i − c′; opacity = clamp(1 − |d|, 0, 1);
 * translateY = clamp(14·d, −28, 28) px (entering sits below and slides up;
 * leaving exits upward); visible = |d| < 1 (the §3 hidden row: visibility
 * hidden + aria-hidden once |d| ≥ 1). Reduced motion (RM-2): translateY ≡ 0
 * — layers swap opacity-only; opacity still tracks c′ (opacity is not
 * spatial). SSR is the same derivation evaluated at progress 0 — no
 * special-casing.
 */
export function contentLayer(
  index: number,
  c: number,
  reducedMotion = false,
): ContentLayerState {
  const d = index - c;
  const opacity = clamp(1 - Math.abs(d), 0, 1);
  const translateY = reducedMotion ? 0 : clamp(14 * d, -28, 28);
  return { opacity, translateY, visible: Math.abs(d) < 1 };
}

/**
 * §7 RM-1: reduced-motion positions are FROZEN — the marker's own arc angle
 * at c′=0 ({180°, 135°, 90°} for i=0,1,2 at n=3): zero spatial movement
 * ever; emphasis swaps opacity-only. (Documented trade: under reduced motion
 * the emphasized dot sits at the role's own arc position, not the focal
 * point — the focal contract is a motion-state contract RM trades away.)
 */
export function reducedMotionAngle(index: number, roleCount: number): number {
  return markerAngle(index, 0, roleCount);
}

/**
 * §7 RM-1 emphasis under reduced motion: the opacity ladder unchanged, scale
 * pinned to 1 (a scale change is spatial movement; opacity-only means
 * opacity-only).
 */
export function reducedMotionEmphasis(
  index: number,
  c: number,
  roleCount: number,
): MarkerEmphasis {
  return { opacity: markerEmphasis(index, c, roleCount).opacity, scale: 1 };
}

/**
 * §2.2 scale mapping, mirroring the SVG's `preserveAspectRatio="xMidYMid
 * meet"` on a `viewBox="0 0 100 200"` exactly (zero layout shift on
 * hydration): s = min(zoneW/100, zoneH/200); the offsets center the
 * meet-mapped 100·s × 200·s box in the measured arc zone; the unit circle
 * center (100, 100) and radius 100 map to centerX = offsetX + 100·s,
 * centerY = offsetY + 100·s, radius = 100·s.
 */
export function viewBoxToPx(zone: { width: number; height: number }): ArcGeometry {
  const s = Math.min(zone.width / 100, zone.height / 200);
  const offsetX = (zone.width - 100 * s) / 2;
  const offsetY = (zone.height - 200 * s) / 2;
  return {
    s,
    offsetX,
    offsetY,
    centerX: offsetX + 100 * s,
    centerY: offsetY + 100 * s,
    radius: 100 * s,
  };
}

/**
 * §2.2 marker polar point — the LOCKED formula with SVG y-down coordinates:
 * x = centerX + radius·cos(θ), y = centerY + radius·sin(θ), θ in degrees,
 * domain [90°, 270°] renders the left-bulging C (θ=180 → the left bulge /
 * focal point, θ=90 → the BOTTOM end, θ=270 → the top end). Label anchors
 * use the same formula at radius·0.88 (the 12 viewBox-unit inward inset —
 * callers pass a geometry with radius·(88/100)).
 */
export function markerPoint(
  geometry: { centerX: number; centerY: number; radius: number },
  thetaDeg: number,
): { x: number; y: number } {
  const rad = (thetaDeg * Math.PI) / 180;
  return {
    x: geometry.centerX + geometry.radius * Math.cos(rad),
    y: geometry.centerY + geometry.radius * Math.sin(rad),
  };
}

/**
 * §2.3 keyboard target for role i: the role POSITION progress i/(n−1)
 * (stepping to role i sets c′ = i — targets 0 and n−1 are legitimate band
 * EDGES, not band centers). n=1 → 0.
 */
export function progressForRole(index: number, roleCount: number): number {
  if (roleCount <= 1) return 0;
  return index / (roleCount - 1);
}

/**
 * §5 keyboard/scroll-target arithmetic: the scrollTop that puts the wrapper
 * at role i's position — scrollTop + rel + progressForRole(i)·range (rel=0
 * at engage → target = scrollTop + progress·range). Scrolling IS the
 * progress input: keyboard never bypasses the single source of truth.
 */
export function scrollTargetForRole(
  scrollTop: number,
  rel: number,
  index: number,
  roleCount: number,
  range: number,
): number {
  return scrollTop + rel + progressForRole(index, roleCount) * range;
}

/**
 * D-03/R-14 start year: the FIRST /\b(?:19|20)\d{2}\b/ match on the duration
 * string AS STORED, else null (E-4: unparseable/absent → dot-only marker,
 * no invented label). 'Sept 2023 — Present' → '2023';
 * 'Sept 2022 — Aug 2023' → '2022' (first match, never max/min);
 * 'June 2019 — Sept 2022' → '2019'; hyphen durations parse identically.
 */
export function startYear(duration: string | null | undefined): string | null {
  if (!duration) return null;
  const match = duration.match(YEAR_PATTERN);
  return match ? match[0] : null;
}

/**
 * D-03 (phase 9) typed merged derivation — the ONE timeline-entry site:
 * entries = experience.filter(isTechRelated) ∪ education.filter(featured),
 * each carrying its parsed start year, merged and sorted by NUMERIC start
 * year DESCENDING — present-first (user directive: the experience is shown
 * from the present to the past: Chubb 2023 · Upstream 2022 · MSc 2021 ·
 * Netcompany 2019 · BEng 2012 over the real data). Chubb, the active
 * present role, is the arc's focal point at rest (progress 0 → index 0).
 * The phase-8 role-only selection is
 * deleted — ONE derivation site (OQ-8): roles round-trip through here as
 * `type: 'role'` entries with unchanged geometry/emphasis/keyboard
 * behaviour; education is a discriminator + template variant only.
 *
 * SORT RULE SCOPE (UI-SPEC §3.1): this is the phase's ONE deliberate sort —
 * it supersedes, for THIS FUNCTION ONLY, the module header's "no sorting of
 * data-derived arrays" rule above. D-06 (JSON order is render order) stays
 * the law for every other function; the merged arc is CHRONOLOGICAL by
 * contract (descending, present→past), so its order is derived from the
 * parsed start years, not a render-order passthrough.
 *
 * Determinism: Array.prototype.sort is STABLE (ECMA-262 guarantee; relied on
 * here in Node ≥ 20) — equal-year entries keep input order (roles first,
 * from the input concatenation order). Null years (unparseable/absent
 * durations, E-4) sort LAST deterministically in either direction and render
 * dot-only markers downstream. Total: either input empty → the other's filtered entries;
 * both empty → [] (E-1).
 */
export function selectTimelineEntries(
  experience: ExperienceEntry[],
  education: EducationEntry[],
): TimelineEntry[] {
  const roles: TimelineEntry[] = experience
    .filter((entry) => entry.isTechRelated)
    .map((entry) => ({ type: 'role', year: startYear(entry.duration), entry }));
  const degrees: TimelineEntry[] = education
    .filter((entry) => entry.featured)
    .map((entry) => ({ type: 'education', year: startYear(entry.duration), entry }));
  return roles
    .concat(degrees)
    .sort((a, b) => {
      if (a.year === null && b.year === null) return 0;
      if (a.year === null) return 1;
      if (b.year === null) return -1;
      return Number(b.year) - Number(a.year);
    });
}

/**
 * §2.4 W-4 measurable predicate for the active-marker date line: the
 * rendered width is 0.6em/char × string length at text-[10px] = 6 px/char;
 * it fits when that width ≤ innerWidth − 16 (the zone's inner padding). An
 * empty (or absent) label ALWAYS fits — there is nothing to drop — even
 * below the 16px padding floor.
 */
export function dateLineFits(duration: string, innerWidthPx: number): boolean {
  if (!duration) return true;
  return duration.length * 6 <= innerWidthPx - 16;
}