//src/components/admin/property-visits/index.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/types/property";
import VisitDialog from "@/components/admin/calendar/visit-dialog";
import {
  Calendar,
  Video,
  MapPin,
  Clock,
  User,
  Plus,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Visit, VisitStatus } from "@/types/visits";
import { useVisits, useVisitOperations } from "@/hooks/useVisits";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface PropertyVisitsProps {
  property: Property;
}

export default function PropertyVisits({ property }: PropertyVisitsProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<Visit | null>(null);

  // Obtener el locale de la URL
  const params = useParams();
  const locale = params.locale as string;

  // Usar el hook para obtener visitas de esta propiedad
  const { data: allVisits = [], isLoading } = useVisits({
    propertyId: property.id,
  });

  // Operaciones CRUD para visitas
  const { createVisit, updateVisit } = useVisitOperations();

  // Filtrar visitas por estado
  const pendingVisits = allVisits.filter(
    (v) => v.status === "pendiente" || v.status === "confirmada"
  );
  const confirmedVisits = allVisits.filter((v) => v.status === "confirmada");
  const completedVisits = allVisits.filter((v) => v.status === "completada");
  const canceledVisits = allVisits.filter((v) => v.status === "cancelada");

  // Función para programar nueva visita
  const handleScheduleVisit = () => {
    setVisitToEdit(null);
    setShowDialog(true);
  };

  // Función para editar una visita existente
  const handleEditVisit = (visit: Visit) => {
    setVisitToEdit(visit);
    setShowDialog(true);
  };

  // Función para guardar una visita (nueva o editada)
  const handleSaveVisit = async (visitData: Visit) => {
    try {
      if (visitToEdit) {
        // Actualizar visita existente
        await updateVisit(visitData.id, {
          propertyId: property.id,
          date: visitData.date.toISOString().split("T")[0],
          time: visitData.time,
          type: visitData.type,
          status: visitData.status,
          notes: visitData.notes,
          clientId: "client-1", // Esto debería venir de un selector de clientes
          agentId: visitData.agentId,
        });
        toast.success("Visita actualizada correctamente");
      } else {
        // Añadir nueva visita
        await createVisit({
          propertyId: property.id,
          date: visitData.date.toISOString().split("T")[0],
          time: visitData.time,
          type: visitData.type,
          status: visitData.status,
          notes: visitData.notes,
          clientId: "client-1", // Esto debería venir de un selector de clientes
          agentId: visitData.agentId,
        });
        toast.success("Visita programada correctamente");
      }
      setShowDialog(false);
    } catch (error) {
      toast.error("Error al guardar la visita");
      console.error("Error guardando visita:", error);
    }
  };

  // Función para obtener el color según estado
  const getStatusColor = (status: VisitStatus) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "confirmada":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelada":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Visitas Programadas</CardTitle>
          <CardDescription>
            Gestiona las visitas para esta propiedad
          </CardDescription>
        </div>
        <Button onClick={handleScheduleVisit}>
          <Plus className="mr-2 h-4 w-4" />
          Programar visita
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pendientes ({pendingVisits.length})
            </TabsTrigger>
            <TabsTrigger value="all">Todas ({allVisits.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pendingVisits.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {pendingVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {format(new Date(visit.date), "EEEE, d 'de' MMMM", {
                              locale: es,
                            })}
                          </span>
                        </div>
                        <Badge className={getStatusColor(visit.status)}>
                          {visit.status === "pendiente"
                            ? "Pendiente"
                            : "Confirmada"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{visit.time} h</span>
                        </div>
                        <div className="flex items-center text-sm">
                          {visit.type === "presencial" ? (
                            <>
                              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>Visita presencial</span>
                            </>
                          ) : (
                            <>
                              <Video className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>Videollamada</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center text-sm">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{visit.clientName}</span>
                        </div>
                      </div>
                      {visit.notes && (
                        <p className="mt-2 text-sm text-muted-foreground italic">
                          &quot;{visit.notes}&quot;
                        </p>
                      )}
                      <div className="mt-3 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditVisit(visit)}
                        >
                          Editar
                        </Button>
                        <Link
                          href={`/${locale}/dashboard/calendar/visits/${visit.id}`}
                          passHref
                        >
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h3 className="font-medium text-lg mb-1">
                  No hay visitas pendientes
                </h3>
                <p className="text-muted-foreground">
                  Programa una visita para mostrar esta propiedad
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : allVisits.length > 0 ? (
              <div className="space-y-6">
                {confirmedVisits.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Confirmadas</h3>
                    <div className="space-y-2">
                      {confirmedVisits.map((visit) => (
                        <div
                          key={visit.id}
                          className="p-2 border rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">
                                {format(new Date(visit.date), "dd/MM/yyyy", {
                                  locale: es,
                                })}{" "}
                                • {visit.time}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {visit.clientName}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVisit(visit)}
                            >
                              Editar
                            </Button>
                            <Link
                              href={`/${locale}/dashboard/calendar/visits/${visit.id}`}
                              passHref
                            >
                              <Button variant="ghost" size="sm">
                                Detalles
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {completedVisits.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Realizadas</h3>
                    <div className="space-y-2">
                      {completedVisits.map((visit) => (
                        <div
                          key={visit.id}
                          className="p-2 border rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">
                                {format(new Date(visit.date), "dd/MM/yyyy", {
                                  locale: es,
                                })}{" "}
                                • {visit.time}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {visit.clientName}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVisit(visit)}
                            >
                              Editar
                            </Button>
                            <Link
                              href={`/${locale}/dashboard/calendar/visits/${visit.id}`}
                              passHref
                            >
                              <Button variant="ghost" size="sm">
                                Detalles
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {canceledVisits.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Canceladas</h3>
                    <div className="space-y-2">
                      {canceledVisits.map((visit) => (
                        <div
                          key={visit.id}
                          className="p-2 border rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">
                                {format(new Date(visit.date), "dd/MM/yyyy", {
                                  locale: es,
                                })}{" "}
                                • {visit.time}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {visit.clientName}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVisit(visit)}
                            >
                              Editar
                            </Button>
                            <Link
                              href={`/${locale}/dashboard/calendar/visits/${visit.id}`}
                              passHref
                            >
                              <Button variant="ghost" size="sm">
                                Detalles
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h3 className="font-medium text-lg mb-1">
                  No hay visitas registradas
                </h3>
                <p className="text-muted-foreground">
                  Esta propiedad aún no ha tenido visitas
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <VisitDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        selectedDate={new Date()}
        existingVisit={visitToEdit}
        onSave={handleSaveVisit}
      />
    </Card>
  );
}
