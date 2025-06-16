
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const InterestsOutput = () => (
  <>
    <p className="text-accent font-semibold">Interests:</p>
    {portfolioData.interests && portfolioData.interests.length > 0 && (
       <ul className="list-disc list-inside pl-2 text-sm space-y-1">
         {portfolioData.interests.map((interest, index) => <li key={index}>{interest}</li>)}
       </ul>
    )}
  </>
);
