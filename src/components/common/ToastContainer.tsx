import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 right-3 sm:right-4 z-50 flex flex-col space-y-2 max-w-xs sm:max-w-sm w-full pointer-events-none no-print">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-[#E53935] shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-[#FF8F00] shrink-0" />,
          info: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
        };

        const borders = {
          success: 'border-[#F1E1DC] bg-white text-[#333333] shadow-lg',
          error: 'border-red-200 bg-red-50 text-red-900 shadow-lg',
          warning: 'border-amber-200 bg-amber-50 text-amber-900 shadow-lg',
          info: 'border-blue-200 bg-blue-50 text-blue-900 shadow-lg',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              {toast.title && <h4 className="text-xs font-bold leading-tight mb-0.5">{toast.title}</h4>}
              <p className="text-[11px] leading-relaxed text-[#555555]">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
