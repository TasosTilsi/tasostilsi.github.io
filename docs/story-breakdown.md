# Story Breakdown - CLI Portfolio UX Enhancements
**Business Analyst:** Mary  
**Date:** November 23, 2025  
**Source:** [Tech Spec](./tech-spec.md)  
**Status:** Ready for Development

---

## 📊 Overview

This document provides detailed breakdowns for all 17 user stories across 4 phases. Each story includes:
- Detailed sub-tasks
- Acceptance test scenarios  
- Edge cases & error handling
- Dependencies
- Definition of Done

---

## Phase 1: Quick Wins (P0) 🔥

### Story 1.1: Tab Autocomplete

**Story:** As a user, I want to press Tab to autocomplete commands so I don't have to type them fully

**Sub-Tasks:**
1. Create `availableCommands` array with all commands and aliases
2. Add Tab key handler in `handleKeyDown` function
3. Implement single-match autocomplete logic
4. Implement multiple-match display logic
5. Add easter egg trigger for first use
6. Test with all commands and aliases

**Acceptance Test Scenarios:**
```gherkin
Scenario: Single match autocomplete
  Given I type "he" in the terminal
  When I press Tab
  Then the input should complete to "help"

Scenario: Multiple matches display
  Given I type "e" in the terminal  
  When I press Tab
  Then I should see: "experience education echo"

Scenario: No match
  Given I type "xyz" in the terminal
  When I press Tab
  Then nothing should happen

Scenario: Full command
  Given I type "help" in the terminal
  When I press Tab
  Then nothing should happen (already complete)
```

**Edge Cases:**
- Empty input + Tab → show all commands
- Whitespace + Tab → no action
- Case insensitive matching (HE → help)
- Alias autocomplete (xp → experience)

**Dependencies:** None

**Definition of Done:**
- [ ] Tab autocomplete works for all commands
- [ ] Multiple matches display correctly
- [ ] Easter egg triggers on first use
- [ ] No console errors
- [ ] Works on all browsers

---

### Story 1.2: Command Suggestions on Error

**Story:** As a user, I want to see suggestions when I mistype a command so I can quickly correct my mistake

**Sub-Tasks:**
1. Implement Levenshtein distance function
2. Create suggestion logic in default case of `processCommand`
3. Filter suggestions (distance ≤ 2, max 3)
4. Format suggestions with "Did you mean:" prefix
5. Style suggestions in accent color
6. Test with various typos

**Acceptance Test Scenarios:**
```gherkin
Scenario: Close typo
  Given I type "hlep" in the terminal
  When I press Enter
  Then I should see "Did you mean: help"

Scenario: Multiple suggestions
  Given I type "experiance" in the terminal
  When I press Enter  
  Then I should see up to 3 suggestions

Scenario: No close matches
  Given I type "qwerty" in the terminal
  When I press Enter
  Then I should see "Command not found" without suggestions
```

**Edge Cases:**
- Distance = 0 → exact match, execute command
- Distance = 1 → very close, suggest
- Distance > 2 → no suggestions
- Multiple commands with same distance → show all

**Dependencies:** None

**Definition of Done:**
- [ ] Levenshtein algorithm works correctly
- [ ] Suggestions appear for typos
- [ ] Max 3 suggestions shown
- [ ] Styled in accent color
- [ ] No performance issues

---

### Story 1.3: Enhanced Welcome Message

**Story:** As a first-time visitor, I want to see guidance on how to use the terminal so I know what to do

**Sub-Tasks:**
1. Add `isFirstVisit` detection using localStorage
2. Update WelcomeMessage component with tutorial box
3. Create 4-tip tutorial content
4. Style tutorial with accent border and background
5. Ensure responsive design
6. Test first visit vs returning visit

