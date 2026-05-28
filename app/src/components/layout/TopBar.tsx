import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Scan,
  Layout,
  Sparkles,
  Undo2,
  Redo2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  FilePlus,
  FolderOpen,
  Printer,
  Grid3x3,
  Ruler,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  MoveHorizontal,
  ArrowUp,
  ArrowDown,
  HelpCircle,
} from 'lucide-react';
import { usePosterStore } from '../../store/usePosterStore';
import { useThemeStore } from '../../store/useThemeStore';
import AIGuideModal from './AIGuideModal';
import AppGuideModal from './AppGuideModal';

type PanelId = 'header' | 'sections' | 'theme' | 'export';

interface TopBarProps {
  zoomLevel: number | 'fit';
  currentScale: number;
  layoutName: string;
  activePanel: PanelId | null;
  onZoomChange: (z: number | 'fit') => void;
  onFullScreenToggle: () => void;
  onExportClick: () => void;
  onPanelToggle: (panel: PanelId) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onNewPoster?: () => void;
  onOpenDraft?: () => void;
  onSaveDraft?: () => void;
  onToggleGrid?: () => void;
  onToggleRuler?: () => void;
  onToggleSafeArea?: () => void;
  onToggleBleed?: () => void;
  onToggleSnap?: () => void;
  onPrintPreview?: () => void;
  onAutoArrange?: () => void;
  gridEnabled?: boolean;
  rulerEnabled?: boolean;
  safeAreaEnabled?: boolean;
  bleedEnabled?: boolean;
  snapEnabled?: boolean;
}

const SaveStatusIcon: React.FC = () => {
  const status = usePosterStore((s) => s.saveStatus);
  if (status === 'saving') return <Loader2 size={12} className="animate-spin" style={{ color: 'var(--editor-warning)' }} />;
  if (status === 'saved') return <CheckCircle2 size={12} style={{ color: 'var(--editor-success)' }} />;
  if (status === 'error') return <AlertCircle size={12} style={{ color: 'var(--editor-danger)' }} />;
  return <Save size={12} style={{ color: 'var(--editor-text-muted)' }} />;
};

interface MenuDropdownProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ label, icon, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 h-7 text-xs font-medium rounded-lg transition-all hover:bg-white/5"
        style={{ color: 'var(--editor-text-secondary)' }}
      >
        {icon}
        {label}
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-2 py-1.5 rounded-xl z-[100] min-w-[190px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08)), var(--editor-surface)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: '1px solid var(--editor-border)',
            boxShadow: '0 18px 45px rgba(15,23,42,0.28)',
          }}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const MenuItem: React.FC<{
  icon?: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  danger?: boolean;
}> = ({ icon, label, shortcut, onClick, danger }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-white/5"
    style={{ color: danger ? 'var(--editor-danger)' : 'var(--editor-text)' }}
  >
    {icon && <span className="opacity-60">{icon}</span>}
    <span className="flex-1 text-left">{label}</span>
    {shortcut && (
      <span className="text-[10px] opacity-30 font-mono">{shortcut}</span>
    )}
  </button>
);

const MenuDivider: React.FC = () => (
  <div className="my-1 mx-3 h-px" style={{ background: 'var(--editor-border)' }} />
);

