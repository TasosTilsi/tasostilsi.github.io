# tasostilsi.github.io - Technical Specification
**CLI Portfolio UX Enhancements**

**Author:** Tasos  
**Date:** November 23, 2025  
**Project Type:** Brownfield Enhancement  
**Status:** 🟡 Ready for Implementation

---

## 📊 Progress Dashboard

| Phase | Epic | Stories | Status | Priority |
|-------|------|---------|--------|----------|
| Phase 1 | Quick Wins | 5 | 🔴 Not Started | P0 🔥 |
| Phase 2 | Mobile Experience | 3 | 🔴 Not Started | P0 🔥 |
| Phase 3 | Polish & Accessibility | 4 | 🔴 Not Started | P1 |
| Phase 4 | Advanced Features | 5 | 🔴 Not Started | P2 |

**Overall Progress:** 0/17 stories completed (0%)

**Legend:**
- 🔴 Not Started
- 🟡 In Progress
- 🟢 Completed
- ⏸️ Blocked

---

## Context

### Available Documents

**Loaded Documents:**
- ✅ [UX Enhancement Plan](./ux-enhancement-plan.md) - Comprehensive UX validation and enhancement recommendations by Sally (UX Designer)
- ✅ [UX Validation Report](../.gemini/antigravity/brain/f1bf8aac-7d5b-4545-9f53-a320761f5e1d/ux-validation-report.md) - Detailed analysis with code examples

**Project Documentation:**
- Current implementation in `src/components/cli/`
- Design system in `src/app/globals.css`
- Portfolio data in `src/data/portfolio-main-data.json`

### Project Stack

**Framework & Runtime:**
- **Next.js:** 15.2.3 (latest, using Turbopack for dev)
- **React:** 18.3.1
- **TypeScript:** 5.x (strict mode enabled)
- **Node.js:** 20.x (inferred from Next.js 15 requirements)

**UI Framework:**
- **Tailwind CSS:** 3.4.1
- **shadcn/ui:** Radix UI components (@radix-ui/react-*)
  - Dialog, ScrollArea, Sheet, Tabs, Toast, Tooltip, etc.
- **Styling Utilities:** clsx, tailwind-merge, class-variance-authority

**Key Dependencies:**
- **PDF Generation:** jspdf 3.0.2, html2canvas 1.4.1
- **Icons:** lucide-react 0.475.0
- **Date Handling:** date-fns 3.6.0
- **State Management:** @tanstack/react-query 5.66.0

**Build & Development:**
- **Build Tool:** Next.js with Turbopack
- **Dev Server:** Port 9002
- **Output:** Static export to `./out` directory
- **Linting:** ESLint (next lint)
- **Type Checking:** TypeScript compiler

**Testing:** ⚠️ No test framework currently configured (recommendation: Vitest or Jest)

### Existing Codebase Structure

**Project Organization:**
```
src/
├── app/                    # Next.js app directory
│   ├── (main)/            # Main route group
│   │   └── page.tsx       # Home page with TerminalInterface
│   ├── globals.css        # Global styles & theme definitions
│   ├── layout.tsx         # Root layout
│   └── not-found.tsx      # Custom 404 page
├── components/
│   ├── cli/               # CLI-specific components
│   │   ├── TerminalInterface.tsx    # Main terminal component
│   │   ├── TerminalLoader.tsx       # Loading state
│   │   ├── UniversalModal.tsx       # Reusable modal
│   │   ├── ResumeModal.tsx          # Resume display modal
│   │   ├── constants.ts             # CLI constants
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useCliTheme.ts
│   │   │   └── useEasterEggs.ts
│   │   └── outputs/                 # Command output components
│   │       ├── WelcomeMessage.tsx
│   │       ├── HelpOutput.tsx
│   │       ├── AboutOutput.tsx
│   │       └── [15+ other outputs]
│   ├── resume/            # Resume section components
│   │   ├── ResumeHeader.tsx
│   │   ├── ResumeExperience.tsx
│   │   └── [other resume sections]
│   └── ui/                # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── scroll-area.tsx
│       └── [other UI primitives]
├── data/
│   ├── portfolio-main-data.json    # Portfolio content
│   └── ascii-art-strings.ts        # ASCII art
├── hooks/                 # Global hooks
└── lib/
    └── utils.ts          # Utility functions
```

**Key Patterns:**
- **Component Structure:** Functional components with TypeScript
- **Styling:** Tailwind utility classes + CSS custom properties for theming
- **State Management:** React hooks (useState, useEffect, useRef)
- **File Naming:** PascalCase for components, camelCase for utilities
- **Import Aliases:** `@/` maps to `./src/`

**Code Style (Detected):**
- **TypeScript:** Strict mode, explicit types
- **Quotes:** Double quotes for strings
- **Semicolons:** Not used (Next.js default)
- **Indentation:** 2 spaces
- **Line Length:** ~100-120 characters
- **Exports:** Named exports for components, default for pages

**Theme System:**
- 6 themes: dark (default), light, sepia, monokai, github, solarized-dark
- CSS custom properties in `:root` and theme classes
- Semantic color tokens: primary, accent, destructive, muted, etc.

---

## The Change

### Problem Statement

The CLI portfolio currently has a **strong UX foundation** (4/5 rating) but has several friction points that prevent it from being exceptional:

**Discoverability Issues:**
- New users don't know what commands are available
- No autocomplete or command suggestions
- Hidden keyboard shortcuts (Ctrl+C, arrow keys, Tab)
- Easter eggs are undiscoverable

**Mobile Experience Gaps:**
- Keyboard-heavy interaction is cumbersome on touch devices
- No touch-friendly command palette
- Small touch targets in modals
- Suboptimal responsive behavior on very small screens

**Accessibility Limitations:**
- No screen reader announcements for command output
- Modal focus management could be improved
- Missing ARIA live regions
- No keyboard navigation documentation

**Missing Polish:**
- No loading states for async commands (resume, modals)
- No visual feedback for success/warnings
- Command history doesn't persist across sessions
- No progress tracking for easter egg achievements

