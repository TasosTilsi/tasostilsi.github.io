---
phase: 05-explore-routing
plan: 01
type: tdd
wave: 1
depends_on: []
files_modified:
  - src/components/cli/outputs/WelcomeMessage.tsx
  - src/components/cli/constants.ts
  - src/components/cli/TerminalInterface.tsx
  - src/components/cli/outputs/HelpOutput.tsx
  - tests/explore-routing.test.mjs
autonomous: true
requirements: ["EXPLORE-05"]
user_setup: []
must_haves:
  truths:
    - "The CLI welcome message renders exactly one added bracket-styled link line rendered as `[ NEW → visual tour: explore ]` — one line, explicit JetBrains Mono font stack, brackets + arrow in text-accent, the token `explore` as a same-tab Next <Link href=\"/explore\"> — placed after the tutorial box as an UNCONDITIONAL sibling so first-time AND returning visitors see it (per D-01, OQ-3); every other byte of the welcome renders unchanged."
    - "Typing `explore` in the CLI prints exactly one chrome line `[ opening the visual tour... ]`, then navigates to /explore in the same tab via the Next router — the case returns the sentinel `{ navigate: \"/explore\" }` and executeCommand handles it before the ReactNode branch (per D-02, OQ-2 pinned sentinel variant)."
    - "The main help output (HelpOutput.tsx) lists `explore` with the chrome-only description `Open the visual portfolio tour` in the file's existing li line shape (per D-02, OQ-1 — the CONTEXT auto-derivation claim is false; the entry is a manual li, RESEARCH §1.4)."
    - "All pre-existing CLI behaviour is identical: same commands, Tab autocomplete, fuzzy suggestions, themes, achievements, easter eggs (additive-only per D-05); `exp` now Tab-matching BOTH `experience` and `explore` is the intended multi-match output path, not a regression."
  artifacts:
    - path: tests/explore-routing.test.mjs
      provides: "Layer-1/2 routing contract written RED-first: command registry, welcome-line locked format, dispatch wiring, help entry, additive-only negatives, dependency-count guard"
      min_lines: 100
    - path: src/components/cli/outputs/WelcomeMessage.tsx
      provides: "Bracket-styled welcome link line after the tutorial box (D-01), rest of the component untouched"
      min_lines: 70
      exports: ["WelcomeMessage"]
    - path: src/components/cli/constants.ts
      provides: "AVAILABLE_COMMANDS with `explore` appended as the 39th and last entry (D-02)"
      min_lines: 110
      exports: ["AVAILABLE_COMMANDS"]
    - path: src/components/cli/TerminalInterface.tsx
      provides: "explore command case, navigate sentinel in the processCommand union, executeCommand handling with useRouter().push (D-02)"
      min_lines: 520
      exports: ["TerminalInterface"]
    - path: src/components/cli/outputs/HelpOutput.tsx
      provides: "Main help li entry for explore (OQ-1)"
      min_lines: 23
      exports: ["HelpOutput"]
  key_links:
    - from: src/components/cli/outputs/WelcomeMessage.tsx
      to: /explore route
      via: "Next <Link href=\"/explore\"> rendered as the `explore` token in the bracket line, same tab, no target attribute (D-01)"
      pattern: "<Link href=\"/explore\""
    - from: src/components/cli/TerminalInterface.tsx
      to: /explore route
      via: "useRouter from next/navigation + navigate sentinel handled in executeCommand calling router.push(result.navigate) after ~600ms (D-02, OQ-2)"
      pattern: "router\\.push\\(result\\.navigate\\)"
    - from: src/components/cli/outputs/HelpOutput.tsx
      to: src/components/cli/constants.ts AVAILABLE_COMMANDS
      via: "Help listing entry mirrors the registered command name so `help` closes the island for newcomers (OQ-1)"
      pattern: ">explore<"
---

<objective>
Close the CLI island (EXPLORE-05): give the CLI two exit points to /explore — the bracket-styled welcome hyperlink (D-01) and the new `explore` command (D-02) — plus the help listing entry, all strictly additive, red/green: the source-invariant contract suite is committed first and proven failing, then the implementation turns it green.
</objective>

<context>
@.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SPEC.md
@.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-CONTEXT.md
@.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-RESEARCH.md  — §1.2–1.5 verified mechanics, §1.9 pitfalls; §4 OQ-1..OQ-9 resolutions are binding
@src/components/cli/TerminalInterface.tsx
@src/components/cli/constants.ts
@src/components/cli/outputs/WelcomeMessage.tsx
@src/components/cli/outputs/HelpOutput.tsx
@src/components/cli/TypingEffect.tsx
@tests/explore-tour.test.mjs  — house test style: import .ts directly via type stripping (:22-29); red-first discipline precedent (:9-14)

