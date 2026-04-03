import React from 'react';
import { type Section, type StatsContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const StatsSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as StatsContent;
  const s = section.style ?? {};

  const valueStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${Math.max(16, s.fontSize + 6)}px` : '26px',
    fontFamily: 'var(--font-display)',
    fontWeight: 'bold',
    lineHeight:  1,
    color:       primaryColor,
  };

  const labelStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${Math.max(8, s.fontSize - 2)}px` : '9px',
    fontFamily: 'var(--font-body)',
    color:      '#4b5563',
    fontWeight: '500',
    lineHeight: 1.2,
    marginTop:  '4px',
    textAlign:  s.textAlign ?? 'center',
  };

  return (
    <div className="flex flex-wrap h-full overflow-hidden p-2 gap-2 items-center justify-center">
      {content.stats.map((stat, i) => (
        <div
          key={i}
          className="flex-1 min-w-[60px] flex flex-col items-center justify-center p-2 rounded-lg text-center"
          style={{ backgroundColor: primaryColor + '10' }}
        >
          <span style={valueStyle}>{stat.value}</span>
          <span style={labelStyle}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