### Proposed Solution

Implement **4 phases of UX enhancements** to elevate the portfolio from "strong" to "exceptional":

**Phase 1: Quick Wins (P0)** - Improve discoverability and user guidance
- Tab autocomplete for commands
- Fuzzy matching command suggestions on errors
- Enhanced welcome message with first-time user tutorial
- Keyboard shortcuts command
- Command history persistence

**Phase 2: Mobile Experience (P0)** - Make portfolio touch-friendly
- Floating action button with mobile command palette
- Touch-optimized interactions (44x44px targets)
- Responsive refinements for small screens

**Phase 3: Polish & Accessibility (P1)** - Achieve WCAG AA compliance
- Modal focus trap and keyboard navigation
- ARIA live regions for screen readers
- Loading states for async operations
- Success/warning color system

**Phase 4: Advanced Features (P2)** - Add delight and engagement
- Easter egg achievements system
- Typing animations for output
- Resume section toggles
- Alias discoverability in help
- Quick resume download command

### Scope

**In Scope:**

✅ All 17 features across 4 phases (see Enhancement Backlog below)  
✅ Maintain existing CLI aesthetic and theme system  
✅ Preserve all current functionality  
✅ Ensure backward compatibility  
✅ Mobile-first responsive design  
✅ WCAG AA accessibility compliance  
✅ Performance optimization (memoization, lazy loading)  
✅ localStorage for persistence (history, achievements, preferences)  
✅ Code examples and implementation guidance

**Out of Scope:**

❌ Backend/API changes (static site only)  
❌ Authentication or user accounts  
❌ Analytics integration  
❌ Content management system  
❌ Redesigning existing components (only enhancing)  
❌ Changing tech stack or major dependencies  
❌ Test framework setup (can be added later)  
❌ CI/CD pipeline changes  
❌ SEO optimization (separate effort)

---

## Enhancement Backlog

### Phase 1: Quick Wins (Priority: P0) 🔥

**Epic Goal:** Improve command discoverability and user guidance  
**Expected Impact:** +40% user engagement, 80% reduction in typos  
**Status:** 🔴 Not Started

#### Story 1.1: Tab Autocomplete
**As a** user  
**I want to** press Tab to autocomplete commands  
**So that** I don't have to type them fully and avoid typos

**Acceptance Criteria:**
- [ ] Tab key triggers autocomplete in terminal input
- [ ] Single match: auto-completes the command immediately
- [ ] Multiple matches: displays all matching commands in output
- [ ] Works with partial command input (e.g., "he" → "help")
- [ ] Easter egg triggered on first autocomplete use
- [ ] Autocomplete respects command aliases

**Technical Implementation:**
- File: `src/components/cli/TerminalInterface.tsx`
- Add Tab handler in `handleKeyDown` function
- Create `availableCommands` array with all commands + aliases
- Filter matches using `startsWith()` on lowercase input
- If 1 match: `setInputValue(match)`
- If multiple: add system output line with matches
- Trigger `EASTER_EGG_IDS.AUTOCOMPLETE_USED`

---

#### Story 1.2: Command Suggestions on Error
**As a** user  
**I want to** see suggestions when I mistype a command  
**So that** I can quickly correct my mistake

**Acceptance Criteria:**
- [ ] Fuzzy matching algorithm (Levenshtein distance) implemented
- [ ] Show up to 3 suggestions with distance ≤ 2
- [ ] Display suggestions in accent color with "Did you mean:" prefix
- [ ] Suggestions sorted by similarity (closest first)
- [ ] Works for all commands and aliases
- [ ] Graceful fallback if no suggestions found

**Technical Implementation:**
- File: `src/components/cli/TerminalInterface.tsx`
- Implement Levenshtein distance function or use library
- In default case of `processCommand`, calculate distances
- Filter suggestions with distance ≤ 2
- Sort by distance, take top 3
- Return JSX with error message + suggestions in `<code>` tags

---

#### Story 1.3: Enhanced Welcome Message
**As a** first-time visitor  
**I want to** see guidance on how to use the terminal  
**So that** I know what to do and don't feel lost

