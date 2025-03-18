//src/app/[locale]/(account)/dashboard/calendar/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List } from "lucide-react";
import CalendarContainer from "@/components/admin/calendar/calendar-container";
import VisitsList from "@/components/admin/calendar/visits-list";
import { useFilteredVisits, useVisitOperations } from "@/hooks/useVisits";
import { VisitStatus } from "@/types/visits";
import { toast } from "sonner";

// Metadata se define en una versión estática del archivo para RSC
// export const metadata: Metadata = {
//   title: "Gestión de Agenda | Panel de Administración Visitae",
//   description: "Gestiona y programa visitas a propiedades de forma eficiente",
// };

export default function CalendarPage() {
  const router = useRouter();

  // Obtener todas las visitas pendientes y confirmadas
  const {
    visits,
    loading: visitsLoading,
    error: visitsError,
    updateFilters,
  } = useFilteredVisits({
    // Ahora el tipo permite usar una cadena con valores separados por coma
    status: "pendiente,confirmada",
  });

  // Operaciones de visitas
  const {
    updateVisitStatus,
    deleteVisit,
    isLoading: operationsLoading,
  } = useVisitOperations();

  // Navegación para añadir visita
  const handleAddVisit = (date?: Date) => {
    const params = new URLSearchParams();
    if (date) {
      params.set("date", date.toISOString().split("T")[0]);
    }
    router.push(`/dashboard/calendar/new?${params.toString()}`);
  };

  // Navegación para editar visita
  const handleEditVisit = (visitId: string) => {
    router.push(`/dashboard/calendar/visits/${visitId}/edit`);
  };

  // Actualizar el estado de una visita
  const handleUpdateVisitStatus = async (
    visitId: string,
    newStatus: VisitStatus
  ) => {
    try {
      await updateVisitStatus(visitId, newStatus);
      toast.success(`Estado de visita actualizado a ${newStatus}`);
      // Refrescar los datos
      updateFilters({});
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("No se pudo actualizar el estado de la visita");
    }
  };

  // Eliminar una visita
  const handleDeleteVisit = async (visitId: string) => {
    try {
      await deleteVisit(visitId);
      toast.success("Visita eliminada correctamente");
      // Refrescar los datos
      updateFilters({});
    } catch (error) {
      console.error("Error al eliminar visita:", error);
      toast.error("No se pudo eliminar la visita");
    }
  };

  // Mostrar error si ocurre
  if (visitsError) {
    console.error("Error al cargar visitas:", visitsError);
  }

  // Determinar si hay operaciones en curso
  const isLoading = visitsLoading || operationsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Agenda</h1>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Calendario</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Lista de Visitas</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="space-y-4">
          <CalendarContainer
            onAddVisit={handleAddVisit}
            onEditVisit={handleEditVisit}
          />
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          <VisitsList
            visits={visits || []}
            onEditVisit={(visit) => handleEditVisit(visit.id)}
            onUpdateStatus={(visit, status) =>
              handleUpdateVisitStatus(visit.id, status)
            }
            onDeleteVisit={handleDeleteVisit}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
