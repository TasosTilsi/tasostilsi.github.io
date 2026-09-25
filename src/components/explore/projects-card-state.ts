/**
 * Pure card-state module for the projects stacked-card carousel — swipe-driven
 * Tinder-style ring buffer (phase-10 REV-21, user directive 2026-09-25).
 *
 * This is the stack composition's ONE derivation site: firstSentence,
 * projectYear, projectTechnologies, projectVisualVariant, cardState and the
 * swipe-decision helpers live here as pure, typed functions with zero runtime
 * imports. The module uses only erasable TypeScript syntax so Node 24 type
 * stripping can load it directly under `node --test`.
 *
 * Contract:
 *   - cardState now takes a ring-buffer frontIndex instead of carouselProgress
 *   - UI-SPEC §3 card geometry table survives, driven by depth from the front
 *   - Swipe acceptance is pinned to offset/velocity thresholds
 */

/** The §4.2 description budget — the first sentence renders within this
 * many characters; the sentence's terminal period counts toward it. */
const DEFAULT_MAX_CHARS = 120;

/**
 * First-year pattern — the timeline-geometry.ts / projects-row-state.ts
 * precedent, as a private copy (zero runtime imports). NON-global so `match`
 * returns only the first (start) year: 'June 2023' → 2023.
 */
const YEAR_PATTERN = /\b(?:19|20)\d{2}\b/;

/** Technology lexicon for deterministic chip extraction from project
 * descriptions. Matches are lower-cased on both sides so capitalized and
 * multi-word terms (e.g. 'Technical Debt') still hit. */
const TECH_LEXICON = [
  'RAG',
  'MCP',
  'SQLite',
  'TypeScript',
  'tree-sitter',
  'embeddings',
  'AI',
  'contract',
  'Technical Debt',
  'metrics',
  'route optimization',
  'tracking',
  'Android',
  'Java',
  'Web',
  'Electron',
];

/** Curated imperfection — deterministic per-index offsets, never random. */
const IMPERFECTION_X = [-4, -2, 2, 4, 3, -3];
const IMPERFECTION_ROTATION = [-1, -0.5, 0.5, 1, 0.75, -0.75];

/** Pinned depth-level table (UI-SPEC §3.3). The yUp column is the canonical
 * offset for cards behind the foreground card in the ring buffer. */
const LEVELS = [
  { yUp: 0, yLeave: 0, scale: 1.0, opacity: 1.0 },
  { yUp: -38, yLeave: -94, scale: 0.96, opacity: 0.95 },
  { yUp: -76, yLeave: -132, scale: 0.92, opacity: 0.85 },
  { yUp: -114, yLeave: -170, scale: 0.88, opacity: 0.7 },
  { yUp: -152, yLeave: -208, scale: 0.84, opacity: 0.5 },
  { yUp: -190, yLeave: -246, scale: 0.8, opacity: 0.3 },
];

/** Swipe-decision pins. */
export const SWIPE_THRESHOLD = 100;
export const SWIPE_VELOCITY_THRESHOLD = 500;

const clamp = (value: number, lo: number, hi: number): number =>
  Math.min(Math.max(value, lo), hi);

const finiteOr = (value: number, fallback: number): number =>
  Number.isFinite(value) ? value : fallback;

const smoothstep = (t: number): number =>
  clamp(t, 0, 1) ** 2 * (3 - 2 * clamp(t, 0, 1));

const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * clamp(t, 0, 1);

