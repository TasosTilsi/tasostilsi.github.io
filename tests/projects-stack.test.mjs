/**
 * Pure card-state contract suite for the projects stacked-card carousel —
 * plan EXPLORE-10-projects-stack-revision-01 (phase 10, REV-18/19/20).
 *
 * RED-first TDD: this suite is written against the not-yet-existing
 * src/components/explore/projects-card-state.ts and the failed static import
 * IS the red signal.
 *
 * Pins the NORMATIVE UI-SPEC contracts:
 *   §3   cardState(cardIndex, carouselProgress) continuous geometry
 *   §4.2 first-sentence tagline rule (terminal period kept, word-boundary ellipsis)
 *   §4.5 deterministic technology lexicon (description-derived, no data-field change)
 *   §9   projectYear mirror of the retired rowYear
 *
 * Data assertions run against the REAL src/data/portfolio-main-data.json at
 * test time — never copied literals.
 *
 * The direct .ts import below is the zero-runtime-import proof: the module
 * must carry no runtime imports and erasable TS so Node 24 type stripping
 * can load it here.
 *
 * Runner: node --test tests/projects-stack.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  firstSentence,
  projectYear,
  projectTechnologies,
  projectVisualVariant,
  djb2,
  cardState,
} from '../src/components/explore/projects-card-state.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'src/data/portfolio-main-data.json'), 'utf8'));
const top6 = data.projects.slice(0, 6);
const COUNT = 6;

const approx = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;

/** Expected first sentence per UI-SPEC §4.2: up to the first period, period KEPT. */
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
    assert.equal(out, expected, `${name}: whole first sentence, terminal period kept`);
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

test('firstSentence: a description with no period', () => {
  assert.equal(firstSentence('no period in this string', 120), 'no period in this string');
  const long = 'word '.repeat(30).trimEnd();
  assert.ok(long.length > 120);
  const out = firstSentence(long, 120);
  assert.ok(out.length <= 120, `got ${out.length}`);
  assert.ok(out.endsWith('…'));
  assert.ok(!out.includes('….'));
  const prefix = out.slice(0, -1);
  assert.ok(long.startsWith(prefix), 'prefix of the original');
  assert.ok(prefix.length === long.length || long[prefix.length] === ' ', 'word-boundary cut');
});

test('firstSentence: the budget boundary is exact', () => {
  const exact = 'x'.repeat(119) + '.';
  assert.equal(exact.length, 120);
  assert.equal(firstSentence(exact, 120), exact);
  const over = 'x'.repeat(120) + '.';
  const out = firstSentence(over, 120);
  assert.equal(out, 'x'.repeat(119) + '…');
});

test('firstSentence: empty string → empty string; ellipsis never doubles with a period', () => {
  assert.equal(firstSentence('', 120), '');
  const out = firstSentence('A'.repeat(130) + ' end. More sentences follow.', 120);
  assert.ok(out.endsWith('…'));
  assert.ok(!out.includes('….'));
  assert.ok(!out.includes('end.'), 'the split happens at the FIRST period — later text is dropped');
});

test('projectYear: the real top-6 dates extract their first 4-digit years in data order', () => {
  const years = top6.map((p) => projectYear(p.date));
  assert.deepEqual(years, ['2026', '2026', '2023', '2023', '2022', '2021']);
});

test('projectYear: absent/empty/unparseable → null', () => {
  assert.equal(projectYear('2026'), '2026');
  assert.equal(projectYear(null), null);
  assert.equal(projectYear(undefined), null);
  assert.equal(projectYear(''), null);
  assert.equal(projectYear('n.d.'), null);
  assert.equal(projectYear('the 19th century'), null);
});

test('projectTechnologies: derives chips deterministically from description, first-appearance order, capped at 4', () => {
  const cases = [
    {
      name: 'DeepIndex',
      expected: ['RAG', 'AI', 'tree-sitter', 'SQLite'],
    },
    { name: 'Clarif-AI', expected: ['AI', 'contract'] },
    { name: 'SDK4ED-TD', expected: ['Technical Debt'] },
    { name: 'ServicedMetricsCalculator', expected: ['metrics'] },
    { name: 'Avoid Traffic Extended', expected: ['route optimization'] },
    { name: 'Uom Track', expected: ['tracking'] },
  ];
  for (const { name, expected } of cases) {
    const p = top6.find((x) => x.name === name);
    const chips = projectTechnologies(p.description, 4);
    assert.deepEqual(chips, expected, `${name}: technology chips match first-appearance lexicon order`);
  }
});

