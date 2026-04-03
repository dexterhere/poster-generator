import React from 'react';
import { type Section, type FlowContent } from '../../store/usePosterStore';
import { hexOpacity } from '../../utils/colorUtils';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const FlowSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as FlowContent;
  const s = section.style ?? {};
  const isVertical = content.direction === 'vertical';

  const nameStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${s.fontSize}px`        : '11px',
    fontWeight: s.fontWeight ?? 'bold',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.4,
    fontFamily: 'var(--font-display)',
    textAlign:  s.textAlign  ?? (isVertical ? 'left' : 'center'),
  };

  const descStyle: React.CSSProperties = {
    fontSize:   s.fontSize ? `${Math.max(8, s.fontSize - 2)}px` : '10px',
    fontFamily: 'var(--font-body)',
    color:      '#6b7280',
    lineHeight: s.lineHeight ?? 1.4,
    textAlign:  s.textAlign  ?? (isVertical ? 'left' : 'center'),
  };

  return (
    <div className={`flex ${isVertical ? 'flex-col' : 'flex-row items-stretch'} h-full overflow-auto p-3 gap-3`}>
      {content.steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className={`flex ${isVertical ? 'flex-row items-start' : 'flex-col items-center'} gap-2 ${isVertical ? '' : 'flex-1'}`}>
            <div
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm z-10"
              style={{ backgroundColor: step.highlight ? primaryColor : hexOpacity(primaryColor, 96) }}
            >
              {i + 1}
            </div>
            <div className={`flex-1 min-w-0 ${isVertical ? '' : 'flex flex-col items-center'}`}>
              <p style={{ ...nameStyle, color: step.highlight ? primaryColor : '#1f2937' }}>{step.name}</p>
              <p style={descStyle} className="mt-0.5 max-w-[150px]">{step.description}</p>
            </div>
          </div>
          {i < content.steps.length - 1 && (
            <div
              className={`bg-neutral-200 shrink-0 self-center rounded-full ${isVertical ? 'w-0.5 h-5 ml-3.5' : 'w-6 h-0.5 -mt-6'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FlowSection;
