//src/components/admin/calendar/daily-visits-list.tsx
"use client";

import { Visit } from "@/types/visits";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DailyVisitsListProps {
  visits: Visit[];
  selectedDate: Date;
  selectedVisit: Visit | null;
  onSelectVisit: (visit: Visit) => void;
}

export default function DailyVisitsList({
  visits,
  selectedDate,
  selectedVisit,
  onSelectVisit,
}: DailyVisitsListProps) {
  // Ordenar visitas por hora
  const sortedVisits = [...visits].sort((a, b) => a.time.localeCompare(b.time));

  if (visits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
        <h4 className="text-base font-medium mb-1">
          No hay visitas programadas
        </h4>
        <p className="text-sm text-muted-foreground">
          {format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        {format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
      </div>

      {sortedVisits.map((visit) => (
        <div
          key={visit.id}
          className={cn(
            "border rounded-lg p-3 cursor-pointer transition-colors",
            selectedVisit?.id === visit.id
              ? "border-primary bg-primary/5"
              : "hover:bg-muted/50"
          )}
          onClick={() => onSelectVisit(visit)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium line-clamp-1">
              {visit.propertyTitle}
            </div>
            <Badge
              variant="outline"
              className={cn(
                visit.status === "pendiente" &&
                  "bg-yellow-50 text-yellow-800 border-yellow-200",
                visit.status === "confirmada" &&
                  "bg-green-50 text-green-800 border-green-200",
                visit.status === "completada" &&
                  "bg-blue-50 text-blue-800 border-blue-200",
                visit.status === "cancelada" &&
                  "bg-red-50 text-red-800 border-red-200"
              )}
            >
              {visit.status}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {visit.time}
            </div>
            <div className="flex items-center">
              {visit.type === "presencial" ? (
                <MapPin className="h-4 w-4 mr-1" />
              ) : (
                <Video className="h-4 w-4 mr-1" />
              )}
              {visit.type === "presencial" ? "Presencial" : "Videollamada"}
            </div>
          </div>

          <div className="mt-1 text-sm line-clamp-1">{visit.clientName}</div>
        </div>
      ))}
    </div>
  );
}
