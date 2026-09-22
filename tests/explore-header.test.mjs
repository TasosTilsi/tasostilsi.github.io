/**
 * Layer-2 header suite — plan EXPLORE-05-explore-routing-02 (EXPLORE-05b +
 * EXPLORE-06; D-03, D-04, OQ-6, OQ-8).
 *
 * Runner: node --test tests/explore-header.test.mjs  (Node built-in, zero npm
 * deps). There is NO `test` npm script and CI runs Node 20, while the direct
 * .ts import below relies on Node's native type stripping (needs Node >= 23.6),
 * so this suite is local-only (verified on Node v24.16.0).
 *
 * Red-first discipline (type: tdd plan): Task 1 committed this suite BEFORE
 * any header edit. On the untouched header the Terminal-link contract (link
 * presence, ghost recipe ×4, placement) and the four-control cluster count
 * were observed RED; the regression guards (truncator, px-not-rem,
 * pre-existing controls, finish card) were green by design — they pin what
 * must NOT change.
 *
 * Scope: source invariants over src/components/explore/explore-header.tsx
 * plus the finish-card constant. Export-level (out/explore.html) checks for
 * this link belong to plan 03, which owns the wave's single build point.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EXPLORE_TOUR_FINISH } from '../src/components/explore/constants.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const headerPath = 'src/components/explore/explore-header.tsx';
const headerSrc = () => read(headerPath);

// House comment-strip pattern (mirrors tests/explore-tour.test.mjs:342-345):
// prose comments must never trip an absence assert.
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// The ghost recipe shared VERBATIM by every 44px control in the right cluster
// (explore-header.tsx Tour/theme/drawer buttons pre-change; the house pattern
// is byte-identical duplication, NOT a shared const — explore-tour.tsx:60-61).
const GHOST_44 =
  'flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

test('header file exists before the contract runs', () => {
  assert.ok(existsSync(join(root, headerPath)), 'explore-header.tsx missing');
});

test('D-03 Terminal link: aria-label, lucide Terminal, Next Link to / — same tab', () => {
  const src = headerSrc();
  assert.ok(
    src.includes('aria-label="Open the terminal"'),
    'accessible name "Open the terminal" (D-03)',
  );
  assert.ok(
    /import\s+\{[^}]*\bTerminal\b[^}]*\}\s+from\s+['"]lucide-react['"]/.test(src),
    'Terminal icon imported from lucide-react (D-03)',
  );
  assert.ok(
    /<Link\b[^>]*?href="\/"/.test(src),
    'a Next <Link href="/"> routes back to the CLI (D-03)',
  );
  assert.ok(
    !stripComments(src).includes('target='),
    'zero target attributes — same-tab lock (D-01/D-02/D-03)',
  );
});

test('ghost recipe ×4: Tour, theme, drawer Menu, Terminal — byte-identical duplication', () => {
  const src = headerSrc();
  assert.equal(
    src.split(GHOST_44).length - 1,
    4,
    'the exact ghost class string appears 4 times (Tour, theme, drawer Menu, + the new Terminal link)',
  );
  assert.equal(
    (src.match(/h-\[44px\] w-\[44px\]/g) || []).length,
    4,
    'h-[44px] w-[44px] occurs exactly 4 times — the equivalence the plan pins',
  );
});

test('placement: the Terminal link is the LAST header child — rightmost (D-03, OQ-8)', () => {
  const src = headerSrc();
  const linkIdx = src.indexOf('<Link');
  // lastIndexOf('<ExploreDrawer') is deliberate: the bare string also matches
  // the import and the doc comment, which would make an indexOf comparison vacuous.
  const drawerIdx = src.lastIndexOf('<ExploreDrawer');
  const drawerBtnIdx = src.indexOf('Open section navigation');
  assert.ok(linkIdx > -1, 'a <Link exists');
  assert.ok(drawerIdx > -1, 'the ExploreDrawer element exists');
  assert.ok(
    linkIdx > drawerIdx,
    'the Terminal link sits AFTER the ExploreDrawer element — last header child',
  );
  assert.ok(
    linkIdx > drawerBtnIdx,
    'rightmost of the right cluster — after the drawer Menu button (Tour → theme → drawer → Terminal)',
  );
});

test('375px right-cluster math: FOUR 44px controls fit, computed from source values (D-04, OQ-6)', () => {
  const src = headerSrc();
  // Source-derived terms — drift in the header breaks these first:
  assert.ok(
    src.includes('px-4') && src.includes('gap-2'),
    'header bar carries px-4 padding and gap-2 child gaps (:36)',
  );
  assert.equal(
    (src.match(/h-2\.5 w-2\.5/g) || []).length,
    3,
    'three glyph dots h-2.5 w-2.5 (:39-50)',
  );
  const controls = (src.match(/h-\[44px\] w-\[44px\]/g) || []).length;
  assert.equal(
    controls,
    4,
    'FOUR 44px controls — Tour, theme, drawer, Terminal (OQ-6: the SPEC names three; the drawer Menu button is the pre-existing third — counting three would make the fit claim lie)',
  );

  // Every rem-based term evaluates at the 375px root: @media (max-width: 640px)
  // sets html { font-size: 14px } (src/app/globals.css:464-466) — a 375px
  // viewport sees the 14px root, NOT the 16px desktop root. The 44px targets
  // are px literals (h-[44px] w-[44px]) and are exact at any root — the
  // rem-shrink hazard D-04 actually guards. Below 640px the rem terms shrink
  // further while the px targets cannot.
  const ROOT = 14; // px at ≤640px viewport (globals.css:466)
  const rem = (n) => n * ROOT;
  const headerPadding = rem(1) * 2; // px-4, both sides = 28px
  const glyphDots = 3 * rem(0.625); // 3 × h-2.5 = 26.25px
  const glyphGaps = 2 * rem(0.5); // glyphs container gap-2 × 2 = 14px
  const cluster = controls * 44; // 4 × 44px px literals = 176px
  const childGaps = 5 * rem(0.5); // 6 visible children at 375px (desktop title is hidden md:inline) → 5 × gap-2 = 35px
  const fixed = headerPadding + glyphDots + glyphGaps + cluster + childGaps;
  assert.ok(
    Math.abs(fixed - 279.25) < 1e-9,
    `arithmetic pins the fixed width at 279.25px (computed ${fixed})`,
  );
  assert.ok(
    fixed <= 375,
    '279.25px ≤ 375px — the cluster fits 375px with ≥95px left for the truncating title',
  );
});

test('title-only truncator: exactly two truncate spans, both min-w-0 flex-1 (D-04, OQ-6)', () => {
  const truncating = headerSrc()
    .split('\n')
    .filter((line) => line.includes('truncate'));
  assert.equal(
    truncating.length,
    2,
    'exactly two truncating elements — the mobile and desktop title spans (:53/:56)',
  );
  for (const line of truncating) {
    assert.ok(
      line.includes('min-w-0 flex-1'),
      'every truncating span keeps min-w-0 flex-1 — the title stays the ONLY truncator',
    );
  }
});

test('px-not-rem guard: 44px stays a px literal, no h-11 shorthand (globals.css:464-466 trap)', () => {
  const src = headerSrc();
  assert.ok(src.includes('h-[44px]'), 'h-[44px] px literal present');
  assert.ok(
    !src.includes('h-11'),
    'no rem-based h-11 shorthand — the ≤640px 14px root must never shrink the 44px targets (explore-header.tsx doc block)',
  );
});

test('pre-existing controls intact: Tour trigger id, drawer + theme labels (D-05)', () => {
  const src = headerSrc();
  assert.ok(src.includes('id="explore-tour-trigger"'), 'Tour trigger id preserved (:64)');
  assert.ok(
    src.includes('aria-label="Open section navigation"'),
    'drawer Menu label preserved (:93)',
  );
  assert.ok(
    src.includes("'Switch to light theme'") && src.includes("'Switch to dark theme'"),
    'theme toggle labels preserved (:76-78)',
  );
  const tourIdx = src.indexOf('Start the guided tour');
  const themeIdx = src.indexOf('Switch to light theme');
  const drawerIdx = src.indexOf('Open section navigation');
  assert.ok(
    tourIdx > -1 && tourIdx < themeIdx && themeIdx < drawerIdx,
    'Tour → theme → drawer source order preserved (phase-1 pin)',
  );
});

test('finish-card regression guard: EXPLORE_TOUR_FINISH.linkHref stays "/" (D-03 unchanged clause)', () => {
  assert.equal(
    EXPLORE_TOUR_FINISH.linkHref,
    '/',
    'the wizard finish card still links the CLI at / (src/components/explore/constants.ts:92)',
  );
  assert.equal(
    EXPLORE_TOUR_FINISH.linkLabel,
    'Open the terminal →',
    'finish-card link label unchanged (phase-4 surface, not modified by this plan)',
  );
});