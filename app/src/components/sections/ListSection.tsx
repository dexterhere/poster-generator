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
  const variant = s.listVariant ?? 'compact';
  const density = s.listDensity ?? 'tight';
  const markerSize = s.listMarkerSize ?? (variant === 'badges' ? 16 : 12);
  const gap = density === 'tight' ? 3 : density === 'relaxed' ? 8 : 5;
  const itemPadding = variant === 'minimal' ? '0' : variant === 'checklist' ? '2px 0' : '1px 0';

  const textStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${s.fontSize}px`  : '8px',
    fontWeight: s.fontWeight ?? 'normal',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.25,
    fontFamily: 'var(--font-body)',
    color:      '#374151',
    margin: 0,
  };

  const introStyle: React.CSSProperties = {
    ...textStyle,
    marginBottom: density === 'tight' ? '4px' : '8px',
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
      <div className="flex flex-col" style={{ gap }}>
      {content.items.map((item, i) => (
        <div
          key={i}
          className="flex items-start"
          style={{
            gap: variant === 'minimal' ? 6 : 8,
            padding: itemPadding,
            borderLeft: variant === 'timeline' ? `2px solid ${hexOpacity(primaryColor, 65)}` : undefined,
            paddingLeft: variant === 'timeline' ? 8 : undefined,
          }}
        >
          {content.style === 'numbered' ? (
            <span
              className="flex-shrink-0 rounded-sm flex items-center justify-center font-bold text-white"
              style={{
                width: markerSize,
                height: markerSize,
                fontSize: Math.max(6, markerSize - 7),
                marginTop: 1,
                backgroundColor: variant === 'minimal' ? 'transparent' : primaryColor,
                color: variant === 'minimal' ? primaryColor : '#ffffff',
                border: variant === 'minimal' ? `1px solid ${hexOpacity(primaryColor, 85)}` : undefined,
              }}
            >
              {i + 1}
            </span>
          ) : (
            <span
              className="flex-shrink-0 rounded-full"
              style={{
                width: Math.max(5, Math.round(markerSize * 0.45)),
                height: Math.max(5, Math.round(markerSize * 0.45)),
                marginTop: 4,
                backgroundColor: variant === 'checklist' ? 'transparent' : primaryColor,
                border: variant === 'checklist' ? `1.5px solid ${primaryColor}` : undefined,
              }}
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
