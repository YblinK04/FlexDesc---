"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { Loader2, Check, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

import { DayCalendarGrid } from "./DayCalendarGrid";
import { DateSlider } from "@/components/ui/DateSlider";
import { SuccessToast } from "@/components/ui/SuccessToast";
import { DeskHeader } from "@/components/ui/DeskHeader";
import { GuestForm } from "@/components/ui/GuestForm";

import { useDeskBookingState } from "@/hooks/useDeskBookingState";

export interface DeskBookingViewProps {
  deskId: any;
}

function formatRuDate(d: Date): string {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(d);
}

export function DeskBookingView({ deskId }: DeskBookingViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cleanDeskId = useMemo(() => {
    if (!deskId) return "";
    if (typeof deskId === "string") return deskId;
    if (typeof deskId === "object" && deskId !== null) return deskId.deskId || "";
    return String(deskId);
  }, [deskId]);

  const state = useDeskBookingState(cleanDeskId);

  const handleDateChange = useCallback((date: Date) => {
    state.setCalendarDay(date);
    state.handleResetSelection();
  }, [state]);

  if (!isMounted || state.deskLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dark-border bg-dark-card/80 p-16 text-slate-400 shadow-xl backdrop-blur-md">
        <Loader2 className="h-10 w-10 animate-spin text-brand" aria-hidden="true" />
        <p className="text-sm font-bold tracking-wide">Синхронизация параметров коворкинга…</p>
      </div>
    );
  }

  if (state.deskError || !state.desk) {
    return (
      <div role="alert" className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-red-200 shadow-xl backdrop-blur-md">
        <p className="font-black text-lg text-white">Критический сбой загрузки ресурса</p>
        <p className="mt-2 text-sm text-red-400">{state.deskError ?? "Не удалось установить соединение с сервером"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-full box-border min-w-0 overflow-hidden text-slate-200">
      <Link href="/desks" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-brand transition-colors group select-none">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform text-brand" />
        Назад к интерактивной карте
      </Link>

      <DeskHeader desk={state.desk} />

      <DateSlider currentDay={state.calendarDay} onDateChange={handleDateChange} />

      <section className="rounded-2xl border border-dark-border bg-dark-card/50 p-3.5 sm:p-6 shadow-[0_0_30px_rgba(168,85,247,0.12)] backdrop-blur-md w-full box-border min-w-0">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-dark-border/40 pb-4">
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2 truncate">
              <Clock className="h-5 w-5 text-brand drop-shadow-[0_0_8px_#ec4899] shrink-0" />
              Доступные слоты времени
            </h2>
            <p className="mt-1 text-xs font-bold text-slate-400 truncate">
              День: <span className="text-white capitalize">{formatRuDate(state.calendarDay)}</span>
            </p>
          </div>
          <button 
            type="button" 
            onClick={state.handleResetSelection} 
            disabled={!state.selectedHours.size && !state.selectionMessage && !state.submitError} 
            className="rounded-xl border border-dark-border bg-dark-bg px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-200 transition-all hover:bg-dark-card hover:border-brand/50 disabled:cursor-not-allowed disabled:opacity-20 cursor-pointer self-start sm:self-auto shrink-0"
          >
            Сбросить часы
          </button>
        </div>

        {state.bookingsError && <p role="alert" className="mb-4 text-xs font-bold bg-red-950/40 border border-red-900/50 text-red-400 px-4 py-2.5 rounded-xl shadow-inner break-words">{state.bookingsError}</p>}
        {state.selectionMessage && <p role="status" className="mb-4 text-xs font-bold bg-amber-950/40 border border-amber-900/50 text-amber-400 px-4 py-2.5 rounded-xl shadow-inner break-words">{state.selectionMessage}</p>}
        {state.submitError && <p role="alert" className="mb-4 text-xs font-bold bg-red-950/40 border border-red-900/50 text-red-400 px-4 py-2.5 rounded-xl shadow-inner break-words">{state.submitError}</p>}

        <DayCalendarGrid blockedHours={state.blockedHours} selectedHours={state.selectedHours} onSlotClick={state.handleSlotClick} isLoading={state.bookingsLoading} />

        <GuestForm show={state.estimatedHours > 0} name={state.guestName} phone={state.guestPhone} onNameChange={state.setGuestName} onPhoneChange={state.setGuestPhone} />

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-dark-border/40 pt-5 w-full box-border">
          <div className="text-xs sm:text-sm font-bold text-slate-300 w-full sm:w-auto min-w-0">
            {state.estimatedHours > 0 && (
              <div className="flex flex-col xs:flex-row xs:items-center gap-1.5 sm:gap-3 min-w-0">
                <span className="truncate">Выбрано: <span className="text-white text-sm sm:text-base font-black tabular-nums">{state.estimatedHours} ч.</span></span>
                <span className="hidden xs:block h-4 w-px bg-dark-border" />
                <span>К оплате: <span className="text-brand font-black text-base sm:text-lg">{state.estimatedTotalRub.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 })}</span></span>
              </div>
            )}
          </div>
          
          <button 
            type="button" 
            disabled={state.submitDisabled} 
            onClick={state.handleSubmit} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-purple-accent px-5 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(236,72,153,0.2)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:cursor-not-allowed disabled:opacity-30 disabled:scale-100 disabled:shadow-none cursor-pointer shrink-0"
          >
            {state.submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Подтвердить бронирование
          </button>
        </div>
      </section>

      <SuccessToast show={state.showSuccessToast} />
    </div>
  );
}