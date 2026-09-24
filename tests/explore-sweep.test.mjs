/**
 * Phase 05 plan 03 — EXPLORE-06 breakpoint sweep.
 *
 * Runner: node --test tests/explore-sweep.test.mjs  (Node built-in, zero npm deps)
 *
 * Implements the Type-P (programmatic/static) sweep rows not owned by the
 * plan-01/02 suites, plus — appended in Task 2 — the Type-E export-level rows
 * and the two-way routing loop composite.
 *
 * Every test comments its sweep row id from
 * .planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md
 * (D-04). Taxonomy: P = programmatic/static source or arithmetic check;
 * E = export-level check after `npm run build`; M rows live only in the
 * SWEEP table (manual — user final pass).
 *
 * Disposition rule (RESEARCH OQ-5): a P row failing on a phase surface
 * (WelcomeMessage.tsx / explore-header.tsx / explore-shell.tsx /
 * (main)/layout.tsx) is a `fixed` defect — red-first fix; a P row failing on
 * panels/visualizations/wizard or other non-phase surfaces is `deferred`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// Read-only import from the explore constants module — house precedent
// (tests/explore-header.test.mjs:27, tests/explore-routing.test.mjs:38)
import { EXPLORE_TOUR_FINISH } from '../src/components/explore/constants.ts';
// The phase-9 ONE derivation site — the E-6 expectation derives entry 1 from
// the real JSON THROUGH the pure module (zero copied literals).
import { selectTimelineEntries } from '../src/components/explore/timeline-geometry.ts';

// ---------------------------------------------------------------------------
// Type-P structural rows (Task 1)
// ---------------------------------------------------------------------------

test('sweep rows EXPLORE@375/768/1440/1920 (P): panels grid 1→2 cols with the phase-8 placement whitelist (REV-04 + EXPLORE-08 D-01)', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  assert.ok(
    src.includes('grid grid-cols-1 gap-4 md:grid-cols-2'),
    'grid classes (explore-panels.tsx) — 1 col base (375), 2 cols at md AND lg (768/1440/1920)',
  );
  assert.ok(
    !src.includes('lg:grid-cols-3'),
    'lg tier drops from 3 to 2 columns (D-04) — no lg:grid-cols-3 anywhere',
  );
  // placement whitelist (UI-SPEC §1.1/§13, phase-9 D-01 reflow): [About+Contact |
  // Skills] / [Experience full-width] / [Projects full-width] — zero empty cells.
  assert.equal(
    (src.match(/md:col-span-2/g) || []).length,
    2,
    'exactly two span-2 grid children — experience wrapper + projects shell (D-01)',
  );
  assert.equal(
    (src.match(/md:order-first/g) || []).length,
    0,
    'zero order-first placements — the array reorder makes DOM order = visual order; the speech-order caveat retires (UI-SPEC §8)',
  );
  assert.ok(!/max-w-/.test(src), 'no max-width wrapper — full-bleed at 1920 (row EXPLORE@1920)');
});

test('sweep rows EXPLORE@* (P): 3-row rebalance structure — order locked, spans whitelisted, stage pinned (EXPLORE-09 D-01 reflow)', () => {
  const constants = read('src/components/explore/constants.ts');
  const sectionsBlock = constants.slice(
    constants.indexOf('EXPLORE_SECTIONS = ['),
    constants.indexOf('] as const'),
  );
  const sections = [...sectionsBlock.matchAll(/id: "([a-z]+)"/g)].map((m) => m[1]);
  assert.deepEqual(
    sections,
    ['about', 'skills', 'experience', 'projects'],
    'exactly 4 section ids in EXPLORE_SECTIONS — phase-9 reflow order LOCKED (D-01: About leads row 1; drawer/chips/stagger derive from it)',
  );
  const src = read('src/components/explore/explore-panels.tsx');
  assert.ok(
    src.includes('md:grid-cols-2'),
    '2 columns from md up (768/1440/1920) — rows: [About|Skills] / [EXP full-width] / [Projects full-width]',
  );
  assert.equal(
    (src.match(/md:col-span-2/g) || []).length,
    2,
    'exactly two span-2 grid children — zero empty cells re-derived over the 3-row md+ grid',
  );
  assert.equal(
    (src.match(/md:order-first/g) || []).length,
    0,
    'zero order-first placements — the reflow reorders the array so DOM order IS visual order (UI-SPEC §8)',
  );
  assert.ok(
    src.includes('md:sticky md:top-0'),
    'the experience stage pins via the sticky classes (D-02 sticky-range mechanism)',
  );
});

test('sweep row EXPLORE@375 (P): every new placement/height utility is md-scoped — 375px stacks 1-col (R-9)', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  const offsetsOf = (src, token) => {
    const out = [];
    let idx = src.indexOf(token);
    while (idx !== -1) {
      out.push(idx);
      idx = src.indexOf(token, idx + 1);
    }
    return out;
  };
  for (const token of ['col-span', 'h-[300vh]', 'h-[calc(100dvh-10rem)]']) {
    const offsets = offsetsOf(src, token);
    assert.ok(offsets.length > 0, `${token} present in the placement map`);
    for (const idx of offsets) {
      assert.ok(
        src.slice(Math.max(0, idx - 3), idx) === 'md:',
        `every ${token} occurrence is md:-prefixed (R-9: base stays 1-col at 375px)`,
      );
    }
  }
});

test('sweep rows EXPLORE@* (P): sticky-breaker audit — no overflow utility on the panels grid (UI-SPEC §1.1)', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  assert.ok(
    !src.includes('overflow-'),
    'no overflow-* class on the wrapper/stage/grid chain — position:sticky keeps attaching to the <main> scrollport (§1.1 audit)',
  );
});

test('sweep row EXPLORE@375 (P): grid-cols-1 base class present — single-column stack at 375px (REV-04)', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  assert.ok(
    src.includes('grid grid-cols-1 gap-4 md:grid-cols-2'),
    'base grid-cols-1 before the md: modifier — 4 panels stack at 375px, zero empty cells',
  );
});

test('sweep rows EXPLORE@375-1920 (P): .explore-shell overflow-x-hidden — zero horizontal scroll is structural', () => {
  const src = read('src/components/explore/explore-shell.tsx');
  assert.match(
    src,
    /className="explore-shell flex h-dvh flex-col overflow-x-hidden/,
    'shell root (explore-shell.tsx:58) — overflow-x-hidden makes horizontal scroll structurally impossible on /explore',
  );
  assert.ok(src.includes('overflow-y-auto'), 'main is the single vertical scroll container');
  assert.ok(!/overflow-x-auto/.test(src), 'no horizontal scroll container anywhere in the shell');
});

test('sweep rows CLI@375/768/1440/1920 (P): (main) layout overflow invariants + pre-wrapped output', () => {
  const layout = read('src/app/(main)/layout.tsx');
  assert.ok(
    layout.includes('overflow-hidden'),
    'wrapper overflow-hidden ((main)/layout.tsx:16) — the CLI frame never overflows its own box',
  );
  assert.ok(
    layout.includes('overflow-auto'),
    'main overflow-auto ((main)/layout.tsx:19) — scrolling lives inside main, vertical-capable',
  );
  const ti = read('src/components/cli/TerminalInterface.tsx');
  assert.ok(
    ti.includes('whitespace-pre-wrap'),
    'output lines pre-wrap (TerminalInterface.tsx:568) — long lines wrap instead of forcing horizontal scroll',
  );
});

test('sweep row CLI@375 (P): welcome link line fit arithmetic — 30 chars ≤ 42 bound, fits 359px', () => {
  const src = read('src/components/cli/outputs/WelcomeMessage.tsx');
  // isolate the link-line block: from the D-01 comment to the trailing <br />
  const start = src.indexOf('Visual tour link');
  const end = src.indexOf('<br />', start);
  assert.ok(start > -1 && end > start, 'link-line block located between its comment and <br />');
  const block = src.slice(start, end);
  assert.ok(block.includes('<Link href="/explore"'), 'the token `explore` is the clickable link (D-01)');
  // rendered text = the JSX text nodes: the block starts INSIDE the JSX comment
  // (the anchor is its text), so strip through the comment's closing */, then the
  // style object, then the tags
  const text = block
    .replace(/^[\s\S]*?\*\/\}\s*/, '')
    .replace(/style=\{\{[\s\S]*?\}\}/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  assert.equal(text, '[ NEW → visual tour: explore ]', 'locked rendered line, format pinned verbatim (D-01)');
  const chars = text.length;
  assert.ok(chars <= 42, `rendered line ${chars} chars ≤ 42 bound (sweep row CLI@375)`);
  // geometry: inherited text-sm mono ≈ 8.5px/char → 30 × 8.5 = 255px; content width at
  // 375px = 375 − 2×8px (terminal container p-2, TerminalInterface.tsx:537) = 359px
  const estPx = chars * 8.5;
  assert.ok(estPx <= 359, `estimated ${estPx}px ≤ 359px content width at 375px (p-2 mobile padding)`);
  // no size-class override on the line — it inherits text-sm md:text-base from the
  // history-row wrapper (TerminalInterface.tsx:554); text-accent is a color, not a size
  assert.ok(
    !/\btext-(xs|sm|base|lg|xl|2xl)\b/.test(block),
    'no size-class override on the link line — inherited sizing only (RESEARCH §1.9)',
  );
});

