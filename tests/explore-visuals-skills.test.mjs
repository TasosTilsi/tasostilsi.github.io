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
  assert.match(src, /import\s*\{[^}]*skillsGroupCounts[^}]*\}\s*from\s*'\.\.\/viz-data'/, 'skillsGroupCounts import');
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

// ---------------------------------------------------------------------------
// Task 2: treemap below the chart, corpus threaded server-side (D-08)
// ---------------------------------------------------------------------------

test('skills-treemap: client boundary, root guard, pinned anatomy (UI-SPEC §3)', () => {
  const code = codeOf('src/components/explore/sections/skills-treemap.tsx');
  assert.match(code, /['"]use client['"]/, 'client boundary (D-06)');
  assert.ok(code.includes('Treemap'), 'recharts Treemap import');
  assert.ok(code.includes('ResponsiveContainer'), 'ResponsiveContainer');
  assert.ok(code.includes('isAnimationActive={false}'), 'animation off unconditionally (OQ-2)');
  assert.ok(code.includes('depth === 0'), 'B-1 root guard — synthetic depth-0 root call returns null');
  assert.ok(code.includes('pointerEvents="none"'), 'pointerEvents none on the cell group (§6)');
  assert.ok(code.includes('height={120}'), 'fixed 120px height pin (375px-safe)');
  assert.ok(code.includes('dataKey="count"'), 'count dataKey pin');
  assert.ok(code.includes('fillOpacity={0.35}'), '0.35 wash pin (text contrast by construction)');
  assert.ok(code.includes('clipPath'), 'per-cell clip overflow guard present (W-5)');
  // label ladder rungs pinned: 64x40 name+count, 44x16 name-only
  assert.ok(code.includes('>= 64') && code.includes('>= 44'), 'ladder size rungs (64×40, 44×16)');
  for (const banned of ['Tooltip', 'onClick', 'onMouseEnter', 'matchMedia']) {
    assert.ok(!code.includes(banned), `${banned} absent (D-04/§6)`);
  }
});

test('skills-treemap: honesty caption + data-derived aria-label (§3/§9)', () => {
  const src = read('src/components/explore/sections/skills-treemap.tsx');
  assert.ok(src.includes('Mentions in role responsibilities'), 'honesty caption (both tokens pinned)');
  const code = codeOf('src/components/explore/sections/skills-treemap.tsx');
  assert.match(code, /aria-label=\{`Technology mentions across role responsibilities\. \$\{cells\.map\(/, 'aria-label composed from cells');
  assert.ok(code.includes('${cell.name} ${cell.count}'), "the pinned 'name count' pair format (plan-04 export contract)");
  assert.ok(!/count[=:]\s*\d/.test(code), 'no numeric mention-count literal (EXPLORE-07)');
  assert.ok(code.includes('cells.length === 0'), 'E-13: zero-match cells hide the whole block');
});

test('skills-section: treemap composed second, corpus from techMentions (§1 ②/§10)', () => {
  const src = read('src/components/explore/sections/skills-section.tsx');
  const chartIdx = src.indexOf('<SkillsChart');
  const treemapIdx = src.indexOf('<SkillsTreemap');
  const loopIdx = src.indexOf('groups.map(');
  assert.ok(treemapIdx !== -1 && treemapIdx < loopIdx, 'treemap before the groups loop');
  assert.ok(chartIdx !== -1 && treemapIdx > chartIdx, 'treemap BETWEEN chart and groups loop (§1 ②)');
  assert.match(src, /=\s*techMentions\(experience, skills\)/, 'cells computed server-side via techMentions');
  assert.match(src, /experience:\s*PortfolioData\['experience'\]/, 'props extended with experience');
  assert.ok(src.includes('<SkillsTreemap cells={cells} />'), 'cells passed as props — zero matching in the component (D-05)');
});

test('explore-panels: skills closure threads experience, every other closure byte-unchanged (D-07)', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  const skillsIdx = src.indexOf('skills: ({ data })');
  const skillsLine = src.slice(skillsIdx, src.indexOf(',', skillsIdx) + 1);
  assert.ok(skillsLine.includes('skills={data.skills}'), 'skills slice unchanged');
  assert.ok(skillsLine.includes('experience={data.experience}'), 'experience threaded for the treemap corpus (§10)');
  // byte-unchanged registry neighbours (the registry is the data spine, not chrome)
  assert.ok(src.includes('about: ({ data }) => <AboutSection about={data.about} />,'));
  assert.ok(src.includes('contact: ({ data }) => <ContactSection contact={data.about.contact} />,'));
  assert.ok(src.includes('experience: ({ data }) => <ExperienceSection experience={data.experience} />,'));
  assert.ok(src.includes('projects: ({ data }) => <ProjectsSection projects={data.projects} />,'));
});

// ---------------------------------------------------------------------------
// Task 3: scoped light-theme chart-2/chart-3 overrides (UI-SPEC §2 B-1)
// ---------------------------------------------------------------------------

test('globals.css: light shell carries the pinned chart-2/chart-3 overrides exactly once (B-1)', () => {
  const css = read('src/app/globals.css');
  // Inside .light .explore-shell, with the pinned recomputed-contrast values.
  assert.match(
    css,
    /\.light \.explore-shell\s*\{[^}]*--chart-2: 160 65% 32%;/s,
    'light chart-2 override (4.49:1 on the white card)',
  );
  assert.match(
    css,
    /\.light \.explore-shell\s*\{[^}]*--chart-3: 30 75% 38%;/s,
    'light chart-3 override (4.75:1)',
  );
  assert.equal((css.match(/--chart-2: 160 65% 32%;/g) || []).length, 1, 'chart-2 override exactly once');
  assert.equal((css.match(/--chart-3: 30 75% 38%;/g) || []).length, 1, 'chart-3 override exactly once');
});

test('globals.css: dark shell untouched, no chart-1 override anywhere (OQ-6)', () => {
  const css = read('src/app/globals.css');
  // Line-start anchoring isolates the dark .explore-shell block — the
  // substring form would also match the interior of .light .explore-shell.
  assert.ok(!/^\.explore-shell\s*\{[^}]*--chart-2: /m.test(css), 'dark shell carries no chart-2 override');
  assert.ok(!/^\.explore-shell\s*\{[^}]*--chart-3: /m.test(css), 'dark shell carries no chart-3 override');
  assert.ok(!/^\.explore-shell\s*\{[^}]*--chart-1: /m.test(css), 'no chart-1 override in the dark shell (phase-1 invariant)');
  assert.ok(!/\.light \.explore-shell\s*\{[^}]*--chart-1: /s.test(css), 'no chart-1 override in the light shell (phase-1 invariant)');
});