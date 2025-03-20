// src/hooks/useVisits.ts
"use client";

import { useState, useEffect } from "react";
import { Visit, VisitStatus } from "@/types/visits";
import { VisitInput } from "@/lib/api/client/visits";
import {
  useVisits as useQueryVisits,
  useVisit as useQueryVisit,
  useCalendarEvents,
  useCreateVisit,
  useUpdateVisit,
  useUpdateVisitStatus,
  useDeleteVisit,
  fetchVisits,
} from "@/lib/api/client/visits";
import {
  getVisitWithProperty,
  getAllVisitsWithProperties,
  hasVisitConflict,
} from "@/utils/visits-utils";

// Tipo extendido para filtros que permite múltiples estados
export interface VisitFilters {
  propertyId?: string;
  status?: VisitStatus | VisitStatus[] | string; // Permite un estado, array de estados o string con estados separados por coma
  startDate?: string;
  endDate?: string;
}

// Hook para obtener todas las visitas
export function useVisits(filters?: VisitFilters) {
  // Usar el hook de React Query directamente
  return useQueryVisits(filters);
}

// Hook para obtener una visita específica
export function useVisit(id?: string) {
  // Usar el hook de React Query directamente
  return useQueryVisit(id);
}

// Hook para obtener una visita con datos de propiedad
export function useVisitWithProperty(id?: string) {
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadVisit() {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error("El ID de la visita es requerido");
        const data = await getVisitWithProperty(id);
        setVisit(data || null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar la visita"
        );
        console.error("Error al cargar la visita con propiedad:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVisit();
  }, [id]);

  return { visit, loading, error };
}

// Hook para obtener eventos del calendario
export function useVisitCalendarEvents(
  start: string,
  end: string,
  agentId?: string
) {
  // Usar el hook de React Query directamente
  return useCalendarEvents(start, end, agentId);
}

// Hook para verificar conflictos de horarios
export function useVisitConflictCheck() {
  const [checking, setChecking] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConflict = async (
    propertyId: string,
    date: Date,
    time: string,
    excludeVisitId?: string
  ) => {
    setChecking(true);
    setError(null);
    try {
      const conflict = await hasVisitConflict(
        propertyId,
        date,
        time,
        excludeVisitId
      );
      setHasConflict(conflict);
      return conflict;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al verificar conflictos"
      );
      console.error("Error al verificar conflictos:", err);
      // Cambiar esto para permitir continuar
      return false; // No asumir conflicto en caso de error
    } finally {
      setChecking(false);
    }
  };

  return { checkConflict, checking, hasConflict, error };
}

// Hook para operaciones CRUD completas en visitas
export function useVisitOperations() {
  // Usar los hooks de React Query
  const createVisitMutation = useCreateVisit();
  const updateVisitMutation = useUpdateVisit();
  const updateStatusMutation = useUpdateVisitStatus();
  const deleteVisitMutation = useDeleteVisit();

  // Función simplificada para crear una visita
  const createVisit = async (visitData: VisitInput) => {
    return createVisitMutation.mutateAsync(visitData);
  };

  // Función simplificada para actualizar una visita
  const updateVisit = async (id: string, data: Partial<VisitInput>) => {
    return updateVisitMutation.mutateAsync({ id, data });
  };

  // Función simplificada para actualizar el estado de una visita
  const updateVisitStatus = async (id: string, status: VisitStatus) => {
    return updateStatusMutation.mutateAsync({ id, status });
  };

  // Función simplificada para eliminar una visita
  const deleteVisit = async (id: string) => {
    return deleteVisitMutation.mutateAsync(id);
  };

  return {
    createVisit,
    updateVisit,
    updateVisitStatus,
    deleteVisit,
    isLoading:
      createVisitMutation.isPending ||
      updateVisitMutation.isPending ||
      updateStatusMutation.isPending ||
      deleteVisitMutation.isPending,
    error:
      createVisitMutation.error ||
      updateVisitMutation.error ||
      updateStatusMutation.error ||
      deleteVisitMutation.error,
  };
}

// Hook para filtrar y organizar visitas
export function useFilteredVisits(initialFilters?: VisitFilters) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filters, setFilters] = useState(initialFilters || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVisits() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchVisits(filters);
        setVisits(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar visitas"
        );
        console.error("Error al cargar visitas filtradas:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVisits();
  }, [filters]);

  const updateFilters = (newFilters: Partial<VisitFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return { visits, loading, error, filters, updateFilters };
}

// Hook para obtener todas las visitas con datos de propiedades
export function useAllVisitsWithProperties() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVisits() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllVisitsWithProperties();
        setVisits(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar las visitas"
        );
        console.error(
          "Error al cargar todas las visitas con propiedades:",
          err
        );
      } finally {
        setLoading(false);
      }
    }

    loadVisits();
  }, []);

  return { visits, loading, error };
}
