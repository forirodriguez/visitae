"use client";

import { Visit, VisitStatus } from "@/types/visits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Edit,
  Phone,
  User,
  Video,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VisitListProps {
  visits: Visit[];
  onEditVisit?: (visit: Visit) => void;
  onUpdateStatus?: (visit: Visit, status: VisitStatus) => void;
}

export default function VisitList({
  visits = [],
  onEditVisit,
  onUpdateStatus,
}: VisitListProps) {
  // Obtener las visitas ordenadas por hora
  const sortedVisits = [...visits].sort((a, b) => {
    const timeA = a.time.split(":").map(Number);
    const timeB = b.time.split(":").map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });

  // Función para formatear la hora
  const formatTime = (time: string) => {
    return time.replace(/:/g, ":");
  };

  // Obtener etiqueta según el estado
  const getStatusBadge = (status: VisitStatus) => {
    switch (status) {
      case "pendiente":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border-yellow-300 dark:border-yellow-800"
          >
            Pendiente
          </Badge>
        );
      case "confirmada":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 border-green-300 dark:border-green-800"
          >
            Confirmada
          </Badge>
        );
      case "cancelada":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 border-red-300 dark:border-red-800"
          >
            Cancelada
          </Badge>
        );
      case "completada":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 border-blue-300 dark:border-blue-800"
          >
            Completada
          </Badge>
        );
      default:
        return null;
    }
  };

  // Si no hay visitas para mostrar
  if (sortedVisits.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay visitas programadas para esta fecha
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedVisits.map((visit) => (
        <Card
          key={visit.id}
          className={cn(
            "p-3 border-l-4 relative",
            visit.status === "pendiente" && "visit-status-pending",
            visit.status === "confirmada" && "visit-status-confirmed",
            visit.status === "cancelada" && "visit-status-cancelled",
            visit.status === "completada" && "visit-status-completed",
            visit.type === "videollamada"
              ? "video-call-event"
              : "in-person-event"
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{formatTime(visit.time)}</span>
                {getStatusBadge(visit.status)}
                {visit.type === "videollamada" ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Video className="h-3 w-3" />
                    <span>Video</span>
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <User className="h-3 w-3" />
                    <span>Presencial</span>
                  </Badge>
                )}
              </div>
              <h4 className="font-medium">{visit.propertyTitle}</h4>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <User className="h-3 w-3" />
                <span>{visit.clientName}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{visit.clientPhone}</span>
              </div>
              {visit.notes && (
                <p className="text-sm mt-2 text-muted-foreground">
                  {visit.notes}
                </p>
              )}
            </div>
            <div className="flex">
              {onEditVisit && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onEditVisit(visit)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
              )}
            </div>
          </div>

          {/* Acciones según el estado actual */}
          {onUpdateStatus && (
            <div className="mt-3 flex gap-2 justify-end">
              {visit.status === "pendiente" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => onUpdateStatus(visit, "confirmada")}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Confirmar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs text-red-600 hover:text-red-700"
                    onClick={() => onUpdateStatus(visit, "cancelada")}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                </>
              )}

              {visit.status === "confirmada" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => onUpdateStatus(visit, "completada")}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs text-red-600 hover:text-red-700"
                    onClick={() => onUpdateStatus(visit, "cancelada")}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                </>
              )}

              {(visit.status === "cancelada" ||
                visit.status === "completada") && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => onUpdateStatus(visit, "pendiente")}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Reabrir
                </Button>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