**Acceptance Test Scenarios:**
```gherkin
Scenario: First visit
  Given I visit the site for the first time
  Then I should see the welcome message with tutorial box
  And the tutorial should have 4 tips

Scenario: Returning visit
  Given I have visited the site before
  Then I should see the welcome message without tutorial

Scenario: Tutorial content
  Given I see the tutorial
  Then it should mention: help, about, Tab, arrow keys
```

**Edge Cases:**
- localStorage disabled → always show tutorial
- localStorage cleared → show tutorial again
- Mobile view → tutorial stacks vertically

**Dependencies:** None

**Definition of Done:**
- [ ] Tutorial shows on first visit only
- [ ] 4 tips are clear and helpful
- [ ] Styled correctly (accent border, subtle bg)
- [ ] Responsive on mobile
- [ ] localStorage flag works

---

### Story 1.4: Keyboard Shortcuts Command

**Story:** As a user, I want to see all available keyboard shortcuts so I can use the terminal more efficiently

**Sub-Tasks:**
1. Add `shortcuts` and `keys` command cases
2. Create ASCII table with shortcuts
3. Document: Tab, ↑/↓, Ctrl+C, Esc
4. Apply `.table-ascii` styling
5. Test table rendering
6. Ensure responsive table layout

**Acceptance Test Scenarios:**
```gherkin
Scenario: View shortcuts
  Given I type "shortcuts" in the terminal
  When I press Enter
  Then I should see a table with 4 shortcuts

Scenario: Alias works
  Given I type "keys" in the terminal
  When I press Enter
  Then I should see the same shortcuts table

Scenario: Table format
  Given I view the shortcuts table
  Then it should have columns: Shortcut, Action
  And it should use ASCII table styling
```

**Edge Cases:**
- Long descriptions wrap correctly
- Mobile: table scrolls horizontally if needed

**Dependencies:** None

**Definition of Done:**
- [ ] Both `shortcuts` and `keys` work
- [ ] Table displays all 4 shortcuts
- [ ] ASCII styling applied
- [ ] Descriptions are clear
- [ ] Responsive layout

---

### Story 1.5: Command History Persistence

**Story:** As a returning user, I want my command history to persist across sessions so I can reuse previous commands

**Sub-Tasks:**
1. Add useEffect to load history from localStorage on mount
2. Add useEffect to save history to localStorage on change
3. Implement JSON parse error handling
4. Limit history to 50 commands
5. Test persistence across page reloads
6. Ensure existing ↑/↓ navigation still works

**Acceptance Test Scenarios:**
```gherkin
Scenario: Save history
  Given I execute commands: "help", "about", "projects"
  When I reload the page
  Then I should be able to access those commands with ↑

Scenario: History limit
  Given I execute 60 commands
  Then only the most recent 50 should be saved

Scenario: Parse error handling
  Given localStorage has corrupted history data
  When the page loads
  Then it should fallback to empty history without crashing
```

**Edge Cases:**
- localStorage full → handle quota exceeded error
- localStorage disabled → graceful fallback
- Duplicate commands → still save (user might want to repeat)

**Dependencies:** None

**Definition of Done:**
- [ ] History persists across reloads
- [ ] Limited to 50 commands
- [ ] Error handling works
- [ ] ↑/↓ navigation unchanged
- [ ] No console errors

---

## Phase 2: Mobile Experience (P0) 📱

### Story 2.1: Mobile Command Palette

**Story:** As a mobile user, I want a touch-friendly way to execute commands so I don't have to use the keyboard

**Sub-Tasks:**
1. Create `MobileCommandPalette.tsx` component
2. Implement FAB (Floating Action Button)
3. Integrate shadcn Sheet component
4. Create command grid with 8-10 commands
5. Add icons from lucide-react
6. Implement command execution callback
7. Style and position (bottom-right, z-50)
8. Add open/close animations
9. Test on mobile devices

