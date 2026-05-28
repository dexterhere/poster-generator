import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, Sparkles, ChevronRight, ChevronLeft, Upload, FileJson, ExternalLink, Wand2, Bot } from 'lucide-react';
import { usePosterStore } from '../../store/usePosterStore';
import { useThemeStore } from '../../store/useThemeStore';
import { normalizeLoadedDraft } from '../../utils/draft';
import { autoLayoutSections, hasUsablePosition } from '../../utils/autoLayout';
import { useToast } from '../ui/ToastContext';

interface AIGuideModalProps {
  onClose: () => void;
}

const PROMPT = `I have attached my Final Year Project document(s). These may include a Proposal, Literature Review, Technical Report, or Artifact. They contain all the core details of my project.

Please generate a complete academic poster JSON file. The output must be raw, valid JSON with NO explanation text before or after — just the JSON object.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JSON STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The top-level JSON must have this exact shape:
{
  "header": {
    "projectTitle": "Your Full Project Title",
    "studentName": "Your Full Name",
    "studentId": "Your Student ID",
    "supervisorName": "Dr. Supervisor Name",
    "readerName": "Prof. Reader Name"
  },
  "sections": [ ... ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION SCHEMAS — use exactly these field names
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each section object must have: "id", "title", "type", and "content".
The app supports these section types: "text", "list", "table", "flow", "stats", "question", "image", and "split-image".
Choose the type that best matches the source material. Use table for comparisons, flow for process/methodology, stats for measurable results, image for a single figure placeholder, and split-image when two related diagrams or screenshots should be compared side by side.

TYPE: "text"
Content schema:
{ "body": "Full paragraph text here.", "highlightBox": "Optional key takeaway in 1 sentence." }

TYPE: "list"
Content schema (use this for Aims & Objectives — put the Aim as intro, Objectives as items):
{ "style": "bullet", "intro": "The aim of this project is to...", "items": [ { "text": "Objective one." }, { "text": "Objective two." } ] }
For a numbered list use: "style": "numbered"
The "tag" field on each item is optional — use it for short labels like "RQ1" or "O1".
Keep list items compact. Each item should be one short sentence under 18 words. Do not create paragraph-length bullets.

TYPE: "table"
Content schema:
{ "columns": ["Column A", "Column B", "Column C"], "rows": [ ["Row 1A", "Row 1B", "Row 1C"], ["Row 2A", "Row 2B", "Row 2C"] ] }

TYPE: "flow"
Content schema (use for step-by-step methodology):
{ "direction": "horizontal", "steps": [ { "name": "Step 1", "description": "Brief description.", "highlight": false }, { "name": "Step 2", "description": "Key step.", "highlight": true } ] }
Set "highlight": true for the most important step. "direction" can be "horizontal" or "vertical".

TYPE: "stats"
Content schema (use for key metrics/results):
{ "stats": [ { "value": "95%", "label": "Test Accuracy" }, { "value": "4", "label": "Sprints" }, { "value": "12", "label": "User Testers" } ] }
Keep values short (numbers, %, abbreviations). Labels should be under 4 words.

TYPE: "question"
Content schema (use for the Research Question section):
{ "label": "Research Question", "questionText": "How can X be used to improve Y in the context of Z?", "subtext": "This study hypothesises that..." }
The question should be clear and specific. The subtext should be optional and under 20 words.

TYPE: "image"
Content schema (placeholder — user will upload the image):
{ "imageUrl": null, "caption": "Figure 1: Describe what this diagram shows.", "fit": "contain" }

TYPE: "split-image"
Content schema (placeholder — user will upload both images):
{ "leftImageUrl": null, "leftLabel": "Before / Plan", "rightImageUrl": null, "rightLabel": "After / Result", "direction": "horizontal", "fit": "contain" }
Use split-image for prototype comparisons, architecture vs implementation, wireframe vs final screen, or input vs output examples.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE EXACTLY THESE 9 SECTIONS (in this order)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. title: "Introduction" | type: "text"
   - body: 3–4 sentences covering the problem, motivation, and project purpose.
   - highlightBox: One sentence stating the core contribution or value.

2. title: "Research Question" | type: "question"
   - questionText: The central academic question this project addresses.
   - subtext: A concise hypothesis or expected finding (1–2 sentences).

3. title: "Aims & Objectives" | type: "list" | style: "numbered"
   - intro: One sentence stating the overall aim of the project.
   - items: 4–6 specific, measurable objectives. Each must be one clear sentence starting with a verb (e.g. "Develop...", "Evaluate...", "Implement...").

4. title: "Literature Review" | type: "table"
   - columns: ["Author & Year", "Focus", "Key Finding", "Relevance"]
   - rows: Top 5 most relevant sources from the attached document. Each row: [citation, brief topic, main finding, how it relates to this project].
   - Do NOT invent sources — only use citations present in the document.

5. title: "Methodology" | type: "flow" | direction: "horizontal"
   - 4–6 steps covering the development/research process (e.g. Requirements → Design → Build → Test → Evaluate).
   - Set highlight: true on the most important or novel step.
   - description: 1 sentence per step describing what was done.

6. title: "Key Results / Stats" | type: "stats"
   - 3–5 stats showing measurable outcomes (accuracy, coverage, user scores, sprint count, etc.).
   - Extract real values from the document — do not fabricate.

7. title: "System Diagram" | type: "image"
   - imageUrl: null (user will upload)
   - caption: Describe which diagram this should be (architecture, data flow, UML class diagram, etc.) and what it illustrates.

8. title: "Evaluation & Reflection" | type: "list" | style: "bullet"
   - intro: One sentence summarising the overall evaluation outcome.
   - items: 4–5 honest, analytical bullet points — what worked, what didn't, what was learned. Avoid vague claims.

9. title: "Future Scope" | type: "list" | style: "numbered"
   - intro: (omit or leave empty)
   - items: 3–5 specific, concrete future directions. Each must be one actionable sentence — no generics like "improve performance".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- IDs: use "section-1" through "section-9".
- All text must be poster-appropriate: short sentences, no academic jargon without explanation.
- Prioritise scannable poster content over long report-style paragraphs.
- Lists should be compact; use fewer words instead of shrinking the font.
- If content feels too long for one section, summarise it instead of adding more lines.
- Do not include any text outside the JSON object.
- Do not wrap the JSON in markdown code fences.
- Validate that every section has "id", "title", "type", and "content" with the correct schema.`;

