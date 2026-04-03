import React, { useState, useRef, useEffect, Component, type ReactNode } from 'react';
import { Rnd } from 'react-rnd';
import { usePosterStore, type SectionType, type Section, defaultContentForType } from '../../store/usePosterStore';
import SectionRenderer from '../sections/SectionRenderer';
import { hexOpacity } from '../../utils/colorUtils';
import { Type, Image, Table, GitCommit, LayoutList, AlignLeft, BarChart3, HelpCircle, X, AlignCenterHorizontal, AlignCenterVertical } from 'lucide-react';

// ─── Per-section error boundary ───────────────────────────────────────────────
// Prevents one malformed section from crashing the entire canvas.
class SectionErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg border border-red-200 p-3">
          <p className="text-[10px] text-red-500 text-center font-medium">
            Could not render this section.<br />Check the content format in the editor.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const HEADER_HEIGHT = 90; // estimated poster header px height for centering calculations

const SECTION_CARD_STYLES = {
  'thin': (color: string) => ({
    border: `1px solid ${hexOpacity(color, 48)}`,
  }),
  'top-accent': (color: string) => ({
    border: '1px solid #e5e7eb',
    borderTop: `3px solid ${color}`,
  }),
  'shadow': (_color: string) => ({
    border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  }),
  'filled-header': (color: string) => ({
    border: `1px solid ${hexOpacity(color, 48)}`,
  }),
};

function resolveContainerStyle(section: Section, borderStyle: string, primaryColor: string): React.CSSProperties {
  const cs = section.style?.containerStyle ?? 'default';
  if (cs === 'default') {
    const fn = SECTION_CARD_STYLES[borderStyle as keyof typeof SECTION_CARD_STYLES] ?? SECTION_CARD_STYLES['thin'];
    return fn(primaryColor);
  }
  if (cs === 'none')       return { border: 'none', boxShadow: 'none', background: 'transparent' };
  if (cs === 'card')       return { background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.10)', border: 'none', borderRadius: '12px' };
  if (cs === 'outline')    return { border: '1px solid #d1d5db', borderRadius: '8px', background: 'white' };
  if (cs === 'accent-top') return { border: '1px solid #e5e7eb', borderTop: `3px solid ${primaryColor}`, borderRadius: '8px', background: 'white' };
  if (cs === 'filled')     return { ...SECTION_CARD_STYLES['filled-header'](primaryColor), background: 'white' };
  if (cs === 'minimal')    return { border: 'none', background: hexOpacity(primaryColor, 8), borderRadius: '8px' };
  return SECTION_CARD_STYLES['thin'](primaryColor);
}

const MENU_OPTIONS: { icon: React.ReactNode; label: string; type: SectionType }[] = [
  { icon: <Type size={14} />,        label: 'Text',              type: 'text' },
  { icon: <Image size={14} />,       label: 'Image',             type: 'image' },
  { icon: <AlignLeft size={14} />,   label: 'Split Image',       type: 'split-image' },
  { icon: <Table size={14} />,       label: 'Table',             type: 'table' },
  { icon: <GitCommit size={14} />,   label: 'Process Flow',      type: 'flow' },
  { icon: <LayoutList size={14} />,  label: 'List',              type: 'list' },
  { icon: <BarChart3 size={14} />,   label: 'Stats Hub',         type: 'stats' },
  { icon: <HelpCircle size={14} />,  label: 'Research Question', type: 'question' },
];

interface PosterCanvasProps {
  /** CSS transform scale currently applied to #poster-canvas — needed so mouse
   *  coordinates can be converted from screen-space to poster-space. */
  scale: number;
}

