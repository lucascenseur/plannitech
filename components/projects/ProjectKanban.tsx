"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectKanbanView } from "@/types/project";
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  MoreHorizontal,
  Eye,
  Edit,
  Archive
} from "lucide-react";

interface ProjectKanbanProps {
  projects: ProjectKanbanView[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onCreate: () => void;
}

export function ProjectKanban({
  projects,
  onView,
  onEdit,
  onArchive,
  onStatusChange,
  onCreate,
}: ProjectKanbanProps) {
  const [draggedProject, setDraggedProject] = useState<string | null>(null);

  const statusColumns = [
    {
      id: "DRAFT",
      title: "Brouillon",
      color: "bg-gray-100",
      textColor: "text-gray-700",
      borderColor: "border-gray-300",
    },
    {
      id: "DEVELOPMENT",
      title: "Développement",
      color: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-300",
    },
    {
      id: "PRODUCTION",
      title: "Production",
      color: "bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-300",
    },
    {
      id: "TOUR",
      title: "Tournée",
      color: "bg-purple-100",
      textColor: "text-purple-700",
      borderColor: "border-purple-300",
    },
    {
      id: "ARCHIVED",
      title: "Archivé",
      color: "bg-gray-100",
      textColor: "text-gray-700",
      borderColor: "border-gray-300",
    },
  ];

  const getProjectsByStatus = (status: string) => {
    return projects.filter(project => project.status === status);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-red-100 text-red-800",
    };
    return colors[priority as keyof typeof colors] || colors.LOW;
  };

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProject(projectId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedProject) {
      onStatusChange(draggedProject, newStatus);
      setDraggedProject(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vue Kanban</h1>
          <p className="text-gray-600">
            Organisez vos projets par statut
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {statusColumns.map((column) => {
          const columnProjects = getProjectsByStatus(column.id);
          
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <Card className="h-full">
                <CardHeader className={`${column.color} ${column.borderColor} border-l-4`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={column.textColor}>
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary">
                      {columnProjects.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {columnProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, project.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Project Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {project.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {project.type}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Project Details */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(project.startDate)}</span>
                            </div>
                            
                            {project.venue && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">{project.venue}</span>
                              </div>
                            )}

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              {project.budget && (
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{project.budget.toLocaleString()}€</span>
                                </div>
                              )}
                              {project.teamSize && (
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{project.teamSize}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Progression</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Tags */}
                          {project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Priority */}
                          <div className="flex items-center justify-between">
                            <Badge className={getPriorityColor(project.priority)}>
                              {project.priority === "HIGH" ? "Urgent" : 
                               project.priority === "MEDIUM" ? "Normal" : "Faible"}
                            </Badge>
                            
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onView(project.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onEdit(project.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onArchive(project.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Empty State */}
                  {columnProjects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">Aucun projet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

