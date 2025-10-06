"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MapPin, 
  Wrench, 
  CheckSquare, 
  Plus,
  Clock,
  Euro,
  TrendingUp,
  AlertTriangle,
  Calendar,
  UserPlus,
  Building2,
  Settings
} from "lucide-react";

interface TeamPageProps {
  params: Promise<{
    locale: string;
  }>;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  hourlyRate: number;
  totalHoursWorked: number;
  totalEarnings: number;
  isIntermittent: boolean;
  skills: string[];
}

interface Venue {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  capacity: number;
  totalBookings: number;
  totalRevenue: number;
}

interface Provider {
  id: string;
  name: string;
  type: string;
  contactName: string;
  contactEmail: string;
  hourlyRate: number;
  totalHoursWorked: number;
  totalEarnings: number;
  equipment: string[];
  skills: string[];
}

interface Task {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  startDate: string;
  endDate: string;
  assignedMembers: any[];
  assignedProviders: any[];
  totalCost: number;
  totalHours: number;
  venue: any;
  project: any;
}

export default function TeamPage({ params }: TeamPageProps) {
  const [locale, setLocale] = useState('fr');
  const [activeTab, setActiveTab] = useState('overview');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, venuesRes, providersRes, tasksRes] = await Promise.all([
          fetch('/api/team/members'),
          fetch('/api/team/venues'),
          fetch('/api/team/providers'),
          fetch('/api/team/tasks')
        ]);

        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData.members || []);
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
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculer les statistiques
  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'ACTIVE').length,
    totalVenues: venues.length,
    totalProviders: providers.length,
    totalTasks: tasks.length,
    activeTasks: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    totalHours: members.reduce((sum, m) => sum + m.totalHoursWorked, 0),
    totalEarnings: members.reduce((sum, m) => sum + m.totalEarnings, 0),
    totalCosts: tasks.reduce((sum, t) => sum + t.totalCost, 0),
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          {locale === 'en' ? 'Loading team data...' : locale === 'es' ? 'Cargando datos del equipo...' : 'Chargement des données d\'équipe...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Team Management' : locale === 'es' ? 'Gestión de Equipo' : 'Gestion d\'Équipe'}
          </h1>
          <p className="text-gray-600 mt-1">
            {locale === 'en' ? 'Manage your team, venues, providers and tasks' : locale === 'es' ? 'Gestiona tu equipo, lugares, proveedores y tareas' : 'Gérez votre équipe, lieux, prestataires et tâches'}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {locale === 'en' ? 'Add Task' : locale === 'es' ? 'Agregar Tarea' : 'Ajouter une Tâche'}
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Team Members' : locale === 'es' ? 'Miembros del Equipo' : 'Membres d\'Équipe'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeMembers} {locale === 'en' ? 'active' : locale === 'es' ? 'activos' : 'actifs'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Total Hours' : locale === 'es' ? 'Horas Totales' : 'Heures Totales'}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'worked this month' : locale === 'es' ? 'trabajadas este mes' : 'travaillées ce mois'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Total Earnings' : locale === 'es' ? 'Ganancias Totales' : 'Gains Totaux'}
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'team earnings' : locale === 'es' ? 'ganancias del equipo' : 'gains de l\'équipe'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Active Tasks' : locale === 'es' ? 'Tareas Activas' : 'Tâches Actives'}
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTasks} {locale === 'en' ? 'total tasks' : locale === 'es' ? 'tareas totales' : 'tâches au total'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            {locale === 'en' ? 'Overview' : locale === 'es' ? 'Resumen' : 'Aperçu'}
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'Members' : locale === 'es' ? 'Miembros' : 'Membres'}
          </TabsTrigger>
          <TabsTrigger value="venues">
            <MapPin className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux'}
          </TabsTrigger>
          <TabsTrigger value="providers">
            <Wrench className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'Providers' : locale === 'es' ? 'Proveedores' : 'Prestataires'}
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckSquare className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'Tasks' : locale === 'es' ? 'Tareas' : 'Tâches'}
          </TabsTrigger>
        </TabsList>

        {/* Aperçu */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Membres récents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>
                    {locale === 'en' ? 'Recent Members' : locale === 'es' ? 'Miembros Recientes' : 'Membres Récents'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={member.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          €{member.hourlyRate}/h
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tâches récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5" />
                  <span>
                    {locale === 'en' ? 'Recent Tasks' : locale === 'es' ? 'Tareas Recientes' : 'Tâches Récentes'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-500">{task.type}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          task.priority === 'URGENT' ? 'destructive' :
                          task.priority === 'HIGH' ? 'default' :
                          task.priority === 'MEDIUM' ? 'secondary' : 'outline'
                        }>
                          {task.priority}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(task.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Membres */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'en' ? 'Team Members' : locale === 'es' ? 'Miembros del Equipo' : 'Membres d\'Équipe'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'en' ? 'Manage your team members and their roles' : locale === 'es' ? 'Gestiona los miembros de tu equipo y sus roles' : 'Gérez les membres de votre équipe et leurs rôles'}
                  </CardDescription>
                </div>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {locale === 'en' ? 'Add Member' : locale === 'es' ? 'Agregar Miembro' : 'Ajouter un Membre'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{member.role}</Badge>
                          {member.isIntermittent && (
                            <Badge variant="secondary">Intermittent</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{member.hourlyRate}/h</p>
                      <p className="text-sm text-gray-500">
                        {member.totalHoursWorked}h travaillées
                      </p>
                      <p className="text-sm text-gray-500">
                        €{member.totalEarnings.toLocaleString()} gagnés
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lieux */}
        <TabsContent value="venues" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'en' ? 'Manage your venues and locations' : locale === 'es' ? 'Gestiona tus lugares y ubicaciones' : 'Gérez vos lieux et emplacements'}
                  </CardDescription>
                </div>
                <Button>
                  <Building2 className="w-4 h-4 mr-2" />
                  {locale === 'en' ? 'Add Venue' : locale === 'es' ? 'Agregar Lugar' : 'Ajouter un Lieu'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {venues.map((venue) => (
                  <div key={venue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{venue.name}</p>
                        <p className="text-sm text-gray-500">{venue.address}, {venue.city}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{venue.type}</Badge>
                          {venue.capacity && (
                            <Badge variant="secondary">{venue.capacity} places</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{venue.totalBookings} réservations</p>
                      <p className="text-sm text-gray-500">
                        €{venue.totalRevenue.toLocaleString()} de revenus
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prestataires */}
        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'en' ? 'Providers' : locale === 'es' ? 'Proveedores' : 'Prestataires'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'en' ? 'Manage your service providers' : locale === 'es' ? 'Gestiona tus proveedores de servicios' : 'Gérez vos prestataires de services'}
                  </CardDescription>
                </div>
                <Button>
                  <Wrench className="w-4 h-4 mr-2" />
                  {locale === 'en' ? 'Add Provider' : locale === 'es' ? 'Agregar Proveedor' : 'Ajouter un Prestataire'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-gray-500">{provider.contactEmail}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{provider.type}</Badge>
                          {provider.equipment.length > 0 && (
                            <Badge variant="secondary">{provider.equipment.length} équipements</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{provider.hourlyRate}/h</p>
                      <p className="text-sm text-gray-500">
                        {provider.totalHoursWorked}h travaillées
                      </p>
                      <p className="text-sm text-gray-500">
                        €{provider.totalEarnings.toLocaleString()} gagnés
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tâches */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'en' ? 'Tasks' : locale === 'es' ? 'Tareas' : 'Tâches'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'en' ? 'Manage your tasks and assignments' : locale === 'es' ? 'Gestiona tus tareas y asignaciones' : 'Gérez vos tâches et assignations'}
                  </CardDescription>
                </div>
                <Button>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  {locale === 'en' ? 'Add Task' : locale === 'es' ? 'Agregar Tarea' : 'Ajouter une Tâche'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-500">{task.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          task.priority === 'URGENT' ? 'destructive' :
                          task.priority === 'HIGH' ? 'default' :
                          task.priority === 'MEDIUM' ? 'secondary' : 'outline'
                        }>
                          {task.priority}
                        </Badge>
                        <Badge variant={
                          task.status === 'COMPLETED' ? 'default' :
                          task.status === 'IN_PROGRESS' ? 'secondary' : 'outline'
                        }>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Dates</p>
                        <p>{new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Assignés</p>
                        <p>{task.assignedMembers.length} membres, {task.assignedProviders.length} prestataires</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Coût</p>
                        <p className="font-medium">€{task.totalCost.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
