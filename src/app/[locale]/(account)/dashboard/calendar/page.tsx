"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List } from "lucide-react";
import CalendarContainer from "@/components/admin/calendar/calendar-container";
import VisitsList from "@/components/admin/calendar/visits-list";
import { useFilteredVisits, useVisitOperations } from "@/hooks/useVisits";
import { Visit, VisitStatus } from "@/types/visits";
import { toast } from "sonner";
import VisitDialog from "@/components/admin/calendar/visit-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CalendarPage() {
  // Obtener todas las visitas pendientes y confirmadas
  const {
    visits,
    loading: visitsLoading,
    error: visitsError,
    updateFilters,
  } = useFilteredVisits({
    status: "pendiente,confirmada",
  });

  // Operaciones de visitas
  const {
    createVisit,
    updateVisit,
    updateVisitStatus,
    deleteVisit,
    isLoading: operationsLoading,
  } = useVisitOperations();

  // Estado para diálogos
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState<string | null>(null);
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<Visit | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Manejar la creación de una nueva visita
  const handleAddVisit = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    setVisitToEdit(null);
    setVisitDialogOpen(true);
  };

  // Manejar la edición de una visita existente
  const handleEditVisit = (visitId: string) => {
    const visit = visits?.find((v) => v.id === visitId);
    if (visit) {
      setVisitToEdit(visit);
      setVisitDialogOpen(true);
    }
  };

  // Guardar visita (nueva o editada)
  const handleSaveVisit = async (visitData: Visit) => {
    try {
      if (visitToEdit) {
        // Actualizar visita existente
        await updateVisit(visitData.id, {
          propertyId: visitData.propertyId,
          date: visitData.date.toISOString().split("T")[0], // Formato YYYY-MM-DD
          time: visitData.time,
          type: visitData.type,
          status: visitData.status,
          notes: visitData.notes,
          clientId: "client-1", // Asumiendo un valor por defecto para pruebas
          agentId: visitData.agentId,
        });
        toast.success("Visita actualizada correctamente");
      } else {
        // Añadir nueva visita
        const result = await createVisit({
          propertyId: visitData.propertyId,
          date: visitData.date.toISOString().split("T")[0], // Formato YYYY-MM-DD
          time: visitData.time,
          type: visitData.type,
          status: visitData.status,
          notes: visitData.notes,
          clientId: "client-1", // Asumiendo un valor por defecto para pruebas
          agentId: visitData.agentId,
        });

        if (result && result.id) {
          toast.success("Visita programada correctamente");
        } else {
          toast.warning("Visita guardada pero con información incompleta");
        }
      }

      // Cerrar diálogo y refrescar datos
      setVisitDialogOpen(false);

      // Esperar un momento antes de refrescar los datos para dar tiempo al servidor
      setTimeout(() => {
        updateFilters({});
      }, 500);
    } catch (error) {
      console.error("Error al guardar la visita:", error);
      toast.error("No se pudo guardar la visita");
    }
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

  // Mostrar diálogo de confirmación para eliminar visita
  const handleConfirmDelete = (visitId: string) => {
    setVisitToDelete(visitId);
    setDeleteDialogOpen(true);
  };

  // Eliminar una visita
  const handleDeleteVisit = async () => {
    if (!visitToDelete) return;

    try {
      await deleteVisit(visitToDelete);
      toast.success("Visita eliminada correctamente");
      // Refrescar los datos
      updateFilters({});
    } catch (error) {
      console.error("Error al eliminar visita:", error);
      toast.error("No se pudo eliminar la visita");
    } finally {
      setDeleteDialogOpen(false);
      setVisitToDelete(null);
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
        <p className="text-muted-foreground mt-2">
          Programa y gestiona las visitas a propiedades
        </p>
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
            visits={visits || []}
            onAddVisit={handleAddVisit}
            onEditVisit={handleEditVisit}
            onUpdateVisitStatus={handleUpdateVisitStatus}
            onDeleteVisit={handleConfirmDelete}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          <VisitsList
            visits={visits || []}
            onEditVisit={(visit) => handleEditVisit(visit.id)}
            onUpdateStatus={(visit, status) =>
              handleUpdateVisitStatus(visit.id, status)
            }
            onDeleteVisit={handleConfirmDelete}
            isLoading={isLoading}
            showDate={true}
          />
        </TabsContent>
      </Tabs>

      {/* Diálogo de visitas */}
      <VisitDialog
        open={visitDialogOpen}
        onOpenChange={setVisitDialogOpen}
        selectedDate={selectedDate}
        existingVisit={visitToEdit}
        onSave={handleSaveVisit}
      />

      {/* Diálogo de confirmación para eliminar visita */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              visita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVisit}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
