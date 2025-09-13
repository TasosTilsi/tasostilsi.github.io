
import React from 'react';
import { useCliTheme } from '@/components/cli/hooks/useCliTheme';

// Resume now uses smart defaults - no section customization needed

export const AdvancedHelpOutput = () => {
  const { VALID_THEMES } = useCliTheme();
  const themeOptions = VALID_THEMES.join(' | ');
  // Resume sections are automatically optimized


  return (
    <>
      <p className="text-accent font-bold">Advanced/Utility Commands:</p>
      <ul className="list-none pl-2 space-y-1">
        <li><span className="text-primary w-32 inline-block">projects</span>               - Browse personal projects</li>
        <li><span className="text-primary w-32 inline-block">articles</span>               - View written articles</li>
        <li><span className="text-primary w-32 inline-block">certifications</span>         - View certifications</li>
        <li><span className="text-primary w-32 inline-block">interests</span>              - Learn about personal interests</li>
        <li><span className="text-primary w-32 inline-block">resume</span>               - View/download professional resume</li>
        <li><span className="text-primary w-32 inline-block">theme</span>                  - Switch color theme (options: {themeOptions})</li>
        <li><span className="text-primary w-32 inline-block">help</span>                   - Show main help message</li>
        <li><span className="text-primary w-32 inline-block">clear</span>                  - Clear terminal & show welcome message</li>
      </ul>
    </>
  );
};

