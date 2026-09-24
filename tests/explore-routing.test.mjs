/**
 * Layer-1/2 routing contract suite — plan EXPLORE-05-explore-routing-01 (CLI island closure).
 *
 * Runner: node --test tests/explore-routing.test.mjs  (Node built-in, zero npm deps — D-05).
 * There is NO `test` npm script and CI runs Node 20, while the direct .ts imports
 * here rely on Node's native type stripping (needs Node >= 23.6), so this
 * suite is local-only (verified on Node v24.16.0).
 *
 * Red-first discipline (session rule for this plan): Task 1 committed this suite
 * and observed it FAIL on the untouched tree — that failing run is the red
 * record stored in the phase-01 SUMMARY. Task 2's implementation (constants,
 * TerminalInterface, WelcomeMessage, HelpOutput) turns it green.
 *
 * What is pinned (locked decisions from phase-05 CONTEXT.md):
 *   (a) D-02  — `explore` appended to AVAILABLE_COMMANDS (39th, last entry).
 *   (b) D-01  — the bracket welcome link line `[ NEW → visual tour: explore ]`,
 *               JetBrains Mono font stack, accent brackets, same-tab <Link>,
 *               UNCONDITIONAL sibling AFTER the tutorial box (OQ-3).
 *   (c) D-02  — `case "explore"` returns the `{ navigate: "/explore" }` sentinel,
 *               handled in executeCommand before the ReactNode branch:
 *               chrome line → ~600ms delay → router.push (OQ-2 pinned variant).
 *   (d) OQ-1  — HelpOutput.tsx lists explore (the CONTEXT auto-derivation claim
 *               is false — the help lists are hardcoded li elements, RESEARCH §1.4);
 *               AdvancedHelpOutput + MobileCommandPalette untouched (OQ-9).
 *   (e) D-01/D-05 — additive-only: every pre-existing welcome segment intact.
 *   (f) D-05  — zero new dependencies; the /explore → CLI finish-card return leg
 *               stays intact (unchanged clause of D-03).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AVAILABLE_COMMANDS } from '../src/components/cli/constants.ts';
// Read-only import from the explore constants module — sanctioned by the plan
// context (no explore-side source file is modified by this plan).
import { EXPLORE_TOUR_FINISH } from '../src/components/explore/constants.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const welcomeSrc = () => read('src/components/cli/outputs/WelcomeMessage.tsx');
const termSrc = () => read('src/components/cli/TerminalInterface.tsx');

// ---------------------------------------------------------------------------
// (a) Registry — D-02
// ---------------------------------------------------------------------------

test('registry: explore appended as the 39th and last AVAILABLE_COMMANDS entry (D-02)', () => {
  assert.ok(
    AVAILABLE_COMMANDS.includes('explore'),
    'explore is a registered command (Tab autocomplete + fuzzy suggestions consume this list)',
  );
  assert.equal(
    AVAILABLE_COMMANDS.length,
    39,
    '38 pre-existing commands + explore appended (RESEARCH §1.5)',
  );
  assert.equal(
    AVAILABLE_COMMANDS[AVAILABLE_COMMANDS.length - 1],
    'explore',
    'appended as the LAST entry — no reordering of existing commands',
  );
  // Additive-only spot check: the pre-existing head of the list is untouched.
  assert.equal(AVAILABLE_COMMANDS[0], 'help', 'list head untouched (D-05)');
  assert.ok(AVAILABLE_COMMANDS.includes('achievements'), 'pre-existing tail command intact');
});

// ---------------------------------------------------------------------------
// (b) Welcome link line — D-01, OQ-3 (unconditional sibling), OQ-4 (font stack)
// ---------------------------------------------------------------------------

test('welcome link line: exactly one <Link href="/explore"> in the locked bracket format (D-01)', () => {
  const src = welcomeSrc();
  // The "exactly one added link line" proof counts <Link elements — the word
  // "explore" already exists in the pre-existing typing line (line 48).
  assert.equal(
    (src.match(/<Link/g) || []).length,
    1,
    'exactly one <Link element in WelcomeMessage (the added link line)',
  );
  assert.equal(
    (src.match(/href="\/explore"/g) || []).length,
    1,
    'the link targets /explore exactly once',
  );
  for (const needle of ['NEW', 'visual tour:', '→', 'text-accent', 'var(--font-jetbrains)']) {
    assert.ok(src.includes(needle), `locked line contains "${needle}"`);
  }
  assert.ok(!src.includes('target='), 'same tab — no target attribute anywhere (D-01)');
});

test('welcome link: unconditional sibling AFTER the tutorial box, before the trailing <br /> (D-01, OQ-3)', () => {
  const src = welcomeSrc();
  const hrefIdx = src.indexOf('href="/explore"');
  const tutorialIdx = src.indexOf('showTutorial &&');
  const brIdx = src.indexOf('<br />');
  assert.ok(tutorialIdx > -1, 'the showTutorial block still exists (untouched)');
  assert.ok(brIdx > -1, 'the trailing <br /> still exists (untouched)');
  assert.ok(hrefIdx > -1, 'the link line exists');
  assert.ok(
    hrefIdx > tutorialIdx,
    'the link renders after the tutorial block — DOM position, not a render gate (OQ-3)',
  );
  assert.ok(hrefIdx < brIdx, 'the link renders before the trailing <br />');

  // Locked rendered sequence: exactly `[ NEW → visual tour: explore ]` —
  // pinned as a strictly-increasing relative-order chain over the source.
  const i = src.indexOf('NEW');
  assert.ok(i > -1, 'the NEW banner token is present');
  const openBracket = src.lastIndexOf('[', i);
  const arrow = src.indexOf('→', i);
  const label = src.indexOf('visual tour:', i);
  const href = src.indexOf('href="/explore"', i);
  const closeBracket = src.indexOf(']', href);
  assert.ok(openBracket > -1 && openBracket < i, 'opening "[" precedes NEW');
  assert.ok(arrow > -1 && i < arrow, 'arrow "→" follows NEW');
  assert.ok(label > -1 && arrow < label, '"visual tour:" follows the arrow');
  assert.ok(href > -1 && label < href, 'the explore link follows the label');
  assert.ok(closeBracket > -1 && closeBracket > href, 'closing "]" follows the link');
});

// ---------------------------------------------------------------------------
// (c) Dispatch — D-02, OQ-2 (pinned navigate-sentinel variant)
// ---------------------------------------------------------------------------

test('dispatch: explore case returns the navigate sentinel, routed via useRouter (D-02, OQ-2)', () => {
  const src = termSrc();
  assert.ok(
    src.includes('import { useRouter } from "next/navigation"'),
    'useRouter imported from next/navigation',
  );
  assert.ok(src.includes('case "explore":'), 'processCommand has an explore case');
  assert.ok(
    src.includes('{ navigate: "/explore" }'),
    'the case returns the navigate sentinel (house idiom: resume openModal sentinel, RESEARCH §1.2)',
  );
  assert.ok(
    src.includes('router.push(result.navigate)'),
    'executeCommand navigates via router.push(result.navigate) — same tab, no window.location',
  );
  assert.ok(!src.includes('window.location'), 'no window.location anywhere (D-02)');
  assert.equal(
    (src.match(/case "/g) || []).length,
    40,
    'exactly one case added: 39 → 40 (additive-only proof, RESEARCH §1.9)',
  );
  assert.equal(
    (src.match(/\[ opening the visual tour\.\.\. \]/g) || []).length,
    1,
    'exactly one chrome line `[ opening the visual tour... ]` — printed before navigation (R-2)',
  );
});

// ---------------------------------------------------------------------------
// (d) Help listing — D-02, OQ-1 (manual li; Help-only), OQ-9 (palette untouched)
// ---------------------------------------------------------------------------

test('help: explore listed in HelpOutput with the chrome-only description (D-02, OQ-1)', () => {
  const help = read('src/components/cli/outputs/HelpOutput.tsx');
  assert.ok(help.includes('>explore<'), 'HelpOutput has an explore entry li');
  assert.ok(
    help.includes('Open the visual portfolio tour'),
    'chrome-only description (EXPLORE-07: no invented portfolio facts)',
  );
  const adv = read('src/components/cli/outputs/AdvancedHelpOutput.tsx');
  assert.ok(!adv.includes('>explore<'), 'AdvancedHelpOutput untouched — Help-only entry (OQ-1)');
  const palette = read('src/components/cli/MobileCommandPalette.tsx');
  assert.ok(
    !palette.includes('explore'),
    'MobileCommandPalette untouched — not in the D-05 enumeration (OQ-9)',
  );
});

// ---------------------------------------------------------------------------
// (e) Additive-only — every pre-existing welcome segment intact (D-01/D-05)
// ---------------------------------------------------------------------------

test('additive-only: every pre-existing welcome segment still present (D-01/D-05)', () => {
  const src = welcomeSrc();
  for (const needle of [
    'hidden sm:block',                 // desktop ASCII banner (:27)
    'sm:hidden text-accent font-bold', // mobile banner div (:38)
    '> System initialized...',         // typing line 1 (:47)
    "> Type 'help' to explore my work", // typing line 2 (:48) — word, not a link
    'Quick Start Guide',               // tutorial box marker (:54)
  ]) {
    assert.ok(src.includes(needle), `pre-existing segment intact: "${needle}"`);
  }
});

// ---------------------------------------------------------------------------
// (f) Guards — zero new deps; return leg intact (D-05, D-03 unchanged clause)
// ---------------------------------------------------------------------------

test('guards: zero new dependencies; the /explore → CLI return leg stays intact (D-05)', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(
    Object.keys(pkg.dependencies).length,
    39,
    'dependency count pinned at 39 — 38 post-recharts keys (OQ-2, plan 04) + framer-motion, adopted as a real dependency for phase-9 editorial compositions (engine decision; scratch /motion-demo prototype deleted)',
  );
  assert.equal(
    pkg.dependencies.recharts,
    undefined,
    'no recharts key remains (OQ-2, plan 04)',
  );
  assert.equal(
    EXPLORE_TOUR_FINISH.linkHref,
    '/',
    'the tour finish card still links the CLI at / (unchanged clause of D-03, constants.ts:92)',
  );
});