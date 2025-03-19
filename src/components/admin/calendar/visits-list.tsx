"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Pencil, MoreVertical, MapPin, Video, Loader2 } from "lucide-react";
import { Visit, VisitStatus } from "@/types/visits";
import { format } from "date-fns";

interface VisitListProps {
  visits: Visit[];
  onEditVisit: (visit: Visit) => void;
  onUpdateStatus: (visit: Visit, newStatus: VisitStatus) => Promise<void>;
  onDeleteVisit?: (visitId: string) => void | Promise<void>; // Modificado para aceptar ambos tipos
  isLoading?: boolean;
  showDate?: boolean;
}

export default function VisitsList({
  visits,
  onEditVisit,
  onUpdateStatus,
  onDeleteVisit,
  isLoading = false,
  showDate = false,
}: VisitListProps) {
  // Estado para el diálogo de confirmación de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);
  // Estado para controlar qué visita está cambiando su estado
  const [processingVisit, setProcessingVisit] = useState<string | null>(null);

  // Manejador para confirmar eliminación
  const handleConfirmDelete = async () => {
    if (visitToDelete && onDeleteVisit) {
      try {
        setProcessingVisit(visitToDelete.id);
        await onDeleteVisit(visitToDelete.id);
      } finally {
        setProcessingVisit(null);
        setVisitToDelete(null);
        setDeleteDialogOpen(false);
      }
    }
  };

  // Manejador para iniciar la eliminación
  const handleDeleteVisit = (visit: Visit) => {
    setVisitToDelete(visit);
    setDeleteDialogOpen(true);
  };

  // Manejador para actualizar estado
  const handleUpdateStatus = async (visit: Visit, newStatus: VisitStatus) => {
    try {
      setProcessingVisit(visit.id);
      await onUpdateStatus(visit, newStatus);
    } finally {
      setProcessingVisit(null);
    }
  };

  // Función para renderizar el estado de la visita
  const renderVisitStatus = (status: VisitStatus) => {
    switch (status) {
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        );
      case "confirmada":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Confirmada
          </Badge>
        );
      case "cancelada":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelada
          </Badge>
        );
      case "completada":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Completada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Ordenar las visitas por hora
  const sortedVisits = [...visits].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  return (
    <>
      {/* Contenedor con altura fija y scrollbar */}
      <div className="h-[450px] overflow-y-auto pr-2">
        <div className="space-y-3">
          {sortedVisits.map((visit) => (
            <div
              key={visit.id}
              className={`p-3 rounded-md border ${
                visit.status === "confirmada"
                  ? "visit-status-confirmed"
                  : visit.status === "pendiente"
                    ? "visit-status-pending"
                    : visit.status === "cancelada"
                      ? "visit-status-cancelled"
                      : "visit-status-completed"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{visit.propertyTitle}</div>
                  <div className="text-sm text-muted-foreground">
                    {showDate && (
                      <span className="mr-2">
                        {format(new Date(visit.date), "dd/MM/yyyy")} ·
                      </span>
                    )}
                    {visit.time}h ·{" "}
                    <span className="inline-flex items-center">
                      {visit.type === "presencial" ? (
                        <>
                          <MapPin className="h-3 w-3 mr-1" /> Presencial
                        </>
                      ) : (
                        <>
                          <Video className="h-3 w-3 mr-1" /> Videollamada
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {renderVisitStatus(visit.status)}

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      disabled={isLoading || processingVisit === visit.id}
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {processingVisit === visit.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEditVisit(visit)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar visita
                      </DropdownMenuItem>

                      {/* Estados disponibles según estado actual */}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>

                      {visit.status !== "pendiente" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(visit, "pendiente")}
                        >
                          Marcar como pendiente
                        </DropdownMenuItem>
                      )}

                      {visit.status !== "confirmada" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(visit, "confirmada")
                          }
                        >
                          Marcar como confirmada
                        </DropdownMenuItem>
                      )}

                      {visit.status !== "completada" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(visit, "completada")
                          }
                        >
                          Marcar como completada
                        </DropdownMenuItem>
                      )}

                      {visit.status !== "cancelada" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(visit, "cancelada")}
                        >
                          Marcar como cancelada
                        </DropdownMenuItem>
                      )}

                      {/* Opción de eliminar */}
                      {onDeleteVisit && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteVisit(visit)}
                          >
                            Eliminar visita
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="text-sm font-medium">{visit.clientName}</div>

              {visit.notes && (
                <div className="text-sm mt-2 text-muted-foreground">
                  <span className="font-medium">Notas:</span> {visit.notes}
                </div>
              )}
            </div>
          ))}

          {sortedVisits.length === 0 && !isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              No hay visitas programadas
            </div>
          )}
        </div>
      </div>
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta visita?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente
              esta visita programada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {processingVisit ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
