"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PropertyListTable from "@/components/admin/property-list-table";

export default function PropertiesPage() {
  const router = useRouter();

  const handleAddProperty = () => {
    // Obtener el locale actual de la URL
    const locale = window.location.pathname.split("/")[1];
    router.push(`/${locale}/dashboard/properties/new`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propiedades</h1>
          <p className="text-muted-foreground">
            Gestiona todas las propiedades de la plataforma
          </p>
        </div>
        <Button
          className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
          onClick={handleAddProperty}
        >
          <Plus className="mr-2 h-4 w-4" />
          Añadir propiedad
        </Button>
      </div>

      <PropertyListTable />
    </div>
  );
}
