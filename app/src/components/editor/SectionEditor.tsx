import React from 'react';
import { usePosterStore, defaultContentForType, type SectionType, type SectionStyle } from '../../store/usePosterStore';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
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

const CONTAINER_STYLES = [
  { value: 'default',     label: 'Default' },
  { value: 'card',        label: 'Card' },
  { value: 'outline',     label: 'Outline' },
  { value: 'none',        label: 'None' },
  { value: 'accent-top',  label: 'Accent' },
  { value: 'accent-left', label: 'Left' },
  { value: 'filled',      label: 'Filled' },
  { value: 'minimal',     label: 'Minimal' },
  { value: 'glass',       label: 'Glass' },
  { value: 'elevated',    label: 'Elevated' },
  { value: 'soft-fill',   label: 'Soft' },
  { value: 'bordered-pill', label: 'Pill' },
  { value: 'ghost',       label: 'Ghost' },
] as const;

const labelClass = 'block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5';
const inputClass = 'glass-input w-full rounded-lg px-3 py-2 text-sm';
const titleFontOptions = [
  { value: 'display', label: 'Display' },
  { value: 'body', label: 'Body' },
  { value: 'serif', label: 'Serif' },
  { value: 'sans', label: 'Sans' },
  { value: 'mono', label: 'Mono' },
  { value: 'condensed', label: 'Condensed' },
] as const;

const titleWeightOptions = [
  { value: 'normal', label: 'Regular' },
  { value: 'semibold', label: 'Semibold' },
  { value: 'bold', label: 'Bold' },
  { value: 'black', label: 'Black' },
] as const;

const TABLE_VARIANTS = [
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'zebra', label: 'Zebra' },
  { value: 'ruled', label: 'Ruled' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'matrix', label: 'Matrix' },
] as const;

