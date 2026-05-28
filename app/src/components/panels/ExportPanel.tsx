import React, { useRef, useState } from 'react';
import { usePosterStore } from '../../store/usePosterStore';
import { Download, FileJson, Upload, CheckCircle, Printer, ChevronDown, ChevronUp, FileImage, Loader2, AlertTriangle, Wand2 } from 'lucide-react';
import { createPosterDraft, normalizeLoadedDraft } from '../../utils/draft';
import { autoLayoutSections, hasUsablePosition } from '../../utils/autoLayout';
import { exportPosterToPDF, exportPosterToPNG, downloadBlob } from '../../utils/pdfExport';
import { useToast } from '../ui/ToastContext';
import { analyzePrintReadiness, improvePosterReadability } from '../../utils/printReadiness';

const ExportPanel: React.FC = () => {
  const state = usePosterStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exported, setExported] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { addToast } = useToast();

  const handlePrint = () => {
    const { width, height } = state.layout;
    state.setSelectedSection(null);
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

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const blob = await exportPosterToPDF();
      downloadBlob(blob, `poster-${state.layout.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      addToast('PDF exported successfully', 'success');
    } catch (err) {
      console.error('PDF export failed:', err);
      addToast('PDF export failed. Try using Print instead.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      const blob = await exportPosterToPNG();
      downloadBlob(blob, `poster-${state.layout.name.replace(/\s+/g, '-').toLowerCase()}.png`);
      addToast('PNG exported successfully', 'success');
    } catch (err) {
      console.error('PNG export failed:', err);
      addToast('PNG export failed.', 'error');
    } finally {
      setIsExporting(false);
    }
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
    addToast('Draft saved to downloads', 'success');
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
        if (data.theme) state.updateTheme(data.theme);
        if (data.layout) state.updateLayout(data.layout);

        if (Array.isArray(data.sections) && data.sections.length > 0) {
          const nextLayout = data.layout ? { ...state.layout, ...data.layout } : state.layout;
          const nextTheme = data.theme ? { ...state.theme, ...data.theme } : state.theme;
          const needsLayout = data.sections.some((section) => !hasUsablePosition(section));
          state.setSections(
            needsLayout
              ? autoLayoutSections(data.sections, nextLayout, nextTheme, { preserveExistingPositions: true })
              : data.sections,
          );
        }

        addToast('Draft loaded successfully', 'success');
      } catch {
        addToast('Invalid draft file. Please use a valid JSON draft.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const { width, height } = state.layout;
  const orientation = width >= height ? 'Landscape' : 'Portrait';
  const printReport = analyzePrintReadiness(state);
  const highPriorityIssues = printReport.issues.filter((issue) => issue.severity !== 'info').slice(0, 5);

  const handleImproveReadability = () => {
    state.sections.forEach((section) => {
      state.updateSection(section.id, { style: improvePosterReadability(section) });
    });
    if (state.header.titleFontSize < 26 || state.header.infoFontSize < 9) {
      state.updateHeader({
        titleFontSize: Math.max(state.header.titleFontSize, 26),
        infoFontSize: Math.max(state.header.infoFontSize, 9),
      });
    }
    addToast('Text readability improved for print', 'success');
  };

  const sectionClass = "p-4 rounded-xl border border-white/10 bg-white/[0.03]";
  const labelClass = "block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3";
  const buttonClass = "w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all";

  return (
    <div className="p-4 space-y-4">
      {/* PDF Export */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-indigo-300">Export Poster</p>
          <span className="text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">
            {state.layout.name}
          </span>
        </div>
        <p className="text-[11px] text-white/40 mb-3 leading-relaxed">
          Download print-ready files at exactly {width} x {height} mm ({orientation}).
        </p>

        <div className="space-y-2">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`${buttonClass} bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 disabled:opacity-40`}
          >
            {isExporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            Export PDF (Recommended)
          </button>
          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className={`${buttonClass} bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 disabled:opacity-40`}
          >
            {isExporting ? <Loader2 size={15} className="animate-spin" /> : <FileImage size={15} />}
            Export PNG (High Res)
          </button>
          <button
            onClick={handlePrint}
            className={`${buttonClass} bg-white/5 hover:bg-white/10 text-white/70 border border-white/10`}
          >
            <Printer size={15} />
            Quick Print
          </button>
        </div>
      </div>

      {/* Print Readability */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-bold text-indigo-300">Print Readability</p>
            <p className="text-[11px] text-white/40 mt-0.5">
              Checks whether A1 poster text will be clear after printing.
            </p>
          </div>
          <div
            className="w-14 h-14 rounded-2xl border flex flex-col items-center justify-center"
            style={{
              borderColor: printReport.score >= 85 ? 'rgba(52,211,153,0.35)' : printReport.score >= 65 ? 'rgba(251,191,36,0.35)' : 'rgba(248,113,113,0.35)',
              background: printReport.score >= 85 ? 'rgba(52,211,153,0.10)' : printReport.score >= 65 ? 'rgba(251,191,36,0.10)' : 'rgba(248,113,113,0.10)',
            }}
          >
            <span className="text-lg font-bold text-white">{printReport.score}</span>
            <span className="text-[9px] text-white/40">score</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-center">
            <p className="text-sm font-bold text-red-300">{printReport.errorCount}</p>
            <p className="text-[9px] text-white/35 uppercase">Errors</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-center">
            <p className="text-sm font-bold text-amber-300">{printReport.warningCount}</p>
            <p className="text-[9px] text-white/35 uppercase">Warnings</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-center">
            <p className="text-sm font-bold text-sky-300">{printReport.infoCount}</p>
            <p className="text-[9px] text-white/35 uppercase">Notes</p>
          </div>
        </div>

        {highPriorityIssues.length > 0 ? (
          <div className="space-y-2">
            {highPriorityIssues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-lg border px-3 py-2"
                style={{
                  borderColor: issue.severity === 'error' ? 'rgba(248,113,113,0.25)' : 'rgba(251,191,36,0.25)',
                  background: issue.severity === 'error' ? 'rgba(248,113,113,0.08)' : 'rgba(251,191,36,0.08)',
                }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle size={13} className={issue.severity === 'error' ? 'text-red-300' : 'text-amber-300'} />
                  <div>
                    <p className={issue.severity === 'error' ? 'text-[11px] font-bold text-red-200' : 'text-[11px] font-bold text-amber-200'}>
                      {issue.label}
                    </p>
                    <p className="text-[10px] text-white/45 leading-snug mt-0.5">{issue.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] text-emerald-200">
            Poster text meets the current A1 readability checks.
          </div>
        )}

        <button
          onClick={handleImproveReadability}
          className={`${buttonClass} mt-3 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10`}
        >
          <Wand2 size={15} />
          Improve Text Readability
        </button>
        <p className="text-[10px] text-white/25 mt-2 leading-relaxed">
          Recommended minimums: body {printReport.minimumBodySize}px, table cells {printReport.minimumTableSize}px, with enough space around dense sections.
        </p>
      </div>

      {/* Print Instructions */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <p className="text-[11px] font-bold text-amber-400 mb-2">Print Instructions</p>
        <ol className="text-[10px] text-amber-300/80 space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>Click <strong>Export PDF</strong> above for best results.</li>
          <li>Open the PDF and verify the page size matches your poster.</li>
          <li>Print with <strong>no margins</strong> and <strong>100% scale</strong>.</li>
          <li>Take to a print shop and request the exact paper size.</li>
        </ol>
      </div>

      {/* Save & Load */}
      <div className={sectionClass}>
        <p className={labelClass}>Save & Load</p>
        <div className="space-y-2">
          <button
            onClick={handleSaveDraft}
            className={`${buttonClass} bg-white/5 hover:bg-white/10 text-white/80 border border-white/10`}
          >
            {exported ? <CheckCircle size={15} className="text-emerald-400" /> : <FileJson size={15} />}
            {exported ? 'Saved!' : 'Save Draft as JSON'}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`${buttonClass} bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 border-dashed`}
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
        </div>
        <p className="text-[10px] text-white/20 text-center mt-2">
          JSON draft excludes local image files.
        </p>
      </div>

      {/* Getting Started Guide */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-white/5 hover:bg-white/10 transition-colors text-left"
        >
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
            Getting Started Guide
          </span>
          {showGuide ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
        </button>

        {showGuide && (
          <div className="p-3 space-y-3 text-[10px] text-white/40 leading-relaxed">
            <div>
              <p className="font-bold text-white/60 mb-1">Step 1 — Set your paper size</p>
              <p>Go to the <strong>Theme</strong> tab. Select your paper size and orientation.</p>
            </div>
            <div>
              <p className="font-bold text-white/60 mb-1">Step 2 — Fill in the header</p>
              <p>Go to the <strong>Header</strong> tab. Enter your project title, name, and supervisor details.</p>
            </div>
            <div>
              <p className="font-bold text-white/60 mb-1">Step 3 — Add sections</p>
              <p><strong>Right-click</strong> on the canvas to add sections. Drag to move, resize by dragging corners.</p>
            </div>
            <div>
              <p className="font-bold text-white/60 mb-1">Step 4 — Edit content</p>
              <p>Click any section to select it, then edit in the right inspector. Double-click text for quick inline edits.</p>
            </div>
            <div>
              <p className="font-bold text-white/60 mb-1">Step 5 — Export</p>
              <p>Click <strong>Export PDF</strong> for the best print results. Use Quick Print as a fallback.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPanel;
