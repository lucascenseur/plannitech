"use client";

import { useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { 
  Theater, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  Search,
  Download,
  Upload,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText
} from "lucide-react";
import { ShowsList } from "@/components/shows/ShowsList";
import { TabsNavigation } from "@/components/ui/tabs-navigation";

interface ShowsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ShowsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Spectacles - Plannitech",
    description: "Gérez tous vos spectacles et événements",
    alternates: {
      canonical: `/${locale}/dashboard/shows`,
      languages: {
        'fr': '/fr/dashboard/shows',
        'en': '/en/dashboard/shows',
        'es': '/es/dashboard/shows',
      },
    },
  };
}

export default function ShowsPage({ params }: ShowsPageProps) {
  const [locale, setLocale] = useState('fr');
  const [activeTab, setActiveTab] = useState('shows');

  // Initialiser la locale
  React.useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Configuration des onglets
  const tabs = [
    {
      id: 'shows',
      label: locale === 'en' ? 'Shows' : locale === 'es' ? 'Espectáculos' : 'Spectacles',
      icon: Theater,
      count: 0 // Sera mis à jour dynamiquement
    },
    {
      id: 'venues',
      label: locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux',
      icon: MapPin,
      count: 0
    },
    {
      id: 'technical',
      label: locale === 'en' ? 'Technical Sheets' : locale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques',
      icon: FileText,
      count: 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Shows & Events' : locale === 'es' ? 'Espectáculos y Eventos' : 'Spectacles & Événements'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Manage all your shows and events' 
              : locale === 'es' 
              ? 'Gestiona todos tus espectáculos y eventos'
              : 'Gérez tous vos spectacles et événements'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Filter' : locale === 'es' ? 'Filtrar' : 'Filtrer'}
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Export' : locale === 'es' ? 'Exportar' : 'Exporter'}
          </button>
          <Link
            href={`/${locale}/dashboard/shows/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'New Show' : locale === 'es' ? 'Nuevo Espectáculo' : 'Nouveau Spectacle'}
          </Link>
        </div>
      </div>

      {/* Navigation par onglets */}
      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Contenu conditionnel selon l'onglet actif */}
      {activeTab === 'shows' && (
        <ShowsList locale={locale} />
      )}

      {activeTab === 'venues' && (
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {locale === 'en' ? 'Venues Management' : locale === 'es' ? 'Gestión de Lugares' : 'Gestion des Lieux'}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'en' 
                ? 'Manage your performance venues and locations'
                : locale === 'es'
                ? 'Gestiona tus lugares de actuación y ubicaciones'
                : 'Gérez vos lieux de spectacle et emplacements'
              }
            </p>
            <Link
              href={`/${locale}/dashboard/venues/new`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Add New Venue' : locale === 'es' ? 'Agregar Nuevo Lugar' : 'Ajouter un Nouveau Lieu'}
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'technical' && (
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {locale === 'en' ? 'Technical Sheets' : locale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques'}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'en' 
                ? 'Manage technical specifications and requirements'
                : locale === 'es'
                ? 'Gestiona especificaciones técnicas y requisitos'
                : 'Gérez les spécifications techniques et exigences'
              }
            </p>
            <Link
              href={`/${locale}/dashboard/technical-sheets/new`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Create Technical Sheet' : locale === 'es' ? 'Crear Ficha Técnica' : 'Créer une Fiche Technique'}
            </Link>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-blue-50 text-blue-900 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Theater className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Need help getting started? Use these quick actions to manage your shows efficiently.'
                : locale === 'es'
                ? '¿Necesitas ayuda para empezar? Usa estas acciones rápidas para gestionar tus espectáculos eficientemente.'
                : 'Besoin d\'aide pour commencer ? Utilisez ces actions rapides pour gérer vos spectacles efficacement.'
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/dashboard/shows/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
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
                href={`/${locale}/dashboard/technical-sheets`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Star className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Technical Sheets' : locale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
