/**
 * Pure derivation contract suite for the semicircular career timeline —
 * plan EXPLORE-08-experience-showcase-revision-01 (phase 8, RED-first TDD).
 *
 * Pins the NORMATIVE UI-SPEC formulas (§1.3 sticky-range progress, §2.2 arc
 * geometry, §2.3 carousel derivation, §3 content layers, §7 reduced-motion
 * variants) plus role selection and start-year parsing (D-03/D-06,
 * R-13/R-14) and the W-4 date-line predicate. These formulas supersede the
 * research's band-model sketch: activeIndex is Math.round(c′), keyboard
 * targets are role positions i/(n−1), not band centers.
 *
 * Data assertions run against the REAL src/data/portfolio-main-data.json at
 * test time — never copied literals (house precedent,
 * explore-visuals.test.mjs header).
 *
 * The direct .ts import below is itself the R-12 proof: the module must
 * carry zero runtime imports and erasable TS so Node 24 type stripping can
 * load it here.
 *
 * Runner: node --test tests/explore-timeline.test.mjs (no npm test script
 * exists — run directly).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  computeProgress,
  continuousIndex,
  activeIndexFromContinuous,
  markerAngle,
  markerEmphasis,
  contentLayer,
  reducedMotionAngle,
  reducedMotionEmphasis,
  viewBoxToPx,
  markerPoint,
  progressForRole,
  scrollTargetForRole,
  startYear,
  selectTimelineRoles,
  dateLineFits,
} from '../src/components/explore/timeline-geometry.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'src/data/portfolio-main-data.json'), 'utf8'));

/** Float-safe equality — pure math asserted to 1e-9 (float dust only). */
const approx = (actual, expected, msg) =>
  assert.ok(
    Math.abs(actual - expected) <= 1e-9,
    `${msg} (expected ${expected}, got ${actual})`,
  );

// ---------------------------------------------------------------------------
// 1. computeProgress — §1.3 sticky-range progress
// ---------------------------------------------------------------------------

test('computeProgress: clamp(−rel/range) — engage 0, release 1, clamped outside, range≤0 → 0 (total)', () => {
  assert.equal(computeProgress(0, 300), 0, 'rel=0 (engage) → progress 0');
  assert.equal(computeProgress(-300, 300), 1, 'rel=−range (release) → progress 1');
  assert.equal(computeProgress(100, 300), 0, 'before engage clamps to 0 — scrolling in flows naturally');
  assert.equal(computeProgress(-500, 300), 1, 'past release clamps to 1 — scrolling out flows naturally');
  let prev = -1;
  for (let rel = 0; rel >= -300; rel -= 10) {
    const p = computeProgress(rel, 300);
    assert.ok(p >= prev - 1e-12, `monotonic at rel=${rel}`);
    assert.ok(p >= 0 && p <= 1, `in [0,1] at rel=${rel}`);
    assert.ok(!Number.isNaN(p), `no NaN at rel=${rel}`);
    prev = p;
  }
  assert.equal(computeProgress(5, 0), 0, 'range=0 → 0 (divide-by-zero total, no NaN)');
  assert.equal(computeProgress(5, -10), 0, 'negative range → 0');
});

// ---------------------------------------------------------------------------
// 2. continuousIndex — the continuous carousel index
// ---------------------------------------------------------------------------

test('continuousIndex: (n−1)·progress, monotone, n=1 → 0 (E-3 generalization)', () => {
  approx(continuousIndex(0.25, 3), 0.5, 'quarter progress → c′=0.5');
  approx(continuousIndex(1, 3), 2, 'full progress → c′=n−1');
  approx(continuousIndex(0, 5), 0, 'zero progress → c′=0');
  assert.equal(continuousIndex(0.7, 1), 0, 'single role → 0 regardless of progress');
  let prev = -1;
  for (let k = 0; k <= 100; k++) {
    const c = continuousIndex(k / 100, 3);
    assert.ok(c >= prev - 1e-12, `monotonic at k=${k}`);
    assert.ok(c >= 0 && c <= 2, `in [0, n−1] at k=${k}`);
    assert.ok(!Number.isNaN(c), `no NaN at k=${k}`);
    prev = c;
  }
});

