"use client";

import { memo } from "react";
import { MapPin } from "lucide-react";
import type { Desk } from "@/types/desk";

export interface DeskHeaderProps {
  desk: Desk;
}

export const DeskHeader = memo(function DeskHeader({ desk }: DeskHeaderProps) {
  return (
    <header className="rounded-2xl border border-dark-border bg-dark-card/50 p-4 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center rounded-md bg-brand/20 border border-brand/40 px-2.5 py-0.5 text-xs font-black uppercase tracking-widest text-brand shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            {desk.area}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-2.5 tracking-tight break-words">
            {desk.name}
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-300">
            <MapPin className="h-4 w-4 shrink-0 text-purple-accent" aria-hidden="true" />
            Административный корпус · <span className="text-white">Этаж 1</span>
          </p>
        </div>
        
        <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-dark-border/60 pt-4 sm:pt-0 sm:pl-6 shrink-0">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Стоимость аренды</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-0.5 flex items-baseline sm:justify-end gap-0.5">
            <span className="text-brand">{(desk.pricePerHourCents / 100)}</span>
            <span className="text-xs sm:text-sm font-bold text-slate-400"> ₽ / час</span>
          </p>
        </div>
      </div>
    </header>
  );
});