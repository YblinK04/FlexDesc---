"use client";

import { memo } from "react";
import { HourSlotCell } from "./HourSlotCell";
import { WORK_HOURS, getStaticHourLabel } from "@/lib/dayCalendar";

export interface DayCalendarGridProps {
  blockedHours: ReadonlySet<number>;
  selectedHours: ReadonlySet<number>;
  onSlotClick: (hour: number) => void;
  isLoading?: boolean;
}

export const DayCalendarGrid = memo(function DayCalendarGrid({
  blockedHours,
  selectedHours,
  onSlotClick,
  isLoading = false,
}: DayCalendarGridProps) {
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" aria-busy="true" aria-live="polite">
        <span className="sr-only">Синхронизация расписания…</span>
        {WORK_HOURS.map((hour) => (
          <div
            key={hour}
            className="h-14 animate-pulse rounded-xl bg-dark-border/30"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="region" aria-label="Почасовая сетка доступности">
      {WORK_HOURS.map((hour) => {
        const cachedLabel = getStaticHourLabel(hour);

        return (
          <HourSlotCell
            key={hour}
            hour={hour}
            label={cachedLabel}
            disabled={blockedHours.has(hour)}
            selected={selectedHours.has(hour)}
            onSlotClick={onSlotClick}
          />
        );
      })}
    </div>
  );
});