test('sweep rows EXPLORE@* (P): status bar height/type tokens — four independent tokens', () => {
  const src = read('src/components/explore/explore-status-bar.tsx');
  // footer class string interleaves other tokens (explore-status-bar.tsx:34) — each token
  // asserted independently; NO contiguous token PAIR is asserted as a substring. If this
  // row ever fails, the status bar sits outside this phase's editable surfaces → the
  // sweep table records disposition `deferred` (OQ-5).
  for (const token of ['h-7', 'sm:h-8', 'text-[10px]', 'sm:text-xs']) {
    assert.ok(src.includes(token), `status bar token ${token} present (:34)`);
  }
});

test('sweep row EXPLORE@375 (P): intro strip min-height reserves the two-line wrap', () => {
  const src = read('src/components/explore/explore-intro.tsx');
  assert.ok(
    src.includes('min-h-[60px]'),
    'min-h-[60px] (explore-intro.tsx:42) — 3 lines × text-sm (20px/line) at 375px for the ~91-char refreshed intro, by design (B-6)',
  );
  assert.ok(src.includes('md:min-h-[20px]'), 'md:min-h-[20px] (:42) — single line from 768px up');
  assert.ok(src.includes('shrink-0'), 'strip is shrink-0 chrome outside the scroll container');
});

