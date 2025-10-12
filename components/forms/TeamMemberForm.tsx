"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useLocale } from '@/lib/i18n';
import { Combobox } from '@/components/ui/combobox';
import { CreateContactModal } from '@/components/modals/CreateContactModal';
import { X, Plus } from 'lucide-react';

interface TeamMemberFormProps {
  teamMember?: any;
  locale: string;
}

export function TeamMemberForm({ teamMember, locale }: TeamMemberFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();
  const isEditing = !!teamMember;

  const [formData, setFormData] = useState({
    name: teamMember?.name || '',
    email: teamMember?.email || '',
    phone: teamMember?.phone || '',
    role: teamMember?.role || '',
    availability: teamMember?.availability || 'available',
    skills: teamMember?.skills || [],
    contactId: teamMember?.contactId || '',
    assignedShows: teamMember?.assignedShows || []
  });

  const [loading, setLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [selectedShows, setSelectedShows] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactCreated = (contact: any) => {
    setSelectedContact(contact);
    setFormData(prev => ({
      ...prev,
      contactId: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    }));
    setShowContactModal(false);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addShow = (showId: string) => {
    if (!formData.assignedShows.includes(showId)) {
      setFormData(prev => ({
        ...prev,
        assignedShows: [...prev.assignedShows, showId]
      }));
    }
  };

  const removeShow = (showId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedShows: prev.assignedShows.filter(id => id !== showId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing 
        ? `/api/team/members/${teamMember.id}`
        : '/api/team/members';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('team_member_form.error_saving'));
      }

      const result = await response.json();
      
      toast({
        title: t('team_member_form.success_title'),
        description: t('team_member_form.success_description'),
      });

      // Redirection vers la page équipe
      router.push(`/${locale}/dashboard/team`);
    } catch (error: any) {
      toast({
        title: t('team_member_form.error_title'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto bg-white text-gray-900">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? t('team_member_form.edit_title') : t('team_member_form.create_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('team_member_form.name_label')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('team_member_form.email_label')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('team_member_form.phone_label')}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t('team_member_form.role_label')}</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  required
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>

            {/* Contact associé */}
            <div className="space-y-2">
              <Label>{t('team_member_form.contact_label')}</Label>
              <div className="flex gap-2">
                <Combobox
                  value={formData.contactId}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, contactId: value }));
                    setSelectedContact({ id: value });
                  }}
                  apiEndpoint="/api/contacts"
                  placeholder={t('team_member_form.select_contact_placeholder')}
                  emptyMessage={t('team_member_form.no_contacts_found')}
                  onCreateNew={() => setShowContactModal(true)}
                  displayField="name"
                  contextField="email"
                  searchFields={['name', 'email']}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactModal(true)}
                  className="bg-white text-gray-900 border-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Disponibilité */}
            <div className="space-y-2">
              <Label htmlFor="availability">{t('team_member_form.availability_label')}</Label>
              <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">{t('team_member_form.availability_available')}</SelectItem>
                  <SelectItem value="busy">{t('team_member_form.availability_busy')}</SelectItem>
                  <SelectItem value="unavailable">{t('team_member_form.availability_unavailable')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Compétences */}
            <div className="space-y-2">
              <Label>{t('team_member_form.skills_label')}</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder={t('team_member_form.add_skill_placeholder')}
                  className="flex-1 bg-white text-gray-900 border-gray-300"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  className="bg-white text-gray-900 border-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Liste des compétences */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(index)}
                        className="h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Spectacles assignés */}
            <div className="space-y-2">
              <Label>{t('team_member_form.assigned_shows_label')}</Label>
              <Combobox
                value=""
                onValueChange={addShow}
                apiEndpoint="/api/shows"
                placeholder={t('team_member_form.select_show_placeholder')}
                emptyMessage={t('team_member_form.no_shows_found')}
                displayField="title"
                contextField="type"
                searchFields={['title', 'type']}
                className="bg-white text-gray-900 border-gray-300"
              />
              
              {/* Liste des spectacles assignés */}
              {formData.assignedShows.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.assignedShows.map((showId) => (
                    <Badge key={showId} variant="secondary" className="flex items-center gap-1">
                      Show {showId}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeShow(showId)}
                        className="h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading 
                  ? t('team_member_form.saving') 
                  : isEditing 
                    ? t('team_member_form.update_button') 
                    : t('team_member_form.create_button')
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="bg-white text-gray-900 border-gray-300"
              >
                {t('team_member_form.cancel_button')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSuccess={handleContactCreated}
        locale={locale}
      />
    </>
  );
}