const PosterCanvas: React.FC<PosterCanvasProps> = ({ scale }) => {
  const { sections, theme, layout, selectedSectionId, setSelectedSection, updateSection, addSection, deleteSection } = usePosterStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    // getBoundingClientRect() returns SCREEN-space coords (after CSS scale).
    // Divide by scale to get poster-space coordinates for section placement.
    setContextMenu({
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top)  / scale,
    });
  };

  const handleAddSection = (type: SectionType) => {
    if (!contextMenu) return;
    const newId = `section-${Date.now()}`;
    addSection({
      id: newId,
      position: { x: contextMenu.x, y: contextMenu.y, width: 300, height: 200, zIndex: sections.length + 1 },
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: defaultContentForType(type),
    });
    setContextMenu(null);
    setSelectedSection(newId);
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full relative"
      onContextMenu={handleContextMenu}
      onClick={() => setSelectedSection(null)}
    >
      {sections.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-neutral-400 font-medium text-base border-2 border-dashed border-neutral-300 rounded-xl px-8 py-6 bg-white/60">
            Right-click anywhere to add a section
          </p>
        </div>
      )}

      {sections.map((section) => {
        const isSelected = selectedSectionId === section.id;
        const hideTitle = section.style?.hideTitle ?? false;
        const containerStyle = resolveContainerStyle(section, theme.borderStyle, theme.primaryColor);

        // Header bar style (only shown when !hideTitle)
        const headerBarStyle: React.CSSProperties =
          (section.style?.containerStyle === 'default' || !section.style?.containerStyle) && theme.borderStyle === 'filled-header'
            ? { backgroundColor: theme.primaryColor, color: 'white' }
            : { backgroundColor: hexOpacity(theme.primaryColor, 21), color: theme.primaryColor };

        return (
          <Rnd
            scale={scale}
            dragGrid={[1, 1]}
            resizeGrid={[1, 1]}
            key={section.id}
            size={{ width: section.position?.width || 300, height: section.position?.height || 200 }}
            position={{ x: section.position?.x || 0, y: section.position?.y || 0 }}
            onDragStop={(_e, d) => {
              updateSection(section.id, {
                position: { ...(section.position || { width: 300, height: 200, zIndex: 1 }), x: d.x, y: d.y },
              });
            }}
            onResizeStop={(_e, _dir, ref, _delta, position) => {
              updateSection(section.id, {
                position: {
                  ...(section.position || { zIndex: 1, x: position.x, y: position.y }),
                  width: parseInt(ref.style.width, 10),
                  height: parseInt(ref.style.height, 10),
                  ...position,
                },
              });
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setSelectedSection(section.id);
            }}
            bounds="parent"
            style={{ zIndex: isSelected ? 999 : (section.position?.zIndex || 1) }}
            className="rounded-xl overflow-visible flex flex-col group select-none bg-white"
            dragHandleClassName="drag-handle"
          >
            <div className="absolute inset-0 rounded-xl overflow-hidden shadow-sm" style={containerStyle}>

              {/* Drag handle / title bar */}
              {!hideTitle ? (
                <div
                  className="drag-handle px-3 py-1.5 flex-shrink-0 flex items-center cursor-move"
                  style={headerBarStyle}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wide truncate">
                    {section.title}
                  </span>
                </div>
              ) : (
                // Zero-height invisible handle so react-rnd keeps its drag hook
                <div className="drag-handle h-0 overflow-hidden" />
              )}

              {/* Content area */}
              <div
                className={`overflow-auto w-full ${hideTitle ? 'h-full' : 'h-[calc(100%-24px)]'}`}
                style={{ padding: section.style?.padding !== undefined ? `${section.style.padding}px` : '16px' }}
              >
                <div className="w-full h-full relative z-10">
                  <SectionErrorBoundary>
                    <SectionRenderer
                      section={section}
                      primaryColor={theme.primaryColor}
                      borderStyle={theme.borderStyle}
                    />
                  </SectionErrorBoundary>
                  {!isSelected && <div className="absolute inset-0 z-20" />}
                </div>
              </div>
            </div>

            {/* Selection ring — overlay above content */}
            {isSelected && (
              <div className="absolute inset-0 rounded-xl ring-2 ring-indigo-500 ring-offset-1 pointer-events-none z-20" />
            )}

            {/* Quick Actions Toolbar */}
            {isSelected && (
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-900 text-white p-1 rounded-lg flex items-center shadow-xl z-[1000] border border-neutral-700 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="flex bg-neutral-800 rounded mx-1 p-0.5">
                  <button
                    onClick={() => updateSection(section.id, {
                      position: { ...section.position!, x: (layout.width - (section.position?.width || 300)) / 2 },
                    })}
                    className="p-1.5 hover:bg-neutral-600 rounded text-neutral-300 hover:text-white transition-colors"
                    title="Center Horizontal"
                  >
                    <AlignCenterHorizontal size={14} />
                  </button>
                  <button
                    onClick={() => updateSection(section.id, {
                      position: {
                        ...section.position!,
                        y: HEADER_HEIGHT + (layout.height - HEADER_HEIGHT - (section.position?.height || 200)) / 2,
                      },
                    })}
                    className="p-1.5 hover:bg-neutral-600 rounded text-neutral-300 hover:text-white transition-colors"
                    title="Center Vertical (in canvas body)"
                  >
                    <AlignCenterVertical size={14} />
                  </button>
                </div>
                <div className="w-px h-4 bg-neutral-700 mx-1" />
                <button
                  onClick={() => deleteSection(section.id)}
                  className="p-1.5 hover:bg-red-500 rounded text-neutral-300 hover:text-white transition-colors mx-1"
                  title="Delete section"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </Rnd>
        );
      })}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="absolute bg-white border border-neutral-200 shadow-2xl rounded-xl w-48 py-2 z-[9999]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 pb-2 mb-2 border-b border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Add Section</span>
          </div>
          {MENU_OPTIONS.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAddSection(opt.type)}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 transition-colors"
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PosterCanvas;