**Acceptance Test Scenarios:**
```gherkin
Scenario: Open palette
  Given I am on mobile (< 768px)
  When I tap the FAB
  Then the command palette should slide up from bottom

Scenario: Execute command
  Given the palette is open
  When I tap "Resume"
  Then the resume modal should open
  And the palette should close

Scenario: Desktop hidden
  Given I am on desktop (≥ 768px)
  Then the FAB should not be visible
```

**Edge Cases:**
- Palette open + rotate device → adjust layout
- Tap outside palette → close
- Keyboard appears → palette adjusts position
- Very small screens (< 375px) → 2-column grid

**Dependencies:** None (shadcn Sheet already available)

**Definition of Done:**
- [ ] FAB visible only on mobile
- [ ] Palette opens/closes smoothly
- [ ] 8-10 commands with icons
- [ ] Commands execute correctly
- [ ] Tested on iOS and Android

---

### Story 2.2: Touch-Optimized Interactions

**Story:** As a mobile user, I want larger touch targets so I can interact easily

**Sub-Tasks:**
1. Audit current touch target sizes
2. Update button padding for mobile (44x44px minimum)
3. Add active states (opacity/scale)
4. Improve modal button sizes on mobile
5. Test on real devices
6. Ensure accessibility (WCAG touch target guidelines)

**Acceptance Test Scenarios:**
```gherkin
Scenario: Touch target size
  Given I am on mobile
  When I measure any interactive element
  Then it should be at least 44x44px

Scenario: Touch feedback
  Given I tap a button
  Then I should see visual feedback (opacity/scale)
  And it should feel responsive

Scenario: Modal buttons
  Given I open a modal on mobile
  Then all buttons should be easy to tap
```

**Edge Cases:**
- Small screens → buttons might need to stack
- Landscape mode → ensure targets still adequate
- Accessibility tools → touch targets meet standards

**Dependencies:** None

**Definition of Done:**
- [ ] All touch targets ≥ 44x44px
- [ ] Active states implemented
- [ ] Modal buttons optimized
- [ ] Tested on real devices
- [ ] No accessibility violations

---

### Story 2.3: Responsive Refinements

**Story:** As a mobile user, I want the interface to adapt to my screen size so content is readable

**Sub-Tasks:**
1. Add media query for < 640px in globals.css
2. Reduce font sizes for small screens
3. Optimize table scaling
4. Improve command prompt wrapping
5. Test on various screen sizes (320px - 768px)
6. Ensure no horizontal scroll

**Acceptance Test Scenarios:**
```gherkin
Scenario: Small screen fonts
  Given I am on a screen < 640px
  Then font sizes should be 0.75rem
  And content should be readable

Scenario: Table scaling
  Given I view a table on mobile
  Then it should scale appropriately
  Or provide horizontal scroll if needed

Scenario: No layout breaks
  Given I test on 320px width
  Then the layout should not break
  And all content should be accessible
```

**Edge Cases:**
- Very wide tables → horizontal scroll
- Long command names → wrap or truncate
- Portrait vs landscape → adapt accordingly

**Dependencies:** None

**Definition of Done:**
- [ ] Fonts scale correctly
- [ ] Tables work on small screens
- [ ] No horizontal scroll (except tables)
- [ ] Tested 320px to 768px
- [ ] All content accessible

---

## Phase 3: Polish & Accessibility (P1) ♿

### Story 3.1: Modal Focus Management

**Story:** As a keyboard user, I want focus to be trapped in modals so I can navigate efficiently

**Sub-Tasks:**
1. Add focus trap logic to UniversalModal
2. Query focusable elements on modal open
3. Implement Tab/Shift+Tab cycling
4. Add Escape key handler
5. Store and restore previous focus
6. Apply to ResumeModal as well
7. Test with keyboard only

**Acceptance Test Scenarios:**
```gherkin
Scenario: Focus trap
  Given a modal is open
  When I press Tab repeatedly
  Then focus should cycle through modal elements only

Scenario: Reverse tab
  Given a modal is open
  When I press Shift+Tab
  Then focus should cycle backwards

Scenario: Escape closes
  Given a modal is open
  When I press Escape
  Then the modal should close
  And focus should return to trigger element

Scenario: Initial focus
  Given I open a modal
  Then the first focusable element should receive focus
```

