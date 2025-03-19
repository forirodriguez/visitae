//src/components/admin/calendar/visit-detail-component.tsx
"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Visit, VisitStatus } from "@/types/visits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  User,
  Calendar,
  MapPin,
  Video,
  Mail,
  Phone,
  ClipboardList,
  Pencil,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface VisitDetailComponentProps {
  visit?: Visit | null;
  onEditVisit?: (visit: Visit) => void;
  onUpdateStatus?: (visit: Visit, newStatus: VisitStatus) => void;
  className?: string;
}

export default function VisitDetailComponent({
  visit,
  onEditVisit,
  onUpdateStatus,
  className,
}: VisitDetailComponentProps) {
  if (!visit) {
    return (
      <div
        className={cn(
          "h-full flex flex-col items-center justify-center p-6 text-center",
          className
        )}
      >
        <ClipboardList className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">
          Ninguna visita seleccionada
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Seleccione una visita para ver los detalles
        </p>
      </div>
    );
  }

  // Obtener color según el estado de la visita
  const getStatusColor = (status: VisitStatus) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "confirmada":
        return "bg-green-50 text-green-800 border-green-200";
      case "completada":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "cancelada":
        return "bg-red-50 text-red-800 border-red-200";
    }
  };

  return (
    <div className={cn("h-full overflow-auto", className)}>
      <div className="space-y-4">
        {/* Estado de la visita */}
        <div className="flex justify-between items-center">
          <Badge
            className={cn(getStatusColor(visit.status), "text-xs px-2 py-1")}
          >
            {visit.status === "pendiente" && "Pendiente"}
            {visit.status === "confirmada" && "Confirmada"}
            {visit.status === "completada" && "Completada"}
            {visit.status === "cancelada" && "Cancelada"}
          </Badge>
          <div className="text-sm text-muted-foreground">
            ID: {visit.id.substring(0, 8)}
          </div>
        </div>

        {/* Propiedad */}
        <div className="bg-muted/40 rounded-lg p-3 flex items-start gap-3">
          {visit.propertyImage && (
            <div className="relative h-16 w-20 rounded overflow-hidden shrink-0">
              <Image
                src={visit.propertyImage}
                alt={visit.propertyTitle}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h4 className="font-medium mb-1 text-sm">Propiedad</h4>
            <p className="text-sm">{visit.propertyTitle}</p>
          </div>
        </div>

        {/* Fecha y hora */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Fecha y hora</h4>
            <p className="text-sm text-muted-foreground">
              {format(
                visit.date instanceof Date ? visit.date : new Date(visit.date),
                "EEEE d 'de' MMMM",
                { locale: es }
              )}
            </p>
            <p className="text-sm text-muted-foreground">{visit.time}</p>
          </div>
        </div>

        {/* Tipo de visita */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-full",
              visit.type === "presencial" ? "bg-blue-100" : "bg-teal-100"
            )}
          >
            {visit.type === "presencial" ? (
              <MapPin className="h-4 w-4 text-blue-600" />
            ) : (
              <Video className="h-4 w-4 text-teal-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-sm">Tipo de visita</h4>
            <p className="text-sm text-muted-foreground">
              {visit.type === "presencial"
                ? "Visita presencial"
                : "Videollamada"}
            </p>
          </div>
        </div>

        <Separator />

        {/* Cliente */}
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <User className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Cliente</h4>
            <p className="text-sm">{visit.clientName}</p>
          </div>
        </div>

        {/* Contacto */}
        <div className="bg-muted/40 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Link
              href={`mailto:${visit.clientEmail}`}
              className="text-sm hover:underline text-primary"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />

              {visit.clientEmail}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`tel:${visit.clientPhone}`}
              className="text-sm hover:underline text-primary"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              {visit.clientPhone}
            </Link>
          </div>
        </div>

        {/* Agente (si existe) */}
        {visit.agentId && (
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <User className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Agente asignado</h4>
              <p className="text-sm text-muted-foreground">
                ID: {visit.agentId}
              </p>
            </div>
          </div>
        )}

        {/* Notas (si existen) */}
        {visit.notes && (
          <div className="bg-muted/40 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-1">Notas</h4>
            <p className="text-sm whitespace-pre-line">{visit.notes}</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-2 pt-2">
          {onEditVisit && (
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={() => onEditVisit(visit)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Editar visita
            </Button>
          )}

          {/* Botones de cambio de estado */}
          {onUpdateStatus && (
            <div className="grid grid-cols-2 gap-2 w-full">
              {visit.status === "pendiente" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                    onClick={() => onUpdateStatus(visit, "confirmada")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onUpdateStatus(visit, "cancelada")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
              {visit.status === "confirmada" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => onUpdateStatus(visit, "completada")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completada
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onUpdateStatus(visit, "cancelada")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
