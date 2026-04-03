import React from 'react';
import { type Section, type TableContent } from '../../store/usePosterStore';
import { hexOpacity } from '../../utils/colorUtils';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const TableSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as TableContent;
  const s = section.style ?? {};

  const cellStyle: React.CSSProperties = {
    fontSize:   s.fontSize   ? `${s.fontSize}px`  : '9px',
    fontFamily: 'var(--font-body)',
    fontWeight: s.fontWeight ?? 'normal',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.4,
    textAlign:  s.textAlign  ?? 'left',
  };

  const headerStyle: React.CSSProperties = {
    ...cellStyle,
    fontFamily: 'var(--font-display)',
    fontWeight: 'bold',
    color:      'white',
    backgroundColor: primaryColor,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {content.columns.map((col, i) => (
                <th
                  key={i}
                  className="px-2 py-1.5 text-left border border-white/20"
                  style={headerStyle}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, ri) => (
              <tr key={ri} style={{ backgroundColor: ri % 2 !== 0 ? hexOpacity(primaryColor, 8) : undefined }}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-2 py-1.5 border border-neutral-200 text-neutral-700"
                    style={cellStyle}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSection;
