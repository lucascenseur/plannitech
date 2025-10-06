"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileText,
  MapPin,
  Settings,
  Star,
  Zap,
  Building2,
  UserPlus,
  Copy,
  Download,
  BarChart3,
  Target,
  Activity
} from "lucide-react";
import Link from "next/link";

interface DashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const [locale, setLocale] = useState('fr');
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [events, setEvents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [providers, setProviders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les données du dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          projectsRes, 
          contactsRes, 
          budgetsRes, 
          eventsRes,
          teamMembersRes,
          venuesRes,
          providersRes,
          tasksRes,
          templatesRes
        ] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/contacts'),
          fetch('/api/budgets'),
          fetch('/api/events'),
          fetch('/api/team/members'),
          fetch('/api/team/venues'),
          fetch('/api/team/providers'),
          fetch('/api/team/tasks'),
          fetch('/api/team/templates')
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

        if (teamMembersRes.ok) {
          const teamMembersData = await teamMembersRes.json();
          setTeamMembers(teamMembersData.members || []);
        }

        if (venuesRes.ok) {
          const venuesData = await venuesRes.json();
          setVenues(venuesData.venues || []);
        }

        if (providersRes.ok) {
          const providersData = await providersRes.json();
          setProviders(providersData.providers || []);
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.tasks || []);
        }

        if (templatesRes.ok) {
          const templatesData = await templatesRes.json();
          setTemplates(templatesData.templates || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculer les statistiques
  const totalBudget = budgets.reduce((sum, budget) => sum + (budget.totalAmount || 0), 0);
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const totalHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  const totalCost = tasks.reduce((sum, task) => sum + (task.totalCost || 0), 0);
  const activeMembers = teamMembers.filter(m => m.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Header avec navigation par onglets */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'en' ? 'Dashboard' : locale === 'es' ? 'Panel' : 'Tableau de bord'}
          </h1>
          <p className="text-gray-600 mt-1">
            {locale === 'en' ? 'Your complete event management workspace' : locale === 'es' ? 'Tu espacio de trabajo completo de gestión de eventos' : 'Votre espace de travail complet de gestion d\'événements'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/dashboard/team/templates`}>
              <Copy className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Templates' : locale === 'es' ? 'Plantillas' : 'Templates'}
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/${locale}/dashboard/team`}>
              <Plus className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Quick Task' : locale === 'es' ? 'Tarea Rápida' : 'Tâche rapide'}
            </Link>
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'Overview' : locale === 'es' ? 'Resumen' : 'Aperçu'}
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'Team' : locale === 'es' ? 'Equipo' : 'Équipe'}
          </TabsTrigger>
          <TabsTrigger value="projects">
            <FolderOpen className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'Projects' : locale === 'es' ? 'Proyectos' : 'Projets'}
          </TabsTrigger>
          <TabsTrigger value="planning">
            <Calendar className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificación' : 'Planning'}
          </TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {locale === 'en' ? 'Active Tasks' : locale === 'es' ? 'Tareas Activas' : 'Tâches Actives'}
                </CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : activeTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {totalTasks} {locale === 'en' ? 'total tasks' : locale === 'es' ? 'tareas totales' : 'tâches au total'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {locale === 'en' ? 'Team Members' : locale === 'es' ? 'Miembros del Equipo' : 'Membres d\'Équipe'}
                </CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : activeMembers}</div>
                <p className="text-xs text-muted-foreground">
                  {teamMembers.length} {locale === 'en' ? 'total members' : locale === 'es' ? 'miembros totales' : 'membres au total'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {locale === 'en' ? 'Total Hours' : locale === 'es' ? 'Horas Totales' : 'Heures Totales'}
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : `${totalHours}h`}</div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'planned this month' : locale === 'es' ? 'planificadas este mes' : 'planifiées ce mois'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {locale === 'en' ? 'Total Cost' : locale === 'es' ? 'Costo Total' : 'Coût Total'}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : `€${totalCost.toLocaleString()}`}</div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'estimated costs' : locale === 'es' ? 'costos estimados' : 'coûts estimés'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tâches récentes */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      {locale === 'en' ? 'Recent Tasks' : locale === 'es' ? 'Tareas Recientes' : 'Tâches Récentes'}
                    </CardTitle>
                    <CardDescription>
                      {locale === 'en' ? 'Your latest team tasks and assignments' : locale === 'es' ? 'Tus últimas tareas y asignaciones del equipo' : 'Vos dernières tâches et assignations d\'équipe'}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${locale}/dashboard/team`}>
                      {locale === 'en' ? 'View all' : locale === 'es' ? 'Ver todo' : 'Voir tout'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      {locale === 'en' ? 'Loading tasks...' : locale === 'es' ? 'Cargando tareas...' : 'Chargement des tâches...'}
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {locale === 'en' ? 'No tasks yet' : locale === 'es' ? 'Aún no hay tareas' : 'Aucune tâche pour le moment'}
                      <br />
                      <Button asChild className="mt-2">
                        <Link href={`/${locale}/dashboard/team`}>
                          <Plus className="w-4 h-4 mr-2" />
                          {locale === 'en' ? 'Create your first task' : locale === 'es' ? 'Crear tu primera tarea' : 'Créer votre première tâche'}
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.slice(0, 4).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-gray-900">{task.title}</h4>
                              <Badge variant="secondary" className={
                                task.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                                task.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {task.type} • {task.estimatedHours}h • {task.assignedMembers?.length || 0} {locale === 'en' ? 'members' : locale === 'es' ? 'miembros' : 'membres'}
                            </p>
                            {task.startDate && (
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.startDate).toLocaleDateString()}
                                </span>
                                {task.venue && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {task.venue}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/${locale}/dashboard/team`}>
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
              {/* Templates populaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Copy className="w-5 h-5" />
                    {locale === 'en' ? 'Popular Templates' : locale === 'es' ? 'Plantillas Populares' : 'Templates Populaires'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4 text-gray-500">
                      {locale === 'en' ? 'Loading...' : locale === 'es' ? 'Cargando...' : 'Chargement...'}
                    </div>
                  ) : templates.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      {locale === 'en' ? 'No templates' : locale === 'es' ? 'Sin plantillas' : 'Aucun template'}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {templates.slice(0, 3).map((template) => (
                        <div key={template.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{template.name}</p>
                            <p className="text-xs text-gray-500">
                              {template.duration}h • {template.usageCount} {locale === 'en' ? 'uses' : locale === 'es' ? 'usos' : 'utilisations'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link href={`/${locale}/dashboard/team/templates`}>
                      {locale === 'en' ? 'View templates' : locale === 'es' ? 'Ver plantillas' : 'Voir les templates'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href={`/${locale}/dashboard/team`}>
                      <Plus className="w-4 h-4 mr-2" />
                      {locale === 'en' ? 'New Task' : locale === 'es' ? 'Nueva Tarea' : 'Nouvelle Tâche'}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href={`/${locale}/dashboard/team/templates`}>
                      <Copy className="w-4 h-4 mr-2" />
                      {locale === 'en' ? 'Use Template' : locale === 'es' ? 'Usar Plantilla' : 'Utiliser Template'}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href={`/${locale}/dashboard/team/planning`}>
                      <Download className="w-4 h-4 mr-2" />
                      {locale === 'en' ? 'Export Planning' : locale === 'es' ? 'Exportar Planificación' : 'Exporter Planning'}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href={`/${locale}/dashboard/team`}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      {locale === 'en' ? 'Add Team Member' : locale === 'es' ? 'Agregar Miembro' : 'Ajouter Membre'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Équipe */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Membres d'équipe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {locale === 'en' ? 'Team Members' : locale === 'es' ? 'Miembros del Equipo' : 'Membres d\'Équipe'}
                </CardTitle>
                <CardDescription>
                  {activeMembers} {locale === 'en' ? 'active members' : locale === 'es' ? 'miembros activos' : 'membres actifs'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.slice(0, 4).map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                      <Badge variant={member.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href={`/${locale}/dashboard/team`}>
                    {locale === 'en' ? 'Manage Team' : locale === 'es' ? 'Gestionar Equipo' : 'Gérer l\'Équipe'}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Lieux */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux'}
                </CardTitle>
                <CardDescription>
                  {venues.length} {locale === 'en' ? 'venues' : locale === 'es' ? 'lugares' : 'lieux'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {venues.slice(0, 4).map((venue) => (
                    <div key={venue.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{venue.name}</p>
                        <p className="text-xs text-gray-500">{venue.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href={`/${locale}/dashboard/team`}>
                    {locale === 'en' ? 'Manage Venues' : locale === 'es' ? 'Gestionar Lugares' : 'Gérer les Lieux'}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Prestataires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  {locale === 'en' ? 'Providers' : locale === 'es' ? 'Proveedores' : 'Prestataires'}
                </CardTitle>
                <CardDescription>
                  {providers.length} {locale === 'en' ? 'providers' : locale === 'es' ? 'proveedores' : 'prestataires'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {providers.slice(0, 4).map((provider) => (
                    <div key={provider.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Wrench className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{provider.name}</p>
                        <p className="text-xs text-gray-500">{provider.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href={`/${locale}/dashboard/team`}>
                    {locale === 'en' ? 'Manage Providers' : locale === 'es' ? 'Gestionar Proveedores' : 'Gérer les Prestataires'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Projets */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  {locale === 'en' ? 'My Projects' : locale === 'es' ? 'Mis Proyectos' : 'Mes Projets'}
                </CardTitle>
                <CardDescription>
                  {projects.length} {locale === 'en' ? 'total projects' : locale === 'es' ? 'proyectos totales' : 'projets au total'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-gray-500">{project.description}</p>
                      </div>
                      <Badge variant="secondary">{project.status}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href={`/${locale}/dashboard/projects`}>
                    {locale === 'en' ? 'View all projects' : locale === 'es' ? 'Ver todos los proyectos' : 'Voir tous les projets'}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {locale === 'en' ? 'Budget Overview' : locale === 'es' ? 'Resumen de Presupuesto' : 'Aperçu Budget'}
                </CardTitle>
                <CardDescription>
                  {locale === 'en' ? 'Financial summary' : locale === 'es' ? 'Resumen financiero' : 'Résumé financier'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {locale === 'en' ? 'Total Budget' : locale === 'es' ? 'Presupuesto Total' : 'Budget Total'}
                    </span>
                    <span className="font-bold">€{totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {locale === 'en' ? 'Estimated Costs' : locale === 'es' ? 'Costos Estimados' : 'Coûts Estimés'}
                    </span>
                    <span className="font-bold">€{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {locale === 'en' ? 'Remaining' : locale === 'es' ? 'Restante' : 'Restant'}
                    </span>
                    <span className="font-bold text-green-600">€{(totalBudget - totalCost).toLocaleString()}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href={`/${locale}/dashboard/budget`}>
                    {locale === 'en' ? 'Manage Budget' : locale === 'es' ? 'Gestionar Presupuesto' : 'Gérer le Budget'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Planning */}
        <TabsContent value="planning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {locale === 'en' ? 'Upcoming Events' : locale === 'es' ? 'Próximos Eventos' : 'Événements à Venir'}
                </CardTitle>
                <CardDescription>
                  {events.length} {locale === 'en' ? 'events scheduled' : locale === 'es' ? 'eventos programados' : 'événements programmés'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 5).map((event) => (
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
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href={`/${locale}/dashboard/planning`}>
                    {locale === 'en' ? 'View planning' : locale === 'es' ? 'Ver planificación' : 'Voir le planning'}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  {locale === 'en' ? 'Export Planning' : locale === 'es' ? 'Exportar Planificación' : 'Exporter Planning'}
                </CardTitle>
                <CardDescription>
                  {locale === 'en' ? 'Generate PDF reports' : locale === 'es' ? 'Generar informes PDF' : 'Générer des rapports PDF'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">
                      {locale === 'en' ? 'Weekly Planning' : locale === 'es' ? 'Planificación Semanal' : 'Planning Hebdomadaire'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {locale === 'en' ? 'Export current week tasks' : locale === 'es' ? 'Exportar tareas de la semana actual' : 'Exporter les tâches de la semaine actuelle'}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">
                      {locale === 'en' ? 'Monthly Overview' : locale === 'es' ? 'Resumen Mensual' : 'Aperçu Mensuel'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {locale === 'en' ? 'Complete monthly planning' : locale === 'es' ? 'Planificación mensual completa' : 'Planning mensuel complet'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href={`/${locale}/dashboard/team/planning`}>
                    {locale === 'en' ? 'Export Planning' : locale === 'es' ? 'Exportar Planificación' : 'Exporter Planning'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
