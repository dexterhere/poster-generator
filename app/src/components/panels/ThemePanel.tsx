import React from 'react';
import { usePosterStore } from '../../store/usePosterStore';

const THEMES = [
  { name: 'Teal', color: '#0D7377' },
  { name: 'Navy', color: '#1A3A5C' },
  { name: 'Forest', color: '#1E6B35' },
  { name: 'Slate', color: '#2D3B55' },
  { name: 'Burgundy', color: '#6B1E2D' },
  { name: 'Indigo', color: '#4338CA' },
];

const FONT_PAIRINGS = [
  { value: 'classic-academic', label: 'Classic Academic', description: 'Lora + IBM Plex Sans' },
  { value: 'modern', label: 'Modern', description: 'DM Serif + DM Sans' },
  { value: 'clean', label: 'Clean', description: 'Playfair + Source Sans' },
  { value: 'simple', label: 'Simple', description: 'Georgia + Arial' },
];

const BORDER_STYLES = [
  { value: 'thin', label: 'Thin Border' },
  { value: 'top-accent', label: 'Top Accent' },
  { value: 'shadow', label: 'Shadow Only' },
  { value: 'filled-header', label: 'Filled Header' },
] as const;

// Portrait dimensions (shortDim × longDim) in mm — 1px = 1mm in this system
const PAPER_SIZES = [
  { name: 'A0', shortDim: 841, longDim: 1189, description: '841 × 1189 mm' },
  { name: 'A1', shortDim: 594, longDim: 841, description: '594 × 841 mm' },
  { name: 'A2', shortDim: 420, longDim: 594, description: '420 × 594 mm' },
  { name: 'A3', shortDim: 297, longDim: 420, description: '297 × 420 mm' },
  { name: 'Letter', shortDim: 216, longDim: 279, description: '216 × 279 mm' },
  { name: 'Tabloid', shortDim: 279, longDim: 432, description: '279 × 432 mm' },
];

