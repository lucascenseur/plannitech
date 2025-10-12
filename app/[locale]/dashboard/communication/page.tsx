"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsNavigation } from "@/components/ui/tabs-navigation";
import { 
  MessageSquare, 
  Users, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  Calendar,
  Star,
  Settings,
  UserPlus,
  Hash,
  Bell,
  Archive,
  Reply,
  Forward
} from "lucide-react";
import Link from "next/link";

interface CommunicationPageProps {
  params: Promise<{
    locale: string;
  }>;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  recipients: Array<{
    name: string;
    email: string;
    status: 'sent' | 'delivered' | 'read';
  }>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'sent' | 'delivered' | 'read';
  createdAt: string;
  updatedAt: string;
  attachments?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

interface WorkGroup {
  id: string;
  name: string;
  description: string;
  type: 'project' | 'department' | 'event' | 'general';
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member' | 'viewer';
    joinedAt: string;
  }>;
  status: 'active' | 'archived' | 'suspended';
  createdAt: string;
  lastActivity: string;
  messageCount: number;
}

export default function CommunicationPage({ params }: CommunicationPageProps) {
  const [locale, setLocale] = useState('fr');
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [workGroups, setWorkGroups] = useState<WorkGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuration des onglets
  const tabs = [
    {
      id: 'messages',
      label: locale === 'en' ? 'Messages' : locale === 'es' ? 'Mensajes' : 'Messages',
      icon: MessageSquare,
      count: messages.length
    },
    {
      id: 'work-groups',
      label: locale === 'en' ? 'Work Groups' : locale === 'es' ? 'Grupos de Trabajo' : 'Groupes de Travail',
      icon: Users,
      count: workGroups.length
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
        setMessages([
          {
            id: '1',
            subject: 'Planning du spectacle du 15 mars',
            content: 'Bonjour, je vous envoie le planning détaillé pour le spectacle du 15 mars...',
            sender: {
              name: 'Marie Dubois',
              email: 'marie@example.com'
            },
            recipients: [
              { name: 'Jean Martin', email: 'jean@example.com', status: 'read' },
              { name: 'Sophie Laurent', email: 'sophie@example.com', status: 'delivered' }
            ],
            priority: 'high',
            status: 'sent',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            attachments: [
              { name: 'planning-mars-15.pdf', size: 245760, type: 'application/pdf' }
            ]
          }
        ]);
        
        setWorkGroups([
          {
            id: '1',
            name: 'Équipe Spectacle Mars',
            description: 'Groupe de travail pour l\'organisation du spectacle de mars',
            type: 'event',
            members: [
              { id: '1', name: 'Marie Dubois', email: 'marie@example.com', role: 'admin', joinedAt: '2024-01-01' },
              { id: '2', name: 'Jean Martin', email: 'jean@example.com', role: 'member', joinedAt: '2024-01-05' },
              { id: '3', name: 'Sophie Laurent', email: 'sophie@example.com', role: 'member', joinedAt: '2024-01-10' }
            ],
            status: 'active',
            createdAt: '2024-01-01',
            lastActivity: '2024-01-15T14:30:00Z',
            messageCount: 24
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read': case 'active': return 'bg-green-100 text-green-800';
      case 'delivered': case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: { [key: string]: { [key: string]: string } } = {
      en: { urgent: 'Urgent', high: 'High', normal: 'Normal', low: 'Low' },
      es: { urgent: 'Urgente', high: 'Alta', normal: 'Normal', low: 'Baja' },
      fr: { urgent: 'Urgent', high: 'Élevée', normal: 'Normale', low: 'Faible' }
    };
    return priorityMap[locale]?.[priority] || priority;
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: { [key: string]: string } } = {
      en: {
        read: 'Read', delivered: 'Delivered', sent: 'Sent', draft: 'Draft',
        active: 'Active', archived: 'Archived', suspended: 'Suspended'
      },
      es: {
        read: 'Leído', delivered: 'Entregado', sent: 'Enviado', draft: 'Borrador',
        active: 'Activo', archived: 'Archivado', suspended: 'Suspendido'
      },
      fr: {
        read: 'Lu', delivered: 'Livré', sent: 'Envoyé', draft: 'Brouillon',
        active: 'Actif', archived: 'Archivé', suspended: 'Suspendu'
      }
    };
    return statusMap[locale]?.[status] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: { [key: string]: string } } = {
      en: { project: 'Project', department: 'Department', event: 'Event', general: 'General' },
      es: { project: 'Proyecto', department: 'Departamento', event: 'Evento', general: 'General' },
      fr: { project: 'Projet', department: 'Département', event: 'Événement', general: 'Général' }
    };
    return typeMap[locale]?.[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {locale === 'en' ? 'Loading communication...' : locale === 'es' ? 'Cargando comunicación...' : 'Chargement de la communication...'}
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
            {locale === 'en' ? 'Communication & Collaboration' : locale === 'es' ? 'Comunicación y Colaboración' : 'Communication & Collaboration'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Facilitate internal messaging, manage contacts, and organize work groups' 
              : locale === 'es' 
              ? 'Facilita la mensajería interna, gestiona contactos y organiza grupos de trabajo'
              : 'Facilitez la messagerie interne, gérez les contacts et organisez les groupes de travail'
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
            href={`/${locale}/dashboard/communication/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'New Message' : locale === 'es' ? 'Nuevo Mensaje' : 'Nouveau Message'}
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
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {messages.map((message) => (
              <Card key={message.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{message.subject}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {locale === 'en' ? 'From:' : locale === 'es' ? 'De:' : 'De :'} {message.sender.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(message.priority)}>
                        {getPriorityText(message.priority)}
                      </Badge>
                      <Badge className={getStatusColor(message.status)}>
                        {getStatusText(message.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 line-clamp-2">{message.content}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{message.recipients.length} {locale === 'en' ? 'recipients' : locale === 'es' ? 'destinatarios' : 'destinataires'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                      </div>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{message.attachments.length} {locale === 'en' ? 'attachments' : locale === 'es' ? 'adjuntos' : 'pièces jointes'}</span>
                        </div>
                      )}
                    </div>

                    {message.recipients && message.recipients.length > 0 && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          {locale === 'en' ? 'Recipients:' : locale === 'es' ? 'Destinatarios:' : 'Destinataires :'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {message.recipients.map((recipient, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                              {recipient.name}
                              <span className={`ml-1 w-2 h-2 rounded-full ${
                                recipient.status === 'read' ? 'bg-green-500' : 
                                recipient.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-400'
                              }`}></span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/communication/messages/${message.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/communication/messages/${message.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Reply className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                        <Forward className="h-4 w-4" />
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

      {activeTab === 'work-groups' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workGroups.map((group) => (
              <Card key={group.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <p className="text-sm text-gray-600">{getTypeText(group.type)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(group.status)}>
                      {getStatusText(group.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {locale === 'en' ? 'Members:' : locale === 'es' ? 'Miembros:' : 'Membres :'}
                        </span>
                        <span className="text-gray-900">{group.members.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {locale === 'en' ? 'Messages:' : locale === 'es' ? 'Mensajes:' : 'Messages :'}
                        </span>
                        <span className="text-gray-900">{group.messageCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {locale === 'en' ? 'Last Activity:' : locale === 'es' ? 'Última Actividad:' : 'Dernière Activité :'}
                        </span>
                        <span className="text-gray-900">
                          {new Date(group.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'Members:' : locale === 'es' ? 'Miembros:' : 'Membres :'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {group.members.slice(0, 3).map((member, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                            {member.name}
                            {member.role === 'admin' && (
                              <Star className="h-3 w-3 ml-1 text-yellow-500" />
                            )}
                          </span>
                        ))}
                        {group.members.length > 3 && (
                          <span className="text-xs text-gray-500">+{group.members.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/communication/work-groups/${group.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/communication/work-groups/${group.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <MessageSquare className="h-4 w-4" />
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
          <MessageSquare className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Facilitate communication and collaboration within your team.'
                : locale === 'es'
                ? 'Facilita la comunicación y colaboración dentro de tu equipo.'
                : 'Facilitez la communication et la collaboration au sein de votre équipe.'
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/dashboard/communication/messages/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Send Message' : locale === 'es' ? 'Enviar Mensaje' : 'Envoyer un Message'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/communication/work-groups/new`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Create Work Group' : locale === 'es' ? 'Crear Grupo de Trabajo' : 'Créer un Groupe de Travail'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/communication/broadcast`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Bell className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Broadcast Message' : locale === 'es' ? 'Mensaje de Difusión' : 'Message de Diffusion'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