Discipline: work on branch phase-5; one atomic commit per task — Task 1 commits FIRST with a `test:` message (red run on record), Task 2 commits with a `feat:` message; never push to a remote; never commit harness artefacts (.cursor/, .deepindex.db, *.pdf/png, tsconfig.tsbuildinfo, doublecheck-*.md). Out of bounds everywhere in this plan: MobileCommandPalette.tsx (OQ-9 — not in D-05's enumeration), EASTER_EGG_IDS, /resume, src/data/**, package.json dependencies, any explore-side file MODIFIED by this plan (plan 02 owns those; a read-only test import from src/components/explore/constants.ts for the (f) regression guard is explicitly sanctioned). Verify commands in this plan scope to tests/explore-routing.test.mjs only — do NOT run npm run build or the full suite (parallel-wave plan 02 shares this tree; plan 03 owns the full gate).
</context>

<tasks>
  <task type="test">
    <name>Task 1: RED — routing contract suite (tracer: pins every layer of the end-to-end slice)</name>
    <files>tests/explore-routing.test.mjs</files>
    <read_first>src/components/cli/TerminalInterface.tsx, src/components/cli/constants.ts, src/components/cli/outputs/WelcomeMessage.tsx, src/components/cli/outputs/HelpOutput.tsx, src/components/explore/constants.ts, tests/explore-tour.test.mjs</read_first>
    <action>
      Create tests/explore-routing.test.mjs in house style (import .ts directly via type stripping, precedent tests/explore-tour.test.mjs:22-29) asserting the FULL locked contract — every assertion must fail on the untouched tree, which is the required red record:
      (a) Registry (D-02): AVAILABLE_COMMANDS imported from ../src/components/cli/constants.ts includes "explore", has length 39, and its last entry is "explore".
      (b) Welcome line (D-01, OQ-3, OQ-4): WelcomeMessage source contains `href="/explore"` exactly once and exactly one `<Link` element; contains `NEW`, `visual tour:`, `→`, `text-accent`, `var(--font-jetbrains)`; zero occurrences of `target=`; the source index of `href="/explore"` is greater than the index of the `showTutorial &&` block and less than the index of the trailing `<br />` (:63) — "after the tutorial box", unconditional sibling; and the locked rendered sequence is pinned by a relative-order chain — with `i` = index of `NEW`: `lastIndexOf("[", i)` < i < `indexOf("→", i)` < `indexOf("visual tour:", i)` < `indexOf('href="/explore"', i)` < index of the first `]` after the href index, all strictly increasing — i.e. exactly `[ NEW → visual tour: explore ]` in that order (D-01 locked sequence).
      (c) Dispatch (D-02, OQ-2): TerminalInterface source contains `case "explore":`, `{ navigate: "/explore" }`, `router.push(result.navigate)`, and the `useRouter` import from `next/navigation`; contains NO `window.location`; the count of `case "` occurrences is exactly 40 (was 39, RESEARCH §1.9); the exact string `[ opening the visual tour... ]` appears exactly once.
      (d) Help (D-02, OQ-1): HelpOutput source contains `>explore<` and `Open the visual portfolio tour`; AdvancedHelpOutput.tsx contains no `>explore<` entry (untouched guard); MobileCommandPalette.tsx contains no `explore` command entry (untouched guard, OQ-9).
      (e) Additive-only (D-01/D-05): WelcomeMessage still contains the pre-existing segments `hidden sm:block` (:27), the mobile banner div (:38), both TypingEffect texts (`> System initialized...` :47 and `> Type 'help' to explore my work` :48), and the tutorial box marker `Quick Start Guide` (:54).
      (f) Guards: package.json dependencies length === 39 (precedent tests/explore-visuals.test.mjs:622-625; D-05 zero new dependencies); EXPLORE_TOUR_FINISH imported from ../src/components/explore/constants.ts (exported at :89 — NOT src/components/cli/constants.ts, which does not export it; house precedent tests/explore-tour.test.mjs:22-29 imports from exactly that module) has linkHref === "/" (:92 — the /explore → CLI return leg stays intact, per the unchanged clause of D-03; read-only test import — no explore-side source file is touched).
    </action>
    <verify>node --test tests/explore-routing.test.mjs — must FAIL (non-zero exit) with failures naming the missing explore wiring; that failing run is the red record. Never run it and ignore a pass: if it unexpectedly passes, stop and re-read the source before implementing.</verify>
    <acceptance_criteria>
      - `node --test tests/explore-routing.test.mjs` exits non-zero (red on record) BEFORE any implementation edit
      - grep -c `explore`-related assertions: the suite file references AVAILABLE_COMMANDS, `href="/explore"`, `case "explore"`, `>explore<`, `linkHref`, dependencies-length 39
    </acceptance_criteria>
    <done>The complete locked contract is pinned in a committed test file and proven failing on the untouched tree.</done>
  </task>

  <task type="feat">
    <name>Task 2: GREEN — implement both CLI exit points + help entry (D-01 + D-02 + OQ-1..4)</name>
    <files>src/components/cli/constants.ts, src/components/cli/TerminalInterface.tsx, src/components/cli/outputs/WelcomeMessage.tsx, src/components/cli/outputs/HelpOutput.tsx</files>
    <read_first>tests/explore-routing.test.mjs, src/components/cli/TerminalInterface.tsx, src/components/cli/constants.ts, src/components/cli/outputs/WelcomeMessage.tsx, src/components/cli/outputs/HelpOutput.tsx</read_first>
    <action>
      1. constants.ts (D-02): append the string "explore" to AVAILABLE_COMMANDS immediately after "achievements" (:61) so it is the 39th and last entry. No aliases, no EASTER_EGG_IDS change, nothing else in the file (D-05).
      2. TerminalInterface.tsx (D-02): add `import { useRouter } from "next/navigation";` to the imports and `const router = useRouter();` at the component top with the other hooks. Extend the processCommand return union (:131-133) with `| { navigate: string }`. Add `case "explore":` returning the sentinel `{ navigate: "/explore" }` among the existing command cases, BEFORE `case ""` (:295) and the fuzzy-suggestion default — the count of `case "` occurrences goes 39 to 40. In executeCommand, inside the same pre-ReactNode sentinel block that handles `{ openModal: "resume" }` (:352-386), add a navigate branch that: pushes the chrome line `[ opening the visual tour... ]` into history exactly the way the resume loading line is pushed (:369-386 idiom), awaits ~600ms using the same setTimeout/Promise idiom (:372), then calls `router.push(result.navigate)` and returns early. Never window.location (D-02). Do not reorder or modify any existing case.
      3. WelcomeMessage.tsx (D-01, OQ-3): insert exactly ONE new sibling block between the closing of the showTutorial conditional block (:62) and the `<br />` (:63) — NOT inside the tutorial conditional, so returning visitors see it too. The line renders exactly `[ NEW → visual tour: explore ]` in this order: opening bracket `[` in a span with className "text-accent"; text ` NEW `; arrow `→` in a span with className "text-accent"; text ` visual tour: `; the token `explore` rendered as `<Link href="/explore">explore</Link>` with className "text-accent" (same tab; do NOT add target); a space; closing bracket `]` in a span with className "text-accent". Import Link from "next/link" (the first Link usage under src/components/cli). Give the wrapper div an inline style fontFamily "var(--font-jetbrains), var(--font-geist-mono), Menlo, Monaco, 'Courier New', monospace" (OQ-4: honors D-01's JetBrains Mono lock; the variable loads globally on body per src/app/layout.tsx:19-26). NO size classes — the history-line wrapper (TerminalInterface.tsx:528) already applies text-sm md:text-base. NO margin classes — the parent `flex flex-col gap-2` (:25) provides spacing. Touch nothing else in the file (rest renders byte-identical, D-01). The line is a static sibling below the typing block and must not interfere with the TypingEffect flow.
      4. HelpOutput.tsx (D-02, OQ-1): in the hardcoded li list (:12-19), add exactly one entry following the existing line shape verbatim — a span with className "text-primary w-36 inline-block" containing `explore`, padded/spaced like the sibling lines, then `- Open the visual portfolio tour` (chrome-only description per EXPLORE-07/D-05; wording pinned). Do NOT touch AdvancedHelpOutput.tsx or MobileCommandPalette.tsx (OQ-9).
      Then run the suite — it must now pass (green), covering the red run from Task 1.
    </action>
    <verify>node --test tests/explore-routing.test.mjs — must PASS (exit 0), green covering Task 1's red record</verify>
    <acceptance_criteria>
      - `node --test tests/explore-routing.test.mjs` exits 0
      - grep `explore` is present as the last entry of AVAILABLE_COMMANDS in src/components/cli/constants.ts
      - grep `case "explore"` and `router.push(result.navigate)` and `from "next/navigation"` each match src/components/cli/TerminalInterface.tsx; grep `window.location` matches zero times in that file
      - grep `<Link href="/explore"` matches exactly once in src/components/cli/outputs/WelcomeMessage.tsx; grep `var(--font-jetbrains)` matches in that file
      - grep `>explore<` and `Open the visual portfolio tour` each match src/components/cli/outputs/HelpOutput.tsx; grep `>explore<` matches zero times in src/components/cli/outputs/AdvancedHelpOutput.tsx
    </acceptance_criteria>
    <done>Both CLI exit points and the help entry exist in production form per the locked decisions; the contract suite that failed red now passes green.</done>
  </task>
</tasks>