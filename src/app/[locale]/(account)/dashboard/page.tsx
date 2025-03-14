//src/app/[locale]/(account)/dashboard/page.tsx
"use client";

import { useState } from "react";
import DashboardStatCard from "@/components/admin/dashboard-stat-card";
import RecentActivityList from "@/components/admin/recent-activity-list";
import CalendarContainer from "@/components/admin/calendar/calendar-container";
import VisitDialog from "@/components/admin/calendar/visit-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, TrendingUp, Eye, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { Visit, VisitStatus } from "@/types/visits";
import { mockVisits } from "@/lib/mock-data/visits"; // Asumiendo que tienes datos mock

// Nota: Los metadatos están definidos en un archivo separado para compatibilidad con 'use client'

export default function DashboardPage() {
  // Estado para las visitas
  const [visits, setVisits] = useState<Visit[]>(mockVisits);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<Visit | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Manejador para añadir visita
  const handleAddVisit = () => {
    setVisitToEdit(null);
    setDialogOpen(true);
  };

  // Manejador para editar visita
  const handleEditVisit = (visit: Visit) => {
    setVisitToEdit(visit);
    setDialogOpen(true);
  };

  // Manejador para actualizar estado de visita
  const handleUpdateVisitStatus = (visit: Visit, newStatus: VisitStatus) => {
    setVisits((prevVisits) =>
      prevVisits.map((v) =>
        v.id === visit.id ? { ...v, status: newStatus } : v
      )
    );
  };

  // Manejador para guardar visita (nueva o editada)
  const handleSaveVisit = (visitData: Visit) => {
    if (visitToEdit) {
      // Actualizar visita existente
      setVisits((prevVisits) =>
        prevVisits.map((v) => (v.id === visitData.id ? visitData : v))
      );
    } else {
      // Añadir nueva visita
      setVisits((prevVisits) => [...prevVisits, visitData]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Panel Administrativo
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={"dashboard/properties/new"}>
            <Button className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Añadir propiedad
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Nuevo componente de Calendario/Agenda */}
          <CalendarContainer
            visits={visits}
            onAddVisit={handleAddVisit}
            onEditVisit={handleEditVisit}
            onUpdateVisitStatus={handleUpdateVisitStatus}
          />

          {/* Actividad reciente en una card separada */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
              <CardDescription>
                Últimas propiedades añadidas o editadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Analíticas</CardTitle>
              <CardDescription>
                Visualiza datos detallados sobre el rendimiento de tus
                propiedades
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardStatCard
                  title="Total Propiedades"
                  value="256"
                  change="+12%"
                  trend="up"
                  description="Comparado con el mes anterior"
                  icon={<Home className="h-5 w-5" />}
                />
                <DashboardStatCard
                  title="Propiedades Publicadas"
                  value="198"
                  change="+8%"
                  trend="up"
                  description="Comparado con el mes anterior"
                  icon={<Eye className="h-5 w-5" />}
                />
                <DashboardStatCard
                  title="Propiedades en Borrador"
                  value="58"
                  change="-3%"
                  trend="down"
                  description="Comparado con el mes anterior"
                  icon={<Clock className="h-5 w-5" />}
                />
                <DashboardStatCard
                  title="Visitas Agendadas"
                  value="124"
                  change="+18%"
                  trend="up"
                  description="Comparado con el mes anterior"
                  icon={<TrendingUp className="h-5 w-5" />}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informes</CardTitle>
              <CardDescription>
                Genera y descarga informes personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">
                  Contenido de informes en desarrollo
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para crear/editar visitas */}
      <VisitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        existingVisit={visitToEdit}
        onSave={handleSaveVisit}
      />
    </div>
  );
}
