"use client";

import PropertyCard from "@/components/properties/PropertyCard";
import { useFilteredProperties } from "@/hooks/useProperties";

interface SimilarPropertiesSectionProps {
  currentPropertyId: string;
  propertyType: "venta" | "alquiler";
  locale: string;
}

export default function SimilarPropertiesSection({
  currentPropertyId,
  propertyType,
}: SimilarPropertiesSectionProps) {
  // Utilizamos el hook useFilteredProperties para obtener propiedades desde la API
  const {
    properties: allProperties,
    isLoading,
    error,
  } = useFilteredProperties({
    type: propertyType,
  });

  // Filtrar la propiedad actual y limitar a 3
  const properties = allProperties
    ? allProperties.filter((p) => p.id !== currentPropertyId).slice(0, 3)
    : [];

  // Manejo de estado de carga
  if (isLoading) {
    return (
      <div className="mt-14">
        <h2 className="text-2xl font-bold mb-6">Propiedades similares</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  // Manejo de errores
  if (error) {
    console.error("Error cargando propiedades similares:", error);
    return null; // No mostrar nada en caso de error
  }

  // No mostrar la sección si no hay propiedades similares
  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-bold mb-6">Propiedades similares</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
