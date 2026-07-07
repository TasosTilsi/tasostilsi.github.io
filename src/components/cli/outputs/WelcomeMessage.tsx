import React, { useEffect, useState } from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';
import { TypingEffect } from '../TypingEffect';

const portfolioData = portfolioDataJson as PortfolioData;

export const WelcomeMessage = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem('cli-visited');
    if (!visited) {
      setShowTutorial(true);
      localStorage.setItem('cli-visited', 'true');
    }

    // Delay typing animation slightly for better visual flow
    const timer = setTimeout(() => setShowTyping(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* ASCII Art Banner - Hidden on very small screens */}
      <pre className="text-accent font-mono text-xs sm:text-sm leading-tight hidden sm:block">
        {`/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ANASTASIOS TILSIZOGLOU
 * Senior Software Engineer in Test
 * Open to selective part-time work
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */`}
      </pre>

      {/* Mobile-friendly version */}
      <div className="sm:hidden text-accent font-bold text-sm border-b border-accent/30 pb-2 mb-2">
        <div>ANASTASIOS TILSIZOGLOU</div>
        <div className="text-xs font-normal text-muted-foreground">Senior Software Engineer in Test</div>
        <div className="text-xs font-normal text-muted-foreground/80 italic mt-1">Open to selective part-time work</div>
      </div>

      {/* Typing animation for welcome text */}
      {showTyping && (
        <>
          <TypingEffect text="> System initialized..." speed={30} />
          <TypingEffect text="> Type 'help' to explore my work" speed={30} delay={800} />
        </>
      )}

      {showTutorial && (
        <div className="border border-accent/30 rounded bg-accent/5 p-4 my-2 text-sm">
          <p className="font-bold mb-2 text-accent">🚀 Quick Start Guide:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Type <span className="text-accent">help</span> to see all commands</li>
            <li>Press <span className="text-accent">Tab</span> to autocomplete commands</li>
            <li>Use <span className="text-accent">↑/↓</span> arrows to navigate history</li>
            <li>Type <span className="text-accent">about</span> to learn more about me</li>
          </ul>
        </div>
      )}
      <br />
    </div>
  );
};