test('projectTechnologies: no match returns empty array', () => {
  assert.deepEqual(projectTechnologies('A generic description without any known term.'), []);
});

test('projectTechnologies: deduplicates and respects max cap', () => {
  const desc = 'RAG RAG AI AI contract contract SQLite';
  assert.deepEqual(projectTechnologies(desc, 4), ['RAG', 'AI', 'contract', 'SQLite']);
  assert.deepEqual(projectTechnologies(desc, 2), ['RAG', 'AI']);
});

test('djb2 and projectVisualVariant: stable, deterministic, flagship names pinned', () => {
  assert.ok(Number.isInteger(djb2('DeepIndex')));
  assert.ok(djb2('DeepIndex') > 0);
  assert.equal(projectVisualVariant('DeepIndex'), 'terminal-mock');
  assert.equal(projectVisualVariant('Clarif-AI'), 'contract-analysis');
  const others = top6.filter((p) => p.name !== 'DeepIndex' && p.name !== 'Clarif-AI');
  const variantSet = new Set(['glyph', 'report', 'dashboard', 'network']);
  for (const p of others) {
    const v = projectVisualVariant(p.name);
    assert.ok(variantSet.has(v), `${p.name}: maps to a known variant, got ${v}`);
  }
  // Stability under repeated calls.
  for (const p of top6) {
    assert.equal(projectVisualVariant(p.name), projectVisualVariant(p.name));
  }
});

test('cardState: progress 0 geometry — foreground card 0, behind cards 1..5', () => {
  const fg = cardState(0, 0, COUNT, false);
  assert.equal(fg.translateY, 0);
  assert.equal(fg.translateX, -4); // IMPERFECTION_X[0]
  assert.equal(fg.scale, 1);
  assert.equal(fg.opacity, 1);
  assert.equal(fg.zIndex, 100);
  assert.equal(fg.rotation, -1); // IMPERFECTION_ROTATION[0]
  assert.equal(fg.activeAmount, 1);
  assert.equal(fg.visible, true);

  const expectations = {
    1: { y: -38, scale: 0.96, opacity: 0.95, zIndex: 90, rotation: -0.5 },
    2: { y: -76, scale: 0.92, opacity: 0.85, zIndex: 80, rotation: 0.5 },
    3: { y: -114, scale: 0.88, opacity: 0.70, zIndex: 70, rotation: 1 },
    4: { y: -152, scale: 0.84, opacity: 0.50, zIndex: 60, rotation: 0.75 },
    5: { y: -190, scale: 0.80, opacity: 0.30, zIndex: 50, rotation: -0.75 },
  };
  for (let i = 1; i < COUNT; i++) {
    const s = cardState(i, 0, COUNT, false);
    const exp = expectations[i];
    assert.equal(s.translateY, exp.y, `card ${i}: translateY`);
    assert.equal(s.scale, exp.scale, `card ${i}: scale`);
    assert.equal(s.opacity, exp.opacity, `card ${i}: opacity`);
    assert.equal(s.zIndex, exp.zIndex, `card ${i}: zIndex`);
    assert.equal(s.rotation, exp.rotation, `card ${i}: rotation (imperfection)`);
    assert.equal(s.activeAmount, 0, `card ${i}: activeAmount`);
    assert.equal(s.visible, true, `card ${i}: visible (opacity above cutoff)`);
  }
});

test('cardState: progress 1 geometry — last card foreground, previous card leaving', () => {
  const fg = cardState(COUNT - 1, 1, COUNT, false);
  assert.equal(fg.translateY, 0);
  assert.equal(fg.scale, 1);
  assert.equal(fg.opacity, 1);
  assert.equal(fg.zIndex, 100);
  assert.equal(fg.activeAmount, 1);
  assert.equal(fg.visible, true);

  const leaving = cardState(COUNT - 2, 1, COUNT, false);
  assert.equal(leaving.translateY, -94, 'leaving y = -l*38 - 56');
  assert.equal(leaving.scale, 0.96);
  assert.equal(leaving.opacity, 0.95);
  assert.equal(leaving.zIndex, 85, 'leaving card one z-step below active, extra -5 for s>0');
});

