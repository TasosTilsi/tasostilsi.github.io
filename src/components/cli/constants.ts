export const USERNAME = "guest";
export const HOSTNAME = "tasostilsi-portfolio";
export const PROMPT_SYMBOL = "$";

export type Theme =
  | "light"
  | "dark"
  | "sepia"
  | "monokai"
  | "github"
  | "solarized-dark";

export const VALID_THEMES: Theme[] = [
  "light",
  "dark",
  "sepia",
  "monokai",
  "github",
  "solarized-dark",
];

export const EASTER_EGG_IDS = {
  PROJECTS_ALL: "projects_all_flag_found",
  CERTS_ALL: "certs_all_flag_found",
  EDUCATION_ALL: "education_all_flag_found",
  SUPERMARIO: "supermario_cmd_found",
  GAMING_CMD_FOUND: "gaming_cmd_found",
  CMD_HISTORY_USED: "cmd_history_used_flag",
  EXPERIENCE_ALL: "experience_all_flag_found",
  CTRL_C_CLEAR: "ctrl_c_clear_easter_egg",
  DATE_CMD_USED: "date_cmd_used_flag",
  ECHO_CMD_USED: "echo_cmd_used_flag",
  ALIAS_CMD_USED: "alias_cmd_used_flag",
  REVELIO_CMD_USED: "revelio_cmd_used_flag",
  AUTOCOMPLETE_USED: "autocomplete_used_flag",
};

export const EASTER_EGG_NAMES: Record<string, string> = {
  [EASTER_EGG_IDS.PROJECTS_ALL]: "Curiosity Rewarded (All Projects)",
  [EASTER_EGG_IDS.CERTS_ALL]: "Archivist Achievement (All Certs)",
  [EASTER_EGG_IDS.EDUCATION_ALL]: "Full Scholar! (All Education)",
  [EASTER_EGG_IDS.SUPERMARIO]: "It's-a me, Mario! Power Up!",
  [EASTER_EGG_IDS.GAMING_CMD_FOUND]: "Game On! (Gaming Command)",
  [EASTER_EGG_IDS.CMD_HISTORY_USED]: "Time Traveler! (Command History)",
  [EASTER_EGG_IDS.EXPERIENCE_ALL]: "Career Historian! (All Experience)",
  [EASTER_EGG_IDS.CTRL_C_CLEAR]: "Ctrl+C Master",
  [EASTER_EGG_IDS.DATE_CMD_USED]: "Timekeeper! (Date Command)",
  [EASTER_EGG_IDS.ECHO_CMD_USED]: "Parrot! (Echo Command)",
  [EASTER_EGG_IDS.ALIAS_CMD_USED]: "Alias Detective! (Alias Command)",
  [EASTER_EGG_IDS.REVELIO_CMD_USED]: "Spellmaster! (Revelio Command)",
  [EASTER_EGG_IDS.AUTOCOMPLETE_USED]: "Speed Demon! (Tab Autocomplete)",
};

export const TOTAL_EASTER_EGGS = Object.keys(EASTER_EGG_IDS).length;
export const AVAILABLE_COMMANDS = [
  "help", "advanced", "about", "contact", "socials", "links",
  "experience", "xp", "education", "edu", "skills", "projects",
  "portfolio", "articles", "presentations", "talks", "slides",
  "interests", "hobbies", "certifications", "certs", "gaming",
  "games", "resume", "pdf", "cv", "date", "echo", "theme",
  "supermario", "alias", "revelio", "clear", "shortcuts", "keys", "achievements"
];

export const LOCAL_STORAGE_EASTER_EGGS_KEY = "portfolioCliFoundEasterEggs";
export const LOCAL_STORAGE_THEME_KEY = "portfolio-theme";
export const LOCAL_STORAGE_HISTORY_KEY = "portfolio-command-history";
export const LOCAL_STORAGE_ACHIEVEMENTS_KEY = "portfolio-achievements";

export type AchievementCategory = 'exploration' | 'discovery' | 'engagement' | 'social';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  // EXPLORATION (5)
  FIRST_STEPS: {
    id: "first_steps",
    title: "First Steps",
    description: "Execute your first command",
    category: "exploration"
  },
  SPEED_DEMON: {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Use tab autocomplete",
    category: "exploration"
  },
  TIME_TRAVELER: {
    id: "time_traveler",
    title: "Time Traveler",
    description: "Navigate command history with arrow keys",
    category: "exploration"
  },
  EXPLORER: {
    id: "explorer",
    title: "Explorer",
    description: "View 5 different sections",
    category: "exploration"
  },
  COMPLETIONIST: {
    id: "completionist",
    title: "Completionist",
    description: "View all available sections",
    category: "exploration"
  },

  // DISCOVERY (4)
  CURIOUS_CAT: {
    id: "curious_cat",
    title: "Curious Cat",
    description: "Discover a hidden easter egg",
    category: "discovery"
  },
  SECRET_HUNTER: {
    id: "secret_hunter",
    title: "Secret Hunter",
    description: "Find 3 easter eggs",
    category: "discovery"
  },
  REVELIO_MASTER: {
    id: "revelio_master",
    title: "Revelio Master",
    description: "Use the revelio command",
    category: "discovery"
  },
  EASTER_EGG_CHAMPION: {
    id: "easter_egg_champion",
    title: "Easter Egg Champion",
    description: "Find all easter eggs",
    category: "discovery"
  },

  // ENGAGEMENT (4)
  POLYGLOT: {
    id: "polyglot",
    title: "Polyglot",
    description: "Change the interface theme",
    category: "engagement"
  },
  THEME_COLLECTOR: {
    id: "theme_collector",
    title: "Theme Collector",
    description: "Try 3 different themes",
    category: "engagement"
  },
  NIGHT_OWL: {
    id: "night_owl",
    title: "Night Owl",
    description: "Visit after midnight",
    category: "engagement"
  },
  RESUME_VIEWER: {
    id: "resume_viewer",
    title: "Resume Viewer",
    description: "Open the resume",
    category: "engagement"
  },

  // SOCIAL (2)
  NETWORKER: {
    id: "networker",
    title: "Networker",
    description: "View contact information",
    category: "social"
  },
  CONNECTOR: {
    id: "connector",
    title: "Connector",
    description: "Click on a social link",
    category: "social"
  },
} as const;

export type AchievementId = typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS]["id"];
