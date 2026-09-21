/**
 * Layer-1 unit suite for plan EXPLORE-03-explore-visuals-01 — the pure
 * viz-data module (D-05/D-08).
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
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  parseDuration,
  skillGroupFill,
  skillsGroupCounts,
  projectStats,
  techMentions,
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
