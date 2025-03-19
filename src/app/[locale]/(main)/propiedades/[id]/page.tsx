"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import PropertyDetailView from "@/components/properties/PropertyDetailView";
import { useProperty } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyPage() {
  const { id } = useParams();
  const propertyId = id?.toString() || "";

  // Usamos el hook useProperty para obtener los datos de la API
  const { property, isLoading, error } = useProperty(propertyId);

  // Estado de carga con skeleton para mejorar UX
  if (isLoading) {
    return (
      <div className="container py-10">
        <Button variant="outline" className="mb-6" disabled>
          Volver
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-[300px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Estado de error mejorado
  if (error) {
    return (
      <div className="container py-10">
        <Button className="mb-6" onClick={() => window.history.back()}>
          Volver
        </Button>
        <div className="text-red-500 text-center py-10 border border-red-200 rounded-md bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <p className="font-medium">No se pudo cargar la propiedad</p>
          <p className="text-sm text-red-400">
            {Error() ? error : "Error desconocido"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Button className="mb-6" onClick={() => window.history.back()}>
        Volver
      </Button>

      {property ? (
        <PropertyDetailView property={property} locale={""} />
      ) : (
        <div className="text-center py-10 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800/20 dark:border-gray-700">
          Propiedad no encontrada
        </div>
      )}
    </div>
  );
}
