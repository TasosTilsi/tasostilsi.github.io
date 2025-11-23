
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData, Article } from '@/data/portfolio-main-data';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { isValidUrl } from '@/lib/utils';

const portfolioData = portfolioDataJson as PortfolioData;

export const ArticlesOutput = () => (
  <>
    {portfolioData.articles.map((article: Article, index: number) => (
      <div key={(article.name || 'article') + index} className="mb-4">
        <p className="text-accent font-semibold">{article.name}</p>
        <p className="text-sm text-muted-foreground">Platform: {article.platform} | Date: {article.date}</p>
        {article.summary && <p className="text-sm mt-1 whitespace-pre-wrap">{article.summary}</p>}
        {isValidUrl(article.link) && (
          <div className="mt-2">
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-xs h-7">
                <i className="fas fa-external-link-alt mr-1" aria-hidden="true"></i>Open in New Tab
              </Button>
            </a>
          </div>
        )}
        {index < portfolioData.articles.length - 1 && <Separator className="my-2 bg-muted-foreground/20" />}
      </div>
    ))}
  </>
);
