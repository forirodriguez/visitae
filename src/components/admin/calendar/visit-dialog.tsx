"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { Visit } from "@/types/visits";
import { mockProperties } from "@/lib/mock-data/properties";

// Esquema de validación para el formulario
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
  clientId: z.string().optional(),
  agentId: z.string().optional(),
  notes: z.string().optional(),
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

// Componente principal
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
  onSave?: (visit: Visit) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Por ahora usamos mockProperties hasta que implementemos React Query
  const properties = mockProperties;
  const isLoadingProperties = false;

  // Crear formulario con valores por defecto
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyId: "",
      date: selectedDate || new Date(),
      time: "10:00",
      type: "presencial",
      status: "pendiente",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientId: "client-1", // Por defecto usamos el cliente 1 (se puede cambiar)
      agentId: "agent-001", // Agente por defecto (se puede cambiar)
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

      form.reset({
        propertyId: existingVisit.propertyId,
        date: visitDate,
        time: existingVisit.time,
        type: existingVisit.type,
        status: existingVisit.status,
        clientName: existingVisit.clientName,
        clientEmail: existingVisit.clientEmail,
        clientPhone: existingVisit.clientPhone,
        clientId: "client-1", // Por ahora usamos valores fijos
        agentId: existingVisit.agentId || "agent-001",
        notes: existingVisit.notes || "",
      });
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
        clientId: "client-1",
        agentId: "agent-001",
        notes: "",
      });
    }
  }, [existingVisit, selectedDate, form]);

  // Manejar envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Obtener los datos de la propiedad seleccionada
      const selectedProperty = mockProperties.find(
        (p) => p.id === values.propertyId
      );

      if (!selectedProperty) {
        console.error("Propiedad no encontrada");
        setIsSubmitting(false);
        return;
      }

      // Crear objeto de visita para pasar al controlador
      const visitData: Visit = {
        id: existingVisit?.id || `v${Date.now()}`, // Generar ID único si es nueva visita
        propertyId: values.propertyId,
        propertyTitle: selectedProperty.title,
        propertyImage: selectedProperty.image,
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
        onSave(visitData);
      }

      // Cerrar el diálogo
      onOpenChange(false);
    } catch (error) {
      console.error("Error al guardar la visita:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Información de clientes (hasta que tengamos una API de clientes)
  const mockClients = [
    {
      id: "client-1",
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      phone: "600123456",
    },
    {
      id: "client-2",
      name: "Laura Martínez",
      email: "laura@example.com",
      phone: "600789012",
    },
    {
      id: "client-3",
      name: "Miguel Sánchez",
      email: "miguel@example.com",
      phone: "600345678",
    },
  ];

  // Detectar cuando se selecciona un cliente existente
  const handleClientSelect = (clientId: string) => {
    const selectedClient = mockClients.find((c) => c.id === clientId);
    if (selectedClient) {
      form.setValue("clientName", selectedClient.name);
      form.setValue("clientEmail", selectedClient.email);
      form.setValue("clientPhone", selectedClient.phone);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingVisit ? "Editar Visita" : "Programar Nueva Visita"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Selección de Propiedad */}
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propiedad</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingProperties}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una propiedad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
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
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona hora" />
                          <Clock className="h-4 w-4 opacity-50" />
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

            {/* Selección de Cliente Existente */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleClientSelect(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona cliente o crea uno nuevo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      <Input {...field} />
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
                      <Input type="email" {...field} />
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
                      <Input type="tel" {...field} />
                    </FormControl>
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
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Guardando..."
                  : existingVisit
                    ? "Actualizar Visita"
                    : "Programar Visita"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
