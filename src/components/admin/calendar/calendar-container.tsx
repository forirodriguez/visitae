//src/components/admin/calendar/calendar-container.tsx
"use client";

import { useState } from "react";
import { Visit, VisitStatus } from "@/types/visits";
import CalendarComponent from "./calendar-component";

import VisitDetailComponent from "./visit-detail-component";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DailyVisitsList from "./daily-visits-list";

interface CalendarContainerProps {
  visits: Visit[];
  onAddVisit?: () => void;
  onEditVisit?: (visit: Visit) => void;
  onUpdateVisitStatus?: (visit: Visit, newStatus: VisitStatus) => void;
  className?: string;
}

export default function CalendarContainer({
  visits,
  onAddVisit,
  onEditVisit,
  onUpdateVisitStatus,
  className,
}: CalendarContainerProps) {
  // Estados para seguimiento
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  // Manejadores de eventos
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedVisit(null); // Reset de la visita seleccionada al cambiar la fecha
  };

  const handleVisitSelect = (visit: Visit) => {
    setSelectedVisit(visit);
  };

  // Filtrar visitas para la fecha seleccionada
  const visitsForSelectedDate = visits.filter((visit) => {
    const visitDate =
      visit.date instanceof Date ? visit.date : new Date(visit.date);

    return (
      visitDate.getDate() === selectedDate.getDate() &&
      visitDate.getMonth() === selectedDate.getMonth() &&
      visitDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {/* Sección 1: Calendario de Visitas */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-950 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Calendario de Visitas</h3>
          {onAddVisit && (
            <Button size="sm" onClick={onAddVisit}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Seleccione una fecha para ver las visitas programadas
        </p>
        <CalendarComponent
          visits={visits}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* Sección 2: Visitas del día */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-950 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Visitas del día</h3>

        <DailyVisitsList
          visits={visitsForSelectedDate}
          onSelectVisit={handleVisitSelect}
          selectedVisit={selectedVisit}
          selectedDate={selectedDate}
        />
      </div>

      {/* Sección 3: Detalles de la visita */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-950 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Detalles de la visita</h3>

        <VisitDetailComponent
          visit={selectedVisit}
          onEditVisit={onEditVisit}
          onUpdateStatus={onUpdateVisitStatus}
        />
      </div>
    </div>
  );
}
