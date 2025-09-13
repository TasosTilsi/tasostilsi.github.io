"use client";

import { PortfolioData } from "@/data/portfolio-main-data";

interface ResumeSummaryProps {
  data: PortfolioData;
}

const ResumeSummary: React.FC<ResumeSummaryProps> = ({ data }) => {
  return (
    <section className="mb-8 print:mb-6" style={{ breakInside: "avoid" }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200 print:text-base print:mb-2">
        PROFESSIONAL SUMMARY
      </h3>
      <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap print:text-xs print:leading-normal">
        {data.about.description}
      </p>
    </section>
  );
};

export default ResumeSummary;