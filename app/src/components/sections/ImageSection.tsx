import React, { useRef } from 'react';
import { type Section, type ImageContent } from '../../store/usePosterStore';
import { usePosterStore } from '../../store/usePosterStore';
import { Upload } from 'lucide-react';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const ImageSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as ImageContent;
  const updateSectionContent = usePosterStore((s) => s.updateSectionContent);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateSectionContent(section.id, { imageUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        {content.imageUrl ? (
          <img
            src={content.imageUrl}
            alt={content.caption || section.title}
            className="w-full h-full"
            style={{ objectFit: content.fit }}
          />
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
            style={{ backgroundColor: primaryColor + '05' }}
          >
            <Upload size={20} style={{ color: primaryColor + '80' }} />
            <span className="text-[10px] font-medium">Click to upload image</span>
            <span className="text-[9px] text-neutral-400">SVG, PNG, JPG</span>
          </button>
        )}
        {content.imageUrl && (
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded hover:bg-black/80 transition-colors"
          >
            Replace
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".svg,.png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {content.caption && (
        <div className="px-3 py-1.5 border-t border-neutral-100 text-[9px] text-neutral-500 italic text-center">
          {content.caption}
        </div>
      )}
    </div>
  );
};

export default ImageSection;
