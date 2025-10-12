"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocale } from '@/lib/i18n';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Send
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: string;
  company?: string;
  role?: string;
  address?: string;
}

export function ContactsList() {
  const { t } = useLocale();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: t('contacts_list.error_title'),
        description: t('contacts_list.error_description'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('contacts_list.confirm_delete'))) return;

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      toast({
        title: t('contacts_list.delete_success_title'),
        description: t('contacts_list.delete_success_description'),
      });

      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: t('contacts_list.delete_error_title'),
        description: t('contacts_list.delete_error_description'),
        variant: 'destructive',
      });
    }
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || contact.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'individual':
        return 'bg-blue-100 text-blue-800';
      case 'company':
        return 'bg-green-100 text-green-800';
      case 'artist':
        return 'bg-purple-100 text-purple-800';
      case 'team_member':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'company':
        return <Building className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('contacts_list.title')}</h2>
        <Button
          onClick={() => window.location.href = '/dashboard/contacts/new'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('contacts_list.add_contact')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white text-gray-900">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('contacts_list.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900 border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('contacts_list.filter_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('contacts_list.all_types')}</SelectItem>
                <SelectItem value="individual">{t('contacts_list.type_individual')}</SelectItem>
                <SelectItem value="company">{t('contacts_list.type_company')}</SelectItem>
                <SelectItem value="artist">{t('contacts_list.type_artist')}</SelectItem>
                <SelectItem value="team_member">{t('contacts_list.type_team_member')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts */}
      <div className="grid gap-4">
        {filteredContacts.length === 0 ? (
          <Card className="bg-white text-gray-900">
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('contacts_list.no_contacts')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('contacts_list.no_contacts_description')}
              </p>
              <Button
                onClick={() => window.location.href = '/dashboard/contacts/new'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('contacts_list.add_first_contact')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="bg-white text-gray-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(contact.type)}
                      <h3 className="text-lg font-semibold">{contact.name}</h3>
                      <Badge className={getTypeColor(contact.type)}>
                        {contact.type}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{contact.email}</span>
                      </div>
                      
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      
                      {contact.company && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>{contact.company}</span>
                        </div>
                      )}
                      
                      {contact.role && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{contact.role}</span>
                        </div>
                      )}
                    </div>
                    
                    {contact.address && (
                      <p className="text-gray-600 mt-2">{contact.address}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendEmail(contact.email)}
                      className="bg-white text-gray-900 border-gray-300"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/dashboard/contacts/${contact.id}/edit`}
                      className="bg-white text-gray-900 border-gray-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                      className="bg-white text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
