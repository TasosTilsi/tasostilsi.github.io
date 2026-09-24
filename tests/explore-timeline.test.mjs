/**
 * Pure derivation contract suite for the semicircular career timeline —
 * plan EXPLORE-08-experience-showcase-revision-01 (phase 8, RED-first TDD);
 * renewed to the phase-9 5-entry typed contract by
 * EXPLORE-09-editorial-motion-revision-01 (REV-16, D-03: education merged
 * onto the arc through the ONE typed derivation site).
 *
 * Pins the NORMATIVE UI-SPEC formulas (§1.3 sticky-range progress, §2.2 arc
 * geometry, §2.3 carousel derivation, §3 content layers, §7 reduced-motion
 * variants) plus entry selection and start-year parsing (D-03/D-06,
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
 * RED-locality (phase 9): the new-contract blocks consume the module through
 * ONE dynamic namespace import (top-level await is valid .mjs) and touch
 * the not-yet-existing export ONLY inside those blocks — a static import of
 * a missing export fails the ENTIRE module load and would take every
 * retained phase-8 assertion down with it.
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
  dateLineFits,
} from '../src/components/explore/timeline-geometry.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'src/data/portfolio-main-data.json'), 'utf8'));

// The phase-9 new-contract blocks access the module through this ONE dynamic
// namespace import; `geometry.selectTimelineEntries` (Task 2's export) is
// referenced ONLY inside those blocks. `TimelineEntry` is a type-only export
// — it is never value-imported at runtime; its shape is pinned via a source
// read in the phase-9 suite below.
const geometry = await import('../src/components/explore/timeline-geometry.ts');

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
// 12. selectTimelineEntries — the phase-9 typed merged derivation (REV-16,
//     D-03): experience.filter(isTechRelated) ∪ education.filter(featured),
//     sorted by parsed start year ASCENDING (the phase's ONE deliberate
//     sort), stable with null years LAST. These blocks are the renewed
//     contract; they consume the module through the dynamic namespace
//     import above (RED-locality — never a static import of the export
//     Task 2 introduces).
// ---------------------------------------------------------------------------

test('TimelineEntry is a type-only export pinned at source — shape read from timeline-geometry.ts, never value-imported at runtime', () => {
  const src = readFileSync(join(root, 'src/components/explore/timeline-geometry.ts'), 'utf8');
  assert.ok(src.includes('interface TimelineEntry'), 'the typed entry interface exists in the pure module');
  assert.ok(src.includes("'role' | 'education'"), 'the type discriminator union is pinned in source');
});

test('selectTimelineEntries over the REAL JSON: exactly 5 entries, year-ascending — BEng 2012 · Netcompany-Intrasoft 2019 · MSc 2021 · Upstream Systems 2022 · Chubb 2023 (D-03)', () => {
  const entries = geometry.selectTimelineEntries(data.experience, data.education);
  assert.equal(entries.length, 5, '3 tech roles + 2 featured education records = 5');
  assert.deepEqual(
    entries.map((t) => t.year),
    ['2012', '2019', '2021', '2022', '2023'],
    'year-ascending from the parsed start years',
  );
  assert.deepEqual(
    entries.map((t) => t.type),
    ['education', 'role', 'education', 'role', 'role'],
    'the type discriminator per entry',
  );
  assert.deepEqual(
    entries.map((t) => (t.type === 'role' ? t.entry.company : t.entry.degree)),
    [
      'Bachelor of Computer Engineering',
      'Netcompany-Intrasoft',
      'Master of Science in Computer Science',
      'Upstream Systems',
      'Chubb',
    ],
    'primary identities per type (degree vs company) derive from the real JSON',
  );
  for (const t of entries) {
    assert.equal(t.year, startYear(t.entry.duration), 'each year traces to startYear of the entry duration');
    assert.ok(t.year !== null, 'premise: the real data has no null years — all 5 durations parse');
  }
});

test('selection contracts consumed unchanged: isTechRelated roles (3) ∪ featured education (2) — the pinned filters govern, the data file is untouched', () => {
  const roles = data.experience.filter((e) => e.isTechRelated);
  assert.equal(roles.length, 3, 'exactly the 3 tech roles (the phase-6 filter pin)');
  assert.deepEqual(
    roles.map((r) => r.company),
    ['Chubb', 'Upstream Systems', 'Netcompany-Intrasoft'],
    'roles in JSON order — the filter governs, not a slice',
  );
  const featured = data.education.filter((e) => e.featured);
  assert.equal(featured.length, 2, 'exactly the 2 featured education records');
  assert.deepEqual(
    featured.map((e) => e.institution),
    ['University of Macedonia', 'TEI of Central Macedonia'],
    'featured education in JSON order (the flags are test-pinned in portfolio-data-integrity.test.mjs)',
  );
  const entries = geometry.selectTimelineEntries(data.experience, data.education);
  const roleCompanies = new Set(roles.map((r) => r.company));
  const featuredDegrees = new Set(featured.map((e) => e.degree));
  const typeCounts = { role: 0, education: 0 };
  for (const t of entries) {
    typeCounts[t.type] += 1;
    if (t.type === 'role') {
      assert.ok(roleCompanies.has(t.entry.company), `role entry "${t.entry.company}" traces to the isTechRelated filter`);
    } else {
      assert.ok(featuredDegrees.has(t.entry.degree), `education entry "${t.entry.degree}" traces to the featured flag`);
    }
  }
  assert.equal(typeCounts.role, 3, '3 role entries in the merge');
  assert.equal(typeCounts.education, 2, '2 education entries in the merge');
  const excluded = data.experience.filter((e) => !e.isTechRelated).map((e) => e.company);
  assert.equal(
    entries.filter((t) => t.type === 'role' && excluded.includes(t.entry.company)).length,
    0,
    'all 4 non-tech experience entries excluded',
  );
});

test('sort contract: stable year-ascending with null years LAST — synthetic null-year entry trails, order-stable within equal keys', () => {
  const nullYear = {
    isTechRelated: true,
    duration: 'Ongoing',
    location: 'x',
    title: 'Null Year',
    company: 'Null Year',
  };
  const earlier = {
    isTechRelated: true,
    duration: 'March 2020 — Present',
    location: 'x',
    title: 'Earlier 2020',
    company: 'Earlier 2020',
  };
  const sameYearLater = {
    isTechRelated: true,
    duration: 'June 2020 — Aug 2020',
    location: 'x',
    title: 'Later 2020',
    company: 'Later 2020',
  };
  const entries = geometry.selectTimelineEntries([nullYear, earlier, sameYearLater], []);
  assert.deepEqual(
    entries.map((t) => t.entry.company),
    ['Earlier 2020', 'Later 2020', 'Null Year'],
    'year-ascending; equal keys stay input-stable (Node sort stability); the null year is placed LAST',
  );
});

test('gone-check: the phase-8 role-only derivation export is deleted — ONE derivation site (OQ-8)', () => {
  assert.ok(
    !('selectTimelineRoles' in geometry),
    "the phase-8 role-only export no longer exists on the module's exports",
  );
});

test('template field mapping (pure data level): role exposes title/company/duration/location/responsibilities; education exposes degree/institution/duration/specialization-optional', () => {
  const entries = geometry.selectTimelineEntries(data.experience, data.education);
  const msc = entries.find((t) => t.type === 'education' && t.entry.degree.startsWith('Master of Science'));
  assert.ok(msc, 'the MSc education entry is in the merge');
  assert.equal(msc.entry.specialization, 'Software Quality Assurance Engineering', 'MSc specialization AS STORED');
  assert.equal(msc.entry.institution, 'University of Macedonia', 'institution is the education primary');
  const beng = entries.find((t) => t.type === 'education' && t.entry.degree.startsWith('Bachelor'));
  assert.ok(beng, 'the BEng education entry is in the merge');
  assert.equal(beng.entry.specialization, undefined, 'BEng has no specialization — the template line omits gracefully (OQ-10)');
  assert.ok(beng.entry.location, 'premise: education entries carry a location field — the education TEMPLATE omits it (UI-SPEC §3.3), not the data');
  const chubb = entries.find((t) => t.type === 'role' && t.entry.company === 'Chubb');
  assert.ok(chubb, 'the Chubb role entry is in the merge');
  assert.ok(
    chubb.entry.title && chubb.entry.company && chubb.entry.duration && chubb.entry.location && Array.isArray(chubb.entry.responsibilities),
    'the role picker surface (title/company/duration/location/responsibilities) is intact',
  );
});

test('n=5 sweeps: every marker stays on the arc ∀ progress (Δ=22.5°); the emphasis ladder at n=5 is exactly [1, 0.9125, 0.825, 0.7375, 0.65] / [1, 0.925, 0.85, 0.775, 0.7]', () => {
  for (let k = 0; k <= 100; k++) {
    const c = continuousIndex(k / 100, 5);
    for (const i of [0, 1, 2, 3, 4]) {
      const a = markerAngle(i, c, 5);
      approx(a, 180 - (i - c) * 22.5, `formula identity (Δ=22.5°) at i=${i} k=${k}`);
      assert.ok(a >= 90 - 1e-9 && a <= 270 + 1e-9, `angle ∈ [90,270] at i=${i} k=${k}`);
    }
  }
  const ladders = { opacity: [], scale: [] };
  for (const i of [0, 1, 2, 3, 4]) {
    // The §3.1 ladder is over the DISTANCE |i − c′| = 0..4 — sample at c′=0.
    const e = markerEmphasis(i, 0, 5);
    ladders.opacity.push(e.opacity);
    ladders.scale.push(e.scale);
  }
  const OPACITY_LADDER = [1, 0.9125, 0.825, 0.7375, 0.65];
  const SCALE_LADDER = [1, 0.925, 0.85, 0.775, 0.7];
  for (const i of [0, 1, 2, 3, 4]) {
    approx(ladders.opacity[i], OPACITY_LADDER[i], `the n=5 opacity ladder at distance ${i} (exact)`);
    approx(ladders.scale[i], SCALE_LADDER[i], `the n=5 scale ladder at distance ${i} (exact)`);
  }
});

test('n=5 keyboard round-trip + RM/contentLayer variants unchanged: activeIndexFromContinuous(progressForRole(i, 5)) === i for i ∈ {0..4}', () => {
  for (const i of [0, 1, 2, 3, 4]) {
    const p = progressForRole(i, 5);
    const c = continuousIndex(p, 5);
    assert.equal(activeIndexFromContinuous(c, 5), i, `keyboard target for entry ${i} lands on entry ${i}`);
  }
  approx(reducedMotionAngle(0, 5), 180, 'i=0 frozen at the focal point (n=5)');
  approx(reducedMotionAngle(4, 5), 90, 'i=4 frozen at the bottom end (n=5)');
  assert.equal(reducedMotionEmphasis(2, 2, 5).scale, 1, 'RM scale pinned to 1 at n=5');
  approx(reducedMotionEmphasis(4, 0, 5).opacity, 0.65, 'farthest RM opacity unchanged at n=5');
  assert.deepEqual(contentLayer(2, 2, false), { opacity: 1, translateY: 0, visible: true }, 'active layer at n=5');
  assert.deepEqual(contentLayer(0, 5, false), { opacity: 0, translateY: -28, visible: false }, 'far offset clamps at n=5 too (d=−5 exits upward to the −28 clamp)');
});

test('W-4 over the education durations: 24/30 chars × 6px ≤ 196 − 16 — both real durations fit the md inner width', () => {
  const msc = data.education.find((e) => e.degree.startsWith('Master of Science')).duration;
  const beng = data.education.find((e) => e.degree.startsWith('Bachelor')).duration;
  assert.equal(msc.length, 24, 'premise: the MSc duration is 24 chars');
  assert.equal(beng.length, 30, 'premise: the BEng duration is 30 chars');
  assert.equal(dateLineFits(msc, 196), true, '144 ≤ 180 — fits');
  assert.equal(dateLineFits(beng, 196), true, '180 ≤ 180 — fits');
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
  const techCompanies = new Set(
    geometry
      .selectTimelineEntries(data.experience, data.education)
      .filter((t) => t.type === 'role')
      .map((t) => t.entry.company),
  );
  for (const e of nonTech) {
    assert.equal(techCompanies.has(e.company), false, `"${e.company}" excluded by the isTechRelated filter`);
  }
});

test('E-1 zero-entry totality: selectTimelineEntries on empty / all-non-tech / no-featured input → [] (no invented entries)', () => {
  assert.deepEqual(geometry.selectTimelineEntries([], []), [], 'empty input → empty entries');
  assert.deepEqual(
    geometry.selectTimelineEntries(data.experience.filter((e) => !e.isTechRelated), []),
    [],
    'all-non-tech experience + no education input → empty entries',
  );
  assert.deepEqual(
    geometry.selectTimelineEntries([], data.education.filter((e) => !e.featured)),
    [],
    'no experience + all-unfeatured education input → empty entries',
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