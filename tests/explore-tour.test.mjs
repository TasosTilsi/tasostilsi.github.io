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