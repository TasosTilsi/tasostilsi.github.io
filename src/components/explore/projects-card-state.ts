/**
 * Pure card-state module for the projects stacked-card carousel — swipe-driven
 * Tinder-style ring buffer (phase-10 REV-18, user directive 2026-09-25).
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
 *     and derived from the REVEAL-LADDER formula below (2026-10-05), and it
 *     renders identically at EVERY motion preference
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

/**
 * ── The reveal-ladder contract (2026-10-05) ──────────────────────────────
 *
 * The stack's rest composition is a REVEAL LADDER: the foreground card plus
 * five progressively shallower card tops behind it — the curated
 * physical-stack look. ONE depth step reveals one more band of the
 * behind-card's TOP edge (its header strip + border) above the top edge of the
 * card in front of it:
 *
 *   scale_l       = clamp(1 - 0.04 * l, 0.80, 1)        0.96/0.92/0.88/0.84/0.80
 *   translateY(l) = -( l * VISIBLE_BAND_PX + H_front * (1 - scale_l) )
 *   yLeave(l)     = translateY(l) - LEAVE_EXTRA_PX
 *
 * WHY the `H_front * (1 - scale_l)` term — the defect this contract fixes:
 * each card scales about its BOTTOM edge (the `origin-bottom` class in
 * projects-stack-stage.tsx, the same edge the card box is anchored to), so a
 * level-l card's top edge FALLS by `H_front * (1 - scale_l)`. The retired table
 * (−38/−76/−114/−152/−190) was a bare offset step with no such compensation:
 * each revealed band collapsed to just `step − H_front * 0.04` (≈16px on the
 * 560px card — a near-invisible sliver) while the stage still reserved the
 * uncompensated band, so the reserved 250px read as dead space above the cards.
 * The compensation is what makes the reserved box and the revealed bands the
 * same arithmetic (see projects-stack-stage.tsx: stage = card + band + safe).
 *
 * The derived table (RECORDED here; every row is produced by levelsFor below,
 * never hand-typed into the table). H_front = 560 (md):
 *
 *   l       1     2     3     4     5
 *   yUp    -94  -189  -283  -378  -472
 *   yLeave -150 -245  -339  -434  -528
 *
 * and H_front = 520 (base, <md):
 *
 *   yUp    -93  -186  -278  -371  -464
 *   yLeave -149 -242  -334  -427  -520
 *
 * The depth-0 row is the identity row (yUp/yLeave 0, scale/opacity 1). Depth 6+
 * (which the six-card ring never reaches) extends the same formula.
 */

/** One depth level of the reveal ladder (depth 0 = the foreground card). */
export interface DepthLevel {
  yUp: number;
  yLeave: number;
  scale: number;
  opacity: number;
}

/** The band ONE depth step reveals of the behind-card's top, in px. */
export const VISIBLE_BAND_PX = 72;

/** How much further than yUp the fly-off offset (yLeave) carries the card. */
export const LEAVE_EXTRA_PX = 56;

/** The number of levels behind the foreground card (the top-6 stack). */
export const DEPTH_LEVELS = 5;

/**
 * The two front-card box heights the ladder is derived against, matching
 * CARD_HEIGHT_CLASS in projects-stack-stage.tsx. The module's runtime table
 * uses the md height: the stage tiers its card box in CSS alone (one DOM at
 * every width), so cardState cannot read the live tier, and the md-derived
 * table differs from the base-derived one by ≤4px at base — a sub-pixel-
 * invisible drift, documented rather than plumbed through matchMedia.
 */
export const CARD_HEIGHT_MD = 560;
export const CARD_HEIGHT_BASE = 520;

/** The opacity ladder — unchanged: deeper card tops read as layered paper. */
const OPACITY_LADDER = [1.0, 0.95, 0.85, 0.7, 0.5, 0.3];

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

/** scaleFor — the scale ladder as a formula, unchanged: 1 − 0.04·depth, floored
 * at 0.80. Depth 1..5 → 0.96/0.92/0.88/0.84/0.80; depth ≥ 5 holds the floor. */
function scaleFor(depth: number): number {
  return clamp(1 - 0.04 * depth, 0.8, 1);
}

/** yUpFor — the reveal ladder's ONE offset site: the depth step plus the
 * bottom-origin top-edge fall `H·(1 − scale)`. Total: depth ≤ 0 pins to 0. */
function yUpFor(depth: number, cardHeight: number): number {
  if (!(depth > 0)) return 0;
  return -Math.round(depth * VISIBLE_BAND_PX + cardHeight * (1 - scaleFor(depth)));
}

/**
 * levelsFor — the reveal ladder as a function of the front-card height: one
 * DepthLevel row per depth 0..DEPTH_LEVELS. This is the module's ONE table
 * derivation site; the runtime LEVELS table below is this call at the md card
 * height, and the test suite pins this function for both tiers. Total: a
 * non-finite or non-positive cardHeight falls back to the md box.
 */
