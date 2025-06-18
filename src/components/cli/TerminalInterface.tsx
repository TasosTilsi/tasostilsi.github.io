"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { supermario } from "@/data/ascii-art-strings";
import type { PortfolioData } from "@/data/portfolio-main-data";
import portfolioDataJson from "@/data/portfolio-main-data.json";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import ResumeModal from "./ResumeModal";
import {
  HOSTNAME,
  PROMPT_SYMBOL,
  USERNAME,
  type Theme as CliThemeType,
} from "./constants";
import { useCliTheme } from "./hooks/useCliTheme";
import { useEasterEggs } from "./hooks/useEasterEggs";
import { AboutOutput } from "./outputs/AboutOutput";
import { AdvancedHelpOutput } from "./outputs/AdvancedHelpOutput";
import { AliasOutput } from "./outputs/AliasOutput";
import { ArticlesOutput } from "./outputs/ArticlesOutput";
import { CertsOutput } from "./outputs/CertsOutput";
import { ContactOutput } from "./outputs/ContactOutput";
import { EducationOutput } from "./outputs/EducationOutput";
import { ExperienceOutput } from "./outputs/ExperienceOutput";
import { FavoriteGamesOutput } from "./outputs/FavoriteGamesOutput";
import { HelpOutput } from "./outputs/HelpOutput";
import { InterestsOutput } from "./outputs/InterestsOutput";
import { ProjectsOutput } from "./outputs/ProjectsOutput";
import { RevelioOutput } from "./outputs/RevelioOutput";
import { SkillsOutput } from "./outputs/SkillsOutput";
import { WelcomeMessage } from "./outputs/WelcomeMessage";

const portfolioData = portfolioDataJson as PortfolioData;

interface OutputLine {
  id: string;
  type: "input" | "output" | "error" | "system" | "prompt";
  content: React.ReactNode;
  command?: string;
}

const VALID_RESUME_SECTIONS = [
  "education",
  "skills",
  "projects",
  "certifications",
  "articles",
  "interests",
];

export default function TerminalInterface() {
  const { setTheme, VALID_THEMES } = useCliTheme();
  const { triggerEasterEgg, EASTER_EGG_IDS } = useEasterEggs();

  const [history, setHistory] = useState<OutputLine[]>([
    { id: Date.now().toString(), type: "system", content: <WelcomeMessage /> },
  ]);
  const [inputValue, setInputValue] = useState("");
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeSections, setResumeSections] = useState<string[]>(
    VALID_RESUME_SECTIONS
  );

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
    React.ReactNode | { openModal: "resume"; sections?: string[] }
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
        if (allFlag) {
          triggerEasterEgg(EASTER_EGG_IDS.EXPERIENCE_ALL);
        }
        return <ExperienceOutput mode={allFlag ? "all" : "default"} />;
      case "education":
      case "edu":
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
        return <ProjectsOutput mode={allFlag ? "recent" : "recent"} />;
      case "articles":
        return <ArticlesOutput />;
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
        triggerEasterEgg(EASTER_EGG_IDS.GAMING_CMD_FOUND);
        return <FavoriteGamesOutput />;
      case "date":
        triggerEasterEgg(EASTER_EGG_IDS.DATE_CMD_USED);
        return new Date().toString();
      case "echo":
        triggerEasterEgg(EASTER_EGG_IDS.ECHO_CMD_USED);
        return args.join(" ");
      case "theme":
        const newTheme = args[0] as CliThemeType;
        if (VALID_THEMES.includes(newTheme)) {
          setTheme(newTheme);
          return `Theme set to ${newTheme}.`;
        }
        return `Invalid theme. Use 'theme <${VALID_THEMES.join(" | ")}>'.`;
      case "resume":
      case "pdf":
      case "cv":
        const requestedSections = args.filter((arg) =>
          VALID_RESUME_SECTIONS.includes(arg.toLowerCase())
        );
        const sectionsForModal =
          requestedSections.length > 0
            ? requestedSections
            : VALID_RESUME_SECTIONS;
        return { openModal: "resume", sections: sectionsForModal };
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
      case "":
        return null;
      default:
        return (
          <p className="text-destructive">
            Command not found: {command}. Type 'help' for available commands.
          </p>
        );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCommandSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
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
        // Handle modal opening and resume sections here
        setIsResumeModalOpen(true);
        setResumeSections(result.sections || VALID_RESUME_SECTIONS); // Default to all if not provided
        // Push a string output to history, not the object
        newHistoryLog.push({
          id: Date.now().toString() + "-output",
          type: "output",
          content: "Opening resume...", // Provide a string message
        });
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
    }
    setHistoryIndex(-1);
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setInputValue("");
      triggerEasterEgg(EASTER_EGG_IDS.CTRL_C_CLEAR);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex] || "");
        triggerEasterEgg(EASTER_EGG_IDS.CMD_HISTORY_USED);
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
      } else {
        setInputValue("");
      }
    }
  };

  const handleContainerClick = () => {
    if (!isResumeModalOpen) {
      hiddenInputRef.current?.focus();
    }
  };

  return (
    <>
      <div
        className="flex flex-col h-full p-2 md:p-4 bg-background text-sm md:text-base"
        onClick={handleContainerClick}
      >
        <ScrollArea className="flex-grow cli-output-area overflow-y-auto">
          <div>
            {history.map((line) => (
              <div
                key={line.id}
                className={`text-sm md:text-base mb-1 ${
                  line.type === "input"
                    ? "text-primary"
                    : line.type === "error"
                    ? "text-destructive"
                    : line.type === "system"
                    ? "text-muted-foreground"
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
              className="absolute opacity-0 w-0 h-0 p-0 m-0 border-0"
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
        onClose={() => setIsResumeModalOpen(false)}
        data={portfolioData}
        sectionsToDisplay={resumeSections}
      />
    </>
  );
}
