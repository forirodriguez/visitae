"use client";

import type React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Home,
  Calendar,
  Settings,
  LogOut,
  HousePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: { title: string; href: string }[];
}

const getSidebarItems = (locale: string): SidebarItem[] => [
  {
    title: "Dashboard",
    href: `/${locale}/dashboard`,
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Propiedades",
    href: `/${locale}/dashboard/properties`,
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Añadir propiedad",
    href: `/${locale}/dashboard/properties/new`,
    icon: <HousePlus className="h-5 w-5" />,
  },
  {
    title: "Agenda",
    href: `/${locale}/dashboard/calendar`,
    icon: <Calendar className="h-5 w-5" />,
  },
  /*  {
    title: "Usuarios",
    href: `/${locale}/dashboard/users`,
    icon: <Users className="h-5 w-5" />,
    submenu: [
      { title: "Todos los usuarios", href: `/${locale}/dashboard/users` },
      { title: "Agentes", href: `/${locale}/dashboard/users/agents` },
      { title: "Compradores", href: `/${locale}/dashboard/users/buyers` },
    ],
  }, */
  /*  {
    title: "Mensajes",
    href: `/${locale}/dashboard/messages`,
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Informes",
    href: `/${locale}/dashboard/reports`,
    icon: <BarChart3 className="h-5 w-5" />,
  }, */
  {
    title: "Configuración",
    href: `/${locale}/dashboard/settings`,
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params.locale as string) || "es";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const sidebarItems = useMemo(() => getSidebarItems(locale), [locale]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      if (!prev) setOpenSubmenu(null);
      return !prev;
    });
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu((prev) => (prev === title ? null : title));
  };

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-white h-screen relative transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=32&h=32&auto=format&fit=crop"
            alt="Visitae Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          {!isCollapsed && (
            <span className="text-xl font-bold text-blue-800 ">Visitae</span>
          )}
        </Link>
      </div>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 h-8 w-8 rounded-full border bg-white shadow-sm z-10"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
        <span className="sr-only">
          {isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        </span>
      </Button>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 font-normal",
                      pathname.startsWith(item.href) &&
                        "bg-gray-100 font-medium",
                      isCollapsed && "px-2"
                    )}
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    {item.icon}
                    {!isCollapsed && (
                      <span className="flex-1 text-left">{item.title}</span>
                    )}
                    {!isCollapsed && item.submenu && (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openSubmenu === item.title && "rotate-90"
                        )}
                      />
                    )}
                  </Button>
                  {!isCollapsed && openSubmenu === item.title && (
                    <div className="ml-4 pl-2 border-l ">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 ",
                            pathname === subitem.href &&
                              "bg-gray-100 font-medium"
                          )}
                        >
                          <span>{subitem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 font-normal",
                      pathname === item.href && "bg-gray-100 font-medium",
                      isCollapsed && "px-2"
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.title}</span>}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50",
            isCollapsed && "px-2"
          )}
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            window.location.href = `/${locale}/login`;
          }}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Cerrar sesión</span>}
        </Button>
      </div>
    </div>
  );
}
