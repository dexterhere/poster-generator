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
import PosterCanvas from '../components/poster/PosterCanvas';
import PosterRuler, { RULER_SIZE } from '../components/poster/PosterRuler';
import { Layout, Type, Palette, Download, ChevronLeft, Maximize, Minimize, ZoomIn, ZoomOut, Search, Scan } from 'lucide-react';

type Tab = 'header' | 'sections' | 'theme' | 'export';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'header', label: 'Header', icon: <Type size={14} /> },
  { id: 'sections', label: 'Sections', icon: <Layout size={14} /> },
  { id: 'theme', label: 'Theme', icon: <Palette size={14} /> },
  { id: 'export', label: 'Export', icon: <Download size={14} /> },
];

const BuilderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('header');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number | 'fit'>('fit');
  const { selectedSectionId, theme, layout } = usePosterStore();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Calculate full screen scale
  React.useEffect(() => {
    const handleResize = () => {
      // Force re-render on resize if fullscreen
      if (isFullScreen) setActiveTab(activeTab);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullScreen, activeTab]);

  // Auto-switch to sections tab when a section is clicked on the canvas
  React.useEffect(() => {
    if (selectedSectionId && activeTab !== 'sections' && !isFullScreen) {
      setActiveTab('sections');
    }
  }, [selectedSectionId, isFullScreen]);

  const getDynamicScale = () => {
    const padding = 80;
    const sidebarWidth = isFullScreen ? 0 : 360;
    const rulerSpace = (!isFullScreen && theme.rulerEnabled) ? RULER_SIZE * 2 : 0;
    const availableWidth = window.innerWidth - sidebarWidth - padding - rulerSpace;
    const availableHeight = window.innerHeight - padding - rulerSpace;
    const scaleX = availableWidth / layout.width;
    const scaleY = availableHeight / layout.height;
    return Math.min(scaleX, scaleY);
  };

  const currentScale = zoomLevel === 'fit' ? getDynamicScale() : zoomLevel;

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoomLevel(prev => {
          const current = prev === 'fit' ? getDynamicScale() : prev;
          const zoomStep = 0.1;
          if (e.deltaY > 0) return Math.max(0.1, current - zoomStep);
          return Math.min(3.0, current + zoomStep);
        });
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [layout.width, layout.height, isFullScreen]);

  return (
    <div className={`flex w-screen h-screen overflow-hidden text-neutral-900 font-sans ${isFullScreen ? 'bg-neutral-900' : 'bg-neutral-100'}`}>

      {/* ─── LEFT PANEL ─── */}
      {!isFullScreen && (
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
          <span className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full font-medium">{layout.name}</span>
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
      )}

      {/* ─── RIGHT: POSTER CANVAS ─── */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-auto flex print:p-0 print:bg-white relative ${isFullScreen ? 'p-0 bg-neutral-900' : 'p-8 bg-neutral-200/60'}`}
        style={{ alignItems: currentScale === getDynamicScale() ? 'center' : 'flex-start', justifyContent: currentScale === getDynamicScale() ? 'center' : 'flex-start' }}
      >
        
        {/* Full Screen Toggle */}
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className={`fixed top-4 right-6 z-50 p-2 rounded-full shadow-md print:hidden flex items-center justify-center transition-colors ${
            isFullScreen 
              ? 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700' 
              : 'bg-white text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 border border-neutral-200'
          }`}
          title={isFullScreen ? "Exit Full Screen" : "Fill Screen Preview"}
        >
          {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        {/* Zoom Controls */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center bg-white border border-neutral-200 shadow-lg rounded-lg overflow-hidden print:hidden text-neutral-600 font-medium select-none">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.1, (prev === 'fit' ? getDynamicScale() : prev) - 0.1))}
            className="p-2 hover:bg-neutral-100 border-r border-neutral-200"
            title="Zoom Out"
          ><ZoomOut size={16} /></button>
          <span className="text-[11px] px-2 w-14 text-center select-none font-bold text-indigo-700 tabular-nums">
            {Math.round(currentScale * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(3.0, (prev === 'fit' ? getDynamicScale() : prev) + 0.1))}
            className="p-2 hover:bg-neutral-100 border-x border-neutral-200"
            title="Zoom In"
          ><ZoomIn size={16} /></button>
          <button
            onClick={() => setZoomLevel(1)}
            className={`p-2 hover:bg-neutral-100 border-r border-neutral-200 text-[10px] font-bold ${!isFullScreen && zoomLevel === 1 ? 'text-indigo-600 bg-indigo-50' : ''}`}
            title="Actual Size (1px = 1mm)"
          ><Scan size={16} /></button>
          <button
            onClick={() => setZoomLevel('fit')}
            className={`p-2 hover:bg-neutral-100 ${zoomLevel === 'fit' ? 'text-indigo-600 bg-indigo-50' : ''}`}
            title="Fit to Screen"
          ><Search size={16} /></button>
        </div>

        {/* Ruler + canvas wrapper — ruler strips sit just outside the poster edges */}
        <div
          className="relative transition-all duration-200"
          style={{
            marginLeft: isFullScreen || !theme.rulerEnabled ? 0 : RULER_SIZE,
            marginTop:  isFullScreen || !theme.rulerEnabled ? 0 : RULER_SIZE,
            minWidth:  layout.width  * currentScale,
            minHeight: layout.height * currentScale,
          }}
        >
          {/* Corner square */}
          {!isFullScreen && theme.rulerEnabled && (
            <div
              className="absolute print:hidden bg-neutral-300 border-b border-r border-neutral-400 z-20"
              style={{ top: -RULER_SIZE, left: -RULER_SIZE, width: RULER_SIZE, height: RULER_SIZE }}
            />
          )}

          {/* Horizontal ruler (top) */}
          {!isFullScreen && theme.rulerEnabled && (
            <div className="absolute print:hidden z-20" style={{ top: -RULER_SIZE, left: 0 }}>
              <PosterRuler orientation="horizontal" length={layout.width} scale={currentScale} />
            </div>
          )}

          {/* Vertical ruler (left) */}
          {!isFullScreen && theme.rulerEnabled && (
            <div className="absolute print:hidden z-20" style={{ top: 0, left: -RULER_SIZE }}>
              <PosterRuler orientation="vertical" length={layout.height} scale={currentScale} />
            </div>
          )}

          {/* Poster canvas — font-pairing class cascades CSS font variables to all children */}
          <div
            id="poster-canvas"
            className={`bg-white shadow-2xl print:shadow-none absolute origin-top-left flex flex-col font-${theme.fontPairing}`}
            style={{
              width: `${layout.width}px`,
              height: `${layout.height}px`,
              transform: `scale(${currentScale})`,
            }}
          >
            <PosterHeader />
            <div className="flex-1 overflow-hidden relative" style={{ minHeight: '800px' }}>
              <PosterCanvas />
            </div>
            {theme.footerEnabled && <PosterFooter />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
