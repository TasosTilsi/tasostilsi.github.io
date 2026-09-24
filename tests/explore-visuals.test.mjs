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
 *  • phase EXPLORE-08 plan 03: the interaction-quality contracts join as
 *    permanent suite rows (UI-SPEC §13 "integration greps") — R-3 id
 *    placement, the D-02 no-hijack greps, the E-7 cleanup tokens, the E-13
 *    single RM read + §8 B-1 md gate, the §2.4/§4/§10 marker/a11y contract,
 *    and the REV-07 geometry provenance.
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
  'src/components/explore/sections/projects-section.tsx',
];
// EXPLORE-08 plan 02 (UI-SPEC §9/§14 seams 2+3): the timeline stage moves to
// the client slice — the stage component + its interaction hook carry
// "use client"; the server set shrinks to skills/projects + the tiles.
const clientBodies = [
  'src/components/explore/sections/experience-section.tsx',
  'src/components/explore/use-timeline-progress.ts',
];
const phaseTouchedComponents = [...serverSlices, ...sectionBodies, ...clientBodies];

test('cross-cutting: client boundary — server slices stay server, the timeline stage is the phase\'s client slice (D-06, EXPLORE-08 rewrite)', () => {
  // Post-removal contract: the two recharts slices are DELETED (their files
  // must not exist) and no explore file imports recharts or carries a client
  // directive among the server panel-body slices.
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
  for (const p of clientBodies) {
    assert.ok(
      codeOf(p).includes('use client'),
      `${p}: "use client" present — the timeline stage + hook are the phase's client slice (§9)`,
    );
  }
});

test('cross-cutting: motion — never isAnimationActive={true} under explore; matchMedia confined to the interaction hook (OQ-2, EXPLORE-08 rewrite)', () => {
  const exploreFiles = readdirSync(join(root, 'src/components/explore'), { recursive: true })
    .filter((f) => /\.(tsx|ts)$/.test(f));
  for (const rel of exploreFiles) {
    const src = read(join('src/components/explore', rel));
    assert.ok(
      !src.includes('isAnimationActive={true}'),
      `src/components/explore/${rel}: never isAnimationActive={true} (OQ-2)`,
    );
  }
  // The matchMedia ban narrows to the SERVER set (EXPLORE-08: the panels stay
  // unconditionally static; explore-intro.tsx keeps its own pre-existing
  // matchMedia — out of scope and untouched).
  for (const p of [...serverSlices, ...sectionBodies]) {
    assert.ok(
      !codeOf(p).includes('matchMedia'),
      `${p}: no matchMedia — server components never read media state (OQ-2)`,
    );
  }
  // The interaction hook reads exactly the two pinned queries: the
  // reduced-motion mode (E-13 — fresh per derivation pass) and the md gate
  // (§8 B-1 — with a change listener).
  const hook = codeOf('src/components/explore/use-timeline-progress.ts');
  assert.ok(
    hook.includes("matchMedia('(prefers-reduced-motion: reduce)')"),
    'use-timeline-progress reads the reduced-motion query (E-13)',
  );
  assert.ok(
    hook.includes("matchMedia('(min-width: 768px)')"),
    'use-timeline-progress reads the md breakpoint query (§8 B-1 gate)',
  );
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
  assert.ok(
    src.includes('experience: ({ data }) => <ExperienceSection experience={data.experience} education={data.education} />,'),
    'the education-passing experience adapter (phase 9 REV-16 — the merged derivation feeds the stage)',
  );
  assert.ok(src.includes('projects: ({ data }) => <ProjectsSection projects={data.projects} />,'));
  assert.equal(
    (src.match(/\w+: \(\{ data \}\) => </g) || []).length,
    4,
    'exactly four adapter closures — the registry is total over the 4-section grid (D-04/D-07)',
  );
});

test('cross-cutting: REV-08 — both chart files deleted, builders absent, the arc stage replaces the rail (D-03, EXPLORE-08 rewrite)', () => {
  // The removal contract: no chart artefact remains on disk or in the two
  // section files, while the semicircular arc stage (the REV-07 showcase,
  // now realized per the phase-8 UI-SPEC) carries the pinned SVG geometry
  // and the single-DOM compact year chip.
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
    exp.includes('M 100 0 A 100 100 0 0 0 100 200'),
    'the left-bulging C arc path is present (UI-SPEC §2.2 — the central visual metaphor)',
  );
  assert.ok(
    exp.includes('md:hidden'),
    'the md:hidden year chip survives in the single-DOM layers (§8 B-1 — compact form, no second subtree)',
  );
  assert.ok(
    exp.includes('use client'),
    'experience-section is the client stage (§9 — inverted from the phase-7 server pin)',
  );
});

