import React from 'react';
import { type Section, type FlowContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const FlowSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as FlowContent;
  return (
    <div className="flex flex-col h-full overflow-auto p-3 gap-1.5">
      {content.steps.map((step, i) => (
        <div key={i} className="flex items-start gap-2">
          {/* Step number bubble */}
          <div
            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white mt-0.5"
            style={{ backgroundColor: step.highlight ? primaryColor : primaryColor + '60' }}
          >
            {i + 1}
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] font-bold leading-tight"
              style={{ color: step.highlight ? primaryColor : '#374151' }}
            >
              {step.name}
            </p>
            <p className="text-[9px] text-neutral-500 leading-snug mt-0.5">{step.description}</p>
          </div>
          {/* Connector line */}
          {i < content.steps.length - 1 && (
            <div className="absolute" />
          )}
        </div>
      ))}
    </div>
  );
};

export default FlowSection;