// ---------------------------------------------------------------------------
// 3. activeIndexFromContinuous — Math.round is NORMATIVE (W-2)
// ---------------------------------------------------------------------------

test('activeIndexFromContinuous: Math.round boundaries at c′=0.5/1.5, clamped to [0, n−1] (W-2 — not band if/else)', () => {
  assert.equal(activeIndexFromContinuous(0.49, 3), 0, 'just below the 0.5 boundary → 0');
  assert.equal(activeIndexFromContinuous(0.5, 3), 1, 'Math.round boundary at c′=0.5 → 1');
  assert.equal(activeIndexFromContinuous(1.5, 3), 2, 'boundary at c′=1.5 → 2');
  assert.equal(activeIndexFromContinuous(2, 3), 2, 'c′=n−1 is a legitimate edge → n−1');
  assert.equal(activeIndexFromContinuous(5, 3), 2, 'clamps high to n−1');
  assert.equal(activeIndexFromContinuous(-1, 3), 0, 'clamps low to 0');
  assert.equal(activeIndexFromContinuous(0.9, 1), 0, 'single role → index 0');
});

// ---------------------------------------------------------------------------
// 4. markerAngle — the exact-fit carousel invariant (UI-SPEC §2.3)
// ---------------------------------------------------------------------------

test('markerAngle: Δ=90/(n−1) exact-fit keeps every marker on the arc ∀ c′ — active at 180° focal', () => {
  // Sweep progress 0→1 for n=3: every marker angle ∈ [90°, 270°], and the
  // formula identity holds (180 − (i−c′)·Δ with Δ = 90/(n−1) = 45).
  for (let k = 0; k <= 100; k++) {
    const c = continuousIndex(k / 100, 3);
    for (const i of [0, 1, 2]) {
      const a = markerAngle(i, c, 3);
      approx(a, 180 - (i - c) * 45, `formula identity at i=${i} k=${k}`);
      assert.ok(a >= 90 - 1e-9 && a <= 270 + 1e-9, `angle ∈ [90,270] at i=${i} k=${k}`);
    }
  }
  for (const i of [0, 1, 2]) {
    approx(markerAngle(i, i, 3), 180, `c′=${i} → angle(i)=180 (focal point, vertical center)`);
  }
  approx(markerAngle(2, 0, 3), 90, 'worst-case bottom end of the sweep');
  approx(markerAngle(0, 2, 3), 270, 'worst-case top end of the sweep');
  // Generalized: n ∈ {1, 2, 4} keeps the invariant — the data yields 3, the
  // math is not 3-hardcoded (E-3).
  assert.equal(markerAngle(0, 0.4, 1), 180, 'n=1 → focal angle');
  for (let k = 0; k <= 100; k++) {
    const c2 = continuousIndex(k / 100, 2);
    for (const i of [0, 1]) {
      const a = markerAngle(i, c2, 2);
      assert.ok(a >= 90 - 1e-9 && a <= 270 + 1e-9, `n=2 sweep i=${i} k=${k}`);
    }
    const c4 = continuousIndex(k / 100, 4);
    for (const i of [0, 1, 2, 3]) {
      const a = markerAngle(i, c4, 4);
      assert.ok(a >= 90 - 1e-9 && a <= 270 + 1e-9, `n=4 sweep i=${i} k=${k}`);
    }
  }
  approx(markerAngle(1, 0, 2), 90, 'n=2 Δ=90');
  approx(markerAngle(3, 0, 4), 90, 'n=4 Δ=30');
});

// ---------------------------------------------------------------------------
// 5. viewBoxToPx + markerPoint — §2.2 meet-mapping, SVG y-down
// ---------------------------------------------------------------------------

