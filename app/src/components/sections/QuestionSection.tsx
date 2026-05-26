import React from 'react';
import { type Section, type QuestionContent, type SectionContent } from '../../store/usePosterStore';
import { hexOpacity } from '../../utils/colorUtils';
import InlineEditableText from './InlineEditableText';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
  isSelected?: boolean;
  onUpdateContent?: (content: Partial<SectionContent>) => void;
}

const QuestionSection: React.FC<Props> = ({ section, primaryColor, isSelected = false, onUpdateContent }) => {
  const content = section.content as QuestionContent;
  const s = section.style ?? {};
  const align = s.textAlign ?? 'center';

  const questionStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${s.fontSize}px`        : '16px',
    fontWeight: s.fontWeight ?? 'bold',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.4,
    fontFamily: 'var(--font-display)',
    color:      primaryColor,
    textAlign:  align,
  };

  const subtextStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${Math.max(8, s.fontSize - 4)}px` : '10px',
    fontWeight: 'normal',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.4,
    fontFamily: 'var(--font-body)',
    color:      '#4b5563',
    textAlign:  align,
  };

  return (
    <div
      className="flex flex-col justify-center h-full rounded-xl space-y-3"
      style={{
        backgroundColor: hexOpacity(primaryColor, 8),
        alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        padding: '16px',
      }}
    >
      <InlineEditableText
        as="h2"
        text={content.questionText}
        canEdit={isSelected}
        style={questionStyle}
        onCommit={(value) => onUpdateContent?.({ questionText: value } as Partial<QuestionContent>)}
      />
      {content.subtext && (
        <InlineEditableText
          as="p"
          text={content.subtext}
          canEdit={isSelected}
          style={subtextStyle}
          className="max-w-[90%]"
          onCommit={(value) => onUpdateContent?.({ subtext: value } as Partial<QuestionContent>)}
        />
      )}
    </div>
  );
};

export default QuestionSection;
