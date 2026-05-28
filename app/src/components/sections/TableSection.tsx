import React from 'react';
import { type Section, type TableContent, type SectionContent } from '../../store/usePosterStore';
import { hexOpacity } from '../../utils/colorUtils';
import InlineEditableText from './InlineEditableText';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
  isSelected?: boolean;
  onUpdateContent?: (content: Partial<SectionContent>) => void;
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

const TableSection: React.FC<Props> = ({ section, primaryColor, isSelected = false, onUpdateContent }) => {
  const content = normaliseTable(section.content);
  const s = section.style ?? {};
  const tableCellFontSize = s.tableCellFontSize ?? s.fontSize ?? 7;
  const tableHeaderFontSize = s.tableHeaderFontSize ?? Math.max(7, tableCellFontSize + 1);
  const tableHeaderBgColor = s.tableHeaderBgColor ?? primaryColor;
  const tableHeaderTextColor = s.tableHeaderTextColor ?? '#ffffff';
  const tableCellTextColor = s.tableCellTextColor ?? '#374151';
  const tableVariant = s.tableVariant ?? 'classic';
  const tableDensity = s.tableDensity ?? 'cozy';
  const tableBorderStyle = s.tableBorderStyle ?? 'grid';
  const tableStriped = s.tableStriped ?? tableVariant === 'zebra';
  const tableHeaderCase = s.tableHeaderCase ?? 'none';

  const densityPadding = {
    compact: '4px 6px',
    cozy: '6px 8px',
    roomy: '9px 10px',
  }[tableDensity];

  const borderColor =
    tableBorderStyle === 'none'
      ? 'transparent'
      : tableBorderStyle === 'subtle'
      ? hexOpacity(primaryColor, 32)
      : hexOpacity(primaryColor, 56);

  const tableWrapperStyle: React.CSSProperties = {
    borderRadius: tableVariant === 'presentation' ? 10 : tableVariant === 'matrix' ? 0 : 8,
    overflow: 'hidden',
    border: tableBorderStyle === 'none' ? 'none' : `1px solid ${borderColor}`,
  };

  const cellStyle: React.CSSProperties = {
    fontSize:   `${tableCellFontSize}px`,
    fontFamily: 'var(--font-body)',
    fontWeight: s.fontWeight ?? 'normal',
    fontStyle:  s.fontStyle  ?? 'normal',
    lineHeight: s.lineHeight ?? 1.4,
    textAlign:  s.textAlign  ?? 'left',
    color:      tableCellTextColor,
    padding: densityPadding,
    borderColor,
    borderStyle: 'solid',
    borderWidth: tableBorderStyle === 'grid' ? 1 : tableBorderStyle === 'subtle' ? '0 0 1px 0' : 0,
  };

  const headerStyle: React.CSSProperties = {
    ...cellStyle,
    fontSize: `${tableHeaderFontSize}px`,
    fontFamily: 'var(--font-display)',
    fontWeight: 'bold',
    color:      tableVariant === 'minimal' ? primaryColor : tableHeaderTextColor,
    backgroundColor: tableVariant === 'minimal' ? 'transparent' : tableHeaderBgColor,
    textTransform: tableHeaderCase === 'none' ? undefined : tableHeaderCase,
    borderColor,
    borderStyle: 'solid',
    borderWidth: tableBorderStyle === 'grid' ? 1 : tableBorderStyle === 'subtle' ? '0 0 2px 0' : 0,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div style={tableWrapperStyle}>
          <table className="w-full border-collapse">
          <thead>
            <tr>
              {content.columns.map((col, i) => (
                <th
                  key={i}
                  className="text-left"
                  style={headerStyle}
                >
                  <InlineEditableText
                    as="span"
                    text={col}
                    canEdit={isSelected}
                    multiline={false}
                    onCommit={(value) => {
                      const columns = content.columns.map((entry, idx) => (idx === i ? value : entry));
                      onUpdateContent?.({ columns } as Partial<TableContent>);
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, ri) => (
              <tr
                key={ri}
                style={{
                  backgroundColor:
                    tableVariant === 'presentation'
                      ? ri % 2 === 0 ? hexOpacity(primaryColor, 10) : '#ffffff'
                      : tableStriped && ri % 2 !== 0
                      ? hexOpacity(primaryColor, 8)
                      : tableVariant === 'matrix'
                      ? hexOpacity(primaryColor, 5)
                      : undefined,
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="text-neutral-700"
                    style={cellStyle}
                  >
                    <InlineEditableText
                      as="span"
                      text={cell}
                      canEdit={isSelected}
                      onCommit={(value) => {
                        const rows = content.rows.map((entry, rowIndex) =>
                          rowIndex === ri
                            ? entry.map((cellValue, colIndex) => (colIndex === ci ? value : cellValue))
                            : entry
                        );
                        onUpdateContent?.({ rows } as Partial<TableContent>);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableSection;
