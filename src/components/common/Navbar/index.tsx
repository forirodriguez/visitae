"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Lock } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "es";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path: string) => {
    router.push(`/${locale}${path}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=32&h=32&auto=format&fit=crop"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-blue-800">Visitae</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href={`/${locale}/comprar`}
            className="text-sm font-medium hover:text-blue-800 transition-colors"
          >
            Comprar
          </Link>
          <Link
            href={`/${locale}/alquilar`}
            className="text-sm font-medium hover:text-blue-800 transition-colors"
          >
            Alquilar
          </Link>
          <Link
            href={`/${locale}/en-construccion`}
            className="text-sm font-medium hover:text-blue-800 transition-colors"
          >
            Vender
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="text-sm font-medium hover:text-blue-800 transition-colors"
          >
            Blog
          </Link>
          <Link
            href={`/${locale}/contacto`}
            className="text-sm font-medium hover:text-blue-800 transition-colors"
          >
            Contacto
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            className="h-9"
            onClick={() => navigateTo("/login")}
          >
            Iniciar sesión
          </Button>
          <Button
            className="h-9 bg-blue-800 hover:bg-blue-900"
            onClick={() => navigateTo("/register")}
          >
            Registrarse
          </Button>
          <Button
            variant="outline"
            className="h-9 border-blue-700 text-blue-800 hover:bg-blue-50"
            onClick={() => navigateTo("/dashboard")}
          >
            <Lock className="mr-2 h-4 w-4" />
            AdminDemo
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background border-t">
          <nav className="flex flex-col p-6 space-y-6">
            <Link
              href={`/${locale}/comprar`}
              className="text-lg font-medium hover:text-blue-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Comprar
            </Link>
            <Link
              href={`/${locale}/alquilar`}
              className="text-lg font-medium hover:text-blue-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Alquilar
            </Link>
            <Link
              href={`/${locale}/en-construccion`}
              className="text-lg font-medium hover:text-blue-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              En construcción
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="text-lg font-medium hover:text-blue-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href={`/${locale}/contacto`}
              className="text-lg font-medium hover:text-blue-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <div className="flex flex-col gap-4 pt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigateTo("/login");
                  setIsMenuOpen(false);
                }}
              >
                Iniciar sesión
              </Button>
              <Button
                className="w-full bg-blue-800 hover:bg-blue-900"
                onClick={() => {
                  navigateTo("/register");
                  setIsMenuOpen(false);
                }}
              >
                Registrarse
              </Button>
              <Button
                variant="outline"
                className="w-full border-blue-700 text-blue-800"
                onClick={() => {
                  navigateTo("/dashboard");
                  setIsMenuOpen(false);
                }}
              >
                <Lock className="mr-2 h-4 w-4" />
                AdminDemo
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
