import React from 'react';
import { usePosterStore, defaultContentForType, type SectionType } from '../../store/usePosterStore';
import { Pencil, Trash2, Plus, GripVertical, LayoutGrid } from 'lucide-react';

const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  text:          'Text',
  table:         'Table',
  flow:          'Steps / Flow',
  image:         'Image',
  'split-image': 'Split Image',
  list:          'List',
  stats:         'Stats',
  question:      'Research Question',
};

const SectionsListPanel: React.FC = () => {
  const {
    sections, layout, theme,
    selectedSectionId, setSelectedSection,
    deleteSection, addSection, updateSection,
  } = usePosterStore();

  const handleAdd = () => {
    const newId = `sec-${Date.now()}`;
    addSection({
      id: newId,
      title: 'New Section',
      type: 'text',
      position: { x: 12, y: 100, width: 260, height: 180, zIndex: sections.length + 1 },
      content: defaultContentForType('text'),
    });
    setSelectedSection(newId);
  };

  /**
   * Auto-arrange: shortest-column-first packing.
   * Preserves each section's aspect ratio while fitting it to the column width.
   */
  const handleAutoArrange = () => {
    if (sections.length === 0) return;

    const HEADER_H  = 90;
    const FOOTER_H  = theme.footerEnabled ? 36 : 0;
    const MARGIN    = 12;
    const availW    = layout.width  - MARGIN * 2;
    const availH    = layout.height - HEADER_H - FOOTER_H - MARGIN * 2;
    const cols      = layout.width > layout.height ? 3 : 2;
    const colW      = Math.floor((availW - MARGIN * (cols - 1)) / cols);
    const colHeights = new Array<number>(cols).fill(0);

    sections.forEach((s) => {
      // Pick shortest column
      const col    = colHeights.indexOf(Math.min(...colHeights));
      const x      = MARGIN + col * (colW + MARGIN);
      const y      = HEADER_H + MARGIN + colHeights[col];

      // Preserve aspect ratio, clamp height
      const origW  = s.position?.width  ?? 300;
      const origH  = s.position?.height ?? 200;
      const ratio  = origH / origW;
      const h      = Math.max(100, Math.min(Math.round(colW * ratio), availH - colHeights[col] - MARGIN));

      updateSection(s.id, {
        position: { ...(s.position ?? { zIndex: 1 }), x, y, width: colW, height: h },
      });
      colHeights[col] += h + MARGIN;
    });
  };

  return (
    <div className="p-4 space-y-3">
      {/* Toolbar */}
      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          className="flex-1 py-2 border-2 border-dashed border-neutral-300 rounded-lg text-sm text-neutral-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus size={14} /> Add Section
        </button>
        {sections.length > 1 && (
          <button
            onClick={handleAutoArrange}
            title="Auto-arrange all sections into a balanced grid"
            className="px-3 py-2 border-2 border-neutral-200 rounded-lg text-neutral-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <LayoutGrid size={14} />
            <span className="text-xs">Arrange</span>
          </button>
        )}
      </div>

      {/* Section list */}
      <div className="space-y-2">
        {sections.length === 0 && (
          <p className="text-center text-[11px] text-neutral-400 py-6 border-2 border-dashed border-neutral-200 rounded-lg">
            Right-click the canvas to add your first section.
          </p>
        )}
        {sections.map((section) => {
          const isSelected = selectedSectionId === section.id;
          return (
            <div
              key={section.id}
              onClick={() => setSelectedSection(isSelected ? null : section.id)}
              className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all group ${
                isSelected
                  ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-indigo-200 hover:bg-neutral-50'
              }`}
            >
              <GripVertical size={12} className="text-neutral-300 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isSelected ? 'text-indigo-700' : 'text-neutral-800'}`}>
                  {section.title}
                </p>
                <p className="text-[10px] text-neutral-400">
                  {SECTION_TYPE_LABELS[section.type]}
                  <span className="ml-1.5 text-neutral-300">
                    {section.position?.width ?? 0}×{section.position?.height ?? 0}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedSection(section.id); }}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-indigo-100 text-indigo-500"
                  title="Edit"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 text-red-500"
                  title="Delete"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionsListPanel;
