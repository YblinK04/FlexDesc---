"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { parseErrorMessage } from "@/lib/httpError";
import type { Booking, CreateBookingRequest } from "@/types";

export interface UseCreateBookingResult {
  createBooking: (payload: CreateBookingRequest) => Promise<Booking | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useCreateBooking(): UseCreateBookingResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const createBooking = useCallback(async (payload: CreateBookingRequest): Promise<Booking | null> => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setError(null);
    setIsLoading(true);

    const bookingsApiUrl = `${getApiBaseUrl('fetch')}/api/bookings`;

    try {
      const response = await fetch(bookingsApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        setError(response.status === 400 ? (message || "Слот занят") : (message || `Ошибка: ${response.status}`));
        return null;
      }

      const responseText = await response.text();
      if (!responseText) throw new Error("EMPTY_SERVER_RESPONSE");

      let data: Booking;
      try {
        data = JSON.parse(responseText) as Booking;
      } catch {
        throw new Error("MALFORMED_JSON_RESPONSE");
      }
      
      if (!data?.id || !data?.deskId || !data?.startTime || !data?.endTime) {
        throw new Error("INVALID_SERVER_CONTRACT");
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return null;

      if (err instanceof Error) {
        const errorMapping: Record<string, string> = {
          EMPTY_SERVER_RESPONSE: "Сервер вернул пустой ответ",
          MALFORMED_JSON_RESPONSE: "Критическая ошибка: сервер вернул не JSON",
          INVALID_SERVER_CONTRACT: "Некорректный ответ сервера: нарушена структура данных"
        };
        setError(errorMapping[err.message] || "Сетевая ошибка. Проверьте соединение.");
      } else {
        setError("Произошла неизвестная ошибка");
      }
      return null;
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, []);

  return { createBooking, isLoading, error, clearError };
}