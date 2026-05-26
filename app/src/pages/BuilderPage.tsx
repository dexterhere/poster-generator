import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePosterStore } from '../store/usePosterStore';
import TopBar from '../components/layout/TopBar';
import LeftPanel from '../components/layout/LeftPanel';
import RightInspector from '../components/layout/RightInspector';
import LeftToolbar from '../components/layout/LeftToolbar';
import PosterHeader from '../components/poster/PosterHeader';
import PosterFooter from '../components/poster/PosterFooter';
import PosterCanvas from '../components/poster/PosterCanvas';
import PosterRuler, { RULER_SIZE } from '../components/poster/PosterRuler';

type PanelId = 'header' | 'sections' | 'theme' | 'export';

const BuilderPage: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number | 'fit'>('fit');
  const { selectedSectionId, setSelectedSection, deleteSection, theme, layout } = usePosterStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const editable =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (e.target as HTMLElement).isContentEditable;
      if (e.key === 'Escape') setSelectedSection(null);
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSectionId && !editable) {
        deleteSection(selectedSectionId);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [selectedSectionId, setSelectedSection, deleteSection]);

  // ─── Dynamic scale (fit to viewport) ──────────────────────────────────────
  const getDynamicScale = useCallback(() => {
    const padding = 80;
    const toolbarW = isFullScreen ? 0 : 56;
    const leftW  = (!isFullScreen && activePanel) ? 300 + toolbarW : toolbarW;
    const rightW = (!isFullScreen && selectedSectionId) ? 280 : 0;
    const rulerSpace = (!isFullScreen && theme.rulerEnabled) ? RULER_SIZE * 2 : 0;
    const topBarH = isFullScreen ? 0 : 48;
    const warningBarH = isFullScreen ? 0 : 36;
    const availableWidth  = window.innerWidth  - leftW - rightW - padding - rulerSpace;
    const availableHeight = window.innerHeight - topBarH - warningBarH - padding - rulerSpace;
    return Math.min(availableWidth / layout.width, availableHeight / layout.height);
  }, [isFullScreen, activePanel, selectedSectionId, theme.rulerEnabled, layout.width, layout.height]);

  const currentScale = zoomLevel === 'fit' ? getDynamicScale() : zoomLevel;

  // Re-render on window resize when in fit mode
  useEffect(() => {
    const onResize = () => { if (zoomLevel === 'fit') setZoomLevel('fit'); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [zoomLevel]);

  // Ctrl + wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setZoomLevel((prev) => {
        const base = prev === 'fit' ? getDynamicScale() : prev;
        const next = e.deltaY > 0 ? base - 0.1 : base + 0.1;
        return parseFloat(Math.min(3.0, Math.max(0.1, next)).toFixed(1));
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [getDynamicScale]);

  // ─── Panel toggle ──────────────────────────────────────────────────────────
  const handlePanelToggle = (panel: PanelId) =>
    setActivePanel((prev) => (prev === panel ? null : panel));

  // ─── Export / Print ────────────────────────────────────────────────────────
  const handleExportClick = () => {
    const { width, height } = layout;
    const CSS_PX_PER_MM = 96 / 25.4;
    setSelectedSection(null);
    const styleEl = document.createElement('style');
    styleEl.id = '__poster-print-size__';
    styleEl.textContent = `
      @page { size: ${width}mm ${height}mm; margin: 0; }
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

  // ─── Fullscreen mode ───────────────────────────────────────────────────────
  if (isFullScreen) {
    const fsScale = Math.min(
      window.innerWidth / layout.width,
      window.innerHeight / layout.height
    );
    const scaledW = layout.width * fsScale;
    const scaledH = layout.height * fsScale;
    return (
      <div className="w-screen h-screen bg-neutral-900 flex items-center justify-center overflow-hidden">
        <div style={{ width: scaledW, height: scaledH, position: 'relative', flexShrink: 0 }}>
          <div
            id="poster-canvas"
            className={`font-${theme.fontPairing} flex flex-col bg-white`}
            style={{
              width: layout.width,
              height: layout.height,
              transform: `scale(${fsScale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <PosterHeader />
            <PosterCanvas scale={fsScale} />
            {theme.footerEnabled && <PosterFooter />}
          </div>
        </div>
        <button
          onClick={() => setIsFullScreen(false)}
          className="fixed top-4 right-4 bg-white/90 text-neutral-700 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg hover:bg-white transition-colors z-50"
        >
          Exit Fullscreen
        </button>
      </div>
    );
  }

  // ─── Poster dimensions after scaling ──────────────────────────────────────
  const scaledW = layout.width * currentScale;
  const scaledH = layout.height * currentScale;
  const rulerPad = theme.rulerEnabled ? RULER_SIZE : 0;
  const canvasPad = 40;

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-neutral-100">

      {/* Top bar */}
      <TopBar
        zoomLevel={zoomLevel}
        currentScale={currentScale}
        isFullScreen={isFullScreen}
        layoutName={layout.name}
        activePanel={activePanel}
        onZoomChange={setZoomLevel}
        onFullScreenToggle={() => setIsFullScreen(true)}
        onExportClick={handleExportClick}
        onPanelToggle={handlePanelToggle}
      />
      <div className="h-9 px-4 flex items-center bg-amber-50 border-b border-amber-200 text-amber-800 text-[11px] font-medium print:hidden">
        Refreshing the page clears unsaved work. Save Draft as JSON often. After reloading JSON, section layout/position may need manual rearrangement.
      </div>

      {/* Main body */}
      <div className="flex flex-1 overflow-hidden relative">
        <LeftToolbar activePanel={activePanel} onPanelToggle={handlePanelToggle} />

        {/* Left sliding panel — overlays the canvas */}
        <LeftPanel activePanel={activePanel} onClose={() => setActivePanel(null)} offsetLeft={56} />

        {/* ─── Canvas workspace ─────────────────────────────────────────── */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto canvas-workspace"
          style={{
            paddingLeft:  activePanel       ? 300 : 0,
            paddingRight: selectedSectionId ? 280 : 0,
            transition: 'padding-left 200ms ease-in-out, padding-right 200ms ease-in-out',
          }}
        >
          {/*
            Inner wrapper is sized to the true visual footprint of the scaled poster
            (plus padding + optional ruler space). The poster itself uses position:absolute
            with a CSS transform so the parent can scroll correctly.
          */}
          <div
            style={{
              minWidth: scaledW + rulerPad + canvasPad * 2,
              minHeight: scaledH + rulerPad + canvasPad * 2,
              padding: canvasPad,
              paddingLeft: canvasPad + rulerPad,
              paddingTop: canvasPad + rulerPad,
              position: 'relative',
              display: 'inline-block',
            }}
          >
            {/* Horizontal ruler */}
            {theme.rulerEnabled && (
              <div style={{ position: 'absolute', top: canvasPad, left: canvasPad + rulerPad }}>
                <PosterRuler orientation="horizontal" length={layout.width} scale={currentScale} />
              </div>
            )}
            {/* Vertical ruler */}
            {theme.rulerEnabled && (
              <div style={{ position: 'absolute', top: canvasPad + rulerPad, left: canvasPad }}>
                <PosterRuler orientation="vertical" length={layout.height} scale={currentScale} />
              </div>
            )}

            {/* Scaled poster wrapper — gives the layout system the correct visual size */}
            <div
              style={{
                width: scaledW,
                height: scaledH,
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <div
                id="poster-canvas"
                className={`font-${theme.fontPairing} flex flex-col bg-white`}
                style={{
                  width: layout.width,
                  height: layout.height,
                  transform: `scale(${currentScale})`,
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                <PosterHeader />
                <PosterCanvas scale={currentScale} />
                {theme.footerEnabled && <PosterFooter />}
              </div>
            </div>
          </div>
        </div>

        {/* Right inspector — slides in when a section is selected */}
        <RightInspector isVisible={!!selectedSectionId} />
      </div>
    </div>
  );
};

export default BuilderPage;
