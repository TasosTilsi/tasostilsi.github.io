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
    },
    'chip accent map duplicated from explore-panels.tsx — 4 sections after the merge (REV-04/D-05)',
  );
});

test('step table: locked 6-entry sequence welcome → … → finish, no contact (REV-04/D-05, UI-SPEC §3)', () => {
  assert.equal(EXPLORE_TOUR_STEPS.length, 6, 'dots count = 6 — counter derives from this length');
  assert.deepEqual(
    EXPLORE_TOUR_STEPS.map((s) => s.id),
    ['welcome', 'about', 'experience', 'skills', 'projects', 'finish'],
    'locked id sequence after the merge (no contact step)',
  );
  const content = EXPLORE_TOUR_STEPS.slice(1, 5);
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
      'content announce strings derived from EXPLORE_SECTIONS labels (§9 "Step N of M — …")',
    );
  });
  assert.equal(EXPLORE_TOUR_STEPS[0].sectionId, null, 'welcome is a no-target step');
  assert.equal(EXPLORE_TOUR_STEPS[0].heading, 'explore --tour', 'welcome chrome heading (§4)');
  assert.equal(EXPLORE_TOUR_STEPS[0].announce, 'welcome', 'welcome SR announce (§9)');
  assert.equal(EXPLORE_TOUR_STEPS[5].sectionId, null, 'finish is a no-target step');
  assert.equal(EXPLORE_TOUR_STEPS[5].heading, 'tour complete', 'finish chrome heading (§4)');
  assert.equal(EXPLORE_TOUR_STEPS[5].announce, 'tour complete', 'finish SR announce (§9)');
});

test('step counter: fully derived — no hardcoded "of 7" anywhere in the tour (OQ-9/E-14)', () => {
  const src = read('src/components/explore/explore-tour.tsx');
  assert.ok(
    !src.includes('of 7'),
    'the sr-only "Step N of 7" literal is gone — both counters derive from EXPLORE_TOUR_STEPS.length',
  );
  assert.ok(
    (src.match(/EXPLORE_TOUR_STEPS\.length/g) || []).length >= 2,
    'both step counters (sr-only + visible) derive from EXPLORE_TOUR_STEPS.length',
  );
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
  assert.equal(EXPLORE_TOUR_STEPS[5].body, EXPLORE_TOUR_FINISH.congrats, 'finish body = congrats');
});

test('tour step bodies: no chart machinery mention in the source literal (REV-08/U-10, UI-SPEC §10.2)', () => {
  // EXPLORE_TOUR_STEP_BODIES is module-private (not exported), so the
  // assertion reads the SOURCE per the established source-grep convention:
  // extract the array literal and ban the "chart" substring inside it.
  const src = read('src/components/explore/constants.ts');
  const block = src.match(/const EXPLORE_TOUR_STEP_BODIES = \[([\s\S]*?)\] as const;/);
  assert.ok(block, 'the module-private step-body literal is present in the source');
  assert.ok(
    !/chart/i.test(block[1]),
    'no "chart" substring in any step body — the dangling career-span reference is rewritten (U-10)',
  );
  assert.ok(
    block[1].includes('shape of the career as a timeline'),
    'the experience step body carries the replacement copy (UI-SPEC §2.1)',
  );
});

test('welcome copy: the lap covers FOUR sections after the merge (D-05/OQ-9)', () => {
  const welcome = EXPLORE_TOUR_STEPS[0].body;
  assert.ok(
    welcome.includes('four sections'),
    'welcome body says "four sections" (REV-04)',
  );
  assert.ok(
    !welcome.includes('five sections'),
    'the stale "five sections" copy is gone',
  );
});

