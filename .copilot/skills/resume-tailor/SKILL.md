---
name: resume-tailor
description: |
  Tailors a resume to a specific job description with ATS optimization for VS Code Copilot.
  Use when asked to optimize a resume, tailor a CV for a job, create an ATS-friendly resume,
  generate a cover letter, or adapt a career profile for a specific role.
  Triggers on: "resume", "CV", "tailor", "ATS", "job application", "cover letter",
  "optimize resume", "adapt resume", "קורות חיים", "קו"ח", "ATS ישראל".
  Locales: English/US and Hebrew/Israel (RTL, Israeli ATS conventions).
---

# Resume Tailor (Copilot edition)

Multi-stage skill that transforms a resume into an ATS-optimized document tailored to a specific job description. Supports **EN/US** and **HE/Israel** locales. Adapted from the Claude Code plugin at `skills/resume-tailor/` to run inside VS Code Copilot Chat on Windows.

## Reference Files

Read these files at the appropriate stage with `read_file`:
- `references/ats-rules.md` — ATS formatting rules, keyword strategy, scoring formula, anti-patterns
- `references/locale-en.md` — English/US resume conventions
- `references/locale-he.md` — Hebrew/Israeli resume conventions (RTL, Israeli ATS, Israeli market norms)
- `references/section-templates.md` — Section templates with slot markers (EN + HE)
- `references/html-template-en.html` — EN HTML template for Playwright PDF
- `references/html-template-he.html` — HE HTML template for Playwright PDF (RTL, Heebo font, single-column)
- `references/render-pdf.js` — Playwright Chromium runner that converts an HTML file to PDF

## Tool Mapping (Claude Code → Copilot)

| Claude Code primitive | Copilot equivalent |
|---|---|
| `AskUserQuestion` | `vscode_askQuestions` |
| `WebFetch` | `fetch_webpage` |
| Subagent | `runSubagent` (use the `Explore` agent for parsing-heavy work) |
| `Bash` / `pandoc` / `weasyprint` | `run_in_terminal` (PowerShell) + `references/render-pdf.js` (Playwright) |
| `~/.claude/...` paths | Workspace-relative paths under `docs/resume/` |

All output is written under `docs/resume/` in the user's workspace.

## Master Profile

Location: `docs/resume/master-profile.md`

Comprehensive store of the user's career — every role, metric, skill, and transition context. **Not** a formatted resume. The skill tailors FROM the master profile for each job application.

- If `docs/resume/master-profile.md` exists → use it as the primary source
- If it doesn't exist → build it from the provided resume on first run
- After each session → offer to update it

Master profile structure:
```
# Master Profile
## Contact (name, email, phone, LinkedIn, location)
## Career Narrative (raw, unformatted — the full story)
## Visibility Schema (enum definitions and known variants)
## Roles (each with: Visibility, Variants, company context, title, dates, team size/structure, responsibilities, achievements with metrics, technologies)
## Education (with Visibility)
## Certifications
## Skills Inventory (comprehensive, not pre-filtered)
## Languages
## Military Service (if applicable — Israeli market)
## Notes (gaps, side projects, consulting arrangements, etc.)
```

### Visibility System

If roles have no `Visibility` field, treat all as `always`.

| Value | Meaning | Behavior |
|---|---|---|
| `always` | Include in all variants | Always consider |
| `variant-specific` | Only in matching `Variants` | Include if target variant matches OR user explicitly asks |
| `on-request` | Never include unless user asks | Skip by default |
| `reference-only` | Alias/metadata only | Never output |

### Visibility Resolution Rules

1. Determine target variant from the user's request, JD domain, or ask if ambiguous.
2. Filter roles per the table above.
3. Education / Certifications / Languages respect `Visibility` the same way.
4. **User overrides win.**

---

## Workflow

