//src/components/admin/calendar/calendar-component.tsx
"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { Visit } from "@/types/visits";
import { cn } from "@/lib/utils";

interface CalendarComponentProps {
  visits: Visit[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  currentMonth?: Date;
}

export default function CalendarComponent({
  visits = [],
  selectedDate,
  onDateSelect,
  currentMonth = new Date(),
}: CalendarComponentProps) {
  // Estado para la matriz de días a mostrar
  const [calendarDays, setCalendarDays] = useState<Date[][]>([]);

  // Actualizar la matriz de días cuando cambia el mes actual
  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: es });
    const endDate = endOfWeek(monthEnd, { locale: es });

    const rows: Date[][] = [];
    let days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(day);
        day = addDays(day, 1);
      }
      rows.push(days);
      days = [];
    }

    setCalendarDays(rows);
  }, [currentMonth]);

  // Función para determinar el número de visitas en un día específico
  const getVisitCountForDay = (day: Date): number => {
    return visits.filter((visit) => {
      const visitDate =
        visit.date instanceof Date ? visit.date : new Date(visit.date);
      return isSameDay(day, visitDate);
    }).length;
  };

  // Renderizar los días del calendario
  const renderDays = () => {
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  // Renderizar las celdas del calendario
  const renderCells = () => {
    return (
      <div>
        {calendarDays.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-7">
            {row.map((day, dayIndex) => {
              const visitCount = getVisitCountForDay(day);

              return (
                <div
                  key={`cell-${rowIndex}-${dayIndex}`}
                  className={cn(
                    "calendar-day h-14 border p-1 relative cursor-pointer transition-colors",
                    !isSameMonth(day, currentMonth) &&
                      "text-muted-foreground opacity-50",
                    isSameDay(day, selectedDate) && "selected",
                    isToday(day) && "border-blue-500"
                  )}
                  onClick={() => onDateSelect(day)}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={cn(
                        "text-right text-sm",
                        isToday(day) && "font-bold text-blue-600"
                      )}
                    >
                      {format(day, "d")}
                    </span>

                    {visitCount > 0 && (
                      <div className="mt-auto flex justify-center">
                        <span className="visits-indicator">{visitCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderDays()}
      {renderCells()}
    </div>
  );
}
