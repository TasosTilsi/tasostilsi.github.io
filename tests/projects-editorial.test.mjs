/**
 * Pure row-state contract suite for the projects editorial scroll —
 * plan EXPLORE-09-editorial-motion-revision-04 (phase 9, REV-17, D-04).
 *
 * RED-first TDD: this suite is written against the not-yet-existing
 * src/components/explore/projects-row-state.ts and the failed static
 * import IS the red. Unlike the phase-9 RED-locality note in
 * explore-timeline.test.mjs, this file is entirely new-contract — there
 * are no retained pins to protect, so a static import is safe and makes
 * the missing module the single failure cause.
 *
 * Pins the NORMATIVE UI-SPEC contracts (§4.2 row anatomy + the
 * first-sentence rule with OQ-1 reading (b) — the sentence's terminal
 * period counts toward the 120 budget and is kept; §4.3 motion contract:
 * r′ = (n−1)·progress, d = i − r′, y = clamp(H·d, −H, +H),
 * opacity = clamp(1 − |d|, 0, 1), visible = |d| < 1; §9 E-5/E-6/E-8) plus
 * the reduced-motion variant (y ≡ 0, opacity-only) and the U-14
 * hidden-viewport totality guard (H ≤ 0 → y = 0, no NaN).
 *
 * Data assertions run against the REAL src/data/portfolio-main-data.json at
 * test time — never copied literals (house precedent,
 * explore-timeline.test.mjs header).
 *
 * The direct .ts import below is itself the R-12 proof: the module must
 * carry zero runtime imports and erasable TS so Node 24 type stripping can
 * load it here.
 *
 * Runner: node --test tests/projects-editorial.test.mjs (no npm test
 * script exists — run directly).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { firstSentence, rowState, rowYear } from '../src/components/explore/projects-row-state.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'src/data/portfolio-main-data.json'), 'utf8'));
const top6 = data.projects.slice(0, 6);

const H = 480; // the §4.3 pre-measurement fallback height constant
const ROW_COUNT = 6;

/** The expected first sentence per OQ-1 reading (b): up to the first period, period KEPT. */
function expectedSentence(description) {
  const idx = description.indexOf('.');
  return idx === -1 ? description : description.slice(0, idx + 1);
}

test('firstSentence: the four short top-6 rows render whole, INCLUDING the terminal period', () => {
  for (const name of ['SDK4ED-TD', 'ServicedMetricsCalculator', 'Avoid Traffic Extended', 'Uom Track']) {
    const p = top6.find((x) => x.name === name);
    const expected = expectedSentence(p.description);
    assert.ok(expected.length <= 120, `${name}: fixture expectation — first sentence fits the budget`);
    const out = firstSentence(p.description, 120);
    assert.equal(out, expected, `${name}: whole first sentence, terminal period kept (OQ-1 reading b)`);
    assert.ok(out.endsWith('.'), `${name}: the terminal period survives (no ellipsis case)`);
  }
});

test('firstSentence: the two over-budget top-6 rows truncate at a word boundary with an ellipsis', () => {
  for (const name of ['DeepIndex', 'Clarif-AI']) {
    const p = top6.find((x) => x.name === name);
    const expected = expectedSentence(p.description);
    assert.ok(expected.length > 120, `${name}: fixture expectation — first sentence exceeds 120 chars (with-period count)`);
    const out = firstSentence(p.description, 120);
    assert.ok(out.length <= 120, `${name}: output within the 120 budget, got ${out.length}`);
    assert.ok(out.endsWith('…'), `${name}: truncated output ends with the ellipsis`);
    assert.ok(!out.includes('….'), `${name}: NO period after the ellipsis (no double punctuation)`);
    // prefix + word-boundary: the text before '…' is a prefix of the first
    // sentence's body (period stripped), and the next original character is
    // a word boundary (a space) — not a mid-word cut.
    const body = expected.endsWith('.') ? expected.slice(0, -1) : expected;
    const prefix = out.slice(0, -1);
    assert.ok(body.startsWith(prefix), `${name}: truncated text is a prefix of the first sentence`);
    assert.ok(
      prefix.length === body.length || body[prefix.length] === ' ',
      `${name}: cut lands on a word boundary, not mid-word`,
    );
    assert.ok(out.length < expected.length, `${name}: truncation actually shortened the sentence`);
  }
});

