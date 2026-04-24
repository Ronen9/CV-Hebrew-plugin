# Section Templates (EN + HE)

Slot markers use `[CAPS_SNAKE_CASE]` for values the skill fills in.
HE templates additionally use `{{TOKEN}}` style markers consistent with `references/html-template-he.html`.

---

## Executive Summary

### EN Template
```
[TARGET_ROLE_TITLE] with [YEARS_RELEVANT] years driving [PRIMARY_DOMAIN] at [SCALE_DESCRIPTION]. [HEADLINE_ACHIEVEMENT_WITH_METRIC]. Brings [KEY_DIFFERENTIATOR_1] and [KEY_DIFFERENTIATOR_2] to [TARGET_COMPANY_CONTEXT_OR_ROLE_TYPE].
```

Example:
```
CTO and platform architect with 12 years driving fintech payment infrastructure at scale (100K+ TPS, $25M+ monthly volume). Built and led engineering orgs of 55+ across three continents, delivering PCI DSS and ISO 27001 certified systems from scratch. Brings deep high-load distributed systems expertise and hands-on security architecture to high-growth payment platforms.
```

Anti-pattern — NEVER generate this:
```
Seasoned technology leader with 15+ years of experience in software development and team management. Proven track record of delivering results in fast-paced environments.
```

### HE Template
```
[תפקיד יעד] עם [שנות ניסיון] שנות ניסיון ב-[תחום עיקרי], [היקף/קונטקסט]. [הישג מרכזי עם מטריקה]. מתמחה ב-[בידול 1] ו-[בידול 2].
```

Rules for HE:
- 3–4 lines max.
- Implicit first person (no "אני").
- Lead with years + domain.
- Wrap English tech names in `<span class="en">…</span>`.

Example:
```
מהנדס תוכנה בכיר עם 8 שנות ניסיון בפיתוח <span class="en">Backend</span>. הובלתי צוותי פיתוח של עד 6 מהנדסים, השקתי מערכת <span class="en">microservices</span> בעומס של 2M+ בקשות ביום. מתמחה ב-<span class="en">Python</span>, <span class="en">Node.js</span> וסביבות ענן (<span class="en">AWS, GCP</span>).
```

Anti-pattern — NEVER generate this:
```
מועמד דינמי ומונע תוצאות עם ניסיון רב בפיתוח תוכנה וניהול צוותים. בעל יכולות מצוינות בעבודה בצוות ובסביבה דינמית.
```

---

## Core Skills

### Grouping Template
```
[CATEGORY_NAME_1]: [Skill_1] | [Skill_2] | [Skill_3] | [Skill_4]
[CATEGORY_NAME_2]: [Skill_1] | [Skill_2] | [Skill_3] | [Skill_4]
[CATEGORY_NAME_3]: [Skill_1] | [Skill_2] | [Skill_3] | [Skill_4]
```

Rules:
- 3–5 categories
- 4–6 skills per category
- Most JD-relevant category first
- JD required skills must appear here
- Pipe-delimited within categories
- **Skills are always written in English**, even in HE CVs

### Common Category Names (EN labels — used in both EN and HE CVs)
- Engineering Leadership & Org Design
- Platform Architecture (Distributed Systems, High-Load)
- Security & Compliance
- Payments & Financial Infrastructure
- DevOps / SRE / Cloud Infrastructure
- Data Engineering & Analytics
- Languages & Databases

### Hebrew Category Labels (when the CV body language requires Hebrew labels)
- מנהיגות הנדסית וארכיטקטורת ארגון
- ארכיטקטורת פלטפורמה (מערכות מבוזרות, <span class="en">High-Load</span>)
- אבטחת מידע ועמידה בתקנים
- תשתית תשלומים ופיננסים
- <span class="en">DevOps / SRE</span> ותשתיות ענן
- הנדסת נתונים ואנליטיקה
- שפות תכנות ובסיסי נתונים

---

## Professional Experience — Full Detail Role

### EN Template
```
### [COMPANY_NAME] — [COMPANY_CONTEXT]
**[JOB_TITLE]** | [START_DATE] - [END_DATE]

[1-2 sentence scope: what you owned, team size, key mandate]

Key Achievements:
- [ACTION_VERB] [specific what] [scope], resulting in [METRIC]
- [ACTION_VERB] [specific what] [scope], achieving [METRIC]
- [ACTION_VERB] [specific what] [scope], reducing/increasing [METRIC]
```

