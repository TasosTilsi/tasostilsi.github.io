/**
 * ExplorePanels — the main-area panel grid (phase EXPLORE-02; phase-8 D-01
 * rebalance).
 *
 * Five panels from EXPLORE_SECTIONS in locked DOM order — About and Contact
 * are merged into one panel (D-05: the contact panel's anatomy lives inside
 * AboutSection; the standalone Contact panel is gone) — each rendered through
 * the shared PanelShell chrome (stable section id + accent chip + label
 * row + body slot, byte-identical to the phase-1 shell) whose body comes
 * from the SECTION_BODIES registry — a total adapter-closure map from the
 * whole PortfolioData prop down to each section's slice props, keeping the
 * data flow server-side and SSG-safe (page → panels → sections as typed
 * props, UI-SPEC §2, D-07). All four sections are registered: every panel
 * renders its data-driven body and nothing else (D-06, EXPLORE-07).
 *
 * Phase-9 grid reflow (REV-14, D-01, UI-SPEC §1.1): the DOM order IS the
 * visual order — EXPLORE_SECTIONS is reordered to [about, skills, experience,
 * projects], so About+Contact and Skills lead row 1, Experience lands
 * full-width row 2 and Projects spans row 3. The phase-9 per-panel sticky
 * pairs were later NARROWED: only the Experience panel keeps the extended
 * sticky range (its wrapper spans both grid columns at the 300vh extended
 * height, its shell pinning with the sticky pair below), so exactly ONE
 * extended range remains in the grid. The order-first utility
 * RETIRED with the reflow — DOM order = tab order = visual order, the
 * speech-order caveat is gone. The index chips
 * (01 About · 02 Skills · 03 Experience · 04 Projects · 05 Credentials) and the
 * entrance-stagger nth-child delays re-derive from the array/DOM position —
 * zero literal renumbering. The placement map stays the data-driven Record
 * keyed by ExploreSectionId — no id-comparison conditional. The ONLY
 * data gate left is the Experience one (W-3, amended by phase-10 REV-18):
 * experienceGate keys on the selected-entry count (tech roles ∪ featured
 * education, the pure module's ONE derivation) > 1, while about, skills and
 * credentials each carry `{ wrapper: '', shell: '', gate: false }` and
 * projects carries the same gate-free shape with the md centering shells
 * `shell: 'md:flex md:flex-col md:justify-center'` (2026-10-02 DEFECT 1 —
 * no wrapper, no sticky range, panel height still content-driven). Projects
 * renders at natural height. That
 * is the phase-10 REV-18 fact: Projects returned to natural height when the
 * panel became the swipe-driven ring-buffer stack (user directive
 * 2026-09-25, quick task `2026-09-25-projects-swipe-loop-stack`, commit
 * b39b12c). The `data-editorial-wrapper="true"` attribute still rides every
 * grid child (test-pinned at tests/explore-visuals.test.mjs:945) but is read
 * by NO file under src/ — the Experience stage's hand-rolled hook measures
 * `.explore-shell > main` instead (MAIN_SELECTOR, use-timeline-progress.ts:104).
 * ≤1 selected entry still renders natural height with no sticky (E-1/E-2).
 *
 * Phase-13 REV-23c amendment (user directive 2026-10-05): the Experience range
 * is no longer md-only. The phone gets its OWN scroll range on the same
 * data-conditional wrapper — a base `h-[400vh]` (5 bands × 80vh, one band per
 * merged entry) with the shell pinning from `sticky top-0 z-10`, because the
 * <md presentation became "one entry at a time, changing while scrolling". The
 * md half is byte-unchanged: the same span-2 wrapper at the 300vh extended
 * height, the same `md:` sticky pin pair. The gate still guards the wrapper
 * exactly as before, and the arithmetic is
 * the same one the desktop has always used: wrapperHeight − stageHeight is the
 * range, the scroll position through it is the progress, progress → the active
 * index. Phase 11 appends the Credentials panel as the 5th child: the existing
 * plain 2-column split already places it beside the Projects stack at md+
 * (row 3) and below it at <md — no ratio, no order-* utility (LAYOUT-01).
 *
 * Responsive grid: 1 column base, 2 columns from md up, gutters widen
 * gap-4 → gap-5 at the lg tier ONLY (D-02, UI-SPEC §1.2 — no max-width
 * wrapper here; full-bleed inside the main scroll container, padding lands
 * via ExploreShell's p-4 md:p-6). Every placement/height utility is
 * md:-scoped so the base grid stays 1-col at 375px (R-9); no overflow
 * utility exists anywhere on the wrapper/stage/grid chain — the
 * sticky-breaker audit (UI-SPEC §1.1) keeps position:sticky attaching to
 * the <main> scrollport.
 *
 * The panel-grid class is the DOM hook the phase-3 entrance stagger targets
 * (UI-SPEC §6.2): five grid children in DOM order (the wrapper counts as
 * one), animated purely by CSS keyframes in globals.css under the
 * .explore-shell scope — zero JSX animation wiring, SSG-safe.
 *
 * D-02 hierarchy device (UI-SPEC §5): each PanelShell header receives the
 * zero-padded mono index 01–04 derived from the EXPLORE_SECTIONS map index
 * (String(index + 1).padStart(2, '0')) — data-driven, no literals in JSX.
 *
 * Panels are static cards (UI-SPEC §17.6) — no interaction states on the
 * containers; only links and the timeline stage's two controls inside
 * bodies are interactive.
 */
