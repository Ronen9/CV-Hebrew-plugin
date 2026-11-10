---
name: resume-tailor
description: |
  Tailors a resume to a specific job description with ATS optimization.
  Use when asked to optimize a resume, tailor CV for a job, create an ATS-friendly resume,
  generate a cover letter, or adapt career profile for a specific role.
  Triggers on: "resume", "CV", "tailor", "ATS", "job application", "cover letter",
  "optimize resume", "adapt resume", "резюме", "вакансия", "קורות חיים", "קו"ח", "ATS ישראל".
user-invocable: true
---

# Resume Tailor

Multi-stage skill that transforms a resume into an ATS-optimized document tailored to a specific job description. Supports EN/US, RU/CIS, and HE/Israel locales. Replaces generic AI resume services with job-specific, strategic tailoring.

## Global Rules (apply to every run, every locale, every output)

1. **No long dashes, ever.** Never emit `—` (em dash) or `–` (en dash) in any draft, HTML, PDF, DOCX, or cover letter. Use a regular hyphen `-`, comma, period, semicolon, colon, or parentheses. Before finalizing any file, scan the text for `—` and `–` and replace them. This is a hard rule because long dashes are one of the strongest "written by AI" signals.
2. **Human writing style.** Follow the "Human Writing Style" section of `references/ats-rules.md`. Avoid AI-flavored vocabulary (leveraged, spearheaded, seamlessly, cutting-edge, transformative, holistic, synergy, etc.), avoid triadic phrasing, vary sentence length, and prefer concrete nouns + numbers over polished abstractions.
3. **Always generate BOTH PDF and DOCX.** Every final output must include a `.pdf` (for sending) AND a matching editable `.docx` (so the user can tweak it). Same filename stem, both saved next to the markdown draft. Cover letters too, when produced.
4. **Professional, readable, lightly colored design.** Use a single subtle accent color on section headings and the name (default accent `#2A5DA8`, a calm corporate blue; HE locale may use `#1E3A5F`). Generous whitespace, clear hierarchy, one accent color only. No icons, gradients, sidebars, multi-column layouts, or decorative graphics. Body in Calibri/Inter/Heebo at 10-10.5pt, name at 20-22pt, section headings at 11-12pt uppercase with a thin accent underline.
5. **Strict reverse-chronological experience order.** Always list every role in the Experience section from most recent to oldest by end date (present/current first), and never break that order. This ordering is independent of formatting: a role rendered "condensed" must still appear in its correct chronological slot, not grouped after the fully-detailed roles. Before finalizing, verify the dates descend monotonically down the page (e.g. Present -> 2017-2023 -> 2016-2017 -> 2014-2016 -> 2006-2013 -> 2002-2004). This applies to the markdown draft, the DOCX builder, and the HTML/PDF equally.

## Reference Files

Read these files at the appropriate stage — they contain rules, conventions, and templates:
- `references/ats-rules.md` — ATS formatting rules, keyword strategy, scoring formula, anti-patterns
- `references/locale-en.md` — English/US resume conventions
- `references/locale-ru.md` — Russian/CIS resume conventions
- `references/locale-he.md` — Hebrew/Israeli resume conventions (RTL, Israeli ATS systems, Israeli market norms)
- `references/section-templates.md` — Section templates with slot markers for both locales
- `references/html-template-en.html` — EN HTML template for weasyprint PDF
- `references/html-template-ru.html` — RU HTML template for weasyprint PDF
- `references/html-template-he.html` — HE HTML template for weasyprint PDF (RTL, Heebo font, single-column)

## Master Profile

Location: `docs/resume/master-profile.md`

The master profile is a comprehensive data store of the user's career — every role, metric, skill, and transition context. It is NOT a formatted resume. The skill tailors FROM the master profile for each job application.

- If master profile exists: use it as the primary source
- If it doesn't exist: build it from the provided resume on first run
- After each tailoring session: offer to update it with any new information

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

The master profile may include a `Visibility` field on each role and section. If the master profile has no `Visibility` fields, treat all roles as `always`.

| Value | Meaning | Behavior |
|---|---|---|
| `always` | Include in all resume variants | Always consider for inclusion |
| `variant-specific` | Only in variants listed in `Variants` field | Include only if target variant matches or user explicitly requests |
| `on-request` | Never include unless user explicitly asks | Skip by default |
| `reference-only` | Alias/metadata, not content | Never include in any output |

