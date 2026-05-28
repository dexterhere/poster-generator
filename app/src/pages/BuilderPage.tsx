import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePosterStore } from '../store/usePosterStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { usePosterPersistence } from '../hooks/usePosterPersistence';
import TopBar from '../components/layout/TopBar';
import LeftPanel from '../components/layout/LeftPanel';
import RightInspector from '../components/layout/RightInspector';
import LeftToolbar from '../components/layout/LeftToolbar';
import BottomStatusBar from '../components/layout/BottomStatusBar';
import FloatingSectionToolbar from '../components/canvas/FloatingSectionToolbar';
import PrintPreviewModal from '../components/canvas/PrintPreviewModal';
import PosterHeader from '../components/poster/PosterHeader';
import PosterFooter from '../components/poster/PosterFooter';
import PosterCanvas from '../components/poster/PosterCanvas';
import PosterRuler, { RULER_SIZE } from '../components/poster/PosterRuler';
import { useToast } from '../components/ui/ToastContext';
import { autoLayoutSections, hasUsablePosition } from '../utils/autoLayout';
import { createPosterDraft, normalizeLoadedDraft, type PosterDraft } from '../utils/draft';
import { Download, FileJson, Minus, Plus, X } from 'lucide-react';

type PanelId = 'header' | 'sections' | 'theme' | 'export';
type PosterTab = {
  id: string;
  name: string;
  draft: PosterDraft;
};

