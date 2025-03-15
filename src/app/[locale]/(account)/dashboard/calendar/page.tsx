//src/app/[locale]/(account)/dashboard/calendar/page.tsx

import type { Metadata } from "next";
import CalendarContainer from "@/components/admin/calendar/calendar-container";

import VisitsList from "@/components/admin/calendar/visits-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List } from "lucide-react";

export const metadata: Metadata = {
  title: "Gestión de Agenda | Panel de Administración Visitae",
  description: "Gestiona y programa visitas a propiedades de forma eficiente",
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Agenda</h1>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Calendario</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Lista de Visitas</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="space-y-4">
          <CalendarContainer visits={[]} />
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          <VisitsList visits={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
