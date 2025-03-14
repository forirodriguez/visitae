import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, BarChart3 } from "lucide-react";

export default function BuyerTools() {
  const tools = [
    {
      icon: <Calculator className="h-10 w-10 text-blue-800" />,
      title: "Calculadora de Hipoteca",
      description:
        "Calcula tu cuota mensual y simula diferentes escenarios de financiación para tu nueva propiedad.",
      action: "Calcular hipoteca",
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-blue-800" />,
      title: "Análisis de Inversión",
      description:
        "Evalúa el potencial de retorno de inversión y rentabilidad a largo plazo de cualquier propiedad.",
      action: "Analizar inversión",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-blue-800" />,
      title: "Comparativa de Mercado",
      description:
        "Compara precios, tendencias y características de propiedades similares en la misma zona.",
      action: "Comparar mercado",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Herramientas para tu inversión
          </h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Toma decisiones informadas con nuestras herramientas especializadas
            para compradores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-50">{tool.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">
                {tool.title}
              </h3>
              <p className="text-gray-500 text-center mb-6">
                {tool.description}
              </p>
              <Button className="w-full bg-blue-800 hover:bg-blue-900">
                {tool.action}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
