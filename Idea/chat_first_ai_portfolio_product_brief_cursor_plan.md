# Chat‑First AI Portfolio — Product Brief (for Cursor)

*A calm, conversational portfolio where visitors ask questions about Shree work and get cited answers, with a browsable catalog for projects, experience, and education.*

---

## 1) Vision & Goals

**One‑liner:** “Chat with my portfolio.” A conversational interface lets people ask about projects, impact, and skills, while a focused catalog view supports quick scanning and deep dives.

**Primary goals**

- Let recruiters and collaborators understand **impact, skills, and relevance in under 90 seconds**.
- Make complex history **discoverable via natural language** and **structured browsing**.
- Provide **clear calls to action** (download resume, book time, contact, open GitHub/Live links).
- Keep the **home screen calm** and reduce cognitive load.

**Non‑goals**

- A flashy demo site focused on effects over clarity.
- Heavy technical configuration details in the UI (keep it simple).

---

## 2) Target Audiences

- **Recruiters / Hiring Managers:** skim achievements, confirm skill alignment, grab resume, and book time.
- **Engineers / Data folks:** verify depth, architecture thinking, metrics, and links to source/case studies.
- **Mentors / Peers:** compare projects, see progression over time, and understand decision‑making.

**Top questions they bring**

- “Which projects match **AI/ML** or **Full‑Stack** roles?”
- “What did you **personally own**?”
- “What was the **measured impact**?”
- “Can I see the **code / live site / case study**?”
- “How do I **contact** or **book** time?”

---

## 3) North‑Star Experience (Story)

1. Visitor lands on a **calm hero**: short intro + three CTAs: **Start chatting**, **Browse projects**, **Resume/Book**.
2. They type: “Summarize your top 3 AI/ML projects with metrics.”
3. The assistant replies with **concise bullets + source chips** (case study / README / resume), plus one‑click actions (Open Live, GitHub, Case Study).
4. Visitor opens the sidebar, **filters to AI/ML**, **sorts by Impact**, and **compares two projects**. The assistant can “Compare X vs Y” on request.
5. Deep dive panel shows **summary, metrics, stack, and links**, with contextual actions: **Contact about this**, **Book a call**.

---

## 4) Information Architecture

- **Global header (always visible):** icon‑style quick links → **Resume**, **Book**, **Email**, **LinkedIn**, **GitHub**; a small **Context pill** to lock the chat to a selected item.
- **Home / Chat canvas:** the core conversational area.
- **Left sidebar (collapsible):**
  - Switcher: **Projects** / **Experience** / **Education**
  - Projects controls: **Category chips**, **Group (None/Category/Year)**, **Sort (Recent/A–Z/Impact)**, optional **Compare** toggle
  - Filter field (applies to the current pane)
- **Right details panel:** opens when an item is selected. Shows overview, metrics/highlights, stack/tags, and actions.

---

## 5) Interaction Model

**Chat‑first**

- Start with a blank conversation (no auto‑message). A **Hero** invites action.
- Use **suggestion prompts** via a modal (not cluttering the canvas). Example chips: “Summarize me in 3 bullets,” “Compare Project A vs B,” “Open my resume.”
- **Source chips** beneath answers link to the relevant artifact (e.g., case study, README, resume).
- **Context pill**: optionally restrict answers to the currently selected item.

**Browse‑assist**

- Projects list supports **filter**, **group**, and **sort** to handle many items cleanly.
- **Compare mode:** select any two projects → trigger a compare query in chat.
- Selecting an item opens **Details panel** with contextual CTAs (e.g., Contact about this, Book a call).

---

## 6) Content Model (what to prepare)

**Projects** (each item)

- *Title*
- *Year*
- *Category* (e.g., AI/ML, Full‑Stack, Data Engineering)
- *Summary* (2–3 lines, problem → approach → impact)
- *Tags* (skills/topics)
- *Metrics* (3–5 short bullets with numbers)
- *Stack* (tools/tech, high‑level names only)
- *Links*: Live, GitHub, Case Study (optional Blog/Slides)

**Experience** (each role)

- *Title*, *Company*, *Location*, *Dates*
- *Summary* (1–2 lines)
- *Highlights* (4–6 bullets, each with action + metric)
- *Tags* (skills/topics)
- *Link* (company site or relevant artifact)

**Education** (each program)

- *School*, *Degree*, *Location*, *Graduation*
- *Coursework* (6–10 keywords)
- *Tags* (e.g., Graduate, CS)

**Global Links**

- Resume (PDF, optional DOCX)
- Booking page
- Email address
- LinkedIn, GitHub

> Keep everything concise; the assistant can expand in chat.

---

## 7) Home & Layout Principles

- **Calm hero**: short headline + subtext + 3 obvious actions (Chat, Browse, Resume/Book). No busy widgets upfront.
- **Collapsible sidebar**: default **collapsed** on first load for focus.
- **One primary action per area**: chat input in the footer, quick links in the header, detail actions in the right panel.
- **Consistent micro‑copy** and **short labels**.

---

## 8) RAG & Answering (conceptual)

