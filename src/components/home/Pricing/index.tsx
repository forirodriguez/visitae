"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Básico",
      description: "Ideal para agentes independientes",
      priceMonthly: 29,
      priceAnnual: 290,
      features: [
        "Hasta 10 propiedades activas",
        "Calendario de disponibilidad",
        "Agendamiento en tiempo real",
        "Notificaciones por email",
        "Soporte por email",
      ],
    },
    {
      name: "Profesional",
      description: "Para agentes y equipos pequeños",
      priceMonthly: 79,
      priceAnnual: 790,
      features: [
        "Hasta 50 propiedades activas",
        "Todo lo del plan Básico",
        "Integración con Google Calendar",
        "Calculadoras financieras",
        "Mapas interactivos avanzados",
        "Soporte prioritario",
      ],
    },
    {
      name: "Empresarial",
      description: "Para inmobiliarias y equipos grandes",
      priceMonthly: 199,
      priceAnnual: 1990,
      features: [
        "Propiedades ilimitadas",
        "Todo lo del plan Profesional",
        "Panel de administración multiusuario",
        "Gestión documental avanzada",
        "Firma digital",
        "API para integraciones",
        "Soporte dedicado 24/7",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Planes y precios
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Elige el plan que mejor se adapte a tus necesidades
          </p>

          <div className="flex items-center justify-center space-x-4 mt-8">
            <Label
              htmlFor="billing-toggle"
              className={!isAnnual ? "font-medium" : "text-gray-500"}
            >
              Mensual
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label
              htmlFor="billing-toggle"
              className={isAnnual ? "font-medium" : "text-gray-500"}
            >
              Anual{" "}
              <span className="text-green-600 text-sm font-medium">
                Ahorra 20%
              </span>
            </Label>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col p-6 bg-white rounded-xl shadow-sm border ${
                index === 1
                  ? "border-blue-200 shadow-md relative"
                  : "border-gray-100"
              }`}
            >
              {index === 1 && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Más popular
                </div>
              )}
              <div className="mb-5">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>
              <div className="mb-5">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    €{isAnnual ? plan.priceAnnual / 12 : plan.priceMonthly}
                  </span>
                  <span className="text-gray-500 ml-1">/mes</span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-gray-500 mt-1">
                    Facturado anualmente (€{plan.priceAnnual})
                  </p>
                )}
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={
                  index === 1
                    ? "bg-blue-800 hover:bg-blue-900"
                    : "bg-gray-900 hover:bg-gray-800"
                }
              >
                {index === 0 ? "Prueba gratuita 14 días" : "Comenzar ahora"}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-500">
          <p>
            ¿Necesitas un plan personalizado para tu empresa?{" "}
            <a href="#" className="text-blue-800 font-medium hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
