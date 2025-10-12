"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  Star, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Building2,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Venue {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  capacity: number;
  totalBookings: number;
  status: 'active' | 'inactive' | 'maintenance';
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  facilities: string[];
  createdAt: string;
  updatedAt: string;
}

interface VenuesListProps {
  locale: string;
}

export function VenuesList({ locale }: VenuesListProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Charger les lieux
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/venues?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des lieux');
      }

      const data = await response.json();
      setVenues(data.venues || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les lieux',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Recherche et filtres
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVenues();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, typeFilter, statusFilter]);

  const deleteVenue = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le lieu "${name}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/venues/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast({
        title: 'Lieu supprimé',
        description: `Le lieu "${name}" a été supprimé avec succès.`,
      });

      fetchVenues(); // Recharger la liste
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le lieu',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return locale === 'en' ? 'Active' : locale === 'es' ? 'Activo' : 'Actif';
      case 'inactive': return locale === 'en' ? 'Inactive' : locale === 'es' ? 'Inactivo' : 'Inactif';
      case 'maintenance': return locale === 'en' ? 'Maintenance' : locale === 'es' ? 'Mantenimiento' : 'Maintenance';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'theater': return locale === 'en' ? 'Theater' : locale === 'es' ? 'Teatro' : 'Théâtre';
      case 'concert_hall': return locale === 'en' ? 'Concert Hall' : locale === 'es' ? 'Sala de Conciertos' : 'Salle de Concert';
      case 'outdoor': return locale === 'en' ? 'Outdoor' : locale === 'es' ? 'Exterior' : 'Extérieur';
      case 'studio': return locale === 'en' ? 'Studio' : locale === 'es' ? 'Estudio' : 'Studio';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {locale === 'en' ? 'Loading venues...' : locale === 'es' ? 'Cargando lugares...' : 'Chargement des lieux...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={locale === 'en' ? 'Search venues...' : locale === 'es' ? 'Buscar lugares...' : 'Rechercher des lieux...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={locale === 'en' ? 'Type' : locale === 'es' ? 'Tipo' : 'Type'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{locale === 'en' ? 'All Types' : locale === 'es' ? 'Todos los Tipos' : 'Tous les Types'}</SelectItem>
            <SelectItem value="theater">{getTypeText('theater')}</SelectItem>
            <SelectItem value="concert_hall">{getTypeText('concert_hall')}</SelectItem>
            <SelectItem value="outdoor">{getTypeText('outdoor')}</SelectItem>
            <SelectItem value="studio">{getTypeText('studio')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={locale === 'en' ? 'Status' : locale === 'es' ? 'Estado' : 'Statut'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{locale === 'en' ? 'All Status' : locale === 'es' ? 'Todos los Estados' : 'Tous les Statuts'}</SelectItem>
            <SelectItem value="active">{getStatusText('active')}</SelectItem>
            <SelectItem value="inactive">{getStatusText('inactive')}</SelectItem>
            <SelectItem value="maintenance">{getStatusText('maintenance')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des lieux */}
      {venues.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {locale === 'en' ? 'No venues found' : locale === 'es' ? 'No se encontraron lugares' : 'Aucun lieu trouvé'}
          </h3>
          <p className="text-gray-600 mb-4">
            {locale === 'en' 
              ? 'Get started by creating your first venue.' 
              : locale === 'es'
              ? 'Comienza creando tu primer lugar.'
              : 'Commencez par créer votre premier lieu.'
            }
          </p>
          <Link
            href={`/${locale}/dashboard/venues/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Add Venue' : locale === 'es' ? 'Agregar Lugar' : 'Ajouter un Lieu'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div key={venue.id} className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
                    <p className="text-sm text-gray-600">{getTypeText(venue.type)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(venue.status)}`}>
                    {getStatusIcon(venue.status)}
                    <span className="ml-1">{getStatusText(venue.status)}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{venue.address}, {venue.city}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{venue.capacity.toLocaleString()} {locale === 'en' ? 'capacity' : locale === 'es' ? 'capacidad' : 'places'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{venue.totalBookings} {locale === 'en' ? 'bookings' : locale === 'es' ? 'reservas' : 'réservations'}</span>
                </div>
                {venue.contact && (
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{venue.contact.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{venue.contact.email}</span>
                    </div>
                  </div>
                )}
              </div>

              {venue.facilities && venue.facilities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {locale === 'en' ? 'Facilities:' : locale === 'es' ? 'Instalaciones:' : 'Équipements :'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {venue.facilities.map((facility, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/${locale}/dashboard/venues/${venue.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/${locale}/dashboard/venues/${venue.id}/edit`}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </div>
                <button
                  onClick={() => deleteVenue(venue.id, venue.name)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
