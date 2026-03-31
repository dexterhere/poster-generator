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

const ThemePanel: React.FC = () => {
  const { theme, footer, updateTheme, updateFooter } = usePosterStore();

  const inputClass = "w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all";
  const labelClass = "block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-2";

  return (
    <div className="p-4 space-y-6">
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
        <label className={labelClass}>Footer Text</label>
        <input
          type="text"
          value={footer.text}
          onChange={(e) => updateFooter({ text: e.target.value })}
          className={inputClass}
          placeholder="Name | ID | Institution | Year"
        />
      </div>
    </div>
  );
};

export default ThemePanel;