const ThemePanel: React.FC = () => {
  const { theme, footer, layout, updateTheme, updateFooter, updateLayout } = usePosterStore();

  const inputClass = "w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all";
  const labelClass = "block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-2";

  const isLandscape = layout.width > layout.height;
  const shortDim = Math.min(layout.width, layout.height);
  const longDim = Math.max(layout.width, layout.height);
  const currentPaper = PAPER_SIZES.find(s => s.shortDim === shortDim && s.longDim === longDim);
  const currentPaperName = currentPaper?.name ?? 'Custom';

  const handlePaperChange = (paperName: string) => {
    const paper = PAPER_SIZES.find(p => p.name === paperName);
    if (!paper) return;
    const w = isLandscape ? paper.longDim : paper.shortDim;
    const h = isLandscape ? paper.shortDim : paper.longDim;
    updateLayout({ width: w, height: h, name: `${paperName} ${isLandscape ? 'Landscape' : 'Portrait'}` });
  };

  const handleOrientationChange = (landscape: boolean) => {
    if (landscape === isLandscape) return;
    updateLayout({
      width: landscape ? longDim : shortDim,
      height: landscape ? shortDim : longDim,
      name: `${currentPaperName} ${landscape ? 'Landscape' : 'Portrait'}`,
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Paper Size */}
      <div>
        <label className={labelClass}>Paper Size</label>

        {/* Size grid */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {PAPER_SIZES.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePaperChange(p.name)}
              title={p.description}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border-2 transition-all ${
                currentPaperName === p.name
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
              }`}
            >
              <span className="text-sm font-bold leading-none">{p.name}</span>
              <span className="text-[9px] text-neutral-400 mt-0.5 leading-none">{p.description.split(' × ')[0]}×{p.description.split(' × ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Orientation toggle */}
        <div>
          <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Orientation</label>
          <div className="flex rounded-lg overflow-hidden border border-neutral-200">
            <button
              onClick={() => handleOrientationChange(false)}
              className={`flex-1 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                !isLandscape ? 'bg-indigo-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span className="inline-block border border-current rounded-sm w-3 h-4" />
              Portrait
            </button>
            <button
              onClick={() => handleOrientationChange(true)}
              className={`flex-1 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border-l border-neutral-200 ${
                isLandscape ? 'bg-indigo-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span className="inline-block border border-current rounded-sm w-4 h-3" />
              Landscape
            </button>
          </div>
        </div>

        {/* Current dimensions display */}
        <p className="text-[10px] text-neutral-400 mt-2 text-center">
          {layout.width} × {layout.height} mm — {layout.name}
        </p>

        {/* Custom size inputs */}
        <details className="mt-2">
          <summary className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest cursor-pointer hover:text-neutral-700">
            Custom Size
          </summary>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1">
              <label className="text-[9px] text-neutral-400 font-bold uppercase">Width (mm)</label>
              <input
                type="number"
                value={layout.width || ''}
                onChange={(e) => updateLayout({ width: parseInt(e.target.value) || 0, name: 'Custom' })}
                className={inputClass}
              />
            </div>
            <div className="flex-1 text-center text-neutral-400 text-xs mt-4">×</div>
            <div className="flex-1">
              <label className="text-[9px] text-neutral-400 font-bold uppercase">Height (mm)</label>
              <input
                type="number"
                value={layout.height || ''}
                onChange={(e) => updateLayout({ height: parseInt(e.target.value) || 0, name: 'Custom' })}
                className={inputClass}
              />
            </div>
          </div>
        </details>
      </div>

      {/* Color Themes */}
      <div>
        <label className={labelClass}>Colour Theme</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {THEMES.map((t) => (
            <button
              key={t.color}
              onClick={() => updateTheme({ primaryColor: t.color })}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg border-2 transition-all ${
                theme.primaryColor === t.color
                  ? 'border-neutral-800 shadow-sm scale-105'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-[10px] font-medium text-neutral-700 truncate">{t.name}</span>
            </button>
          ))}
        </div>
        {/* Custom color */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => updateTheme({ primaryColor: e.target.value })}
            className="w-9 h-9 rounded border border-neutral-200 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={theme.primaryColor}
            onChange={(e) => {
              if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) updateTheme({ primaryColor: e.target.value });
            }}
            className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="#0D7377"
          />
        </div>
      </div>

      {/* Font Pairings */}
      <div>
        <label className={labelClass}>Font Pairing</label>
        <div className="space-y-2">
          {FONT_PAIRINGS.map((f) => (
            <button
              key={f.value}
              onClick={() => updateTheme({ fontPairing: f.value })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                theme.fontPairing === f.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <span className="text-sm font-medium text-neutral-800">{f.label}</span>
              <span className="text-[10px] text-neutral-400">{f.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Border Style */}
      <div>
        <label className={labelClass}>Section Card Style</label>
        <div className="grid grid-cols-2 gap-2">
          {BORDER_STYLES.map((b) => (
            <button
              key={b.value}
              onClick={() => updateTheme({ borderStyle: b.value })}
              className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                theme.borderStyle === b.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer text */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Footer Text</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[10px] text-neutral-500 font-medium">{theme.footerEnabled ? 'Enabled' : 'Disabled'}</span>
            <input
              type="checkbox"
              checked={theme.footerEnabled}
              onChange={(e) => updateTheme({ footerEnabled: e.target.checked })}
              className="accent-indigo-600"
            />
          </label>
        </div>
        <input
          type="text"
          value={footer.text}
          onChange={(e) => updateFooter({ text: e.target.value })}
          disabled={!theme.footerEnabled}
          className={`${inputClass} ${!theme.footerEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder="Name | ID | Institution | Year"
        />
      </div>

      {/* Ruler Toggle */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Show Ruler</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[10px] text-neutral-500 font-medium">{theme.rulerEnabled ? 'Enabled' : 'Disabled'}</span>
            <input
              type="checkbox"
              checked={theme.rulerEnabled}
              onChange={(e) => updateTheme({ rulerEnabled: e.target.checked })}
              className="accent-indigo-600"
            />
          </label>
        </div>
        <p className="text-[10px] text-neutral-400 mt-1">Display ruler guides around the poster canvas</p>
      </div>
    </div>
  );
};

export default ThemePanel;
