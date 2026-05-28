/*
 * What does this file do?
 * Renders the scrollable template selection page and applies selected poster templates.
 * Methods/functions in this file: TemplatesPage, TemplatePreview.
 * Last modification: 2026-05-28, Thursday.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  HelpCircle,
  Layout,
  Search,
  Sparkles,
} from 'lucide-react';
import AppGuideModal from '../components/layout/AppGuideModal';
import { TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory } from '../data/templates';
import { useHistoryStore } from '../store/useHistoryStore';
import { usePosterStore } from '../store/usePosterStore';
import { useThemeStore } from '../store/useThemeStore';

const TemplatesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [query, setQuery] = React.useState('');
  const [showGuide, setShowGuide] = React.useState(false);
  const navigate = useNavigate();
  const isDark = useThemeStore((state) => state.editorTheme === 'dark');

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

  const categories = ['All', ...TEMPLATE_CATEGORIES];
  const templates = getTemplatesByCategory(activeCategory).filter((template) => {
    const searchable = `${template.name} ${template.category} ${template.description}`.toLowerCase();
    return searchable.includes(query.trim().toLowerCase());
  });

  const cardStyle: React.CSSProperties = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    boxShadow: isDark ? '0 18px 45px rgba(0,0,0,0.24)' : '0 18px 45px rgba(15,23,42,0.08)',
  };

  const handleUseTemplate = (templateId: string) => {
    const template = TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;

    const store = usePosterStore.getState();
    store.setSections(template.poster.sections);
    store.updateHeader(template.poster.header);
    store.updateFooter(template.poster.footer);
    store.updateTheme(template.poster.theme);
    store.updateLayout(template.poster.layout);
    usePosterStore.setState({ id: template.poster.id });
    store.setHydrated(true);

    useHistoryStore.getState().clear();
    useHistoryStore.getState().push(usePosterStore.getState());

    navigate('/builder');
  };

  const handleBlankCanvas = () => {
    usePosterStore.getState().createBlankPoster();
    useHistoryStore.getState().clear();
    navigate('/builder');
  };

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden" style={{ background: colors.page, color: colors.text }}>
      <nav
        className="sticky top-0 z-50 border-b px-4 py-3 sm:px-6"
        style={{
          background: isDark ? 'rgba(11, 17, 32, 0.94)' : 'rgba(248, 250, 252, 0.94)',
          borderColor: colors.border,
          backdropFilter: 'blur(14px)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:bg-black/5"
              style={{ borderColor: colors.border, color: colors.muted }}
              aria-label="Back to home"
            >
              <ArrowLeft size={16} />
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: colors.accent }}>
                <Layout size={16} />
              </span>
              <span className="text-base font-bold">PosterGen</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(true)}
              className="flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-colors hover:bg-black/5"
              style={{ borderColor: colors.border, color: colors.muted }}
            >
              <HelpCircle size={14} />
              Guide
            </button>
            <button
              onClick={handleBlankCanvas}
              className="hidden h-9 items-center rounded-xl px-3 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 sm:flex"
              style={{ background: colors.accent }}
            >
              Blank Canvas
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest"
              style={{ background: colors.surfaceAlt, borderColor: colors.border, color: colors.accent }}
            >
              <Sparkles size={13} />
              Template library
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              Start from a layout that already matches your poster story.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7" style={{ color: colors.muted }}>
              Pick a structure for your project type, then customize every section in the editor. Templates are starting points,
              not fixed designs.
            </p>
          </div>
          <aside className="rounded-2xl border p-5" style={{ ...cardStyle, background: colors.surfaceAlt }}>
            <p className="text-sm font-bold">Recommended flow</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {['Choose', 'Edit', 'Export'].map((item) => (
                <div key={item} className="rounded-xl border px-2 py-3 text-center text-xs font-bold" style={{ background: colors.surface, borderColor: colors.border }}>
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6" style={{ color: colors.muted }}>
              Use templates when you want a balanced A1 composition before adding your real content.
            </p>
          </aside>
        </section>

        <section className="mt-8 rounded-2xl border p-4" style={{ background: colors.surface, borderColor: colors.border }}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className="h-9 rounded-xl border px-3 text-xs font-bold transition-all"
                  style={{
                    background: activeCategory === category ? colors.accent : colors.card,
                    borderColor: activeCategory === category ? colors.accent : colors.border,
                    color: activeCategory === category ? '#ffffff' : colors.muted,
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
            <label
              className="flex h-10 min-w-0 items-center gap-2 rounded-xl border px-3 lg:w-80"
              style={{ background: colors.card, borderColor: colors.border, color: colors.muted }}
            >
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search templates"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                style={{ color: colors.text }}
              />
            </label>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <button onClick={handleBlankCanvas} className="group text-left">
            <article
              className="flex h-full min-h-[320px] flex-col justify-between rounded-2xl border border-dashed p-5 transition-transform group-hover:-translate-y-1"
              style={{ background: colors.surface, borderColor: colors.border }}
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: colors.surfaceAlt, color: colors.accent }}>
                  <FileText size={21} />
                </span>
                <h2 className="mt-5 text-xl font-black">Blank Canvas</h2>
                <p className="mt-2 text-sm leading-6" style={{ color: colors.muted }}>
                  Start from a clean A1 board when your poster needs a custom structure.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: colors.faint }}>Full control</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: colors.accent }}>
                  <ArrowRight size={15} />
                </span>
              </div>
            </article>
          </button>

          {templates.map((template) => (
            <button key={template.id} onClick={() => handleUseTemplate(template.id)} className="group text-left">
              <article
                className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border transition-transform group-hover:-translate-y-1"
                style={cardStyle}
              >
                <div className="border-b p-5" style={{ borderColor: colors.border, background: colors.surfaceAlt }}>
                  <TemplatePreview color={template.poster.theme.primaryColor} sectionCount={template.poster.sections.length} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ background: colors.surfaceAlt, color: colors.accent }}>
                      {template.category}
                    </span>
                    <span className="text-xs font-bold" style={{ color: colors.faint }}>
                      {template.poster.sections.length} sections
                    </span>
                  </div>
                  <h2 className="text-lg font-black">{template.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6" style={{ color: colors.muted }}>
                    {template.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: colors.teal }}>
                      <CheckCircle2 size={14} />
                      Editable layout
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white" style={{ background: colors.accent }}>
                      Use Template
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </article>
            </button>
          ))}
        </section>

        {templates.length === 0 && (
          <div className="mt-8 rounded-2xl border p-8 text-center" style={{ background: colors.surface, borderColor: colors.border }}>
            <p className="font-bold">No templates found</p>
            <p className="mt-2 text-sm" style={{ color: colors.muted }}>Try a different category or search term.</p>
          </div>
        )}
      </main>

      <footer className="border-t px-4 py-6 text-center sm:px-6" style={{ background: colors.surface, borderColor: colors.border }}>
        <p className="text-sm font-bold" style={{ color: colors.text }}>Made to make Life Easier</p>
        <p className="mt-1 text-xs" style={{ color: colors.faint }}>PosterGen</p>
      </footer>

      {showGuide && <AppGuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
};

const TemplatePreview: React.FC<{ color: string; sectionCount: number }> = ({ color, sectionCount }) => (
  <div className="mx-auto aspect-[1.414/1] w-full max-w-[340px] rounded-xl bg-white p-2 shadow-xl">
    <div className="mb-2 flex h-8 items-center gap-2 border-b" style={{ borderColor: `${color}55` }}>
      <span className="h-6 w-9 rounded-md border bg-slate-50" />
      <div className="min-w-0 flex-1">
        <div className="mx-auto h-2 w-2/3 rounded" style={{ background: '#1f2937' }} />
        <div className="mx-auto mt-1 h-1.5 w-1/2 rounded" style={{ background: `${color}33` }} />
      </div>
    </div>
    <div className="grid h-[calc(100%-40px)] grid-cols-3 gap-1.5">
      {Array.from({ length: Math.min(6, Math.max(4, sectionCount)) }).map((_, index) => (
        <div
          key={index}
          className={`${index === 2 ? 'row-span-2' : ''} rounded-md border bg-slate-50 p-1`}
          style={{ borderColor: `${color}35` }}
        >
          <div className="mb-1 h-1.5 rounded" style={{ background: color }} />
          <div className="space-y-1">
            <div className="h-1 rounded bg-slate-200" />
            <div className="h-1 w-4/5 rounded bg-slate-200" />
            <div className="h-1 w-2/3 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TemplatesPage;
