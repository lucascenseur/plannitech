"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
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
  Wrench,
  Lightbulb,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface TechnicalSheet {
  id: string;
  title: string;
  showId: string;
  showTitle: string;
  type: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  requirements: {
    sound: string[];
    lighting: string[];
    stage: string[];
    equipment: string[];
  };
  team: {
    sound: number;
    lighting: number;
    stage: number;
    security: number;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface TechnicalSheetsListProps {
  locale: string;
}

export function TechnicalSheetsList({ locale }: TechnicalSheetsListProps) {
  const [sheets, setSheets] = useState<TechnicalSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Charger les fiches techniques
  useEffect(() => {
    fetchTechnicalSheets();
  }, []);

  const fetchTechnicalSheets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/technical-sheets?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des fiches techniques');
      }

      const data = await response.json();
      setSheets(data.technicalSheets || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les fiches techniques',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Recherche et filtres
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTechnicalSheets();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, typeFilter, statusFilter]);

  const deleteTechnicalSheet = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la fiche technique "${title}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/technical-sheets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast({
        title: 'Fiche technique supprimée',
        description: `La fiche technique "${title}" a été supprimée avec succès.`,
      });

      fetchTechnicalSheets(); // Recharger la liste
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la fiche technique',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'review': return <Clock className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'archived': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return locale === 'en' ? 'Approved' : locale === 'es' ? 'Aprobado' : 'Approuvé';
      case 'review': return locale === 'en' ? 'Under Review' : locale === 'es' ? 'En Revisión' : 'En Révision';
      case 'draft': return locale === 'en' ? 'Draft' : locale === 'es' ? 'Borrador' : 'Brouillon';
      case 'archived': return locale === 'en' ? 'Archived' : locale === 'es' ? 'Archivado' : 'Archivé';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'concert': return locale === 'en' ? 'Concert' : locale === 'es' ? 'Concierto' : 'Concert';
      case 'theater': return locale === 'en' ? 'Theater' : locale === 'es' ? 'Teatro' : 'Théâtre';
      case 'dance': return locale === 'en' ? 'Dance' : locale === 'es' ? 'Danza' : 'Danse';
      case 'corporate': return locale === 'en' ? 'Corporate' : locale === 'es' ? 'Corporativo' : 'Entreprise';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {locale === 'en' ? 'Loading technical sheets...' : locale === 'es' ? 'Cargando fichas técnicas...' : 'Chargement des fiches techniques...'}
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
              placeholder={locale === 'en' ? 'Search technical sheets...' : locale === 'es' ? 'Buscar fichas técnicas...' : 'Rechercher des fiches techniques...'}
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
            <SelectItem value="concert">{getTypeText('concert')}</SelectItem>
            <SelectItem value="theater">{getTypeText('theater')}</SelectItem>
            <SelectItem value="dance">{getTypeText('dance')}</SelectItem>
            <SelectItem value="corporate">{getTypeText('corporate')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={locale === 'en' ? 'Status' : locale === 'es' ? 'Estado' : 'Statut'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{locale === 'en' ? 'All Status' : locale === 'es' ? 'Todos los Estados' : 'Tous les Statuts'}</SelectItem>
            <SelectItem value="approved">{getStatusText('approved')}</SelectItem>
            <SelectItem value="review">{getStatusText('review')}</SelectItem>
            <SelectItem value="draft">{getStatusText('draft')}</SelectItem>
            <SelectItem value="archived">{getStatusText('archived')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des fiches techniques */}
      {sheets.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {locale === 'en' ? 'No technical sheets found' : locale === 'es' ? 'No se encontraron fichas técnicas' : 'Aucune fiche technique trouvée'}
          </h3>
          <p className="text-gray-600 mb-4">
            {locale === 'en' 
              ? 'Get started by creating your first technical sheet.' 
              : locale === 'es'
              ? 'Comienza creando tu primera ficha técnica.'
              : 'Commencez par créer votre première fiche technique.'
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sheets.map((sheet) => (
            <div key={sheet.id} className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{sheet.title}</h3>
                    <p className="text-sm text-gray-600">{sheet.showTitle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sheet.status)}`}>
                    {getStatusIcon(sheet.status)}
                    <span className="ml-1">{getStatusText(sheet.status)}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{getTypeText(sheet.type)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Volume2 className="h-4 w-4 mr-2" />
                    <span>{sheet.team.sound} {locale === 'en' ? 'sound' : locale === 'es' ? 'sonido' : 'son'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    <span>{sheet.team.lighting} {locale === 'en' ? 'lighting' : locale === 'es' ? 'iluminación' : 'éclairage'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Wrench className="h-4 w-4 mr-2" />
                    <span>{sheet.team.stage} {locale === 'en' ? 'stage' : locale === 'es' ? 'escenario' : 'scène'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{sheet.team.security} {locale === 'en' ? 'security' : locale === 'es' ? 'seguridad' : 'sécurité'}</span>
                  </div>
                </div>
              </div>

              {sheet.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{sheet.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/${locale}/dashboard/technical-sheets/${sheet.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/${locale}/dashboard/technical-sheets/${sheet.id}/edit`}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </div>
                <button
                  onClick={() => deleteTechnicalSheet(sheet.id, sheet.title)}
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
