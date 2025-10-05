"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardData, ChartData } from "@/types/budget";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Receipt,
  Calculator,
  Building,
  Percent
} from "lucide-react";

interface FinancialDashboardProps {
  data: DashboardData;
  onRefresh: () => void;
  loading?: boolean | undefined;
}

export function FinancialDashboard({
  data,
  onRefresh,
  loading = false,
}: FinancialDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedProject, setSelectedProject] = useState("all");

  const periods = [
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "quarter", label: "Ce trimestre" },
    { value: "year", label: "Cette année" },
  ];

  const projects = [
    { value: "all", label: "Tous les projets" },
    { value: "proj1", label: "Projet 1" },
    { value: "proj2", label: "Projet 2" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getVarianceColor = (variance: number) => {
    return variance >= 0 ? "text-green-600" : "text-red-600";
  };

  const getVarianceIcon = (variance: number) => {
    return variance >= 0 ? TrendingUp : TrendingDown;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard financier</h1>
          <p className="text-gray-600">
            Vue d'ensemble de votre situation financière
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.value} value={project.value}>
                  {project.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onRefresh}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Budget total</p>
                <p className="text-2xl font-bold">{formatCurrency(data.budgets.totalAmount)}</p>
                <p className="text-sm text-gray-500">
                  {data.budgets.totalBudgets} budget{data.budgets.totalBudgets > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Dépenses réelles</p>
                <p className="text-2xl font-bold">{formatCurrency(data.budgets.totalActual)}</p>
                <p className={`text-sm ${getVarianceColor(data.budgets.totalVariance)}`}>
                  {data.budgets.totalVariance >= 0 ? "+" : ""}{formatCurrency(data.budgets.totalVariance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Receipt className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Factures émises</p>
                <p className="text-2xl font-bold">{formatCurrency(data.invoices.totalAmount)}</p>
                <p className="text-sm text-gray-500">
                  {data.invoices.totalInvoices} facture{data.invoices.totalInvoices > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Intermittents</p>
                <p className="text-2xl font-bold">{formatCurrency(data.intermittents.totalAmount)}</p>
                <p className="text-sm text-gray-500">
                  {data.intermittents.totalIntermittents} contact{data.intermittents.totalIntermittents > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Budget vs Réel</span>
            </CardTitle>
            <CardDescription>
              Comparaison des budgets prévisionnels et des dépenses réelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Graphique Budget vs Réel</p>
                <p className="text-sm text-gray-500">
                  {data.charts.budgetVsActual.labels.length} points de données
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses by Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Dépenses par catégorie</span>
            </CardTitle>
            <CardDescription>
              Répartition des dépenses par catégorie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Graphique Dépenses par catégorie</p>
                <p className="text-sm text-gray-500">
                  {data.charts.expensesByCategory.labels.length} catégories
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Statut des budgets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.budgets.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{status}</Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5" />
              <span>Statut des factures</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.invoices.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{status}</Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Statut des intermittents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.intermittents.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{status}</Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Évolution mensuelle</span>
          </CardTitle>
          <CardDescription>
            Tendances des budgets, dépenses et factures sur les 12 derniers mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Graphique Évolution mensuelle</p>
              <p className="text-sm text-gray-500">
                {data.charts.monthlyTrend.labels.length} mois de données
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Performance par projet</span>
          </CardTitle>
          <CardDescription>
            Comparaison des budgets et dépenses par projet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.budgets.byProject.map((project) => {
              const variance = project.variance;
              const variancePercentage = project.budgetAmount > 0 ? (variance / project.budgetAmount) * 100 : 0;
              const VarianceIcon = getVarianceIcon(variance);
              
              return (
                <div key={project.projectId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{project.projectName}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Budget: {formatCurrency(project.budgetAmount)}</span>
                      <span>Réel: {formatCurrency(project.actualAmount)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${getVarianceColor(variance)}`}>
                      <VarianceIcon className="h-4 w-4" />
                      <span className="font-medium">
                        {variance >= 0 ? "+" : ""}{formatCurrency(variance)}
                      </span>
                    </div>
                    <div className={`text-sm ${getVarianceColor(variance)}`}>
                      {variance >= 0 ? "+" : ""}{formatPercentage(variancePercentage)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès rapide aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <DollarSign className="h-6 w-6" />
              <span>Nouveau budget</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Receipt className="h-6 w-6" />
              <span>Nouvelle facture</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Nouveau cachet</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Calculator className="h-6 w-6" />
              <span>Calculer charges</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

