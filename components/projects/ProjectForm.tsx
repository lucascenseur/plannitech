"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormActions, FormSection } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Calendar, MapPin, Users, DollarSign, Tag } from "lucide-react";
import { projectSchema, ProjectFormData } from "@/types/project";

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  title = "Nouveau projet",
  description = "Créez un nouveau projet de spectacle",
}: ProjectFormProps) {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      type: initialData?.type || "CONCERT",
      status: initialData?.status || "DRAFT",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      venue: initialData?.venue || "",
      budget: initialData?.budget || 0,
      teamSize: initialData?.teamSize || 1,
      isPublic: initialData?.isPublic || false,
      tags: initialData?.tags || [],
    },
  });

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue("tags", updatedTags);
  };

  const handleFormSubmit = (data: ProjectFormData) => {
    onSubmit({ ...data, tags });
  };

  const projectTypes = [
    { value: "CONCERT", label: "Concert" },
    { value: "THEATRE", label: "Théâtre" },
    { value: "DANSE", label: "Danse" },
    { value: "CIRQUE", label: "Cirque" },
    { value: "AUTRE", label: "Autre" },
  ];

  const projectStatuses = [
    { value: "DRAFT", label: "Brouillon" },
    { value: "DEVELOPMENT", label: "Développement" },
    { value: "PRODUCTION", label: "Production" },
    { value: "TOUR", label: "Tournée" },
    { value: "ARCHIVED", label: "Archivé" },
  ];

  return (
    <Form
      title={title}
      description={description}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <FormSection title="Informations générales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Nom du projet"
            error={errors.name?.message}
            required
          >
            <Input
              {...register("name")}
              placeholder="Nom de votre spectacle"
            />
          </FormField>

          <FormField
            label="Type de spectacle"
            error={errors.type?.message}
            required
          >
            <Select
              value={watch("type")}
              onValueChange={(value) => setValue("type", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <FormField
          label="Description"
          error={errors.description?.message}
        >
          <textarea
            {...register("description")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Description du projet..."
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Statut"
            error={errors.status?.message}
            required
          >
            <Select
              value={watch("status")}
              onValueChange={(value) => setValue("status", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {projectStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Lieu"
            error={errors.venue?.message}
          >
            <Input
              {...register("venue")}
              placeholder="Lieu du spectacle"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Dates et planning">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Date de début"
            error={errors.startDate?.message}
            required
          >
            <Input
              {...register("startDate")}
              type="date"
            />
          </FormField>

          <FormField
            label="Date de fin"
            error={errors.endDate?.message}
          >
            <Input
              {...register("endDate")}
              type="date"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Budget et équipe">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Budget (€)"
            error={errors.budget?.message}
          >
            <Input
              {...register("budget", { valueAsNumber: true })}
              type="number"
              placeholder="0"
            />
          </FormField>

          <FormField
            label="Taille de l'équipe"
            error={errors.teamSize?.message}
          >
            <Input
              {...register("teamSize", { valueAsNumber: true })}
              type="number"
              placeholder="1"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Tags et visibilité">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={watch("isPublic")}
              onCheckedChange={(checked) => setValue("isPublic", checked as boolean)}
            />
            <Label htmlFor="isPublic">Projet public</Label>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Ajouter un tag..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </FormSection>

      <FormActions
        onCancel={onCancel}
        onSave={() => {}}
        saveText="Créer le projet"
        loading={loading}
      />
    </Form>
  );
}

