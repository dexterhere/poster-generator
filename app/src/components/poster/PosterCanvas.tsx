import React, {
  useState,
  useRef,
  useEffect,
  Component,
  type ReactNode,
} from "react";
import { Rnd } from "react-rnd";
import {
  usePosterStore,
  type SectionType,
  type Section,
  defaultContentForType,
} from "../../store/usePosterStore";
import SectionRenderer from "../sections/SectionRenderer";
import InlineEditableText from "../sections/InlineEditableText";
import { hexOpacity } from "../../utils/colorUtils";
import {
  Type,
  Image,
  Table,
  GitCommit,
  LayoutList,
  AlignLeft,
  BarChart3,
  HelpCircle,
} from "lucide-react";

// ─── Per-section error boundary ───────────────────────────────────────────────
// Prevents one malformed section from crashing the entire canvas.
class SectionErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg border border-red-200 p-3">
          <p className="text-[10px] text-red-500 text-center font-medium">
            Could not render this section.
            <br />
            Check the content format in the editor.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const SECTION_CARD_STYLES = {
  thin: (color: string) => ({
    border: `1px solid ${hexOpacity(color, 48)}`,
  }),
  "top-accent": (color: string) => ({
    border: "1px solid #e5e7eb",
    borderTop: `3px solid ${color}`,
  }),
  shadow: (color: string) => ({
    border: `1px solid ${hexOpacity(color, 26)}`,
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  }),
  "filled-header": (color: string) => ({
    border: `1px solid ${hexOpacity(color, 48)}`,
  }),
};

function resolveContainerStyle(
  section: Section,
  borderStyle: string,
  primaryColor: string,
): React.CSSProperties {
  const cs = section.style?.containerStyle ?? "default";
  if (cs === "default") {
    const fn =
      SECTION_CARD_STYLES[borderStyle as keyof typeof SECTION_CARD_STYLES] ??
      SECTION_CARD_STYLES["thin"];
    return fn(primaryColor);
  }
  if (cs === "none")
    return { border: "none", boxShadow: "none", background: "transparent" };
  if (cs === "card")
    return {
      background: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
      border: "none",
      borderRadius: "12px",
    };
  if (cs === "outline")
    return {
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      background: "white",
    };
  if (cs === "accent-top")
    return {
      border: "1px solid #e5e7eb",
      borderTop: `3px solid ${primaryColor}`,
      borderRadius: "8px",
      background: "white",
    };
  if (cs === "filled")
    return {
      ...SECTION_CARD_STYLES["filled-header"](primaryColor),
      background: "white",
    };
  if (cs === "minimal")
    return {
      border: "none",
      background: hexOpacity(primaryColor, 8),
      borderRadius: "8px",
    };
  if (cs === "glass")
    return {
      border: `1px solid ${hexOpacity(primaryColor, 42)}`,
      background: hexOpacity("#ffffff", 170),
      backdropFilter: "blur(6px)",
      borderRadius: "12px",
    };
  if (cs === "accent-left")
    return {
      border: "1px solid #e5e7eb",
      borderLeft: `4px solid ${primaryColor}`,
      borderRadius: "8px",
      background: "white",
    };
  if (cs === "elevated")
    return {
      border: "none",
      borderRadius: "12px",
      background: "white",
      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.16), 0 2px 6px rgba(15, 23, 42, 0.08)",
    };
  if (cs === "soft-fill")
    return {
      border: `1px solid ${hexOpacity(primaryColor, 34)}`,
      background: hexOpacity(primaryColor, 12),
      borderRadius: "10px",
    };
  if (cs === "bordered-pill")
    return {
      border: `1px solid ${hexOpacity(primaryColor, 40)}`,
      background: "white",
      borderRadius: "9999px",
    };
  if (cs === "ghost")
    return {
      border: "none",
      background: "transparent",
      boxShadow: "none",
    };
  return SECTION_CARD_STYLES["thin"](primaryColor);
}

