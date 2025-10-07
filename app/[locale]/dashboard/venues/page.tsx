import { Metadata } from "next";
import Link from "next/link";
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2,
  Star,
  Users,
  Car,
  Wifi,
  Utensils,
  Bed,
  Phone,
  Mail,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  Navigation,
  Building,
  Home
} from "lucide-react";

interface VenuesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: VenuesPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Lieux - Plannitech",
    description: "Gérez vos lieux et salles de spectacle",
    alternates: {
      canonical: `/${locale}/dashboard/venues`,
      languages: {
        'fr': '/fr/dashboard/venues',
        'en': '/en/dashboard/venues',
        'es': '/es/dashboard/venues',
      },
    },
  };
}

export default async function VenuesPage({ params }: VenuesPageProps) {
  const { locale } = await params;

  // Données d'exemple pour les lieux
  const venues = [
    {
      id: 1,
      name: "Théâtre Municipal",
      type: "Théâtre",
      address: "15 Place de la République, 75001 Paris",
      capacity: 800,
      status: "available",
      contact: {
        name: "Marie Dubois",
        phone: "+33 1 42 36 78 90",
        email: "contact@theatre-municipal.fr"
      },
      facilities: ["Parking", "WiFi", "Catering", "Dressing rooms", "Technical equipment"],
      stage: {
        width: 12,
        depth: 8,
        height: 6
      },
      rates: {
        day: 2500,
        week: 15000
      },
      rating: 4.8,
      lastUsed: "2024-01-15"
    },
    {
      id: 2,
      name: "Centre Culturel",
      type: "Centre Culturel",
      address: "42 Avenue des Arts, 69000 Lyon",
      capacity: 500,
      status: "available",
      contact: {
        name: "Jean-Pierre Martin",
        phone: "+33 4 78 12 34 56",
        email: "programmation@centre-culturel.fr"
      },
      facilities: ["Parking", "WiFi", "Catering", "Dressing rooms", "Recording studio"],
      stage: {
        width: 10,
        depth: 6,
        height: 5
      },
      rates: {
        day: 1800,
        week: 10000
      },
      rating: 4.6,
      lastUsed: "2024-01-20"
    },
    {
      id: 3,
      name: "Salle des Fêtes",
      type: "Salle Polyvalente",
      address: "8 Rue de la Paix, 13000 Marseille",
      capacity: 300,
      status: "maintenance",
      contact: {
        name: "Sophie Laurent",
        phone: "+33 4 91 23 45 67",
        email: "reservation@salle-fetes-marseille.fr"
      },
      facilities: ["Parking", "WiFi", "Catering", "Dressing rooms"],
      stage: {
        width: 8,
        depth: 6,
        height: 4
      },
      rates: {
        day: 1200,
        week: 7000
      },
      rating: 4.2,
      lastUsed: "2024-01-10"
    },
    {
      id: 4,
      name: "Auditorium",
      type: "Auditorium",
      address: "25 Boulevard de la Musique, 31000 Toulouse",
      capacity: 1200,
      status: "available",
      contact: {
        name: "Pierre Durand",
        phone: "+33 5 61 34 56 78",
        email: "direction@auditorium-toulouse.fr"
      },
      facilities: ["Parking", "WiFi", "Catering", "Dressing rooms", "Recording studio", "Orchestra pit"],
      stage: {
        width: 15,
        depth: 10,
        height: 8
      },
      rates: {
        day: 3500,
        week: 20000
      },
      rating: 4.9,
      lastUsed: "2024-01-25"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      case 'booked': return <Clock className="h-4 w-4" />;
      case 'unavailable': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return locale === 'en' ? 'Available' : locale === 'es' ? 'Disponible' : 'Disponible';
      case 'maintenance': return locale === 'en' ? 'Maintenance' : locale === 'es' ? 'Mantenimiento' : 'Maintenance';
      case 'booked': return locale === 'en' ? 'Booked' : locale === 'es' ? 'Reservado' : 'Réservé';
      case 'unavailable': return locale === 'en' ? 'Unavailable' : locale === 'es' ? 'No Disponible' : 'Indisponible';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Théâtre': return <Building className="h-5 w-5" />;
      case 'Centre Culturel': return <Home className="h-5 w-5" />;
      case 'Salle Polyvalente': return <MapPin className="h-5 w-5" />;
      case 'Auditorium': return <Star className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Manage your performance venues and locations' 
              : locale === 'es' 
              ? 'Gestiona tus lugares de actuación y ubicaciones'
              : 'Gérez vos lieux de spectacle et emplacements'
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
            href={`/${locale}/dashboard/venues/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'New Venue' : locale === 'es' ? 'Nuevo Lugar' : 'Nouveau Lieu'}
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
                placeholder={locale === 'en' ? 'Search venues...' : locale === 'es' ? 'Buscar lugares...' : 'Rechercher des lieux...'}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{locale === 'en' ? 'All Types' : locale === 'es' ? 'Todos los Tipos' : 'Tous les Types'}</option>
              <option value="theatre">{locale === 'en' ? 'Theatre' : locale === 'es' ? 'Teatro' : 'Théâtre'}</option>
              <option value="centre">{locale === 'en' ? 'Cultural Center' : locale === 'es' ? 'Centro Cultural' : 'Centre Culturel'}</option>
              <option value="auditorium">{locale === 'en' ? 'Auditorium' : locale === 'es' ? 'Auditorio' : 'Auditorium'}</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{locale === 'en' ? 'All Status' : locale === 'es' ? 'Todos los Estados' : 'Tous les Statuts'}</option>
              <option value="available">{locale === 'en' ? 'Available' : locale === 'es' ? 'Disponible' : 'Disponible'}</option>
              <option value="booked">{locale === 'en' ? 'Booked' : locale === 'es' ? 'Reservado' : 'Réservé'}</option>
              <option value="maintenance">{locale === 'en' ? 'Maintenance' : locale === 'es' ? 'Mantenimiento' : 'Maintenance'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {locale === 'en' ? 'Total Venues' : locale === 'es' ? 'Total Lugares' : 'Total Lieux'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{venues.length}</p>
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
                {locale === 'en' ? 'Available' : locale === 'es' ? 'Disponibles' : 'Disponibles'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {venues.filter(v => v.status === 'available').length}
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
                {locale === 'en' ? 'Total Capacity' : locale === 'es' ? 'Capacidad Total' : 'Capacité Totale'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {venues.reduce((sum, venue) => sum + venue.capacity, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {locale === 'en' ? 'Average Rating' : locale === 'es' ? 'Calificación Promedio' : 'Note Moyenne'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {(venues.reduce((sum, venue) => sum + venue.rating, 0) / venues.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des lieux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getTypeIcon(venue.type)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{venue.name}</h3>
                  <p className="text-sm text-gray-600">{venue.type}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(venue.status)}`}>
                {getStatusIcon(venue.status)}
                {getStatusText(venue.status)}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{venue.address}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{venue.capacity.toLocaleString()} {locale === 'en' ? 'capacity' : locale === 'es' ? 'capacidad' : 'places'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4" />
                <span>{venue.rating}/5.0</span>
              </div>
            </div>
            
            {/* Équipements */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {locale === 'en' ? 'Facilities' : locale === 'es' ? 'Instalaciones' : 'Équipements'}
              </h4>
              <div className="flex flex-wrap gap-1">
                {venue.facilities.slice(0, 3).map((facility, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    {facility}
                  </span>
                ))}
                {venue.facilities.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    +{venue.facilities.length - 3} {locale === 'en' ? 'more' : locale === 'es' ? 'más' : 'plus'}
                  </span>
                )}
              </div>
            </div>
            
            {/* Tarifs */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {locale === 'en' ? 'Rates' : locale === 'es' ? 'Tarifas' : 'Tarifs'}
              </h4>
              <div className="text-sm text-gray-600">
                <div>{locale === 'en' ? 'Day:' : locale === 'es' ? 'Día:' : 'Jour:'} {venue.rates.day.toLocaleString()} €</div>
                <div>{locale === 'en' ? 'Week:' : locale === 'es' ? 'Semana:' : 'Semaine:'} {venue.rates.week.toLocaleString()} €</div>
              </div>
            </div>
            
            {/* Contact */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                {locale === 'en' ? 'Contact' : locale === 'es' ? 'Contacto' : 'Contact'}
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span>{venue.contact.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{venue.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span>{venue.contact.email}</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/dashboard/venues/${venue.id}`}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title={locale === 'en' ? 'View Details' : locale === 'es' ? 'Ver Detalles' : 'Voir les Détails'}
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/${locale}/dashboard/venues/${venue.id}/edit`}
                  className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  title={locale === 'en' ? 'Edit' : locale === 'es' ? 'Editar' : 'Modifier'}
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <Link
                  href={`/${locale}/dashboard/technical-sheets?venue=${venue.id}`}
                  className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  title={locale === 'en' ? 'Technical Sheets' : locale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques'}
                >
                  <Star className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="bg-blue-50 text-blue-900 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <MapPin className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Manage your venues efficiently and find the perfect location for your shows.'
                : locale === 'es'
                ? 'Gestiona tus lugares eficientemente y encuentra la ubicación perfecta para tus espectáculos.'
                : 'Gérez vos lieux efficacement et trouvez l\'emplacement parfait pour vos spectacles.'
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/dashboard/venues/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Add New Venue' : locale === 'es' ? 'Agregar Nuevo Lugar' : 'Ajouter un Nouveau Lieu'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/technical-sheets`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Star className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Technical Sheets' : locale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/planning`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Clock className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificación' : 'Planning'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
