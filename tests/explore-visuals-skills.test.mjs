/**
 * Red/green acceptance tests for plan EXPLORE-03-explore-visuals-02 (skills slice).
 *
 * Runner: node --test tests/explore-visuals-skills.test.mjs  (Node built-in, zero npm deps — D-09)
 *
 * This is plan-02's source-invariant carrier. Export-level assertions
 * (hydration shells, printed values in the built HTML) belong to plan 04's
 * carrier, run chronologically last on the settled wave-2 tree.
 *
 * Extended per task: Task 2 (treemap + corpus thread), Task 3 (light-theme
 * chart overrides).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
// Doc-comment stripping per the explore-shell suite convention (lines 172+):
// banned-literal greps judge code, not prose.
const codeOf = (p) =>
  read(p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// ---------------------------------------------------------------------------
// Task 1: tracer — bar chart composed first, grouping single-sourced
// ---------------------------------------------------------------------------

test('skills-section: SkillsChart first child, grouping adopted from viz-data (UI-SPEC §10 single source)', () => {
  const src = read('src/components/explore/sections/skills-section.tsx');
  const chartIdx = src.indexOf('<SkillsChart');
  assert.ok(chartIdx !== -1, 'SkillsChart composed (UI-SPEC §1 ①)');
  const loopIdx = src.indexOf('groups.map(');
  assert.ok(loopIdx !== -1 && chartIdx < loopIdx, 'chart composed before the groups loop — first child');
  assert.ok(!src.includes('groups.push'), 'inline builder removed — single source (§10)');
  assert.match(src, /import\s*\{\s*skillsGroupCounts\s*\}\s*from\s*'\.\.\/viz-data'/, 'skillsGroupCounts import');
  // Augment-only discipline (D-07): graceful-hide, chips, headers, pointer stay byte-stable.
  assert.ok(src.includes('groups.length === 0'), 'graceful-hide preserved');
  assert.ok(src.includes('font-normal pointer-events-none'), 'chip overrides untouched');
  assert.ok(src.includes('<TerminalPointer command="skills" />'), 'terminal pointer untouched');
});

test('skills-chart: client boundary + pinned anatomy (UI-SPEC §2)', () => {
  const code = codeOf('src/components/explore/sections/skills-chart.tsx');
  assert.match(code, /['"]use client['"]/, 'client boundary (D-06)');
  assert.ok(code.includes("from 'recharts'"), 'recharts import');
  assert.ok(code.includes('ResponsiveContainer'), 'ResponsiveContainer (SSG shell + scaling)');
  assert.ok(code.includes('isAnimationActive={false}'), 'animation off unconditionally (OQ-2)');
  for (const banned of ['Tooltip', 'CartesianGrid', 'matchMedia']) {
    assert.ok(!code.includes(banned), `${banned} absent (D-04/OQ-2)`);
  }
  assert.ok(code.includes('layout="vertical"'), 'vertical layout pin');
  assert.ok(code.includes('height={192}'), 'fixed height reserves the SSG box — no CLS (OQ-4)');
  assert.ok(code.includes('width={88}'), 'YAxis width 88 pin (longest label fits)');
  assert.ok(code.includes('barSize={12}'), 'barSize pin');
  assert.ok(code.includes('position="right"'), 'LabelList right position pin');
});

test('skills-chart: data-derived aria-label, zero hardcoded counts/labels (EXPLORE-07/W-2)', () => {
  const code = codeOf('src/components/explore/sections/skills-chart.tsx');
  assert.match(code, /aria-label=\{`Skills by category\. \$\{rows\.map\(/, 'aria-label composed at render time from rows');
  assert.ok(code.includes('${row.label} ${row.count}'), "the pinned 'label count' pair format (plan-04 export contract)");
  assert.ok(!/count[=:]\s*\d/.test(code), 'no numeric count literal');
  assert.ok(!code.includes('Soft Skills'), 'no hardcoded group label — chart mirrors chips');
});

test('skills-chart: band order mechanism — probe-proven default, no order-flipping prop (R-7 resolved)', () => {
  const code = codeOf('src/components/explore/sections/skills-chart.tsx');
  // SSR probe on installed recharts 2.15.4 (deviation record in SUMMARY):
  // vertical layout default renders row 1 at TOP (label y≈19 → row 6 y≈176);
  // the order-flipping prop INVERTS (row 1 at y≈176). The contract wants
  // top→bottom JSON group order, so the default mechanism is correct and the
  // order-flipping prop must be absent from the code.
  assert.ok(!code.includes('reversed'), 'no reversed prop — default band order is top-first');
});