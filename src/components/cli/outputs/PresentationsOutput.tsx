
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData, Presentation } from '@/data/portfolio-main-data';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { isValidUrl } from '@/lib/utils';

const portfolioData = portfolioDataJson as PortfolioData;

interface PresentationsOutputProps {
  onViewPresentation?: (presentation: Presentation) => void;
}

export const PresentationsOutput: React.FC<PresentationsOutputProps> = ({ onViewPresentation }) => (
  <>
    <p className="text-accent font-bold mb-2">Presentations & Talks:</p>
    {portfolioData.presentations.map((presentation: Presentation, index: number) => (
      <div key={(presentation.name || 'presentation') + index} className="mb-4">
        <p className="text-accent font-semibold">{presentation.name}</p>
        <p className="text-sm text-muted-foreground">Framework: {presentation.framework} | Date: {presentation.date}</p>
        {presentation.description && <p className="text-sm mt-1 whitespace-pre-wrap">{presentation.description}</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          {onViewPresentation && isValidUrl(presentation.link) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewPresentation(presentation)}
              className="text-xs h-7"
            >
              <i className="fas fa-play mr-1" aria-hidden="true"></i>View Inline
            </Button>
          )}
          {isValidUrl(presentation.link) && (
            <a href={presentation.link} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-xs h-7">
                <i className="fas fa-external-link-alt mr-1" aria-hidden="true"></i>Open in New Tab
              </Button>
            </a>
          )}
          {presentation.sourceUrl && isValidUrl(presentation.sourceUrl) && (
            <a href={presentation.sourceUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-xs h-7">
                <i className="fab fa-github mr-1" aria-hidden="true"></i>Source
              </Button>
            </a>
          )}
        </div>
        {index < portfolioData.presentations.length - 1 && <Separator className="my-2 bg-muted-foreground/20" />}
      </div>
    ))}
  </>
);
