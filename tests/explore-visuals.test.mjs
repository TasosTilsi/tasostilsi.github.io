/**
 * The phase EXPLORE-03 proof surface — extended per plan:
 *  • plan 01: Layer-1 unit suite of the pure viz-data module (D-05/D-08).
 *  • plan 04: Layer-2 cross-cutting source invariants over the settled
 *    wave-2 tree (client boundary, motion, interaction, parsing site,
 *    literals, registry spine, dependencies, css) and Layer-3 export-level
 *    invariants against out/explore.html after `npm run build`.
 *  • phase EXPLORE-06 plan 04: rewritten to the post-removal contract — the
 *    recharts charts, the treemap and the techMentions mention machinery are
 *    deleted (D-06), the Skills panel is competency cards over the surviving
 *    chips (U-2), and the buildCareerSpan Smartup fixture follows plan 01's
 *    U-4 3-role refresh.
 *  • phase EXPLORE-07 plan 01: the year-grid calendar is deleted (REV-08) —
 *    the calendar export test inverts to absence + the tiles/cards panel body.
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
  skillGroupFill,
  skillsGroupCounts,
  projectStats,
} from '../src/components/explore/viz-data.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const data = JSON.parse(read('src/data/portfolio-main-data.json'));

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

const serverSlices = [
  'src/components/explore/sections/project-stat-tiles.tsx',
];
const sectionBodies = [
  'src/components/explore/sections/skills-section.tsx',
  'src/components/explore/sections/experience-section.tsx',
  'src/components/explore/sections/projects-section.tsx',
];
const phaseTouchedComponents = [...serverSlices, ...sectionBodies];

test('cross-cutting: client boundary — the Skills panel is 100% server-rendered, recharts gone (D-06, plan 04 rewrite)', () => {
  // Post-removal contract: the two recharts slices are DELETED (their files
  // must not exist) and no explore file imports recharts or carries a client
  // directive among the panel-body slices.
  for (const deleted of ['src/components/explore/sections/skills-chart.tsx', 'src/components/explore/sections/skills-treemap.tsx']) {
    assert.equal(existsSync(join(root, deleted)), false, `${deleted}: deleted with the recharts removal (D-06)`);
  }
  const files = readdirSync(join(root, 'src/components/explore'), { recursive: true })
    .filter((f) => /\.(tsx|ts)$/.test(f));
  for (const rel of files) {
    const src = read(join('src/components/explore', rel));
    assert.ok(!/from ['"]recharts['"]/.test(src), `src/components/explore/${rel}: no recharts import (D-06/OQ-2)`);
  }
  for (const p of [...serverSlices, ...sectionBodies, 'src/components/explore/explore-panels.tsx']) {
    const code = codeOf(p);
    assert.ok(!code.includes('use client'), `${p}: no client directive — server component (D-06)`);
  }
});

test('cross-cutting: motion — never isAnimationActive={true} under explore, no matchMedia in the phase-touched files (OQ-2, plan 04 rewrite)', () => {
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
  // and untouched; the phase-touched files gain none.
  for (const p of phaseTouchedComponents) {
    assert.ok(
      !codeOf(p).includes('matchMedia'),
      `${p}: no matchMedia — panels are unconditionally static (OQ-2)`,
    );
  }
});

test('cross-cutting: viz-data is the sole data-shaping module — chart machinery GONE, survivors pinned (REV-08/U-6, D-05)', () => {
  for (const p of phaseTouchedComponents) {
    const code = codeOf(p);
    for (const banned of ['new Date(', 'getFullYear', 'getMonth', '.match(', 'RegExp(', 'parseDuration(']) {
      assert.ok(!code.includes(banned), `${p}: ${banned} absent — parsing lives in viz-data (D-05)`);
    }
  }
  const viz = read('src/components/explore/viz-data.ts');
  for (const gone of [
    'parseDuration',
    'buildCareerSpan',
    'buildProjectCalendar',
    'MONTH_NAMES',
    'parseMonthToken',
    'parseMonthYear',
    'monthIndex',
  ]) {
    assert.ok(
      !viz.includes(gone),
      `viz-data.ts no longer hosts ${gone} — the chart machinery is deleted (REV-08/U-6)`,
    );
  }
  // The parse-block YEAR_PATTERN is matched with an upper-boundary lookbehind
  // because the pinned survivor GLOBAL_YEAR_PATTERN contains it as a substring.
  assert.ok(
    !/(?<![A-Z_])YEAR_PATTERN(?![A-Z_])/.test(viz),
    'viz-data.ts no longer hosts the parse-block YEAR_PATTERN — deleted with the builders (REV-08/U-6)',
  );
  for (const site of ['skillGroupFill', 'skillsGroupCounts', 'projectStats', 'GLOBAL_YEAR_PATTERN']) {
    assert.ok(viz.includes(site), `viz-data.ts still hosts ${site} — the survivor stays pinned (D-05)`);
  }
});

test('cross-cutting: zero stat literals — no standalone 14/9/2016/2026 drives a rendered value (EXPLORE-07/OQ-1/U-1)', () => {
  const stripAll = (p) => read(p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  for (const p of phaseTouchedComponents) {
    const code = stripAll(p);
    for (const literal of ['14', '9', '2016', '2026']) {
      assert.ok(
        !new RegExp(`(?<![\\w.])${literal}(?![\\w.])`).test(code),
        `${p}: no standalone literal ${literal} driving a rendered value (EXPLORE-07)`,
      );
    }
  }
  // The deleted treemap's exemption and the client-chart count check both
  // left with the files — the surviving components carry no count literals.
  for (const p of phaseTouchedComponents) {
    assert.ok(
      !/count[=:]\s*\d/.test(codeOf(p)),
      `${p}: no numeric count literal — counts arrive via props (EXPLORE-07)`,
    );
  }
});

test('cross-cutting: registry spine — four total closures after the merge, skills carries competencies (D-04/D-05/D-07, plan 04)', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  assert.ok(
    src.includes('skills: ({ data }) => <SkillsSection skills={data.skills} competencies={data.core_competencies} />,'),
    'skills closure threads competencies={data.core_competencies} — the treemap corpus prop reverted (OQ-10)',
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

test('cross-cutting: REV-08 — both chart files deleted, builders absent, the polished timeline survives (D-03)', () => {
  // The removal contract: no chart artefact remains on disk or in the two
  // section files, while the rail+dots timeline (the REV-07-deferred
  // showcase, polished at taste level only) stays as pinned.
  for (const deleted of [
    'src/components/explore/sections/career-span-chart.tsx',
    'src/components/explore/sections/projects-calendar.tsx',
  ]) {
    assert.equal(existsSync(join(root, deleted)), false, `${deleted}: deleted (REV-08/D-03)`);
  }
  const viz = read('src/components/explore/viz-data.ts');
  const exp = read('src/components/explore/sections/experience-section.tsx');
  assert.ok(!viz.includes('buildCareerSpan'), 'buildCareerSpan gone from viz-data (U-6)');
  assert.ok(
    !exp.includes('buildCareerSpan') && !exp.includes('CareerSpanChart'),
    'experience-section carries no chart machinery',
  );
  assert.ok(
    exp.includes('relative space-y-5 border-l border-border'),
    'the rail+dots timeline survives as the polished non-chart showcase',
  );
  assert.ok(!exp.includes('use client'), 'experience-section remains a server component');
});

test('cross-cutting: recharts removed — 38 dependency keys, no recharts key (OQ-2, plan 04)', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(Object.keys(pkg.dependencies).length, 38, 'recharts removed — dependencies 39→38 (OQ-2)');
  assert.equal(pkg.dependencies.recharts, undefined, 'no recharts key remains (OQ-2)');
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
// until then (suite convention). Post-removal the page is chart-free —
// every panel (timeline, tiles, cards, chips) is fully
// server-rendered and must appear complete in the static HTML.
// Manual checks deliberately NOT asserted here (static HTML cannot carry
// them): rendered timeline spacing fidelity, 375px no-scroll,
// both-theme legibility — listed for the verify step's human pass.
// ---------------------------------------------------------------------------

const exportHtmlPath = join(root, 'out/explore.html');
const readExport = () => readFileSync(exportHtmlPath, 'utf8');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('export: /explore is recharts-free — zero hydration shells after the chart/treemap removal (OQ-4, plan 04)', () => {
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  const html = readExport();
  const shells = (html.match(/recharts-responsive-container/g) || []).length;
  assert.equal(shells, 0, `zero recharts hydration shells — found ${shells} (the charts are deleted, D-06)`);
});

test('export: competency cards render every cluster name + proof from the refreshed data (REV-05)', () => {
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  // React escapes & and quotes in text nodes — decode the common entities
  // before matching (verify-script convention from plan 03).
  const html = readExport()
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  for (const competency of data.core_competencies) {
    assert.ok(
      html.includes(competency.name),
      `competency name "${competency.name}" server-rendered (derived from the JSON)`,
    );
    assert.ok(
      html.includes(competency.proof),
      `proof line for "${competency.name}" server-rendered verbatim`,
    );
  }
});

test('export: calendar removed — no year-grid remains, tiles + exactly 6 cards render (REV-08)', () => {
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  const html = readExport();
  assert.ok(
    !html.includes('Projects calendar — '),
    'no calendar aria-label prefix in the export — the year-grid calendar is deleted (REV-08/D-03)',
  );
  // The stat tiles survive the removal — the panel body opens with them
  // (mb-3) now that the calendar wrapper is gone (UI-SPEC §3.2).
  const stats = projectStats(data.projects);
  assert.ok(
    new RegExp(`>${escapeRe(String(stats.total))}</p><p class="[^"]*">Projects</p>`).test(html),
    'stat tiles still server-rendered with the JSON-derived total',
  );
  // Exactly the 6 cards render — a names loop beyond slice(0, 6) would lie
  // (OQ-D: only the card map renders projects, never an all-14 sweep).
  for (const project of data.projects.slice(0, 6)) {
    assert.ok(html.includes(project.name), `card "${project.name}" server-rendered`);
  }
  for (const project of data.projects.slice(6)) {
    assert.ok(
      !html.includes(project.name),
      `"${project.name}" (beyond the top-6 cap) renders nowhere in the export — no calendar rows linger`,
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