const BuilderPage: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number | 'fit'>('fit');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const { selectedSectionId, selectedSectionIds, setSelectedSection, deleteSection, theme, layout, header, sections } = usePosterStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{ active: boolean; x: number; y: number; left: number; top: number }>({
    active: false,
    x: 0,
    y: 0,
    left: 0,
    top: 0,
  });
  const initialTabRef = useRef<PosterTab | null>(null);
  if (!initialTabRef.current) {
    const initialDraft = createPosterDraft(usePosterStore.getState());
    initialTabRef.current = {
      id: `tab-${Date.now()}`,
      name: initialDraft.header.projectTitle || initialDraft.layout.name || 'Poster 1',
      draft: initialDraft,
    };
  }
  const [posterTabs, setPosterTabs] = useState<PosterTab[]>(() => [initialTabRef.current as PosterTab]);
  const [activePosterTabId, setActivePosterTabId] = useState<string | null>(() => initialTabRef.current?.id ?? null);
  const [isPanning, setIsPanning] = useState(false);
  const { manualSave } = usePosterPersistence();
  const { addToast } = useToast();

  // ─── Undo / Redo handlers ──────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    const previous = useHistoryStore.getState().undo();
    if (previous) {
      usePosterStore.setState(previous);
    }
  }, []);

  const handleRedo = useCallback(() => {
    const next = useHistoryStore.getState().redo();
    if (next) {
      usePosterStore.setState(next);
    }
  }, []);

  const applyDraftToPoster = useCallback((draft: PosterDraft) => {
    usePosterStore.setState({
      id: draft.id,
      header: draft.header,
      footer: draft.footer,
      theme: draft.theme,
      layout: draft.layout,
      sections: draft.sections,
      selectedSectionId: null,
      selectedSectionIds: [],
      saveStatus: 'unsaved',
      hydrated: true,
    });
  }, []);

  const getCurrentTabDraft = useCallback(() => createPosterDraft(usePosterStore.getState()), []);

  const updateActiveTabSnapshot = useCallback((tabs: PosterTab[]) => {
    if (!activePosterTabId) return tabs;
    const currentDraft = getCurrentTabDraft();
    return tabs.map((tab) =>
      tab.id === activePosterTabId
        ? { ...tab, name: currentDraft.header.projectTitle || currentDraft.layout.name || tab.name, draft: currentDraft }
        : tab
    );
  }, [activePosterTabId, getCurrentTabDraft]);

  const handleSwitchPosterTab = useCallback((tabId: string) => {
    if (tabId === activePosterTabId) return;
    const targetTab = posterTabs.find((tab) => tab.id === tabId);
    if (!targetTab) return;
    setPosterTabs((tabs) => updateActiveTabSnapshot(tabs));
    applyDraftToPoster(targetTab.draft);
    setActivePosterTabId(tabId);
    useHistoryStore.getState().clear();
  }, [activePosterTabId, applyDraftToPoster, posterTabs, updateActiveTabSnapshot]);

  const handleAddPosterTab = useCallback(() => {
    const store = usePosterStore.getState();
    const previousTabId = activePosterTabId;
    const previousDraft = getCurrentTabDraft();
    store.createBlankPoster();
    const newDraft = createPosterDraft(usePosterStore.getState());
    const newTab: PosterTab = {
      id: `tab-${Date.now()}`,
      name: `Poster ${posterTabs.length + 1}`,
      draft: newDraft,
    };
    setPosterTabs((tabs) => [
      ...tabs.map((tab) => tab.id === previousTabId ? { ...tab, draft: previousDraft } : tab),
      newTab,
    ]);
    setActivePosterTabId(newTab.id);
    useHistoryStore.getState().clear();
  }, [activePosterTabId, getCurrentTabDraft, posterTabs.length]);

  const handleClosePosterTab = useCallback((tabId: string) => {
    if (posterTabs.length <= 1) return;
    const nextTabs = updateActiveTabSnapshot(posterTabs).filter((tab) => tab.id !== tabId);
    const nextActive = tabId === activePosterTabId
      ? nextTabs[Math.max(0, posterTabs.findIndex((tab) => tab.id === tabId) - 1)]
      : nextTabs.find((tab) => tab.id === activePosterTabId);
    setPosterTabs(nextTabs);
    if (nextActive) {
      setActivePosterTabId(nextActive.id);
      applyDraftToPoster(nextActive.draft);
      useHistoryStore.getState().clear();
    }
  }, [activePosterTabId, applyDraftToPoster, posterTabs, updateActiveTabSnapshot]);

  const handleDownloadActiveTabJson = useCallback(() => {
    const currentDraft = getCurrentTabDraft();
    const blob = new Blob([JSON.stringify(currentDraft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(currentDraft.header.projectTitle || currentDraft.layout.name || 'poster').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setPosterTabs((tabs) => updateActiveTabSnapshot(tabs));
    addToast('Active poster JSON downloaded', 'success');
  }, [addToast, getCurrentTabDraft, updateActiveTabSnapshot]);

  // ─── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const editable =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (e.target as HTMLElement).isContentEditable;

      if (e.key === 'Escape') {
        setSelectedSection(null);
        setActivePanel(null);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSectionId && !editable) {
        deleteSection(selectedSectionId);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSectionIds.length > 1 && !editable) {
        selectedSectionIds.forEach((id) => deleteSection(id));
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedSectionIds.length > 0 && !editable) {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -delta : e.key === 'ArrowRight' ? delta : 0;
        const dy = e.key === 'ArrowUp' ? -delta : e.key === 'ArrowDown' ? delta : 0;
        const store = usePosterStore.getState();
        selectedSectionIds.forEach((id) => {
          const section = store.sections.find((item) => item.id === id);
          if (!section || section.locked) return;
          store.updateSection(id, {
            position: {
              ...section.position,
              x: section.position.x + dx,
              y: section.position.y + dy,
            },
          });
        });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && !editable) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z')) && !editable) {
        e.preventDefault();
        handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && !editable) {
        e.preventDefault();
        manualSave().then((ok) => {
          if (ok) addToast('Draft saved', 'success');
          else addToast('Save failed', 'error');
        });
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [selectedSectionId, selectedSectionIds, setSelectedSection, deleteSection, manualSave, addToast, handleUndo, handleRedo]);

  // ─── Dynamic scale (fit to viewport) ──────────────────────────────────────
  const getDynamicScale = useCallback(() => {
    const padding = 150;
    const toolbarW = isFullScreen ? 0 : 56;
    const leftW  = (!isFullScreen && activePanel) ? 300 + toolbarW : toolbarW;
    const rightW = (!isFullScreen && selectedSectionId) ? 320 : 0;
    const rulerSpace = (!isFullScreen && theme.rulerEnabled) ? RULER_SIZE * 2 : 0;
    const topBarH = isFullScreen ? 0 : 88;
    const bottomBarH = isFullScreen ? 0 : 28;
    const availableWidth  = window.innerWidth  - leftW - rightW - padding - rulerSpace;
    const availableHeight = window.innerHeight - topBarH - bottomBarH - padding - rulerSpace;
    return Math.min(availableWidth / layout.width, availableHeight / layout.height);
  }, [isFullScreen, activePanel, selectedSectionId, theme.rulerEnabled, layout.width, layout.height]);

  const currentScale = zoomLevel === 'fit' ? getDynamicScale() : zoomLevel;

  const hasPosterWork = useCallback(() => {
    const headerHasContent = [
      header.projectTitle,
      header.studentName,
      header.studentId,
      header.supervisorName,
      header.readerName,
      header.department,
      header.institution,
    ].some((value) => value.trim().length > 0);
    return headerHasContent || sections.length > 0;
  }, [header, sections.length]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasPosterWork()) return;
      event.preventDefault();
      event.returnValue =
        'Before leaving PosterGen, download your poster as JSON or export it as PDF. Image uploads are not stored in the JSON backup.';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasPosterWork]);

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
      if (e.shiftKey && !(e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        return;
      }
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

  const handleAutoArrange = useCallback(() => {
    const store = usePosterStore.getState();
    store.setSections(autoLayoutSections(store.sections, store.layout, store.theme));
  }, []);

  const renderHeaderQuickControls = () => (
    <div
      className="absolute top-2 right-2 z-[60] flex items-center gap-1 rounded-lg border bg-white/90 px-1.5 py-1 shadow-sm editor-only-ui print:hidden"
      style={{ borderColor: 'rgba(15,23,42,0.12)' }}
      data-editor-ui="true"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-6 h-6 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
        title="Reduce header height"
        onClick={() => usePosterStore.getState().updateHeader({ headerPadding: Math.max(2, (header.headerPadding ?? 12) - 2) })}
      >
        <Minus size={12} />
      </button>
      <span className="text-[10px] font-semibold text-neutral-500 px-1">Header</span>
      <button
        className="w-6 h-6 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
        title="Increase header height"
        onClick={() => usePosterStore.getState().updateHeader({ headerPadding: Math.min(56, (header.headerPadding ?? 12) + 2) })}
      >
        <Plus size={12} />
      </button>
      <button
        className="w-6 h-6 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-600 text-[11px] font-bold"
        title="Reduce title size"
        onClick={() => usePosterStore.getState().updateHeader({ titleFontSize: Math.max(16, (header.titleFontSize ?? 32) - 2) })}
      >
        T-
      </button>
      <button
        className="w-6 h-6 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-600 text-[11px] font-bold"
        title="Increase title size"
        onClick={() => usePosterStore.getState().updateHeader({ titleFontSize: Math.min(86, (header.titleFontSize ?? 32) + 2) })}
      >
        T+
      </button>
    </div>
  );

  // ─── Fullscreen mode ───────────────────────────────────────────────────────
  if (isFullScreen) {
    const fsScale = Math.min(
      window.innerWidth / layout.width,
      window.innerHeight / layout.height
    );
    const scaledW = layout.width * fsScale;
    const scaledH = layout.height * fsScale;
    return (
      <div className="w-screen h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--editor-bg)' }}>
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
            {theme.headerEnabled !== false && renderHeaderQuickControls()}
            <PosterCanvas scale={fsScale} />
            {theme.footerEnabled && <PosterFooter />}
          </div>
        </div>
        <button
          onClick={() => setIsFullScreen(false)}
          className="fixed top-4 right-4 glass-floating px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors z-50"
          style={{ color: 'var(--editor-text)' }}
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
  const canvasTopPad = 96;
  const gridSize = theme.gridSize ?? 20;

  const handleWorkspaceMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 1 && !e.altKey) return;
    const el = containerRef.current;
    if (!el) return;
    panRef.current = {
      active: true,
      x: e.clientX,
      y: e.clientY,
      left: el.scrollLeft,
      top: el.scrollTop,
    };
    setIsPanning(true);
    e.preventDefault();
  };

  const handleWorkspaceMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el || !panRef.current.active) return;
    el.scrollLeft = panRef.current.left - (e.clientX - panRef.current.x);
    el.scrollTop = panRef.current.top - (e.clientY - panRef.current.y);
  };

  const handleWorkspaceMouseUp = () => {
    if (!panRef.current.active) return;
    panRef.current.active = false;
    setIsPanning(false);
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden" style={{ background: 'var(--editor-bg)' }}>
      {/* Top bar */}
      <TopBar
        zoomLevel={zoomLevel}
        currentScale={currentScale}
        layoutName={layout.name}
        activePanel={activePanel}
        onZoomChange={setZoomLevel}
        onFullScreenToggle={() => setIsFullScreen(true)}
        onExportClick={handleExportClick}
        onPanelToggle={handlePanelToggle}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onNewPoster={() => {
          usePosterStore.getState().createBlankPoster();
          useHistoryStore.getState().clear();
          addToast('New blank poster created', 'info');
        }}
        onOpenDraft={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              try {
                const data = normalizeLoadedDraft(JSON.parse(ev.target?.result as string));
                const store = usePosterStore.getState();
                if (data.header) store.updateHeader(data.header);
                if (data.footer) store.updateFooter(data.footer);
                if (data.theme) store.updateTheme(data.theme);
                if (data.layout) store.updateLayout(data.layout);
                if (data.sections) {
                  const nextLayout = data.layout ? { ...store.layout, ...data.layout } : store.layout;
                  const nextTheme = data.theme ? { ...store.theme, ...data.theme } : store.theme;
                  const needsLayout = data.sections.some((section) => !hasUsablePosition(section));
                  store.setSections(
                    needsLayout
                      ? autoLayoutSections(data.sections, nextLayout, nextTheme, { preserveExistingPositions: true })
                      : data.sections,
                  );
                }
                addToast('Draft loaded', 'success');
              } catch {
                addToast('Invalid draft file', 'error');
              }
            };
            reader.readAsText(file);
          };
          input.click();
        }}
        onSaveDraft={() => {
          manualSave().then((ok) => {
            if (ok) addToast('Draft saved', 'success');
            else addToast('Save failed', 'error');
          });
        }}
        onToggleGrid={() => usePosterStore.getState().updateTheme({ gridOverlayEnabled: !theme.gridOverlayEnabled })}
        onToggleRuler={() => usePosterStore.getState().updateTheme({ rulerEnabled: !theme.rulerEnabled })}
        onToggleSafeArea={() => usePosterStore.getState().updateTheme({ safeAreaEnabled: !theme.safeAreaEnabled })}
        onToggleBleed={() => usePosterStore.getState().updateTheme({ bleedAreaEnabled: !theme.bleedAreaEnabled })}
        onToggleSnap={() => usePosterStore.getState().updateTheme({ snapToGrid: !theme.snapToGrid })}
        onPrintPreview={() => setShowPrintPreview(true)}
        onAutoArrange={handleAutoArrange}
        gridEnabled={!!theme.gridOverlayEnabled}
        rulerEnabled={!!theme.rulerEnabled}
        safeAreaEnabled={!!theme.safeAreaEnabled}
        bleedEnabled={!!theme.bleedAreaEnabled}
        snapEnabled={!!theme.snapToGrid}
      />

      <div
        className="h-9 flex items-center gap-1 px-3 border-b print:hidden"
        style={{
          background: 'var(--editor-surface)',
          borderColor: 'var(--editor-border)',
          color: 'var(--editor-text-secondary)',
        }}
      >
        <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
          {posterTabs.map((tab) => {
            const active = tab.id === activePosterTabId;
            return (
              <button
                key={tab.id}
                onClick={() => handleSwitchPosterTab(tab.id)}
                className="group h-7 min-w-[150px] max-w-[220px] flex items-center gap-2 rounded-lg border px-2 text-xs font-semibold transition-all"
                style={{
                  background: active ? 'var(--editor-input-bg-focus)' : 'transparent',
                  borderColor: active ? 'var(--editor-accent)' : 'var(--editor-border)',
                  color: active ? 'var(--editor-text)' : 'var(--editor-text-secondary)',
                }}
                title={tab.name}
              >
                <FileJson size={13} className="shrink-0" />
                <span className="truncate flex-1 text-left">{active ? (header.projectTitle || layout.name || tab.name) : tab.name}</span>
                {posterTabs.length > 1 && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="w-5 h-5 rounded-md flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClosePosterTab(tab.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClosePosterTab(tab.id);
                      }
                    }}
                    aria-label={`Close ${tab.name}`}
                  >
                    <X size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={handleAddPosterTab}
          className="h-7 w-8 rounded-lg border flex items-center justify-center transition-colors hover:bg-white/5"
          style={{ borderColor: 'var(--editor-border)', color: 'var(--editor-text-secondary)' }}
          title="New poster tab"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={handleDownloadActiveTabJson}
          className="h-7 px-2 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-colors hover:bg-white/5"
          style={{ borderColor: 'var(--editor-border)', color: 'var(--editor-text-secondary)' }}
          title="Download active poster as JSON"
        >
          <Download size={13} />
          JSON
        </button>
      </div>

      {/* Main body */}
      <div className="flex flex-1 overflow-hidden relative">
        <LeftToolbar activePanel={activePanel} onPanelToggle={handlePanelToggle} />

        {/* Left sliding panel */}
        <LeftPanel activePanel={activePanel} onClose={() => setActivePanel(null)} offsetLeft={56} />

        {/* Canvas workspace */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto canvas-workspace"
          onMouseDown={handleWorkspaceMouseDown}
          onMouseMove={handleWorkspaceMouseMove}
          onMouseUp={handleWorkspaceMouseUp}
          onMouseLeave={handleWorkspaceMouseUp}
          style={{
            paddingLeft: activePanel ? 300 : 0,
            paddingRight: selectedSectionId ? 20 : 0,
            transition: 'padding-left 200ms ease-in-out, padding-right 200ms ease-in-out',
            cursor: isPanning ? 'grabbing' : undefined,
          }}
        >
          <div
            style={{
              minWidth: scaledW + rulerPad + canvasPad * 2,
              minHeight: scaledH + rulerPad + canvasTopPad + canvasPad,
              padding: canvasPad,
              paddingLeft: canvasPad + rulerPad,
              paddingTop: canvasTopPad + rulerPad,
              position: 'relative',
              display: 'inline-block',
            }}
          >
            {/* Horizontal ruler */}
            {theme.rulerEnabled && (
              <div style={{ position: 'absolute', top: canvasTopPad, left: canvasPad + rulerPad }}>
                <PosterRuler orientation="horizontal" length={layout.width} scale={currentScale} />
              </div>
            )}
            {/* Vertical ruler */}
            {theme.rulerEnabled && (
              <div style={{ position: 'absolute', top: canvasTopPad + rulerPad, left: canvasPad }}>
                <PosterRuler orientation="vertical" length={layout.height} scale={currentScale} />
              </div>
            )}

            {/* Scaled poster wrapper */}
            <div
              style={{
                width: scaledW,
                height: scaledH,
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {/* Canvas guides overlay */}
              {theme.safeAreaEnabled && (
                <div
                  className="absolute pointer-events-none z-[5] border-2 border-dashed"
                  style={{
                    top: 10 * currentScale,
                    left: 10 * currentScale,
                    width: (layout.width - 20) * currentScale,
                    height: (layout.height - 20) * currentScale,
                    borderColor: 'var(--editor-success)',
                    opacity: 0.4,
                  }}
                  data-editor-ui="true"
                />
              )}
              {theme.bleedAreaEnabled && (
                <div
                  className="absolute pointer-events-none z-[5] border border-dashed"
                  style={{
                    top: -5 * currentScale,
                    left: -5 * currentScale,
                    width: (layout.width + 10) * currentScale,
                    height: (layout.height + 10) * currentScale,
                    borderColor: 'var(--editor-danger)',
                    opacity: 0.3,
                  }}
                  data-editor-ui="true"
                />
              )}
              {theme.gridOverlayEnabled && (
                <div
                  className="absolute pointer-events-none z-[5]"
                  style={{
                    width: scaledW,
                    height: scaledH,
                    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${Math.max(2, gridSize * currentScale)}' height='${Math.max(2, gridSize * currentScale)}' viewBox='0 0 ${Math.max(2, gridSize * currentScale)} ${Math.max(2, gridSize * currentScale)}'><path d='M ${Math.max(2, gridSize * currentScale)} 0 L 0 0 0 ${Math.max(2, gridSize * currentScale)}' fill='none' stroke='rgba(100,116,139,0.22)' stroke-width='1'/></svg>`)}")`,
                    backgroundSize: `${gridSize * currentScale}px ${gridSize * currentScale}px`,
                  }}
                  data-editor-ui="true"
                />
              )}

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
                {theme.headerEnabled !== false && renderHeaderQuickControls()}
                <PosterCanvas scale={currentScale} />
                {theme.footerEnabled && <PosterFooter />}
              </div>
            </div>
          </div>
        </div>

        {/* Right inspector */}
        <RightInspector isVisible={!!selectedSectionId} />
      </div>

      {/* Floating section toolbar (Canva-like) */}
      <FloatingSectionToolbar />

      {/* Print Preview Modal */}
      {showPrintPreview && (
        <PrintPreviewModal onClose={() => setShowPrintPreview(false)} />
      )}

      {/* Bottom status bar */}
      <BottomStatusBar />
    </div>
  );
};

export default BuilderPage;
