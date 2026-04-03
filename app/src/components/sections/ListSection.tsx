import React from 'react';
import { type Section, type ListContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const ListSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as ListContent;
  const s = section.style ?? {};

  const textStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${s.fontSize}px`  : '11px',
    fontWeight: s.fontWeight ?? 'normal',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.4,
    fontFamily: 'var(--font-body)',
    color:      '#374151',
  };

  return (
    <div
      className="flex flex-col h-full overflow-auto gap-1.5"
      style={{ textAlign: s.textAlign ?? 'left' }}
    >
      {content.items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {content.style === 'numbered' ? (
            <span
              className="flex-shrink-0 w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-bold text-white mt-0.5"
              style={{ backgroundColor: primaryColor }}
            >
              {i + 1}
            </span>
          ) : (
            <span
              className="flex-shrink-0 w-2 h-2 rounded-full mt-1.5"
              style={{ backgroundColor: primaryColor }}
            />
          )}
          {item.tag && (
            <span
              className="flex-shrink-0 text-[7px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide mt-0.5"
              style={{ backgroundColor: primaryColor + '20', color: primaryColor }}
            >
              {item.tag}
            </span>
          )}
          <p style={textStyle}>{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ListSection;
