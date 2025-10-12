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
import { CreateEquipmentModal } from '@/components/modals/CreateEquipmentModal';
import { X, Plus } from 'lucide-react';

interface TechnicalSheetFormProps {
  technicalSheet?: any;
  locale: string;
}

export function TechnicalSheetForm({ technicalSheet, locale }: TechnicalSheetFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();
  const isEditing = !!technicalSheet;

  const [formData, setFormData] = useState({
    title: technicalSheet?.title || '',
    showId: technicalSheet?.showId || '',
    equipment: technicalSheet?.equipment || [],
    crew: technicalSheet?.crew || [],
    setup: technicalSheet?.setup || '',
    breakdown: technicalSheet?.breakdown || '',
    notes: technicalSheet?.notes || '',
    status: technicalSheet?.status || 'draft'
  });

  const [loading, setLoading] = useState(false);
  const [showShowModal, setShowShowModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState<any>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<any[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<any[]>([]);

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

  const handleEquipmentCreated = (equipment: any) => {
    setSelectedEquipment(prev => [...prev, equipment]);
    setFormData(prev => ({
      ...prev,
      equipment: [...prev.equipment, equipment.id]
    }));
    setShowEquipmentModal(false);
  };

  const removeEquipment = (equipmentId: string) => {
    setSelectedEquipment(prev => prev.filter(eq => eq.id !== equipmentId));
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter(id => id !== equipmentId)
    }));
  };

  const addCrewMember = () => {
    const newCrew = {
      id: Date.now().toString(),
      name: '',
      role: '',
      phone: '',
      email: ''
    };
    setSelectedCrew(prev => [...prev, newCrew]);
    setFormData(prev => ({
      ...prev,
      crew: [...prev.crew, newCrew]
    }));
  };

  const removeCrewMember = (index: number) => {
    setSelectedCrew(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      crew: prev.crew.filter((_, i) => i !== index)
    }));
  };

  const updateCrewMember = (index: number, field: string, value: string) => {
    const updatedCrew = [...selectedCrew];
    updatedCrew[index] = { ...updatedCrew[index], [field]: value };
    setSelectedCrew(updatedCrew);
    
    const updatedFormCrew = [...formData.crew];
    updatedFormCrew[index] = { ...updatedFormCrew[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      crew: updatedFormCrew
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing 
        ? `/api/technical-sheets/${technicalSheet.id}`
        : '/api/technical-sheets';
      
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
        throw new Error(errorData.error || t('technical_sheet_form.error_saving'));
      }

      const result = await response.json();
      
      toast({
        title: t('technical_sheet_form.success_title'),
        description: t('technical_sheet_form.success_description'),
      });

      // Redirection vers la liste des fiches techniques
      router.push(`/${locale}/dashboard/shows`);
    } catch (error: any) {
      toast({
        title: t('technical_sheet_form.error_title'),
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
            {isEditing ? t('technical_sheet_form.edit_title') : t('technical_sheet_form.create_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title">{t('technical_sheet_form.title_label')}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>

            {/* Spectacle */}
            <div className="space-y-2">
              <Label>{t('technical_sheet_form.show_label')}</Label>
              <div className="flex gap-2">
                <Combobox
                  value={formData.showId}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, showId: value }));
                    setSelectedShow({ id: value });
                  }}
                  apiEndpoint="/api/shows"
                  placeholder={t('technical_sheet_form.select_show_placeholder')}
                  emptyMessage={t('technical_sheet_form.no_shows_found')}
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

            {/* Équipements */}
            <div className="space-y-2">
              <Label>{t('technical_sheet_form.equipment_label')}</Label>
              <div className="flex gap-2">
                <Combobox
                  value=""
                  onValueChange={(value) => {
                    // Ajouter l'équipement sélectionné
                    const equipment = { id: value, name: 'Selected Equipment' };
                    setSelectedEquipment(prev => [...prev, equipment]);
                    setFormData(prev => ({
                      ...prev,
                      equipment: [...prev.equipment, value]
                    }));
                  }}
                  apiEndpoint="/api/equipment"
                  placeholder={t('technical_sheet_form.select_equipment_placeholder')}
                  emptyMessage={t('technical_sheet_form.no_equipment_found')}
                  onCreateNew={() => setShowEquipmentModal(true)}
                  displayField="name"
                  contextField="category"
                  searchFields={['name', 'category']}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEquipmentModal(true)}
                  className="bg-white text-gray-900 border-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Liste des équipements sélectionnés */}
              {selectedEquipment.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEquipment.map((equipment) => (
                    <Badge key={equipment.id} variant="secondary" className="flex items-center gap-1">
                      {equipment.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEquipment(equipment.id)}
                        className="h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Équipe technique */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('technical_sheet_form.crew_label')}</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCrewMember}
                  className="bg-white text-gray-900 border-gray-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('technical_sheet_form.add_crew_member')}
                </Button>
              </div>
              
              {selectedCrew.map((member, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border rounded-lg">
                  <Input
                    placeholder={t('technical_sheet_form.crew_name_placeholder')}
                    value={member.name}
                    onChange={(e) => updateCrewMember(index, 'name', e.target.value)}
                    className="bg-white text-gray-900 border-gray-300"
                  />
                  <Input
                    placeholder={t('technical_sheet_form.crew_role_placeholder')}
                    value={member.role}
                    onChange={(e) => updateCrewMember(index, 'role', e.target.value)}
                    className="bg-white text-gray-900 border-gray-300"
                  />
                  <Input
                    placeholder={t('technical_sheet_form.crew_phone_placeholder')}
                    value={member.phone}
                    onChange={(e) => updateCrewMember(index, 'phone', e.target.value)}
                    className="bg-white text-gray-900 border-gray-300"
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder={t('technical_sheet_form.crew_email_placeholder')}
                      value={member.email}
                      onChange={(e) => updateCrewMember(index, 'email', e.target.value)}
                      className="bg-white text-gray-900 border-gray-300"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeCrewMember(index)}
                      className="bg-white text-gray-900 border-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Setup */}
            <div className="space-y-2">
              <Label htmlFor="setup">{t('technical_sheet_form.setup_label')}</Label>
              <Textarea
                id="setup"
                value={formData.setup}
                onChange={(e) => handleInputChange('setup', e.target.value)}
                rows={4}
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              <Label htmlFor="breakdown">{t('technical_sheet_form.breakdown_label')}</Label>
              <Textarea
                id="breakdown"
                value={formData.breakdown}
                onChange={(e) => handleInputChange('breakdown', e.target.value)}
                rows={4}
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t('technical_sheet_form.notes_label')}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <Label htmlFor="status">{t('technical_sheet_form.status_label')}</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t('technical_sheet_form.status_draft')}</SelectItem>
                  <SelectItem value="review">{t('technical_sheet_form.status_review')}</SelectItem>
                  <SelectItem value="approved">{t('technical_sheet_form.status_approved')}</SelectItem>
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
                  ? t('technical_sheet_form.saving') 
                  : isEditing 
                    ? t('technical_sheet_form.update_button') 
                    : t('technical_sheet_form.create_button')
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="bg-white text-gray-900 border-gray-300"
              >
                {t('technical_sheet_form.cancel_button')}
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
      
      <CreateEquipmentModal
        isOpen={showEquipmentModal}
        onClose={() => setShowEquipmentModal(false)}
        onSuccess={handleEquipmentCreated}
        locale={locale}
      />
    </>
  );
}
