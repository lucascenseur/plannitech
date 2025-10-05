"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth, usePermissions } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Users,
  Ticket,
  TrendingUp,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  BarChart3,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const { user, getCurrentOrganization } = useAuth();
  const { canManageProjects, canManageUsers, canViewAnalytics, canManageBudget } = usePermissions();
  const router = useRouter();

  const currentOrg = getCurrentOrganization();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Données simulées pour les widgets
  const stats = [
    {
      title: "Projets actifs",
      value: "12",
      change: "+2 ce mois",
      icon: CalendarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Réservations",
      value: "1,234",
      change: "+15% ce mois",
      icon: Ticket,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Contacts",
      value: "45",
      change: "+3 nouveaux",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    ...(canViewAnalytics ? [{
      title: "Revenus",
      value: "€12,345",
      change: "+8% ce mois",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    }] : []),
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Concert Jazz",
      date: "15 juin 2024",
      time: "20h00",
      venue: "Théâtre Municipal",
      status: "confirmed",
      progress: 75,
    },
    {
      id: 2,
      name: "Spectacle de Danse",
      date: "22 juin 2024",
      time: "19h30",
      venue: "Salle des Fêtes",
      status: "planning",
      progress: 45,
    },
    {
      id: 3,
      name: "Comédie Musicale",
      date: "28 juin 2024",
      time: "20h30",
      venue: "Opéra Municipal",
      status: "draft",
      progress: 20,
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Finaliser le rider technique",
      project: "Concert Jazz",
      dueDate: "Aujourd'hui",
      priority: "high",
    },
    {
      id: 2,
      title: "Confirmer les artistes",
      project: "Spectacle de Danse",
      dueDate: "Demain",
      priority: "medium",
    },
    {
      id: 3,
      title: "Réserver la salle",
      project: "Comédie Musicale",
      dueDate: "Cette semaine",
      priority: "low",
    },
  ];

  const weeklySchedule = [
    { day: "Lun", events: ["Répétition Jazz", "Réunion équipe"] },
    { day: "Mar", events: ["Setup technique"] },
    { day: "Mer", events: ["Concert Jazz"] },
    { day: "Jeu", events: ["Débriefing", "Planning Danse"] },
    { day: "Ven", events: ["Répétition Danse"] },
    { day: "Sam", events: ["Spectacle Danse"] },
    { day: "Dim", events: [] },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: { variant: "default" as const, label: "Confirmé" },
      planning: { variant: "secondary" as const, label: "En cours" },
      draft: { variant: "outline" as const, label: "Brouillon" },
    };
    const config = variants[status as keyof typeof variants] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "text-red-600 bg-red-50",
      medium: "text-yellow-600 bg-yellow-50",
      low: "text-green-600 bg-green-50",
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenue, {user.name || user.email}
          {currentOrg && (
            <span className="ml-2 text-sm text-gray-500">
              • {currentOrg.name}
            </span>
          )}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projets récents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Projets récents</CardTitle>
                  <CardDescription>
                    Vos derniers projets créés
                  </CardDescription>
                </div>
                {canManageProjects && (
                  <Button size="sm" onClick={() => router.push("/projects/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{project.name}</h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {project.date} à {project.time} • {project.venue}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Progress value={project.progress} className="flex-1 h-2" />
                        <span className="text-xs text-gray-500">{project.progress}%</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Planning de la semaine */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Planning de la semaine</CardTitle>
              <CardDescription>
                Vue d'ensemble de vos événements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklySchedule.map((day, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-12 text-sm font-medium text-gray-500">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      {day.events.length > 0 ? (
                        <div className="space-y-1">
                          {day.events.map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded"
                            >
                              {event}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">Aucun événement</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tâches à faire */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tâches à faire</CardTitle>
                <CardDescription>
                  Vos prochaines actions
                </CardDescription>
              </div>
              <Badge variant="secondary">3 tâches</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority).split(' ')[0]}`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.project} • {task.dueDate}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Normal' : 'Faible'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métriques rapides */}
        {canViewAnalytics && (
          <Card>
            <CardHeader>
              <CardTitle>Métriques rapides</CardTitle>
              <CardDescription>
                Aperçu de vos performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Taux de remplissage</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Revenus ce mois</span>
                  </div>
                  <span className="text-sm font-bold">€12,345</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Projets terminés</span>
                  </div>
                  <span className="text-sm font-bold">8/12</span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Voir toutes les métriques
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
