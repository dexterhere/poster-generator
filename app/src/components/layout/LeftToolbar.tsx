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
    <div className="w-14 flex-shrink-0 bg-white border-r border-neutral-200 flex flex-col items-center py-3 gap-1 z-30 print:hidden">
      {TOOLS.map((tool) => {
        const isActive = activePanel === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => onPanelToggle(tool.id)}
            title={tool.label}
            className={`w-10 h-10 flex flex-col items-center justify-center rounded-xl gap-0.5 transition-all ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
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
