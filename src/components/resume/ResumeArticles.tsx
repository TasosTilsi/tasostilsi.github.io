"use client";

import { PortfolioData, Article } from "@/data/portfolio-main-data";
import { isValidUrl } from "@/lib/utils";

interface ResumeArticlesProps {
  data: PortfolioData;
  limit?: number;
}

const ResumeArticles: React.FC<ResumeArticlesProps> = ({ data, limit = 5 }) => {
  const selectedArticles = data.articles?.slice(0, limit) || [];

  if (selectedArticles.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 print:mb-6" style={{ breakInside: "avoid" }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200 print:text-base print:mb-2">
        PUBLISHED ARTICLES
      </h3>
      <div className="space-y-2 print:space-y-2">
        {selectedArticles.map((article: Article, index: number) => (
          <div
            key={(article.name?.toString() || "article") + index}
            className="print:mb-2"
            style={{ breakInside: "avoid-page" }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 print:text-sm">
                  {article.name}
                </h4>
                {article.summary && (
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed print:text-xs print:leading-normal">
                    {article.summary}
                    {isValidUrl(article.link) && (
                      <>
                        {" "}
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline print:text-blue-700 text-xs"
                        >
                          [Read Article]
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1 sm:mt-0 print:text-xs whitespace-nowrap ml-4">
                {article.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeArticles;