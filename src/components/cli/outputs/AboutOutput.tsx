
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const AboutOutput = () => (
  <>
    <p className="text-accent font-bold">{portfolioData.about.name}</p>
    {portfolioData.about.title && <p className="text-muted-foreground">{portfolioData.about.title}</p>}
    <br />
    <p className="mb-2 whitespace-pre-wrap">{portfolioData.about.description}</p>
  </>
);
