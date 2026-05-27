"use client";

import { memo } from "react";
import Link from "next/link";
import { Monitor, Users, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExtendedDesk } from "@/hooks/useDesksMap";

export interface DeskMapButtonProps {
  desk: ExtendedDesk | undefined;
  iconType: "monitor" | "users" | "flame";
}

export const DeskMapButton = memo(function DeskMapButton({ desk, iconType }: DeskMapButtonProps) {
  if (!desk) {
    return <div className="text-xs text-slate-600 italic">Место отсутствует</div>;
  }

  const isOccupied = desk.bookings.length > 0;
  
  const Icon = iconType === "monitor" ? Monitor : iconType === "users" ? Users : Flame;
  const iconColor = isOccupied ? "text-red-500" : iconType === "monitor" ? "text-purple-accent" : iconType === "users" ? "text-emerald-400" : "text-brand";

  return (
    <Link
      href={`/book/${desk.id}`}
      className={cn(
        "flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-300 w-full box-border min-w-0 min-h-[96px] sm:min-h-[110px] cursor-pointer",
        isOccupied
          ? "border-red-950 bg-red-950/10 text-red-600 pointer-events-none opacity-30 shadow-inner"
          : "border-brand bg-dark-card/90 text-white shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:border-purple-accent hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:scale-[1.02]"
      )}
    >
      <div className="flex items-center justify-between w-full min-w-0 gap-2">
        <span className="font-extrabold text-sm tracking-wide text-white truncate pr-1">{desk.name}</span>
        <Icon className={cn("h-4 w-4 shrink-0", iconColor)} />
      </div>
      <div className="flex items-end justify-between border-t border-dark-border/40 pt-2.5 mt-2 w-full">
        <span className="text-xs font-mono font-black text-brand">{(desk.pricePerHourCents / 100)} ₽/ч</span>
        <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">
          {isOccupied ? "Занят" : "Выбрать"}
        </span>
      </div>
    </Link>
  );
});