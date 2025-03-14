// src/app/[locale]/(account)/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import AdminAuthCheck from "@/components/admin/admin-auth-check";

export const metadata: Metadata = {
  title: "Panel de Administración | Visitae",
  description:
    "Panel de administración para la plataforma inmobiliaria Visitae",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthCheck>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminAuthCheck>
  );
}
