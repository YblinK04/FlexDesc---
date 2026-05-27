"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

export interface HourSlotCellProps {
  hour: number;
  label: string;
  disabled: boolean;
  selected: boolean;
  onSlotClick: (hour: number) => void;
}

export const HourSlotCell = memo(function HourSlotCell({
  hour,
  label,
  disabled,
  selected,
  onSlotClick,
}: HourSlotCellProps) {
  
  const statusLabel = disabled ? "Занято" : selected ? "Выбрано" : "Свободно";

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected ? "true" : "false"}
      onClick={() => onSlotClick(hour)}
      className={cn(
        "group flex min-h-[3.2rem] sm:min-h-[3.5rem] w-full items-center justify-between rounded-xl border px-3.5 sm:px-5 text-left shadow-md transition-all duration-200 cursor-pointer shrink-0",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        
        "border-dark-border bg-dark-card/90 text-slate-200",
        
        !selected && !disabled && "hover:border-purple-accent/60 hover:bg-dark-card hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]",
        
        selected && "border-brand bg-gradient-to-r from-brand to-brand/90 text-white font-black shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:brightness-110",
        
        disabled && "border-dark-border/30 bg-slate-950/40 text-slate-600 pointer-events-none shadow-none"
      )}
    >
      <span className="text-xs sm:text-sm font-bold tabular-nums tracking-wide shrink-0">
        {label}
      </span>
      
      <span className={cn(
        "text-[11px] sm:text-xs font-semibold transition-colors pl-2 truncate", 
        "text-slate-500 group-hover:text-slate-300",
        selected && "text-white font-black opacity-100 group-hover:text-white",
        disabled && "text-slate-700 font-normal"
      )}>
        {statusLabel}
      </span>
    </button>
  );
});
