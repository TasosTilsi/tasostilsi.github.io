/**
 * Red/green acceptance tests for plan EXPLORE-01-explore-shell-01 (Task 1 tracer).
 *
 * Runner: node --test tests/explore-shell.test.mjs  (Node built-in, zero npm deps — D-09)
 *
 * Two layers:
 *  1. Source-level invariants — hold against src/ immediately.
 *  2. Export-level invariants — hold against the static export (out/) produced
 *     by `npm run build`; they fail with "run npm run build" until then.
 *
 * Extended per task: Task 2 (font), Task 3 (theme) append their own blocks.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const exportHtml = join(root, 'out/explore.html');

// ---------------------------------------------------------------------------
// Task 1: tracer — route, IDE frame skeleton, dark token block, status bar
// ---------------------------------------------------------------------------

test('constants: 4 locked sections after the About+Contact merge, disjoint theme key, breadcrumb strings', () => {
  const src = read('src/components/explore/constants.ts');
  for (const id of ['about', 'experience', 'skills', 'projects']) {
    assert.ok(src.includes(`id: "${id}"`), `section ${id} locked (D-01)`);
  }
  assert.ok(
    !src.includes('id: "contact"'),
    'no standalone contact section — Contact merged into About (REV-04/D-05)',
  );
  assert.ok(src.includes('"portfolio-explore-theme"'), 'explore theme key');
  assert.ok(
    !/= ["']portfolio-theme["']/.test(src),
    'no constant assigned the CLI key (D-10)',
  );
  assert.ok(src.includes('"guest@tasostilsi"'), 'status user (D-03)');
  assert.ok(src.includes('":~/explore"'), 'status path (D-03)');
});

test('globals.css: .explore-shell dark token block appended, CLI blocks untouched', () => {
  const css = read('src/app/globals.css');
  assert.match(css, /\.explore-shell\s*\{/, 'scope marker block exists');
  assert.ok(
    css.includes('explore IDE tokens — scoped; CLI token blocks above are untouched (D-10)'),
    'required CSS comment',
  );
  assert.ok(css.includes('--background: 220 13% 9%;'), 'dark IDE background (UI-SPEC §9.2)');
  assert.ok(css.includes('--accent: 160 84% 45%;'), 'terminal-green accent');
  assert.ok(css.includes('--radius: 0.25rem;'), 'sharper IDE corners');
  // CLI dark block keeps its own background (D-10)
  assert.match(css, /\.dark\s*\{[^}]*--background: 0 0% 10%;/s);
  // chart tokens are inherited, not overridden, inside the shell block
  assert.ok(!/\.explore-shell\s*\{[^}]*--chart-1/s.test(css), 'no --chart override in shell block');
});

test('explore layout: before-paint script + data-driven metadata', () => {
  const src = read('src/app/explore/layout.tsx');
  assert.match(src, /classList\.remove\(["']dark["'],\s*["']light["']\)/, 'strips stale theme classes');
  assert.ok(src.includes('dangerouslySetInnerHTML'), 'inline before-paint script');
  assert.ok(src.includes('about.name'), 'metadata is data-driven (D-08)');
  assert.ok(!src.includes('fonts.googleapis'), 'no CDN font link');
});

test('header: 52px bar, window glyphs, truncating data-driven title', () => {
  const src = read('src/components/explore/explore-header.tsx');
  assert.ok(src.includes('h-[52px]'), 'px-based bar height');
  assert.ok(src.includes('aria-hidden'), 'decorative glyphs hidden');
  assert.ok(src.includes('about') === false, 'no hardcoded copy');
  assert.ok(src.includes('{name}') || src.includes('name'), 'renders name prop');
});

test('status bar: breadcrumb + live theme label + LIVE N/4 counter', () => {
  const src = read('src/components/explore/explore-status-bar.tsx');
  assert.ok(src.includes('EXPLORE_STATUS_USER'), 'breadcrumb user from constants');
  assert.ok(src.includes('EXPLORE_STATUS_PATH'), 'breadcrumb path from constants');
  assert.ok(
    src.includes('${visitedCount}/${EXPLORE_SECTIONS.length} sections visited'),
    'live counter from the visited store (EXPLORE-04c, D-06)',
  );
  assert.ok(
    !/0\/\$\{EXPLORE_SECTIONS\.length\} sections visited/.test(src),
    'no literal-0 counter remains — the stale assertion is superseded (R-4 renewal)',
  );
  assert.ok(src.includes('visitedCount'), 'visitedCount prop flows in (UI-SPEC §5)');
  assert.ok(src.includes('text-accent'), '4/4 celebration accent branch (E-13)');
  assert.ok(src.includes('aria-live="polite"'), 'right group announces (UI-SPEC §7)');
});

test('page: h-dvh flex shell with explore-shell marker, panel grid composed', () => {
  const sources = ['src/app/explore/page.tsx', 'src/components/explore/explore-shell.tsx']
    .filter((p) => existsSync(join(root, p)))
    .map((p) => read(p));
  const shell = sources.join('\n');
  assert.match(
    shell,
    /explore-shell flex h-dvh flex-col overflow-x-hidden bg-background text-foreground/,
    'shell root class combo (UI-SPEC §2.1)',
  );
  const page = read('src/app/explore/page.tsx');
  const panels = existsSync(join(root, 'src/components/explore/explore-panels.tsx'))
    ? read('src/components/explore/explore-panels.tsx')
    : page; // before plan 02 the tracer panel lived inline in page.tsx
  assert.match(
    panels,
    /id=\{section\.id\}|id="about"/,
    'About section id provided (drawer anchor target)',
  );
  const shellSrc = existsSync(join(root, 'src/components/explore/explore-shell.tsx'))
    ? read('src/components/explore/explore-shell.tsx')
    : '';
  // tabIndex 0 + aria-label live on <main> — in page.tsx (tracer) or in the
  // ExploreShell client boundary after Task 3 moves the frame there.
  assert.match(
    page + shellSrc,
    /tabIndex=\{0\}/,
    'main keyboard-scrollable (UI-SPEC §13)',
  );
  const code = (page + shellSrc).replace(/\/\*[\s\S]*?\*\//g, ''); // strip doc comments
  assert.ok(!code.includes('h-screen'), 'h-dvh only, never stacked h-screen');
});

// ---------------------------------------------------------------------------
// Task 2: JetBrains Mono via next/font, scoped to /explore (D-04, EXPLORE-01c)
// ---------------------------------------------------------------------------

test('fonts: JetBrains_Mono added additively, Geist variables untouched (D-10)', () => {
  const layout = read('src/app/layout.tsx');
  assert.ok(layout.includes('JetBrains_Mono'), 'JetBrains_Mono imported');
  assert.ok(layout.includes('geistMono'), 'Geist_Mono still declared (coexist)');
  assert.ok(layout.includes('geistSans'), 'Geist still declared (coexist)');
  assert.match(layout, /variable: ['"]--font-jetbrains['"]/);
  assert.match(layout, /\$\{jetbrainsMono\.variable\}/, 'variable appended to body className');
  // additive ordering: Geist variables come first, JetBrains appended after
  assert.ok(
    layout.indexOf('geistSans.variable') < layout.indexOf('jetbrainsMono.variable'),
    'Geist variables untouched ahead of JetBrains variable',
  );
});

test('fonts: .explore-shell font-family consumes --font-jetbrains (scoped, UI-SPEC §10)', () => {
  const css = read('src/app/globals.css');
  const shellBlock = css.slice(css.indexOf('.explore-shell'), css.indexOf('}', css.indexOf('.explore-shell')));
  assert.match(
    shellBlock,
    /font-family: var\(--font-jetbrains\), var\(--font-geist-mono\), Menlo, Monaco, 'Courier New', monospace;/,
  );
  // body rule untouched
  assert.match(css, /body\s*\{[^}]*var\(--font-geist-mono\)[^}]*\}/s);
});

// ---------------------------------------------------------------------------
// Task 3: hand-rolled explore theme (D-05, EXPLORE-01d)
// ---------------------------------------------------------------------------

test('theme: .light .explore-shell override block, CLI .light block untouched (D-10)', () => {
  const css = read('src/app/globals.css');
  assert.match(css, /\.light \.explore-shell\s*\{/);
  assert.ok(css.includes('--background: 220 20% 97%;'), 'light IDE background (UI-SPEC §9.3)');
  assert.ok(css.includes('--accent: 160 80% 28%;'), 'light IDE accent');
  assert.match(css, /\.light\s*\{[^}]*--background: 0 0% 93%;/s, 'CLI .light block keeps its values');
  assert.ok(
    !/\.light \.explore-shell\s*\{[^}]*--chart-1/s.test(css),
    'no --chart override in light shell block',
  );
});

test('theme: reduced-motion guard covers shell + portaled Sheet (UI-SPEC §12)', () => {
  const css = read('src/app/globals.css');
  assert.ok(css.includes('prefers-reduced-motion: reduce'));
  assert.ok(css.includes('body:has(.explore-shell) [data-state="open"]'), 'portal overlay covered');
  assert.ok(css.includes('body:has(.explore-shell) [data-state="closed"]'), 'portal content covered');
  assert.ok(css.includes('scroll-behavior: auto !important'), 'anchor scroll overridden');
});

test('theme: useExploreTheme — literal dark init, no prefers-color-scheme, CLI key untouched', () => {
  const src = read('src/components/explore/use-explore-theme.ts');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''); // strip comments
  assert.ok(src.includes('useExploreTheme'), 'hook exported');
  assert.ok(!code.includes('prefers-color-scheme'), 'no OS detection (UI-SPEC §17.7)');
  assert.ok(src.includes('EXPLORE_THEME_STORAGE_KEY'), 'persistence via explore key');
  assert.ok(!/= ["']portfolio-theme["']/.test(src), 'never reads/writes CLI key (D-05/D-10)');
  assert.match(src, /classList\.remove\(["']dark["'],\s*["']light["']\)/, 'class swap');
  assert.match(src, /useState<ExploreTheme>\(['"]dark['"]\)/, 'literal dark init — never documentElement during render');
});

test('theme: ExploreShell client boundary owns theme state, composes header/main/status', () => {
  const src = read('src/components/explore/explore-shell.tsx');
  assert.match(src, /["']use client["']/);
  assert.ok(src.includes('useExploreTheme()'), 'single source of truth');
  assert.ok(src.includes('<ExploreHeader'), 'composes header');
  assert.ok(src.includes('<ExploreStatusBar'), 'composes status bar');
  assert.match(
    src,
    /explore-shell flex h-dvh flex-col overflow-x-hidden bg-background text-foreground/,
    'shell root class combo moved here',
  );
  assert.ok(src.includes('aria-label="Portfolio sections"'), 'main pinned for keyboard scroll');
});

test('theme: header toggle is px-based 44px ghost button with target-theme icon', () => {
  const src = read('src/components/explore/explore-header.tsx');
  assert.ok(src.includes('h-[44px]') && src.includes('w-[44px]'), 'real px touch target (UI-SPEC §13)');
  assert.ok(src.includes('Sun') && src.includes('Moon'), 'target-theme icons (UI-SPEC §3)');
  assert.ok(src.includes('Switch to light theme'), 'aria-label swaps');
  assert.ok(src.includes('Switch to dark theme'));
  assert.ok(src.includes('type="button"'), 'explicit button type');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''); // strip comments
  assert.ok(!/transition/.test(code), 'no transition classes — instant swap (UI-SPEC §9.1)');
});

test('theme: page stays a server component wrapping ExploreShell', () => {
  const src = read('src/app/explore/page.tsx');
  assert.ok(src.includes('<ExploreShell'), 'client boundary for theme state');
  assert.ok(!src.includes('use client'), 'page remains a server component');
  assert.match(src, /about\.name/, 'data-driven props (D-08)');
});

// ---------------------------------------------------------------------------
// Plan 02 Task 1: tracer — Sheet drawer end-to-end
// (header toggle → left drawer → 5 anchors → panel ids; D-02, EXPLORE-01b)
// ---------------------------------------------------------------------------

test('drawer: composes Sheet side="left" with portal-safe explore-shell class', () => {
  const src = read('src/components/explore/explore-drawer.tsx');
  assert.match(src, /["']use client["']/);
  assert.ok(src.includes('side="left"'), 'left off-canvas (D-02)');
  assert.ok(src.includes('SheetTrigger'), 'toggle wired as Radix trigger');
  assert.match(
    src,
    /className=["'][^"']*explore-shell/,
    'SheetContent carries the portal scope class (UI-SPEC §5 hard requirement)',
  );
  assert.ok(src.includes('~/explore'), 'SheetTitle chrome copy (UI-SPEC §5)');
  assert.ok(src.includes('Jump to a section'), 'SheetDescription a11y guard');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''); // strip comments
  assert.ok(!code.includes('max-w-'), 'no width overrides — default left variant pinned');
});

test('drawer: 4 anchor items from EXPLORE_SECTIONS, 44px targets, decorative chart digits', () => {
  const src = read('src/components/explore/explore-drawer.tsx');
  assert.ok(src.includes('EXPLORE_SECTIONS'), 'items derive from the locked constant');
  assert.ok(src.includes('`#${section.id}`'), 'anchor hrefs derived from section ids');
  assert.ok(src.includes('min-h-[44px]'), 'real px touch targets (EXPLORE-06)');
  assert.ok(src.includes('padStart(2'), 'leading index digits 01…04');
  assert.ok(src.includes('aria-hidden'), 'digits decorative (W-3 fix)');
  for (let i = 1; i <= 4; i++) {
    assert.ok(src.includes(`text-chart-${i}`), `digit accent chart-${i}`);
  }
  assert.ok(!src.includes('text-chart-5'), 'no chart-5 digit — 4 sections after the merge (REV-04/E-14)');
  assert.ok(src.includes('hover:bg-sidebar-accent'), 'item hover state (UI-SPEC §5)');
  assert.ok(src.includes('tabular-nums'), 'digit numerals');
});

test('header: drawer toggle rightmost, 44px Menu button inside ExploreDrawer trigger', () => {
  const src = read('src/components/explore/explore-header.tsx');
  assert.ok(src.includes('Menu'), 'Menu icon drawer toggle');
  assert.ok(src.includes('ExploreDrawer'), 'toggle passed as ExploreDrawer trigger');
  assert.ok(src.includes('h-[44px]') && src.includes('w-[44px]'), '44px px-based target');
  const themeIdx = src.indexOf('onClick={onToggleTheme}');
  const drawerIdx = src.indexOf('<ExploreDrawer');
  assert.ok(themeIdx > -1 && drawerIdx > themeIdx, 'drawer toggle after theme toggle (UI-SPEC §3)');
});

test('panels: ExplorePanels renders stable section ids via PanelShell + total SECTION_BODIES', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  assert.ok(src.includes('EXPLORE_SECTIONS'), 'panels derive from the locked constant');
  assert.ok(src.includes('SECTION_BODIES'), 'total body registry drives panel bodies (plan 02)');
  assert.ok(src.includes('id={section.id}'), 'stable anchor target ids');
  assert.ok(
    read('src/components/explore/panel-shell.tsx').includes('aria-label={label}'),
    'labelled sections (aria-label lands in PanelShell)',
  );
  const page = read('src/app/explore/page.tsx');
  assert.ok(page.includes('<ExplorePanels'), 'page composes the panel grid');
});

// ---------------------------------------------------------------------------
// Plan 02: real content replaces placeholders
// (humor machinery removed, section bodies registered — D-06, EXPLORE-03/07)
// ---------------------------------------------------------------------------

test('constants: placeholder humor machinery removed, pointer register lives (plan 02 D-06)', () => {
  const src = read('src/components/explore/constants.ts');
  assert.ok(!src.includes('EXPLORE_PANEL_HUMOR'), 'humor map removed from constants');
  const pointer = read('src/components/explore/sections/terminal-pointer.tsx');
  assert.ok(pointer.includes("'// more: '"), 'pointer register locked');
  assert.ok(pointer.includes('in the terminal'), 'pointer chrome complete');
});

test('panel-shell: chrome anatomy — chip, label, body slot; hover-inert; sections registered', () => {
  const shell = read('src/components/explore/panel-shell.tsx');
  assert.ok(shell.includes('h-2 w-2') && shell.includes('rounded-full'), '8px accent chip');
  assert.ok(shell.includes('id={id}') && shell.includes('aria-label={label}'), 'labelled section');
  assert.ok(shell.includes('text-sm font-medium'), 'label typography');
  const code = shell.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!code.includes('hover:'), 'no hover affordance (UI-SPEC §17.6 pinned)');
  assert.ok(!code.includes('cursor-pointer'), 'no pointer cursor');
  assert.ok(!code.includes('tabIndex'), 'not focusable');
  const src = read('src/components/explore/explore-panels.tsx');
  for (const s of ['AboutSection', 'ExperienceSection', 'SkillsSection', 'ProjectsSection'])
    assert.ok(src.includes(s), `section body registered: ${s}`);
  assert.ok(!src.includes('ContactSection'), 'no contact body — Contact merged into About (REV-04/D-05)');
});

test('panels: responsive grid 2×2 after the merge — zero col-spans, per-section chart accents', () => {
  const src = read('src/components/explore/explore-panels.tsx');
  assert.match(src, /grid-cols-1 gap-4 md:grid-cols-2/, '1/2-col grid (REV-04/D-04)');
  assert.ok(!src.includes('lg:grid-cols-3'), 'lg tier drops to 2 columns (D-04)');
  for (let i = 1; i <= 4; i++) assert.ok(src.includes(`chart-${i}`), `accent mapping chart-${i}`);
  assert.ok(!src.includes('chart-5'), 'no chart-5 accent — 4 sections only (D-05)');
  assert.ok(!src.includes('EXPLORE_PANEL_HUMOR'), 'humor constant gone (plan 02, D-06)');
  assert.ok(src.includes('<PanelShell'), 'shared §3 chrome composed');
  assert.ok(src.includes('SECTION_BODIES'), 'bodies from total registry (plan 02)');
  // Zero-empty-cells invariant: no col-span class exists anywhere — every
  // panel occupies exactly one cell of the 2×2 (D-04).
  assert.ok(
    (src.match(/(sm|md|lg|xl):col-span/g) || []).length === 0,
    'no col-span classes anywhere — zero empty cells at every width (D-04)',
  );
  assert.ok(!/section\.id === ['"]about['"]/.test(src), 'no span conditional survives the merge');
});

// ---------------------------------------------------------------------------
// Plan 02 Task 3: typewriter intro from real data
// (reduced-motion fallback + sr-only h1 — D-07, EXPLORE-01)
// ---------------------------------------------------------------------------

test('intro: ExploreIntro reuses the untouched CLI TypingEffect with locked timing', () => {
  const src = read('src/components/explore/explore-intro.tsx');
  assert.match(src, /from ['"]@\/components\/cli\/TypingEffect['"]/, 'CLI component reused (D-07)');
  assert.ok(src.includes('TypingEffect'), 'TypingEffect rendered');
  assert.match(src, /speed=\{30\}/, 'speed 30 pinned (UI-SPEC §4)');
  assert.match(src, /delay=\{400\}/, 'delay 400ms pinned');
  assert.ok(src.includes('name') && src.includes('title'), 'real data props');
});

test('intro: reduced-motion check once on mount, TypingEffect not rendered under reduce', () => {
  const src = read('src/components/explore/explore-intro.tsx');
  assert.match(src, /["']use client["']/);
  assert.ok(src.includes('prefers-reduced-motion'), 'reduced-motion query (UI-SPEC §12)');
  assert.ok(src.includes('matchMedia'), 'matchMedia check');
  assert.ok(src.includes('useEffect'), 'mount-effect check — before the 400ms delay fires');
});

test('intro: sr-only h1 carries full name—title, reserved height, strip chrome', () => {
  const src = read('src/components/explore/explore-intro.tsx');
  assert.match(src, /<h1 className=["']sr-only["']>/, 'sr-only h1 (a11y + no-JS contract)');
  assert.ok(src.includes('aria-hidden'), 'animated strip hidden from AT');
  assert.ok(src.includes('❯'), 'accent prefix');
  assert.ok(src.includes('min-h-[40px]') && src.includes('md:min-h-[20px]'), 'px-reserved height (no CLS)');
  assert.ok(src.includes('border-b') && src.includes('shrink-0'), 'strip chrome');
});

test('intro: page composes ExploreIntro between header and main (UI-SPEC §1 order)', () => {
  const page = read('src/app/explore/page.tsx');
  const shell = read('src/components/explore/explore-shell.tsx');
  assert.ok(page.includes('<ExploreIntro'), 'page renders the intro with data props');
  assert.match(page, /name=\{portfolioData\.about\.name\}/, 'name from data (D-08)');
  const pageIdx = page.indexOf('<ExploreIntro');
  assert.ok(pageIdx > -1, 'intro composed at the page call site');
  // region order: the shell renders header → intro → main → status bar
  // ('<main\n' anchors to the JSX element, not the doc comment's `<main>`)
  const shellOrder = [
    shell.indexOf('<ExploreHeader'),
    shell.indexOf('{intro}'),
    shell.indexOf('<main\n'),
    shell.indexOf('<ExploreStatusBar'),
  ];
  assert.ok(shellOrder.every((i) => i > -1), 'all four regions composed');
  assert.ok(
    shellOrder[0] < shellOrder[1] && shellOrder[1] < shellOrder[2] && shellOrder[2] < shellOrder[3],
    'header → typewriter strip → main → status bar (UI-SPEC §1)',
  );
});

// ---------------------------------------------------------------------------
// Export-level invariants (require `npm run build` first)
// ---------------------------------------------------------------------------

test('static export: /explore IDE frame emitted into out/explore.html', () => {
  assert.ok(existsSync(exportHtml), 'out/explore.html missing — run `npm run build` first');
  const html = readFileSync(exportHtml, 'utf8');
  assert.ok(html.includes('explore-shell'), 'scope marker class in emitted HTML');
  assert.ok(html.includes('Anastasios Tilsizoglou'), 'data-driven name (EXPLORE-07)');
  assert.ok(html.includes('guest@tasostilsi'), 'breadcrumb user');
  assert.ok(html.includes(':~/explore'), 'breadcrumb path');
  assert.ok(html.includes('0/4 sections visited'), 'static counter over 4 sections (D-03; REV-04)');
  assert.match(
    html,
    /classList\.remove\(["']dark["'],\s*["']light["']\)/,
    'before-paint script emitted ahead of shell markup',
  );
});

test('static export: CLI + resume untouched, no new font CDN on /explore', () => {
  assert.ok(existsSync(join(root, 'out/index.html')), 'out/index.html still emitted (D-10)');
  assert.ok(existsSync(join(root, 'out/resume.html')), 'out/resume.html still emitted (D-10)');
  if (existsSync(exportHtml)) {
    const html = readFileSync(exportHtml, 'utf8');
    assert.ok(
      html.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome'),
      'pre-existing FA CDN still present (unchanged surface)',
    );
    assert.ok(!html.includes('fonts.googleapis'), 'no new runtime font CDN (EXPLORE-01c)');
  }
});

test('static export: JetBrains Mono self-hosted in emitted CSS (EXPLORE-01c)', () => {
  assert.ok(existsSync(exportHtml), 'out/explore.html missing — run `npm run build` first');
  const cssDir = join(root, 'out/_next/static/css');
  assert.ok(existsSync(cssDir), 'emitted CSS dir missing');
  const cssFiles = readdirSync(cssDir).filter((f) => f.endsWith('.css'));
  const combined = cssFiles.map((f) => readFileSync(join(cssDir, f), 'utf8')).join('\n');
  assert.ok(combined.includes('JetBrains Mono'), 'self-hosted @font-face present (no CDN)');
});

test('static export: theme script + toggle emitted into out/explore.html', () => {
  assert.ok(existsSync(exportHtml), 'out/explore.html missing — run `npm run build` first');
  const html = readFileSync(exportHtml, 'utf8');
  assert.ok(html.includes('portfolio-explore-theme'), 'before-paint script reads the explore key');
  assert.ok(html.includes('Switch to light theme'), 'theme toggle aria-label (SSR default dark)');
  assert.ok(html.includes('classList.remove("dark", "light")'), 'strips stale classes before paint');
});

test('static export: intro strip — sr-only h1 full name—title server-rendered', () => {
  assert.ok(existsSync(exportHtml), 'out/explore.html missing — run `npm run build` first');
  const html = readFileSync(exportHtml, 'utf8');
  assert.ok(html.includes('<h1'), 'sr-only h1 emitted (a11y + no-JS contract, UI-SPEC §4)');
  assert.ok(
    html.includes('Anastasios Tilsizoglou — Senior Software Engineer in Test'),
    'full real name—title from data (D-07)',
  );
  assert.ok(html.includes('Open section navigation'), 'drawer toggle aria-label (SSR)');
});