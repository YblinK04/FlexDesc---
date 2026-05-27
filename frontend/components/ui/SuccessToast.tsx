"use client";

import { memo } from "react";
import { CheckCircle } from "lucide-react";

export interface SuccessToastProps {
  show: boolean;
}

export const SuccessToast = memo(function SuccessToast({ show }: SuccessToastProps) {
  if (!show) return null;

  return (
    <div 
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-dark-card px-5 py-4 text-white shadow-[0_0_30px_rgba(16,185,129,0.25)] border-l-4 border-l-emerald-500 animate-fade-in backdrop-blur-md min-w-[320px]"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
        <CheckCircle className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-bold">Успешно забронировано!</p>
        <p className="text-xs text-slate-400 mt-0.5">Место закреплено за вашим номером.</p>
      </div>
    </div>
  );
});