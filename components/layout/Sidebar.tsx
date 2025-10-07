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
  DollarSign,
  Wrench,
  Settings,
  Home,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  LogOut,
  // Icônes pour le spectacle vivant
  Theater,
  FileText,
  Package,
  Hotel,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  UserCheck,
  Truck,
  Utensils,
  MapPin,
  Star,
  Shield,
  BookOpen,
  Download,
  Database,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Structure de navigation centrée sur le spectacle vivant
const getNavigation = (locale: string) => [
  // Section principale : Spectacles & Événements
  {
    section: locale === 'en' ? 'Shows & Events' : locale === 'es' ? 'Espectáculos y Eventos' : 'Spectacles & Événements',
    items: [
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
        name: locale === 'en' ? 'Technical Sheets' : locale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques', 
        href: `/${locale}/dashboard/technical-sheets`, 
        icon: FileText
      },
      { 
        name: locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux', 
        href: `/${locale}/dashboard/venues`, 
        icon: MapPin
      }
    ]
  },
  
  // Section : Planning & Timing
  {
    section: locale === 'en' ? 'Planning & Timing' : locale === 'es' ? 'Planificación y Tiempo' : 'Planning & Timing',
    items: [
      { 
        name: locale === 'en' ? 'Master Schedule' : locale === 'es' ? 'Cronograma Principal' : 'Planning Principal', 
        href: `/${locale}/dashboard/planning`, 
        icon: Calendar,
      },
      { 
        name: locale === 'en' ? 'Setup & Breakdown' : locale === 'es' ? 'Montaje y Desmontaje' : 'Montage & Démontage', 
        href: `/${locale}/dashboard/setup-breakdown`, 
        icon: Wrench,
      },
      { 
        name: locale === 'en' ? 'Transportation' : locale === 'es' ? 'Transporte' : 'Transport', 
        href: `/${locale}/dashboard/transportation`, 
        icon: Truck,
      },
      { 
        name: locale === 'en' ? 'Catering' : locale === 'es' ? 'Catering' : 'Restauration', 
        href: `/${locale}/dashboard/catering`, 
        icon: Utensils,
      }
    ]
  },
  
  // Section : Personnel & Équipes
  {
    section: locale === 'en' ? 'Personnel & Teams' : locale === 'es' ? 'Personal y Equipos' : 'Personnel & Équipes',
    items: [
      { 
        name: locale === 'en' ? 'Team Management' : locale === 'es' ? 'Gestión de Equipos' : 'Gestion d\'Équipes', 
        href: `/${locale}/dashboard/team`, 
        icon: Users,
      },
      { 
        name: locale === 'en' ? 'Artists & Performers' : locale === 'es' ? 'Artistas y Intérpretes' : 'Artistes & Interprètes', 
        href: `/${locale}/dashboard/artists`, 
        icon: Star,
      },
      { 
        name: locale === 'en' ? 'Technical Crew' : locale === 'es' ? 'Equipo Técnico' : 'Équipe Technique', 
        href: `/${locale}/dashboard/technical-crew`, 
        icon: Wrench,
      },
      { 
        name: locale === 'en' ? 'Security & Safety' : locale === 'es' ? 'Seguridad' : 'Sécurité & Sûreté', 
        href: `/${locale}/dashboard/security`, 
        icon: Shield,
      }
    ]
  },
  
  // Section : Ressources & Matériel
  {
    section: locale === 'en' ? 'Resources & Equipment' : locale === 'es' ? 'Recursos y Equipamiento' : 'Ressources & Matériel',
    items: [
      { 
        name: locale === 'en' ? 'Equipment Inventory' : locale === 'es' ? 'Inventario de Equipos' : 'Inventaire Matériel', 
        href: `/${locale}/dashboard/equipment`, 
        icon: Package,
      },
      { 
        name: locale === 'en' ? 'Suppliers' : locale === 'es' ? 'Proveedores' : 'Fournisseurs', 
        href: `/${locale}/dashboard/suppliers`, 
        icon: Building2,
      },
      { 
        name: locale === 'en' ? 'Purchase Orders' : locale === 'es' ? 'Órdenes de Compra' : 'Bons de Commande', 
        href: `/${locale}/dashboard/purchase-orders`, 
        icon: ShoppingCart,
      },
      { 
        name: locale === 'en' ? 'Accommodation' : locale === 'es' ? 'Alojamiento' : 'Hébergement', 
        href: `/${locale}/dashboard/accommodation`, 
        icon: Hotel,
      }
    ]
  },
  
  // Section : Finances & Suivi
  {
    section: locale === 'en' ? 'Finance & Tracking' : locale === 'es' ? 'Finanzas y Seguimiento' : 'Finances & Suivi',
    items: [
      { 
        name: locale === 'en' ? 'Budget Management' : locale === 'es' ? 'Gestión de Presupuesto' : 'Gestion Budget', 
        href: `/${locale}/dashboard/budget`, 
        icon: DollarSign,
      },
      { 
        name: locale === 'en' ? 'Financial Reports' : locale === 'es' ? 'Reportes Financieros' : 'Rapports Financiers', 
        href: `/${locale}/dashboard/financial-reports`, 
        icon: BarChart3,
      },
      { 
        name: locale === 'en' ? 'Payroll Export' : locale === 'es' ? 'Exportar Nómina' : 'Export Paie', 
        href: `/${locale}/dashboard/payroll-export`, 
        icon: Download,
      }
    ]
  },
  
  // Section : Communication & Collaboration
  {
    section: locale === 'en' ? 'Communication & Collaboration' : locale === 'es' ? 'Comunicación y Colaboración' : 'Communication & Collaboration',
    items: [
      { 
        name: locale === 'en' ? 'Internal Messaging' : locale === 'es' ? 'Mensajería Interna' : 'Messagerie Interne', 
        href: `/${locale}/dashboard/messaging`, 
        icon: MessageSquare,
      },
      { 
        name: locale === 'en' ? 'Contacts' : locale === 'es' ? 'Contactos' : 'Contacts', 
        href: `/${locale}/dashboard/contacts`, 
        icon: Users,
      },
      { 
        name: locale === 'en' ? 'Work Groups' : locale === 'es' ? 'Grupos de Trabajo' : 'Groupes de Travail', 
        href: `/${locale}/dashboard/work-groups`, 
        icon: UserCheck,
      }
    ]
  },
  
  // Section : Outils & Paramètres
  {
    section: locale === 'en' ? 'Tools & Settings' : locale === 'es' ? 'Herramientas y Configuración' : 'Outils & Paramètres',
    items: [
      { 
        name: locale === 'en' ? 'Settings' : locale === 'es' ? 'Configuración' : 'Paramètres', 
        href: `/${locale}/dashboard/settings`, 
        icon: Settings,
      },
      { 
        name: locale === 'en' ? 'Data Import/Export' : locale === 'es' ? 'Importar/Exportar Datos' : 'Import/Export Données', 
        href: `/${locale}/dashboard/data-management`, 
        icon: Database,
      },
      { 
        name: locale === 'en' ? 'Help & Documentation' : locale === 'es' ? 'Ayuda y Documentación' : 'Aide & Documentation', 
        href: `/${locale}/dashboard/help`, 
        icon: BookOpen,
      }
    ]
  }
];

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut, getCurrentOrganization, isLoading } = useAuth();
  const { canManageProjects, canManageUsers, canManageBudget, canManageContracts } = usePermissions();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['shows-events']); // Section par défaut ouverte
  const { currentLocale } = useLocale();

  const currentOrg = getCurrentOrganization();
  const navigation = getNavigation(currentLocale || 'fr');

  // Fonction pour basculer l'expansion d'une section
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  // Fonction pour vérifier si un élément est actif
  const isItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Fonction pour vérifier si une section contient un élément actif
  const hasActiveItem = (items: any[]) => {
    return items.some(item => isItemActive(item.href));
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
            <nav className="space-y-2">
              {navigation.map((section, sectionIndex) => {
                const sectionKey = section.section.toLowerCase().replace(/\s+/g, '-');
                const isExpanded = expandedSections.includes(sectionKey);
                const hasActive = hasActiveItem(section.items);
                
                return (
                  <div key={section.section} className="space-y-1">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(sectionKey)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-colors",
                        hasActive 
                          ? "bg-blue-50 text-blue-700" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      {!collapsed && (
                        <>
                          <span className="truncate">{section.section}</span>
                          <ChevronDown 
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded ? "rotate-180" : ""
                            )} 
                          />
                        </>
                      )}
                    </button>

                    {/* Section Items */}
                    {!collapsed && isExpanded && (
                      <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                        {section.items.map((item) => {
                          const isActive = isItemActive(item.href);
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={cn(
                                "group flex items-start space-x-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                isActive
                                  ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500 -ml-6 pl-6"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              )}
                            >
                              <item.icon className={cn(
                                "h-4 w-4 flex-shrink-0 mt-0.5",
                                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                              )} />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.name}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
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

