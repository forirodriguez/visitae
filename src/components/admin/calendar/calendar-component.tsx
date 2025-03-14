//src/components/admin/calendar/calendar-component.tsx
"use client";

import { useEffect, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
  getDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Visit } from "@/types/visits";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarComponentProps {
  visits: Visit[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  className?: string;
}

export default function CalendarComponent({
  visits,
  onDateSelect,
  selectedDate,
  className,
}: CalendarComponentProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Agrupar visitas por fecha
  const visitsByDate = visits.reduce<Record<string, Visit[]>>((acc, visit) => {
    const dateKey = format(visit.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(visit);
    return acc;
  }, {});

  // Obtener días del mes actual
  const daysInMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Obtener el primer día del mes (0 = Domingo, 1 = Lunes, etc.)
    let firstDay = getDay(monthStart);
    // Ajustar para que la semana comience en lunes (0 = Lunes, 6 = Domingo)
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Añadir días en blanco al principio para alinear correctamente
    const blanks = Array(firstDay).fill(null);

    return [...blanks, ...days];
  };

  // Navegación del calendario
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  useEffect(() => {
    // Si la fecha seleccionada no está en el mes actual, actualizar el mes
    if (!isSameMonth(selectedDate, currentMonth)) {
      setCurrentMonth(selectedDate);
    }
  }, [currentMonth, selectedDate]);

  // Días de la semana (lunes a domingo)
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Encabezado del calendario */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            aria-label="Mes anterior"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            aria-label="Mes siguiente"
            className="ml-1 h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-3 capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToToday}
          className="text-sm"
        >
          Hoy
        </Button>
      </div>

      {/* Cuadrícula del calendario */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-px bg-muted">
            {weekDays.map((day) => (
              <div key={day} className="text-center py-2 text-sm font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-px auto-rows-fr bg-muted">
            {daysInMonth().map((day, index) => {
              if (!day) {
                return <div key={`blank-${index}`} className="bg-background" />;
              }

              const dateKey = format(day, "yyyy-MM-dd");
              const visitsForDay = visitsByDate[dateKey] || [];
              const isSelected = isSameDay(day, selectedDate);
              const dayIsToday = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <div
                  key={dateKey}
                  className={cn(
                    "relative min-h-[80px] p-1 bg-background transition-colors",
                    !isCurrentMonth && "text-muted-foreground opacity-50",
                    dayIsToday && "bg-accent/10",
                    isSelected && "ring-2 ring-primary ring-inset",
                    "hover:bg-accent/10 cursor-pointer"
                  )}
                  onClick={() => onDateSelect(day)}
                >
                  {/* Número del día */}
                  <div className="flex justify-between items-start">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center h-6 w-6 text-sm rounded-full",
                        dayIsToday &&
                          "bg-primary text-primary-foreground font-medium"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>

                  {/* Indicador de visitas */}
                  {visitsForDay.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="mt-2 flex items-center justify-center">
                            <div
                              className={cn(
                                "text-xs font-medium px-1.5 py-0.5 rounded-full",
                                "bg-primary/10 text-primary"
                              )}
                            >
                              {visitsForDay.length}{" "}
                              {visitsForDay.length === 1 ? "visita" : "visitas"}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium mb-1">
                              Visitas programadas:
                            </p>
                            <ul className="space-y-1">
                              {visitsForDay.slice(0, 3).map((visit) => (
                                <li key={visit.id} className="flex gap-1">
                                  <span className="font-medium">
                                    {visit.time}
                                  </span>
                                  <span> - {visit.clientName}</span>
                                </li>
                              ))}
                              {visitsForDay.length > 3 && (
                                <li className="text-muted-foreground">
                                  Y {visitsForDay.length - 3} más...
                                </li>
                              )}
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
