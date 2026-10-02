/**
 * Locked chrome constants for the IDE landing shell (phase EXPLORE-01; the
 * visual route became the primary landing in phase EXPLORE-12, REV-22).
 *
 * Plain TS module — no "use client" needed; importable from server components,
 * client components, and the layout's inline before-paint script constant.
 *
 * D-01: section order and labels are locked by the SPEC acceptance
 * (drawer anchors + panel ids + status-bar counter all derive from this list).
 *
 * D-01 phase-9 amendment (REV-14): the grid reflows About-first — the DOM
 * order is [about, skills, experience, projects] (About|Skills row 1,
 * Experience full-width row 2, Projects row 3) and every order consumer
 * (drawer items, index chips, entrance stagger, drawer anchors, IO, tour
 * scroll targets, visited counter) derives from THIS array. The tour's
 * CONTENT step order is unchanged — the step table below is a literal,
 * id-keyed table that no longer zips against this array.
 */
export const EXPLORE_SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Credentials" },
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
 * Rendered contiguously as `guest@tasostilsi` (accent) + `:~`
 * (muted-foreground) — colors only, no separator spans. The `:~` prompt is
 * the user's breadcrumb option 2 (phase-12 D-03): the shell is now the site
 * root, so the prompt ends at the home directory.
 */
export const EXPLORE_STATUS_USER = "guest@tasostilsi";
export const EXPLORE_STATUS_PATH = ":~";

/**
 * D-03 / UI-SPEC §2.3: the status bar's `cli` new-tab chip — the phase's only
 * new control. Plain values (no JSX) so the component and the acceptance rows
 * read ONE derivation site; the href is static, so the anchor has no
 * open-redirect surface, and `rel` lives literally in the component.
 * The accessible name deliberately leads with the visible label: WCAG 2.5.3
 * requires the name to CONTAIN the visible text, so this is the
 * UI-SPEC §5.1 RESOLVED-NAME wording, not the brief's literal string.
 * Keep all three strings digit-free (the EXPLORE_TOUR_FINISH digit guard
 * sweeps the finish constants; the same discipline applies here).
 */
export const EXPLORE_STATUS_CLI_LINK = {
  label: "cli",
  href: "/cli",
  ariaLabel: "cli — open the terminal in a new tab",
} as const;

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
 * maps are TOTAL over ExploreSectionId — the phase-11 append widened them
 * to 5 sections (credentials takes the chart-5 slot freed by REV-21).
 */
export const EXPLORE_TOUR_ACCENTS: Record<ExploreSectionId, string> = {
  about: "bg-chart-1",
  experience: "bg-chart-2",
  skills: "bg-chart-3",
  projects: "bg-chart-4",
  credentials: "bg-chart-5",
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
 * cross-surface pointer in this phase: an internal link across to the CLI at
 * /cli (phase-12 D-03 moved it from / to /cli) with a one-line terminal hint
 * (SPEC EXPLORE-04d).
 */
export const EXPLORE_TOUR_FINISH = {
  congrats: "That's the lap — every section's marked visited on the counter below.",
  linkLabel: "Open the terminal →",
  linkHref: "/cli",
  hint: "the full story lives in the terminal — start with help",
} as const;

/**
 * D-02 (REV-04 amended; REV-14 phase-9 edition): locked 6-step table —
 * welcome → about → experience → skills → projects → finish. The CONTENT
 * order is unchanged by the phase-9 grid reflow (D-01): the DOM order is
 * About → Skills → Experience → Projects, but the tour still walks
 * about → experience → skills → projects. The table is a LITERAL, id-keyed
 * table — each content step targets its own panel id, derives heading +
 * announce from the matching EXPLORE_SECTIONS entry BY ID, and keeps its
 * body string keyed to its own section — so the array reorder can never
 * silently re-pair labels or bodies. Indices drive the progress dots and
 * the step counter, always derived from this array's length (UI-SPEC §3).
 */

/** Id-keyed label lookup — headings/announce derive from the section's own label, never a positional zip. */
const tourLabel = (id: ExploreSectionId): string => {
  const section = EXPLORE_SECTIONS.find((section) => section.id === id);
  if (!section) {
    throw new Error(`EXPLORE_TOUR_STEPS: unknown section id "${id}"`);
  }
  return section.label;
};

export const EXPLORE_TOUR_STEPS: readonly TourStep[] = [
  {
    id: "welcome",
    sectionId: null,
    heading: "explore --tour",
    announce: "welcome",
    body: "A 60-second lap of the five sections — Next and Back at your own pace, ESC whenever you're done. No timers.",
  },
  {
    id: "about",
    sectionId: "about",
    heading: tourLabel("about"),
    announce: tourLabel("about"),
    body: "The short version of who's typing — bio, role, location, every contact channel, and the resume export.",
  },
  {
    id: "experience",
    sectionId: "experience",
    heading: tourLabel("experience"),
    announce: tourLabel("experience"),
    body: "Roles in order — title, company, tenure, and the shape of the career as a timeline.",
  },
  {
    id: "skills",
    sectionId: "skills",
    heading: tourLabel("skills"),
    announce: tourLabel("skills"),
    body: "Competency cards with the quantified proof behind each — full inventory below.",
  },
  {
    id: "projects",
    sectionId: "projects",
    heading: tourLabel("projects"),
    announce: tourLabel("projects"),
    body: "Stat tiles up top, six projects underneath.",
  },
  {
    id: "finish",
    sectionId: null,
    heading: "tour complete",
    announce: "tour complete",
    body: EXPLORE_TOUR_FINISH.congrats,
  },
];