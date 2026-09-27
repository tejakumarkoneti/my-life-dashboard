import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md ${
          toast.type === 'success'
            ? 'bg-zinc-900/95 text-white border-brand-500/40 shadow-brand-500/10'
            : 'bg-zinc-900/95 text-white border-zinc-700 shadow-zinc-900/20'
        }`}
      >
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
        )}
        <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