export function levelsFor(cardHeight: number = CARD_HEIGHT_MD): DepthLevel[] {
  const h = Number.isFinite(cardHeight) && cardHeight > 0 ? cardHeight : CARD_HEIGHT_MD;
  return Array.from({ length: DEPTH_LEVELS + 1 }, (_, depth) => {
    const yUp = yUpFor(depth, h);
    return {
      yUp,
      yLeave: depth === 0 ? 0 : yUp - LEAVE_EXTRA_PX,
      scale: scaleFor(depth),
      opacity: OPACITY_LADDER[depth],
    };
  });
}

/** The runtime depth-level table (UI-SPEC §3.3), derived at the md card height. */
const LEVELS = levelsFor(CARD_HEIGHT_MD);

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

/**
 * CURATED_VARIANTS — the PRIMARY per-project visual assignment (phase-10
 * gap-closure plan 04, REV-19 "6 distinct variants"). One entry per top-6
 * project, in data order, keyed by project name. These six identifiers are the
 * frozen contract, and each is anatomy-matched to a delivered component in
 * sections/projects-stack-stage.tsx:
 *
 *   DeepIndex                 -> terminal-mock      (TerminalVisual: terminal / context-engine mock)
 *   Clarif-AI                 -> contract-analysis  (ContractVisual: document sheet with clause flags)
 *   SDK4ED-TD                 -> glyph              (GlyphVisual: architecture nodes joined by edges)
 *   ServicedMetricsCalculator -> report             (ReportVisual: three tiles, five bars, polyline)
 *   Avoid Traffic Extended    -> network            (NetworkVisual: road grid, accent route, pin)
 *   Uom Track                 -> dashboard          (DashboardVisual: KPI tiles + progress bars)
 *
 * Why the table is primary and the name hash is not: the djb2 % 4 hash collides
 * twice over the delivered top-6 (`ServicedMetricsCalculator` and `Uom Track`
 * both landed on 'network'), so the hash alone yielded only 5 distinct visuals
 * for 6 cards and failed REV-19 (phase-10 VERIFICATION AP-1). Promoting the
 * curated table makes distinctness a property of the design record instead of a
 * coincidence of a string hash; the hash is retained as the deterministic
 * fallback so the mechanism stays total for any project outside these six.
 *
 * Two fidelity facts are recorded here because they are deliberate, not drift:
 *   1. The shipped identifiers differ from UI-SPEC §4.4's drafted variant labels
 *      (`architecture-diagram` / `metrics-dashboard` / `report-table` /
 *      `route-map`). The six delivered components are the authority; §4.4's
 *      composition column remains the anatomy record, and plan 06 reconciles
 *      §4.4's variant column to these shipped identifiers.
 *   2. Four assignments follow the delivered anatomy exactly. The one divergence
 *      is Uom Track -> `dashboard`: its shipped composition is the KPI/progress
 *      panel, not §4.4 row 5's drafted report table, which no shipped component
 *      implements.
 */
const CURATED_VARIANTS: Record<string, string> = {
  DeepIndex: 'terminal-mock',
  'Clarif-AI': 'contract-analysis',
  'SDK4ED-TD': 'glyph',
  'ServicedMetricsCalculator': 'report',
  'Avoid Traffic Extended': 'network',
  'Uom Track': 'dashboard',
};

/** The deterministic djb2 name-hash FALLBACK set, for names outside the curated six. */
const HASH_VARIANTS = ['glyph', 'report', 'dashboard', 'network'];

/**
 * projectVisualVariant — deterministic IDE-language visual variant for a
 * project card (UI-SPEC §4.4, D-03).
 *
 * Precedence:
 *   1. `fixed = true` returns the curated entry for a known name regardless of
 *      position or hash — the pinned flagship contracts resolve here.
 *   2. The curated per-project table (CURATED_VARIANTS) — the production path
 *      for the six top-6 projects.
 *   3. The djb2 name-hash over HASH_VARIANTS — the fallback for any project name
 *      outside the curated six.
 */
