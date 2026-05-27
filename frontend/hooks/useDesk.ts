"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { parseErrorMessage } from "@/lib/httpError";
import type { Desk } from "@/types/desk";

export interface UseDeskResult {
  desk: Desk | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDesk(deskId: string): UseDeskResult {
  const [desk, setDesk] = useState<Desk | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isCurrentRequestActive?: () => boolean) => {
    if (!deskId) {
      setDesk(null);
      setError("Не указан идентификатор стола");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const url = `${getApiBaseUrl('fetch')}/api/desks/${encodeURIComponent(deskId)}`;

    try {
      const response = await fetch(url, { method: "GET" });

      if (isCurrentRequestActive && !isCurrentRequestActive()) return;

      if (response.status === 404) {
        setDesk(null);
        setError("Стол не найден");
        return;
      }

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        setDesk(null);
        setError(message || `Ошибка сервера: ${response.status}`);
        return;
      }

      const resolvedData = response.status === 204 ? null : await response.json();
      
      if (!resolvedData?.id || !resolvedData?.name || !resolvedData?.area || typeof resolvedData.pricePerHourCents !== "number") {
        setDesk(null);
        setError("Некорректный ответ сервера: нарушена структура данных");
        return;
      }

      setDesk(resolvedData as Desk);
    } catch {
      if (isCurrentRequestActive && !isCurrentRequestActive()) return;
      setDesk(null);
      setError("Сетевая ошибка при загрузке данных стола");
    } finally {
      if (!isCurrentRequestActive || isCurrentRequestActive()) {
        setIsLoading(false);
      }
    }
  }, [deskId]);

  useEffect(() => {
    let active = true;
    const isCurrentRequestActive = () => active;

    if (!deskId) {
      setDesk(null);
      setError("Не указан стол");
      setIsLoading(false);
      return;
    }

    void fetchData(isCurrentRequestActive);

    return () => {
      active = false;
    };
  }, [deskId, fetchData]);

  const handleRefetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { 
    desk, 
    isLoading, 
    error, 
    refetch: handleRefetch 
  };
}