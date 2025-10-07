import { Metadata } from "next";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2,
  Copy,
  Mic,
  Lightbulb,
  Volume2,
  Camera,
  Palette,
  Wrench,
  Clock,
  Users,
  MapPin,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreHorizontal
} from "lucide-react";

interface TechnicalSheetsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: TechnicalSheetsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Fiches Techniques - Plannitech",
    description: "Gérez les spécifications techniques de vos spectacles",
    alternates: {
      canonical: `/${locale}/dashboard/technical-sheets`,
      languages: {
        'fr': '/fr/dashboard/technical-sheets',
        'en': '/en/dashboard/technical-sheets',
        'es': '/es/dashboard/technical-sheets',
      },
    },
  };
}

export default async function TechnicalSheetsPage({ params }: TechnicalSheetsPageProps) {
  const { locale } = await params;

  // Données d'exemple pour les fiches techniques
  const technicalSheets = [
    {
      id: 1,
      title: "Concert Jazz - Fiche Technique",
      show: "Concert Jazz au Théâtre Municipal",
      venue: "Théâtre Municipal",
      date: "2024-02-15",
      status: "approved",
      sound: {
        microphones: 8,
        speakers: 12,
        mixer: "Yamaha QL5",
        monitors: 6
      },
      lighting: {
        spots: 24,
        moving: 8,
        dimmers: 48,
        console: "GrandMA3"
      },
      stage: {
        width: 12,
        depth: 8,
        height: 6,
        setup: "Concert standard"
      },
      team: {
        sound: 2,
        lighting: 2,
        stage: 3,
        security: 2
      }
    },
    {
      id: 2,
      title: "Spectacle Danse - Fiche Technique",
      show: "Spectacle de Danse Contemporaine",
      venue: "Centre Culturel",
      date: "2024-02-22",
      status: "draft",
      sound: {
        microphones: 4,
        speakers: 8,
        mixer: "Behringer X32",
        monitors: 4
      },
      lighting: {
        spots: 16,
        moving: 4,
        dimmers: 32,
        console: "Chamsys MagicQ"
      },
      stage: {
        width: 10,
        depth: 6,
        height: 5,
        setup: "Danse contemporaine"
      },
      team: {
        sound: 1,
        lighting: 2,
        stage: 2,
        security: 1
      }
    },
    {
      id: 3,
      title: "Théâtre Hamlet - Fiche Technique",
      show: "Pièce de Théâtre - Hamlet",
      venue: "Salle des Fêtes",
      date: "2024-03-01",
      status: "review",
      sound: {
        microphones: 12,
        speakers: 6,
        mixer: "Soundcraft Si Expression",
        monitors: 8
      },
      lighting: {
        spots: 20,
        moving: 6,
        dimmers: 40,
        console: "ETC Ion XE"
      },
      stage: {
        width: 8,
        depth: 6,
        height: 4,
        setup: "Théâtre classique"
      },
      team: {
        sound: 2,
        lighting: 3,
        stage: 4,
        security: 2
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'review': return <AlertTriangle className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return locale === 'en' ? 'Approved' : locale === 'es' ? 'Aprobado' : 'Approuvé';
      case 'review': return locale === 'en' ? 'Under Review' : locale === 'es' ? 'En Revisión' : 'En Révision';
      case 'draft': return locale === 'en' ? 'Draft' : locale === 'es' ? 'Borrador' : 'Brouillon';
      case 'rejected': return locale === 'en' ? 'Rejected' : locale === 'es' ? 'Rechazado' : 'Rejeté';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Technical Sheets' : locale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Manage technical specifications and requirements for your shows' 
              : locale === 'es' 
              ? 'Gestiona especificaciones técnicas y requisitos para tus espectáculos'
              : 'Gérez les spécifications techniques et exigences pour vos spectacles'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Import' : locale === 'es' ? 'Importar' : 'Importer'}
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Export' : locale === 'es' ? 'Exportar' : 'Exporter'}
          </button>
          <Link
            href={`/${locale}/dashboard/technical-sheets/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'New Technical Sheet' : locale === 'es' ? 'Nueva Ficha Técnica' : 'Nouvelle Fiche Technique'}
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
                placeholder={locale === 'en' ? 'Search technical sheets...' : locale === 'es' ? 'Buscar fichas técnicas...' : 'Rechercher des fiches techniques...'}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{locale === 'en' ? 'All Status' : locale === 'es' ? 'Todos los Estados' : 'Tous les Statuts'}</option>
              <option value="approved">{locale === 'en' ? 'Approved' : locale === 'es' ? 'Aprobado' : 'Approuvé'}</option>
              <option value="review">{locale === 'en' ? 'Under Review' : locale === 'es' ? 'En Revisión' : 'En Révision'}</option>
              <option value="draft">{locale === 'en' ? 'Draft' : locale === 'es' ? 'Borrador' : 'Brouillon'}</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{locale === 'en' ? 'All Venues' : locale === 'es' ? 'Todos los Lugares' : 'Tous les Lieux'}</option>
              <option value="theatre">{locale === 'en' ? 'Theatre' : locale === 'es' ? 'Teatro' : 'Théâtre'}</option>
              <option value="centre">{locale === 'en' ? 'Cultural Center' : locale === 'es' ? 'Centro Cultural' : 'Centre Culturel'}</option>
              <option value="salle">{locale === 'en' ? 'Hall' : locale === 'es' ? 'Salón' : 'Salle'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {locale === 'en' ? 'Total Sheets' : locale === 'es' ? 'Total Fichas' : 'Total Fiches'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{technicalSheets.length}</p>
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
                {locale === 'en' ? 'Approved' : locale === 'es' ? 'Aprobadas' : 'Approuvées'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {technicalSheets.filter(s => s.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {locale === 'en' ? 'Under Review' : locale === 'es' ? 'En Revisión' : 'En Révision'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {technicalSheets.filter(s => s.status === 'review').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Wrench className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {locale === 'en' ? 'Total Equipment' : locale === 'es' ? 'Total Equipamiento' : 'Total Équipement'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {technicalSheets.reduce((sum, sheet) => 
                  sum + sheet.sound.microphones + sheet.sound.speakers + 
                  sheet.lighting.spots + sheet.lighting.moving, 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des fiches techniques */}
      <div className="bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {locale === 'en' ? 'Technical Sheets' : locale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques'}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {technicalSheets.map((sheet) => (
            <div key={sheet.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{sheet.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sheet.status)}`}>
                      {getStatusIcon(sheet.status)}
                      {getStatusText(sheet.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>{sheet.show}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{sheet.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(sheet.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'fr-FR')}</span>
                    </div>
                  </div>
                  
                  {/* Détails techniques */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {locale === 'en' ? 'Sound' : locale === 'es' ? 'Sonido' : 'Son'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{sheet.sound.microphones} {locale === 'en' ? 'mics' : locale === 'es' ? 'micrófonos' : 'micros'}</div>
                        <div>{sheet.sound.speakers} {locale === 'en' ? 'speakers' : locale === 'es' ? 'altavoces' : 'enceintes'}</div>
                        <div>{sheet.sound.monitors} {locale === 'en' ? 'monitors' : locale === 'es' ? 'monitores' : 'retours'}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {locale === 'en' ? 'Lighting' : locale === 'es' ? 'Iluminación' : 'Lumière'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{sheet.lighting.spots} {locale === 'en' ? 'spots' : locale === 'es' ? 'focos' : 'projecteurs'}</div>
                        <div>{sheet.lighting.moving} {locale === 'en' ? 'moving' : locale === 'es' ? 'móviles' : 'mobiles'}</div>
                        <div>{sheet.lighting.dimmers} {locale === 'en' ? 'dimmers' : locale === 'es' ? 'atenuadores' : 'gradateurs'}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {locale === 'en' ? 'Stage' : locale === 'es' ? 'Escenario' : 'Scène'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{sheet.stage.width}m × {sheet.stage.depth}m</div>
                        <div>{sheet.stage.height}m {locale === 'en' ? 'height' : locale === 'es' ? 'altura' : 'hauteur'}</div>
                        <div className="truncate">{sheet.stage.setup}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {locale === 'en' ? 'Team' : locale === 'es' ? 'Equipo' : 'Équipe'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{sheet.team.sound} {locale === 'en' ? 'sound' : locale === 'es' ? 'sonido' : 'son'}</div>
                        <div>{sheet.team.lighting} {locale === 'en' ? 'lighting' : locale === 'es' ? 'iluminación' : 'lumière'}</div>
                        <div>{sheet.team.stage} {locale === 'en' ? 'stage' : locale === 'es' ? 'escenario' : 'scène'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/${locale}/dashboard/technical-sheets/${sheet.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title={locale === 'en' ? 'View Details' : locale === 'es' ? 'Ver Detalles' : 'Voir les Détails'}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/${locale}/dashboard/technical-sheets/${sheet.id}/edit`}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title={locale === 'en' ? 'Edit' : locale === 'es' ? 'Editar' : 'Modifier'}
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                    <Copy className="h-4 w-4" />
                  </button>
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
          <FileText className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Create and manage technical specifications efficiently with these tools.'
                : locale === 'es'
                ? 'Crea y gestiona especificaciones técnicas eficientemente con estas herramientas.'
                : 'Créez et gérez les spécifications techniques efficacement avec ces outils.'
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/dashboard/technical-sheets/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Create Technical Sheet' : locale === 'es' ? 'Crear Ficha Técnica' : 'Créer une Fiche Technique'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/equipment`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Wrench className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Equipment Inventory' : locale === 'es' ? 'Inventario de Equipamiento' : 'Inventaire Matériel'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/venues`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
