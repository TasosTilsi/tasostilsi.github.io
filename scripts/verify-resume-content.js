// Acceptance check for the AI CV revamp (see doublecheck-spec.md).
// Verifies the source data and the generated static resume export.
// Run: node scripts/verify-resume-content.js  (exit 0 = all checks pass)

const fs = require('fs');

const dataPath = 'src/data/portfolio-main-data.json';
const exportPath = 'public/resume-export.html';

const failures = [];

// --- 1. Source data carries the approved change ---
let data;
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {
  console.error(`FAIL: ${dataPath} does not parse: ${e.message}`);
  process.exit(1);
}

const chubb = data.experience[0];
const innovation = data.skills.hard_skills.Innovation || [];

const dataChecks = {
  'data: projects[0] is Clarif-AI': data.projects[0] && data.projects[0].name === 'Clarif-AI',
  'data: projects[1] is DeepIndex': data.projects[1] && data.projects[1].name === 'DeepIndex',
  'data: Clarif-AI links live site (clarif-ai.net)': data.projects[0] && data.projects[0].link === 'https://clarif-ai.net',
  'data: DeepIndex links npm + GitHub repo':
    data.projects[1] && data.projects[1].link === 'https://www.npmjs.com/package/deepindex' &&
    data.projects[1].sourceUrl === 'https://github.com/TasosTilsi/deepindex',
  'data: Chubb role has 7 responsibilities, AI-forward':
    chubb && chubb.responsibilities && chubb.responsibilities.length === 7 &&
    chubb.responsibilities[0].includes('MCP servers'),
  'data: Innovation group has 7 tags incl. RAG + AI Agents':
    innovation.length === 7 && innovation.includes('RAG') && innovation.includes('AI Agents'),
  'data: summary (V1) names both AI products':
    data.about.description.includes('Clarif-AI (clarif-ai.net)') &&
    data.about.description.includes('DeepIndex CLI'),
};

// --- 2. Generated export artifact carries the change ---
let html = '';
try {
  html = fs.readFileSync(exportPath, 'utf8');
} catch (e) {
  failures.push(`export: ${exportPath} unreadable: ${e.message}`);
}

const requiredInExport = [
  'Clarif-AI',
  'clarif-ai.net',
  'DeepIndex',
  'npmjs.com/package/deepindex',
  'github.com/TasosTilsi/deepindex',
  'PROJECTS.BIN',
  'AI Agents',
  'RAG',
  'Context Engineering',
  'Embeddings & Semantic Search',
  'agentic AI coding harnesses',
  'self-healing selectors',
  'RAG pipelines',
  'npm-published DeepIndex CLI',
];

const forbiddenInExport = [
  'Spearheaded AI innovation',
  'Jira synchronization',
];

// --- report ---
for (const [label, ok] of Object.entries(dataChecks)) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) failures.push(label);
}
for (const marker of requiredInExport) {
  const ok = html.includes(marker);
  console.log(`${ok ? 'PASS' : 'FAIL'}  export contains "${marker}"`);
  if (!ok) failures.push(`export contains "${marker}"`);
}
for (const marker of forbiddenInExport) {
  const ok = !html.includes(marker);
  console.log(`${ok ? 'PASS' : 'FAIL'}  export no longer contains "${marker}"`);
  if (!ok) failures.push(`export still contains "${marker}"`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll resume content checks passed.');