test('step bodies: merged-panel about copy live, skills copy renewed to the cards, projects intact (D-05/W-3a; plan 04 flipped the skills copy)', () => {
  const about = EXPLORE_TOUR_STEPS[1].body;
  assert.ok(
    about.includes('bio') && about.includes('contact channel') && about.includes('resume export'),
    'about step body describes the merged panel (bio + role + location + channels + resume export)',
  );
  assert.ok(
    EXPLORE_TOUR_STEPS[3].body.includes('Competency cards'),
    'skills step copy names the competency cards — plan 04 owns it atomically with the removal',
  );
  assert.ok(
    !EXPLORE_TOUR_STEPS[3].body.includes('treemap'),
    'no treemap copy survives in the skills step (D-06)',
  );
  assert.ok(
    EXPLORE_TOUR_STEPS[4].body.includes('projects'),
    'projects step copy untouched by plan 04',
  );
  for (const step of EXPLORE_TOUR_STEPS) {
    assert.ok(
      !step.body.includes('say hi back'),
      'the standalone-contact body sentence is gone — the contact step no longer exists',
    );
  }
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

const VALID_IDS = ['about', 'experience', 'skills', 'projects'];

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

test('parseVisitedIds: stale stored contact ids filter out after the merge (REV-04/OQ-9)', () => {
  assert.deepEqual(
    parseVisitedIds('["about","contact","skills"]', VALID_IDS),
    ['about', 'skills'],
    'a stored "contact" visited-id filters exactly like "bogus" once the section is gone',
  );
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

// ---------------------------------------------------------------------------
// Plan 02 Task 1: tracer — ExploreTour overlay/card/ESC/header contract
// (UI-SPEC §1/§4/§6/§7/§9/§10/§12 items 5/6/8/9)
// ---------------------------------------------------------------------------

const tourSrc = () => read('src/components/explore/explore-tour.tsx');

// House comment-strip pattern (mirrors tests/explore-shell.test.mjs:202-203):
// prose comments must never trip an absence assert.
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

test('tour overlay: fixed z-40 wrapper, pointer-events split, never portaled (§12.5)', () => {
  assert.ok(
    existsSync(join(root, 'src/components/explore/explore-tour.tsx')),
    'explore-tour.tsx missing — implement ExploreTour first',
  );
  const src = tourSrc();
  for (const needle of ['fixed inset-0', 'z-40', 'pointer-events-none', 'pointer-events-auto', 'data-tour-overlay']) {
    assert.ok(src.includes(needle), `overlay DOM contract: "${needle}" (§12.5)`);
  }
  assert.ok(!src.includes('createPortal'), 'the tour renders inside the shell root — NOT portaled (§12.5)');
});

test('tour dim fade: tour-dim-in keyframe at 150ms as a CSS animation — no transition on geometry (§10/§12.10)', () => {
  const src = tourSrc();
  assert.ok(src.includes('tour-dim-in'), 'the §10 open-fade keyframe is declared');
  assert.ok(src.includes('150ms'), 'fade duration 150ms (§10)');
  assert.ok(/@keyframes\s+tour-dim-in/.test(src), 'implemented as a CSS @keyframes animation (§12.10 permission)');
  assert.ok(
    !/transition/.test(stripComments(src)),
    'no transition anywhere — geometry repositioning is instant; the fade is an animation, not a transition',
  );
});

test('tour card: non-modal dialog semantics + focus contract (§9)', () => {
  const src = tourSrc();
  assert.ok(src.includes('role="dialog"'), 'card role="dialog"');
  assert.ok(src.includes('aria-modal="false"'), 'honest non-modal — the dim never makes the page inert (§9)');
  assert.ok(/tabIndex=\{\s*-1\s*\}/.test(src), 'card root tabIndex -1 (§9)');
  assert.ok(src.includes('.focus({ preventScroll: true })'), 'focus lands on the card without scrolling (§9/OQ-9)');
});

test('tour card controls: 44px real-px touch targets govern over h-11 shorthand (§9 over §4)', () => {
  const src = tourSrc();
  assert.ok(src.includes('h-[44px] w-[44px]'), 'X control is a 44px square (§9 ≥44px real-px pin)');
  assert.ok(
    (src.match(/h-\[44px\] px-3/g) || []).length >= 2,
    'Back AND Next are 44px-tall px-based ghosts (§9 governing over §4 h-11)',
  );
});

test('tour ESC: document-capture keydown + stopImmediatePropagation (§9/E-12, §12.9)', () => {
  const src = tourSrc();
  assert.ok(src.includes('{ capture: true }'), 'ESC keydown registered on document in capture phase (§9)');
  assert.ok(src.includes('stopImmediatePropagation'), 'one ESC press never double-dismisses tour + drawer (R-7)');
});

test('header: Tour → Theme → Drawer order, Compass icon, 44px px target (§12.8)', () => {
  const src = read('src/components/explore/explore-header.tsx');
  const tourIdx = src.indexOf('Start the guided tour');
  const themeIdx = src.indexOf('Switch to light theme');
  const drawerIdx = src.indexOf('Open section navigation');
  assert.ok(tourIdx > -1, 'Tour button present');
  assert.ok(themeIdx > -1 && drawerIdx > -1, 'existing theme/drawer pair untouched');
  assert.ok(
    tourIdx < themeIdx && themeIdx < drawerIdx,
    'Tour leftmost, Theme middle, Drawer RIGHTMOST — phase-1 pin preserved (§12.8)',
  );
  assert.ok(src.includes('Compass'), 'lucide Compass icon (§5)');
  assert.ok(src.includes('h-[44px]'), '44px px-based Tour touch target (§5)');
});

test('export: Tour button SSRs into out/explore.html, tour overlay does not (§12.6)', () => {
  const exportHtmlPath = join(root, 'out/explore.html');
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  const html = readFileSync(exportHtmlPath, 'utf8');
  assert.ok(
    html.includes('aria-label="Start the guided tour"'),
    'the header Tour button is a client-boundary child and SSRs (§12.6)',
  );
  assert.ok(
    !html.includes('data-tour-overlay'),
    'the overlay is client-mount-only — absent from static HTML (§12.6, R-5)',
  );
});

// ---------------------------------------------------------------------------
// Plan 02 Task 2: content-step spotlight — settle, cut-out hole, re-measure
// (UI-SPEC §1/§2/§3 as amended by R-10, §10, §11 E-4/E-5/E-6, §12 items 5/10)
// ---------------------------------------------------------------------------

test('spotlight settle: scrollend + 700ms fallback + double-rAF + reduced-motion branch (§2, W-1/W-2)', () => {
  const src = tourSrc();
  for (const needle of ['scrollend', '700', 'requestAnimationFrame', 'prefers-reduced-motion', 'matchMedia', 'getBoundingClientRect']) {
    assert.ok(src.includes(needle), `settle/measurement contract: "${needle}"`);
  }
  assert.equal(
    (src.match(/scrollIntoView/g) || []).length,
    1,
    'the programmatic scroll fires on step activation ONLY — W-3 re-measure is measure-only (§2)',
  );
});

test('spotlight hole: 12px-inflated cut-out paints the dim via the 100vmax box-shadow (D-01 as amended by R-1)', () => {
  const src = tourSrc();
  assert.ok(
    src.includes("boxShadow: '0 0 0 100vmax rgba(0,0,0,0.7)'"),
    'the hole paints the dim via box-shadow with the 100vmax spread (R-1)',
  );
  assert.ok(!src.includes('100vw'), 'the under-covering viewport-width spread is gone (R-1 amendment)');
  assert.ok(src.includes('- 12') && src.includes('+ 24'), '12px inflation on all sides (§1)');
  const holeIdx = src.indexOf('data-tour-hole');
  assert.ok(holeIdx > -1, 'the cut-out hole element exists');
  assert.ok(
    holeIdx < src.indexOf('role="dialog"'),
    'the hole renders BEFORE the card (W-4: the card paints last, above the dim)',
  );
  const holeBlock = src.slice(holeIdx, src.indexOf('role="dialog"'));
  assert.ok(holeBlock.includes('rounded-md'), 'hole is rounded-md (§1)');
  assert.ok(
    holeBlock.includes('tour-dim-in 150ms ease-out'),
    'the hole carries the §10 fade — its box-shadow IS the content-step dim',
  );
  assert.ok(
    !holeBlock.includes('key='),
    'the hole occupies ONE persistent JSX slot with NO React key (§10 no-remount pin)',
  );
  assert.equal(
    (src.match(/tour-dim-in 150ms ease-out/g) || []).length,
    2,
    'BOTH dim-painters (hole + plain dim) carry the §10 fade; the keyframes are declared once',
  );
});

test('spotlight re-measure: resize + orientationchange rAF-coalesced, card measured from the element (§2, E-1)', () => {
  const src = tourSrc();
  assert.ok(src.includes('orientationchange'), 'orientationchange re-measure trigger (E-1)');
  assert.ok(src.includes('offsetHeight') && src.includes('offsetWidth'), 'card size measured from the rendered element (§2)');
});

test('spotlight placement: placeCard is the single geometry authority (D-03, plan-01 export)', () => {
  const src = tourSrc();
  assert.ok(src.includes('placeCard'), 'card geometry comes from the pure placement module');
  assert.ok(src.includes('aria-hidden="true"'), 'hole/dim hidden from assistive tech (§9)');
});

// ---------------------------------------------------------------------------
// Plan 02 Task 3: auto-open + LIVE status-bar counter (§5/§7, §12 items 6/7)
// ---------------------------------------------------------------------------

test('tour auto-open: 800ms delayed, cancelled by pointerdown/keydown, suppressed by any flag (§7, E-8)', () => {
  const src = tourSrc();
  assert.ok(src.includes('readTourFlag'), 'the auto-open check reads the flag via the data-tier accessor (E-8)');
  assert.ok(src.includes('800'), '800ms delay (U-3 default)');
  assert.ok(
    src.includes('pointerdown') && src.includes('keydown'),
    'pointer/keyboard activity cancels the pending auto-open (§7)',
  );
  assert.ok(
    !stripComments(src).includes('setInterval'),
    'manual pacing only — no timers beyond the one-shot auto-open (D-03)',
  );
});

test('status bar: LIVE N/4 counter fed by visitedCount, accent at 4/4 (§5, §12.7)', () => {
  const src = read('src/components/explore/explore-status-bar.tsx');
  assert.ok(src.includes('visitedCount'), 'visitedCount prop flows in (§5)');
  assert.ok(
    src.includes('${visitedCount}/${EXPLORE_SECTIONS.length} sections visited'),
    'live template string derives from EXPLORE_SECTIONS.length (§5)',
  );
  assert.ok(src.includes('text-accent'), '4/4 celebration accent (E-13)');
  assert.ok(src.includes('aria-live="polite"'), 'existing live region untouched (§5)');
});

test('shell: single visited instance lifted, tour composed as LAST child (OQ-7, W-4)', () => {
  const src = read('src/components/explore/explore-shell.tsx');
  assert.ok(src.includes('useExploreVisited()'), 'single visited instance owned by the shell');
  assert.ok(src.includes('visitedCount={visitedCount}'), 'visitedCount flows to the status bar (§5)');
  const statusIdx = src.indexOf('<ExploreStatusBar');
  const tourIdx = src.indexOf('<ExploreTour');
  assert.ok(
    statusIdx > -1 && tourIdx > statusIdx,
    'ExploreTour renders after the status bar — LAST child of the shell root (W-4)',
  );
  assert.ok(src.includes('onOpenTour'), 'the header Tour trigger is wired (D-05)');
});

test('export: literal-0 SSR counter + Tour button survive, overlay still absent (§12.6/§12.7)', () => {
  const exportHtmlPath = join(root, 'out/explore.html');
  assert.ok(existsSync(exportHtmlPath), 'out/explore.html missing — run `npm run build` first');
  const html = readFileSync(exportHtmlPath, 'utf8');
  assert.ok(
    html.includes('0/4 sections visited'),
    'SSR renders the literal-0 initial state over 4 sections — hydration syncs after mount (§12.6, R-5; REV-04)',
  );
  assert.ok(html.includes('aria-label="Start the guided tour"'), 'Tour button SSRs (§12.6)');
  assert.ok(!html.includes('data-tour-overlay'), 'overlay still client-mount-only (§12.6)');
});
