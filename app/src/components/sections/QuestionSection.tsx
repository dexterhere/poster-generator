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
  const variant = s.questionVariant ?? 'statement';
  const isCompact = variant === 'compact';

  const questionStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${s.fontSize}px`        : isCompact ? '12px' : '16px',
    fontWeight: s.fontWeight ?? 'bold',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.25,
    fontFamily: 'var(--font-display)',
    color:      primaryColor,
    textAlign:  align,
  };

  const subtextStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${Math.max(7, s.fontSize - 4)}px` : isCompact ? '8px' : '10px',
    fontWeight: 'normal',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.4,
    fontFamily: 'var(--font-body)',
    color:      '#4b5563',
    textAlign:  align,
  };

  return (
    <div
      className="flex flex-col h-full rounded-xl"
      style={{
        backgroundColor: variant === 'framed' || variant === 'statement' ? hexOpacity(primaryColor, 8) : 'transparent',
        border: variant === 'framed' ? `1px solid ${hexOpacity(primaryColor, 80)}` : undefined,
        borderLeft: variant === 'side-accent' ? `4px solid ${primaryColor}` : undefined,
        alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        justifyContent: variant === 'compact' || variant === 'side-accent' ? 'flex-start' : 'center',
        padding: isCompact ? '8px' : variant === 'side-accent' ? '10px 12px' : '16px',
        gap: isCompact ? 5 : 10,
      }}
    >
      {content.label && variant !== 'statement' && (
        <InlineEditableText
          as="span"
          text={content.label}
          canEdit={isSelected}
          className="font-bold uppercase tracking-widest"
          style={{
            fontSize: isCompact ? 7 : 8,
            color: primaryColor,
            backgroundColor: variant === 'spotlight' ? hexOpacity(primaryColor, 24) : undefined,
            padding: variant === 'spotlight' ? '3px 6px' : undefined,
            borderRadius: variant === 'spotlight' ? 999 : undefined,
          }}
          multiline={false}
          onCommit={(value) => onUpdateContent?.({ label: value } as Partial<QuestionContent>)}
        />
      )}
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
