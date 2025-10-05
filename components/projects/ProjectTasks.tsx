"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Flag,
  Clock
} from "lucide-react";

interface ProjectTasksProps {
  projectId: string;
  projectName: string;
}

interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function ProjectTasks({ projectId, projectName }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as const,
    assignee: "",
    dueDate: "",
  });

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setNewTask({ title: "", description: "", priority: "MEDIUM", assignee: "", dueDate: "" });
        setShowCreateForm(false);
        await loadTasks();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<ProjectTask>) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await loadTasks();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadTasks();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "TODO":
        return <Square className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4" />;
      case "DONE":
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-red-100 text-red-800",
    };
    return colors[priority as keyof typeof colors] || colors.MEDIUM;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      TODO: "bg-gray-100 text-gray-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      DONE: "bg-green-100 text-green-800",
    };
    return colors[status as keyof typeof colors] || colors.TODO;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      TODO: "À faire",
      IN_PROGRESS: "En cours",
      DONE: "Terminé",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      LOW: "Faible",
      MEDIUM: "Normal",
      HIGH: "Élevée",
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const todoTasks = tasks.filter(task => task.status === "TODO");
  const inProgressTasks = tasks.filter(task => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter(task => task.status === "DONE");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tâches du projet</CardTitle>
              <CardDescription>
                Gérez les tâches du projet "{projectName}"
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Titre</Label>
                  <Input
                    id="task-title"
                    placeholder="Titre de la tâche"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-priority">Priorité</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Faible</SelectItem>
                      <SelectItem value="MEDIUM">Normal</SelectItem>
                      <SelectItem value="HIGH">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  placeholder="Description de la tâche"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-assignee">Assigné à</Label>
                  <Input
                    id="task-assignee"
                    placeholder="Email de l'assigné"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-due-date">Date d'échéance</Label>
                  <Input
                    id="task-due-date"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handleCreateTask} disabled={!newTask.title}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la tâche
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO Column */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Square className="h-5 w-5" />
              <span>À faire</span>
              <Badge variant="secondary">{todoTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todoTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateTask(task.id, { status: "IN_PROGRESS" })}
                    >
                      <Clock className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {task.description && (
                  <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <Badge className={getPriorityColor(task.priority)}>
                    {getPriorityLabel(task.priority)}
                  </Badge>
                  {task.assignee && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{task.assignee.name}</span>
                    </div>
                  )}
                </div>
                {task.dueDate && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* IN_PROGRESS Column */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>En cours</span>
              <Badge variant="secondary">{inProgressTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inProgressTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateTask(task.id, { status: "DONE" })}
                    >
                      <CheckSquare className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {task.description && (
                  <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <Badge className={getPriorityColor(task.priority)}>
                    {getPriorityLabel(task.priority)}
                  </Badge>
                  {task.assignee && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{task.assignee.name}</span>
                    </div>
                  )}
                </div>
                {task.dueDate && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* DONE Column */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5" />
              <span>Terminé</span>
              <Badge variant="secondary">{doneTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {doneTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-green-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-through">{task.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateTask(task.id, { status: "TODO" })}
                    >
                      <Square className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {task.description && (
                  <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <Badge className={getPriorityColor(task.priority)}>
                    {getPriorityLabel(task.priority)}
                  </Badge>
                  {task.assignee && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{task.assignee.name}</span>
                    </div>
                  )}
                </div>
                {task.dueDate && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

