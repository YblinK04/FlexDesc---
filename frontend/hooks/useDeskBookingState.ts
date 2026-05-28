"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDesk } from "@/hooks/useDesk";
import { useDeskBookingsForDay } from "@/hooks/useDeskBookingsForDay";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import {
  buildBlockedHourSet,
  isRangeFree,
  rangeFromInclusivePair,
  formatLocalDayKey,
  toBookingIsoRange,
} from "@/lib/dayCalendar";
import type { CreateBookingRequest, ISO8601String } from "@/types/booking";

export function useDeskBookingState(deskId: string) {
  const router = useRouter();

  const [calendarDay, setCalendarDay] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const dayKey = useMemo(() => formatLocalDayKey(calendarDay), [calendarDay]);

  const { desk, isLoading: deskLoading, error: deskError } = useDesk(deskId);
  const { bookings, isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useDeskBookingsForDay(deskId, dayKey);
  const { createBooking, isLoading: submitLoading, error: submitError, clearError: clearSubmitError } = useCreateBooking();

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [anchorHour, setAnchorHour] = useState<number | null>(null);
  const [endHourExclusive, setEndHourExclusive] = useState<number | null>(null);
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);

  const blockedHours = useMemo(() => buildBlockedHourSet(calendarDay, bookings), [calendarDay, bookings]);

  const selectedHours = useMemo(() => {
    const set = new Set<number>();
    if (anchorHour === null) return set as ReadonlySet<number>;
    const end = endHourExclusive ?? anchorHour + 1;
    for (let h = anchorHour; h < end; h++) set.add(h);
    return set as ReadonlySet<number>;
  }, [anchorHour, endHourExclusive]);

  const handleSlotClick = useCallback((hour: number) => {
    if (blockedHours.has(hour)) return;
    setSelectionMessage(null);
    clearSubmitError();

    if (anchorHour === hour && endHourExclusive === null) {
      setAnchorHour(null);
      return;
    }

    if (anchorHour !== null && endHourExclusive !== null) {
      setAnchorHour(hour);
      setEndHourExclusive(null);
      return;
    }

    if (anchorHour === null) {
      setAnchorHour(hour);
      setEndHourExclusive(null);
      return;
    }

    if (endHourExclusive === null) {
      const { from, toExclusive } = rangeFromInclusivePair(anchorHour, hour);
      
      if (!isRangeFree(from, toExclusive, blockedHours)) {
        setAnchorHour(hour);
        setEndHourExclusive(null);
        return;
      }
      
      setAnchorHour(from);
      setEndHourExclusive(toExclusive);
      return;
    }
  }, [anchorHour, blockedHours, clearSubmitError, endHourExclusive]);

  const handleResetSelection = useCallback(() => {
    setAnchorHour(null);
    setEndHourExclusive(null);
    setSelectionMessage(null);
    clearSubmitError();
  }, [clearSubmitError]);

  const handleSubmit = useCallback(async () => {
    if (anchorHour === null || submitLoading) return;

    if (!guestName.trim() || !guestPhone.trim()) {
      setSelectionMessage("Пожалуйста, введите имя и телефон для закрепления стола");
      return;
    }

    const toEx = endHourExclusive ?? anchorHour + 1;
    if (!isRangeFree(anchorHour, toEx, blockedHours)) {
      setSelectionMessage("Диапазон пересёкся с бронированием. Обновите сетку.");
      return;
    }

    const iso = toBookingIsoRange(calendarDay, anchorHour, toEx);
    if (!iso) return;

    const payload: CreateBookingRequest = {
      deskId: deskId as CreateBookingRequest["deskId"],
      startTime: iso.startTime as ISO8601String,
      endTime: iso.endTime as ISO8601String,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
    };

    const result = await createBooking(payload);
    if (!result) return;

    const timeRangeString = `${String(anchorHour).padStart(2, "0")}:00 – ${String(toEx).padStart(2, "0")}:00`;

    const queryParams = new URLSearchParams({
      name: guestName.trim(),
      phone: guestPhone.trim(),
      desk: desk?.name || "Рабочее место",
      area: desk?.area || "Коворкинг",
      hours: String(estimatedHours),
      timeRange: timeRangeString, 
      total: String(estimatedTotalRub),
      date: dayKey,
    });

    router.push(`/book/success?${queryParams.toString()}`);

    handleResetSelection();
    setGuestName("");
    setGuestPhone("");
    await refetchBookings();
  }, [anchorHour, blockedHours, calendarDay, createBooking, deskId, endHourExclusive, refetchBookings, submitLoading, handleResetSelection, guestName, guestPhone, desk, dayKey, router]);

  const estimatedHours = anchorHour === null ? 0 : (endHourExclusive ?? anchorHour + 1) - anchorHour;
  const estimatedTotalRub = desk && estimatedHours > 0 ? (estimatedHours * desk.pricePerHourCents) / 100 : 0;
  const submitDisabled = deskLoading || bookingsLoading || submitLoading || desk === null || anchorHour === null;

  return {
    calendarDay,
    setCalendarDay, 
    desk,
    deskLoading,
    deskError,
    bookingsLoading,
    bookingsError,
    submitLoading,
    submitError,
    selectionMessage,
    blockedHours,
    selectedHours,
    estimatedHours,
    estimatedTotalRub,
    submitDisabled,
    guestName,
    guestPhone,
    showSuccessToast: false, 
    setGuestName,
    setGuestPhone,
    handleSlotClick,
    handleResetSelection,
    handleSubmit,
  };
}