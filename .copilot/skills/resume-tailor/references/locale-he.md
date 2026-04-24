# Hebrew/Israeli Resume Conventions

## Personal Information Rules
- Photo: NOT expected — omit entirely (anti-discrimination norm in Israeli tech)
- Date of birth: do NOT include
- Full name: first + last only, no patronymic
- Location: city only (e.g., תל אביב, רעש העין, חיפה)
- Phone: 05X-XXXXXXX or +972-5X-XXXXXXX format
- Email: include
- LinkedIn: include if profile is active
- Military service: include rank and role if relevant to the position; omit if not
- ID number: NEVER include

## Language of CV
- Hebrew CV: for Israeli companies, government, traditional sectors
- English CV: for multinational companies, startups with foreign investors, global tech
- When in doubt: ask the user which language the job posting was in
- Mixed: NEVER mix Hebrew and English in the same CV body — pick one language for prose
- Exception: technology names, tools, and certifications are ALWAYS written in English regardless of CV language (Python, React, AWS — never פייתון, ריאקט)

## RTL Rules (Hebrew CVs)
- Direction: RTL throughout — `dir="rtl"` on `<html>` tag
- Text alignment: right-aligned
- Layout: SINGLE COLUMN ONLY — two-column layouts break Israeli ATS systems
- Font: Heebo (Google Fonts) — best Hebrew font for ATS PDF rendering
- Technology names inside Hebrew sentences: wrap in `<span dir="ltr">` to prevent character reordering
- No niqqud (vowel marks) — ATS systems misparse them as separate characters

## Section Order (Israeli Convention)
1. Contact info (name, phone, email, city, LinkedIn)
2. Professional summary (תקציר מקצועי) — 3–4 lines
3. Professional Experience (ניסיון מקצועי) — reverse chronological
4. Education (השכלה)
5. Skills (כישורים טכניים) — always in English
6. Military service (שירות צבאי) — if relevant
7. Languages (שפות)

## Length
- 1–2 pages: standard for Israeli market
- 2 pages: acceptable for 10+ years experience
- Never 3 pages — Israeli recruiters will not read it

## Professional Summary
- 3–4 lines maximum
- Written in first person implicit (no "אני" — just the verb)
- Lead with years of experience and domain
- Example: "מהנדס תוכנה בכיר עם 8 שנות ניסיון בפיתוח Backend. מתמחה ב-Python ו-Node.js עם ניסיון בסביבות ענן מורכבות."

## Experience Section
- Reverse chronological
- Each role:
  - Company name + brief context (what the company does — one line)
  - Role title + dates (MM/YYYY – MM/YYYY or "עד היום")
  - 3–5 bullet points: achievement-led, outcome-first
- Current role: 4–5 bullets; older roles: 2–3 bullets

## Achievement Bullet Formula
```
[פועל עבר] [מה] [בהיקף/בהקשר], [תוצאה מדידה]
```

### Strong Hebrew Action Verbs
הובלתי, פיתחתי, בניתי, השקתי, הגדלתי, הקטנתי, ניהלתי, תכננתי, יישמתי, שיפרתי, הנעתי, הקמתי, אחראי על, ייעלתי, הצלחתי

### Avoid
השתתפתי ב, עסקתי ב, סייעתי ב, הייתי מעורב ב

## Metrics That Israeli ATS and AI Screeners Look For
- Team size ("ניהלתי צוות של 6 מפתחים")
- Revenue/budget ("תקציב של $2M")
- Percentage change ("שיפרתי זמן תגובה ב-40%")
- User/customer scale ("מוצר עם 200K משתמשים פעילים")
- Time reduction ("קיצרתי זמן deployment מ-2 שעות ל-10 דקות")

## Israeli ATS Systems
| System | Used By | Hebrew Handling |
|--------|---------|----------------|
| Comeet | Most Israeli tech companies | Good RTL, hates two columns |
| AllJobs ATS | Traditional/enterprise | Single column only, no tables |
| LinkedIn Easy Apply | Everyone | Parses PDF but sometimes flips to LTR |
| Monday.com Jobs | Startups | Light ATS, mostly human review |
| Greenhouse/Lever | Multinationals in IL | Built for LTR — use English CV |

## Keywords by Domain (Always in English)

### Software Engineering
Python, JavaScript, TypeScript, React, Node.js, Java, Go, C++
Microservices, REST API, GraphQL, Docker, Kubernetes, AWS, GCP, Azure
CI/CD, Git, Agile, Scrum, TDD, System Design, Scalability

### Product Management
Product Manager, PM, PRD, Roadmap, OKR, KPI
User Research, A/B Testing, Data-Driven, Go-to-Market
SQL, Amplitude, Mixpanel, Agile, Stakeholder Management

### Data / AI
Python, R, SQL, Machine Learning, Deep Learning
TensorFlow, PyTorch, scikit-learn, NLP, LLM
Tableau, Power BI, ETL, Data Pipeline, A/B Testing

### DevOps
Kubernetes, Docker, Terraform, AWS, GCP, CI/CD
Linux, Bash, Monitoring, Datadog, Grafana, SRE

### HR / People
גיוס, Recruiting, Talent Acquisition, HRIS, Onboarding
Compensation & Benefits, Employee Engagement, L&D
Workday, BambooHR, דיני עבודה

## Date Format
- Employment dates: MM/YYYY (e.g., 03/2021 – 08/2023)
- Current role: MM/YYYY – עד היום
- Education: graduation year only
- Consistent throughout — never mix formats

## Military Service Section
- Include if: officer rank, tech unit (8200, Mamram, C4I), combat leadership role
- Include if: the role values leadership and the military section supports it
- Skip if: basic service with no relevant role, or applying to a company where it's irrelevant
- Format: יחידה, תפקיד, דרגה (if officer), תאריכים
- Example: "קצין מודיעין, יחידת 8200, סגן ראשון, 2015–2018"

## Common Israeli CV Mistakes to Fix
1. Two-column layout — breaks ATS, convert to single column
2. Niqqud in text — remove all vowel marks
3. Technology names in Hebrew — convert to English
4. Abbreviations like בכ"מ, מנכ"ל — spell out or write as CEO, CTO
5. Inconsistent date formats — standardize to MM/YYYY
6. Missing job title under name — add it immediately below the name
7. No quantified achievements — add numbers wherever possible
8. Photo included — remove (Israeli tech norm)
9. ID number included — remove immediately
10. Paragraph-style experience (no bullets) — convert to bullet points
