"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  FolderOpen, 
  Clock, 
  TrendingUp,
  Plus,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Wrench,
  FileText
} from "lucide-react";
import Link from "next/link";

interface DashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const [locale, setLocale] = useState('fr');
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les données du dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, contactsRes, budgetsRes, eventsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/contacts'),
          fetch('/api/budgets'),
          fetch('/api/events')
        ]);

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData.projects || []);
        }

        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          setContacts(contactsData.contacts || []);
        }

        if (budgetsRes.ok) {
          const budgetsData = await budgetsRes.json();
          setBudgets(budgetsData.budgets || []);
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData.events || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalBudget = budgets.reduce((sum, budget) => sum + (budget.totalAmount || 0), 0);
  const projectsWithDates = projects.filter(p => p.startDate);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'en' ? 'Dashboard' : locale === 'es' ? 'Panel' : 'Tableau de bord'}
          </h1>
          <p className="text-gray-600 mt-1">
            {locale === 'en' ? 'Welcome to your Plannitech workspace' : locale === 'es' ? 'Bienvenido a tu espacio de trabajo Plannitech' : 'Bienvenue sur votre espace de travail Plannitech'}
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/dashboard/projects`}>
            <Plus className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'New Project' : locale === 'es' ? 'Nuevo Proyecto' : 'Nouveau projet'}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {locale === 'en' ? 'Active Projects' : locale === 'es' ? 'Proyectos Activos' : 'Projets actifs'}
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Total projects' : locale === 'es' ? 'Total proyectos' : 'Total projets'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {locale === 'en' ? 'Contacts' : locale === 'es' ? 'Contactos' : 'Contacts'}
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Total contacts' : locale === 'es' ? 'Total contactos' : 'Total contacts'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {locale === 'en' ? 'Total Budget' : locale === 'es' ? 'Presupuesto Total' : 'Budget total'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : `€${totalBudget.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Total allocated' : locale === 'es' ? 'Total asignado' : 'Total alloué'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {locale === 'en' ? 'Events' : locale === 'es' ? 'Eventos' : 'Événements'}
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : events.length}</div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Total events' : locale === 'es' ? 'Total eventos' : 'Total événements'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projets récents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {locale === 'en' ? 'My Projects' : locale === 'es' ? 'Mis Proyectos' : 'Mes projets'}
                </CardTitle>
                <CardDescription>
                  {locale === 'en' ? 'Your current show projects' : locale === 'es' ? 'Tus proyectos de espectáculo actuales' : 'Vos projets de spectacle en cours'}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${locale}/dashboard/projects`}>
                  {locale === 'en' ? 'View all' : locale === 'es' ? 'Ver todo' : 'Voir tout'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  {locale === 'en' ? 'Loading projects...' : locale === 'es' ? 'Cargando proyectos...' : 'Chargement des projets...'}
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {locale === 'en' ? 'No projects yet' : locale === 'es' ? 'Aún no hay proyectos' : 'Aucun projet pour le moment'}
                  <br />
                  <Button asChild className="mt-2">
                    <Link href={`/${locale}/dashboard/projects`}>
                      <Plus className="w-4 h-4 mr-2" />
                      {locale === 'en' ? 'Create your first project' : locale === 'es' ? 'Crear tu primer proyecto' : 'Créer votre premier projet'}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900">{project.name}</h4>
                          <Badge variant="secondary" className={
                            project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            project.status === 'PLANNING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {project.status === 'ACTIVE' ? (locale === 'en' ? 'Active' : locale === 'es' ? 'Activo' : 'Actif') :
                             project.status === 'PLANNING' ? (locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificación' : 'Planification') :
                             project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description || (locale === 'en' ? 'No description' : locale === 'es' ? 'Sin descripción' : 'Aucune description')}
                          {project.budget > 0 && ` • ${locale === 'en' ? 'Budget' : locale === 'es' ? 'Presupuesto' : 'Budget'}: €${project.budget.toLocaleString()}`}
                        </p>
                        {project.startDate && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(project.startDate).toLocaleDateString()}
                              {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${locale}/dashboard/projects`}>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Événements à venir */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {locale === 'en' ? 'Upcoming Events' : locale === 'es' ? 'Próximos Eventos' : 'Événements à venir'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4 text-gray-500">
                  {locale === 'en' ? 'Loading...' : locale === 'es' ? 'Cargando...' : 'Chargement...'}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  {locale === 'en' ? 'No events' : locale === 'es' ? 'Sin eventos' : 'Aucun événement'}
                </div>
              ) : (
                <div className="space-y-3">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {event.startDate && new Date(event.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link href={`/${locale}/dashboard/planning`}>
                  {locale === 'en' ? 'View planning' : locale === 'es' ? 'Ver planificación' : 'Voir le planning'}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions rapides'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/${locale}/dashboard/projects`}>
                  <Plus className="w-4 h-4 mr-2" />
                  {locale === 'en' ? 'New Project' : locale === 'es' ? 'Nuevo Proyecto' : 'Nouveau projet'}
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/${locale}/dashboard/planning`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {locale === 'en' ? 'Add Event' : locale === 'es' ? 'Agregar Evento' : 'Ajouter un événement'}
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/${locale}/dashboard/contacts`}>
                  <Users className="w-4 h-4 mr-2" />
                  {locale === 'en' ? 'New Contact' : locale === 'es' ? 'Nuevo Contacto' : 'Nouveau contact'}
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/${locale}/dashboard/budget`}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  {locale === 'en' ? 'Add Expense' : locale === 'es' ? 'Agregar Gasto' : 'Ajouter une dépense'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
