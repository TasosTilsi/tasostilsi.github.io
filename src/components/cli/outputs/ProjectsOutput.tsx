
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData, Project } from '@/data/portfolio-main-data';
import { Separator } from '@/components/ui/separator';
import { isValidUrl } from '@/lib/utils';

const portfolioData = portfolioDataJson as PortfolioData;

export const ProjectsOutput = ({ mode = 'recent' }: { mode?: 'recent' | 'all' }) => {
  const projectsToDisplay = mode === 'all'
    ? portfolioData.projects
    : portfolioData.projects.slice(0, 7);

  if (projectsToDisplay.length === 0) {
    return <p className="text-sm">No projects found.</p>;
  }
  return (
    <>
      {mode === 'recent' && portfolioData.projects.length > 7 && (
        <p className="text-sm text-muted-foreground mb-2">
          Showing first 7 projects. Use 'projects -a' or 'projects --all' to see all.
        </p>
      )}
      {projectsToDisplay.map((project: Project, index: number) => (
        <div key={(project.name || 'project') + index} className="mb-4">
          <p className="text-accent font-semibold">{project.name}</p>
          {project.date && <p className="text-sm text-muted-foreground">Date: {project.date}</p>}
          {project.description && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{project.description}</p>}
          {isValidUrl(project.link) && <p className="text-sm">Link: <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">{project.link}</a></p>}
          {isValidUrl(project.sourceUrl) && <p className="text-sm">Source: <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">{project.sourceUrl}</a></p>}
          {index < projectsToDisplay.length - 1 && <Separator className="my-2 bg-muted-foreground/20" />}
        </div>
      ))}
    </>
  );
};
