
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const WelcomeMessage = () => {
  return (
    <>
      <p>Welcome to {portfolioData.about.name}'s Interactive Portfolio!</p>
      <p>Type 'help' to see a list of available commands.</p>
      <br />
    </>
  );
};
