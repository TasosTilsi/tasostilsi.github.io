/**
 * Phase 05 plan 03 — EXPLORE-06 breakpoint sweep.
 *
 * Runner: node --test tests/explore-sweep.test.mjs  (Node built-in, zero npm deps)
 *
 * Implements the Type-P (programmatic/static) sweep rows not owned by the
 * plan-01/02 suites, plus — appended in Task 2 — the Type-E export-level rows
 * and the six-leg two-way routing composite.
 *
 * Every test comments its sweep row id from
 * .planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md
 * (D-04). Taxonomy: P = programmatic/static source or arithmetic check;
 * E = export-level check after `npm run build`; M rows live only in the
 * SWEEP table (manual — user final pass).
 *
 * Disposition rule (RESEARCH OQ-5): a P row failing on a phase surface
 * (WelcomeMessage.tsx / explore-header.tsx / explore-shell.tsx /
 * cli/layout.tsx) is a `fixed` defect — red-first fix; a P row failing on
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
import { EXPLORE_STATUS_CLI_LINK, EXPLORE_TOUR_FINISH } from '../src/components/explore/constants.ts';
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
  // placement whitelist (UI-SPEC §1.1/§13, phase-9 D-01 reflow + phase-11
  // REV-21 fifth panel): [About+Contact | Skills] / [Experience full-width] /
  // [Projects stack | Credentials] — zero empty cells.
  assert.equal(
    (src.match(/md:col-span-2/g) || []).length,
    1,
    'exactly one span-2 grid child — the experience wrapper only; projects returned to natural height (REV-18)',
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
    ['about', 'skills', 'experience', 'projects', 'credentials'],
    'exactly 5 section ids in EXPLORE_SECTIONS — phase-9 reflow order LOCKED (D-01: About leads row 1) + the phase-11 credentials append (REV-21: the row-3 sibling of the Projects stack)',
  );
  const src = read('src/components/explore/explore-panels.tsx');
  assert.ok(
    src.includes('md:grid-cols-2'),
    '2 columns from md up (768/1440/1920) — rows: [About|Skills] / [EXP full-width] / [Projects stack | Credentials]',
  );
  assert.equal(
    (src.match(/md:col-span-2/g) || []).length,
    1,
    'exactly one span-2 grid child — the experience wrapper only; projects is a natural-height panel (REV-18)',
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

// Phase 13 (REV-23) — the <md parity renewal. The rows above stay exactly as
// they were: `explore-panels.tsx` is deliberately untouched this phase (the
// 300vh sticky range stays md-only, UI-SPEC §1.2/§11), so the `md:`-prefix row
// at :100 keeps its bite. What the phase DOES change at 375px is the arc zone:
// the phase-8 `hidden md:flex` pin retires and the zone carries a base height.
test('sweep rows EXPLORE@375 (P): the arc zone renders at the base width — no hidden gate, base 200px box, base flex column', () => {
  const src = read('src/components/explore/sections/experience-section.tsx');
  assert.ok(
    !src.includes('hidden md:flex'),
    'no `hidden md:flex` — the phase-8 below-md hide pin on the arc zone is RETIRED (REV-23/D-01); the semicircle renders at every width',
  );
  assert.ok(
    src.includes('relative h-[200px] md:h-auto'),
    'the arc zone box carries the base h-[200px] (UI-SPEC §1.2/§2.1) before the md: grid stretch — the cos/sin geometry derives from this narrower measured box',
  );
  assert.ok(
    src.includes('flex flex-col gap-4 md:grid'),
    'the container keeps a base display mode (flex flex-col gap-4) before md:grid — without it `gap-4` is inert and the arc strip would butt against the content stack',
  );
  assert.ok(
    src.includes('aria-label="Previous role"') && src.includes('aria-label="Next role"'),
    'both arc controls live INSIDE the retired gate, so retiring it is what puts them on the phone (the "buttons missing" complaint, REV-23 §3.1e)',
  );
  assert.ok(
    src.includes('flex items-center gap-2 md:hidden'),
    'the compact-form year chip (`md:hidden`) survives — each of the five entries stays readable in the <md stacked layout',
  );
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
    'base grid-cols-1 before the md: modifier — 5 panels stack at 375px, zero empty cells',
  );
});

test('sweep rows EXPLORE@375-1920 (P): .explore-shell overflow-hidden — zero horizontal scroll is structural AND the shell paints no scrollbar', () => {
  const src = read('src/components/explore/explore-shell.tsx');
  // Comments stripped on purpose: the shell's own doc comment NAMES the retired
  // overflow-x-hidden form, so a raw-source negative assertion would be red on
  // prose rather than on the class list (house pattern, explore-shell.test.mjs:126).
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.match(
    code,
    /className="explore-shell flex h-dvh flex-col overflow-hidden /,
    'shell root (explore-shell.tsx:58) — overflow-hidden clips both axes, so horizontal scroll stays structurally impossible at 375px',
  );
  assert.ok(
    !/overflow-x-hidden/.test(code),
    'never overflow-x-hidden: the hidden axis computes the other as `auto` (CSS spec), which lets the h-dvh frame paint its OWN vertical scrollbar beside main',
  );
  assert.ok(code.includes('overflow-y-auto'), 'main is the single vertical scroll container');
  assert.ok(!/overflow-x-auto/.test(code), 'no horizontal scroll container anywhere in the shell');
  assert.equal(
    (code.match(/overflow-(?:y-)?(?:auto|scroll)/g) || []).length,
    1,
    'exactly ONE scroll container in the shell frame — <main>',
  );
});

test('sweep rows CLI@375/768/1440/1920 (P): cli layout overflow invariants + pre-wrapped output', () => {
  const layout = read('src/app/cli/layout.tsx');
  assert.ok(
    layout.includes('overflow-hidden'),
    'wrapper overflow-hidden (cli/layout.tsx:16) — the CLI frame never overflows its own box',
  );
  assert.ok(
    layout.includes('overflow-auto'),
    'main overflow-auto (cli/layout.tsx:19) — scrolling lives inside main, vertical-capable',
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
  assert.ok(block.includes('<Link href="/"'), 'the token `explore` is the clickable link, now targeting the landing / (D-03)');
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

test('sweep E-1 (E): the three live routes export statically, the deleted route does not (D-04)', () => {
  for (const route of ['out/index.html', 'out/cli.html', 'out/resume.html']) {
    assert.ok(existsSync(join(root, route)), `${route} missing — run \`npm run build\` first`);
  }
  // D-04 route-existence renewal: /explore is deleted outright — a static host
  // has no redirect machinery, so GitHub Pages answers the dead path with 404.html.
  assert.ok(
    !existsSync(join(root, 'out/explore.html')),
    'out/explore.html absent — the /explore route is deleted (D-01)',
  );
  assert.ok(
    !existsSync(join(root, 'out/explore.txt')),
    'out/explore.txt absent — the /explore RSC payload is deleted (D-01)',
  );
  // R-8 trailingSlash tripwire: next.config.ts leaves trailingSlash unset, so /cli
  // emits out/cli.html (the /resume precedent). If anyone ever flips it, href="/cli"
  // would silently 404 on GitHub Pages — this row fails loudly instead.
  assert.ok(
    !existsSync(join(root, 'out/cli/index.html')),
    'out/cli/index.html absent — trailingSlash is unset, so /cli emits cli.html (R-8)',
  );
});

test('sweep E-2 (E): header Terminal link SSRs into out/index.html — the landing → /cli leg at L3', () => {
  const html = read('out/index.html');
  assert.ok(
    html.includes('aria-label="Open the terminal"'),
    'Terminal-link aria-label present in the exported HTML (explore-header.tsx SSRs)',
  );
  assert.ok(html.includes('href="/cli"'), 'the link target /cli present in the exported HTML');
});

test('sweep E-3 (E): CLI welcome is client-only — documents why the welcome link + command stay L2-only', () => {
  const html = read('out/cli.html');
  assert.ok(
    !html.includes('System initialized'),
    'no SSR\'d CLI welcome content in out/cli.html (RESEARCH §1.7 — TerminalInterface mounts ssr:false)',
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

test('sweep E-5: two-way routing loop composite — all six legs in one assertion set', () => {
  // The two directions of the loop — CLI → landing → CLI — are asserted in this
  // ONE test so no half-rewire can pass: a change that repoints one direction
  // without the other cannot leave this row green.
  //
  // leg 1: CLI welcome link → the landing `/` (D-03)
  const welcome = read('src/components/cli/outputs/WelcomeMessage.tsx');
  assert.ok(welcome.includes('href="/"'), 'leg 1: welcome bracket link href="/"');
  assert.ok(!welcome.includes('target='), 'leg 1 guard: same tab, no target attribute');
  // leg 2: the `explore` command → Next router, same tab (D-03)
  const ti = read('src/components/cli/TerminalInterface.tsx');
  assert.ok(
    ti.includes('{ navigate: "/" }') && ti.includes('router.push(result.navigate)'),
    'leg 2: explore-command sentinel + router.push(result.navigate)',
  );
  assert.ok(!ti.includes('window.location'), 'leg 2 guard: no window.location in TerminalInterface');
  // leg 3: header Terminal link → /cli (D-03)
  assert.ok(
    read('src/components/explore/explore-header.tsx').includes('href="/cli"'),
    'leg 3: header Terminal link href="/cli"',
  );
  // leg 4: tour finish card → /cli (D-03; EXPLORE_TOUR_FINISH, constants.ts)
  assert.equal(EXPLORE_TOUR_FINISH.linkHref, '/cli', 'leg 4: finish-card linkHref === "/cli"');
  // leg 5: the status-bar `cli` chrome chip → /cli in a NEW tab (D-03). The `rel`
  // pair is the phase's one security-relevant token — omitting it is reverse
  // tabnabbing, so BOTH halves are asserted at source level AND in the export.
  const statusBar = read('src/components/explore/explore-status-bar.tsx');
  assert.ok(statusBar.includes('target="_blank"'), 'leg 5: chip opens a new tab');
  assert.ok(
    /rel="[^"]*noopener[^"]*"/.test(statusBar) && /rel="[^"]*noreferrer[^"]*"/.test(statusBar),
    'leg 5: chip rel carries BOTH noopener and noreferrer (reverse-tabnabbing guard)',
  );
  assert.equal(EXPLORE_STATUS_CLI_LINK.href, '/cli', 'leg 5: chip href === "/cli"');
  const landingHtml = read('out/index.html');
  assert.ok(landingHtml.includes('target="_blank"'), 'leg 5 (export): the new-tab attribute is SSR-visible');
  assert.ok(
    landingHtml.includes('rel="noopener noreferrer"'),
    'leg 5 (export): the rel pair is SSR-visible in the landing artifact',
  );
  // leg 6: the 404 page's "Return to Terminal" → /cli (the declared 6th link site;
  // output:'export' emits out/404.html, which GitHub Pages serves for the deleted
  // /explore — leaving this at "/" would promise the terminal and deliver the landing).
  assert.ok(
    read('src/app/not-found.tsx').includes('href="/cli"'),
    'leg 6: not-found.tsx "Return to Terminal" targets /cli',
  );
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
  read('out/index.html')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<!-- -->/g, '');
const exportRaw = () => read('out/index.html');

test('sweep E-6 (E, phase EXPLORE-09): entry 1 (first selectTimelineEntries result — Chubb role, present-first) renders real text in out/index.html — data-derived (D-03/§9 + user directive)', () => {
  assert.ok(existsSync(join(root, 'out/index.html')), 'out/index.html missing — run `npm run build` first');
  const html = exportText();
  // The FIRST merged entry (year-DESCENDING — 2023, the Chubb role) is the
  // SSR-visible layer the export must carry (D-03 → D-07 static-text
  // contract); it is the arc's focal point at rest (progress 0 → index 0).
  // Every expectation is derived from the JSON THROUGH the pure module at
  // test time, never copied. Roles render title > company > duration AS
  // STORED — the §3.3 role template.
  const entries = selectTimelineEntries(portfolio.experience, portfolio.education);
  const first = entries[0];
  assert.ok(first, 'the merged derivation yields a first entry');
  assert.equal(first.type, 'role', 'entry 1 is the present-first entry — the Chubb role at the arc focal point');
  assert.equal(first.year, '2023', 'entry 1 parses to 2023 (the Chubb start year, data-derived)');
  for (const [field, value] of [
    ['title', first.entry.title],
    ['company', first.entry.company],
    ['duration AS STORED', first.entry.duration],
  ]) {
    assert.ok(
      html.includes(value),
      `entry-1 ${field} server-rendered as real text (derived from portfolio-main-data.json)`,
    );
  }
});

test('sweep E-7 (E, phase EXPLORE-09): layers 2-5 SSR visibility:hidden — layer 1 visible (§9)', () => {
  assert.ok(existsSync(join(root, 'out/index.html')), 'out/index.html missing — run `npm run build` first');
  const hidden = (exportRaw().match(/visibility:hidden/g) || []).length;
  assert.ok(
    hidden >= 4,
    `entries 2-5 carry SSR visibility:hidden — found ${hidden} ≥ 4 (5 entries, 1 visible; the §9 derivation evaluated at progress 0, no special-casing)`,
  );
});

test('sweep E-8 (E, phase EXPLORE-09): stage anatomy markers — group, controls, counter, arc path (§9/§4)', () => {
  assert.ok(existsSync(join(root, 'out/index.html')), 'out/index.html missing — run `npm run build` first');
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
  assert.ok(existsSync(join(root, 'out/index.html')), 'out/index.html missing — run `npm run build` first');
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

// ---------------------------------------------------------------------------
// Phase EXPLORE-13 plan 04 — Type-E export row for the mobile-parity contract
// (REV-23 / REV-23b / REV-24 / REV-25). The sweep convention holds: `npm run
// build` must precede the run — these rows read the built artifact. Every
// expectation is data-derived (the data file, THROUGH the module-level parse
// above) or source-derived (globals.css); zero copied literals.
// ---------------------------------------------------------------------------

test('sweep E-10 (E, phase 13): the built export carries the mobile-parity contract — one viewport meta, no avatar, the base arc box', () => {
  assert.ok(existsSync(join(root, 'out/index.html')), 'out/index.html missing — run `npm run build` first');
  assert.ok(
    existsSync(join(root, 'src/data/portfolio-main-data.json')),
    'the data file is the source of the two avatar expectations below',
  );
  const html = exportRaw();
  const text = exportText(); // entity-decoded + React text-node separators dropped

  // --- REV-25a: ONE viewport declaration, the fit declared, zoom never locked.
  // Pre-phase the export emitted TWO tags (the data-file line plus Next's
  // default) — the phone ran on a browser-defined tie-break. The `=== 1` IS the
  // falsifier: red on two tags, green only after the typed-viewport migration.
  assert.equal(
    (html.match(/<meta name="viewport"/g) || []).length,
    1,
    'exactly ONE <meta name="viewport"> is emitted — the data-rendered `meta.viewport` line retired; the phone otherwise runs on an undefined multi-tag tie-break',
  );
  assert.ok(
    html.includes('viewport-fit=cover'),
    'the emitted viewport declares viewport-fit=cover — env(safe-area-inset-*) resolves to 0px without it, so the meta and the CSS pack activate together',
  );
  assert.ok(!html.includes('shrink-to-fit'), 'the legacy `shrink-to-fit=no` directive is gone with the retired data line');
  assert.ok(
    !/user-scalable|maximum-scale/.test(html),
    'zoom is never disabled — no user-scalable / maximum-scale in the export',
  );
  // Tag-scoped, never the bare string: the RSC flight payload reserializes the
  // resolved metadata, so the export carries FOUR `theme-color` occurrences but
  // only TWO real `<meta name="theme-color">` tags. A bare-string `=== 2` could
  // never go green.
  assert.equal(
    (html.match(/<meta name="theme-color"/g) || []).length,
    2,
    'both theme-color metas survive the viewport migration — the typed export`s themeColor array is not collateral damage',
  );

  // --- REV-24: the avatar is gone from the export, DERIVED from the data file.
  const avatarUrl = portfolio.about.profileImageUrl;
  const avatarAlt = 'Portrait of ' + portfolio.about.name;
  assert.ok(
    !html.includes('src="' + avatarUrl + '"'),
    `no element carries the retired avatar source (derived from the JSON: ${avatarUrl})`,
  );
  assert.ok(
    !html.includes(avatarAlt),
    `the avatar's alt text is gone from BOTH the tag and its flight-payload copy ("${avatarAlt}")`,
  );
  // The bare URL is deliberately NOT banned: the export legitimately carries
  // `5cfm72u7` as head metadata (og:image, twitter:image, the JSON-LD image,
  // plus their flight copies) and the Credentials panel renders several
  // tinyurl.com article hrefs — either bare ban is permanently red.

  // --- REV-23: the arc's base box is in the SSR markup (Tailwind emits the
  // arbitrary class verbatim), and the <md hide gate is nowhere in the export.
  assert.ok(html.includes('h-[200px]'), 'the base arc-zone box (h-[200px]) renders in the export');
  assert.ok(!html.includes('hidden md:flex'), 'the retired arc-zone hide gate appears nowhere in the export');

  // --- REV-23b + REV-25b: the touch contract is COMPLETE in the final tree.
  // BOTH halves in one row because no other row can see them together: plan 02
  // asserted only the ABSENCE of `touch-action: none` in the component, so a
  // slipped wave order or a dropped plan 03 would delete the contract silently.
  assert.ok(
    html.includes('data-projects-swipe-stage'),
    'the swipe stage hook survives into the export — client-component data attributes do render there (data-timeline-dot is the proven precedent)',
  );
  const css = read('src/app/globals.css');
  const stageRuleStart = css.indexOf('[data-projects-swipe-stage]');
  assert.ok(stageRuleStart > -1, 'globals.css targets the stage hook — the pack is the hook`s only consumer');
  const stageRule = css.slice(stageRuleStart, css.indexOf('}', stageRuleStart));
  assert.match(
    stageRule,
    /touch-action:\s*pan-y/,
    'the stage rule carries `touch-action: pan-y` — the drag owns horizontal, vertical page scroll survives (never `none`)',
  );

  // --- The SSR layer invariants this phase must not disturb (they are why the
  // layer gate is a RUNTIME gate, not an SSR one).
  assert.ok(
    (html.match(/visibility:hidden/g) || []).length >= 4,
    'entries 2-5 still carry SSR visibility:hidden — the <md readable stack is a runtime clear, not an SSR change',
  );
  assert.ok(
    text.includes('d="M 100 0 A 100 100 0 0 0 100 200"'),
    'the left-bulging C arc path still renders via the fixed viewBox (sweep E-8`s invariant, re-pinned here at every width)',
  );
});