test('sweep rows CLI@375 vs CLI≥768 (P): mobile banner at 375, ASCII banner from sm up', () => {
  const src = read('src/components/cli/outputs/WelcomeMessage.tsx');
  assert.ok(
    src.includes('hidden sm:block'),
    'ASCII banner <pre> hidden below 640px (:28) — row CLI@375 renders the mobile banner instead',
  );
  assert.ok(
    src.includes('sm:hidden'),
    'mobile banner div renders only below 640px (:39) — row CLI@375',
  );
});

// ---------------------------------------------------------------------------
// Type-E export rows (Task 2 — require `npm run build` first; the wave's
// single build point). Precedents: tests/explore-shell.test.mjs:378-433
// (export existence + markers), tests/explore-visuals.test.mjs:622-625
// (dependency-count pin).
// ---------------------------------------------------------------------------

test('sweep E-1 (E): all three routes still export statically', () => {
  for (const route of ['out/index.html', 'out/explore.html', 'out/resume.html']) {
    assert.ok(existsSync(join(root, route)), `${route} missing — run \`npm run build\` first`);
  }
});

test('sweep E-2 (E): header Terminal link SSRs into out/explore.html — /explore → CLI leg at L3', () => {
  const html = read('out/explore.html');
  assert.ok(
    html.includes('aria-label="Open the terminal"'),
    'Terminal-link aria-label present in the exported HTML (explore-header.tsx SSRs)',
  );
  assert.ok(html.includes('href="/"'), 'the link target / present in the exported HTML');
});

