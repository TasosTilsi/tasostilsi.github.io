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
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const exportHtml = join(root, 'out/explore.html');

// ---------------------------------------------------------------------------
// Task 1: tracer — route, IDE frame skeleton, dark token block, status bar
// ---------------------------------------------------------------------------

test('constants: 5 locked sections, disjoint theme key, breadcrumb strings', () => {
  const src = read('src/components/explore/constants.ts');
  for (const id of ['about', 'experience', 'skills', 'projects', 'contact']) {
    assert.ok(src.includes(`id: "${id}"`), `section ${id} locked (D-01)`);
  }
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

test('status bar: breadcrumb + live theme label + static 0/5 counter', () => {
  const src = read('src/components/explore/explore-status-bar.tsx');
  assert.ok(src.includes('EXPLORE_STATUS_USER'), 'breadcrumb user from constants');
  assert.ok(src.includes('EXPLORE_STATUS_PATH'), 'breadcrumb path from constants');
  assert.ok(
    src.includes('0/${EXPLORE_SECTIONS.length} sections visited'),
    'static counter from constant (D-03)',
  );
  assert.ok(src.includes('aria-live="polite"'), 'right group announces (UI-SPEC §7)');
});

test('page: h-dvh flex shell with explore-shell marker, one About placeholder', () => {
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
  assert.match(page, /id="about"/, 'About placeholder panel');
  assert.match(page, /tabIndex=\{0\}/, 'main keyboard-scrollable (UI-SPEC §13)');
  const code = page.replace(/\/\*[\s\S]*?\*\//g, ''); // strip doc comments first
  assert.ok(!code.includes('h-screen'), 'h-dvh only, never stacked h-screen');
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
  assert.ok(html.includes('0/5 sections visited'), 'static counter (D-03)');
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