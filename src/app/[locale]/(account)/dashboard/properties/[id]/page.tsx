"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PropertyDetail from "@/components/admin/property-detail/property-detail";
import { Suspense } from "react";

// Componente de carga
const PropertyDetailLoading = () => (
  <div className="space-y-6">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 w-48 mb-4 rounded"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 w-full rounded"></div>
    </div>
  </div>
);

export default function PropertyDetailPage() {
  // Obtener los parámetros de la ruta
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`/${locale}/dashboard/properties`}>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Detalle de propiedad
        </h1>
      </div>

      <Suspense fallback={<PropertyDetailLoading />}>
        <PropertyDetail propertyId={id} />
      </Suspense>
    </div>
  );
}
