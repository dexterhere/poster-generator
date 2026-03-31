import React from 'react';
import { usePosterStore, defaultContentForType, type SectionType } from '../../store/usePosterStore';
import { X } from 'lucide-react';
import TextEditor from './TextEditor';
import TableEditor from './TableEditor';
import FlowEditor from './FlowEditor';
import ImageEditor from './ImageEditor';
import ListEditor from './ListEditor';
import StatsEditor from './StatsEditor';

const SECTION_TYPES: { value: SectionType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'table', label: 'Table' },
  { value: 'flow', label: 'Steps / Flow' },
  { value: 'image', label: 'Image / Diagram' },
  { value: 'split-image', label: 'Split Image (2 Gantt)' },
  { value: 'list', label: 'List' },
  { value: 'stats', label: 'Stats / Metrics' },
];

const SectionEditor: React.FC = () => {
  const { selectedSectionId, sections, updateSection, updateSectionContent, deleteSection, setSelectedSection } = usePosterStore();
  const section = sections.find((s) => s.id === selectedSectionId);

  if (!section) return null;

  const handleTypeChange = (newType: SectionType) => {
    updateSection(section.id, {
      type: newType,
      content: defaultContentForType(newType),
    });
  };

  const inputClass = "w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 shrink-0">
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Editing Section</p>
          <p className="font-semibold text-neutral-800 text-sm truncate max-w-[200px]">{section.title}</p>
        </div>
        <button
          onClick={() => setSelectedSection(null)}
          className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Section Title</label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => updateSection(section.id, { title: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Section Type</label>
          <select
            value={section.type}
            onChange={(e) => handleTypeChange(e.target.value as SectionType)}
            className={inputClass}
          >
            {SECTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Content editor */}
        <div className="border-t border-neutral-100 pt-4">
          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Content</label>
          {section.type === 'text' && (
            <TextEditor section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />
          )}
          {section.type === 'table' && (
            <TableEditor section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />
          )}
          {section.type === 'flow' && (
            <FlowEditor section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />
          )}
          {(section.type === 'image' || section.type === 'split-image') && (
            <ImageEditor section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />
          )}
          {section.type === 'list' && (
            <ListEditor section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />
          )}
          {section.type === 'stats' && (
            <StatsEditor section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />
          )}
        </div>
      </div>

      {/* Footer: delete */}
      <div className="shrink-0 p-4 border-t border-neutral-100">
        <button
          onClick={() => deleteSection(section.id)}
          className="w-full py-2 text-sm font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
        >
          Delete Section
        </button>
      </div>
    </div>
  );
};

export default SectionEditor;
