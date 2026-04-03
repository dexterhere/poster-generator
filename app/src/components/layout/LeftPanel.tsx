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
}

const PANEL_LABELS: Record<PanelId, string> = {
  header:   'Header',
  sections: 'Sections',
  theme:    'Theme & Layout',
  export:   'Export',
};

const LeftPanel: React.FC<LeftPanelProps> = ({ activePanel, onClose }) => {
  const isOpen = activePanel !== null;

  return (
    <div
      className={`absolute left-0 top-0 bottom-0 z-30 flex flex-col bg-white border-r border-neutral-200 shadow-xl transition-transform duration-200 ease-in-out print:hidden`}
      style={{
        width: '300px',
        transform: isOpen ? 'translateX(0)' : 'translateX(-300px)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* Panel header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50">
        <span className="text-sm font-semibold text-neutral-700">
          {activePanel ? PANEL_LABELS[activePanel] : ''}
        </span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X size={13} />
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