Variants are defined in the master profile's Visibility Schema section. Read them from there — do not hardcode.

### Visibility Resolution Rules

1. **Determine target variant.** Infer from user's request, JD domain, or ask if ambiguous. User may also specify constraints like "without variant X" — treat as explicit variant exclusion.
2. **Filter roles:**
   - `always` → include
   - `variant-specific` → include only if target variant is in `Variants` list AND not explicitly excluded by user
   - `on-request` → skip unless user explicitly names the role or asks for a full/comprehensive resume
   - `reference-only` → never include
3. **Education, Certifications, Languages** — respect their `Visibility` the same way.
4. **User overrides win.** If user explicitly asks to include an `on-request` role — include it. If user excludes a variant — drop all roles where that variant is the only match.

---

## Workflow

```
STAGE 0: Resolve Inputs
    |
STAGE 1: Intake & Analysis (subagent)
    |
STAGE 1.5: Resume Feedback (presented to user)
    |
STAGE 2: Strategic Questions (AskUserQuestion)
    |
STAGE 3: ATS Optimization & Tailoring
    |
STAGE 4: Draft Generation (.md)
    |
STAGE 5: Review & Iteration
    |
STAGE 6: Final Output (.pdf + optional cover letter)
```

---

## STAGE 0: Resolve Inputs

### Resume Input
```
IF arguments contain a file path (PDF/MD/TXT):
  Read the file
ELIF docs/resume/master-profile.md exists:
  Read it. Confirm with user: "Using your master profile as the base. Correct?"
ELSE:
  Ask: "Please provide your resume — paste text, give a file path, or attach a PDF."
```

### Job Description Input
```
IF arguments contain a URL (https://...):
  WebFetch the URL
  Extract: title, company, requirements, responsibilities, qualifications
  If fetch returns insufficient content: ask user to paste the JD text instead
ELIF arguments contain pasted text:
  Parse directly
ELSE:
  Ask: "Provide the target job description — paste the text or give me a URL."
```

### First-Run: Master Profile Creation
If no master profile exists and a resume was provided, build the master profile:
1. Parse the resume into the master profile structure (see above)
2. Save to `docs/resume/master-profile.md`
3. Inform user: "Created your master profile at docs/resume/master-profile.md. This will be your base for all future tailoring."

---

## STAGE 1: Intake & Analysis

**Use a subagent** for this stage to protect the main context from heavy parsing.

The subagent receives:
- Raw resume/master profile text
- Raw job description text

The subagent must extract and return:

### From Resume
- List of roles: title, company, dates, key achievements (with metrics), technologies
- Skills inventory
- Education and certifications
- Military service (if present — relevant for Israeli market)
- Career narrative arc (how roles connect)

### From Job Description
- Company name and context
- Target role title and seniority level
- Required skills (must-have)
- Preferred skills (nice-to-have)
- Key responsibilities
- Domain/industry
- Implicit requirements (read between the lines)
- **Language of JD** (Hebrew → likely HE locale; English → ask user)

### Gap Analysis
- **Strong matches:** Resume skills/experience that directly map to JD requirements
- **Partial matches:** Related experience that can be reframed
- **Gaps:** JD requirements not covered by resume
- **Differentiators:** Resume strengths beyond JD requirements (potential value-adds)
- **Red flags:** Date overlaps, unexplained gaps, title inconsistencies

---

## STAGE 1.5: Resume Feedback

**Present the analysis results to the user before asking strategic questions.**

### Format

Present a structured feedback report:

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
| [Required skill/experience] | [Where it appears in resume or "Not found"] | Match / Partial / Gap |

### Red Flags (if any)
- [Date overlaps, unexplained gaps, title inconsistencies — only if present]

