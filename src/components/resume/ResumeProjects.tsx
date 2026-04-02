"use client";

import { PortfolioData } from "@/data/portfolio-main-data";

interface ResumeProjectsProps {
  data: PortfolioData;
  limit?: number;
  isDarkMode?: boolean;
}

const ResumeProjects: React.FC<ResumeProjectsProps> = ({ data, limit = 6, isDarkMode = true }) => {
  const accentColor = isDarkMode ? "text-[#8fdb00]" : "text-blue-600";
  const textColor = isDarkMode ? "text-[#dae2fd]" : "text-gray-900";
  const mutedColor = isDarkMode ? "text-[#c6c6cb]" : "text-gray-600";

  const selectedProjects = data.projects?.slice(0, limit) || [];

  if (selectedProjects.length === 0) {
    return null;
  }

  return (
    <section className="resume-section">
      <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center ${accentColor}`}>
        <span className="mr-2 opacity-50">//</span> PROJECTS.BIN
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeProjects;