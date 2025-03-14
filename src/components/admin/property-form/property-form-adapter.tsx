"use client";

import { useEffect, useState } from "react";
import PropertyForm from "@/components/admin/property-form/property-form";
import { getPropertyById } from "@/lib/mock-data/properties";

interface PropertyFormAdapterProps {
  propertyId?: string;
}

export default function PropertyFormAdapter({
  propertyId,
}: PropertyFormAdapterProps) {
  const [isLoading, setIsLoading] = useState(!!propertyId);
  const [error, setError] = useState<string | null>(null);
  const [propertyExists, setPropertyExists] = useState(false);

  useEffect(() => {
    // Solo verificar que la propiedad existe si tenemos un propertyId
    if (propertyId) {
      const checkPropertyExists = async () => {
        try {
          const property = await getPropertyById(propertyId);

          if (!property) {
            setError("No se encontró la propiedad con el ID especificado");
            setPropertyExists(false);
          } else {
            setPropertyExists(true);
          }
        } catch (error) {
          console.error("Error al verificar propiedad:", error);
          setError("Error al cargar los datos de la propiedad");
        } finally {
          setIsLoading(false);
        }
      };

      checkPropertyExists();
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
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div>
            <p className="text-lg text-red-700">Error</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Si tenemos propertyId pero la propiedad no existe
  if (propertyId && !propertyExists) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Propiedad no encontrada
        </h2>
        <p className="mb-6">
          No se encontró la propiedad con el ID especificado.
        </p>
      </div>
    );
  }

  // PropertyForm ya carga internamente los datos cuando tiene un propertyId
  return <PropertyForm propertyId={propertyId} />;
}
