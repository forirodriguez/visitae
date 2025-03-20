// src/components/admin/calendar/visit-dialog.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CalendarIcon, Clock, Loader2, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { cn } from "@/lib/utils";
import { Visit } from "@/types/visits";
import { useProperties } from "@/hooks/useProperties";
import { useVisitConflictCheck } from "@/hooks/useVisits";

// Esquema de validación manteniendo los campos originales
const formSchema = z.object({
  propertyId: z.string({
    required_error: "Selecciona una propiedad",
  }),
  date: z.date({
    required_error: "Selecciona una fecha",
  }),
  time: z.string({
    required_error: "Selecciona una hora",
  }),
  type: z.enum(["presencial", "videollamada"], {
    required_error: "Selecciona un tipo de visita",
  }),
  status: z.enum(["pendiente", "confirmada", "cancelada", "completada"], {
    required_error: "Selecciona un estado",
  }),
  clientName: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  clientEmail: z.string().email({
    message: "Correo electrónico inválido",
  }),
  clientPhone: z.string().min(6, {
    message: "Teléfono inválido",
  }),
  notes: z.string().optional(),
  agentId: z.string().optional(),
});

// Opciones de horarios
const timeOptions = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];

export default function VisitDialog({
  open,
  onOpenChange,
  selectedDate,
  existingVisit,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  existingVisit: Visit | null;
  onSave?: (visitData: Visit) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingConflicts, setIsVerifyingConflicts] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef(null);
  const [selectedProperty, setSelectedProperty] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [openPropertySelect, setOpenPropertySelect] = useState(false);

  // Usar el hook para verificar conflictos de horarios
  const { checkConflict } = useVisitConflictCheck();

  // Obtener propiedades desde el backend
  const { properties, isLoading: isLoadingProperties } = useProperties();

  const [searchTerm, setSearchTerm] = useState("");
  const filteredProperties = properties
    ? properties.filter((property) =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Crear formulario con valores por defecto
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyId: "",
      date: selectedDate || new Date(),
      time: "10:00",
      type: "presencial" as const,
      status: "pendiente" as const,
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      agentId: "agent-001",
      notes: "",
    },
  });

  // Actualizar el formulario cuando cambia la visita existente o la fecha seleccionada
  useEffect(() => {
    if (existingVisit) {
      // Si estamos editando una visita existente
      const visitDate =
        existingVisit.date instanceof Date
          ? existingVisit.date
          : new Date(existingVisit.date);

      // Actualizar formulario con datos de visita existente
      form.reset({
        propertyId: existingVisit.propertyId,
        date: visitDate,
        time: existingVisit.time,
        type: existingVisit.type,
        status: existingVisit.status,
        clientName: existingVisit.clientName,
        clientEmail: existingVisit.clientEmail,
        clientPhone: existingVisit.clientPhone,
        agentId: existingVisit.agentId || "agent-001",
        notes: existingVisit.notes || "",
      });

      // Establecer la propiedad seleccionada para el selector con búsqueda
      if (properties) {
        const prop = properties.find((p) => p.id === existingVisit.propertyId);
        if (prop) {
          setSelectedProperty({
            id: prop.id,
            title: prop.title,
          });
        }
      }
    } else {
      // Si estamos creando una nueva visita
      form.reset({
        propertyId: "",
        date: selectedDate || new Date(),
        time: "10:00",
        type: "presencial",
        status: "pendiente",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        agentId: "agent-001",
        notes: "",
      });
      setSelectedProperty(null);
    }

    // Limpiar errores de conflicto al abrir/cerrar el diálogo
    setConflictError(null);
  }, [existingVisit, selectedDate, form, open, properties]);

  // Efecto para asegurar que el calendario se cierre al seleccionar una fecha
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !(calendarRef.current as any).contains(event.target as Node) &&
        calendarOpen
      ) {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarOpen]);

  // Función para verificar conflictos
  const verifyConflicts = async (
    propertyId: string,
    date: Date,
    time: string,
    visitId?: string
  ): Promise<boolean> => {
    setIsVerifyingConflicts(true);
    try {
      const hasConflict = await checkConflict(propertyId, date, time, visitId);

      if (hasConflict) {
        setConflictError(
          "Ya existe una visita programada para esta propiedad en la fecha y hora seleccionadas."
        );
        return true;
      } else {
        setConflictError(null);
        return false;
      }
    } catch (error) {
      console.error("Error al verificar conflictos:", error);
      // En caso de error, consideramos que hay un conflicto para prevenir problemas
      setConflictError(
        "No se pudo verificar la disponibilidad. Intente de nuevo."
      );
      return true;
    } finally {
      setIsVerifyingConflicts(false);
    }
  };

  // Manejar envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Verificar conflictos antes de guardar
      const hasConflict = await verifyConflicts(
        values.propertyId,
        values.date,
        values.time,
        existingVisit?.id
      );

      // Si hay conflicto, detener el proceso
      if (hasConflict) {
        setIsSubmitting(false);
        return;
      }

      // Obtener los datos de la propiedad seleccionada
      const propertyObj = properties?.find((p) => p.id === values.propertyId);

      if (!propertyObj) {
        console.error("Propiedad no encontrada");
        setIsSubmitting(false);
        return;
      }

      // Crear objeto de visita para pasar al controlador
      const visitData: Visit = {
        id: existingVisit?.id || `v${Date.now()}`, // Generar ID único si es nueva visita
        propertyId: values.propertyId,
        propertyTitle: propertyObj.title,
        propertyImage: propertyObj.image,
        clientName: values.clientName,
        clientEmail: values.clientEmail,
        clientPhone: values.clientPhone,
        date: values.date,
        time: values.time,
        type: values.type,
        status: values.status,
        notes: values.notes || undefined,
        agentId: values.agentId || "agent-001",
      };

      // Llamar al callback de guardado si existe
      if (onSave) {
        await onSave(visitData);
      }

      // Cerrar el diálogo
      onOpenChange(false);
    } catch (error) {
      console.error("Error al guardar la visita:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determinar si hay alguna operación de carga en curso
  const isLoading = isLoadingProperties || isVerifyingConflicts || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingVisit ? "Editar Visita" : "Programar Nueva Visita"}
          </DialogTitle>
        </DialogHeader>

        {conflictError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{conflictError}</AlertDescription>
          </Alert>
        )}

        {isVerifyingConflicts && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verificando disponibilidad...</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Selección de Propiedad con buscador */}
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Propiedad</FormLabel>
                  <Popover
                    open={openPropertySelect}
                    onOpenChange={setOpenPropertySelect}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          {isLoadingProperties ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Cargando propiedades...</span>
                            </div>
                          ) : selectedProperty ? (
                            selectedProperty.title
                          ) : (
                            "Selecciona una propiedad"
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <div className="p-2">
                        <Input
                          placeholder="Buscar propiedad..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mb-2"
                        />
                        <div className="max-h-60 overflow-auto">
                          {filteredProperties.length === 0 ? (
                            <div className="text-center py-2 text-sm text-muted-foreground">
                              No se encontraron propiedades
                            </div>
                          ) : (
                            filteredProperties.map((property) => (
                              <div
                                key={property.id}
                                className={cn(
                                  "flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground",
                                  property.id === field.value &&
                                    "bg-accent text-accent-foreground"
                                )}
                                onClick={() => {
                                  form.setValue("propertyId", property.id);
                                  setSelectedProperty({
                                    id: property.id,
                                    title: property.title,
                                  });
                                  setOpenPropertySelect(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    property.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {property.title}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Datos del Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Cliente</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isLoading}
                            onClick={() => setCalendarOpen(true)}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              setCalendarOpen(false);
                            }
                          }}
                          fromDate={new Date()}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-fit min-w-[120px]">
                          <SelectValue placeholder="Selecciona hora" />
                          <Clock className="ml-2 h-4 w-4 opacity-50" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tipo de Visita y Estado */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Visita</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="videollamada">
                          Videollamada
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="confirmada">Confirmada</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                        <SelectItem value="completada">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notas */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional sobre la visita"
                      className="resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isVerifyingConflicts}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || !!conflictError}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Guardando...</span>
                  </div>
                ) : isVerifyingConflicts ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : existingVisit ? (
                  "Actualizar Visita"
                ) : (
                  "Programar Visita"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
