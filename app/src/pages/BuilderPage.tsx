import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosterStore } from '../store/usePosterStore';
import HeaderPanel from '../components/panels/HeaderPanel';
import SectionsListPanel from '../components/panels/SectionsListPanel';
import ThemePanel from '../components/panels/ThemePanel';
import ExportPanel from '../components/panels/ExportPanel';
import SectionEditor from '../components/editor/SectionEditor';
import PosterHeader from '../components/poster/PosterHeader';
import PosterFooter from '../components/poster/PosterFooter';
import PosterGrid from '../components/poster/PosterGrid';
import { Layout, Type, Palette, Download, ChevronLeft } from 'lucide-react';

type Tab = 'header' | 'sections' | 'theme' | 'export';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'header', label: 'Header', icon: <Type size={14} /> },
  { id: 'sections', label: 'Sections', icon: <Layout size={14} /> },
  { id: 'theme', label: 'Theme', icon: <Palette size={14} /> },
  { id: 'export', label: 'Export', icon: <Download size={14} /> },
];

// A1 landscape poster dimensions
const POSTER_WIDTH = 1189;
const POSTER_HEIGHT = 841;
const POSTER_SCALE = 0.75;

const BuilderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('header');
  const { selectedSectionId } = usePosterStore();

  // Grid body height = poster height minus header (~170px) minus footer (~32px)
  const gridContainerWidth = POSTER_WIDTH - 24; // minus padding

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-neutral-100 font-sans">

      {/* ─── LEFT PANEL ─── */}
      <div className="w-[360px] flex-shrink-0 bg-white border-r border-neutral-200 flex flex-col shadow-sm z-10 print:hidden">

        {/* Branding */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <Link to="/" className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-700 text-xs mb-1 transition-colors">
              <ChevronLeft size={12} /> Home
            </Link>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Poster Generator
            </h1>
          </div>
          <span className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full font-medium">A1 · Landscape</span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 bg-neutral-50">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 bg-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'header' && <HeaderPanel />}
          {activeTab === 'sections' && (
            <>
              <SectionsListPanel />
              {selectedSectionId && (
                <div className="border-t border-neutral-200">
                  <SectionEditor />
                </div>
              )}
            </>
          )}
          {activeTab === 'theme' && <ThemePanel />}
          {activeTab === 'export' && <ExportPanel />}
        </div>
      </div>

      {/* ─── RIGHT: POSTER CANVAS ─── */}
      <div className="flex-1 bg-neutral-200/60 overflow-auto flex items-start justify-center p-8 print:p-0 print:bg-white">
        {/* Scaled Poster Wrapper */}
        <div
          id="poster-canvas"
          className="bg-white shadow-2xl print:shadow-none mx-auto flex-shrink-0 overflow-hidden flex flex-col"
          style={{
            width: `${POSTER_WIDTH}px`,
            height: `${POSTER_HEIGHT}px`,
            transform: `scale(${POSTER_SCALE})`,
            transformOrigin: 'top center',
            marginBottom: `${POSTER_HEIGHT * (POSTER_SCALE - 1)}px`,
          }}
        >
          {/* Poster Header */}
          <PosterHeader />

          {/* Poster Grid Body */}
          <div className="flex-1 overflow-hidden relative">
            <PosterGrid containerWidth={gridContainerWidth} />
          </div>

          {/* Poster Footer */}
          <PosterFooter />
        </div>
      </div>

    </div>
  );
};

export default BuilderPage;
