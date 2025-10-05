"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormActions, FormSection } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Repeat, 
  Bell, 
  Plus, 
  X,
  Tag
} from "lucide-react";
import { eventSchema, EventFormData, Event } from "@/types/planning";

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function EventForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  title = "Nouvel événement",
  description = "Créez un nouvel événement dans votre planning",
}: EventFormProps) {
  const [isRecurring, setIsRecurring] = useState(initialData?.isRecurring || false);
  const [reminders, setReminders] = useState<Array<{ type: string; minutes: number }>>(
    initialData?.reminders || []
  );
  const [newReminder, setNewReminder] = useState({ type: "EMAIL", minutes: 15 });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      allDay: initialData?.allDay || false,
      location: initialData?.location || "",
      type: initialData?.type || "REHEARSAL",
      status: initialData?.status || "CONFIRMED",
      priority: initialData?.priority || "MEDIUM",
      projectId: initialData?.projectId || "",
      contactIds: initialData?.contactIds || [],
      teamIds: initialData?.teamIds || [],
      isRecurring: initialData?.isRecurring || false,
      recurrence: initialData?.recurrence || {
        frequency: "WEEKLY",
        interval: 1,
        daysOfWeek: [],
      },
      reminders: initialData?.reminders || [],
    },
  });

  const addReminder = () => {
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    setValue("reminders", updatedReminders);
    setNewReminder({ type: "EMAIL", minutes: 15 });
  };

  const removeReminder = (index: number) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
    setValue("reminders", updatedReminders);
  };

  const handleFormSubmit = (data: EventFormData) => {
    onSubmit({ ...data, reminders });
  };

  const eventTypes = [
    { value: "REHEARSAL", label: "Répétition" },
    { value: "PERFORMANCE", label: "Représentation" },
    { value: "SETUP", label: "Montage" },
    { value: "BREAKDOWN", label: "Démontage" },
    { value: "MEETING", label: "Réunion" },
    { value: "OTHER", label: "Autre" },
  ];

  const eventStatuses = [
    { value: "CONFIRMED", label: "Confirmé" },
    { value: "TENTATIVE", label: "Tentatif" },
    { value: "CANCELLED", label: "Annulé" },
  ];

  const eventPriorities = [
    { value: "LOW", label: "Faible" },
    { value: "MEDIUM", label: "Normal" },
    { value: "HIGH", label: "Élevée" },
    { value: "URGENT", label: "Urgent" },
  ];

  const reminderTypes = [
    { value: "EMAIL", label: "Email" },
    { value: "PUSH", label: "Notification push" },
    { value: "SMS", label: "SMS" },
  ];

  const recurrenceFrequencies = [
    { value: "DAILY", label: "Quotidien" },
    { value: "WEEKLY", label: "Hebdomadaire" },
    { value: "MONTHLY", label: "Mensuel" },
    { value: "YEARLY", label: "Annuel" },
  ];

  const daysOfWeek = [
    { value: 0, label: "Dimanche" },
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
    { value: 6, label: "Samedi" },
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
            label="Titre"
            error={errors.title?.message}
            required
          >
            <Input
              {...register("title")}
              placeholder="Titre de l'événement"
            />
          </FormField>

          <FormField
            label="Type"
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
                {eventTypes.map((type) => (
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
          <Textarea
            {...register("description")}
            rows={3}
            placeholder="Description de l'événement..."
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
                {eventStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Priorité"
            error={errors.priority?.message}
            required
          >
            <Select
              value={watch("priority")}
              onValueChange={(value) => setValue("priority", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une priorité" />
              </SelectTrigger>
              <SelectContent>
                {eventPriorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Dates et horaires">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={watch("allDay")}
              onCheckedChange={(checked) => setValue("allDay", checked as boolean)}
            />
            <Label htmlFor="allDay">Toute la journée</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date de début"
              error={errors.startDate?.message}
              required
            >
              <Input
                {...register("startDate")}
                type="datetime-local"
              />
            </FormField>

            <FormField
              label="Date de fin"
              error={errors.endDate?.message}
              required
            >
              <Input
                {...register("endDate")}
                type="datetime-local"
              />
            </FormField>
          </div>
        </div>
      </FormSection>

      <FormSection title="Lieu et participants">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Lieu"
            error={errors.location?.message}
          >
            <Input
              {...register("location")}
              placeholder="Lieu de l'événement"
            />
          </FormField>

          <FormField
            label="Projet associé"
            error={errors.projectId?.message}
          >
            <Select
              value={watch("projectId")}
              onValueChange={(value) => setValue("projectId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un projet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun projet</SelectItem>
                {/* Ici on pourrait charger les projets depuis l'API */}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Récurrence">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRecurring"
              checked={isRecurring}
              onCheckedChange={(checked) => {
                setIsRecurring(checked as boolean);
                setValue("isRecurring", checked as boolean);
              }}
            />
            <Label htmlFor="isRecurring">Événement récurrent</Label>
          </div>

          {isRecurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Fréquence"
                error={errors.recurrence?.frequency?.message}
              >
                <Select
                  value={watch("recurrence.frequency")}
                  onValueChange={(value) => setValue("recurrence.frequency", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurrenceFrequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Intervalle"
                error={errors.recurrence?.interval?.message}
              >
                <Input
                  {...register("recurrence.interval", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  placeholder="1"
                />
              </FormField>
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Rappels">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min="0"
              placeholder="Minutes"
              value={newReminder.minutes}
              onChange={(e) => setNewReminder({ ...newReminder, minutes: parseInt(e.target.value) || 0 })}
              className="w-24"
            />
            <Select
              value={newReminder.type}
              onValueChange={(value) => setNewReminder({ ...newReminder, type: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reminderTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addReminder} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {reminders.length > 0 && (
            <div className="space-y-2">
              {reminders.map((reminder, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {reminder.minutes} minutes avant - {reminderTypes.find(t => t.value === reminder.type)?.label}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReminder(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      <FormActions
        onCancel={onCancel}
        onSave={() => {}}
        saveText="Créer l'événement"
        loading={loading}
      />
    </Form>
  );
}
