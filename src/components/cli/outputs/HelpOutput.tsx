
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const HelpOutput = () => (
  <>
    <p className="text-accent font-bold">Available Commands:</p>
    <ul className="list-none pl-2 space-y-1">
      <li><span className="text-primary w-36 inline-block">about</span>                  - Display {portfolioData.about.name}'s summary</li>
      <li><span className="text-primary w-36 inline-block">contact</span>                - Show contact information</li>
      <li><span className="text-primary w-36 inline-block">experience</span>             - View professional experience</li>
      <li><span className="text-primary w-36 inline-block">education</span>              - Display educational background</li>
      <li><span className="text-primary w-36 inline-block">skills</span>                 - List technical skills</li>
      <li><span className="text-primary w-36 inline-block">advanced</span>               - Show more/utility commands</li>
      <li><span className="text-primary w-36 inline-block">clear</span>                  - Clear terminal & show welcome message</li>
    </ul>
  </>
);
