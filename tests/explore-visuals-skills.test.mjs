/**
 * Red/green acceptance tests for plan EXPLORE-06-explore-revision-04 task 2
 * (skills slice — REV-05/D-06).
 *
 * Runner: node --test tests/explore-visuals-skills.test.mjs  (Node built-in,
 * zero npm deps — D-09).
 *
 * Rewritten to the POST-REMOVAL contract (the pre-removal suite asserted the
 * recharts bar chart + treemap anatomy; both were removed with D-06):
 *   • the Skills panel is competency + proof cards FIRST over the surviving
 *     grouped chips + TerminalPointer (U-2 adjudication on record: D-06
 *     removes ONLY the BarChart + Treemap; the chips are the only /explore
 *     rendering of the full hard-skills lists and stay);
 *   • the chart, the treemap and the techMentions mention machinery are gone
 *     atomically with their files/tests (stale-test discipline, D-06);
 *   • the panels adapter's skills closure carries competencies and no
 *     experience prop (the treemap corpus prop reverts);
 *   • the phase-3 B-1 chart-2/3 override pins survive (the CSS tokens stay
 *     live for the Gantt/panel accents).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
// Doc-comment stripping per the explore-shell suite convention (lines 172+):
// banned-literal greps judge code, not prose.
const codeOf = (p) =>
  read(p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// ---------------------------------------------------------------------------
// Competency cards (REV-05/D-06) — the panel's primary rendering
// ---------------------------------------------------------------------------

test('skills-section: competency cards compose FIRST — cards block before the groups loop (§4.2 + U-2 adjudication)', () => {
  const src = read('src/components/explore/sections/skills-section.tsx');
  const cardsIdx = src.indexOf('competencies.map(');
  assert.ok(cardsIdx !== -1, 'the competency cards block is composed');
  const loopIdx = src.indexOf('groups.map(');
  assert.ok(loopIdx !== -1 && cardsIdx < loopIdx, 'cards block composed BEFORE the groups chips loop');
  // U-2 adjudication (recorded override of UI-SPEC §4.1's REMOVED default):
  // the chips + headers + pointer survive below the cards.
  assert.ok(src.includes('font-normal pointer-events-none'), 'chip overrides untouched (U-2)');
  assert.ok(src.includes('<TerminalPointer command="skills" />'), 'terminal pointer untouched (U-2)');
  assert.match(src, /import\s*\{[^}]*skillsGroupCounts[^}]*\}\s*from\s*'\.\.\/viz-data'/, 'chips grouping still single-sourced (§10)');
  assert.ok(src.includes('groups.length === 0'), 'chips graceful-hide preserved');
});

test('skills-section: zero hardcoded competency strings — the nine docx segments appear in data only (EXPLORE-07)', () => {
  const data = JSON.parse(read('src/data/portfolio-main-data.json'));
  const code = codeOf('src/components/explore/sections/skills-section.tsx');
  // The nine docx segments (resume-docx-extraction line 7)…
  const docxSegments = [
    'Test Automation Architecture & Framework Design',
    'Playwright, Selenium, Rest Assured, WebdriverIO',
    'Java, JavaScript, TypeScript',
    'CI/CD (Jenkins, Docker, Bitbucket)',
    'AI-Driven QA (MCP, RAG, Prompt Engineering, Agentic AI)',
    'NPM Module & Platform Architecture',
    'Quality Dashboards & Reporting',
    'Cross-Team Technical Leadership & Mentorship',
    'Performance & Load Testing (ReadyAPI, LoadUI, Postman)',
  ];
  // …plus every name/proof the refreshed data actually carries.
  const dataStrings = data.core_competencies.flatMap((c) => [c.name, c.proof]);
  assert.ok(dataStrings.length >= 16, 'sanity: 8 clusters × name+proof in the data');
  for (const literal of [...docxSegments, ...dataStrings]) {
    assert.ok(
      !code.includes(literal),
      `competency literal "${literal}" lives in the JSON, never in the component (EXPLORE-07)`,
    );
  }
});

test('skills-section: card anatomy pinned — ul/li grid (lg density), chip accent, verbatim proof (§4.2)', () => {
  const src = read('src/components/explore/sections/skills-section.tsx');
  const code = codeOf('src/components/explore/sections/skills-section.tsx');
  assert.match(code, /className="grid grid-cols-1 gap-2 lg:grid-cols-2"/, 'density keys on lg, never md/sm (§2.3/§4.2)');
  assert.match(code, /<ul[\s\S]*competencies\.map\(/s, 'the card grid is a <ul> — countable list (§4.2)');
  assert.match(code, /<li key=/, 'one <li> per cluster');
  assert.match(code, /rounded-md border border-border p-3/, 'card container pin');
  assert.match(code, /<Badge\s+variant="outline"\s+className="font-normal pointer-events-none text-chart-3 border-chart-3\/40"\s*>/, 'name chip: outline Badge + font-normal/pointer-events-none + chart-3 text + 40% border (§4.2/U-3)');
  assert.match(code, /text-xs leading-relaxed text-muted-foreground/, 'proof pin — verbatim from data, never clipped');
  // No slice, no count assumption — the expected-8 is the data's job (§4.2).
  assert.ok(!code.includes('slice('), 'no slice on core_competencies — data-driven count');
  assert.ok(!/[^\w]8[^\w]/.test(code.replace(/\s/g, ' ')), 'no hardcoded 8 — the count renders from the data');
  // Graceful-hide: empty competencies renders no cards block, chips stay independent.
  assert.ok(code.includes('competencies.length > 0'), 'cards block gated on data (graceful-hide, no fallback copy)');
  // The proof renders the data field directly.
  assert.match(code, /\{competency\.proof\}/, 'proof renders the data field verbatim');
  // REV-09 presentation redesign (EXPLORE-07 plan 02, D-02/UI-SPEC §4).
  assert.match(
    code,
    /className="flex flex-col rounded-md border border-border p-3 exp-lift"/,
    'REV-09: the card li carries exp-lift (inert until plan 03 defines .exp-lift in globals.css — D-02/D-04)',
  );
  assert.match(
    code,
    /index % 2 === 0 \? "self-start" : "self-end"/,
    'REV-09: chip wrapper alternates by index parity — even top-left, odd top-right (D-02, UI-SPEC §4)',
  );
  assert.match(
    code,
    /className="mt-2 text-xs leading-relaxed text-muted-foreground"/,
    'REV-09: proof rhythm moves mt-1.5 → mt-2, left-aligned text unchanged (UI-SPEC §4)',
  );
  assert.ok(!code.includes('cursor-pointer'), 'cards are NOT interactive — cursor stays default (§4: no pointer, no 44px)');
  assert.ok(!code.includes('tabIndex'), 'cards stay non-focusable (§9.2: no new focusables)');
});

// ---------------------------------------------------------------------------
// Removal contract — chart, treemap, mention machinery (D-06)
// ---------------------------------------------------------------------------

test('removal: skills-chart.tsx and skills-treemap.tsx do not exist (D-06)', () => {
  assert.equal(existsSync(join(root, 'src/components/explore/sections/skills-chart.tsx')), false, 'bar chart deleted');
  assert.equal(existsSync(join(root, 'src/components/explore/sections/skills-treemap.tsx')), false, 'treemap deleted');
});

test('removal: no recharts import anywhere under src/components/explore/ (D-06/OQ-2)', () => {
  const files = readdirSync(join(root, 'src/components/explore'), { recursive: true })
    .filter((f) => /\.(tsx|ts)$/.test(f));
  assert.ok(files.length > 0, 'sanity: the explore tree is non-empty');
  for (const rel of files) {
    const src = read(join('src/components/explore', rel));
    assert.ok(!/from ['"]recharts['"]/.test(src), `src/components/explore/${rel}: no recharts import`);
  }
});

test('removal: viz-data no longer exports techMentions/TreemapCell — chips machinery survives (D-06/OQ-10)', () => {
  const viz = codeOf('src/components/explore/viz-data.ts');
  assert.ok(!viz.includes('techMentions'), 'mention engine deleted');
  assert.ok(!viz.includes('TreemapCell'), 'treemap cell type deleted');
  assert.ok(!viz.includes('escapeRegExp'), 'mention helper deleted');
  assert.ok(!viz.includes('WORD_CHAR_PATTERN'), 'mention helper deleted');
  assert.ok(!viz.includes('countOccurrences'), 'mention helper deleted');
  assert.ok(viz.includes('export function skillsGroupCounts'), 'chips grouping survives (U-2)');
  assert.ok(viz.includes('export function skillGroupFill'), 'shared fill map survives (U-2)');
});

// ---------------------------------------------------------------------------
// Adapter + chrome copy
// ---------------------------------------------------------------------------

test('explore-panels: skills closure carries competencies={data.core_competencies}, no experience prop (OQ-10)', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  assert.ok(
    src.includes('skills: ({ data }) => <SkillsSection skills={data.skills} competencies={data.core_competencies} />,'),
    'skills closure: skills slice + competencies threaded, experience prop reverted',
  );
  assert.ok(src.includes('about: ({ data }) => <AboutSection about={data.about} />,'));
  assert.ok(!src.includes('contact: ({ data })'), 'no contact closure — Contact merged into AboutSection (REV-04/D-05)');
  assert.ok(src.includes('experience: ({ data }) => <ExperienceSection experience={data.experience} />,'));
  assert.ok(src.includes('projects: ({ data }) => <ProjectsSection projects={data.projects} />,'));
  assert.equal((src.match(/\w+: \(\{ data \}\) => </g) || []).length, 4, 'exactly four adapter closures (D-04/D-07)');
});

test('constants: skills tour step names the cards, no treemap copy anywhere (checker fix)', () => {
  const code = codeOf('src/components/explore/constants.ts');
  assert.ok(
    code.includes('Competency cards with the quantified proof behind each — full inventory below.'),
    'the skills step body names the competency cards (zero invented facts)',
  );
  assert.ok(!/treemap/i.test(code), 'no treemap copy survives in the chrome constants');
});

// ---------------------------------------------------------------------------
// Phase-3 B-1 carry-over — the chart tokens stay live for the surviving
// server-rendered accents (timeline dot bg-chart-2, panel chips)
// ---------------------------------------------------------------------------

test('globals.css: light shell carries the pinned chart-2/chart-3 overrides exactly once (B-1)', () => {
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