"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth, usePermissions } from "@/hooks/useAuth";
import {
  Calendar,
  Users,
  DollarSign,
  Wrench,
  Settings,
  Home,
  Plus,
  ChevronLeft,
  ChevronRight,
  Building2,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projets", href: "/projects", icon: Calendar },
  { name: "Planning", href: "/planning", icon: Calendar },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Budget", href: "/budget", icon: DollarSign },
  { name: "Technique", href: "/technical", icon: Wrench },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut, getCurrentOrganization } = useAuth();
  const { canManageProjects, canManageUsers, canManageBudget, canManageContracts } = usePermissions();
  const [collapsed, setCollapsed] = useState(false);

  const currentOrg = getCurrentOrganization();

  const filteredNavigation = navigation.filter((item) => {
    switch (item.name) {
      case "Projets":
      case "Planning":
        return canManageProjects;
      case "Budget":
        return canManageBudget;
      case "Technique":
        return canManageContracts;
      case "Paramètres":
        return canManageUsers;
      default:
        return true;
    }
  });

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
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed && "lg:w-16"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Spectacle</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex"
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
            <div className="px-4 py-3 border-b">
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
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Quick actions */}
          {!collapsed && canManageProjects && (
            <>
              <Separator />
              <div className="px-4 py-3">
                <Button className="w-full justify-start" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau projet
                </Button>
              </div>
            </>
          )}

          {/* User info */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
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
                Déconnexion
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

