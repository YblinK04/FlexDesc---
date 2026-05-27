"use client";

import { useMemo, memo } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateSliderProps {
  currentDay: Date;
  onDateChange: (date: Date) => void;
}

export const DateSlider = memo(function DateSlider({ currentDay, onDateChange }: DateSliderProps) {
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, []);

  return (
    <section className="flex flex-col gap-3 bg-dark-card/30 p-4 rounded-2xl border border-dark-border/40 shadow-[0_0_20px_rgba(168,85,247,0.08)]">
      <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-brand shadow-[0_0_10px_rgba(236,72,153,0.3)]" />
        Выберите дату посещения
      </label>
      
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x touch-pan-x">
        {weekDays.map((date, idx) => {
          const isSelected = date.getTime() === currentDay.getTime();
          const dayNum = date.getDate();
          const dayName = new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(date);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onDateChange(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[4.2rem] sm:min-w-[4.5rem] p-2.5 sm:p-3 rounded-xl border font-bold transition-all duration-200 snap-center cursor-pointer shrink-0",
                isSelected
                  ? "border-brand bg-gradient-to-b from-brand to-brand/80 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] scale-[1.02]"
                  : "border-dark-border bg-dark-bg text-slate-400 hover:border-purple-accent/60 hover:text-white"
              )}
            >
              <span className={cn("text-[9px] sm:text-[10px] uppercase tracking-wider", isSelected ? "text-white/80" : "text-slate-500")}>
                {dayName}
              </span>
              <span className="text-base sm:text-xl font-black mt-0.5 tabular-nums tracking-tight">
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
});