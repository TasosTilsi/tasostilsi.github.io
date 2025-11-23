"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { supermario } from "@/data/ascii-art-strings";
import type { PortfolioData, Presentation, Project } from "@/data/portfolio-main-data";
import portfolioDataJson from "@/data/portfolio-main-data.json";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import UniversalModal from "./UniversalModal";
import ResumeModal from "./ResumeModal";
import {
  HOSTNAME,
  PROMPT_SYMBOL,
  USERNAME,
  type Theme as CliThemeType,
  AVAILABLE_COMMANDS,
  LOCAL_STORAGE_HISTORY_KEY,
  ACHIEVEMENTS,
} from "./constants";
import { levenshteinDistance } from "@/lib/utils";
import { MobileCommandPalette } from "./MobileCommandPalette";
import { useCliTheme } from "./hooks/useCliTheme";
import { useEasterEggs } from "./hooks/useEasterEggs";
import { useAchievements } from "./hooks/useAchievements";
import { AboutOutput } from "./outputs/AboutOutput";
import { AchievementsOutput } from "./outputs/AchievementsOutput";
import { AdvancedHelpOutput } from "./outputs/AdvancedHelpOutput";
import { TypingEffect } from "./TypingEffect";
import { AliasOutput } from "./outputs/AliasOutput";
import { ArticlesOutput } from "./outputs/ArticlesOutput";
import { CertsOutput } from "./outputs/CertsOutput";
import { ContactOutput } from "./outputs/ContactOutput";
import { EducationOutput } from "./outputs/EducationOutput";
import { ExperienceOutput } from "./outputs/ExperienceOutput";
import { FavoriteGamesOutput } from "./outputs/FavoriteGamesOutput";
import { HelpOutput } from "./outputs/HelpOutput";
import { InterestsOutput } from "./outputs/InterestsOutput";
import { PresentationsOutput } from "./outputs/PresentationsOutput";
import { ProjectsOutput } from "./outputs/ProjectsOutput";
import { RevelioOutput } from "./outputs/RevelioOutput";
import { SkillsOutput } from "./outputs/SkillsOutput";
import { WelcomeMessage } from "./outputs/WelcomeMessage";
import { AchievementsModal } from "./AchievementsModal";

const portfolioData = portfolioDataJson as PortfolioData;

interface OutputLine {
  id: string;
  type: "input" | "output" | "error" | "system" | "success" | "warning";
  content: React.ReactNode;
  command?: string;
}

// Resume now uses smart defaults - no section customization needed

