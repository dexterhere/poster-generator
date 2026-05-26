import React from 'react';
import { type Section, type TextContent, type SectionContent } from '../../store/usePosterStore';
import { hexOpacity } from '../../utils/colorUtils';
import InlineEditableText from './InlineEditableText';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
  isSelected?: boolean;
  onUpdateContent?: (content: Partial<SectionContent>) => void;
}

const TextSection: React.FC<Props> = ({ section, primaryColor, isSelected = false, onUpdateContent }) => {
  const content = section.content as TextContent;
  const s = section.style ?? {};

  const bodyStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${s.fontSize}px`  : '9px',
    textAlign:  s.textAlign  ?? 'left',
    fontWeight: s.fontWeight ?? 'normal',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.4,
    fontFamily: 'var(--font-body)',
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto">
        <InlineEditableText
          as="p"
          text={content.body ?? ''}
          canEdit={isSelected}
          className="text-neutral-700 whitespace-pre-wrap"
          style={bodyStyle}
          onCommit={(value) => onUpdateContent?.({ body: value } as Partial<TextContent>)}
        />
        {content.highlightBox && (
          <div
            className="mt-3 p-2.5 rounded-lg border-l-4 italic leading-relaxed"
            style={{
              fontSize:        s.fontSize ? `${Math.max(8, s.fontSize - 1)}px` : '8px',
              backgroundColor: hexOpacity(primaryColor, 18),
              borderColor:     primaryColor,
              color:           primaryColor,
              fontFamily:      'var(--font-display)',
            }}
          >
            <InlineEditableText
              as="span"
              text={content.highlightBox}
              canEdit={isSelected}
              style={{ fontStyle: 'italic' }}
              onCommit={(value) => onUpdateContent?.({ highlightBox: value } as Partial<TextContent>)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSection;
