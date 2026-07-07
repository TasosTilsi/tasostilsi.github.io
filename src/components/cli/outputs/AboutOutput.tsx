
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const AboutOutput = () => {
  // Calculate years of experience (assuming first experience entry is the start)
  const calculateYearsOfExperience = () => {
    if (!portfolioData.experience || portfolioData.experience.length === 0) return 0;
    const firstJob = portfolioData.experience[portfolioData.experience.length - 1];
    const startYear = parseInt(firstJob.duration.split('-')[0].trim());
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  };

  const yearsOfExperience = calculateYearsOfExperience();

  return (
    <div className="flex flex-col gap-3">
      {/* ASCII Banner - Desktop */}
      <pre className="text-accent font-mono text-xs sm:text-sm leading-tight hidden sm:block">
        {`╔═══════════════════════════════════════════════════════════╗
║  ${portfolioData.about.name.toUpperCase().padEnd(57)}║
║  ${(portfolioData.about.title || '').padEnd(57)}║
╚═══════════════════════════════════════════════════════════╝`}
      </pre>

      {/* Mobile Header */}
      <div className="sm:hidden">
        <p className="text-accent font-bold text-lg">{portfolioData.about.name}</p>
        <p className="text-muted-foreground text-sm">{portfolioData.about.title}</p>
        <div className="border-b border-accent/30 my-2"></div>
      </div>

      {/* Description */}
      <p className="whitespace-pre-wrap leading-relaxed">{portfolioData.about.description}</p>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Also open to selective part-time consulting in test automation and CI/CD — type{' '}
        <span className="text-accent">taas</span> for details.
      </p>

      {/* Quick Stats */}
      <div className="mt-2">
        <p className="text-accent font-semibold mb-2">Quick Stats:</p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-primary">📍 Location:</span>
            <span>{portfolioData.about.location || 'Remote'}</span>
          </div>
          {yearsOfExperience > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-primary">💼 Experience:</span>
              <span>{yearsOfExperience}+ years</span>
            </div>
          )}
          {portfolioData.education && portfolioData.education.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-primary">🎓 Education:</span>
              <span>{portfolioData.education[0].degree}</span>
            </div>
          )}
          {portfolioData.skills?.languages && portfolioData.skills.languages.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-primary">🌐 Languages:</span>
              <span>{portfolioData.skills.languages.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
