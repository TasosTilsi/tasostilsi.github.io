/**
 * Pure row-state module for the projects editorial scroll — plan
 * EXPLORE-09-editorial-motion-revision-04 (phase 9, REV-17, D-04).
 *
 * This is the editorial composition's ONE derivation site (the
 * timeline-geometry.ts R-12 precedent): firstSentence (the §4.2
 * first-sentence split with OQ-1 reading (b) pinned below), rowState (the
 * §4.3 motion contract at editorial scale) and rowYear (the E-8 year
 * extraction) live here as pure functions. The stage's motion channel
 * (projects-editorial-stage.tsx — the phase's only scroll-engine import
 * site) consumes these functions through per-row useTransform and never
 * inlines row math, so node --test covers the derivation directly
 * (tests/projects-editorial.test.mjs).
 *
 * Contract (R-12, timeline-geometry.ts precedent): ZERO runtime imports —
 * this file carries NO import statements of any kind (it works on
 * primitives only, no cross-module imports; the year pattern is a private
 * copy of the timeline-geometry.ts:71 precedent) and erasable TS syntax
 * only (type annotations and interfaces; no enums, namespaces or parameter
 * properties), so Node 24 type stripping loads it directly under
 * `node --test`. Never touches the DOM.
 */

/** The §4.2 description budget — the first sentence renders within this
 * many characters; the sentence's terminal period counts toward it. */
const DEFAULT_MAX_CHARS = 120;

/**
 * First-year pattern — the timeline-geometry.ts:71 precedent, as a PRIVATE
 * copy (no cross-module import keeps the zero-runtime-import contract
 * literal). NON-global so `match` returns only the first (start) year:
 * 'June 2023' → 2023, 'September 2012 - December 2018' → 2012.
 */
const YEAR_PATTERN = /\b(?:19|20)\d{2}\b/;

const clamp = (value: number, lo: number, hi: number): number =>
  Math.min(Math.max(value, lo), hi);

/** Keeps a number finite or substitutes the fallback (U-14 totality). */
const finiteOr = (value: number, fallback: number): number =>
  Number.isFinite(value) ? value : fallback;

/**
 * firstSentence — the §4.2 row-description split. OQ-1 reading (b) PINNED:
 * the sentence runs up to and INCLUDING the first period — the terminal
 * period counts toward the 120 budget and is kept for complete sentences
 * ("…bundled dashboard.", not "…bundled dashboard"). A description with no
 * period yields the whole string (E-5). Over budget → truncate at the last
 * word boundary that fits WITH the trailing ellipsis inside the budget; the
 * ellipsis REPLACES the terminal period — a period is never appended after
 * the ellipsis (never '….', UI-SPEC §4.2; E-6). An exactly-maxChars
 * sentence is returned unchanged; one character longer truncates. Empty in
 * → empty out. Total over every string input, never throws.
 */
export function firstSentence(
  description: string,
  maxChars: number = DEFAULT_MAX_CHARS,
): string {
  if (description === '') return '';
  const firstPeriod = description.indexOf('.');
  const sentence =
    firstPeriod === -1 ? description : description.slice(0, firstPeriod + 1);
  if (sentence.length <= maxChars) return sentence;
  // Over budget: the ellipsis takes the terminal period's slot (a period
  // never follows the ellipsis), so the body drops it before truncating.
  const body = sentence.endsWith('.') ? sentence.slice(0, -1) : sentence;
  const budget = maxChars - 1; // the ellipsis occupies one character
  if (budget <= 0) return '…';
  let cut = body.slice(0, budget);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace >= 0) cut = cut.slice(0, lastSpace);
  return `${cut.trimEnd()}…`;
}

/** One editorial row state in the §4.3 grid stack — the phase-8
 * contentLayer contract carried to editorial scale. */
export interface RowState {
  /** Vertical offset in px: +height (parked below) → 0 (centered) → −height (exited above). */
  y: number;
  /** Continuous coexistence opacity: 1 at rest, fading over |d| ∈ (0, 1). */
  opacity: number;
  /** The a11y/tab-order flip boundary: |d| < 1 — flipped discretely at |d| ≥ 1. */
  visible: boolean;
}

/**
 * rowState — the §4.3 motion contract for row `index` at continuous
 * progress `progress` across `count` rows: r′ = (count−1)·progress;
 * d = index − r′; y = clamp(height·d, −height, +height) — each row sweeps
 * enter-from-below (d > 0) → centered (d = 0) → exit-above (d < 0), the
 * clamp pinning travel to exactly ±height; opacity = clamp(1 − |d|, 0, 1)
 * — the phase-8 coexistence window carried over (two rows simultaneously
 * visible during each transition, one fully visible at rest); visible =
 * |d| < 1. Reduced motion (RM-5/D-04): y ≡ 0 while opacity still tracks d.
 * Totality (U-14): height ≤ 0 or non-finite → y = 0 — no NaN ever leaves
 * this function; count ≤ 1 → r′ = 0 (the single-row stage has no travel,
 * E-2 spirit).
 */
export function rowState(
  index: number,
  progress: number,
  count: number,
  height: number,
  reducedMotion: boolean,
): RowState {
  const safeProgress = finiteOr(progress, 0);
  const continuous = count > 1 ? (count - 1) * safeProgress : 0;
  const offset = index - continuous;
  const measurable = Number.isFinite(height) && height > 0;
  const y =
    reducedMotion || !measurable ? 0 : clamp(height * offset, -height, height);
  const opacity = clamp(1 - Math.abs(offset), 0, 1);
  return { y, opacity, visible: Math.abs(offset) < 1 };
}

/**
 * rowYear — the §4.2 year-marker source: the FIRST \b(?:19|20)\d{2}\b match
 * in the raw project.date string, returned as a string; absent, empty or
 * unparseable dates → null (E-8 — the caller renders the '—' em-dash). The
 * private YEAR_PATTERN copy — no cross-module import.
 */
export function rowYear(date: string | null | undefined): string | null {
  if (!date) return null;
  const match = date.match(YEAR_PATTERN);
  return match ? match[0] : null;
}