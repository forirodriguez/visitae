// src/hooks/useProperties.ts
"use client";

import { useState, useEffect } from "react";
import { Property, PropertyFilter } from "@/types/property";
import {
  getAllProperties,
  getFilteredProperties,
  getFeaturedProperties,
} from "@/lib/mock-data/properties";

// Hook para obtener todas las propiedades
export function useAllProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllProperties()
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar las propiedades");
        setLoading(false);
      });
  }, []);

  return { properties, loading, error };
}

// Hook para propiedades con filtros
export function useFilteredProperties(initialFilters: PropertyFilter = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilter>(initialFilters);

  useEffect(() => {
    setLoading(true);
    getFilteredProperties(filters)
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al filtrar las propiedades");
        setLoading(false);
      });
  }, [filters]);

  // Función para actualizar filtros
  const updateFilters = (newFilters: Partial<PropertyFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return { properties, loading, error, filters, updateFilters };
}

// Hook para propiedades destacadas
export function useFeaturedProperties(limit: number = 6) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getFeaturedProperties(limit)
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar las propiedades destacadas");
        setLoading(false);
      });
  }, [limit]);

  return { properties, loading, error };
}
