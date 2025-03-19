"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import CalendarComponent from "./calendar-component";
import VisitList from "./visits-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Visit, VisitStatus } from "@/types/visits";
import {
  useVisitCalendarEvents,
  useFilteredVisits,
  useVisitOperations,
} from "@/hooks/useVisits";
import { toast } from "sonner";

interface CalendarContainerProps {
  visits?: Visit[];
  onAddVisit?: (date?: Date) => void;
  onEditVisit?: (visitId: string) => void;
  onUpdateVisitStatus?: (
    visit: Visit,
    newStatus: VisitStatus
  ) => Promise<void> | void;
  onDeleteVisit?: (visitId: string) => void;
  isLoading?: boolean;
}

export default function CalendarContainer({
  visits = [],
  onAddVisit,
  onEditVisit,
  onUpdateVisitStatus,
  onDeleteVisit,
  isLoading: externalLoading = false,
}: CalendarContainerProps) {
  // Estado para la fecha actual del calendario y fecha seleccionada
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Configurar el rango de fechas para solicitar eventos del calendario
  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);

  // Obtener eventos del calendario usando React Query
  const {
    data: calendarEvents = [],
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useVisitCalendarEvents(
    format(firstDay, "yyyy-MM-dd"),
    format(lastDay, "yyyy-MM-dd")
  );

  // Obtener visitas filtradas por fecha seleccionada
  const {
    visits: filteredVisits,
    loading: visitsLoading,
    error: visitsError,
    updateFilters,
  } = useFilteredVisits({
    startDate: format(selectedDate, "yyyy-MM-dd"),
    endDate: format(selectedDate, "yyyy-MM-dd"),
  });

  // Operaciones CRUD para visitas
  const {
    updateVisitStatus,
    deleteVisit,
    isLoading: operationsLoading,
  } = useVisitOperations();

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
    updateFilters({
      startDate: format(date, "yyyy-MM-dd"),
      endDate: format(date, "yyyy-MM-dd"),
    });
  };

  // Manejador para añadir visita
  const handleAddVisit = () => {
    if (onAddVisit) {
      onAddVisit(selectedDate);
    } else {
      // Implementación por defecto si no se proporciona
      console.log("Añadir visita para:", format(selectedDate, "yyyy-MM-dd"));
    }
  };

  // Manejador para editar visita
  const handleEditVisit = (visitId: string) => {
    if (onEditVisit) {
      onEditVisit(visitId);
    } else {
      // Implementación por defecto si no se proporciona
      console.log("Editar visita:", visitId);
    }
  };

  // Manejador para actualizar estado de visita
  const handleUpdateVisitStatus = async (
    visitId: string,
    newStatus: VisitStatus
  ) => {
    try {
      if (onUpdateVisitStatus) {
        const visit = filteredVisits.find((v) => v.id === visitId);
        if (visit) {
          await onUpdateVisitStatus(visit, newStatus);
        }
      } else {
        await updateVisitStatus(visitId, newStatus);
        toast.success(`Estado de visita actualizado a ${newStatus}`);
      }

      // Actualizar datos
      refetchEvents();
      updateFilters({
        startDate: format(selectedDate, "yyyy-MM-dd"),
        endDate: format(selectedDate, "yyyy-MM-dd"),
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("No se pudo actualizar el estado de la visita");
    }
  };

  // Manejador para eliminar visita
  const handleDeleteVisit = async (visitId: string) => {
    try {
      if (onDeleteVisit) {
        onDeleteVisit(visitId);
      } else {
        if (
          confirm(
            "¿Está seguro de que desea eliminar esta visita? Esta acción no se puede deshacer."
          )
        ) {
          await deleteVisit(visitId);
          toast.success("Visita eliminada correctamente");

          // Actualizar datos
          refetchEvents();
          updateFilters({
            startDate: format(selectedDate, "yyyy-MM-dd"),
            endDate: format(selectedDate, "yyyy-MM-dd"),
          });
        }
      }
    } catch (error) {
      console.error("Error al eliminar visita:", error);
      toast.error("No se pudo eliminar la visita");
    }
  };

  // Mostrar error si hay alguno
  if (eventsError || visitsError) {
    const errorMessage = "Error al cargar los datos de visitas";
    console.error(errorMessage, { eventsError, visitsError });
    toast.error(errorMessage);
  }

  // Determinar si hay carga en curso
  const isLoadingData =
    externalLoading || eventsLoading || visitsLoading || operationsLoading;

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
              {format(currentMonth, "MMMM yyyy", {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                locale: require("date-fns/locale/es"),
              })}
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
                visits={
                  visits.length > 0
                    ? visits
                    : calendarEvents.map((event) => ({
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
                      }))
                }
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
            </h3>
            {isLoadingData ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredVisits && filteredVisits.length > 0 ? (
              <VisitList
                visits={filteredVisits}
                onEditVisit={(visit) => handleEditVisit(visit.id)}
                onUpdateStatus={(visit, status) =>
                  handleUpdateVisitStatus(visit.id, status)
                }
                onDeleteVisit={handleDeleteVisit}
                isLoading={isLoadingData}
              />
            ) : (
              <p className="text-center text-muted-foreground py-6">
                No hay visitas programadas para esta fecha
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
