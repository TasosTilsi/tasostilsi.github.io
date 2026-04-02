"use client";

import { PortfolioData, Article } from "@/data/portfolio-main-data";

interface ResumeArticlesProps {
  data: PortfolioData;
  limit?: number;
  isDarkMode?: boolean;
  isSidebar?: boolean;
}

const ResumeArticles: React.FC<ResumeArticlesProps> = ({ data, limit = 5, isDarkMode = true, isSidebar = false }) => {
  const accentColor = isDarkMode ? "text-[#8fdb00]" : "text-blue-600";
  const textColor = isDarkMode ? "text-[#dae2fd]" : "text-gray-900";
  const mutedColor = isDarkMode ? "text-[#c6c6cb]" : "text-gray-600";

  const selectedArticles = data.articles?.slice(0, limit) || [];

  if (selectedArticles.length === 0) {
    return null;
  }

  return (
    <section className="resume-section" style={{ breakInside: "avoid" }}>
      <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center ${accentColor}`}>
        <span className="mr-2 opacity-50">//</span> PUBS.LOG
      </h3>
      <div className="space-y-6">
        {selectedArticles.map((article: Article, index: number) => (
          <div key={index} className="group" style={{ breakInside: "avoid" }}>
            <div className={`text-[11px] font-bold leading-snug ${textColor} mb-1 group-hover:${accentColor} transition-colors uppercase tracking-tight`}>
              {article.name}
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${mutedColor} opacity-70`}>
                {article.date}
              </span>
              <span className={`text-[8px] font-mono ${accentColor} opacity-40 uppercase`}>
                {article.platform}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeArticles;