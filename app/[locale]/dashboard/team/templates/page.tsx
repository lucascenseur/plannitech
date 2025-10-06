"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus,
  Clock,
  Users,
  MapPin,
  Wrench,
  Copy,
  Edit,
  Trash2,
  Download,
  Calendar,
  FileText,
  Settings,
  Star,
  TrendingUp
} from "lucide-react";

interface TemplatesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  priority: string;
  duration: number;
  startTime: string;
  endTime: string;
  category: string;
  usageCount: number;
  lastUsed: string;
  tags: string[];
  isRecurring: boolean;
  recurringPattern: string;
}

interface CreateTaskFromTemplateData {
  startDate: string;
  endDate: string;
  projectId?: string;
  venueId?: string;
  assignedMembers: string[];
  assignedProviders: string[];
  customTitle?: string;
  customDescription?: string;
}

export default function TemplatesPage({ params }: TemplatesPageProps) {
  const [locale, setLocale] = useState('fr');
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUseDialog, setShowUseDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [createTaskData, setCreateTaskData] = useState<CreateTaskFromTemplateData>({
    startDate: '',
    endDate: '',
    assignedMembers: [],
    assignedProviders: []
  });

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/team/templates');
        if (response.ok) {
          const data = await response.json();
          setTemplates(data.templates || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleCreateTaskFromTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const response = await fetch(`/api/team/templates/${selectedTemplate.id}/create-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createTaskData),
      });

      if (response.ok) {
        alert(locale === 'en' ? 'Task created successfully!' : locale === 'es' ? '¡Tarea creada con éxito!' : 'Tâche créée avec succès !');
        setShowUseDialog(false);
        setSelectedTemplate(null);
        // Recharger les templates pour mettre à jour les statistiques
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la création de la tâche');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      alert('Erreur lors de la création de la tâche');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm(locale === 'en' ? 'Are you sure you want to delete this template?' : locale === 'es' ? '¿Estás seguro de que quieres eliminar este template?' : 'Êtes-vous sûr de vouloir supprimer ce template ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/team/templates?id=${templateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTemplates(templates.filter(t => t.id !== templateId));
        alert(locale === 'en' ? 'Template deleted successfully!' : locale === 'es' ? '¡Template eliminado con éxito!' : 'Template supprimé avec succès !');
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la suppression du template');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du template:', error);
      alert('Erreur lors de la suppression du template');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SETUP': return <Settings className="w-4 h-4" />;
      case 'PERFORMANCE': return <Star className="w-4 h-4" />;
      case 'BREAKDOWN': return <Wrench className="w-4 h-4" />;
      case 'REHEARSAL': return <Users className="w-4 h-4" />;
      case 'MEETING': return <FileText className="w-4 h-4" />;
      case 'TRAVEL': return <MapPin className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          {locale === 'en' ? 'Loading templates...' : locale === 'es' ? 'Cargando templates...' : 'Chargement des templates...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Task Templates' : locale === 'es' ? 'Templates de Tareas' : 'Templates de Tâches'}
          </h1>
          <p className="text-gray-600 mt-1">
            {locale === 'en' ? 'Create and manage task templates for quick task creation' : locale === 'es' ? 'Crea y gestiona templates de tareas para crear tareas rápidamente' : 'Créez et gérez des templates de tâches pour créer des tâches rapidement'}
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Create Template' : locale === 'es' ? 'Crear Template' : 'Créer un Template'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {locale === 'en' ? 'Create Task Template' : locale === 'es' ? 'Crear Template de Tarea' : 'Créer un Template de Tâche'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    {locale === 'en' ? 'Template Name' : locale === 'es' ? 'Nombre del Template' : 'Nom du Template'}
                  </Label>
                  <Input id="name" placeholder="ex: Montage" />
                </div>
                <div>
                  <Label htmlFor="type">
                    {locale === 'en' ? 'Type' : locale === 'es' ? 'Tipo' : 'Type'}
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SETUP">Montage</SelectItem>
                      <SelectItem value="PERFORMANCE">Spectacle</SelectItem>
                      <SelectItem value="BREAKDOWN">Démontage</SelectItem>
                      <SelectItem value="REHEARSAL">Répétition</SelectItem>
                      <SelectItem value="MEETING">Réunion</SelectItem>
                      <SelectItem value="TRAVEL">Déplacement</SelectItem>
                      <SelectItem value="OTHER">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">
                  {locale === 'en' ? 'Description' : locale === 'es' ? 'Descripción' : 'Description'}
                </Label>
                <Textarea id="description" placeholder="Description of the template..." />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">
                    {locale === 'en' ? 'Duration (hours)' : locale === 'es' ? 'Duración (horas)' : 'Durée (heures)'}
                  </Label>
                  <Input id="duration" type="number" placeholder="4" />
                </div>
                <div>
                  <Label htmlFor="startTime">
                    {locale === 'en' ? 'Start Time' : locale === 'es' ? 'Hora de Inicio' : 'Heure de Début'}
                  </Label>
                  <Input id="startTime" type="time" placeholder="09:00" />
                </div>
                <div>
                  <Label htmlFor="endTime">
                    {locale === 'en' ? 'End Time' : locale === 'es' ? 'Hora de Fin' : 'Heure de Fin'}
                  </Label>
                  <Input id="endTime" type="time" placeholder="13:00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">
                    {locale === 'en' ? 'Priority' : locale === 'es' ? 'Prioridad' : 'Priorité'}
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Faible</SelectItem>
                      <SelectItem value="MEDIUM">Moyenne</SelectItem>
                      <SelectItem value="HIGH">Élevée</SelectItem>
                      <SelectItem value="URGENT">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">
                    {locale === 'en' ? 'Category' : locale === 'es' ? 'Categoría' : 'Catégorie'}
                  </Label>
                  <Input id="category" placeholder="ex: Technique" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isRecurring" />
                <Label htmlFor="isRecurring">
                  {locale === 'en' ? 'Recurring Template' : locale === 'es' ? 'Template Recurrente' : 'Template Récurrent'}
                </Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  {locale === 'en' ? 'Cancel' : locale === 'es' ? 'Cancelar' : 'Annuler'}
                </Button>
                <Button>
                  {locale === 'en' ? 'Create Template' : locale === 'es' ? 'Crear Template' : 'Créer le Template'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Total Templates' : locale === 'es' ? 'Templates Totales' : 'Templates Totaux'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Most Used' : locale === 'es' ? 'Más Usado' : 'Plus Utilisé'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.length > 0 ? Math.max(...templates.map(t => t.usageCount)) : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Categories' : locale === 'es' ? 'Categorías' : 'Catégories'}
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(templates.map(t => t.category).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Recurring' : locale === 'es' ? 'Recurrentes' : 'Récurrents'}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => t.isRecurring).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(template.type)}
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <Badge className={getPriorityColor(template.priority)}>
                  {template.priority}
                </Badge>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {locale === 'en' ? 'Duration:' : locale === 'es' ? 'Duración:' : 'Durée :'}
                  </span>
                  <span className="font-medium">{template.duration}h</span>
                </div>
                
                {template.startTime && template.endTime && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {locale === 'en' ? 'Time:' : locale === 'es' ? 'Hora:' : 'Heure :'}
                    </span>
                    <span className="font-medium">{template.startTime} - {template.endTime}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {locale === 'en' ? 'Used:' : locale === 'es' ? 'Usado:' : 'Utilisé :'}
                  </span>
                  <span className="font-medium">{template.usageCount} times</span>
                </div>

                {template.category && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {locale === 'en' ? 'Category:' : locale === 'es' ? 'Categoría:' : 'Catégorie :'}
                    </span>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                )}

                {template.isRecurring && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600">
                      {locale === 'en' ? 'Recurring' : locale === 'es' ? 'Recurrente' : 'Récurrent'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowUseDialog(true);
                    }}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {locale === 'en' ? 'Use' : locale === 'es' ? 'Usar' : 'Utiliser'}
                  </Button>
                  
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog pour utiliser un template */}
      <Dialog open={showUseDialog} onOpenChange={setShowUseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? 'Create Task from Template' : locale === 'es' ? 'Crear Tarea desde Template' : 'Créer une Tâche à partir du Template'}
            </DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span>Durée: {selectedTemplate.duration}h</span>
                  {selectedTemplate.startTime && selectedTemplate.endTime && (
                    <span>Heure: {selectedTemplate.startTime} - {selectedTemplate.endTime}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">
                    {locale === 'en' ? 'Start Date' : locale === 'es' ? 'Fecha de Inicio' : 'Date de Début'}
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={createTaskData.startDate}
                    onChange={(e) => setCreateTaskData({ ...createTaskData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">
                    {locale === 'en' ? 'End Date' : locale === 'es' ? 'Fecha de Fin' : 'Date de Fin'}
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={createTaskData.endDate}
                    onChange={(e) => setCreateTaskData({ ...createTaskData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customTitle">
                  {locale === 'en' ? 'Custom Title (optional)' : locale === 'es' ? 'Título Personalizado (opcional)' : 'Titre Personnalisé (optionnel)'}
                </Label>
                <Input
                  id="customTitle"
                  placeholder={selectedTemplate.name}
                  value={createTaskData.customTitle || ''}
                  onChange={(e) => setCreateTaskData({ ...createTaskData, customTitle: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUseDialog(false)}>
                  {locale === 'en' ? 'Cancel' : locale === 'es' ? 'Cancelar' : 'Annuler'}
                </Button>
                <Button onClick={handleCreateTaskFromTemplate}>
                  {locale === 'en' ? 'Create Task' : locale === 'es' ? 'Crear Tarea' : 'Créer la Tâche'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
