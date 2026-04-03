import React from 'react';
import { type Section, type ListContent, type ListItem } from '../../store/usePosterStore';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: Section;
  onUpdate: (content: Partial<ListContent>) => void;
}

const ListEditor: React.FC<Props> = ({ section, onUpdate }) => {
  const content = section.content as ListContent;

  const updateItem = (i: number, partial: Partial<ListItem>) => {
    const items = content.items.map((item, idx) => (idx === i ? { ...item, ...partial } : item));
    onUpdate({ items });
  };

  const addItem = () => {
    onUpdate({ items: [...content.items, { text: 'New item' }] });
  };

  const removeItem = (i: number) => {
    if (content.items.length <= 1) return;
    onUpdate({ items: content.items.filter((_, idx) => idx !== i) });
  };

  const inputClass = "flex-1 border border-neutral-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

  return (
    <div className="space-y-3">
      {/* Intro paragraph */}
      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
          Intro Paragraph <span className="font-normal text-neutral-400">(optional — appears above list)</span>
        </label>
        <textarea
          rows={3}
          value={content.intro ?? ''}
          onChange={(e) => onUpdate({ intro: e.target.value || undefined })}
          className="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none"
          placeholder="e.g. The aim of this project is to..."
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1.5">List Style</label>
        <div className="flex gap-3">
          {(['bullet', 'numbered'] as const).map((s) => (
            <label key={s} className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input
                type="radio"
                name="listStyle"
                value={s}
                checked={content.style === s}
                onChange={() => onUpdate({ style: s })}
                className="accent-indigo-600"
              />
              {s === 'bullet' ? 'Bullet' : 'Numbered'}
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold text-neutral-500">Items</label>
          <button onClick={addItem} className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <Plus size={10} /> Add Item
          </button>
        </div>
        <div className="space-y-2">
          {content.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <input
                type="text"
                value={item.tag || ''}
                onChange={(e) => updateItem(i, { tag: e.target.value || undefined })}
                className="w-12 border border-neutral-200 rounded px-1.5 py-1 text-[10px] outline-none focus:ring-1 focus:ring-indigo-500/30 uppercase text-center"
                placeholder="TAG"
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateItem(i, { text: e.target.value })}
                className={inputClass}
                placeholder="List item text..."
              />
              <button
                onClick={() => removeItem(i)}
                className="text-red-400 hover:text-red-600 flex-shrink-0"
                disabled={content.items.length <= 1}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListEditor;
