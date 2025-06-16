export const USERNAME = "guest";
export const HOSTNAME = "tasostilsi-portfolio";
export const PROMPT_SYMBOL = "$";

export const EASTER_EGG_IDS = {
  PROJECTS_ALL: 'projects_all_flag_found',
  CERTS_ALL: 'certs_all_flag_found',
  EDUCATION_ALL: 'education_all_flag_found',
  SUPERMARIO: 'supermario_cmd_found',
  GAMING_CMD_FOUND: 'gaming_cmd_found',
  CMD_HISTORY_USED: 'cmd_history_used_flag',
  EXPERIENCE_ALL: 'experience_all_flag_found',
  CTRL_C_CLEAR: 'ctrl_c_clear_easter_egg',
  DATE_CMD_USED: 'date_cmd_used_flag',
  ECHO_CMD_USED: 'echo_cmd_used_flag',
  ALIAS_CMD_USED: 'alias_cmd_used_flag',
  REVELIO_CMD_USED: 'revelio_cmd_used_flag',
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
};

export const TOTAL_EASTER_EGGS = Object.keys(EASTER_EGG_IDS).length;
export const LOCAL_STORAGE_EASTER_EGGS_KEY = 'portfolioCliFoundEasterEggs';
export const LOCAL_STORAGE_THEME_KEY = 'portfolio-theme';
