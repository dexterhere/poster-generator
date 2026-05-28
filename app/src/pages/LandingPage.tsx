/*
 * What does this file do?
 * Renders the modern scrollable product landing page for PosterGen.
 * Methods/functions in this file: LandingPage.
 * Last modification: 2026-05-28, Thursday.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  FileJson,
  HelpCircle,
  Layout,
  Layers,
  Moon,
  MousePointer2,
  Palette,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  Wand2,
} from 'lucide-react';
import AppGuideModal from '../components/layout/AppGuideModal';
import { useHistoryStore } from '../store/useHistoryStore';
import { usePosterStore } from '../store/usePosterStore';
import { useThemeStore } from '../store/useThemeStore';

const WORKFLOW = [
  {
    icon: <Layout size={18} />,
    title: 'Choose a structure',
    desc: 'Start with a poster template, import an AI JSON draft, or open a clean A1 board.',
  },
  {
    icon: <MousePointer2 size={18} />,
    title: 'Edit visually',
    desc: 'Move sections, resize cards, tune typography, and upload diagrams directly on canvas.',
  },
  {
    icon: <Download size={18} />,
    title: 'Review and export',
    desc: 'Use print preview, keep a JSON backup, then export the final A1 poster.',
  },
];

const FEATURES = [
  { icon: <Wand2 size={18} />, title: 'AI draft flow', desc: 'Structured prompt and JSON import for fast first drafts.' },
  { icon: <Upload size={18} />, title: 'Diagram slots', desc: 'Upload architecture, workflow, and result images into sections.' },
  { icon: <Palette size={18} />, title: 'Poster styling', desc: 'Control cards, tables, titles, colors, fonts, and layout density.' },
  { icon: <Layers size={18} />, title: 'Templates', desc: 'Start from academic, engineering, data, and business layouts.' },
  { icon: <FileJson size={18} />, title: 'Portable drafts', desc: 'Download JSON backups when moving work between sessions.' },
  { icon: <ShieldCheck size={18} />, title: 'Local first', desc: 'Draft work stays in the browser unless you export it.' },
];

const LandingPage: React.FC = () => {
  const { editorTheme, toggleTheme } = useThemeStore();
  const [showGuide, setShowGuide] = React.useState(false);
  const isDark = editorTheme === 'dark';

  const colors = {
    page: isDark ? '#0b1120' : '#f8fafc',
    surface: isDark ? '#111827' : '#ffffff',
    surfaceAlt: isDark ? '#172033' : '#eef2ff',
    card: isDark ? '#151f32' : '#ffffff',
    border: isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(15, 23, 42, 0.10)',
    text: isDark ? '#f8fafc' : '#0f172a',
    muted: isDark ? 'rgba(226, 232, 240, 0.70)' : 'rgba(51, 65, 85, 0.75)',
    faint: isDark ? 'rgba(226, 232, 240, 0.50)' : 'rgba(71, 85, 105, 0.62)',
    accent: '#4f46e5',
    teal: '#0d9488',
  };

  const startBlank = () => {
    usePosterStore.getState().createBlankPoster();
    useHistoryStore.getState().clear();
  };

  const cardStyle: React.CSSProperties = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    boxShadow: isDark ? '0 18px 45px rgba(0,0,0,0.28)' : '0 18px 45px rgba(15,23,42,0.08)',
  };

  return (
    <div
      className="h-screen overflow-y-auto overflow-x-hidden"
      style={{ background: colors.page, color: colors.text }}
    >
      <nav
        className="sticky top-0 z-50 border-b px-4 py-3 sm:px-6"
        style={{
          background: isDark ? 'rgba(11, 17, 32, 0.94)' : 'rgba(248, 250, 252, 0.94)',
          borderColor: colors.border,
          backdropFilter: 'blur(14px)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: colors.accent }}>
              <Layout size={17} />
            </span>
            <span className="text-base font-bold">PosterGen</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(true)}
              className="hidden h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-colors hover:bg-black/5 sm:flex"
              style={{ borderColor: colors.border, color: colors.muted }}
            >
              <HelpCircle size={14} />
              Guide
            </button>
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:bg-black/5"
              style={{ borderColor: colors.border, color: colors.muted }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link
              to="/templates"
              className="hidden h-9 items-center rounded-xl border px-3 text-xs font-semibold transition-colors hover:bg-black/5 sm:flex"
              style={{ borderColor: colors.border, color: colors.muted }}
            >
              Templates
            </Link>
            <Link
              to="/builder"
              onClick={startBlank}
              className="flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: colors.accent }}
            >
              Open Builder
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:pb-20 lg:pt-16">
          <div>
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest"
              style={{ background: colors.surfaceAlt, borderColor: colors.border, color: colors.accent }}
            >
              <Sparkles size={13} />
              A1 academic poster builder
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Build a polished poster without fighting the layout.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8" style={{ color: colors.muted }}>
              PosterGen helps students turn reports, diagrams, and research notes into a clean A1 poster with templates,
              AI-assisted content, direct canvas editing, and print-ready export.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/templates"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: colors.accent }}
              >
                Start with Templates
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => setShowGuide(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition-colors hover:bg-black/5"
                style={{ borderColor: colors.border, color: colors.text, background: colors.surface }}
              >
                View Guide
                <HelpCircle size={16} />
              </button>
            </div>
            <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
              {['Templates', 'AI JSON', 'A1 PDF'].map((item) => (
                <div key={item} className="rounded-xl border px-3 py-3 text-center" style={{ ...cardStyle, boxShadow: 'none' }}>
                  <p className="text-xs font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border p-3" style={cardStyle}>
              <div className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: 'rgba(15,23,42,0.10)' }}>
                <div className="flex h-10 items-center gap-2 border-b bg-slate-100 px-4" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 rounded-md bg-white px-3 py-1 text-[10px] font-semibold text-slate-500">
                    PosterGen workspace
                  </span>
                </div>
                <div className="grid gap-2 bg-slate-200 p-4 lg:grid-cols-[46px_1fr_118px]">
                  <div className="hidden flex-col gap-2 rounded-xl bg-slate-900 p-2 lg:flex">
                    {[colors.accent, colors.teal, '#eab308', '#64748b'].map((color) => (
                      <span key={color} className="h-8 rounded-lg" style={{ background: color }} />
                    ))}
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-xl">
                    <div className="mb-3 flex items-center gap-2 border-b pb-3">
                      <span className="h-10 w-10 rounded-lg border bg-slate-50" />
                      <div className="min-w-0 flex-1">
                        <div className="mx-auto h-3 w-3/4 rounded bg-slate-800" />
                        <div className="mx-auto mt-2 h-2 w-1/2 rounded bg-teal-200" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="min-h-20 rounded-lg border bg-slate-50 p-2" style={{ borderColor: item % 2 ? '#bfdbfe' : '#99f6e4' }}>
                          <div className="mb-2 h-2 w-2/3 rounded bg-teal-600" />
                          <div className="space-y-1">
                            <div className="h-1.5 rounded bg-slate-200" />
                            <div className="h-1.5 w-4/5 rounded bg-slate-200" />
                            <div className="h-1.5 w-2/3 rounded bg-slate-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="hidden rounded-xl bg-white p-3 shadow-lg lg:block">
                    <p className="text-xs font-bold text-slate-800">Section tools</p>
                    <div className="mt-3 space-y-2">
                      {[0, 1, 2, 3].map((item) => (
                        <div key={item} className="h-8 rounded-lg bg-slate-100" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y px-4 py-12 sm:px-6" style={{ background: colors.surface, borderColor: colors.border }}>
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {WORKFLOW.map((step, index) => (
              <article key={step.title} className="rounded-2xl border p-5" style={cardStyle}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.surfaceAlt, color: colors.accent }}>
                    {step.icon}
                  </span>
                  <span className="text-xs font-black" style={{ color: colors.faint }}>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h2 className="text-base font-bold">{step.title}</h2>
                <p className="mt-2 text-sm leading-6" style={{ color: colors.muted }}>{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.accent }}>Product features</p>
              <h2 className="mt-2 text-3xl font-black">Everything needed for final poster delivery</h2>
            </div>
            <Link to="/templates" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: colors.accent }}>
              Browse templates
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="rounded-2xl border p-5" style={{ ...cardStyle, boxShadow: 'none' }}>
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.surfaceAlt, color: colors.teal }}>
                  {feature.icon}
                </span>
                <h3 className="text-sm font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: colors.muted }}>{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="rounded-3xl border p-6 sm:p-8" style={{ ...cardStyle, background: colors.surfaceAlt }}>
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">Ready to turn your project into a poster?</h2>
                <p className="mt-2 text-sm leading-6" style={{ color: colors.muted }}>
                  Start with a proven layout, then refine the details inside the builder.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/templates" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-white" style={{ background: colors.accent }}>
                  Choose Template
                  <ArrowRight size={15} />
                </Link>
                <Link to="/builder" onClick={startBlank} className="inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-bold" style={{ background: colors.surface, borderColor: colors.border }}>
                  Blank Canvas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-6 text-center sm:px-6" style={{ background: colors.surface, borderColor: colors.border }}>
        <p className="text-sm font-bold" style={{ color: colors.text }}>Made to make Life Easier</p>
        <p className="mt-1 text-xs" style={{ color: colors.faint }}>PosterGen</p>
      </footer>

      {showGuide && <AppGuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
};

export default LandingPage;
