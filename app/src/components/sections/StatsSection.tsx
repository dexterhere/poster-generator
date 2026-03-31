import React from 'react';
import { type Section, type StatsContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const StatsSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as StatsContent;
  return (
    <div className="flex flex-wrap h-full overflow-hidden p-2 gap-2 items-center justify-center">
      {content.stats.map((stat, i) => (
        <div
          key={i}
          className="flex-1 min-w-[60px] flex flex-col items-center justify-center p-2 rounded-lg text-center"
          style={{ backgroundColor: primaryColor + '10' }}
        >
          <span
            className="text-2xl font-black leading-none"
            style={{ color: primaryColor }}
          >
            {stat.value}
          </span>
          <span className="text-[9px] text-neutral-600 font-medium mt-1 leading-tight">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
