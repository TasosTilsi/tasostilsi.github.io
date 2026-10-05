/**
 * Pure card-state contract suite for the projects swipe-driven stacked-card
 * carousel — phase-10 REV-18 (user directive 2026-09-25).
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
  ringStep,
  advanceFront,
  ringDepth,
  swipeAccepts,
  levelsFor,
  VISIBLE_BAND_PX,
  LEAVE_EXTRA_PX,
  DEPTH_LEVELS,
  CARD_HEIGHT_MD,
  CARD_HEIGHT_BASE,
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


// ---------------------------------------------------------------------------
// The reveal-ladder contract (2026-10-05; band amended 72 -> 44 the same day)
//
//   scale_l       = clamp(1 - 0.04 * l, 0.80, 1)      0.96/0.92/0.88/0.84/0.80
//   translateY(l) = -(l * VISIBLE_BAND_PX + H_front * (1 - scale_l))
//   yLeave(l)     =  translateY(l) - LEAVE_EXTRA_PX
//
// VISIBLE_BAND_PX is the user's density dial; the FORMULA above is the
// contract. The tables below are the RECORDED derived rows (depth 0 is the
// identity row). They are never copied into the module as literals: every row
// is re-derived here from the formula, so a formula edit that keeps the
// numbers — or a number edit that breaks the formula — fails this suite.
// ---------------------------------------------------------------------------
// 2026-10-05 amendment (user directive): VISIBLE_BAND_PX drops 72 -> 44. The
// band is the user's DENSITY DIAL — the revealed header bands read too tall at
// 72px — while the FORMULA is untouched: only the constant moves, so every row
// below re-derives from it.
const MD_LADDER = [
  { yUp: 0, yLeave: 0, scale: 1.0, opacity: 1.0 },
  { yUp: -66, yLeave: -122, scale: 0.96, opacity: 0.95 },
  { yUp: -133, yLeave: -189, scale: 0.92, opacity: 0.85 },
  { yUp: -199, yLeave: -255, scale: 0.88, opacity: 0.7 },
  { yUp: -266, yLeave: -322, scale: 0.84, opacity: 0.5 },
  { yUp: -332, yLeave: -388, scale: 0.8, opacity: 0.3 },
];

const BASE_LADDER = [
  { yUp: 0, yLeave: 0, scale: 1.0, opacity: 1.0 },
  { yUp: -65, yLeave: -121, scale: 0.96, opacity: 0.95 },
  { yUp: -130, yLeave: -186, scale: 0.92, opacity: 0.85 },
  { yUp: -194, yLeave: -250, scale: 0.88, opacity: 0.7 },
  { yUp: -259, yLeave: -315, scale: 0.84, opacity: 0.5 },
  { yUp: -324, yLeave: -380, scale: 0.8, opacity: 0.3 },
];

/** The formula, recomputed independently of the module. */
const ladderOffset = (depth, cardHeight) =>
  depth === 0
    ? 0
    : -Math.round(depth * VISIBLE_BAND_PX + cardHeight * (1 - Math.min(1, Math.max(0.8, 1 - 0.04 * depth))));

test('reveal-ladder: the module derives the recorded md table (H = 560) from the pinned formula', () => {
  assert.equal(
    VISIBLE_BAND_PX,
    44,
    'one depth step reveals a 44px band of the behind-card top — the user-picked density dial (72 -> 44, 2026-10-05)',
  );
  assert.equal(DEPTH_LEVELS, 5, 'the top-6 stack puts five cards behind the foreground card');
  assert.equal(LEAVE_EXTRA_PX, 56, 'the fly-off continues 56px past the rest offset');
  assert.equal(CARD_HEIGHT_MD, 560);
  assert.equal(CARD_HEIGHT_BASE, 520);

  const rows = levelsFor(CARD_HEIGHT_MD);
  assert.equal(rows.length, DEPTH_LEVELS + 1, 'one row per depth level plus the foreground identity row');
  assert.deepEqual(rows, MD_LADDER, 'the md ladder is the recorded reveal-ladder table');
  assert.deepEqual(rows, levelsFor(), 'the md tier is the module default (the runtime cardState table)');

  for (let depth = 1; depth <= DEPTH_LEVELS; depth++) {
    assert.equal(
      rows[depth].yUp,
      ladderOffset(depth, CARD_HEIGHT_MD),
      `depth ${depth}: yUp is the formula -(l * 44 + H * (1 - scale_l)), not a hand-typed offset`,
    );
    assert.equal(
      rows[depth].yLeave,
      rows[depth].yUp - LEAVE_EXTRA_PX,
      `depth ${depth}: yLeave continues LEAVE_EXTRA_PX (56px) past yUp`,
    );
  }
  assert.deepEqual(
    rows[0],
    { yUp: 0, yLeave: 0, scale: 1.0, opacity: 1.0 },
    'the foreground row is the identity row (no offset, no exit offset, full scale/opacity)',
  );
});

