/**
 * viz-data — the pure, typed data-shaping module for the explore panel
 * bodies (D-05, UI-SPEC §10).
 *
 * The single data-shaping site under src/components/explore/ — components
 * never shape data inline; they receive precomputed values from the
 * functions below. The chart machinery is GONE (EXPLORE-07 REV-08/U-6):
 * the duration/date parse block and both chart builders were deleted with
 * their chart components. What survives feeds the non-chart panels:
 * skillGroupFill / skillsGroupCounts (the Skills chips) and projectStats
 * (the Projects stat tiles), which keep their own GLOBAL_YEAR_PATTERN for
 * the tile span.
 *
 * ZERO runtime imports: the sole import line is the type-only PortfolioData
 * import, erased at runtime so Node 24 type stripping can import this file
 * directly under `node --test` (RESEARCH.md §2 / OQ-5). Erasable TS syntax
 * only — type annotations and interfaces, no enum/namespace/parameter
 * properties.
 *
 * Every rendered number in the explore panels traces to
 * portfolio-main-data.json through this module (EXPLORE-07). No sorting of
 * data-derived arrays anywhere (D-02/R-4: JSON order is render order).
 */
import type { PortfolioData } from '@/data/portfolio-main-data';

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