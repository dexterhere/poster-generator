import React, { useRef, useState } from 'react';
import { usePosterStore } from '../../store/usePosterStore';
import { Download, FileJson, Upload, CheckCircle, Printer, ChevronDown, ChevronUp } from 'lucide-react';

const ExportPanel: React.FC = () => {
  const state = usePosterStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exported, setExported] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handlePrint = () => {
    const { width, height } = state.layout;

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
      }
    `;
    document.head.appendChild(styleEl);

    window.print();

    window.addEventListener('afterprint', () => {
      document.getElementById('__poster-print-size__')?.remove();
    }, { once: true });
  };

  const handleSaveDraft = () => {
    const data = {
      id: state.id,
      header: state.header,
      footer: state.footer,
      theme: state.theme,
      layout: state.layout,
      sections: state.sections,
    };
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
      header: {
        universityLogoUrl: 'https://example.com/uni-logo.png',
        collegeLogoUrl: 'https://example.com/college-logo.png',
        projectTitle: 'Your Awesome Project Title',
        studentName: 'Your Full Name',
        studentId: '1234567',
        supervisorName: 'Dr. Supervisor',
        readerName: 'Prof. Reader',
      },
      sections: state.sections.map((s) => ({
        id: s.id,
        title: s.title,
        type: s.type,
        content: s.content,
      })),
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
        const data = JSON.parse(ev.target?.result as string);
        if (data.header) state.updateHeader(data.header);
        if (data.footer) state.updateFooter(data.footer);
        if (data.theme) state.updateTheme(data.theme);
        if (data.layout) state.updateLayout(data.layout);
        if (data.sections) {
          data.sections.forEach((s: any) => {
            if (!s.style) s.style = {};
            s.style.padding = 4;
            if (!state.sections.find((existing) => existing.id === s.id)) {
              state.addSection(s);
            } else {
              state.updateSection(s.id, s);
            }
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
              <p>Click any section to select it, then edit its content in the <strong>Sections</strong> panel on the left. Give each section a clear title (e.g. "Introduction", "Methodology", "Results").</p>
            </div>
            <div>
              <p className="font-bold text-neutral-700 mb-1">Step 5 — Style your poster</p>
              <p>Use the <strong>Theme</strong> tab to pick a colour theme, font pairing, and section card style. Use "Filled Header" for a professional look with a coloured header bar on each section.</p>
            </div>
            <div>
              <p className="font-bold text-neutral-700 mb-1">Step 6 — Save your work</p>
              <p>Click <strong>Save Draft as JSON</strong> regularly to keep a backup. You can reload it later using <strong>Load Draft from JSON</strong>. Note: locally uploaded images are not saved in the draft.</p>
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
          Note: Local uploaded images are not included in the draft file.
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
