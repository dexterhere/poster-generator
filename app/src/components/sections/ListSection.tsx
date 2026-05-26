import React from 'react';
import { type Section, type ListContent, type SectionContent } from '../../store/usePosterStore';
import { hexOpacity } from '../../utils/colorUtils';
import InlineEditableText from './InlineEditableText';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
  isSelected?: boolean;
  onUpdateContent?: (content: Partial<SectionContent>) => void;
}

const ListSection: React.FC<Props> = ({ section, primaryColor, isSelected = false, onUpdateContent }) => {
  const content = section.content as ListContent;
  const s = section.style ?? {};

  const textStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${s.fontSize}px`  : '9px',
    fontWeight: s.fontWeight ?? 'normal',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.4,
    fontFamily: 'var(--font-body)',
    color:      '#374151',
  };

  const introStyle: React.CSSProperties = {
    ...textStyle,
    marginBottom: '8px',
    fontStyle: 'italic',
    color: '#4b5563',
  };

  return (
    <div
      className="flex flex-col h-full overflow-auto"
      style={{ textAlign: s.textAlign ?? 'left' }}
    >
      {content.intro && (
        <InlineEditableText
          as="p"
          text={content.intro}
          canEdit={isSelected}
          style={introStyle}
          onCommit={(value) => onUpdateContent?.({ intro: value } as Partial<ListContent>)}
        />
      )}
      <div className="flex flex-col gap-1.5">
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
            <InlineEditableText
              as="span"
              text={item.tag}
              canEdit={isSelected}
              className="flex-shrink-0 text-[7px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide mt-0.5"
              style={{ backgroundColor: hexOpacity(primaryColor, 32), color: primaryColor }}
              multiline={false}
              onCommit={(value) => {
                const items = content.items.map((entry, idx) =>
                  idx === i ? { ...entry, tag: value } : entry
                );
                onUpdateContent?.({ items } as Partial<ListContent>);
              }}
            />
          )}
          <InlineEditableText
            as="p"
            text={item.text}
            canEdit={isSelected}
            style={textStyle}
            onCommit={(value) => {
              const items = content.items.map((entry, idx) =>
                idx === i ? { ...entry, text: value } : entry
              );
              onUpdateContent?.({ items } as Partial<ListContent>);
            }}
          />
        </div>
      ))}
      </div>
    </div>
  );
};

export default ListSection;
