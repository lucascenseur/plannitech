"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Building2,
  Zap,
  Plus,
  ArrowRight,
  Settings,
  Database,
  BookOpen,
  Hotel,
  Wrench
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

  // Placeholder pour récupérer les données dynamiques
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simuler des appels API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données de démonstration
      setStats({
        shows: 12,
        venues: 8,
        contacts: 45,
        upcomingShows: 3,
        totalBudget: 125000,
        activeTasks: 7
      });
      
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {locale === 'en' ? 'Loading dashboard...' : locale === 'es' ? 'Cargando panel...' : 'Chargement du tableau de bord...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'en' ? 'Dashboard' : locale === 'es' ? 'Panel' : 'Tableau de bord'}
          </h1>
          <p className="text-gray-600 mt-1">
            {locale === 'en' ? 'Your complete event management workspace' : locale === 'es' ? 'Tu espacio de trabajo completo de gestión de eventos' : 'Votre espace de travail complet de gestion d\'événements'}
          </p>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
          </h2>
          <Link href={`/${locale}/dashboard/shows/new`}>
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Plus className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'New Show' : locale === 'es' ? 'Nuevo Espectáculo' : 'Nouveau Spectacle'}
            </Button>
          </Link>
        </div>
        <p className="text-blue-100 mb-6">
          {locale === 'en'
            ? 'Quickly create new items or jump to key sections of your workspace.'
            : locale === 'es'
            ? 'Crea rápidamente nuevos elementos o salta a secciones clave de tu espacio de trabajo.'
            : 'Créez rapidement de nouveaux éléments ou accédez aux sections clés de votre espace de travail.'
          }
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/${locale}/dashboard/shows/new`}>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Theater className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'New Show' : locale === 'es' ? 'Nuevo Espectáculo' : 'Nouveau Spectacle'}
            </Button>
          </Link>
          <Link href={`/${locale}/dashboard/team/new-contact`}>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Users className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'New Contact' : locale === 'es' ? 'Nuevo Contacto' : 'Nouveau Contact'}
            </Button>
          </Link>
          <Link href={`/${locale}/dashboard/planning/new`}>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Calendar className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'New Planning Item' : locale === 'es' ? 'Nuevo Elemento de Planificación' : 'Nouvel Élément de Planning'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white text-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Total Shows' : locale === 'es' ? 'Espectáculos Totales' : 'Spectacles Totaux'}
            </CardTitle>
            <Theater className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shows}</div>
            <p className="text-xs text-gray-600">
              {stats.upcomingShows} {locale === 'en' ? 'upcoming' : locale === 'es' ? 'próximos' : 'à venir'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux'}
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.venues}</div>
            <p className="text-xs text-gray-600">
              {locale === 'en' ? 'registered' : locale === 'es' ? 'registrados' : 'enregistrés'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Contacts' : locale === 'es' ? 'Contactos' : 'Contacts'}
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacts}</div>
            <p className="text-xs text-gray-600">
              {locale === 'en' ? 'in database' : locale === 'es' ? 'en base de datos' : 'en base de données'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Total Budget' : locale === 'es' ? 'Presupuesto Total' : 'Budget Total'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalBudget.toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              {locale === 'en' ? 'allocated' : locale === 'es' ? 'asignado' : 'alloué'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cartes contextuelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Theater className="h-5 w-5 text-blue-600" />
              {locale === 'en' ? 'Shows & Events' : locale === 'es' ? 'Espectáculos y Eventos' : 'Spectacles & Événements'}
            </CardTitle>
            <Link href={`/${locale}/dashboard/shows`}>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                {locale === 'en' ? 'View All' : locale === 'es' ? 'Ver Todo' : 'Voir Tout'} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {locale === 'en' ? 'Manage all your performances, technical sheets, and venues.' : locale === 'es' ? 'Gestiona todas tus actuaciones, fichas técnicas y lugares.' : 'Gérez toutes vos représentations, fiches techniques et lieux.'}
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Quick Links:' : locale === 'es' ? 'Enlaces Rápidos:' : 'Liens Rapides :'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href={`/${locale}/dashboard/shows/new`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Plus className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'New Show' : locale === 'es' ? 'Nuevo Espectáculo' : 'Nouveau Spectacle'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/shows?tab=venues`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <MapPin className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/shows?tab=technical`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <FileText className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Technical Sheets' : locale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {locale === 'en' ? 'Planning & Timing' : locale === 'es' ? 'Planificación y Tiempo' : 'Planning & Timing'}
            </CardTitle>
            <Link href={`/${locale}/dashboard/planning`}>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                {locale === 'en' ? 'View All' : locale === 'es' ? 'Ver Todo' : 'Voir Tout'} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {locale === 'en' ? 'Organize your schedule minute by minute: setup, transportation, catering.' : locale === 'es' ? 'Organiza tu horario minuto a minuto: montaje, transporte, catering.' : 'Organisez votre emploi du temps minute par minute : montage, transport, restauration.'}
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Quick Links:' : locale === 'es' ? 'Enlaces Rápidos:' : 'Liens Rapides :'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href={`/${locale}/dashboard/planning?tab=calendar`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Clock className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Master Schedule' : locale === 'es' ? 'Cronograma Principal' : 'Planning Principal'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/planning?tab=setup-breakdown`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Wrench className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Setup & Breakdown' : locale === 'es' ? 'Montaje y Desmontaje' : 'Montage & Démontage'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/planning?tab=transportation`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Truck className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Transportation' : locale === 'es' ? 'Transporte' : 'Transport'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/planning?tab=catering`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Utensils className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Catering' : locale === 'es' ? 'Catering' : 'Restauration'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              {locale === 'en' ? 'Personnel & Teams' : locale === 'es' ? 'Personal y Equipos' : 'Personnel & Équipes'}
            </CardTitle>
            <Link href={`/${locale}/dashboard/team`}>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                {locale === 'en' ? 'View All' : locale === 'es' ? 'Ver Todo' : 'Voir Tout'} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {locale === 'en' ? 'Manage your artists, technical crew, and security teams.' : locale === 'es' ? 'Gestiona tus artistas, equipo técnico y equipos de seguridad.' : 'Gérez vos artistes, équipe technique et équipes de sécurité.'}
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Quick Links:' : locale === 'es' ? 'Enlaces Rápidos:' : 'Liens Rapides :'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href={`/${locale}/dashboard/team?tab=members`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Users className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Team Members' : locale === 'es' ? 'Miembros del Equipo' : 'Membres de l\'Équipe'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/team?tab=artists`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Star className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Artists' : locale === 'es' ? 'Artistas' : 'Artistes'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/team?tab=technical`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Wrench className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Technical Crew' : locale === 'es' ? 'Equipo Técnico' : 'Équipe Technique'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              {locale === 'en' ? 'Resources & Equipment' : locale === 'es' ? 'Recursos y Equipamiento' : 'Ressources & Matériel'}
            </CardTitle>
            <Link href={`/${locale}/dashboard/resources`}>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                {locale === 'en' ? 'View All' : locale === 'es' ? 'Ver Todo' : 'Voir Tout'} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {locale === 'en' ? 'Track equipment, manage suppliers, purchase orders, and accommodation.' : locale === 'es' ? 'Rastrea equipos, gestiona proveedores, órdenes de compra y alojamiento.' : 'Suivez le matériel, gérez les fournisseurs, les bons de commande et l\'hébergement.'}
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Quick Links:' : locale === 'es' ? 'Enlaces Rápidos:' : 'Liens Rapides :'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href={`/${locale}/dashboard/resources?tab=equipment`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Package className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Equipment Inventory' : locale === 'es' ? 'Inventario de Equipos' : 'Inventaire Matériel'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/resources?tab=suppliers`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Building2 className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Suppliers' : locale === 'es' ? 'Proveedores' : 'Fournisseurs'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/resources?tab=accommodation`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Hotel className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Accommodation' : locale === 'es' ? 'Alojamiento' : 'Hébergement'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              {locale === 'en' ? 'Finance & Tracking' : locale === 'es' ? 'Finanzas y Seguimiento' : 'Finances & Suivi'}
            </CardTitle>
            <Link href={`/${locale}/dashboard/finance`}>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                {locale === 'en' ? 'View All' : locale === 'es' ? 'Ver Todo' : 'Voir Tout'} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {locale === 'en' ? 'Oversee budgets, generate financial reports, and export payroll data.' : locale === 'es' ? 'Supervisa presupuestos, genera informes financieros y exporta datos de nómina.' : 'Supervisez les budgets, générez des rapports financiers et exportez les données de paie.'}
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Quick Links:' : locale === 'es' ? 'Enlaces Rápidos:' : 'Liens Rapides :'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href={`/${locale}/dashboard/finance?tab=budget`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Budget Management' : locale === 'es' ? 'Gestión de Presupuesto' : 'Gestion Budget'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/finance?tab=reports`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Financial Reports' : locale === 'es' ? 'Reportes Financieros' : 'Rapports Financiers'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/finance?tab=payroll`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Database className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Payroll Export' : locale === 'es' ? 'Exportar Nómina' : 'Export Paie'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              {locale === 'en' ? 'Tools & Settings' : locale === 'es' ? 'Herramientas y Configuración' : 'Outils & Paramètres'}
            </CardTitle>
            <Link href={`/${locale}/dashboard/settings`}>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                {locale === 'en' ? 'View All' : locale === 'es' ? 'Ver Todo' : 'Voir Tout'} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {locale === 'en' ? 'Configure application settings, manage data, and access help resources.' : locale === 'es' ? 'Configura los ajustes de la aplicación, gestiona datos y accede a recursos de ayuda.' : 'Configurez les paramètres de l\'application, gérez les données et accédez aux ressources d\'aide.'}
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Quick Links:' : locale === 'es' ? 'Enlaces Rápidos:' : 'Liens Rapides :'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href={`/${locale}/dashboard/settings`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Settings className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Settings' : locale === 'es' ? 'Configuración' : 'Paramètres'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/data-management`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <Database className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Data Management' : locale === 'es' ? 'Gestión de Datos' : 'Gestion des Données'}
                  </Button>
                </Link>
                <Link href={`/${locale}/dashboard/help`}>
                  <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Help & Docs' : locale === 'es' ? 'Ayuda y Documentación' : 'Aide & Docs'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
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