- The assistant answers from curated sources: **project briefs, case studies, READMEs, resume, notes**.
- When appropriate, answers include **citations as clickable chips**.
- **Context‑aware mode**: if a user has a project selected or toggles the context pill, answers are scoped to that item.
- **Guardrails**: if an answer isn’t confidently grounded, the assistant says it and suggests which artifact to open.

> Implementation detail is intentionally omitted; treat retrieval and generation as a black box you’ll configure in dev.

---

## 9) Controls & States

**Projects controls**

- Category chips: single or multi‑select.
- Group: None / Category / Year.
- Sort: Recent / A–Z / Impact (impact = number of metrics or a simple weight).
- Compare: pick two; the chat composes a compare prompt.

**Empty & error states** (examples)

- *No projects match your filters* → “Clear filters” button.
- *No sources found for this answer* → “Open Resume” / “Open Case Study.”
- *Network issue* → friendly retry wording.

**Loading**

- Subtle skeletons or shimmer where content appears.

---

## 10) Calls to Action

- **Header (global):** Resume, Book, Email, LinkedIn, GitHub.
- **Details panel (contextual):** Live, GitHub, Case Study, **Contact about this**, **Book a call**.
- **Chat suggestions:** “Open my resume,” “Book a call,” “Compare X vs Y,” “Summarize experience at Company.”

---

## 11) Accessibility & Inclusivity

- Keyboard‑navigable: all controls reachable in a logical order.
- Clear focus states and hit targets; avoid tiny pills for critical actions.
- Sufficient color contrast and readable sizes.
- Avoid jargon in default copy; keep answers simple and scannable.

---

## 12) Mobile & Responsiveness

- **Mobile home:** hero + single input; sidebar turns into a sheet.
- **Details panel:** becomes a slide‑up drawer.
- **Quick links:** compact icon bar in the header.
- Chat messages wrap comfortably; source chips stack.

---

## 13) Analytics (privacy‑respecting)

Track only what’s needed to improve UX:

- Clicks on: Resume, Book, Email, GitHub, LinkedIn, Live, Case Study.
- Chat intents (e.g., compare, summarize, ask about role).
- Filter usage (which categories/sorts are popular).
- Conversion proxy: Resume downloaded and Book clicked within the same session.

---

## 14) Copy & Tone

- **Voice:** friendly, confident, concise.
- **Messages:** prefer **3–5 bullet answers** with a one‑line TL;DR when complex.
- **Always offer a next action:** “Open case study,” “Compare with RealWaste,” “Book a call.”

**Microcopy snippets**

- Placeholder: “Ask about projects, roles, or courses…”
- Empty: “No matches. Try clearing filters or ask in chat.”
- Low confidence: “I’m not fully sure — want to open the case study or resume for details?”

---

## 15) Prompt Shelf (examples)

- “Give me a quick summary of Nakshatra in 3 bullets.”
- “Which 2 projects best match an AI/ML role? Include metrics.”
- “Compare GlobePulse vs RealWaste — problem, data, approach, impact.”
- “What did you personally build on Pond?”
- “Which coursework aligns with data engineering?”
- “Open my resume.” / “Book a call.”

---

## 16) Success Metrics

- Time to first meaningful answer **< 20 seconds**.
- Resume click‑through **> 30%** of qualified sessions.
- Book‑a‑call click‑through **> 10%** of qualified sessions.
- Visitor satisfaction (quick poll) **> 4/5**.

---

## 17) Acceptance Criteria (MVP)

- Calm home hero with three clear CTAs.
- Chat answers with **source chips** and **context pill** support.
- Sidebar with **Projects / Experience / Education** and working **filter/group/sort** for Projects.
- Project **Compare** flow that injects a compare prompt to chat.
- Details panel with **metrics, stack/tags, and contextual CTAs**.
- Global quick links: **Resume, Book, Email, LinkedIn, GitHub**.

---

## 18) Launch Checklist (content)

- ✅ Resume PDF (hosted) + optional DOCX.
- ✅ Booking link (calendar).
- ✅ Email address.
- ✅ GitHub + LinkedIn.
- ✅ For each project: title, year, category, 2–3 line summary, 3–5 metrics, tags, stack, links (Live/GitHub/Case study).
- ✅ For each role: summary + 4–6 highlights with metrics.
- ✅ Education: program details and coursework keywords.

---

## 19) Roadmap

**v1 (MVP)**

- Chat + browse with details panel, quick links, citations, and compare.

**v1.1**

- Prompt “shelf” editor (easily add/remove suggestions).
- Saved views (e.g., “Recruiter view: AI/ML + Impact sort”).

**v2**

- Optional persona‑aware tone (Recruiter vs Peer mode).
- One‑pager export per project (auto‑generated PDF).
- Lightweight feedback (“Was this helpful?”) after answers.

---

## 20) Notes for Cursor (non‑technical)

- Treat chat, browsing, and details as **separate concerns** organized cleanly.
- Keep **configuration for content** in a single place (projects, roles, education, links).
- The assistant should **always cite** when pulling from a specific artifact.
- Keep components small and the home experience uncluttered; avoid auto messages; let the user lead.

---

**That’s it — a clear, non‑technical plan you can hand to Cursor.**
