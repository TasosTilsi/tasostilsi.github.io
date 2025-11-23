"use client";

import { PortfolioData } from "@/data/portfolio-main-data";
import { isValidUrl } from "@/lib/utils";

interface ResumeProjectsProps {
  data: PortfolioData;
  limit?: number;
}

const ResumeProjects: React.FC<ResumeProjectsProps> = ({ data, limit = 6 }) => {
  // Sort projects by date (most recent first) and select top projects
  const selectedProjects = data.projects
    ?.sort((a, b) => {
      // Parse dates for sorting - assume most recent first based on the data structure
      const dateA = new Date(a.date || '2000').getTime();
      const dateB = new Date(b.date || '2000').getTime();
      return dateB - dateA;
    })
    .slice(0, limit) || [];

  if (selectedProjects.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 print:mb-6" style={{ breakInside: "avoid" }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200 print:text-base print:mb-2">
        KEY PROJECTS
      </h3>
      <div className="space-y-2 print:space-y-2">
        {selectedProjects.map((project, index) => (
          <div
            key={index}
            className="print:mb-3"
            style={{ breakInside: "avoid-page" }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h4 className="text-base font-semibold text-gray-900 print:text-sm">
                    {project.name}
                  </h4>
                  {isValidUrl(project.link) && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline print:text-blue-700"
                    >
                      [View Project]
                    </a>
                  )}
                  {isValidUrl(project.sourceUrl) && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline print:text-blue-700"
                    >
                      [Source Code]
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed print:text-xs print:leading-normal">
                  {project.description}
                </p>
              </div>
              {project.date && (
                <div className="text-sm text-gray-600 mt-1 sm:mt-0 print:text-xs">
                  {project.date}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeProjects;