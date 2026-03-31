import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Upload, Palette, Download, ArrowRight, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: <Layout size={22} />,
    title: 'Drag & Resize Grid',
    desc: 'Move and resize sections on a live 3-column grid. Your layout updates in real time.',
  },
  {
    icon: <Upload size={22} />,
    title: 'Image & Diagram Upload',
    desc: 'Upload SVG, PNG, or JPG files directly into any section for use case diagrams, Gantt charts, and more.',
  },
  {
    icon: <Palette size={22} />,
    title: 'Full Theme Control',
    desc: 'Choose from 6 colour themes, 4 font pairings, and multiple card styles to match your department.',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'AI Prompt Helper',
    desc: 'Get ready-made prompts for every section — paste into ChatGPT or Claude for instant content.',
  },
  {
    icon: <Download size={22} />,
    title: 'A1 PDF Export',
    desc: 'Download print-ready A1 poster (841×594mm landscape) directly from your browser.',
  },
  {
    icon: <Layout size={22} />,
    title: '7 Section Types',
    desc: 'Text, Table, Flow, Image, Split Image, List, and Stats — an appropriate type for every academic need.',
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white font-sans">

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Layout size={14} />
          </div>
          <span className="font-bold text-lg">PosterGen</span>
        </div>
        <Link
          to="/builder"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm font-semibold backdrop-blur-sm"
        >
          Open Builder
        </Link>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-sm">
          <Sparkles size={12} />
          Academic Poster Generator · A1 Print Ready
        </div>
        <h1 className="text-6xl font-black leading-tight tracking-tight mb-6">
          Create your academic<br />
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            poster in minutes
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Fill in your content, drag your sections into place, upload your diagrams, and download a print-ready A1 poster. No design experience required.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
          >
            Start Building
            <ArrowRight size={18} />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-semibold text-lg backdrop-blur-sm"
          >
            See Features
          </a>
        </div>
      </div>

      {/* Preview mockup */}
      <div className="max-w-5xl mx-auto px-6 mb-24">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm shadow-2xl">
          <div className="bg-neutral-900 rounded-xl overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-neutral-800 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4 bg-neutral-700 rounded-md h-5 text-[9px] text-neutral-400 flex items-center px-3">
                localhost:5173/builder
              </div>
            </div>
            {/* Two-panel preview */}
            <div className="flex h-48">
              <div className="w-[28%] bg-neutral-800 border-r border-white/5 p-3 space-y-2">
                <div className="h-3 bg-indigo-500/40 rounded w-3/4" />
                <div className="h-2 bg-white/10 rounded w-full" />
                <div className="h-2 bg-white/10 rounded w-4/5" />
                <div className="h-2 bg-white/10 rounded w-full" />
                <div className="mt-4 space-y-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-white/5 rounded-md border border-white/10" />
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-neutral-900 p-3">
                <div className="bg-white/5 rounded-lg h-full border border-white/10 p-2 flex flex-col gap-2">
                  <div className="h-8 rounded-md border-b border-indigo-500/30 flex items-center px-2 gap-3">
                    <div className="w-6 h-6 rounded bg-white/10" />
                    <div className="flex-1 h-2 bg-white/20 rounded" />
                    <div className="w-6 h-6 rounded bg-white/10" />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-1.5">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white/5 rounded border border-white/10 p-1">
                        <div className="h-2 bg-indigo-500/30 rounded mb-1" />
                        <div className="space-y-0.5">
                          <div className="h-1 bg-white/10 rounded" />
                          <div className="h-1 bg-white/10 rounded w-4/5" />
                          <div className="h-1 bg-white/10 rounded w-3/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to present your project</h2>
        <div className="grid grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 mb-3">
                {f.icon}
              </div>
              <h3 className="font-bold text-sm mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="p-10 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-4">Ready to build your poster?</h2>
          <p className="text-slate-400 mb-6">No account needed. Works entirely in your browser.</p>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/25"
          >
            Open Poster Builder
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        Academic Poster Generator · Built for students · No data is stored
      </div>
    </div>
  );
};

export default LandingPage;
