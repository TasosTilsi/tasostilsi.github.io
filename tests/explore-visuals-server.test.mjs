/**
 * Server-invariant carrier for the explore visuals — EXPLORE-08 edition: the
 * Experience panel body is now the full-width semicircular career-timeline
 * stage (phase 8, REV-07/REV-12/REV-13), so this suite pins the stage
 * composition contract — the single-DOM anatomy (§8 B-1: arc zone first,
 * rail grammar GONE with gone-checks, year chips + merged meta row over the
 * SAME layer nodes), the filter-governed role selection (D-06 superseding
 * the phase-7 order-cap), the U-8 verbatim strings, and the client-boundary
 * inversion (the stage IS the phase's client slice, §9) — alongside the
 * Projects stat tiles above the cards.
 *
 * Runner: node --test tests/explore-visuals-server.test.mjs (no npm test
 * script exists — run directly).
 *
 * Local-only gate: CI (deploy.yml) runs Node 20 and never runs tests. These
 * are Layer-2 source-level invariants in the explore-shell.test.mjs style —
 * no export needed; the stage's SSR output (role-1 real text) is asserted
 * export-level in the visuals suite after `npm run build`.
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
// Task 1 (EXPLORE-08): the timeline stage composition contract (§8 B-1, §1.2)
// — the arc zone is the first body child, the rail grammar is GONE
// (gone-checks per the replacement discipline), and the single-DOM layers
// carry the year chips + merged meta row.
// ---------------------------------------------------------------------------

test('career-span-chart.tsx deleted — experience-section imports no chart machinery (REV-08/D-03)', () => {
  assert.equal(existsSync(join(root, ganttPath)), false, 'career-span-chart.tsx deleted with its subject');
  const src = read(expPath);
  assert.ok(!src.includes('CareerSpanChart'), 'no CareerSpanChart import or composition');
  assert.ok(!src.includes('buildCareerSpan'), 'no buildCareerSpan import');
  assert.ok(!src.includes("from '../viz-data'"), 'no viz-data import remains — the stage imports the pure timeline module');
  assert.ok(!src.includes('mb-5'), 'the chart mb-5 wrapper is gone');
});

test('experience-section: the stage group root with the arc zone as first body child — rail grammar GONE (§8 B-1, §1.2)', () => {
  const src = read(expPath);
  assert.ok(src.includes('role="group"'), 'the stage body root carries role="group" (§10)');
  assert.ok(src.includes('aria-label="Career timeline"'), 'the group is labelled "Career timeline" (§10)');
  const arcIdx = src.indexOf('data-timeline-arc-zone');
  const layerIdx = src.indexOf('data-timeline-layer');
  assert.ok(arcIdx !== -1, 'the arc zone hook (data-timeline-arc-zone) is present');
  assert.ok(layerIdx !== -1, 'the content layer hooks (data-timeline-layer) are present');
  assert.ok(arcIdx < layerIdx, 'the arc zone is the first body child — content column after it (§1.2 40/60 split)');
  // Gone-checks (replacement discipline): the phase-7 rail grammar is dead.
  assert.ok(!src.includes('relative space-y-5 border-l'), 'phase-7 rail anatomy gone (border-l rail replaced by the arc)');
  assert.ok(!src.includes('-left-[4px]'), 'rail dot absolute-offset gone');
  assert.ok(!src.includes('<ol'), 'the rail <ol> is gone — the single-DOM layer stack replaced it');
  assert.ok(src.includes('bg-chart-2'), 'chart-2 STILL present — the active dot + md:hidden year chips (D-03)');
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

test('experience-section: filter-governed roles + fidelity byte-stable (D-06, ≤3 bullets, AS-STORED strings, pointer, use client)', () => {
  const src = read(expPath);
  assert.ok(src.includes('selectTimelineEntries'), 'entry selection via the pure module (D-06/D-03 — the isTechRelated filter ∪ featured education govern)');
  assert.ok(
    !src.includes('experience.slice(0, 3)'),
    'the phase-7 order-cap is gone — filter-governed, not slice-governed (D-06 supersedes the phase-7 cap)',
  );
  assert.ok(src.includes('(entry.responsibilities ?? []).slice(0, 3)'), '≤3 bullets unchanged (U-3)');
  assert.ok(src.includes('{entry.duration}'), 'duration rendered AS STORED');
  assert.ok(src.includes('{entry.location}'), 'location rendered AS STORED');
  assert.ok(!src.includes('.sort('), 'no sorting of data-derived arrays (R-4/E-6)');
  assert.ok(!src.includes('.replace('), 'dash styles are display data, never normalized (D-02/§4)');
  assert.ok(src.includes('experience --all'), 'terminal pointer unchanged');
  assert.ok(
    src.includes('"use client"'),
    'the stage IS the phase\'s client slice (§9 — inverted from the phase-7 server pin)',
  );
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
