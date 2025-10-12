"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsNavigation } from "@/components/ui/tabs-navigation";
import { 
  Settings, 
  Database, 
  BookOpen, 
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Upload,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  FileText,
  Archive,
  User,
  Globe,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  HelpCircle,
  Info,
  Wrench,
  Zap
} from "lucide-react";
import Link from "next/link";

interface ToolsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

interface DataBackup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'in_progress' | 'failed' | 'scheduled';
  size: number;
  createdAt: string;
  description?: string;
  fileUrl?: string;
}

interface HelpArticle {
  id: string;
  title: string;
  category: 'getting_started' | 'features' | 'troubleshooting' | 'api' | 'billing';
  content: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  lastUpdated: string;
  tags: string[];
}

export default function ToolsPage({ params }: ToolsPageProps) {
  const [locale, setLocale] = useState('fr');
  const [activeTab, setActiveTab] = useState('data-management');
  const [backups, setBackups] = useState<DataBackup[]>([]);
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuration des onglets
  const tabs = [
    {
      id: 'data-management',
      label: locale === 'en' ? 'Data Management' : locale === 'es' ? 'Gestión de Datos' : 'Gestion des Données',
      icon: Database,
      count: backups.length
    },
    {
      id: 'help',
      label: locale === 'en' ? 'Help & Documentation' : locale === 'es' ? 'Ayuda y Documentación' : 'Aide & Documentation',
      icon: BookOpen,
      count: helpArticles.length
    }
  ];

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simuler des appels API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Données de démonstration
        setBackups([
          {
            id: '1',
            name: 'Backup Complet - Janvier 2024',
            type: 'full',
            status: 'completed',
            size: 2048576000, // 2GB
            createdAt: '2024-01-31T23:59:59Z',
            description: 'Sauvegarde complète de tous les données',
            fileUrl: '/backups/backup-jan-2024.zip'
          },
          {
            id: '2',
            name: 'Backup Incrémental - 15 Février',
            type: 'incremental',
            status: 'completed',
            size: 52428800, // 50MB
            createdAt: '2024-02-15T12:00:00Z',
            description: 'Sauvegarde des modifications depuis le 31 janvier'
          }
        ]);
        
        setHelpArticles([
          {
            id: '1',
            title: 'Comment créer votre premier spectacle',
            category: 'getting_started',
            content: 'Ce guide vous explique étape par étape comment créer votre premier spectacle dans Plannitech...',
            status: 'published',
            views: 156,
            lastUpdated: '2024-01-15',
            tags: ['spectacle', 'création', 'débutant']
          },
          {
            id: '2',
            title: 'Gestion des équipes et contacts',
            category: 'features',
            content: 'Apprenez à gérer efficacement vos équipes et contacts...',
            status: 'published',
            views: 89,
            lastUpdated: '2024-01-10',
            tags: ['équipe', 'contacts', 'gestion']
          }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'published': return 'bg-green-100 text-green-800';
      case 'in_progress': case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'failed': case 'archived': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: { [key: string]: string } } = {
      en: {
        completed: 'Completed', in_progress: 'In Progress', failed: 'Failed', scheduled: 'Scheduled',
        published: 'Published', draft: 'Draft', archived: 'Archived'
      },
      es: {
        completed: 'Completado', in_progress: 'En Progreso', failed: 'Fallido', scheduled: 'Programado',
        published: 'Publicado', draft: 'Borrador', archived: 'Archivado'
      },
      fr: {
        completed: 'Terminé', in_progress: 'En Cours', failed: 'Échoué', scheduled: 'Programmé',
        published: 'Publié', draft: 'Brouillon', archived: 'Archivé'
      }
    };
    return statusMap[locale]?.[status] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: { [key: string]: string } } = {
      en: { full: 'Full Backup', incremental: 'Incremental', differential: 'Differential' },
      es: { full: 'Respaldo Completo', incremental: 'Incremental', differential: 'Diferencial' },
      fr: { full: 'Sauvegarde Complète', incremental: 'Incrémentale', differential: 'Différentielle' }
    };
    return typeMap[locale]?.[type] || type;
  };

  const getCategoryText = (category: string) => {
    const categoryMap: { [key: string]: { [key: string]: string } } = {
      en: {
        getting_started: 'Getting Started', features: 'Features', troubleshooting: 'Troubleshooting',
        api: 'API', billing: 'Billing'
      },
      es: {
        getting_started: 'Primeros Pasos', features: 'Características', troubleshooting: 'Solución de Problemas',
        api: 'API', billing: 'Facturación'
      },
      fr: {
        getting_started: 'Premiers Pas', features: 'Fonctionnalités', troubleshooting: 'Dépannage',
        api: 'API', billing: 'Facturation'
      }
    };
    return categoryMap[locale]?.[category] || category;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {locale === 'en' ? 'Loading tools...' : locale === 'es' ? 'Cargando herramientas...' : 'Chargement des outils...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Tools & Settings' : locale === 'es' ? 'Herramientas y Configuración' : 'Outils & Paramètres'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Configure application settings, manage data, and access help resources' 
              : locale === 'es' 
              ? 'Configura los ajustes de la aplicación, gestiona datos y accede a recursos de ayuda'
              : 'Configurez les paramètres de l\'application, gérez les données et accédez aux ressources d\'aide'
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
            href={`/${locale}/dashboard/tools/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'New Item' : locale === 'es' ? 'Nuevo Elemento' : 'Nouvel Élément'}
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
      {activeTab === 'data-management' && (
        <div className="space-y-4">
          {/* Statistiques de données */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white text-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === 'en' ? 'Total Storage Used' : locale === 'es' ? 'Almacenamiento Total Usado' : 'Stockage Total Utilisé'}
                </CardTitle>
                <HardDrive className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 GB</div>
                <p className="text-xs text-gray-600">
                  {locale === 'en' ? 'of 10 GB available' : locale === 'es' ? 'de 10 GB disponibles' : 'sur 10 GB disponibles'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white text-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === 'en' ? 'Last Backup' : locale === 'es' ? 'Último Respaldo' : 'Dernière Sauvegarde'}
                </CardTitle>
                <Database className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 days ago</div>
                <p className="text-xs text-gray-600">
                  {locale === 'en' ? '2.0 GB backup' : locale === 'es' ? 'respaldo de 2.0 GB' : 'sauvegarde de 2.0 GB'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white text-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === 'en' ? 'Data Integrity' : locale === 'es' ? 'Integridad de Datos' : 'Intégrité des Données'}
                </CardTitle>
                <Shield className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-gray-600">
                  {locale === 'en' ? 'all systems healthy' : locale === 'es' ? 'todos los sistemas saludables' : 'tous les systèmes sains'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Liste des sauvegardes */}
          <div className="grid grid-cols-1 gap-4">
            {backups.map((backup) => (
              <Card key={backup.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Database className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{backup.name}</CardTitle>
                        <p className="text-sm text-gray-600">{getTypeText(backup.type)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(backup.status)}>
                      {getStatusText(backup.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {backup.description && (
                      <p className="text-sm text-gray-600">{backup.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {locale === 'en' ? 'Size:' : locale === 'es' ? 'Tamaño:' : 'Taille :'}
                        </span>
                        <span className="text-gray-900">{formatFileSize(backup.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {locale === 'en' ? 'Created:' : locale === 'es' ? 'Creado:' : 'Créé :'}
                        </span>
                        <span className="text-gray-900">
                          {new Date(backup.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/tools/backups/${backup.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {backup.fileUrl && (
                        <Link
                          href={backup.fileUrl}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Link>
                      )}
                      <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'help' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpArticles.map((article) => (
              <Card key={article.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <p className="text-sm text-gray-600">{getCategoryText(article.category)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(article.status)}>
                      {getStatusText(article.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{article.content}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {locale === 'en' ? 'Views:' : locale === 'es' ? 'Vistas:' : 'Vues :'}
                        </span>
                        <span className="text-gray-900">{article.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {locale === 'en' ? 'Last Updated:' : locale === 'es' ? 'Última Actualización:' : 'Dernière Mise à Jour :'}
                        </span>
                        <span className="text-gray-900">{article.lastUpdated}</span>
                      </div>
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          {locale === 'en' ? 'Tags:' : locale === 'es' ? 'Etiquetas:' : 'Étiquettes :'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/tools/help/${article.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/tools/help/${article.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Archive className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-blue-50 text-blue-900 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Settings className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Manage your data and access help resources efficiently.'
                : locale === 'es'
                ? 'Gestiona tus datos y accede a recursos de ayuda eficientemente.'
                : 'Gérez vos données et accédez aux ressources d\'aide efficacement.'
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/dashboard/tools/backup/create`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Database className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Create Backup' : locale === 'es' ? 'Crear Respaldo' : 'Créer une Sauvegarde'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/tools/help/new`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Add Help Article' : locale === 'es' ? 'Agregar Artículo de Ayuda' : 'Ajouter un Article d\'Aide'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/tools/settings`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Wrench className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'System Settings' : locale === 'es' ? 'Configuración del Sistema' : 'Paramètres Système'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