**Edge Cases:**
- No focusable elements → focus on close button
- Disabled elements → skip in tab order
- Nested modals → handle focus correctly

**Dependencies:** None

**Definition of Done:**
- [ ] Focus trap works in both modals
- [ ] Tab/Shift+Tab cycle correctly
- [ ] Escape closes modal
- [ ] Focus returns on close
- [ ] Tested keyboard-only

---

### Story 3.2: ARIA Live Regions

**Story:** As a screen reader user, I want to hear command output so I can use the terminal

**Sub-Tasks:**
1. Add ARIA live region div to TerminalInterface
2. Set role="log" and aria-live="polite"
3. Display latest command output
4. Apply sr-only class (visually hidden)
5. Test with VoiceOver (macOS)
6. Test with NVDA (Windows)

**Acceptance Test Scenarios:**
```gherkin
Scenario: Command output announced
  Given I am using a screen reader
  When I execute a command
  Then the output should be announced

Scenario: Polite announcements
  Given multiple commands execute quickly
  Then announcements should not interrupt each other

Scenario: Visually hidden
  Given I view the page visually
  Then the live region should not be visible
  But it should exist in the DOM
```

**Edge Cases:**
- Very long output → announce summary
- Empty output → don't announce
- Error messages → announced with appropriate tone

**Dependencies:** None

**Definition of Done:**
- [ ] ARIA live region implemented
- [ ] Command output announced
- [ ] Tested with VoiceOver
- [ ] Tested with NVDA
- [ ] Visually hidden but accessible

---

### Story 3.3: Loading States

**Story:** As a user, I want to see loading indicators so I know the command is processing

**Sub-Tasks:**
1. Add `loadingCommand` state to TerminalInterface
2. Implement loading output with spinner
3. Add 300ms delay before modal opens
4. Apply to resume modal
5. Apply to presentation/project modals
6. Test loading transitions

**Acceptance Test Scenarios:**
```gherkin
Scenario: Resume loading
  Given I type "resume"
  When I press Enter
  Then I should see "Loading..." with spinner
  And after 300ms the modal should open

Scenario: Project loading
  Given I view a project
  Then I should see loading state
  Before the modal opens

Scenario: Loading state clears
  Given a loading state is shown
  When the modal opens
  Then the loading state should be removed
```

**Edge Cases:**
- Modal fails to load → show error, clear loading
- User cancels during loading → handle gracefully
- Multiple rapid commands → queue properly

**Dependencies:** None

**Definition of Done:**
- [ ] Loading states for all async commands
- [ ] Spinner animates correctly
- [ ] 300ms delay feels smooth
- [ ] Error handling works
- [ ] No orphaned loading states

---

### Story 3.4: Success/Warning Colors

**Story:** As a user, I want clear visual feedback on command success/warnings

**Sub-Tasks:**
1. Add --success and --warning variables to all themes
2. Define colors: success (green), warning (orange)
3. Ensure WCAG AA contrast ratios
4. Apply to appropriate contexts
5. Test in all 6 themes
6. Document usage in tech-spec

**Acceptance Test Scenarios:**
```gherkin
Scenario: Success message
  Given a command completes successfully
  Then the message should be green
  And meet 4.5:1 contrast ratio

Scenario: Warning message
  Given a command has a warning
  Then the message should be orange
  And meet 4.5:1 contrast ratio

Scenario: All themes
  Given I switch between themes
  Then success/warning colors should work in all
```

**Edge Cases:**
- Light theme → ensure colors visible
- Dark theme → ensure colors visible
- Colorblind users → use icons too (✓, ⚠)

**Dependencies:** None

