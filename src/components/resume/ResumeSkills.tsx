"use client";

import { PortfolioData } from "@/data/portfolio-main-data";

interface ResumeSkillsProps {
  data: PortfolioData;
  isDarkMode?: boolean;
}

const ResumeSkills: React.FC<ResumeSkillsProps> = ({ data, isDarkMode = true }) => {
  const accentColor = isDarkMode ? "text-[#8fdb00]" : "text-blue-600";
  const textColor = isDarkMode ? "text-[#dae2fd]" : "text-gray-900";
  const mutedColor = isDarkMode ? "text-[#c6c6cb]" : "text-gray-600";
  const chipBg = isDarkMode ? "bg-white/5" : "bg-gray-100";

  return (
    <section className="resume-section" style={{ breakInside: "avoid" }}>
      <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center ${accentColor}`}>
        <span className="mr-2 opacity-50">//</span> SKILLS.SYS
      </h3>
      <div className="space-y-6">
        {Object.entries(data.skills.hard_skills).map(([category, items]) => (
          <div key={category}>
            <h4 className={`text-[9px] font-bold uppercase tracking-widest mb-3 opacity-60 ${textColor}`}>
              {category}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {(items as string[]).map((skill, i) => (
                <span 
                  key={i} 
                  className={`text-[10px] px-2 py-1 rounded ${chipBg} ${textColor} border border-transparent hover:border-[#8fdb00]/30 transition-colors cursor-default print:border-gray-200 print:text-black`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeSkills;