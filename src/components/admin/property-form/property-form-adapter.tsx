// src/components/admin/property-form/property-form-adapter.tsx
"use client";

import { useEffect, useState } from "react";
import PropertyForm from "@/components/admin/property-form/property-form";
import { fetchPropertyById } from "@/lib/api/client/properties";
import { propertyToFormData } from "@/utils/property-adapter";
import { PropertyFormData } from "./property-form";

interface PropertyFormAdapterProps {
  propertyId?: string;
}

export default function PropertyFormAdapter({
  propertyId,
}: PropertyFormAdapterProps) {
  const [isLoading, setIsLoading] = useState(!!propertyId);
  const [error, setError] = useState<string | null>(null);
  const [propertyExists, setPropertyExists] = useState(false);
  const [propertyData, setPropertyData] = useState<PropertyFormData | null>(
    null
  );

  useEffect(() => {
    // Solo cargar los datos si tenemos un propertyId
    if (propertyId) {
      const loadProperty = async () => {
        try {
          const property = await fetchPropertyById(propertyId);
          setPropertyExists(true);
          // Convertir los datos de la propiedad al formato del formulario
          const formData = propertyToFormData(property);
          setPropertyData(formData);
        } catch (error) {
          console.error("Error al cargar propiedad:", error);
          setError("Error al cargar los datos de la propiedad");
          setPropertyExists(false);
        } finally {
          setIsLoading(false);
        }
      };

      loadProperty();
    }
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 mb-4"></div>
          <p>Cargando información de la propiedad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 dark:bg-red-950 dark:border-red-500">
        <div className="flex">
          <div>
            <p className="text-lg text-red-700 dark:text-red-400">Error</p>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Si tenemos propertyId pero la propiedad no existe
  if (propertyId && !propertyExists) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
          Propiedad no encontrada
        </h2>
        <p className="mb-6">
          No se encontró la propiedad con el ID especificado.
        </p>
      </div>
    );
  }

  // Pasar los datos iniciales si estamos en modo edición
  return (
    <PropertyForm
      propertyId={propertyId}
      initialFormData={propertyData || undefined}
    />
  );
}
