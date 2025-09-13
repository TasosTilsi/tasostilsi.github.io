"use client";

import { PortfolioData } from "@/data/portfolio-main-data";

interface ResumeExperienceProps {
  data: PortfolioData;
}

const ResumeExperience: React.FC<ResumeExperienceProps> = ({ data }) => {
  const experienceForResume = data.experience.filter(
    (exp) => exp.isTechRelated
  );

  return (
    <section className="mb-8 print:mb-6" style={{ breakInside: "avoid" }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200 print:text-base print:mb-2">
        PROFESSIONAL EXPERIENCE
      </h3>
      <div className="space-y-6 print:space-y-4">
        {experienceForResume.map((exp, index) => (
          <div
            key={index}
            className="print:mb-4"
            style={{ breakInside: "avoid-page" }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 print:text-sm">
                  {exp.title}
                </h4>
                <p className="text-sm font-medium text-gray-700 print:text-xs">
                  {exp.company}
                </p>
                {exp.location && (
                  <p className="text-xs text-gray-600 print:text-xs">
                    {exp.location}
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1 sm:mt-0 sm:text-right print:text-xs">
                {exp.duration}
              </div>
            </div>
            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-700 print:text-xs print:space-y-0.5 print:pl-4">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i} className="leading-relaxed print:leading-normal">
                    {resp}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeExperience;