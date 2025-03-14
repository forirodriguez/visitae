//src/components/admin/calendar/simple-day-picker.tsx
"use client";

import { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  getDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimpleDatePickerProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  initialFocus?: boolean;
  className?: string;
}

export default function SimpleDatePicker({
  selected,
  onSelect,
  disabled,
  className,
}: SimpleDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  // Actualizar el mes actual cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selected && !isSameMonth(selected, currentMonth)) {
      setCurrentMonth(selected);
    }
  }, [selected, currentMonth]);

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

  // Días de la semana (lunes a domingo)
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  const isDateDisabled = (date: Date) => {
    if (disabled) {
      return disabled(date);
    }
    return false;
  };

  return (
    <div className={cn("w-full p-3", className)}>
      {/* Encabezado del calendario */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            aria-label="Mes anterior"
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            aria-label="Mes siguiente"
            className="ml-1 h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-sm font-medium ml-3 capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToToday}
          className="text-xs"
        >
          Hoy
        </Button>
      </div>

      {/* Cuadrícula del calendario */}
      <div>
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth().map((day, index) => {
            if (!day) {
              return <div key={`blank-${index}`} className="h-8" />;
            }

            const isSelectedDay = selected ? isSameDay(day, selected) : false;
            const dayIsToday = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isDisabled = isDateDisabled(day);

            return (
              <div
                key={`day-${format(day, "yyyy-MM-dd")}`}
                className="text-center"
              >
                <button
                  type="button"
                  onClick={() => onSelect && onSelect(day)}
                  disabled={isDisabled}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                    isCurrentMonth
                      ? "text-foreground"
                      : "text-muted-foreground opacity-50",
                    dayIsToday &&
                      !isSelectedDay &&
                      "bg-accent text-accent-foreground",
                    isSelectedDay &&
                      "bg-primary text-primary-foreground font-medium",
                    !isSelectedDay &&
                      !dayIsToday &&
                      "hover:bg-accent hover:text-accent-foreground",
                    isDisabled &&
                      "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
                  )}
                >
                  {format(day, "d")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
