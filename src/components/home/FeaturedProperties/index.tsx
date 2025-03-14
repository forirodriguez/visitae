// src/components/home/FeaturedProperties/index.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/properties/PropertyCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFeaturedProperties } from "@/hooks/useProperties";

export default function FeaturedProperties() {
  const [currentPage, setCurrentPage] = useState(0);
  const { properties, loading, error } = useFeaturedProperties();
  const propertiesPerPage = 6;
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const displayedProperties = properties.slice(
    currentPage * propertiesPerPage,
    (currentPage + 1) * propertiesPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (loading)
    return <div className="py-16 text-center">Cargando propiedades...</div>;
  if (error)
    return <div className="py-16 text-center text-red-500">{error}</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Propiedades Destacadas
            </h2>
            <p className="text-gray-500 mt-1">
              Descubre nuestras propiedades más exclusivas
            </p>
          </div>

          {totalPages > 1 && (
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button className="bg-blue-800 hover:bg-blue-900">
            Ver más propiedades
          </Button>
        </div>
      </div>
    </section>
  );
}
