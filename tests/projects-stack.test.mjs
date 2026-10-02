/**
 * Pure card-state contract suite for the projects swipe-driven stacked-card
 * carousel — phase-10 REV-21 (user directive 2026-09-25).
 *
 * RED-first TDD: this suite is written against the ring-buffer cardState
 * signature and the swipe-decision helpers.
 *
 * Pins the NORMATIVE contracts:
 *   §3   cardState(cardIndex, frontIndex) ring-buffer geometry
 *   §4.2 first-sentence tagline rule (terminal period kept, word-boundary ellipsis)
 *   §4.5 deterministic technology lexicon (description-derived, no data-field change)
 *   §9   projectYear mirror of the retired rowYear
 *   §10   swipe acceptance thresholds
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
  swipeAccepts,
  SWIPE_THRESHOLD,
  SWIPE_VELOCITY_THRESHOLD,
} from '../src/components/explore/projects-card-state.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'src/data/portfolio-main-data.json'), 'utf8'));
const top6 = data.projects.slice(0, 6);
const COUNT = 6;

/** The stage that owns the GenerativeVisual dispatch switch (read at test time). */
const STACK_STAGE_PATH = join(root, 'src/components/explore/sections/projects-stack-stage.tsx');

/**
 * FROZEN curated per-project variant map (gap-closure plan 10-04, REV-19
 * "6 distinct variants"). Declared ONCE here and keyed by project name so the
 * expectation is always looked up from the real data set, never by position:
 * a data reorder cannot silently pass. The module's CURATED_VARIANTS must
 * agree with this map entry for entry, and plan 06 reconciles UI-SPEC §4.4's
 * drafted variant labels to these shipped identifiers.
 */
const CURATED_VARIANTS = {
  DeepIndex: 'terminal-mock',
  'Clarif-AI': 'contract-analysis',
  'SDK4ED-TD': 'glyph',
  'ServicedMetricsCalculator': 'report',
  'Avoid Traffic Extended': 'network',
  'Uom Track': 'dashboard',
};

/** Every variant name the module can return: the curated six, which already
 * cover the four-name hash fallback set (glyph / report / dashboard / network). */
const ALL_VARIANTS = [
  'terminal-mock',
  'contract-analysis',
  'glyph',
  'report',
  'dashboard',
  'network',
];

const approx = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;

/** Expected first sentence per UI-SPEC §4.2: up to the first period, period KEPT. */
function expectedSentence(description) {
  const idx = description.indexOf('.');
  return idx === -1 ? description : description.slice(0, idx + 1);
}

test('firstSentence: the three short top-6 rows render whole, INCLUDING the terminal period', () => {
  for (const name of ['SDK4ED-TD', 'ServicedMetricsCalculator', 'Avoid Traffic Extended']) {
    const p = top6.find((x) => x.name === name);
    const expected = expectedSentence(p.description);
    assert.ok(expected.length <= 120, `${name}: fixture expectation — first sentence fits the budget`);
    const out = firstSentence(p.description, 120);
    assert.equal(out, expected, `${name}: whole first sentence, terminal period kept`);
    assert.ok(out.endsWith('.'), `${name}: the terminal period survives (no ellipsis case)`);
  }
});

