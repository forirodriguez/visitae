"use client";

import { useEffect, useState } from "react";
import { Property } from "@/types/property";
import { getFilteredProperties } from "@/lib/mock-data/properties";
import PropertyCard from "@/components/properties/PropertyCard";

interface SimilarPropertiesSectionProps {
  currentPropertyId: string;
  propertyType: "venta" | "alquiler";
  locale: string;
}

export default function SimilarPropertiesSection({
  currentPropertyId,
  propertyType,
}: SimilarPropertiesSectionProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      setLoading(true);
      try {
        // Obtener propiedades del mismo tipo
        const filtered = await getFilteredProperties({ type: propertyType });
        // Filtrar la propiedad actual y limitar a 3
        const similar = filtered
          .filter((p) => p.id !== currentPropertyId)
          .slice(0, 3);

        setProperties(similar);
      } catch (error) {
        console.error("Error fetching similar properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
  }, [currentPropertyId, propertyType]);

  if (loading) {
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
