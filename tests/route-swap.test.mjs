/**
 * Phase 12 (EXPLORE-12-route-swap-promotion) plan 01 — route-swap acceptance suite.
 *
 * Runner (house gate, no `npm test` script exists):
 *   rm -rf out && npm run build && node --test tests/route-swap.test.mjs
 *
 * TDD: this file is written FIRST and run against a fresh build of the CURRENT
 * tree. It must FAIL on every row that the swap owns — the red causes are the
 * missing behaviour (the CLI still serves `/`, no `out/cli.html`, `out/explore.*`
 * still present, links still pointing at `/explore`, no chip), never a broken
 * test. Rows 2-5 read the not-yet-created `src/app/cli/*` and `src/app/(home)/*`
 * paths, so those four failures are NAMED missing-path failures from the `read()`
 * guard below — not raw ENOENTs and not a reason to edit this file.
 *
 * Row taxonomy follows the sweep convention: P = programmatic/source-level,
 * E = export-level (requires `npm run build` to have run first).
 *
 * Reference: .planning/phases/EXPLORE-12-route-swap-promotion/
 *   -EXPLORE-12-route-swap-promotion-SPEC.md (REV-22: Current/Target/Acceptance)
 *   -EXPLORE-12-route-swap-promotion-RESEARCH.md (§3.3/§3.4/§3.6/§3.7, §6, P-1/P-10)
 *   -EXPLORE-12-route-swap-promotion-UI-SPEC.md (§2.3/§2.4, §4.3, §5, §6, §7, §9)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Namespace import, not a named one: until Task 3 lands, the module has no
// `EXPLORE_STATUS_CLI_LINK` export, and a named import of a missing export is a
// LINK-TIME SyntaxError that would kill every row in this file — an INVALID red
// (see the plan's acceptance criteria). A namespace import yields `undefined`
// for the missing key, so the row fails with a NAMED assertion instead.
import * as exploreConstants from '../src/components/explore/constants.ts';

const { EXPLORE_TOUR_FINISH, EXPLORE_STATUS_PATH, EXPLORE_STATUS_CLI_LINK } = exploreConstants;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const has = (p) => existsSync(join(root, p));

/** Source reader — the existence guard turns a not-yet-moved route into a NAMED failure. */
const read = (p) => {
  assert.ok(
    has(p),
    `${p} missing — expected before the route swap lands (add \`npm run build\` for out/ paths)`,
  );
  return readFileSync(join(root, p), 'utf8');
};

/** Export reader — a distinct message so a skipped build is never misread as a missing contract. */
const readExport = (p) => {
  assert.ok(has(p), `${p} missing — run \`npm run build\` first`);
  return readFileSync(join(root, p), 'utf8');
};

/** Recursive file list (files only) under an absolute directory. */
const walkFiles = (dir) => {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walkFiles(full));
    else if (entry.isFile()) found.push(full);
  }
  return found;
};

/** The four pinned status-bar chrome tokens — asserted independently (tests/explore-sweep.test.mjs:200-208). */
const STATUS_BAR_TOKENS = ['h-7', 'sm:h-8', 'text-[10px]', 'sm:text-xs'];
/** The footer's own class string, read verbatim off explore-status-bar.tsx:34 — byte-identical before and after this phase. */
const FOOTER_CLASSES =
  'flex h-7 shrink-0 items-center justify-between border-t px-3 text-[10px] sm:h-8 sm:px-4 sm:text-xs';
const STATUS_BAR = 'src/components/explore/explore-status-bar.tsx';
const CONSTANTS = 'src/components/explore/constants.ts';

// ---------------------------------------------------------------------------
// Row 1 — the route tree itself
// ---------------------------------------------------------------------------

test('row 1 (P): route tree — (home) serves /, cli serves /cli, both old route folders deleted', () => {
  for (const p of [
    'src/app/(home)/page.tsx',
    'src/app/(home)/layout.tsx',
    'src/app/cli/page.tsx',
    'src/app/cli/layout.tsx',
  ]) {
    assert.ok(has(p), `${p} missing — the route swap has not landed (D-01)`);
  }
  // Existence is asserted EXPLICITLY rather than through a .filter(existsSync)
  // array: a filtered list silently drops a moved path and turns the guards
  // below into no-ops (RESEARCH P-1 / R-4).
  for (const p of [
    'src/app/explore',
    'src/app/(main)',
    'src/app/explore/layout.tsx',
    'src/app/explore/page.tsx',
    'src/app/(main)/layout.tsx',
    'src/app/(main)/page.tsx',
  ]) {
    assert.ok(!has(p), `${p} still exists — /explore is deleted outright, and the (main) group must not survive (D-01)`);
  }
});

