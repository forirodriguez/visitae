"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { format, Locale } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (value?: DateRange) => void;
  placeholder?: string;
  locale?: Locale;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Seleccionar rango",
  locale = es,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  // Actualizar el estado local cuando cambia el valor de prop
  React.useEffect(() => {
    setDate(value);
  }, [value]);

  // Formatear el rango de fechas para mostrar
  const formatDateRange = (range?: DateRange) => {
    if (!range?.from) {
      return placeholder;
    }

    if (!range.to) {
      return format(range.from, "P", { locale });
    }

    return `${format(range.from, "P", { locale })} - ${format(range.to, "P", {
      locale,
    })}`;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              onChange(newDate);
            }}
            numberOfMonths={2}
            locale={locale}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
