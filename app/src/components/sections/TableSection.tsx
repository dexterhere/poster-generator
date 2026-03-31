import React from 'react';
import { type Section, type TableContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

const TableSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = section.content as TableContent;
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto p-2">
        <table className="w-full text-[9px] border-collapse">
          <thead>
            <tr>
              {content.columns.map((col, i) => (
                <th
                  key={i}
                  className="px-2 py-1.5 text-left font-bold text-white border border-white/20"
                  style={{ backgroundColor: primaryColor }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : ''} style={{ backgroundColor: ri % 2 !== 0 ? primaryColor + '08' : undefined }}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-2 py-1.5 border border-neutral-200 text-neutral-700 leading-snug"
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
