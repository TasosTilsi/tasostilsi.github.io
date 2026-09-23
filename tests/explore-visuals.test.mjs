/**
 * The phase EXPLORE-03 proof surface — extended per plan:
 *  • plan 01: Layer-1 unit suite of the pure viz-data module (D-05/D-08).
 *  • plan 04: Layer-2 cross-cutting source invariants over the settled
 *    wave-2 tree (client boundary, motion, interaction, parsing site,
 *    literals, keywords, registry spine, dependencies, css) and Layer-3
 *    export-level invariants against out/explore.html after `npm run build`.
 *
 * Runner: node --test tests/explore-visuals.test.mjs (no npm test script
 * exists — run directly).
 *
 * Local-only gate: CI (.github/workflows/deploy.yml) runs Node 20 and never
 * runs tests, while type stripping of the imported .ts module needs Node
 * >= 23.6 (RESEARCH.md §2 / OQ-5). The suite imports the pure module
 * directly with an explicit .ts extension — Node 24 strips the type-only
 * aliased import at load, so the alias path is never resolved at runtime.
 *
 * Every expectation over portfolio data is derived from the real
 * src/data/portfolio-main-data.json at test time (EXPLORE-07) — counts and
 * geometry expectations are pinned per the phase-3 UI-SPEC/plan contract,
 * but the input strings always come from the JSON, never from copies.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  parseDuration,
  skillGroupFill,
  skillsGroupCounts,
  projectStats,
  techMentions,
  buildCareerSpan,
} from '../src/components/explore/viz-data.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const data = JSON.parse(read('src/data/portfolio-main-data.json'));

// ---------------------------------------------------------------------------
// Task 1: tracer — parseDuration over the real JSON + malformed-input proof
// ---------------------------------------------------------------------------

test('parseDuration: all 7 real duration strings — both dash styles, Sept, Present', () => {
  // JSON order: Chubb, Upstream, Netcompany-Intrasoft, Smartup, Sweet Corner,
  // Mini Market, WashPark (RESEARCH.md §1.2B parse inventory).
  const [chubb, upstream, netcompany, smartup, sweetCorner, miniMarket, washPark] =
    data.experience.map((entry) => parseDuration(entry.duration));

  assert.deepStrictEqual(chubb, {
    startYear: 2023,
    startMonth: 9,
    endYear: null,
    endMonth: null,
    isPresent: true,
  }, 'Chubb "Sept 2023 — Present" (em-dash) → Present semantics');

  assert.deepStrictEqual(upstream, {
    startYear: 2022,
    startMonth: 9,
    endYear: 2023,
    endMonth: 8,
    isPresent: false,
  }, 'Upstream "Sept 2022 — Aug 2023" (em-dash)');

  assert.deepStrictEqual(netcompany, {
    startYear: 2019,
    startMonth: 6,
    endYear: 2022,
    endMonth: 9,
    isPresent: false,
  }, 'Netcompany "June 2019 — Sept 2022" (em-dash)');

  assert.deepStrictEqual(smartup, {
    startYear: 2017,
    startMonth: 11,
    endYear: 2018,
    endMonth: 4,
    isPresent: false,
  }, 'Smartup "November 2017 - April 2018" (hyphen, full-word months)');

  assert.deepStrictEqual(sweetCorner, {
    startYear: 2018,
    startMonth: 5,
    endYear: 2018,
    endMonth: 6,
    isPresent: false,
  }, 'Sweet Corner "May 2018 - June 2018" (hyphen)');

  assert.deepStrictEqual(miniMarket, {
    startYear: 2017,
    startMonth: 6,
    endYear: 2017,
    endMonth: 7,
    isPresent: false,
  }, 'Mini Market "June 2017 - July 2017" (hyphen)');

  assert.deepStrictEqual(washPark, {
    startYear: 2017,
    startMonth: 3,
    endYear: 2017,
    endMonth: 6,
    isPresent: false,
  }, 'WashPark "March 2017 - June 2017" (hyphen) — axis minimum');
});

test('parseDuration: malformed inputs return null without throwing', () => {
  for (const raw of [
    'garbage',
    'March',
    '2023 — ',
    '',
    'March 2017 — someday',
  ]) {
    assert.strictEqual(parseDuration(raw), null, `"${raw}" → null, never throws`);
  }
});

// ---------------------------------------------------------------------------
// Task 2: skillsGroupCounts (+ shared §2 fill map) + projectStats
// ---------------------------------------------------------------------------

test('skillsGroupCounts: exact JSON group order, counts, duplicate Languages preserved', () => {
  const groups = skillsGroupCounts(data.skills);
  assert.deepStrictEqual(
    groups.map((g) => [g.id, g.label, g.count]),
    [
      ['soft_skills', 'Soft Skills', 6],
      ['hard_skills.Languages', 'Languages', 9],
      ['hard_skills.Testing', 'Testing', 6],
      ['hard_skills.Infrastructure', 'Infrastructure', 6],
      ['hard_skills.Innovation', 'Innovation', 7],
      ['languages', 'Languages', 2],
    ],
    'JSON group order (soft → hard insertion order → spoken), no sorting, duplicate label kept',
  );
  assert.deepStrictEqual(
    groups.map((g) => g.items),
    [
      data.skills.soft_skills,
      data.skills.hard_skills.Languages,
      data.skills.hard_skills.Testing,
      data.skills.hard_skills.Infrastructure,
      data.skills.hard_skills.Innovation,
      data.skills.languages,
    ],
    'items are the JSON arrays verbatim (E-7: counts always match rendered chips)',
  );
  assert.deepStrictEqual(
    groups.map((g) => g.fill),
    [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
      'hsl(var(--muted-foreground))',
    ],
    'shared §2 category→token fill: chart-1..5 for contentful 0-4, muted-foreground from 5',
  );
});

test('skillGroupFill: single shared map — positions 5+ collapse to muted-foreground', () => {
  assert.strictEqual(skillGroupFill(0), 'hsl(var(--chart-1))');
  assert.strictEqual(skillGroupFill(4), 'hsl(var(--chart-5))');
  assert.strictEqual(skillGroupFill(5), 'hsl(var(--muted-foreground))');
  assert.strictEqual(skillGroupFill(7), 'hsl(var(--muted-foreground))');
});

test('skillsGroupCounts: contentful groups only — empty groups skipped (E-7)', () => {
  const groups = skillsGroupCounts({
    soft_skills: ['Teamwork'],
    hard_skills: { Languages: ['Java'], Testing: [], Infrastructure: [], Innovation: [] },
    languages: [],
  });
  assert.deepStrictEqual(
    groups.map((g) => [g.id, g.label, g.count]),
    [
      ['soft_skills', 'Soft Skills', 1],
      ['hard_skills.Languages', 'Languages', 1],
    ],
  );
  assert.deepStrictEqual(
    groups.map((g) => g.fill),
    ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'],
    'fill follows contentful-group position, not JSON path',
  );
  assert.deepStrictEqual(
    skillsGroupCounts({ soft_skills: [], hard_skills: {}, languages: [] }),
    [],
    'zero contentful groups → empty array (graceful-hide is the section\'s job)',
  );
});

test('projectStats: total/active-years/linked derived from the real JSON', () => {
  const stats = projectStats(data.projects);
  // Derived from the JSON at test time (OQ-1/U-1): no pinned literal for the
  // linked count — the stale SPEC "(9)" must never leak into code or tests.
  assert.strictEqual(stats.total, data.projects.length, 'total = projects.length');
  assert.strictEqual(stats.activeYearsSpan, '2016–2026', 'en-dash min/max year span (U+2013)');
  assert.strictEqual(
    stats.linked,
    data.projects.filter((p) => p.link).length,
    'linked = entries with a truthy link, derived from the JSON',
  );
});

test('projectStats: graceful on missing date/link, Ongoing excluded from span', () => {
  const stats = projectStats([
    { name: 'A', description: 'x', link: 'https://a', date: 'June 2023' },
    { name: 'B', description: 'x' }, // no date, no link — skipped everywhere
    { name: 'C', description: 'x', link: 'https://c', date: 'Ongoing' }, // no year (E-8)
    { name: 'D', description: 'x', date: 'November 2016' }, // absent link not counted
  ]);
  assert.strictEqual(stats.total, 4);
  assert.strictEqual(stats.activeYearsSpan, '2016–2023', 'Ongoing excluded from min/max');
  assert.strictEqual(stats.linked, 2, 'only truthy links counted');
});

test('projectStats: activeYearsSpan null when no date carries a year (E-9)', () => {
  const stats = projectStats([
    { name: 'A', description: 'x', link: 'https://a', date: 'Ongoing' },
    { name: 'B', description: 'x' },
  ]);
  assert.strictEqual(stats.total, 2);
  assert.strictEqual(stats.activeYearsSpan, null);
  assert.strictEqual(stats.linked, 1);
});
// ---------------------------------------------------------------------------
// Task 3: techMentions — the D-08 whole-word mention engine
// ---------------------------------------------------------------------------

test('techMentions: exact cells from the real corpus — 4 cells / 5 mentions (UI-SPEC §0)', () => {
  const cells = techMentions(data.experience, data.skills);
  assert.deepStrictEqual(cells, [
    { name: 'Java', count: 1, fill: 'hsl(var(--chart-2))' },
    { name: 'CI/CD', count: 2, fill: 'hsl(var(--chart-4))' },
    { name: 'MCP', count: 1, fill: 'hsl(var(--chart-5))' },
    { name: 'RAG', count: 1, fill: 'hsl(var(--chart-5))' },
  ], 'flattened keyword-set order (JSON group order, ties by first occurrence) — W-1 pin');
});

test('techMentions: zero-invented — every cell name is a JSON technology name', () => {
  const cells = techMentions(data.experience, data.skills);
  const jsonNames = [
    ...data.skills.soft_skills,
    ...Object.values(data.skills.hard_skills).flat(),
    ...data.skills.languages,
  ];
  assert.ok(cells.length > 0, 'sanity: the real corpus yields cells');
  for (const cell of cells) {
    assert.ok(jsonNames.includes(cell.name), `cell "${cell.name}" is a JSON technology name`);
  }
});

// Minimal fixture skills for boundary cases (contentful positions:
// Languages 0 → chart-1, Infrastructure 1 → chart-2, Innovation 2 → chart-3).
const fixtureSkills = {
  soft_skills: [],
  hard_skills: {
    Languages: ['Java', 'JS', 'C++'],
    Infrastructure: ['CI/CD'],
    Innovation: ['AI Agents', 'MCP'],
  },
  languages: [],
};

test('techMentions: "Javascript" matches neither "Java" nor "JS"', () => {
  const cells = techMentions(
    [{
      title: 'T', company: 'C', duration: 'd', isTechRelated: true,
      responsibilities: ['Maintained existing projects (Android, Javascript).'],
    }],
    fixtureSkills,
  );
  assert.deepStrictEqual(cells, []);
});

test('techMentions: "AI agent skills" does not match "AI Agents" — plural differs', () => {
  const cells = techMentions(
    [{
      title: 'T', company: 'C', duration: 'd', isTechRelated: true,
      responsibilities: ['Deployed AI agent skills across engineering teams.'],
    }],
    fixtureSkills,
  );
  assert.deepStrictEqual(cells, []);
});

test('techMentions: positive control — the exact phrase "AI Agents" does match', () => {
  const cells = techMentions(
    [{
      title: 'T', company: 'C', duration: 'd', isTechRelated: true,
      responsibilities: ['We use AI Agents daily.'],
    }],
    fixtureSkills,
  );
  assert.deepStrictEqual(cells, [{ name: 'AI Agents', count: 1, fill: 'hsl(var(--chart-3))' }]);
});

test('techMentions: "C++" — escaped special chars match cleanly, no bogus trailing boundary', () => {
  const cells = techMentions(
    [{
      title: 'T', company: 'C', duration: 'd', isTechRelated: true,
      responsibilities: ['Wrote systems code in C++ daily.'],
    }],
    fixtureSkills,
  );
  assert.deepStrictEqual(cells, [{ name: 'C++', count: 1, fill: 'hsl(var(--chart-1))' }]);
});

test('techMentions: a name repeated within one bullet counts each occurrence', () => {
  const cells = techMentions(
    [
      {
        title: 'T', company: 'C', duration: 'd', isTechRelated: true,
        responsibilities: ['MCP servers and MCP clients working together.'],
      },
      {
        // entry with NO responsibilities — contributes nothing
        title: 'T2', company: 'C2', duration: 'd2', isTechRelated: false,
      },
    ],
    fixtureSkills,
  );
  assert.deepStrictEqual(cells, [{ name: 'MCP', count: 2, fill: 'hsl(var(--chart-3))' }]);
});

test('techMentions: empty experience or zero-match corpus → empty array (E-13)', () => {
  assert.deepStrictEqual(techMentions([], data.skills), []);
  assert.deepStrictEqual(
    techMentions(
      [{
        title: 'T', company: 'C', duration: 'd', isTechRelated: true,
        responsibilities: ['Nothing relevant here.'],
      }],
      fixtureSkills,
    ),
    [],
  );
});

test('techMentions: duplicate name across groups aggregates, color from first group (E-17)', () => {
  const cells = techMentions(
    [{
      title: 'T', company: 'C', duration: 'd', isTechRelated: true,
      responsibilities: ['Java everywhere.'],
    }],
    { soft_skills: [], hard_skills: { Languages: ['Java'], Testing: ['Java'] }, languages: [] },
  );
  assert.deepStrictEqual(cells, [{ name: 'Java', count: 1, fill: 'hsl(var(--chart-1))' }]);
});

// ---------------------------------------------------------------------------
// Task 4: buildCareerSpan — Gantt geometry with injectable now (D-02)
// ---------------------------------------------------------------------------

test('buildCareerSpan: 7 rows in JSON order, WashPark at 0%, Chubb reaches 100%', () => {
  const now = new Date('2026-09-21T00:00:00Z');
  const span = buildCareerSpan(data.experience, now);
  assert.strictEqual(span.startYear, 2017, 'axis start = WashPark March 2017');
  assert.strictEqual(span.rows.length, 7);
  assert.deepStrictEqual(
    span.rows.map((r) => [r.company, r.title, r.duration, r.isTechRelated]),
    [
      ['Chubb', 'Senior Software Engineer in Test', 'Sept 2023 — Present', true],
      ['Upstream Systems', 'Software Engineer in Test', 'Sept 2022 — Aug 2023', true],
      ['Netcompany-Intrasoft', 'Software Engineer in Test', 'June 2019 — Sept 2022', true],
      ['Smartup PCC', 'Android Developer', 'November 2017 - April 2018', true],
      ['Sweet Corner', 'Barista', 'May 2018 - June 2018', false],
      ['Mini Market at University Campus of AUTH', 'Storekeeper', 'June 2017 - July 2017', false],
      ['WashPark', 'Washer', 'March 2017 - June 2017', false],
    ],
    'JSON order preserved — no sorting anywhere (R-4/E-6); display strings verbatim (both dash styles intact)',
  );
  const chubb = span.rows[0];
  const washPark = span.rows[6];
  assert.strictEqual(washPark.leftPct, 0, 'axis minimum = WashPark March 2017');
  assert.ok(
    Math.abs(chubb.leftPct + chubb.widthPct - 100) < 1e-9,
    'Present row extends to the axis end — left+width = 100 (E-3)',
  );
  assert.ok(
    washPark.leftPct < span.rows[1].leftPct && span.rows[1].leftPct < chubb.leftPct,
    'Upstream starts strictly between WashPark and Chubb positions',
  );
});

test('buildCareerSpan: year ticks — axis-start year at 0 through axis-end year', () => {
  const now = new Date('2026-09-21T00:00:00Z');
  const span = buildCareerSpan(data.experience, now);
  assert.deepStrictEqual(span.yearTicks[0], { year: 2017, leftPct: 0 });
  const last = span.yearTicks[span.yearTicks.length - 1];
  assert.strictEqual(last.year, 2026, 'last tick = axis-end year');
  assert.strictEqual(span.yearTicks.length, 10, 'one tick per January 2017..2026 — no right-edge tick');
  assert.ok(last.leftPct > 0 && last.leftPct < 100, 'final January sits inside the axis');
  for (let i = 1; i < span.yearTicks.length; i += 1) {
    assert.ok(span.yearTicks[i].leftPct > span.yearTicks[i - 1].leftPct, 'ticks are monotonic');
  }
});

test('buildCareerSpan: unparseable duration → null geometry, text intact (E-1)', () => {
  const now = new Date('2026-09-21T00:00:00Z');
  const span = buildCareerSpan(
    [
      { title: 'A', company: 'C1', duration: 'unparseable', isTechRelated: true },
      { title: 'B', company: 'C2', duration: 'March 2017 - June 2017', isTechRelated: false },
    ],
    now,
  );
  assert.strictEqual(span.rows[0].duration, 'unparseable');
  assert.strictEqual(span.rows[0].title, 'A');
  assert.strictEqual(span.rows[0].leftPct, null);
  assert.strictEqual(span.rows[0].widthPct, null);
  assert.strictEqual(span.startYear, 2017, 'axis unaffected by the unparseable row');
  assert.strictEqual(span.rows[1].leftPct, 0);
});

test('buildCareerSpan: all durations unparseable → every row null (E-2)', () => {
  const now = new Date('2026-09-21T00:00:00Z');
  const span = buildCareerSpan(
    [
      { title: 'A', company: 'C1', duration: 'unparseable', isTechRelated: true },
      { title: 'B', company: 'C2', duration: '', isTechRelated: false },
    ],
    now,
  );
  assert.strictEqual(span.rows.length, 2);
  for (const row of span.rows) {
    assert.strictEqual(row.leftPct, null);
    assert.strictEqual(row.widthPct, null);
  }
});

test('buildCareerSpan: end beyond now clamps to axis end (E-4)', () => {
  const now = new Date('2026-09-21T00:00:00Z');
  const span = buildCareerSpan(
    [{ title: 'A', company: 'C', duration: 'January 2020 - January 2030', isTechRelated: true }],
    now,
  );
  assert.strictEqual(span.rows[0].leftPct, 0);
  assert.ok(span.rows[0].widthPct <= 100);
  assert.ok(
    Math.abs(span.rows[0].widthPct - 100) < 1e-9,
    'unclamped span would exceed 100 — the bar is clamped to the axis end',
  );
});

test('buildCareerSpan: start==end entry still yields a row (E-5)', () => {
  const now = new Date('2026-09-21T00:00:00Z');
  const span = buildCareerSpan(
    [{ title: 'A', company: 'C', duration: 'June 2017 - June 2017', isTechRelated: true }],
    now,
  );
  assert.strictEqual(span.rows.length, 1);
  assert.strictEqual(span.rows[0].leftPct, 0);
  assert.strictEqual(span.rows[0].widthPct, 0, "min-width is the component's job — module reports 0");
});

// ---------------------------------------------------------------------------
// Plan 04 Task 1: cross-cutting Layer-2 source invariants — proof of delivery
// over the settled wave-2 tree. These are expected to pass immediately (the
// behavior exists); any failure is a REAL defect in the owning plan's scope —
// fix it in source honouring that plan's D-NN rules, never weaken the
// assertion to pass.
// ---------------------------------------------------------------------------

// Doc-comment stripping per the explore-shell suite convention (lines 172+):
// banned-token greps judge code, not prose.
const codeOf = (p) =>
  read(p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const clientChartFiles = [
  'src/components/explore/sections/skills-chart.tsx',
  'src/components/explore/sections/skills-treemap.tsx',
];
const serverSlices = [
  'src/components/explore/sections/career-span-chart.tsx',
  'src/components/explore/sections/project-stat-tiles.tsx',
];
const sectionBodies = [
  'src/components/explore/sections/skills-section.tsx',
  'src/components/explore/sections/experience-section.tsx',
  'src/components/explore/sections/projects-section.tsx',
];
const phaseTouchedComponents = [...clientChartFiles, ...serverSlices, ...sectionBodies];

test('cross-cutting: client boundary — "use client" ONLY in the two recharts slices (D-06)', () => {
  for (const p of clientChartFiles) {
    const code = codeOf(p);
    assert.match(code, /['"]use client['"]/, `${p}: client boundary present (D-06)`);
    assert.ok(code.includes("from 'recharts'"), `${p}: recharts import`);
  }
  for (const p of [...serverSlices, ...sectionBodies, 'src/components/explore/explore-panels.tsx']) {
    const code = codeOf(p);
    assert.ok(!code.includes('use client'), `${p}: no client directive — server component (D-06)`);
    assert.ok(!/from ['"]recharts['"]/.test(code), `${p}: no recharts import (D-06)`);
  }
});

test('cross-cutting: motion — isAnimationActive={false} in both chart files, never true under explore, no matchMedia in the phase-touched files (OQ-2)', () => {
  for (const p of clientChartFiles) {
    assert.ok(
      codeOf(p).includes('isAnimationActive={false}'),
      `${p}: animation off unconditionally (UI-SPEC §7)`,
    );
  }
  const exploreFiles = readdirSync(join(root, 'src/components/explore'), { recursive: true })
    .filter((f) => /\.(tsx|ts)$/.test(f));
  for (const rel of exploreFiles) {
    const src = read(join('src/components/explore', rel));
    assert.ok(
      !src.includes('isAnimationActive={true}'),
      `src/components/explore/${rel}: never isAnimationActive={true} (OQ-2)`,
    );
  }
  // explore-intro.tsx keeps its own pre-existing matchMedia — out of scope
  // and untouched; the seven phase-touched files gain none.
  for (const p of phaseTouchedComponents) {
    assert.ok(
      !codeOf(p).includes('matchMedia'),
      `${p}: no matchMedia — charts are unconditionally static (OQ-2)`,
    );
  }
});

test('cross-cutting: interaction-free charts — no Tooltip/grid/handlers in any of the four chart components (D-04/§6)', () => {
  for (const p of [...clientChartFiles, ...serverSlices]) {
    const code = codeOf(p);
    for (const banned of ['Tooltip', 'CartesianGrid', 'onClick', 'onMouseEnter', 'onMouseLeave']) {
      assert.ok(!code.includes(banned), `${p}: ${banned} absent (D-04/§6)`);
    }
  }
});

test('cross-cutting: viz-data is the SOLE parsing site — the seven component files parse nothing inline (D-05)', () => {
  for (const p of phaseTouchedComponents) {
    const code = codeOf(p);
    for (const banned of ['new Date(', 'getFullYear', 'getMonth', '.match(', 'RegExp(', 'parseDuration(']) {
      assert.ok(!code.includes(banned), `${p}: ${banned} absent — parsing lives in viz-data (D-05)`);
    }
  }
  const viz = read('src/components/explore/viz-data.ts');
  for (const site of [
    'parseDuration',
    'skillGroupFill',
    'skillsGroupCounts',
    'projectStats',
    'techMentions',
    'buildCareerSpan',
    'YEAR_PATTERN',
  ]) {
    assert.ok(viz.includes(site), `viz-data.ts hosts ${site} — the one data-shaping module (D-05)`);
  }
});

test('cross-cutting: zero stat literals — no standalone 14/9/2016/2026 drives a rendered value (EXPLORE-07/OQ-1/U-1)', () => {
  const stripAll = (p) => read(p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  // Full banned set over every component where a stray number could be a
  // stat. skills-treemap is exempt from the standalone-9 check ONLY for its
  // documented chrome font constants (COUNT_FONT = 9 — a label size, never a
  // stat); its data-side invariant is the count[=:] shape assertion below.
  for (const p of phaseTouchedComponents.filter((f) => !f.includes('skills-treemap'))) {
    const code = stripAll(p);
    for (const literal of ['14', '9', '2016', '2026']) {
      assert.ok(
        !new RegExp(`(?<![\\w.])${literal}(?![\\w.])`).test(code),
        `${p}: no standalone literal ${literal} driving a rendered value (EXPLORE-07)`,
      );
    }
  }
  const treemap = stripAll('src/components/explore/sections/skills-treemap.tsx');
  for (const literal of ['14', '2016', '2026']) {
    assert.ok(
      !new RegExp(`(?<![\\w.])${literal}(?![\\w.])`).test(treemap),
      `treemap: no standalone literal ${literal} driving a rendered value (EXPLORE-07)`,
    );
  }
  for (const p of clientChartFiles) {
    assert.ok(
      !/count[=:]\s*\d/.test(codeOf(p)),
      `${p}: no numeric count literal — counts arrive via props (EXPLORE-07)`,
    );
  }
});

test('cross-cutting: treemap keywords zero-invented — the component holds no JSON technology-name literal (D-08)', () => {
  const code = codeOf('src/components/explore/sections/skills-treemap.tsx');
  const jsonNames = [
    ...data.skills.soft_skills,
    ...Object.values(data.skills.hard_skills).flat(),
    ...data.skills.languages,
  ];
  assert.ok(jsonNames.length > 0, 'sanity: the JSON keyword set is non-empty');
  for (const name of jsonNames) {
    assert.ok(
      !code.includes(`'${name}'`) && !code.includes(`"${name}"`),
      `no hand-written "${name}" keyword in the treemap component — cells come from viz-data (D-08)`,
    );
  }
});

test('cross-cutting: registry spine — four total closures after the About+Contact merge, skills threads the corpus (D-04/D-05/D-07)', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  assert.ok(
    src.includes('skills: ({ data }) => <SkillsSection skills={data.skills} experience={data.experience} />,'),
    'skills closure threads experience={data.experience} for the treemap corpus (§10) — plan 04 reverts it',
  );
  assert.ok(src.includes('about: ({ data }) => <AboutSection about={data.about} />,'));
  assert.ok(
    !src.includes('contact: ({ data })'),
    'no contact closure — Contact merged into AboutSection (REV-04/D-05)',
  );
  assert.ok(src.includes('experience: ({ data }) => <ExperienceSection experience={data.experience} />,'));
  assert.ok(src.includes('projects: ({ data }) => <ProjectsSection projects={data.projects} />,'));
  assert.equal(
    (src.match(/\w+: \(\{ data \}\) => </g) || []).length,
    4,
    'exactly four adapter closures — the registry is total over the 4-section grid (D-04/D-07)',
  );
});

test('cross-cutting: zero new dependencies — 39 dependency keys with recharts ^2.15.1 (D-07)', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(Object.keys(pkg.dependencies).length, 39, 'dependencies unchanged this phase (D-07)');
  assert.equal(pkg.dependencies.recharts, '^2.15.1', 'recharts pinned version unchanged');
});

test('cross-cutting: scoped light-theme chart overrides pinned, chart-1 absent from both shell blocks (UI-SPEC §2 B-1/OQ-6)', () => {
  const css = read('src/app/globals.css');
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
  // Line-start anchoring isolates the dark .explore-shell block (the substring
  // form would also match the interior of .light .explore-shell).
  assert.ok(!/^\.explore-shell\s*\{[^}]*--chart-2: /m.test(css), 'dark shell carries no chart-2 override');
  assert.ok(!/^\.explore-shell\s*\{[^}]*--chart-3: /m.test(css), 'dark shell carries no chart-3 override');
  assert.ok(!/^\.explore-shell\s*\{[^}]*--chart-1: /m.test(css), 'no chart-1 override in the dark shell (phase-1 invariant)');
  assert.ok(!/\.light \.explore-shell\s*\{[^}]*--chart-1: /s.test(css), 'no chart-1 override in the light shell (phase-1 invariant)');
});

// ---------------------------------------------------------------------------
// Plan 04 Task 2: Layer-3 export-level invariants — hold against the static
// export (out/) produced by `npm run build`; they fail with a build hint
// until then (suite convention). Only the two recharts skills charts are
// hydration shells in the static HTML (OQ-4 — no SVG until measured); the
// Gantt and the tiles are fully server-rendered and must appear complete.
// Manual checks deliberately NOT asserted here (static HTML cannot carry
// them): §12.2 rendered bar row order, §12.3 treemap area ∝ mentions,
// §12.8 375px no-scroll, §12.9 both-theme legibility — listed for the verify
// step's human pass.
// ---------------------------------------------------------------------------

const exportHtmlPath = join(root, 'out/explore.html');
const readExport = () => readFileSync(exportHtmlPath, 'utf8');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('export: /explore carries the recharts hydration shells + treemap caption (OQ-4)', () => {
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  const html = readExport();
  const shells = (html.match(/recharts-responsive-container/g) || []).length;
  assert.ok(shells >= 2, `bar + treemap hydration shells present — found ${shells} (OQ-4)`);
  assert.ok(
    html.includes('Mentions in role responsibilities'),
    'treemap honesty caption server-rendered (§3)',
  );
});

test('export: bar chart aria-label enumerates every JSON-derived label count pair', () => {
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  const html = readExport();
  const pairs = skillsGroupCounts(data.skills).map((row) => `${row.label} ${row.count}`);
  assert.ok(
    html.includes(`Skills by category. ${pairs[0]}`),
    'pinned aria-label format opens with the first pair',
  );
  for (const pair of pairs) {
    assert.ok(
      html.includes(pair),
      `bar aria-label carries "${pair}" — derived from the JSON at test time (OQ-3)`,
    );
  }
});

test('export: treemap aria-label enumerates every techMentions name count pair', () => {
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  const html = readExport();
  const cells = techMentions(data.experience, data.skills);
  assert.ok(cells.length > 0, 'sanity: the corpus yields cells');
  const pairs = cells.map((cell) => `${cell.name} ${cell.count}`);
  assert.ok(
    html.includes(`Technology mentions across role responsibilities. ${pairs[0]}`),
    'pinned aria-label format opens with the first pair',
  );
  for (const pair of pairs) {
    assert.ok(html.includes(pair), `treemap aria-label carries "${pair}" (derived at test time)`);
  }
});

test('export: Gantt fully server-rendered — all 7 companies + the axis-start year tick', () => {
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  const html = readExport();
  const startYears = data.experience
    .map((entry) => parseDuration(entry.duration))
    .filter(Boolean)
    .map((parsed) => parsed.startYear);
  const axisStartYear = String(Math.min(...startYears));
  // Cross-check the derivation against the module the component renders from.
  assert.strictEqual(
    String(buildCareerSpan(data.experience, new Date('2026-09-21T00:00:00Z')).startYear),
    axisStartYear,
    'viz-data axis start = minimum parsed start year',
  );
  assert.ok(
    html.includes(`>${axisStartYear}</span>`),
    `axis-start year tick "${axisStartYear}" server-rendered (derived, never pinned)`,
  );
  // Company names carry no HTML-escapable characters in this dataset; the
  // raw substring form is the honest presence check.
  for (const entry of data.experience) {
    assert.ok(
      html.includes(entry.company),
      `Gantt row company "${entry.company}" server-rendered`,
    );
  }
});

test('export: stat tiles server-rendered with JSON-derived values (OQ-1/U-1 — no pinned linked literal)', () => {
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  const html = readExport();
  const stats = projectStats(data.projects);
  // The module output must agree with a raw-JSON derivation — the promoted
  // representation round-trips from the data it summarizes.
  assert.equal(stats.total, data.projects.length, 'total = raw JSON length');
  assert.equal(stats.linked, data.projects.filter((p) => p.link).length, 'linked = raw truthy-link count');
  const years = data.projects
    .flatMap((p) => (p.date ? (p.date.match(/\b(?:19|20)\d{2}\b/g) ?? []) : []))
    .map(Number);
  assert.equal(
    stats.activeYearsSpan,
    years.length === 0 ? null : `${Math.min(...years)}\u2013${Math.max(...years)}`,
    'span = min/max 4-digit years joined by the en-dash',
  );
  for (const [value, label] of [
    [String(stats.total), 'Projects'],
    [stats.activeYearsSpan, 'Active Years'],
    [String(stats.linked), 'Linked'],
  ]) {
    assert.ok(
      new RegExp(`>${escapeRe(value)}</p><p class="[^"]*">${label}</p>`).test(html),
      `tile "${label}" renders the derived value "${value}" (adjacent value→label pair)`,
    );
  }
});

test('export: CLI and resume still emitted (EXPLORE-05/D-07)', () => {
  assert.ok(existsSync(join(root, 'out/index.html')), 'out/index.html still emitted (D-10)');
  assert.ok(existsSync(join(root, 'out/resume.html')), 'out/resume.html still emitted (D-10)');
});
