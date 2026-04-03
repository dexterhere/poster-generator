import React from 'react';
import { type Section, type ImageContent, type SplitImageContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  onUpdate: (content: Partial<ImageContent | SplitImageContent>) => void;
}

const ImageEditor: React.FC<Props> = ({ section, onUpdate }) => {
  if (section.type === 'image') {
    const content = section.content as ImageContent;
    return (
      <div className="space-y-3">
        <p className="text-[11px] text-neutral-500">Upload the image directly on the poster preview by clicking the upload zone.</p>
        <div>
          <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Caption</label>
          <input
            type="text"
            value={content.caption}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="Optional caption text..."
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Image Fit</label>
          <select
            value={content.fit}
            onChange={(e) => onUpdate({ fit: e.target.value as 'contain' | 'cover' })}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            <option value="contain">Contain (show full image)</option>
            <option value="cover">Cover (fill the box)</option>
          </select>
        </div>
      </div>
    );
  }

  // split-image
  const content = section.content as SplitImageContent;
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Layout & Fit</label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={content.direction || 'horizontal'}
            onChange={(e) => onUpdate({ direction: e.target.value as 'horizontal' | 'vertical' })}
            className="w-full border border-neutral-200 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
          <select
            value={content.fit || 'contain'}
            onChange={(e) => onUpdate({ fit: e.target.value as 'contain' | 'cover' })}
            className="w-full border border-neutral-200 rounded-md px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            <option value="contain">Contain</option>
            <option value="cover">Cover</option>
          </select>
        </div>
      </div>
      <p className="text-[11px] text-neutral-500">Upload images directly on the poster preview by clicking each side.</p>
      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Left Image Label</label>
        <input
          type="text"
          value={content.leftLabel}
          onChange={(e) => onUpdate({ leftLabel: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Right Image Label</label>
        <input
          type="text"
          value={content.rightLabel}
          onChange={(e) => onUpdate({ rightLabel: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>
    </div>
  );
};

export default ImageEditor;
