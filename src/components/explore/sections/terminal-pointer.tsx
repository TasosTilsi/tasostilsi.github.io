/**
 * TerminalPointer — shared static terminal-pointer chrome (D-02, UI-SPEC §9).
 *
 * Renders '// more: ' + the command token in the accent color + ' in the
 * terminal', pinned to the bottom (mt-4) of the Experience, Projects, and
 * Skills bodies. Playful register only — panel content itself is real
 * (D-06).
 *
 * NOT a link (UI-SPEC §17.6): no anchor element, no hover/pointer classes,
 * not focusable. Meaningfully NOT aria-hidden either — it is meaningful
 * chrome text that may wrap at 375px. Phase 5 may make pointers
 * interactive (link/prefill into the CLI); behaviour stays static now —
 * do not implement interactivity here (deferred idea).
 *
 * Server component; pointer strings are allowed chrome literals
 * (UI-SPEC §17.4).
 */
export function TerminalPointer({ command }: { command: string }) {
  return (
    <p className="mt-4 text-xs text-muted-foreground">
      {'// more: '}
      <span className="text-accent">{command}</span>
      {' in the terminal'}
    </p>
  );
}