test('firstSentence: the three over-budget top-6 rows truncate at a word boundary with an ellipsis', () => {
  for (const name of ['DeepIndex', 'Clarif-AI', 'Uom Track']) {
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
    { name: 'Uom Track', expected: ['Web', 'tracking'] },
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

  // REV-19 acceptance: the six rendered cards carry six DISTINCT visuals. The
  // failure message names the colliding group so a regression is self-explanatory.
  const byVariant = new Map();
  for (const p of top6) {
    const v = projectVisualVariant(p.name);
    byVariant.set(v, [...(byVariant.get(v) ?? []), p.name]);
  }
  const collisions = [...byVariant.entries()]
    .filter(([, names]) => names.length > 1)
    .map(([v, names]) => `${names.join(' + ')} -> '${v}'`)
    .join('; ');
  const distinct = new Set(top6.map((p) => projectVisualVariant(p.name)));
  assert.equal(top6.length, 6, 'fixture expectation: the stack renders six cards');
  assert.ok(
    distinct.size === top6.length,
    `REV-19 requires 6 distinct generative visuals, got ${distinct.size} of ${top6.length}${
      collisions ? ` - COLLISION: ${collisions}` : ''
    }`,
  );

  // Curated precedence: the frozen per-project table is the PRIMARY assignment,
  // and the six entries are the contract - the executor never re-derives them.
  for (const p of top6) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(CURATED_VARIANTS, p.name),
      `${p.name}: the frozen curated map must cover every top-6 project`,
    );
    assert.equal(
      projectVisualVariant(p.name),
      CURATED_VARIANTS[p.name],
      `${p.name}: the curated entry takes precedence over the name hash`,
    );
  }
  assert.equal(
    Object.keys(CURATED_VARIANTS).length,
    6,
    'the frozen curated map carries exactly one entry per top-6 project',
  );

  // Determinism and membership: every returnable name is drawn from the set the
  // stage can dispatch, and repeated calls are identical within the process.
  for (const p of top6) {
    const variant = projectVisualVariant(p.name);
    assert.equal(variant, projectVisualVariant(p.name), `${p.name}: repeat call is identical`);
    assert.ok(ALL_VARIANTS.includes(variant), `${p.name}: '${variant}' is a dispatchable variant name`);
  }

  // Hash fallback preserved: a name outside the curated six still resolves
  // deterministically through djb2 % 4 - the fix narrows the hash, it does not
  // delete it.
  const uncurated = 'NotACuratedProject';
  assert.ok(
    !Object.prototype.hasOwnProperty.call(CURATED_VARIANTS, uncurated),
    'fixture expectation: the probe name is not in the curated map',
  );
  const fallback = projectVisualVariant(uncurated);
  assert.ok(variantSet.has(fallback), `uncurated name resolves to a hash variant, got '${fallback}'`);
  assert.equal(fallback, ['glyph', 'report', 'dashboard', 'network'][djb2(uncurated) % 4]);
  assert.equal(projectVisualVariant(uncurated), fallback, 'the hash fallback is stable across calls');
});

test('projectVisualVariant: every returnable variant has a renderer in the stage dispatch', () => {
  const stageSource = readFileSync(STACK_STAGE_PATH, 'utf8');
  const reachable = new Set([
    ...top6.map((p) => projectVisualVariant(p.name)),
    ...['glyph', 'report', 'dashboard', 'network'],
  ]);
  assert.ok(reachable.size >= 6, `expected at least the six variants, got ${reachable.size}`);
  for (const variant of reachable) {
    const probe = ['case', "'" + variant + "'" + ':'].join(' ');
    assert.ok(
      stageSource.includes(probe),
      `GenerativeVisual must dispatch '${variant}' - a variant the module can return but the stage cannot render falls through to the default glyph visual`,
    );
  }
});


