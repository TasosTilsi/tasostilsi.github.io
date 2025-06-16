
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData, EducationEntry } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const EducationOutput = ({ mode = 'default' }: { mode?: 'default' | 'all' }) => {
  const allEducation = portfolioData.education as EducationEntry[];
  const educationToDisplay = mode === 'all'
    ? allEducation
    : allEducation.filter(edu => edu.degree !== "High School Degree");

  if (educationToDisplay.length === 0 && mode === 'default') {
    return <p className="text-sm">No higher education listed. For complete history, type 'education --all' or 'education -a'.</p>;
  }
  if (educationToDisplay.length === 0) {
    return <p className="text-sm">No education entries found.</p>;
  }

  return (
    <>
      {mode === 'default' && allEducation.some(edu => edu.degree === "High School Degree") && educationToDisplay.length < allEducation.length && (
        <p className="text-sm text-muted-foreground mb-2">
          Showing main educational achievements. For complete history (including high school), type 'education -a' or 'education --all'.
        </p>
      )}
      {educationToDisplay.map((edu: EducationEntry, index: number) => (
        <div key={edu.institution + index} className="mb-4">
          <p className="text-accent font-semibold">{edu.degree}</p>
          <p className="text-muted-foreground">{edu.institution} ({edu.duration})</p>
          {edu.location && <p className="text-sm">Location: {edu.location}</p>}
          {edu.specialization && <p className="text-sm">Specialization: {edu.specialization}</p>}
          {Array.isArray(edu.courses) && edu.courses.length > 0 && (
            <>
              <p className="text-sm mt-1">Key Courses:</p>
              <ul className="list-disc list-inside pl-2 text-sm">
                {edu.courses.map((course, i) => <li key={i}>{course}</li>)}
              </ul>
            </>
          )}
          {edu.courses && typeof edu.courses === 'object' && !Array.isArray(edu.courses) && Object.keys(edu.courses).length > 0 && (
            <>
              <p className="text-sm mt-1">Key Courses/Details:</p>
              <ul className="list-disc list-inside pl-2 text-sm">
                {Object.entries(edu.courses).map(([key, value]) => (
                  <li key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${(value as string[]).join(', ')}`}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </>
  );
};
