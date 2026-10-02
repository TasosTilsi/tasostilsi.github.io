"use client";

import { PortfolioData } from "@/data/portfolio-main-data";

interface ResumeProjectsProps {
  data: PortfolioData;
  limit?: number;
  isDarkMode?: boolean;
  featuredOnly?: boolean;
}

const ResumeProjects: React.FC<ResumeProjectsProps> = ({ data, limit = 6, isDarkMode = true, featuredOnly = false }) => {
  const accentColor = isDarkMode ? "text-[#8fdb00]" : "text-blue-600";
  const textColor = isDarkMode ? "text-[#dae2fd]" : "text-gray-900";
  const mutedColor = isDarkMode ? "text-[#c6c6cb]" : "text-gray-600";

  // featuredOnly (/resume + modal, §7.3.5/U-6): the docx's featured-flagged
  // projects in data order (deepindex → Clarif-AI), NOT a positional slice.
  const selectedProjects = featuredOnly
    ? data.projects?.filter((project) => project.featured) || []
    : data.projects?.slice(0, limit) || [];

  if (selectedProjects.length === 0) {
    return null;
  }

  return (
    <section className="resume-section">
      <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center ${accentColor}`}>
        <span className="mr-2 opacity-50">//</span> PROJECTS
      </h3>
      <div className="space-y-8">
        {selectedProjects.map((project, index) => (
          <div key={index} className="relative pl-6 border-l border-white/5 print:border-gray-200" style={{ breakInside: "avoid" }}>
            <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ${isDarkMode ? "bg-[#171f33] border-2 border-[#8fdb00]/30" : "bg-white border-2 border-blue-600"} print:bg-white print:border-gray-400`} />

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-2">
              <h4 className={`text-sm font-black uppercase tracking-tight ${textColor} print:text-black`}>
                {project.name}
              </h4>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${accentColor} opacity-80 print:text-gray-600`}>
                {project.date}
              </span>
            </div>

            <p className={`text-[11.5px] leading-relaxed ${mutedColor} print:text-black print:text-[10.5px]`}>
              {project.description}
            </p>

            {/* Muted mono link-line atom (§7.3.5) — omitted for linkless projects (E-11b) */}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 inline-block text-[9px] font-mono tracking-tight ${mutedColor} opacity-70 hover:underline print:text-gray-700`}
              >
                {project.link.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeProjects;