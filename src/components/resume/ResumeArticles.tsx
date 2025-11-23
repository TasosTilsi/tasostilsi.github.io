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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 print:text-xs">
                  {article.name}
                </h4>
                <p className="text-xs text-gray-600 print:text-xs">
                  {article.platform} • {article.date}
                  {isValidUrl(article.link) && (
                    <>
                      {" • "}
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline print:text-blue-700"
                      >
                        Read Article
                      </a>
                    </>
                  )}
                </p>
                {article.summary && (
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed print:text-xs print:leading-normal">
                    {article.summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeArticles;