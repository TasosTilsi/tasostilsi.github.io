"use client";

import { PortfolioData } from "@/data/portfolio-main-data";

interface ResumeCoreCompetenciesProps {
  data: PortfolioData;
  isDarkMode?: boolean;
}

// CORE COMPETENCIES (§7.3.3): the 8 refreshed clusters in data order —
// competency name in the bold text color, its one-line quantified proof
// beneath in the muted color. Document-form anatomy of the explore cards'
// two-part card, no card chrome. Graceful-hide: empty/missing data → null.
const ResumeCoreCompetencies: React.FC<ResumeCoreCompetenciesProps> = ({ data, isDarkMode = true }) => {
  const accentColor = isDarkMode ? "text-[#8fdb00]" : "text-blue-600";
  const textColor = isDarkMode ? "text-[#dae2fd]" : "text-gray-900";
  const mutedColor = isDarkMode ? "text-[#c6c6cb]" : "text-gray-600";

  const competencies = data.core_competencies || [];

  if (competencies.length === 0) {
    return null;
  }

  return (
    <section className="resume-section" style={{ breakInside: "avoid" }}>
      <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center ${accentColor}`}>
        <span className="mr-2 opacity-50">//</span> CORE COMPETENCIES
      </h3>
      <div className="space-y-4">
        {competencies.map((competency, index) => (
          <div key={index} style={{ breakInside: "avoid" }}>
            <div className={`text-[11px] font-bold leading-tight ${textColor} print:text-black`}>
              {competency.name}
            </div>
            <div className={`text-[10.5px] leading-relaxed ${mutedColor} opacity-90 print:text-black print:text-[9.5px]`}>
              {competency.proof}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeCoreCompetencies;