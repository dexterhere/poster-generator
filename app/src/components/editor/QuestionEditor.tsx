import React from 'react';
import { type Section, type QuestionContent } from '../../store/usePosterStore';

interface Props {
  section: Section;
  onUpdate: (content: Partial<QuestionContent>) => void;
}

const QuestionEditor: React.FC<Props> = ({ section, onUpdate }) => {
  const content = section.content as QuestionContent;

  return (
    <div className="space-y-4">
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
