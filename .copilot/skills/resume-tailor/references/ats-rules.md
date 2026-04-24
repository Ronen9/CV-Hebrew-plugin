# ATS Rules & Scoring Heuristics

## Format Rules

### Layout
- Single column ONLY. No multi-column, no tables for layout, no text boxes
- No graphics, icons, charts, progress bars for skill levels
- Contact info in document body (NOT in header/footer — Workday and others skip headers entirely)
- No "skill bars" or percentage ratings — ATS cannot parse visual skill levels
- Photos can disrupt ATS parsing (shift text positions, break field extraction). For ATS submissions — no photo. Add photo only for direct submissions in EU/CIS markets where expected
- No special characters (★ ● ◆) — use standard bullets or dashes
- No em dashes in dates — use hyphens

### Section Headings
Use these exact standard headings (ATS systems look for them):
- EN: "Executive Summary", "Core Skills", "Professional Experience", "Education", "Certifications"
- RU: "Краткое описание", "Ключевые навыки", "Опыт работы", "Образование", "Сертификации"
- Creative alternatives ("My Journey", "What I Bring") break ATS section detection

### File Format (updated 2026)
- `.pdf` (text-based) — now parses as well as DOCX across Greenhouse, Lever, Workday, iCIMS. Default choice — preserves formatting perfectly
- `.docx` — still has 23% fewer parsing errors with design tools (Workday data); use when portal explicitly requests it or legacy ATS suspected
- HTML-to-PDF (weasyprint, Puppeteer, Chrome print) — produces clean text-based PDFs that parse correctly
- **Test:** if you can highlight and copy text in the PDF, ATS can read it
- Never: `.pages`, `.odt`, Google Docs links, scanned/image-based PDFs

### Typography
- Fonts: Calibri, Arial, Garamond, Cambria (10-12pt body, 13-14pt headings)
- Margins: 0.5-1 inch (0.75 inch recommended)
- No decorative fonts or unusual typefaces

### Dates
- Consistent format throughout the entire document
- Preferred: MM/YYYY or Month YYYY
- Never mix formats (e.g., "Jan 2024" in one place and "01/2024" in another)

### Acronyms
- Spell out on first use with acronym in parentheses
- Example: "Application Programming Interface (API)"
- After first use, acronym only is fine

---

## Keyword Matching (How Modern ATS Works)

### Semantic NLP Matching (2025-2026)
Modern ATS (Greenhouse, Lever, Workday) uses semantic understanding — 91% accuracy vs 67% for keyword-only systems:
- Greenhouse: semantic matching; "Managed teams" ≈ "Led teams"
- Workday: NLP-based; maps "project management" → "program coordination" → "initiative leadership"
- Lever: semantic matching with AI workflows
- iCIMS: more traditional keyword matching with AI screening add-ons
- Exact match is still strongest signal, but synonyms and related terms count
- **Tailored resumes show 115% higher conversion rate** (6.5% vs 2.68% for generic). Job title alignment gives ~3.5x increase in interview rates

### Keyword Placement Strategy
- Every required JD skill must appear in at least 2 places:
  1. Core Skills section (grouped by category)
  2. An achievement bullet in Professional Experience
- Nice-to-have skills: at least 1 mention somewhere
- Use semantic variants across mentions (not exact repetition)

### Keyword Density
- Each keyword: 2-3 appearances max across the whole document
- More than 3 = keyword stuffing, detected and penalized
- Job title from JD should be reflected in Executive Summary

### What NOT to Do
- Never create an invisible/white-text keyword block — ManpowerGroup detects hidden text in ~100K resumes/year; Greenhouse found 1% of all resumes contain white text. ATS strips formatting on profile pages, exposing hidden text to recruiters
- Never use prompt injection / hidden AI instructions in resume — 41% of US job seekers tried this; companies actively build detection
- Never list skills without contextual demonstration in experience
- Never repeat the same phrase verbatim more than twice

---

## ATS Scoring Formula

Estimated score for pre-output analysis:

```
Score = 0.4 * required_skills_coverage
      + 0.2 * nice_to_have_coverage
      + 0.2 * achievement_quantification_rate
      + 0.1 * section_completeness
      + 0.1 * keyword_distribution
```

### Component Definitions

**required_skills_coverage:** Count of JD "required" / "must-have" skills found in resume / total required skills

**nice_to_have_coverage:** Count of JD "preferred" / "nice-to-have" skills found / total nice-to-have skills

**achievement_quantification_rate:** Percentage of experience bullets containing a numeric metric (dollar amount, percentage, team size, time reduction, scale number)

**section_completeness:** All standard sections present and non-empty (Contact, Summary, Skills, Experience, Education). Score = present sections / 5

**keyword_distribution:** Keywords appear across multiple sections (not concentrated in one). Score = sections containing JD keywords / total sections with content

### Score Interpretation
- 85%+ : Strong match, likely to pass ATS filters
- 70-84%: Moderate match, may pass depending on competition
- Below 70%: Weak match, significant gaps to address

---

## Anti-Patterns to Detect and Flag

### Executive Summary
- NEVER start with: "Seasoned", "Dynamic", "Results-driven", "Passionate", "Highly motivated"
- NEVER use: "[Title] with N+ years of experience in [broad field]" as opening
- MUST be specific to the target role, mentioning the actual job title and 1-2 headline metrics

### Content
- Metrics without business context: "Increased revenue 30%" — of what baseline? what division?
- Responsibilities-only descriptions without achievement bullets
- Role descriptions that could apply to anyone in that title (not specific to this person)
- Unexplained gaps > 6 months (flag to user, don't auto-fill or hide)

### Structure
- "References available upon request" — remove entirely (outdated convention)
- Objective statements (replaced by Executive Summary)
- Skill percentage ratings or proficiency bars
- Aggregated achievement blocks detached from specific roles/periods

### Tailoring
- Over-narrowing: stripping relevant domain experience to match JD literally
- Under-tailoring: generic resume not customized for this specific role
- Early career elimination: condensing significant roles to nothing just because they're old
- Ignoring transferable skills from adjacent domains