// ---------------------------------------------------------------------------
// Row 2 — the CLI shell travelled verbatim
// ---------------------------------------------------------------------------

test('row 2 (P): CLI shell travelled verbatim to src/app/cli/* (D-01, byte-identical move)', () => {
  const layout = read('src/app/cli/layout.tsx');
  assert.ok(layout.includes('overflow-hidden'), 'cli/layout.tsx keeps the overflow-hidden wrapper (was (main)/layout.tsx:16)');
  assert.ok(layout.includes('overflow-auto'), 'cli/layout.tsx keeps the main overflow-auto scroll container (was (main)/layout.tsx:19)');
  assert.ok(layout.includes('font-mono'), 'cli/layout.tsx keeps the font-mono terminal shell');
  assert.ok(layout.includes('../globals.css'), "the relative import '../globals.css' still resolves at the new depth");

  const page = read('src/app/cli/page.tsx');
  assert.ok(page.includes("'use client'"), 'cli/page.tsx stays a client component');
  assert.match(page, /ssr:\s*false/, 'the TerminalInterface leaf stays client-only (dynamic ssr:false)');
});

// ---------------------------------------------------------------------------
// Row 3 — the landing must not stack the CLI shell
// ---------------------------------------------------------------------------

test('row 3 (P): landing does not inherit the CLI h-screen wrapper (UI-SPEC §2.1 hard constraint)', () => {
  const page = read('src/app/(home)/page.tsx');
  const shell = read('src/components/explore/explore-shell.tsx');
  const code = (page + shell).replace(/\/\*[\s\S]*?\*\//g, ''); // strip doc comments (tests/explore-shell.test.mjs:126)
  assert.ok(!code.includes('h-screen'), 'no h-screen anywhere in the landing page + shell chain — h-dvh only');
  assert.match(
    shell,
    /explore-shell flex h-dvh flex-col overflow-hidden /,
    'the explore shell root keeps its own h-dvh frame (explore-shell.tsx) — overflow-hidden on BOTH axes',
  );

  // 3b SINGLE-SCROLLBAR INVARIANT (both scrollbars, 3-axis report).
  // (i) The SHELL must not use `overflow-x-hidden`: hiding one axis makes the
  // CSS spec compute the other as `auto`, so the h-dvh frame could paint its
  // OWN vertical scrollbar alongside main's. overflow-hidden clips both.
  // Comment-stripped on purpose — the shell's doc comment NAMES the retired
  // form, and a raw-source negative would be red on prose, not on code.
  const shellCode = shell.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(
    !/overflow-x-hidden/.test(shellCode),
    'the shell root must NOT carry overflow-x-hidden — the single-hidden-axis computed `auto` is exactly the shell-owned vertical scrollbar (explore-shell.tsx)',
  );
  assert.equal(
    (shellCode.match(/overflow-(?:y-)?(?:auto|scroll)/g) || []).length,
    1,
    'exactly ONE scroll container in the shell — <main>',
  );

  // (ii) The WINDOW scrollbar: the landing layout locks the document, so the
  // empty post-shell wrappers + the Radix portal roots (live region, toaster)
  // cannot make the document taller than the visual viewport (the long-standing
  // "scroll past the footer" report). Route-scoped to (home) ON PURPOSE: /cli
  // keeps its own h-screen overflow-hidden shell and /resume scrolls as a
  // document BY DESIGN — neither may pick up this rule.
  const landing = read('src/app/(home)/layout.tsx');
  assert.match(
    landing,
    /html,\s*body\s*\{[^}]*height:\s*100%;[^}]*overflow:\s*hidden;/s,
    'the landing layout pins the route-scoped document lock (html, body { height: 100%; overflow: hidden; }) — the WINDOW never scrolls',
  );

  for (const [path, keeps, why] of [
    ['src/app/cli/layout.tsx', 'h-screen', 'the CLI keeps its own h-screen overflow-hidden shell'],
    ['src/app/resume/page.tsx', 'min-h-screen', 'resume scrolls as a document BY DESIGN'],
  ]) {
    const src = read(path);
    assert.ok(src.includes(keeps), `${path} still carries ${keeps} (${why})`);
    assert.ok(
      !/height:\s*100%;[^}]*overflow:\s*hidden;/.test(src),
      `${path} must NOT pick up the landing's document lock (${why})`,
    );
  }
});