test('cross-cutting: recharts removed — 38 permanent + framer-motion adopted for editorial compositions, no recharts key (OQ-2, plan 04)', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(
    Object.keys(pkg.dependencies).length,
    39,
    'dependencies 38 (post-recharts, OQ-2) + framer-motion, adopted as a real dependency for phase-9 editorial compositions after the engine decision',
  );
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
// Phase EXPLORE-07 plan 03: REV-11 motion falsifiability (UI-SPEC §10.3-8) —
// source greps over globals.css + the section files. Written RED-first per
// the plan's red/green discipline: the pins assert the target contract
// BEFORE the CSS/class usage lands (the panel-grid hook and the exp-lift
// usage already exist from plan 02 — those pins hold immediately; every CSS
// pin is RED until this plan's globals.css block lands).
// ---------------------------------------------------------------------------

// The motion region in globals.css: from the entrance keyframes to the
// reduced-motion guard. Scoping assertions run over THIS region only — the
// pre-existing CLI cursor blink (@keyframes blink, globals.css:251) lives
// outside it and is not an explore surface.
const motionRegion = (lines, fromIdx, toIdx) => lines.slice(fromIdx, toIdx);

test('motion: panel-grid stagger entrance — keyframes, shorthand, source-ordered delays, guard-covered (REV-11/D-04/M1, UI-SPEC §10.3)', () => {
  const css = read('src/app/globals.css');
  const lines = css.split('\n');

  // §10.3: the keyframes + the .panel-grid > * animation shorthand.
  assert.ok(
    (css.match(/explore-panel-in/g) || []).length >= 2,
    'explore-panel-in appears ≥ 2 times (keyframes declaration + shorthand usage)',
  );
  const shorthandLine = lines.findIndex((l) =>
    l.includes('animation: explore-panel-in 240ms cubic-bezier(0.25, 1, 0.5, 1) backwards'),
  );
  assert.ok(
    shorthandLine > -1,
    'the stagger shorthand names explore-panel-in, 240ms, the pinned curve cubic-bezier(0.25, 1, 0.5, 1), backwards fill',
  );
  const keyframesLine = lines.findIndex((l) => l.includes('@keyframes explore-panel-in'));
  assert.ok(keyframesLine > -1, '@keyframes explore-panel-in exists');
  assert.match(
    css,
    /@keyframes explore-panel-in\s*\{[\s\S]*?translateY\(8px\)[\s\S]*?translateY\(0\)/,
    'the keyframes rise from opacity 0 / translateY(8px) to translateY(0)',
  );
  assert.ok(keyframesLine < shorthandLine, 'keyframes declared before the shorthand that names them');

  // R4 (MDN animation): the shorthand resets animation-delay — the nth-child
  // delay rules MUST sit after the shorthand line in source order or the
  // 40ms cascade flattens to simultaneous.
  const delayLines = [40, 80, 120].map((ms, i) => {
    const idx = lines.findIndex((l) => l.includes(`:nth-child(${i + 2}) { animation-delay: ${ms}ms; }`));
    assert.ok(idx > -1, `the nth-child(${i + 2}) delay rule ${ms}ms exists`);
    assert.ok(idx > shorthandLine, `the ${ms}ms delay rule sits AFTER the shorthand line (source order, R4)`);
    return idx;
  });
  assert.ok(delayLines[0] < delayLines[1] && delayLines[1] < delayLines[2], 'delay rules ordered 40 → 80 → 120 (DOM order)');

  // §10.8: every rule in the new motion region is scoped under .explore-shell
  // (selector-level check; @keyframes is name-scoped and exempt).
  const guardIdx = lines.findIndex((l) => l.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(guardIdx > delayLines[2], 'the reduced-motion guard block sits AFTER the motion block — it stays the file tail');
  for (const l of motionRegion(lines, keyframesLine, guardIdx)) {
    if (l.trim().endsWith('{') && !l.trim().startsWith('@keyframes')) {
      assert.ok(l.includes('.explore-shell'), `motion rule scoped under .explore-shell: ${l.trim()}`);
    }
  }

  // The stagger targets the panel-grid container plan 02 planted (§10.3).
  const panels = read('src/components/explore/explore-panels.tsx');
  assert.ok(panels.includes('panel-grid'), 'panel-grid class on the panels container (plan 02 hook — children in DOM order)');
});

test('motion: hover/focus/active vocabulary — lift+bloom, nudge, underline parity, press-settle (REV-11/D-04/M2-M5, U-4/U-5/OQ-A, UI-SPEC §10.4-8)', () => {
  const css = read('src/app/globals.css');
  const lines = css.split('\n');

  // §10.5 / OQ-A: --panel-shadow-hover defined once per theme block, hsl-tinted
  // to the background hue (redesign skill: no generic black shadows).
  assert.match(
    css,
    /^\.explore-shell\s*\{[^}]*--panel-shadow-hover: 0 6px 16px -4px hsl\(220 13% 5% \/ 0\.55\);/m,
    'dark shell defines the bg-hue-tinted hover shadow',
  );
  assert.match(
    css,
    /\.light \.explore-shell\s*\{[^}]*--panel-shadow-hover: 0 6px 16px -4px hsl\(220 20% 20% \/ 0\.15\);/s,
    'light shell defines the slate-tinted hover shadow — never pure black',
  );

  // M2: lift + bloom — transition on transform + box-shadow ONLY, 220ms,
  // the pinned editorial-calm curve (taste §6.A; D-04 200-280ms window).
  assert.match(
    css,
    /\.explore-shell \.exp-lift \{\s*\n\s*transition: transform 220ms cubic-bezier\(0\.25, 1, 0\.5, 1\),\s*\n\s*box-shadow 220ms cubic-bezier\(0\.25, 1, 0\.5, 1\);/,
    'exp-lift transitions transform + box-shadow at 220ms with the pinned curve',
  );
  assert.match(
    css,
    /\.explore-shell \.exp-lift:hover \{[\s\S]*?transform: translateY\(-2px\);[\s\S]*?box-shadow: var\(--panel-shadow-hover\);/,
    'hover lifts 2px with the token bloom',
  );
  // Keyboard parity (B-1 resolution): the bloom composes AFTER the ring
  // layers — the §14 ring stays intact, the bloom rides with it.
  assert.match(
    css,
    /\.explore-shell \.exp-lift:focus-visible \{[\s\S]*?box-shadow: var\(--tw-ring-offset-shadow\), var\(--tw-ring-shadow\),\s*var\(--panel-shadow-hover\);/,
    'focus-visible composes the three-layer ring + bloom shadow',
  );
  // U-4/W-5 press-settle: :active source-ordered AFTER the :hover rule.
  const hoverIdx = lines.findIndex((l) => l.includes('.explore-shell .exp-lift:hover'));
  const activeIdx = lines.findIndex((l) => l.includes('.explore-shell .exp-lift:active'));
  assert.ok(hoverIdx > -1, 'the .exp-lift:hover rule exists');
  assert.ok(activeIdx > hoverIdx, 'the :active press-settle rule is source-ordered AFTER :hover (source-order override)');
  assert.match(css, /\.explore-shell \.exp-lift:active \{[\s\S]*?transform: translateY\(0\);/, 'press settles to translateY(0)');

  // M3: icon nudge — row hover + row focus via the a-scoped trigger rules.
  assert.match(
    css,
    /\.explore-shell \.exp-nudge \{\s*\n\s*transition: transform 220ms cubic-bezier\(0\.25, 1, 0\.5, 1\);/,
    'exp-nudge transitions transform at 220ms with the pinned curve',
  );
  assert.match(
    css,
    /\.explore-shell a:hover \.exp-nudge,\s*\n\s*\.explore-shell a:focus-visible \.exp-nudge \{\s*\n\s*transform: translateX\(2px\);/,
    'a:hover / a:focus-visible nudge the exp-nudge icon 2px',
  );

  // Durations: every transition duration in the motion region sits in the
  // 200-280ms window (animation-delay values are delays, not durations).
  const guardIdx2 = lines.findIndex((l) => l.includes('@media (prefers-reduced-motion: reduce)'));
  const keyframesLine2 = lines.findIndex((l) => l.includes('@keyframes explore-panel-in'));
  for (const l of motionRegion(lines, keyframesLine2, guardIdx2)) {
    if (l.includes('transition:')) {
      for (const m of l.matchAll(/(\d+)ms/g)) {
        const ms = Number(m[1]);
        assert.ok(ms >= 200 && ms <= 280, `transition duration ${ms}ms within the 200-280ms editorial-calm window`);
      }
    }
  }
  // The stagger shorthand keeps its M1 pin: 240ms + curve + backwards fill.
  assert.ok(
    css.includes('explore-panel-in 240ms cubic-bezier(0.25, 1, 0.5, 1) backwards'),
    'the stagger shorthand keeps 240ms + pinned curve + backwards fill',
  );

  // §10.4 class usage:
  // Projects — exp-lift on the LINKED anchor ONLY; the unlinked div stays
  // static (hover must never promise interactivity, §3.2/W-2).
  const projects = read('src/components/explore/sections/projects-section.tsx');
  assert.equal(
    (projects.match(/exp-lift/g) || []).length,
    1,
    'exp-lift appears exactly once in projects-section — the linked anchor only',
  );
  const liftLine = projects.split('\n').find((l) => l.includes('exp-lift'));
  assert.ok(liftLine, 'the linked card anchor line carries exp-lift');
  assert.ok(liftLine.includes('group block rounded-md border border-border p-3'), 'exp-lift rides the linked card anchor shell');
  assert.ok(liftLine.includes('focus-visible:ring'), 'the linked anchor keeps its §14 focus ring');
  assert.ok(
    projects.includes('className="block rounded-md border border-border p-3"'),
    'the unlinked div card keeps its static shell — no exp-lift, no hover affordance (§3.2/W-2)',
  );
  // About — M3 nudge on the channel icons + the resume ArrowRight (U-5);
  // M5 underline focus parity on BOTH underlined labels.
  const about = read('src/components/explore/sections/about-section.tsx');
  const nudgeLines = about.split('\n').filter((l) => l.includes('exp-nudge'));
  assert.ok(nudgeLines.length >= 2, `exp-nudge on the channel icons + the resume ArrowRight (${nudgeLines.length} ≥ 2)`);
  assert.ok(nudgeLines.some((l) => l.includes('ArrowRight')), 'the resume row ArrowRight joins M3 (U-5)');
  const parityLines = about
    .split('\n')
    .filter((l) => l.includes('group-hover:underline') && l.includes('group-focus-visible:underline'));
  assert.ok(
    parityLines.length >= 2,
    `group-focus-visible:underline on BOTH underlined labels, riding group-hover:underline (contact + Full resume) — M5 keyboard parity (${parityLines.length} ≥ 2)`,
  );
  // Skills — the competency cards carry exp-lift (plan 02 hook, §10.4).
  const skills = read('src/components/explore/sections/skills-section.tsx');
  assert.ok(skills.includes('exp-lift'), 'competency cards carry exp-lift (plan 02, animated by the vocabulary)');

  // Header press-settle (U-4/A-10): active:bg-muted/80 on all four 44px
  // ghost controls; the theme swap stays INSTANT — no transition utility in
  // header code (§0 rail; prose comments are stripped per codeOf).
  const headerSrc = read('src/components/explore/explore-header.tsx');
  assert.equal(
    (headerSrc.match(/active:bg-muted\/80/g) || []).length,
    4,
    'active:bg-muted/80 on all four 44px ghost controls (Tour/theme/drawer/Terminal)',
  );
  assert.ok(
    !codeOf('src/components/explore/explore-header.tsx').includes('transition'),
    'no transition utility in header code — the theme swap stays instant (§0 rail)',
  );

  // §10.7: negative JS-animation greps under src/components/explore/ — the
  // vocabulary is CSS-only; comments stripped per the codeOf convention.
  // DEV (plan deviation, recorded): the plan's acceptance said
  // requestAnimationFrame prints 0 under src/components/explore/ — unsatisfiable
  // against the real tree: the tour spotlight's PRE-EXISTING double-rAF
  // measurement (W-1/W-2, last touched phase-6 cc30b09, untouched here) uses
  // it for layout timing, not animation. The invariant REV-11 actually needs
  // is "no NEW JS animation APIs": the full ban holds for every explore file
  // EXCEPT the tour, whose rAF baseline is frozen at its phase-6 counts
  // (5 requestAnimationFrame / 3 cancelAnimationFrame) so any new usage trips.
  const tourSrc = codeOf('src/components/explore/explore-tour.tsx');
  assert.equal(
    (tourSrc.match(/requestAnimationFrame/g) || []).length,
    5,
    'the tour rAF baseline is frozen — 5 requestAnimationFrame (pre-existing W-1/W-2 measurement, no NEW usage)',
  );
  assert.equal(
    (tourSrc.match(/cancelAnimationFrame/g) || []).length,
    3,
    'the tour cleanup baseline is frozen — 3 cancelAnimationFrame',
  );
  const exploreFiles = readdirSync(join(root, 'src/components/explore'), { recursive: true })
    .filter((f) => /\.(tsx|ts)$/.test(f));
  for (const banned of ['.animate(', 'framer-motion', 'gsap', 'lottie']) {
    for (const rel of exploreFiles) {
      const src = codeOf(join('src/components/explore', rel));
      assert.ok(!src.includes(banned), `src/components/explore/${rel}: ${banned} absent (CSS-only motion, REV-11)`);
    }
  }
  // EXPLORE-08 plan 02 (recorded deviation): the timeline interaction hook
  // joins the tour as the second sanctioned rAF site — UI-SPEC §6 pins the
  // scroll-driven channel to hand-rolled rAF writes (D-04, zero new deps),
  // so the invariant becomes "no rAF OUTSIDE the two sanctioned sites", with
  // the hook's cancellation pinned below.
  for (const rel of exploreFiles) {
    if (String(rel).endsWith('explore-tour.tsx') || String(rel).endsWith('use-timeline-progress.ts')) continue;
    const src = codeOf(join('src/components/explore', rel));
    assert.ok(
      !src.includes('requestAnimationFrame'),
      `src/components/explore/${rel}: requestAnimationFrame absent (CSS-only motion, REV-11 + the two sanctioned sites)`,
    );
  }
  const hookCode = codeOf('src/components/explore/use-timeline-progress.ts');
  assert.ok(
    hookCode.includes('requestAnimationFrame'),
    'the timeline hook schedules its derivation pass via rAF (UI-SPEC §6 — the sanctioned scroll channel)',
  );
  assert.ok(
    hookCode.includes('cancelAnimationFrame'),
    'the timeline hook cancels its pending frame on unmount (E-7)',
  );
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

test('export: the four panel headers render the aria-hidden mono index spans 01-04 (UI-SPEC §5/§10.6, D-02)', () => {
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  const html = readExport();
  // The class signature keeps the assertion off the drawer's decorative
  // chart-N digits, which carry entirely different classes (UI-SPEC §5 scope).
  const spans =
    html.match(
      /aria-hidden="true" class="ml-auto select-none font-mono text-2xl font-medium leading-none tabular-nums text-muted-foreground\/50">[0-9]{2}<\/span>/g,
    ) || [];
  assert.equal(spans.length, 4, `exactly four panel index spans render — found ${spans.length}`);
  ['01', '02', '03', '04'].forEach((digits, i) => {
    assert.ok(
      spans.some((s) => s.endsWith(`>${digits}</span>`)),
      `panel #${i + 1} carries the zero-padded index ${digits}`,
    );
  });
});

test('export: CLI and resume still emitted (EXPLORE-05/D-07)', () => {
  assert.ok(existsSync(join(root, 'out/index.html')), 'out/index.html still emitted (D-10)');
  assert.ok(existsSync(join(root, 'out/resume.html')), 'out/resume.html still emitted (D-10)');
});

test('export: the REV-11 motion vocabulary ships in the built stylesheet (UI-SPEC §9.1/§10.8, plan 03)', () => {
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  // The export links the compiled CSS as a static chunk (hashed name) —
  // discover it instead of pinning the hash.
  const cssDir = join(root, 'out/_next/static/css');
  assert.ok(existsSync(cssDir), 'out/_next/static/css missing — run `npm run build` first');
  const cssFiles = readdirSync(cssDir).filter((f) => f.endsWith('.css'));
  assert.ok(cssFiles.length >= 1, 'at least one compiled CSS chunk ships');
  const compiled = cssFiles.map((f) => readFileSync(join(cssDir, f), 'utf8')).join('\n');
  assert.ok(compiled.includes('explore-panel-in'), 'the entrance keyframes ship in the compiled CSS (M1)');
  assert.ok(compiled.includes('panel-grid'), 'the panel-grid stagger selectors ship (M1)');
  assert.ok(compiled.includes('panel-shadow-hover'), 'the hover bloom token ships (M2/OQ-A)');
  assert.ok(compiled.includes('exp-lift'), 'the lift rules ship (M2)');
  assert.ok(compiled.includes('exp-nudge'), 'the nudge rules ship (M3)');
});

// ---------------------------------------------------------------------------
// Phase EXPLORE-08 plan 03: the interaction-quality invariants as permanent
// suite rows (UI-SPEC §2.4/§4/§5/§7/§10/§12/§13 — the falsifiability
// hardening wave). These rows assert the DELIVERED contract and are expected
// green immediately; any failure is a REAL defect in the delivered source —
// fix it there honouring the UI-SPEC rails, never weaken the assertion.
// Greps judge code, not prose (the codeOf convention).
// ---------------------------------------------------------------------------

const stageHook = () => codeOf('src/components/explore/use-timeline-progress.ts');
const stageBody = () => codeOf('src/components/explore/sections/experience-section.tsx');

test('EXPLORE-08 invariant (R-3): the section id lives ONLY on the sticky stage — the grid wrapper is anonymous', () => {
  const panels = codeOf('src/components/explore/explore-panels.tsx');
  assert.ok(
    !/<div[^>]*\bid=/.test(panels),
    'explore-panels.tsx: no <div> carries an id attribute — the extended wrapper stays anonymous (R-3: the tour hole, the IO threshold and the drawer anchors all measure the sticky SECTION by its stable id)',
  );
  assert.ok(
    panels.includes('id={section.id}'),
    'explore-panels.tsx: the section id flows from PanelShell id={section.id} onto the sticky <section> (panel-shell.tsx renders id={id})',
  );
});

test('EXPLORE-08 invariant (D-02/R-5): no wheel/touch listeners and no document/window listener attachment — scrolling IS the progress input', () => {
  for (const [name, code] of [
    ['use-timeline-progress.ts', stageHook()],
    ['experience-section.tsx', stageBody()],
  ]) {
    for (const banned of ['wheel', 'touchmove', 'touchstart']) {
      assert.ok(!code.includes(banned), `${name}: "${banned}" absent (D-02 — no event hijacking; progress derives from scroll position through the sticky range)`);
    }
  }
  const hook = stageHook();
  for (const banned of ['document.addEventListener', 'window.addEventListener']) {
    assert.ok(!hook.includes(banned), `use-timeline-progress.ts: "${banned}" absent — listeners attach to the main scroll element / stage refs only (REV-12: no scroll-jacking outside the section)`);
  }
});

test('EXPLORE-08 invariant (E-7): every cleanup token is present in the hook — listeners, observer, pending frame', () => {
  const hook = stageHook();
  assert.ok(
    (hook.match(/removeEventListener/g) || []).length >= 2,
    'use-timeline-progress.ts: removeEventListener ≥ 2 (the scroll listener on main + the change listener on the md media query)',
  );
  assert.ok(hook.includes('disconnect()'), 'use-timeline-progress.ts: ResizeObserver.disconnect() present (E-6/E-7)');
  assert.ok(hook.includes('cancelAnimationFrame'), 'use-timeline-progress.ts: cancelAnimationFrame present — the pending rAF frame is cancelled on unmount (E-7/REV-13)');
});

test('EXPLORE-08 invariant (E-13): exactly ONE raw prefers-reduced-motion read, and no change listener rides the RM query', () => {
  const hook = stageHook();
  assert.equal(
    (hook.match(/prefers-reduced-motion/g) || []).length,
    1,
    'use-timeline-progress.ts: exactly one raw prefers-reduced-motion occurrence — the per-derivation-pass read (E-13: fresh per pass, no cached flag, no listener)',
  );
  assert.equal(
    (hook.match(/addEventListener\('change'/g) || []).length,
    1,
    'exactly one change listener in the hook — the md gate; the reduced-motion query carries NONE (E-13)',
  );
  const changeIdx = hook.indexOf("addEventListener('change'");
  const before = hook.slice(0, changeIdx);
  const lastQuery = before.lastIndexOf('matchMedia(');
  assert.ok(lastQuery > -1, 'the change listener attaches to a matchMedia handle');
  assert.ok(
    before.slice(lastQuery).includes('(min-width: 768px)'),
    "the hook's ONLY change listener rides matchMedia('(min-width: 768px)') — never the reduced-motion query",
  );
});

test('EXPLORE-08 invariant (§8 B-1): the md gate is a media query WITH its change listener — added and removed', () => {
  const hook = stageHook();
  assert.ok(
    hook.includes("matchMedia('(min-width: 768px)')"),
    "the md gate query matchMedia('(min-width: 768px)') is greppable (§8 B-1: dormant below md, computeProgress never runs)",
  );
  assert.ok(
    hook.includes("addEventListener('change'"),
    'the md gate carries its change listener (compact ↔ stage visibility handoff, B-1)',
  );
  assert.ok(
    hook.includes("removeEventListener('change'"),
    'the md change listener is removed on cleanup (E-7)',
  );
});

test('EXPLORE-08 invariant (§2.4/§4/§10): marker non-interactivity + the two-control a11y contract', () => {
  const exp = stageBody();
  for (const [banned, why] of [
    ['aria-current', 'emphasis is visual; state is announced by the sr-only live region (§2.4 — no current-state marker attribute)'],
    ['tabIndex', 'no tabindex additions anywhere (§10)'],
    ['cursor-pointer', 'markers/arc/content carry no hover/press/cursor affordance (§4 — the arc is emphasis, not navigation)'],
  ]) {
    assert.ok(!exp.includes(banned), `experience-section.tsx: ${banned} absent — ${why}`);
  }
  // The hover affordance lives ONLY on the Prev/Next controls, via the tour's
  // GHOST_INTERACTION recipe verbatim held in ONE shared const. (Recorded
  // deviation from the plan's row: it counted "hover:" twice — per-button
  // copies — but the delivered form shares the recipe through the const, so
  // the literal appears once and BOTH buttons interpolate it. Same §4
  // contract, asserted against the delivered shape.)
  assert.equal(
    (exp.match(/hover:/g) || []).length,
    1,
    'experience-section.tsx: "hover:" appears exactly once — inside the shared GHOST_INTERACTION const (the tour recipe verbatim); no other element in the stage carries a hover affordance',
  );
  assert.equal(
    (exp.match(/\$\{GHOST_INTERACTION\}/g) || []).length,
    2,
    'BOTH Prev/Next controls interpolate GHOST_INTERACTION (§4: hover + focus-visible recipe on each button, nowhere else)',
  );
  assert.ok(
    exp.includes('aria-live="polite"'),
    'the sr-only aria-live="polite" region is present (§10 — announces discrete role changes only, never per scroll frame)',
  );
  assert.ok(
    exp.includes("padStart(2, '0')} /"),
    "the control-row counter idiom padStart(2, '0')} / is present (§4: 01 / 05, the PanelShell index precedent)",
  );
});

test('EXPLORE-08 invariant (REV-07): arc geometry derives from cos/sin over measured size — no hardcoded per-marker positions', () => {
  const geo = codeOf('src/components/explore/timeline-geometry.ts');
  assert.ok(geo.includes('Math.cos'), 'timeline-geometry.ts: Math.cos present (the locked polar formula, §2.2)');
  assert.ok(geo.includes('Math.sin'), 'timeline-geometry.ts: Math.sin present');
  for (const p of [
    'src/components/explore/timeline-geometry.ts',
    'src/components/explore/use-timeline-progress.ts',
    'src/components/explore/sections/experience-section.tsx',
  ]) {
    assert.ok(
      !/\btranslate\([^)]*\d{3,}/.test(codeOf(p)),
      `${p}: no translate() string carries a hardcoded ≥3-digit coordinate — marker positions derive from the measured container geometry (REV-07 acceptance)`,
    );
  }
});