test('firstSentence: E-5 — a description with no period', () => {
  // no period, within budget → the whole string
  assert.equal(firstSentence('no period in this string', 120), 'no period in this string');
  // no period, over budget → word-boundary truncate + '…'
  const long = 'word '.repeat(30).trimEnd(); // 149 chars, no period
  assert.ok(long.length > 120);
  const out = firstSentence(long, 120);
  assert.ok(out.length <= 120, `got ${out.length}`);
  assert.ok(out.endsWith('…'));
  assert.ok(!out.includes('….'));
  const prefix = out.slice(0, -1);
  assert.ok(long.startsWith(prefix), 'prefix of the original');
  assert.ok(prefix.length === long.length || long[prefix.length] === ' ', 'word-boundary cut');
});

test('firstSentence: E-6 — the budget boundary is exact', () => {
  // exactly 120 chars with a terminal period → returned unchanged
  const exact = 'x'.repeat(119) + '.';
  assert.equal(exact.length, 120);
  assert.equal(firstSentence(exact, 120), exact);
  // 121 chars → truncated at the word boundary that fits + '…' (no period after)
  const over = 'x'.repeat(120) + '.';
  const out = firstSentence(over, 120);
  assert.equal(out, 'x'.repeat(119) + '…');
});

test('firstSentence: empty string → empty string; ellipsis never doubles with a period', () => {
  assert.equal(firstSentence('', 120), '');
  const out = firstSentence('A'.repeat(130) + ' end. More sentences follow.', 120);
  assert.ok(out.endsWith('…'));
  assert.ok(!out.includes('….'), 'no period after the ellipsis');
  assert.ok(!out.includes('end.'), 'the split happens at the FIRST period — later text is dropped');
});

test('rowState: §4.3 default values at rest and mid-transition', () => {
  // progress 0: row 0 centered and visible, row 1 parked a full H below
  assert.deepEqual(rowState(0, 0, ROW_COUNT, H, false), { y: 0, opacity: 1, visible: true });
  assert.deepEqual(rowState(1, 0, ROW_COUNT, H, false), { y: H, opacity: 0, visible: false });
  // progress 1 with n=6: row 5 is active (r′ = 5), row 4 exits above at exactly −H
  assert.deepEqual(rowState(5, 1, ROW_COUNT, H, false), { y: 0, opacity: 1, visible: true });
  assert.deepEqual(rowState(4, 1, ROW_COUNT, H, false), { y: -H, opacity: 0, visible: false });
  // coexistence at r′ = 2.5: rows 2 and 3 BOTH in the (0,1) opacity band, y ∓H/2
  const row2 = rowState(2, 0.5, ROW_COUNT, H, false);
  const row3 = rowState(3, 0.5, ROW_COUNT, H, false);
  assert.equal(row2.opacity, 0.5);
  assert.equal(row3.opacity, 0.5);
  assert.equal(row2.y, -H / 2, 'outgoing row rides above (negative y)');
  assert.equal(row3.y, H / 2, 'incoming row enters from below (positive y)');
  assert.equal(row2.visible, true);
  assert.equal(row3.visible, true);
});

