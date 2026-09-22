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

// ---------------------------------------------------------------------------
// Type-P structural rows (Task 1)
// ---------------------------------------------------------------------------

test('sweep rows EXPLORE@375/768/1440/1920 (P): panels grid 1→2→3 cols, About spans wide layouts', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  assert.ok(
    src.includes('grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'),
    'grid classes (explore-panels.tsx:67) — 1 col base (375), 2 at md (768), 3 at lg (1440/1920)',
  );
  assert.ok(
    src.includes('md:col-span-2 lg:col-span-2'),
    'About spans both wider layouts (:77) — row EXPLORE@768',
  );
  assert.ok(!/max-w-/.test(src), 'no max-width wrapper — full-bleed at 1920 (row EXPLORE@1920)');
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
    src.includes('min-h-[40px]'),
    'min-h-[40px] (explore-intro.tsx:42) — 2 lines × text-sm (20px/line) at 375px, by design',
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