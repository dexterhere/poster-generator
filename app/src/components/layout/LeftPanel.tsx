import React from 'react';
import { X } from 'lucide-react';
import HeaderPanel from '../panels/HeaderPanel';
import SectionsListPanel from '../panels/SectionsListPanel';
import ThemePanel from '../panels/ThemePanel';
import ExportPanel from '../panels/ExportPanel';

type PanelId = 'header' | 'sections' | 'theme' | 'export';

interface LeftPanelProps {
  activePanel: PanelId | null;
  onClose: () => void;
  offsetLeft?: number;
}

const PANEL_LABELS: Record<PanelId, string> = {
  header:   'Header',
  sections: 'Sections',
  theme:    'Theme & Layout',
  export:   'Save & Export',
};

const LeftPanel: React.FC<LeftPanelProps> = ({ activePanel, onClose, offsetLeft = 0 }) => {
  const isOpen = activePanel !== null;

  return (
    <div
      className="absolute left-0 top-0 bottom-0 z-30 flex flex-col glass-panel border-r border-white/10 transition-transform duration-200 ease-in-out print:hidden"
      style={{
        width: '300px',
        left: `${offsetLeft}px`,
        transform: isOpen ? 'translateX(0)' : 'translateX(-300px)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* Panel header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-sm font-semibold text-white/80" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {activePanel ? PANEL_LABELS[activePanel] : ''}
        </span>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto">
        {activePanel === 'header'   && <HeaderPanel />}
        {activePanel === 'sections' && <SectionsListPanel />}
        {activePanel === 'theme'    && <ThemePanel />}
        {activePanel === 'export'   && <ExportPanel />}
      </div>
    </div>
  );
};

export default LeftPanel;
