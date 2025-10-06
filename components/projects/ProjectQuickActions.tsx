"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: string;
  type: string;
  budget: number;
  startDate?: string;
  endDate?: string;
}

interface ProjectQuickActionsProps {
  project: Project;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  locale: string;
}

export function ProjectQuickActions({
  project,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
  locale
}: ProjectQuickActionsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'bg-yellow-100 text-yellow-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PLANNING': return locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificación' : 'Planification';
      case 'ACTIVE': return locale === 'en' ? 'Active' : locale === 'es' ? 'Activo' : 'Actif';
      case 'COMPLETED': return locale === 'en' ? 'Completed' : locale === 'es' ? 'Completado' : 'Terminé';
      case 'CANCELLED': return locale === 'en' ? 'Cancelled' : locale === 'es' ? 'Cancelado' : 'Annulé';
      default: return status;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(project.id, newStatus);
  };

  const handleDelete = () => {
    if (confirm(
      locale === 'en' ? `Are you sure you want to delete "${project.name}"?` :
      locale === 'es' ? `¿Estás seguro de que quieres eliminar "${project.name}"?` :
      `Êtes-vous sûr de vouloir supprimer "${project.name}" ?`
    )) {
      onDelete(project.id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Statut modifiable */}
      <Select value={project.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PLANNING">
            {locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificación' : 'Planification'}
          </SelectItem>
          <SelectItem value="ACTIVE">
            {locale === 'en' ? 'Active' : locale === 'es' ? 'Activo' : 'Actif'}
          </SelectItem>
          <SelectItem value="COMPLETED">
            {locale === 'en' ? 'Completed' : locale === 'es' ? 'Completado' : 'Terminé'}
          </SelectItem>
          <SelectItem value="CANCELLED">
            {locale === 'en' ? 'Cancelled' : locale === 'es' ? 'Cancelado' : 'Annulé'}
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Actions rapides */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(project.id)}
          title={locale === 'en' ? 'View project' : locale === 'es' ? 'Ver proyecto' : 'Voir le projet'}
        >
          <Eye className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(project.id)}
          title={locale === 'en' ? 'Edit project' : locale === 'es' ? 'Editar proyecto' : 'Modifier le projet'}
        >
          <Edit className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(project.id)}>
              <Eye className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'View' : locale === 'es' ? 'Ver' : 'Voir'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(project.id)}>
              <Edit className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Edit' : locale === 'es' ? 'Editar' : 'Modifier'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Delete' : locale === 'es' ? 'Eliminar' : 'Supprimer'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
