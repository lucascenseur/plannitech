import { Metadata } from "next";
import Link from "next/link";
import { 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  MapPin, 
  Truck, 
  Utensils, 
  Wrench, 
  Star, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  Search,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  MoreHorizontal,
  Settings,
  BarChart3,
  FileText,
  Navigation
} from "lucide-react";

interface PlanningPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PlanningPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Planning - Plannitech",
    description: "Planifiez vos spectacles à la minute près",
    alternates: {
      canonical: `/${locale}/dashboard/planning`,
      languages: {
        'fr': '/fr/dashboard/planning',
        'en': '/en/dashboard/planning',
        'es': '/es/dashboard/planning',
      },
    },
  };
}

export default async function PlanningPage({ params }: PlanningPageProps) {
  const { locale } = await params;

  // Données d'exemple pour le planning
  const planningEvents = [
    {
      id: 1,
      show: "Concert Jazz au Théâtre Municipal",
      date: "2024-02-15",
      type: "show",
      status: "confirmed",
      timeline: [
        { time: "08:00", task: "Arrivée équipe technique", team: "Technique", duration: 30, status: "completed" },
        { time: "08:30", task: "Montage son", team: "Son", duration: 120, status: "in-progress" },
        { time: "10:30", task: "Montage lumière", team: "Lumière", duration: 90, status: "pending" },
        { time: "12:00", task: "Pause déjeuner", team: "Tous", duration: 60, status: "pending" },
        { time: "13:00", task: "Répétition générale", team: "Artistes + Technique", duration: 180, status: "pending" },
        { time: "16:00", task: "Pause technique", team: "Technique", duration: 30, status: "pending" },
        { time: "16:30", task: "Préparation spectacle", team: "Tous", duration: 90, status: "pending" },
        { time: "18:00", task: "Ouverture portes", team: "Accueil", duration: 60, status: "pending" },
        { time: "20:00", task: "Spectacle", team: "Artistes + Technique", duration: 120, status: "pending" },
        { time: "22:00", task: "Démontage", team: "Technique", duration: 120, status: "pending" }
      ],
      team: {
        total: 12,
        sound: 2,
        lighting: 2,
        stage: 3,
        security: 2,
        catering: 2,
        artists: 1
      },
      equipment: {
        sound: "Yamaha QL5 + 8 micros + 12 enceintes",
        lighting: "GrandMA3 + 24 projecteurs + 8 mobiles",
        stage: "Scène 12x8m + rideaux + éclairage"
      }
    },
    {
      id: 2,
      show: "Spectacle de Danse Contemporaine",
      date: "2024-02-22",
      type: "show",
      status: "planning",
      timeline: [
        { time: "09:00", task: "Arrivée équipe", team: "Technique", duration: 30, status: "pending" },
        { time: "09:30", task: "Montage scène", team: "Scène", duration: 150, status: "pending" },
        { time: "12:00", task: "Montage son", team: "Son", duration: 90, status: "pending" },
        { time: "13:30", task: "Déjeuner", team: "Tous", duration: 60, status: "pending" },
        { time: "14:30", task: "Montage lumière", team: "Lumière", duration: 120, status: "pending" },
        { time: "16:30", task: "Répétition", team: "Danseurs + Technique", duration: 120, status: "pending" },
        { time: "18:30", task: "Pause", team: "Tous", duration: 30, status: "pending" },
        { time: "19:00", task: "Ouverture", team: "Accueil", duration: 30, status: "pending" },
        { time: "19:30", task: "Spectacle", team: "Danseurs + Technique", duration: 90, status: "pending" },
        { time: "21:00", task: "Démontage", team: "Technique", duration: 90, status: "pending" }
      ],
      team: {
        total: 10,
        sound: 1,
        lighting: 2,
        stage: 2,
        security: 1,
        catering: 2,
        artists: 2
      },
      equipment: {
        sound: "Behringer X32 + 4 micros + 8 enceintes",
        lighting: "Chamsys MagicQ + 16 projecteurs + 4 mobiles",
        stage: "Scène 10x6m + sol de danse"
      }
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

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'in-progress': return <Play className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'delayed': return <AlertTriangle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificación' : 'Planning'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Plan your shows minute by minute with detailed timelines' 
              : locale === 'es' 
              ? 'Planifica tus espectáculos minuto a minuto con cronogramas detallados'
              : 'Planifiez vos spectacles à la minute près avec des chronologies détaillées'
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
            href={`/${locale}/dashboard/planning/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'New Planning' : locale === 'es' ? 'Nueva Planificación' : 'Nouveau Planning'}
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
                placeholder={locale === 'en' ? 'Search planning...' : locale === 'es' ? 'Buscar planificación...' : 'Rechercher dans le planning...'}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{locale === 'en' ? 'All Shows' : locale === 'es' ? 'Todos los Espectáculos' : 'Tous les Spectacles'}</option>
              <option value="jazz">{locale === 'en' ? 'Jazz Concert' : locale === 'es' ? 'Concierto Jazz' : 'Concert Jazz'}</option>
              <option value="dance">{locale === 'en' ? 'Dance Show' : locale === 'es' ? 'Espectáculo de Danza' : 'Spectacle de Danse'}</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{locale === 'en' ? 'All Status' : locale === 'es' ? 'Todos los Estados' : 'Tous les Statuts'}</option>
              <option value="confirmed">{locale === 'en' ? 'Confirmed' : locale === 'es' ? 'Confirmado' : 'Confirmé'}</option>
              <option value="planning">{locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificando' : 'En Planification'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {locale === 'en' ? 'Total Events' : locale === 'es' ? 'Total Eventos' : 'Total Événements'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{planningEvents.length}</p>
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
                {planningEvents.filter(e => e.status === 'confirmed').length}
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
                {planningEvents.reduce((sum, event) => sum + event.team.total, 0)}
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
                {locale === 'en' ? 'In Progress' : locale === 'es' ? 'En Progreso' : 'En Cours'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {planningEvents.reduce((sum, event) => 
                  sum + event.timeline.filter(task => task.status === 'in-progress').length, 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des plannings */}
      <div className="space-y-6">
        {planningEvents.map((event) => (
          <div key={event.id} className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200">
            {/* Header de l'événement */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{event.show}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {getStatusIcon(event.status)}
                    {getStatusText(event.status)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${locale}/dashboard/planning/${event.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title={locale === 'en' ? 'View Details' : locale === 'es' ? 'Ver Detalles' : 'Voir les Détails'}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/${locale}/dashboard/planning/${event.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title={locale === 'en' ? 'Edit' : locale === 'es' ? 'Editar' : 'Modifier'}
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations de l'équipe */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{event.team.total}</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Total Team' : locale === 'es' ? 'Total Equipo' : 'Total Équipe'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{event.team.sound + event.team.lighting + event.team.stage}</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Technical' : locale === 'es' ? 'Técnico' : 'Technique'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{event.team.artists}</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Artists' : locale === 'es' ? 'Artistas' : 'Artistes'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{event.team.security + event.team.catering}</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Support' : locale === 'es' ? 'Soporte' : 'Support'}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="px-6 py-4">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                {locale === 'en' ? 'Timeline' : locale === 'es' ? 'Cronograma' : 'Chronologie'}
              </h4>
              <div className="space-y-3">
                {event.timeline.slice(0, 6).map((task, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-900">
                      {task.time}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{task.task}</div>
                      <div className="text-xs text-gray-600">
                        {task.team} • {task.duration} {locale === 'en' ? 'min' : locale === 'es' ? 'min' : 'min'}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                        {getTaskStatusIcon(task.status)}
                        {task.status === 'completed' ? (locale === 'en' ? 'Done' : locale === 'es' ? 'Hecho' : 'Terminé') :
                         task.status === 'in-progress' ? (locale === 'en' ? 'In Progress' : locale === 'es' ? 'En Progreso' : 'En Cours') :
                         task.status === 'pending' ? (locale === 'en' ? 'Pending' : locale === 'es' ? 'Pendiente' : 'En Attente') : task.status}
                      </span>
                    </div>
                  </div>
                ))}
                {event.timeline.length > 6 && (
                  <div className="text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      {locale === 'en' ? `Show ${event.timeline.length - 6} more tasks` : 
                       locale === 'es' ? `Mostrar ${event.timeline.length - 6} tareas más` :
                       `Afficher ${event.timeline.length - 6} tâches supplémentaires`}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/dashboard/planning/${event.id}/setup-breakdown`}
                  className="inline-flex items-center px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Setup/Breakdown' : locale === 'es' ? 'Montaje/Desmontaje' : 'Montage/Démontage'}
                </Link>
                <Link
                  href={`/${locale}/dashboard/planning/${event.id}/transportation`}
                  className="inline-flex items-center px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Transportation' : locale === 'es' ? 'Transporte' : 'Transport'}
                </Link>
                <Link
                  href={`/${locale}/dashboard/planning/${event.id}/catering`}
                  className="inline-flex items-center px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <Utensils className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Catering' : locale === 'es' ? 'Catering' : 'Restauration'}
                </Link>
                <Link
                  href={`/${locale}/dashboard/planning/${event.id}/team`}
                  className="inline-flex items-center px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Team Planning' : locale === 'es' ? 'Planificación Equipo' : 'Planning Équipe'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="bg-blue-50 text-blue-900 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Calendar className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Create detailed planning for your shows with minute-by-minute precision.'
                : locale === 'es'
                ? 'Crea planificaciones detalladas para tus espectáculos con precisión minuto a minuto.'
                : 'Créez des plannings détaillés pour vos spectacles avec une précision minute par minute.'
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/dashboard/planning/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Create New Planning' : locale === 'es' ? 'Crear Nueva Planificación' : 'Créer un Nouveau Planning'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/shows`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Star className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'View Shows' : locale === 'es' ? 'Ver Espectáculos' : 'Voir les Spectacles'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/team`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Users className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Team Management' : locale === 'es' ? 'Gestión de Equipo' : 'Gestion Équipe'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}