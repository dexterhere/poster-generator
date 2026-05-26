import React, { useRef } from 'react';
import { type Section, type SplitImageContent, type SectionContent } from '../../store/usePosterStore';
import { usePosterStore } from '../../store/usePosterStore';
import { Upload } from 'lucide-react';
import { hexOpacity } from '../../utils/colorUtils';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
  isSelected?: boolean;
  onUpdateContent?: (content: Partial<SectionContent>) => void;
}

type Side = 'left' | 'right';

const SplitImageSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as SplitImageContent;
  const isHorizontal = (content.direction || 'horizontal') === 'horizontal';
  const fitClass = content.fit === 'cover' ? 'object-cover' : 'object-contain';
  const updateSectionContent = usePosterStore((s) => s.updateSectionContent);
  const leftRef = useRef<HTMLInputElement>(null);
  const rightRef = useRef<HTMLInputElement>(null);

  const handleFile = (side: Side, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      updateSectionContent(section.id, side === 'left' ? { leftImageUrl: url } : { rightImageUrl: url });
    };
    reader.readAsDataURL(file);
  };

  const renderSide = (side: Side) => {
    const imageUrl = side === 'left' ? content.leftImageUrl : content.rightImageUrl;
    const label = side === 'left' ? content.leftLabel : content.rightLabel;
    const inputRef = side === 'left' ? leftRef : rightRef;
    const borderClass = isHorizontal ? 'border-r last:border-r-0' : 'border-b last:border-b-0';

    return (
      <div className={`flex-1 flex flex-col ${borderClass} border-neutral-100 overflow-hidden min-h-0 min-w-0`}>
        <div
          className="text-[9px] font-bold px-2 py-1 text-center"
          style={{ backgroundColor: hexOpacity(primaryColor, 21), color: primaryColor }}
        >
          {label}
        </div>
        <div className="flex-1 relative overflow-hidden min-h-0 min-w-0">
          {imageUrl ? (
            <img src={imageUrl} alt={label} className={`w-full h-full ${fitClass}`} />
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              <Upload size={14} style={{ color: hexOpacity(primaryColor, 112) }} />
              <span className="text-[8px]">Upload {label}</span>
            </button>
          )}
          {imageUrl && (
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded print:hidden editor-only-ui"
              data-editor-ui="true"
            >
              Replace
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => handleFile(side, e)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-full overflow-hidden ${isHorizontal ? 'flex-row' : 'flex-col'}`}>
      {renderSide('left')}
      {renderSide('right')}
    </div>
  );
};

export default SplitImageSection;