**Definition of Done:**
- [ ] Colors added to all 6 themes
- [ ] WCAG AA compliant
- [ ] Used in appropriate contexts
- [ ] Tested in all themes
- [ ] Documentation updated

---

## Phase 4: Advanced Features (P2) 🌟

### Story 4.1: Achievements System

**Story:** As a user, I want to see which easter eggs I've discovered

**Sub-Tasks:**
1. Extend useEasterEggs hook for persistence
2. Add localStorage for unlocked achievements
3. Create `achievements` command
4. Display locked/unlocked status
5. Show progress (X/10)
6. Add visual indicators (✅/🔒)
7. Test achievement tracking

**Acceptance Test Scenarios:**
```gherkin
Scenario: View achievements
  Given I type "achievements"
  Then I should see all 10 easter eggs
  With locked/unlocked status

Scenario: Unlock achievement
  Given I trigger an easter egg
  When I view achievements
  Then it should show as unlocked (✅)

Scenario: Progress tracking
  Given I have unlocked 3 achievements
  Then I should see "3/10 unlocked"

Scenario: Persistence
  Given I unlock achievements
  When I reload the page
  Then they should still be unlocked
```

**Edge Cases:**
- All unlocked → show congratulations
- None unlocked → encourage exploration
- localStorage cleared → reset progress

**Dependencies:** Story 1.5 (localStorage pattern)

**Definition of Done:**
- [ ] Achievements track correctly
- [ ] Persist across sessions
- [ ] Visual indicators clear
- [ ] Progress shows correctly
- [ ] All 10 eggs documented

---

### Story 4.2: Typing Animations

**Story:** As a user, I want output to appear with a typing effect

**Sub-Tasks:**
1. Create useTypingAnimation hook
2. Implement character-by-character reveal
3. Make speed configurable (default 20ms)
4. Make optional/toggleable
5. Apply to select outputs (not all)
6. Test performance

**Acceptance Test Scenarios:**
```gherkin
Scenario: Typing animation
  Given I execute a command with typing effect
  Then text should appear character by character
  At 20ms per character

Scenario: Configurable speed
  Given I set animation speed to 10ms
  Then typing should be faster

Scenario: Disable option
  Given I disable typing animations
  Then text should appear instantly
```

**Edge Cases:**
- Very long text → might be slow
- User executes new command → cancel current animation
- Performance on slow devices → ensure smooth

**Dependencies:** None

**Definition of Done:**
- [ ] Hook works correctly
- [ ] Speed configurable
- [ ] Can be disabled
- [ ] Applied selectively
- [ ] No performance issues

---

### Story 4.3: Resume Section Toggles

**Story:** As a user, I want to customize which resume sections to include

**Sub-Tasks:**
1. Add visibleSections state to ResumeModal
2. Create toggle buttons in modal header
3. Implement section visibility logic
4. Update PDF generation to respect toggles
5. Add localStorage persistence
6. Test all combinations

**Acceptance Test Scenarios:**
```gherkin
Scenario: Toggle section
  Given the resume modal is open
  When I click "Projects" toggle
  Then the projects section should hide/show

Scenario: PDF respects toggles
  Given I hide "Articles" section
  When I download PDF
  Then articles should not be in PDF

Scenario: Persistence
  Given I customize visible sections
  When I reopen the resume
  Then my selections should be remembered
```

**Edge Cases:**
- All sections hidden → show warning
- Only one section → still allow toggle
- Mobile → toggles stack or scroll

**Dependencies:** Story 1.5 (localStorage pattern)

**Definition of Done:**
- [ ] Toggles work for all 7 sections
- [ ] PDF generation updated
- [ ] Persistence works
- [ ] Mobile-friendly
- [ ] No layout breaks

---

### Story 4.4: Alias Discoverability

**Story:** As a user, I want to see command aliases

**Sub-Tasks:**
1. Update HelpOutput component
2. Add "Aliases" column to table
3. Map commands to aliases
4. Style with muted text
5. Update keyboard shortcuts docs
6. Test table layout

