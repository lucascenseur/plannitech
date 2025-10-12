"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContextCard } from "@/components/dashboard/context-card";
import { QuickActions } from "@/components/ui/quick-actions";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Theater,
  MessageSquare,
  Package,
  Truck,
  Utensils,
  MapPin,
  FileText,
  BarChart3,
  Star,
  Building2
} from "lucide-react";
import Link from "next/link";

interface DashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const [locale, setLocale] = useState('fr');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    shows: 0,
    venues: 0,
    contacts: 0,
    upcomingShows: 0,
    totalBudget: 0,
    activeTasks: 0
  });

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les données du dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [showsRes, venuesRes, contactsRes, planningRes, budgetRes] = await Promise.all([
          fetch('/api/shows'),
          fetch('/api/venues'),
          fetch('/api/contacts'),
          fetch('/api/planning'),
          fetch('/api/budgets')
        ]);

        const shows = showsRes.ok ? await showsRes.json() : { shows: [] };
        const venues = venuesRes.ok ? await venuesRes.json() : { venues: [] };
        const contacts = contactsRes.ok ? await contactsRes.json() : { contacts: [] };
        const planning = planningRes.ok ? await planningRes.json() : { items: [] };
        const budgets = budgetRes.ok ? await budgetRes.json() : { budgets: [] };

        setStats({
          shows: shows.shows?.length || 0,
          venues: venues.venues?.length || 0,
          contacts: contacts.contacts?.length || 0,
          upcomingShows: shows.shows?.filter((s: any) => new Date(s.date) > new Date()).length || 0,
          totalBudget: budgets.budgets?.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0) || 0,
          activeTasks: planning.items?.filter((p: any) => p.status === 'in_progress').length || 0
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header avec actions rapides */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'en' ? 'Dashboard' : locale === 'es' ? 'Panel' : 'Tableau de Bord'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'en' 
              ? 'Your central hub for managing shows, planning, and teams' 
              : locale === 'es' 
              ? 'Tu centro de control para gestionar espectáculos, planificación y equipos'
              : 'Votre centre de contrôle pour gérer spectacles, planning et équipes'
            }
          </p>
        </div>
        
        <QuickActions locale={locale} />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white text-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {locale === 'en' ? 'Total Shows' : locale === 'es' ? 'Total Espectáculos' : 'Total Spectacles'}
            </CardTitle>
            <Theater className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.shows}</div>
            <p className="text-xs text-gray-500">
              {stats.upcomingShows} {locale === 'en' ? 'upcoming' : locale === 'es' ? 'próximos' : 'à venir'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {locale === 'en' ? 'Active Tasks' : locale === 'es' ? 'Tareas Activas' : 'Tâches Actives'}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.activeTasks}</div>
            <p className="text-xs text-gray-500">
              {locale === 'en' ? 'in progress' : locale === 'es' ? 'en progreso' : 'en cours'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {locale === 'en' ? 'Total Budget' : locale === 'es' ? 'Presupuesto Total' : 'Budget Total'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalBudget.toLocaleString()}€</div>
            <p className="text-xs text-gray-500">
              {locale === 'en' ? 'allocated' : locale === 'es' ? 'asignado' : 'alloué'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {locale === 'en' ? 'Contacts' : locale === 'es' ? 'Contactos' : 'Contacts'}
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.contacts}</div>
            <p className="text-xs text-gray-500">
              {locale === 'en' ? 'people' : locale === 'es' ? 'personas' : 'personnes'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cartes contextuelles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Carte Spectacles */}
        <ContextCard
          title={locale === 'en' ? 'Shows & Events' : locale === 'es' ? 'Espectáculos y Eventos' : 'Spectacles & Événements'}
          description={locale === 'en' ? 'Manage your shows, venues, and technical sheets' : locale === 'es' ? 'Gestiona tus espectáculos, lugares y fichas técnicas' : 'Gérez vos spectacles, lieux et fiches techniques'}
          icon={Theater}
          stats={[
            { value: stats.shows, label: locale === 'en' ? 'Shows' : locale === 'es' ? 'Espectáculos' : 'Spectacles' },
            { value: stats.venues, label: locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux' }
          ]}
          quickLinks={[
            { label: locale === 'en' ? 'All Shows' : locale === 'es' ? 'Todos los Espectáculos' : 'Tous les Spectacles', href: '/dashboard/shows' },
            { label: locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux', href: '/dashboard/shows' },
            { label: locale === 'en' ? 'Technical Sheets' : locale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques', href: '/dashboard/shows' }
          ]}
          mainAction={{
            label: locale === 'en' ? 'Create New Show' : locale === 'es' ? 'Crear Nuevo Espectáculo' : 'Créer un Nouveau Spectacle',
            href: '/dashboard/shows/new'
          }}
          color="blue"
          locale={locale}
        />

        {/* Carte Planning */}
        <ContextCard
          title={locale === 'en' ? 'Planning & Logistics' : locale === 'es' ? 'Planificación y Logística' : 'Planning & Logistique'}
          description={locale === 'en' ? 'Schedule, setup, transport, and catering management' : locale === 'es' ? 'Gestión de horarios, montaje, transporte y catering' : 'Gestion des horaires, montage, transport et restauration'}
          icon={Calendar}
          stats={[
            { value: stats.activeTasks, label: locale === 'en' ? 'Active Tasks' : locale === 'es' ? 'Tareas Activas' : 'Tâches Actives' },
            { value: stats.upcomingShows, label: locale === 'en' ? 'Upcoming' : locale === 'es' ? 'Próximos' : 'À Venir' }
          ]}
          quickLinks={[
            { label: locale === 'en' ? 'Calendar View' : locale === 'es' ? 'Vista de Calendario' : 'Vue Calendrier', href: '/dashboard/planning' },
            { label: locale === 'en' ? 'Setup & Breakdown' : locale === 'es' ? 'Montaje y Desmontaje' : 'Montage & Démontage', href: '/dashboard/planning' },
            { label: locale === 'en' ? 'Transportation' : locale === 'es' ? 'Transporte' : 'Transport', href: '/dashboard/planning' },
            { label: locale === 'en' ? 'Catering' : locale === 'es' ? 'Catering' : 'Restauration', href: '/dashboard/planning' }
          ]}
          mainAction={{
            label: locale === 'en' ? 'New Planning Event' : locale === 'es' ? 'Nuevo Evento de Planificación' : 'Nouvel Événement Planning',
            href: '/dashboard/planning'
          }}
          color="green"
          locale={locale}
        />

        {/* Carte Équipe & Contacts */}
        <ContextCard
          title={locale === 'en' ? 'Team & Contacts' : locale === 'es' ? 'Equipo y Contactos' : 'Équipe & Contacts'}
          description={locale === 'en' ? 'Manage your team, artists, and external contacts' : locale === 'es' ? 'Gestiona tu equipo, artistas y contactos externos' : 'Gérez votre équipe, artistes et contacts externes'}
          icon={Users}
          stats={[
            { value: stats.contacts, label: locale === 'en' ? 'Contacts' : locale === 'es' ? 'Contactos' : 'Contacts' },
            { value: Math.floor(stats.contacts * 0.3), label: locale === 'en' ? 'Artists' : locale === 'es' ? 'Artistas' : 'Artistes' }
          ]}
          quickLinks={[
            { label: locale === 'en' ? 'Team Members' : locale === 'es' ? 'Miembros del Equipo' : 'Membres d\'Équipe', href: '/dashboard/team' },
            { label: locale === 'en' ? 'Artists' : locale === 'es' ? 'Artistas' : 'Artistes', href: '/dashboard/team' },
            { label: locale === 'en' ? 'Technical Crew' : locale === 'es' ? 'Equipo Técnico' : 'Équipe Technique', href: '/dashboard/team' }
          ]}
          mainAction={{
            label: locale === 'en' ? 'Add New Contact' : locale === 'es' ? 'Agregar Nuevo Contacto' : 'Ajouter un Nouveau Contact',
            href: '/dashboard/team'
          }}
          color="purple"
          locale={locale}
        />

        {/* Carte Ressources */}
        <ContextCard
          title={locale === 'en' ? 'Resources & Equipment' : locale === 'es' ? 'Recursos y Equipamiento' : 'Ressources & Matériel'}
          description={locale === 'en' ? 'Manage equipment, suppliers, and accommodation' : locale === 'es' ? 'Gestiona equipamiento, proveedores y alojamiento' : 'Gérez le matériel, fournisseurs et hébergement'}
          icon={Package}
          stats={[
            { value: 12, label: locale === 'en' ? 'Equipment' : locale === 'es' ? 'Equipamiento' : 'Matériel' },
            { value: 8, label: locale === 'en' ? 'Suppliers' : locale === 'es' ? 'Proveedores' : 'Fournisseurs' }
          ]}
          quickLinks={[
            { label: locale === 'en' ? 'Equipment Inventory' : locale === 'es' ? 'Inventario de Equipos' : 'Inventaire Matériel', href: '/dashboard/planning' },
            { label: locale === 'en' ? 'Suppliers' : locale === 'es' ? 'Proveedores' : 'Fournisseurs', href: '/dashboard/planning' },
            { label: locale === 'en' ? 'Purchase Orders' : locale === 'es' ? 'Órdenes de Compra' : 'Bons de Commande', href: '/dashboard/planning' }
          ]}
          mainAction={{
            label: locale === 'en' ? 'Add Equipment' : locale === 'es' ? 'Agregar Equipamiento' : 'Ajouter du Matériel',
            href: '/dashboard/planning'
          }}
          color="orange"
          locale={locale}
        />

        {/* Carte Finances */}
        <ContextCard
          title={locale === 'en' ? 'Finance & Budget' : locale === 'es' ? 'Finanzas y Presupuesto' : 'Finances & Budget'}
          description={locale === 'en' ? 'Track budgets, expenses, and financial reports' : locale === 'es' ? 'Rastrea presupuestos, gastos y reportes financieros' : 'Suivez les budgets, dépenses et rapports financiers'}
          icon={DollarSign}
          stats={[
            { value: stats.totalBudget.toLocaleString(), label: locale === 'en' ? 'Total Budget' : locale === 'es' ? 'Presupuesto Total' : 'Budget Total' },
            { value: '85%', label: locale === 'en' ? 'Used' : locale === 'es' ? 'Usado' : 'Utilisé' }
          ]}
          quickLinks={[
            { label: locale === 'en' ? 'Budget Overview' : locale === 'es' ? 'Resumen de Presupuesto' : 'Aperçu Budget', href: '/dashboard/budget' },
            { label: locale === 'en' ? 'Financial Reports' : locale === 'es' ? 'Reportes Financieros' : 'Rapports Financiers', href: '/dashboard/budget' },
            { label: locale === 'en' ? 'Payroll Export' : locale === 'es' ? 'Exportar Nómina' : 'Export Paie', href: '/dashboard/budget' }
          ]}
          mainAction={{
            label: locale === 'en' ? 'Create Budget' : locale === 'es' ? 'Crear Presupuesto' : 'Créer un Budget',
            href: '/dashboard/budget'
          }}
          color="green"
          locale={locale}
        />

        {/* Carte Communication */}
        <ContextCard
          title={locale === 'en' ? 'Communication' : locale === 'es' ? 'Comunicación' : 'Communication'}
          description={locale === 'en' ? 'Internal messaging and work groups' : locale === 'es' ? 'Mensajería interna y grupos de trabajo' : 'Messagerie interne et groupes de travail'}
          icon={MessageSquare}
          stats={[
            { value: 5, label: locale === 'en' ? 'Messages' : locale === 'es' ? 'Mensajes' : 'Messages' },
            { value: 3, label: locale === 'en' ? 'Groups' : locale === 'es' ? 'Grupos' : 'Groupes' }
          ]}
          quickLinks={[
            { label: locale === 'en' ? 'Internal Messaging' : locale === 'es' ? 'Mensajería Interna' : 'Messagerie Interne', href: '/dashboard/team' },
            { label: locale === 'en' ? 'Work Groups' : locale === 'es' ? 'Grupos de Trabajo' : 'Groupes de Travail', href: '/dashboard/team' }
          ]}
          mainAction={{
            label: locale === 'en' ? 'Send Message' : locale === 'es' ? 'Enviar Mensaje' : 'Envoyer un Message',
            href: '/dashboard/team'
          }}
          color="blue"
          locale={locale}
        />
      </div>

      {/* Actions rapides supplémentaires */}
      <div className="bg-blue-50 text-blue-900 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Zap className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Get started quickly with these common tasks.'
                : locale === 'es'
                ? 'Comienza rápidamente con estas tareas comunes.'
                : 'Commencez rapidement avec ces tâches courantes.'
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/dashboard/shows/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Theater className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Create New Show' : locale === 'es' ? 'Crear Nuevo Espectáculo' : 'Créer un Nouveau Spectacle'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/planning`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'View Planning' : locale === 'es' ? 'Ver Planificación' : 'Voir le Planning'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/team`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Users className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Manage Team' : locale === 'es' ? 'Gestionar Equipo' : 'Gérer l\'Équipe'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}