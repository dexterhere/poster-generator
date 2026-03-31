import React from 'react';
import { type Section, type ListContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const ListSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as ListContent;
  return (
    <div className="flex flex-col h-full overflow-auto p-3 gap-1.5">
      {content.items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {/* Bullet / Number */}
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
          {/* Tag pill */}
          {item.tag && (
            <span
              className="flex-shrink-0 text-[7px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide mt-0.5"
              style={{ backgroundColor: primaryColor + '20', color: primaryColor }}
            >
              {item.tag}
            </span>
          )}
          <p className="text-[10px] text-neutral-700 leading-snug">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ListSection;
