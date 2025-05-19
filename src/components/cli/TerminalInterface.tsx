
"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import portfolioData from '@/data/portfolio-main-data.json';
import type { EducationEntry, Project, Article, Certification, ExperienceEntry } from '@/data/portfolio-main-data'; // Added ExperienceEntry
import { parse as parseDateFns, differenceInYears, isValid as isValidDate, format as formatDateFns } from 'date-fns';
import { supermario } from '@/data/ascii-art-strings';

interface OutputLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'prompt';
  content: React.ReactNode;
  command?: string;
}

const USERNAME = "guest";
const HOSTNAME = "tasostilsi-portfolio";
const PROMPT_SYMBOL = "$";

const EASTER_EGG_IDS = {
  PROJECTS_ALL: 'projects_all_flag_found',
  CERTS_ALL: 'certs_all_flag_found',
  EDUCATION_ALL: 'education_all_flag_found',
  SUPERMARIO: 'supermario_cmd_found', // Kept ID name generic for Mario
  GAMING_CMD_FOUND: 'gaming_cmd_found',
  CMD_HISTORY_USED: 'cmd_history_used_flag',
  EXPERIENCE_ALL: 'experience_all_flag_found',
};

const EASTER_EGG_NAMES: Record<string, string> = {
  [EASTER_EGG_IDS.PROJECTS_ALL]: "Curiosity Rewarded (All Projects)",
  [EASTER_EGG_IDS.CERTS_ALL]: "Archivist Achievement (All Certs)",
  [EASTER_EGG_IDS.EDUCATION_ALL]: "Full Scholar! (All Education)",
  [EASTER_EGG_IDS.SUPERMARIO]: "It's-a me, Mario! Power Up!",
  [EASTER_EGG_IDS.GAMING_CMD_FOUND]: "Game On! (Gaming Command)",
  [EASTER_EGG_IDS.CMD_HISTORY_USED]: "Time Traveler! (Command History)",
  [EASTER_EGG_IDS.EXPERIENCE_ALL]: "Career Historian! (All Experience)",
};

const TOTAL_EASTER_EGGS = Object.keys(EASTER_EGG_IDS).length;
const LOCAL_STORAGE_EASTER_EGGS_KEY = 'portfolioCliFoundEasterEggs';

const isValidUrl = (url: string | undefined | null): url is string => {
  return typeof url === 'string' && url.trim() !== '' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:'));
};

const WelcomeMessage = () => {
  return (
    <>
      <p>Welcome to {portfolioData.about.name}'s Interactive Portfolio!</p>
      <p>Type 'help' to see a list of available commands.</p>
      <br />
    </>
  );
};

const HelpOutput = () => (
  <>
    <p className="text-accent font-bold">Available Commands:</p>
    <ul className="list-none pl-2 space-y-1">
      <li><span className="text-primary w-36 inline-block">about</span>                  - Display {portfolioData.about.name}'s summary</li>
      <li><span className="text-primary w-36 inline-block">contact</span>                - Show contact information</li>
      <li><span className="text-primary w-36 inline-block">experience</span>             - View professional experience</li>
      <li><span className="text-primary w-36 inline-block">education</span>              - Display educational background</li>
      <li><span className="text-primary w-36 inline-block">skills</span>                 - List technical skills</li>
      <li><span className="text-primary w-36 inline-block">projects</span>               - Browse personal projects</li>
      <li><span className="text-primary w-36 inline-block">articles</span>               - View written articles</li>
      <li><span className="text-primary w-36 inline-block">interests</span>              - Learn about personal interests</li>
      <li><span className="text-primary w-36 inline-block">certs</span>                  - View certifications</li>
      <li><span className="text-primary w-36 inline-block">advanced</span>               - Show more/utility commands</li>
      <li><span className="text-primary w-36 inline-block">clear</span>                  - Clear terminal & show welcome message</li>
    </ul>
  </>
);

const AdvancedHelpOutput = () => (
  <>
    <p className="text-accent font-bold">Advanced/Utility Commands:</p>
    <ul className="list-none pl-2 space-y-1">
      <li><span className="text-primary w-32 inline-block">date</span>                   - Display the current date and time</li>
      <li><span className="text-primary w-32 inline-block">echo [text]</span>            - Print [text] to the terminal</li>
      <li><span className="text-primary w-32 inline-block">theme [light|dark]</span>     - Switch color theme</li>
      <li><span className="text-primary w-32 inline-block">resume [sections...]</span>   - Generate a PDF resume (Under Construction)</li>
      <li><span className="text-primary w-32 inline-block">help</span>                   - Show main help message</li>
      <li><span className="text-primary w-32 inline-block">clear</span>                  - Clear terminal & show welcome message</li>
    </ul>
  </>
);


