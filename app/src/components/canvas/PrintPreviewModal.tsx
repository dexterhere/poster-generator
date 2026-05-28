import React from 'react';
import { X, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { usePosterStore } from '../../store/usePosterStore';
import { exportPosterToPDF, downloadBlob } from '../../utils/pdfExport';
import { useToast } from '../ui/ToastContext';
import { analyzePrintReadiness } from '../../utils/printReadiness';

interface PrintPreviewModalProps {
  onClose: () => void;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ onClose }) => {
  const state = usePosterStore.getState();
  const { layout, header, sections, theme } = state;
  const { addToast } = useToast();
  const [isExporting, setIsExporting] = React.useState(false);

  const orientation = layout.width > layout.height ? 'Landscape' : 'Portrait';
  const sectionCount = sections.length;
  const headerEnabled = theme.headerEnabled !== false;
  const hasTitle = !headerEnabled || header.projectTitle.trim().length > 0;
  const hasStudentName = header.studentName.trim().length > 0;
  const hasSupervisor = !headerEnabled || header.supervisorName.trim().length > 0;
  const safeMargin = 10;
  const emptySections = sections.filter((s) => {
    if (s.type === 'text') return !(s.content as { body?: string }).body?.trim();
    if (s.type === 'image') return !(s.content as { imageUrl?: string | null }).imageUrl;
    if (s.type === 'split-image') {
      const content = s.content as { leftImageUrl?: string | null; rightImageUrl?: string | null };
      return !content.leftImageUrl || !content.rightImageUrl;
    }
    return false;
  });
  const overflowSections = sections.filter((s) =>
    s.position.x < 0 ||
    s.position.y < 0 ||
    s.position.x + s.position.width > layout.width ||
    s.position.y + s.position.height > layout.height
  );
  const outsideSafeArea = sections.filter((s) =>
    s.position.x < safeMargin ||
    s.position.y < safeMargin ||
    s.position.x + s.position.width > layout.width - safeMargin ||
    s.position.y + s.position.height > layout.height - safeMargin
  );
  const validPaper = layout.width > 0 && layout.height > 0 && layout.width <= 1400 && layout.height <= 1400;
  const printReport = analyzePrintReadiness(state);

  const checks = [
    { label: 'Project title filled', pass: hasTitle },
    { label: headerEnabled ? 'Student name filled' : 'Header intentionally hidden', pass: !headerEnabled || hasStudentName },
    { label: 'Supervisor name filled', pass: hasSupervisor },
    { label: `${sectionCount} sections added`, pass: sectionCount >= 3 },
    { label: 'All sections have content', pass: emptySections.length === 0 },
    { label: 'No sections outside poster edge', pass: overflowSections.length === 0 },
    { label: 'Content fits within 10mm safe area', pass: outsideSafeArea.length === 0 },
    { label: `${layout.name} has valid print dimensions`, pass: validPaper },
  ];

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const blob = await exportPosterToPDF();
      downloadBlob(blob, `poster-${layout.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      addToast('PDF exported successfully', 'success');
    } catch {
      addToast('PDF export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="glass-panel w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--editor-border)' }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--editor-text)', fontFamily: "'Poppins', sans-serif" }}>
              Print Preview
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--editor-text-secondary)' }}>
              Check your poster before printing
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ color: 'var(--editor-text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-5">
            <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--editor-border)', background: 'var(--editor-input-bg)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--editor-text)' }}>
                A1 Print View
              </h3>
              <div className="w-full overflow-hidden rounded-lg bg-neutral-300 p-4">
                <div
                  className="relative mx-auto bg-white shadow-xl"
                  style={{
                    width: '100%',
                    maxWidth: 620,
                    aspectRatio: `${layout.width} / ${layout.height}`,
                  }}
                >
                  {theme.headerEnabled !== false && (
                    <div
                      className="absolute left-0 top-0 right-0 border-b"
                      style={{
                        height: `${Math.min(22, Math.max(8, ((header.headerPadding ?? 12) * 2 + (header.titleFontSize ?? 32)) / layout.height * 100))}%`,
                        borderColor: theme.primaryColor,
                        background: 'rgba(13,115,119,0.05)',
                      }}
                    />
                  )}
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="absolute rounded border overflow-hidden"
                      style={{
                        left: `${(section.position.x / layout.width) * 100}%`,
                        top: `${(section.position.y / layout.height) * 100}%`,
                        width: `${(section.position.width / layout.width) * 100}%`,
                        height: `${(section.position.height / layout.height) * 100}%`,
                        borderColor: section.position.x < 0 || section.position.y < 0 || section.position.x + section.position.width > layout.width || section.position.y + section.position.height > layout.height
                          ? 'rgba(220,38,38,0.75)'
                          : 'rgba(13,115,119,0.35)',
                        background: 'rgba(13,115,119,0.08)',
                      }}
                      title={section.title}
                    >
                      <span className="block truncate px-1 py-0.5 text-[6px] font-bold uppercase" style={{ color: theme.primaryColor }}>
                        {section.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              <div className="p-4 rounded-xl border text-center" style={{ borderColor: 'var(--editor-border)', background: 'var(--editor-input-bg)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--editor-accent)' }}>{layout.width}</p>
                <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--editor-text-muted)' }}>Width (mm)</p>
              </div>
              <div className="p-4 rounded-xl border text-center" style={{ borderColor: 'var(--editor-border)', background: 'var(--editor-input-bg)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--editor-accent)' }}>{layout.height}</p>
                <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--editor-text-muted)' }}>Height (mm)</p>
              </div>
              <div className="p-4 rounded-xl border text-center" style={{ borderColor: 'var(--editor-border)', background: 'var(--editor-input-bg)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--editor-accent)' }}>{orientation}</p>
                <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--editor-text-muted)' }}>Orientation</p>
              </div>
            </div>
          </div>

          {/* Scale reference */}
          <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--editor-border)', background: 'var(--editor-input-bg)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--editor-text)' }}>
              Scale Reference
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-8 border-2 border-dashed rounded flex items-center justify-center" style={{ borderColor: 'var(--editor-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--editor-text-muted)' }}>100mm on screen = 100mm when printed</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--editor-text-secondary)' }}>
              Your poster is designed at 1 pixel = 1 millimeter. When you export as PDF,
              the dimensions are preserved exactly. At the print shop, request paper size
              <strong> {layout.name}</strong> with <strong>no scaling</strong>.
            </p>
          </div>

          {/* Readability */}
          <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--editor-border)', background: 'var(--editor-input-bg)' }}>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--editor-text)' }}>
                  A1 Readability
                </h3>
                <p className="text-[11px] mt-1" style={{ color: 'var(--editor-text-secondary)' }}>
                  Checks text size, content density, safe area, and section overflow.
                </p>
              </div>
              <div
                className="w-16 h-16 rounded-2xl border flex flex-col items-center justify-center"
                style={{
                  borderColor: printReport.score >= 85 ? 'rgba(52,211,153,0.35)' : printReport.score >= 65 ? 'rgba(251,191,36,0.35)' : 'rgba(248,113,113,0.35)',
                  background: printReport.score >= 85 ? 'rgba(52,211,153,0.10)' : printReport.score >= 65 ? 'rgba(251,191,36,0.10)' : 'rgba(248,113,113,0.10)',
                }}
              >
                <span className="text-xl font-bold" style={{ color: 'var(--editor-text)' }}>{printReport.score}</span>
                <span className="text-[9px]" style={{ color: 'var(--editor-text-muted)' }}>score</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
              {[
                { label: 'Errors', value: printReport.errorCount, color: 'var(--editor-danger)' },
                { label: 'Warnings', value: printReport.warningCount, color: 'var(--editor-warning)' },
                { label: 'Notes', value: printReport.infoCount, color: 'var(--editor-text-muted)' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border px-3 py-2" style={{ borderColor: 'var(--editor-border)' }}>
                  <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--editor-text-muted)' }}>{item.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {printReport.issues.slice(0, 8).map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-start gap-3 px-3 py-2 rounded-lg"
                  style={{
                    background: issue.severity === 'error' ? 'rgba(248,113,113,0.08)' : issue.severity === 'warning' ? 'rgba(251,191,36,0.08)' : 'rgba(148,163,184,0.08)',
                    border: `1px solid ${issue.severity === 'error' ? 'rgba(248,113,113,0.2)' : issue.severity === 'warning' ? 'rgba(251,191,36,0.2)' : 'rgba(148,163,184,0.2)'}`,
                  }}
                >
                  {issue.severity === 'info' ? (
                    <CheckCircle size={16} style={{ color: 'var(--editor-text-muted)' }} />
                  ) : (
                    <AlertTriangle size={16} style={{ color: issue.severity === 'error' ? 'var(--editor-danger)' : 'var(--editor-warning)' }} />
                  )}
                  <div>
                    <p className="text-xs font-semibold" style={{ color: issue.severity === 'error' ? 'var(--editor-danger)' : issue.severity === 'warning' ? 'var(--editor-warning)' : 'var(--editor-text)' }}>
                      {issue.label}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--editor-text-secondary)' }}>
                      {issue.detail}
                    </p>
                  </div>
                </div>
              ))}
              {printReport.issues.length === 0 && (
                <div className="rounded-lg border px-3 py-2" style={{ borderColor: 'rgba(52,211,153,0.2)', background: 'rgba(52,211,153,0.08)' }}>
                  <p className="text-xs font-semibold" style={{ color: 'var(--editor-success)' }}>
                    Poster text meets the current A1 readability checks.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--editor-text)' }}>
              Pre-Print Checklist
            </h3>
            <div className="space-y-2">
              {checks.map((check, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{
                    background: check.pass ? 'rgba(52, 211, 153, 0.08)' : 'rgba(251, 191, 36, 0.08)',
                    border: `1px solid ${check.pass ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)'}`,
                  }}
                >
                  {check.pass ? (
                    <CheckCircle size={16} style={{ color: 'var(--editor-success)' }} />
                  ) : (
                    <AlertTriangle size={16} style={{ color: 'var(--editor-warning)' }} />
                  )}
                  <span className="text-xs" style={{ color: check.pass ? 'var(--editor-success)' : 'var(--editor-warning)' }}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Print tips */}
          <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--editor-border)', background: 'var(--editor-input-bg)' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--editor-text)' }}>
              Print Shop Instructions
            </h3>
            <ol className="text-[11px] space-y-1.5 list-decimal list-inside" style={{ color: 'var(--editor-text-secondary)' }}>
              <li>Export the PDF using the button below</li>
              <li>Take the PDF file to any print shop</li>
              <li>Ask for <strong>{layout.name}</strong> paper size</li>
              <li>Specify <strong>no margins</strong> and <strong>100% scale</strong> (do not fit to page)</li>
              <li>For best quality, request <strong>matte or gloss poster paper</strong></li>
            </ol>
          </div>
        </div>

        {/* Footer actions */}
        <div className="shrink-0 px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--editor-border)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-white/5"
            style={{ color: 'var(--editor-text-secondary)' }}
          >
            Close
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-40"
            style={{ background: 'var(--editor-accent)', color: 'var(--editor-text-inverse)' }}
          >
            <Download size={15} />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;