test('sweep E-3 (E): CLI welcome is client-only — documents why the welcome link + command stay L2-only', () => {
  const html = read('out/index.html');
  assert.ok(
    !html.includes('System initialized'),
    'no SSR\'d CLI welcome content in out/index.html (RESEARCH §1.7 — TerminalInterface mounts ssr:false)',
  );
});

test('sweep E-4 (E): recharts removed — package.json dependencies length stays 38+1 (D-05, plan 04 OQ-2)', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(
    Object.keys(pkg.dependencies).length,
    39,
    'dependency count pinned at 39 (precedent tests/explore-visuals.test.mjs:624) — +1 framer-motion, adopted as a real dependency for phase-9 editorial compositions after the engine decision',
  );
  assert.equal(
    pkg.dependencies.recharts,
    undefined,
    'no recharts key remains — the gate proves zero remaining usages (OQ-2)',
  );
});

test('sweep E-5: two-way routing loop composite — all four legs in one assertion set', () => {
  // leg 1: CLI welcome link → /explore (plan 01, D-01)
  assert.ok(
    read('src/components/cli/outputs/WelcomeMessage.tsx').includes('href="/explore"'),
    'leg 1: welcome bracket link href="/explore"',
  );
  // leg 2: explore command → Next router, same tab (plan 01, D-02)
  const ti = read('src/components/cli/TerminalInterface.tsx');
  assert.ok(
    ti.includes('{ navigate: "/explore" }') && ti.includes('router.push(result.navigate)'),
    'leg 2: explore-command sentinel + router.push(result.navigate)',
  );
  assert.ok(!ti.includes('window.location'), 'leg 2 guard: no window.location in TerminalInterface');
  // leg 3: header Terminal link → / (plan 02, D-03)
  assert.ok(
    read('src/components/explore/explore-header.tsx').includes('href="/"'),
    'leg 3: header Terminal link href="/"',
  );
  // leg 4: tour finish card → / (phase 4, EXPLORE_TOUR_FINISH, constants.ts:89-94)
  assert.equal(EXPLORE_TOUR_FINISH.linkHref, '/', 'leg 4: finish-card linkHref === "/"');
});

// ---------------------------------------------------------------------------
// Phase EXPLORE-08 plan 03 — Type-E export rows for the timeline stage;
// renewed to the phase-9 5-entry contract (EXPLORE-09 plan 01, REV-16)
// (UI-SPEC §9/§4/§2.2; the §13 "SSR-export entry-1 grep"). The sweep
// convention holds: `npm run build` must precede the run — these rows read
// the built artifact. Expectations over entry 1's content are DATA-DERIVED
// from the real src/data/portfolio-main-data.json at test time THROUGH the
// pure derivation module (house precedent, explore-visuals.test.mjs
// header) — zero copied literals.
// ---------------------------------------------------------------------------

const portfolio = JSON.parse(read('src/data/portfolio-main-data.json'));

// React SSR serialization handling, per the explore-visuals export-row
// convention (entity decode) extended with the text-node separator drop:
// React inserts <!-- --> between adjacent text nodes, so a rendered
// "01 / 05" counter only matches after the separators are stripped.
const exportText = () =>
  read('out/explore.html')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<!-- -->/g, '');
const exportRaw = () => read('out/explore.html');

