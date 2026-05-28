import React from 'react';
import { usePosterStore, FONT_PAIRINGS } from '../../store/usePosterStore';
import ColorPicker from '../ui/ColorPicker';

const THEMES = [
  { name: 'Teal', color: '#0D7377' },
  { name: 'Navy', color: '#1A3A5C' },
  { name: 'Forest', color: '#1E6B35' },
  { name: 'Slate', color: '#2D3B55' },
  { name: 'Burgundy', color: '#6B1E2D' },
  { name: 'Indigo', color: '#4338CA' },
  { name: 'Violet', color: '#7C3AED' },
  { name: 'Crimson', color: '#DC2626' },
  { name: 'Orange', color: '#EA580C' },
  { name: 'Cyan', color: '#0891B2' },
];

const BORDER_STYLES = [
  { value: 'thin' as const, label: 'Thin Border' },
  { value: 'top-accent' as const, label: 'Top Accent' },
  { value: 'shadow' as const, label: 'Shadow Only' },
  { value: 'filled-header' as const, label: 'Filled Header' },
];

const PAPER_SIZES = [
  { name: 'A0', shortDim: 841, longDim: 1189, description: '841 x 1189 mm' },
  { name: 'A1', shortDim: 594, longDim: 841, description: '594 x 841 mm' },
  { name: 'A2', shortDim: 420, longDim: 594, description: '420 x 594 mm' },
  { name: 'A3', shortDim: 297, longDim: 420, description: '297 x 420 mm' },
  { name: 'Letter', shortDim: 216, longDim: 279, description: '216 x 279 mm' },
  { name: 'Tabloid', shortDim: 279, longDim: 432, description: '279 x 432 mm' },
];

const ThemePanel: React.FC = () => {
  const { theme, footer, layout, updateTheme, updateFooter, updateLayout } = usePosterStore();

  const labelClass = "block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2";

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
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {PAPER_SIZES.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePaperChange(p.name)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all ${
                currentPaperName === p.name
                  ? 'border-indigo-400/50 bg-indigo-500/15 text-indigo-300'
                  : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <span className="text-sm font-bold leading-none">{p.name}</span>
              <span className="text-[9px] text-white/30 mt-0.5 leading-none">{p.description.split(' x ')[0]}x{p.description.split(' x ')[1]}</span>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-[9px] font-semibold text-white/30 uppercase tracking-widest mb-1">Orientation</label>
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              onClick={() => handleOrientationChange(false)}
              className={`flex-1 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                !isLandscape ? 'bg-indigo-500/20 text-indigo-300 border-r border-white/10' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <span className="inline-block border border-current rounded-sm w-3 h-4" />
              Portrait
            </button>
            <button
              onClick={() => handleOrientationChange(true)}
              className={`flex-1 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                isLandscape ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <span className="inline-block border border-current rounded-sm w-4 h-3" />
              Landscape
            </button>
          </div>
        </div>

        <p className="text-[10px] text-white/30 mt-2 text-center">
          {layout.width} x {layout.height} mm — {layout.name}
        </p>
      </div>

      {/* Color Themes */}
      <div>
        <label className={labelClass}>Primary Color</label>
        <ColorPicker
          value={theme.primaryColor}
          onChange={(color) => updateTheme({ primaryColor: color })}
          presets={THEMES.map((t) => t.color)}
        />
      </div>

      {/* Font Pairings */}
      <div>
        <label className={labelClass}>Font Pairing</label>
        <div className="space-y-1.5">
          {FONT_PAIRINGS.map((f) => (
            <button
              key={f.id}
              onClick={() => updateTheme({ fontPairing: f.id })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                theme.fontPairing === f.id
                  ? 'border-indigo-400/40 bg-indigo-500/10'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <span className="text-sm font-medium text-white/80">{f.name}</span>
              <span className="text-[10px] text-white/30">{f.display} + {f.body}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Border Style */}
      <div>
        <label className={labelClass}>Default Section Style</label>
        <div className="grid grid-cols-2 gap-2">
          {BORDER_STYLES.map((b) => (
            <button
              key={b.value}
              onClick={() => updateTheme({ borderStyle: b.value })}
              className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                theme.borderStyle === b.value
                  ? 'border-indigo-400/40 bg-indigo-500/10 text-indigo-300'
                  : 'border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Toggles */}
      <div className="space-y-3">
        <label className={labelClass}>Canvas Guides</label>
        {[
          { key: 'rulerEnabled' as const, label: 'Show Ruler', desc: 'Display ruler guides around the poster' },
          { key: 'safeAreaEnabled' as const, label: 'Safe Area', desc: '10mm safe content margin guide' },
          { key: 'bleedAreaEnabled' as const, label: 'Bleed Area', desc: '5mm bleed guide for professional printing' },
          { key: 'gridOverlayEnabled' as const, label: 'Grid Overlay', desc: 'Show alignment grid on canvas' },
          { key: 'snapToGrid' as const, label: 'Snap to Grid', desc: 'Move and resize sections by grid increments' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-white/70">{item.label}</span>
              <p className="text-[10px] text-white/30">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!theme[item.key]}
                onChange={(e) => updateTheme({ [item.key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500/60" />
            </label>
          </div>
        ))}
        <div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-20 shrink-0">Grid Size</span>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={theme.gridSize ?? 20}
              onChange={(e) => updateTheme({ gridSize: parseInt(e.target.value, 10) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-12 text-right tabular-nums">
              {theme.gridSize ?? 20}mm
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass}>Footer Text</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={theme.footerEnabled}
              onChange={(e) => updateTheme({ footerEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500/60" />
          </label>
        </div>
        <input
          type="text"
          value={footer.text}
          onChange={(e) => updateFooter({ text: e.target.value })}
          disabled={!theme.footerEnabled}
          className={`glass-input w-full rounded-lg px-3 py-2 text-xs ${!theme.footerEnabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          placeholder="Name | ID | Institution | Year"
        />
      </div>
    </div>
  );
};

export default ThemePanel;
