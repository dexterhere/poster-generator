import React from 'react';
import { type Section, type QuestionContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const QuestionSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as QuestionContent;
  const s = section.style ?? {};
  const align = s.textAlign ?? 'center';

  const questionStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${s.fontSize}px`        : '20px',
    fontWeight: s.fontWeight ?? 'bold',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.3,
    fontFamily: 'var(--font-display)',
    color:      primaryColor,
    textAlign:  align,
  };

  const subtextStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${Math.max(9, s.fontSize - 4)}px` : '12px',
    fontWeight: 'normal',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.5,
    fontFamily: 'var(--font-body)',
    color:      '#4b5563',
    textAlign:  align,
  };

  return (
    <div
      className="flex flex-col justify-center h-full rounded-xl space-y-3"
      style={{
        backgroundColor: primaryColor + '08',
        alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        padding: '16px',
      }}
    >
      <h2 style={questionStyle}>{content.questionText}</h2>
      {content.subtext && (
        <p style={subtextStyle} className="max-w-[90%]">{content.subtext}</p>
      )}
    </div>
  );
};

export default QuestionSection;
