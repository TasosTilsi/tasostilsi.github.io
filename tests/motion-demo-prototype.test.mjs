/**
 * Throwaway contract suite for the /motion-demo engine-comparison prototype
 * (scratch page — deleted together with the page after the engine decision).
 *
 * Pins the observable contract the user will judge the engines by:
 *   (a) the page shell: metadata title, exact banner, labelled divider;
 *   (b) engine parity: BOTH engines consume the same shared ENTRY_MOTION
 *       keyframes and shared card chrome (single source of truth);
 *   (c) engine A mechanics: passive window scroll listener, rAF coalescing,
 *       full listener/frame cleanup, transform/opacity writes only, and
 *       reduced-motion → opacity-only (no translate written);
 *   (d) engine B mechanics: framer-motion useScroll + useTransform +
 *       useReducedMotion with the y channel zeroed under reduce;
 *   (e) the keyframe contract itself: outgoing 0→-80px / 1→0.15→0, incoming
 *       120px→0 / 0→1, coexistence windows at 1/3 and 2/3 ± 1/12;
 *   (f) isolation: nothing outside the motion-demo directory references the
 *       route (scratch page must not be linked from anywhere);
 *   (g) the temporary framer-motion dependency is on record.
 *
 * Runner: node --test tests/motion-demo-prototype.test.mjs (no npm test
 * script — house convention, see explore-routing.test.mjs).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const demoDir = join(root, 'src', 'app', 'motion-demo');
const read = (...parts) => readFileSync(join(demoDir, ...parts), 'utf8');

test('prototype files exist (page shell + shared fixtures + both engines)', () => {
  for (const file of [
    'page.tsx',
    'demo-shared.tsx',
    'engine-a-raf.tsx',
    'engine-b-framer.tsx',
  ]) {
    assert.ok(
      read(...(file === 'page.tsx' ? ['page.tsx'] : [file])),
      `missing prototype file: src/app/motion-demo/${file}`,
    );
  }
});

test('page shell: metadata title, exact banner, divider, both engines imported', () => {
  const page = read('page.tsx');
  assert.match(page, /Motion Engine Prototype/, 'metadata title missing');
  assert.match(
    page,
    /ENGINE PROTOTYPE — scratch page, to be deleted after the engine decision/,
    'exact banner label missing',
  );
  assert.match(page, /divider/i, 'labelled section divider missing');
  assert.match(page, /engine-a-raf/, 'engine A not wired into the page');
  assert.match(page, /engine-b-framer/, 'engine B not wired into the page');
});

test('engine parity: both engines are client modules on the shared keyframes', () => {
  for (const file of ['engine-a-raf.tsx', 'engine-b-framer.tsx']) {
    const source = read(file);
    assert.match(source, /'use client'/, `${file} is not a client component`);
    assert.match(
      source,
      /ENTRY_MOTION/,
      `${file} does not consume the shared ENTRY_MOTION contract`,
    );
  }
});

test('engine A: rAF mechanics — passive scroll, coalescing, cleanup, RM opacity-only', () => {
  const source = read('engine-a-raf.tsx');
  assert.match(
    source,
    /addEventListener\('scroll', onScroll, \{ passive: true \}\)/,
    'scroll listener must be passive on window',
  );
  assert.match(source, /requestAnimationFrame/, 'no rAF coalescing');
  assert.match(source, /cancelAnimationFrame/, 'pending frame not cancelled');
  assert.match(source, /removeEventListener\('scroll'/, 'scroll listener not removed');
  assert.match(
    source,
    /prefers-reduced-motion: reduce/,
    'no reduced-motion read',
  );
  assert.match(
    source,
    /rm \? '' : `translateY\(/,
    'reduced motion must write NO translate (opacity-only swaps)',
  );
  assert.match(
    source,
    /translateY\(\$\{y\}px\)/,
    'engine A must interpolate translateY from the progress value',
  );
  assert.doesNotMatch(
    source,
    /preventDefault|addEventListener\('wheel'|addEventListener\('touch/,
    'scroll hijack detected — scrolling must stay native input',
  );
});

test('engine B: framer-motion useScroll + useTransform + useReducedMotion', () => {
  const source = read('engine-b-framer.tsx');
  assert.match(
    source,
    /from 'framer-motion'/,
    'engine B must import from framer-motion',
  );
  assert.match(source, /useScroll\(/, 'no useScroll');
  assert.match(source, /useTransform\(/, 'no useTransform');
  assert.match(source, /useReducedMotion\(/, 'no reduced-motion fallback');
  assert.match(
    source,
    /spec\.input\.map\(\(\) => 0\)/,
    'y channel must be zeroed under reduced motion (opacity-only)',
  );
  assert.doesNotMatch(
    source,
    /preventDefault|addEventListener\('wheel'|addEventListener\('touch/,
    'framer section must not hijack scroll either',
  );
});

test('keyframe contract: coexistence windows at 1/3 and 2/3 ± 1/12 with spec ranges', () => {
  const shared = read('demo-shared.tsx');
  const block = shared.slice(
    shared.indexOf('ENTRY_MOTION'),
    shared.indexOf('/** Pre-JS'),
  );
  assert.ok(block.includes('5 / 12'), 'window edge 5/12 missing');
  assert.ok(block.includes('7 / 12'), 'window edge 7/12 missing');
  assert.ok(block.includes('3 / 4'), 'window edge 3/4 missing');
  assert.ok(block.includes('0.15'), 'outgoing coexistence opacity 0.15 missing');
  assert.ok(block.includes('-80'), 'outgoing translateY -80 missing');
  assert.ok(block.includes('120'), 'incoming translateY 120 missing');
  // every spec: input strictly increasing, arrays equally long
  // every spec: input strictly increasing, arrays equally long
  // \b guards: 'opacity: [' ends in 'y' and would bleed into a bare /y: \[/ match
  const specs = [...block.matchAll(/input: \[([^\]]+)\]/g)].map((m) =>
    m[1].split(',').map((s) => eval(s.trim())),
  );
  assert.equal(specs.length, 3, 'expected 3 entry motion specs');
  const opacityArrays = [...block.matchAll(/\bopacity: \[([^\]]+)\]/g)].map((m) =>
    m[1].split(',').map((s) => eval(s.trim())),
  );
  const yArrays = [...block.matchAll(/\by: \[([^\]]+)\]/g)].map((m) =>
    m[1].split(',').map((s) => eval(s.trim())),
  );
  for (let i = 0; i < 3; i += 1) {
    const input = specs[i];
    for (let k = 1; k < input.length; k += 1) {
      assert.ok(
        input[k] > input[k - 1],
        `spec ${i}: input range not strictly increasing`,
      );
    }
    assert.equal(opacityArrays[i].length, input.length, `spec ${i} opacity length`);
    assert.equal(yArrays[i].length, input.length, `spec ${i} y length`);
  }
});

test('scratch isolation: no reference to /motion-demo outside its own directory', () => {
  const offenders = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'motion-demo') continue; // the scratch dir itself
        walk(full);
      } else if (/\.(tsx?|jsx?|css|json)$/.test(entry.name)) {
        if (readFileSync(full, 'utf8').includes('motion-demo')) {
          offenders.push(full);
        }
      }
    }
  };
  walk(join(root, 'src'));
  assert.deepEqual(offenders, [], 'route leaked into other surfaces');
});

test('temporary dependency: framer-motion present in package.json dependencies', () => {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  assert.ok(
    pkg.dependencies['framer-motion'],
    'framer-motion missing from dependencies',
  );
});