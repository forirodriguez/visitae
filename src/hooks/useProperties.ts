// src/hooks/useProperty.ts
"use client";

import { useState, useEffect } from "react";
import { Property, PropertyFilter } from "@/types/property";
import {
  fetchProperties,
  fetchPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "@/lib/api/client/properties";

// Hook para cargar una propiedad específica
export function useProperty(id: string | undefined) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadProperty() {
      setIsLoading(true);
      setError(null);
      if (!id) return;
      try {
        const data = await fetchPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar la propiedad"
        );
        console.error("Error al cargar la propiedad:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  return { property, isLoading, error };
}

// Hook para cargar múltiples propiedades con filtros
export function useProperties(initialFilters?: Partial<PropertyFilter>) {
  const [properties, setProperties] = useState<Property[]>([]);
  // Usar un tipo más específico para filters, con todas las propiedades opcionales
  const [filters, setFilters] = useState<Partial<PropertyFilter>>(
    initialFilters || {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperties() {
      setIsLoading(true);
      setError(null);
      try {
        // Convertir filters a PropertyFilter cuando se llame a la función
        const data = await fetchProperties(filters as PropertyFilter);
        setProperties(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar propiedades"
        );
        console.error("Error al cargar propiedades:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProperties();
  }, [filters]);

  // Función para actualizar filtros
  const updateFilters = (newFilters: Partial<PropertyFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return { properties, isLoading, error, filters, updateFilters };
}

// Hook para realizar operaciones CRUD en propiedades
export function usePropertyMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Crear nueva propiedad
  const createNewProperty = async (propertyData: Omit<Property, "id">) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await createProperty(propertyData);
      setSuccess("Propiedad creada correctamente");
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la propiedad"
      );
      console.error("Error al crear propiedad:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar propiedad existente
  const updateExistingProperty = async (
    id: string,
    propertyData: Partial<Property>
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateProperty(id, propertyData);
      setSuccess("Propiedad actualizada correctamente");
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la propiedad"
      );
      console.error("Error al actualizar propiedad:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar propiedad
  const removeProperty = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await deleteProperty(id);
      setSuccess("Propiedad eliminada correctamente");
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar la propiedad"
      );
      console.error("Error al eliminar propiedad:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Restablecer estado entre operaciones
  const reset = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    isLoading,
    error,
    success,
    createProperty: createNewProperty,
    updateProperty: updateExistingProperty,
    deleteProperty: removeProperty,
    reset,
  };
}
