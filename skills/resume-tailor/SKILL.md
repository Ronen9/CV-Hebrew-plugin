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

### 6.1 Prepare Clean Markdown
Strip the ATS Analysis section.

### 6.2 Generate PDF via HTML + weasyprint

Use the appropriate HTML template:
- EN locale: `references/html-template-en.html`
- RU locale: `references/html-template-ru.html`
- HE locale: `references/html-template-he.html` (RTL, Heebo, single column, right-aligned)

**Hebrew PDF specific:**
- Heebo font requires internet access during render (Google Fonts CDN) — ensure Playwright/weasyprint has network access
- Replace `{{ACCENT_COLOR}}` with a suitable color (recommend `#2563EB` for tech, `#1e3a5f` for traditional)
- Wrap all English tech names in `<span class="en">` to prevent RTL character reordering
- Verify: text is right-aligned, no LTR bleed on Hebrew words

```bash
cd docs/resume && DYLD_LIBRARY_PATH="$(brew --prefix)/lib" uv run weasyprint resume-[slug].html [Name]-[TargetRole].pdf
```

**Target:** 1-2 pages for Hebrew CVs. If spilling to 3 pages — tighten line-height and margins first.

### 6.3 Cover Letter (if requested)
Hebrew cover letter: formal tone, right-aligned, same RTL rules.

### 6.4 Report
List all generated files.

### 6.5 Master Profile Update
Offer to update master profile with new information from this session.

---

## Pre-Output Verification Checklist

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
