import React from 'react';
import { type Section, type TextContent } from '../../store/usePosterStore';
import { hexOpacity } from '../../utils/colorUtils';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const TextSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as TextContent;
  const s = section.style ?? {};

  const bodyStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${s.fontSize}px`  : '11px',
    textAlign:  s.textAlign  ?? 'left',
    fontWeight: s.fontWeight ?? 'normal',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.4,
    fontFamily: 'var(--font-body)',
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto">
        <p className="text-neutral-700 whitespace-pre-wrap" style={bodyStyle}>
          {content.body ?? ''}
        </p>
        {content.highlightBox && (
          <div
            className="mt-3 p-2.5 rounded-lg border-l-4 italic leading-relaxed"
            style={{
              fontSize:        s.fontSize ? `${Math.max(9, s.fontSize - 1)}px` : '10px',
              backgroundColor: hexOpacity(primaryColor, 18),
              borderColor:     primaryColor,
              color:           primaryColor,
              fontFamily:      'var(--font-display)',
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
