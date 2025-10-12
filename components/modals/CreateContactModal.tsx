"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (contact: { id: string; name: string; email: string; role?: string }) => void;
  locale: string;
}

export function CreateContactModal({ isOpen, onClose, onSuccess, locale }: CreateContactModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'contact',
    role: '',
    company: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du contact');
      }

      const newContact = await response.json();
      
      toast({
        title: locale === 'en' ? 'Contact Created' : locale === 'es' ? 'Contacto Creado' : 'Contact Créé',
        description: locale === 'en' 
          ? 'The contact has been created successfully.' 
          : locale === 'es'
          ? 'El contacto ha sido creado exitosamente.'
          : 'Le contact a été créé avec succès.',
      });

      onSuccess(newContact.contact);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'contact',
        role: '',
        company: ''
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: locale === 'en' ? 'Error' : locale === 'es' ? 'Error' : 'Erreur',
        description: locale === 'en' 
          ? 'Failed to create contact. Please try again.' 
          : locale === 'es'
          ? 'Error al crear contacto. Inténtalo de nuevo.'
          : 'Échec de la création du contact. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {locale === 'en' ? 'Create New Contact' : locale === 'es' ? 'Crear Nuevo Contacto' : 'Créer un Nouveau Contact'}
          </DialogTitle>
          <DialogDescription>
            {locale === 'en' 
              ? 'Add a new contact to your database.' 
              : locale === 'es'
              ? 'Agregar un nuevo contacto a tu base de datos.'
              : 'Ajoutez un nouveau contact à votre base de données.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {locale === 'en' ? 'Name' : locale === 'es' ? 'Nombre' : 'Nom'} *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={locale === 'en' ? 'Enter name' : locale === 'es' ? 'Ingresa nombre' : 'Saisissez le nom'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              {locale === 'en' ? 'Email' : locale === 'es' ? 'Correo' : 'Email'} *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={locale === 'en' ? 'Enter email' : locale === 'es' ? 'Ingresa correo' : 'Saisissez l\'email'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              {locale === 'en' ? 'Phone' : locale === 'es' ? 'Teléfono' : 'Téléphone'}
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={locale === 'en' ? 'Enter phone' : locale === 'es' ? 'Ingresa teléfono' : 'Saisissez le téléphone'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                {locale === 'en' ? 'Type' : locale === 'es' ? 'Tipo' : 'Type'}
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contact">
                    {locale === 'en' ? 'Contact' : locale === 'es' ? 'Contacto' : 'Contact'}
                  </SelectItem>
                  <SelectItem value="artist">
                    {locale === 'en' ? 'Artist' : locale === 'es' ? 'Artista' : 'Artiste'}
                  </SelectItem>
                  <SelectItem value="supplier">
                    {locale === 'en' ? 'Supplier' : locale === 'es' ? 'Proveedor' : 'Fournisseur'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                {locale === 'en' ? 'Role' : locale === 'es' ? 'Rol' : 'Rôle'}
              </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder={locale === 'en' ? 'Enter role' : locale === 'es' ? 'Ingresa rol' : 'Saisissez le rôle'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">
              {locale === 'en' ? 'Company' : locale === 'es' ? 'Empresa' : 'Entreprise'}
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder={locale === 'en' ? 'Enter company' : locale === 'es' ? 'Ingresa empresa' : 'Saisissez l\'entreprise'}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              {locale === 'en' ? 'Cancel' : locale === 'es' ? 'Cancelar' : 'Annuler'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {locale === 'en' ? 'Create Contact' : locale === 'es' ? 'Crear Contacto' : 'Créer le Contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
