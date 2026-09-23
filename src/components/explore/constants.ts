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
 * D-05: tour trigger flag — 'seen' written on any dismissal, 'completed' on
 * finish; any non-null value suppresses auto-open (UI-SPEC §7). Explore-scoped
 * and MUST stay disjoint from the CLI keys (src/components/cli/constants.ts
 * LOCAL_STORAGE_EASTER_EGGS_KEY / LOCAL_STORAGE_THEME_KEY, lines 64-67) and
 * from the CLI theme key — the shared `portfolio-explore-` prefix plus the
 * disjointness greps (tests/explore-tour.test.mjs) hold that invariant.
 */
export const EXPLORE_TOUR_STORAGE_KEY = "portfolio-explore-tour";

/**
 * D-06: JSON array of visited section ids (EXPLORE_SECTIONS ids only).
 * Read parses, filters to valid ids and dedupes preserving first-occurrence
 * order (tour-placement.ts parseVisitedIds, E-8); writes are append-only.
 */
export const EXPLORE_VISITED_STORAGE_KEY = "portfolio-explore-visited";

/**
 * UI-SPEC §4 chip accent per section, for the tour's heading-row chip.
 * Duplicated from the module-private ACCENTS in explore-panels.tsx; both
 * maps narrowed to the 4 sections by the REV-04 merge (D-05).
 */
export const EXPLORE_TOUR_ACCENTS: Record<ExploreSectionId, string> = {
  about: "bg-chart-1",
  experience: "bg-chart-2",
  skills: "bg-chart-3",
  projects: "bg-chart-4",
};

/**
 * D-02: one locked wizard step — no-target steps (welcome/finish) carry
 * sectionId null and their own chrome heading/announce; content steps derive
 * heading + announce from the matching EXPLORE_SECTIONS entry and target its
 * panel id.
 */
export type TourStep = {
  id: "welcome" | "about" | "experience" | "skills" | "projects" | "finish";
  sectionId: ExploreSectionId | null;
  heading: string;
  announce: string;
  body: string;
};

/**
 * D-04: finish-card constants — the congratulation chrome line plus the ONLY
 * cross-surface pointer in this phase: an internal link to the CLI at / with
 * a one-line terminal hint (SPEC EXPLORE-04d).
 */
export const EXPLORE_TOUR_FINISH = {
  congrats: "That's the lap — every section's marked visited on the counter below.",
  linkLabel: "Open the terminal →",
  linkHref: "/",
  hint: "the full story lives in the terminal — start with help",
} as const;

/** §4 bodies in EXPLORE_SECTIONS order — chrome orientation copy only, zero invented portfolio facts. */
const EXPLORE_TOUR_STEP_BODIES = [
  "The short version of who's typing — bio, role, location, every contact channel, and the resume export.",
  "Roles in order — title, company, tenure, and the shape of the career as a timeline.",
  "Competency cards with the quantified proof behind each — full inventory below.",
  "Stat tiles up top, six projects underneath.",
] as const;

/**
 * D-02 (REV-04 amended): locked 6-step table — welcome → about → experience →
 * skills → projects → finish. Indices drive the progress dots and the
 * step counter, always derived from this array's length (UI-SPEC §3);
 * content steps are generated from EXPLORE_SECTIONS so headings/announce
 * never duplicate the labels.
 */
export const EXPLORE_TOUR_STEPS: readonly TourStep[] = [
  {
    id: "welcome",
    sectionId: null,
    heading: "explore --tour",
    announce: "welcome",
    body: "A 60-second lap of the four sections — Next and Back at your own pace, ESC whenever you're done. No timers.",
  },
  ...EXPLORE_SECTIONS.map((section, index) => ({
    id: section.id,
    sectionId: section.id,
    heading: section.label,
    announce: section.label,
    body: EXPLORE_TOUR_STEP_BODIES[index],
  })),
  {
    id: "finish",
    sectionId: null,
    heading: "tour complete",
    announce: "tour complete",
    body: EXPLORE_TOUR_FINISH.congrats,
  },
];