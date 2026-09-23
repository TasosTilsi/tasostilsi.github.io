const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/portfolio-main-data.json');
const outputPath = path.join(__dirname, '../public/resume-export.html');

const portfolioData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const { about, experience, education, projects, certifications, articles, core_competencies } = portfolioData;

// HTML-escape every injected data string.
const esc = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Docx selection contract (D-08, UI-SPEC §8): the U-4 isTechRelated filter
// selects the docx's three roles; featured flags select the docx's two
// projects, two degrees, five certifications and five writing entries.
// Data order everywhere — JSON order is render order.
const roles = experience.filter((job) => job.isTechRelated);
const flagshipProjects = projects.filter((project) => project.featured);
const featuredEducation = education.filter((edu) => edu.featured);
const featuredCertifications = certifications.filter((cert) => cert.featured);
const featuredArticles = articles.filter((article) => article.featured);

// Contact rows built from about.contact — data-driven, no hardcoded URLs.
const contactItems = [
  { icon: 'fas fa-envelope', label: about.contact.email, href: `mailto:${about.contact.email}` },
  { icon: 'fab fa-linkedin', label: 'LinkedIn', href: about.contact.linkedin },
  { icon: 'fab fa-github', label: 'GitHub', href: about.contact.github },
  { icon: 'fas fa-globe', label: 'Portfolio', href: about.contact.portfolio || 'https://tasostilsi.github.io/' },
].filter((item) => item.href);