test('viewBoxToPx + markerPoint: meet-mapped scale s=2.5 for a 250×520 zone; θ=180 → left bulge; θ=90 → BOTTOM end (y-down); label at radius·0.88', () => {
  const g = viewBoxToPx({ width: 250, height: 520 });
  approx(g.s, 2.5, 's = min(250/100, 520/200) = 2.5');
  approx(g.offsetX, 0, 'offsetX centers the 100×200 meet-mapped box');
  approx(g.offsetY, 10, 'offsetY centers the 100×200 meet-mapped box');
  approx(g.centerX, 250, 'centerX = offsetX + 100·s');
  approx(g.centerY, 260, 'centerY = offsetY + 100·s');
  approx(g.radius, 250, 'radius = 100·s');

  // Unit viewBox geometry (center 100,100, radius 100): θ=180 → vx=0 (the
  // left bulge, focal); θ=90 → vy=200 (BOTTOM end — SVG y-down); θ=270 →
  // vy=0 (top end).
  const unit = { centerX: 100, centerY: 100, radius: 100 };
  const left = markerPoint(unit, 180);
  approx(left.x, 0, 'θ=180 → vx=0 (left bulge, focal)');
  approx(left.y, 100, 'θ=180 → vy=100 (vertical center of the arc)');
  const bottom = markerPoint(unit, 90);
  approx(bottom.x, 100, 'θ=90 sits on the vertical diameter');
  approx(bottom.y, 200, 'θ=90 → vy=200 (BOTTOM end — SVG y-down)');
  const top = markerPoint(unit, 270);
  approx(top.x, 100, 'θ=270 sits on the vertical diameter');
  approx(top.y, 0, 'θ=270 → vy=0 (top end)');

  // Label anchor: the same polar formula at radius·0.88 (12 viewBox-unit
  // inward inset — §2.2).
  const label = markerPoint({ ...unit, radius: unit.radius * 0.88 }, 180);
  approx(label.x, 12, 'label point at radius·0.88');
  approx(label.y, 100, 'label point stays on the horizontal diameter');

  // px geometry: θ=180 lands on the zone's left edge at the vertical center.
  const pxLeft = markerPoint(g, 180);
  approx(pxLeft.x, 0, 'px focal dot on the left edge');
  approx(pxLeft.y, 260, 'px focal dot at the vertical center');
  const pxBottom = markerPoint(g, 90);
  approx(pxBottom.y, 510, 'px bottom end = offsetY + 200·s');
});

// ---------------------------------------------------------------------------
// 6. markerEmphasis — the emphasis ladder
// ---------------------------------------------------------------------------

test('markerEmphasis: ladder active 1/1, adjacent 0.825/0.85, farthest 0.65/0.7 — monotone in |i−c′|', () => {
  const active = markerEmphasis(1, 1, 3);
  approx(active.opacity, 1, 'active opacity = 1');
  approx(active.scale, 1, 'active scale = 1');
  const adj0 = markerEmphasis(0, 1, 3);
  approx(adj0.opacity, 0.825, 'adjacent opacity = 0.65 + 0.35·0.5');
  approx(adj0.scale, 0.85, 'adjacent scale = 0.7 + 0.3·0.5');
  const adj2 = markerEmphasis(2, 1, 3);
  approx(adj2.opacity, 0.825, 'adjacent opacity symmetric');
  approx(adj2.scale, 0.85, 'adjacent scale symmetric');
  const far = markerEmphasis(2, 0, 3);
  approx(far.opacity, 0.65, 'farthest opacity (|i−c′| = n−1 clamp → t=0)');
  approx(far.scale, 0.7, 'farthest scale');
  // Sweep: opacity/scale monotone non-increasing in |i−c′|, in the ladder band.
  for (let k = 0; k <= 100; k++) {
    const c = continuousIndex(k / 100, 3);
    const ems = [0, 1, 2].map((i) => markerEmphasis(i, c, 3));
    for (const e of ems) {
      assert.ok(e.opacity >= 0.65 - 1e-9 && e.opacity <= 1 + 1e-9, `opacity in band at k=${k}`);
      assert.ok(e.scale >= 0.7 - 1e-9 && e.scale <= 1 + 1e-9, `scale in band at k=${k}`);
    }
    const dist = (i) => Math.abs(i - c);
    for (const [a, b] of [[0, 1], [1, 2]]) {
      if (dist(a) <= dist(b)) {
        assert.ok(ems[a].opacity >= ems[b].opacity - 1e-9, `opacity monotone |i−c′| at k=${k} (${a} vs ${b})`);
        assert.ok(ems[a].scale >= ems[b].scale - 1e-9, `scale monotone |i−c′| at k=${k} (${a} vs ${b})`);
      } else {
        assert.ok(ems[b].opacity >= ems[a].opacity - 1e-9, `opacity monotone |i−c′| at k=${k} (${b} vs ${a})`);
        assert.ok(ems[b].scale >= ems[a].scale - 1e-9, `scale monotone |i−c′| at k=${k} (${b} vs ${a})`);
      }
    }
  }
});

