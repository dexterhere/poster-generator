import React from 'react';
import { type Section, type TableContent } from '../../store/usePosterStore';
import { hexOpacity } from '../../utils/colorUtils';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
}

/** Coerce any value to a plain string safely. */
function toStr(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'object') {
    try { return JSON.stringify(v); } catch { return ''; }
  }
  return '';
}

/** Normalise whatever shape an AI or user might produce into {columns, rows}. */
function normaliseTable(raw: unknown): TableContent {
  try {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return { columns: ['Column 1', 'Column 2'], rows: [] };
    }
    const r = raw as Record<string, unknown>;

    // Resolve columns — check every alias AI models commonly use
    let columns: string[] = [];
    const colRaw = r.columns ?? r.headers ?? r.header ?? r.columnHeaders ?? r.cols ?? r.fields ?? r.keys;
    if (Array.isArray(colRaw) && colRaw.length > 0) {
      columns = colRaw.map(toStr).filter(Boolean);
    }
    if (columns.length === 0) columns = ['Column 1', 'Column 2'];

    // Resolve rows — check every alias AI models commonly use
    let rows: string[][] = [];
    const rowRaw = r.rows ?? r.data ?? r.body ?? r.entries ?? r.items ?? r.records ?? r.values;
    if (Array.isArray(rowRaw)) {
      rows = rowRaw
        .filter((row) => row !== null && row !== undefined)
        .map((row): string[] => {
          // Already a flat array of primitives
          if (Array.isArray(row)) {
            const arr = row.map(toStr);
            while (arr.length < columns.length) arr.push('');
            return arr.slice(0, columns.length);
          }
          // Object row — map by column name then fall back to values in order
          if (typeof row === 'object' && row !== null) {
            const obj = row as Record<string, unknown>;
            const byKey = columns.map((col) =>
              toStr(obj[col] ?? obj[col.toLowerCase()] ?? obj[col.toUpperCase()] ?? obj[col.replace(/\s+/g, '_')] ?? obj[col.replace(/\s+/g, '')])
            );
            if (byKey.some(Boolean)) return byKey;
            // Fall back: just take values in insertion order
            const vals = Object.values(obj).map(toStr);
            while (vals.length < columns.length) vals.push('');
            return vals.slice(0, columns.length);
          }
          // Primitive row — put in first cell
          return [toStr(row), ...columns.slice(1).map(() => '')];
        });
    }

    return { columns, rows };
  } catch {
    return { columns: ['Column 1', 'Column 2'], rows: [] };
  }
}

const TableSection: React.FC<Props> = ({ section, primaryColor }) => {
  const content = normaliseTable(section.content);
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