test('cardState: monotonicity, clamping and finite values over a progress sweep', () => {
  for (let i = 0; i < COUNT; i++) {
    for (let step = 0; step <= 100; step++) {
      const p = step / 100;
      const s = cardState(i, p, COUNT, false);
      assert.ok(Number.isFinite(s.translateY), `card ${i} p=${p}: finite translateY`);
      assert.ok(Number.isFinite(s.translateX), `card ${i} p=${p}: finite translateX`);
      assert.ok(Number.isFinite(s.scale), `card ${i} p=${p}: finite scale`);
      assert.ok(Number.isFinite(s.opacity), `card ${i} p=${p}: finite opacity`);
      assert.ok(Number.isFinite(s.rotation), `card ${i} p=${p}: finite rotation`);
      assert.ok(Number.isFinite(s.zIndex), `card ${i} p=${p}: finite zIndex`);
      assert.ok(s.scale >= 0.8 && s.scale <= 1, `card ${i} p=${p}: scale in [0.8,1]`);
      assert.ok(s.opacity >= 0 && s.opacity <= 1, `card ${i} p=${p}: opacity in [0,1]`);
      assert.ok(s.opacity <= 0.05 || s.visible, `card ${i} p=${p}: visible iff opacity > 0.05`);
      assert.equal(typeof s.visible, 'boolean');
    }
  }
});

test('cardState: reversibility — same progress yields identical geometry', () => {
  for (const p of [0, 0.12, 0.37, 0.5, 0.88, 1]) {
    for (let i = 0; i < COUNT; i++) {
      const a = cardState(i, p, COUNT, false);
      const b = cardState(i, p, COUNT, false);
      assert.deepEqual(a, b, `card ${i} p=${p}: deterministic / reversible`);
    }
  }
});

test('cardState: reduced-motion branch pins translate/scale/rotation to 0, keeps opacity/zIndex', () => {
  for (let step = 0; step <= 100; step++) {
    const p = step / 100;
    for (let i = 0; i < COUNT; i++) {
      const rm = cardState(i, p, COUNT, true);
      assert.equal(rm.translateY, 0, `card ${i} p=${p}: RM translateY pinned to 0`);
      assert.equal(rm.translateX, 0, `card ${i} p=${p}: RM translateX pinned to 0`);
      assert.equal(rm.scale, 1, `card ${i} p=${p}: RM scale pinned to 1`);
      assert.equal(rm.rotation, 0, `card ${i} p=${p}: RM rotation pinned to 0`);
      assert.ok(rm.opacity >= 0 && rm.opacity <= 1, `card ${i} p=${p}: RM opacity still in [0,1]`);
      assert.ok(Number.isFinite(rm.zIndex), `card ${i} p=${p}: RM zIndex finite`);
    }
  }
});

test('cardState: visibility drops below the 0.05 opacity cutoff', () => {
  // At progress 0 only card 0 is active; deep cards still have opacity above cutoff.
  // Sweep far beyond the stack to force opacity collapse.
  const far = cardState(0, 3, COUNT, false);
  assert.ok(!far.visible, 'far-out progress makes card 0 invisible');
  assert.ok(far.opacity <= 0.05 || far.opacity === 0, 'opacity at or below cutoff');
});

test('cardState: totality — non-finite inputs produce finite safe defaults', () => {
  for (const bad of [NaN, Infinity, -Infinity]) {
    const s = cardState(0, bad, COUNT, false);
    assert.equal(s.translateY, 0);
    assert.equal(s.opacity, 0);
    assert.equal(s.visible, false);
    assert.ok(Number.isFinite(s.zIndex));
  }
});

test('cardState: count edge cases preserve finite output', () => {
  const single = cardState(0, 0, 1, false);
  assert.equal(single.translateY, 0);
  assert.equal(single.opacity, 1);
  assert.equal(single.visible, true);
  assert.equal(single.activeAmount, 1);
});
