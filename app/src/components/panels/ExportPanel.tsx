import React, { useRef, useState } from 'react';
import { usePosterStore } from '../../store/usePosterStore';
import { Download, FileJson, Upload, CheckCircle } from 'lucide-react';

const ExportPanel: React.FC = () => {
  const state = usePosterStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exported, setExported] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    const data = {
      id: state.id,
      header: state.header,
      footer: state.footer,
      layout: state.layout,
      theme: state.theme,
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
          // Replace all sections
          data.sections.forEach((s: any) => {
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

  return (
    <div className="p-4 space-y-4">
      {/* PDF Export */}
      <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
        <p className="text-sm font-bold text-indigo-800 mb-1">Export as PDF (A1)</p>
        <p className="text-[11px] text-indigo-600 mb-3 leading-relaxed">
          Uses the browser print dialog. Select A1 paper size for best results.
        </p>
        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Download size={15} />
          Export / Print Poster
        </button>
      </div>

      {/* Print Instructions */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-[11px] font-bold text-amber-800 mb-1.5">🖨️ Print Instructions</p>
        <ol className="text-[10px] text-amber-700 space-y-1 list-decimal list-inside leading-relaxed">
          <li>Take the PDF to a print shop</li>
          <li>Ask for A1 size (841×594mm landscape)</li>
          <li>Select "Fit to page" if prompted</li>
          <li>Request 150 DPI or higher for best quality</li>
        </ol>
      </div>

      {/* Save Draft */}
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
        <p className="text-[10px] text-neutral-400 text-center">
          Note: Uploaded images are not included in the draft file.
        </p>
      </div>
    </div>
  );
};

export default ExportPanel;
