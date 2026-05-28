import React from 'react';
import { X } from 'lucide-react';
import SectionEditor from '../editor/SectionEditor';
import { usePosterStore } from '../../store/usePosterStore';

interface RightInspectorProps {
  isVisible: boolean;
}

const RightInspector: React.FC<RightInspectorProps> = ({ isVisible }) => {
  const setSelectedSection = usePosterStore((s) => s.setSelectedSection);

  return (
    <aside
      className="relative z-30 h-full shrink-0 glass-panel border-l border-white/10 transition-[width,opacity] duration-200 ease-in-out print:hidden flex flex-col"
      style={{
        width: isVisible ? '300px' : '0px',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        overflow: 'hidden',
      }}
    >
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-sm font-semibold text-white/80" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Section Editor
        </span>
        <button
          onClick={() => setSelectedSection(null)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SectionEditor />
      </div>
    </aside>
  );
};

export default RightInspector;
