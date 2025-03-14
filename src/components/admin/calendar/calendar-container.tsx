"use client";

import { useState, useEffect } from "react";
import CalendarComponent from "./calendar-component";
import VisitList from "./visits-list";
import VisitDialog from "./visit-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Visit, VisitStatus } from "@/types/visits";
import { mockVisits } from "@/lib/mock-data/visits";

interface CalendarContainerProps {
  visits?: Visit[];
  onAddVisit?: () => void;
  onEditVisit?: (visit: Visit) => void;
  onUpdateVisitStatus?: (visit: Visit, newStatus: VisitStatus) => void;
}

export default function CalendarContainer({
  visits = mockVisits, // Usa los datos mock por defecto si no se proporcionan visitas
  onAddVisit,
  onEditVisit,
  onUpdateVisitStatus,
}: CalendarContainerProps) {
  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Estado para las visitas filtradas por fecha seleccionada
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);

  // Estado para el diálogo de añadir/editar visita
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<Visit | null>(null);

  // Filtra las visitas cuando cambia la fecha seleccionada o las visitas
  useEffect(() => {
    if (!visits) return;

    const filtered = visits.filter((visit) => {
      const visitDate =
        visit.date instanceof Date ? visit.date : new Date(visit.date);
      return (
        visitDate.getDate() === selectedDate.getDate() &&
        visitDate.getMonth() === selectedDate.getMonth() &&
        visitDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    setFilteredVisits(filtered);
  }, [selectedDate, visits]);

  // Manejador para añadir visita
  const handleAddVisit = () => {
    if (onAddVisit) {
      onAddVisit();
    } else {
      setVisitToEdit(null);
      setDialogOpen(true);
    }
  };

  // Manejador para editar visita
  const handleEditVisit = (visit: Visit) => {
    if (onEditVisit) {
      onEditVisit(visit);
    } else {
      setVisitToEdit(visit);
      setDialogOpen(true);
    }
  };

  // Manejador para actualizar estado de visita
  const handleUpdateVisitStatus = (visit: Visit, status: VisitStatus) => {
    if (onUpdateVisitStatus) {
      onUpdateVisitStatus(visit, status);
    }
    // Si no hay manejador externo, se podría implementar aquí la lógica para actualizar
  };

  // Manejador para guardar visita (nueva o editada)
  const handleSaveVisit = (visitData: Visit) => {
    // Aquí iría la lógica para guardar la visita
    console.log("Guardar visita:", visitData);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Agenda</h2>
        <Button
          onClick={handleAddVisit}
          className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Añadir visita
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        {/* Calendario */}
        <Card className="p-4">
          {/* Asegúrate de pasar todos los props necesarios, incluyendo selectedDate */}
          <CalendarComponent
            visits={visits}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </Card>

        {/* Lista de visitas para la fecha seleccionada */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">
            Visitas para el{" "}
            {selectedDate.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>
          <VisitList
            visits={filteredVisits}
            onEditVisit={handleEditVisit}
            onUpdateStatus={handleUpdateVisitStatus}
          />
        </Card>
      </div>

      {/* Diálogo para agregar/editar visitas */}
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