**Acceptance Test Scenarios:**
```gherkin
Scenario: View aliases
  Given I type "help"
  Then I should see an "Aliases" column
  With aliases for each command

Scenario: Alias examples
  Given I view the help table
  Then "experience" should show alias "xp"
  And "education" should show alias "edu"

Scenario: No alias
  Given a command has no alias
  Then the alias column should show "-" or be empty
```

**Edge Cases:**
- Long alias lists → wrap or truncate
- Mobile → table might need horizontal scroll

**Dependencies:** None

**Definition of Done:**
- [ ] Aliases column added
- [ ] All aliases documented
- [ ] Styled appropriately
- [ ] Mobile-friendly
- [ ] Help output updated

---

### Story 4.5: Quick Resume Command

**Story:** As a recruiter, I want to quickly download the resume PDF

**Sub-Tasks:**
1. Create resumeUtils.ts utility file
2. Extract PDF generation logic from ResumeModal
3. Add `quick-resume` and `download-resume` commands
4. Implement loading state
5. Add success/error feedback
6. Test PDF generation

**Acceptance Test Scenarios:**
```gherkin
Scenario: Quick download
  Given I type "quick-resume"
  When I press Enter
  Then PDF should download directly
  Without opening modal

Scenario: Loading feedback
  Given I execute quick-resume
  Then I should see "Generating PDF..."
  Then "✓ Resume downloaded successfully"

Scenario: Error handling
  Given PDF generation fails
  Then I should see error message
  With suggestion to use "resume" command
```

**Edge Cases:**
- PDF generation timeout → show error
- Browser blocks download → show instructions
- Mobile → download behavior varies by browser

**Dependencies:** Story 3.4 (success/warning colors)

**Definition of Done:**
- [ ] Utility file created
- [ ] Both commands work
- [ ] Loading state shows
- [ ] Success/error feedback
- [ ] PDF downloads correctly

---

## Dependencies Matrix

| Story | Depends On | Blocks |
|-------|------------|--------|
| 1.1 | None | - |
| 1.2 | None | - |
| 1.3 | None | - |
| 1.4 | None | - |
| 1.5 | None | 4.1, 4.3 |
| 2.1 | None | - |
| 2.2 | None | - |
| 2.3 | None | - |
| 3.1 | None | - |
| 3.2 | None | - |
| 3.3 | None | 4.5 |
| 3.4 | None | 4.5 |
| 4.1 | 1.5 | - |
| 4.2 | None | - |
| 4.3 | 1.5 | - |
| 4.4 | None | - |
| 4.5 | 3.3, 3.4 | - |

---

## Traceability Matrix

| UX Plan Item | Tech Spec Story | Sub-Tasks | Test Scenarios |
|--------------|-----------------|-----------|----------------|
| 1.1 Tab Autocomplete | Story 1.1 | 6 tasks | 4 scenarios |
| 1.2 Command Suggestions | Story 1.2 | 6 tasks | 3 scenarios |
| 1.3 Enhanced Welcome | Story 1.3 | 6 tasks | 3 scenarios |
| 1.4 Keyboard Shortcuts | Story 1.4 | 6 tasks | 3 scenarios |
| 1.5 History Persistence | Story 1.5 | 6 tasks | 3 scenarios |
| 2.1 Mobile Palette | Story 2.1 | 9 tasks | 3 scenarios |
| 2.2 Touch Optimization | Story 2.2 | 6 tasks | 3 scenarios |
| 2.3 Responsive Refinements | Story 2.3 | 6 tasks | 3 scenarios |
| 3.1 Modal Focus | Story 3.1 | 7 tasks | 4 scenarios |
| 3.2 ARIA Live | Story 3.2 | 6 tasks | 3 scenarios |
| 3.3 Loading States | Story 3.3 | 6 tasks | 3 scenarios |
| 3.4 Success/Warning Colors | Story 3.4 | 6 tasks | 3 scenarios |
| 4.1 Achievements | Story 4.1 | 7 tasks | 4 scenarios |
| 4.2 Typing Animations | Story 4.2 | 6 tasks | 3 scenarios |
| 4.3 Resume Toggles | Story 4.3 | 6 tasks | 3 scenarios |
| 4.4 Alias Discovery | Story 4.4 | 6 tasks | 3 scenarios |
| 4.5 Quick Resume | Story 4.5 | 6 tasks | 3 scenarios |

