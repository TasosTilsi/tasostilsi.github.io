"use client";

/**
 * ExploreDrawer — off-canvas section navigation (D-02, UI-SPEC §5).
 *
 * One code path at EVERY viewport (375px, 768px, 1440px): the existing shadcn
 * Sheet (Radix Dialog) with side="left" and NO width overrides — the default
 * left variant (w-3/4 / sm:max-w-sm = 384px) and the built-in bg-black/80
 * overlay are pinned; Radix supplies ESC-close, outside-click close, focus
 * trap, and focus return to the trigger (EXPLORE-01b) for free.
 *
 * PORTAL SCOPE (hard requirement, UI-SPEC §5): Sheet renders through a portal
 * to <body> (sheet.tsx:60) and escapes the shell DOM subtree — SheetContent
 * MUST carry the `explore-shell` marker class or the drawer loses both the
 * IDE tokens and JetBrains Mono.
 *
 * Items: anchor links href={`#${section.id}`} derived from EXPLORE_SECTIONS
 * (D-01 order), each closing the drawer on click; leading index digits are
 * decorative (aria-hidden, W-3 fix) in the section's chart-N accent.
 */
import { useState, type ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { EXPLORE_SECTIONS, type ExploreSectionId } from './constants';

/**
 * Digit accent per SECTION (REV-14/OQ-7): a per-id Record mirroring the
 * panels' ACCENTS/EXPLORE_TOUR_ACCENTS maps — the digit color follows the
 * section under ANY drawer order. (The phase-8 positional array would hand
 * Skills — item 02 after the About-first reflow — Experience's chart-2.)
 */
const DIGIT_ACCENTS: Record<ExploreSectionId, string> = {
  about: 'text-chart-1',
  experience: 'text-chart-2',
  skills: 'text-chart-3',
  projects: 'text-chart-4',
};

export function ExploreDrawer({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      {/* Portaled content escapes the shell DOM — carries the scope class itself */}
      <SheetContent side="left" className="explore-shell">
        <SheetHeader>
          <SheetTitle>~/explore</SheetTitle>
          <SheetDescription>Jump to a section</SheetDescription>
        </SheetHeader>
        <nav aria-label="Explore sections" className="flex flex-col gap-1">
          {EXPLORE_SECTIONS.map((section, i) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center gap-3 rounded-md px-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <span
                aria-hidden="true"
                className={`text-xs tabular-nums ${DIGIT_ACCENTS[section.id]}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {section.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}