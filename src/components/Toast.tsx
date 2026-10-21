import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-emerald-500/40 bg-slate-900/95',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          title: 'text-emerald-400',
        };
      case 'warning':
        return {
          border: 'border-amber-500/40 bg-slate-900/95',
          icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
          title: 'text-amber-400',
        };
      default:
        return {
          border: 'border-cyan-500/40 bg-slate-900/95',
          icon: <Info className="w-4 h-4 text-cyan-400" />,
          title: 'text-cyan-400',
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-slideUp font-sans ${style.border}`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">{style.icon}</div>
        <div className="flex-1">
          <h5 className={`text-xs font-bold font-mono ${style.title}`}>{toast.title}</h5>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-500 hover:text-slate-300 p-0.5 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
