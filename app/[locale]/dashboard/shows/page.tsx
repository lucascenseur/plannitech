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
  XCircle
} from "lucide-react";

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

export default async function ShowsPage({ params }: ShowsPageProps) {
  const { locale } = await params;

  // Données d'exemple pour les spectacles
  const shows = [
    {
      id: 1,
      title: "Concert Jazz au Théâtre Municipal",
      type: "Concert",
      date: "2024-02-15",
      time: "20:00",
      venue: "Théâtre Municipal",
      status: "confirmed",
      artists: ["Quartet Jazz Moderne", "Sarah Johnson"],
      team: 8,
      budget: 15000
    },
    {
      id: 2,
      title: "Spectacle de Danse Contemporaine",
      type: "Danse",
      date: "2024-02-22",
      time: "19:30",
      venue: "Centre Culturel",
      status: "planning",
      artists: ["Compagnie Danse Libre", "Marie Dubois"],
      team: 12,
      budget: 22000
    },
    {
      id: 3,
      title: "Pièce de Théâtre - Hamlet",
      type: "Théâtre",
      date: "2024-03-01",
      time: "20:30",
      venue: "Salle des Fêtes",
      status: "confirmed",
      artists: ["Troupe Théâtrale Moderne", "Jean-Pierre Martin"],
      team: 15,
      budget: 18000
    },
    {
      id: 4,
      title: "Concert Classique - Orchestre",
      type: "Musique Classique",
      date: "2024-03-10",
      time: "20:00",
      venue: "Auditorium",
      status: "draft",
      artists: ["Orchestre Symphonique", "Conducteur: Pierre Durand"],
      team: 25,
      budget: 35000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'planning': return <Clock className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return locale === 'en' ? 'Confirmed' : locale === 'es' ? 'Confirmado' : 'Confirmé';
      case 'planning': return locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificando' : 'En Planification';
      case 'draft': return locale === 'en' ? 'Draft' : locale === 'es' ? 'Borrador' : 'Brouillon';
      case 'cancelled': return locale === 'en' ? 'Cancelled' : locale === 'es' ? 'Cancelado' : 'Annulé';
      default: return status;
    }
  };

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

      {/* Barre de recherche et filtres */}
      <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={locale === 'en' ? 'Search shows...' : locale === 'es' ? 'Buscar espectáculos...' : 'Rechercher des spectacles...'}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{locale === 'en' ? 'All Types' : locale === 'es' ? 'Todos los Tipos' : 'Tous les Types'}</option>
              <option value="concert">{locale === 'en' ? 'Concert' : locale === 'es' ? 'Concierto' : 'Concert'}</option>
              <option value="theater">{locale === 'en' ? 'Theater' : locale === 'es' ? 'Teatro' : 'Théâtre'}</option>
              <option value="dance">{locale === 'en' ? 'Dance' : locale === 'es' ? 'Danza' : 'Danse'}</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{locale === 'en' ? 'All Status' : locale === 'es' ? 'Todos los Estados' : 'Tous les Statuts'}</option>
              <option value="confirmed">{locale === 'en' ? 'Confirmed' : locale === 'es' ? 'Confirmado' : 'Confirmé'}</option>
              <option value="planning">{locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificando' : 'En Planification'}</option>
              <option value="draft">{locale === 'en' ? 'Draft' : locale === 'es' ? 'Borrador' : 'Brouillon'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Theater className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {locale === 'en' ? 'Total Shows' : locale === 'es' ? 'Total Espectáculos' : 'Total Spectacles'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{shows.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {locale === 'en' ? 'Confirmed' : locale === 'es' ? 'Confirmados' : 'Confirmés'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {shows.filter(s => s.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {locale === 'en' ? 'In Planning' : locale === 'es' ? 'En Planificación' : 'En Planification'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {shows.filter(s => s.status === 'planning').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {locale === 'en' ? 'Total Team' : locale === 'es' ? 'Total Equipo' : 'Total Équipe'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {shows.reduce((sum, show) => sum + show.team, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des spectacles */}
      <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {locale === 'en' ? 'All Shows' : locale === 'es' ? 'Todos los Espectáculos' : 'Tous les Spectacles'}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {shows.map((show) => (
            <div key={show.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{show.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(show.status)}`}>
                      {getStatusIcon(show.status)}
                      {getStatusText(show.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(show.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'fr-FR')} à {show.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{show.venue}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{show.team} {locale === 'en' ? 'people' : locale === 'es' ? 'personas' : 'personnes'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>{show.artists.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      {locale === 'en' ? 'Budget:' : locale === 'es' ? 'Presupuesto:' : 'Budget:'} {show.budget.toLocaleString()} €
                    </span>
                    <span className="text-gray-500">
                      {locale === 'en' ? 'Type:' : locale === 'es' ? 'Tipo:' : 'Type:'} {show.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/${locale}/dashboard/shows/${show.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title={locale === 'en' ? 'View Details' : locale === 'es' ? 'Ver Detalles' : 'Voir les Détails'}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/${locale}/dashboard/shows/${show.id}/edit`}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title={locale === 'en' ? 'Edit' : locale === 'es' ? 'Editar' : 'Modifier'}
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/${locale}/dashboard/planning?show=${show.id}`}
                    className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    title={locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificación' : 'Planning'}
                  >
                    <Calendar className="h-4 w-4" />
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