test('cardState: frontIndex 0 geometry — foreground card 0, behind cards 1..5', () => {
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

test('cardState: frontIndex 3 geometry — card 3 foreground, cyclic wrap keeps finite values', () => {
  const fg = cardState(3, 3, COUNT, false);
  assert.equal(fg.translateY, 0);
  assert.equal(fg.scale, 1);
  assert.equal(fg.opacity, 1);
  assert.equal(fg.zIndex, 100);
  assert.equal(fg.activeAmount, 1);
  assert.equal(fg.visible, true);

  // Cards behind card 3 in the ring are 4, 5, 0, 1, 2.
  const behind = [
    { index: 4, depth: 1, y: -38, scale: 0.96, opacity: 0.95, zIndex: 90, rotation: 0.75 },
    { index: 5, depth: 2, y: -76, scale: 0.92, opacity: 0.85, zIndex: 80, rotation: -0.75 },
    { index: 0, depth: 3, y: -114, scale: 0.88, opacity: 0.70, zIndex: 70, rotation: -1 },
    { index: 1, depth: 4, y: -152, scale: 0.84, opacity: 0.50, zIndex: 60, rotation: -0.5 },
    { index: 2, depth: 5, y: -190, scale: 0.80, opacity: 0.30, zIndex: 50, rotation: 0.5 },
  ];
  for (const exp of behind) {
    const s = cardState(exp.index, 3, COUNT, false);
    assert.equal(s.translateY, exp.y, `card ${exp.index}: translateY`);
    assert.equal(s.scale, exp.scale, `card ${exp.index}: scale`);
    assert.equal(s.opacity, exp.opacity, `card ${exp.index}: opacity`);
    assert.equal(s.zIndex, exp.zIndex, `card ${exp.index}: zIndex`);
    assert.equal(s.rotation, exp.rotation, `card ${exp.index}: rotation`);
  }
});

test('cardState: loop invariant — a full cycle of 6 frontIndex steps returns the initial arrangement', () => {
  const initial = top6.map((_, i) => cardState(i, 0, COUNT, false));
  for (let step = 1; step <= COUNT; step++) {
    const front = step % COUNT;
    for (let i = 0; i < COUNT; i++) {
      const expectedDepth = (COUNT + i - front) % COUNT;
      const s = cardState(i, front, COUNT, false);
      assert.equal(s.zIndex, 100 - expectedDepth * 10, `card ${i} step ${step}: zIndex depth ${expectedDepth}`);
      assert.equal(s.activeAmount, expectedDepth === 0 ? 1 : 0, `card ${i} step ${step}: activeAmount`);
    }
  }
  const afterCycle = top6.map((_, i) => cardState(i, COUNT, COUNT, false));
  assert.deepEqual(afterCycle, initial, 'after 6 frontIndex advances the stack geometry is identical to frontIndex 0');
});

test('cardState: monotonicity, clamping and finite values over a frontIndex sweep', () => {
  for (let i = 0; i < COUNT; i++) {
    for (let front = 0; front < COUNT; front++) {
      const s = cardState(i, front, COUNT, false);
      assert.ok(Number.isFinite(s.translateY), `card ${i} front=${front}: finite translateY`);
      assert.ok(Number.isFinite(s.translateX), `card ${i} front=${front}: finite translateX`);
      assert.ok(Number.isFinite(s.scale), `card ${i} front=${front}: finite scale`);
      assert.ok(Number.isFinite(s.opacity), `card ${i} front=${front}: finite opacity`);
      assert.ok(Number.isFinite(s.rotation), `card ${i} front=${front}: finite rotation`);
      assert.ok(Number.isFinite(s.zIndex), `card ${i} front=${front}: finite zIndex`);
      assert.ok(s.scale >= 0.8 && s.scale <= 1, `card ${i} front=${front}: scale in [0.8,1]`);
      assert.ok(s.opacity >= 0 && s.opacity <= 1, `card ${i} front=${front}: opacity in [0,1]`);
      assert.ok(s.opacity <= 0.05 || s.visible, `card ${i} front=${front}: visible iff opacity > 0.05`);
      assert.equal(typeof s.visible, 'boolean');
    }
  }
});

test('cardState: reversibility — same frontIndex yields identical geometry', () => {
  for (const front of [0, 1, 2, 3, 4, 5]) {
    for (let i = 0; i < COUNT; i++) {
      const a = cardState(i, front, COUNT, false);
      const b = cardState(i, front, COUNT, false);
      assert.deepEqual(a, b, `card ${i} front=${front}: deterministic / reversible`);
    }
  }
});

test('cardState: reduced-motion branch pins translate/scale/rotation to 0, keeps opacity/zIndex', () => {
  for (let front = 0; front < COUNT; front++) {
    for (let i = 0; i < COUNT; i++) {
      const rm = cardState(i, front, COUNT, true);
      assert.equal(rm.translateY, 0, `card ${i} front=${front}: RM translateY pinned to 0`);
      assert.equal(rm.translateX, 0, `card ${i} front=${front}: RM translateX pinned to 0`);
      assert.equal(rm.scale, 1, `card ${i} front=${front}: RM scale pinned to 1`);
      assert.equal(rm.rotation, 0, `card ${i} front=${front}: RM rotation pinned to 0`);
      assert.ok(rm.opacity >= 0 && rm.opacity <= 1, `card ${i} front=${front}: RM opacity still in [0,1]`);
      assert.ok(Number.isFinite(rm.zIndex), `card ${i} front=${front}: RM zIndex finite`);
    }
  }
});

test('cardState: visibility drops below the 0.05 opacity cutoff', () => {
  // In an 8-card ring, the deepest card from the foreground has depth 7.
  const far = cardState(0, 1, 8, false);
  assert.ok(!far.visible, 'deepest card position makes card invisible');
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

test('swipeAccepts: threshold semantics — offset or velocity must cross the pin, direction is preserved', () => {
  assert.equal(swipeAccepts(0, 0), 0, 'zero offset and zero velocity rejects');
  assert.equal(swipeAccepts(50, 200), 0, 'both below thresholds rejects');
  assert.equal(swipeAccepts(-50, -200), 0, 'negative below thresholds rejects');

  assert.equal(swipeAccepts(SWIPE_THRESHOLD, 0), 1, 'right offset exactly at threshold accepts');
  assert.equal(swipeAccepts(-SWIPE_THRESHOLD, 0), -1, 'left offset exactly at threshold accepts');
  assert.equal(swipeAccepts(SWIPE_THRESHOLD + 1, 0), 1, 'right offset past threshold accepts');
  assert.equal(swipeAccepts(-(SWIPE_THRESHOLD + 1), 0), -1, 'left offset past threshold accepts');

  assert.equal(swipeAccepts(0, SWIPE_VELOCITY_THRESHOLD), 1, 'positive velocity exactly at threshold accepts');
  assert.equal(swipeAccepts(0, -SWIPE_VELOCITY_THRESHOLD), -1, 'negative velocity exactly at threshold accepts');
  assert.equal(swipeAccepts(20, SWIPE_VELOCITY_THRESHOLD + 100), 1, 'low offset but high velocity accepts');

  assert.equal(swipeAccepts(NaN, 0), 0, 'non-finite offset rejects');
  assert.equal(swipeAccepts(0, NaN), 0, 'non-finite velocity rejects');

  // Direction follows the dominant signed input.
  assert.equal(swipeAccepts(120, -300), 1, 'right offset dominates left velocity');
  assert.equal(swipeAccepts(-120, 300), -1, 'left offset dominates right velocity');
});

// ---------------------------------------------------------------------------
// 2026-10-02 defect fix (DEFECT 1 centering / DEFECT 2 containment)
//
// The stage's geometry contract moved from "card box == stage box,
// overflow-visible" to "stage box = card box + peek band + safe margin,
// overflow-hidden, card box bottom-anchored". These pins derive the arithmetic
// from the source's own constants instead of copying the class literals, so a
// silent re-numbering cannot pass.
// ---------------------------------------------------------------------------

const PANELS_PATH = join(root, 'src/components/explore/explore-panels.tsx');
const SHELL_PATH = join(root, 'src/components/explore/explore-shell.tsx');
const stageSource = () => readFileSync(STACK_STAGE_PATH, 'utf8');

/** Extract a Record<'full'|'compact', string> block's entries from the stage source. */
function heightMap(source, constName) {
  const block = source.match(new RegExp(`const ${constName}[\\s\\S]*?\\n\\};`));
  assert.ok(block, `${constName}: height map present in the stage`);
  const entries = Object.fromEntries(
    [...block[0].matchAll(/(full|compact):\s*'([^']+)'/g)].map((m) => [m[1], m[2]]),
  );
  assert.deepEqual(Object.keys(entries).sort(), ['compact', 'full'], `${constName}: one entry per mode`);
  return entries;
}

/** Every px height in a Tailwind height class string ('h-[520px] md:h-[560px]' -> [520, 560]). */
const heightPx = (cls) => [...cls.matchAll(/(?:^|\s|:)h-\[(\d+)px\]/g)].map((m) => Number(m[1]));

test('stage containment: the fixed stage height IS the arithmetic card + peek band + safe margin', () => {
  const src = stageSource();
  const constPx = (name) => {
    const m = src.match(new RegExp(`const ${name} = (\\d+);`));
    assert.ok(m, `${name}: constant present (the peek band / safe margin are named, not inlined)`);
    return Number(m[1]);
  };
  const band = constPx('PEEK_BAND_PX');
  const safe = constPx('PEEK_SAFE_PX');
  assert.equal(
    band,
    250,
    'the peek band covers the LEVELS table depth-5 magnitudes (|yUp| 190, |yLeave| 246) rounded up',
  );
  assert.equal(safe, 20, 'the safe margin covers the curated ±1° rotation and ±4px translateX overhang');

  const card = heightMap(src, 'CARD_HEIGHT_CLASS');
  const stage = heightMap(src, 'STAGE_HEIGHT_CLASS');
  for (const mode of ['full', 'compact']) {
    const cardPx = heightPx(card[mode]);
    const stagePx = heightPx(stage[mode]);
    assert.ok(cardPx.length > 0 && cardPx.length === stagePx.length, `${mode}: one stage height per card height`);
    stagePx.forEach((value, i) => {
      assert.equal(
        value,
        cardPx[i] + band + safe,
        `${mode}: stage ${value}px = card ${cardPx[i]}px + band ${band}px + safe ${safe}px`,
      );
    });
  }
  // <md invariant: the compact stage owns the base (unprefixed) height.
  assert.equal(heightPx(stage.compact).length, 1, 'compact carries exactly one (base, <md) stage height');
  assert.ok(!/md:/.test(stage.compact), 'the compact stage height is unprefixed — 375px uses it as-is');
});

test('stage containment: overflow-hidden stage, bottom-anchored card box, zero negative-space escape', () => {
  const src = stageSource();
  assert.ok(
    src.includes('${widthClass} ${stageHeightClass} overflow-hidden'),
    'the stage container carries the fixed stage height AND overflow-hidden — the 500px fly-off and the depth peeks cannot extend the layout',
  );
  assert.ok(
    !src.includes('${heightClass} overflow-visible'),
    'the retired card-box-sized overflow-visible stage container is gone',
  );
  assert.ok(
    /'overflow-visible'/.test(src),
    'the foreground card keeps overflow-visible so the bloom still renders onto the cards beneath INSIDE the band',
  );
  assert.ok(
    /left: 0,\s*\n\s*right: 0,\s*\n\s*bottom: 0,/.test(src),
    'the card box is bottom-anchored in the stage (left/right/bottom 0) — decoupled from the peek band it travels through',
  );
  assert.ok(
    !/inset: 0/.test(src),
    'no card fills the stage box (inset: 0 would swallow the peek band)',
  );
  for (const [path, source] of [
    [STACK_STAGE_PATH, src],
    [PANELS_PATH, readFileSync(PANELS_PATH, 'utf8')],
  ]) {
    assert.ok(
      !/(?:^|[\s"'`])-m[trblxy]?-/.test(source),
      `${path}: no negative margin utility pulls the stage outside its parent`,
    );
    assert.ok(
      !/(?:^|[\s"'`])-(?:inset|top|bottom|left|right)-/.test(source),
      `${path}: no negative inset utility offsets the stage outside its parent`,
    );
  }
});

test('stack centering: flex items-center justify-center around the stage wrapper + the md panel-body centering', () => {
  const src = stageSource();
  assert.ok(
    src.includes('flex h-full w-full flex-col items-center justify-center'),
    'the stack root is a flex column centering the stage wrapper in BOTH axes (items-center + justify-center)',
  );
  const panels = readFileSync(PANELS_PATH, 'utf8');
  assert.ok(
    panels.includes("projects: { wrapper: '', shell: 'md:flex md:flex-col md:justify-center', gate: false }"),
    'the Projects placement carries the md-scoped centering shell (content-driven height, no sticky range)',
  );
  assert.ok(
    panels.includes('className={placement.shell || undefined}'),
    'the shell seam applies a placement shell even when the sticky gate is false (gate guards the wrapper range only)',
  );
  assert.ok(
    panels.includes('md:justify-center'),
    'the PanelShell body group centers inside the grid-stretched, content-height panel',
  );
});

test('window-scroll invariant: the stage adds no document scroll height — <main> stays the ONLY scroll container', () => {
  const shell = readFileSync(SHELL_PATH, 'utf8');
  assert.ok(
    shell.includes('flex h-dvh flex-col'),
    'the shell frame is clamped to the dynamic viewport height (documentElement cannot grow past innerHeight)',
  );
  assert.ok(
    shell.includes('flex-1 overflow-y-auto'),
    '<main> is the scroll container (flex-1 + overflow-y-auto)',
  );
  assert.equal(
    (shell.match(/overflow-(?:y-)?(?:auto|scroll)/g) || []).length,
    1,
    'exactly ONE scroll container in the shell frame — the window itself never scrolls',
  );

  // Single-scrollbar invariant (3-scrollbar user report). The shell root pins
  // overflow-hidden on BOTH axes; overflow-x-hidden is NOT equivalent — per the
  // CSS spec a single hidden axis makes the other compute as `auto`, so the
  // h-dvh frame could paint its OWN vertical scrollbar next to main. Comments
  // are stripped because the shell's doc comment names the retired form.
  const shellCode = shell.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(
    /explore-shell flex h-dvh flex-col overflow-hidden /.test(shellCode),
    'the shell root pins overflow-hidden (both axes)',
  );
  assert.ok(
    !/overflow-x-hidden/.test(shellCode),
    'the shell root must NOT pin overflow-x-hidden — its computed overflow-y:auto is the shell-owned vertical scrollbar',
  );

  // ...and the WINDOW side: the landing layout locks the document, so the
  // post-shell wrappers + Radix portal roots cannot extend the document past
  // the visual viewport. Route-scoped to (home): /cli and /resume own their
  // height rules and must stay byte-unchanged.
  const landing = readFileSync(join(root, 'src/app/(home)/layout.tsx'), 'utf8');
  assert.match(
    landing,
    /html,\s*body\s*\{[^}]*height:\s*100%;[^}]*overflow:\s*hidden;/s,
    'the landing layout pins html, body { height: 100%; overflow: hidden; } — kills the WINDOW scrollbar',
  );
  for (const p of ['src/app/cli/layout.tsx', 'src/app/resume/page.tsx']) {
    assert.ok(
      !/height:\s*100%;[^}]*overflow:\s*hidden;/.test(readFileSync(join(root, p), 'utf8')),
      `${p}: must NOT inherit the landing's document lock (CLI = own h-screen shell, resume = document scroll by design)`,
    );
  }

  for (const path of [STACK_STAGE_PATH, PANELS_PATH]) {
    assert.ok(
      !/overflow-(?:y-)?(?:auto|scroll)/.test(readFileSync(path, 'utf8')),
      `${path}: adds no nested scroll container — the stage CLIPS (overflow-hidden), so no scrollable overflow can propagate to the document`,
    );
  }
});