const MENU_OPTIONS: {
  icon: React.ReactNode;
  label: string;
  type: SectionType;
  title?: string;
  content?: Section["content"];
  style?: Section["style"];
}[] = [
  { icon: <Type size={14} />, label: "Text", type: "text" },
  {
    icon: <Type size={14} />,
    label: "Quote / Takeaway",
    type: "text",
    title: "Key Takeaway",
    content: { body: "Add a short evidence-backed quote or takeaway here.", highlightBox: "Why this matters in one sentence." },
    style: { fontSize: 12, containerStyle: "minimal", hideTitle: false, textAlign: "center" },
  },
  { icon: <Image size={14} />, label: "Image", type: "image" },
  { icon: <AlignLeft size={14} />, label: "Split Image", type: "split-image" },
  { icon: <Table size={14} />, label: "Table", type: "table" },
  { icon: <GitCommit size={14} />, label: "Process Flow", type: "flow" },
  {
    icon: <GitCommit size={14} />,
    label: "Timeline",
    type: "flow",
    title: "Project Timeline",
    content: {
      direction: "horizontal",
      steps: [
        { name: "Plan", description: "Define goals", highlight: false },
        { name: "Build", description: "Create solution", highlight: true },
        { name: "Test", description: "Validate outcome", highlight: false },
      ],
    },
  },
  { icon: <LayoutList size={14} />, label: "List", type: "list" },
  {
    icon: <LayoutList size={14} />,
    label: "References",
    type: "list",
    title: "References",
    content: { style: "bullet", intro: "", items: [{ text: "Author, Year, Title, Source." }, { text: "Author, Year, Title, Source." }] },
    style: { fontSize: 8, containerStyle: "ghost" },
  },
  { icon: <BarChart3 size={14} />, label: "Stats Hub", type: "stats" },
  {
    icon: <HelpCircle size={14} />,
    label: "Research Question",
    type: "question",
  },
];

interface PosterCanvasProps {
  /** CSS transform scale currently applied to #poster-canvas — needed so mouse
   *  coordinates can be converted from screen-space to poster-space. */
  scale: number;
}

type SelectionBox = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  additive: boolean;
};

