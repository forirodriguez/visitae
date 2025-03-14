"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    role: "Comprador en Madrid",
    image: "/placeholder.svg?height=80&width=80&text=CR",
    quote:
      "Gracias a Visitae encontré mi apartamento ideal en tiempo récord. La posibilidad de agendar visitas directamente con los agentes me ahorró muchísimo tiempo.",
    rating: 5,
  },
  {
    id: 2,
    name: "Laura Martínez",
    role: "Inversora inmobiliaria",
    image: "/placeholder.svg?height=80&width=80&text=LM",
    quote:
      "Las herramientas de análisis de inversión me ayudaron a tomar decisiones informadas. He comprado ya tres propiedades a través de la plataforma.",
    rating: 5,
  },
  {
    id: 3,
    name: "Miguel Sánchez",
    role: "Comprador primerizo",
    image: "/placeholder.svg?height=80&width=80&text=MS",
    quote:
      "Como comprador de primera vivienda, el proceso me parecía abrumador. La calculadora de hipoteca y el soporte del equipo hicieron todo mucho más sencillo.",
    rating: 4,
  },
  {
    id: 4,
    name: "Ana García",
    role: "Compradora en Barcelona",
    image: "/placeholder.svg?height=80&width=80&text=AG",
    quote:
      "El mapa interactivo con puntos de interés fue clave para elegir mi nuevo hogar. Pude encontrar una propiedad cerca de escuelas y transporte público.",
    rating: 5,
  },
  {
    id: 5,
    name: "Javier López",
    role: "Inversor internacional",
    image: "/placeholder.svg?height=80&width=80&text=JL",
    quote:
      "Siendo inversor extranjero, la transparencia y facilidad de uso de la plataforma me dieron la confianza para invertir en España a distancia.",
    rating: 4,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Number of testimonials to show at once based on screen size
  const getVisibleCount = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }
    return 3; // Default for SSR
  }, []);

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    // Set initial visible count
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getVisibleCount]);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveIndex(
        (prev) => (prev + 1) % (testimonials.length - visibleCount + 1)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, visibleCount]);

  const nextSlide = () => {
    setActiveIndex(
      (prev) => (prev + 1) % (testimonials.length - visibleCount + 1)
    );
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) =>
        (prev - 1 + (testimonials.length - visibleCount + 1)) %
        (testimonials.length - visibleCount + 1)
    );
  };

  const pauseAutoplay = () => {
    setAutoplay(false);
  };

  const visibleTestimonials = testimonials.slice(
    activeIndex,
    activeIndex + visibleCount
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Historias reales de compradores que encontraron su hogar ideal con
            Visitae
          </p>
        </div>

        <div className="relative">
          <div className="flex overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(0)` }}
            >
              {visibleTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full sm:w-1/2 lg:w-1/3 px-4"
                  onMouseEnter={pauseAutoplay}
                >
                  <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <blockquote className="flex-1 italic text-gray-700 mb-4">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white shadow-sm z-10"
            onClick={prevSlide}
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white shadow-sm z-10"
            onClick={nextSlide}
            aria-label="Testimonio siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(testimonials.length - visibleCount + 1)].map((_, i) => (
            <button
              key={i}
              className={`h-2 rounded-full transition-all ${i === activeIndex ? "w-6 bg-blue-800" : "w-2 bg-gray-300"}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Ir al testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
