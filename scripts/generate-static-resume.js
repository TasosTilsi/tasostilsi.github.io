const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/portfolio-main-data.json');
const outputPath = path.join(__dirname, '../public/resume-export.html');

const portfolioData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const { about, experience, education, skills, projects, certifications, articles } = portfolioData;

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${about.name}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700;800&display=swap');

        :root {
            --bg-dark: #0b1326;
            --bg-sidebar: #131b2e;
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
            font-family: 'JetBrains+Mono', 'Courier New', monospace;
            background-color: var(--bg-dark);
            color: var(--text-primary);
            font-size: 12px;
            line-height: 1.4;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        .resume-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            position: relative;
            display: flex;
            background-color: var(--bg-dark);
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
        }

        /* Sidebar: 33% */
        .sidebar {
            width: 33%;
            background-color: var(--bg-sidebar);
            padding: 25px 20px;
            display: flex;
            flex-direction: column;
            border-right: 1px solid var(--border-color);
        }

        /* Main: 67% */
        .main {
            width: 67%;
            padding: 30px 35px;
            background-color: var(--bg-dark);
        }

        a {
            color: inherit;
            text-decoration: none;
            transition: color 0.2s;
        }

        .sidebar a:hover {
            color: var(--text-accent);
            text-decoration: underline;
        }

        .main a {
            color: var(--text-accent);
            text-decoration: none;
            border-bottom: 1px dotted rgba(143, 219, 0, 0.3);
        }

        .main a:hover {
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
            margin-bottom: 10px;
        }

        .location {
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.6;
            margin-bottom: 20px;
        }

        .contact-list {
            margin-top: 15px;
            list-style: none;
        }

        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 10px;
        }

        .contact-item i {
            width: 18px;
            color: var(--text-accent);
            opacity: 0.8;
            margin-right: 8px;
        }

        .section-title {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 4px;
            color: var(--text-accent);
            margin-bottom: 18px;
            display: flex;
            align-items: center;
        }

        .section-title span {
            opacity: 0.4;
            margin-right: 8px;
        }

        .skill-group {
            margin-bottom: 18px;
        }

        .skill-group-title {
            font-size: 9.5px;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 8px;
            opacity: 0.7;
        }

        .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }

        .tag {
            font-size: 9px;
            padding: 3px 6px;
            background: rgba(143, 219, 0, 0.05);
            border: 1px solid rgba(143, 219, 0, 0.2);
            color: var(--text-accent);
            border-radius: 3px;
        }

        .main-summary {
            font-size: 11px;
            line-height: 1.5;
            color: var(--text-muted);
            margin-bottom: 20px;
        }

        .experience-item {
            margin-bottom: 12px;
            position: relative;
            padding-left: 18px;
            border-left: 1px solid var(--border-color);
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

        .education-item {
            margin-bottom: 25px;
        }

        .sidebar-item {
            margin-bottom: 15px;
            font-size: 11px;
        }

        .sidebar-item-name {
            font-weight: 700;
            display: block;
        }

        .sidebar-item-meta {
            font-size: 9.5px;
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
                height: 297mm;
                overflow: hidden;
            }
            .sidebar {
                background-color: #f7f7f7 !important;
                border-right: 1px solid #eee;
            }
            .main {
                background-color: white !important;
            }
            :root {
                --text-primary: #000;
                --text-muted: #333;
                --text-accent: #0044cc; /* Blue for print readability */
            }
            .tag {
                border-color: #ddd;
                background: none;
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
        <!-- Sidebar Column -->
        <div class="sidebar">
            <header>
                <h1>${about.name}</h1>
                <div class="job-title">${about.title}</div>
                <div class="location">${about.location}</div>

                <ul class="contact-list">
                    <li class="contact-item">
                        <i class="fas fa-envelope"></i> 
                        <a href="mailto:${about.contact.email}">${about.contact.email}</a>
                    </li>
                    <li class="contact-item">
                        <i class="fab fa-linkedin"></i> 
                        <a href="https://linkedin.com/in/tasostilsi" target="_blank">LinkedIn Profile</a>
                    </li>
                    <li class="contact-item">
                        <i class="fab fa-github"></i> 
                        <a href="https://github.com/tasostilsi" target="_blank">GitHub Portfolio</a>
                    </li>
                    <li class="contact-item">
                        <i class="fas fa-globe"></i> 
                        <a href="https://tasostilsi.github.io" target="_blank">Official Website</a>
                    </li>
                </ul>
            </header>

            <div style="margin-top: 20px;">
                <h3 class="section-title"><span>//</span> SKILLS.SYS</h3>
                
                <div class="skill-group">
                    <div class="skill-group-title">Languages</div>
                    <div class="skill-tags">
                        ${skills.hard_skills.Languages.map(s => `<span class="tag">${s}</span>`).join('')}
                    </div>
                </div>

                <div class="skill-group">
                    <div class="skill-group-title">Testing</div>
                    <div class="skill-tags">
                        ${skills.hard_skills.Testing.map(s => `<span class="tag">${s}</span>`).join('')}
                    </div>
                </div>

                <div class="skill-group">
                    <div class="skill-group-title">DevOps</div>
                    <div class="skill-tags">
                        ${skills.hard_skills.Infrastructure.map(s => `<span class="tag">${s}</span>`).join('')}
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <h3 class="section-title"><span>//</span> ARTICLES.LOG</h3>
                ${articles.slice(0, 4).map(a => `
                    <div class="sidebar-item">
                        <span class="sidebar-item-name">
                            <a href="${a.link || '#'}" target="_blank">${a.name}</a>
                        </span>
                        <span class="sidebar-item-meta">${a.platform} — ${a.date}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 20px;">
                <h3 class="section-title"><span>//</span> CERTS.KEY</h3>
                <div class="sidebar-item">
                    <span class="sidebar-item-name">ISTQB® Foundation Level (CTFL)</span>
                    <span class="sidebar-item-meta">ID: GRTB-24-1S20-CTFL</span>
                </div>
            </div>
        </div>

        <!-- Main Column -->
        <div class="main">
            <h3 class="section-title"><span>//</span> SUMMARY.EXE</h3>
            <div class="main-summary">
                ${about.description}
            </div>

            <h3 class="section-title"><span>//</span> EXPERIENCE.SH</h3>
            <div class="experience-list">
                ${experience.slice(0, 3).map(job => `
                    <div class="experience-item">
                        <div class="item-header">
                            <h4 class="item-title">${job.title}</h4>
                            <span class="item-date">${job.duration}</span>
                        </div>
                        <div class="item-company">${job.company}</div>
                        <ul class="item-details">
                            ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>

            <h3 class="section-title" style="margin-top: 25px;"><span>//</span> EDUCATION.BIN</h3>
            <div class="education-list">
                ${education.filter(edu => edu.degree.toLowerCase().includes('science') || edu.degree.toLowerCase().includes('master') || edu.degree.toLowerCase().includes('bachelor')).map(edu => `
                    <div class="education-item">
                        <div class="item-header">
                            <h4 class="item-title">${edu.degree}</h4>
                            <span class="item-date">${edu.duration}</span>
                        </div>
                        <div class="item-company">${edu.institution}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>

    <!-- Clickable Links Overlay (Hidden during print) -->
    <!-- Not strictly needed as native <a> tags work in PDF, but we could add a floating info bar if the user wanted -->
</body>
</html>
`;

fs.writeFileSync(outputPath, html);
console.log('✅ Success: public/resume-export.html generated.');
