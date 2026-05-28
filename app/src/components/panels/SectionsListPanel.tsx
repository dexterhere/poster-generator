import React from 'react';
import { usePosterStore, defaultContentForType, type SectionType } from '../../store/usePosterStore';
import { Pencil, Trash2, Plus, GripVertical, LayoutGrid } from 'lucide-react';
import { autoLayoutSections } from '../../utils/autoLayout';

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

  const handleAutoArrange = () => {
    if (sections.length === 0) return;

    autoLayoutSections(sections, layout, theme).forEach((section) => {
      updateSection(section.id, { position: section.position });
    });
  };

  return (
    <div className="p-4 space-y-3">
      {/* Toolbar */}
      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          className="flex-1 py-2 border-2 border-dashed border-white/20 rounded-lg text-sm text-white/50 font-medium hover:border-indigo-400/40 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus size={14} /> Add Section
        </button>
        {sections.length > 1 && (
          <button
            onClick={handleAutoArrange}
            title="Auto-arrange all sections into a balanced grid"
            className="px-3 py-2 border border-white/10 rounded-lg text-white/50 hover:border-indigo-400/30 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <LayoutGrid size={14} />
            <span className="text-xs">Arrange</span>
          </button>
        )}
      </div>

      {/* Section list */}
      <div className="space-y-2">
        {sections.length === 0 && (
          <p className="text-center text-[11px] text-white/30 py-6 border-2 border-dashed border-white/10 rounded-lg">
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
                  ? 'border-indigo-400/40 bg-indigo-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <GripVertical size={12} className="text-white/20 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isSelected ? 'text-indigo-300' : 'text-white/80'}`}>
                  {section.title}
                </p>
                <p className="text-[10px] text-white/40">
                  {SECTION_TYPE_LABELS[section.type]}
                  <span className="ml-1.5 text-white/20">
                    {section.position?.width ?? 0}x{section.position?.height ?? 0}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedSection(section.id); }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-indigo-500/20 text-indigo-300"
                  title="Edit"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-red-400"
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