export const TerminalInterface = () => {
  const { currentTheme: theme, setTheme, VALID_THEMES } = useCliTheme();
  const { triggerEasterEgg, EASTER_EGG_IDS, foundEasterEggs } = useEasterEggs();
  const { unlockAchievement, unlockedAchievements } = useAchievements();

  const [history, setHistory] = useState<OutputLine[]>([
    { id: Date.now().toString(), type: "system", content: <WelcomeMessage /> },
  ]);
  const [inputValue, setInputValue] = useState("");
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isAutoDownload, setIsAutoDownload] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setCommandHistory(parsed.slice(0, 50));
        }
      } catch (e) {
        console.error("Failed to parse command history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(commandHistory));
  }, [commandHistory]);

  const [modalItem, setModalItem] = useState<Presentation | Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Resume sections are now handled by smart defaults

  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const scrollAreaRoot = document.querySelector(".cli-output-area");
    if (scrollAreaRoot) {
      const viewport = scrollAreaRoot.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight;
        }, 0);
      } else {
        endOfHistoryRef.current?.scrollIntoView({
          behavior: "auto",
          block: "end",
        });
      }
    } else {
      endOfHistoryRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }
    if (!isResumeModalOpen) {
      hiddenInputRef.current?.focus();
    }
  }, [history, isResumeModalOpen]);

  const processCommand = async (
    command: string
  ): Promise<
    React.ReactNode | { openModal: "resume" } | { openModal: "presentation"; presentation: Presentation }
  > => {
    const [cmd, ...args] = command.toLowerCase().trim().split(" ");
    const allFlag = args.includes("-a") || args.includes("--all");

    switch (cmd) {
      case "help":
        return <HelpOutput />;
      case "advanced":
        return <AdvancedHelpOutput />;
      case "about":
        return <AboutOutput />;
      case "contact":
      case "socials":
      case "links":
        return <ContactOutput />;
      case "experience":
      case "xp":
        if (cmd === "experience") {
          // Alias discovery tip
          setHistory(prev => [...prev, {
            id: Date.now().toString() + "-tip",
            type: "system",
            content: <span className="text-muted-foreground text-xs italic">Tip: You can also use 'xp'</span>
          }]);
        }
        if (allFlag) {
          triggerEasterEgg(EASTER_EGG_IDS.EXPERIENCE_ALL);
        }
        return <ExperienceOutput mode={allFlag ? "all" : "default"} />;
      case "education":
      case "edu":
        if (cmd === "education") {
          setHistory(prev => [...prev, {
            id: Date.now().toString() + "-tip",
            type: "system",
            content: <span className="text-muted-foreground text-xs italic">Tip: You can also use 'edu'</span>
          }]);
        }
        if (allFlag) {
          triggerEasterEgg(EASTER_EGG_IDS.EDUCATION_ALL);
        }
        return <EducationOutput mode={allFlag ? "all" : "default"} />;
      case "skills":
        return <SkillsOutput />;
      case "projects":
      case "portfolio":
        if (allFlag) {
          triggerEasterEgg(EASTER_EGG_IDS.PROJECTS_ALL);
        }
        return <ProjectsOutput mode={allFlag ? "recent" : "recent"} onViewProject={handleViewProject} />;
      case "articles":
        return <ArticlesOutput />;
      case "presentations":
      case "talks":
      case "slides":
        return <PresentationsOutput onViewPresentation={handleViewPresentation} />;
      case "interests":
      case "hobbies":
        return <InterestsOutput />;
      case "certifications":
      case "certs":
        if (allFlag) {
          // Even if 'all' is always shown now, keep easter egg for -a
          triggerEasterEgg(EASTER_EGG_IDS.CERTS_ALL);
        }
        return <CertsOutput />;
      case "gaming":
      case "games":
      case "videoGames":
        triggerEasterEgg(EASTER_EGG_IDS.GAMING_CMD_FOUND);
        return <FavoriteGamesOutput />;
      case "date":
        triggerEasterEgg(EASTER_EGG_IDS.DATE_CMD_USED);
        return <TypingEffect text={new Date().toString()} speed={20} />;
      case "echo":
        triggerEasterEgg(EASTER_EGG_IDS.ECHO_CMD_USED);
        return <TypingEffect text={args.join(" ")} speed={30} />;
      case "theme":
        const newTheme = args[0] as CliThemeType;
        if (VALID_THEMES.includes(newTheme)) {
          setTheme(newTheme);
          unlockAchievement(ACHIEVEMENTS.POLYGLOT.id);
          return `Theme set to ${newTheme}.`;
        }
        return `Invalid theme. Use 'theme <${VALID_THEMES.join(" | ")}>'.`;
      case "resume":
      case "pdf":
      case "cv":
        const downloadFlag = args.includes("-d") || args.includes("--download");
        if (downloadFlag) {
          setIsAutoDownload(true);
        }
        return { openModal: "resume" };
      case "supermario":
        triggerEasterEgg(EASTER_EGG_IDS.SUPERMARIO);
        return (
          <pre
            className="text-accent whitespace-pre-wrap"
            style={{
              lineHeight: "1",
              letterSpacing: "-1px",
              fontSize: "0.8em",
            }}
          >
            {supermario}
          </pre>
        );
      case "alias":
        triggerEasterEgg(EASTER_EGG_IDS.ALIAS_CMD_USED);
        return <AliasOutput />;
      case "revelio":
        triggerEasterEgg(EASTER_EGG_IDS.REVELIO_CMD_USED);
        return <RevelioOutput />;
      case "achievements":
        if (allFlag) {
          setIsAchievementsModalOpen(true);
          return <p className="text-muted-foreground text-sm">Opening achievements modal...</p>;
        }
        return <AchievementsOutput unlockedAchievements={unlockedAchievements} />;
      case "shortcuts":
      case "keys":
        return (
          <div className="flex flex-col gap-2">
            <p className="text-accent mb-2">Keyboard Shortcuts:</p>
            <table className="table-ascii w-full max-w-md">
              <thead>
                <tr>
                  <th className="text-left pb-2 border-b border-muted-foreground">Key</th>
                  <th className="text-left pb-2 border-b border-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">Tab</td>
                  <td className="py-1">Autocomplete command</td>
                </tr>
                <tr>
                  <td className="py-1">↑ / ↓</td>
                  <td className="py-1">Navigate history</td>
                </tr>
                <tr>
                  <td className="py-1">Ctrl + C</td>
                  <td className="py-1">Clear input</td>
                </tr>
                <tr>
                  <td className="py-1">Esc</td>
                  <td className="py-1">Close modal</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "":
        return null;
      default:
        // Fuzzy matching for suggestions
        const suggestions = AVAILABLE_COMMANDS
          .map(cmd => ({ cmd, dist: levenshteinDistance(cmd, command) }))
          .filter(({ dist }) => dist <= 2)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3)
          .map(({ cmd }) => cmd);

        return (
          <div className="flex flex-col gap-1">
            <p className="text-destructive">
              Command not found: {command}. Type 'help' for available commands.
            </p>
            {suggestions.length > 0 && (
              <p className="text-accent">
                Did you mean: {suggestions.join(", ")}?
              </p>
            )}
          </div>
        );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // ... existing imports

  // Inside TerminalInterface

  const executeCommand = async (cmd: string) => {
    const trimmedInput = cmd.trim();
    const newHistoryLog: OutputLine[] = [];

    if (trimmedInput) {
      newHistoryLog.push({
        id: Date.now().toString() + "-input",
        type: "input",
        command: trimmedInput,
        content: `${USERNAME}@${HOSTNAME}:${PROMPT_SYMBOL} ${trimmedInput}`,
      });
    }

    if (trimmedInput.toLowerCase() === "clear") {
      setHistory([
        {
          id: Date.now().toString() + "-system-welcome",
          type: "system",
          content: <WelcomeMessage />,
        },
      ]);
    } else {
      const result = await processCommand(trimmedInput);
      if (
        result &&
        typeof result === "object" && // Check if result is an object
        result !== null && // Ensure result is not null
        "openModal" in result &&
        result.openModal === "resume" // Check for the specific "resume" openModal flag
      ) {
        // Show loading state first
        newHistoryLog.push({
          id: Date.now().toString() + "-loading",
          type: "system",
          content: (
            <span className="flex items-center gap-2 text-accent">
              <span className="animate-spin">⠋</span> Loading resume data...
            </span>
          ),
        });
        setHistory((prev) => [...prev, ...newHistoryLog]);

        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        // Handle modal opening and resume sections here
        setIsResumeModalOpen(true);

        // Replace loading message with success
        setHistory((prev) => {
          const filtered = prev.filter(line => !line.id.includes("-loading"));
          return [...filtered, {
            id: Date.now().toString() + "-output",
            type: "output",
            content: "Resume loaded successfully.",
          }];
        });
        return; // Exit early as we handled history update manually
      } else if (
        result !== null &&
        (typeof result !== "object" ||
          React.isValidElement(result) ||
          typeof result === "string" ||
          typeof result === "number" ||
          typeof result === "boolean" ||
          typeof result === "bigint" ||
          typeof result === "undefined" ||
          Array.isArray(result))
      ) {
        // Only push to history if result is a valid ReactNode (not a plain object)
        newHistoryLog.push({
          id: Date.now().toString() + "-output",
          type: "output",
          content: result as React.ReactNode,
        });
      }

      if (newHistoryLog.length > 0) {
        setHistory((prev) => [...prev, ...newHistoryLog]);
      }
    }

    if (
      trimmedInput &&
      (commandHistory.length === 0 || commandHistory[0] !== trimmedInput)
    ) {
      setCommandHistory((prev) => [trimmedInput, ...prev].slice(0, 50));
      unlockAchievement(ACHIEVEMENTS.FIRST_STEPS.id);
    }
    setHistoryIndex(-1);
    setInputValue("");
  };

  const handleCommandSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    await executeCommand(inputValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setInputValue("");
      triggerEasterEgg(EASTER_EGG_IDS.CTRL_C_CLEAR);
    }

    // Tab autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      const trimmedInput = inputValue.toLowerCase().trim();

      if (!trimmedInput) return;

      // Find matches
      const matches = AVAILABLE_COMMANDS.filter(cmd =>
        cmd.startsWith(trimmedInput)
      );

      if (matches.length === 1) {
        // Single match: autocomplete
        setInputValue(matches[0]);
        triggerEasterEgg(EASTER_EGG_IDS.AUTOCOMPLETE_USED);
        unlockAchievement(ACHIEVEMENTS.SPEED_DEMON.id);
      } else if (matches.length > 1) {
        // Multiple matches: display options
        const newHistoryLog: OutputLine = {
          id: Date.now().toString() + "-autocomplete",
          type: "system",
          content: matches.join("  ")
        };
        setHistory((prev) => [...prev, newHistoryLog]);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex] || "");
        triggerEasterEgg(EASTER_EGG_IDS.CMD_HISTORY_USED);
        unlockAchievement(ACHIEVEMENTS.TIME_TRAVELER.id);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > -1) {
        const newIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(newIndex);
        if (newIndex === -1) {
          setInputValue("");
        } else {
          setInputValue(commandHistory[newIndex] || "");
        }
        triggerEasterEgg(EASTER_EGG_IDS.CMD_HISTORY_USED);
        unlockAchievement(ACHIEVEMENTS.TIME_TRAVELER.id);
      } else {
        setInputValue("");
      }
    }
  };

  const handleContainerClick = () => {
    if (!isResumeModalOpen && !isModalOpen && !isAchievementsModalOpen) {
      hiddenInputRef.current?.focus();
    }
  };

  const handleViewPresentation = (presentation: Presentation) => {
    setModalItem(presentation);
    setIsModalOpen(true);
  };

  const handleViewProject = (project: Project) => {
    setModalItem(project);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="flex flex-col h-full p-2 md:p-4 bg-background text-sm md:text-base"
        onClick={handleContainerClick}
      >
        {/* ARIA Live Region for Screen Readers */}
        <div className="sr-only" role="log" aria-live="polite">
          {history.length > 0 && history[history.length - 1].type === "output" && (
            typeof history[history.length - 1].content === "string"
              ? history[history.length - 1].content
              : "Command executed"
          )}
        </div>

        <ScrollArea className="flex-grow cli-output-area overflow-y-auto">
          <div>
            {history.map((line) => (
              <div
                key={line.id}
                className={`text-sm md:text-base mb-1 ${line.type === "input"
                  ? "text-primary"
                  : line.type === "error"
                    ? "text-destructive"
                    : line.type === "system"
                      ? "text-muted-foreground"
                      : line.type === "success"
                        ? "text-[hsl(var(--success))]"
                        : line.type === "warning"
                          ? "text-[hsl(var(--warning))]"
                          : "text-foreground"
                  }`}
              >
                {typeof line.content === "string" ? (
                  <pre className="whitespace-pre-wrap">{line.content}</pre>
                ) : (
                  line.content
                )}
              </div>
            ))}
            <div ref={endOfHistoryRef} />
          </div>
        </ScrollArea>
        <form
          onSubmit={handleCommandSubmit}
          className="mt-2 flex flex-row flex-wrap items-baseline flex-shrink-0 mb-0 pb-0"
        >
          <span className="text-accent mr-1 whitespace-nowrap shrink-0 text-sm md:text-base">
            {USERNAME}@{HOSTNAME}:{PROMPT_SYMBOL}
          </span>
          <div className="relative flex flex-grow items-baseline min-w-[calc(50%+1rem)] sm:min-w-[200px]">
            <span
              className="cli-input-display whitespace-pre"
              style={{ whiteSpace: "pre", fontSize: "0.875rem" }}
            >
              {inputValue}
              <span className="blinking-cursor"></span>
            </span>
            <input
              ref={hiddenInputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 w-full h-full opacity-0 p-0 m-0 border-0 cursor-text"
              autoFocus={!isResumeModalOpen}
              spellCheck="false"
              autoComplete="off"
              aria-label="Terminal input"
            />
          </div>
        </form>
      </div>
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => {
          setIsResumeModalOpen(false);
          setIsAutoDownload(false);
        }}
        data={portfolioData}
        autoDownload={isAutoDownload}
      />
      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        unlockedAchievements={unlockedAchievements}
      />
      <UniversalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalItem(null);
        }}
        title={modalItem?.name || ""}
        description={
          modalItem
            ? "description" in modalItem
              ? modalItem.description || ""
              : ""
            : ""
        }
        iframeUrl={
          modalItem && "name" in modalItem && modalItem.name === "Uom Track"
            ? "https://tasostilsi.github.io/WebnMobileDevelopmentUOM/"
            : modalItem?.link || ""
        }
        sourceUrl={modalItem?.sourceUrl}
        externalUrl={modalItem?.link || ""}
      />
      <MobileCommandPalette onExecuteCommand={executeCommand} />
    </>
  );
};

