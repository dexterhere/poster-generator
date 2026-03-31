import React from 'react';
import { type Section, type TextContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  onUpdate: (content: Partial<TextContent>) => void;
}

const TextEditor: React.FC<Props> = ({ section, onUpdate }) => {
  const content = section.content as TextContent;
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Body Text</label>
        <textarea
          rows={6}
          value={content.body}
          onChange={(e) => onUpdate({ body: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
          placeholder="Write the section content here..."
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Highlight Box (optional)</label>
        <input
          type="text"
          value={content.highlightBox || ''}
          onChange={(e) => onUpdate({ highlightBox: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          placeholder="A key quote or summary sentence..."
        />
      </div>
    </div>
  );
};

export default TextEditor;
