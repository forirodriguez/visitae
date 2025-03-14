"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageSquare, Calendar, Heart } from "lucide-react";

interface PropertyStatsProps {
  stats: {
    views: number;
    contactRequests: number;
    scheduledVisits: number;
    favorites: number;
    viewsHistory: {
      date: string;
      count: number;
    }[];
  };
}

export default function PropertyStats({ stats }: PropertyStatsProps) {
  const [period, setPeriod] = useState("week");

  // Función para obtener el máximo valor en el gráfico
  const getMaxValue = () => {
    return Math.max(...stats.viewsHistory.map((item) => item.count)) || 10;
  };

  // Función para calcular la altura de cada barra
  const calculateHeight = (count: number) => {
    const maxValue = getMaxValue();
    return `${(count / maxValue) * 100}%`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de vistas</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Eye className="mr-2 h-5 w-5 text-blue-500" />
              {stats.views.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Solicitudes de contacto</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-green-500" />
              {stats.contactRequests.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visitas agendadas</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-purple-500" />
              {stats.scheduledVisits.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Añadida a favoritos</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              {stats.favorites.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tendencia de vistas</CardTitle>
            <Tabs defaultValue="week" value={period} onValueChange={setPeriod}>
              <TabsList>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mes</TabsTrigger>
                <TabsTrigger value="year">Año</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            Número de vistas diarias de la propiedad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <div className="flex h-full items-end gap-2">
              {stats.viewsHistory.map((item, index) => (
                <div
                  key={index}
                  className="relative flex h-full w-full flex-col justify-end"
                >
                  <div
                    className="w-full rounded-md bg-blue-100 dark:bg-blue-950"
                    style={{ height: calculateHeight(item.count) }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center text-xs font-bold">
                      {item.count > 0 && item.count}
                    </div>
                  </div>
                  <div className="mt-2 text-center text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString("es-ES", {
                      weekday: "short",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasa de conversión</CardTitle>
          <CardDescription>
            Porcentaje de vistas que resultan en solicitudes de contacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  className="stroke-gray-200 dark:stroke-gray-800"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeWidth="10"
                />
                <circle
                  className="stroke-blue-500"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeWidth="10"
                  strokeDasharray={`${(stats.contactRequests / stats.views) * 251.2} 251.2`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">
                  {((stats.contactRequests / stats.views) * 100).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Conversión
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
