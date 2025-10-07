"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Save, MapPin, Users, Star, Phone, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VenueFormProps {
  venue?: {
    id: string;
    name: string;
    type: string;
    address: string;
    capacity: number;
    status: string;
    contact: {
      name: string;
      phone: string;
      email: string;
    };
    facilities: string[];
    stage: {
      width: number;
      depth: number;
      height: number;
    };
    rates: {
      day: number;
      week: number;
    };
    rating: number;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function VenueForm({ venue, onSuccess, onCancel }: VenueFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: venue?.name || '',
    type: venue?.type || '',
    address: venue?.address || '',
    capacity: venue?.capacity || 0,
    status: venue?.status || 'available',
    contact: {
      name: venue?.contact?.name || '',
      phone: venue?.contact?.phone || '',
      email: venue?.contact?.email || ''
    },
    facilities: venue?.facilities || [''],
    stage: {
      width: venue?.stage?.width || 0,
      depth: venue?.stage?.depth || 0,
      height: venue?.stage?.height || 0
    },
    rates: {
      day: venue?.rates?.day || 0,
      week: venue?.rates?.week || 0
    },
    rating: venue?.rating || 0
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const handleStageChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      stage: {
        ...prev.stage,
        [field]: value
      }
    }));
  };

  const handleRatesChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      rates: {
        ...prev.rates,
        [field]: value
      }
    }));
  };

  const handleFacilityChange = (index: number, value: string) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index] = value;
    setFormData(prev => ({
      ...prev,
      facilities: newFacilities
    }));
  };

  const addFacility = () => {
    setFormData(prev => ({
      ...prev,
      facilities: [...prev.facilities, '']
    }));
  };

  const removeFacility = (index: number) => {
    if (formData.facilities.length > 1) {
      const newFacilities = formData.facilities.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        facilities: newFacilities
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filtrer les équipements vides
      const filteredFacilities = formData.facilities.filter(facility => facility.trim() !== '');

      const payload = {
        ...formData,
        facilities: filteredFacilities
      };

      const url = venue ? `/api/venues/${venue.id}` : '/api/venues';
      const method = venue ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      
      toast({
        title: venue ? 'Lieu mis à jour' : 'Lieu créé',
        description: `Le lieu "${result.name}" a été ${venue ? 'mis à jour' : 'créé'} avec succès.`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/venues');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {venue ? 'Modifier le Lieu' : 'Nouveau Lieu'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du lieu *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nom du lieu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de lieu *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Théâtre">Théâtre</SelectItem>
                  <SelectItem value="Centre Culturel">Centre Culturel</SelectItem>
                  <SelectItem value="Salle Polyvalente">Salle Polyvalente</SelectItem>
                  <SelectItem value="Auditorium">Auditorium</SelectItem>
                  <SelectItem value="Salle de Concert">Salle de Concert</SelectItem>
                  <SelectItem value="Espace Culturel">Espace Culturel</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Adresse complète"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité</Label>
              <Input
                id="capacity"
                type="number"
                min="0"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="booked">Réservé</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="unavailable">Indisponible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Contact</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Nom du contact</Label>
                <Input
                  id="contactName"
                  value={formData.contact.name}
                  onChange={(e) => handleContactChange('name', e.target.value)}
                  placeholder="Nom du contact"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Téléphone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  placeholder="contact@lieu.fr"
                />
              </div>
            </div>
          </div>

          {/* Équipements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Équipements disponibles</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFacility}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un équipement
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.facilities.map((facility, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={facility}
                    onChange={(e) => handleFacilityChange(index, e.target.value)}
                    placeholder={`Équipement ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.facilities.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFacility(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dimensions de la scène */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Dimensions de la scène (mètres)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stageWidth">Largeur</Label>
                <Input
                  id="stageWidth"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.stage.width}
                  onChange={(e) => handleStageChange('width', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stageDepth">Profondeur</Label>
                <Input
                  id="stageDepth"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.stage.depth}
                  onChange={(e) => handleStageChange('depth', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stageHeight">Hauteur</Label>
                <Input
                  id="stageHeight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.stage.height}
                  onChange={(e) => handleStageChange('height', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          {/* Tarifs */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Tarifs (€)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rateDay">Tarif journalier</Label>
                <Input
                  id="rateDay"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.rates.day}
                  onChange={(e) => handleRatesChange('day', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rateWeek">Tarif hebdomadaire</Label>
                <Input
                  id="rateWeek"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.rates.week}
                  onChange={(e) => handleRatesChange('week', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Sauvegarde...' : (venue ? 'Mettre à jour' : 'Créer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
