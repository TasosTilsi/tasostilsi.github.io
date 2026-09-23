/**
 * Server-invariant carrier for the explore visuals — EXPLORE-07 edition: the
 * two chart slices are deleted (REV-08/D-03 — career-span Gantt + year-grid
 * calendar), so this suite pins the non-chart panel bodies: the Experience
 * rail+dots timeline as the polished non-chart showcase (U-8 merged meta
 * row, verbatim strings) and the Projects stat tiles above the cards.
 *
 * Runner: node --test tests/explore-visuals-server.test.mjs (no npm test
 * script exists — run directly).
 *
 * Local-only gate: CI (deploy.yml) runs Node 20 and never runs tests. These
 * are Layer-2 source-level invariants in the explore-shell.test.mjs style —
 * no export needed; the timeline and tiles are pure server components fully
 * present in the static export without JS.
 *
 * Scope discipline: Experience/Projects panel bodies + the stat-tiles slice
 * only; Skills panel pins live in explore-visuals-skills.test.mjs.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const ganttPath = 'src/components/explore/sections/career-span-chart.tsx';
const tilesPath = 'src/components/explore/sections/project-stat-tiles.tsx';
const expPath = 'src/components/explore/sections/experience-section.tsx';
const projPath = 'src/components/explore/sections/projects-section.tsx';

// ---------------------------------------------------------------------------
// Task 1 (EXPLORE-07): experience showcase — non-chart composition contract
// (REV-08/D-03/U-8): the rail+dots timeline is the first body child, no
// chart machinery remains, and one merged meta row carries duration and
// location verbatim.
// ---------------------------------------------------------------------------

test('career-span-chart.tsx deleted — experience-section imports no chart machinery (REV-08/D-03)', () => {
  assert.equal(existsSync(join(root, ganttPath)), false, 'career-span-chart.tsx deleted with its subject');
  const src = read(expPath);
  assert.ok(!src.includes('CareerSpanChart'), 'no CareerSpanChart import or composition');
  assert.ok(!src.includes('buildCareerSpan'), 'no buildCareerSpan import');
  assert.ok(!src.includes("from '../viz-data'"), 'no viz-data import remains — the section neither parses nor charts');
  assert.ok(!src.includes('mb-5'), 'the chart mb-5 wrapper is gone');
});

test('experience-section: the rail+dots <ol> is the first body child (§3.1, REV-07 still deferred)', () => {
  const src = read(expPath);
  const olIdx = src.indexOf('<ol');
  assert.ok(olIdx !== -1, '<ol> timeline present');
  const returnIdx = src.lastIndexOf('return (', olIdx);
  assert.ok(returnIdx !== -1, 'the component return is present');
  assert.match(
    src.slice(returnIdx, olIdx),
    /return \(\s*<div>\s*$/,
    'nothing renders between the root <div> and the timeline <ol> — the chart wrapper is gone',
  );
  assert.ok(src.includes('relative space-y-5 border-l border-border'), 'rail anatomy unchanged (D-03 keep)');
  assert.ok(src.includes('bg-chart-2'), 'chart-2 timeline dot unchanged');
});

test('experience-section: merged duration·location meta row (U-8) — tabular-nums, aria-hidden separator, verbatim order', () => {
  const src = read(expPath);
  const durationIdx = src.indexOf('<span className="tabular-nums">{entry.duration}</span>');
  const sepIdx = src.indexOf('<span aria-hidden="true"> · </span>');
  const locationIdx = src.indexOf('{entry.location}');
  assert.ok(durationIdx !== -1, 'duration span pinned tabular-nums, rendered AS STORED');
  assert.ok(sepIdx !== -1, 'the " · " separator is an aria-hidden span — no entity invented from data');
  assert.ok(locationIdx !== -1, 'location rendered verbatim after the separator');
  assert.ok(durationIdx < sepIdx && sepIdx < locationIdx, 'meta row order: duration → separator → location');
  assert.ok(
    src.includes('<p className="text-xs text-muted-foreground">'),
    'one meta line carries both strings (U-8 merge)',
  );
  assert.ok(
    !src.includes('text-muted-foreground tabular-nums'),
    'the old stacked duration-paragraph pattern is gone (merged, not duplicated)',
  );
});

test('experience-section: caps and fidelity byte-stable (slice(0,3), ≤3 bullets, no sort/normalize, pointer)', () => {
  const src = read(expPath);
  assert.ok(src.includes('experience.slice(0, 3)'), 'D-01 3-role cap unchanged');
  assert.ok(src.includes('(entry.responsibilities ?? []).slice(0, 3)'), '≤3 bullets unchanged');
  assert.ok(src.includes('{entry.duration}'), 'duration rendered AS STORED');
  assert.ok(src.includes('{entry.location}'), 'location rendered AS STORED');
  assert.ok(!src.includes('.sort('), 'no sorting of data-derived arrays (R-4/E-6)');
  assert.ok(!src.includes('.replace('), 'dash styles are display data, never normalized (D-02/§4)');
  assert.ok(src.includes('experience --all'), 'terminal pointer unchanged');
  assert.ok(!src.includes('use client'), 'stays a server component (§2)');
});
// ---------------------------------------------------------------------------
// Task 2: project stat tiles — augment order, D-05 single-source, no literals
// ---------------------------------------------------------------------------

test('project-stat-tiles: exists as a pure server component (no client, no recharts)', () => {
  const src = read(tilesPath);
  assert.ok(src.length > 0, 'file exists');
  assert.ok(!src.includes('"use client"'), 'no "use client" directive — server component');
  assert.ok(!/from ['"]recharts['"]/.test(src), 'no recharts import — plain CSS tiles');
});

test('project-stat-tiles: pinned 3-up grid anatomy (§5 — never stacks at 375px)', () => {
  const src = read(tilesPath);
  assert.ok(src.includes('grid grid-cols-3 gap-2'), 'root is grid-cols-3 gap-2');
  assert.ok(src.includes('rounded-md border border-border p-2.5'), 'tile anatomy mirrors the cards');
});

test('project-stat-tiles: values received via props (D-05) + E-9 em-dash placeholder', () => {
  const src = read(tilesPath);
  assert.ok(src.includes('stats.activeYearsSpan'), 'span value arrives from ProjectStats props');
  assert.ok(src.includes("'—'") || src.includes('—'), "E-9 placeholder keeps the grid when no date parses");
});

test('project-stat-tiles: zero stat literals in code (EXPLORE-07 — doc comments stripped)', () => {
  const src = read(tilesPath).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  for (const literal of ['14', '9', '2016', '2026']) {
    assert.ok(
      !new RegExp(`(?<![\\w.])${literal}(?![\\w.])`).test(src),
      `no standalone literal ${literal} driving a rendered value (OQ-1/U-1)`,
    );
  }
});

test('projects-section: ProjectStatTiles composed BEFORE the cards map with an mb-3 wrapper', () => {
  const src = read(projPath);
  const tilesIdx = src.indexOf('<ProjectStatTiles');
  const cardsIdx = src.indexOf('cards.map(');
  assert.ok(tilesIdx !== -1, '<ProjectStatTiles present');
  assert.ok(cardsIdx !== -1, 'cards map present');
  assert.ok(tilesIdx < cardsIdx, 'tiles compose BEFORE the 6 cards (§1 ③)');
  assert.ok(src.includes('mb-3'), 'tiles wrapper carries mb-3 (§1: 12px tiles→cards gap)');
});

test('projects-section: tile values from projectStats(projects) (D-05/EXPLORE-07)', () => {
  const src = read(projPath);
  assert.ok(src.includes('projectStats(projects)'), 'stats computed by the viz-data module, never inline');
  assert.ok(src.includes("from '../viz-data'"), 'imports from the viz-data module');
});

test('projects-section: cards body byte-stable (slice(0,6), one-link card, TerminalPointer)', () => {
  const src = read(projPath);
  assert.ok(src.includes('projects.slice(0, 6)'), 'D-01 top-6 cap unchanged');
  assert.ok(src.includes('target="_blank"'), 'linked-card anchor unchanged');
  assert.ok(src.includes('projects --all'), 'terminal pointer unchanged');
});
