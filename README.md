# PosterGen — Academic Poster Builder

A browser-based academic poster builder built with React, TypeScript, and Vite. Design, customise, and export professional A1 academic posters with a Canva-like drag-and-drop canvas — no design experience required.

---

## Features

- **Canvas-first editor** — drag, resize, and position sections anywhere on the poster with pixel-perfect control
- **8 section types** — Text, Image, Split Image, Table, Process Flow, List, Stats/Metrics, Research Question
- **4 header layouts** — Academic, Banner, Centred, Minimal — each with full font and size controls
- **4 info-bar templates** — Inline, Stacked, 2-Row, Grid for student/supervisor/reader details
- **Theme controls** — primary colour, font pairings, border styles, ruler, footer
- **Save & load** — export/import your work as JSON; load AI-generated drafts
- **PDF export** — print-ready A1 output via the browser print dialog
- **The AI God** — built-in AI guide to auto-generate a full poster from your project documents

---

## Prerequisites

Make sure the following are installed on your machine before you begin:

| Tool | Minimum Version | Check |
|------|----------------|-------|
| [Node.js](https://nodejs.org/) | 18.x or higher | `node -v` |
| npm | 9.x or higher | `npm -v` |
| Git | Any recent version | `git --version` |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/poster-presentation.git
cd poster-presentation
```

> Replace `your-username` with the actual GitHub username or organisation.

---

### 2. Install root dependencies

The root `package.json` contains shared dev dependencies (Tailwind, PostCSS, type definitions).

```bash
npm install
```

---

### 3. Install app dependencies

The React application lives inside the `app/` subdirectory and has its own `package.json`.

```bash
cd app
npm install
```

---

### 4. Start the development server

From inside the `app/` directory:

```bash
npm run dev
```

Or from the **root** directory (uses the root-level shortcut script):

```bash
cd ..
npm run dev
```

The app will start at **http://localhost:5173** (Vite default). Open that URL in your browser.

---

### 5. Build for production

From inside `app/`:

```bash
npm run build
```

The compiled output is placed in `app/dist/`. You can serve it with any static file host.

To preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```
poster-presentation/
├── app/                          # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── editor/           # Per-section content editors
│   │   │   │   ├── SectionEditor.tsx
│   │   │   │   ├── TextEditor.tsx
│   │   │   │   ├── TableEditor.tsx
│   │   │   │   ├── FlowEditor.tsx
│   │   │   │   ├── ImageEditor.tsx
│   │   │   │   ├── ListEditor.tsx
│   │   │   │   ├── StatsEditor.tsx
│   │   │   │   └── QuestionEditor.tsx
│   │   │   ├── layout/           # App chrome & modals
│   │   │   │   ├── TopBar.tsx
│   │   │   │   ├── LeftPanel.tsx
│   │   │   │   ├── RightInspector.tsx
│   │   │   │   └── AIGuideModal.tsx
│   │   │   ├── panels/           # Left-panel tab contents
│   │   │   │   ├── HeaderPanel.tsx
│   │   │   │   ├── SectionsListPanel.tsx
│   │   │   │   ├── ThemePanel.tsx
│   │   │   │   └── ExportPanel.tsx
│   │   │   ├── poster/           # The canvas and header/footer
│   │   │   │   ├── PosterCanvas.tsx
│   │   │   │   ├── PosterHeader.tsx
│   │   │   │   ├── PosterFooter.tsx
│   │   │   │   └── PosterRuler.tsx
│   │   │   └── sections/         # Section renderers
│   │   │       ├── TextSection.tsx
│   │   │       ├── TableSection.tsx
│   │   │       ├── FlowSection.tsx
│   │   │       ├── ImageSection.tsx
│   │   │       ├── SplitImageSection.tsx
│   │   │       ├── ListSection.tsx
│   │   │       ├── StatsSection.tsx
│   │   │       └── QuestionSection.tsx
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx   # Home / template picker
│   │   │   └── BuilderPage.tsx   # Main editor shell
│   │   ├── store/
│   │   │   └── usePosterStore.ts # Zustand global state
│   │   ├── utils/
│   │   │   └── colorUtils.ts     # hexOpacity helper
│   │   ├── index.css             # Tailwind + global styles
│   │   └── main.tsx              # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── plan/                         # Planning documents
│   └── plan_v2.md
├── package.json                  # Root scripts & shared deps
└── README.md
```

---

## How to Use the Editor

### Adding sections

Right-click anywhere on the blank poster canvas to open the section menu. Choose from:

| Section Type | Best used for |
|-------------|--------------|
| Text | Abstracts, introductions, methodology, conclusions |
| Image | Diagrams, screenshots, figures |
| Split Image | Before/after comparisons, dual diagrams |
| Table | Literature review, comparison tables |
| Process Flow | Methodology steps, pipelines, workflows |
| List | Bullet-point findings, objectives |
| Stats / Metrics | Key numbers, percentages, counts |
| Research Question | Highlighted central question |

### Moving and resizing

- **Drag** the coloured title bar of a section to move it
- **Drag the edges or corners** to resize
- Click a section to select it — the right inspector opens with formatting controls
- Use the **toolbar above** a selected section to centre it horizontally or vertically, or delete it

### Header

Click **Header** in the top navigation to edit:
- Layout template (Academic / Banner / Centred / Minimal)
- Title font size and header height via sliders
- Info-bar layout (Inline / Stacked / 2-Row / Grid)
- Info-bar text size
- Student name, Student ID, Supervisor, Reader, Department, Institution, Year
- University and college logo uploads

### Theme

Click **Theme** to change:
- Primary accent colour
- Font pairing
- Section border style
- Enable/disable ruler and footer

### Saving your work

Click **Save & Export** to:
- **Save Draft as JSON** — downloads your full poster state as a `.json` file
- **Load Draft from JSON** — restores a previously saved or AI-generated poster
- **Export PDF** — opens the browser print dialog with the correct A1 page size pre-configured

---

## Using AI to Generate Your Poster

PosterGen includes a built-in AI workflow to auto-populate a full 9-section poster from your project documents.

1. Click **Save & Export** → **Download JSON Template** to get the poster schema
2. Click **The AI God** button (top right, next to Export PDF)
3. Follow the 8-step guide in the modal
4. Copy the pre-written prompt, open Claude (or any capable AI), attach your documents and the template file, and send
5. Download the JSON the AI returns
6. Click **Load Draft from JSON** to import it
7. Rearrange and refine the sections on the canvas

> **Recommended AI:** [Claude](https://claude.ai) produces the most reliable structured JSON output for this workflow.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Escape` | Deselect the current section |
| `Delete` / `Backspace` | Delete the selected section (when not typing in an input) |
| `Ctrl + Scroll` | Zoom in / out on the canvas |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| State management | Zustand 5 |
| Drag & resize | react-rnd |
| Routing | React Router DOM 7 |
| Icons | Lucide React |
| PDF export | Browser Print API (`window.print`) |

---

## Common Issues

**Port already in use**
```bash
# Vite will automatically try the next available port (5174, 5175, …)
# or specify one explicitly:
npm run dev -- --port 3000
```

**Styles not loading**
Make sure you ran `npm install` inside the `app/` directory, not just the root.

**PDF export cuts off content**
The poster is sized for A1 (841 × 594 mm landscape). If content appears cut off, check that your browser print settings have margins set to **None** and scale set to **100%**.

**Sections placed in wrong position after zoom**
Use the **Fit** button in the top bar to reset the zoom before placing new sections, or place sections at any zoom level — the canvas corrects coordinates automatically.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is open source. See `LICENSE` for details.
