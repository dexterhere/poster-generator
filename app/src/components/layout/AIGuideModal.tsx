import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, ChevronRight } from 'lucide-react';

interface AIGuideModalProps {
  onClose: () => void;
}

const PROMPT = `I have attached my Final Year Project document(s) — this may include my Proposal, Literature Review, or Artifact. These contain all the core details of my project.

Please generate a complete academic poster JSON file based on the template format I have provided. The output must be valid JSON that exactly follows the schema from the downloaded template.

Generate exactly 9 sections in this order:

1. Introduction — Brief overview of the project, problem statement, and motivation. Keep it concise and accessible to a general academic audience.

2. Literature Review — Summarise only the top 5 most relevant sources from my document. For each, include the key finding and its direct relevance to my project. Use a table or list format.

3. Aims & Objectives — Present the project aims and objectives in short, punchy bullet points. Each objective should be one clear sentence — avoid padding.

4. Methodology / Testing — Describe the approach taken, tools used, and how the project was tested or evaluated. Include any key results or metrics where available.

5. Diagram / Visual — Choose the most meaningful diagram to include (system architecture, data flow, UML, process flow, etc.). Describe what it shows — the actual image will be uploaded separately.

6. Research Question — State the central academic research question this project addresses, followed by a concise hypothesis or expected finding.

7. Evaluation & Reflection — Reflect on what went well, what could be improved, and what you learned. Be honest and analytical — this shows academic maturity.

8. Future Scope — Outline 3–5 concrete directions this work could be extended. Be specific rather than generic.

9. Gantt Chart — This will be a single uploaded image. Generate a placeholder section with title "Gantt Chart" and an image content block so I can upload the image directly in the poster builder.

Important rules:
- Keep all text concise — this is a poster, not an essay. Favour short sentences and bullet points.
- Do not invent data or citations not present in my document.
- You may reorder or rename sections only if it significantly improves academic clarity — note any changes you make.
- Output only the raw JSON. No explanation before or after.`;

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
