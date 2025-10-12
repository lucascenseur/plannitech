"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Filter,
  Search,
  Download,
  Upload,
  Play,
  Pause,
  MoreHorizontal,
  Settings,
  BarChart3,
  FileText,
  Navigation,
  Truck,
  Package,
  Zap,
  Wrench,
  Utensils,
  MapPin,
  Star,
  Eye,
  Edit,
  Trash2,
  Building2,
  Phone,
  Mail,
  Euro,
  DollarSign,
  Timer,
  Target,
  AlertCircle
} from "lucide-react";
import { TabsNavigation } from "@/components/ui/tabs-navigation";
import { SidePanel } from "@/components/ui/side-panel";

interface PlanningPageProps {
  params: Promise<{
    locale: string;
  }>;
}


export default function PlanningPage({ params }: PlanningPageProps) {
  const [locale, setLocale] = useState('fr');
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Configuration des onglets
  const tabs = [
    {
      id: 'calendar',
      label: locale === 'en' ? 'Calendar' : locale === 'es' ? 'Calendario' : 'Calendrier',
      icon: Calendar,
      count: 0
    },
    {
      id: 'timeline',
      label: locale === 'en' ? 'Timeline' : locale === 'es' ? 'Línea de Tiempo' : 'Timeline',
      icon: Clock,
      count: 0
    },
    {
      id: 'resources',
      label: locale === 'en' ? 'Resources' : locale === 'es' ? 'Recursos' : 'Ressources',
      icon: Users,
      count: 0
    }
  ];

  // Données d'exemple pour les événements
  const events = [
    {
      id: 1,
      title: "Concert Jazz au Théâtre Municipal",
      type: "show",
      date: "2024-02-15",
      time: "20:00",
      duration: 120,
      status: "confirmed",
      venue: "Théâtre Municipal",
      team: ["Marie Dubois", "Jean Martin", "Sophie Laurent"],
      equipment: ["Son", "Lumière", "Scène"],
      notes: "Concert principal - équipe complète"
    },
    {
      id: 2,
      title: "Montage - Concert Jazz",
      type: "setup",
      date: "2024-02-15",
      time: "08:00",
      duration: 240,
      status: "in_progress",
      venue: "Théâtre Municipal",
      team: ["Équipe technique", "Équipe son", "Équipe lumière"],
      equipment: ["Matériel son", "Matériel lumière", "Structure scène"],
      notes: "Montage technique complet"
    },
    {
      id: 3,
      title: "Transport - Concert Jazz",
      type: "transport",
      date: "2024-02-15",
      time: "06:00",
      duration: 180,
      status: "pending",
      venue: "Gare de Lyon → Théâtre Municipal",
      team: ["Chauffeur", "Équipe logistique"],
      equipment: ["Bus 50 places", "Camion matériel"],
      notes: "Transport artistes et matériel"
    },
    {
      id: 4,
      title: "Restauration - Concert Jazz",
      type: "catering",
      date: "2024-02-15",
      time: "12:00",
      duration: 60,
      status: "pending",
      venue: "Théâtre Municipal - Salle de réunion",
      team: ["Service restauration"],
      equipment: ["Tables", "Chaises", "Matériel cuisine"],
      notes: "Repas équipe technique"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'show': return <Star className="h-4 w-4" />;
      case 'setup': return <Wrench className="h-4 w-4" />;
      case 'transport': return <Truck className="h-4 w-4" />;
      case 'catering': return <Utensils className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'show': return 'text-purple-600 bg-purple-100';
      case 'setup': return 'text-blue-600 bg-blue-100';
      case 'transport': return 'text-orange-600 bg-orange-100';
      case 'catering': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Planning & Logistics' : locale === 'es' ? 'Planificación y Logística' : 'Planning & Logistique'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Manage your schedule, setup, transport, and catering' 
              : locale === 'es' 
              ? 'Gestiona tu horario, montaje, transporte y catering'
              : 'Gérez votre planning, montage, transport et restauration'
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
            {locale === 'en' ? 'New Event' : locale === 'es' ? 'Nuevo Evento' : 'Nouvel Événement'}
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
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {locale === 'en' ? 'Calendar View' : locale === 'es' ? 'Vista de Calendario' : 'Vue Calendrier'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${getTypeColor(event.type)}`}>
                        {getTypeIcon(event.type)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{event.title}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                      {event.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {event.time} - {event.duration} {locale === 'en' ? 'min' : locale === 'es' ? 'min' : 'min'}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {event.venue}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {event.team.length} {locale === 'en' ? 'people' : locale === 'es' ? 'personas' : 'personnes'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {locale === 'en' ? 'Timeline View' : locale === 'es' ? 'Vista de Línea de Tiempo' : 'Vue Timeline'}
          </h3>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={event.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-sm font-medium text-gray-900">{event.time}</div>
                  <div className="text-xs text-gray-500">{event.duration}min</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1 rounded ${getTypeColor(event.type)}`}>
                      {getTypeIcon(event.type)}
                    </div>
                    <span className="font-medium text-gray-900">{event.title}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                      {event.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {event.venue} • {event.team.length} {locale === 'en' ? 'people' : locale === 'es' ? 'personas' : 'personnes'}
                  </div>
                </div>
                <button
                  onClick={() => handleEventClick(event)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {locale === 'en' ? 'Resource Management' : locale === 'es' ? 'Gestión de Recursos' : 'Gestion des Ressources'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                {locale === 'en' ? 'Team Availability' : locale === 'es' ? 'Disponibilidad del Equipo' : 'Disponibilité Équipe'}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Marie Dubois</span>
                  <span className="text-green-600">Available</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jean Martin</span>
                  <span className="text-red-600">Busy</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sophie Laurent</span>
                  <span className="text-green-600">Available</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                {locale === 'en' ? 'Equipment Status' : locale === 'es' ? 'Estado del Equipamiento' : 'État du Matériel'}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sound System</span>
                  <span className="text-green-600">Available</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lighting</span>
                  <span className="text-yellow-600">Maintenance</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stage</span>
                  <span className="text-green-600">Available</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                {locale === 'en' ? 'Venue Status' : locale === 'es' ? 'Estado del Lugar' : 'État du Lieu'}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Théâtre Municipal</span>
                  <span className="text-green-600">Available</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Centre Culturel</span>
                  <span className="text-red-600">Booked</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Salle des Fêtes</span>
                  <span className="text-yellow-600">Maintenance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel latéral pour les détails d'événement */}
      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={selectedEvent?.title || ''}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Date & Time' : locale === 'es' ? 'Fecha y Hora' : 'Date & Heure'}
                </label>
                <p className="text-sm text-gray-900">
                  {selectedEvent.date} à {selectedEvent.time}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Duration' : locale === 'es' ? 'Duración' : 'Durée'}
                </label>
                <p className="text-sm text-gray-900">
                  {selectedEvent.duration} {locale === 'en' ? 'minutes' : locale === 'es' ? 'minutos' : 'minutes'}
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Venue' : locale === 'es' ? 'Lugar' : 'Lieu'}
              </label>
              <p className="text-sm text-gray-900">{selectedEvent.venue}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Team' : locale === 'es' ? 'Equipo' : 'Équipe'}
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedEvent.team.map((member, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {member}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Equipment' : locale === 'es' ? 'Equipamiento' : 'Matériel'}
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedEvent.equipment.map((item, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            {selectedEvent.notes && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Notes' : locale === 'es' ? 'Notas' : 'Notes'}
                </label>
                <p className="text-sm text-gray-900 mt-1">{selectedEvent.notes}</p>
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2 inline" />
                {locale === 'en' ? 'Edit' : locale === 'es' ? 'Editar' : 'Modifier'}
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
                <Trash2 className="h-4 w-4 mr-2 inline" />
                {locale === 'en' ? 'Delete' : locale === 'es' ? 'Eliminar' : 'Supprimer'}
              </button>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}