### Recommendations
- [Concrete suggestion 1]
- [Concrete suggestion 2]
```

### Rules for Feedback
- **Be specific, not generic.**
- **Tie every observation to the JD.**
- **Flag only real issues.**
- **Distinguish structural issues from content issues.**
- **Include the match/gap table.**

### Excluded Roles Report

After the main feedback, present a separate block listing every role and section excluded from this resume and why (same format as original SKILL.md).

### After Presenting Feedback
Say: "This is my analysis of your resume against this specific JD. Now let me ask a few strategic questions before I start."

Then proceed to Stage 2.

---

## STAGE 2: Strategic Questions

Ask 3-5 questions via AskUserQuestion. Adapt based on what the analysis reveals.

### Always Ask

**Q1: Locale**
```
"Target locale for this resume?"
Options:
  - English/US (no photo, no DOB, experience before education, 1-2 pages)
  - Russian/CIS (photo, DOB, education before experience, 2-3 pages)
  - Hebrew/Israel — עברית (RTL, single column, Israeli ATS systems, 1-2 pages)
```

**Note for Hebrew locale:** If the job posting was in Hebrew or the company is Israeli, proactively recommend Hebrew locale. Read `references/locale-he.md` before proceeding.

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

**Q6: Cover Letter**
```
Options: Yes / No, resume only
```

**Q7: Military Service** (Hebrew locale only — if service appears in master profile)
```
"Your military service is in your profile. Should I include it in this CV?"
Options:
  - Yes, include (relevant unit/role)
  - No, omit
```

---

## STAGE 3: ATS Optimization & Tailoring

Read the appropriate reference files:
- `references/ats-rules.md` (always)
- `references/locale-en.md` OR `references/locale-ru.md` OR `references/locale-he.md` (based on Q1)
- `references/section-templates.md` (always)

### Hebrew Locale — Additional Rules
When HE locale is selected, apply all rules from `references/locale-he.md` plus:
- **Single column only** — never use two-column layout
- **Technology names always in English** — wrap in appropriate HTML/markdown if needed
- **No niqqud** — strip any vowel marks from the text
- **Section order:** Contact → Summary → Experience → Education → Skills → Military (if applicable) → Languages
- **ATS keyword matching is exact** — copy keywords from JD verbatim (Israeli ATS does not do semantic matching as well as English ATS)

### 3.1 Executive Summary
Write specifically for THIS role. For Hebrew: 3-4 lines, implicit first person (no "אני"), lead with years + domain.

### 3.2 Core Skills Section
- Always in English regardless of CV language
- Prioritize by JD relevance

### 3.3 Professional Experience
- Reverse chronological
- Achievement bullets with metrics
- Hebrew: use strong Hebrew action verbs from locale-he.md

### 3.4 Keyword Integration
- For Hebrew CVs: copy JD keywords exactly — spelling variations fail Israeli ATS

### 3.5 Education & Certifications
- Hebrew: after experience (unlike RU convention)

### 3.6 Locale-Specific Adjustments
- HE: No photo, no ID number, no DOB, city only, RTL layout, Heebo font, single column, max 2 pages

---

## STAGE 4: Draft Generation

Save to: `docs/resume/draft-[company-slug]-[YYYY-MM-DD].md`

Include ATS analysis section after sentinel marker (same format as original).

---

## STAGE 5: Review & Iteration

Same as original — loop until user approves.

---

## STAGE 6: Final Output

Every final output MUST produce both a PDF and an editable DOCX with the same filename stem, saved to `docs/resume/`.

### 6.1 Prepare Clean Markdown
Strip the ATS Analysis section. Then run the long-dash sweep: replace every `—` and `–` with `-`, comma, or period as appropriate. Re-read once for AI-flavored phrases (see Global Rule 2 and `references/ats-rules.md` "Human Writing Style") and rewrite them in plain language.

### 6.2 Generate PDF via HTML

Use the appropriate HTML template:
- EN locale: `references/html-template-en.html`
- RU locale: `references/html-template-ru.html`
- HE locale: `references/html-template-he.html` (RTL, Heebo, single column, right-aligned)

**Design defaults (all locales):**
- Single subtle accent color. Default `#2A5DA8` (corporate blue). HE may use `#1E3A5F`. Replace `{{ACCENT_COLOR}}` placeholder.
- Name centered at the top, 20-22pt, bold, in the accent color.
- One line under the name with title/positioning in regular weight, dark gray.
- Contact line: one line, centered, 9pt, neutral gray.
- Section headings: 11-12pt, UPPERCASE, accent color, with a thin 1px accent-colored bottom border. Generous space above (8-10pt), tight below (2-4pt).
- Company names bold; dates right-aligned in muted gray on the same line.
- Bullets: standard disc, 10pt body, 1.35 line-height.
- Margins: 14mm top/bottom, 16mm left/right (A4).
- No icons, no sidebars, no two-column layout, no skill bars, no photos (HE/EN). Keep it clean and corporate.