```
STAGE 0: Resolve Inputs
    |
STAGE 1: Intake & Analysis (Explore subagent)
    |
STAGE 1.5: Resume Feedback (presented to user)
    |
STAGE 2: Strategic Questions (vscode_askQuestions)
    |
STAGE 3: ATS Optimization & Tailoring
    |
STAGE 4: Draft Generation (.md)
    |
STAGE 5: Review & Iteration
    |
STAGE 6: Final Output (.pdf via Playwright + optional cover letter)
```

---

## STAGE 0: Resolve Inputs

### Resume Input
```
IF the user attached or referenced a file (PDF/MD/TXT):
  Read it with read_file (or ask the user to paste contents if PDF binary)
ELIF docs/resume/master-profile.md exists:
  Read it. Confirm: "Using your master profile as the base. Correct?"
ELSE:
  Ask: "Please provide your resume — paste text, give a file path, or attach the file."
```

> PDFs: Copilot's `read_file` does not parse binary PDFs. Ask the user to either (a) paste the text, (b) provide a `.md` / `.txt` version, or (c) run `pdftotext` themselves. Do not invent content.

### Job Description Input
```
IF arguments contain a URL (https://...):
  fetch_webpage with a query like "extract job title, company, requirements, responsibilities"
  If the fetched content is too thin (login wall, JS-rendered): ask the user to paste the JD text
ELIF arguments contain pasted text:
  Parse directly
ELSE:
  Ask: "Provide the target job description — paste the text or give me a URL."
```

### First-Run: Master Profile Creation
If no master profile exists and a resume was provided, build the master profile:
1. Parse the resume into the master profile structure (above)
2. Save with `create_file` to `docs/resume/master-profile.md`
3. Inform user: "Created your master profile at docs/resume/master-profile.md. This is the base for all future tailoring."

---

## STAGE 1: Intake & Analysis

**Use `runSubagent` with the `Explore` agent** for heavy parsing — keeps the main context lean.

The subagent receives:
- Raw resume / master profile text
- Raw job description text

It must return:

### From Resume
- List of roles: title, company, dates, key achievements (with metrics), technologies
- Skills inventory
- Education and certifications
- Military service (if present — relevant for Israeli market)
- Career narrative arc

### From Job Description
- Company name and context
- Target role title and seniority
- Required skills (must-have)
- Preferred skills (nice-to-have)
- Key responsibilities
- Domain / industry
- Implicit requirements
- **Language of JD** (Hebrew → recommend HE locale; English → ask user)

### Gap Analysis
- Strong matches
- Partial matches (reframable)
- Gaps
- Differentiators (resume strengths beyond JD)
- Red flags (date overlaps, unexplained gaps, title inconsistencies)

---

## STAGE 1.5: Resume Feedback

Present the analysis before strategic questions.

```
## Resume Analysis for [JD Target Role] at [Company]

### Strengths (what works well for this role)
- [Strength 1 — specific, tied to JD requirement]
- [Strength 2]
- [Strength 3]

### Issues to Address
- [Issue 1 — specific problem with actionable suggestion]
- [Issue 2]

### Gap Analysis vs Job Description
| JD Requirement | Your Coverage | Status |
|---|---|---|
| [Required skill/experience] | [Where it appears OR "Not found"] | Match / Partial / Gap |

### Red Flags (if any)
- [Date overlaps, unexplained gaps, title inconsistencies]

### Recommendations
- [Concrete suggestion 1]
- [Concrete suggestion 2]
```

### Rules
- Be specific, not generic.
- Tie every observation to the JD.
- Flag only real issues.
- Distinguish structural issues from content issues.
- Include the match/gap table.

### Excluded Roles Report
After the main feedback, list every role / section excluded from this resume and why (per the Visibility System).

Then say: "This is my analysis of your resume against this specific JD. Now let me ask a few strategic questions before I start." → proceed to Stage 2.

---

## STAGE 2: Strategic Questions

