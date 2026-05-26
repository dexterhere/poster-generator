import React, { useRef, useState } from 'react';
import { usePosterStore } from '../../store/usePosterStore';
import { Download, FileJson, Upload, CheckCircle, Printer, ChevronDown, ChevronUp } from 'lucide-react';
import { createPosterDraft, normalizeLoadedDraft } from '../../utils/draft';

const ExportPanel: React.FC = () => {
  const state = usePosterStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exported, setExported] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handlePrint = () => {
    const { width, height } = state.layout;
    state.setSelectedSection(null);

    // Our coordinate system is 1px = 1mm.
    // CSS pixels at 96 dpi = 25.4/96 mm each, so to make 1px render as 1mm
    // we must scale up by 96/25.4 ≈ 3.7795.
    const CSS_PX_PER_MM = 96 / 25.4;

    const styleEl = document.createElement('style');
    styleEl.id = '__poster-print-size__';
    styleEl.textContent = `
      @page {
        size: ${width}mm ${height}mm;
        margin: 0;
      }
      @media print {
        #poster-canvas {
          width: ${width}px !important;
          height: ${height}px !important;
          transform: scale(${CSS_PX_PER_MM}) !important;
          transform-origin: top left !important;
        }
        .editor-only-ui,
        [data-editor-ui="true"] {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    window.print();

    window.addEventListener('afterprint', () => {
      document.getElementById('__poster-print-size__')?.remove();
    }, { once: true });
  };

  const handleSaveDraft = () => {
    const data = createPosterDraft(state);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poster-draft-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const handleDownloadTemplate = () => {
    const contentTemplate = {
      _instructions: [
        "This is the schema template for the Academic Poster Generator.",
        "Replace all placeholder values with real content from your project.",
        "Do NOT change 'type' field values — the app uses them to render each section correctly.",
        "Do NOT change 'id' field values.",
        "Remove this '_instructions' key before uploading.",
        "Output raw JSON only — no markdown code fences, no extra text."
      ],
      header: {
        projectTitle: "Your Full Project Title",
        studentName: "Your Full Name",
        studentId: "1234567",
        supervisorName: "Dr. Supervisor Name",
        readerName: "Prof. Reader Name"
      },
      sections: [
        {
          id: "section-1",
          title: "Introduction",
          type: "text",
          _schema: "type=text: use 'body' for the main paragraph and 'highlightBox' for a single key takeaway sentence.",
          content: {
            body: "Write 3–4 sentences describing the problem, motivation, and purpose of your project. Keep it accessible to a general academic audience.",
            highlightBox: "One sentence stating the core contribution or novelty of your work."
          }
        },
        {
          id: "section-2",
          title: "Research Question",
          type: "question",
          _schema: "type=question: 'questionText' is the central research question; 'subtext' is the hypothesis or expected finding.",
          content: {
            questionText: "How can [technology/approach] be used to [achieve goal] in the context of [domain]?",
            subtext: "This study hypothesises that [expected outcome] will result from [approach], as evidenced by [indicator]."
          }
        },
        {
          id: "section-3",
          title: "Aims & Objectives",
          type: "list",
          _schema: "type=list: 'intro' is an optional paragraph above the list (use for the project Aim). 'style' is 'bullet' or 'numbered'. Each item has 'text' (required) and optional 'tag' (short label like 'O1').",
          content: {
            style: "numbered",
            intro: "The aim of this project is to [overall aim in one sentence].",
            items: [
              { tag: "O1", text: "Objective one — start with a verb, e.g. Develop a..." },
              { tag: "O2", text: "Objective two — start with a verb, e.g. Evaluate the..." },
              { tag: "O3", text: "Objective three — start with a verb, e.g. Implement a..." },
              { tag: "O4", text: "Objective four — start with a verb, e.g. Test and validate..." }
            ]
          }
        },
        {
          id: "section-4",
          title: "Literature Review",
          type: "table",
          _schema: "type=table: 'columns' is a string array of header names; 'rows' is a 2D array where each inner array matches the columns in order. Only use sources from the attached document — do not fabricate.",
          content: {
            columns: ["Author & Year", "Focus", "Key Finding", "Relevance to Project"],
            rows: [
              ["Smith et al. (2021)", "Topic of paper", "Main finding from the paper", "How it relates to your project"],
              ["Jones (2020)", "Topic of paper", "Main finding from the paper", "How it relates to your project"],
              ["Patel & Lee (2022)", "Topic of paper", "Main finding from the paper", "How it relates to your project"],
              ["Brown (2019)", "Topic of paper", "Main finding from the paper", "How it relates to your project"],
              ["Ahmed et al. (2023)", "Topic of paper", "Main finding from the paper", "How it relates to your project"]
            ]
          }
        },
        {
          id: "section-5",
          title: "Methodology",
          type: "flow",
          _schema: "type=flow: 'direction' is 'horizontal' or 'vertical'. Each step has 'name' (short label), 'description' (1 sentence), and 'highlight' (true for the most important/novel step).",
          content: {
            direction: "horizontal",
            steps: [
              { name: "Requirements", description: "Gathered and analysed user and system requirements.", highlight: false },
              { name: "Design", description: "Designed system architecture and data models.", highlight: false },
              { name: "Implementation", description: "Built the core system using [technology/framework].", highlight: true },
              { name: "Testing", description: "Conducted unit, integration, and user acceptance testing.", highlight: false },
              { name: "Evaluation", description: "Evaluated outcomes against the original objectives.", highlight: false }
            ]
          }
        },
        {
          id: "section-6",
          title: "Key Results",
          type: "stats",
          _schema: "type=stats: 'stats' is an array of { value, label } pairs. 'value' should be short (number, %, grade). 'label' should be under 4 words. Only use real values from your document.",
          content: {
            stats: [
              { value: "95%", label: "Test Accuracy" },
              { value: "4", label: "Sprints Completed" },
              { value: "12", label: "User Testers" },
              { value: "A", label: "System Usability Score" }
            ]
          }
        },
        {
          id: "section-7",
          title: "System Diagram",
          type: "image",
          _schema: "type=image: set 'imageUrl' to null — the user will upload the image in the poster builder. Write a descriptive 'caption'. 'fit' is 'contain' or 'cover'.",
          content: {
            imageUrl: null,
            caption: "Figure 1: [Describe what diagram this should be, e.g. System architecture diagram showing the three-tier structure of the application.]",
            fit: "contain"
          }
        },
        {
          id: "section-8",
          title: "Evaluation & Reflection",
          type: "list",
          _schema: "type=list: Use 'intro' for an overall summary sentence. Each item is one honest, analytical bullet point about what worked, what did not, or what was learned.",
          content: {
            style: "bullet",
            intro: "Overall, the project successfully achieved its primary aim, with the following key reflections.",
            items: [
              { text: "What worked well — e.g. The modular architecture allowed rapid feature iteration." },
              { text: "What could be improved — e.g. More time should have been allocated to user testing." },
              { text: "What was learned — e.g. Working with [technology] provided insight into [concept]." },
              { text: "An honest limitation — e.g. The dataset used was small and may not generalise." }
            ]
          }
        },
        {
          id: "section-9",
          title: "Future Scope",
          type: "list",
          _schema: "type=list: Each item is a specific, actionable future direction. Avoid vague phrases like 'improve performance' — be concrete.",
          content: {
            style: "numbered",
            intro: "",
            items: [
              { text: "Specific future direction 1 — e.g. Extend the system to support [feature] using [technology]." },
              { text: "Specific future direction 2 — e.g. Conduct a large-scale user study with [N] participants." },
              { text: "Specific future direction 3 — e.g. Integrate with [external system] to enable [capability]." }
            ]
          }
        }
      ]
    };
    const blob = new Blob([JSON.stringify(contentTemplate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poster-content-template.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadDraft = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = normalizeLoadedDraft(JSON.parse(ev.target?.result as string));
        if (data.header) state.updateHeader(data.header);
        if (data.footer) state.updateFooter(data.footer);
        if (data.theme)  state.updateTheme(data.theme);
        if (data.layout) state.updateLayout(data.layout);

        if (Array.isArray(data.sections) && data.sections.length > 0) {
          // Clear existing sections first so loaded sections don't stack on old ones
          state.sections.forEach((s) => state.deleteSection(s.id));

          // Auto-layout constants — cascade sections in a grid if no position provided
          const COLS       = 2;
          const CELL_W     = 380;
          const CELL_H     = 220;
          const GAP        = 16;
          const START_X    = 20;
          const START_Y    = 110; // below poster header

          data.sections.forEach((s, idx: number) => {
            // Assign a staggered grid position if the section has no position data
            if (!s.position || (s.position.x === 0 && s.position.y === 0 && !s.position.width)) {
              const col = idx % COLS;
              const row = Math.floor(idx / COLS);
              s.position = {
                x: START_X + col * (CELL_W + GAP),
                y: START_Y + row * (CELL_H + GAP),
                width:  CELL_W,
                height: CELL_H,
                zIndex: idx + 1,
              };
            }

            // Ensure id is unique
            if (!s.id) s.id = `section-${Date.now()}-${idx}`;

            state.addSection(s);
          });
        }

        alert('Draft loaded successfully!');
      } catch {
        alert('Invalid draft file. Please use a valid JSON draft.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const { width, height } = state.layout;
  const orientation = width >= height ? 'Landscape' : 'Portrait';

  return (
    <div className="p-4 space-y-4">

      {/* PDF Export */}
      <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-indigo-800">Export / Print Poster</p>
          <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
            {state.layout.name}
          </span>
        </div>
        <p className="text-[11px] text-indigo-600 mb-3 leading-relaxed">
          Opens the browser print dialog. The page size is automatically set to{' '}
          <strong>{width} × {height} mm ({orientation})</strong> to match your poster exactly.
        </p>
        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Printer size={15} />
          Export / Print Poster
        </button>
      </div>

      {/* Print Instructions */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-[11px] font-bold text-amber-800 mb-2">Print Instructions</p>
        <ol className="text-[10px] text-amber-700 space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>Click <strong>Export / Print Poster</strong> above.</li>
          <li>In the print dialog, set <strong>Destination</strong> to "Save as PDF" or your printer.</li>
          <li>
            Under <strong>More settings → Paper size</strong>, select{' '}
            <strong>{state.layout.name} ({width} × {height} mm)</strong>.
          </li>
          <li>Set <strong>Margins</strong> to <strong>None</strong>.</li>
          <li>Set <strong>Scale</strong> to <strong>100%</strong> (do not use "Fit to page").</li>
          <li>Print or save. Take the PDF to a print shop and request the exact paper size.</li>
        </ol>
        <p className="text-[10px] text-amber-600 mt-2 font-medium">
          The page size is automatically embedded — your poster will print at exactly {width} × {height} mm.
        </p>
      </div>

      {/* Getting Started / AI Guide */}
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
        >
          <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">
            Getting Started Guide
          </span>
          {showGuide ? <ChevronUp size={14} className="text-neutral-400" /> : <ChevronDown size={14} className="text-neutral-400" />}
        </button>

        {showGuide && (
          <div className="p-3 space-y-3 text-[10px] text-neutral-600 leading-relaxed">
            <div>
              <p className="font-bold text-neutral-700 mb-1">Step 1 — Set your paper size</p>
              <p>Go to the <strong>Theme</strong> tab. Select your paper size (A1 recommended for academic posters) and orientation (Portrait or Landscape). Your canvas will update immediately.</p>
            </div>
            <div>
              <p className="font-bold text-neutral-700 mb-1">Step 2 — Fill in the header</p>
              <p>Go to the <strong>Header</strong> tab. Enter your project title, your name, student ID, supervisor, and second reader. Upload your university/college logos if available.</p>
            </div>
            <div>
              <p className="font-bold text-neutral-700 mb-1">Step 3 — Add sections to the canvas</p>
              <p><strong>Right-click anywhere</strong> on the white canvas area to add a section. Choose from: Text, Image, Table, Process Flow, List, Stats Hub, or Research Question. Drag to reposition and resize by dragging the corners.</p>
            </div>
            <div>
              <p className="font-bold text-neutral-700 mb-1">Step 4 — Edit section content</p>
              <p>Click any section to select it, then edit its content in the right inspector. You can also double-click text directly on the canvas for quick inline edits. Give each section a clear title (e.g. "Introduction", "Methodology", "Results").</p>
            </div>
            <div>
              <p className="font-bold text-neutral-700 mb-1">Step 5 — Style your poster</p>
              <p>Use the <strong>Theme</strong> tab to pick a colour theme, font pairing, and section card style. Use "Filled Header" for a professional look with a coloured header bar on each section.</p>
            </div>
            <div>
              <p className="font-bold text-neutral-700 mb-1">Step 6 — Save your work</p>
              <p>Refreshing this page clears unsaved work. Click <strong>Save Draft as JSON</strong> regularly to keep a backup, then reload using <strong>Load Draft from JSON</strong>. Note: locally uploaded images are not saved in the draft, and layout positions may need rearranging after loading.</p>
            </div>
            <div>
              <p className="font-bold text-neutral-700 mb-1">Step 7 — Export and print</p>
              <p>Click <strong>Export / Print Poster</strong>. In the browser print dialog, confirm the paper size matches your poster size, set margins to None, and scale to 100%. Save as PDF and take to a print shop.</p>
            </div>
            <div className="pt-2 border-t border-neutral-100">
              <p className="font-bold text-neutral-700 mb-1">Using AI to write your poster content</p>
              <p className="mb-1">You can use an AI assistant (ChatGPT, Claude, etc.) to help draft content for each section. Try these prompts:</p>
              <ul className="space-y-1 list-disc list-inside text-neutral-500">
                <li>"Write a 3-sentence introduction for a poster about [your project]."</li>
                <li>"Summarise the key methodology of [your project] in 4 bullet points for an academic poster."</li>
                <li>"Write a clear research question and hypothesis for [your project] in 2 sentences."</li>
                <li>"List 3 key results from [your project] in a format suitable for a poster stats section."</li>
                <li>"Write a concise conclusion for an academic poster about [your project], max 60 words."</li>
              </ul>
              <p className="mt-1.5 text-neutral-500">Paste the AI-generated text directly into the relevant section editor. Keep text short — posters are read from a distance.</p>
            </div>
          </div>
        )}
      </div>

      {/* Save & Load */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Save & Load</p>
        <button
          onClick={handleSaveDraft}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-800 text-white text-sm font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
        >
          {exported ? <CheckCircle size={15} /> : <FileJson size={15} />}
          {exported ? 'Saved!' : 'Save Draft as JSON'}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-neutral-300 text-neutral-700 text-sm font-semibold rounded-lg hover:border-neutral-500 transition-colors"
        >
          <Upload size={15} />
          Load Draft from JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleLoadDraft}
        />
        <p className="text-[10px] text-neutral-400 text-center mb-4">
          Note: Refresh clears unsaved work. JSON draft excludes local image files, and loaded drafts may need manual section rearrangement.
        </p>

        <div className="pt-4 border-t border-neutral-200">
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Content Template</p>
          <button
            onClick={handleDownloadTemplate}
            className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-indigo-200 text-indigo-600 text-[11px] font-bold uppercase rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
          >
            <Download size={13} />
            Download JSON Template
          </button>
          <p className="text-[10px] text-neutral-400 mt-2 text-center leading-relaxed">
            Download a clean JSON file to edit your poster's text and image URLs externally, then upload it above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
