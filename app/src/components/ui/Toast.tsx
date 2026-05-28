import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

const iconMap = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error: <AlertCircle size={16} className="text-red-400" />,
  warning: <AlertCircle size={16} className="text-amber-400" />,
  info: <Info size={16} className="text-blue-400" />,
};

const borderColorMap = {
  success: 'border-emerald-500/20',
  error: 'border-red-500/20',
  warning: 'border-amber-500/20',
  info: 'border-blue-500/20',
};

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration ?? 3000;

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onRemove(toast.id);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [toast.id, duration, onRemove]);

  return (
    <div
      className={cn(
        'glass-floating flex items-center gap-3 px-4 py-3 min-w-[280px] max-w-[400px]',
        'animate-in slide-in-from-right-4 fade-in duration-200',
        borderColorMap[toast.type]
      )}
    >
      {iconMap[toast.type]}
      <p className="text-sm text-white/90 flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white/40 hover:text-white/80 transition-colors"
      >
        <X size={14} />
      </button>
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-white/20 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default Toast;