test('sweep E-6 (E, phase EXPLORE-09): entry 1 (first selectTimelineEntries result — BEng, education) renders real text in out/explore.html — data-derived (D-03/§9)', () => {
  assert.ok(existsSync(join(root, 'out/explore.html')), 'out/explore.html missing — run `npm run build` first');
  const html = exportText();
  // The FIRST merged entry (year-ascending — 2012, BEng education) is the
  // SSR-visible layer the export must carry (D-03 → D-07 static-text
  // contract). Every expectation is derived from the JSON THROUGH the pure
  // module at test time, never copied. Education renders degree >
  // institution > duration AS STORED — no location expectation, no bullet
  // expectation (the §3.3 education template omits both).
  const entries = selectTimelineEntries(portfolio.experience, portfolio.education);
  const first = entries[0];
  assert.ok(first, 'the merged derivation yields a first entry');
  assert.equal(first.type, 'education', 'entry 1 is the earliest dated entry — the BEng education record');
  assert.equal(first.year, '2012', 'entry 1 parses to 2012 (the BEng start year, data-derived)');
  for (const [field, value] of [
    ['degree', first.entry.degree],
    ['institution', first.entry.institution],
    ['duration AS STORED', first.entry.duration],
  ]) {
    assert.ok(
      html.includes(value),
      `entry-1 ${field} server-rendered as real text (derived from portfolio-main-data.json)`,
    );
  }
});

test('sweep E-7 (E, phase EXPLORE-09): layers 2-5 SSR visibility:hidden — layer 1 visible (§9)', () => {
  assert.ok(existsSync(join(root, 'out/explore.html')), 'out/explore.html missing — run `npm run build` first');
  const hidden = (exportRaw().match(/visibility:hidden/g) || []).length;
  assert.ok(
    hidden >= 4,
    `entries 2-5 carry SSR visibility:hidden — found ${hidden} ≥ 4 (5 entries, 1 visible; the §9 derivation evaluated at progress 0, no special-casing)`,
  );
});

test('sweep E-8 (E, phase EXPLORE-09): stage anatomy markers — group, controls, counter, arc path (§9/§4)', () => {
  assert.ok(existsSync(join(root, 'out/explore.html')), 'out/explore.html missing — run `npm run build` first');
  const html = exportText();
  assert.ok(html.includes('aria-label="Career timeline"'), 'the role="group" aria-label="Career timeline" renders (§10 landmark)');
  assert.ok(html.includes('Previous role'), 'the Prev control aria-label renders (§4 — the accessible non-scroll alternative)');
  assert.ok(html.includes('Next role'), 'the Next control aria-label renders (§4)');
  assert.ok(html.includes('01 / 05'), 'the control-row counter renders 01 / 05 (§4 — entry 1 active at SSR over the 5 merged entries)');
  assert.ok(
    html.includes('d="M 100 0 A 100 100 0 0 0 100 200"'),
    'the left-bulging C arc path renders via the fixed viewBox (§2.2 — server-rendered stroke, zero hydration shift)',
  );
});

test('sweep E-9 (E, phase EXPLORE-09): pre-JS markers render at inline opacity 0 — 5 dots + 5 labels unpositioned (§9)', () => {
  assert.ok(existsSync(join(root, 'out/explore.html')), 'out/explore.html missing — run `npm run build` first');
  const html = exportRaw();
  const opaque = (html.match(/opacity:0/g) || []).length;
  assert.ok(
    opaque >= 10,
    `inline opacity:0 elements ≥ 10 — found ${opaque} (5 marker dots + 5 marker labels, plus the 4 SSR-hidden content layers)`,
  );
  // The precise mechanism plan 02 specified: exactly the 5 dot spans and the
  // 5 year labels render at inline opacity:0 — present but unpositioned
  // until the first measured frame fades them in (§9 markers contract).
  assert.equal(
    (html.match(/data-timeline-dot="true"[^>]*style="opacity:0"/g) || []).length,
    5,
    'exactly 5 marker dots render at opacity:0 pre-measurement (§9)',
  );
  assert.equal(
    (html.match(/data-timeline-label="true"[^>]*style="opacity:0"/g) || []).length,
    5,
    'exactly 5 year labels render at opacity:0 pre-measurement (§9)',
  );
});