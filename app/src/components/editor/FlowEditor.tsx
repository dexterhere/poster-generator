import React from 'react';
import { type Section, type FlowContent, type FlowStep } from '../../store/usePosterStore';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: Section;
  onUpdate: (content: Partial<FlowContent>) => void;
}

const FlowEditor: React.FC<Props> = ({ section, onUpdate }) => {
  const content = section.content as FlowContent;

  const updateStep = (i: number, partial: Partial<FlowStep>) => {
    const steps = content.steps.map((s, idx) => (idx === i ? { ...s, ...partial } : s));
    onUpdate({ steps });
  };

  const addStep = () => {
    if (content.steps.length >= 8) return;
    onUpdate({
      steps: [...content.steps, { name: 'New Step', description: 'Describe this step', highlight: false }],
    });
  };

  const removeStep = (i: number) => {
    if (content.steps.length <= 2) return;
    onUpdate({ steps: content.steps.filter((_, idx) => idx !== i) });
  };

  const inputClass = "w-full border border-neutral-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

  return (
    <div className="space-y-3">
      {/* Direction Toggle */}
      <div className="flex items-center gap-4 bg-neutral-50 p-2 rounded-md border border-neutral-100 mb-2">
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Flow Layout</label>
        <div className="flex gap-3 text-neutral-700">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer font-medium hover:text-neutral-900">
            <input 
              type="radio" 
              name={`flow-dir-horizontal`} 
              checked={content.direction !== 'vertical'} 
              onChange={() => onUpdate({ direction: 'horizontal' })}
              className="accent-indigo-600"
            />
            Horizontal
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer font-medium hover:text-neutral-900">
            <input 
              type="radio" 
              name={`flow-dir-vertical`} 
              checked={content.direction === 'vertical'} 
              onChange={() => onUpdate({ direction: 'vertical' })}
              className="accent-indigo-600"
            />
            Vertical
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-neutral-500">Steps ({content.steps.length}/8)</label>
        <button onClick={addStep} className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
          <Plus size={10} /> Add Step
        </button>
      </div>
      <div className="space-y-2">
        {content.steps.map((step, i) => (
          <div key={i} className="border border-neutral-200 rounded-md p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-500">Step {i + 1}</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-[10px] text-neutral-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={step.highlight}
                    onChange={(e) => updateStep(i, { highlight: e.target.checked })}
                    className="accent-indigo-600"
                  />
                  Highlight
                </label>
                <button
                  onClick={() => removeStep(i)}
                  className="text-red-400 hover:text-red-600"
                  disabled={content.steps.length <= 2}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <input
              type="text"
              value={step.name}
              onChange={(e) => updateStep(i, { name: e.target.value })}
              className={inputClass}
              placeholder="Step name"
            />
            <input
              type="text"
              value={step.description}
              onChange={(e) => updateStep(i, { description: e.target.value })}
              className={inputClass}
              placeholder="Short description"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowEditor;
