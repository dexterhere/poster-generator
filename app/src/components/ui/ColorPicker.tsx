import React from 'react';
import { cn } from '../../lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  presets?: string[];
}

const DEFAULT_PRESETS = [
  '#0D7377', '#1A3A5C', '#1E6B35', '#2D3B55',
  '#6B1E2D', '#7C3AED', '#DC2626', '#EA580C',
  '#059669', '#0891B2', '#4F46E5', '#BE185D',
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  presets = DEFAULT_PRESETS,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
            style={{ background: 'transparent' }}
          />
          <div
            className="absolute inset-0 rounded-lg pointer-events-none border border-white/10"
            style={{ background: value }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="glass-input rounded-lg px-2 py-1.5 text-xs w-24 font-mono uppercase"
        />
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {presets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={cn(
              'w-full aspect-square rounded-md border-2 transition-all',
              value === color
                ? 'border-white scale-110'
                : 'border-transparent hover:border-white/30'
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
