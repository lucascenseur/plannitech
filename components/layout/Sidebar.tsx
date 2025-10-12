"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth, usePermissions } from "@/hooks/useAuth";
import { useLocale } from "@/lib/i18n";
import {
  Calendar,
  Users,
  Settings,
  Home,
  Plus,
  ChevronLeft,
  ChevronRight,
  Building2,
  LogOut,
  Theater
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Structure de navigation centrée sur le spectacle vivant
const getNavigation = (locale: string) => [
  { 
    name: locale === 'en' ? 'Dashboard' : locale === 'es' ? 'Panel' : 'Tableau de Bord', 
    href: `/${locale}/dashboard`, 
    icon: Home
  },
  { 
    name: locale === 'en' ? 'Shows' : locale === 'es' ? 'Espectáculos' : 'Spectacles', 
    href: `/${locale}/dashboard/shows`, 
    icon: Theater
  },
  { 
    name: locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificación' : 'Planning', 
    href: `/${locale}/dashboard/planning`, 
    icon: Calendar
  },
  { 
    name: locale === 'en' ? 'Team & Contacts' : locale === 'es' ? 'Equipo y Contactos' : 'Équipe & Contacts', 
    href: `/${locale}/dashboard/team`, 
    icon: Users
  },
  { 
    name: locale === 'en' ? 'Settings' : locale === 'es' ? 'Configuración' : 'Paramètres', 
    href: `/${locale}/dashboard/settings`, 
    icon: Settings
  }
];

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut, getCurrentOrganization, isLoading } = useAuth();
  const { canManageProjects, canManageUsers, canManageBudget, canManageContracts } = usePermissions();
  const [collapsed, setCollapsed] = useState(false);
  const { currentLocale } = useLocale();

  const currentOrg = getCurrentOrganization();
  const navigation = getNavigation(currentLocale || 'fr');

  // Fonction pour vérifier si un élément est actif
  const isItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Afficher un loader pendant le chargement de l'authentification
  if (isLoading) {
    return (
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white text-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed && "lg:w-16"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Theater className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white">Plannitech</span>
                  <p className="text-xs text-white/80">Spectacle Vivant</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-white hover:bg-white/20"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Organization info */}
          {!collapsed && currentOrg && (
            <div className="px-4 py-3 border-b bg-gray-50">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentOrg.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentOrg.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 px-2 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = isItemActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500 -ml-2 pl-5"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    )} />
                    {!collapsed && (
                      <span className="font-medium truncate">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Quick Actions */}
          {!collapsed && (
            <>
              <Separator />
              <div className="px-4 py-3 space-y-2">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {currentLocale === 'en' ? 'New Show' : currentLocale === 'es' ? 'Nuevo Espectáculo' : 'Nouveau Spectacle'}
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {currentLocale === 'en' ? 'Quick Planning' : currentLocale === 'es' ? 'Planificación Rápida' : 'Planning Rapide'}
                </Button>
              </div>
            </>
          )}

          {/* User info */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || "Utilisateur"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            {!collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="w-full justify-start mt-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {currentLocale === 'en' ? 'Sign Out' : currentLocale === 'es' ? 'Cerrar Sesión' : 'Déconnexion'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

