// Acceptance check for the docx-structure resume rebuild (REV-02/REV-03, D-08).
// Verifies the refreshed source data and the generated static resume export
// against the same docx section order /resume renders.
// Run: node scripts/verify-resume-content.js  (exit 0 = all checks pass)

const fs = require('fs');

const dataPath = 'src/data/portfolio-main-data.json';
const exportPath = 'public/resume-export.html';

const failures = [];

// --- 1. Source data carries the docx contract (plan-01 refresh) -----------
let data;
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {
  console.error(`FAIL: ${dataPath} does not parse: ${e.message}`);
  process.exit(1);
}

const DOCX_TITLE = 'Test Automation Architect | Principal Test Automation Engineer';
const ANTHROPIC_CERTS = [
  'Claude 101',
  'Claude Code in Action',
  'Introduction to Claude Cowork',
  'Introduction to Agent Skills',
];
const NEW_ARTICLES = [
  'Your AI Agent Keeps Re-Discovering Your Codebase. I Built the Tool That Stops It.',
  'Your Playwright Tests Take 45 Minutes? Cut That to 12.',
];
const chubb = data.experience.find((job) => job.company === 'Chubb');

const dataChecks = {
  'data: about.title is the docx line-2 branding': data.about.title === DOCX_TITLE,
  'data: 8 core competencies, each with a non-empty proof':
    Array.isArray(data.core_competencies) &&
    data.core_competencies.length === 8 &&
    data.core_competencies.every((c) => c.name && c.proof),
  'data: Chubb carries 6 docx bullets, first quantifies 12+ engineering teams':
    chubb && chubb.responsibilities && chubb.responsibilities.length === 6 &&
    chubb.responsibilities[0].includes('12+ engineering teams'),
  'data: exactly 3 isTechRelated roles (U-4)':
    data.experience.filter((job) => job.isTechRelated).length === 3,
  'data: exactly 5 featured certifications incl. the 4 Anthropic Academy items':
    data.certifications.filter((c) => c.featured).length === 5 &&
    ANTHROPIC_CERTS.every((name) =>
      data.certifications.some((c) => c.featured && c.name === name)),
  'data: exactly 5 featured articles incl. the 2 new Medium titles':
    data.articles.filter((a) => a.featured).length === 5 &&
    NEW_ARTICLES.every((name) =>
      data.articles.some((a) => a.featured && a.name === name)),
};

// --- 2. Generated export artifact renders the docx structure --------------
let html = '';
try {
  html = fs.readFileSync(exportPath, 'utf8');
} catch (e) {
  failures.push(`export: ${exportPath} unreadable: ${e.message}`);
}

// Minimal entity normalisation so marker checks are escaping-agnostic.
const decoded = html
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"');

const requiredInExport = [
  data.about.name,
  DOCX_TITLE,
  'Test automation engineer with 7+ years designing frameworks',
  ...data.core_competencies.map((c) => c.name),
  '12+ engineering teams',
  'clarif-ai.net',
  'npmjs.com/package/deepindex',
  ...ANTHROPIC_CERTS,
  ...NEW_ARTICLES,
];

// Docx section order — §8 renders §7.3 exactly. Each marker is the unique
// '//</span> LABEL' heading emitted by the template.
const sections = [
  '//</span> SUMMARY',
  '//</span> CORE COMPETENCIES',
  '//</span> PROFESSIONAL EXPERIENCE',
  '//</span> PROJECTS',
  '//</span> EDUCATION',
  '//</span> CERTIFICATIONS',
  '//</span> SELECTED WRITING',
];
const orderOk = sections.every((marker) => decoded.includes(marker)) &&
  sections.map((marker) => decoded.indexOf(marker))
    .every((idx, i, all) => i === 0 || idx > all[i - 1]);

// Forbidden markers: the old two-column/sidebar structure is gone.
const forbiddenInExport = [
  'SKILLS.SYS',
  'skill-group-title',
  'https://linkedin.com/in/tasostilsi',
  'ARTICLES.LOG',
  'CERTS.KEY',
  'EDUCATION.BIN',
  'PROJECTS.BIN',
  'EXPERIENCE.SH',
  'SUMMARY.EXE',
  'sidebar',
];

// Data-driven contacts: the export carries the about.contact forms.
const contactsOk =
  decoded.includes(data.about.contact.linkedin) &&
  decoded.includes(data.about.contact.github) &&
  decoded.includes(data.about.contact.email);

// --- report ---
for (const [label, ok] of Object.entries(dataChecks)) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) failures.push(label);
}
for (const marker of requiredInExport) {
  const ok = decoded.includes(marker);
  console.log(`${ok ? 'PASS' : 'FAIL'}  export contains "${marker}"`);
  if (!ok) failures.push(`export contains "${marker}"`);
}
for (const marker of forbiddenInExport) {
  const ok = !decoded.includes(marker);
  console.log(`${ok ? 'PASS' : 'FAIL'}  export no longer contains "${marker}"`);
  if (!ok) failures.push(`export still contains "${marker}"`);
}
console.log(`${orderOk ? 'PASS' : 'FAIL'}  export renders the docx section order: SUMMARY < COMPETENCIES < EXPERIENCE < PROJECTS < EDUCATION < CERTIFICATIONS < WRITING`);
if (!orderOk) failures.push('export docx section order');
console.log(`${contactsOk ? 'PASS' : 'FAIL'}  export contacts are data-driven from about.contact`);
if (!contactsOk) failures.push('export contacts data-driven');

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll resume content checks passed.');