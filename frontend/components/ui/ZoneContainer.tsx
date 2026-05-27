"use client";

import { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ZoneContainerProps {
  title: string;
  badgeText: string;
  badgeColor: "brand" | "purple" | "emerald";
  gridClasses: string; 
  children: ReactNode;
}

export const ZoneContainer = memo(function ZoneContainer({
  title,
  badgeText,
  badgeColor,
  gridClasses,
  children,
}: ZoneContainerProps) {
  
  const badgeStyle = 
    badgeColor === "brand" ? "text-brand bg-brand/10 border-brand/30" : 
    badgeColor === "purple" ? "text-purple-accent bg-purple-accent/10 border-purple-accent/30" : 
    "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";

  return (
    <div className={cn(
      "border border-dark-border/80 bg-slate-950/40 rounded-2xl p-4 flex flex-col justify-between relative min-w-0 shadow-[0_0_20px_rgba(0,0,0,0.2)]",
      gridClasses
    )}>
      <span className={cn("md:absolute top-2 right-3 text-[10px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-md block text-right mb-3 md:mb-0 select-none", badgeStyle)}>
        {badgeText}
      </span>
      <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 md:mb-0 select-none">
        {title}
      </div>
      <div className="flex flex-col gap-3 flex-1 justify-center w-full min-w-0">
        {children}
      </div>
    </div>
  );
});