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
import { Loader2, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CreateVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (venue: { id: string; name: string; city: string }) => void;
  locale: string;
}

export function CreateVenueModal({ isOpen, onClose, onSuccess, locale }: CreateVenueModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'theater',
    address: '',
    city: '',
    capacity: 0,
    contact: {
      name: '',
      phone: '',
      email: ''
    }
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('contact.')) {
      const contactField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du lieu');
      }

      const newVenue = await response.json();
      
      toast({
        title: locale === 'en' ? 'Venue Created' : locale === 'es' ? 'Lugar Creado' : 'Lieu Créé',
        description: locale === 'en' 
          ? 'The venue has been created successfully.' 
          : locale === 'es'
          ? 'El lugar ha sido creado exitosamente.'
          : 'Le lieu a été créé avec succès.',
      });

      onSuccess(newVenue.venue);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        type: 'theater',
        address: '',
        city: '',
        capacity: 0,
        contact: {
          name: '',
          phone: '',
          email: ''
        }
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: locale === 'en' ? 'Error' : locale === 'es' ? 'Error' : 'Erreur',
        description: locale === 'en' 
          ? 'Failed to create venue. Please try again.' 
          : locale === 'es'
          ? 'Error al crear lugar. Inténtalo de nuevo.'
          : 'Échec de la création du lieu. Veuillez réessayer.',
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {locale === 'en' ? 'Create New Venue' : locale === 'es' ? 'Crear Nuevo Lugar' : 'Créer un Nouveau Lieu'}
          </DialogTitle>
          <DialogDescription>
            {locale === 'en' 
              ? 'Add a new venue to your database.' 
              : locale === 'es'
              ? 'Agregar un nuevo lugar a tu base de datos.'
              : 'Ajoutez un nouveau lieu à votre base de données.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {locale === 'en' ? 'Name' : locale === 'es' ? 'Nombre' : 'Nom'} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={locale === 'en' ? 'Enter venue name' : locale === 'es' ? 'Ingresa nombre del lugar' : 'Saisissez le nom du lieu'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">
                {locale === 'en' ? 'Type' : locale === 'es' ? 'Tipo' : 'Type'}
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theater">
                    {locale === 'en' ? 'Theater' : locale === 'es' ? 'Teatro' : 'Théâtre'}
                  </SelectItem>
                  <SelectItem value="concert_hall">
                    {locale === 'en' ? 'Concert Hall' : locale === 'es' ? 'Sala de Conciertos' : 'Salle de Concert'}
                  </SelectItem>
                  <SelectItem value="outdoor">
                    {locale === 'en' ? 'Outdoor' : locale === 'es' ? 'Exterior' : 'Extérieur'}
                  </SelectItem>
                  <SelectItem value="studio">
                    {locale === 'en' ? 'Studio' : locale === 'es' ? 'Estudio' : 'Studio'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              {locale === 'en' ? 'Address' : locale === 'es' ? 'Dirección' : 'Adresse'} *
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder={locale === 'en' ? 'Enter address' : locale === 'es' ? 'Ingresa dirección' : 'Saisissez l\'adresse'}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                {locale === 'en' ? 'City' : locale === 'es' ? 'Ciudad' : 'Ville'} *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder={locale === 'en' ? 'Enter city' : locale === 'es' ? 'Ingresa ciudad' : 'Saisissez la ville'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">
                {locale === 'en' ? 'Capacity' : locale === 'es' ? 'Capacidad' : 'Capacité'}
              </Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                placeholder={locale === 'en' ? 'Enter capacity' : locale === 'es' ? 'Ingresa capacidad' : 'Saisissez la capacité'}
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">
              {locale === 'en' ? 'Contact Information' : locale === 'es' ? 'Información de Contacto' : 'Informations de Contact'}
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">
                  {locale === 'en' ? 'Contact Name' : locale === 'es' ? 'Nombre de Contacto' : 'Nom du Contact'}
                </Label>
                <Input
                  id="contactName"
                  value={formData.contact.name}
                  onChange={(e) => handleInputChange('contact.name', e.target.value)}
                  placeholder={locale === 'en' ? 'Contact name' : locale === 'es' ? 'Nombre de contacto' : 'Nom du contact'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">
                  {locale === 'en' ? 'Phone' : locale === 'es' ? 'Teléfono' : 'Téléphone'}
                </Label>
                <Input
                  id="contactPhone"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  placeholder={locale === 'en' ? 'Phone number' : locale === 'es' ? 'Número de teléfono' : 'Numéro de téléphone'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  {locale === 'en' ? 'Email' : locale === 'es' ? 'Correo' : 'Email'}
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  placeholder={locale === 'en' ? 'Email address' : locale === 'es' ? 'Dirección de correo' : 'Adresse email'}
                />
              </div>
            </div>
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
              {locale === 'en' ? 'Create Venue' : locale === 'es' ? 'Crear Lugar' : 'Créer le Lieu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
