"use client";

import { useMemo } from "react";
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
  // Usamos useMemo para evitar recálculos innecesarios
  const { calendarDays, visitsByDay } = useMemo(() => {
    // Generar la matriz de días
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

    // Agregar visitas por día para acceso rápido
    const visitMap: Record<string, Visit[]> = {};

    visits.forEach((visit) => {
      const visitDate =
        visit.date instanceof Date ? visit.date : new Date(visit.date);
      const dateKey = format(visitDate, "yyyy-MM-dd");
      if (!visitMap[dateKey]) {
        visitMap[dateKey] = [];
      }
      visitMap[dateKey].push(visit);
    });

    return { calendarDays: rows, visitsByDay: visitMap };
  }, [currentMonth, visits]);

  // Los días de la semana como constante
  const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="w-full">
      {/* Cabecera de días de la semana */}
      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Celdas del calendario */}
      <div>
        {calendarDays.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-7">
            {row.map((day, dayIndex) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayVisits = visitsByDay[dateKey] || [];
              const visitCount = dayVisits.length;

              // Determinar si hay visitas por tipo
              const hasPresencialVisits = dayVisits.some(
                (v) => v.type === "presencial"
              );
              const hasVideoVisits = dayVisits.some(
                (v) => v.type === "videollamada"
              );

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
                        <span
                          className={cn(
                            "visits-indicator",
                            hasPresencialVisits &&
                              !hasVideoVisits &&
                              "bg-blue-100 text-blue-800",
                            hasVideoVisits &&
                              !hasPresencialVisits &&
                              "bg-teal-100 text-teal-800",
                            hasPresencialVisits &&
                              hasVideoVisits &&
                              "bg-purple-100 text-purple-800"
                          )}
                        >
                          {visitCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
