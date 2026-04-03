import React from 'react';
import { usePosterStore, defaultContentForType, type SectionType, type SectionStyle } from '../../store/usePosterStore';
import { X, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import TextEditor from './TextEditor';
import TableEditor from './TableEditor';
import FlowEditor from './FlowEditor';
import ImageEditor from './ImageEditor';
import ListEditor from './ListEditor';
import StatsEditor from './StatsEditor';
import QuestionEditor from './QuestionEditor';

const SECTION_TYPES: { value: SectionType; label: string }[] = [
  { value: 'text',        label: 'Text' },
  { value: 'table',       label: 'Table' },
  { value: 'flow',        label: 'Steps / Flow' },
  { value: 'image',       label: 'Image / Diagram' },
  { value: 'split-image', label: 'Split Image (2-panel)' },
  { value: 'list',        label: 'List' },
  { value: 'stats',       label: 'Stats / Metrics' },
  { value: 'question',    label: 'Research Question' },
];

const labelClass = 'block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5';
const inputClass = 'w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all';

const SectionEditor: React.FC = () => {
  const { selectedSectionId, sections, updateSection, updateSectionContent, deleteSection, setSelectedSection } = usePosterStore();
  const section = sections.find((s) => s.id === selectedSectionId);
  if (!section) return null;

  const style: SectionStyle = section.style ?? {};

  const setStyle = (patch: Partial<SectionStyle>) =>
    updateSection(section.id, { style: { ...style, ...patch } });

  const handleTypeChange = (newType: SectionType) => {
    updateSection(section.id, { type: newType, content: defaultContentForType(newType) });
  };

  const fontSize  = style.fontSize  ?? 11;
  const lineH     = style.lineHeight ?? 1.4;
  const align     = style.textAlign  ?? 'left';
  const isBold    = style.fontWeight === 'bold';
  const isItalic  = style.fontStyle  === 'italic';

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 shrink-0">
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Editing Section</p>
          <p className="font-semibold text-neutral-800 text-sm truncate max-w-[200px]">{section.title}</p>
        </div>
        <button
          onClick={() => setSelectedSection(null)}
          className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Title */}
        <div>
          <label className={labelClass}>Section Title</label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => updateSection(section.id, { title: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Type */}
        <div>
          <label className={labelClass}>Section Type</label>
          <select
            value={section.type}
            onChange={(e) => handleTypeChange(e.target.value as SectionType)}
            className={inputClass}
          >
            {SECTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* ─── Text Formatting ─── */}
        <div>
          <label className={labelClass}>Text Formatting</label>

          {/* Bold / Italic / Alignment */}
          <div className="flex items-center gap-1.5 mb-2">
            <button
              title="Bold"
              onClick={() => setStyle({ fontWeight: isBold ? 'normal' : 'bold' })}
              className={`w-8 h-8 rounded border-2 font-bold text-sm transition-all ${isBold ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
            >B</button>
            <button
              title="Italic"
              onClick={() => setStyle({ fontStyle: isItalic ? 'normal' : 'italic' })}
              className={`w-8 h-8 rounded border-2 italic text-sm transition-all ${isItalic ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
            >I</button>
            <div className="h-5 w-px bg-neutral-200 mx-1" />
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                title={`Align ${a}`}
                onClick={() => setStyle({ textAlign: a })}
                className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${align === a ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'}`}
              >
                {a === 'left'   && <AlignLeft  size={12} />}
                {a === 'center' && <AlignCenter size={12} />}
                {a === 'right'  && <AlignRight  size={12} />}
              </button>
            ))}
          </div>

          {/* Font size */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-bold text-neutral-400 uppercase w-14 flex-shrink-0">Font Size</span>
            <input
              type="range" min="7" max="32" step="1"
              value={fontSize}
              onChange={(e) => setStyle({ fontSize: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-600 h-1.5"
            />
            <span className="text-xs text-neutral-700 font-semibold w-9 text-right tabular-nums">{fontSize}px</span>
          </div>

          {/* Line height */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-neutral-400 uppercase w-14 flex-shrink-0">Spacing</span>
            <input
              type="range" min="10" max="25" step="1"
              value={Math.round(lineH * 10)}
              onChange={(e) => setStyle({ lineHeight: parseInt(e.target.value) / 10 })}
              className="flex-1 accent-indigo-600 h-1.5"
            />
            <span className="text-xs text-neutral-700 font-semibold w-9 text-right tabular-nums">{lineH.toFixed(1)}×</span>
          </div>
        </div>

        {/* ─── Container Style ─── */}
        <div>
          <label className={labelClass}>Container Style</label>
          <div className="grid grid-cols-4 gap-1 mb-2">
            {([
              { value: 'default',    label: 'Default' },
              { value: 'card',       label: 'Card' },
              { value: 'outline',    label: 'Outline' },
              { value: 'none',       label: 'None' },
              { value: 'accent-top', label: 'Accent' },
              { value: 'filled',     label: 'Filled' },
              { value: 'minimal',    label: 'Minimal' },
            ] as const).map((opt) => {
              const active = (style.containerStyle ?? 'default') === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setStyle({ containerStyle: opt.value })}
                  className={`text-[9px] py-1.5 px-1 rounded border-2 font-medium transition-all ${
                    active
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-neutral-200 text-neutral-600 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={style.hideTitle ?? false}
              onChange={(e) => setStyle({ hideTitle: e.target.checked })}
              className="accent-indigo-600 w-3.5 h-3.5"
            />
            <span className="text-[11px] text-neutral-600 font-medium">Hide title bar (more content space)</span>
          </label>
        </div>

        {/* ─── Layout ─── */}
        <div>
          <label className={labelClass}>Layout</label>

          {/* Padding */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-bold text-neutral-400 uppercase w-14 flex-shrink-0">Padding</span>
            <input
              type="range" min="0" max="48" step="4"
              value={style.padding ?? 16}
              onChange={(e) => setStyle({ padding: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-600 h-1.5"
            />
            <span className="text-xs text-neutral-700 font-semibold w-9 text-right tabular-nums">{style.padding ?? 16}px</span>
          </div>

          {/* Quick size presets */}
          <div className="mt-2">
            <p className="text-[9px] font-bold text-neutral-400 uppercase mb-1.5">Quick Size</p>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: 'Compact',  w: 180, h: 120 },
                { label: 'Small',    w: 240, h: 160 },
                { label: 'Medium',   w: 300, h: 200 },
                { label: 'Wide',     w: 400, h: 160 },
                { label: 'Tall',     w: 240, h: 300 },
                { label: 'Large',    w: 400, h: 280 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() =>
                    updateSection(section.id, {
                      position: { ...section.position!, width: preset.w, height: preset.h },
                    })
                  }
                  className="text-[10px] py-1 px-1.5 rounded border border-neutral-200 text-neutral-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Content editor ─── */}
        <div className="border-t border-neutral-100 pt-4">
          <label className={labelClass}>Content</label>
          {section.type === 'text'        && <TextEditor     section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />}
          {section.type === 'table'       && <TableEditor    section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />}
          {section.type === 'flow'        && <FlowEditor     section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />}
          {(section.type === 'image' || section.type === 'split-image') && <ImageEditor section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />}
          {section.type === 'list'        && <ListEditor     section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />}
          {section.type === 'stats'       && <StatsEditor    section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />}
          {section.type === 'question'    && <QuestionEditor section={section} onUpdate={(c) => updateSectionContent(section.id, c)} />}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 p-4 border-t border-neutral-100">
        <button
          onClick={() => deleteSection(section.id)}
          className="w-full py-2 text-sm font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
        >
          Delete Section
        </button>
      </div>
    </div>
  );
};

export default SectionEditor;
