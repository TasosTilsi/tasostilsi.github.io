
import React from 'react';

export const RevelioOutput = () => (
  <>
    <p className="text-accent font-bold">Revealed Hidden Commands:</p>
    <ul className="list-none pl-2 space-y-1">
      <li><span className="text-primary w-28 inline-block">supermario</span>   - Displays a surprise!</li>
      <li><span className="text-primary w-28 inline-block">gaming</span>       - Shows favorite games.</li>
      <li><span className="text-primary w-28 inline-block">date</span>         - Shows the current date and time.</li>
      <li><span className="text-primary w-28 inline-block">echo [text]</span>  - Repeats the text you provide.</li>
      <li><span className="text-primary w-28 inline-block">alias</span>        - Lists all command aliases.</li>
    </ul>
  </>
);
