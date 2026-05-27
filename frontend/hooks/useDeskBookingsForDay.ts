"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { parseErrorMessage } from "@/lib/httpError";
import type { Booking } from "@/types/booking";

function isBookingRecord(value: unknown): value is Booking {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.deskId === "string" &&
    typeof o.startTime === "string" &&
    typeof o.endTime === "string"
  );
}

function normalizeBookingsPayload(data: unknown): Booking[] {
  if (!Array.isArray(data)) return [];
  return data.filter(isBookingRecord);
}

export interface UseDeskBookingsForDayResult {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDeskBookingsForDay(deskId: string, dayKey: string): UseDeskBookingsForDayResult {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (isCurrentRequest?: () => boolean) => {
    if (!deskId || deskId === "undefined" || !dayKey || dayKey === "undefined") {
      setBookings([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({ deskId, day: dayKey });
    const url = `${getApiBaseUrl('fetch')}/api/bookings?${params.toString()}`;

    try {
      const response = await fetch(url, { method: "GET" });

      if (isCurrentRequest && !isCurrentRequest()) return;

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        setBookings([]);
        setError(message);
        return;
      }

      const raw = (await response.json()) as unknown;
      setBookings(normalizeBookingsPayload(raw));
    } catch {
      if (isCurrentRequest && !isCurrentRequest()) return;
      setBookings([]);
      setError("Сетевая ошибка при загрузке бронирований");
    } finally {
      if (!isCurrentRequest || isCurrentRequest()) {
        setIsLoading(false);
      }
    }
  }, [deskId, dayKey]);

  useEffect(() => {
    let isActual = true;
    const isCurrentRequest = () => isActual;

    if (!deskId || deskId === "undefined" || !dayKey || dayKey === "undefined") {
      setBookings([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    void refetch(isCurrentRequest);

    return () => {
      isActual = false;
    };
  }, [deskId, dayKey, refetch]);

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return { bookings, isLoading, error, refetch: handleRefetch };
}