Ask 3–5 questions via `vscode_askQuestions`. Adapt based on what the analysis reveals.

### Always Ask

**Q1: Locale**
```
Question: "Target locale for this resume?"
Options:
  - English/US (no photo, no DOB, experience before education, 1-2 pages)
  - Hebrew/Israel — עברית (RTL, single column, Israeli ATS, 1-2 pages)
```

If the JD was in Hebrew or the company is Israeli, proactively recommend HE. Read `references/locale-he.md` before proceeding with HE.

**Q2: Positioning**
```
"Based on this JD, I see [brief JD summary]. How should I position you?"
Options:
  - Technical depth (hands-on architecture, system design, specific tech expertise)
  - Leadership breadth (team scaling, org design, strategy, stakeholder management)
  - Balanced (let me decide based on JD emphasis)
```

**Q3: Emphasis**
```
"Your strongest matches for this role are: [top 3-4 from gap analysis].
 Gaps I identified: [top 2-3].
 Which roles or achievements should I highlight most? Anything to de-emphasize?"
Options:
  - Use my recommendations as-is
  - [User provides specific guidance]
```

### Conditional Questions

**Q4: Date Overlaps** (only if detected)

**Q5: Domain Scope** (only if resume contains domains not in JD)

**Q6: Cover Letter** — Yes / No

**Q7: Military Service** (HE locale only — if service appears in master profile)
```
"Your military service is in your profile. Should I include it in this CV?"
Options:
  - Yes, include (relevant unit/role)
  - No, omit
```

---

## STAGE 3: ATS Optimization & Tailoring

Read these references:
- `references/ats-rules.md` (always)
- `references/locale-en.md` OR `references/locale-he.md` (per Q1)
- `references/section-templates.md` (always)

### Hebrew Locale — Additional Rules
When HE is selected, apply everything from `references/locale-he.md` plus:
- **Single column only** — never use two-column layout
- **Technology names always in English** — wrap in `<span class="en">` or `<span dir="ltr">`
- **No niqqud** — strip all vowel marks
- **Section order:** Contact → Summary → Experience → Education → Skills → Military (if applicable) → Languages
- **ATS keyword matching is exact** — copy keywords from the JD verbatim

### 3.1 Executive Summary
Write specifically for THIS role. HE: 3–4 lines, implicit first person (no "אני"), lead with years + domain.

### 3.2 Core Skills
- Always in English regardless of CV language.
- Prioritize by JD relevance.

### 3.3 Professional Experience
- Reverse chronological.
- Achievement bullets with metrics.
- HE: use strong Hebrew action verbs from `locale-he.md`.

### 3.4 Keyword Integration
- HE CVs: copy JD keywords exactly — spelling variations fail Israeli ATS.

### 3.5 Education & Certifications
- HE: after experience.

### 3.6 Locale-Specific Adjustments
- **HE**: no photo, no ID number, no DOB, city only, RTL layout, Heebo font, single column, max 2 pages.
- **EN**: no photo, no DOB, city + state, 1–2 pages.

---

## STAGE 4: Draft Generation

Save with `create_file` to: `docs/resume/draft-[company-slug]-[YYYY-MM-DD].md`

Append an ATS analysis section after a sentinel marker so it can be stripped before final output:

```
<!-- ATS_ANALYSIS_START -->
## ATS Analysis (internal, stripped before final output)
- Estimated ATS score: NN%
- Keyword coverage table: ...
- Gaps remaining: ...
<!-- ATS_ANALYSIS_END -->
```

---

## STAGE 5: Review & Iteration

Show the draft (or relevant sections) to the user and ask for feedback. Loop until they approve. Use `replace_string_in_file` for surgical edits to the draft.

---

## STAGE 6: Final Output

### 6.1 Prepare Clean Markdown
Strip everything between `<!-- ATS_ANALYSIS_START -->` and `<!-- ATS_ANALYSIS_END -->` (inclusive). Save as `docs/resume/[slug]-clean.md` if helpful, or render directly.

