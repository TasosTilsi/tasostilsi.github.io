
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData, Project } from '@/data/portfolio-main-data';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { isValidUrl } from '@/lib/utils';

const portfolioData = portfolioDataJson as PortfolioData;

export const ProjectsOutput = ({ mode = 'recent', onViewProject }: { mode?: 'recent' | 'all', onViewProject?: (project: Project) => void }) => {
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
          <div className="flex flex-wrap gap-2 mt-2">
            {(project.name.includes("VESM") || project.name === "Uom Track") && onViewProject && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProject(project)}
                className="text-xs h-7"
              >
                <i className="fas fa-play mr-1" aria-hidden="true"></i>View Inline
              </Button>
            )}

            {isValidUrl(project.link) && (
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  {project.link.includes("github.com") ? (
                    <>
                      <i className="fab fa-github mr-1" aria-hidden="true"></i>Source
                    </>
                  ) : (
                    <>
                      <i className="fas fa-external-link-alt mr-1" aria-hidden="true"></i>Open in New Tab
                    </>
                  )}
                </Button>
              </a>
            )}

            {isValidUrl(project.sourceUrl) && (
              <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  <i className="fab fa-github mr-1" aria-hidden="true"></i>Source
                </Button>
              </a>
            )}
          </div>
          {index < projectsToDisplay.length - 1 && <Separator className="my-2 bg-muted-foreground/20" />}
        </div>
      ))}
    </>
  );
};
