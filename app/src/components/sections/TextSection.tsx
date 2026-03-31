import React from 'react';
import { type Section, type TextContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const TextSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as TextContent;
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3 flex-1 overflow-auto">
        <p className="text-[11px] leading-relaxed text-neutral-700 whitespace-pre-wrap">{content.body}</p>
        {content.highlightBox && (
          <div
            className="mt-3 p-2.5 rounded-lg border-l-4 text-[10px] italic leading-relaxed"
            style={{
              backgroundColor: primaryColor + '12',
              borderColor: primaryColor,
              color: primaryColor,
            }}
          >
            {content.highlightBox}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSection;