// ---------------------------------------------------------------------------
// 7. contentLayer — §3 states
// ---------------------------------------------------------------------------

test('contentLayer: d=0 active, ±0.5 entering/leaving, |d|≥1 hidden, translateY clamped ±28', () => {
  assert.deepEqual(contentLayer(1, 1), { opacity: 1, translateY: 0, visible: true }, 'active (d=0)');
  assert.deepEqual(contentLayer(1.5, 1), { opacity: 0.5, translateY: 7, visible: true }, 'entering (d=+0.5 — sits below, slides up)');
  assert.deepEqual(contentLayer(0.5, 1), { opacity: 0.5, translateY: -7, visible: true }, 'leaving (d=−0.5 — exits upward)');
  assert.deepEqual(contentLayer(2, 1), { opacity: 0, translateY: 14, visible: false }, 'hidden boundary d=1');
  assert.deepEqual(contentLayer(3, 1), { opacity: 0, translateY: 28, visible: false }, 'hidden d=2 — clamp reached');
  assert.deepEqual(contentLayer(4, 1), { opacity: 0, translateY: 28, visible: false }, 'translateY clamped to +28 for any d');
  assert.deepEqual(contentLayer(0, 2), { opacity: 0, translateY: -28, visible: false }, 'translateY clamped to −28');
  assert.deepEqual(contentLayer(0, 0, false), { opacity: 1, translateY: 0, visible: true }, 'SSR rest state = the derivation at progress 0');
});

// ---------------------------------------------------------------------------
// 8. Reduced-motion variants — §7 RM-1/RM-2
// ---------------------------------------------------------------------------

test('reducedMotion variants: frozen angles {180,135,90} by index, scale 1, translateY≡0, opacity-only', () => {
  approx(reducedMotionAngle(0, 3), 180, 'i=0 frozen at the focal point');
  approx(reducedMotionAngle(1, 3), 135, 'i=1 frozen');
  approx(reducedMotionAngle(2, 3), 90, 'i=2 frozen at the bottom end');
  const e = reducedMotionEmphasis(1, 1, 3);
  approx(e.opacity, 1, 'opacity ladder still applies');
  assert.equal(e.scale, 1, 'scale pinned to 1 — no spatial growth');
  const far = reducedMotionEmphasis(2, 0, 3);
  approx(far.opacity, 0.65, 'farthest opacity unchanged');
  assert.equal(far.scale, 1, 'farthest scale pinned to 1');
  assert.deepEqual(contentLayer(1.5, 1, true), { opacity: 0.5, translateY: 0, visible: true }, 'translateY≡0, opacity still tracks c′');
  assert.equal(contentLayer(3, 1, true).translateY, 0, 'hidden layer keeps translateY 0 under RM too');
});

// ---------------------------------------------------------------------------
// 9. progressForRole — keyboard targets round-trip (D-02/W-2)
// ---------------------------------------------------------------------------

test('progressForRole: role positions i/(n−1) — targets round-trip through the derivation chain to the right role', () => {
  approx(progressForRole(0, 3), 0, 'first role edge is a legitimate target');
  approx(progressForRole(1, 3), 0.5, 'middle role');
  approx(progressForRole(2, 3), 1, 'last role edge is a legitimate target');
  assert.equal(progressForRole(0, 1), 0, 'single role → 0');
  // Round-trip through the primary derivation chain: progress → c′ → index.
  for (const i of [0, 1, 2]) {
    const p = progressForRole(i, 3);
    const c = continuousIndex(p, 3);
    assert.equal(activeIndexFromContinuous(c, 3), i, `keyboard target for role ${i} lands on role ${i}`);
  }
  // Stepping to role i sets c′ = i (UI-SPEC §2.3) — the direct form holds too.
  for (const i of [0, 1, 2]) {
    assert.equal(activeIndexFromContinuous(i, 3), i, `c′=${i} is role ${i}`);
  }
});