**Hebrew PDF specific:**
- Heebo font requires internet access during render (Google Fonts CDN).
- Wrap all English tech names in `<span class="en">` to prevent RTL character reordering.
- Verify: text is right-aligned, no LTR bleed on Hebrew words.

Render with weasyprint if available; otherwise fall back to Playwright/Chromium:

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.goto('file:///' + html_path.replace('\\', '/'))
    pg.pdf(path=pdf_path, format='A4',
           margin={'top':'14mm','bottom':'14mm','left':'16mm','right':'16mm'},
           print_background=True)
    b.close()
```

**Target:** 1-2 pages. If spilling, tighten line-height and margins before cutting content.

### 6.3 Generate DOCX (MANDATORY, same filename stem as PDF)

Use `python-docx`; check that it is installed in the active Python environment before running the generator. The DOCX must mirror the PDF content and visual hierarchy as closely as Word allows:
- Same accent color on the name and on section headings (RGBColor `0x2A, 0x5D, 0xA8` by default).
- Calibri 10pt body, name 20-22pt bold accent, section headings 11pt bold uppercase accent with a thin gray separator line.
- Page margins 1.4cm top/bottom, 1.6cm left/right.
- Company name bold; dates right-tab-stopped in gray.
- Standard List Bullet style.
- Pure plain text — no em/en dashes anywhere.

Save to: `docs/resume/[Name]-[TargetRole].docx` (same stem as the PDF). If the user's project already has `docs/resume/_build_docx.py`, inspect and adapt it; otherwise create a generator for the approved content. Always run it and verify the output file exists before reporting back.

### 6.4 Cover Letter (if requested)
Produce BOTH `.pdf` and `.docx` for the cover letter too, using the same accent color and Calibri 10.5pt body. No long dashes. Hebrew cover letter: formal tone, right-aligned, same RTL rules.

### 6.5 Report
List all generated files as markdown links (PDF + DOCX, plus cover letter PDF + DOCX if produced).

### 6.6 Master Profile Update
Offer to update master profile with new information from this session.


---

## Pre-Output Verification Checklist

### Global Rules
- [ ] No `—` (em dash) and no `–` (en dash) anywhere in markdown, HTML, PDF, or DOCX
- [ ] No AI-tell vocabulary (leveraged, spearheaded, seamlessly, cutting-edge, transformative, holistic, synergy, etc.)
- [ ] Sentence lengths vary; phrasing sounds like a real person, not a press release
- [ ] BOTH `.pdf` AND `.docx` were generated with the same filename stem
- [ ] Single accent color applied consistently to name + section headings (default `#2A5DA8`)
- [ ] Clean professional layout: single column, no icons, no sidebars, no skill bars

### ATS Compliance
- [ ] Single column layout (no markdown tables for layout)
- [ ] Contact info in document body
- [ ] Standard section headings used
- [ ] Consistent date format throughout
- [ ] No skill bars, icons, or visual ratings
- [ ] Acronyms spelled out on first use

### Hebrew-Specific (when HE locale)
- [ ] `dir="rtl"` on `<html>` tag
- [ ] All text right-aligned
- [ ] No niqqud in any text
- [ ] All technology names in English
- [ ] No two-column layout anywhere
- [ ] Heebo font loading correctly (not falling back to Arial)
- [ ] No photo, no ID number, no DOB
- [ ] Max 2 pages
- [ ] Military section included/excluded per user's answer

### Keyword Coverage
- [ ] Every required JD skill appears in 2+ places
- [ ] No keyword appears more than 3 times total
- [ ] Job title from JD reflected in summary

### Content Quality
- [ ] Every achievement bullet contains a quantified metric
- [ ] Recent 2-3 roles have full detail
- [ ] Older roles condensed but not eliminated
- [ ] No unexplained gaps > 6 months

### Anti-Pattern Check
- [ ] Summary does NOT start with generic openers
- [ ] No "References available upon request"
- [ ] No skill percentage/proficiency ratings
- [ ] No responsibilities-only descriptions without achievements
