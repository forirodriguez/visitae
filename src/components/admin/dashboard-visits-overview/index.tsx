"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Home, MapPin, User, Video } from "lucide-react";
import {
  mockVisits,
  getVisitStats,
  getUpcomingVisits,
} from "@/lib/mock-data/visits";
import { getPropertiesWithScheduledVisits } from "@/utils/visits-utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export default function VisitsOverview() {
  const stats = getVisitStats();
  const upcomingVisits = getUpcomingVisits(3);
  const propertiesWithVisits = getPropertiesWithScheduledVisits();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.byType.presencial} presenciales,{" "}
              {stats.byType.videollamada} videollamadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visitas Pendientes
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus.pendiente}</div>
            <p className="text-xs text-muted-foreground">
              Por confirmar o realizar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visitas Confirmadas
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.byStatus.confirmada}
            </div>
            <p className="text-xs text-muted-foreground">
              Programadas y confirmadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ratio Completadas
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion.ratio}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.byStatus.completada} visitas realizadas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas Visitas</TabsTrigger>
          <TabsTrigger value="properties">Propiedades con Visitas</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingVisits.map((visit) => (
              <Card key={visit.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium">
                      {visit.propertyTitle}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        visit.status === "pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {visit.status === "pendiente"
                        ? "Pendiente"
                        : "Confirmada"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(visit.date, "EEEE, d 'de' MMMM", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{visit.time} h</span>
                      <span className="mx-2">•</span>
                      {visit.type === "presencial" ? (
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                          Presencial
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Video className="mr-1 h-4 w-4 text-muted-foreground" />
                          Videollamada
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{visit.clientName}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="px-4 pb-4">
                  <Link href={`/admin/calendar/visits/${visit.id}`} passHref>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
            {upcomingVisits.length === 0 && (
              <div className="col-span-full flex items-center justify-center h-40 border rounded-lg bg-muted/10">
                <div className="text-center text-muted-foreground">
                  <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p>No hay visitas programadas sssspróximamente</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Link href="/admin/calendar" passHref>
              <Button variant="outline" size="sm">
                Ver todas las visitas
              </Button>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="properties" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {propertiesWithVisits.slice(0, 6).map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative h-36">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${property.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-medium text-white truncate">
                      {property.title}
                    </h3>
                    <p className="text-xs text-white/80 truncate">
                      {property.location}
                    </p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{property.propertyType}</span>
                    </div>
                    <Badge>
                      {property.type === "venta" ? "Venta" : "Alquiler"}
                    </Badge>
                  </div>
                  <div className="mt-3 text-sm flex justify-between">
                    <span>
                      <span className="font-medium">
                        {
                          mockVisits.filter(
                            (v) =>
                              v.propertyId === property.id &&
                              (v.status === "pendiente" ||
                                v.status === "confirmada")
                          ).length
                        }
                      </span>{" "}
                      visitas programadas
                    </span>
                    <span className="font-medium text-blue-700">
                      {property.price.toLocaleString("es-ES")}€
                      {property.type === "alquiler" && "/mes"}
                    </span>
                  </div>
                </CardContent>
                <div className="px-4 pb-4">
                  <Link
                    href={`/admin/properties/${property.id}/visits`}
                    passHref
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Ver visitas
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
            {propertiesWithVisits.length === 0 && (
              <div className="col-span-full flex items-center justify-center h-40 border rounded-lg bg-muted/10">
                <div className="text-center text-muted-foreground">
                  <Home className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p>No hay propiedades con visitas programadas</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Link href="/admin/properties" passHref>
              <Button variant="outline" size="sm">
                Ver todas las propiedades
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
