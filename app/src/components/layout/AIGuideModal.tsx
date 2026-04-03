import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, ChevronRight } from 'lucide-react';

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

TYPE: "text"
Content schema:
{ "body": "Full paragraph text here.", "highlightBox": "Optional key takeaway in 1 sentence." }

TYPE: "list"
Content schema (use this for Aims & Objectives — put the Aim as intro, Objectives as items):
{ "style": "bullet", "intro": "The aim of this project is to...", "items": [ { "text": "Objective one." }, { "text": "Objective two." } ] }
For a numbered list use: "style": "numbered"
The "tag" field on each item is optional — use it for short labels like "RQ1" or "O1".

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
{ "questionText": "How can X be used to improve Y in the context of Z?", "subtext": "This study hypothesises that..." }

TYPE: "image"
Content schema (placeholder — user will upload the image):
{ "imageUrl": null, "caption": "Figure 1: Describe what this diagram shows.", "fit": "contain" }

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
- Do not include any text outside the JSON object.
- Do not wrap the JSON in markdown code fences.
- Validate that every section has "id", "title", "type", and "content" with the correct schema.`;

const STEPS: { num: number; title: string; detail: string }[] = [
  {
    num: 1,
    title: 'Go to Save & Export',
    detail: 'Click the "Save & Export" tab in the top navigation bar.',
  },
  {
    num: 2,
    title: 'Download JSON Template',
    detail: 'Click "Download JSON Template" to get the poster schema file.',
  },
  {
    num: 3,
    title: 'Open an AI of your choice',
    detail: 'We recommend Claude (claude.ai) for best results with structured JSON output.',
  },
  {
    num: 4,
    title: 'Upload your project documents',
    detail: 'Attach your Proposal, Literature Review, Artifact, or any relevant document.',
  },
  {
    num: 5,
    title: 'Copy & paste the prompt below',
    detail: 'Also attach the JSON template file you downloaded in Step 2.',
  },
  {
    num: 6,
    title: 'Download the JSON response',
    detail: 'Save the JSON the AI returns to your computer.',
  },
  {
    num: 7,
    title: 'Load the JSON into the poster builder',
    detail: 'In Save & Export, click "Load Draft from JSON" and upload the file.',
  },
  {
    num: 8,
    title: 'Arrange & customise',
    detail: 'Drag sections into position, adjust sizes, and personalise the content.',
  },
];

const AIGuideModal: React.FC<AIGuideModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-violet-600 uppercase tracking-widest leading-none mb-0.5">AI Guide</p>
            <h2 className="text-base font-bold text-neutral-900 leading-tight">The AI God</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Intro blurb */}
          <p className="text-sm text-neutral-500 leading-relaxed">
            Use AI to auto-generate a fully structured poster from your project documents in minutes. Follow the steps below.
          </p>

          {/* Steps */}
          <div className="space-y-2">
            {STEPS.map((step) => (
              <div key={step.num} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {step.num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 leading-snug">{step.title}</p>
                  <p className="text-xs text-neutral-500 leading-snug mt-0.5">{step.detail}</p>
                </div>
                {step.num < STEPS.length && (
                  <ChevronRight size={13} className="text-neutral-300 shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>

          {/* Prompt box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                Step 5 — Copy this prompt
              </p>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 max-h-52 overflow-y-auto">
              <pre className="text-[11px] text-neutral-700 leading-relaxed whitespace-pre-wrap font-mono">
                {PROMPT}
              </pre>
            </div>
          </div>

          {/* Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Note</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              You can modify the section structure to better match your project. The prompt above is a starting point — feel free to remove, rename, or reorder sections before sending it to the AI.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50">
          <p className="text-[10px] text-neutral-400">Recommended AI: <span className="font-semibold text-violet-600">Claude (claude.ai)</span></p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGuideModal;
