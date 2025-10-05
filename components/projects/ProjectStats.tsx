"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Chart, MetricCard } from "@/components/ui/chart";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart
} from "lucide-react";
import { ProjectListView } from "@/types/project";

interface ProjectStatsProps {
  projects: ProjectListView[];
}

export function ProjectStats({ projects }: ProjectStatsProps) {
  // Calcul des statistiques
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status !== "ARCHIVED").length;
  const archivedProjects = projects.filter(p => p.status === "ARCHIVED").length;
  
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const averageBudget = totalBudget / totalProjects || 0;
  
  const totalTeamSize = projects.reduce((sum, p) => sum + (p.teamSize || 0), 0);
  const averageTeamSize = totalTeamSize / totalProjects || 0;
  
  const averageProgress = projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects || 0;

  // Répartition par statut
  const statusDistribution = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Répartition par type
  const typeDistribution = projects.reduce((acc, project) => {
    acc[project.type] = (acc[project.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Projets par mois (derniers 6 mois)
  const monthlyProjects = projects.reduce((acc, project) => {
    const month = new Date(project.createdAt).toLocaleDateString("fr-FR", { 
      year: "numeric", 
      month: "short" 
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusDistribution).map(([status, count]) => ({
    label: status,
    value: count,
    color: getStatusColor(status),
  }));

  const typeData = Object.entries(typeDistribution).map(([type, count]) => ({
    label: type,
    value: count,
    color: getTypeColor(type),
  }));

  const monthlyData = Object.entries(monthlyProjects).map(([month, count]) => ({
    label: month,
    value: count,
  }));

  function getStatusColor(status: string) {
    const colors = {
      DRAFT: "bg-gray-500",
      DEVELOPMENT: "bg-blue-500",
      PRODUCTION: "bg-green-500",
      TOUR: "bg-purple-500",
      ARCHIVED: "bg-gray-400",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  }

  function getTypeColor(type: string) {
    const colors = {
      CONCERT: "bg-blue-500",
      THEATRE: "bg-green-500",
      DANSE: "bg-purple-500",
      CIRQUE: "bg-orange-500",
      AUTRE: "bg-gray-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  }

  function getStatusLabel(status: string) {
    const labels = {
      DRAFT: "Brouillon",
      DEVELOPMENT: "Développement",
      PRODUCTION: "Production",
      TOUR: "Tournée",
      ARCHIVED: "Archivé",
    };
    return labels[status as keyof typeof labels] || status;
  }

  function getTypeLabel(type: string) {
    const labels = {
      CONCERT: "Concert",
      THEATRE: "Théâtre",
      DANSE: "Danse",
      CIRQUE: "Cirque",
      AUTRE: "Autre",
    };
    return labels[type as keyof typeof labels] || type;
  }

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total des projets"
          value={totalProjects}
          trend="up"
          change={`${activeProjects} actifs`}
        />
        <MetricCard
          title="Budget total"
          value={`${totalBudget.toLocaleString()}€`}
          trend="up"
          change={`Moyenne: ${averageBudget.toLocaleString()}€`}
        />
        <MetricCard
          title="Équipe totale"
          value={totalTeamSize}
          trend="up"
          change={`Moyenne: ${averageTeamSize.toFixed(1)}`}
        />
        <MetricCard
          title="Progression moyenne"
          value={`${averageProgress.toFixed(0)}%`}
          trend="up"
          change="Tous projets"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par statut */}
        <Chart
          title="Répartition par statut"
          description="Distribution des projets selon leur statut"
          data={statusData}
          type="pie"
        />

        {/* Répartition par type */}
        <Chart
          title="Répartition par type"
          description="Distribution des projets selon leur type"
          data={typeData}
          type="bar"
        />
      </div>

      {/* Détails des statuts */}
      <Card>
        <CardHeader>
          <CardTitle>Détails par statut</CardTitle>
          <CardDescription>
            Vue détaillée de la répartition des projets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(statusDistribution).map(([status, count]) => {
              const percentage = (count / totalProjects) * 100;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{getStatusLabel(status)}</Badge>
                      <span className="text-sm text-gray-600">{count} projet{count > 1 ? "s" : ""}</span>
                    </div>
                    <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Détails des types */}
      <Card>
        <CardHeader>
          <CardTitle>Détails par type</CardTitle>
          <CardDescription>
            Vue détaillée de la répartition des types de projets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(typeDistribution).map(([type, count]) => {
              const percentage = (count / totalProjects) * 100;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{getTypeLabel(type)}</Badge>
                      <span className="text-sm text-gray-600">{count} projet{count > 1 ? "s" : ""}</span>
                    </div>
                    <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

