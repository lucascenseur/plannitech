"use client";

import { useState, useEffect } from "react";
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
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Show {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  status: 'confirmed' | 'planning' | 'draft' | 'cancelled';
  artists: string[];
  team: number;
  budget: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ShowsListProps {
  locale: string;
}

export function ShowsList({ locale }: ShowsListProps) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Charger les spectacles
  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);

      const response = await fetch(`/api/shows?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des spectacles');
      }

      const data = await response.json();
      setShows(data.shows || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les spectacles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Recherche et filtres
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchShows();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, typeFilter]);

  const deleteShow = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le spectacle "${title}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/shows/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast({
        title: 'Spectacle supprimé',
        description: `Le spectacle "${title}" a été supprimé avec succès.`,
      });

      fetchShows(); // Recharger la liste
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le spectacle',
        variant: 'destructive',
      });
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barre de recherche et filtres */}
      <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={locale === 'en' ? 'Search shows...' : locale === 'es' ? 'Buscar espectáculos...' : 'Rechercher des spectacles...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={locale === 'en' ? 'All Types' : locale === 'es' ? 'Todos los Tipos' : 'Tous les Types'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'en' ? 'All Types' : locale === 'es' ? 'Todos los Tipos' : 'Tous les Types'}</SelectItem>
                <SelectItem value="concert">{locale === 'en' ? 'Concert' : locale === 'es' ? 'Concierto' : 'Concert'}</SelectItem>
                <SelectItem value="theater">{locale === 'en' ? 'Theater' : locale === 'es' ? 'Teatro' : 'Théâtre'}</SelectItem>
                <SelectItem value="dance">{locale === 'en' ? 'Dance' : locale === 'es' ? 'Danza' : 'Danse'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={locale === 'en' ? 'All Status' : locale === 'es' ? 'Todos los Estados' : 'Tous les Statuts'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'en' ? 'All Status' : locale === 'es' ? 'Todos los Estados' : 'Tous les Statuts'}</SelectItem>
                <SelectItem value="confirmed">{locale === 'en' ? 'Confirmed' : locale === 'es' ? 'Confirmado' : 'Confirmé'}</SelectItem>
                <SelectItem value="planning">{locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificando' : 'En Planification'}</SelectItem>
                <SelectItem value="draft">{locale === 'en' ? 'Draft' : locale === 'es' ? 'Borrador' : 'Brouillon'}</SelectItem>
              </SelectContent>
            </Select>
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
          {shows.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {locale === 'en' ? 'No shows found' : locale === 'es' ? 'No se encontraron espectáculos' : 'Aucun spectacle trouvé'}
            </div>
          ) : (
            shows.map((show) => (
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
                      href={`/dashboard/shows/${show.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title={locale === 'en' ? 'View Details' : locale === 'es' ? 'Ver Detalles' : 'Voir les Détails'}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/dashboard/shows/${show.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title={locale === 'en' ? 'Edit' : locale === 'es' ? 'Editar' : 'Modifier'}
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/dashboard/planning?show=${show.id}`}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title={locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificación' : 'Planning'}
                    >
                      <Calendar className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => deleteShow(show.id, show.title)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title={locale === 'en' ? 'Delete' : locale === 'es' ? 'Eliminar' : 'Supprimer'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