const STEPS: { num: number; title: string; detail: string }[] = [
  {
    num: 1,
    title: 'Tell AI your poster story',
    detail: 'Use your project files to generate short, presentation-ready content.',
  },
  {
    num: 2,
    title: 'Upload the JSON here',
    detail: 'The builder validates the draft and fills missing layout positions.',
  },
  {
    num: 3,
    title: 'Review the auto layout',
    detail: 'Sections are arranged into a balanced poster grid that you can refine.',
  },
  {
    num: 4,
    title: 'Check before printing',
    detail: 'Use print preview to catch overflow, empty images, and scale issues.',
  },
];

const AI_TOOLS = [
  { name: 'ChatGPT', url: 'https://chatgpt.com', note: 'Best all-round flow' },
  { name: 'Gemini', url: 'https://gemini.google.com', note: 'Good with Google docs' },
  { name: 'Claude', url: 'https://claude.ai', note: 'Strong long documents' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com', note: 'Useful with Office files' },
];

const AIGuideModal: React.FC<AIGuideModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const sectionsCount = usePosterStore((s) => s.sections.length);
  const isDark = useThemeStore((state) => state.editorTheme === 'dark');
  const panelBg = isDark ? '#111827' : '#ffffff';
  const panelBorder = isDark ? 'rgba(148, 163, 184, 0.22)' : 'rgba(15, 23, 42, 0.12)';
  const cardBg = isDark ? '#1f2937' : '#f8fafc';
  const cardBgAlt = isDark ? '#172033' : '#eef2ff';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? 'rgba(226, 232, 240, 0.72)' : 'rgba(51, 65, 85, 0.78)';

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = normalizeLoadedDraft(JSON.parse(event.target?.result as string));
        const store = usePosterStore.getState();
        if (data.header) store.updateHeader(data.header);
        if (data.footer) store.updateFooter(data.footer);
        if (data.theme) store.updateTheme(data.theme);
        if (data.layout) store.updateLayout(data.layout);

        if (data.sections?.length) {
          const nextLayout = data.layout ? { ...store.layout, ...data.layout } : store.layout;
          const nextTheme = data.theme ? { ...store.theme, ...data.theme } : store.theme;
          const needsLayout = data.sections.some((section) => !hasUsablePosition(section));
          store.setSections(
            needsLayout
              ? autoLayoutSections(data.sections, nextLayout, nextTheme, { preserveExistingPositions: true })
              : data.sections,
          );
          setImportedCount(data.sections.length);
        }

        setStatus('JSON loaded and arranged. Review the poster, then use Print Preview before export.');
        setStepIndex(2);
        addToast('AI JSON imported', 'success');
      } catch {
        setStatus('This file is not a valid poster JSON. Generate it again using the prompt below.');
        addToast('Invalid AI JSON file', 'error');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden p-4 sm:p-6"
      style={{
        background: isDark ? 'rgba(2, 6, 23, 0.86)' : 'rgba(15, 23, 42, 0.42)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          maxWidth: 'min(1080px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 48px)',
          background: panelBg,
          borderColor: panelBorder,
          color: textPrimary,
          boxShadow: isDark
            ? '0 30px 90px rgba(0, 0, 0, 0.62)'
            : '0 30px 90px rgba(15, 23, 42, 0.28)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-5 py-4 sm:px-7 shrink-0" style={{ borderColor: panelBorder, background: panelBg }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20" style={{ background: 'var(--editor-accent)', color: 'var(--editor-text-inverse)' }}>
            <Sparkles size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest leading-none mb-0.5" style={{ color: 'var(--editor-accent)' }}>AI Guide</p>
            <h2 className="text-lg font-bold leading-tight">AI Poster Journey</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full transition-colors shrink-0"
            style={{ color: textSecondary }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 space-y-5">

          <div className="grid grid-cols-4 gap-2">
            {STEPS.map((step, index) => (
              <button
                key={step.num}
                onClick={() => setStepIndex(index)}
                className="h-1.5 rounded-full transition-colors"
                style={{ background: index <= stepIndex ? 'var(--editor-accent)' : 'var(--editor-border)' }}
                title={step.title}
              />
            ))}
          </div>

          {stepIndex === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-5">
            <div className="rounded-2xl border p-5 shadow-sm" style={{ background: cardBg, borderColor: panelBorder }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--editor-accent)', color: 'var(--editor-text-inverse)' }}>
                  <Wand2 size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Start with your project documents</p>
                  <p className="text-xs leading-relaxed mt-1" style={{ color: textSecondary }}>
                    Copy the prompt below, paste it into your AI tool, and attach your proposal, report, literature review, or artifact notes.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    copied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Prompt Copied' : 'Copy AI Prompt'}
                </button>
                <a
                  href="https://chatgpt.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-colors"
                  style={{ background: cardBgAlt, borderColor: panelBorder, color: 'var(--editor-accent)' }}
                >
                  Open AI Tool <ExternalLink size={13} />
                </a>
              </div>
              <div className="border rounded-xl p-4 overflow-y-auto mt-4" style={{ maxHeight: 'min(320px, 36vh)', background: isDark ? '#0f172a' : '#ffffff', borderColor: panelBorder }}>
                <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-mono" style={{ color: textSecondary }}>
                  {PROMPT}
                </pre>
              </div>
            </div>
            <div className="rounded-2xl border p-5 shadow-sm" style={{ background: cardBg, borderColor: panelBorder }}>
              <div className="flex items-center gap-2 mb-3">
                <Bot size={16} style={{ color: 'var(--editor-accent)' }} />
                <p className="text-sm font-bold">Recommended AI tools</p>
              </div>
              <div className="space-y-2">
                {AI_TOOLS.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-colors"
                    style={{ background: isDark ? '#111827' : '#ffffff', borderColor: panelBorder }}
                  >
                    <div>
                      <p className="text-xs font-bold">{tool.name}</p>
                      <p className="text-[10px]" style={{ color: textSecondary }}>{tool.note}</p>
                    </div>
                    <ExternalLink size={13} className="shrink-0" style={{ color: 'var(--editor-accent)' }} />
                  </a>
                ))}
              </div>
              <p className="mt-4 text-[11px] leading-relaxed" style={{ color: textSecondary }}>
                Any LLM can work. The important part is that the response is raw JSON with no markdown wrapper.
              </p>
            </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="rounded-2xl border p-6 shadow-sm" style={{ background: cardBg, borderColor: panelBorder }}>
              <p className="text-sm font-semibold">Upload the JSON response</p>
              <p className="text-xs leading-relaxed mt-1" style={{ color: textSecondary }}>
                Save the AI response as a `.json` file. The app will validate it, keep existing positions when valid, and auto-layout missing positions.
              </p>
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-5 w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors"
                style={{ background: isDark ? '#111827' : '#ffffff', borderColor: panelBorder, color: 'var(--editor-accent)' }}
              >
                <Upload size={22} />
                <span className="text-sm font-semibold">Choose JSON File</span>
                <span className="text-[11px]" style={{ color: textSecondary }}>Valid poster JSON only</span>
              </button>
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleUpload} />
              {status && (
                <p className="mt-3 flex items-start gap-2 text-xs" style={{ color: textSecondary }}>
                  <FileJson size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--editor-accent)' }} />
                  {status}
                </p>
              )}
            </div>
          )}

          {stepIndex === 2 && (
            <div className="rounded-2xl border p-6 shadow-sm" style={{ background: cardBg, borderColor: panelBorder }}>
              <p className="text-sm font-semibold">Review and refine the layout</p>
              <p className="text-xs leading-relaxed mt-1" style={{ color: textSecondary }}>
                {importedCount ?? sectionsCount} sections are now on the canvas. Select one or multiple sections to align, style, resize, and edit text directly.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {['Double-click text', 'Shift-click sections', 'Use Print Preview'].map((item) => (
                  <div key={item} className="rounded-lg border p-3 text-center text-[11px] font-semibold" style={{ background: isDark ? '#111827' : '#ffffff', borderColor: panelBorder, color: 'var(--editor-success)' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="rounded-2xl border p-6 shadow-sm" style={{ background: cardBg, borderColor: panelBorder }}>
              <p className="text-sm font-semibold">Before export</p>
              <p className="text-xs leading-relaxed mt-1" style={{ color: textSecondary }}>
                Open Print Preview to check content overflow, missing images, safe area warnings, and exact paper dimensions.
              </p>
              <div className="mt-4 rounded-lg border p-3 text-xs leading-relaxed" style={{ background: isDark ? '#111827' : '#ffffff', borderColor: panelBorder, color: 'var(--editor-warning)' }}>
                If the poster feels crowded, select multiple sections and reduce text size, switch to a compact card style, or use Auto Arrange from the Arrange menu.
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
              disabled={stepIndex === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-30"
              style={{ color: textSecondary }}
            >
              <ChevronLeft size={13} />
              Back
            </button>
            <button
              onClick={() => setStepIndex((value) => Math.min(STEPS.length - 1, value + 1))}
              disabled={stepIndex === STEPS.length - 1}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-30"
              style={{ background: 'var(--editor-accent)', color: 'var(--editor-text-inverse)' }}
            >
              Next
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t px-5 py-3 sm:px-7 flex items-center justify-between gap-4" style={{ background: panelBg, borderColor: panelBorder }}>
          <p className="text-[10px]" style={{ color: textSecondary }}>Recommended AI: <span className="font-semibold" style={{ color: 'var(--editor-accent)' }}>ChatGPT</span>, <span className="font-semibold" style={{ color: 'var(--editor-accent)' }}>Gemini</span>, <span className="font-semibold" style={{ color: 'var(--editor-accent)' }}>Claude</span>, Copilot, or any JSON-capable LLM.</p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ background: 'var(--editor-accent)', color: 'var(--editor-text-inverse)' }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AIGuideModal;
