
import React from 'react';

export const AliasOutput = () => {
  const commandAliasList = [
    { command: "contact", aliases: ["socials", "links"] },
    { command: "experience", aliases: ["xp"] },
    { command: "education", aliases: ["edu"] },
    { command: "skills", aliases: [] }, 
    { command: "projects", aliases: ["portfolio"] },
    { command: "certifications", aliases: ["certs"] },
    { command: "interests", aliases: ["hobbies"] },
    { command: "resume", aliases: ["pdf", "cv"] },
  ].filter(item => item.aliases.length > 0);

  return (
    <>
      <p className="text-accent font-bold">Command Aliases:</p>
      <ul className="list-none pl-2 space-y-1">
        {commandAliasList.map(item => (
          <li key={item.command}>
            <span className="text-primary w-36 inline-block">{item.command}</span>
            - {item.aliases.join(', ')}
          </li>
        ))}
      </ul>
    </>
  );
};
