/*
 * What does this file do?
 * Provides a theme-aware guide modal that explains the main PosterGen workflow.
 * Methods/functions in this file: AppGuideModal.
 * Last modification: 2026-05-28, Thursday.
 */
import React from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileJson,
  LayoutTemplate,
  MousePointer2,
  Sparkles,
  X,
} from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

interface AppGuideModalProps {
  onClose: () => void;
}

const GUIDE_STEPS = [
  {
    icon: <LayoutTemplate size={18} />,
    title: 'Start from the right layout',
    detail: 'Choose a template that matches your project type, or open a blank A1 canvas when you already know your structure.',
  },
  {
    icon: <MousePointer2 size={18} />,
    title: 'Edit directly on the poster',
    detail: 'Select a section to style it, drag it into position, resize it from the corners, and double-click text to update content.',
  },
  {
    icon: <Sparkles size={18} />,
    title: 'Use AI for the first draft',
    detail: 'Open AI Assistant, copy the structured prompt, attach your project report, then import the JSON response.',
  },
  {
    icon: <FileJson size={18} />,
    title: 'Keep your work portable',
    detail: 'Use draft JSON when you want to move work between devices or keep a backup outside browser storage.',
  },
  {
    icon: <Download size={18} />,
    title: 'Preview before exporting',
    detail: 'Check print preview for overflow, empty image slots, and A1 sizing before downloading the final PDF.',
  },
];

const QUICK_TIPS = [
  'Shift-click selects multiple sections.',
  'Alt-drag or middle mouse pans the workspace.',
  'Use Fit when the board feels lost after zooming.',
  'Lock finished sections so they do not move by accident.',
];

const AppGuideModal: React.FC<AppGuideModalProps> = ({ onClose }) => {
  const isDark = useThemeStore((state) => state.editorTheme === 'dark');
  const panelBg = isDark ? '#111827' : '#ffffff';
  const panelBorder = isDark ? 'rgba(148, 163, 184, 0.22)' : 'rgba(15, 23, 42, 0.12)';
  const cardBg = isDark ? '#1f2937' : '#f8fafc';
  const cardBgAlt = isDark ? '#172033' : '#eef2ff';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? 'rgba(226, 232, 240, 0.72)' : 'rgba(51, 65, 85, 0.78)';

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden p-4 sm:p-6"
      style={{
        background: isDark ? 'rgba(2, 6, 23, 0.86)' : 'rgba(15, 23, 42, 0.42)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <section
        className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          maxHeight: 'calc(100vh - 48px)',
          background: panelBg,
          borderColor: panelBorder,
          color: textPrimary,
          boxShadow: isDark
            ? '0 30px 90px rgba(0, 0, 0, 0.62)'
            : '0 30px 90px rgba(15, 23, 42, 0.28)',
        }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="poster-guide-title"
      >
      <header
        className="flex items-start gap-4 border-b px-5 py-4 sm:px-6"
        style={{ borderColor: panelBorder, background: panelBg }}
      >
        <div
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'var(--editor-accent)', color: 'var(--editor-text-inverse)' }}
        >
          <CheckCircle2 size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--editor-accent)' }}>
            Application guide
          </p>
          <h2 id="poster-guide-title" className="mt-1 text-xl font-bold">
            Build a print-ready academic poster without guessing the workflow
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed" style={{ color: textSecondary }}>
            Follow this flow when you are starting a new poster, importing AI content, or preparing the final export.
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
          style={{ color: textSecondary }}
          aria-label="Close guide"
        >
          <X size={16} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-5">
          {GUIDE_STEPS.map((step, index) => (
            <article
              key={step.title}
              className="rounded-xl border p-4"
              style={{
                background: cardBg,
                borderColor: panelBorder,
              }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: 'var(--editor-accent-bg)', color: 'var(--editor-accent)' }}
                >
                  {step.icon}
                </span>
                {index < GUIDE_STEPS.length - 1 && (
                  <ArrowRight size={14} style={{ color: 'var(--editor-text-muted)' }} />
                )}
              </div>
              <h3 className="text-sm font-bold leading-snug">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: textSecondary }}>
                {step.detail}
              </p>
            </article>
          ))}
        </div>

        <div
          className="mt-5 rounded-xl border p-4"
          style={{ background: cardBgAlt, borderColor: panelBorder }}
        >
          <h3 className="text-sm font-bold">Useful controls</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {QUICK_TIPS.map((tip) => (
              <div key={tip} className="flex items-start gap-2 text-xs" style={{ color: textSecondary }}>
                <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--editor-success)' }} />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </section>
    </div>,
    document.body,
  );
};

export default AppGuideModal;
