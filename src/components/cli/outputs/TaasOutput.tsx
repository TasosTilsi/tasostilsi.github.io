
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const TaasOutput = () => {
  const email = portfolioData.about.email;
  const linkedin = portfolioData.about.contact.linkedin;

  return (
    <div className="flex flex-col gap-3 my-2 font-mono text-sm">
      <p className="text-accent font-bold">🚀 INTRODUCING TAaS: Tasos as a Service</p>
      <div className="border-b border-accent/30" />

      <p className="leading-relaxed text-muted-foreground">
        A premium, on-demand engineering resource for tech startups and scale-ups.
        Subscribe to top-tier development and automation infrastructure without
        the overhead, equity, or management friction of a full-time hire.
      </p>

      <div>
        <p className="text-accent font-bold mb-2">📊 THE TAaS SERVICE MENU:</p>
        <div className="border-b border-accent/30 mb-2" />
        <div className="space-y-3">
          <div>
            <p className="text-primary">[pkg_01] Framework-as-a-Service (FaaS)</p>
            <p className="pl-4 text-muted-foreground">- End-to-end implementation of a modern Playwright/TS suite.</p>
            <p className="pl-4 text-muted-foreground">- Best for: Teams shipping fast with zero test coverage.</p>
          </div>
          <div>
            <p className="text-primary">[pkg_02] Full-Stack-as-a-Service (FSaaS)</p>
            <p className="pl-4 text-muted-foreground">- On-demand feature development (Node.js, React, TypeScript).</p>
            <p className="pl-4 text-muted-foreground">- Best for: Clearing backlog bottlenecks and building MVPs.</p>
          </div>
          <div>
            <p className="text-primary">[pkg_03] Pipeline-as-a-Service (PaaS)</p>
            <p className="pl-4 text-muted-foreground">- Dockerizing test environments and integrating GitHub Actions.</p>
            <p className="pl-4 text-muted-foreground">- Best for: Teams suffering from long deployment times.</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-accent font-bold mb-2">⚙️ SERVICE SLA (Service Level Agreement):</p>
        <div className="border-b border-accent/30 mb-2" />
        <ul className="space-y-1">
          <li><span className="text-primary">• Capacity</span><span className="text-muted-foreground">     : 10-15 highly focused engineering hours per week.</span></li>
          <li><span className="text-primary">• Delivery</span><span className="text-muted-foreground">     : Weekly sprint milestones via async PRs and Loom videos.</span></li>
          <li><span className="text-primary">• Uptime</span><span className="text-muted-foreground">       : Active on evenings &amp; weekends (EET/EEST).</span></li>
        </ul>
      </div>

      <div>
        <p className="text-accent font-bold mb-2">🚀 READY TO SCALE YOUR ENGINEERING?</p>
        <div className="border-b border-accent/30 mb-2" />
        <p className="mb-2 text-muted-foreground">
          Let&apos;s discuss your project scope, architecture bottleneck, or MVP roadmap.
        </p>
        <div className="space-y-1">
          <p>
            <span className="text-primary">👉 </span>
            Click the <span className="text-accent">&apos;Contact&apos;</span> button or email directly:{' '}
            <a href={`mailto:${email}`} className="text-accent hover:underline break-all">
              {email}
            </a>
          </p>
          <p>
            <span className="text-primary">👉 </span>
            Let&apos;s connect on LinkedIn:{' '}
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
              {linkedin}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
