/**
 * Layer-1 tour suite — plan EXPLORE-04-explore-gamification-01 (tracer + domain/data tier).
 *
 * Runner: node --test tests/explore-tour.test.mjs  (Node built-in, zero npm deps — D-08).
 * There is NO `test` npm script and CI runs Node 20, while the direct .ts imports
 * here rely on Node's native type stripping (needs Node >= 23.6 — OQ-5), so this
 * suite is local-only (verified on Node v24.16.0).
 *
 * Red-first discipline (session rule for this plan): every suite below was
 * observed RED (failing) before its implementation landed — the failing runs
 * are recorded in the phase-01 SUMMARY.
 *
 * Extended per task: Task 2 (tour-placement.ts table tests), Task 3
 * (use-explore-visited.ts source invariants) append their own blocks.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  EXPLORE_SECTIONS,
  EXPLORE_TOUR_ACCENTS,
  EXPLORE_TOUR_FINISH,
  EXPLORE_TOUR_STEPS,
  EXPLORE_TOUR_STORAGE_KEY,
  EXPLORE_VISITED_STORAGE_KEY,
} from '../src/components/explore/constants.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// ---------------------------------------------------------------------------
// Task 1: tracer — tour constants spine (keys, accents, locked step table)
// ---------------------------------------------------------------------------

test('tour storage keys: exact values, explore-scoped prefix, CLI disjoint (D-05/D-06)', () => {
  assert.equal(EXPLORE_TOUR_STORAGE_KEY, 'portfolio-explore-tour', 'tour flag key (D-05)');
  assert.equal(EXPLORE_VISITED_STORAGE_KEY, 'portfolio-explore-visited', 'visited ids key (D-06)');
  assert.ok(EXPLORE_TOUR_STORAGE_KEY.startsWith('portfolio-explore-'), 'explore-scoped prefix');
  assert.ok(EXPLORE_VISITED_STORAGE_KEY.startsWith('portfolio-explore-'), 'explore-scoped prefix');
  const src = read('src/components/explore/constants.ts');
  assert.ok(
    !/= ["']portfolio-theme["']/.test(src),
    'no constant assigned the CLI theme key (D-05/D-06)',
  );
  assert.ok(
    !/= ["']portfolioCliFoundEasterEggs["']/.test(src),
    'no constant assigned the CLI easter-egg key (D-05/D-06)',
  );
});

test('tour accents: one chip class per section, explore-panels ACCENTS values (UI-SPEC §4)', () => {
  assert.deepEqual(
    EXPLORE_TOUR_ACCENTS,
    {
      about: 'bg-chart-1',
      experience: 'bg-chart-2',
      skills: 'bg-chart-3',
      projects: 'bg-chart-4',
      contact: 'bg-chart-5',
    },
    'chip accent map duplicated from the byte-untouched explore-panels.tsx (D-08)',
  );
});

test('step table: locked 7-entry sequence welcome → … → finish (D-02, UI-SPEC §3)', () => {
  assert.equal(EXPLORE_TOUR_STEPS.length, 7, 'dots count = 7 ("Step N of 7")');
  assert.deepEqual(
    EXPLORE_TOUR_STEPS.map((s) => s.id),
    ['welcome', 'about', 'experience', 'skills', 'projects', 'contact', 'finish'],
    'locked id sequence (D-02)',
  );
  const content = EXPLORE_TOUR_STEPS.slice(1, 6);
  content.forEach((step, i) => {
    assert.equal(
      step.sectionId,
      EXPLORE_SECTIONS[i].id,
      `content step ${i + 2} targets ${EXPLORE_SECTIONS[i].id} in EXPLORE_SECTIONS order`,
    );
    assert.equal(
      step.heading,
      EXPLORE_SECTIONS[i].label,
      'content headings derived from EXPLORE_SECTIONS labels (never duplicated literals)',
    );
    assert.equal(
      step.announce,
      EXPLORE_SECTIONS[i].label,
      'content announce strings derived from EXPLORE_SECTIONS labels (§9 "Step N of 7 — …")',
    );
  });
  assert.equal(EXPLORE_TOUR_STEPS[0].sectionId, null, 'welcome is a no-target step');
  assert.equal(EXPLORE_TOUR_STEPS[0].heading, 'explore --tour', 'welcome chrome heading (§4)');
  assert.equal(EXPLORE_TOUR_STEPS[0].announce, 'welcome', 'welcome SR announce (§9)');
  assert.equal(EXPLORE_TOUR_STEPS[6].sectionId, null, 'finish is a no-target step');
  assert.equal(EXPLORE_TOUR_STEPS[6].heading, 'tour complete', 'finish chrome heading (§4)');
  assert.equal(EXPLORE_TOUR_STEPS[6].announce, 'tour complete', 'finish SR announce (§9)');
});

test('tour copy guard: chrome only, no digits beyond the allowed "60" (§12.4)', () => {
  const strings = [];
  for (const step of EXPLORE_TOUR_STEPS) strings.push(step.heading, step.announce, step.body);
  strings.push(
    EXPLORE_TOUR_FINISH.congrats,
    EXPLORE_TOUR_FINISH.linkLabel,
    EXPLORE_TOUR_FINISH.linkHref,
    EXPLORE_TOUR_FINISH.hint,
  );
  for (const s of strings) {
    assert.ok(typeof s === 'string' && s.length > 0, 'every copy slot is a non-empty string');
    const stripped = s.replace(/60/g, '');
    assert.ok(!/\d/.test(stripped), `no digits beyond the allowed "60": "${s}"`);
  }
  assert.equal(EXPLORE_TOUR_FINISH.linkHref, '/', 'finish card links the CLI at / (D-04)');
  assert.equal(EXPLORE_TOUR_FINISH.linkLabel, 'Open the terminal →', 'finish link label (§4)');
  assert.equal(
    EXPLORE_TOUR_FINISH.hint,
    'the full story lives in the terminal — start with help',
    'finish terminal hint (§4, D-04)',
  );
  assert.equal(EXPLORE_TOUR_STEPS[6].body, EXPLORE_TOUR_FINISH.congrats, 'finish body = congrats');
});

// ---------------------------------------------------------------------------
// Task 2: tour-placement.ts — placeCard table (§3 as amended by R-10),
// visitThreshold (R-2), visited-id parse/serialize (E-8)
// ---------------------------------------------------------------------------

import {
  parseVisitedIds,
  placeCard,
  serializeVisitedIds,
  visitThreshold,
} from '../src/components/explore/tour-placement.ts';

const VALID_IDS = ['about', 'experience', 'skills', 'projects', 'contact'];

test('placeCard: below fits under the panel (§3 first branch)', () => {
  const out = placeCard({
    panelRect: { left: 100, top: 100, width: 300, height: 200 },
    cardSize: { width: 300, height: 100 },
    viewport: { width: 1280, height: 800 },
  });
  assert.deepEqual(out, { mode: 'below', top: 312, left: 100, width: 300 });
});

test('placeCard: below overflow resolves above (§3 second branch)', () => {
  const out = placeCard({
    panelRect: { left: 100, top: 640, width: 300, height: 140 },
    cardSize: { width: 300, height: 100 },
    viewport: { width: 1280, height: 800 },
  });
  assert.deepEqual(out, { mode: 'above', top: 528, left: 100, width: 300 });
});

test('placeCard: near-bottom sliver — above-card would cross the bottom margin → docks', () => {
  // top = 798 passes the viewport gate; above top = 798 − 12 − 100 = 686 and
  // 686 + 100 = 786 > 800 − 16 — the R-10-added above bottom bound closes it.
  const out = placeCard({
    panelRect: { left: 100, top: 798, width: 300, height: 2 },
    cardSize: { width: 300, height: 100 },
    viewport: { width: 1280, height: 800 },
  });
  assert.deepEqual(out, { mode: 'dock', top: 684, left: 16, width: 1248 });
});

test('placeCard: tall panel blocks both below and above → docks', () => {
  const out = placeCard({
    panelRect: { left: 100, top: 5, width: 300, height: 700 },
    cardSize: { width: 300, height: 100 },
    viewport: { width: 1280, height: 800 },
  });
  assert.deepEqual(out, { mode: 'dock', top: 684, left: 16, width: 1248 });
});

test('placeCard: no-target docks below 640px — width = viewport − 32 (§3)', () => {
  const out = placeCard({
    panelRect: null,
    cardSize: { width: 343, height: 120 },
    viewport: { width: 375, height: 812 },
  });
  assert.deepEqual(out, { mode: 'dock', top: 676, left: 16, width: 343 });
  assert.equal(out.width, 375 - 32, 'dock width = viewport.width − 32');
});

test('placeCard: no-target centers at 1280px (§3)', () => {
  const out = placeCard({
    panelRect: null,
    cardSize: { width: 384, height: 120 },
    viewport: { width: 1280, height: 800 },
  });
  assert.deepEqual(out, { mode: 'center', top: 340, left: 448, width: 384 });
});

test('placeCard: targeted width clamps to min(384, panelWidth) (§3)', () => {
  const out = placeCard({
    panelRect: { left: 200, top: 100, width: 500, height: 150 },
    cardSize: { width: 300, height: 80 },
    viewport: { width: 1280, height: 800 },
  });
  assert.deepEqual(out, { mode: 'below', top: 262, left: 200, width: 384 });
  assert.equal(out.width, Math.min(384, 500), 'targeted width = min(384, panelRect.width)');
});

test('placeCard: left edge clamps to the 16px gutter (§3)', () => {
  const out = placeCard({
    panelRect: { left: 5, top: 100, width: 300, height: 150 },
    cardSize: { width: 300, height: 80 },
    viewport: { width: 1280, height: 800 },
  });
  assert.deepEqual(out, { mode: 'below', top: 262, left: 16, width: 300 });
});

test('placeCard: right edge clamps to the 16px gutter (§3)', () => {
  const out = placeCard({
    panelRect: { left: 1250, top: 100, width: 300, height: 150 },
    cardSize: { width: 300, height: 80 },
    viewport: { width: 1280, height: 800 },
  });
  assert.deepEqual(out, { mode: 'below', top: 262, left: 964, width: 300 });
});

test('placeCard: panel fully above the viewport (bottom ≤ 0) docks (R-10 gate)', () => {
  // bottom = −5 ∈ (−12, 0): the exact trap the pinned §3 rows alone admitted —
  // a `below` card at top = 7 would sit on-screen pointing at nothing.
  const out = placeCard({
    panelRect: { left: 100, top: -205, width: 300, height: 200 },
    cardSize: { width: 300, height: 100 },
    viewport: { width: 1280, height: 800 },
  });
  assert.equal(out.mode, 'dock');
  assert.deepEqual(out, { mode: 'dock', top: 684, left: 16, width: 1248 });
});

test('placeCard: panel fully below the viewport (top ≥ vh) docks (R-10 gate)', () => {
  const out = placeCard({
    panelRect: { left: 100, top: 850, width: 300, height: 200 },
    cardSize: { width: 300, height: 100 },
    viewport: { width: 1280, height: 800 },
  });
  assert.equal(out.mode, 'dock');
  assert.deepEqual(out, { mode: 'dock', top: 684, left: 16, width: 1248 });
});

test('visitThreshold: short panel caps at exactly 0.5 (UI-SPEC §5)', () => {
  assert.equal(visitThreshold(200, 346), 0.5);
});

test('visitThreshold: tall panel ratio falls below 0.5 (R-2 amendment)', () => {
  const out = visitThreshold(1400, 346);
  assert.ok(out < 0.5, 'a panel taller than 2× the visible root still marks');
  assert.ok(Math.abs(out - 346 / 1400) < 1e-12);
});

test('visitThreshold: 0.05 floor for extreme panels (R-2)', () => {
  assert.equal(visitThreshold(20000, 346), 0.05);
});

test('parseVisitedIds: null and empty raw → [] (E-8)', () => {
  assert.deepEqual(parseVisitedIds(null, VALID_IDS), []);
  assert.deepEqual(parseVisitedIds('', VALID_IDS), []);
});

test('parseVisitedIds: garbage and non-array JSON → [] (E-8)', () => {
  assert.deepEqual(parseVisitedIds('garbage', VALID_IDS), []);
  assert.deepEqual(parseVisitedIds('{"a":1}', VALID_IDS), []);
  assert.deepEqual(parseVisitedIds('"about"', VALID_IDS), []);
});

test('parseVisitedIds: filters invalid ids, dedupes preserving first-occurrence order (E-8)', () => {
  assert.deepEqual(parseVisitedIds('["about","bogus"]', VALID_IDS), ['about']);
  assert.deepEqual(parseVisitedIds('["about","about","skills"]', VALID_IDS), ['about', 'skills']);
  assert.deepEqual(parseVisitedIds('["skills","about"]', VALID_IDS), ['skills', 'about']);
});

test('serializeVisitedIds: round-trips a deduped valid list (E-8)', () => {
  assert.equal(serializeVisitedIds(parseVisitedIds('["about","skills"]', VALID_IDS)), '["about","skills"]');
  assert.equal(serializeVisitedIds(parseVisitedIds('["about","about"]', VALID_IDS)), '["about"]');
  assert.equal(serializeVisitedIds([]), '[]');
});
// ---------------------------------------------------------------------------
// Task 3: use-explore-visited.ts — data-tier source invariants + storage
// confinement (D-05/D-06, E-7, RESEARCH §5 tier map)
// ---------------------------------------------------------------------------

test('use-explore-visited: exports the visited hook + tour-flag accessors, client-only', () => {
  const path = 'src/components/explore/use-explore-visited.ts';
  assert.ok(existsSync(join(root, path)), 'the data-tier file exists');
  const src = read(path);
  assert.ok(src.startsWith('"use client"'), 'client directive first');
  for (const name of ['useExploreVisited', 'readTourFlag', 'writeTourFlag']) {
    assert.ok(src.includes(`export function ${name}`), `exports ${name}`);
  }
  assert.ok(src.includes('EXPLORE_VISITED_STORAGE_KEY'), 'uses the visited key (D-06)');
  assert.ok(src.includes('EXPLORE_TOUR_STORAGE_KEY'), 'uses the tour key (D-05)');
  assert.ok(src.includes('try {'), 'guarded storage access (E-7)');
  assert.ok(src.includes('catch'), 'guarded storage access (E-7)');
  assert.ok(!src.includes('portfolio-theme'), 'no CLI theme key (D-05/D-06)');
  assert.ok(!src.includes('portfolioCliFoundEasterEggs'), 'no CLI easter-egg key (D-05/D-06)');
  assert.ok(src.includes('.explore-shell > main'), 'IO root targets the explore <main> (D-06)');
  assert.ok(src.includes('visitThreshold'), 'R-2 height-aware thresholds wired (UI-SPEC §5)');
  assert.ok(src.includes('IntersectionObserver'), 'IO marking path present (OQ-3)');
});

test('tour/visited storage keys confined to the data tier (D-05/D-06, RESEARCH §5)', () => {
  const files = readdirSync(join(root, 'src/components/explore')).filter((f) =>
    f.endsWith('.ts') || f.endsWith('.tsx'),
  );
  const keyUsers = files.filter((f) => {
    const src = read(`src/components/explore/${f}`);
    return src.includes('EXPLORE_TOUR_STORAGE_KEY') || src.includes('EXPLORE_VISITED_STORAGE_KEY');
  });
  assert.deepEqual(
    keyUsers.sort(),
    ['constants.ts', 'use-explore-visited.ts'],
    'the two tour keys are referenced ONLY by the definition site and the data tier',
  );
  assert.ok(
    !read('src/components/explore/constants.ts').includes('localStorage'),
    'constants.ts stays storage-free (key string constants only)',
  );
  // 'localStorage' appears ONLY in the data tier + the PRE-EXISTING theme
  // write (use-explore-theme.ts:43, byte-untouched this phase, D-08).
  const storageFiles = files.filter((f) =>
    read(`src/components/explore/${f}`).includes('localStorage'),
  );
  assert.deepEqual(
    storageFiles.sort(),
    ['use-explore-theme.ts', 'use-explore-visited.ts'],
    'tour/visited localStorage CALLS confined to use-explore-visited.ts',
  );
});