test('rowState: monotonicity, clamping and the coexistence window over a progress sweep', () => {
  for (let i = 0; i < ROW_COUNT; i++) {
    let prevY = Infinity;
    for (let step = 0; step <= 100; step++) {
      const p = step / 100;
      const s = rowState(i, p, ROW_COUNT, H, false);
      // d = i − (n−1)·p decreases as p rises → y is non-increasing per row
      assert.ok(s.y <= prevY + 1e-9, `row ${i} p=${p}: y monotone non-increasing`);
      prevY = s.y;
      // y clamped to exactly ±H
      assert.ok(s.y >= -H && s.y <= H, `row ${i} p=${p}: y within [−H, +H]`);
      assert.ok(s.opacity >= 0 && s.opacity <= 1, `row ${i} p=${p}: opacity within [0, 1]`);
      assert.equal(typeof s.visible, 'boolean');
    }
    // endpoint clamps: d = ±(n−1) → y pinned to exactly ±H
    if (i > 0) assert.equal(rowState(i, 0, ROW_COUNT, H, false).y, H, `row ${i} at p=0 clamps to +H`);
    if (i < ROW_COUNT - 1) assert.equal(rowState(i, 1, ROW_COUNT, H, false).y, -H, `row ${i} at p=1 clamps to −H`);
  }
  // coexistence: at most 2 rows ever visible; exactly 1 at the exact endpoints
  for (let step = 0; step <= 200; step++) {
    const p = step / 200;
    const visibleCount = [...Array(ROW_COUNT).keys()].filter((i) => rowState(i, p, ROW_COUNT, H, false).visible).length;
    assert.ok(visibleCount <= 2, `p=${p}: at most 2 rows coexist`);
    if (step === 0 || step === 200) assert.equal(visibleCount, 1, `p=${p}: exactly one row at the exact endpoints`);
  }
});

test('rowState: visible flips exactly at |d| ≥ 1', () => {
  // d = 1 − 5·p for row 1; d = 0.999 → still visible
  const pJustBefore = (1 - 0.999) / 5;
  assert.equal(rowState(1, pJustBefore, ROW_COUNT, H, false).visible, true);
  // d = 1 exactly → hidden
  assert.equal(rowState(1, 0, ROW_COUNT, H, false).visible, false);
  // d = −1 exactly → hidden
  assert.equal(rowState(4, 1, ROW_COUNT, H, false).visible, false);
});

test('rowState: reduced motion → y ≡ 0 for every input while opacity still tracks d (RM-5, D-04)', () => {
  for (let step = 0; step <= 100; step++) {
    const p = step / 100;
    for (let i = 0; i < ROW_COUNT; i++) {
      const rm = rowState(i, p, ROW_COUNT, H, true);
      const nom = rowState(i, p, ROW_COUNT, H, false);
      assert.equal(rm.y, 0, `row ${i} p=${p}: RM pins y to 0`);
      assert.equal(rm.opacity, nom.opacity, `row ${i} p=${p}: opacity unaffected by RM`);
      assert.equal(rm.visible, nom.visible, `row ${i} p=${p}: visibility unaffected by RM`);
    }
  }
});

test('rowState: H ≤ 0 totality — y = 0 and no NaN anywhere (U-14 hidden-viewport guard)', () => {
  for (const h of [0, -480, NaN]) {
    for (let step = 0; step <= 20; step++) {
      const p = step / 20;
      for (let i = 0; i < ROW_COUNT; i++) {
        const s = rowState(i, p, ROW_COUNT, h, false);
        assert.equal(s.y, 0, `H=${h} row ${i} p=${p}: totality forces y to 0`);
        assert.ok(Number.isFinite(s.opacity), `H=${h} row ${i} p=${p}: opacity stays finite`);
        assert.equal(typeof s.visible, 'boolean');
      }
    }
  }
});

test('rowYear: the real top-6 dates extract their first 4-digit years in data order', () => {
  const years = top6.map((p) => rowYear(p.date));
  assert.deepEqual(years, ['2026', '2026', '2023', '2023', '2022', '2021']);
});

test("rowYear: absent/empty/unparseable → null (E-8 → the caller's em-dash)", () => {
  assert.equal(rowYear('2026'), '2026');
  assert.equal(rowYear(null), null);
  assert.equal(rowYear(undefined), null);
  assert.equal(rowYear(''), null);
  assert.equal(rowYear('n.d.'), null, 'no 4-digit year pattern → null');
  assert.equal(rowYear('the 19th century'), null, "'19th' is not a \\b(?:19|20)\\d{2}\\b match");
});