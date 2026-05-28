import React from 'react';
import { Layout, Layers, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePosterStore } from '../../store/usePosterStore';

const BottomStatusBar: React.FC = () => {
  const layout = usePosterStore((s) => s.layout);
  const sections = usePosterStore((s) => s.sections);
  const saveStatus = usePosterStore((s) => s.saveStatus);

  const statusConfig = {
    saved: { icon: <CheckCircle2 size={11} />, text: 'Auto-saved', color: 'text-emerald-400' },
    saving: { icon: <Loader2 size={11} className="animate-spin" />, text: 'Saving...', color: 'text-amber-400' },
    unsaved: { icon: <Save size={11} />, text: 'Unsaved changes', color: 'text-white/40' },
    error: { icon: <AlertCircle size={11} />, text: 'Save failed', color: 'text-red-400' },
  };

  const current = statusConfig[saveStatus];

  return (
    <div className="h-7 flex-shrink-0 glass-chrome border-t border-white/5 flex items-center px-3 gap-4 z-40 print:hidden select-none">
      <div className="flex items-center gap-1.5 text-white/30">
        <Layout size={11} />
        <span className="text-[10px] font-medium">{layout.name}</span>
      </div>

      <div className="w-px h-3 bg-white/10" />

      <div className="flex items-center gap-1.5 text-white/30">
        <Layers size={11} />
        <span className="text-[10px] font-medium">{sections.length} sections</span>
      </div>

      <div className="flex-1" />

      <div className={`flex items-center gap-1.5 ${current.color}`}>
        {current.icon}
        <span className="text-[10px] font-medium">{current.text}</span>
      </div>
    </div>
  );
};

export default BottomStatusBar;
