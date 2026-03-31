import React from 'react';
import { type Section, type TableContent } from '../../store/usePosterStore';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: Section;
  onUpdate: (content: Partial<TableContent>) => void;
}

const TableEditor: React.FC<Props> = ({ section, onUpdate }) => {
  const content = section.content as TableContent;

  const updateCell = (ri: number, ci: number, value: string) => {
    const rows = content.rows.map((row, r) =>
      r === ri ? row.map((cell, c) => (c === ci ? value : cell)) : row
    );
    onUpdate({ rows });
  };

  const updateColumn = (ci: number, value: string) => {
    const columns = content.columns.map((col, i) => (i === ci ? value : col));
    onUpdate({ columns });
  };

  const addRow = () => {
    onUpdate({ rows: [...content.rows, content.columns.map(() => '')] });
  };

  const removeRow = (ri: number) => {
    onUpdate({ rows: content.rows.filter((_, i) => i !== ri) });
  };

  const addColumn = () => {
    if (content.columns.length >= 6) return;
    onUpdate({
      columns: [...content.columns, `Column ${content.columns.length + 1}`],
      rows: content.rows.map((row) => [...row, '']),
    });
  };

  const removeColumn = (ci: number) => {
    if (content.columns.length <= 2) return;
    onUpdate({
      columns: content.columns.filter((_, i) => i !== ci),
      rows: content.rows.map((row) => row.filter((_, i) => i !== ci)),
    });
  };

  const inputClass = "w-full border border-neutral-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

  return (
    <div className="space-y-3">
      {/* Column headers */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold text-neutral-500">Columns</label>
          <button onClick={addColumn} className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <Plus size={10} /> Add Column
          </button>
        </div>
        <div className="space-y-1.5">
          {content.columns.map((col, ci) => (
            <div key={ci} className="flex items-center gap-2">
              <input
                type="text"
                value={col}
                onChange={(e) => updateColumn(ci, e.target.value)}
                className={inputClass}
                placeholder={`Column ${ci + 1}`}
              />
              <button
                onClick={() => removeColumn(ci)}
                className="text-red-400 hover:text-red-600 flex-shrink-0"
                disabled={content.columns.length <= 2}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold text-neutral-500">Rows</label>
          <button onClick={addRow} className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <Plus size={10} /> Add Row
          </button>
        </div>
        <div className="space-y-2">
          {content.rows.map((row, ri) => (
            <div key={ri} className="border border-neutral-200 rounded-md p-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-medium">Row {ri + 1}</span>
                <button onClick={() => removeRow(ri)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={11} />
                </button>
              </div>
              <div className="space-y-1">
                {row.map((cell, ci) => (
                  <div key={ci} className="flex items-center gap-1.5">
                    <span className="text-[9px] text-neutral-400 w-16 shrink-0 truncate">{content.columns[ci]}</span>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableEditor;