/**
 * firstSentence — the §4.2 card-description split. The sentence runs up to
 * and INCLUDING the first period — the terminal period counts toward the 120
 * budget and is kept for complete sentences. A description with no period
 * yields the whole string. Over budget → truncate at the last word boundary
 * that fits WITH the trailing ellipsis inside the budget; the ellipsis
 * REPLACES the terminal period — a period is never appended after the
 * ellipsis (never '….'). Empty in → empty out. Total over every string input,
 * never throws.
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
  const body = sentence.endsWith('.') ? sentence.slice(0, -1) : sentence;
  const budget = maxChars - 1;
  if (budget <= 0) return '…';
  let cut = body.slice(0, budget);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace >= 0) cut = cut.slice(0, lastSpace);
  return `${cut.trimEnd()}…`;
}

/**
 * projectYear — the §4.2/§9 year-marker source: the FIRST
 * \b(?:19|20)\d{2}\b match in the raw project.date string, returned as a
 * string; absent, empty or unparseable dates → null.
 */
export function projectYear(date: string | null | undefined): string | null {
  if (!date) return null;
  const match = date.match(YEAR_PATTERN);
  return match ? match[0] : null;
}

/**
 * projectTechnologies — derives up to `max` technology chips from the project
 * description (UI-SPEC §4.5). Because portfolio-main-data.json has no
 * dedicated `technologies` field, this is a render-time derivation, NOT a data
 * mutation. If a future phase adds a `technologies` array to the Project type,
 * this function can fall back to that array with a one-line change.
 *
 * Algorithm:
 *   1. Lower-case the description once.
 *   2. Scan each lexicon term (also lower-cased) as a substring.
 *   3. Record the first-occurrence index of every hit.
 *   4. Sort hits by first-occurrence index, preserve order, deduplicate,
 *      cap at `max`, return the original-cased lexicon terms.
 */
export function projectTechnologies(description: string, max: number = 4): string[] {
  if (!description) return [];
  const haystack = description.toLowerCase();
  const hits: { term: string; index: number }[] = [];
  const seen = new Set<string>();

  for (const term of TECH_LEXICON) {
    const lowerTerm = term.toLowerCase();
    const index = haystack.indexOf(lowerTerm);
    if (index !== -1 && !seen.has(term)) {
      hits.push({ term, index });
      seen.add(term);
    }
  }

  hits.sort((a, b) => a.index - b.index);
  return hits.slice(0, max).map((h) => h.term);
}

/**
 * djb2 — stable 32-bit string hash. The modulo of this hash is used to pick
 * generative visual variants deterministically by project name.
 */
export function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return hash >>> 0;
}

/** Explicit flagship variant mapping. */
const FIXED_VARIANTS: Record<string, string> = {
  DeepIndex: 'terminal-mock',
  'Clarif-AI': 'contract-analysis',
};

const HASH_VARIANTS = ['glyph', 'report', 'dashboard', 'network'];

/**
 * projectVisualVariant — deterministic IDE-language visual variant for a
 * project card (UI-SPEC §4.4, D-03).
 *
 * `fixed = true` bypasses the hash and returns the named flagship variant for
 * known names regardless of position — used by tests to pin the flagship
 * contracts deterministically. `fixed = false` (default) is the production
 * path.
 */
export function projectVisualVariant(projectName: string, fixed: boolean = false): string {
  if (fixed && FIXED_VARIANTS[projectName]) return FIXED_VARIANTS[projectName];
  if (projectName === 'DeepIndex') return 'terminal-mock';
  if (projectName === 'Clarif-AI') return 'contract-analysis';
  return HASH_VARIANTS[djb2(projectName) % 4];
}

/** One stacked-card state at a position in the ring buffer. */
export interface CardState {
  translateY: number;
  translateX: number;
  scale: number;
  opacity: number;
  zIndex: number;
  rotation: number;
  activeAmount: number;
  visible: boolean;
}

/**
 * swipeAccepts — the pinned swipe-decision function.
 * A drag release accepts if its horizontal offset passes SWIPE_THRESHOLD
 * or its velocity passes SWIPE_VELOCITY_THRESHOLD. Returns the sign of the
 * accepted swipe (+1 for right, -1 for left) or 0 when rejected.
 */
