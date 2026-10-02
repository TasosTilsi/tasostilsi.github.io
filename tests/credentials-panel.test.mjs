/**
 * Red/green acceptance suite for plan EXPLORE-11-credentials-panel-revision-01
 * (Task 1 = RED on record; Task 2 = the GREEN implementation).
 *
 * Runner: node --test tests/credentials-panel.test.mjs  (Node built-in, zero
 * npm deps — the house convention, tests/explore-shell.test.mjs).
 *
 * Two layers, modelled on the existing suite:
 *  1. Source/data-level rows — hold against src/ immediately, and are the ONLY
 *     place the client-only contracts are asserted (see the HARD BOUNDARY).
 *  2. Export-level rows — hold against out/index.html from `npm run build`.
 *
 * HARD BOUNDARY (measured, plan <context>): SSR emits the panel chrome, the
 * three tab labels, the status counter and the DEFAULT Articles tab body only.
 *   - The closed drawer's Sheet content is Presence-gated on `useState(false)`,
 *     so the anchors (the `#credentials` hash target, `05 Credentials`) never
 *     reach the export — the drawer derivation is asserted at SOURCE level.
 *   - Radix TabsContent renders through Presence with
 *     `present: forceMount || isSelected`; with `defaultValue="articles"` and no
 *     forceMount, the Certifications and Presentations bodies exist only after
 *     hydration — their content is asserted at SOURCE/DATA level.
 * Asserting any of those against out/index.html would make this suite
 * unfixable, not stricter.
 *
 * SCRIPT STRIPPING IS LOAD-BEARING (measured): the RSC payload inlined in the
 * same document serializes the client island's full props — all 15 article
 * names, non-featured included — so an unstripped row asserting an article name
 * would pass on JSON rather than on rendered markup. Every export row in this
 * file reads the script-stripped document via readExportMarkup().
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const exportHtmlPath = join(root, 'out/index.html');

const readExport = () => {
  assert.ok(existsSync(exportHtmlPath), 'out/index.html missing — run `npm run build` first');
  return readFileSync(exportHtmlPath, 'utf8');
};

/**
 * The ONLY export reader used by the rows below. The script strip is pinned by
 * `grep -c "replace(/<script" tests/credentials-panel.test.mjs` ≥ 1.
 */
const readExportMarkup = () => readExport().replace(/<script[\s\S]*?<\/script>/g, '');

/** Strip doc + line comments before class-utility scans (comments name retired utilities). */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const PANEL = 'src/components/explore/sections/credentials-section.tsx';
const SECTIONS = 'src/components/explore/constants.ts';
const PANELS = 'src/components/explore/explore-panels.tsx';
const DRAWER = 'src/components/explore/explore-drawer.tsx';
const CSS = 'src/app/globals.css';
const DATA_JSON = 'src/data/portfolio-main-data.json';
const DATA_DTS = 'src/data/portfolio-main-data.d.ts';

const data = JSON.parse(read(DATA_JSON));

/** The EXPLORE_SECTIONS literal block only (never the rest of the module). */
const sectionsBlock = (() => {
  const src = read(SECTIONS);
  const start = src.indexOf('export const EXPLORE_SECTIONS');
  return src.slice(start, src.indexOf('] as const;', start));
})();

/** The EXPLORE_TOUR_STEPS literal table only. */
const tourStepsBlock = (() => {
  const src = read(SECTIONS);
  const start = src.indexOf('export const EXPLORE_TOUR_STEPS');
  return src.slice(start);
})();

// ---------------------------------------------------------------------------
// 1. Constants — the 5-section re-map (CONTEXT D-04)
// ---------------------------------------------------------------------------

