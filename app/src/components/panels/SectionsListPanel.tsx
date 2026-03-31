import React from 'react';
import { usePosterStore, defaultContentForType, type SectionType } from '../../store/usePosterStore';
import { Pencil, Trash2, Plus, GripVertical } from 'lucide-react';

const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  text: 'Text',
  table: 'Table',
  flow: 'Steps / Flow',
  image: 'Image',
  'split-image': 'Split Image',
  list: 'List',
  stats: 'Stats',
};

const SectionsListPanel: React.FC = () => {
  const { sections, selectedSectionId, setSelectedSection, deleteSection, addSection } = usePosterStore();

  const handleAdd = () => {
    const newId = `sec-${Date.now()}`;
    addSection({
      id: newId,
      title: 'New Section',
      type: 'text',
      gridPosition: { col: 0, row: sections.length * 2, colSpan: 1, rowSpan: 1 },
      content: defaultContentForType('text'),
    });
    setSelectedSection(newId);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="space-y-2">
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
                <p className="text-[10px] text-neutral-400 capitalize">
                  {SECTION_TYPE_LABELS[section.type]} · R{section.gridPosition.row + 1} C{section.gridPosition.col + 1}
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
      <button
        onClick={handleAdd}
        className="w-full py-2.5 border-2 border-dashed border-neutral-300 rounded-lg text-sm text-neutral-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus size={14} /> Add Section
      </button>
    </div>
  );
};

export default SectionsListPanel;
