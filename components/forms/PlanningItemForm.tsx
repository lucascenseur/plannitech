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
import { CreateShowModal } from '@/components/modals/CreateShowModal';
import { CreateVenueModal } from '@/components/modals/CreateVenueModal';
import { CreateContactModal } from '@/components/modals/CreateContactModal';
import { X, Plus } from 'lucide-react';

interface PlanningItemFormProps {
  planningItem?: any;
  locale: string;
}

export function PlanningItemForm({ planningItem, locale }: PlanningItemFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();
  const isEditing = !!planningItem;

  const [formData, setFormData] = useState({
    title: planningItem?.title || '',
    type: planningItem?.type || 'setup',
    startTime: planningItem?.startTime || '',
    endTime: planningItem?.endTime || '',
    showId: planningItem?.showId || '',
    venueId: planningItem?.venueId || '',
    assignedTo: planningItem?.assignedTo || [],
    description: planningItem?.description || '',
    status: planningItem?.status || 'pending'
  });

  const [loading, setLoading] = useState(false);
  const [showShowModal, setShowShowModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState<any>(null);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShowCreated = (show: any) => {
    setSelectedShow(show);
    setFormData(prev => ({
      ...prev,
      showId: show.id
    }));
    setShowShowModal(false);
  };

  const handleVenueCreated = (venue: any) => {
    setSelectedVenue(venue);
    setFormData(prev => ({
      ...prev,
      venueId: venue.id
    }));
    setShowVenueModal(false);
  };

  const handleContactCreated = (contact: any) => {
    setSelectedContacts(prev => [...prev, contact]);
    setFormData(prev => ({
      ...prev,
      assignedTo: [...prev.assignedTo, contact.id]
    }));
    setShowContactModal(false);
  };

  const removeContact = (contactId: string) => {
    setSelectedContacts(prev => prev.filter(contact => contact.id !== contactId));
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.filter(id => id !== contactId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing 
        ? `/api/planning/${planningItem.id}`
        : '/api/planning';
      
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
        throw new Error(errorData.error || t('planning_item_form.error_saving'));
      }

      const result = await response.json();
      
      toast({
        title: t('planning_item_form.success_title'),
        description: t('planning_item_form.success_description'),
      });

      // Redirection vers la page planning
      router.push(`/${locale}/dashboard/planning`);
    } catch (error: any) {
      toast({
        title: t('planning_item_form.error_title'),
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
            {isEditing ? t('planning_item_form.edit_title') : t('planning_item_form.create_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title">{t('planning_item_form.title_label')}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">{t('planning_item_form.type_label')}</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="setup">{t('planning_item_form.type_setup')}</SelectItem>
                  <SelectItem value="rehearsal">{t('planning_item_form.type_rehearsal')}</SelectItem>
                  <SelectItem value="performance">{t('planning_item_form.type_performance')}</SelectItem>
                  <SelectItem value="breakdown">{t('planning_item_form.type_breakdown')}</SelectItem>
                  <SelectItem value="transport">{t('planning_item_form.type_transport')}</SelectItem>
                  <SelectItem value="catering">{t('planning_item_form.type_catering')}</SelectItem>
                  <SelectItem value="other">{t('planning_item_form.type_other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Heures de début et fin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">{t('planning_item_form.start_time_label')}</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">{t('planning_item_form.end_time_label')}</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>

            {/* Spectacle */}
            <div className="space-y-2">
              <Label>{t('planning_item_form.show_label')}</Label>
              <div className="flex gap-2">
                <Combobox
                  value={formData.showId}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, showId: value }));
                    setSelectedShow({ id: value });
                  }}
                  apiEndpoint="/api/shows"
                  placeholder={t('planning_item_form.select_show_placeholder')}
                  emptyMessage={t('planning_item_form.no_shows_found')}
                  onCreateNew={() => setShowShowModal(true)}
                  displayField="title"
                  contextField="type"
                  searchFields={['title', 'type']}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowShowModal(true)}
                  className="bg-white text-gray-900 border-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lieu */}
            <div className="space-y-2">
              <Label>{t('planning_item_form.venue_label')}</Label>
              <div className="flex gap-2">
                <Combobox
                  value={formData.venueId}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, venueId: value }));
                    setSelectedVenue({ id: value });
                  }}
                  apiEndpoint="/api/venues"
                  placeholder={t('planning_item_form.select_venue_placeholder')}
                  emptyMessage={t('planning_item_form.no_venues_found')}
                  onCreateNew={() => setShowVenueModal(true)}
                  displayField="name"
                  contextField="address"
                  searchFields={['name', 'address']}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowVenueModal(true)}
                  className="bg-white text-gray-900 border-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Personnes assignées */}
            <div className="space-y-2">
              <Label>{t('planning_item_form.assigned_to_label')}</Label>
              <div className="flex gap-2">
                <Combobox
                  value=""
                  onValueChange={(value) => {
                    // Ajouter le contact sélectionné
                    const contact = { id: value, name: 'Selected Contact' };
                    setSelectedContacts(prev => [...prev, contact]);
                    setFormData(prev => ({
                      ...prev,
                      assignedTo: [...prev.assignedTo, value]
                    }));
                  }}
                  apiEndpoint="/api/contacts"
                  placeholder={t('planning_item_form.select_contact_placeholder')}
                  emptyMessage={t('planning_item_form.no_contacts_found')}
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
              
              {/* Liste des contacts assignés */}
              {selectedContacts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedContacts.map((contact) => (
                    <Badge key={contact.id} variant="secondary" className="flex items-center gap-1">
                      {contact.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(contact.id)}
                        className="h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('planning_item_form.description_label')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <Label htmlFor="status">{t('planning_item_form.status_label')}</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('planning_item_form.status_pending')}</SelectItem>
                  <SelectItem value="in_progress">{t('planning_item_form.status_in_progress')}</SelectItem>
                  <SelectItem value="completed">{t('planning_item_form.status_completed')}</SelectItem>
                  <SelectItem value="cancelled">{t('planning_item_form.status_cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading 
                  ? t('planning_item_form.saving') 
                  : isEditing 
                    ? t('planning_item_form.update_button') 
                    : t('planning_item_form.create_button')
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="bg-white text-gray-900 border-gray-300"
              >
                {t('planning_item_form.cancel_button')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateShowModal
        isOpen={showShowModal}
        onClose={() => setShowShowModal(false)}
        onSuccess={handleShowCreated}
        locale={locale}
      />
      
      <CreateVenueModal
        isOpen={showVenueModal}
        onClose={() => setShowVenueModal(false)}
        onSuccess={handleVenueCreated}
        locale={locale}
      />
      
      <CreateContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSuccess={handleContactCreated}
        locale={locale}
      />
    </>
  );
}
