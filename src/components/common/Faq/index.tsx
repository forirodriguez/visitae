"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Faq() {
  const faqs = [
    {
      question: "¿Cómo funciona el sistema de agendamiento en tiempo real?",
      answer:
        "Nuestro sistema permite a los compradores ver la disponibilidad real de los agentes y agendar visitas sin intermediarios. Los agentes configuran su disponibilidad y reciben notificaciones instantáneas cuando alguien agenda una visita. Todo se sincroniza automáticamente con Google Calendar para evitar conflictos.",
    },
    {
      question:
        "¿Puedo integrar Visitae con mi sitio web inmobiliario existente?",
      answer:
        "Sí, ofrecemos una API completa y widgets que puedes integrar fácilmente en tu sitio web existente. Nuestro equipo de soporte puede ayudarte con la integración para que puedas aprovechar todas las funcionalidades de Visitae sin cambiar tu presencia online actual.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal y transferencia bancaria para planes anuales. Todos los pagos se procesan de forma segura a través de proveedores de confianza con encriptación de extremo a extremo.",
    },
    {
      question: "¿Puedo cambiar de plan en cualquier momento?",
      answer:
        "Sí, puedes actualizar tu plan en cualquier momento y el cambio se aplicará inmediatamente. Si cambias a un plan superior, solo pagarás la diferencia proporcional por el tiempo restante de tu suscripción actual. También puedes bajar de plan al renovar tu suscripción.",
    },
    {
      question: "¿Cómo funciona la prueba gratuita?",
      answer:
        "Ofrecemos una prueba gratuita de 14 días de nuestro plan Profesional sin necesidad de tarjeta de crédito. Durante este período, tendrás acceso completo a todas las funcionalidades para que puedas evaluar si Visitae se adapta a tus necesidades. Al finalizar la prueba, puedes elegir el plan que mejor se ajuste a ti.",
    },
    {
      question: "¿Ofrecen formación para usar la plataforma?",
      answer:
        "Sí, ofrecemos sesiones de formación gratuitas para todos los nuevos usuarios, además de una completa biblioteca de recursos, tutoriales en video y documentación. Los planes Profesional y Empresarial incluyen sesiones de formación personalizadas para tu equipo.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Preguntas frecuentes
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Respuestas a las preguntas más comunes sobre Visitae
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y">
          {faqs.map((faq, index) => (
            <div key={index} className="py-5">
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full text-left font-medium text-lg"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                {faq.question}
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`mt-2 text-gray-500 ${openIndex === index ? "block" : "hidden"}`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            ¿No encuentras la respuesta que buscas?{" "}
            <a href="#" className="text-blue-800 font-medium hover:underline">
              Contacta con nuestro equipo de soporte
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
