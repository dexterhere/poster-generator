import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ZoomIn, ZoomOut, Maximize, Minimize, Download, Scan, Type, Layout, Palette, FileDown, Sparkles } from 'lucide-react';
import AIGuideModal from './AIGuideModal';

type PanelId = 'header' | 'sections' | 'theme' | 'export';

interface TopBarProps {
  zoomLevel: number | 'fit';
  currentScale: number;
  isFullScreen: boolean;
  layoutName: string;
  activePanel: PanelId | null;
  onZoomChange: (z: number | 'fit') => void;
  onFullScreenToggle: () => void;
  onExportClick: () => void;
  onPanelToggle: (panel: PanelId) => void;
}

const PANEL_BUTTONS: { id: PanelId; icon: React.ReactNode; label: string }[] = [
  { id: 'header',   icon: <Type size={14} />,     label: 'Header' },
  { id: 'sections', icon: <Layout size={14} />,   label: 'Sections' },
  { id: 'theme',    icon: <Palette size={14} />,  label: 'Theme' },
  { id: 'export',   icon: <FileDown size={14} />, label: 'Save & Export' },
];

const TopBar: React.FC<TopBarProps> = ({
  zoomLevel,
  currentScale,
  isFullScreen,
  layoutName,
  activePanel,
  onZoomChange,
  onFullScreenToggle,
  onExportClick,
  onPanelToggle,
}) => {
  const zoomPct = Math.round(currentScale * 100);
  const [showAIGuide, setShowAIGuide] = useState(false);

  const handleZoomIn = () => {
    const current = zoomLevel === 'fit' ? currentScale : zoomLevel;
    onZoomChange(Math.min(3.0, parseFloat((current + 0.1).toFixed(1))));
  };

  const handleZoomOut = () => {
    const current = zoomLevel === 'fit' ? currentScale : zoomLevel;
    onZoomChange(Math.max(0.1, parseFloat((current - 0.1).toFixed(1))));
  };

  return (
    <div className="h-12 flex-shrink-0 bg-white border-b border-neutral-200 flex items-center px-3 gap-2 z-40 print:hidden select-none">

      {/* Brand */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          to="/"
          className="flex items-center gap-1 text-neutral-400 hover:text-neutral-700 text-xs transition-colors"
        >
          <ChevronLeft size={13} />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <span className="text-neutral-200 select-none">|</span>
        <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent leading-tight whitespace-nowrap">
          PosterGen
        </span>
        <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full font-medium hidden md:block whitespace-nowrap">
          {layoutName}
        </span>
      </div>

      {/* Panel triggers — only visible when not in fullscreen */}
      {!isFullScreen && (
        <div className="flex items-center gap-0.5 border-l border-neutral-200 pl-2 ml-1">
          {PANEL_BUTTONS.map((btn) => {
            const isActive = activePanel === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => onPanelToggle(btn.id)}
                title={btn.label}
                className={`flex items-center gap-1.5 px-2.5 h-7 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                {btn.icon}
                <span className="hidden lg:inline">{btn.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Zoom controls — centered */}
      <div className="flex-1 flex items-center justify-center gap-1 min-w-0">
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-100 text-neutral-600 transition-colors flex-shrink-0"
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={() => onZoomChange('fit')}
          className={`min-w-[52px] h-7 px-2 text-xs font-mono rounded transition-colors flex-shrink-0 ${
            zoomLevel === 'fit'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'hover:bg-neutral-100 text-neutral-700'
          }`}
          title="Click to fit to screen"
        >
          {zoomLevel === 'fit' ? 'Fit' : `${zoomPct}%`}
        </button>

        <button
          onClick={handleZoomIn}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-100 text-neutral-600 transition-colors flex-shrink-0"
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>

        <div className="w-px h-4 bg-neutral-200 mx-1 flex-shrink-0" />

        <button
          onClick={() => onZoomChange('fit')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-100 text-neutral-500 transition-colors flex-shrink-0"
          title="Fit to screen"
        >
          <Scan size={13} />
        </button>

        <button
          onClick={() => onZoomChange(1.0)}
          className="text-[11px] px-2 h-7 rounded hover:bg-neutral-100 text-neutral-500 font-medium transition-colors flex-shrink-0"
          title="100% zoom"
        >
          1:1
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={onFullScreenToggle}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 text-neutral-600 transition-colors"
          title={isFullScreen ? 'Exit fullscreen' : 'Fullscreen preview'}
        >
          {isFullScreen ? <Minimize size={15} /> : <Maximize size={15} />}
        </button>

        <button
          onClick={() => setShowAIGuide(true)}
          className="flex items-center gap-1.5 px-3 h-8 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white text-xs font-semibold rounded-lg transition-all whitespace-nowrap shadow-sm"
          title="AI Guide — auto-generate your poster with AI"
        >
          <Sparkles size={13} />
          <span className="hidden sm:inline">The AI God</span>
        </button>

        <button
          onClick={onExportClick}
          className="flex items-center gap-1.5 px-3 h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          title="Export / Print poster"
        >
          <Download size={13} />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>

      {showAIGuide && <AIGuideModal onClose={() => setShowAIGuide(false)} />}
    </div>
  );
};

export default TopBar;
