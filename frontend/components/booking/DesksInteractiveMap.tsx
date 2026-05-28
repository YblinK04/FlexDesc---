"use client";

import { Loader2 } from "lucide-react";
import { useDesksMap } from "@/hooks/useDesksMap";
import { DeskMapButton } from "@/components/ui/DeskMapButton";
import { ZoneContainer } from "@/components/ui/ZoneContainer";

export function DesksInteractiveMap() {
  const { desks, isLoading, error } = useDesksMap();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4 text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
        <p className="text-sm font-semibold tracking-wide">Синхронизация чертежа коворкинга…</p>
      </div>
    );
  }

  if (error || !desks.length) {
    return (
      <div role="alert" className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6 text-red-200 backdrop-blur-md max-w-xl mx-auto mt-10">
        <p className="font-bold text-lg text-white">Ошибка инициализации карты</p>
        <p className="mt-1 text-sm opacity-80">{error ?? "В базе данных Neon DB не обнаружено столов."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 relative z-10 max-w-5xl mx-auto px-3 sm:px-4 py-8 sm:py-12 text-slate-200 w-full box-border min-w-0">
      
      <header className="text-center md:text-left min-w-0">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white bg-gradient-to-r from-white via-slate-100 to-purple-accent bg-clip-text text-transparent sm:text-4xl">
          Схема Пространства FlexDesk
        </h1>
        <p className="mt-2 text-xs sm:text-sm font-medium text-slate-400 max-w-xl leading-relaxed">
          Интерактивный чертеж коворкинга. Кликните по интересующему месту на карте, чтобы открыть календарную сетку бронирования.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-dark-border bg-dark-card/40 p-4 rounded-xl backdrop-blur-md w-full box-border">
        <div className="flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 rounded-md border border-brand bg-dark-card shadow-[0_0_12px_#ec4899]" />
          <span className="text-slate-100">Свободен / Кликабелен</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 rounded-md border border-red-900 bg-red-950/40 shadow-inner" />
          <span className="text-slate-500">Занят прямо сейчас (Но можно забронировать на потом)</span>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-6 md:grid-rows-3 gap-4 border-2 border-dark-border bg-dark-card/20 p-4 sm:p-6 rounded-3xl backdrop-blur-xl relative w-full box-border min-w-0">
        
        <div className="hidden md:block absolute top-12 left-6 text-[10px] font-black uppercase tracking-widest text-slate-600 select-none pointer-events-none">Панорамное фасадное остекление</div>
        <div className="hidden md:block absolute bottom-4 right-6 text-[10px] font-black uppercase tracking-widest text-slate-600 select-none pointer-events-none">Входная группа / Ресепшен</div>

        <ZoneContainer title="Тихий блок" badgeText="Quiet" badgeColor="purple" gridClasses="md:col-span-2 md:row-span-1">
          <DeskMapButton desk={desks.find(d => d.id.startsWith("22222222"))} iconType="monitor" />
        </ZoneContainer>

        <div className="hidden md:flex col-span-1 row-span-1 items-center justify-center border border-dashed border-dark-border/30 rounded-2xl text-slate-600 text-[10px] font-bold font-mono select-none">
          Коридор А
        </div>

        <ZoneContainer title="Переговорная комната" badgeText="Meeting Space" badgeColor="emerald" gridClasses="md:col-span-3 md:row-span-2">
          <DeskMapButton desk={desks.find(d => d.id.startsWith("33333333"))} iconType="users" />
        </ZoneContainer>

        <ZoneContainer title="Общий зал коворкинга" badgeText="Open Space" badgeColor="brand" gridClasses="md:col-span-3 md:row-span-2">
          <DeskMapButton desk={desks.find(d => d.id.startsWith("11111111"))} iconType="flame" />
        </ZoneContainer>

        <div className="hidden md:flex col-span-3 row-span-1 items-center justify-center border border-dashed border-dark-border/30 rounded-2xl text-slate-600 text-[10px] font-bold font-mono select-none">
          Зона отдыха / Лаундж
        </div>

      </div>
    </div>
  );
}