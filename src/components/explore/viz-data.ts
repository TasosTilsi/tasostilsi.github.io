/**
 * viz-data — the pure, typed data-shaping module for the phase-3 explore
 * visualizations (D-05/D-08, UI-SPEC §10).
 *
 * The ONLY duration/date parsing and mention-matching site under
 * src/components/explore/ — components never parse strings inline; they
 * receive precomputed values from the functions below.
 *
 * ZERO runtime imports: the sole import line is the type-only PortfolioData
 * import, erased at runtime so Node 24 type stripping can import this file
 * directly under `node --test` (RESEARCH.md §2 / OQ-5). Erasable TS syntax
 * only — type annotations and interfaces, no enum/namespace/parameter
 * properties.
 *
 * Every rendered number in the phase-3 visualizations traces to
 * portfolio-main-data.json through this module (EXPLORE-07). No sorting of
 * data-derived arrays anywhere (D-02/R-4: JSON order is render order).
 */
import type { PortfolioData } from '@/data/portfolio-main-data';

// ---------------------------------------------------------------------------
// parseDuration — "Sept 2023 — Present" | "November 2017 - April 2018" | …
// ---------------------------------------------------------------------------

export interface ParsedDuration {
  startYear: number;
  startMonth: number;
  endYear: number | null;
  endMonth: number | null;
  isPresent: boolean;
}

const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

/**
 * Month token → 1-based month number by FIRST-THREE-LETTER prefix,
 * case-insensitive. Resolves every token present in the data — 'Sept' (4
 * letters), 'November', 'June', 'April', 'March' (full words), 'Aug', 'May',
 * 'July' (R-5) — with zero ambiguity in this dataset.
 */
function parseMonthToken(token: string): number | null {
  const prefix = token.trim().toLowerCase().slice(0, 3);
  if (prefix.length < 3) return null;
  const index = MONTH_NAMES.findIndex((name) => name.startsWith(prefix));
  return index === -1 ? null : index + 1;
}

const YEAR_PATTERN = /\b(?:19|20)\d{2}\b/;

/** Parse one side ("Sept 2023") into its year and 1-based month, or null. */
function parseMonthYear(side: string): { year: number; month: number } | null {
  const yearMatch = side.match(YEAR_PATTERN);
  if (!yearMatch) return null;
  // The month token is the year's alphabetic neighbour (everything that is
  // not a digit around the year) — e.g. "Sept 2023" → "Sept", "June 2017" →
  // "June".
  const wordMatch = side.match(/[a-zA-Z]+/);
  if (!wordMatch) return null;
  const month = parseMonthToken(wordMatch[0]);
  if (month === null) return null;
  return { year: Number(yearMatch[0]), month };
}

/**
 * Parse a duration string into exact start/end months. Handles BOTH dash
 * styles present in the data (em-dash U+2014 and hyphen-minus U+002D), the
 * 4-letter 'Sept' token via first-3-letter month matching, and 'Present'
 * semantics (case-insensitive) — the 'Present' side leaves endYear/endMonth
 * null with isPresent true. Returns null on any malformed side — never
 * throws (E-1 groundwork; the Gantt row then renders with verbatim text and
 * no bar).
 */
export function parseDuration(raw: string): ParsedDuration | null {
  const sides = raw.split(/[\u2014-]/);
  if (sides.length !== 2) return null;
  const startSide = sides[0].trim();
  const endSide = sides[1].trim();
  const start = parseMonthYear(startSide);
  if (!start) return null;
  if (endSide.toLowerCase() === 'present') {
    return { startYear: start.year, startMonth: start.month, endYear: null, endMonth: null, isPresent: true };
  }
  const end = parseMonthYear(endSide);
  if (!end) return null;
  return { startYear: start.year, startMonth: start.month, endYear: end.year, endMonth: end.month, isPresent: false };
}