**Total:** 17 stories, 109 sub-tasks, 55 test scenarios

---

## Dev Handoff Checklist

### Before Starting Development

- [ ] Review tech-spec completely
- [ ] Review this story breakdown
- [ ] Set up development environment
- [ ] Create feature branch
- [ ] Understand existing codebase patterns

### For Each Story

- [ ] Read story and sub-tasks
- [ ] Review acceptance test scenarios
- [ ] Consider edge cases
- [ ] Check dependencies
- [ ] Implement sub-tasks in order
- [ ] Test against scenarios
- [ ] Handle edge cases
- [ ] Update progress dashboard
- [ ] Mark story as complete

### After Each Phase

- [ ] Run full regression testing
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Check accessibility
- [ ] Update documentation
- [ ] Demo to stakeholders

### Final Handoff

- [ ] All 17 stories complete
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Performance verified
- [ ] Accessibility verified
- [ ] Ready for deployment

---

## Testing Guidelines

### Unit Testing (Recommended)
- Test individual functions (autocomplete, Levenshtein, etc.)
- Test hooks (useEasterEggs, useTypingAnimation)
- Test utility functions (resumeUtils)

### Integration Testing
- Test command processing flow
- Test modal interactions
- Test localStorage persistence

### E2E Testing (Manual)
- Test complete user journeys
- Test on real devices
- Test with assistive technologies

### Accessibility Testing
- VoiceOver (macOS)
- NVDA (Windows)
- Keyboard-only navigation
- Color contrast verification

### Browser Testing
- Chrome, Firefox, Safari, Edge (latest)
- iOS Safari, Chrome Mobile
- Various screen sizes

---

## Risk Assessment

### Low Risk Stories
- 1.4 (Keyboard Shortcuts) - Simple output
- 1.5 (History Persistence) - Standard localStorage
- 3.4 (Colors) - CSS only
- 4.4 (Aliases) - Table update

### Medium Risk Stories
- 1.1 (Autocomplete) - Keyboard handling
- 1.2 (Suggestions) - Algorithm implementation
- 1.3 (Welcome) - localStorage + UI
- 2.2 (Touch) - Cross-device testing
- 2.3 (Responsive) - Layout complexity
- 3.3 (Loading) - State management
- 4.1 (Achievements) - Persistence logic
- 4.2 (Typing) - Performance concerns
- 4.3 (Resume Toggles) - PDF generation impact

### High Risk Stories
- 2.1 (Mobile Palette) - New component, mobile testing
- 3.1 (Modal Focus) - Complex accessibility
- 3.2 (ARIA) - Screen reader testing
- 4.5 (Quick Resume) - PDF generation extraction

---

## Success Metrics

### Phase 1 Success
- Tab autocomplete reduces typos by 80%
- Command suggestions help 50%+ of errors
- 90%+ first-time users see tutorial
- History persistence works 100%

### Phase 2 Success
- Mobile bounce rate reduced by 40%
- Touch success rate > 95%
- Mobile commands per session +200%

### Phase 3 Success
- WCAG AA compliance achieved
- Screen reader compatibility 100%
- Loading states feel responsive

### Phase 4 Success
- Achievement engagement +30%
- Resume customization used by 40%
- Quick resume used by recruiters

---

**Document Status:** ✅ Ready for Development  
**Next Action:** Dev agent to implement stories in priority order  
**Estimated Effort:** 10-15 hours across 4 sprints
