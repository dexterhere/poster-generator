# Academic Poster Generator — Project Plan

**Document version:** 1.0  
**Prepared by:** Prince Bhagat  
**Date:** March 2026  
**Purpose:** Full planning document for a web-based academic poster creation and download tool

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals and Non-Goals](#2-goals-and-non-goals)
3. [Target Users](#3-target-users)
4. [Core Features](#4-core-features)
5. [Layout System](#5-layout-system)
6. [Section Types and Content Blocks](#6-section-types-and-content-blocks)
7. [Image and Diagram Upload](#7-image-and-diagram-upload)
8. [AI-Assisted Content Generation](#8-ai-assisted-content-generation)
9. [Customisation Options](#9-customisation-options)
10. [Export and Download](#10-export-and-download)
11. [User Flow — Step by Step](#11-user-flow--step-by-step)
12. [Tech Stack Recommendation](#12-tech-stack-recommendation)
13. [Page and Screen Structure](#13-page-and-screen-structure)
14. [Data Model](#14-data-model)
15. [Development Phases](#15-development-phases)
16. [Open Questions and Future Ideas](#16-open-questions-and-future-ideas)

---

## 1. Project Overview

The Academic Poster Generator is a web application that allows any student or researcher to create a professional, print-ready academic poster without needing design experience or software like PowerPoint or Adobe Illustrator.

The user fills in their project details through a guided form, optionally uploads images or diagrams, chooses a layout, and then downloads a ready-to-print A1-sized poster as a PDF or HTML file.

The tool is designed to be **general purpose** — it works for any university project, any subject, and any level of student. It is not tied to any specific institution or project type.

### What makes this different from other tools

Most poster tools (like Canva or PowerPoint) require the user to design everything from scratch. This tool does the opposite — it starts from a structured academic template and lets the user fill in the content. The structure, spacing, grid, and typography are all handled automatically. The user focuses only on their content.

---

## 2. Goals and Non-Goals

### Goals

- Allow students to create a complete academic poster in under 30 minutes
- Support any project type — computing, science, business, arts, and more
- Allow full layout customisation through a drag-and-resize grid system
- Let users upload their own images and diagrams (SVG, PNG, JPG)
- Provide AI-assisted writing prompts to help users fill in each section
- Export a high-quality, print-ready A1 poster as a PDF
- Work entirely in the browser — no installation required
- Be free to use at the basic level

### Non-Goals (for now)

- This is not a general design tool — it is specifically for academic posters
- It will not support real-time collaboration between multiple users in version 1
- It will not connect to university systems or student portals
- It will not store posters permanently in a database in version 1 (local save only)

---

## 3. Target Users

| User Type | Description | Key Need |
|---|---|---|
| Final year undergraduate | Creating a poster for project defense or presentation | Fast, guided, structured |
| Postgraduate / Masters student | Research poster for conference or viva | More flexibility and academic detail |
| PhD researcher | Conference poster | Full customisation and brand control |
| Academic staff | Creating example posters or templates for students | Template saving and sharing |

The primary target for version 1 is **final year undergraduate students** who need to create a poster for their project defense and have limited time.

---

## 4. Core Features

### 4.1 Guided Poster Builder

A step-by-step form that collects all the information needed for the poster. Each step corresponds to one section of the poster. Users can go back and edit any step at any time.

### 4.2 Live Preview

As the user fills in information, the poster preview on the right side of the screen updates in real time. The user can see exactly what their poster looks like before downloading.

### 4.3 Drag-and-Resize Grid

The poster is built on a grid system. Users can:
- Move sections to different positions in the grid
- Resize sections by dragging the edges (a section can span 1, 2, or 3 columns and 1, 2, or 3 rows)
- Add new sections
- Remove sections they do not need

### 4.4 Image and Diagram Upload

Any section can be converted into an image block. Users can upload a PNG, JPG, or SVG file and it will be placed inside the section with the correct aspect ratio. This is designed for use case diagrams, Gantt charts, ERDs, architecture diagrams, and any other visual.

### 4.5 AI Content Prompts

Each section has an AI helper button. When clicked, it gives the user a ready-made prompt they can copy and paste into any AI tool (such as ChatGPT or Claude). The prompt is pre-filled with the section type and asks for content in the exact format the poster needs. This keeps the tool accessible even without direct API integration.

Optionally (in a later version), the AI can be connected directly so the user types their description and the section is filled in automatically.

### 4.6 Template System

Users can start from a pre-built template. Templates are organised by subject area (Computing, Science, Business, etc.) and by poster type (Project Defense, Conference, Research Showcase). Each template sets up the grid layout, section order, and colour theme.

### 4.7 Download as PDF (A1 size)

Once the poster is ready, the user clicks Download and gets a PDF file sized at A1 (594mm × 841mm) which they can take to any print shop.

---

## 5. Layout System

### 5.1 Grid Structure

The poster body uses a **3-column grid with up to 4 rows**. Each cell in the grid is one section slot. Sections can span multiple columns or rows.

```
+------------+------------+------------+
|            |            |            |   Row 1
|  (0,0)     |  (0,1)     |  (0,2)     |
+------------+------------+------------+
|            |            |            |   Row 2
|  (1,0)     |  (1,1)     |  (1,2)     |
+------------+------------+------------+
|            |            |            |   Row 3
|  (2,0)     |  (2,1)     |  (2,2)     |
+------------+------------+------------+
|            |            |            |   Row 4 (optional)
|  (3,0)     |  (3,1)     |  (3,2)     |
+------------+------------+------------+
```

The header and footer are fixed and not part of the grid.

### 5.2 Span Rules

- A section can span **1, 2, or 3 columns** horizontally
- A section can span **1 or 2 rows** vertically
- Sections cannot overlap — the grid enforces valid placement
- If a section is resized, adjacent sections adjust automatically

### 5.3 Default Layout (Academic Project Defense)

This is the recommended default layout for university project posters:

| Position | Section |
|---|---|
| (0,0) | Introduction |
| (0,1) | Literature Review |
| (0,2) | Process Flow or System Architecture |
| (1,0) | Aims and Objectives |
| (1,1) | Diagram (Use Case / ERD / Class) |
| (1,2) | Testing Approaches |
| (2,0) | Project Process / Gantt Chart |
| (2,1) | Evaluation and Reflection |
| (2,2) | Conclusion and Future Scope |

### 5.4 Alternative Layouts

| Layout Name | Description |
|---|---|
| Research Poster | Introduction, Background, Methodology, Results, Discussion, Conclusion |
| Conference Poster | Title block, Abstract, Key Findings, Visual, Acknowledgements |
| Science Project | Hypothesis, Method, Results, Analysis, Conclusion |
| Business Proposal | Problem, Solution, Market, Plan, Team, Contact |

---

## 6. Section Types and Content Blocks

Each section in the grid has a **type** that controls how it looks and what content it accepts. The following section types are supported:

### 6.1 Text Section

Plain text content with a section title. Supports paragraphs and bullet points. Used for Introduction, Aims, Evaluation, Conclusion, and similar written sections.

**Fields:**
- Section title (short label shown at the top of the card)
- Body text (multi-paragraph, supports bullet points)
- Optional highlight box (a coloured box for a key quote or summary)

### 6.2 Table Section

A structured data table with a title. Used for Literature Review, test case summaries, comparison tables, and results.

**Fields:**
- Section title
- Column headers (user defines how many, minimum 2, maximum 6)
- Table rows (user adds rows one by one)
- Highlight colour for key cells (optional)

### 6.3 Image / Diagram Section

An image upload area. Used for diagrams, charts, screenshots, and any visual content. The image fills the section while maintaining aspect ratio.

**Fields:**
- Section title
- Image upload (SVG, PNG, JPG — recommended SVG or PNG for quality)
- Caption text (shown below the image)
- Image fit option: contain (show full image) or cover (fill the box)

**Recommended use cases:**
- Use Case Diagram — upload as SVG or PNG
- ERD (Entity Relationship Diagram) — upload as SVG or PNG
- Class Diagram — upload as SVG or PNG
- Gantt Chart — upload as PNG (one image per Gantt, or use the split Gantt section)
- System Architecture — upload as SVG or PNG
- Screenshots — upload as PNG

### 6.4 Split Image Section (Two Images Side by Side)

A section divided into two equal halves, each holding one image. Used specifically for showing two versions of the same thing — for example, the original Gantt chart and the updated Gantt chart side by side.

**Fields:**
- Section title
- Left image: upload + label (e.g. "Initial Plan")
- Right image: upload + label (e.g. "Final Progress")

### 6.5 Flow / Steps Section

A numbered step-by-step vertical flow. Each step has a name and a short description. Used for showing process flows, workflows, or system journeys.

**Fields:**
- Section title
- List of steps (each step has a name and a description, minimum 3, maximum 8)
- Highlight steps (optional — marks certain steps with a different colour)

### 6.6 Stats Section

A row of 2 to 6 stat boxes, each showing a number or short value with a label. Used for showing key project facts at a glance.

**Fields:**
- Section title
- List of stats (each stat has a value and a label)

### 6.7 List Section

A plain numbered or bulleted list. Used for objectives, requirements, key findings, or any list of items.

**Fields:**
- Section title
- List items (bullet or numbered)
- Optional tag for each item (short label shown as a coloured pill on the left)

---

## 7. Image and Diagram Upload

### 7.1 Accepted Formats

| Format | Recommended Use | Notes |
|---|---|---|
| SVG | Diagrams, flowcharts, use cases, ERDs | Best quality — scales to any size without blur |
| PNG | Screenshots, charts exported from tools, Gantt charts | Good quality — use high resolution (at least 300 DPI for print) |
| JPG / JPEG | Photos or scanned images | Acceptable — avoid for diagrams as quality may reduce when printed |

### 7.2 Upload Behaviour

- The user clicks an upload zone inside the section
- A file picker opens — only accepted formats are selectable
- The image is shown immediately inside the section in the live preview
- The user can replace the image at any time by clicking the upload zone again
- Images are stored in the browser (not uploaded to a server) in version 1

### 7.3 Image Size Guidance

The tool will show a warning if an uploaded image is too small for print quality. For A1 print size, images should be at minimum:

| Section size | Minimum recommended resolution |
|---|---|
| 1 column × 1 row | 800 × 600 px |
| 2 columns × 1 row | 1600 × 600 px |
| Full width | 2400 × 600 px |

SVG files are exempt from this check as they scale without quality loss.

### 7.4 Diagram Tools that Export SVG or PNG

Students can create their diagrams in these free tools and then upload the exported file:

| Tool | What it is good for | Export format |
|---|---|---|
| Draw.io (diagrams.net) | Use case, ERD, flowcharts, architecture | SVG, PNG |
| Lucidchart | Professional diagrams | SVG, PNG |
| Mermaid Live Editor | Code-based diagrams | SVG, PNG |
| Figma (free tier) | UI mockups, system diagrams | SVG, PNG |
| Microsoft Visio | All diagram types | PNG |
| Excel / Google Sheets | Gantt charts | PNG (screenshot) |

---

## 8. AI-Assisted Content Generation

### 8.1 Prompt Helper Mode (Version 1)

Each section has a button labelled "Get AI Help". When clicked, it shows a ready-made prompt that the user can copy and paste into any AI assistant (ChatGPT, Claude, Gemini, etc.).

The prompt is pre-filled with:
- The section type and what it needs to contain
- A description of the exact output format expected
- Placeholders for the user to fill in their project details

**Example prompt for Introduction section:**

```
Write a clear and simple introduction for an academic poster about my project.

Project name: [YOUR PROJECT NAME]
What the project does: [ONE OR TWO SENTENCES]
Who uses it: [LIST THE USER TYPES]
What problem it solves: [THE MAIN PROBLEM IT ADDRESSES]
Key technology used: [MAIN TECHNOLOGIES]

Write 3 short paragraphs. Use simple language. Avoid complex technical words.
The first paragraph should explain what the system is and what it does.
The second paragraph should explain who uses it and how.
The third paragraph should explain why it is different or better than existing solutions.
Keep each paragraph to 3-4 sentences maximum.
```

**Example prompt for Literature Review table:**

```
Create a literature review table for an academic poster about my project.

Project topic: [YOUR PROJECT TOPIC]
Academic question: [YOUR ACADEMIC QUESTION]

Find or suggest 5 to 6 relevant research papers published between 2020 and 2025.
For each paper, provide:
- Author(s) and year
- Study focus (one short sentence)
- Key finding (one sentence, bold the most important number or result if there is one)
- Relevance to my project (one sentence explaining how it connects)

Return the result as a simple list with four fields per entry so I can put it in a table.
```

### 8.2 Direct AI Mode (Version 2)

In a later version, the tool will connect directly to an AI API. The user types a short description of their project and the AI automatically fills in suggested content for each section. The user can then edit, accept, or reject the suggestions.

### 8.3 Section-Specific Prompts

Every section type has its own pre-written prompt template:

| Section | Prompt focus |
|---|---|
| Introduction | Project summary, users, problem, technology |
| Literature Review | Research papers, findings, relevance |
| Aims and Objectives | One aim + 4-5 SMART objectives |
| Process Flow | Step-by-step journey through the system |
| Testing Approaches | Testing types used and what was tested |
| Evaluation and Reflection | What went well, challenges, lessons learned |
| Conclusion and Future Scope | Summary + 4-5 future ideas |

---

## 9. Customisation Options

### 9.1 Colour Themes

The user can select from a set of pre-defined colour themes. The theme controls the header background, card header background, badge colours, table header colour, and accent colours.

| Theme name | Primary colour | Good for |
|---|---|---|
| Teal | #0D7377 | Computing, Technology |
| Navy | #1A3A5C | Business, Engineering |
| Forest | #1E6B35 | Science, Environment |
| Slate | #2D3B55 | Research, Academic |
| Burgundy | #6B1E2D | Arts, Humanities |
| Custom | User picks any hex colour | Any project |

### 9.2 Font Selection

The user can choose from a small set of font pairings. Each pairing has a display font for headings and a body font for content.

| Pairing name | Display font | Body font |
|---|---|---|
| Classic Academic | Lora (serif) | IBM Plex Sans |
| Modern | DM Serif Display | DM Sans |
| Clean | Playfair Display | Source Sans 3 |
| Simple | Georgia | Arial |

### 9.3 Section Border Style

The user can choose how section cards look:

- **Thin border** — 1px border around each card (default, clean look)
- **Top accent** — coloured top border only, white sides
- **Shadow** — soft drop shadow, no border
- **Filled header** — card header has a coloured background band

### 9.4 Section Sizing

Each section can be resized by dragging its edges in the grid. The section size is expressed as column span × row span. The user can also type in exact values from a settings panel.

### 9.5 Section Order

Sections can be reordered by dragging and dropping them within the grid. The grid will not allow overlapping — if a section is moved to a position that is already occupied, it will swap with the existing section.

### 9.6 Header Layout

The header has three zones: left, centre, and right. The user can choose what goes in each zone:

**Left zone options:** University logo upload, institution name text, nothing  
**Centre zone options:** Project title + student details (default), custom text, project title only  
**Right zone options:** College logo upload, institution name text, nothing  

### 9.7 Footer

The footer is a single line at the bottom of the poster. The user can type their own footer text or use the default (name, student ID, institution, year).

---

## 10. Export and Download

### 10.1 Download as PDF (A1)

The primary export option. The poster is rendered as a full A1 PDF (594mm × 841mm in portrait or 841mm × 594mm in landscape) at 150 DPI minimum.

**How it works technically:**
- The poster HTML is rendered in a hidden full-size container
- The browser's print API is used with A1 paper size and no margins
- The user sees a print dialog or the file saves directly depending on the browser

### 10.2 Download as HTML

A self-contained HTML file that includes all styles and base64-encoded images inline. This file can be opened in any browser and printed later, or shared with a supervisor for review.

### 10.3 Save as Draft (Local)

The poster data (all text, layout, settings — but not images) is saved to the browser's local storage as a JSON file. The user can download this JSON file and re-upload it later to continue editing.

Images are not included in the draft save. The user will need to re-upload images when continuing.

### 10.4 Print Instructions Shown to User

After downloading, the tool shows clear instructions:

```
To print your poster at A1 size:
1. Take the downloaded PDF file to a print shop
2. Ask for A1 size (594mm × 841mm) on matte or gloss poster paper
3. Select "fit to page" if asked — the poster is already sized correctly
4. For best quality, ask for 150 DPI or higher
```

---

## 11. User Flow — Step by Step

```
Start
  |
  v
[ Choose a template or start blank ]
  |
  v
[ Step 1: Header Details ]
  - Upload university logo (optional)
  - Upload college logo (optional)
  - Enter project title
  - Enter name, student ID, supervisor, reader
  - Enter academic question (optional)
  |
  v
[ Step 2: Choose Layout ]
  - Select from pre-defined layouts (3x3 default, research, science, etc.)
  - Or start from a blank 3x3 grid
  |
  v
[ Step 3: Fill In Each Section ]
  - For each section in the grid:
      - Choose section type (text, table, image, flow, etc.)
      - Fill in the content
      - Optionally use AI prompt helper
      - Optionally upload an image
  - Live preview updates on the right side as the user types
  |
  v
[ Step 4: Customise Appearance ]
  - Choose colour theme
  - Choose font pairing
  - Choose border style
  - Resize or reorder sections if needed
  |
  v
[ Step 5: Preview and Check ]
  - Full-screen preview of the final poster
  - Checklist shown: title present, all sections filled, images uploaded
  |
  v
[ Step 6: Download ]
  - Download as PDF (A1)
  - Download as HTML
  - Save draft as JSON
  |
  v
Done
```

---

## 12. Tech Stack Recommendation

### Frontend (Web App)

| Technology | Purpose | Why |
|---|---|---|
| Next.js (React) | Main web framework | Good for interactive UI, easy to deploy |
| Tailwind CSS | Styling | Fast to build with, consistent design |
| React DnD or dnd-kit | Drag and drop for grid layout | Well supported, works with React |
| html2canvas + jsPDF | PDF export | Converts HTML to PDF in the browser |
| Zustand | State management | Simple, lightweight for form and layout state |
| React Hook Form | Form handling for step-by-step input | Clean validation |

### AI Integration (Version 2)

| Technology | Purpose |
|---|---|
| Anthropic Claude API | Generate section content from user description |
| Vercel Edge Functions | Serverless API route to call Claude without exposing API key |

### Storage (Version 1 — No Backend)

All data stays in the browser. No database needed for version 1. The JSON draft file handles saving and loading.

### Storage (Version 2 — With Accounts)

| Technology | Purpose |
|---|---|
| Supabase (PostgreSQL) | Store user accounts and saved posters |
| Supabase Auth | Login and signup |
| Supabase Storage | Store uploaded images |

### Deployment

| Service | Purpose |
|---|---|
| Vercel | Host the Next.js app (free tier is enough for version 1) |
| GitHub | Source code version control |

---

## 13. Page and Screen Structure

### 13.1 Landing Page (`/`)

- Short explanation of what the tool does
- "Create your poster" button
- Example poster thumbnails showing different templates
- No login required to start

### 13.2 Builder Page (`/builder`)

- Left panel: Step-by-step form (collapsible)
- Right panel: Live poster preview (scales to fit screen)
- Top bar: Step progress indicator, save draft, download buttons
- Bottom bar: Colour theme picker, font selector, border style

### 13.3 Preview Page (`/preview`)

- Full-width poster preview
- Download buttons
- Back to edit button
- Print guide shown below the poster

### 13.4 Templates Page (`/templates`)

- Grid of available templates with thumbnails
- Filterable by subject (Computing, Science, Business, etc.)
- Click a template to open it in the builder

### 13.5 Help Page (`/help`)

- Answers to common questions
- How to export and print
- How to use the AI prompt helper
- Recommended diagram tools and how to export from them

---

## 14. Data Model

The poster data is stored as a single JSON object. This is what gets saved as a draft and loaded back.

```json
{
  "poster": {
    "id": "unique-poster-id",
    "createdAt": "2026-03-31",
    "updatedAt": "2026-03-31",

    "header": {
      "universityLogoUrl": null,
      "collegeLogoUrl": null,
      "projectTitle": "CampusSync: University Management and Gamification System",
      "studentName": "Prince Bhagat",
      "studentId": "2406779",
      "supervisorName": "Mr. Bhanu Aryal",
      "readerName": "Mr. Subash Bista",
      "academicQuestion": "How can gamification improve student engagement?"
    },

    "footer": {
      "text": "Prince Bhagat | 2406779 | Herald College Kathmandu | 2025-2026"
    },

    "layout": {
      "orientation": "landscape",
      "rows": 3,
      "columns": 3
    },

    "theme": {
      "primaryColor": "#0D7377",
      "fontPairing": "classic-academic",
      "borderStyle": "thin"
    },

    "sections": [
      {
        "id": "section-1",
        "gridPosition": { "row": 0, "col": 0, "rowSpan": 1, "colSpan": 1 },
        "type": "text",
        "title": "Introduction",
        "content": {
          "body": "CampusSync is a gamified university management platform...",
          "highlightBox": "The key innovation: digital points redeemable at the campus canteen."
        }
      },
      {
        "id": "section-2",
        "gridPosition": { "row": 0, "col": 1, "rowSpan": 1, "colSpan": 1 },
        "type": "table",
        "title": "Literature Review",
        "content": {
          "columns": ["Author & Year", "Study Focus", "Key Finding", "Relevance"],
          "rows": [
            ["Meng et al. (2024)", "Gamification in online learning", "+15% participation", "Confirms points system works"]
          ]
        }
      },
      {
        "id": "section-3",
        "gridPosition": { "row": 0, "col": 2, "rowSpan": 1, "colSpan": 1 },
        "type": "flow",
        "title": "App Process Flow",
        "content": {
          "steps": [
            { "name": "Student completes a task", "description": "Submits assignment or attends class", "highlight": false },
            { "name": "Points are awarded", "description": "Added to student account automatically", "highlight": false },
            { "name": "Reward selected", "description": "Student picks item from canteen catalog", "highlight": true },
            { "name": "QR code generated", "description": "Encrypted one-time use code shown on screen", "highlight": true }
          ]
        }
      },
      {
        "id": "section-gantt",
        "gridPosition": { "row": 2, "col": 0, "rowSpan": 1, "colSpan": 1 },
        "type": "split-image",
        "title": "Project Process — Gantt Chart",
        "content": {
          "leftImageUrl": null,
          "leftLabel": "Initial Plan",
          "rightImageUrl": null,
          "rightLabel": "Final Progress"
        }
      }
    ]
  }
}
```

---

## 15. Development Phases

### Phase 1 — Core Builder (Weeks 1–4)

**Goal:** A working poster builder that can produce and download a poster.

- [ ] Set up Next.js project with Tailwind CSS
- [ ] Build the header section form (title, name, logos)
- [ ] Build the 3×3 grid layout with fixed default positions
- [ ] Build all section type components (text, table, image, flow, list, stats)
- [ ] Build the live preview panel
- [ ] Build the colour theme switcher
- [ ] Build PDF download using html2canvas and jsPDF
- [ ] Build HTML download (inline everything)
- [ ] Build JSON draft save and load
- [ ] Deploy to Vercel

**Deliverable:** Users can create a poster with all section types, customise the theme, and download it as a PDF.

---

### Phase 2 — Image Upload and Diagram Support (Weeks 5–6)

**Goal:** Allow users to upload images and diagrams into any section.

- [ ] Build image upload component (drag-and-drop + file picker)
- [ ] Build the image section type with caption and fit options
- [ ] Build the split-image section type (for two Gantt charts side by side)
- [ ] Add image resolution warning for print quality
- [ ] Add support for SVG display inline
- [ ] Test upload and preview with SVG, PNG, and JPG files

**Deliverable:** Users can upload their own diagrams and images into any section and they appear correctly in the downloaded poster.

---

### Phase 3 — Layout Customisation (Weeks 7–8)

**Goal:** Let users move, resize, and reorder sections.

- [ ] Add drag-and-drop section reordering using dnd-kit
- [ ] Add column span control (1, 2, or 3 columns per section)
- [ ] Add row span control (1 or 2 rows per section)
- [ ] Enforce grid rules (no overlap, valid positions only)
- [ ] Add the ability to add a new blank section to any empty grid cell
- [ ] Add the ability to delete a section

**Deliverable:** Users have full control over the grid layout of their poster.

---

### Phase 4 — Templates and AI Prompt Helper (Weeks 9–10)

**Goal:** Give users a faster starting point and help them write better content.

- [ ] Build at least 4 templates (Academic Project, Research, Science, Business)
- [ ] Build the templates browsing page with thumbnails
- [ ] Build the AI prompt helper panel (shows copy-paste prompts per section)
- [ ] Write prompt templates for all section types
- [ ] Add a "Use this prompt" button that copies the prompt to clipboard
- [ ] Add the help page with printing instructions and diagram tool guidance

**Deliverable:** Users can start from a template and use AI prompts to fill in their sections faster.

---

### Phase 5 — Polish, Testing, and Launch (Weeks 11–12)

**Goal:** Make the tool reliable, easy to use, and ready for real students.

- [ ] Test PDF export on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile and tablet (view-only, editing stays desktop)
- [ ] Fix any layout or spacing issues in the downloaded PDF
- [ ] Add loading indicators and error messages
- [ ] Add a checklist in the preview step (warn if title is missing, sections are empty)
- [ ] Write user-facing help text for every form field
- [ ] Add a feedback button so users can report issues
- [ ] Final deployment and testing

**Deliverable:** A polished, stable tool ready for students to use.

---

### Phase 6 — Optional Future Features (Post Launch)

- [ ] Direct AI integration (auto-fill sections using Claude API)
- [ ] User accounts and cloud-saved posters (Supabase)
- [ ] Cloud image storage so users do not need to re-upload on every edit
- [ ] Share poster as a public link (read-only view)
- [ ] More templates (Conference Poster, Research Showcase, etc.)
- [ ] Institution branding (colleges can set their own logo and colours as default)
- [ ] Multi-language support

---

## 16. Open Questions and Future Ideas

### Open Questions

1. **Image storage in version 1:** Images are stored in the browser only. If the user clears browser storage, images are lost. Should we base64-encode images into the JSON draft so they are included in the save file? This makes the file larger but keeps everything together.

2. **PDF quality:** html2canvas produces a raster PDF, not a vector PDF. For A1 print quality this may cause blurriness on text. Should we use a server-side PDF rendering approach (like Puppeteer on a serverless function) for better quality?

3. **Section minimum size:** What is the minimum size a section can be resized to before the content becomes unreadable? We need to define a minimum column and row span.

4. **Mobile editing:** Should users be able to edit their poster on a phone? The grid layout is complex for small screens. A possible solution is to allow form editing on mobile but show a message that preview and download are best on desktop.

### Future Ideas

- **QR code in poster:** Allow users to add a QR code section that links to their GitHub repository, project demo, or any URL.
- **Export as image:** Export the poster as a single high-resolution PNG in addition to PDF and HTML.
- **Version history:** Keep the last 5 versions of the poster so the user can go back if they accidentally delete content.
- **Collaboration:** Allow two users to edit the same poster at the same time using shared state (WebSockets or Liveblocks).
- **Institution dashboard:** A special view for university coordinators to see all student posters, download them in bulk, and mark them as approved.

---

*End of document*

---

**Document maintained by:** Prince Bhagat  
**Last updated:** March 2026  
**Version:** 1.0