"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useOrganizations } from "@/hooks/useAuth";
import { useLocale } from "@/lib/i18n";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import {
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  Building2,
  ChevronDown,
  X,
  Clock,
  FileText,
  Users,
  Calendar,
  Package,
  DollarSign
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { organizations, currentOrganization, switchOrganization } = useOrganizations();
  const { currentLocale } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const getTranslations = (locale: string) => {
    switch (locale) {
      case 'en':
        return {
          search: "Search...",
          organizations: "Organizations",
          current: "Current",
          settings: "Settings",
          logout: "Logout"
        };
      case 'es':
        return {
          search: "Buscar...",
          organizations: "Organizaciones",
          current: "Actual",
          settings: "Configuración",
          logout: "Cerrar sesión"
        };
      default: // fr
        return {
          search: "Rechercher...",
          organizations: "Organisations",
          current: "Actuel",
          settings: "Paramètres",
          logout: "Déconnexion"
        };
    }
  };

  const t = getTranslations(currentLocale);

  // Fonction de recherche globale
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // Simuler une recherche globale
      const mockResults = [
        {
          id: '1',
          type: 'show',
          title: 'Concert Jazz au Théâtre',
          description: 'Spectacle de jazz prévu le 15 mars',
          href: `/${currentLocale}/dashboard/shows/1`,
          icon: Theater
        },
        {
          id: '2',
          type: 'contact',
          title: 'Marie Dubois',
          description: 'Régisseur technique',
          href: `/${currentLocale}/dashboard/team/contacts/2`,
          icon: Users
        },
        {
          id: '3',
          type: 'venue',
          title: 'Théâtre Municipal',
          description: 'Salle de 500 places',
          href: `/${currentLocale}/dashboard/shows?tab=venues`,
          icon: Building2
        },
        {
          id: '4',
          type: 'planning',
          title: 'Planning Mars 2024',
          description: 'Planning détaillé du mois de mars',
          href: `/${currentLocale}/dashboard/planning`,
          icon: Calendar
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  // Gestion des changements de recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fermer les résultats quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="hidden md:block search-container">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={t.search}
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
              />
              
              {/* Résultats de recherche */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                      {currentLocale === 'en' ? 'Search Results' : currentLocale === 'es' ? 'Resultados de Búsqueda' : 'Résultats de Recherche'}
                    </div>
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={result.href}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <result.icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {result.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Aucun résultat */}
              {showSearchResults && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">
                      {currentLocale === 'en' ? 'No results found' : currentLocale === 'es' ? 'No se encontraron resultados' : 'Aucun résultat trouvé'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Organization switcher */}
          <OrganizationSwitcher
            currentOrganizationId={currentOrganization?.id || organizations[0]?.id || ''}
            onOrganizationChange={switchOrganization}
            locale={currentLocale}
          />

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "Utilisateur"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t.settings}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