// ---------------------------------------------------------------------------
// Row 4 — the before-paint theme script stays route-scoped (R-2)
// ---------------------------------------------------------------------------

test('row 4 (P): before-paint theme script is route-scoped to the landing and NOT in the root layout (R-2)', () => {
  // 4a POSITIVE — the landing owns the script.
  // Measured: `grep -rn 'portfolio-explore-theme' src/` matches exactly one line,
  // src/components/explore/constants.ts:34. The layouts import the IDENTIFIER and
  // interpolate it, so a script copied into the root layout would contain NO such
  // literal and a literal-grep would pass green while the defect shipped. Both
  // halves of this row therefore assert the identifier and the class-strip
  // BEHAVIOUR, never the storage-key string literal (which is single-sourced).
  const landing = read('src/app/(home)/layout.tsx');
  assert.ok(landing.includes('EXPLORE_THEME_STORAGE_KEY'), 'the landing layout reads the explore theme key (route-scoped flash prevention)');
  assert.match(
    landing,
    /classList\.remove\(["']dark["'],\s*["']light["']\)/,
    'the landing layout strips stale dark/light classes before paint',
  );
  assert.ok(landing.includes('dangerouslySetInnerHTML'), 'the script is inlined (static export emits it verbatim)');
  const scriptIdx = landing.indexOf('dangerouslySetInnerHTML');
  const childrenIdx = landing.indexOf('{children}');
  assert.ok(childrenIdx > -1, 'the landing layout still renders {children}');
  assert.ok(scriptIdx < childrenIdx, 'the script renders AHEAD of the shell markup (indexOf(dangerouslySetInnerHTML) < indexOf({children}))');

  // 4b DIRECT falsifier — the root layout must NOT own it. The root layout is
  // shared with /cli and /resume: running this script there would strip their
  // dark/light classes at every boot and rebuild them from the EXPLORE key
  // (RESEARCH §3.3 / R-2 — the phase's highest-severity defect).
  const rootLayout = read('src/app/layout.tsx');
  assert.ok(
    !rootLayout.includes('EXPLORE_THEME_STORAGE_KEY'),
    'src/app/layout.tsx must NOT reference EXPLORE_THEME_STORAGE_KEY (R-2 falsifier; a literal check on "portfolio-explore-theme" would be vacuous — it lives only at constants.ts:34)',
  );
  assert.ok(
    !/classList\.remove\(["']dark["'],\s*["']light["']\)/.test(rootLayout),
    'src/app/layout.tsx must NOT strip dark/light classes — that would break /cli and /resume theming (R-2)',
  );
  // The root layout keeps its own contracts untouched (D-02).
  assert.ok(rootLayout.includes('G-TLWL6FDZE7'), 'GA id preserved');
  assert.ok(rootLayout.includes('application/ld+json'), 'JSON-LD preserved');
  assert.ok(rootLayout.includes('"url": "https://tasostilsi.github.io/"'), 'Person schema URL preserved');
  assert.ok(rootLayout.includes('viewport'), 'the viewport export stays in the root layout');
});

// ---------------------------------------------------------------------------
// Row 5 — landing metadata (the §3.4 OG trap)
// ---------------------------------------------------------------------------

test('row 5 (P): landing metadata declares its own openGraph + twitter branding (D-02, R-3/P-11)', () => {
  const landing = read('src/app/(home)/layout.tsx');
  assert.ok(landing.includes('openGraph'), 'the landing declares openGraph — otherwise the root CLI-branded og:title survives the merge');
  assert.ok(landing.includes('twitter'), 'the landing declares twitter — same inheritance trap');
  assert.ok(landing.includes('Visual Portfolio Explorer'), 'explore branding is the landing identity');
  assert.ok(!landing.includes('metadataBase'), 'metadataBase stays in the root layout (relative OG image URLs still resolve)');
});

// ---------------------------------------------------------------------------
// Row 6 — cross-surface links at source level
// ---------------------------------------------------------------------------

test('row 6 (P): cross-surface link targets rewired at source level (D-03)', () => {
  const welcome = read('src/components/cli/outputs/WelcomeMessage.tsx');
  assert.equal(
    (welcome.match(/href="\/"/g) || []).length,
    1,
    'the CLI welcome bracket link targets / exactly once (the explore home)',
  );
  assert.ok(!welcome.includes('target='), 'the welcome link stays same-tab — no target attribute');
  // The rendered bracket line stays VERBATIM: only the target moved, the anchor
  // text is still `explore` (tests/explore-sweep.test.mjs:184 pins the text).
  assert.ok(welcome.includes('>explore</Link>'), 'the welcome anchor text is unchanged (still `explore`)');
  assert.ok(welcome.includes('visual tour:'), 'the welcome bracket line is still rendered');

  const ti = read('src/components/cli/TerminalInterface.tsx');
  assert.ok(ti.includes('{ navigate: "/" }'), 'the explore command navigates to / (the explore home)');
  assert.ok(ti.includes('router.push(result.navigate)'), 'the navigate flow still routes through the Next router');
  assert.ok(!ti.includes('window.location'), 'no window.location — same-tab SPA navigation only');
  assert.equal(
    (ti.match(/\[ opening the visual tour\.\.\. \]/g) || []).length,
    1,
    'exactly one [ opening the visual tour... ] chrome line',
  );

  const header = read('src/components/explore/explore-header.tsx');
  assert.ok(header.includes('href="/cli"'), 'the header Terminal link targets /cli');
  assert.ok(header.includes('aria-label="Open the terminal"'), 'the header Terminal link aria-label is unchanged');

  const notFound = read('src/app/not-found.tsx');
  assert.ok(notFound.includes('href="/cli"'), "the 404 page's Return to Terminal link targets /cli (declared 6th link site)");
  assert.ok(notFound.includes('Return to Terminal'), 'the 404 label still promises the terminal');
});

// ---------------------------------------------------------------------------
// Row 7 — breadcrumb + chip constants (module-imported)
// ---------------------------------------------------------------------------

test('row 7 (P): breadcrumb "~" and the chip constant (D-03, UI-SPEC §2.3/§5.1)', () => {
  assert.equal(EXPLORE_STATUS_PATH, ':~', 'EXPLORE_STATUS_PATH is exactly ":~" (the user breadcrumb option 2)');

  assert.ok(EXPLORE_STATUS_CLI_LINK, 'EXPLORE_STATUS_CLI_LINK must exist in constants.ts (the chip has not landed yet)');
  assert.equal(EXPLORE_STATUS_CLI_LINK.href, '/cli', 'chip href === "/cli"');
  assert.equal(EXPLORE_STATUS_CLI_LINK.label, 'cli', 'visible label is exactly "cli" (lowercase, 3 chars)');
  assert.ok(
    EXPLORE_STATUS_CLI_LINK.ariaLabel.includes(EXPLORE_STATUS_CLI_LINK.label),
    `the accessible name must CONTAIN the visible label (WCAG 2.5.3) — got ${EXPLORE_STATUS_CLI_LINK.ariaLabel}`,
  );
  for (const [key, value] of Object.entries(EXPLORE_STATUS_CLI_LINK)) {
    assert.ok(!/[0-9]/.test(String(value)), `${key} must be digit-free (EXPLORE_TOUR_FINISH digit guard, RESEARCH P-4)`);
  }

  assert.equal(EXPLORE_TOUR_FINISH.linkHref, '/cli', 'the wizard finish card targets /cli');
  assert.equal(EXPLORE_TOUR_FINISH.linkLabel, 'Open the terminal →', 'the finish-card label is unchanged');
});

// ---------------------------------------------------------------------------
// Row 8 — chip anatomy + status-bar row structure (UI-SPEC §2.2/§2.3/§2.4/§4.3)
// ---------------------------------------------------------------------------

test('row 8 (P): status-bar cli chip anatomy, footer tokens byte-identical, live region isolated', () => {
  const src = read(STATUS_BAR);

  // Locked anatomy (UI-SPEC §2.3).
  for (const token of [
    'EXPLORE_STATUS_CLI_LINK.href',
    'EXPLORE_STATUS_CLI_LINK.ariaLabel',
    'ArrowUpRight',
    'exp-nudge',
    'target="_blank"',
    'rel="noopener noreferrer"',
    'focus-visible:ring-inset',
    'active:opacity-80',
    'h-7',
    'sm:h-8',
    'gap-1',
    'px-2',
    'rounded-md',
    'shrink-0',
    'text-accent',
    'h-3 w-3',
    'aria-hidden="true"',
  ]) {
    assert.ok(src.includes(token), `chip anatomy token missing from explore-status-bar.tsx: ${token}`);
  }

  // Negatives: no router primitive, no handler, no hover pill, no transition.
  assert.ok(!src.includes('next/link'), 'the chip is a plain <a> — next/link is wrong for a new-tab affordance');
  assert.ok(!src.includes('onClick'), 'no onClick handler — a static href works with JS disabled');
  assert.ok(!src.includes('hover:bg-'), 'no hover background pill (W-2 resolution)');
  assert.ok(!src.includes('transition'), 'no transition utility — the only motion is the inherited .exp-nudge');

  // The footer's own class string is byte-identical to the pre-phase value.
  assert.ok(
    src.includes(`"${FOOTER_CLASSES}"`),
    `footer class string must stay byte-identical to explore-status-bar.tsx:34 — expected "${FOOTER_CLASSES}"`,
  );
  for (const token of STATUS_BAR_TOKENS) {
    assert.ok(src.includes(token), `pinned status-bar token ${token} still present (tests/explore-sweep.test.mjs:200-208)`);
  }

  // Row-fit structural guards (UI-SPEC §2.4) — structural, never estimated px.
  assert.ok(src.includes('min-w-0 truncate'), 'the breadcrumb <p> carries min-w-0 truncate (the width-pressure escape valve)');
  assert.ok(src.includes('whitespace-nowrap'), 'the counter <p> carries whitespace-nowrap (cannot wrap inside the fixed-height bar)');
  assert.ok(src.includes('flex shrink-0 items-center gap-3'), 'the right cluster is flex shrink-0 items-center gap-3');

  // Live-region isolation: aria-live stays on the counter <p> ONLY, and the chip
  // anchor sits OUTSIDE it (a focusable link inside a live region is announced on
  // every counter change).
  assert.equal(
    (src.match(/aria-live="polite"/g) || []).length,
    1,
    'aria-live="polite" occurs exactly once',
  );
  const liveIdx = src.indexOf('aria-live="polite"');
  const anchorIdx = src.indexOf('href={EXPLORE_STATUS_CLI_LINK.href}');
  assert.ok(anchorIdx > -1, 'the chip anchor renders from EXPLORE_STATUS_CLI_LINK.href');
  assert.ok(anchorIdx > liveIdx, 'the chip anchor is AFTER the live region, not inside it');
});

// ---------------------------------------------------------------------------
// Row 9 — no stale quoted route literal anywhere in src/
// ---------------------------------------------------------------------------

test('row 9 (P): no stale quoted /explore route literal survives in src/ (RESEARCH P-3)', () => {
  // QUOTED literals only. Several doc comments legitimately name the old path in
  // prose and the drawer deliberately renders `~/explore` — a bare-substring ban
  // would be unfixable.
  const banned = ['href="/explore"', '{ navigate: "/explore" }', '":~/explore"'];
  const offenders = [];
  for (const file of walkFiles(join(root, 'src')).filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))) {
    const content = readFileSync(file, 'utf8');
    for (const literal of banned) {
      if (content.includes(literal)) offenders.push(`${relative(root, file)} → ${literal}`);
    }
  }
  assert.deepEqual(offenders, [], `stale quoted /explore route literals remain: ${offenders.join(', ')}`);
});

// ---------------------------------------------------------------------------
// Row 10 — export shape (E)
// ---------------------------------------------------------------------------

test('row 10 (E): export emits index.html (landing) + cli.html (CLI), no explore artifact', () => {
  for (const p of ['out/index.html', 'out/cli.html', 'out/resume.html']) {
    assert.ok(has(p), `${p} missing — run \`npm run build\` first`);
  }
  for (const p of ['out/explore.html', 'out/explore.txt', 'out/cli/index.html']) {
    assert.ok(
      !has(p),
      p === 'out/cli/index.html'
        ? `${p} must not exist — /cli emits cli.html (no trailingSlash); a directory form means every "/cli" href 404s (R-8)`
        : `${p} must not exist after the route swap (the /explore route is deleted outright)`,
    );
  }

  const index = readExport('out/index.html');
  for (const token of [
    'explore-shell',
    'guest@tasostilsi',
    ':~',
    '0/5 sections visited',
    'href="/cli"',
    'aria-label="Open the terminal"',
  ]) {
    assert.ok(index.includes(token), `out/index.html must contain "${token}" (SSR contract, UI-SPEC §6)`);
  }
  assert.match(
    index,
    /classList\.remove\(["']dark["'],\s*["']light["']\)/,
    'the before-paint theme script is emitted into out/index.html ahead of the shell markup',
  );

  const cli = readExport('out/cli.html');
  assert.ok(!cli.includes('explore-shell'), 'out/cli.html must not carry the explore shell marker');
  assert.ok(!cli.includes('System initialized'), 'the CLI stays a client-only leaf — no SSR\'d terminal content (RESEARCH §1.7)');
});

// ---------------------------------------------------------------------------
// Row 11 — the /explore residue in the build output (E), scoped two-tier
// ---------------------------------------------------------------------------

test('row 11 (E): /explore residue — out/*.html + out/*.txt clean, chunks count-exact at 1', () => {
  const outDir = join(root, 'out');
  assert.ok(existsSync(outDir), 'out/ missing — run `npm run build` first');

  // Tier A: every top-level export document must be clean. Pre-swap this fails
  // on the deleted route's own explore.html + explore.txt.
  const docs = readdirSync(outDir).filter((f) => f.endsWith('.html') || f.endsWith('.txt'));
  const dirtyDocs = docs
    .filter((f) => readFileSync(join(outDir, f), 'utf8').includes('/explore'))
    .map((f) => `out/${f}`);
  assert.deepEqual(
    dirtyDocs,
    [],
    `no out/*.html or out/*.txt may contain "/explore" (includes out/404.html, which GitHub Pages serves for the deleted path) — offending: ${dirtyDocs.join(', ') || '(none)'}`,
  );
  assert.ok(docs.includes('index.html') && docs.includes('cli.html'), 'the two primary documents are emitted');

  // Tier B: count-exact across the client chunks. Exactly ONE `/explore` hit is
  // permitted, and it is the drawer's retained `~/explore` SheetTitle
  // (src/components/explore/explore-drawer.tsx:55) carried into the landing
  // chunk — ACCEPTED COSMETIC DEBT, not a defect: RESEARCH §3.7 / OQ-7 and
  // UI-SPEC §9 ("do not touch the drawer") keep it, and
  // tests/explore-shell.test.mjs:241 pins it. The count assertion is what makes
  // this row honest — a loose `> 0` would hide a second leak, and a bare
  // whole-tree zero is unreachable without editing the drawer.
  const chunkRoot = join(outDir, '_next/static/chunks');
  let hits = 0;
  const hitsByFile = [];
  if (existsSync(chunkRoot)) {
    for (const file of walkFiles(chunkRoot)) {
      const count = (readFileSync(file, 'utf8').match(/\/explore/g) || []).length;
      if (count > 0) {
        hits += count;
        hitsByFile.push(`${relative(root, file)} ×${count}`);
      }
    }
  }
  const residueMessage =
    `exactly ONE "/explore" occurrence is permitted across out/_next/static/chunks/** — the drawer's retained "~/explore" SheetTitle (explore-drawer.tsx:55, accepted debt per RESEARCH §3.7 / OQ-7 + UI-SPEC §9). Found ${hits}: ${hitsByFile.join(', ') || '(none)'}`;
  assert.equal(hits, 1, residueMessage);
});

// ---------------------------------------------------------------------------
// Row 12 — landing social card (E, the §3.4 inheritance trap)
// ---------------------------------------------------------------------------

test('row 12 (E): landing og:title is explore-branded; /cli carries CLI branding', () => {
  const index = readExport('out/index.html');
  const og = /<meta property="og:title" content="([^"]*)"/.exec(index);
  assert.ok(og, 'out/index.html carries a property="og:title" meta tag');
  assert.ok(
    og[1].includes('Visual Portfolio Explorer'),
    `out/index.html og:title must carry the explore branding (else the root's CLI card survives the metadata merge) — got: ${og[1]}`,
  );

  const cli = readExport('out/cli.html');
  assert.ok(
    cli.includes('Interactive CLI Portfolio'),
    'out/cli.html carries the CLI branding (title and/or the inherited og:title)',
  );
});

// ---------------------------------------------------------------------------
// Row 13 — the six-leg cross-surface composite (one test: no half-rewire passes)
// ---------------------------------------------------------------------------

test('row 13 (P + E): six-leg cross-surface composite — CLI -> landing -> CLI in one assertion set', () => {
  // leg 1: CLI welcome bracket link -> "/" (the explore home)
  const welcome = read('src/components/cli/outputs/WelcomeMessage.tsx');
  assert.equal((welcome.match(/href="\/"/g) || []).length, 1, 'leg 1: welcome link href="/" once');
  assert.ok(!welcome.includes('target='), 'leg 1: same-tab only');

  // leg 2: the `explore` command sentinel -> "/" (same tab, via the router)
  const ti = read('src/components/cli/TerminalInterface.tsx');
  assert.ok(ti.includes('{ navigate: "/" }'), 'leg 2: explore command sentinel { navigate: "/" }');
  assert.ok(ti.includes('router.push(result.navigate)'), 'leg 2: router.push(result.navigate)');

  // leg 3: the explore header Terminal link -> "/cli" (source + SSR)
  const header = read('src/components/explore/explore-header.tsx');
  assert.ok(header.includes('href="/cli"'), 'leg 3: header Terminal link href="/cli"');
  const index = readExport('out/index.html');
  assert.ok(index.includes('aria-label="Open the terminal"'), 'leg 3: the header link SSRs its aria-label into out/index.html');
  assert.ok(index.includes('href="/cli"'), 'leg 3: out/index.html carries href="/cli"');

  // leg 4: the wizard finish card -> "/cli" (the test-importable constant, no JSX parsing)
  assert.equal(EXPLORE_TOUR_FINISH.linkHref, '/cli', 'leg 4: EXPLORE_TOUR_FINISH.linkHref === "/cli"');

  // leg 5: the status-bar chip -> "/cli" in a NEW tab (the phase's only new control)
  assert.ok(EXPLORE_STATUS_CLI_LINK, 'leg 5: EXPLORE_STATUS_CLI_LINK exists');
  assert.equal(EXPLORE_STATUS_CLI_LINK.href, '/cli', 'leg 5: chip href === "/cli"');
  const bar = read(STATUS_BAR);
  assert.ok(bar.includes('target="_blank"'), 'leg 5: target="_blank" in the status bar');
  assert.ok(bar.includes('rel="noopener noreferrer"'), 'leg 5: rel="noopener noreferrer" — reverse-tabnabbing guard (R-5)');
  assert.ok(index.includes('target="_blank"'), 'leg 5: the chip\'s target="_blank" SSRs into out/index.html');
  assert.ok(index.includes('rel="noopener noreferrer"'), 'leg 5: the chip\'s rel SSRs into out/index.html');

  // leg 6: the 404 page's "Return to Terminal" -> "/cli" (declared 6th link site)
  assert.ok(read('src/app/not-found.tsx').includes('href="/cli"'), 'leg 6: not-found.tsx href="/cli"');

  // Both directions (CLI -> landing via legs 1-2, landing -> CLI via legs 3-5) are
  // asserted in THIS single test, so no half-rewire can pass in isolation.
});

// ---------------------------------------------------------------------------
// Row 14 — zero new dependencies
// ---------------------------------------------------------------------------

test('row 14 (P): zero new dependencies — 39 keys, no recharts (SPEC constraint)', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(
    Object.keys(pkg.dependencies).length,
    39,
    'dependency count pinned at 39 (tests/explore-routing.test.mjs:198-203, tests/explore-sweep.test.mjs:261-266)',
  );
  assert.equal(pkg.dependencies.recharts, undefined, 'recharts must not return');
});
