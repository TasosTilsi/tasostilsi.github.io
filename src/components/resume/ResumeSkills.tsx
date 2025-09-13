"use client";

import { PortfolioData } from "@/data/portfolio-main-data";

interface ResumeSkillsProps {
  data: PortfolioData;
}

const ResumeSkills: React.FC<ResumeSkillsProps> = ({ data }) => {
  return (
    <section className="mb-8 print:mb-6" style={{ breakInside: "avoid" }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200 print:text-base print:mb-2">
        TECHNICAL SKILLS
      </h3>
      <div className="space-y-4 print:space-y-3">
        {Object.entries(data.skills.hard_skills).map(([category, items]) => (
          <div key={category} className="print:mb-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 print:text-xs print:mb-1">
              {category
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}:
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed print:text-xs print:leading-normal">
              {(items as string[]).join(" • ")}
            </p>
          </div>
        ))}
        
        {data.skills.soft_skills && data.skills.soft_skills.length > 0 && (
          <div className="print:mb-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 print:text-xs print:mb-1">
              Soft Skills:
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed print:text-xs print:leading-normal">
              {data.skills.soft_skills.join(" • ")}
            </p>
          </div>
        )}
        
        {data.skills.languages && data.skills.languages.length > 0 && (
          <div className="print:mb-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 print:text-xs print:mb-1">
              Languages:
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed print:text-xs print:leading-normal">
              {data.skills.languages.join(" • ")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResumeSkills;