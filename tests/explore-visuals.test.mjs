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

import { parseDuration } from '../src/components/explore/viz-data.ts';

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