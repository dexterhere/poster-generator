import React from 'react';
import { type Section, type StatsContent, type SectionContent } from '../../store/usePosterStore';
import { hexOpacity } from '../../utils/colorUtils';
import InlineEditableText from './InlineEditableText';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
  isSelected?: boolean;
  onUpdateContent?: (content: Partial<SectionContent>) => void;
}

const StatsSection: React.FC<Props> = ({ section, primaryColor, isSelected = false, onUpdateContent }) => {
  const content = section.content as StatsContent;
  const s = section.style ?? {};

  const valueStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${Math.max(16, s.fontSize + 6)}px` : '24px',
    fontFamily: 'var(--font-display)',
    fontWeight: 'bold',
    lineHeight:  1,
    color:       primaryColor,
  };

  const alignMap: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };
  const justify = alignMap[s.textAlign ?? 'center'] ?? 'center';

  const labelStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${Math.max(8, s.fontSize - 2)}px` : '8px',
    fontFamily: 'var(--font-body)',
    color:      '#4b5563',
    fontWeight: '500',
    lineHeight: s.lineHeight ?? 1.4,
    marginTop:  '4px',
    textAlign:  s.textAlign ?? 'center',
  };

  return (
    <div className="flex flex-wrap h-full overflow-hidden p-2 gap-2 items-center" style={{ justifyContent: justify }}>
      {content.stats.map((stat, i) => (
        <div
          key={i}
          className="flex-1 min-w-[60px] flex flex-col items-center justify-center p-2 rounded-lg text-center"
          style={{ backgroundColor: hexOpacity(primaryColor, 16) }}
        >
          <InlineEditableText
            as="span"
            text={stat.value}
            canEdit={isSelected}
            style={valueStyle}
            multiline={false}
            onCommit={(value) => {
              const stats = content.stats.map((entry, idx) =>
                idx === i ? { ...entry, value } : entry
              );
              onUpdateContent?.({ stats } as Partial<StatsContent>);
            }}
          />
          <InlineEditableText
            as="span"
            text={stat.label}
            canEdit={isSelected}
            style={labelStyle}
            multiline={false}
            onCommit={(value) => {
              const stats = content.stats.map((entry, idx) =>
                idx === i ? { ...entry, label: value } : entry
              );
              onUpdateContent?.({ stats } as Partial<StatsContent>);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
