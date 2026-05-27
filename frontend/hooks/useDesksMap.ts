"use client";

import { useEffect, useState, useCallback } from "react";
import { getApiBaseUrl } from "@/lib/apiBase";
import type { Desk } from "@/types/desk";

export interface ExtendedDesk extends Desk {
  bookings: Array<{ id: string; startTime: string; endTime: string }>;
}

export function useDesksMap() {
  const [desks, setDesks] = useState<ExtendedDesk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMap = useCallback(async (isCurrentRequestActive?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${getApiBaseUrl('fetch')}/api/desks`, { method: "GET" });
      
      if (isCurrentRequestActive && !isCurrentRequestActive()) return;

      if (!response.ok) {
        throw new Error("Сбой загрузки схемы коворкинга");
      }

      const data = await response.json();
      setDesks(data);
    } catch {
      if (isCurrentRequestActive && !isCurrentRequestActive()) return;
      setError("Не удалось загрузить интерактивную карту");
    } finally {
      if (!isCurrentRequestActive || isCurrentRequestActive()) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const isCurrentRequestActive = () => active;

    void fetchMap(isCurrentRequestActive);

    return () => {
      active = false; 
    };
  }, [fetchMap]);

  const handleRefetch = useCallback(async () => {
    await fetchMap();
  }, [fetchMap]);

  return { 
    desks, 
    isLoading, 
    error, 
    refetch: handleRefetch 
  };
}