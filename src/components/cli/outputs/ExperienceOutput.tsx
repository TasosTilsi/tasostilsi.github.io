
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData, ExperienceEntry } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const ExperienceOutput = ({ mode = 'default' }: { mode?: 'default' | 'all' }) => {
  const allExperience: ExperienceEntry[] = portfolioData.experience as unknown as ExperienceEntry[];
  const experienceToDisplay = mode === 'all'
    ? allExperience
    : allExperience.filter(exp => exp.isTechRelated);

  if (experienceToDisplay.length === 0 && mode === 'default') {
    return <p className="text-sm">No tech-related experience listed. For complete history, type 'experience --all' or 'experience -a'.</p>;
  }
  if (experienceToDisplay.length === 0) {
    return <p className="text-sm">No experience entries found.</p>;
  }
  
  return (
    <>
      {mode === 'default' && allExperience.some(exp => !exp.isTechRelated) && experienceToDisplay.length < allExperience.length && (
        <p className="text-sm text-muted-foreground mb-2">
          Showing tech-related experience. For full history, use 'experience -a' or 'experience --all'.
        </p>
      )}
      {experienceToDisplay.map((exp, index) => (
        <div key={index} className="mb-4">
          <p className="text-accent font-semibold">{exp.title} @ {exp.company}</p>
          <p className="text-muted-foreground text-sm">{exp.duration} {exp.location && `| ${exp.location}`}</p>
          {exp.responsibilities && exp.responsibilities.length > 0 && (
            <ul className="list-disc list-inside pl-2 mt-1 text-sm">
              {exp.responsibilities.map((resp, i) => <li key={i} className="whitespace-pre-wrap">{resp}</li>)}
            </ul>
          )}
        </div>
      ))}
    </>
  );
};
