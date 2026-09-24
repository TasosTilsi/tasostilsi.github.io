/**
 * Phase EXPLORE-06 plan 01 — REV-01 data-integrity suite.
 *
 * Pins the docx contract (resume-docx-extraction.md, approved verbatim in
 * data-refresh-draft.md per D-01) on the refreshed
 * src/data/portfolio-main-data.json, plus the nothing-deleted ledger: every
 * "untouched" collection is deep-equal to its PRE-refresh fixture copied
 * verbatim from the pre-phase JSON.
 *
 * Runner: node --test tests/portfolio-data-integrity.test.mjs (no npm test
 * script exists — run directly, per the repo's zero-dep node --test suite
 * convention; see tests/explore-visuals.test.mjs header).
 *
 * Approved decisions baked into these pins (data-refresh-draft.md approval
 * box, 2026-09-22): (a)=B spike-scoped downloads wording, (b) deepindex-first
 * flagship order, (c) Anthropic cert defaults (date "2026", link null),
 * (d)=d2 real geo Part 1 added + Part-2 entry stays, (e) meta.keywords
 * refresh, U-4 Smartup PCC isTechRelated flip.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = 'src/data/portfolio-main-data.json';
const data = JSON.parse(readFileSync(join(root, dataPath), 'utf8'));
const raw = readFileSync(join(root, dataPath), 'utf8');

// -- The locked docx contract (resume-docx-extraction.md, verbatim) ---------

const DOCX_TITLE = 'Test Automation Architect | Principal Test Automation Engineer';

const DOCX_SUMMARY_HEAD =
  'Test automation engineer with 7+ years designing frameworks and platforms now standard across an entire QA organization. ' +
  'Recognized internally as the go-to authority for QA automation architecture and technical direction, translating strategy into shared tooling adopted by 12+ engineering teams. ' +
  'Builds AI-driven QA infrastructure — MCP servers, agentic coding workflows, and RAG-based tooling — bridging emerging AI practice with governed engineering standards.';
// Decision (a)=B: the docx tail "…generating 400+ weekly downloads." is replaced by the spike-scoped wording.
const SUMMARY_TAIL_B =
  'ISTQB-certified; MSc in Applied Informatics; open-source contributor with a published npm package that debuted at 600+ downloads in its launch week.';

const COMPETENCY_NAMES = [
  'Test Automation Architecture & Framework Design',
  'Test Automation Stack & Languages',
  'CI/CD (Jenkins, Docker, Bitbucket)',
  'AI-Driven QA (MCP, RAG, Prompt Engineering, Agentic AI)',
  'NPM Module & Platform Architecture',
  'Quality Dashboards & Reporting',
  'Cross-Team Technical Leadership & Mentorship',
  'Performance & Load Testing (ReadyAPI, LoadUI, Postman)',
];

const DOCX_BULLETS = {
  Chubb: [
    'Designed an internal NPM automation framework now used by 12+ engineering teams across 20+ projects; after an internal presentation, 5 projects adopted it immediately, and it went on to become the standard framework across the entire QA chapter, replacing duplicated, forked automation code org-wide.',
    'Serve as the primary technical point of contact for QA automation architecture and design decisions across the department, advising teams on framework structure, tooling choices, and test strategy.',
    'Deployed MCP servers and AI agent skills used by 30+ engineers, making testing know-how and technical context retrievable at the point of work instead of buried in documentation.',
    'Standardized agentic AI coding harnesses org-wide (rules, hooks, sub-agent workflows), converting ad hoc AI tool usage into governed engineering practice.',
    'Defined CI hosting requirements for the DevOps team and rebuilt CI/CD pipelines on open-source tooling, eliminating recurring licensing costs while maintaining delivery velocity.',
    'Designed real-time quality dashboards giving stakeholders visibility into test health for data-driven prioritization.',
  ],
  'Upstream Systems': [
    'Integrated automated smoke and regression suites into daily CI/CD delivery cycles.',
    'Designed custom test execution tooling that reduced manual overhead and expanded automated coverage to new product modules.',
    'Influenced “shift-left” strategy by feeding UX and performance findings into design phases before development began.',
  ],
  'Netcompany-Intrasoft': [
    'Initiated and built the team’s first Jenkins CI pipelines for test automation, introducing scheduled overnight regression runs where none had previously existed.',
    'Led code reviews as primary reviewer, holding automation scripts to consistent architectural standards across the team.',
    'Authored test artifacts and traceability matrices achieving 100% requirement coverage.',
    'Executed performance and load testing (LoadUI, Java) to identify and resolve system bottlenecks.',
  ],
};

const ANTHROPIC_CERTS = [
  'Claude 101',
  'Claude Code in Action',
  'Introduction to Claude Cowork',
  'Introduction to Agent Skills',
];

const NEW_ARTICLES = [
  { name: 'Your AI Agent Keeps Re-Discovering Your Codebase. I Built the Tool That Stops It.', date: 'Sep 14, 2026' },
  { name: 'Your Playwright Tests Take 45 Minutes? Cut That to 12.', date: 'May 26, 2026' },
];

const GEO_PART_1 = {
  name: 'A QA Engineer’s Guide to Testing Geo-Specific Features (Without Flying to 30 Countries) — Part 1',
  date: 'Dec 23, 2025',
};

// -- Nothing-deleted ledger: PRE-refresh fixtures (copied verbatim) ----------

const PRE_INTERESTS = [
  'Spending time with friends',
  'Enjoying good coffee and being a food lover',
  'Going on road trips and scenic walks',
  'Watching sports',
  'Playing video games (PC and consoles) [*]',
  'Following adventure and historical movies/series',
  'Exploring latest technology advancements',
  'Developing personal project ideas',
];

const PRE_FAVORITE_GAMES = {
  simulation_games: ['Football Manager', 'Cities Skylines', 'Euro Truck Simulator', 'Farming Simulator'],
  strategy_games: ['Rome Total War', 'Age of Empires', 'Civiliazation'],
  single_player_games: ['GTA', 'Witcher', 'Red Dead Redemption', 'Spiderman'],
  racing_games: ['Grand Turismo', 'Need for Speed', 'F1'],
};

const PRE_PRESENTATIONS = [
  {
    name: "Boosting Your Team's Clarity with Allure Reporting",
    description: 'How to improve test result visibility and debugging efficiency using Allure Report',
    framework: 'Slidev',
    link: 'https://tasostilsi.github.io/presentations/allure-reporting/',
    sourceUrl: 'https://github.com/TasosTilsi/presentations',
    date: 'November 2025',
  },
];

const PRE_SKILLS = {
  soft_skills: ['Analytical Skills', 'Teamwork', 'Creative Problem Solving', 'Organizational Skills', 'Time Management', 'Attention to Detail'],
  hard_skills: {
    Languages: ['Java', 'JS', 'TS', 'ReactJS', 'Spring Boot', 'Python', 'SQL', 'C++', 'PHP'],
    Testing: ['Playwright', 'Selenium', 'Rest Assured', 'ReadyAPI', 'Postman', 'Allure'],
    Infrastructure: ['NPM Module Dev', 'CI/CD', 'Docker', 'Jenkins', 'Bitbucket', 'Jira'],
    Innovation: ['Prompt Engineering', 'MCP', 'AI Agents', 'RAG', 'Context Engineering', 'Embeddings & Semantic Search', 'AI-driven SDLC'],
  },
  languages: ['Greek (Native)', 'English (Fluent)'],
};

const PRE_EDUCATION_DEGREES = [
  'Master of Science in Computer Science',
  'Bachelor of Computer Engineering',
  'High School Degree',
];

const PRE_NON_DOCX_ROLES = [
  { title: 'Android Developer', company: 'Smartup PCC', duration: 'November 2017 - April 2018' },
  { title: 'Barista', company: 'Sweet Corner', duration: 'May 2018 - June 2018' },
  { title: 'Storekeeper', company: 'Mini Market at University Campus of AUTH', duration: 'June 2017 - July 2017' },
  { title: 'Washer', company: 'WashPark', duration: 'March 2017 - June 2017' },
];

const SMARTUP_RESPONSIBILITIES = [
  'Creation of Android applications.',
  "Uploaded Android applications to Google's Playstore.",
  'Maintained existing projects (Android, Javascript).',
  'Provided First Level Support.',
  'Provided Technical Support.',
];

const PRE_CERT_NAMES = [
  'The AI-Driven Software Developer: Optimize, Innovate, Transform',
  'Advanced Prompt Engineering Techniques',
  'Artificial Intelligence Foundations: Thinking Machines',
  'Introduction to Large Language Models',
  'Introduction to Prompt Engineering for Generative AI',
  'What Is Generative AI',
  'JavaScript Essential Training',
  'ISTQB® Foundation Level (CTFL)',
  'Test Automation in DevOps',
  'Advanced Playwright',
  'Introduction to Playwright',
  'Introduction to Javascript',
  'Scaling Tests with Docker',
  'Selenium 4 in Java',
  'Web Element Locator Strategies',
  'Jenkins - The Complete Tutorial | Master CICD and DevOps',
  'Automating your API tests with REST Assured',
  'Getting started with Angular',
  'Intellij for Test Automation Engineers',
  'Setting a Foundation for Successful Test Automation',
  'Selenium WebDriver with Java',
  'REST API Testing using SOAP UI - Quick Introduction',
  'Kotlin for Beginners: Next Android platform language',
  'JENKINS Beginner Tutorial - Step by Step',
  'Selenium Basics - Step by Step for Beginners',
  'Getting Started With Test Automation Using Selenium',
  'Become an Android Developer from Scratch',
  'Fundamentals of Computer Hacking',
  'Hacking Academy: How to Monitor & Intercept Transmitted Data',
  'Google Greek Grow Tourism',
  'IEEEday 2017',
  'Managing and saving energy from buildings using software',
  'The evolution of the Greek economy in the years of the Memorandum, policies of stability, growth and employment',
  'Electronic identities. Why; For whom; When;',
  'Opening the way for 5G networks',
  'Archimedes 3 - Supporting research teams at TEI of Serres',
  'Advanced services for the citizen and the student at TEI Serres',
  'Digital services of the TEI Library of Serres',
  'ECDL Progress Certificate',
  'Upper Intermediate Communication (London Tests of English Level 3)',
  'Entry Level Certificate in English (ESOL) - Entry 3',
];

const PRE_ARTICLE_NAMES = [
  'Local Knowledge Graphs for AI',
  'Testing Geo-Specific Features',
  'The €10,000 Contract Mistake',
  'Automation Design Patterns',
  'Why Your Best Engineering Happens Outside Work Hours',
  'Core Design Patterns for Test Automation: From Chaos to Maintainable Frameworks',
  "Flaky Tests Driving You Crazy? Here's How to Fix and Prevent Them!",
  "Unpopular Opinion (or Maybe Not): ISTQB Shouldn't Be for Testers — It Should Be for Everyone Else",
  'Unlock Effortless Updates: Mastering Maintainable Test Automation Frameworks',
  'More than a Year with Allure Reporting: From Reporting Tool to Team Catalyst',
  'Manual Testing: The Foundation That Makes Test Automation Truly Work',
  'Assembly Lines & Algorithms: The Realities of Modern Engineering',
];

// ---------------------------------------------------------------------------
// 1. Branding — about.title + meta (OQ-4 / decision (e))
// ---------------------------------------------------------------------------

test('about.title equals docx line 2 verbatim', () => {
  assert.equal(data.about.title, DOCX_TITLE);
});

test('meta.description refreshed; keywords carry the new branding, not the old title (decision (e))', () => {
  assert.equal(
    data.meta.description,
    'Interactive CLI portfolio of Anastasios Tilsizoglou — Test Automation Architect and Principal Test Automation Engineer, part-time freelance consultant (TAaS). Test automation architecture, AI-driven QA, Playwright, CI/CD, and full-stack engineering.',
  );
  assert.ok(data.meta.keywords.includes('Test Automation Architect, Principal Test Automation Engineer'));
  assert.ok(!data.meta.keywords.includes('Senior Software Engineer in Test'));
  // meta charset/viewport/author byte-identical (nothing-deleted ledger)
  assert.equal(data.meta.charset, 'utf-8');
  assert.equal(data.meta.viewport, 'width=device-width, initial-scale=1, shrink-to-fit=no');
  assert.equal(data.meta.author, 'Anastasios Tilsizoglou');
});

// ---------------------------------------------------------------------------
// 2. Summary — about.description (docx line 5 + decision (a)=B tail)
// ---------------------------------------------------------------------------

test('about.description is the docx summary with the approved (a)=B downloads tail', () => {
  assert.equal(data.about.description, `${DOCX_SUMMARY_HEAD} ${SUMMARY_TAIL_B}`);
});

// ---------------------------------------------------------------------------
// 3. core_competencies — 8 clusters (D-02, 9→8 decomposition)
// ---------------------------------------------------------------------------

test('core_competencies: 8 clusters, docx names in order, every name+proof non-empty', () => {
  assert.ok(Array.isArray(data.core_competencies));
  assert.equal(data.core_competencies.length, 8);
  assert.deepStrictEqual(
    data.core_competencies.map((c) => c.name),
    COMPETENCY_NAMES,
  );
  for (const cluster of data.core_competencies) {
    assert.ok(cluster.name.trim().length > 0, 'cluster name non-empty');
    assert.ok(cluster.proof.trim().length > 0, 'cluster proof non-empty');
    assert.equal(typeof cluster.proof, 'string');
  }
});

test('all 9 docx competency segments are represented in the 8 clusters (nothing lost in 9→8)', () => {
  const surface = data.core_competencies.map((c) => `${c.name} ${c.proof}`).join(' | ');
  const segments = [
    'Test Automation Architecture & Framework Design',
    'Playwright, Selenium, Rest Assured, WebdriverIO',
    'Java, JavaScript, TypeScript',
    'CI/CD (Jenkins, Docker, Bitbucket)',
    'AI-Driven QA (MCP, RAG, Prompt Engineering, Agentic AI)',
    'NPM Module & Platform Architecture',
    'Quality Dashboards & Reporting',
    'Cross-Team Technical Leadership & Mentorship',
    'Performance & Load Testing (ReadyAPI, LoadUI, Postman)',
  ];
  for (const segment of segments) {
    assert.ok(surface.includes(segment), `docx segment missing from competencies: ${segment}`);
  }
});

// ---------------------------------------------------------------------------
// 4. Experience — docx bullets replace the 3 docx roles (D-02); U-4 flip
// ---------------------------------------------------------------------------

test('Chubb responsibilities = docx 6 bullets, first bullet carries 12+ engineering teams', () => {
  const chubb = data.experience.find((e) => e.company === 'Chubb');
  assert.ok(chubb);
  assert.equal(chubb.responsibilities.length, 6);
  assert.ok(chubb.responsibilities[0].includes('12+ engineering teams'));
  assert.deepStrictEqual(chubb.responsibilities, DOCX_BULLETS.Chubb);
});

test('Upstream + Netcompany responsibilities = docx bullets (3 / 4)', () => {
  const upstream = data.experience.find((e) => e.company === 'Upstream Systems');
  const netcompany = data.experience.find((e) => e.company === 'Netcompany-Intrasoft');
  assert.deepStrictEqual(upstream.responsibilities, DOCX_BULLETS['Upstream Systems']);
  assert.deepStrictEqual(netcompany.responsibilities, DOCX_BULLETS['Netcompany-Intrasoft']);
});

test('docx roles keep title/company/location/duration byte-identical (draft §4)', () => {
  const pinned = [
    { title: 'Senior Software Engineer in Test', company: 'Chubb', duration: 'Sept 2023 — Present' },
    { title: 'Software Engineer in Test', company: 'Upstream Systems', duration: 'Sept 2022 — Aug 2023' },
    { title: 'Software Engineer in Test', company: 'Netcompany-Intrasoft', duration: 'June 2019 — Sept 2022' },
  ];
  for (const pin of pinned) {
    const entry = data.experience.find((e) => e.company === pin.company);
    assert.ok(entry, `${pin.company} still present`);
    assert.equal(entry.title, pin.title);
    assert.equal(entry.duration, pin.duration);
    assert.ok(entry.location.length > 0);
  }
});

test('U-4: exactly 3 isTechRelated:true entries (Chubb, Upstream, Netcompany) — Smartup PCC flipped but present', () => {
  const trueEntries = data.experience.filter((e) => e.isTechRelated === true);
  assert.equal(trueEntries.length, 3);
  assert.deepStrictEqual(
    trueEntries.map((e) => e.company),
    ['Chubb', 'Upstream Systems', 'Netcompany-Intrasoft'],
  );
  const smartup = data.experience.find((e) => e.company === 'Smartup PCC');
  assert.ok(smartup, 'Smartup PCC entry stays (flag change, not row removal)');
  assert.equal(smartup.isTechRelated, false);
  assert.deepStrictEqual(smartup.responsibilities, SMARTUP_RESPONSIBILITIES);
  // raw-source pin of the plan's acceptance grep: exactly 3 `"isTechRelated": true` lines
  assert.equal((raw.match(/"isTechRelated": true/g) || []).length, 3);
});

// ---------------------------------------------------------------------------
// 5. Projects — U-6 flagship order + enrichment + decision (a)=B wording
// ---------------------------------------------------------------------------

test('projects: DeepIndex first, Clarif-AI second (U-6 data order), featured on exactly those two', () => {
  assert.ok(data.projects.length >= 14, 'all 14 projects present');
  assert.equal(data.projects[0].name, 'DeepIndex');
  assert.equal(data.projects[1].name, 'Clarif-AI');
  const featured = data.projects.filter((p) => p.featured === true);
  assert.equal(featured.length, 2);
  assert.deepStrictEqual(featured.map((p) => p.name), ['DeepIndex', 'Clarif-AI']);
});

test('DeepIndex description carries the approved (a)=B downloads wording + docx value lines', () => {
  const deepindex = data.projects[0];
  assert.ok(deepindex.description.includes('600+ downloads in launch week (Sep 2026)'), 'approved (a)=B wording');
  assert.ok(deepindex.description.includes('hybrid semantic and entity-graph code search'), 'docx value line');
  assert.ok(deepindex.description.includes('npm-published'), 'docx value line');
  assert.equal(deepindex.link, 'https://www.npmjs.com/package/deepindex');
  assert.ok(!deepindex.description.includes('400+'), 'docx-echoed stale number must not survive the (a)=B decision');
});

test('Clarif-AI description carries the docx red-flags framing + under-two-minutes', () => {
  const clarif = data.projects[1];
  assert.ok(clarif.description.includes('red flags'), 'docx value line');
  assert.ok(clarif.description.includes('under two minutes'), 'docx value line');
  assert.ok(clarif.description.includes('alpha'), 'docx value line');
  assert.equal(clarif.link, 'https://clarif-ai.net');
});

// ---------------------------------------------------------------------------
// 6. Certifications — 45 total, exactly 5 featured, Anthropic entries present
// ---------------------------------------------------------------------------

test('certifications: 41 originals intact + 4 Anthropic entries, exactly 5 featured', () => {
  assert.equal(data.certifications.length, 45);
  const names = new Set(data.certifications.map((c) => c.name));
  for (const original of PRE_CERT_NAMES) assert.ok(names.has(original), `original cert retained: ${original}`);
  for (const anthropic of ANTHROPIC_CERTS) assert.ok(names.has(anthropic), `Anthropic cert present: ${anthropic}`);
  const featured = data.certifications.filter((c) => c.featured === true);
  assert.equal(featured.length, 5);
  const istqb = data.certifications.find((c) => c.name === 'ISTQB® Foundation Level (CTFL)');
  assert.equal(istqb.featured, true);
  assert.equal(istqb.link, 'ID: GRTB-24-1S20-CTFL', 'ISTQB link untouched');
  for (const anthropic of ANTHROPIC_CERTS) {
    const entry = data.certifications.find((c) => c.name === anthropic);
    assert.equal(entry.featured, true);
    assert.equal(entry.link, null, 'Anthropic links default null (decision (c))');
    // CertsOutput-parseable format: "MMMM yyyy" | "MMM yyyy" | "yyyy"
    assert.match(entry.date, /^(\d{4}|[A-Z][a-z]+ \d{4}|[A-Z][a-z]{3} \d{4})$/, `date parseable: ${entry.date}`);
  }
});

// ---------------------------------------------------------------------------
// 7. Articles — selected writing: 5 featured, 3 new entries, links per-article
// ---------------------------------------------------------------------------

test('articles: 12 originals intact + 3 new entries, exactly 5 featured in docx order', () => {
  assert.equal(data.articles.length, 15);
  const names = new Set(data.articles.map((a) => a.name));
  for (const original of PRE_ARTICLE_NAMES) assert.ok(names.has(original), `original article retained: ${original}`);
  const featured = data.articles.filter((a) => a.featured === true);
  assert.equal(featured.length, 5);
  // docx SELECTED WRITING order: AI Agent → Playwright 45 → Core → Flaky → Geo Part 1
  assert.deepStrictEqual(featured.map((a) => a.name), [
    NEW_ARTICLES[0].name,
    NEW_ARTICLES[1].name,
    'Core Design Patterns for Test Automation: From Chaos to Maintainable Frameworks',
    "Flaky Tests Driving You Crazy? Here's How to Fix and Prevent Them!",
    GEO_PART_1.name,
  ]);
});

test('new articles carry verified per-article links + dates (RESEARCH §1.4.1 / RSS-fetched)', () => {
  const aiAgent = data.articles.find((a) => a.name === NEW_ARTICLES[0].name);
  const playwright45 = data.articles.find((a) => a.name === NEW_ARTICLES[1].name);
  const geoPart1 = data.articles.find((a) => a.name === GEO_PART_1.name);
  assert.ok(aiAgent && playwright45 && geoPart1, '3 new entries present');
  // per-article URLs (not the profile-level fallback), ?source= tracking param stripped
  assert.equal(aiAgent.link, 'https://generativeai.pub/your-ai-agent-keeps-re-discovering-your-codebase-i-built-the-tool-that-stops-it-2f7c67ea8de0');
  assert.equal(playwright45.link, 'https://medium.com/startup-insider-edge/your-playwright-tests-take-45-minutes-cut-that-to-12-be3a6a1f5c49');
  assert.equal(geoPart1.link, 'https://medium.com/startup-insider-edge/a-qa-engineers-guide-to-testing-geo-specific-features-without-flying-to-30-countries-part-1-1e8e3f31b84f');
  assert.equal(aiAgent.date, NEW_ARTICLES[0].date);
  assert.equal(playwright45.date, NEW_ARTICLES[1].date);
  assert.equal(geoPart1.date, GEO_PART_1.date);
  assert.equal(geoPart1.featured, true);
  // geo reconciliation d2: the Part-2 entry stays, unfeatured
  const part2 = data.articles.find((a) => a.name === 'Testing Geo-Specific Features');
  assert.ok(part2, 'geo Part-2 entry stays');
  assert.ok(!part2.featured, 'Part-2 entry stays unfeatured (decision (d2))');
  assert.ok(!aiAgent.link.includes('?source='), 'RSS tracking param stripped');
});

// ---------------------------------------------------------------------------
// 8. Education — featured on MSc + BEng only (checker B-2 fix)
// ---------------------------------------------------------------------------

test('education: featured on MSc + BEng only; High School stays unfeatured and present', () => {
  assert.equal(data.education.length, 3);
  assert.deepStrictEqual(
    data.education.map((e) => e.degree),
    PRE_EDUCATION_DEGREES,
  );
  assert.equal(data.education[0].featured, true, 'MSc featured');
  assert.equal(data.education[1].featured, true, 'BEng featured');
  assert.ok(!data.education[2].featured, 'High School unfeatured, fully CLI-reachable');
});

// ---------------------------------------------------------------------------
// 9. Nothing-deleted ledger — untouched collections deep-equal pre-refresh
// ---------------------------------------------------------------------------

test('ledger: interests / favorite_games / presentations / skills byte-identical', () => {
  assert.deepStrictEqual(data.interests, PRE_INTERESTS);
  assert.deepStrictEqual(data.favorite_games, PRE_FAVORITE_GAMES);
  assert.deepStrictEqual(data.presentations, PRE_PRESENTATIONS);
  assert.deepStrictEqual(data.skills, PRE_SKILLS);
});

test('ledger: 4 non-docx roles intact; docx roles + all projects/other collections present', () => {
  for (const role of PRE_NON_DOCX_ROLES) {
    const entry = data.experience.find((e) => e.company === role.company);
    assert.ok(entry, `non-docx role retained: ${role.company}`);
    assert.equal(entry.title, role.title);
    assert.equal(entry.duration, role.duration);
  }
  // docx role order unchanged: Chubb, Upstream, Netcompany remain the first 3 entries
  assert.deepStrictEqual(
    data.experience.slice(0, 3).map((e) => e.company),
    ['Chubb', 'Upstream Systems', 'Netcompany-Intrasoft'],
  );
  // non-flagship projects keep their pre-refresh relative order + content
  assert.deepStrictEqual(
    data.projects.slice(2).map((p) => p.name),
    [
      'SDK4ED-TD',
      'ServicedMetricsCalculator',
      'Avoid Traffic Extended',
      'Uom Track',
      'Visualized Environment for Search Methods (VESM)',
      'The Petbook',
      'Landhaus',
      'Calbari',
      'Attendance Book Technological Institute of Serres',
      'The Elucidated',
      'Locate Nearest Stores',
      'Portfolio Website',
    ],
  );
});

// ---------------------------------------------------------------------------
// 10. About package (phase EXPLORE-09 plan 02 — REV-15/D-02): the 3 approved
//     new fields. Values approved verbatim in
//     .planning/phases/EXPLORE-09-editorial-motion-revision/about-data-draft.md
//     (APPROVAL BOX, 2026-09-24: all three fields approved as drafted).
//     availability is a verbatim transcription of the CLI welcome-banner line
//     (src/components/cli/outputs/WelcomeMessage.tsx:33/:42 — read-only
//     source; the CLI file itself is NOT edited). Metric values are
//     transcriptions of already-approved data strings, never computed at
//     render time. Write mechanics (draft §5): inserted after
//     profileImageUrl; .d.ts typing lands in the same commit (R-7).
// ---------------------------------------------------------------------------

const APPROVED_POSITIONING = [
  'I design test automation frameworks and AI-driven QA infrastructure that entire engineering organizations adopt.',
  '— not just run.',
];

const APPROVED_AVAILABILITY = 'Open to selective part-time work';

const APPROVED_METRICS = [
  { value: '12+', label: 'engineering teams' },
  { value: '30+', label: 'engineers' },
  { value: '7+', label: 'years' },
  { value: '600+', label: 'npm launch week' },
];

test('about.positioning: exactly the 2 approved lines, verbatim, in order (about-data-draft.md approval)', () => {
  assert.ok(Array.isArray(data.about.positioning), 'positioning is a string array');
  assert.equal(data.about.positioning.length, 2);
  assert.deepStrictEqual(data.about.positioning, APPROVED_POSITIONING);
});

test('about.availability: verbatim CLI banner transcription (WelcomeMessage.tsx:33/:42)', () => {
  assert.equal(data.about.availability, APPROVED_AVAILABILITY);
});

test('about.metrics: exactly the 4 approved {value,label} stats in approved order', () => {
  assert.ok(Array.isArray(data.about.metrics), 'metrics is an array');
  assert.equal(data.about.metrics.length, 4);
  assert.deepStrictEqual(data.about.metrics, APPROVED_METRICS);
  for (const metric of data.about.metrics) {
    assert.equal(typeof metric.value, 'string');
    assert.equal(typeof metric.label, 'string');
    assert.equal(metric.label, metric.label.toLowerCase(), `label stored lowercase: ${metric.label}`);
  }
});

test('metric values are transcriptions of already-approved data strings (never computed)', () => {
  assert.ok(
    data.core_competencies[0].proof.includes('12+ engineering teams'),
    '12+ source: Test Automation Architecture competency proof',
  );
  assert.ok(
    data.core_competencies[3].proof.includes('30+ engineers'),
    '30+ source: AI-Driven QA competency proof',
  );
  assert.ok(data.about.description.includes('7+ years'), '7+ source: about.description');
  assert.ok(
    data.projects[0].description.includes('600+ downloads in launch week'),
    '600+ source: DeepIndex description',
  );
});

test('the 3 new about fields are purely additive — every pre-existing key survives', () => {
  const keys = Object.keys(data.about);
  for (const key of ['name', 'title', 'location', 'dob', 'email', 'description', 'contact', 'profileImageUrl']) {
    assert.ok(keys.includes(key), `pre-existing about key retained: ${key}`);
  }
  for (const key of ['positioning', 'availability', 'metrics']) {
    assert.ok(keys.includes(key), `new about key present: ${key}`);
  }
  // write mechanics (draft §5): the new fields ride after profileImageUrl
  assert.ok(
    keys.indexOf('positioning') > keys.indexOf('profileImageUrl'),
    'new fields inserted after profileImageUrl',
  );
});