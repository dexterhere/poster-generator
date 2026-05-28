import React from 'react';
import { usePosterStore, type Section, type QuestionContent, type SectionStyle } from '../../store/usePosterStore';

interface Props {
  section: Section;
  onUpdate: (content: Partial<QuestionContent>) => void;
}

const QuestionEditor: React.FC<Props> = ({ section, onUpdate }) => {
  const content = section.content as QuestionContent;
  const updateSection = usePosterStore((s) => s.updateSection);
  const style = section.style ?? {};
  const setStyle = (patch: Partial<SectionStyle>) =>
    updateSection(section.id, { style: { ...style, ...patch } });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1.5">Question Design</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['statement', 'spotlight', 'compact', 'framed', 'side-accent'] as const).map((variant) => (
            <button
              key={variant}
              onClick={() => setStyle({ questionVariant: variant })}
              className={`text-[10px] py-1.5 px-2 rounded border capitalize ${
                (style.questionVariant ?? 'statement') === variant
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-neutral-200 text-neutral-500 hover:border-indigo-200'
              }`}
            >
              {variant.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Label</label>
        <input
          value={content.label ?? ''}
          onChange={(e) => onUpdate({ label: e.target.value || undefined })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          placeholder="Research Question"
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Main Question (H1)</label>
        <textarea
          value={content.questionText}
          onChange={(e) => onUpdate({ questionText: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium min-h-[80px]"
          placeholder="e.g. How does gamification improve student engagement?"
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Subtext / Hypothesis</label>
        <textarea
          value={content.subtext}
          onChange={(e) => onUpdate({ subtext: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[60px]"
          placeholder="Optional elaboration or hypothesis..."
        />
      </div>
    </div>
  );
};

export default QuestionEditor;