export function projectVisualVariant(projectName: string, fixed: boolean = false): string {
  if (fixed && CURATED_VARIANTS[projectName]) return CURATED_VARIANTS[projectName];
  if (Object.prototype.hasOwnProperty.call(CURATED_VARIANTS, projectName)) {
    return CURATED_VARIANTS[projectName];
  }
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

/** Which step source fed the ring: the drag gesture or one of the two controls. */
export type RingSource = 'swipe' | 'next' | 'previous';

/**
 * RingStep — one step of the ring, as TWO independent inputs:
 *
 *   - `ringDelta` — the ring ADVANCE. It is authoritative on which card comes
 *     forward and it is +1 for `next` and for an accepted swipe on EITHER side.
 *   - `exitSign` — the fly-off SIDE only. Pure presentation: which way the
 *     departing card leaves the screen.
 *
 * Keeping them separate is the contract, not a style choice. The retired
 * coupling — one sign governing both the exit animation and the ring rotation
 * (`cycle(1)` / `cycle(-1)` / `newFront = frontIndex + direction`) — inverted
 * the rotation for `next` and for a left swipe, so the departing card landed at
 * depth 1 (the peek) instead of the back and the Next control decremented the
 * counter. That is phase-10 VERIFICATION gap R6 / AP-13.
 */
export interface RingStep {
  ringDelta: -1 | 1;
  exitSign: -1 | 1;
}

/**
 * ringStep — the pinned mapping from a step source to its ring delta and exit
 * sign, and the module's ONE mapping site:
 *
 *   next     -> { ringDelta:  1, exitSign: -1 }  advance the ring, fly off LEFT
 *   previous -> { ringDelta: -1, exitSign:  1 }  step the ring back, fly off RIGHT
 *   swipe    -> { ringDelta:  1, exitSign: gesture }
 *
 * The swipe arm NEVER branches on the gesture for the advance: both sides send
 * the foreground card to the back and differ only in the exit sign. An absent,
 * zero or non-finite gesture defaults the exit sign to +1, so the result is
 * always a finite ±1 and the ring never reverses.
 */
export function ringStep(source: RingSource, gesture?: -1 | 0 | 1): RingStep {
  if (source === 'previous') return { ringDelta: -1, exitSign: 1 };
  if (source === 'next') return { ringDelta: 1, exitSign: -1 };
  return { ringDelta: 1, exitSign: gesture === -1 ? -1 : 1 };
}

/**
 * advanceFront — the ring's ONE index-advance site: the foreground index
 * `ringDelta` steps around a ring of `count` cards and is normalised into
 * [0, count). Non-finite `frontIndex`/`ringDelta` pin the result to 0; a
 * non-finite or <= 0 `count` is treated as a one-card ring, whose only index is
 * 0. Never throws, never emits NaN, always returns a finite integer.
 */
export function advanceFront(frontIndex: number, ringDelta: number, count: number): number {
  const safeCount = Number.isFinite(count) && count > 0 ? count : 1;
  if (!Number.isFinite(frontIndex) || !Number.isFinite(ringDelta)) return 0;
  return (((Math.trunc(frontIndex) + Math.trunc(ringDelta)) % safeCount) + safeCount) % safeCount;
}

/**
 * ringDepth — the ring's ONE cyclic-depth site: how many levels card
 * `cardIndex` sits BEHIND the foreground index (0 = foreground, `count - 1` =
 * the back of the stack). Same guards as advanceFront: non-finite inputs yield
 * 0 and the result is always a finite integer in [0, count).
 */
export function ringDepth(cardIndex: number, frontIndex: number, count: number): number {
  const safeCount = Number.isFinite(count) && count > 0 ? count : 1;
  if (!Number.isFinite(cardIndex) || !Number.isFinite(frontIndex)) return 0;
  return (((Math.trunc(cardIndex) - Math.trunc(frontIndex)) % safeCount) + safeCount) % safeCount;
}

/**
 * cardState — the §3 motion contract for card `cardIndex` when the ring-buffer
 * foreground is `frontIndex` across `count` cards.
 *
 * Geometry is derived from the cyclic distance (depth) of the card from the
 * foreground. The front card has depth 0; the card immediately behind it has
 * depth 1, and so on around the ring. The pinned reveal-ladder table provides
 * yUp, scale and opacity by depth. Curated imperfection (translateX/rotation)
 * is seeded by `cardIndex % 6`.
 *
 * Reduced motion (amended 2026-10-05): the depth composition is NOT motion — it
 * is the stack's rest arrangement and renders identically at every motion
 * preference, so an RM visitor never sees the stack flatten (or the behind
 * cards disappear) with the OS setting. Under RM only the transitions go
 * instant (the stage's RM branch) and the curated imperfection — translateX and
 * rotation — is suppressed; translateY/scale/opacity/zIndex are the same
 * values the non-RM path returns.
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

  // The reveal ladder — motion-independent: it is the rest composition, so it
  // is derived once, outside the reduced-motion branch (RM amendment above).
  let translateY: number;
  let scale: number;
  let opacity: number;

  if (depth <= DEPTH_LEVELS) {
    const lower = Math.floor(depth);
    const upper = Math.ceil(depth);
    const t = smoothstep(depth - lower);
    translateY = lerp(LEVELS[lower].yUp, LEVELS[upper].yUp, t);
    scale = lerp(LEVELS[lower].scale, LEVELS[upper].scale, t);
    opacity = lerp(LEVELS[lower].opacity, LEVELS[upper].opacity, t);
  } else {
    // Depth 6+ — the six-card ring never reaches it. The same formula,
    // extended: the scale ladder is already floored at 0.80 from depth 5.
    const excess = depth - DEPTH_LEVELS;
    translateY = yUpFor(depth, CARD_HEIGHT_MD);
    scale = scaleFor(depth);
    opacity = clamp(LEVELS[DEPTH_LEVELS].opacity - excess * 0.15, 0, 1);
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
