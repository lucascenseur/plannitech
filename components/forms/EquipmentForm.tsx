"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useLocale } from '@/lib/i18n';
import { Combobox } from '@/components/ui/combobox';
import { CreateSupplierModal } from '@/components/modals/CreateSupplierModal';

interface EquipmentFormProps {
  equipment?: any;
  locale: string;
}

export function EquipmentForm({ equipment, locale }: EquipmentFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();
  const isEditing = !!equipment;

  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    category: equipment?.category || 'Audio',
    description: equipment?.description || '',
    quantity: equipment?.quantity || 1,
    status: equipment?.status || 'available',
    supplier: equipment?.supplier || '',
    cost: equipment?.cost || 0,
    location: equipment?.location || ''
  });

  const [loading, setLoading] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSupplierCreated = (supplier: any) => {
    setSelectedSupplier(supplier);
    setFormData(prev => ({
      ...prev,
      supplier: supplier.name
    }));
    setShowSupplierModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing 
        ? `/api/equipment/${equipment.id}`
        : '/api/equipment';
      
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
        throw new Error(errorData.error || t('equipment_form.error_saving'));
      }

      const result = await response.json();
      
      toast({
        title: t('equipment_form.success_title'),
        description: t('equipment_form.success_description'),
      });

      // Redirection vers la page ressources
      router.push(`/${locale}/dashboard/resources`);
    } catch (error: any) {
      toast({
        title: t('equipment_form.error_title'),
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
            {isEditing ? t('equipment_form.edit_title') : t('equipment_form.create_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom et catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('equipment_form.name_label')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t('equipment_form.category_label')}</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Audio">{t('equipment_form.category_audio')}</SelectItem>
                    <SelectItem value="Lumières">{t('equipment_form.category_lights')}</SelectItem>
                    <SelectItem value="Scène">{t('equipment_form.category_stage')}</SelectItem>
                    <SelectItem value="Transport">{t('equipment_form.category_transport')}</SelectItem>
                    <SelectItem value="Autre">{t('equipment_form.category_other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('equipment_form.description_label')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>

            {/* Quantité et statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">{t('equipment_form.quantity_label')}</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                  required
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t('equipment_form.status_label')}</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">{t('equipment_form.status_available')}</SelectItem>
                    <SelectItem value="in_use">{t('equipment_form.status_in_use')}</SelectItem>
                    <SelectItem value="maintenance">{t('equipment_form.status_maintenance')}</SelectItem>
                    <SelectItem value="out_of_order">{t('equipment_form.status_out_of_order')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fournisseur */}
            <div className="space-y-2">
              <Label>{t('equipment_form.supplier_label')}</Label>
              <div className="flex gap-2">
                <Combobox
                  value={selectedSupplier?.id || ''}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, supplier: value }));
                    setSelectedSupplier({ id: value });
                  }}
                  apiEndpoint="/api/suppliers"
                  placeholder={t('equipment_form.select_supplier_placeholder')}
                  emptyMessage={t('equipment_form.no_suppliers_found')}
                  onCreateNew={() => setShowSupplierModal(true)}
                  displayField="name"
                  contextField="category"
                  searchFields={['name', 'category']}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Coût et localisation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">{t('equipment_form.cost_label')}</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('equipment_form.location_label')}</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading 
                  ? t('equipment_form.saving') 
                  : isEditing 
                    ? t('equipment_form.update_button') 
                    : t('equipment_form.create_button')
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="bg-white text-gray-900 border-gray-300"
              >
                {t('equipment_form.cancel_button')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateSupplierModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onSuccess={handleSupplierCreated}
        locale={locale}
      />
    </>
  );
}