const AboutOutput = () => (
  <>
    <p className="text-accent font-bold">{portfolioData.about.name}</p>
    {portfolioData.about.title && <p className="text-muted-foreground">{portfolioData.about.title}</p>}
    <br />
    <p className="mb-2 whitespace-pre-wrap">{portfolioData.about.description}</p>
  </>
);

const ContactOutput = () => {
  const contacts = [
    { platform: "Email", handle: portfolioData.about.email, url: `mailto:${portfolioData.about.email}` },
    { platform: "LinkedIn", handle: portfolioData.about.contact.linkedin, url: portfolioData.about.contact.linkedin },
    { platform: "GitHub", handle: portfolioData.about.contact.github, url: portfolioData.about.contact.github },
    { platform: "Medium", handle: portfolioData.about.contact.medium, url: portfolioData.about.contact.medium },
    { platform: "Facebook", handle: portfolioData.about.contact.facebook, url: portfolioData.about.contact.facebook },
    { platform: "Instagram", handle: portfolioData.about.contact.instagram, url: portfolioData.about.contact.instagram },
    { platform: "Twitter", handle: portfolioData.about.contact.twitter, url: portfolioData.about.contact.twitter },
    { platform: "Twitch", handle: portfolioData.about.contact.twitch, url: portfolioData.about.contact.twitch },
  ].filter(contact => (contact.handle || contact.url));

  return (
    <div className="overflow-x-auto my-2">
      <table className="table-ascii">
        <thead>
          <tr>
            <th className="th-ascii">Platform</th>
            <th className="th-ascii">Link/Handle</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={index}>
              <td className="td-ascii text-primary">{contact.platform}</td>
              <td className="td-ascii">
                {isValidUrl(contact.url) ? (
                  <a href={contact.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                    {contact.handle || contact.url}
                  </a>
                ) : (
                  <span className="break-all">{contact.handle}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const ExperienceOutput = ({ mode = 'default' }: { mode?: 'default' | 'all' }) => {
  const allExperience: ExperienceEntry[] = portfolioData.experience as unknown as ExperienceEntry[]; // Cast for type safety
  const experienceToDisplay = mode === 'all'
    ? allExperience
    : allExperience.filter(exp => exp.isTechRelated);

  if (experienceToDisplay.length === 0 && mode === 'default') {
    return <p className="text-sm">No tech-related experience listed. For complete history, type 'experience --all' or 'experience -a'.</p>;
  }
  if (experienceToDisplay.length === 0) {
    return <p className="text-sm">No experience entries found.</p>;
  }
  
  return (
    <>
      {mode === 'default' && allExperience.some(exp => !exp.isTechRelated) && experienceToDisplay.length < allExperience.length && (
        <p className="text-sm text-muted-foreground mb-2">
          Showing tech-related experience. For full history, use 'experience -a' or 'experience --all'.
        </p>
      )}
      {experienceToDisplay.map((exp, index) => (
        <div key={index} className="mb-4">
          <p className="text-accent font-semibold">{exp.title} @ {exp.company}</p>
          <p className="text-muted-foreground text-sm">{exp.duration} {exp.location && `| ${exp.location}`}</p>
          {exp.responsibilities && exp.responsibilities.length > 0 && (
            <ul className="list-disc list-inside pl-2 mt-1 text-sm">
              {exp.responsibilities.map((resp, i) => <li key={i} className="whitespace-pre-wrap">{resp}</li>)}
            </ul>
          )}
        </div>
      ))}
    </>
  );
};

const EducationOutput = ({ mode = 'default' }: { mode?: 'default' | 'all' }) => {
  const allEducation = portfolioData.education as EducationEntry[];
  const educationToDisplay = mode === 'all'
    ? allEducation
    : allEducation.filter(edu => edu.degree !== "High School Degree");

  if (educationToDisplay.length === 0 && mode === 'default') {
    return <p className="text-sm">No higher education listed. For complete history, type 'education --all' or 'education -a'.</p>;
  }
  if (educationToDisplay.length === 0) {
    return <p className="text-sm">No education entries found.</p>;
  }

  return (
    <>
      {mode === 'default' && allEducation.some(edu => edu.degree === "High School Degree") && educationToDisplay.length < allEducation.length && (
        <p className="text-sm text-muted-foreground mb-2">
          Showing main educational achievements. For complete history (including high school), type 'education -a' or 'education --all'.
        </p>
      )}
      {educationToDisplay.map((edu: EducationEntry, index: number) => (
        <div key={edu.institution + index} className="mb-4">
          <p className="text-accent font-semibold">{edu.degree}</p>
          <p className="text-muted-foreground">{edu.institution} ({edu.duration})</p>
          {edu.location && <p className="text-sm">Location: {edu.location}</p>}
          {edu.specialization && <p className="text-sm">Specialization: {edu.specialization}</p>}
          {Array.isArray(edu.courses) && edu.courses.length > 0 && (
            <>
              <p className="text-sm mt-1">Key Courses:</p>
              <ul className="list-disc list-inside pl-2 text-sm">
                {edu.courses.map((course, i) => <li key={i}>{course}</li>)}
              </ul>
            </>
          )}
          {edu.courses && typeof edu.courses === 'object' && !Array.isArray(edu.courses) && Object.keys(edu.courses).length > 0 && (
            <>
              <p className="text-sm mt-1">Key Courses/Details:</p>
              <ul className="list-disc list-inside pl-2 text-sm">
                {Object.entries(edu.courses).map(([key, value]) => (
                  <li key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${(value as string[]).join(', ')}`}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </>
  );
};

const SkillsOutput = () => (
  <>
    {portfolioData.skills.soft_skills && portfolioData.skills.soft_skills.length > 0 && (
      <div className="mb-3">
        <p className="text-accent font-semibold">Soft Skills:</p>
        <p className="text-sm flex flex-wrap gap-2">
          {portfolioData.skills.soft_skills.map(skill => (
            <span key={skill} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{skill}</span>
          ))}
        </p>
      </div>
    )}
    {portfolioData.skills.hard_skills && Object.entries(portfolioData.skills.hard_skills).map(([category, items]) => (
      <div key={category} className="mb-3">
        <p className="text-accent font-semibold">{category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</p>
        <p className="text-sm flex flex-wrap gap-2">
          {(items as string[]).map(skill => (
            <span key={skill} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{skill}</span>
          ))}
        </p>
      </div>
    ))}
     {portfolioData.skills.languages && portfolioData.skills.languages.length > 0 && (
        <div className="mt-3">
            <p className="text-accent font-semibold">Languages:</p>
            <p className="text-sm flex flex-wrap gap-2">
            {portfolioData.skills.languages.map(lang => (
                <span key={lang} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{lang}</span>
            ))}
            </p>
        </div>
      )}
  </>
);

const ProjectsOutput = ({ mode = 'recent' }: { mode?: 'recent' | 'all' }) => {
  const projectsToDisplay = mode === 'all'
    ? portfolioData.projects
    : portfolioData.projects.slice(0, 7);

  if (projectsToDisplay.length === 0) {
    return <p className="text-sm">No projects found.</p>;
  }
  return (
    <>
      {mode === 'recent' && portfolioData.projects.length > 7 && (
        <p className="text-sm text-muted-foreground mb-2">
          Showing first 7 projects. Use 'projects -a' or 'projects --all' to see all.
        </p>
      )}
      {projectsToDisplay.map((project: Project, index: number) => (
        <div key={(project.name || 'project') + index} className="mb-4">
          <p className="text-accent font-semibold">{project.name}</p>
          {project.date && <p className="text-sm text-muted-foreground">Date: {project.date}</p>}
          {project.description && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{project.description}</p>}
          {isValidUrl(project.link) && <p className="text-sm">Link: <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">{project.link}</a></p>}
          {isValidUrl(project.sourceUrl) && <p className="text-sm">Source: <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">{project.sourceUrl}</a></p>}
          {index < projectsToDisplay.length - 1 && <Separator className="my-2 bg-muted-foreground/20" />}
        </div>
      ))}
    </>
  );
};

const ArticlesOutput = () => (
  <>
    {portfolioData.articles.map((article: Article, index: number) => (
      <div key={(article.name || 'article') + index} className="mb-4">
        <p className="text-accent font-semibold">{article.name}</p>
        <p className="text-sm text-muted-foreground">Platform: {article.platform} | Date: {article.date}</p>
        {article.summary && <p className="text-sm mt-1 whitespace-pre-wrap">{article.summary}</p>}
        {isValidUrl(article.link) && (
          <p className="text-sm">
            Read more: <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{article.link}</a>
          </p>
        )}
        {index < portfolioData.articles.length - 1 && <Separator className="my-2 bg-muted-foreground/20" />}
      </div>
    ))}
  </>
);


const InterestsOutput = () => (
  <>
    <p className="text-accent font-semibold">Interests:</p>
    {portfolioData.interests && portfolioData.interests.length > 0 && (
       <ul className="list-disc list-inside pl-2 text-sm space-y-1">
         {portfolioData.interests.map((interest, index) => <li key={index}>{interest}</li>)}
       </ul>
    )}
  </>
);


const FavoriteGamesOutput = () => {
  const { favorite_games } = portfolioData;
  if (!favorite_games || (!favorite_games.simulation_games?.length && !favorite_games.strategy_games?.length)) {
    return <p className="text-sm">No favorite games listed yet!</p>;
  }

  return (
    <>
      <p className="text-accent font-bold mb-2">Favorite Games:</p>
      {favorite_games.simulation_games && favorite_games.simulation_games.length > 0 && (
        <div className="mb-3">
          <p className="text-primary font-semibold">Simulation Games:</p>
          <ul className="list-disc list-inside pl-2 text-sm">
            {favorite_games.simulation_games.map((game, index) => (
              <li key={`sim-${index}`}>{game}</li>
            ))}
          </ul>
        </div>
      )}
      {favorite_games.strategy_games && favorite_games.strategy_games.length > 0 && (
        <div>
          <p className="text-primary font-semibold">Strategy Games:</p>
          <ul className="list-disc list-inside pl-2 text-sm">
            {favorite_games.strategy_games.map((game, index) => (
              <li key={`strat-${index}`}>{game}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};


const CertsOutput = ({ mode = 'recent' }: { mode?: 'recent' | 'all' }) => {
  const now = new Date();
  
  const parseCertDate = (dateString: string): Date | null => {
    let parsedDate = parseDateFns(dateString, 'MMMM yyyy', new Date());
    if (isValidDate(parsedDate)) return parsedDate;
    
    parsedDate = parseDateFns(dateString, 'MMM yyyy', new Date());
    if (isValidDate(parsedDate)) return parsedDate;

    parsedDate = parseDateFns(dateString, 'yyyy', new Date());
    if (isValidDate(parsedDate)) return parsedDate;

    return null;
  };

  const allCertsWithParsedDates = (portfolioData.certifications as Certification[])
    .map(cert => ({
      ...cert,
      parsedDate: parseCertDate(cert.date),
    }))
    .sort((a, b) => (b.parsedDate?.getTime() || 0) - (a.parsedDate?.getTime() || 0));


  const filteredCerts = mode === 'all' 
    ? allCertsWithParsedDates
    : allCertsWithParsedDates.filter(cert => {
        if (!cert.parsedDate) return false; 
        const yearsDiff = differenceInYears(now, cert.parsedDate);
        return yearsDiff <= 6;
      });

  if (filteredCerts.length === 0) {
    return <p className="text-sm">{mode === 'recent' ? "No recent certifications (last 6 years). Use 'certs -a' or 'certs --all' to view all." : "No certifications found."}</p>;
  }

  return (
    <>
      {mode === 'recent' && allCertsWithParsedDates.length > filteredCerts.length && (
         <p className="text-sm text-muted-foreground mb-2">
          Showing recent certifications (last 6 years). Use 'certs -a' or 'certs --all' to see all.
        </p>
      )}
     <div className="flex flex-col space-y-1">
      {filteredCerts.map((cert: Certification, index: number) => (
        <div key={(cert.name || 'cert') + index} className="flex items-baseline space-x-2 text-sm">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs mr-2 shrink-0">{cert.date}</span>
          <span className="text-accent font-medium">{cert.name}</span>
          {isValidUrl(cert.link) && (
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs shrink-0">[Link]</a>
          )}
        </div>
      ))}
    </div>
    </>
  );
};


export default function TerminalInterface() {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [history, setHistory] = useState<OutputLine[]>([
    { id: Date.now().toString(), type: 'system', content: <WelcomeMessage /> },
  ]);
  const [inputValue, setInputValue] = useState('');
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [foundEasterEggs, setFoundEasterEggs] = useState<string[]>([]);


  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else {
      setCurrentTheme('dark'); 
    }

    const savedEggs = localStorage.getItem(LOCAL_STORAGE_EASTER_EGGS_KEY);
    if (savedEggs) {
      try {
        const parsedEggs = JSON.parse(savedEggs);
        if (Array.isArray(parsedEggs)) {
          setFoundEasterEggs(parsedEggs);
        }
      } catch (e) {
        console.error("Failed to parse foundEasterEggs from localStorage", e);
      }
    }
  }, []);

  const triggerEasterEgg = (eggId: string, eggName: string) => {
    if (!foundEasterEggs.includes(eggId)) {
      const newFoundEggs = [...foundEasterEggs, eggId];
      setFoundEasterEggs(newFoundEggs);
      localStorage.setItem(LOCAL_STORAGE_EASTER_EGGS_KEY, JSON.stringify(newFoundEggs));
      toast({
        title: "Easter Egg Found!",
        description: `${eggName}. You've found ${newFoundEggs.length} of ${TOTAL_EASTER_EGGS} discoverable secrets!`,
        variant: "default",
      });
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (currentTheme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
      localStorage.setItem('portfolio-theme', currentTheme);
    }
  }, [currentTheme]);


  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const scrollAreaRoot = document.querySelector('.cli-output-area');
    if (scrollAreaRoot) {
      const viewport = scrollAreaRoot.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        setTimeout(() => { 
          viewport.scrollTop = viewport.scrollHeight;
        }, 0);
      } else {
        endOfHistoryRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
      }
    } else {
      endOfHistoryRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }
    hiddenInputRef.current?.focus();
  }, [history]);

  const processCommand = async (command: string): Promise<React.ReactNode > => {
    const [cmd, ...args] = command.toLowerCase().trim().split(' ');
    const allFlag = args.includes('-a') || args.includes('--all');

    switch (cmd) {
      case 'help':
        return <HelpOutput />;
      case 'advanced':
      case 'more':
        return <AdvancedHelpOutput />;
      case 'about':
        return <AboutOutput />;
      case 'contact':
      case 'links':
      case 'socials':
        return <ContactOutput />;
      case 'experience':
      case 'xp':
        if (allFlag) {
            triggerEasterEgg(EASTER_EGG_IDS.EXPERIENCE_ALL, EASTER_EGG_NAMES[EASTER_EGG_IDS.EXPERIENCE_ALL]);
        }
        return <ExperienceOutput mode={allFlag ? 'all' : 'default'} />;
      case 'education':
      case 'edu':
        if (allFlag) {
            triggerEasterEgg(EASTER_EGG_IDS.EDUCATION_ALL, EASTER_EGG_NAMES[EASTER_EGG_IDS.EDUCATION_ALL]);
        }
        return <EducationOutput mode={allFlag ? 'all' : 'default'} />;
      case 'skills':
      case 'skls': 
        return <SkillsOutput />;
      case 'projects':
      case 'prjs':
        if (allFlag) {
            triggerEasterEgg(EASTER_EGG_IDS.PROJECTS_ALL, EASTER_EGG_NAMES[EASTER_EGG_IDS.PROJECTS_ALL]);
        }
        return <ProjectsOutput mode={allFlag ? 'all' : 'recent'} />;
      case 'articles':
          return <ArticlesOutput />;
      case 'interests':
      case 'hobbies':
        return <InterestsOutput />;
      case 'certs':
        if (allFlag) {
            triggerEasterEgg(EASTER_EGG_IDS.CERTS_ALL, EASTER_EGG_NAMES[EASTER_EGG_IDS.CERTS_ALL]);
        }
        return <CertsOutput mode={allFlag ? 'all' : 'recent'} />;
      case 'gaming':
      case 'games':
      case 'play':
        triggerEasterEgg(EASTER_EGG_IDS.GAMING_CMD_FOUND, EASTER_EGG_NAMES[EASTER_EGG_IDS.GAMING_CMD_FOUND]);
        return <FavoriteGamesOutput />;
      case 'date':
        return new Date().toString();
      case 'echo':
        return args.join(' ');
      case 'theme':
        const newTheme = args[0] as 'light' | 'dark';
        if (newTheme === 'light' || newTheme === 'dark') {
          setCurrentTheme(newTheme);
          return `Theme set to ${newTheme}.`;
        }
        return `Invalid theme. Use 'theme light' or 'theme dark'.`;
      case 'pdf':
      case 'cv':
      case 'resume':
        return "PDF generation is under construction. This feature will be ready soon!";
      case 'supermario':
      case 'mario':
        triggerEasterEgg(EASTER_EGG_IDS.SUPERMARIO, EASTER_EGG_NAMES[EASTER_EGG_IDS.SUPERMARIO]);
        return (
          <pre className="text-accent whitespace-pre-wrap" style={{ lineHeight: '1', letterSpacing: '-1px', fontSize: '0.8em' }}>
            {supermario}
          </pre>
        );
      case '':
        return null;
      default:
        return <p className="text-destructive">Command not found: {command}. Type 'help' for available commands.</p>;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCommandSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    const newHistoryLog: OutputLine[] = [];


    if (trimmedInput) {
        newHistoryLog.push({
          id: Date.now().toString() + '-input',
          type: 'input',
          command: trimmedInput,
          content: `${USERNAME}@${HOSTNAME}:${PROMPT_SYMBOL} ${trimmedInput}`,
        });
    }

    if (trimmedInput.toLowerCase() === 'clear'||trimmedInput.toLowerCase() === 'clr') {
      setHistory([
         { id: Date.now().toString() + '-system-welcome', type: 'system', content: <WelcomeMessage /> }
      ]);
    } else {
      const output = await processCommand(trimmedInput);
      if (output !== null) { 
        newHistoryLog.push({
          id: Date.now().toString() + '-output',
          type: 'output',
          content: output,
        });
        if (newHistoryLog.length > 0) {
            setHistory(prev => [...prev, ...newHistoryLog]);
        }
      } else if (trimmedInput) { 
        if (newHistoryLog.length > 0) { 
             setHistory(prev => [...prev, ...newHistoryLog]);
        }
      }
    }

    if (trimmedInput && (commandHistory.length === 0 || commandHistory[0] !== trimmedInput)) {
        setCommandHistory(prev => [trimmedInput, ...prev].slice(0, 50)); 
    }
    setHistoryIndex(-1); 
    setInputValue('');
  };

 const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex] || '');
        triggerEasterEgg(EASTER_EGG_IDS.CMD_HISTORY_USED, EASTER_EGG_NAMES[EASTER_EGG_IDS.CMD_HISTORY_USED]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > -1) {
        const newIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(newIndex);
        if (newIndex === -1) {
          setInputValue('');
        } else {
          setInputValue(commandHistory[newIndex] || '');
        }
        triggerEasterEgg(EASTER_EGG_IDS.CMD_HISTORY_USED, EASTER_EGG_NAMES[EASTER_EGG_IDS.CMD_HISTORY_USED]);
      } else {
         setInputValue(''); 
      }
    }
  };

  const handleContainerClick = () => {
    hiddenInputRef.current?.focus();
  };

  return (
    <div
      className="flex flex-col h-full p-2 md:p-4 bg-background text-sm md:text-base"
      onClick={handleContainerClick}
    >
      <ScrollArea className="flex-grow cli-output-area">
        <div> 
          {history.map((line) => (
            <div key={line.id} className={`mb-1 ${line.type === 'input' ? 'text-primary' : line.type === 'error' ? 'text-destructive' : line.type === 'system' ? 'text-muted-foreground' : 'text-foreground'}`}>
              {typeof line.content === 'string' ? <pre className="whitespace-pre-wrap">{line.content}</pre> : line.content}
            </div>
          ))}
          <div ref={endOfHistoryRef} />
        </div>
      </ScrollArea>
      <form onSubmit={handleCommandSubmit} className="mt-2 flex flex-row flex-wrap items-baseline">
        <span className="text-accent mr-1 whitespace-nowrap shrink-0">
          {USERNAME}@{HOSTNAME}:{PROMPT_SYMBOL}
        </span>
        <div className="relative flex flex-grow items-baseline min-w-[calc(50%+1rem)] sm:min-w-[200px]">
          <span className="cli-input-display whitespace-pre" style={{whiteSpace: 'pre'}}>
            {inputValue}
          </span>
          <input
            ref={hiddenInputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="absolute opacity-0 w-0 h-0 p-0 m-0 border-0" 
            autoFocus
            spellCheck="false"
            autoComplete="off"
            aria-label="Terminal input" 
          />
           <span className="blinking-cursor"></span>
        </div>
      </form>
    </div>
  );
}

