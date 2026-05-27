import type { Booking } from "@/types";

export const WORK_START_HOUR = 8;
export const WORK_END_HOUR = 22;

export const WORK_HOURS: readonly number[] = Array.from(
  { length: WORK_END_HOUR - WORK_START_HOUR },
  (_, i) => WORK_START_HOUR + i,
);

const STATIC_LABELS_MAP = new Map<number, string>(
  WORK_HOURS.map((hour) => [
    hour,
    `${String(hour).padStart(2, "0")}:00 – ${String(hour + 1).padStart(2, "0")}:00`,
  ])
);

export function getStaticHourLabel(hour: number): string {
  return STATIC_LABELS_MAP.get(hour) || `${String(hour).padStart(2, "0")}:00`;
}

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

export function formatLocalDayKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toBookingIsoRange(
  day: Date,
  fromHour: number,
  toHourExclusive: number,
): { startTime: string; endTime: string } | null {
  if (toHourExclusive <= fromHour) return null;
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), fromHour, 0, 0, 0);
  const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), toHourExclusive, 0, 0, 0);

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}
export function buildBlockedHourSet(
  day: Date,
  bookings: readonly Booking[],
): ReadonlySet<number> {
  const blocked = new Set<number>();

  const preparedBookings = bookings
    .map(b => ({
      start: new Date(b.startTime).getTime(),
      end: new Date(b.endTime).getTime()
    }))
    .filter(b => !Number.isNaN(b.start) && !Number.isNaN(b.end));

  const year = day.getFullYear();
  const month = day.getMonth();
  const date = day.getDate();

  for (const h of WORK_HOURS) {
    const slotStart = new Date(year, month, date, h, 0, 0, 0).getTime();
    const slotEnd = new Date(year, month, date, h + 1, 0, 0, 0).getTime();

    for (const b of preparedBookings) {
      if (slotStart < b.end && slotEnd > b.start) {
        blocked.add(h);
        break; 
      }
    }
  }
  return blocked;
}

export function isRangeFree(
  fromHour: number,
  toHourExclusive: number,
  blocked: ReadonlySet<number>,
): boolean {
  if (toHourExclusive <= fromHour) return false;
  for (let h = fromHour; h < toHourExclusive; h += 1) {
    if (blocked.has(h)) return false;
  }
  return true;
}

export function rangeFromInclusivePair(
  a: number,
  b: number,
): { from: number; toExclusive: number } {
  return {
    from: Math.min(a, b),
    toExclusive: Math.max(a, b) + 1,
  };
}

export function isHourInSelection(
  hour: number,
  anchorHour: number | null,
  endHourExclusive: number | null,
): boolean {
  if (anchorHour === null) return false;
  if (endHourExclusive === null) return hour === anchorHour;
  return hour >= anchorHour && hour < endHourExclusive;
}