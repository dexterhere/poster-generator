import React from 'react';
import { type Section, type StatsContent, type StatItem } from '../../store/usePosterStore';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: Section;
  onUpdate: (content: Partial<StatsContent>) => void;
}

const StatsEditor: React.FC<Props> = ({ section, onUpdate }) => {
  const content = section.content as StatsContent;

  const updateStat = (i: number, partial: Partial<StatItem>) => {
    const stats = content.stats.map((s, idx) => (idx === i ? { ...s, ...partial } : s));
    onUpdate({ stats });
  };

  const addStat = () => {
    if (content.stats.length >= 6) return;
    onUpdate({ stats: [...content.stats, { value: '100%', label: 'New Stat' }] });
  };

  const removeStat = (i: number) => {
    if (content.stats.length <= 1) return;
    onUpdate({ stats: content.stats.filter((_, idx) => idx !== i) });
  };

  const inputClass = "flex-1 border border-neutral-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-neutral-500">Stats ({content.stats.length}/6)</label>
        <button onClick={addStat} className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
          <Plus size={10} /> Add Stat
        </button>
      </div>
      <div className="space-y-2">
        {content.stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              type="text"
              value={stat.value}
              onChange={(e) => updateStat(i, { value: e.target.value })}
              className="w-16 border border-neutral-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500/30 text-center font-bold"
              placeholder="95%"
            />
            <input
              type="text"
              value={stat.label}
              onChange={(e) => updateStat(i, { label: e.target.value })}
              className={inputClass}
              placeholder="Label"
            />
            <button
              onClick={() => removeStat(i)}
              className="text-red-400 hover:text-red-600 flex-shrink-0"
              disabled={content.stats.length <= 1}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsEditor;
