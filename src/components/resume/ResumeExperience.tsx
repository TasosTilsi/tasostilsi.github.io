"use client";

import { PortfolioData } from "@/data/portfolio-main-data";

interface ResumeExperienceProps {
  data: PortfolioData;
  isDarkMode?: boolean;
}

const ResumeExperience: React.FC<ResumeExperienceProps> = ({ data, isDarkMode = true }) => {
  const accentColor = isDarkMode ? "text-[#8fdb00]" : "text-blue-600";
  const textColor = isDarkMode ? "text-[#dae2fd]" : "text-gray-900";
  const mutedColor = isDarkMode ? "text-[#c6c6cb]" : "text-gray-600";

  return (
    <section className="resume-section">
      <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center ${accentColor}`}>
        <span className="mr-2 opacity-50">//</span> EXPERIENCE.SH
      </h3>
      <div className="space-y-12">
        {data.experience
          .filter((job) => job.isTechRelated)
          .map((job, index) => (
            <div key={index} className="relative pl-6 border-l border-white/5 print:border-gray-200" style={{ breakInside: "avoid" }}>
              <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ${isDarkMode ? "bg-[#171f33] border-2 border-[#8fdb00]" : "bg-white border-2 border-blue-600"} print:bg-white print:border-gray-400`} />
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-3">
                <h4 className={`text-sm font-black uppercase tracking-tight ${textColor} print:text-black`}>
                  {job.title}
                </h4>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${accentColor} opacity-80 print:text-gray-600`}>
                  {job.duration}
                </span>
              </div>
              
              <div className={`text-[11px] font-bold uppercase tracking-wider mb-4 ${isDarkMode ? "text-white/70" : "text-gray-700"} print:text-gray-800`}>
                {job.company}
              </div>

              <ul className={`space-y-3 text-[11.5px] leading-relaxed ${mutedColor} print:text-black print:text-[10.5px]`}>
                {job.responsibilities?.map((resp, i) => (
                  <li key={i} className="flex gap-3">
                    <span className={`${accentColor} opacity-50 shrink-0`}>&gt;</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </section>
  );
};

export default ResumeExperience;