"use client";

import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Visit } from "@/types/visits";
import { cn } from "@/lib/utils";

interface CalendarProps {
  visits: Visit[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function CalendarComponent({
  visits = [], // valor por defecto para evitar errores si visits es undefined
  selectedDate = new Date(), // valor por defecto para evitar errores si selectedDate es undefined
  onDateSelect,
}: CalendarProps) {
  // Verificación de seguridad para evitar el error
  if (!selectedDate) {
    selectedDate = new Date(); // Asignar fecha actual si selectedDate es undefined
  }

  // Obtener información del mes actual
  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  );
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = domingo, 1 = lunes, etc.

  // Ajustar para que la semana empiece en lunes (0 = lunes, 6 = domingo)
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const totalDaysToShow = daysInMonth + adjustedStartDay;
  const totalWeeks = Math.ceil(totalDaysToShow / 7);

  // Navegación entre meses
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateSelect(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateSelect(newDate);
  };

  const goToToday = () => {
    onDateSelect(new Date());
  };

  // Calcular visitas por día
  const getVisitsForDay = (day: number): Visit[] => {
    if (!visits || !Array.isArray(visits)) return [];

    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day
    );

    return visits.filter((visit) => {
      if (!visit || !visit.date) return false;

      const visitDate =
        visit.date instanceof Date ? visit.date : new Date(visit.date);

      return (
        visitDate.getDate() === date.getDate() &&
        visitDate.getMonth() === date.getMonth() &&
        visitDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Dibujar el calendario
  const days = Array.from({ length: totalWeeks * 7 }, (_, i) => {
    const day = i - adjustedStartDay + 1;
    const isCurrentMonth = day > 0 && day <= daysInMonth;
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day
    );
    const isSelected =
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
    const dayVisits = isCurrentMonth ? getVisitsForDay(day) : [];

    return {
      day,
      isCurrentMonth,
      isTodayDate: isToday(date),
      isSelected,
      date,
      visits: dayVisits,
    };
  });

  // Nombres de los días de la semana (empezando en lunes)
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <div className="w-full">
      {/* Cabecera del calendario */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">
          {format(selectedDate, "MMMM yyyy", { locale: es })}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Mes anterior</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={goToToday}
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Mes siguiente</span>
          </Button>
        </div>
      </div>

      {/* Calendario */}
      <div className="w-full overflow-hidden rounded-lg border border-border bg-background shadow-sm">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="h-10 text-center text-xs font-medium text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day, index) => (
            <div
              key={index}
              className={cn(
                "relative border border-border/50 p-1 text-center calendar-day",
                !day.isCurrentMonth && "text-muted-foreground opacity-50",
                day.isSelected && "selected",
                (index + 1) % 7 === 0 && "border-r",
                index >= days.length - 7 && "border-b"
              )}
              onClick={() => {
                if (day.isCurrentMonth) {
                  onDateSelect(day.date);
                }
              }}
            >
              <div
                className={cn(
                  "flex h-full flex-col items-center justify-start pt-1",
                  day.isCurrentMonth ? "cursor-pointer" : "pointer-events-none"
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 place-content-center rounded-full text-xs",
                    day.isTodayDate &&
                      "bg-primary text-primary-foreground font-medium",
                    day.isSelected && !day.isTodayDate && "bg-muted font-medium"
                  )}
                >
                  {day.isCurrentMonth ? day.day : ""}
                </span>

                {/* Indicador de visitas */}
                {day.visits && day.visits.length > 0 && (
                  <span
                    className={cn(
                      "visits-indicator mt-1",
                      day.visits.some((v) => v.type === "videollamada") &&
                        "text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/20",
                      day.visits.every((v) => v.type === "presencial") &&
                        "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20"
                    )}
                  >
                    {day.visits.length}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