test('reveal-ladder: the base tier (H = 520) derives from the same formula', () => {
  const rows = levelsFor(CARD_HEIGHT_BASE);
  assert.deepEqual(rows, BASE_LADDER, 'the base (<md) ladder is the same formula at the 520px card box');
  for (let depth = 1; depth <= DEPTH_LEVELS; depth++) {
    assert.equal(
      rows[depth].yUp,
      ladderOffset(depth, CARD_HEIGHT_BASE),
      `depth ${depth}: the base tier is derived from H, never a second hand-typed table`,
    );
  }
});

test('reveal-ladder: the scale ladder is unchanged — 0.96/0.92/0.88/0.84/0.80, floored at 0.80', () => {
  const rows = levelsFor(CARD_HEIGHT_MD);
  assert.deepEqual(rows.map((r) => r.scale), [1.0, 0.96, 0.92, 0.88, 0.84, 0.8]);
  for (const h of [CARD_HEIGHT_MD, CARD_HEIGHT_BASE]) {
    for (let depth = 0; depth <= DEPTH_LEVELS; depth++) {
      assert.equal(levelsFor(h)[depth].scale, Math.max(0.8, 1 - 0.04 * depth));
    }
  }
});

test('reveal-ladder: cardState consumes the md ladder row for every depth (runtime tie-in)', () => {
  for (let front = 0; front < COUNT; front++) {
    for (let i = 0; i < COUNT; i++) {
      const depth = ringDepth(i, front, COUNT);
      const s = cardState(i, front, COUNT, false);
      assert.equal(
        s.translateY,
        MD_LADDER[depth].yUp,
        `card ${i} front=${front}: depth ${depth} carries the reveal-ladder offset`,
      );
      assert.equal(s.scale, MD_LADDER[depth].scale, `card ${i} front=${front}: depth ${depth} scale`);
      assert.equal(s.opacity, MD_LADDER[depth].opacity, `card ${i} front=${front}: depth ${depth} opacity`);
    }
  }
});