test('constants: EXPLORE_SECTIONS appends credentials as the 5th entry (D-04)', () => {
  const ids = [...sectionsBlock.matchAll(/id:\s*["']([a-z-]+)["']/g)].map((m) => m[1]);
  assert.deepEqual(
    ids,
    ['about', 'skills', 'experience', 'projects', 'credentials'],
    'append-only 5th section — DOM order = visual order, projects stays 4th (UI-SPEC §2.1/§7)',
  );
  assert.match(sectionsBlock, /label:\s*["']Credentials["']/, 'locked label (UI-SPEC §2.2)');
  assert.ok(
    sectionsBlock.indexOf('credentials') > sectionsBlock.indexOf('projects'),
    'credentials is APPENDED after projects — no reorder',
  );
});

test('constants: EXPLORE_TOUR_ACCENTS gains credentials chart-5, map stays total (UI-SPEC §7)', () => {
  const src = read(SECTIONS);
  const start = src.indexOf('export const EXPLORE_TOUR_ACCENTS');
  const accents = src.slice(start, src.indexOf('};', start));
  assert.match(accents, /credentials:\s*["']bg-chart-5["']/, 'credentials chip accent (UI-SPEC §7)');
  assert.ok(
    !/four sections/i.test(accents),
    'doc comment no longer claims a 4-section map (the map is total over ExploreSectionId)',
  );
});

test('constants: welcome copy says five sections, the 6-step tour table is unchanged', () => {
  const src = read(SECTIONS);
  assert.ok(src.includes('five sections'), 'welcome body copy must not lie (UI-SPEC §9 TOUR-01)');
  assert.ok(!src.includes('four sections'), 'no stale four-sections copy remains');

  const stepIds = [...tourStepsBlock.matchAll(/^\s{4}id:\s*["'](\w+)["']/gm)].map((m) => m[1]);
  assert.deepEqual(
    stepIds,
    ['welcome', 'about', 'experience', 'skills', 'projects', 'finish'],
    'locked 6-step table — welcome → about → experience → skills → projects → finish (UI-SPEC §7)',
  );
  assert.equal(stepIds.length, 6, 'exactly six tour steps — no Credentials step is added (deferred)');
  assert.ok(
    !/sectionId:\s*["']credentials["']/.test(tourStepsBlock),
    'no tour step targets credentials — the wizard sequence stays 6 (UI-SPEC §7)',
  );
});

// ---------------------------------------------------------------------------
// 2. Data + type contract — featured flag (D-03) and the MEASURED cert shape
// ---------------------------------------------------------------------------

test('data: the single presentation gains featured:true, its .d.ts flag lands same-commit (D-03/R-7)', () => {
  assert.equal(data.presentations.length, 1, 'one presentation entry (nothing deleted)');
  assert.equal(data.presentations[0].featured, true, 'Allure Reporting is featured (D-03)');
  assert.match(data.presentations[0].link, /^http/, 'presentation link stays a real URL');

  const dts = read(DATA_DTS);
  const start = dts.indexOf('export interface Presentation');
  const block = dts.slice(start, dts.indexOf('}', start));
  assert.match(block, /featured\?:\s*boolean/, 'Presentation gains featured?: boolean (same commit, R-7)');
  assert.match(block, /link:\s*string;/, 'Presentation.link stays REQUIRED — never loosened (TYPE-01)');
  assert.ok(!/link\?:\s*string/.test(block), 'link is not made optional (TYPE-01 resolution)');
});

test('data: nothing deleted — 15 articles, 45 certifications, 1 presentation', () => {
  assert.equal(data.articles.length, 15, 'all articles retained — full collection stays CLI-reachable');
  assert.equal(data.certifications.length, 45, 'all certifications retained');
  assert.equal(data.presentations.length, 1, 'presentation retained');
});

test('data: featured certifications are 5 / 0 http / 4 null / 1 verification-ID (MEASURED contract)', () => {
  const featured = data.certifications.filter((c) => c.featured);
  assert.equal(featured.length, 5, 'five featured certifications');

  // The measured truth, not an assumption: NO featured certification carries an
  // http URL. The Certifications tab therefore renders ZERO anchors BY DESIGN
  // (UI-SPEC §5.3/§5.4) — asserting an http anchor here would make Task 2's
  // GREEN unreachable.
  assert.equal(
    featured.filter((c) => typeof c.link === 'string' && c.link.startsWith('http')).length,
    0,
    'zero featured certifications have an http link — the tab is plain text by design',
  );
  assert.equal(
    featured.filter((c) => c.link === null).length,
    4,
    'four featured certifications carry a null link',
  );
  assert.equal(
    featured.filter((c) => c.link === 'ID: GRTB-24-1S20-CTFL').length,
    1,
    'exactly one featured certification stores its verification ID in link',
  );

  const featuredArticles = data.articles.filter((a) => a.featured);
  assert.equal(featuredArticles.length, 5, 'five featured articles');
  assert.ok(
    featuredArticles.every((a) => typeof a.link === 'string' && a.link.startsWith('http')),
    'every featured article carries a real URL (the Articles tab keeps real anchors)',
  );
});

// ---------------------------------------------------------------------------
// 3. Panel source — the calm 3-tab island (UI-SPEC §2.3/§2.4/§3/§4.2/§6)
// ---------------------------------------------------------------------------

test('panel: client leaf island over the installed shadcn Tabs, default Articles', () => {
  assert.ok(existsSync(join(root, PANEL)), `${PANEL} exists`);
  const src = read(PANEL);
  assert.match(src, /["']use client["']/, 'Tabs is a client primitive (UI-SPEC §10)');
  assert.match(src, /import\s*\{[^}]*Tabs[^}]*\}\s*from\s*['"]@\/components\/ui\/tabs['"]/, 'shadcn Tabs reused');
  assert.match(src, /defaultValue=["']articles["']/, 'default tab Articles — the SSR-rendered body (UI-SPEC §2.3/§8)');
  assert.ok(
    !src.includes('forceMount'),
    'no forceMount — mounting inactive tabs server-side would change the pinned SSR contract (UI-SPEC §8)',
  );
  for (const label of ['Articles', 'Certifications', 'Presentations']) {
    assert.ok(src.includes(label), `tab label "${label}" rendered (locked)`);
  }
});

test('panel: calm row vocabulary — 44px rows, icons, exp-nudge arrow', () => {
  const src = read(PANEL);
  assert.ok(src.includes('min-h-[44px]'), '44px-equivalent target on the ROW rail only (A11Y-01/§2.4)');
  for (const icon of ['FileText', 'Award', 'MonitorPlay']) {
    assert.ok(src.includes(icon), `lucide ${icon} mapped to its tab (ICON-01)`);
  }
  assert.ok(src.includes('ArrowUpRight'), 'external-link arrow (ARROW-01)');
  assert.ok(src.includes('exp-nudge'), 'phase-7 nudge vocabulary reused — no new motion (MOTION-01)');
  assert.ok(src.includes('tabular-nums'), 'date numerals (UI-SPEC §2.4)');
  assert.ok(src.includes('truncate'), 'long titles truncate at 375px (UI-SPEC §2.5)');
  assert.ok(src.includes('group-hover:underline'), 'row hover underline (UI-SPEC §3.2)');
  assert.match(
    src,
    /focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2/,
    'the shared focus ring recipe (UI-SPEC §3.2)',
  );
});

/**
 * RENEWED (user directive, revision of UI-SPEC §2.3): the trigger height
 * contract moved from a 44px TEXT trigger to a 56px STACKED icon-over-label
 * segment, so the old "triggers AND rows" reading of A11Y-01 is deliberately
 * retired — the rows keep their 44px rail, the triggers do not. Both the new
 * machinery (present) and the retired inline-pill recipe (absent) are asserted,
 * so the old anatomy cannot creep back.
 */
test('panel: capsule tab bar — 56px stacked segments, accent+pill active, muted inactive', () => {
  const src = stripComments(read(PANEL));
  assert.ok(src.includes('min-h-[56px]'), '56px stacked trigger, real px literal (A11Y-01 revision)');
  assert.match(src, /rounded-full/, 'the capsule and its segments are fully rounded');
  assert.match(
    src,
    /flex-1 flex-col items-center justify-center gap-1/,
    'each trigger is an equal third of the capsule, icon above label',
  );
  assert.match(src, /bg-muted\/70/, 'the capsule surface contrasts with the card');
  assert.match(src, /shadow-black\/10 dark:shadow-black\/30/, 'elevation stays legible in both themes');
  assert.match(src, /data-\[state=active\]:bg-accent\/10/, 'active = soft accent-tinted pill (user decision)');
  assert.match(src, /data-\[state=active\]:text-accent/, 'active = accent icon AND accent label');
  assert.match(src, /data-\[state=inactive\]:text-muted-foreground/, 'inactive = muted icon/label, no background');
  assert.ok(src.includes('exp-tab-icon') && src.includes('exp-tab-label'), 'hover motion rides the .exp-tab* hooks');

  // Each locked ICON-01 glyph renders ABOVE its label, aria-hidden, 16px.
  for (const [value, icon] of [
    ['articles', 'FileText'],
    ['certifications', 'Award'],
    ['presentations', 'MonitorPlay'],
  ]) {
    const trigger = src.match(new RegExp(`<TabsTrigger value="${value}"[\\s\\S]*?</TabsTrigger>`));
    assert.ok(trigger, `a TabsTrigger for ${value} is rendered`);
    assert.match(
      trigger[0],
      new RegExp(`<${icon}\\s+aria-hidden="true"[^>]*/>\\s*<span`),
      `${icon} is aria-hidden and sits ABOVE the ${value} label`,
    );
  }

  // Gone-checks — the retired inline muted-pill list recipe.
  assert.ok(!src.includes('flex-wrap'), 'the wrapping inline TabsList recipe is gone');
  const triggerClass = src.match(/const TAB_TRIGGER =[\s\S]*?;/);
  assert.ok(triggerClass, 'the trigger recipe lives in one shared constant, not three copies');
  assert.ok(
    !triggerClass[0].includes('min-h-[44px]'),
    'the 44px TRIGGER pin is gone — only the row rail keeps min-h-[44px]',
  );
});

test('panel: featured-only, data-driven copy, no framer-motion (EXPLORE-07 / MOTION-01)', () => {
  const src = read(PANEL);
  assert.match(src, /\.filter\(\(\w+\)\s*=>\s*\w+\.featured\)/, 'featured-only filtering (EXPLORE-07)');
  assert.match(src, /\w+\.name/, 'row primary text reads the JSON `name` field');
  assert.match(src, /\w+\.date/, 'row secondary text reads the JSON `date` field');
  assert.ok(!/\w+\.title\b/.test(stripComments(src)), 'no `.title` read — all three collections expose `name`');
  assert.ok(!src.includes('framer-motion'), 'no framer-motion in any Credentials file (MOTION-01)');
});

test('panel: empty states are the three pinned dash-free strings (UI-SPEC §4.2 EMPTY-01)', () => {
  const src = read(PANEL);
  for (const empty of ['No featured articles.', 'No featured certifications.', 'No featured presentations.']) {
    assert.ok(src.includes(empty), `empty-state copy rendered verbatim: "${empty}"`);
  }
});

test('panel: the anchor guard is URL-only — ID strings and null links stay plain text (§5.3/§5.4)', () => {
  const src = read(PANEL);
  // The single named predicate: a row becomes an anchor ONLY for an http(s) URL.
  assert.match(
    src,
    /link\??\.startsWith\(\s*['"]http['"]\s*\)/,
    'the anchor branch is URL-guarded by a predicate on `link` (greppable)',
  );
  assert.ok(src.includes('·'), 'the combined `date · ID` secondary line separator (CERT-ID-01)');
  assert.ok(!src.includes('href={certification.link}'), 'the certification link is never an unconditional href');
  assert.ok(!src.includes('href={cert.link}'), 'the certification link is never an unconditional href');
  assert.ok(!src.includes('Allure Reporting'), 'no hardcoded presentation copy — data-driven');
  assert.ok(!src.includes('GRTB-24-1S20-CTFL'), 'no hardcoded verification ID — data-driven');
});

// ---------------------------------------------------------------------------
// 4. Registry wiring + drawer derivation (five total Record<ExploreSectionId>)
// ---------------------------------------------------------------------------

test('panels: credentials accent, body closure, and the exact natural-height placement', () => {
  const src = read(PANELS);
  assert.ok(src.includes("credentials: 'bg-chart-5'"), 'ACCENTS gains chart-5 (UI-SPEC §2.2)');
  assert.match(src, /credentials:\s*\(\{\s*data\s*\}\)\s*=>\s*<CredentialsSection/, 'SECTION_BODIES closure wired');
  assert.match(
    src,
    /credentials:\s*\{\s*wrapper:\s*'',\s*shell:\s*'',\s*gate:\s*false\s*\}/,
    'placement is the exact natural-height shape (about/skills), not a vague empty entry',
  );
  const placement = src.match(/credentials:\s*\{[^}]*\}/);
  assert.ok(placement, 'credentials placement entry present');
  for (const forbidden of ['md:sticky', 'md:h-', 'md:col-span-2']) {
    assert.ok(
      !placement[0].includes(forbidden),
      `credentials placement carries no ${forbidden} — the panel is not sticky (UI-SPEC §2.2)`,
    );
  }
  assert.match(src, /grid-cols-1 gap-4 md:grid-cols-2/, 'plain 2-col split pinned — no ratio utility (LAYOUT-01)');
});

test('drawer: credentials digit accent + the derived 05 anchor (source-level, the Sheet is client-only)', () => {
  const src = read(DRAWER);
  assert.ok(src.includes("credentials: 'text-chart-5'"), 'DIGIT_ACCENTS gains chart-5 (UI-SPEC §3.4)');
  assert.ok(src.includes('`#${section.id}`'), 'the 5th anchor href derives from the array');
  assert.ok(src.includes("String(i + 1).padStart(2, '0')"), 'the 5th index derives as 05');
});

test('grid: DOM order = visual order — no order-* utility anywhere in the grid chain', () => {
  for (const file of [PANELS, DRAWER]) {
    assert.ok(!/\border-/.test(stripComments(read(file))), `${file} uses no order-* utility (UI-SPEC §2.1)`);
  }
});

// ---------------------------------------------------------------------------
// 5. CSS — one added stagger step, the pre-existing reduced-motion guard intact
// ---------------------------------------------------------------------------

test('css: the stagger cascade gains nth-child(5) at 160ms, reduced-motion guard untouched', () => {
  const css = read(CSS);
  assert.ok(
    css.includes('nth-child(5) { animation-delay: 160ms; }'),
    'the +40ms cadence extends to the 5th grid child (MOTION-01)',
  );
  assert.ok(css.includes('.explore-shell *,'), 'the existing reduced-motion guard still matches the shell subtree');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'no new guard or exception added (D-05)');
});

test('css: the capsule tab hooks are shell-scoped, so the ONE guard suppresses them (MOTION-01/D-05)', () => {
  const css = read(CSS);
  for (const hook of ['.exp-tab', '.exp-tab-icon', '.exp-tab-label']) {
    assert.ok(
      css.includes(`.explore-shell ${hook}`),
      `${hook} is declared under .explore-shell — the existing guard covers it, no second suppressor`,
    );
  }
  assert.match(
    css,
    /\.explore-shell \.exp-tab\[data-state='inactive'\]:hover \.exp-tab-icon/,
    'inactive hover lifts the icon 2px (the pinned hover behaviour)',
  );
  assert.match(
    css,
    /\.explore-shell \.exp-tab\[data-state='inactive'\] \{\s*opacity: 0\.85;/,
    'inactive sits at 0.85 emphasis until hover/focus',
  );
  assert.match(
    css,
    /\.explore-shell \.exp-tab,[\s\S]*?transition: opacity 200ms/,
    'the capsule rides the 200ms floor — the motion region pins 200–280ms, the directive 150–200ms',
  );
  assert.equal(
    (css.match(/@media \(prefers-reduced-motion: reduce\)/g) || []).length,
    1,
    'exactly one reduced-motion guard in the file — the new hooks reuse it',
  );
});

// ---------------------------------------------------------------------------
// 6. Export rows — ONLY the SSR-reachable surface, always on the stripped doc
// ---------------------------------------------------------------------------

test('export: the credentials panel chrome + tab labels land in the static export (§8)', () => {
  const html = readExportMarkup();
  assert.ok(html.includes('id="credentials"'), 'the panel section landmark is server-rendered');
  assert.ok(html.includes('Credentials'), 'the panel label is server-rendered');
  assert.ok(html.includes('Certifications'), 'tab label 2 is server-rendered');
  assert.ok(html.includes('Presentations'), 'tab label 3 is server-rendered');
  assert.ok(html.includes('0/5 sections visited'), 'the counter re-maps to N/5 (D-04)');
});

test('export: the default Articles tab body renders its featured rows as real text (§8)', () => {
  const html = readExportMarkup();
  // Quote-free substrings only: React escapes `'` as &#x27; in text children,
  // and the RSC payload (stripped away) is what carries the rest of the data.
  const featuredNames = data.articles.filter((a) => a.featured).map((a) => a.name);
  const substrings = ['Core Design Patterns for Test Automation', 'Flaky Tests Driving You Crazy?'];
  for (const needle of substrings) {
    assert.ok(
      featuredNames.some((name) => name.includes(needle)),
      `"${needle}" is a real substring of a featured article name — the export row is data-derived`,
    );
    assert.ok(html.includes(needle), `featured article renders as text in the export: "${needle}"`);
  }
  // The script strip must not have removed genuine rendered text.
  assert.ok(html.includes('DeepIndex'), 'pre-existing server-rendered article text survives the strip');
});

test('export: five PanelShell mono index spans, one of them the credential 05 (§2.2)', () => {
  const html = readExportMarkup();
  // The full pinned class signature — a bare `>05<` substring already occurs
  // once elsewhere in the document and would be a false positive.
  const spans =
    html.match(
      /aria-hidden="true" class="ml-auto select-none font-mono text-2xl font-medium leading-none tabular-nums text-muted-foreground\/50">[0-9]{2}<\/span>/g,
    ) || [];
  assert.equal(spans.length, 5, `exactly five panel index spans render — found ${spans.length}`);
  for (const digits of ['01', '02', '03', '04', '05']) {
    assert.ok(
      spans.some((s) => s.endsWith(`>${digits}</span>`)),
      `a panel carries the zero-padded index ${digits}`,
    );
  }
});

test('export: the client-only surface stays OUT of the static export (boundary proof)', () => {
  const html = readExportMarkup();
  // NEGATIVE only — and deliberately so. The drawer Sheet is closed and the two
  // inactive tab bodies are hydration-only, so a POSITIVE export assertion on
  // any of these would make this suite unfixable. Their real contracts are the
  // source/data rows above: the drawer anchor is row 4, the presentation name
  // and the verification ID are rows 2/3 (data + panel source).
  const clientOnlyMarkup = [
    '#credentials', // the drawer anchor href — derived in explore-drawer.tsx, never exported
    'Allure Reporting', // presentations tab body — hydration-only
    'GRTB-24-1S20-CTFL', // certifications tab body — hydration-only
  ];
  for (const clientOnly of clientOnlyMarkup) {
    assert.ok(
      !html.includes(clientOnly),
      `"${clientOnly}" is client-only — it must NOT reach the export`,
    );
  }
  assert.ok(existsSync(exportHtmlPath), 'the export row actually read a built document');
});
