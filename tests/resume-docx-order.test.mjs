/**
 * Plan-03 carrier for EXPLORE-06-explore-revision — /resume + PDF docx-order
 * rebuild (REV-02, D-08).
 *
 * Pins the single-column docx section order (§7.3: SUMMARY → CORE COMPETENCIES
 * → PROFESSIONAL EXPERIENCE → PROJECTS → EDUCATION → CERTIFICATIONS →
 * SELECTED WRITING), the preserved page chrome (§7.1), the unchanged
 * ResumeViewProps modal contract (R-11), the U-4 3-role experience contract,
 * the docx-verbatim heading labels (§7.4/U-5), the featured-only curation
 * (projects §7.3.5, education B-2, certifications + writing plan-03 task 2),
 * and the ResumeSkills removal (§7.5).
 *
 * Runner: node --test tests/resume-docx-order.test.mjs (no npm test script
 * exists — run directly, per the repo's zero-dep node --test suite
 * convention; see tests/explore-visuals-server.test.mjs header).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const viewPath = 'src/components/resume/ResumeView.tsx';
const pagePath = 'src/app/resume/page.tsx';
const view = read(viewPath);
const page = read(pagePath);
const data = JSON.parse(read('src/data/portfolio-main-data.json', 'utf8'));

// Extract the JSX opening region of a component usage (from "<Tag" to the
// next "/>") so per-call props can be asserted across multi-line JSX.
const usage = (src, tag) => {
  const start = src.indexOf(`<${tag}`);
  if (start === -1) return '';
  const end = src.indexOf('/>', start);
  return end === -1 ? src.slice(start) : src.slice(start, end);
};

// ---------------------------------------------------------------------------
// §7.3 — DOM order = docx order (single-column rebuild)
// ---------------------------------------------------------------------------

test('resume: ResumeView renders the docx section order, ascending', () => {
  const markers = [
    '<ResumeSummary',
    '<ResumeCoreCompetencies',
    '<ResumeExperience',
    '<ResumeProjects',
    '<ResumeEducation',
    '<ResumeCertifications',
    '<ResumeArticles',
  ];
  const indices = markers.map((m) => view.indexOf(m));
  indices.forEach((i, n) => assert.notEqual(i, -1, `${markers[n]} not rendered in ResumeView`));
  for (let n = 1; n < indices.length; n += 1) {
    assert.ok(
      indices[n] > indices[n - 1],
      `${markers[n]} must render after ${markers[n - 1]} (docx order §7.3)`,
    );
  }
});

test('resume: single-column flow — sidebar grid and 33/67 split gone', () => {
  assert.ok(!view.includes('resume-sidebar'), 'no .resume-sidebar (single column §7.2)');
  assert.ok(!view.includes('resume-main'), 'no .resume-main (single column §7.2)');
  assert.ok(!view.includes('md:w-[33%]'), 'no 33% sidebar column');
  assert.ok(!view.includes('md:w-[67%]'), 'no 67% main column');
  assert.ok(!view.includes('ResumeSkills'), 'skills section dropped from the composition (§7.5)');
  assert.ok(view.includes('resume-wrapper'), 'wrapper class retained for print rules');
});

test('resume: PROJECTS renders before EDUCATION, independent of the PUBLICATIONS toggle (E-16)', () => {
  assert.ok(
    view.indexOf('<ResumeProjects') !== -1 &&
      view.indexOf('<ResumeProjects') < view.indexOf('<ResumeEducation'),
    'docx order puts PROJECTS before EDUCATION',
  );
  assert.ok(!view.includes('!showArticles'), 'the showProjects && !showArticles coupling is removed (E-16)');
});

// ---------------------------------------------------------------------------
// §7.1 — page chrome preserved byte-for-byte
// ---------------------------------------------------------------------------

test('resume/page.tsx keeps the print chrome: ?print=true timer + toggle + print buttons', () => {
  assert.ok(page.includes('searchParams.get("print")'), '?print param read');
  assert.ok(page.includes('window.print()'), 'window.print() invoked');
  assert.ok(page.includes('setTimeout'), 'delayed auto-print timer');
  assert.ok(page.includes('print:hidden'), 'button cluster hidden in print');
  const buttons = page.match(/<Button/g) || [];
  assert.equal(buttons.length, 2, 'exactly the two chrome buttons (dark/printer toggle + Print/Save)');
  assert.ok(page.includes('LOADING ARCHIVE'), 'Suspense fallback preserved');
});

// ---------------------------------------------------------------------------
// R-11 — modal contract unchanged
// ---------------------------------------------------------------------------

test('resume: ResumeViewProps contract intact (data, isDarkMode, 3 section toggles)', () => {
  assert.ok(view.includes('interface ResumeViewProps'), 'props interface present');
  assert.ok(/data: PortfolioData;/.test(view), 'data prop typed');
  assert.ok(/isDarkMode: boolean;/.test(view), 'isDarkMode prop typed');
  assert.ok(/showCertifications\?: boolean;/.test(view), 'showCertifications optional toggle');
  assert.ok(/showProjects\?: boolean;/.test(view), 'showProjects optional toggle');
  assert.ok(/showArticles\?: boolean;/.test(view), 'showArticles optional toggle');
});

// ---------------------------------------------------------------------------
// U-4 — exactly 3 tech-related roles; the data-driven filter stays
// ---------------------------------------------------------------------------

test('resume: exactly 3 isTechRelated:true entries and ResumeExperience keeps the filter (U-4)', () => {
  const techRoles = data.experience.filter((job) => job.isTechRelated);
  assert.equal(techRoles.length, 3, 'plan 01 U-4 flip: exactly 3 tech-related roles');
  assert.deepEqual(
    techRoles.map((job) => job.company),
    ['Chubb', 'Upstream Systems', 'Netcompany-Intrasoft'],
    'the docx three, in data order',
  );
  const exp = read('src/components/resume/ResumeExperience.tsx');
  assert.ok(
    exp.includes('.filter((job) => job.isTechRelated)'),
    'ResumeExperience selects roles through the data-driven isTechRelated filter',
  );
});

// ---------------------------------------------------------------------------
// §7.4/U-5 — docx-verbatim heading labels
// ---------------------------------------------------------------------------

test('resume: section headings are docx-verbatim (no .EXE/.SH/.SYS/.BIN/.KEY/.LOG)', () => {
  const labels = {
    'src/components/resume/ResumeSummary.tsx': '//</span> SUMMARY',
    'src/components/resume/ResumeCoreCompetencies.tsx': '//</span> CORE COMPETENCIES',
    'src/components/resume/ResumeExperience.tsx': '//</span> PROFESSIONAL EXPERIENCE',
    'src/components/resume/ResumeProjects.tsx': '//</span> PROJECTS',
    'src/components/resume/ResumeEducation.tsx': '//</span> EDUCATION',
    'src/components/resume/ResumeCertifications.tsx': '//</span> CERTIFICATIONS',
    'src/components/resume/ResumeArticles.tsx': '//</span> SELECTED WRITING',
  };
  for (const [file, marker] of Object.entries(labels)) {
    assert.ok(read(file).includes(marker), `${file} carries the docx-verbatim label "${marker}"`);
  }
  const legacy = ['SUMMARY.EXE', 'EXPERIENCE.SH', 'PROJECTS.BIN', 'EDUCATION.SYS', 'CERTS.KEY', 'PUBS.LOG'];
  for (const file of Object.keys(labels)) {
    const src = read(file);
    for (const marker of legacy) {
      assert.ok(!src.includes(marker), `${file} drops the legacy "${marker}" marker (U-5)`);
    }
  }
});

// ---------------------------------------------------------------------------
// CORE COMPETENCIES — the new section (§7.3.3)
// ---------------------------------------------------------------------------

test('resume: ResumeCoreCompetencies renders the 8 refreshed clusters, name + proof, graceful-hide', () => {
  const src = read('src/components/resume/ResumeCoreCompetencies.tsx');
  assert.ok(src.includes('data.core_competencies'), 'renders core_competencies from the data');
  assert.ok(src.includes('competency.proof'), 'proof line renders beneath the name');
  assert.ok(/return null/.test(src), 'empty array renders null (graceful-hide §10.2 E-07)');
  assert.ok(src.includes('breakInside'), 'breakInside avoid per row');
  assert.ok(src.includes('"use client"'), 'client directive matching siblings');

  assert.equal(data.core_competencies.length, 8, '8 clusters on record');
  data.core_competencies.forEach((competency, i) => {
    assert.ok(competency.name.length > 0, `cluster ${i} has a name`);
    assert.ok(competency.proof.length > 0, `cluster ${i} has a quantified proof`);
  });

  assert.ok(
    read('src/components/resume/index.ts').includes("export { default as ResumeCoreCompetencies } from './ResumeCoreCompetencies';"),
    'exported from the resume barrel',
  );
});

// ---------------------------------------------------------------------------
// §7.3.5 — featured-only PROJECTS with the muted mono link-line atom (B-1)
// ---------------------------------------------------------------------------

test('resume: PROJECTS render the featured-flagged docx two, not a limit slice, with link lines', () => {
  const src = read('src/components/resume/ResumeProjects.tsx');
  assert.ok(src.includes('featuredOnly'), 'featuredOnly prop (§7.3.5 B-1)');
  assert.ok(src.includes('project.featured'), 'selection filters on the featured flag');
  assert.ok(src.includes('project.link &&'), 'link-line atom omitted for linkless projects (E-11b)');

  const usageInView = usage(view, 'ResumeProjects');
  assert.ok(usageInView.includes('featuredOnly'), 'ResumeView passes featuredOnly to PROJECTS');

  const featured = data.projects.filter((project) => project.featured);
  assert.deepEqual(featured.map((project) => project.name), ['DeepIndex', 'Clarif-AI'], 'the docx two, data order (U-6)');
  featured.forEach((project) => assert.ok(project.link, `${project.name} carries its link for the mono line`));
});

// ---------------------------------------------------------------------------
// §7.3.6 — featured-only EDUCATION (B-2)
// ---------------------------------------------------------------------------

test('resume: EDUCATION renders the featured degrees only — High School stays CLI-reachable', () => {
  const src = read('src/components/resume/ResumeEducation.tsx');
  assert.ok(src.includes('featuredOnly'), 'featuredOnly prop (§7.3.6 B-2)');
  assert.ok(src.includes('edu.featured'), 'selection filters on the featured flag');

  const usageInView = usage(view, 'ResumeEducation');
  assert.ok(usageInView.includes('featuredOnly'), 'ResumeView passes featuredOnly to EDUCATION');

  const featured = data.education.filter((edu) => edu.featured);
  assert.equal(featured.length, 2, 'the docx two degrees featured');
  assert.ok(data.education.some((edu) => edu.degree === 'High School Degree'), 'High School row survives in data (CLI-reachable)');
});