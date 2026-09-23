/**
 * Unit suite for viz-data's buildProjectCalendar — the Projects panel's
 * year-grid bars calendar geometry (plan EXPLORE-06-explore-revision-04
 * task 1; D-07, UI-SPEC §5).
 *
 * Runner: node --test tests/projects-calendar.test.mjs (Node built-in,
 * zero npm deps — the explore-suite convention). Imports the pure TS module
 * directly with an explicit .ts extension; Node 24 strips the type-only
 * import at load (same pattern as tests/explore-visuals.test.mjs).
 *
 * Fixed now = new Date('2026-09-21T00:00:00Z') pins the axis end-year at
 * 2026 regardless of the machine clock (OQ-7 injectable-now precedent from
 * buildCareerSpan). Every expectation over portfolio data derives from the
 * real src/data/portfolio-main-data.json at test time (EXPLORE-07).
 *
 * Recorded adjudication (plan task 1, overriding UI-SPEC §5.4 as written
 * before RESEARCH OQ-1): year-only dates ('2026') render a FULL-YEAR-SPAN
 * bar inside their year column — the year is the precision the data
 * carries and inventing a month would violate geometry-never-invented in
 * the opposite direction; 'Ongoing' keeps the null-geometry row verbatim.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildProjectCalendar } from '../src/components/explore/viz-data.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
// Doc-comment stripping per the explore-shell suite convention: banned-literal
// greps judge code, not prose.
const codeOf = (p) => read(p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const data = JSON.parse(read('src/data/portfolio-main-data.json'));

const NOW = new Date('2026-09-21T00:00:00Z');

/** monthIndex — the pure month unit (viz-data §4): year * 12 + (month - 1). */
const monthIndex = (year, month) => year * 12 + (month - 1);
const MONTH_NUMBERS = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};
const near = (actual, expected, epsilon = 1e-9) =>
  assert.ok(Math.abs(actual - expected) < epsilon, `${actual} ≉ ${expected}`);

// ---------------------------------------------------------------------------
// Geometry builder (unit — the only suite importing buildProjectCalendar)
// ---------------------------------------------------------------------------

test('buildProjectCalendar: 11 year columns 2016..2026 — min data year, injectable-now endYear (OQ-12)', () => {
  const calendar = buildProjectCalendar(data.projects, NOW);
  assert.equal(calendar.startYear, 2016); // 'November 2016' / 'October 2016'
  assert.equal(calendar.endYear, 2026); // the fixed now's year
  assert.deepEqual(calendar.yearColumns, [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]);
  assert.equal(calendar.yearColumns.length, 11);
});

test('buildProjectCalendar: rows in JSON order for all 14 projects — index/name/date verbatim (R-4/E-6, no sorting)', () => {
  const calendar = buildProjectCalendar(data.projects, NOW);
  assert.equal(calendar.rows.length, data.projects.length);
  assert.equal(calendar.rows.length, 14);
  calendar.rows.forEach((row, index) => {
    assert.equal(row.index, index);
    assert.equal(row.name, data.projects[index].name);
    assert.equal(row.date, data.projects[index].date);
  });
  // No-sorting probe: reversed input → reversed rows (the builder never reorders).
  const reversed = buildProjectCalendar([...data.projects].reverse(), NOW);
  assert.deepEqual(reversed.rows.map((row) => row.name), [...data.projects].reverse().map((p) => p.name));
});

test('buildProjectCalendar: Month YYYY → one-month-cell bar, leftPct arithmetic against monthIndex (SDK4ED-TD June 2023)', () => {
  const calendar = buildProjectCalendar(data.projects, NOW);
  const axisStart = monthIndex(2016, 1); // 24192
  const totalMonths = 132; // (2026 - 2016 + 1) * 12
  const ship = monthIndex(2023, 6); // 24281
  const row = calendar.rows.find((entry) => entry.name === 'SDK4ED-TD');
  assert.equal(row.date, 'June 2023');
  assert.ok(row.leftPct !== null && row.widthPct !== null);
  assert.ok(Math.abs(row.leftPct - ((ship - axisStart) / totalMonths) * 100) < 1e-9);
  assert.ok(Math.abs(row.widthPct - (1 / totalMonths) * 100) < 1e-9);
});

test('buildProjectCalendar: November 2016 (The Elucidated) spot check + every month-parsed bar is exactly one cell', () => {
  const calendar = buildProjectCalendar(data.projects, NOW);
  const axisStart = monthIndex(2016, 1);
  const totalMonths = 132;
  const elucidated = calendar.rows.find((entry) => entry.name === 'The Elucidated');
  const ship = monthIndex(2016, 11); // 24202
  assert.ok(Math.abs(elucidated.leftPct - ((ship - axisStart) / totalMonths) * 100) < 1e-9);
  // Every row with geometry spans a whole number of month cells: 1 (ship
  // month, D-07) or 12 (year-only, OQ-1) — never a fraction or invention.
  const monthCell = (1 / totalMonths) * 100;
  for (const row of calendar.rows) {
    if (row.widthPct === null) continue;
    const cells = row.widthPct / monthCell;
    assert.ok(Number.isInteger(Math.round(cells * 1e9) / 1e9), `width ${row.widthPct} is a whole month-cell multiple`);
  }
  // 11 one-month bars + 2 full-year bars = 13 rows with geometry; 1 null ('Ongoing').
  const withBars = calendar.rows.filter((row) => row.leftPct !== null);
  assert.equal(withBars.length, 13);
});

