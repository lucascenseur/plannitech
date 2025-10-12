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

interface ContactFormProps {
  contact?: any;
  locale: string;
}

export function ContactForm({ contact, locale }: ContactFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();
  const isEditing = !!contact;

  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    type: contact?.type || 'individual',
    company: contact?.company || '',
    role: contact?.role || '',
    address: contact?.address || '',
    notes: contact?.notes || ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing 
        ? `/api/contacts/${contact.id}`
        : '/api/contacts';
      
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
        throw new Error(errorData.error || t('contact_form.error_saving'));
      }

      const result = await response.json();
      
      toast({
        title: t('contact_form.success_title'),
        description: t('contact_form.success_description'),
      });

      // Redirection vers la page contacts
      router.push(`/${locale}/dashboard/team`);
    } catch (error: any) {
      toast({
        title: t('contact_form.error_title'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white text-gray-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isEditing ? t('contact_form.edit_title') : t('contact_form.create_title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('contact_form.name_label')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('contact_form.email_label')}</Label>
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
              <Label htmlFor="phone">{t('contact_form.phone_label')}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">{t('contact_form.type_label')}</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">{t('contact_form.type_individual')}</SelectItem>
                  <SelectItem value="company">{t('contact_form.type_company')}</SelectItem>
                  <SelectItem value="artist">{t('contact_form.type_artist')}</SelectItem>
                  <SelectItem value="team_member">{t('contact_form.type_team_member')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Entreprise et rôle */}
          {formData.type === 'company' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">{t('contact_form.company_label')}</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t('contact_form.role_label')}</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>
          )}

          {/* Rôle pour les artistes */}
          {formData.type === 'artist' && (
            <div className="space-y-2">
              <Label htmlFor="role">{t('contact_form.role_label')}</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder={t('contact_form.role_placeholder')}
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>
          )}

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="address">{t('contact_form.address_label')}</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className="bg-white text-gray-900 border-gray-300"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('contact_form.notes_label')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="bg-white text-gray-900 border-gray-300"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading 
                ? t('contact_form.saving') 
                : isEditing 
                  ? t('contact_form.update_button') 
                  : t('contact_form.create_button')
              }
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="bg-white text-gray-900 border-gray-300"
            >
              {t('contact_form.cancel_button')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