// ---------------------------------------------------------------------------
// 10. scrollTargetForRole — §5 keyboard scroll arithmetic
// ---------------------------------------------------------------------------

test('scrollTargetForRole: scrollTop + rel + progressForRole·range (scrolling IS the input)', () => {
  assert.equal(scrollTargetForRole(100, 20, 1, 3, 400), 320, '100 + 20 + 0.5·400 = 320');
  assert.equal(scrollTargetForRole(500, 0, 0, 3, 300), 500, 'rel=0 engage: role 0 target = stay');
  assert.equal(scrollTargetForRole(500, 0, 2, 3, 300), 800, 'rel=0 engage: role 2 target = +range');
  assert.equal(scrollTargetForRole(900, -150, 1, 3, 300), 900, 'mid-range: 900 − 150 + 0.5·300 = 900');
});

// ---------------------------------------------------------------------------
// 11. startYear — R-14, against the REAL JSON durations
// ---------------------------------------------------------------------------

test('startYear: FIRST /\\b(?:19|20)\\d{2}\\b/ match wins (never max/min) — real durations yield 2023/2022/2019', () => {
  const tech = data.experience.filter((e) => e.isTechRelated);
  assert.deepEqual(
    tech.map((e) => startYear(e.duration)),
    ['2023', '2022', '2019'],
    'D-03 pinned labels derive from the real durations',
  );
  assert.equal(startYear('Sept 2022 — Aug 2023'), '2022', 'FIRST match — never max/min of the two years');
  assert.equal(startYear('Ongoing'), null, 'no year → null (E-4, no invented label)');
  assert.equal(startYear(''), null, 'empty duration → null');
});

// ---------------------------------------------------------------------------
// 12. selectTimelineRoles — D-06 filter, JSON order, no sorting
// ---------------------------------------------------------------------------

test('selectTimelineRoles: isTechRelated filter yields exactly [Chubb, Upstream Systems, Netcompany-Intrasoft] in JSON order', () => {
  const roles = selectTimelineRoles(data.experience);
  assert.equal(roles.length, 3, 'exactly the 3 tech roles');
  assert.deepEqual(
    roles.map((r) => r.entry.company),
    ['Chubb', 'Upstream Systems', 'Netcompany-Intrasoft'],
    'companies in JSON order — the filter governs, not a slice',
  );
  assert.deepEqual(roles.map((r) => r.year), ['2023', '2022', '2019'], 'years derive from each entry');
  const excluded = data.experience.filter((e) => !e.isTechRelated).map((e) => e.company);
  assert.equal(roles.filter((r) => excluded.includes(r.entry.company)).length, 0, 'all 4 non-tech entries excluded');
  for (const r of roles) {
    assert.equal(r.year, startYear(r.entry.duration), 'each year traces to its entry duration');
  }
});

// ---------------------------------------------------------------------------
// 13. dateLineFits — the W-4 measurable predicate
// ---------------------------------------------------------------------------

test('dateLineFits: 6px/char against innerWidth − 16 — the real 19-char Chubb duration fits 200, not 100', () => {
  const chubb = data.experience.find((e) => e.company === 'Chubb').duration;
  assert.equal(chubb.length, 19, 'premise: the Chubb duration is 19 chars');
  assert.equal(dateLineFits(chubb, 200), true, '114 ≤ 184 — fits');
  assert.equal(dateLineFits(chubb, 100), false, '114 > 84 — does not fit');
  assert.equal(dateLineFits('', 100), true, 'empty label → nothing to drop');
});

// ---------------------------------------------------------------------------
// 14. Edge hardening (Task 3) — E-1/E-2/E-4 edges and totality (UI-SPEC §12)
// ---------------------------------------------------------------------------

