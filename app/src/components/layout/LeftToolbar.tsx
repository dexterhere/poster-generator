import React from 'react';
import { Type, Layout, Palette, Download } from 'lucide-react';

type PanelId = 'header' | 'sections' | 'theme' | 'export';

interface LeftToolbarProps {
  activePanel: PanelId | null;
  onPanelToggle: (panel: PanelId) => void;
}

const TOOLS: { id: PanelId; icon: React.ReactNode; label: string }[] = [
  { id: 'header',   icon: <Type size={18} />,     label: 'Header' },
  { id: 'sections', icon: <Layout size={18} />,   label: 'Sections' },
  { id: 'theme',    icon: <Palette size={18} />,  label: 'Theme' },
  { id: 'export',   icon: <Download size={18} />, label: 'Export' },
];

const LeftToolbar: React.FC<LeftToolbarProps> = ({ activePanel, onPanelToggle }) => {
  return (
    <div className="w-[56px] flex-shrink-0 glass-toolbar flex flex-col items-center py-3 gap-1 z-30 print:hidden">
      {TOOLS.map((tool) => {
        const isActive = activePanel === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => onPanelToggle(tool.id)}
            title={tool.label}
            className={`w-11 h-11 flex flex-col items-center justify-center rounded-xl gap-0.5 transition-all ${
              isActive
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-white/30 hover:text-white/70 hover:bg-white/5 border border-transparent'
            }`}
          >
            {tool.icon}
            <span className="text-[8px] font-medium leading-none">{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LeftToolbar;
