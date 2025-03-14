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
import { getPendingVisitsForProperty } from "@/utils/visits-utils";
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
import { VisitStatus } from "@/types/visits";
import { mockVisits } from "@/lib/mock-data/visits";

interface PropertyVisitsProps {
  property: Property;
}

export default function PropertyVisits({ property }: PropertyVisitsProps) {
  const [showDialog, setShowDialog] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  // Obtener las visitas pendientes para esta propiedad
  const pendingVisits = getPendingVisitsForProperty(property.id);

  // Obtener todas las visitas para esta propiedad
  const allVisits = mockVisits.filter(
    (visit) => visit.propertyId === property.id
  );

  // Filtrar visitas por estado
  const confirmedVisits = allVisits.filter((v) => v.status === "confirmada");
  const completedVisits = allVisits.filter((v) => v.status === "completada");
  const canceledVisits = allVisits.filter((v) => v.status === "cancelada");

  // Función para programar nueva visita
  const handleScheduleVisit = () => {
    setShowDialog(true);
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
            {pendingVisits.length > 0 ? (
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
                            {format(visit.date, "EEEE, d 'de' MMMM", {
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
                      <div className="mt-3 flex justify-end">
                        <Link
                          href={`/admin/calendar/visits/${visit.id}`}
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
                                {format(visit.date, "dd/MM/yyyy", {
                                  locale: es,
                                })}{" "}
                                • {visit.time}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {visit.clientName}
                            </div>
                          </div>
                          <Link
                            href={`/admin/calendar/visits/${visit.id}`}
                            passHref
                          >
                            <Button variant="ghost" size="sm">
                              Detalles
                            </Button>
                          </Link>
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
                                {format(visit.date, "dd/MM/yyyy", {
                                  locale: es,
                                })}{" "}
                                • {visit.time}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {visit.clientName}
                            </div>
                          </div>
                          <Link
                            href={`/admin/calendar/visits/${visit.id}`}
                            passHref
                          >
                            <Button variant="ghost" size="sm">
                              Detalles
                            </Button>
                          </Link>
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
                                {format(visit.date, "dd/MM/yyyy", {
                                  locale: es,
                                })}{" "}
                                • {visit.time}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {visit.clientName}
                            </div>
                          </div>
                          <Link
                            href={`/admin/calendar/visits/${visit.id}`}
                            passHref
                          >
                            <Button variant="ghost" size="sm">
                              Detalles
                            </Button>
                          </Link>
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
        existingVisit={null}
      />
    </Card>
  );
}