const stripUrl = (value) => value.replace(/^https?:\/\/(www\.)?/, '');

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${esc(about.name)}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700;800&display=swap');

        :root {
            --bg-dark: #0b1326;
            --text-primary: #dae2fd;
            --text-accent: #8fdb00;
            --text-muted: #c6c6cb;
            --border-color: rgba(255, 255, 255, 0.05);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            background-color: var(--bg-dark);
            color: var(--text-primary);
            font-size: 12px;
            line-height: 1.4;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        /* Single-column 210mm document (docx order) */
        .resume-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 30px 35px;
            position: relative;
            display: block;
            background-color: var(--bg-dark);
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
        }

        a {
            color: var(--text-accent);
            text-decoration: none;
            border-bottom: 1px dotted rgba(143, 219, 0, 0.3);
            transition: color 0.2s;
        }

        a:hover {
            border-bottom-style: solid;
        }

        h1 {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -1.2px;
            text-transform: uppercase;
            line-height: 0.9;
            margin-bottom: 6px;
        }

        .job-title {
            font-size: 9.5px;
            font-weight: 700;
            color: var(--text-accent);
            text-transform: uppercase;
            letter-spacing: 2.5px;
            margin-bottom: 8px;
        }

        .location {
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.6;
            margin-bottom: 12px;
        }

        /* Docx contact line: location | email | LinkedIn | GitHub | Portfolio */
        .contact-line {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 6px;
            font-size: 9.5px;
            margin-bottom: 6px;
        }

        .contact-link {
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .contact-link i {
            color: var(--text-accent);
            opacity: 0.8;
        }

        .contact-sep {
            opacity: 0.4;
        }

        .section-title {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 4px;
            color: var(--text-accent);
            margin-bottom: 14px;
            margin-top: 22px;
            display: flex;
            align-items: center;
        }

        .section-title span {
            opacity: 0.4;
            margin-right: 8px;
        }

        .main-summary {
            font-size: 11px;
            line-height: 1.5;
            color: var(--text-muted);
            break-inside: avoid;
        }

        .competency-row {
            margin-bottom: 7px;
            break-inside: avoid;
        }

        .competency-name {
            font-size: 10.5px;
            font-weight: 700;
        }

        .competency-proof {
            font-size: 9.5px;
            color: var(--text-muted);
            line-height: 1.4;
        }

        .experience-item {
            margin-bottom: 14px;
            position: relative;
            padding-left: 18px;
            border-left: 1px solid var(--border-color);
            break-inside: avoid;
        }

        .experience-item::before {
            content: '';
            position: absolute;
            left: -4px;
            top: 4px;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: var(--bg-dark);
            border: 2px solid var(--text-accent);
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
        }

        .item-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .item-date {
            font-size: 9.5px;
            font-weight: 700;
            color: var(--text-accent);
            opacity: 0.8;
            text-transform: uppercase;
        }

        .item-company {
            font-size: 10.5px;
            font-weight: 700;
            margin-bottom: 8px;
            opacity: 0.8;
        }

        .item-details {
            list-style: none;
        }

        .item-details li {
            font-size: 10.5px;
            margin-bottom: 3px;
            color: var(--text-muted);
            display: flex;
            gap: 8px;
        }

        .item-details li::before {
            content: '>';
            color: var(--text-accent);
            opacity: 0.5;
            flex-shrink: 0;
        }

        .project-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .project-card {
            border: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.02);
            border-radius: 4px;
            padding: 12px;
            break-inside: avoid;
        }

        .project-card .item-title {
            font-size: 12px;
        }

        .project-card .item-details li {
            font-size: 10px;
        }

        .project-card .item-details li.card-desc {
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .project-link a {
            font-size: 9.5px;
            opacity: 0.8;
        }

        .education-item {
            margin-bottom: 12px;
            break-inside: avoid;
        }

        .edu-focus {
            font-size: 9.5px;
            color: var(--text-muted);
            font-style: italic;
        }

        .resume-item {
            margin-bottom: 9px;
            font-size: 10.5px;
            break-inside: avoid;
        }

        .resume-item-name {
            font-weight: 700;
            display: block;
        }

        .resume-item-meta {
            font-size: 9px;
            opacity: 0.6;
        }

        @media print {
            body {
                background: white;
                color: black;
            }
            .resume-container {
                margin: 0;
                box-shadow: none;
                width: 210mm;
                padding: 25px 30px;
            }
            :root {
                --text-primary: #000;
                --text-muted: #333;
                --text-accent: #0044cc; /* Blue for print readability */
            }
            /* Show URLs for print readability */
            a[href^="http"]:after {
                content: " (" attr(href) ")";
                font-size: 8px;
                opacity: 0.6;
            }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <header>
            <h1>${esc(about.name)}</h1>
            <div class="job-title">${esc(about.title)}</div>
            <div class="location">${esc(about.location)}</div>
            <div class="contact-line">
                ${contactItems.map((item) => `<a class="contact-link" href="${esc(item.href)}" target="_blank"><i class="${item.icon}"></i>${esc(item.label)}</a>`).join('<span class="contact-sep">|</span>')}
            </div>
        </header>

        <h3 class="section-title"><span>//</span> SUMMARY</h3>
        <div class="main-summary">
            ${esc(about.description)}
        </div>

        <h3 class="section-title"><span>//</span> CORE COMPETENCIES</h3>
        <div class="competency-list">
            ${core_competencies.map((competency) => `
                <div class="competency-row">
                    <div class="competency-name">${esc(competency.name)}</div>
                    <div class="competency-proof">${esc(competency.proof)}</div>
                </div>
            `).join('')}
        </div>

        <h3 class="section-title"><span>//</span> PROFESSIONAL EXPERIENCE</h3>
        <div class="experience-list">
            ${roles.map((job) => `
                <div class="experience-item">
                    <div class="item-header">
                        <h4 class="item-title">${esc(job.title)}</h4>
                        <span class="item-date">${esc(job.duration)}</span>
                    </div>
                    <div class="item-company">${esc(job.company)} — ${esc(job.location)}</div>
                    <ul class="item-details">
                        ${(job.responsibilities || []).map((resp) => `<li>${esc(resp)}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        <h3 class="section-title"><span>//</span> PROJECTS</h3>
        <div class="project-grid">
            ${flagshipProjects.map((project) => `
                <div class="project-card">
                    <div class="item-header">
                        <h4 class="item-title">${esc(project.name)}</h4>
                        <span class="item-date">${esc(project.date || '')}</span>
                    </div>
                    <ul class="item-details">
                        <li class="card-desc">${esc(project.description)}</li>
                        ${project.link ? `<li class="project-link"><a href="${esc(project.link)}" target="_blank">${esc(stripUrl(project.link))}</a></li>` : ''}
                        ${project.sourceUrl ? `<li class="project-link"><a href="${esc(project.sourceUrl)}" target="_blank">${esc(stripUrl(project.sourceUrl))}</a></li>` : ''}
                    </ul>
                </div>
            `).join('')}
        </div>

        <h3 class="section-title"><span>//</span> EDUCATION</h3>
        <div class="education-list">
            ${featuredEducation.map((edu) => `
                <div class="education-item">
                    <div class="item-header">
                        <h4 class="item-title">${esc(edu.degree)}</h4>
                        <span class="item-date">${esc(edu.duration)}</span>
                    </div>
                    <div class="item-company">${esc(edu.institution)}${edu.location ? ` — ${esc(edu.location)}` : ''}</div>
                    ${edu.specialization ? `<div class="edu-focus">focus: ${esc(edu.specialization)}</div>` : ''}
                </div>
            `).join('')}
        </div>

        <h3 class="section-title"><span>//</span> CERTIFICATIONS</h3>
        <div class="cert-list">
            ${featuredCertifications.map((cert) => `
                <div class="resume-item">
                    <span class="resume-item-name">${esc(cert.name)}</span>
                    <span class="resume-item-meta">${esc(cert.date)}${cert.link && cert.link.startsWith('ID:') ? ` — ${esc(cert.link)}` : ''}</span>
                </div>
            `).join('')}
        </div>

        <h3 class="section-title"><span>//</span> SELECTED WRITING</h3>
        <div class="writing-list">
            ${featuredArticles.map((article) => `
                <div class="resume-item">
                    <span class="resume-item-name"><a href="${esc(article.link)}" target="_blank">${esc(article.name)}</a></span>
                    <span class="resume-item-meta">${esc(article.platform)} — ${esc(article.date)}</span>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
`;

fs.writeFileSync(outputPath, html);
console.log('✅ Success: public/resume-export.html generated.');