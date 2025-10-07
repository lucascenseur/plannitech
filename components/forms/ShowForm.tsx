"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Save, Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShowFormProps {
  show?: {
    id: string;
    title: string;
    type: string;
    date: string;
    time: string;
    venue: string;
    status: string;
    artists: string[];
    team: number;
    budget: number;
    description?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ShowForm({ show, onSuccess, onCancel }: ShowFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: show?.title || '',
    type: show?.type || '',
    date: show?.date || '',
    time: show?.time || '',
    venue: show?.venue || '',
    status: show?.status || 'draft',
    artists: show?.artists || [''],
    team: show?.team || 0,
    budget: show?.budget || 0,
    description: show?.description || ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArtistChange = (index: number, value: string) => {
    const newArtists = [...formData.artists];
    newArtists[index] = value;
    setFormData(prev => ({
      ...prev,
      artists: newArtists
    }));
  };

  const addArtist = () => {
    setFormData(prev => ({
      ...prev,
      artists: [...prev.artists, '']
    }));
  };

  const removeArtist = (index: number) => {
    if (formData.artists.length > 1) {
      const newArtists = formData.artists.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        artists: newArtists
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filtrer les artistes vides
      const filteredArtists = formData.artists.filter(artist => artist.trim() !== '');

      const payload = {
        ...formData,
        artists: filteredArtists
      };

      const url = show ? `/api/shows/${show.id}` : '/api/shows';
      const method = show ? 'PUT' : 'POST';

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
        title: show ? 'Spectacle mis à jour' : 'Spectacle créé',
        description: `Le spectacle "${result.title}" a été ${show ? 'mis à jour' : 'créé'} avec succès.`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/shows');
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
          <Calendar className="h-5 w-5" />
          {show ? 'Modifier le Spectacle' : 'Nouveau Spectacle'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du spectacle *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nom du spectacle"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de spectacle *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Concert">Concert</SelectItem>
                  <SelectItem value="Théâtre">Théâtre</SelectItem>
                  <SelectItem value="Danse">Danse</SelectItem>
                  <SelectItem value="Comédie">Comédie</SelectItem>
                  <SelectItem value="Opéra">Opéra</SelectItem>
                  <SelectItem value="Ballet">Ballet</SelectItem>
                  <SelectItem value="Cirque">Cirque</SelectItem>
                  <SelectItem value="Festival">Festival</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Lieu *</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                placeholder="Nom du lieu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="planning">En Planification</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description du spectacle"
              rows={3}
            />
          </div>

          {/* Artistes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Artistes</Label>
              <Button type="button" variant="outline" size="sm" onClick={addArtist}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un artiste
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.artists.map((artist, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={artist}
                    onChange={(e) => handleArtistChange(index, e.target.value)}
                    placeholder={`Artiste ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.artists.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArtist(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Équipe et budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="team">Nombre de personnes dans l'équipe</Label>
              <Input
                id="team"
                type="number"
                min="0"
                value={formData.team}
                onChange={(e) => handleInputChange('team', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (€)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
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
              {loading ? 'Sauvegarde...' : (show ? 'Mettre à jour' : 'Créer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
