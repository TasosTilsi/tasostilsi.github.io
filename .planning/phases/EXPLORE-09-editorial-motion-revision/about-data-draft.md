# About Data Draft — REV-15 — FOR APPROVAL (D-02)

**Status:** DRAFT — **nothing has been written to `src/data/portfolio-main-data.json` yet.**
**Process (D-02):** draft → approve → write. The approval round is NOT skipped for personal copy — this follows the phase-6 `data-refresh-draft.md` precedent (EXPLORE-06) even though this draft is tiny (3 fields).
**Scope guard:** purely additive. The `about` object gains exactly 3 new fields; every existing field (name, title, location, dob, email, description, contact ×9, profileImageUrl) is byte-untouched, and no other collection moves. All other surfaces (CLI outputs, resume modal, /resume, static PDF) are untouched — the new fields are additive and no consumer shape-pins `about`'s key set (RESEARCH §1.2, verified by reading the integrity suite's pins).
**Verbatim rule:** every value below is transcribed verbatim, no normalization. Values are data, never computed at render time.

> ## APPROVAL BOX (to be filled by the user before the write — Tasks 2–3 of plan 02 are blocked until this box is filled)
> **Approved:** _(fill in: date + choice per item)_
> - (1) **positioning** — the two pinned lines, verbatim as drafted: **APPROVE** / amend (propose replacement lines)
> - (2) **availability** — `Open to selective part-time work` (verbatim from the CLI banner): **APPROVE** / amend (e.g. different availability wording)
> - (3) **metrics** — the 4 × {value, label} array as drafted: **APPROVE** / amend (e.g. different labels, subset, or order)

---

## 1. `about.positioning` — NEW (string[2], never joined)

The panel's new primary statement. Rendered as TWO block spans — never joined, never re-wrapped into one paragraph (UI-SPEC §2.2).

```json
"positioning": [
  "I design test automation frameworks and AI-driven QA infrastructure that entire engineering organizations adopt.",
  "— not just run."
]
```

- Line 1: the positioning sentence, verbatim from the SPEC's pinned quote.
- Line 2: the em-dash tail as the accent punch, verbatim (`—` = U+2014 em dash).
- Exactly 2 entries. Typed `positioning?: string[]` in the same commit (R-7).

## 2. `about.availability` — NEW (string)

```json
"availability": "Open to selective part-time work"
```

**Source trace (verbatim, no normalization):** the CLI welcome banner —
- `src/components/cli/outputs/WelcomeMessage.tsx:33` — desktop ASCII banner line: `* Open to selective part-time work`
- `src/components/cli/outputs/WelcomeMessage.tsx:42` — mobile banner line: `Open to selective part-time work`

This is a read-only transcription; the CLI file itself is NOT edited (the banner keeps rendering its own literal).

## 3. `about.metrics` — NEW (array of 4 × {value, label})

```json
"metrics": [
  { "value": "12+", "label": "engineering teams" },
  { "value": "30+", "label": "engineers" },
  { "value": "7+", "label": "years" },
  { "value": "600+", "label": "npm launch week" }
]
```

Values are **transcriptions** of already-approved data strings — never computed at render time. Labels stored lowercase, uppercased by CSS at render (UI-SPEC §2.3).

## 4. Source-trace table (field → verbatim source file:line → approved value)

| Field | Verbatim source (file:line) | Source string | Drafted value |
|---|---|---|---|
| `positioning[0]` | `.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-SPEC.md` (the SPEC's pinned quote; echoed UI-SPEC §2.2/§10) | "I design test automation frameworks and AI-driven QA infrastructure that entire engineering organizations adopt." | identical |
| `positioning[1]` | same SPEC quote (UI-SPEC §2.2/§10) | "— not just run." | identical |
| `availability` | `src/components/cli/outputs/WelcomeMessage.tsx:33` and `:42` | `Open to selective part-time work` | identical |
| `metrics[0]` = 12+ / engineering teams | `src/data/portfolio-main-data.json:31` (competency proof) · also `:48` (Chubb bullet), `:16` (summary) | "…used by 12+ engineering teams…" | `12+` / `engineering teams` |
| `metrics[1]` = 30+ / engineers | `src/data/portfolio-main-data.json:34` (competency proof) · also `:50` (Chubb bullet) | "…used by 30+ engineers…" | `30+` / `engineers` |
| `metrics[2]` = 7+ / years | `src/data/portfolio-main-data.json:16` (about.description) | "…with 7+ years designing frameworks…" | `7+` / `years` |
| `metrics[3]` = 600+ / npm launch week | `src/data/portfolio-main-data.json:185` (DeepIndex description) · also `:16` (summary tail) | "600+ downloads in launch week (Sep 2026)." | `600+` / `npm launch week` |

## 5. Write mechanics (Task 2 — runs only after this box is filled)

1. The 3 fields are inserted inside the `about` object of `src/data/portfolio-main-data.json`, immediately **after `profileImageUrl`** — additive only, nothing moves.
2. `src/data/portfolio-main-data.d.ts` gains, same commit (R-7), immediately after `profileImageUrl: string`:
   - `positioning?: string[]`
   - `availability?: string`
   - `metrics?: { value: string; label: string }[]`
3. `tests/portfolio-data-integrity.test.mjs` pins the three values verbatim (RED-first inside Task 2, then GREEN at the data write).
4. Graceful-hide contract (UI-SPEC §2.8): absent/empty `positioning` → lead omitted, summary re-promoted to pre-phase prominence; empty `metrics` → row omitted (1–3 entries render what exists); absent/empty `availability` → chip omitted.

**No src/ file is modified by this draft task.** The write happens in Task 2 only after your approval.