const PosterCanvas: React.FC<PosterCanvasProps> = ({ scale }) => {
  const {
    sections,
    theme,
    selectedSectionIds,
    setSelectedSection,
    setSelectedSections,
    toggleSectionSelection,
    updateSection,
    updateSectionContent,
    addSection,
  } = usePosterStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const maxId = sections.reduce((max, section) => {
      const match = section.id.match(/^section-(\d+)$/);
      const parsed = match ? Number(match[1]) : NaN;
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
    }, 0);
    idCounterRef.current = Math.max(idCounterRef.current, maxId);
  }, [sections]);

  const nextSectionId = () => {
    idCounterRef.current += 1;
    return `section-${idCounterRef.current}`;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    // getBoundingClientRect() returns SCREEN-space coords (after CSS scale).
    // Divide by scale to get poster-space coordinates for section placement.
    setContextMenu({
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    });
  };

  const handleAddSection = (option: typeof MENU_OPTIONS[number]) => {
    if (!contextMenu) return;
    const newId = nextSectionId();
    addSection({
      id: newId,
      position: {
        x: contextMenu.x,
        y: contextMenu.y,
        width: 300,
        height: 200,
        zIndex: sections.length + 1,
      },
      type: option.type,
      title: option.title ?? `New ${option.type.charAt(0).toUpperCase() + option.type.slice(1)}`,
      content: option.content ?? defaultContentForType(option.type),
      style: option.style,
    });
    setContextMenu(null);
    setSelectedSection(newId);
  };

  const getPosterPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const getSelectionRect = (box: SelectionBox) => {
    const left = Math.min(box.startX, box.currentX);
    const top = Math.min(box.startY, box.currentY);
    const width = Math.abs(box.currentX - box.startX);
    const height = Math.abs(box.currentY - box.startY);
    return { left, top, width, height };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    const clickedInsideSection = target.closest("[data-section-root='true']");
    const clickedContextMenu = target.closest("[data-context-menu='true']");
    if (clickedInsideSection || clickedContextMenu) return;

    const point = getPosterPoint(e);
    if (!point) return;
    const additive = e.shiftKey || e.metaKey || e.ctrlKey;
    setContextMenu(null);
    setSelectionBox({
      startX: point.x,
      startY: point.y,
      currentX: point.x,
      currentY: point.y,
      additive,
    });

    if (!additive) {
      setSelectedSections([]);
    }
    e.preventDefault();
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectionBox) return;
    const point = getPosterPoint(e);
    if (!point) return;
    setSelectionBox({ ...selectionBox, currentX: point.x, currentY: point.y });
  };

  const handleCanvasMouseUp = () => {
    if (!selectionBox) return;
    const selectionRect = getSelectionRect(selectionBox);
    const isClick = selectionRect.width < 3 && selectionRect.height < 3;
    if (isClick) {
      if (!selectionBox.additive) setSelectedSections([]);
      setSelectionBox(null);
      return;
    }

    const selectedIds = sections
      .filter((section) => {
        const pos = section.position;
        const sectionRight = pos.x + pos.width;
        const sectionBottom = pos.y + pos.height;
        const selectionRight = selectionRect.left + selectionRect.width;
        const selectionBottom = selectionRect.top + selectionRect.height;
        return (
          pos.x < selectionRight &&
          sectionRight > selectionRect.left &&
          pos.y < selectionBottom &&
          sectionBottom > selectionRect.top
        );
      })
      .map((section) => section.id);

    if (selectionBox.additive) {
      setSelectedSections(Array.from(new Set([...selectedSectionIds, ...selectedIds])));
    } else {
      setSelectedSections(selectedIds);
    }
    setSelectionBox(null);
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full relative"
      onContextMenu={handleContextMenu}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
    >
      {/* Background layer to catch clicks outside sections */}
      <div className="absolute inset-0 z-0" />

      {sections.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <p className="text-neutral-400 font-medium text-base border-2 border-dashed border-neutral-300 rounded-xl px-8 py-6 bg-white/60">
            Right-click anywhere to add a section
          </p>
        </div>
      )}

      {sections.map((section) => {
        const isMultiSelected = selectedSectionIds.includes(section.id);
        const hideTitle = section.style?.hideTitle ?? false;
        const borderRadius = section.style?.borderRadius ?? 12;
        const titleFontSize = section.style?.titleFontSize ?? 10;
        const titlePaddingX = section.style?.titlePaddingX ?? 12;
        const titlePaddingY = section.style?.titlePaddingY ?? 6;
        const titleFontFamily = section.style?.titleFontFamily ?? "display";
        const titleFontWeight = section.style?.titleFontWeight ?? "bold";
        const titleFontStyle = section.style?.titleFontStyle ?? "normal";
        const titleLetterSpacing = section.style?.titleLetterSpacing ?? 0.25;
        const titleTransform = section.style?.titleTransform ?? "uppercase";
        const titleAlign = section.style?.titleAlign ?? "left";
        const isLocked = section.locked ?? false;
        const titleAlignClass =
          titleAlign === "center" ? "text-center" : titleAlign === "right" ? "text-right" : "text-left";
        const titleFontFamilyCss =
          titleFontFamily === "body"
            ? "var(--font-body)"
            : titleFontFamily === "serif"
            ? "Georgia, 'Times New Roman', serif"
            : titleFontFamily === "sans"
            ? "Inter, Arial, Helvetica, sans-serif"
            : titleFontFamily === "mono"
            ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
            : titleFontFamily === "condensed"
            ? "'Arial Narrow', 'Roboto Condensed', Arial, sans-serif"
            : "var(--font-display)";
        const titleFontWeightCss =
          titleFontWeight === "black"
            ? 900
            : titleFontWeight === "bold"
            ? 700
            : titleFontWeight === "semibold"
            ? 600
            : 400;
        const baseContainerStyle = resolveContainerStyle(
          section,
          theme.borderStyle,
          theme.primaryColor,
        );
        const containerStyle: React.CSSProperties = {
          ...baseContainerStyle,
          borderRadius: `${borderRadius}px`,
        };

        // Header bar style (only shown when !hideTitle)
        const headerBarStyle: React.CSSProperties =
          (section.style?.containerStyle === "default" ||
            !section.style?.containerStyle) &&
          theme.borderStyle === "filled-header"
            ? { backgroundColor: theme.primaryColor, color: "white" }
            : {
                backgroundColor: hexOpacity(theme.primaryColor, 21),
                color: theme.primaryColor,
              };

        return (
          <Rnd
            scale={scale}
            dragGrid={theme.snapToGrid ? [theme.gridSize ?? 20, theme.gridSize ?? 20] : [1, 1]}
            resizeGrid={theme.snapToGrid ? [theme.gridSize ?? 20, theme.gridSize ?? 20] : [1, 1]}
            key={section.id}
            size={{
              width: section.position?.width || 300,
              height: section.position?.height || 200,
            }}
            position={{
              x: section.position?.x || 0,
              y: section.position?.y || 0,
            }}
            onDragStop={(_e, d) => {
              if (isLocked) return;
              updateSection(section.id, {
                position: {
                  ...(section.position || {
                    width: 300,
                    height: 200,
                    zIndex: 1,
                  }),
                  x: d.x,
                  y: d.y,
                },
              });
            }}
            onResizeStop={(_e, _dir, ref, _delta, position) => {
              if (isLocked) return;
              updateSection(section.id, {
                position: {
                  ...(section.position || {
                    zIndex: 1,
                    x: position.x,
                    y: position.y,
                  }),
                  width: parseInt(ref.style.width, 10),
                  height: parseInt(ref.style.height, 10),
                  ...position,
                },
              });
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (e.shiftKey || e.metaKey || e.ctrlKey) {
                toggleSectionSelection(section.id);
              } else {
                setSelectedSection(section.id);
              }
            }}
            disableDragging={isLocked}
            enableResizing={!isLocked}
            style={{
              zIndex: isMultiSelected ? 999 : (section.position?.zIndex || 1) + 10,
            }}
            className="overflow-visible flex flex-col group select-none bg-white"
            dragHandleClassName="drag-handle"
            data-section-root="true"
          >
            <div
              className="absolute inset-0 overflow-hidden shadow-sm flex flex-col"
              style={containerStyle}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle / title bar */}
              {!hideTitle ? (
                <div
                  className="drag-handle flex-shrink-0 flex items-center cursor-move"
                  style={{
                    ...headerBarStyle,
                    paddingLeft: titlePaddingX,
                    paddingRight: titlePaddingX,
                    paddingTop: titlePaddingY,
                    paddingBottom: titlePaddingY,
                    justifyContent:
                      titleAlign === "center" ? "center" : titleAlign === "right" ? "flex-end" : "flex-start",
                  }}
                >
                  <InlineEditableText
                    as="span"
                    text={section.title}
                    canEdit={isMultiSelected && !isLocked}
                    multiline={false}
                    className={`w-full truncate ${titleAlignClass}`}
                    style={{
                      fontSize: `${titleFontSize}px`,
                      fontFamily: titleFontFamilyCss,
                      fontWeight: titleFontWeightCss,
                      fontStyle: titleFontStyle,
                      letterSpacing: `${titleLetterSpacing}px`,
                      textTransform: titleTransform,
                    }}
                    onCommit={(value) => updateSection(section.id, { title: value })}
                  />
                </div>
              ) : (
                // Zero-height invisible handle so react-rnd keeps its drag hook
                <div className="drag-handle h-0 overflow-hidden" />
              )}

              {/* Content area */}
              <div
                className={`overflow-auto w-full ${hideTitle ? "h-full" : "flex-1"}`}
                style={{
                  padding:
                    section.style?.padding !== undefined
                      ? `${section.style.padding}px`
                      : "16px",
                }}
              >
                <div className="w-full h-full relative z-10">
                  <SectionErrorBoundary>
                    <SectionRenderer
                      section={section}
                      primaryColor={theme.primaryColor}
                      borderStyle={theme.borderStyle}
                      isSelected={isMultiSelected}
                      onUpdateContent={(contentPatch) =>
                        updateSectionContent(section.id, contentPatch)
                      }
                    />
                  </SectionErrorBoundary>
                  {!isMultiSelected && (
                    <div
                      className="absolute inset-0 z-20"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setSelectedSection(section.id);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Selection ring — overlay above content */}
            {isMultiSelected && (
              <div
                className="absolute inset-0 ring-2 ring-indigo-500 ring-offset-1 pointer-events-none z-20 print:hidden editor-only-ui"
                style={{ borderRadius: `${borderRadius}px` }}
                data-editor-ui="true"
              />
            )}

          </Rnd>
        );
      })}

      {selectionBox && (() => {
        const rect = getSelectionRect(selectionBox);
        return (
          <div
            className="absolute z-[998] pointer-events-none rounded-md border border-indigo-500 bg-indigo-500/10 print:hidden editor-only-ui"
            style={{
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              boxShadow: "0 0 0 1px rgba(99,102,241,0.16) inset",
            }}
            data-editor-ui="true"
          />
        );
      })()}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="absolute bg-white border border-neutral-200 shadow-2xl rounded-xl w-48 py-2 z-[9999] editor-only-ui"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
          data-context-menu="true"
          data-editor-ui="true"
        >
          <div className="px-3 pb-2 mb-2 border-b border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Add Section
            </span>
          </div>
          {MENU_OPTIONS.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAddSection(opt)}
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