export function swipeAccepts(offsetX: number, velocityX: number): -1 | 0 | 1 {
  if (!Number.isFinite(offsetX) || !Number.isFinite(velocityX)) return 0;
  const direction = (offsetX !== 0 ? Math.sign(offsetX) : Math.sign(velocityX)) as -1 | 0 | 1;
  if (direction === 0) return 0;
  if (Math.abs(offsetX) >= SWIPE_THRESHOLD || Math.abs(velocityX) >= SWIPE_VELOCITY_THRESHOLD) {
    return direction;
  }
  return 0;
}

/**
 * cardState — the §3 motion contract for card `cardIndex` when the ring-buffer
 * foreground is `frontIndex` across `count` cards.
 *
 * Geometry is derived from the cyclic distance (depth) of the card from the
 * foreground. The front card has depth 0; the card immediately behind it has
 * depth 1, and so on around the ring. The pinned LEVELS table provides yUp,
 * scale and opacity by depth. Curated imperfection (translateX/rotation) is
 * seeded by `cardIndex % 6` and forced to 0 under reduced motion.
 *
 * Reduced motion: translateY/translateX/scale/rotation are pinned to 0/1/0;
 * only opacity (via `1 - depth * 0.6`) and zIndex animate, giving a fast
 * state-swap fallback.
 *
 * Totality: non-finite inputs return a finite, hidden default. The function
 * never throws and never emits NaN.
 */
export function cardState(
  cardIndex: number,
  frontIndex: number,
  count: number,
  reducedMotion: boolean,
): CardState {
  const safeCount = Number.isFinite(count) && count > 0 ? count : 1;
  const safeIndex = Number.isFinite(cardIndex) ? cardIndex : 0;
  const safeFront = Number.isFinite(frontIndex) ? frontIndex : 0;

  if (!Number.isFinite(cardIndex) || !Number.isFinite(frontIndex)) {
    return {
      translateY: 0,
      translateX: 0,
      scale: 1,
      opacity: 0,
      zIndex: 0,
      rotation: 0,
      activeAmount: 0,
      visible: false,
    };
  }

  const depth = ((safeIndex - safeFront) % safeCount + safeCount) % safeCount;
  const activeAmount = depth === 0 ? 1 : 0;

  let translateY: number;
  let scale: number;
  let opacity: number;

  if (reducedMotion) {
    translateY = 0;
    scale = 1;
    opacity = depth === 0 ? 1 : clamp(1 - depth * 0.6, 0, 1);
  } else {
    if (depth <= 5) {
      const lower = Math.floor(depth);
      const upper = Math.ceil(depth);
      const t = smoothstep(depth - lower);
      translateY = lerp(LEVELS[lower].yUp, LEVELS[upper].yUp, t);
      scale = lerp(LEVELS[lower].scale, LEVELS[upper].scale, t);
      opacity = lerp(LEVELS[lower].opacity, LEVELS[upper].opacity, t);
    } else {
      const excess = depth - 5;
      translateY = LEVELS[5].yUp + excess * -38;
      scale = clamp(1 - 0.04 * depth, 0.8, 1);
      opacity = clamp(LEVELS[5].opacity - excess * 0.15, 0, 1);
    }
  }

  const translateX = reducedMotion
    ? 0
    : finiteOr(IMPERFECTION_X[(safeIndex % 6 + 6) % 6], 0);
  const rotation = reducedMotion
    ? 0
    : finiteOr(IMPERFECTION_ROTATION[(safeIndex % 6 + 6) % 6], 0);
  const zIndex = 100 - depth * 10;
  const visible = opacity > 0.05 && Number.isFinite(opacity);

  return {
    translateY: finiteOr(translateY, 0),
    translateX: finiteOr(translateX, 0),
    scale: finiteOr(scale, 1),
    opacity: finiteOr(opacity, 0),
    zIndex: finiteOr(zIndex, 0),
    rotation: finiteOr(rotation, 0),
    activeAmount: finiteOr(activeAmount, 0),
    visible,
  };
}
