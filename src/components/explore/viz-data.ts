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

// ---------------------------------------------------------------------------
// skillGroupFill / skillsGroupCounts — the single §2 category→token map
// ---------------------------------------------------------------------------

export interface SkillGroupCount {
  id: string;
  label: string;
  count: number;
  items: string[];
  fill: string;
}

/**
 * The SHARED category→token fill map pinned once here (UI-SPEC §2/§10 — the
 * bar chart AND the treemap both consume it; no component maps colors in
 * parallel). Contentful-group positions 0-4 map to chart-1…5 in order;
 * position 5 and above maps to muted-foreground (the spoken-languages gray).
 */
export function skillGroupFill(groupIndex: number): string {
  if (groupIndex >= 0 && groupIndex <= 4) {
    return `hsl(var(--chart-${groupIndex + 1}))`;
  }
  return 'hsl(var(--muted-foreground))';
}

/**
 * The skills grouping as the bar chart consumes it — the builder logic of
 * skills-section.tsx adopted VERBATIM (UI-SPEC §10 single-source pin: no
 * parallel grouping implementation): soft_skills first labelled 'Soft
 * Skills', then hard_skills categories in insertion order labelled by their
 * key, then the spoken-languages group. Contentful groups only, no sorting,
 * duplicate 'Languages' labels preserved; count = items.length; fill from
 * the shared §2 map by contentful-group position.
 */
export function skillsGroupCounts(skills: PortfolioData['skills']): SkillGroupCount[] {
  const groups: Array<{ id: string; label: string; items: string[] }> = [];
  if (skills.soft_skills.length > 0) {
    groups.push({ id: 'soft_skills', label: 'Soft Skills', items: skills.soft_skills });
  }
  for (const [category, items] of Object.entries(skills.hard_skills)) {
    if (items.length > 0) {
      groups.push({ id: `hard_skills.${category}`, label: category, items });
    }
  }
  if (skills.languages.length > 0) {
    groups.push({ id: 'languages', label: 'Languages', items: skills.languages });
  }
  return groups.map((group, position) => ({
    ...group,
    count: group.items.length,
    fill: skillGroupFill(position),
  }));
}

// ---------------------------------------------------------------------------
// projectStats — the three D-03 tile values
// ---------------------------------------------------------------------------

export interface ProjectStats {
  total: number;
  activeYearsSpan: string | null;
  linked: number;
}

const GLOBAL_YEAR_PATTERN = /\b(?:19|20)\d{2}\b/g;

/**
 * The three project stat-tile values (D-03), all computed from the data —
 * never literals (OQ-1/U-1: the stale SPEC "(9)" must not appear anywhere).
 * Graceful on the OPTIONAL date/link fields (R-6): entries without a date,
 * dates without a year ('Ongoing', E-8), and absent links are skipped —
 * never throws. activeYearsSpan joins min/max year with the en-dash U+2013
 * or null when no date parses (E-9); linked counts truthy links only.
 */
export function projectStats(projects: PortfolioData['projects']): ProjectStats {
  const years: number[] = [];
  for (const project of projects) {
    if (!project.date) continue;
    const matches = project.date.match(GLOBAL_YEAR_PATTERN);
    if (matches) {
      for (const year of matches) years.push(Number(year));
    }
  }
  const activeYearsSpan =
    years.length === 0 ? null : `${Math.min(...years)}\u2013${Math.max(...years)}`;
  let linked = 0;
  for (const project of projects) {
    if (project.link) linked += 1;
  }
  return { total: projects.length, activeYearsSpan, linked };
}

// ---------------------------------------------------------------------------
// buildCareerSpan — pure CSS Gantt geometry (D-02, UI-SPEC §4)
// ---------------------------------------------------------------------------

export interface CareerSpanRow {
  index: number;
  title: string;
  company: string;
  duration: string;
  isTechRelated: boolean;
  leftPct: number | null;
  widthPct: number | null;
}

export interface YearTick {
  year: number;
  leftPct: number;
}

export interface CareerSpanData {
  startYear: number;
  yearTicks: YearTick[];
  rows: CareerSpanRow[];
}

/** Month index = year * 12 + (month - 1) — the pure month unit (UI-SPEC §4). */
function monthIndex(year: number, month: number): number {
  return year * 12 + (month - 1);
}

/**
 * Career-span geometry (D-02, approved CSS-Gantt deviation): duration
 * strings → percentage positions on a shared axis. axisStart = the minimum
 * parsed start across all entries; axisEnd = the `now` month-index —
 * INJECTABLE for tests; the default `new Date()` evaluated during SSG
 * render freezes the export until rebuild (D-02/OQ-7). Rows render in JSON
 * order — NO sorting of any kind (R-4/E-6). Per row, title/company/duration
 * are copied VERBATIM as stored (the parser never alters display strings —
 * phase-2 data fidelity); 'Present' ends at axisEnd (E-3), an end beyond
 * now clamps (E-4), an unparseable duration yields null geometry (E-1,
 * track renders, bar omitted — never invented), and totalMonths <= 0
 * nulls every row (E-2 groundwork — the component then graceful-hides).
 * yearTicks: the axis-start year at 0%, then one tick at each January of
 * every subsequent year through the axis-end year; no right-edge tick.
 */
export function buildCareerSpan(
  experience: PortfolioData['experience'],
  now: Date = new Date(),
): CareerSpanData {
  const axisEnd = monthIndex(now.getFullYear(), now.getMonth() + 1);
  let axisStart = Number.POSITIVE_INFINITY;
  const parsedDurations = experience.map((entry) => {
    const parsed = parseDuration(entry.duration);
    if (parsed) {
      axisStart = Math.min(axisStart, monthIndex(parsed.startYear, parsed.startMonth));
    }
    return parsed;
  });
  const totalMonths = axisStart === Number.POSITIVE_INFINITY ? 0 : axisEnd - axisStart;
  const startYear =
    axisStart === Number.POSITIVE_INFINITY ? now.getFullYear() : Math.floor(axisStart / 12);

  const rows: CareerSpanRow[] = experience.map((entry, index) => {
    const base = {
      index,
      title: entry.title,
      company: entry.company,
      duration: entry.duration,
      isTechRelated: entry.isTechRelated,
    };
    const parsed = parsedDurations[index];
    if (!parsed || totalMonths <= 0) {
      return { ...base, leftPct: null, widthPct: null };
    }
    const start = monthIndex(parsed.startYear, parsed.startMonth);
    const end =
      parsed.endYear === null || parsed.endMonth === null
        ? axisEnd
        : Math.min(monthIndex(parsed.endYear, parsed.endMonth), axisEnd);
    return {
      ...base,
      leftPct: ((start - axisStart) / totalMonths) * 100,
      widthPct: ((end - start) / totalMonths) * 100,
    };
  });

  const yearTicks: YearTick[] = [];
  if (totalMonths > 0) {
    yearTicks.push({ year: startYear, leftPct: 0 });
    const axisEndYear = Math.floor(axisEnd / 12);
    for (let year = startYear + 1; year <= axisEndYear; year += 1) {
      yearTicks.push({ year, leftPct: ((year * 12 - axisStart) / totalMonths) * 100 });
    }
  }

  return { startYear, yearTicks, rows };
}