"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsNavigation } from "@/components/ui/tabs-navigation";
import { 
  Users, 
  MapPin, 
  Wrench, 
  CheckSquare, 
  Plus,
  Clock,
  Euro,
  TrendingUp,
  AlertTriangle,
  Calendar,
  UserPlus,
  Building2,
  Settings,
  Star,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";

interface TeamPageProps {
  params: Promise<{
    locale: string;
  }>;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  hourlyRate: number;
  totalHoursWorked: number;
  totalEarnings: number;
  isIntermittent: boolean;
  skills: string[];
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  company?: string;
  role?: string;
  status: string;
  lastContact?: string;
}

export default function TeamPage({ params }: TeamPageProps) {
  const [locale, setLocale] = useState('fr');
  const [activeTab, setActiveTab] = useState('team');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [artists, setArtists] = useState<Contact[]>([]);
  const [technicalCrew, setTechnicalCrew] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuration des onglets
  const tabs = [
    {
      id: 'team',
      label: locale === 'en' ? 'Team Members' : locale === 'es' ? 'Miembros del Equipo' : 'Membres d\'Équipe',
      icon: Users,
      count: members.length
    },
    {
      id: 'contacts',
      label: locale === 'en' ? 'Contacts' : locale === 'es' ? 'Contactos' : 'Contacts',
      icon: Phone,
      count: contacts.length
    },
    {
      id: 'artists',
      label: locale === 'en' ? 'Artists' : locale === 'es' ? 'Artistas' : 'Artistes',
      icon: Star,
      count: artists.length
    },
    {
      id: 'technical',
      label: locale === 'en' ? 'Technical Crew' : locale === 'es' ? 'Equipo Técnico' : 'Équipe Technique',
      icon: Wrench,
      count: technicalCrew.length
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
        const [membersRes, contactsRes] = await Promise.all([
          fetch('/api/team/members'),
          fetch('/api/contacts')
        ]);

        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData.members || []);
          setTechnicalCrew(membersData.members?.filter((m: TeamMember) => m.role.includes('Technical')) || []);
        }

        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          setContacts(contactsData.contacts || []);
          setArtists(contactsData.contacts?.filter((c: Contact) => c.type === 'artist') || []);
        }
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'artist': return 'text-purple-600 bg-purple-100';
      case 'supplier': return 'text-blue-600 bg-blue-100';
      case 'venue': return 'text-green-600 bg-green-100';
      case 'contact': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Team & Contacts' : locale === 'es' ? 'Equipo y Contactos' : 'Équipe & Contacts'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Manage your team members, artists, and external contacts' 
              : locale === 'es' 
              ? 'Gestiona miembros del equipo, artistas y contactos externos'
              : 'Gérez vos membres d\'équipe, artistes et contacts externes'
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
            href={`/${locale}/dashboard/team/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Add Contact' : locale === 'es' ? 'Agregar Contacto' : 'Ajouter un Contact'}
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
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">{member.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="text-gray-900">{member.hourlyRate}€/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hours:</span>
                      <span className="text-gray-900">{member.totalHoursWorked}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Earnings:</span>
                      <span className="text-gray-900">{member.totalEarnings}€</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/team/${member.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/team/${member.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
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

      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(contact.type)}`}>
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{contact.name}</CardTitle>
                        <p className="text-sm text-gray-600">{contact.company || contact.role}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{contact.phone}</span>
                    </div>
                    {contact.lastContact && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">Last: {contact.lastContact}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/contacts/${contact.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/contacts/${contact.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
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

      {activeTab === 'artists' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map((artist) => (
              <Card key={artist.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{artist.name}</CardTitle>
                        <p className="text-sm text-gray-600">Artist</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(artist.status)}>
                      {artist.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{artist.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{artist.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/contacts/${artist.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/contacts/${artist.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
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

      {activeTab === 'technical' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalCrew.map((member) => (
              <Card key={member.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">{member.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="text-gray-900">{member.hourlyRate}€/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hours:</span>
                      <span className="text-gray-900">{member.totalHoursWorked}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Earnings:</span>
                      <span className="text-gray-900">{member.totalEarnings}€</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/team/${member.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/team/${member.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
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

      {/* Actions rapides */}
      <div className="bg-blue-50 text-blue-900 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Users className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Manage your team and contacts efficiently.'
                : locale === 'es'
                ? 'Gestiona tu equipo y contactos eficientemente.'
                : 'Gérez votre équipe et contacts efficacement.'
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/dashboard/team/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Add Team Member' : locale === 'es' ? 'Agregar Miembro' : 'Ajouter un Membre'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/contacts/new`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Phone className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Add Contact' : locale === 'es' ? 'Agregar Contacto' : 'Ajouter un Contact'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/team/artists/new`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Star className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Add Artist' : locale === 'es' ? 'Agregar Artista' : 'Ajouter un Artiste'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}