"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Clock, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Play,
  Pause
} from "lucide-react";

interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedHours: number;
  actualHours: number;
  startDate?: string;
  endDate?: string;
  assignments: TaskAssignment[];
}

interface TaskAssignment {
  id: string;
  taskId: string;
  contactId: string;
  contactName: string;
  role: string;
  hourlyRate: number;
  estimatedHours: number;
  actualHours: number;
  status: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  hourlyRate?: number;
}

interface ProjectTasksProps {
  projectId: string;
  locale: string;
}

export function ProjectTasks({ projectId, locale }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les tâches et contacts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, contactsRes] = await Promise.all([
          fetch(`/api/tasks?projectId=${projectId}`),
          fetch('/api/contacts')
        ]);

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.tasks || []);
        }

        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          setContacts(contactsData.contacts || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleCreateTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, projectId }),
      });

      if (response.ok) {
        const result = await response.json();
        setTasks(prev => [...prev, result.task]);
        setShowCreateDialog(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status }),
      });

      if (response.ok) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, status } : task
        ));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleAssignContact = async (assignmentData: any) => {
    try {
      const response = await fetch('/api/task-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData),
      });

      if (response.ok) {
        // Recharger les tâches pour avoir les assignations
        const tasksRes = await fetch(`/api/tasks?projectId=${projectId}`);
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.tasks || []);
        }
        setShowAssignDialog(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
    }
  };

  const calculateTaskCost = (task: Task) => {
    return task.assignments.reduce((total, assignment) => {
      return total + (assignment.actualHours * assignment.hourlyRate);
    }, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'DONE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des tâches...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {locale === 'en' ? 'Project Tasks' : locale === 'es' ? 'Tareas del Proyecto' : 'Tâches du projet'}
        </h3>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {locale === 'en' ? 'Add Task' : locale === 'es' ? 'Agregar Tarea' : 'Ajouter une tâche'}
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {locale === 'en' ? 'No tasks yet' : locale === 'es' ? 'Aún no hay tareas' : 'Aucune tâche pour le moment'}
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Create first task' : locale === 'es' ? 'Crear primera tarea' : 'Créer la première tâche'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{task.name}</h4>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status === 'TODO' ? (locale === 'en' ? 'To Do' : locale === 'es' ? 'Por Hacer' : 'À faire') :
                         task.status === 'IN_PROGRESS' ? (locale === 'en' ? 'In Progress' : locale === 'es' ? 'En Progreso' : 'En cours') :
                         locale === 'en' ? 'Done' : locale === 'es' ? 'Hecho' : 'Terminé'}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority === 'LOW' ? (locale === 'en' ? 'Low' : locale === 'es' ? 'Baja' : 'Faible') :
                         task.priority === 'MEDIUM' ? (locale === 'en' ? 'Medium' : locale === 'es' ? 'Media' : 'Moyenne') :
                         locale === 'en' ? 'High' : locale === 'es' ? 'Alta' : 'Élevée'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.estimatedHours}h {locale === 'en' ? 'estimated' : locale === 'es' ? 'estimado' : 'estimé'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {task.assignments.length} {locale === 'en' ? 'assigned' : locale === 'es' ? 'asignados' : 'assignés'}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        €{calculateTaskCost(task).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleUpdateTaskStatus(task.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODO">
                          {locale === 'en' ? 'To Do' : locale === 'es' ? 'Por Hacer' : 'À faire'}
                        </SelectItem>
                        <SelectItem value="IN_PROGRESS">
                          {locale === 'en' ? 'In Progress' : locale === 'es' ? 'En Progreso' : 'En cours'}
                        </SelectItem>
                        <SelectItem value="DONE">
                          {locale === 'en' ? 'Done' : locale === 'es' ? 'Hecho' : 'Terminé'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setShowAssignDialog(true);
                      }}
                    >
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {task.assignments.length > 0 && (
                  <div className="border-t pt-4">
                    <h5 className="font-medium mb-2">
                      {locale === 'en' ? 'Assigned to:' : locale === 'es' ? 'Asignado a:' : 'Assigné à :'}
                    </h5>
                    <div className="space-y-2">
                      {task.assignments.map((assignment) => (
                        <div key={assignment.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{assignment.contactName}</span>
                            <span className="text-sm text-gray-500 ml-2">({assignment.role})</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {assignment.actualHours}h × €{assignment.hourlyRate}/h = €{(assignment.actualHours * assignment.hourlyRate).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de création de tâche */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? 'Create Task' : locale === 'es' ? 'Crear Tarea' : 'Créer une tâche'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateDialog(false)}
            locale={locale}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog d'assignation */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? 'Assign Contact' : locale === 'es' ? 'Asignar Contacto' : 'Assigner un contact'}
            </DialogTitle>
          </DialogHeader>
          <AssignmentForm
            task={selectedTask}
            contacts={contacts}
            onSubmit={handleAssignContact}
            onCancel={() => setShowAssignDialog(false)}
            locale={locale}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant pour le formulaire de tâche
function TaskForm({ onSubmit, onCancel, locale }: any) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM',
    estimatedHours: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">
          {locale === 'en' ? 'Task Name' : locale === 'es' ? 'Nombre de Tarea' : 'Nom de la tâche'}
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">
          {locale === 'en' ? 'Description' : locale === 'es' ? 'Descripción' : 'Description'}
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="priority">
          {locale === 'en' ? 'Priority' : locale === 'es' ? 'Prioridad' : 'Priorité'}
        </Label>
        <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">
              {locale === 'en' ? 'Low' : locale === 'es' ? 'Baja' : 'Faible'}
            </SelectItem>
            <SelectItem value="MEDIUM">
              {locale === 'en' ? 'Medium' : locale === 'es' ? 'Media' : 'Moyenne'}
            </SelectItem>
            <SelectItem value="HIGH">
              {locale === 'en' ? 'High' : locale === 'es' ? 'Alta' : 'Élevée'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="estimatedHours">
          {locale === 'en' ? 'Estimated Hours' : locale === 'es' ? 'Horas Estimadas' : 'Heures estimées'}
        </Label>
        <Input
          id="estimatedHours"
          type="number"
          value={formData.estimatedHours}
          onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {locale === 'en' ? 'Cancel' : locale === 'es' ? 'Cancelar' : 'Annuler'}
        </Button>
        <Button type="submit">
          {locale === 'en' ? 'Create' : locale === 'es' ? 'Crear' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}

// Composant pour le formulaire d'assignation
function AssignmentForm({ task, contacts, onSubmit, onCancel, locale }: any) {
  const [formData, setFormData] = useState({
    contactId: '',
    role: 'ASSIGNEE',
    hourlyRate: 0,
    estimatedHours: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      taskId: task?.id,
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="contactId">
          {locale === 'en' ? 'Contact' : locale === 'es' ? 'Contacto' : 'Contact'}
        </Label>
        <Select value={formData.contactId} onValueChange={(value) => setFormData({ ...formData, contactId: value })}>
          <SelectTrigger>
            <SelectValue placeholder={locale === 'en' ? 'Select contact' : locale === 'es' ? 'Seleccionar contacto' : 'Sélectionner un contact'} />
          </SelectTrigger>
          <SelectContent>
            {contacts.map((contact: Contact) => (
              <SelectItem key={contact.id} value={contact.id}>
                {contact.name} ({contact.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="role">
          {locale === 'en' ? 'Role' : locale === 'es' ? 'Rol' : 'Rôle'}
        </Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder={locale === 'en' ? 'e.g., Technician, Manager' : locale === 'es' ? 'ej. Técnico, Gerente' : 'ex. Technicien, Manager'}
        />
      </div>
      
      <div>
        <Label htmlFor="hourlyRate">
          {locale === 'en' ? 'Hourly Rate (€)' : locale === 'es' ? 'Tarifa por Hora (€)' : 'Taux horaire (€)'}
        </Label>
        <Input
          id="hourlyRate"
          type="number"
          step="0.01"
          value={formData.hourlyRate}
          onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
        />
      </div>
      
      <div>
        <Label htmlFor="estimatedHours">
          {locale === 'en' ? 'Estimated Hours' : locale === 'es' ? 'Horas Estimadas' : 'Heures estimées'}
        </Label>
        <Input
          id="estimatedHours"
          type="number"
          value={formData.estimatedHours}
          onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {locale === 'en' ? 'Cancel' : locale === 'es' ? 'Cancelar' : 'Annuler'}
        </Button>
        <Button type="submit">
          {locale === 'en' ? 'Assign' : locale === 'es' ? 'Asignar' : 'Assigner'}
        </Button>
      </div>
    </form>
  );
}