const TopBar: React.FC<TopBarProps> = ({
  zoomLevel,
  currentScale,
  onZoomChange,
  onFullScreenToggle,
  onExportClick,
  onUndo,
  onRedo,
  onNewPoster,
  onOpenDraft,
  onSaveDraft,
  onToggleGrid,
  onToggleRuler,
  onToggleSafeArea,
  onToggleBleed,
  onToggleSnap,
  onPrintPreview,
  onAutoArrange,
  gridEnabled,
  rulerEnabled,
  safeAreaEnabled,
  bleedEnabled,
  snapEnabled,
}) => {
  const zoomPct = Math.round(currentScale * 100);
  const [showAIGuide, setShowAIGuide] = useState(false);
  const [showAppGuide, setShowAppGuide] = useState(false);
  const saveStatus = usePosterStore((s) => s.saveStatus);
  const { editorTheme, toggleTheme } = useThemeStore();
  const selectedSectionId = usePosterStore((s) => s.selectedSectionId);
  const sections = usePosterStore((s) => s.sections);
  const layout = usePosterStore((s) => s.layout);
  const theme = usePosterStore((s) => s.theme);
  const updateSection = usePosterStore((s) => s.updateSection);
  const setSelectedSections = usePosterStore((s) => s.setSelectedSections);

  const selectedSection = sections.find((section) => section.id === selectedSectionId);

  const handleZoomIn = () => {
    const current = zoomLevel === 'fit' ? currentScale : zoomLevel;
    onZoomChange(Math.min(3.0, parseFloat((current + 0.1).toFixed(1))));
  };

  const handleZoomOut = () => {
    const current = zoomLevel === 'fit' ? currentScale : zoomLevel;
    onZoomChange(Math.max(0.1, parseFloat((current - 0.1).toFixed(1))));
  };

  const handleAlignSelected = (align: 'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom') => {
    if (!selectedSection) return;
    const pos = selectedSection.position;
    const headerOffset = theme.headerEnabled === false ? 0 : 90;
    const next = { ...pos };
    if (align === 'left') next.x = 0;
    if (align === 'center-h') next.x = (layout.width - pos.width) / 2;
    if (align === 'right') next.x = layout.width - pos.width;
    if (align === 'top') next.y = headerOffset;
    if (align === 'center-v') next.y = headerOffset + (layout.height - headerOffset - pos.height) / 2;
    if (align === 'bottom') next.y = layout.height - pos.height;
    updateSection(selectedSection.id, { position: next });
  };

  const handleLayerSelected = (direction: 'front' | 'back') => {
    if (!selectedSection) return;
    const zIndexes = sections.map((section) => section.position?.zIndex ?? 1);
    updateSection(selectedSection.id, {
      position: {
        ...selectedSection.position,
        zIndex: direction === 'front' ? Math.max(...zIndexes) + 1 : Math.min(...zIndexes) - 1,
      },
    });
  };

  const handleDistribute = () => {
    if (!selectedSection) return;
    const rowSections = sections
      .filter((section) => Math.abs(section.position.y - selectedSection.position.y) < 50)
      .sort((a, b) => a.position.x - b.position.x);
    if (rowSections.length < 2) return;
    const totalWidth = rowSections.reduce((sum, section) => sum + section.position.width, 0);
    const gap = (layout.width - totalWidth) / (rowSections.length + 1);
    let x = gap;
    rowSections.forEach((section) => {
      updateSection(section.id, { position: { ...section.position, x } });
      x += section.position.width + gap;
    });
  };

  const textColor = 'var(--editor-text)';
  const textSecondary = 'var(--editor-text-secondary)';
  const textMuted = 'var(--editor-text-muted)';
  const accentColor = 'var(--editor-accent)';

  return (
    <div
      className="h-[52px] flex-shrink-0 flex items-center px-3 gap-1 z-40 print:hidden select-none"
      style={{
        background: 'var(--editor-surface)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderBottom: '1px solid var(--editor-border)',
        boxShadow: 'var(--editor-shadow-sm)',
      }}
    >
      {/* Left: Brand + Menus */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Link
          to="/"
          className="flex items-center gap-1 px-2 h-7 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
          style={{ color: textSecondary }}
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline font-medium">Home</span>
        </Link>

        <div className="w-px h-4 mx-1" style={{ background: 'var(--editor-border)' }} />

        <span
          className="text-sm font-bold leading-tight whitespace-nowrap px-2"
          style={{ color: textColor, fontFamily: "'Poppins', sans-serif" }}
        >
          PosterGen
        </span>

        <div className="w-px h-4 mx-1" style={{ background: 'var(--editor-border)' }} />

        {/* Functional Menus */}
        <MenuDropdown label="File">
          <MenuItem icon={<FilePlus size={13} />} label="New Poster" shortcut="Ctrl+N" onClick={onNewPoster} />
          <MenuItem icon={<FolderOpen size={13} />} label="Open Draft" shortcut="Ctrl+O" onClick={onOpenDraft} />
          <MenuItem icon={<Save size={13} />} label="Save Draft" shortcut="Ctrl+S" onClick={onSaveDraft} />
          <MenuDivider />
          <MenuItem icon={<Printer size={13} />} label="Print Preview" onClick={onPrintPreview} />
          <MenuItem icon={<Download size={13} />} label="Export PDF" onClick={onExportClick} />
        </MenuDropdown>

        <MenuDropdown label="Edit">
          <MenuItem icon={<Undo2 size={13} />} label="Undo" shortcut="Ctrl+Z" onClick={onUndo} />
          <MenuItem icon={<Redo2 size={13} />} label="Redo" shortcut="Ctrl+Shift+Z" onClick={onRedo} />
        </MenuDropdown>

        <MenuDropdown label="View">
          <MenuItem
            icon={<Grid3x3 size={13} />}
            label={gridEnabled ? 'Hide Grid' : 'Show Grid'}
            onClick={onToggleGrid}
          />
          <MenuItem
            icon={<Ruler size={13} />}
            label={rulerEnabled ? 'Hide Ruler' : 'Show Ruler'}
            onClick={onToggleRuler}
          />
          <MenuItem
            icon={<Eye size={13} />}
            label={safeAreaEnabled ? 'Hide Safe Area' : 'Show Safe Area'}
            onClick={onToggleSafeArea}
          />
          <MenuItem
            icon={<Eye size={13} />}
            label={bleedEnabled ? 'Hide Bleed Area' : 'Show Bleed Area'}
            onClick={onToggleBleed}
          />
          <MenuItem
            icon={<Grid3x3 size={13} />}
            label={snapEnabled ? 'Disable Snap' : 'Enable Snap'}
            onClick={onToggleSnap}
          />
          <MenuDivider />
          <MenuItem icon={<Maximize size={13} />} label="Fullscreen" onClick={onFullScreenToggle} />
        </MenuDropdown>

        <MenuDropdown label="Arrange">
          <MenuItem icon={<Layout size={13} />} label="Auto Arrange All" onClick={onAutoArrange} />
          <MenuDivider />
          <MenuItem icon={<AlignLeft size={13} />} label="Align Left" onClick={() => handleAlignSelected('left')} />
          <MenuItem icon={<AlignCenter size={13} />} label="Align Center" onClick={() => handleAlignSelected('center-h')} />
          <MenuItem icon={<AlignRight size={13} />} label="Align Right" onClick={() => handleAlignSelected('right')} />
          <MenuItem icon={<AlignVerticalJustifyStart size={13} />} label="Align Top" onClick={() => handleAlignSelected('top')} />
          <MenuItem icon={<AlignVerticalJustifyCenter size={13} />} label="Align Middle" onClick={() => handleAlignSelected('center-v')} />
          <MenuItem icon={<AlignVerticalJustifyEnd size={13} />} label="Align Bottom" onClick={() => handleAlignSelected('bottom')} />
          <MenuDivider />
          <MenuItem icon={<MoveHorizontal size={13} />} label="Distribute Row" onClick={handleDistribute} />
          <MenuItem icon={<ArrowUp size={13} />} label="Bring to Front" onClick={() => handleLayerSelected('front')} />
          <MenuItem icon={<ArrowDown size={13} />} label="Send to Back" onClick={() => handleLayerSelected('back')} />
        </MenuDropdown>
      </div>

      {/* Center: Zoom controls */}
      <div className="flex-1 flex items-center justify-center gap-1 min-w-0">
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          style={{ color: textSecondary }}
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={() => onZoomChange('fit')}
          className="min-w-[52px] h-7 px-2 text-xs font-mono rounded-lg transition-colors flex-shrink-0"
          style={{
            background: zoomLevel === 'fit' ? 'var(--editor-accent-bg)' : 'transparent',
            color: zoomLevel === 'fit' ? accentColor : textColor,
            border: zoomLevel === 'fit' ? `1px solid ${accentColor}40` : '1px solid transparent',
          }}
          title="Click to fit to screen"
        >
          {zoomLevel === 'fit' ? 'Fit' : `${zoomPct}%`}
        </button>

        <button
          onClick={handleZoomIn}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          style={{ color: textSecondary }}
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>

        <div className="w-px h-4 mx-1" style={{ background: 'var(--editor-border)' }} />

        <button
          onClick={() => onZoomChange('fit')}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          style={{ color: textMuted }}
          title="Fit to screen"
        >
          <Scan size={13} />
        </button>

        <button
          onClick={() => onZoomChange(1.0)}
          className="text-[11px] px-2 h-7 rounded-lg transition-colors hover:bg-white/5 font-medium"
          style={{ color: textMuted }}
          title="100% zoom"
        >
          1:1
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Save status */}
        <div
          className="flex items-center gap-1.5 px-2 h-7 rounded-lg mr-1"
          style={{
            background: 'var(--editor-input-bg)',
            border: '1px solid var(--editor-border)',
            color: textMuted,
          }}
        >
          <SaveStatusIcon />
          <span className="text-[10px] font-medium capitalize hidden sm:inline">
            {saveStatus === 'saving' ? 'Saving' : saveStatus === 'saved' ? 'Saved' : saveStatus === 'error' ? 'Error' : 'Ready'}
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          style={{ color: textSecondary }}
          title={editorTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {editorTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          onClick={() => setShowAppGuide(true)}
          className="flex items-center gap-1.5 px-3 h-8 text-xs font-semibold rounded-lg transition-all whitespace-nowrap border"
          style={{
            background: 'var(--editor-input-bg)',
            borderColor: 'var(--editor-border)',
            color: textSecondary,
          }}
          title="Open application guide"
        >
          <HelpCircle size={13} />
          <span className="hidden md:inline">Guide</span>
        </button>

        <button
          onClick={() => {
            setSelectedSections([]);
            setShowAIGuide(true);
          }}
          className="flex items-center gap-1.5 px-3 h-8 text-xs font-semibold rounded-lg transition-all whitespace-nowrap border"
          style={{
            background: 'var(--editor-accent-bg)',
            borderColor: `${accentColor}30`,
            color: accentColor,
          }}
          title="AI Assistant"
        >
          <Sparkles size={13} />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        <button
          onClick={onExportClick}
          className="flex items-center gap-1.5 px-3 h-8 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          style={{
            background: accentColor,
            color: 'var(--editor-text-inverse)',
          }}
          title="Export poster"
        >
          <Download size={13} />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {showAIGuide && (
        <AIGuideModal
          onClose={() => {
            setShowAIGuide(false);
            setSelectedSections([]);
          }}
        />
      )}
      {showAppGuide && <AppGuideModal onClose={() => setShowAppGuide(false)} />}
    </div>
  );
};

export default TopBar;