### HE Template
```
### [שם החברה] — [קונטקסט החברה]
**[תפקיד]** | [MM/YYYY] – [MM/YYYY או "עד היום"]

[1–2 משפטים על תחום אחריות, גודל צוות, מנדט מרכזי]

הישגים מרכזיים:
- [פועל עבר] [מה בדיוק] [בהיקף], תוצאה: [מטריקה]
- [פועל עבר] [מה בדיוק] [בהיקף], תוצאה: [מטריקה]
- [פועל עבר] [מה בדיוק] [בהיקף], תוצאה: [מטריקה]
```

---

## Professional Experience — Condensed Role

### EN Template
```
**[JOB_TITLE]** | [COMPANY_NAME] | [START_DATE] - [END_DATE]
[1-2 most relevant achievements with metrics in a single line or two bullets]
```

### HE Template
```
**[תפקיד]** | [שם החברה] | [MM/YYYY] – [MM/YYYY]
[1–2 הישגים רלוונטיים עם מטריקות]
```

---

## Achievement Bullet Formula

### EN Pattern
```
[Action Verb] [what specifically you did] [within what scope/context], [resulting in] [quantified outcome] [timeframe if applicable]
```

### HE Pattern
```
[פועל עבר] [מה בדיוק] [בהיקף/בהקשר], [תוצאה מדידה] [פרק זמן אם רלוונטי]
```

### Quality Checklist for Each Bullet
- Strong action verb (not "Responsible for" / "אחראי על")
- Specifies WHAT was done (not vague)
- Includes scope/context (team size, system scale, business unit)
- Quantified metric (%, $, ₪, time, count, scale)
- Metric has business context (not a floating number)

### Examples (EN)
Good:
```
Architected event-driven microservices platform processing 2M+ transactions/day, reducing P95 latency from 800ms to 120ms within 6 months
```
Bad:
```
Worked on microservices architecture and improved system performance
```

### Examples (HE)
Good:
```
תכננתי וייצבתי פלטפורמת <span class="en">microservices</span> מבוססת אירועים בעומס של 2M+ בקשות ביום, וקיצרתי <span class="en">P95 latency</span> מ-800ms ל-120ms תוך חצי שנה
```
Bad:
```
עסקתי בארכיטקטורת מיקרו-שירותים ושיפרתי ביצועים
```

---

## Education

### EN Template
```
**[DEGREE]** in [FIELD] — [UNIVERSITY_NAME], [GRADUATION_YEAR]
```

### HE Template
```
**[תואר]** ב-[תחום] — [שם המוסד], [שנת סיום]
```

Examples:
- `**B.Sc.** ב-מדעי המחשב — אוניברסיטת תל אביב, 2015`
- `**M.B.A.** — אוניברסיטה העברית, 2020`

---

## Military Service (HE only)

### Template
```
**[תפקיד]** · [יחידה] · [דרגה אם קצין] · [MM/YYYY] – [MM/YYYY]
[שורה אחת על אחריות / רלוונטיות לתפקיד]
```

Example:
```
**קצין מודיעין** · יחידת 8200 · סגן ראשון · 06/2015 – 06/2018
הובלתי צוות של 12 חיילים בפיתוח כלי ניתוח שפה; אחראי על מבצעי איסוף בזמן אמת
```

---

## Cover Letter (Optional)

### EN Structure (3–4 paragraphs)
1. **Opening:** Why THIS company specifically (not generic). Reference something specific about the company/role.
2. **Match 1–2:** Strongest alignment between your experience and their top requirements. Include specific metrics.
3. **Match 3 + Differentiator:** Another strong match plus what makes you uniquely valuable beyond the JD.
4. **Close:** Forward-looking, specific next step. NOT "I look forward to hearing from you."

### HE Structure (3–4 פסקאות)
1. **פתיחה:** למה דווקא החברה הזו / התפקיד הזה. אזכור ספציפי של מוצר/פרויקט של החברה.
2. **התאמה 1–2:** חפיפות מרכזיות בין הניסיון שלך לדרישות. עם מטריקות.
3. **התאמה 3 + בידול:** עוד חפיפה + מה ייחודי לך מעבר למה שכתוב בדרישות.
4. **סיום:** הצעה קונקרטית לצעד הבא. **לא** "אשמח להזדמנות לשיחה".

Tone: formal, right-aligned, no English mid-sentence except for tech names wrapped in `<span class="en">`.
