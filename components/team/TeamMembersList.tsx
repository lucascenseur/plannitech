"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocale } from '@/lib/i18n';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  availability: string;
  skills: string[];
  assignedShows: string[];
  contact?: {
    name: string;
    email: string;
  };
}

export function TeamMembersList() {
  const { t } = useLocale();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team/members');
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      const data = await response.json();
      setTeamMembers(data.members || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: t('team_members_list.error_title'),
        description: t('team_members_list.error_description'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('team_members_list.confirm_delete'))) return;

    try {
      const response = await fetch(`/api/team/members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete team member');
      }

      toast({
        title: t('team_members_list.delete_success_title'),
        description: t('team_members_list.delete_success_description'),
      });

      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: t('team_members_list.delete_error_title'),
        description: t('team_members_list.delete_error_description'),
        variant: 'destructive',
      });
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || member.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesAvailability = !availabilityFilter || member.availability === availabilityFilter;
    
    return matchesSearch && matchesRole && matchesAvailability;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h2 className="text-2xl font-bold text-gray-900">{t('team_members_list.title')}</h2>
        <Button
          onClick={() => window.location.href = '/dashboard/team/members/new'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('team_members_list.add_member')}
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
                  placeholder={t('team_members_list.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>
            <Input
              placeholder={t('team_members_list.filter_role')}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full md:w-48 bg-white text-gray-900 border-gray-300"
            />
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900 border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('team_members_list.filter_availability')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('team_members_list.all_availability')}</SelectItem>
                <SelectItem value="available">{t('team_members_list.availability_available')}</SelectItem>
                <SelectItem value="busy">{t('team_members_list.availability_busy')}</SelectItem>
                <SelectItem value="unavailable">{t('team_members_list.availability_unavailable')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <div className="grid gap-4">
        {filteredMembers.length === 0 ? (
          <Card className="bg-white text-gray-900">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('team_members_list.no_members')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('team_members_list.no_members_description')}
              </p>
              <Button
                onClick={() => window.location.href = '/dashboard/team/members/new'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('team_members_list.add_first_member')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredMembers.map((member) => (
            <Card key={member.id} className="bg-white text-gray-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <Badge className={getAvailabilityColor(member.availability)}>
                        {member.availability}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{member.email}</span>
                      </div>
                      
                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{member.role}</span>
                      </div>
                    </div>
                    
                    {member.skills && member.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {member.assignedShows && member.assignedShows.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-4 w-4" />
                          <span>{member.assignedShows.length} {t('team_members_list.shows_assigned')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/dashboard/team/members/${member.id}/edit`}
                      className="bg-white text-gray-900 border-gray-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
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