### 6.2 Build the HTML
1. Pick the template:
   - EN → `references/html-template-en.html`
   - HE → `references/html-template-he.html`
2. Replace slot markers with the user's content. EN uses `[CAPS_SNAKE_CASE]` placeholders; HE uses Handlebars-style `{{TOKEN}}` and `{{#each}}` blocks — for HE, expand the loops yourself in the produced HTML (don't ship a literal `{{#each}}`).
3. For HE: replace `{{ACCENT_COLOR}}` with `#2563EB` (tech) or `#1e3a5f` (traditional) — pick based on the company / industry, or ask the user.
4. For HE: wrap every English tech name / company name inside Hebrew text with `<span class="en">…</span>`.
5. Save the populated HTML with `create_file` to `docs/resume/resume-[slug].html`.

### 6.3 Render to PDF via Playwright (Windows)

The repo includes `references/render-pdf.js` — a small Playwright runner. Use it from PowerShell:

```powershell
cd docs\resume
# One-time per workspace:
npm init -y | Out-Null
npm install --no-save playwright
npx playwright install chromium

# Render:
node ..\..\..\.copilot\skills\resume-tailor\references\render-pdf.js `
  resume-[slug].html `
  "[FullName]-[TargetRole].pdf"
```

(Adjust the relative path to `render-pdf.js` based on the cwd.)

The script:
- Launches headless Chromium
- Loads the local HTML file (waits for fonts via `networkidle` so Heebo from Google Fonts loads)
- Emits A4 PDF with `printBackground: true`

**Hebrew checks after render:**
- Open the PDF, confirm text is right-aligned and no LTR bleed on Hebrew words
- If Heebo did not load, the script will print a warning — re-run with internet access
- Target 1–2 pages; if it spills to 3, tighten margins / line-height in the HTML and re-render

### 6.4 Cover Letter (if requested)
Same flow: write `docs/resume/cover-letter-[slug]-[YYYY-MM-DD].md`, render to PDF using the same template (or a stripped version of it). HE cover letter: formal tone, right-aligned, same RTL rules.

### 6.5 Report
List all generated files and their absolute paths.

### 6.6 Master Profile Update
Offer to update `docs/resume/master-profile.md` with anything new from this session.

---

## Pre-Output Verification Checklist

### ATS Compliance
- [ ] Single column layout (no markdown tables for layout)
- [ ] Contact info in document body
- [ ] Standard section headings used
- [ ] Consistent date format throughout
- [ ] Experience in strict reverse-chronological order (present first; dates descend monotonically; condensed roles sit in their correct date slot, NOT grouped after detailed roles)
- [ ] No skill bars, icons, or visual ratings
- [ ] Acronyms spelled out on first use

### Hebrew-Specific (when HE locale)
- [ ] `dir="rtl"` on `<html>` tag
- [ ] All text right-aligned
- [ ] No niqqud in any text
- [ ] All technology names in English
- [ ] No two-column layout anywhere
- [ ] Heebo font loaded (not falling back to Arial)
- [ ] No photo, no ID number, no DOB
- [ ] Max 2 pages
- [ ] Military section included/excluded per user's answer

### Keyword Coverage
- [ ] Every required JD skill appears in 2+ places
- [ ] No keyword appears more than 3 times total
- [ ] Job title from JD reflected in summary

### Content Quality
- [ ] Every achievement bullet contains a quantified metric
- [ ] Recent 2–3 roles have full detail
- [ ] Older roles condensed but not eliminated
- [ ] No unexplained gaps > 6 months

### Anti-Pattern Check
- [ ] Summary does NOT start with generic openers (Seasoned / Dynamic / Results-driven / Passionate / Highly motivated)
- [ ] No "References available upon request"
- [ ] No skill percentage / proficiency ratings
- [ ] No responsibilities-only descriptions without achievements
