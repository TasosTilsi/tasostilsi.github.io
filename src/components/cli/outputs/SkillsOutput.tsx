
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const SkillsOutput = () => (
  <>
    {portfolioData.skills.soft_skills && portfolioData.skills.soft_skills.length > 0 && (
      <div className="mb-3">
        <p className="text-accent font-semibold">Soft Skills:</p>
        <p className="text-sm flex flex-wrap gap-2">
          {portfolioData.skills.soft_skills.map(skill => (
            <span key={skill} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{skill}</span>
          ))}
        </p>
      </div>
    )}
    {portfolioData.skills.hard_skills && Object.entries(portfolioData.skills.hard_skills).map(([category, items]) => (
      <div key={category} className="mb-3">
        <p className="text-accent font-semibold">{category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</p>
        <p className="text-sm flex flex-wrap gap-2">
          {(items as string[]).map(skill => (
            <span key={skill} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{skill}</span>
          ))}
        </p>
      </div>
    ))}
     {portfolioData.skills.languages && portfolioData.skills.languages.length > 0 && (
        <div className="mt-3">
            <p className="text-accent font-semibold">Languages:</p>
            <p className="text-sm flex flex-wrap gap-2">
            {portfolioData.skills.languages.map(lang => (
                <span key={lang} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{lang}</span>
            ))}
            </p>
        </div>
      )}
  </>
);
