
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const TaasOutput = () => {
  const email = portfolioData.about.email;
  const linkedin = portfolioData.about.contact.linkedin;

  return (
    <div className="flex flex-col gap-3 my-2 font-mono text-sm">
      <p className="text-accent font-bold">PART-TIME ENGAGEMENTS (TAaS)</p>
      <div className="border-b border-accent/30" />

      <p className="leading-relaxed">
        I work full-time as a {portfolioData.about.title} and take a small number of
        async, scoped projects on evenings and weekends (EET/EEST).
      </p>

      <p className="text-muted-foreground text-xs italic">
        TAaS = Tasos as a Service — my label for these focused engagements, not an agency.
      </p>

      <div>
        <p className="text-accent font-semibold mb-2">Typical engagements:</p>
        <div className="border-b border-accent/30 mb-2" />
        <ul className="space-y-2">
          <li>
            <span className="text-primary">Framework work (FaaS)</span>
            <p className="pl-4 text-muted-foreground">Playwright/TypeScript suite from zero through CI integration.</p>
            <p className="pl-4 text-muted-foreground text-xs">Best when: shipping fast with little or no test coverage.</p>
          </li>
          <li>
            <span className="text-primary">Pipeline work (PaaS)</span>
            <p className="pl-4 text-muted-foreground">Dockerized test environments, GitHub Actions, faster deploy cycles.</p>
            <p className="pl-4 text-muted-foreground text-xs">Best when: CI/CD or test infra is the bottleneck.</p>
          </li>
          <li>
            <span className="text-primary">Full-stack work (FSaaS)</span>
            <p className="pl-4 text-muted-foreground">Scoped feature work in Node.js, React, and TypeScript.</p>
            <p className="pl-4 text-muted-foreground text-xs">Best when: backlog or MVP delivery needs an extra pair of hands.</p>
          </li>
        </ul>
      </div>

      <div>
        <p className="text-accent font-semibold mb-2">How I work:</p>
        <div className="border-b border-accent/30 mb-2" />
        <ul className="space-y-1">
          <li><span className="text-primary">Capacity</span><span className="text-muted-foreground">  : ~10–15 focused hours per week</span></li>
          <li><span className="text-primary">Delivery</span><span className="text-muted-foreground">  : weekly PRs + short Loom walkthroughs</span></li>
          <li><span className="text-primary">Model</span><span className="text-muted-foreground">    : async, milestone-based — no hourly babysitting</span></li>
        </ul>
      </div>

      <p className="text-muted-foreground text-sm">
        The kind of frameworks and pipelines described in{' '}
        <span className="text-accent">experience</span> and{' '}
        <span className="text-accent">projects</span> — available in scoped engagements.
      </p>

      <div>
        <p className="text-accent font-semibold mb-2">If something here matches a bottleneck you&apos;re hitting:</p>
        <div className="border-b border-accent/30 mb-2" />
        <div className="space-y-1">
          <p>
            <span className="text-primary">contact</span>
            <span className="text-muted-foreground"> → </span>
            <a href={`mailto:${email}`} className="text-accent hover:underline break-all">
              {email}
            </a>
          </p>
          <p>
            <span className="text-primary">LinkedIn</span>
            <span className="text-muted-foreground"> → </span>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
              {linkedin}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
