// src/types/admin.ts

// Roles disponibles en el sistema
export type AdminRole = "admin" | "superadmin" | "agent";

// Permisos disponibles en el sistema
export type Permission =
  | "manage:users" // Gestionar usuarios
  | "manage:properties" // Gestionar propiedades
  | "manage:visits" // Gestionar visitas
  | "manage:agents" // Gestionar agentes
  | "view:analytics" // Ver analíticas
  | "manage:settings"; // Gestionar configuraciones

// Mapping de roles a permisos
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  superadmin: [
    "manage:users",
    "manage:properties",
    "manage:visits",
    "manage:agents",
    "view:analytics",
    "manage:settings",
  ],
  admin: [
    "manage:properties",
    "manage:visits",
    "manage:agents",
    "view:analytics",
  ],
  agent: ["manage:visits"],
};

// Usuario administrador
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Modelo para crear un nuevo usuario administrador
export interface CreateAdminUserData {
  email: string;
  name: string;
  password: string;
  role: AdminRole;
  avatarUrl?: string;
}

// Modelo para actualizar un usuario administrador
export interface UpdateAdminUserData {
  name?: string;
  role?: AdminRole;
  avatarUrl?: string;
  isActive?: boolean;
}

// Modelo para cambio de contraseña
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Respuesta de sesión extendida
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatarUrl?: string;
  permissions: Permission[];
}

// Hook de utilidad para verificar permisos
export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission);
}
