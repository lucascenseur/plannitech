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
  const [loading, setLoading] = useState(true);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les données du dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, contactsRes, budgetsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/contacts'),
          fetch('/api/budgets')
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
      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
            Nouveau projet
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
              {loading ? '...' : `€${budgets.reduce((sum, budget) => sum + (budget.totalAmount || 0), 0).toLocaleString()}`}
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
            <div className="text-2xl font-bold">{loading ? '...' : projects.filter(p => p.startDate).length}</div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'With dates' : locale === 'es' ? 'Con fechas' : 'Avec dates'}
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
                <CardTitle>Mes projets</CardTitle>
                <CardDescription>
                  Vos projets de spectacle en cours
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${locale}/dashboard/projects`}>
                  Voir tout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">Festival d'été 2024</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Actif
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">3 événements programmés • Budget: €25,000</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        15 Jan - 20 Fév
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        12 participants
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">Tournée nationale</h4>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        En cours
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">12 dates confirmées • Budget: €45,000</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        1 Mar - 15 Avr
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        8 participants
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">Spectacle de danse</h4>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        Planification
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">En cours de planification • Budget: €15,000</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        1 Mai - 30 Mai
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        6 participants
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Événements à venir */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Événements à venir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Concert Jazz</p>
                  <p className="text-xs text-gray-600">15 Jan 2024 - 20h00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Spectacle de danse</p>
                  <p className="text-xs text-gray-600">22 Jan 2024 - 19h30</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Répétition générale</p>
                  <p className="text-xs text-gray-600">25 Jan 2024 - 14h00</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/${locale}/dashboard/planning`}>
                  Voir le planning
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/${locale}/dashboard/projects`}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Nouveau projet
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/${locale}/dashboard/planning`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Ajouter un événement
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/${locale}/dashboard/contacts`}>
                  <Users className="w-4 h-4 mr-2" />
                  Nouveau contact
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/${locale}/dashboard/budget`}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Ajouter une dépense
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Budget dépassé</p>
                  <p className="text-xs text-gray-600">Le projet "Festival d'été" a dépassé son budget de 15%</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Événement confirmé</p>
                  <p className="text-xs text-gray-600">Le concert du 15 janvier est confirmé</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Wrench className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Régie technique</p>
                  <p className="text-xs text-gray-600">Plan de feu à finaliser pour le 20 janvier</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