const SectionEditor: React.FC = () => {
  const {
    selectedSectionId,
    sections,
    updateSection,
    updateSectionContent,
    deleteSection,
    theme,
  } = usePosterStore();
  const section = sections.find((s) => s.id === selectedSectionId);
  if (!section) return null;

  const style: SectionStyle = section.style ?? {};

  const setStyle = (patch: Partial<SectionStyle>) =>
    updateSection(section.id, { style: { ...style, ...patch } });

  const handleTypeChange = (newType: SectionType) => {
    updateSection(section.id, { type: newType, content: defaultContentForType(newType) });
  };

  const fontSize  = style.fontSize  ?? 9;
  const titleFontSize = style.titleFontSize ?? 10;
  const titlePaddingX = style.titlePaddingX ?? 12;
  const titlePaddingY = style.titlePaddingY ?? 6;
  const titleFontFamily = style.titleFontFamily ?? 'display';
  const titleFontWeight = style.titleFontWeight ?? 'bold';
  const titleFontStyle = style.titleFontStyle ?? 'normal';
  const titleLetterSpacing = style.titleLetterSpacing ?? 0.25;
  const titleTransform = style.titleTransform ?? 'uppercase';
  const titleAlign = style.titleAlign ?? 'left';
  const lineH     = style.lineHeight ?? 1.4;
  const align     = style.textAlign  ?? 'left';
  const borderRadius = style.borderRadius ?? 12;
  const letterSpacing = style.letterSpacing ?? 0;
  const textTransform = style.textTransform ?? 'none';
  const tableHeaderBgColor = style.tableHeaderBgColor ?? theme.primaryColor;
  const tableHeaderTextColor = style.tableHeaderTextColor ?? '#ffffff';
  const tableCellTextColor = style.tableCellTextColor ?? '#374151';
  const tableHeaderFontSize = style.tableHeaderFontSize ?? 8;
  const tableCellFontSize = style.tableCellFontSize ?? fontSize;
  const tableVariant = style.tableVariant ?? 'classic';
  const tableDensity = style.tableDensity ?? 'cozy';
  const tableBorderStyle = style.tableBorderStyle ?? 'grid';
  const tableHeaderCase = style.tableHeaderCase ?? 'none';
  const tableStriped = style.tableStriped ?? tableVariant === 'zebra';
  const isBold    = style.fontWeight === 'bold';
  const isItalic  = style.fontStyle  === 'italic';

  const cardBg = "p-3 rounded-xl border border-white/10 bg-white/[0.03] space-y-2";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Title & Card Quick Controls */}
        <div className={cardBg}>
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Title & Card</p>
          <label className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 cursor-pointer">
            <span className="text-[11px] text-white/70 font-semibold">Lock section position</span>
            <input
              type="checkbox"
              checked={section.locked ?? false}
              onChange={(e) => updateSection(section.id, { locked: e.target.checked })}
              className="accent-indigo-500 w-3.5 h-3.5"
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-20 flex-shrink-0">Title Size</span>
            <input
              type="range" min="8" max="24" step="1"
              value={titleFontSize}
              onChange={(e) => setStyle({ titleFontSize: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{titleFontSize}px</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-20 flex-shrink-0">Title X Pad</span>
            <input
              type="range" min="0" max="40" step="2"
              value={titlePaddingX}
              onChange={(e) => setStyle({ titlePaddingX: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{titlePaddingX}px</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-20 flex-shrink-0">Title Y Pad</span>
            <input
              type="range" min="0" max="24" step="1"
              value={titlePaddingY}
              onChange={(e) => setStyle({ titlePaddingY: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{titlePaddingY}px</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-20 flex-shrink-0">Title Align</span>
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                title={`Title align ${a}`}
                onClick={() => setStyle({ titleAlign: a })}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${titleAlign === a ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:bg-white/5'}`}
              >
                {a === 'left'   && <AlignLeft size={12} />}
                {a === 'center' && <AlignCenter size={12} />}
                {a === 'right'  && <AlignRight size={12} />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-20 flex-shrink-0">Title Font</span>
            <select
              value={titleFontFamily}
              onChange={(e) => setStyle({ titleFontFamily: e.target.value as SectionStyle['titleFontFamily'] })}
              className="glass-input flex-1 rounded-lg px-2 py-1.5 text-xs"
            >
              {titleFontOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={titleFontWeight}
              onChange={(e) => setStyle({ titleFontWeight: e.target.value as SectionStyle['titleFontWeight'] })}
              className="glass-input rounded-lg px-2 py-1.5 text-xs"
              title="Title weight"
            >
              {titleWeightOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setStyle({ titleFontStyle: titleFontStyle === 'italic' ? 'normal' : 'italic' })}
              className={`rounded-lg border px-2 py-1.5 text-xs font-semibold italic transition-all ${
                titleFontStyle === 'italic'
                  ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-300'
                  : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'
              }`}
              title="Toggle title italic"
            >
              Italic
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-20 flex-shrink-0">Title Track</span>
            <input
              type="range" min="0" max="3" step="0.25"
              value={titleLetterSpacing}
              onChange={(e) => setStyle({ titleLetterSpacing: parseFloat(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{titleLetterSpacing}px</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-20 flex-shrink-0">Title Case</span>
            <select
              value={titleTransform}
              onChange={(e) => setStyle({ titleTransform: e.target.value as SectionStyle['titleTransform'] })}
              className="glass-input flex-1 rounded-lg px-2 py-1.5 text-xs"
            >
              <option value="uppercase">Uppercase</option>
              <option value="capitalize">Capitalize</option>
              <option value="none">Original</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-20 flex-shrink-0">Radius</span>
            <input
              type="range" min="0" max="32" step="1"
              value={borderRadius}
              onChange={(e) => setStyle({ borderRadius: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{borderRadius}px</span>
          </div>
        </div>

        {section.type === 'table' && (
          <div>
            <label className={labelClass}>Table Style</label>
            <div className={cardBg}>
              <div className="grid grid-cols-2 gap-1">
                {TABLE_VARIANTS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStyle({ tableVariant: opt.value })}
                    className={`text-[9px] py-1.5 px-1 rounded-lg border font-medium transition-all ${
                      tableVariant === opt.value
                        ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-300'
                        : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['compact', 'cozy', 'roomy'] as const).map((density) => (
                  <button
                    key={density}
                    onClick={() => setStyle({ tableDensity: density })}
                    className={`text-[9px] py-1.5 px-1 rounded-lg border font-medium capitalize transition-all ${
                      tableDensity === density
                        ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-300'
                        : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['none', 'subtle', 'grid'] as const).map((border) => (
                  <button
                    key={border}
                    onClick={() => setStyle({ tableBorderStyle: border })}
                    className={`text-[9px] py-1.5 px-1 rounded-lg border font-medium capitalize transition-all ${
                      tableBorderStyle === border
                        ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-300'
                        : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {border}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tableStriped}
                    onChange={(e) => setStyle({ tableStriped: e.target.checked })}
                    className="accent-indigo-500 w-3.5 h-3.5"
                  />
                  <span className="text-[10px] text-white/60 font-semibold">Striped rows</span>
                </label>
                <select
                  value={tableHeaderCase}
                  onChange={(e) => setStyle({ tableHeaderCase: e.target.value as SectionStyle['tableHeaderCase'] })}
                  className="glass-input rounded-lg px-2 py-1.5 text-[10px]"
                >
                  <option value="none">Header case</option>
                  <option value="uppercase">Uppercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/60 font-semibold">Header Background</span>
                <input
                  type="color"
                  value={tableHeaderBgColor}
                  onChange={(e) => setStyle({ tableHeaderBgColor: e.target.value })}
                  className="h-7 w-10 rounded border-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/60 font-semibold">Header Text</span>
                <input
                  type="color"
                  value={tableHeaderTextColor}
                  onChange={(e) => setStyle({ tableHeaderTextColor: e.target.value })}
                  className="h-7 w-10 rounded border-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/60 font-semibold">Column Values</span>
                <input
                  type="color"
                  value={tableCellTextColor}
                  onChange={(e) => setStyle({ tableCellTextColor: e.target.value })}
                  className="h-7 w-10 rounded border-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-semibold text-white/30 uppercase w-24 flex-shrink-0">Header Size</span>
                <input
                  type="range" min="7" max="16" step="1"
                  value={tableHeaderFontSize}
                  onChange={(e) => setStyle({ tableHeaderFontSize: parseInt(e.target.value) })}
                  className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
                />
                <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{tableHeaderFontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-semibold text-white/30 uppercase w-24 flex-shrink-0">Value Size</span>
                <input
                  type="range" min="7" max="16" step="1"
                  value={tableCellFontSize}
                  onChange={(e) => setStyle({ tableCellFontSize: parseInt(e.target.value) })}
                  className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
                />
                <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{tableCellFontSize}px</span>
              </div>
            </div>
          </div>
        )}

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

        {/* Text Formatting */}
        <div>
          <label className={labelClass}>Text Formatting</label>

          <div className="flex items-center gap-1.5 mb-2">
            <button
              title="Bold"
              onClick={() => setStyle({ fontWeight: isBold ? 'normal' : 'bold' })}
              className={`w-8 h-8 rounded-lg border font-bold text-sm transition-all ${isBold ? 'border-indigo-400/40 bg-indigo-500/20 text-indigo-300' : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'}`}
            >B</button>
            <button
              title="Italic"
              onClick={() => setStyle({ fontStyle: isItalic ? 'normal' : 'italic' })}
              className={`w-8 h-8 rounded-lg border italic text-sm transition-all ${isItalic ? 'border-indigo-400/40 bg-indigo-500/20 text-indigo-300' : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'}`}
            >I</button>
            <div className="h-5 w-px bg-white/10 mx-1" />
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                title={`Align ${a}`}
                onClick={() => setStyle({ textAlign: a })}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${align === a ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:bg-white/5'}`}
              >
                {a === 'left'   && <AlignLeft  size={12} />}
                {a === 'center' && <AlignCenter size={12} />}
                {a === 'right'  && <AlignRight  size={12} />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-14 flex-shrink-0">Font Size</span>
            <input
              type="range" min="7" max="32" step="1"
              value={fontSize}
              onChange={(e) => setStyle({ fontSize: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{fontSize}px</span>
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-14 flex-shrink-0">Spacing</span>
            <input
              type="range" min="10" max="25" step="1"
              value={Math.round(lineH * 10)}
              onChange={(e) => setStyle({ lineHeight: parseInt(e.target.value) / 10 })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{lineH.toFixed(1)}x</span>
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-14 flex-shrink-0">Tracking</span>
            <input
              type="range" min="-10" max="40" step="1"
              value={letterSpacing}
              onChange={(e) => setStyle({ letterSpacing: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{letterSpacing}px</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-14 flex-shrink-0">Transform</span>
            <select
              value={textTransform}
              onChange={(e) => setStyle({ textTransform: e.target.value as SectionStyle['textTransform'] })}
              className="glass-input flex-1 rounded-lg px-2 py-1 text-xs"
            >
              <option value="none">None</option>
              <option value="uppercase">Uppercase</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </div>
        </div>

        {/* Container Style */}
        <div>
          <label className={labelClass}>Container Style</label>
          <div className="grid grid-cols-4 gap-1 mb-2">
            {CONTAINER_STYLES.map((opt) => {
              const active = (style.containerStyle ?? 'default') === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setStyle({ containerStyle: opt.value })}
                  className={`text-[9px] py-1.5 px-1 rounded-lg border font-medium transition-all ${
                    active
                      ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-300'
                      : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'
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
              className="accent-indigo-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] text-white/60 font-medium">Hide title bar (more content space)</span>
          </label>
        </div>

        {/* Layout */}
        <div>
          <label className={labelClass}>Layout</label>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-14 flex-shrink-0">Padding</span>
            <input
              type="range" min="0" max="48" step="4"
              value={style.padding ?? 16}
              onChange={(e) => setStyle({ padding: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-9 text-right tabular-nums">{style.padding ?? 16}px</span>
          </div>

          <div className="mt-2">
            <p className="text-[9px] font-semibold text-white/30 uppercase mb-1.5">Quick Size</p>
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
                  className="text-[10px] py-1 px-1.5 rounded-lg border border-white/10 text-white/50 hover:border-indigo-400/30 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content editor */}
        <div className="border-t border-white/10 pt-4">
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
      <div className="shrink-0 p-4 border-t border-white/10">
        <button
          onClick={() => deleteSection(section.id)}
          className="w-full py-2 text-sm font-medium text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
        >
          Delete Section
        </button>
      </div>
    </div>
  );
};

export default SectionEditor;