test('E-4 hyphen durations: the non-tech hyphen-U+002D strings parse a year via startYear yet stay excluded by the filter', () => {
  assert.equal(
    startYear('November 2017 - April 2018'),
    '2017',
    'hyphen U+002D parses identically — dash style is irrelevant to the regex',
  );
  const nonTech = data.experience.filter((e) => !e.isTechRelated);
  assert.equal(nonTech.length, 4, 'premise: 4 non-tech entries in the real JSON');
  for (const e of nonTech) {
    assert.match(e.duration, /\b(?:19|20)\d{2}\b/, `premise: "${e.duration}" carries a year`);
    assert.equal(typeof startYear(e.duration), 'string', `startYear parses the non-tech "${e.company}" duration`);
  }
  const techCompanies = new Set(selectTimelineRoles(data.experience).map((r) => r.entry.company));
  for (const e of nonTech) {
    assert.equal(techCompanies.has(e.company), false, `"${e.company}" excluded by the isTechRelated filter`);
  }
});

test('E-1 zero-role totality: selectTimelineRoles on empty / all-non-tech input → [] (no invented roles)', () => {
  assert.deepEqual(selectTimelineRoles([]), [], 'empty input → empty roles');
  assert.deepEqual(
    selectTimelineRoles(data.experience.filter((e) => !e.isTechRelated)),
    [],
    'all-non-tech input → empty roles',
  );
});

test('E-2 single-role guard set: every n=1 path is total (divide-by-zero-free) — c′≡0, focal angle, full emphasis, active layer', () => {
  assert.equal(continuousIndex(0.8, 1), 0, 'continuousIndex → 0 for any progress');
  assert.equal(markerAngle(0, 0.35, 1), 180, 'markerAngle → 180 (focal) for any inputs');
  assert.equal(reducedMotionAngle(0, 1), 180, 'RM angle → 180');
  assert.equal(progressForRole(0, 1), 0, 'progressForRole → 0');
  assert.equal(activeIndexFromContinuous(0.9, 1), 0, 'activeIndex → 0');
  assert.deepEqual(markerEmphasis(0, 0.4, 1), { opacity: 1, scale: 1 }, 'markerEmphasis → {1,1}');
  assert.deepEqual(reducedMotionEmphasis(0, 0.4, 1), { opacity: 1, scale: 1 }, 'RM emphasis → {1,1}, scale pinned');
  assert.deepEqual(
    contentLayer(0, 0, false),
    { opacity: 1, translateY: 0, visible: true },
    'c′=0 → active state (E-2 single-role stage math)',
  );
  assert.deepEqual(
    contentLayer(0, 0, true),
    { opacity: 1, translateY: 0, visible: true },
    'RM c′=0 → active, translateY 0',
  );
});

test('contentLayer extreme offsets: |d|>2 clamps translateY to ±28 (any n) with opacity 0, invisible', () => {
  assert.deepEqual(contentLayer(0, 5, false), { opacity: 0, translateY: -28, visible: false }, 'far above → −28 clamp');
  assert.deepEqual(contentLayer(5, 0, false), { opacity: 0, translateY: 28, visible: false }, 'far below → +28 clamp');
  assert.equal(contentLayer(0, 5, true).translateY, 0, 'RM keeps translateY 0 at any offset');
});

test('release semantics: computeProgress clamps rel far beyond ±range — scrolling past the range flows naturally, no hijack', () => {
  assert.equal(computeProgress(1000, 50), 0, 'far before engage → 0');
  assert.equal(computeProgress(-1000, 50), 1, 'far past release → 1');
  assert.ok(!Number.isNaN(computeProgress(-1e9, 1e-3)), 'no NaN at extreme magnitudes');
});

test('dateLineFits totality + startYear nullish inputs: empty label always fits; absent duration → null', () => {
  assert.equal(dateLineFits('', 100), true, 'empty label → true');
  assert.equal(dateLineFits('', 10), true, 'empty label → true even below the 16px padding floor (nothing to drop)');
  assert.equal(startYear(undefined), null, 'absent duration → null (E-4)');
  assert.equal(startYear(null), null, 'null duration → null (E-4)');
});