test('reveal-ladder: depth 6+ extends the same formula (the six-card ring never reaches it)', () => {
  // An 8-card ring puts card 0 at depth 7 behind frontIndex 1. The extrapolation
  // must keep the ladder's own arithmetic — not the retired -38px step.
  const far = cardState(0, 1, 8, false);
  assert.equal(far.translateY, ladderOffset(7, CARD_HEIGHT_MD), 'depth 7: the same formula, extended');
  assert.ok(far.translateY < MD_LADDER[DEPTH_LEVELS].yUp, 'a deeper card sits strictly further up');
  assert.ok(!far.visible, 'and is invisible past the opacity cutoff (unchanged)');
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
    1: { y: -66, scale: 0.96, opacity: 0.95, zIndex: 90, rotation: -0.5 },
    2: { y: -133, scale: 0.92, opacity: 0.85, zIndex: 80, rotation: 0.5 },
    3: { y: -199, scale: 0.88, opacity: 0.70, zIndex: 70, rotation: 1 },
    4: { y: -266, scale: 0.84, opacity: 0.50, zIndex: 60, rotation: 0.75 },
    5: { y: -332, scale: 0.80, opacity: 0.30, zIndex: 50, rotation: -0.75 },
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
    { index: 4, depth: 1, y: -66, scale: 0.96, opacity: 0.95, zIndex: 90, rotation: 0.75 },
    { index: 5, depth: 2, y: -133, scale: 0.92, opacity: 0.85, zIndex: 80, rotation: -0.75 },
    { index: 0, depth: 3, y: -199, scale: 0.88, opacity: 0.70, zIndex: 70, rotation: -1 },
    { index: 1, depth: 4, y: -266, scale: 0.84, opacity: 0.50, zIndex: 60, rotation: -0.5 },
    { index: 2, depth: 5, y: -332, scale: 0.80, opacity: 0.30, zIndex: 50, rotation: 0.5 },
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

test('cardState: reduced motion KEEPS the depth composition, drops only the curated imperfection', () => {
  // RM amendment (2026-10-05): the reveal ladder is the stack's REST
  // composition, not motion — it must never appear or disappear with the OS
  // setting. Reduced motion now only (a) makes the transitions instant and
  // (b) suppresses the curated imperfection (translateX/rotation).
  for (let front = 0; front < COUNT; front++) {
    for (let i = 0; i < COUNT; i++) {
      const rm = cardState(i, front, COUNT, true);
      const depth = ringDepth(i, front, COUNT);
      assert.equal(
        rm.translateY,
        MD_LADDER[depth].yUp,
        `card ${i} front=${front}: RM keeps the depth-${depth} reveal-ladder offset — the depth never appears/disappears with the OS setting`,
      );
      assert.equal(rm.scale, MD_LADDER[depth].scale, `card ${i} front=${front}: RM keeps the ladder scale`);
      assert.equal(rm.opacity, MD_LADDER[depth].opacity, `card ${i} front=${front}: RM keeps the ladder opacity`);
      assert.equal(rm.zIndex, 100 - depth * 10, `card ${i} front=${front}: RM keeps the z ladder`);
      assert.equal(rm.visible, MD_LADDER[depth].opacity > 0.05, `card ${i} front=${front}: RM visibility follows the ladder`);
      assert.equal(rm.activeAmount, depth === 0 ? 1 : 0, `card ${i} front=${front}: RM activeAmount`);
      assert.equal(rm.translateX, 0, `card ${i} front=${front}: RM suppresses the curated x-jitter`);
      assert.equal(rm.rotation, 0, `card ${i} front=${front}: RM suppresses the curated rotation`);
    }
  }

  // The defect this amendment retires: the retired flat-deck branch zeroed
  // translateY/scale for EVERY card, so a behind card's depth (and with it the
  // whole stacked composition) vanished for an RM visitor.
  const behind = cardState(2, 0, COUNT, true);
  assert.notEqual(behind.translateY, 0, 'a behind card under RM is NOT flattened onto the foreground card');
  assert.equal(behind.translateY, MD_LADDER[2].yUp, 'it carries its own ladder row');
  assert.notEqual(behind.scale, 1, 'and its own ladder scale');
  assert.equal(behind.visible, true, 'and still renders (ladder opacity 0.85 is above the cutoff)');
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

/**
 * Pull the single class-string height constant by name out of the stage source
 * — e.g. 'h-[520px] md:h-[560px]'.
 *
 * REV-23b retires the mode-keyed Record: ONE constant now carries the base
 * (<md, the phone) tier and the md: (desktop) tier on the same arithmetic, so
 * there are no mode keys left to require and no `full`/`compact` pair to count.
 */
function heightClass(source, constName) {
  const m = source.match(new RegExp(`const ${constName} = '([^']+)'`));
  assert.ok(
    m,
    `${constName}: the single class-string height constant is present — the mode-keyed Record is retired (REV-23b)`,
  );
  return m[1];
}

/** Every px height in a Tailwind height class string ('h-[520px] md:h-[560px]' -> [520, 560]). */
const heightPx = (cls) => [...cls.matchAll(/(?:^|\s|:)h-\[(\d+)px\]/g)].map((m) => Number(m[1]));

test('stage containment: the fixed stage height IS the arithmetic card + peek band (band carries the safe margin)', () => {
  const src = stageSource();
  const safe = (() => {
    const m = src.match(/const PEEK_SAFE_PX = (\d+);/);
    assert.ok(m, 'PEEK_SAFE_PX: constant present (the safe margin is named, not inlined)');
    return Number(m[1]);
  })();
  assert.equal(safe, 20, 'the safe margin seats the deepest card top and covers the ≥4px outward glow');

  // 2026-10-05: the band is no longer a hand-typed constant. It IS the reveal
  // ladder's own arithmetic — DEPTH_LEVELS visible bands plus the safe margin —
  // so the reserved box and the revealed bands cannot drift apart again.
  const band = DEPTH_LEVELS * VISIBLE_BAND_PX + safe;
  assert.equal(band, 240, 'the peek band is 5 x 44 + 20 = 240px — five revealed header bands plus the safe margin');
  assert.match(
    src,
    /const PEEK_BAND_PX = DEPTH_LEVELS \* VISIBLE_BAND_PX \+ PEEK_SAFE_PX;/,
    'PEEK_BAND_PX derives from the reveal ladder (DEPTH_LEVELS x VISIBLE_BAND_PX + safe), never a hand-typed band',
  );

  // REV-23b: ONE class string per constant, two tiers each — base (<md, the
  // phone) then md: (desktop). Both tiers hold the arithmetic, so the depth
  // peeks and the 500px fly-off cannot extend the layout at either width.
  const cardClass = heightClass(src, 'CARD_HEIGHT_CLASS');
  const stageClass = heightClass(src, 'STAGE_HEIGHT_CLASS');
  assert.match(
    cardClass,
    /^h-\[\d+px\] md:h-\[\d+px\]$/,
    'the card box is exactly one unprefixed (base/<md) height followed by one md: height — a md:-only form or a re-added mode Record cannot pass (REV-23b)',
  );
  assert.match(
    stageClass,
    /^h-\[\d+px\] md:h-\[\d+px\]$/,
    'the stage box is exactly one unprefixed (base/<md) height followed by one md: height (REV-23b)',
  );

  const cardPx = heightPx(cardClass);
  const stagePx = heightPx(stageClass);
  assert.ok(cardPx.length > 0 && cardPx.length === stagePx.length, 'one stage height per card height');
  assert.deepEqual(
    cardPx,
    [CARD_HEIGHT_BASE, CARD_HEIGHT_MD],
    'the card box pair is 520px base (the <md phone tier) / 560px from md — the two heights the reveal ladder is derived against',
  );
  assert.deepEqual(stagePx, [760, 800], 'the stage box pair is 760px base / 800px from md = card + 240px ladder band');
  stagePx.forEach((value, i) => {
    assert.equal(
      value,
      cardPx[i] + band,
      `tier ${i}: stage ${value}px = card ${cardPx[i]}px + band ${band}px (the band already carries the ${safe}px safe margin — PEEK_BAND_PX is never added to a separate safe term)`,
    );
  });

  // The containment identity the arithmetic buys: with the cards scaling about
  // their bottom edge, the deepest top edge lands exactly on PEEK_SAFE_PX, so
  // the topmost revealed band is never clipped and the band is never empty.
  assert.equal(
    stagePx[1] - CARD_HEIGHT_MD - DEPTH_LEVELS * VISIBLE_BAND_PX,
    safe,
    'md: the depth-5 top edge sits exactly PEEK_SAFE_PX (20px) below the stage top — no clipping, no dead space',
  );
  assert.match(
    src,
    /className=\{`\$\{CARD_SHELL\} \$\{CARD_HEIGHT_CLASS\} origin-bottom /,
    'the card scales about its BOTTOM edge: the H_front x (1 - scale_l) compensation in the reveal ladder is the bottom-origin top-edge fall — with the CSS default centre origin every revealed band is ~(72 + 0.02H)px and the deepest top edge is clipped',
  );
});

test('REV-23b: the mode plumbing is retired — no SwipeMode, no compact branch, no compact width cap', () => {
  // One swipe-stack contract at every width (D-02). Each literal below is a
  // SPECIFIC residual form of the retired mode plumbing — never the bare
  // identifier, which would collide with unrelated prose.
  const src = stageSource();
  const retiredPlumbing = [
    ['SwipeMode', 'the SwipeMode union and its Record<>/prop annotations are retired — one contract, no mode key'],
    ['compactHidden', 'the compactHidden depth cap is retired — every depth card is visible on the phone (REV-23b)'],
    ['compact', 'no compact branch or compact prose survives — one contract at every width (REV-23b)'],
    ['max-w-[320px]', 'the compact 320px width cap is retired — the stage keeps max-w-[540px] at every width (REV-23b)'],
    ['mode={', 'no mode prop is passed down the tree (REV-23b)'],
    ['mode="', 'no mode argument is passed to ProjectsSwipeStack (REV-23b)'],
    [', mode }', 'no mode field is destructured out of the props object (REV-23b)'],
    ['mode,', 'no mode field survives in a card destructure or an effect dependency array (REV-23b)'],
    ['[mode]', 'the mode-keyed height/width class lookups are retired (REV-23b)'],
    ['mode ===', 'no mode comparison survives — the class strings are unconditional (REV-23b)'],
  ];
  for (const [literal, message] of retiredPlumbing) {
    assert.ok(!src.includes(literal), `${literal} absent: ${message}`);
  }
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

// ---------------------------------------------------------------------------
// 2026-10-03 gap-closure fix (phase-10 VERIFICATION gap R6 / AP-13)
//
// The fly-off SIDE and the ring-advance DELTA were the same value at every call
// site (cycle(1) / cycle(-1) / newFront = frontIndex + direction), so the Next
// control and a left swipe rotated the ring BACKWARD and landed the departing
// card at depth 1 (the peek) instead of the back. The contract below separates
// the two inputs: the ring advance is primary, the exit sign is presentation.
// ---------------------------------------------------------------------------

test('ringStep: the Next step sends the foreground card to the back (tracer)', () => {
  assert.deepEqual(ringStep('next'), { ringDelta: 1, exitSign: -1 }, 'Next = ring +1 with a left fly-off');

  const newFront = advanceFront(0, ringStep('next').ringDelta, COUNT);
  assert.equal(newFront, 1, 'the Next step advances the ring from 0 to 1 (the counter reads 01 -> 02)');

  // Pure half: the departing card 0 must land at the LAST depth level.
  assert.equal(
    ringDepth(0, newFront, COUNT),
    COUNT - 1,
    'the departing foreground card lands at depth count - 1 (the back of the stack)',
  );

  // User-visible half: the geometry the visitor actually sees for the departed
  // card — the depth-5 level, NOT the depth-1 peek.
  const departed = cardState(0, newFront, COUNT, false);
  assert.equal(departed.zIndex, 50, 'the departed card carries the LOWEST zIndex (50) — the back of the stack');
  assert.equal(departed.opacity, 0.30, 'the departed card carries the depth-5 opacity 0.30');
  assert.equal(departed.translateY, -332, 'the departed card carries the depth-5 reveal-ladder offset -332');
  assert.equal(departed.scale, 0.80, 'the departed card carries the depth-5 scale 0.80');
  assert.equal(departed.visible, true, 'the departed card is still rendered — it peeks from the back');

  // The RETIRED / UNMET mapping (measured pre-fix, the reason gap R6 exists):
  // the -1 step landed the departed card at depth 1 — the peek — with z 90 and
  // opacity 0.95. Asserted here so the RED/GREEN difference is self-documenting.
  assert.equal(
    ringDepth(0, 5, COUNT),
    1,
    'retired/unmet mapping: frontIndex 5 is the depth-1 peek landing the Next/left path used to produce',
  );
  assert.equal(
    cardState(0, 5, COUNT, false).zIndex,
    90,
    'retired/unmet mapping: the peek landing showed zIndex 90, never the back\'s 50',
  );
  assert.equal(
    cardState(0, 5, COUNT, false).opacity,
    0.95,
    'retired/unmet mapping: the peek landing showed opacity 0.95, never the back\'s 0.30',
  );
});

test('ringStep: the direction map — both swipe sides advance the ring, the fly-off side is presentation only', () => {
  assert.deepEqual(ringStep('previous'), { ringDelta: -1, exitSign: 1 }, 'Previous = ring -1 with a right fly-off');

  // The identity that IS the fix: the gesture side never rotates the ring.
  for (const gesture of [-1, 1]) {
    const step = ringStep('swipe', gesture);
    assert.equal(
      step.ringDelta,
      1,
      `swipe ${gesture}: the ring ALWAYS advances forward — the gesture side never rotates the ring`,
    );
    assert.equal(step.exitSign, gesture, `swipe ${gesture}: the exit sign follows the gesture side`);
  }

  // Defensive defaults: an absent, zero or non-finite gesture cannot produce a
  // non-finite exit sign or a reversed ring.
  for (const gesture of [undefined, 0, NaN]) {
    const step = ringStep('swipe', gesture);
    assert.equal(step.ringDelta, 1, `swipe gesture ${String(gesture)}: the ring still advances forward`);
    assert.ok(
      step.exitSign === -1 || step.exitSign === 1,
      `swipe gesture ${String(gesture)}: the exit sign is a finite ±1 (never NaN)`,
    );
  }

  // Every advancing path lands the departing foreground card at the back, for
  // EVERY front index — not just the frontIndex-0 case the tracer pins.
  for (const step of [ringStep('next'), ringStep('swipe', -1), ringStep('swipe', 1)]) {
    for (let f = 0; f < COUNT; f++) {
      assert.equal(
        ringDepth(f, advanceFront(f, step.ringDelta, COUNT), COUNT),
        COUNT - 1,
        `front ${f}: the departing foreground card is at the back on every advancing path`,
      );
    }
  }
});

test('ringStep: Previous is the exact inverse of Next and promotes the back card', () => {
  for (let f = 0; f < COUNT; f++) {
    assert.equal(advanceFront(advanceFront(f, -1, COUNT), 1, COUNT), f, `front ${f}: prev then next is the identity`);
    assert.equal(advanceFront(advanceFront(f, 1, COUNT), -1, COUNT), f, `front ${f}: next then prev is the identity`);

    const promoted = advanceFront(f, ringStep('previous').ringDelta, COUNT);
    assert.equal(
      ringDepth(promoted, f, COUNT),
      COUNT - 1,
      `front ${f}: the promoted card WAS the back card (depth ${COUNT - 1}) — directive req 7 "bring the back card forward"`,
    );
    assert.equal(ringDepth(promoted, promoted, COUNT), 0, `front ${f}: the promoted card IS the foreground now`);
  }

  // Round trip over every supported variant: the six real top-6 projects cover
  // all six curated visuals, and each advancing path restores the arrangement.
  for (const project of top6) {
    assert.ok(
      ALL_VARIANTS.includes(projectVisualVariant(project.name)),
      `${project.name}: the curated variant is exercised by the round trip`,
    );
    for (const step of [ringStep('next'), ringStep('swipe', -1), ringStep('swipe', 1)]) {
      let front = 0;
      for (let k = 0; k < COUNT; k++) front = advanceFront(front, step.ringDelta, COUNT);
      assert.equal(front, 0, `${project.name}: six successive steps return the front index to 0`);
      assert.deepEqual(
        top6.map((_, i) => cardState(i, front, COUNT, false)),
        top6.map((_, i) => cardState(i, 0, COUNT, false)),
        `${project.name}: after a full cycle the stack arrangement is identical to the initial one`,
      );
    }
  }

  // Totality: neither helper can throw or emit NaN, whatever it is handed.
  for (const index of [NaN, Infinity, -Infinity, 0, 1, 5]) {
    for (const front of [NaN, Infinity, -Infinity, 0, 1, 5]) {
      for (const count of [NaN, Infinity, -Infinity, 0, -1, 1, 6]) {
        const advanced = advanceFront(index, 1, count);
        assert.ok(Number.isFinite(advanced), `advanceFront(${index}, 1, ${count}): finite result`);
        if (!(Number.isFinite(count) && count > 1)) {
          assert.equal(advanced, 0, `advanceFront(${index}, 1, ${count}): a ring of at most one card pins the front index to 0`);
        }
        assert.ok(Number.isFinite(ringDepth(index, front, count)), `ringDepth(${index}, ${front}, ${count}): finite result`);
      }
    }
  }
  for (const delta of [NaN, Infinity, -Infinity]) {
    assert.ok(Number.isFinite(advanceFront(0, delta, COUNT)), `advanceFront(0, ${delta}, ${COUNT}): finite result`);
    assert.ok(Number.isFinite(ringDepth(0, delta, COUNT)), `ringDepth(0, ${delta}, ${COUNT}): finite result`);
  }
});
