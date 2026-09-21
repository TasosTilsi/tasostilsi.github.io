/**
 * Plan-03 source-invariant carrier for EXPLORE-03-explore-visuals — the two
 * server-rendered visualization slices (career-span Gantt above the text
 * timeline, project stat tiles above the cards).
 *
 * Runner: node --test tests/explore-visuals-server.test.mjs (no npm test
 * script exists — run directly).
 *
 * Local-only gate: CI (deploy.yml) runs Node 20 and never runs tests. These
 * are Layer-2 source-level invariants in the explore-shell.test.mjs style —
 * no export needed; the Gantt and tiles are pure server components fully
 * present in the static export without JS.
 *
 * Scope discipline (wave-2 shared tree): this file asserts ONLY plan-03's
 * own diff — experience-section / projects-section augment order, the two
 * new server components, D-05 parse-once, and no-sort/verbatim-duration
 * discipline. Plan-02 (skills chart/treemap) asserts in its own carrier.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const ganttPath = 'src/components/explore/sections/career-span-chart.tsx';
const tilesPath = 'src/components/explore/sections/project-stat-tiles.tsx';
const expPath = 'src/components/explore/sections/experience-section.tsx';
const projPath = 'src/components/explore/sections/projects-section.tsx';

// ---------------------------------------------------------------------------
// Task 1: career-span Gantt — server purity, augment order, verbatim fidelity
// ---------------------------------------------------------------------------

test('career-span-chart: exists as a pure server component (no client, no recharts, no hooks)', () => {
  const src = read(ganttPath);
  assert.ok(src.length > 0, 'file exists');
  assert.ok(!src.includes('"use client"'), 'no "use client" directive — server component');
  assert.ok(!/from ['"]recharts['"]/.test(src), 'no recharts import — pure CSS Gantt (D-02 deviation)');
  assert.ok(!/use[A-Z]\w*\(/.test(src.replace(/\/\*[\s\S]*?\*\//g, '')), 'no hooks in the component body');
});

test('career-span-chart: aria-hidden bars/tracks + real-text year ticks + pinned bar colors + minWidth', () => {
  const src = read(ganttPath);
  assert.ok(src.includes('aria-hidden'), 'decorative bars/tracks carry aria-hidden (§9)');
  assert.ok(src.includes('bg-chart-2'), 'tech-related bars use bg-chart-2 (§4 color pin)');
  assert.ok(src.includes('bg-muted-foreground'), 'non-tech bars use bg-muted-foreground (§4 color pin)');
  assert.ok(src.includes('minWidth'), 'degenerate spans stay visible via min-width (E-5)');
  assert.ok(src.includes('leftPct'), 'renders precomputed leftPct — dumb renderer (D-05)');
  assert.ok(src.includes('widthPct'), 'renders precomputed widthPct — dumb renderer (D-05)');
  assert.ok(src.includes('yearTicks'), 'renders the axis ticks from CareerSpanData');
});

test('career-span-chart: no legend, no vertical gridlines, no tooltips (D-04/§4)', () => {
  const src = read(ganttPath);
  assert.ok(!/[Tt]ooltip/.test(src), 'no tooltips anywhere (D-04)');
  assert.ok(!/legend/i.test(src), 'no legend (§4: two-tone pattern is self-evident)');
});

test('experience-section: CareerSpanChart composed BEFORE the <ol> with an mb-5 wrapper', () => {
  const src = read(expPath);
  const chartIdx = src.indexOf('<CareerSpanChart');
  const olIdx = src.indexOf('<ol');
  assert.ok(chartIdx !== -1, '<CareerSpanChart present');
  assert.ok(olIdx !== -1, '<ol> timeline present');
  assert.ok(chartIdx < olIdx, 'Gantt composes BEFORE the 3-role text timeline (§1 ②)');
  assert.ok(src.includes('mb-5'), 'chart wrapper carries mb-5 (§1 rhythm)');
});

test('experience-section: geometry from buildCareerSpan(experience) on the FULL array (D-05)', () => {
  const src = read(expPath);
  assert.ok(
    src.includes('buildCareerSpan(experience)'),
    'calls buildCareerSpan on the FULL experience array — not the 3-entry slice',
  );
  assert.ok(
    !src.includes('buildCareerSpan(roles)'),
    'never feeds the slice(0,3) roles variable — all 7 roles must chart',
  );
  assert.ok(src.includes("from '../viz-data'"), 'imports from the viz-data module');
});

test('experience-section: <ol> body byte-stable (caps slice(0,3), chart-2 dot, verbatim duration render)', () => {
  const src = read(expPath);
  assert.ok(src.includes('experience.slice(0, 3)'), 'D-01 3-role cap unchanged');
  assert.ok(src.includes('bg-chart-2'), 'timeline dot color unchanged');
  assert.ok(src.includes('{entry.duration}'), 'duration rendered AS STORED in the text timeline');
});

test('gantt files: no .sort( anywhere (R-4/E-6 — JSON order is render order)', () => {
  for (const p of [ganttPath, expPath]) {
    const src = read(p);
    assert.ok(!src.includes('.sort('), `${p}: no sorting of data-derived arrays`);
  }
});

test('gantt files: no duration normalization — .replace( never touches a duration display', () => {
  for (const p of [ganttPath, expPath]) {
    const src = read(p);
    assert.ok(
      !src.includes('.replace('),
      `${p}: dash styles are display data, never normalized (D-02/§4)`,
    );
  }
});