import type { ComponentType } from 'react';
import { EXPLORE_SECTIONS, type ExploreSectionId } from './constants';
import { selectTimelineEntries } from './timeline-geometry';
import { PanelShell } from './panel-shell';
import { AboutSection } from './sections/about-section';
import { CredentialsSection } from './sections/credentials-section';
import { ExperienceSection } from './sections/experience-section';
import { ProjectsSection } from './sections/projects-section';
import { SkillsSection } from './sections/skills-section';
import type { PortfolioData } from '@/data/portfolio-main-data';

/** Chip accent per section order: About=chart-1 … Projects=chart-4, Credentials=chart-5 (UI-SPEC §6/§2.2). */
const ACCENTS: Record<ExploreSectionId, string> = {
  about: 'bg-chart-1',
  experience: 'bg-chart-2',
  skills: 'bg-chart-3',
  projects: 'bg-chart-4',
  credentials: 'bg-chart-5',
};

type SectionBodyProps = { data: PortfolioData };

/**
 * Total adapter-closure registry: section id → body component over the
 * whole PortfolioData. Adapters map the whole data object to each
 * section's slice prop, so a bare component literal would not typecheck —
 * the closure form is the pinned registry shape (plan 01 task 1). Total
 * since the REV-04 merge — five closures over five sections (phase-11 D-04
 * appended Credentials), no fallback body path (D-04/D-05).
 */
const SECTION_BODIES: Record<
  ExploreSectionId,
  ComponentType<SectionBodyProps>
> = {
  about: ({ data }) => <AboutSection about={data.about} />,
  credentials: ({ data }) => <CredentialsSection articles={data.articles} certifications={data.certifications} presentations={data.presentations} />,
  experience: ({ data }) => <ExperienceSection experience={data.experience} education={data.education} />,
  projects: ({ data }) => <ProjectsSection projects={data.projects} />,
  skills: ({ data }) => <SkillsSection skills={data.skills} competencies={data.core_competencies} />,
};

/**
 * Placement map factory (UI-SPEC §1.1/§4.1 — the phase-9 seam, amended by
 * phase-10 REV-18, the 2026-10-02 centering fix and REV-23c): a Record keyed by
 * ExploreSectionId whose values carry the ONLY placement classes of the phase.
 * Only Experience retains the sticky scroll-range wrapper + shell; Projects
 * returns to natural height with its swipe-driven stage as a centered block —
 * its shell carries the md-scoped `md:flex md:flex-col md:justify-center`
 * centering pair (DEFECT 1), which centers the panel body inside the
 * grid-stretched panel whose height stays content-driven (no fixed height, no
 * sticky range). About and Skills occupy one cell each in row 1. Every
 * OTHER value is md:-scoped (R-9); the Experience pair is the documented
 * exception since REV-23c (its base tier owns the phone's own scroll range and
 * sticky pin — see the REV-23c note in the module header). R-3: any wrapper
 * stays a plain div with NO id — the tour hole, the IO threshold and the drawer
 * anchors measure the sticky section by its stable id; the wrapper's
 * data-editorial-wrapper attribute is a stable hook nothing under src/ reads.
 *
 * `gate` remains the W-3 data condition on the STICKY range: when false the
 * wrapper (and thus the sticky extension) is not rendered at all, so the
 * shell's centering classes are the only thing a gate-free placement applies.
 */
function buildPlacement(
  data: PortfolioData,
): Record<ExploreSectionId, { wrapper: string; shell: string; gate: boolean }> {
  const experienceGate =
    selectTimelineEntries(data.experience, data.education).length > 1;
  return {
    about: { wrapper: '', shell: '', gate: false },
    experience: {
      wrapper: 'h-[400vh] md:col-span-2 md:h-[300vh]',
      shell: 'sticky top-0 z-10 md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]',
      gate: experienceGate,
    },
    skills: { wrapper: '', shell: '', gate: false },
    projects: { wrapper: '', shell: 'md:flex md:flex-col md:justify-center', gate: false },
    credentials: { wrapper: '', shell: '', gate: false },
  };
}

export function ExplorePanels({ data }: { data: PortfolioData }) {
  // W-3 pair: each sticky extension is DATA-CONDITIONAL per system — the
  // placement factory carries each gate (no section-id conditionals; the
  // shell test pin holds).
  const PLACEMENT = buildPlacement(data);
  return (
    <div className="grid panel-grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
      {EXPLORE_SECTIONS.map((section, index) => {
        const Body = SECTION_BODIES[section.id];
        const placement = PLACEMENT[section.id];
        const shell = (
          <PanelShell
            key={section.id}
            id={section.id}
            label={section.label}
            accent={ACCENTS[section.id]}
            index={String(index + 1).padStart(2, '0')}
            // The shell classes apply whenever a placement declares them; the
            // `gate` condition guards the WRAPPER (the sticky scroll range)
            // only — About/Skills/Credentials declare no shell, Projects
            // declares the gate-free md centering shell (DEFECT 1).
            className={placement.shell || undefined}
          >
            <Body data={data} />
          </PanelShell>
        );
        if (!placement.wrapper) {
          return shell;
        }
        // R-3: plain wrapper — no id, no chrome. The data-editorial-wrapper
        // attribute below is a stable grid-child hook that NO file under src/
        // reads; the Experience stage's hand-rolled hook measures
        // `.explore-shell > main` instead (MAIN_SELECTOR,
        // use-timeline-progress.ts:104). The entrance stagger animates it as
        // the grid child; the sticky section inside keeps the stable section
        // id the tour/IO/drawer flows measure.
        return (
          <div
            key={section.id}
            className={placement.gate ? placement.wrapper : undefined}
            data-editorial-wrapper="true"
          >
            {shell}
          </div>
        );
      })}
    </div>
  );
}