**Acceptance Criteria:**
- [ ] Detect first visit using localStorage flag
- [ ] Show tutorial box with 4 key tips
- [ ] Tips include: help command, about command, Tab autocomplete, arrow keys
- [ ] Styled with accent border and subtle background (accent/5)
- [ ] Tutorial dismissible (doesn't show on subsequent visits)
- [ ] Responsive design (stacks on mobile)

**Technical Implementation:**
- File: `src/components/cli/outputs/WelcomeMessage.tsx`
- Add `isFirstVisit` prop (boolean)
- Check `localStorage.getItem('cli-visited')` in TerminalInterface
- If null: `isFirstVisit = true`, set flag
- Render tutorial box conditionally
- Use Tailwind classes: `border border-accent/30 rounded bg-accent/5 p-4`

---

#### Story 1.4: Keyboard Shortcuts Command
**As a** user  
**I want to** see all available keyboard shortcuts  
**So that** I can use the terminal more efficiently

**Acceptance Criteria:**
- [ ] New command: `shortcuts` or `keys` (both work)
- [ ] Display ASCII table with shortcut and action columns
- [ ] Include: Tab, ↑/↓, Ctrl+C, Esc
- [ ] Use existing `.table-ascii` styling from globals.css
- [ ] Clear, concise descriptions
- [ ] Responsive table layout

**Technical Implementation:**
- File: `src/components/cli/TerminalInterface.tsx`
- Add case for `shortcuts` and `keys` in `processCommand`
- Return JSX table with `.table-ascii`, `.th-ascii`, `.td-ascii` classes
- Shortcuts: Tab (autocomplete), ↑/↓ (history), Ctrl+C (clear), Esc (close modal)

---

#### Story 1.5: Command History Persistence
**As a** returning user  
**I want** my command history to persist across sessions  
**So that** I can reuse previous commands

**Acceptance Criteria:**
- [ ] Load history from localStorage on component mount
- [ ] Save history to localStorage on change
- [ ] Limit to 50 most recent commands
- [ ] Handle JSON parse errors gracefully (fallback to empty array)
- [ ] Preserve existing history navigation (↑/↓ arrows)
- [ ] Clear history option (optional enhancement)

**Technical Implementation:**
- File: `src/components/cli/TerminalInterface.tsx`
- Add `useEffect` to load on mount: `localStorage.getItem('cli-command-history')`
- Add `useEffect` to save on `commandHistory` change
- Wrap in try/catch for JSON parse errors
- Use existing `commandHistory` state

---

### Phase 2: Mobile Experience (Priority: P0) 📱

**Epic Goal:** Make portfolio touch-friendly and mobile-optimized  
**Expected Impact:** 10x mobile usability, 40% reduction in mobile bounce rate  
**Status:** 🔴 Not Started

#### Story 2.1: Mobile Command Palette
**As a** mobile user  
**I want** a touch-friendly way to execute commands  
**So that** I don't have to use the keyboard

**Acceptance Criteria:**
- [ ] FAB (Floating Action Button) visible only on mobile (md:hidden)
- [ ] Opens bottom sheet with command grid
- [ ] Shows 8-10 most common commands with icons
- [ ] Each button has icon, command name, and description
- [ ] Clicking button executes command and closes sheet
- [ ] Positioned bottom-right with z-50
- [ ] Smooth open/close animation

**Technical Implementation:**
- New file: `src/components/cli/MobileCommandPalette.tsx`
- Use shadcn Sheet component (already available)
- Create command list with icons (from lucide-react)
- Commands: help, about, resume, projects, contact, experience, skills, education
- Execute command via callback prop: `onCommandSelect(cmd: string)`
- Integrate in TerminalInterface.tsx

---

#### Story 2.2: Touch-Optimized Interactions
**As a** mobile user  
**I want** larger touch targets  
**So that** I can interact easily

**Acceptance Criteria:**
- [ ] Minimum touch target size: 44x44px (iOS/Android standard)
- [ ] Increase modal button sizes on mobile
- [ ] Add touch feedback (active states with opacity/scale)
- [ ] Improve scroll behavior on mobile (momentum scrolling)
- [ ] Test on real devices (iOS Safari, Chrome Mobile)

**Technical Implementation:**
- File: `src/app/globals.css`
- Add mobile-specific classes for buttons
- File: `src/components/cli/UniversalModal.tsx`
- Increase button padding on mobile: `p-3 md:p-2`
- Add active states: `active:opacity-80 active:scale-95`

---

#### Story 2.3: Responsive Refinements
**As a** mobile user  
**I want** the interface to adapt to my screen size  
**So that** content is readable and usable

**Acceptance Criteria:**
- [ ] Smaller font sizes on very small screens (< 640px)
- [ ] Tables scale appropriately (horizontal scroll if needed)
- [ ] Command prompt wraps better on narrow screens
- [ ] Reduced padding on mobile (p-2 vs p-4)
- [ ] Test on various screen sizes (320px to 768px)

**Technical Implementation:**
- File: `src/app/globals.css`
- Add media query for < 640px
- Reduce font sizes: `.cli-output-area { font-size: 0.75rem; }`
- Table scaling: `.table-ascii { font-size: 0.7rem; }`
- Ensure existing responsive classes work correctly

---

### Phase 3: Polish & Accessibility (Priority: P1) ♿

**Epic Goal:** Achieve WCAG AA compliance and polish user experience  
**Expected Impact:** Full accessibility, professional polish  
**Status:** 🔴 Not Started

#### Story 3.1: Modal Focus Management
**As a** keyboard user  
**I want** focus to be trapped in modals  
**So that** I can navigate efficiently

**Acceptance Criteria:**
- [ ] Focus trap implemented (Tab cycles through modal elements)
- [ ] Shift+Tab works in reverse
- [ ] Escape key closes modal
- [ ] Focus returns to trigger element on close
- [ ] First focusable element receives focus on open
- [ ] Works for both UniversalModal and ResumeModal

**Technical Implementation:**
- Files: `src/components/cli/UniversalModal.tsx`, `ResumeModal.tsx`
- Add focus management hooks
- Query focusable elements on mount
- Add keydown listeners for Tab, Shift+Tab, Esc
- Store previous focus element, restore on close

---

#### Story 3.2: ARIA Live Regions
**As a** screen reader user  
**I want** to hear command output  
**So that** I can use the terminal

**Acceptance Criteria:**
- [ ] ARIA live region with role="log"
- [ ] aria-live="polite" for non-urgent updates
- [ ] Announces latest command output
- [ ] Visually hidden but accessible to screen readers
- [ ] Test with VoiceOver (macOS) and NVDA (Windows)

**Technical Implementation:**
- File: `src/components/cli/TerminalInterface.tsx`
- Add div with `role="log" aria-live="polite" className="sr-only"`
- Display latest history item content
- Use Tailwind `sr-only` class (screen reader only)

---

#### Story 3.3: Loading States
**As a** user  
**I want** to see loading indicators  
**So that** I know the command is processing

**Acceptance Criteria:**
- [ ] Loading state for resume modal
- [ ] Loading state for presentation/project modals
- [ ] Animated spinner icon (rotate animation)
- [ ] "Loading..." message in terminal output
- [ ] 300ms delay before modal opens (smooth transition)

**Technical Implementation:**
- File: `src/components/cli/TerminalInterface.tsx`
- Add `loadingCommand` state: `useState<string | null>(null)`
- Before opening modal, set loading state and add output line
- Use setTimeout to delay modal open by 300ms
- Spinner: `<span className="animate-spin">⏳</span>`

---

#### Story 3.4: Success/Warning Colors
**As a** user  
**I want** clear visual feedback on command success/warnings  
**So that** I understand the system state

**Acceptance Criteria:**
- [ ] Add --success and --warning CSS variables to all themes
- [ ] Green for success messages (142 76% 36%)
- [ ] Orange for warning messages (38 92% 50%)
- [ ] Use in appropriate contexts (downloads, long operations)
- [ ] Maintain color contrast ratios (WCAG AA)

**Technical Implementation:**
- File: `src/app/globals.css`
- Add to `:root`, `.dark`, `.light`, `.sepia`, `.monokai`, `.github`, `.solarized-dark`
- Variables: `--success`, `--success-foreground`, `--warning`, `--warning-foreground`
- Use in components: `className="text-success"` or `className="text-warning"`

---

### Phase 4: Advanced Features (Priority: P2) 🌟

**Epic Goal:** Add delight and engagement features  
**Expected Impact:** Increased engagement, memorable experience  
**Status:** 🔴 Not Started

#### Story 4.1: Achievements System
**As a** user  
**I want** to see which easter eggs I've discovered  
**So that** I'm motivated to find them all

**Acceptance Criteria:**
- [ ] New `achievements` command
- [ ] Shows locked/unlocked status for all easter eggs
- [ ] Persists to localStorage
- [ ] Shows progress (X/10 unlocked)
- [ ] Visual indicators (✅ unlocked, 🔒 locked)
- [ ] Easter egg names and descriptions

**Technical Implementation:**
- File: `src/components/cli/hooks/useEasterEggs.ts`
- Extend hook to track unlocked eggs in localStorage
- File: `src/components/cli/TerminalInterface.tsx`
- Add `achievements` command case
- Display list of all easter eggs with lock status

---

#### Story 4.2: Typing Animations
**As a** user  
**I want** output to appear with a typing effect  
**So that** it feels more like a real terminal

**Acceptance Criteria:**
- [ ] Custom hook: useTypingAnimation
- [ ] Configurable speed (default 20ms per character)
- [ ] Optional - can be disabled
- [ ] Applied to select outputs (not all - would be annoying)
- [ ] Smooth character-by-character reveal

**Technical Implementation:**
- New file: `src/components/cli/hooks/useTypingAnimation.ts`
- Hook returns displayText state
- Use setInterval to reveal characters
- Apply selectively to WelcomeMessage or AboutOutput

---

#### Story 4.3: Resume Section Toggles
**As a** user  
**I want** to customize which resume sections to include  
**So that** I can create targeted resumes

**Acceptance Criteria:**
- [ ] Toggle buttons in modal header
- [ ] Sections: summary, experience, skills, education, certifications, projects, articles
- [ ] Active/inactive visual states
- [ ] Affects both display and PDF generation
- [ ] Persists selection to localStorage

**Technical Implementation:**
- File: `src/components/cli/ResumeModal.tsx`
- Add `visibleSections` state object
- Render toggle buttons in header
- Conditionally render sections based on state
- Save/load from localStorage

---

#### Story 4.4: Alias Discoverability
**As a** user  
**I want** to see command aliases  
**So that** I can use shortcuts

**Acceptance Criteria:**
- [ ] Add "Aliases" column to help table
- [ ] Show all aliases for each command
- [ ] Muted text styling for aliases
- [ ] Update HelpOutput component
- [ ] Include in keyboard shortcuts documentation

**Technical Implementation:**
- File: `src/components/cli/outputs/HelpOutput.tsx`
- Add third column to table
- Map commands to aliases: experience → xp, education → edu, etc.
- Style with `text-muted-foreground text-xs`

---

#### Story 4.5: Quick Resume Command
**As a** recruiter  
**I want** to quickly download the resume PDF  
**So that** I don't have to open the modal

**Acceptance Criteria:**
- [ ] New command: `quick-resume` or `download-resume`
- [ ] Triggers PDF download directly
- [ ] Shows loading message
- [ ] Success/error feedback
- [ ] Uses same PDF generation logic as ResumeModal

**Technical Implementation:**
- New file: `src/lib/resumeUtils.ts`
- Extract PDF generation logic from ResumeModal
- File: `src/components/cli/TerminalInterface.tsx`
- Add command case, call utility function
- Show loading state, then success/error message

---

## Implementation Details

### Source Tree Changes

**New Files to Create:**
```
src/components/cli/MobileCommandPalette.tsx          [CREATE]
src/components/cli/hooks/useTypingAnimation.ts       [CREATE]
src/lib/resumeUtils.ts                               [CREATE]
```

**Files to Modify:**
```
src/components/cli/TerminalInterface.tsx             [MODIFY] - Primary changes
src/components/cli/outputs/WelcomeMessage.tsx        [MODIFY] - Add tutorial
src/components/cli/outputs/HelpOutput.tsx            [MODIFY] - Add aliases column
src/components/cli/UniversalModal.tsx                [MODIFY] - Focus management
src/components/cli/ResumeModal.tsx                   [MODIFY] - Section toggles
src/components/cli/hooks/useEasterEggs.ts            [MODIFY] - Achievements tracking
src/app/globals.css                                  [MODIFY] - Colors, responsive
```

### Technical Approach

**Autocomplete & Suggestions:**
- Use array filtering with `startsWith()` for autocomplete
- Implement Levenshtein distance algorithm for fuzzy matching
- Alternative: Use library like `fuzzysort` or `fuse.js` (if adding dependencies is acceptable)

**Mobile Command Palette:**
- Leverage existing shadcn Sheet component
- Use lucide-react icons for visual appeal
- Grid layout with `grid-cols-2` on mobile

**Persistence Strategy:**
- localStorage for all client-side persistence
- Keys: `cli-visited`, `cli-command-history`, `cli-achievements`, `cli-resume-sections`
- Always wrap in try/catch for JSON parse errors

**Accessibility:**
- Follow WCAG 2.1 AA guidelines
- Use semantic HTML and ARIA attributes
- Test with screen readers (VoiceOver, NVDA)
- Ensure keyboard navigation works everywhere

**Performance:**
- Memoize expensive components with `React.memo()`
- Debounce scroll events (100ms)
- Lazy load PDF generation libraries (already done)
- Virtualize command history if > 100 items (future optimization)

### Existing Patterns to Follow

**Component Structure:**
```typescript
"use client"

import { ... } from "react"
import { ... } from "@/components/ui/..."

interface ComponentProps {
  // Props with explicit types
}

export default function Component({ props }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState(...)
  
  // Event handlers
  const handleEvent = () => { ... }
  
  // Return JSX
  return (
    <div className="...">
      {/* Content */}
    </div>
  )
}
```

**Styling Patterns:**
- Use Tailwind utility classes
- Responsive: `text-sm md:text-base`
- Theme colors: `text-accent`, `bg-background`, `border-border`
- Conditional: `className={condition ? "class-a" : "class-b"}`

**State Management:**
- React hooks (useState, useEffect, useRef)
- No external state management library
- Props drilling for simple cases
- Context for theme (already implemented)

**Error Handling:**
- Try/catch for localStorage operations
- Graceful fallbacks for missing data
- Console.error for debugging (not user-facing)

### Integration Points

**Internal Dependencies:**
- `@/components/ui/*` - shadcn/ui components
- `@/data/portfolio-main-data.json` - Portfolio content
- `@/components/cli/hooks/*` - Custom hooks
- `@/lib/utils` - Utility functions (cn, etc.)

**External APIs:**
- None (static site)

**Browser APIs:**
- localStorage - Persistence
- window.print() - Resume printing
- KeyboardEvent - Keyboard shortcuts
- IntersectionObserver - Scroll behavior (if needed)

**State Dependencies:**
- Command history state → localStorage sync
- Modal open state → Focus management
- Theme state → Already managed by useCliTheme

---

## Development Context

### Relevant Existing Code

**Key Files to Review:**

1. **TerminalInterface.tsx (lines 95-201)** - `processCommand` function
   - This is where all command logic lives
   - Add new commands here

2. **TerminalInterface.tsx (lines 283-312)** - `handleKeyDown` function
   - Keyboard event handling
   - Add Tab autocomplete here

3. **globals.css (lines 11-226)** - Theme definitions
   - All theme color variables
   - Add success/warning colors here

4. **UniversalModal.tsx** - Modal component structure
   - Understand modal props and behavior
   - Add focus management here

5. **useEasterEggs.ts** - Easter egg tracking
   - Extend for achievements system

### Dependencies

**Framework/Libraries (Already Installed):**
- Next.js 15.2.3
- React 18.3.1
- TypeScript 5.x
- Tailwind CSS 3.4.1
- @radix-ui/react-dialog 1.1.6
- @radix-ui/react-scroll-area 1.2.3
- lucide-react 0.475.0
- jspdf 3.0.2
- html2canvas 1.4.1

**No New Dependencies Required** for Phases 1-3

**Optional for Phase 4:**
- Fuzzy matching library (if not implementing Levenshtein manually)

**Internal Modules:**
- `@/components/ui/button`
- `@/components/ui/dialog`
- `@/components/ui/scroll-area`
- `@/components/ui/sheet` (for mobile palette)
- `@/lib/utils` (cn function)

### Configuration Changes

**No configuration file changes required**

**localStorage Keys to Add:**
- `cli-visited` - First visit flag (boolean)
- `cli-command-history` - Command history (string array)
- `cli-achievements` - Unlocked easter eggs (string array)
- `cli-resume-sections` - Visible resume sections (object)

**CSS Custom Properties to Add:**
```css
--success: 142 76% 36%;
--success-foreground: 0 0% 98%;
--warning: 38 92% 50%;
--warning-foreground: 0 0% 98%;
```

### Existing Conventions (Brownfield)

**Code Style:**
- TypeScript strict mode
- Functional components with hooks
- Double quotes for strings
- No semicolons
- 2-space indentation
- PascalCase for components
- camelCase for functions/variables

**File Organization:**
- Components in `src/components/`
- Hooks in `hooks/` subdirectories
- Utilities in `src/lib/`
- Data in `src/data/`

**Import Order:**
1. React imports
2. Third-party libraries
3. Internal components (@/components)
4. Internal utilities (@/lib)
5. Types/interfaces
6. Styles (if any)

**Testing:**
- No test framework currently
- Recommendation: Add Vitest for future testing
- Manual testing on multiple browsers/devices

---

## Implementation Stack

**Complete Technology Stack:**

```yaml
Runtime:
  - Node.js: 20.x
  - Browser: Modern (Chrome, Firefox, Safari, Edge)

Framework:
  - Next.js: 15.2.3
  - React: 18.3.1
  - TypeScript: 5.x

UI Framework:
  - Tailwind CSS: 3.4.1
  - shadcn/ui: Latest (Radix UI components)
  - lucide-react: 0.475.0

State Management:
  - React Hooks: useState, useEffect, useRef, useContext
  - @tanstack/react-query: 5.66.0 (available but not used in CLI)

Utilities:
  - clsx: 2.1.1
  - tailwind-merge: 3.0.1
  - class-variance-authority: 0.7.1
  - date-fns: 3.6.0

PDF Generation:
  - jspdf: 3.0.2
  - html2canvas: 1.4.1

Build Tools:
  - Next.js Compiler: Built-in
  - Turbopack: Dev mode
  - TypeScript Compiler: 5.x
  - PostCSS: 8.x

Development:
  - Dev Server: next dev --turbopack -p 9002
  - Linting: next lint
  - Type Checking: tsc --noEmit

Testing:
  - None currently
  - Recommendation: Vitest or Jest + React Testing Library
```

---

## Technical Details

**Levenshtein Distance Algorithm:**
```typescript
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[b.length][a.length]
}
```

**Focus Trap Implementation:**
```typescript
const focusableElements = modalRef.current?.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
)

const firstElement = focusableElements?.[0] as HTMLElement
const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement

const handleTab = (e: KeyboardEvent) => {
  if (e.key !== 'Tab') return
  
  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      e.preventDefault()
      lastElement?.focus()
    }
  } else {
    if (document.activeElement === lastElement) {
      e.preventDefault()
      firstElement?.focus()
    }
  }
}
```

**localStorage Persistence Pattern:**
```typescript
// Load
useEffect(() => {
  try {
    const saved = localStorage.getItem('key')
    if (saved) {
      setState(JSON.parse(saved))
    }
  } catch (e) {
    console.error('Failed to load from localStorage', e)
  }
}, [])

// Save
useEffect(() => {
  try {
    localStorage.setItem('key', JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save to localStorage', e)
  }
}, [state])
```

**Performance Considerations:**
- Memoize command list generation
- Debounce scroll events
- Lazy load PDF libraries (already done)
- Use React.memo for expensive output components
- Virtualize history if > 100 items (future)

**Security Considerations:**
- No user input sanitization needed (static site)
- localStorage is client-side only
- No XSS risk (React escapes by default)
- No CSRF risk (no server-side state)

---

## Development Setup

**Prerequisites:**
- Node.js 20.x or higher
- npm or yarn package manager
- Git for version control

**Setup Steps:**
```bash
# 1. Clone repository (if not already)
git clone <repo-url>
cd tasostilsi.github.io

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# Server runs on http://localhost:9002

# 4. Type checking (optional)
npm run typecheck

# 5. Linting (optional)
npm run lint
```

**Development Workflow:**
1. Create feature branch: `git checkout -b feature/ux-enhancements-phase-1`
2. Make changes
3. Test locally on http://localhost:9002
4. Test on mobile devices (use ngrok or local network)
5. Commit changes: `git commit -m "feat: add tab autocomplete"`
6. Push and create PR

**Build for Production:**
```bash
npm run build
# Static export to ./out directory

# Serve locally to test
npm run serve
```

---

## Implementation Guide

### Setup Steps

**Before Starting Development:**

1. ✅ **Review Existing Code**
   - Read `TerminalInterface.tsx` completely
   - Understand `processCommand` function
   - Review theme system in `globals.css`
   - Check existing hooks in `hooks/` directories

2. ✅ **Set Up Development Environment**
   - Ensure Node.js 20.x installed
   - Run `npm install`
   - Start dev server: `npm run dev`
   - Open http://localhost:9002

3. ✅ **Create Feature Branch**
   - `git checkout -b feature/ux-enhancements`
   - Or separate branches per phase

4. ✅ **Test Mobile Setup**
   - Use browser dev tools (responsive mode)
   - Test on real devices if available
   - Use ngrok for remote testing

### Implementation Steps

**Recommended Implementation Order:**

**Sprint 1: Phase 1 - Quick Wins**
1. Story 1.1: Tab Autocomplete (easiest, high impact)
2. Story 1.2: Command Suggestions (builds on autocomplete)
3. Story 1.5: Command History Persistence (simple localStorage)
4. Story 1.4: Keyboard Shortcuts Command (simple output)
5. Story 1.3: Enhanced Welcome Message (requires design)

**Sprint 2: Phase 2 - Mobile Experience**
1. Story 2.3: Responsive Refinements (CSS only)
2. Story 2.2: Touch-Optimized Interactions (CSS + minor JS)
3. Story 2.1: Mobile Command Palette (new component)

**Sprint 3: Phase 3 - Polish & Accessibility**
1. Story 3.4: Success/Warning Colors (CSS only)
2. Story 3.3: Loading States (simple state management)
3. Story 3.2: ARIA Live Regions (accessibility)
4. Story 3.1: Modal Focus Management (complex)

**Sprint 4: Phase 4 - Advanced Features**
1. Story 4.4: Alias Discoverability (simple table update)
2. Story 4.1: Achievements System (localStorage + UI)
3. Story 4.5: Quick Resume Command (extract utility)
4. Story 4.3: Resume Section Toggles (state management)
5. Story 4.2: Typing Animations (custom hook)

### Testing Strategy

**Manual Testing Checklist:**

**Phase 1:**
- [ ] Tab autocomplete works with partial input
- [ ] Multiple matches display correctly
- [ ] Command suggestions appear on typos
- [ ] Welcome tutorial shows on first visit only
- [ ] Keyboard shortcuts command displays table
- [ ] Command history persists across page reloads

**Phase 2:**
- [ ] Mobile command palette opens/closes smoothly
- [ ] Touch targets are 44x44px minimum
- [ ] Responsive design works on 320px to 768px screens
- [ ] Test on iOS Safari and Chrome Mobile

**Phase 3:**
- [ ] Focus trap works in modals (Tab, Shift+Tab)
- [ ] Escape closes modals
- [ ] Screen reader announces command output
- [ ] Loading states appear for async commands
- [ ] Success/warning colors display correctly

**Phase 4:**
- [ ] Achievements track and persist
- [ ] Typing animations are smooth
- [ ] Resume toggles affect display and PDF
- [ ] Aliases show in help output
- [ ] Quick resume downloads PDF

**Accessibility Testing:**
- [ ] Test with VoiceOver (macOS)
- [ ] Test with NVDA (Windows)
- [ ] Keyboard navigation works everywhere
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators are visible

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Chrome Mobile

### Acceptance Criteria

**Phase 1 Complete When:**
- ✅ All 5 stories implemented and tested
- ✅ Tab autocomplete reduces typos by 80%
- ✅ First-time users see tutorial
- ✅ Command history persists across sessions
- ✅ No regressions in existing functionality

**Phase 2 Complete When:**
- ✅ All 3 stories implemented and tested
- ✅ Mobile command palette works on touch devices
- ✅ Touch targets meet 44x44px standard
- ✅ Responsive design works on all screen sizes
- ✅ Mobile bounce rate reduced by 40%

**Phase 3 Complete When:**
- ✅ All 4 stories implemented and tested
- ✅ WCAG AA compliance achieved
- ✅ Screen readers work correctly
- ✅ Modal focus management is flawless
- ✅ Loading states provide clear feedback

**Phase 4 Complete When:**
- ✅ All 5 stories implemented and tested
- ✅ Achievements system tracks easter eggs
- ✅ Typing animations add polish
- ✅ Resume customization works
- ✅ User engagement increases by 40%

---

## Developer Resources

### File Paths Reference

**Primary Files:**
```
src/components/cli/TerminalInterface.tsx              [MAIN]
src/components/cli/outputs/WelcomeMessage.tsx         [Phase 1]
src/components/cli/outputs/HelpOutput.tsx             [Phase 1, 4]
src/components/cli/MobileCommandPalette.tsx           [Phase 2 - NEW]
src/components/cli/UniversalModal.tsx                 [Phase 2, 3]
src/components/cli/ResumeModal.tsx                    [Phase 3, 4]
src/components/cli/hooks/useEasterEggs.ts             [Phase 4]
src/components/cli/hooks/useTypingAnimation.ts        [Phase 4 - NEW]
src/lib/resumeUtils.ts                                [Phase 4 - NEW]
src/app/globals.css                                   [Phase 2, 3]
```

**Supporting Files:**
```
src/components/ui/sheet.tsx                           [Phase 2]
src/components/ui/button.tsx                          [All phases]
src/components/ui/dialog.tsx                          [Phase 3]
src/data/portfolio-main-data.json                     [Reference]
```

### Key Code Locations

**Command Processing:**
- `TerminalInterface.tsx:95-201` - `processCommand` function
- Add new commands in switch statement

**Keyboard Handling:**
- `TerminalInterface.tsx:283-312` - `handleKeyDown` function
- Add Tab autocomplete here

**Theme System:**
- `globals.css:11-226` - All theme definitions
- Add success/warning colors here

**Modal Components:**
- `UniversalModal.tsx:54-105` - Modal structure
- `ResumeModal.tsx:128-173` - Resume modal

**Easter Eggs:**
- `useEasterEggs.ts` - Easter egg tracking hook

### Testing Locations

**No test framework currently configured**

**Recommended Structure:**
```
tests/
├── components/
│   ├── TerminalInterface.test.tsx
│   ├── MobileCommandPalette.test.tsx
│   └── UniversalModal.test.tsx
├── hooks/
│   ├── useEasterEggs.test.ts
│   └── useTypingAnimation.test.ts
└── lib/
    └── resumeUtils.test.ts
```

**Test Framework Recommendation:**
- Vitest (faster, better DX than Jest)
- React Testing Library
- @testing-library/user-event

### Documentation to Update

**After Implementation:**

1. **README.md**
   - Add "Features" section with new enhancements
   - Update "Development" section if needed

2. **CHANGELOG.md** (create if doesn't exist)
   - Document all new features by phase
   - Version: 1.1.0 (minor version bump)

3. **docs/ux-enhancement-plan.md**
   - Update progress dashboard
   - Mark completed stories

4. **Code Comments**
   - Add JSDoc comments for new functions
   - Document complex algorithms (Levenshtein)

---

## UX/UI Considerations

**This change significantly affects UI/UX:**

### UI Components Affected

**New Components:**
- MobileCommandPalette - Floating action button + bottom sheet
- Tutorial box in WelcomeMessage
- Achievements display
- Resume section toggles

**Modified Components:**
- TerminalInterface - Autocomplete, suggestions, loading states
- UniversalModal - Focus management
- ResumeModal - Section toggles
- HelpOutput - Aliases column
- All themes - Success/warning colors

### UX Flow Changes

**Current Flow:**
1. User lands → sees terminal
2. Types command → gets output
3. May not know what commands exist

**New Flow:**
1. User lands → sees terminal + tutorial (first time)
2. Types partial command → Tab autocompletes
3. Mistypes → sees suggestions
4. Mobile: Taps FAB → sees command palette
5. Discovers features naturally

### Visual/Interaction Patterns

**Design System:**
- Follow existing CLI aesthetic
- Use existing theme colors + new success/warning
- Maintain monospace font throughout
- Keep terminal-style interactions

**New Patterns:**
- Tutorial box: accent border, subtle background
- Loading states: spinner + message
- Success: green text
- Warning: orange text
- Mobile FAB: bottom-right, z-50

**Responsive Design:**
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Touch targets: 44x44px minimum
- Font scaling: 0.75rem (mobile) to 0.875rem (desktop)

### Accessibility

**WCAG AA Compliance:**
- Color contrast: 4.5:1 for text
- Keyboard navigation: 100% functional
- Screen reader: Full support
- Focus indicators: Visible and clear

**Keyboard Navigation:**
- Tab: Autocomplete
- ↑/↓: Command history
- Ctrl+C: Clear input
- Esc: Close modals
- Tab/Shift+Tab: Navigate modals

**ARIA Attributes:**
- `role="log"` for command output
- `aria-live="polite"` for announcements
- `aria-label` for input field
- `aria-hidden` for decorative elements

**Screen Reader Support:**
- Command output announced
- Modal state changes announced
- Loading states announced
- Error messages announced

### User Feedback

**Loading States:**
- Spinner icon (⏳ with rotate animation)
- "Loading..." message
- 300ms delay for smooth transition

**Error Messages:**
- Red text (destructive color)
- "Command not found" + suggestions
- Clear, actionable feedback

**Success Confirmations:**
- Green text (success color)
- "✓ Downloaded successfully"
- "✓ Achievement unlocked"

**Progress Indicators:**
- Achievements: X/10 unlocked
- Progress bar for long operations (future)

---

## Testing Approach

**Comprehensive Testing Strategy:**

### Unit Testing (Recommended - Not Currently Implemented)

**Test Framework:** Vitest + React Testing Library

**Components to Test:**
- `TerminalInterface` - Command processing, keyboard handling
- `MobileCommandPalette` - Command selection, sheet behavior
- `UniversalModal` - Focus trap, keyboard navigation
- `useEasterEggs` - Achievement tracking
- `useTypingAnimation` - Animation behavior

**Example Test:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import TerminalInterface from './TerminalInterface'

describe('TerminalInterface', () => {
  it('autocompletes command on Tab press', () => {
    render(<TerminalInterface />)
    const input = screen.getByLabelText('Terminal input')
    
    fireEvent.change(input, { target: { value: 'he' } })
    fireEvent.keyDown(input, { key: 'Tab' })
    
    expect(input.value).toBe('help')
  })
})
```

### Integration Testing

**User Flows to Test:**
1. First-time user sees tutorial → types command → gets output
2. User types partial command → Tab autocompletes → executes
3. User mistypes → sees suggestions → corrects → executes
4. Mobile user taps FAB → selects command → command executes
5. User opens modal → Tab navigates → Esc closes

### E2E Testing (Manual)

**Critical Paths:**
1. Complete command flow (type → autocomplete → execute)
2. Mobile command palette flow (tap FAB → select → execute)
3. Resume download flow (command → loading → PDF)
4. Achievements flow (trigger easter egg → check achievements)

### Accessibility Testing

**Tools:**
- axe DevTools (browser extension)
- WAVE (browser extension)
- Lighthouse (Chrome DevTools)

**Manual Testing:**
- VoiceOver (macOS): Cmd+F5
- NVDA (Windows): Free download
- Keyboard only: Unplug mouse, navigate

**Checklist:**
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Color contrast meets 4.5:1
- [ ] Screen reader announces all content
- [ ] No keyboard traps (except intentional modal trap)

### Performance Testing

**Metrics to Track:**
- Time to Interactive (TTI): < 2s
- First Contentful Paint (FCP): < 1s
- Command Response Time: < 100ms
- Modal Open Time: < 300ms

**Tools:**
- Lighthouse (Chrome DevTools)
- WebPageTest
- Chrome Performance tab

### Browser/Device Testing

**Desktop Browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Mobile Devices:**
- iOS Safari (iPhone)
- Chrome Mobile (Android)
- Various screen sizes (320px to 768px)

**Testing Checklist:**
- [ ] All features work on all browsers
- [ ] Responsive design works on all screen sizes
- [ ] Touch interactions work on mobile
- [ ] No console errors
- [ ] No visual glitches

---

## Deployment Strategy

### Deployment Steps

**Current Deployment Process:**
```bash
# 1. Build static export
npm run build

# 2. Output to ./out directory
# 3. Deploy ./out to hosting (GitHub Pages, Netlify, Vercel, etc.)

# 4. Verify deployment
# Visit production URL and test
```

**Recommended CI/CD:**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - run: npm run typecheck
      - run: npm run lint
      # Deploy ./out to hosting
```

### Rollback Plan

**If Issues Occur:**

1. **Identify Issue:**
   - Check browser console for errors
   - Review user reports
   - Check analytics for drop in engagement

2. **Quick Fix:**
   - If minor: Fix and redeploy
   - If major: Proceed to rollback

3. **Rollback Steps:**
   ```bash
   # Revert to previous commit
   git revert <commit-hash>
   
   # Or reset to previous version
   git reset --hard <previous-commit>
   
   # Rebuild and redeploy
   npm run build
   # Deploy ./out
   ```

4. **Verify Rollback:**
   - Test production site
   - Confirm issue resolved
   - Monitor analytics

### Monitoring

**What to Monitor After Deployment:**

**User Engagement:**
- Commands per session (target: +50%)
- Session duration (target: +30%)
- Bounce rate (target: -20%)
- Return visitor rate (target: +25%)

**Mobile Metrics:**
- Mobile bounce rate (target: -40%)
- Mobile commands per session (target: +200%)
- Touch success rate (target: 95%+)

**Performance:**
- Time to Interactive (< 2s)
- First Contentful Paint (< 1s)
- Command response time (< 100ms)

**Errors:**
- JavaScript errors in console
- Failed localStorage operations
- PDF generation failures

**Tools:**
- Google Analytics (if configured)
- Browser console (manual checks)
- User feedback

**Success Criteria:**
- No increase in error rate
- Engagement metrics improve
- No performance degradation
- Positive user feedback

---

## Next Steps

### For BA (Business Analyst) Agent

**Your Tasks:**
1. ✅ Review this tech-spec for completeness
2. ✅ Break down each story into detailed sub-tasks
3. ✅ Create acceptance test scenarios
4. ✅ Define edge cases and error scenarios
5. ✅ Prepare story handoff document for dev agent
6. ✅ Create traceability matrix (UX plan → Tech spec → Stories)

**Deliverables:**
- Detailed user stories with sub-tasks
- Acceptance test scenarios
- Edge case documentation
- Story handoff document

### For Dev Agent

**Your Tasks:**
1. Review tech-spec and story breakdown
2. Implement stories in priority order
3. Follow existing code patterns
4. Test each story against acceptance criteria
5. Update progress dashboard
6. Document any deviations or issues

**Implementation Order:**
- Sprint 1: Phase 1 (Quick Wins)
- Sprint 2: Phase 2 (Mobile Experience)
- Sprint 3: Phase 3 (Polish & Accessibility)
- Sprint 4: Phase 4 (Advanced Features)

---

## Appendix

### Glossary

- **CLI:** Command Line Interface
- **FAB:** Floating Action Button
- **WCAG:** Web Content Accessibility Guidelines
- **ARIA:** Accessible Rich Internet Applications
- **TTI:** Time to Interactive
- **FCP:** First Contentful Paint
- **P0/P1/P2:** Priority levels (0 = highest)

### References

- [UX Enhancement Plan](./ux-enhancement-plan.md)
- [UX Validation Report](../.gemini/antigravity/brain/f1bf8aac-7d5b-4545-9f53-a320761f5e1d/ux-validation-report.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-23 | Tasos (PM) | Initial tech-spec creation |

---

**Document Status:** ✅ Ready for BA Analysis  
**Next Action:** BA agent to break down stories and create handoff document for dev agent  
**Estimated Total Effort:** 10-15 hours across 4 sprints  
**Expected Completion:** 4 weeks (1 sprint per phase)
