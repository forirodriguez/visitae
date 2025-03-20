"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Visit, VisitStatus } from "@/types/visits";
import {
  useVisitCalendarEvents,
  useFilteredVisits,
  useVisitOperations,
} from "@/hooks/useVisits";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import VisitDialog from "./visit-dialog";
import CalendarComponent from "./calendar-component";
import VisitsList from "./visits-list";

interface CalendarContainerProps {
  visits?: Visit[];
  onAddVisit?: (date?: Date) => void;
  onEditVisit?: (visitId: string) => void;
  onUpdateVisitStatus?: (visitId: string, status: VisitStatus) => Promise<void>;
  onDeleteVisit?: (visitId: string) => void | Promise<void>;
  isLoading?: boolean;
}

export default function CalendarContainer({
  visits: externalVisits,
  onAddVisit,
  onEditVisit,
  onUpdateVisitStatus,
  onDeleteVisit,
  isLoading: externalLoading = false,
}: CalendarContainerProps) {
  // Estado para la fecha actual del calendario y fecha seleccionada
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Estado para el diálogo de visitas
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<Visit | null>(null);

  // Configurar el rango de fechas para solicitar eventos del calendario
  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  const startDateStr = format(firstDay, "yyyy-MM-dd");
  const endDateStr = format(lastDay, "yyyy-MM-dd");

  // Gestionar visitas - usando las provistas externamente o fetcheando propias
  const {
    data: calendarEvents = [],
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useVisitCalendarEvents(startDateStr, endDateStr);

  // Obtener visitas específicas para el día seleccionado si no se proporcionan externamente
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const {
    visits: dayVisits = [],
    loading: dayVisitsLoading,
    error: dayVisitsError,
    updateFilters,
  } = useFilteredVisits({
    startDate: selectedDateStr,
    endDate: selectedDateStr,
  });

  // Operaciones CRUD para visitas
  const {
    createVisit,
    updateVisit,
    updateVisitStatus,
    deleteVisit,
    isLoading: operationsLoading,
  } = useVisitOperations();

  // Convertir eventos del calendario a formato Visit si no hay visitas externas
  const monthVisits =
    externalVisits ||
    calendarEvents.map((event) => ({
      id: event.id,
      propertyId: event.property.id,
      propertyTitle: event.property.title,
      propertyImage: event.property.image,
      clientName: event.client.name,
      clientEmail: event.client.email,
      clientPhone: event.client.phone,
      date: new Date(event.start),
      time: format(new Date(event.start), "HH:mm"),
      type: event.type,
      status: event.status,
      notes: event.notes,
      agentId: event.agentId,
    }));

  // Filtrar visitas para el día seleccionado usando isSameDay para mayor precisión
  const selectedDayVisits = externalVisits
    ? externalVisits.filter((visit) => {
        // Formatear ambas fechas como yyyy-MM-dd para comparar solo por día
        const visitDateStr =
          visit.date instanceof Date
            ? format(visit.date, "yyyy-MM-dd")
            : format(new Date(visit.date), "yyyy-MM-dd");
        const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

        // Comparar los strings de fecha
        return visitDateStr === selectedDateStr;
      })
    : dayVisits;

  // Cambiar al mes anterior
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  // Cambiar al mes siguiente
  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  // Manejador para seleccionar fecha
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (!externalVisits) {
      updateFilters({
        startDate: format(date, "yyyy-MM-dd"),
        endDate: format(date, "yyyy-MM-dd"),
      });
    }
  };

  // Actualizar visitas cada vez que cambia el mes o la fecha seleccionada
  useEffect(() => {
    if (!externalVisits) {
      refetchEvents();
      updateFilters({
        startDate: selectedDateStr,
        endDate: selectedDateStr,
      });
    }
  }, [
    currentMonth,
    selectedDateStr,
    externalVisits,
    refetchEvents,
    updateFilters,
  ]);

  // Manejador para añadir visita
  const handleAddVisit = () => {
    if (onAddVisit) {
      onAddVisit(selectedDate);
    } else {
      setVisitToEdit(null);
      setDialogOpen(true);
    }
  };

  // Manejador para editar visita
  const handleEditVisit = (visitId: string) => {
    if (onEditVisit) {
      onEditVisit(visitId);
    } else {
      // Buscar la visita en los datos
      const visit =
        selectedDayVisits.find((v) => v.id === visitId) ||
        monthVisits.find((v) => v.id === visitId);

      if (visit) {
        setVisitToEdit(visit);
        setDialogOpen(true);
      }
    }
  };

  // Manejador para guardar visita (nueva o editada)
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

      // Cerrar diálogo
      setDialogOpen(false);

      // Actualizar datos - siempre refrescar para ver los cambios
      if (onAddVisit || onEditVisit) {
        // Si hay manejadores externos, debemos avisar que los datos podrían haber cambiado
        // pero sin causar navegación
        if (onUpdateVisitStatus) {
          // Truco para forzar recarga de datos sin navegación
          onUpdateVisitStatus(visitData.id, visitData.status);
        }
      } else {
        // Usar lógica interna de actualización
        refetchEvents();
        updateFilters({
          startDate: selectedDateStr,
          endDate: selectedDateStr,
        });
      }
    } catch (error) {
      console.error("Error al guardar la visita:", error);
      toast.error("No se pudo guardar la visita");
    }
  };

  // Manejador para actualizar estado de visita
  const handleUpdateVisitStatus = async (
    visit: Visit,
    newStatus: VisitStatus
  ) => {
    try {
      if (onUpdateVisitStatus) {
        await onUpdateVisitStatus(visit.id, newStatus);
      } else {
        await updateVisitStatus(visit.id, newStatus);
        toast.success(`Estado de visita actualizado a ${newStatus}`);

        // Actualizar datos solo si usamos datos internos
        if (!externalVisits) {
          refetchEvents();
          updateFilters({
            startDate: selectedDateStr,
            endDate: selectedDateStr,
          });
        }
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("No se pudo actualizar el estado de la visita");
    }
  };

  // Manejador para eliminar visita
  const handleDeleteVisit = async (visitId: string) => {
    try {
      if (onDeleteVisit) {
        await onDeleteVisit(visitId);
      } else {
        await deleteVisit(visitId);
        toast.success("Visita eliminada correctamente");

        // Actualizar datos solo si usamos datos internos
        if (!externalVisits) {
          refetchEvents();
          updateFilters({
            startDate: selectedDateStr,
            endDate: selectedDateStr,
          });
        }
      }
    } catch (error) {
      console.error("Error al eliminar visita:", error);
      toast.error("No se pudo eliminar la visita");
    }
  };

  // Mostrar error si hay alguno
  useEffect(() => {
    if (eventsError || dayVisitsError) {
      const errorMessage = "Error al cargar los datos de visitas";
      console.error(errorMessage, { eventsError, dayVisitsError });
      toast.error(errorMessage);
    }
  }, [eventsError, dayVisitsError]);

  // Determinar si hay carga en curso
  const isLoadingData =
    externalLoading || eventsLoading || dayVisitsLoading || operationsLoading;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold tracking-tight">Agenda</h2>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              disabled={isLoadingData}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="mx-2 font-medium">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              disabled={isLoadingData}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={handleAddVisit}
          className="bg-blue-800 hover:bg-blue-900"
          disabled={isLoadingData}
        >
          {isLoadingData ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Añadir visita
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        {/* Calendario */}
        <Card>
          <CardContent className="p-4">
            {isLoadingData ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <CalendarComponent
                visits={monthVisits}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                currentMonth={currentMonth}
              />
            )}
          </CardContent>
        </Card>

        {/* Lista de visitas para la fecha seleccionada */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">
              Visitas para el{" "}
              {selectedDate.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {/* Mostrar contador de visitas para depuración */}
              <span className="text-xs text-muted-foreground">
                ({selectedDayVisits.length})
              </span>
            </h3>
            {isLoadingData ? (
              <div className="flex justify-center items-center h-[450px]">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : selectedDayVisits.length > 0 ? (
              <VisitsList
                visits={selectedDayVisits}
                onEditVisit={(visit) => handleEditVisit(visit.id)}
                onUpdateStatus={handleUpdateVisitStatus}
                onDeleteVisit={handleDeleteVisit}
                isLoading={isLoadingData}
              />
            ) : (
              <div className="h-[450px] flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No hay visitas programadas para esta fecha
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para crear/editar visitas */}
      <VisitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        existingVisit={visitToEdit}
        onSave={handleSaveVisit}
      />
    </div>
  );
}