test('buildProjectCalendar: year-only dates (2026 — DeepIndex, Clarif-AI) → full-year-span bars (OQ-1 override)', () => {
  const calendar = buildProjectCalendar(data.projects, NOW);
  for (const name of ['DeepIndex', 'Clarif-AI']) {
    const row = calendar.rows.find((entry) => entry.name === name);
    assert.equal(row.date, '2026');
    assert.ok(row.leftPct !== null && row.widthPct !== null, 'year-only dates carry full-year geometry');
    const start = monthIndex(2026, 1); // January — no month invented
    assert.ok(Math.abs(row.leftPct - ((start - monthIndex(2016, 1)) / 132) * 100) < 1e-9);
    assert.ok(Math.abs(row.widthPct - (12 / 132) * 100) < 1e-9);
    // The bar ends exactly at the axis end (December of the now year).
    assert.ok(Math.abs(row.leftPct + row.widthPct - 100) < 1e-9);
  }
});

test('buildProjectCalendar: Ongoing (Portfolio Website) → null-geometry row, verbatim date (E-1)', () => {
  const calendar = buildProjectCalendar(data.projects, NOW);
  const row = calendar.rows.find((entry) => entry.name === 'Portfolio Website');
  assert.equal(row.date, 'Ongoing');
  assert.equal(row.leftPct, null);
  assert.equal(row.widthPct, null);
  assert.equal(row.name, 'Portfolio Website'); // the row stays — never dropped
});

test('buildProjectCalendar: unparseable dates never throw — geometry never invented (E-1)', () => {
  const synthetic = [
    { name: 'Ghost', date: 'Someday 1999' }, // a year, but no month word
    { name: 'Real', date: 'June 2023' },
    { name: 'Bare', date: 'Ongoing' },
    { name: 'Missing', date: undefined },
  ];
  const calendar = buildProjectCalendar(synthetic, NOW);
  assert.equal(calendar.rows.length, 4);
  assert.equal(calendar.rows[0].leftPct, null);
  assert.equal(calendar.rows[0].date, 'Someday 1999'); // verbatim, no bar
  assert.equal(calendar.rows[2].leftPct, null);
  assert.equal(calendar.rows[3].leftPct, null);
  assert.ok(calendar.rows[1].leftPct !== null);
});

test('buildProjectCalendar: all dates unparseable → every row null (E-2 groundwork; the renderer hides)', () => {
  const synthetic = [
    { name: 'A', date: 'Ongoing' },
    { name: 'B', date: 'Someday' },
  ];
  const calendar = buildProjectCalendar(synthetic, NOW);
  assert.equal(calendar.rows.length, 2);
  assert.ok(calendar.rows.every((row) => row.leftPct === null && row.widthPct === null));
});

// ---------------------------------------------------------------------------
// Renderer + composition + css override (source invariants)
// ---------------------------------------------------------------------------

test('projects-calendar.tsx: pure server renderer — no use client, no hooks, no recharts; chart-4 fill + min-width guard (§5.3)', () => {
  const code = codeOf('src/components/explore/sections/projects-calendar.tsx');
  assert.ok(!code.includes("'use client'"), 'no client directive — server renderer');
  assert.ok(!/use(State|Effect|Memo|Ref|Callback)\(/.test(code), 'no hooks');
  assert.ok(!code.includes('recharts'), 'no chart library');
  assert.ok(code.includes('bg-chart-4'), 'bar carries the Projects accent fill (hsl(var(--chart-4)) via the token class)');
  assert.ok(/minWidth:\s*2/.test(code), 'degenerate single-month cells stay visible at 375px (E-5 precedent)');
  assert.ok(code.includes('aria-hidden="true"'), 'tracks/bars aria-hidden (§5.5)');
  assert.ok(code.includes('tabular-nums'), 'year ticks + dates tabular (§5.3)');
});

test('projects-section.tsx: calendar composes FIRST, above the tiles wrapper and the cards (§5.1/B-4)', () => {
  const code = codeOf('src/components/explore/sections/projects-section.tsx');
  assert.ok(code.includes("from './projects-calendar'"), 'imports the renderer');
  const calendarPos = code.indexOf('<ProjectsCalendar');
  const tilesPos = code.indexOf('<ProjectStatTiles');
  const cardsPos = code.indexOf('cards.map');
  assert.ok(calendarPos !== -1 && tilesPos !== -1 && cardsPos !== -1, 'all three compositions present');
  assert.ok(calendarPos < tilesPos, 'calendar above the stat tiles');
  assert.ok(tilesPos < cardsPos, 'stat tiles above the cards');
  assert.ok(/hasCalendar\s*&&/.test(code), 'E-2: the wrapper hides when no row has geometry');
});

test('globals.css: light-mode --chart-4 hue-preserving override beside the chart-2/3 block (§5.3/§14.9)', () => {
  const css = read('src/app/globals.css');
  const shellBlock = css.slice(css.indexOf('.light .explore-shell'), css.indexOf('@media (prefers-reduced-motion'));
  const override = shellBlock.match(/--chart-4:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  assert.ok(override, 'the light shell block pins a --chart-4 override');
  assert.equal(override[1], '280', 'hue preserved from the dark value');
  assert.equal(Number(override[3]) < 60, true, 'lightness darkened below the dark-shell 60%');
});