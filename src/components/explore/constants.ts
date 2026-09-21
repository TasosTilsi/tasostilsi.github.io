/**
 * Locked chrome constants for the /explore IDE shell (phase EXPLORE-01).
 *
 * Plain TS module — no "use client" needed; importable from server components,
 * client components, and the layout's inline before-paint script constant.
 *
 * D-01: section order and labels are locked by the SPEC acceptance
 * (drawer anchors + panel ids + status-bar counter all derive from this list).
 */
export const EXPLORE_SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export type ExploreSectionId = (typeof EXPLORE_SECTIONS)[number]["id"];

/**
 * D-05/D-10: the explore theme storage key MUST stay disjoint from the CLI
 * theme key (src/components/cli/constants.ts:65). The shell never
 * reads or writes the CLI key and vice versa; both surfaces self-heal their
 * own <html> classes on mount.
 */
export const EXPLORE_THEME_STORAGE_KEY = "portfolio-explore-theme";

export const EXPLORE_THEME_VALUES = ["dark", "light"] as const;

export type ExploreTheme = (typeof EXPLORE_THEME_VALUES)[number];

/**
 * D-03 / UI-SPEC §7: locked status-bar breadcrumb strings.
 * Rendered contiguously as `guest@tasostilsi` (accent) + `:~/explore`
 * (muted-foreground) — colors only, no separator spans.
 */
export const EXPLORE_STATUS_USER = "guest@tasostilsi";
export const EXPLORE_STATUS_PATH = ":~/explore";

/**
 * D-06 / UI-SPEC §6: locked placeholder-panel humor lines.
 * Chrome strings, NOT portfolio content (UI-SPEC §17.5) — format locked as
 * `// <expression> — pending`, wording adopted verbatim from UI-SPEC §6
 * (resolved the planner discretion by adopting the §6 strings).
 */
export const EXPLORE_PANEL_HUMOR: Record<ExploreSectionId, string> = {
  about: "// about.profile.load() — pending",
  experience: "// experience.render() — pending",
  skills: "// skills.matrix.map() — pending",
  projects: "// projects.repo.checkout() — pending",
  contact: "// contact.establish_link() — pending",
};