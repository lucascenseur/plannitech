"use client";

import { useState } from "react";
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
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Star,
  Plus,
  X,
  Tag,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Banknote,
  Building
} from "lucide-react";
import { contactSchema, ContactFormData, Contact } from "@/types/contact";

interface ContactFormProps {
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function ContactForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  title = "Nouveau contact",
  description = "Créez un nouveau contact dans votre base",
}: ContactFormProps) {
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [groups, setGroups] = useState<string[]>(initialData?.groups || []);
  const [rates, setRates] = useState(initialData?.rates || []);
  const [availability, setAvailability] = useState(initialData?.availability || []);
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [newRate, setNewRate] = useState({
    type: "",
    amount: 0,
    currency: "EUR",
    unit: "HOUR" as const,
  });
  const [newAvailability, setNewAvailability] = useState({
    startDate: "",
    endDate: "",
    status: "AVAILABLE" as const,
    reason: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      type: initialData?.type || "ARTIST",
      status: initialData?.status || "ACTIVE",
      description: initialData?.description || "",
      website: initialData?.website || "",
      address: initialData?.address || {
        street: "",
        city: "",
        postalCode: "",
        country: "",
      },
      socialMedia: initialData?.socialMedia || {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      },
      isIntermittent: initialData?.isIntermittent || false,
      intermittentNumber: initialData?.intermittentNumber || "",
      siret: initialData?.siret || "",
      apeCode: initialData?.apeCode || "",
      vatNumber: initialData?.vatNumber || "",
      bankDetails: initialData?.bankDetails || {
        iban: "",
        bic: "",
        bankName: "",
      },
      skills: initialData?.skills || [],
      rates: initialData?.rates || [],
      availability: initialData?.availability || [],
      tags: initialData?.tags || [],
      groups: initialData?.groups || [],
      isFavorite: initialData?.isFavorite || false,
      notes: initialData?.notes || "",
    },
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setValue("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = skills.filter(s => s !== skill);
    setSkills(updatedSkills);
    setValue("skills", updatedSkills);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter(t => t !== tag);
    setTags(updatedTags);
    setValue("tags", updatedTags);
  };

  const addGroup = () => {
    if (newGroup.trim() && !groups.includes(newGroup.trim())) {
      const updatedGroups = [...groups, newGroup.trim()];
      setGroups(updatedGroups);
      setValue("groups", updatedGroups);
      setNewGroup("");
    }
  };

  const removeGroup = (group: string) => {
    const updatedGroups = groups.filter(g => g !== group);
    setGroups(updatedGroups);
    setValue("groups", updatedGroups);
  };

  const addRate = () => {
    if (newRate.type.trim() && newRate.amount > 0) {
      const updatedRates = [...rates, { ...newRate }];
      setRates(updatedRates);
      setValue("rates", updatedRates);
      setNewRate({
        type: "",
        amount: 0,
        currency: "EUR",
        unit: "HOUR",
      });
    }
  };

  const removeRate = (index: number) => {
    const updatedRates = rates.filter((_, i) => i !== index);
    setRates(updatedRates);
    setValue("rates", updatedRates);
  };

  const addAvailability = () => {
    if (newAvailability.startDate && newAvailability.endDate) {
      const updatedAvailability = [...availability, { ...newAvailability }];
      setAvailability(updatedAvailability);
      setValue("availability", updatedAvailability);
      setNewAvailability({
        startDate: "",
        endDate: "",
        status: "AVAILABLE",
        reason: "",
      });
    }
  };

  const removeAvailability = (index: number) => {
    const updatedAvailability = availability.filter((_, i) => i !== index);
    setAvailability(updatedAvailability);
    setValue("availability", updatedAvailability);
  };

  const handleFormSubmit = (data: ContactFormData) => {
    onSubmit({ ...data, skills, tags, groups, rates, availability });
  };

  const contactTypes = [
    { value: "ARTIST", label: "Artiste" },
    { value: "TECHNICIAN", label: "Technicien" },
    { value: "VENUE", label: "Lieu" },
    { value: "SUPPLIER", label: "Prestataire" },
    { value: "OTHER", label: "Autre" },
  ];

  const contactStatuses = [
    { value: "ACTIVE", label: "Actif" },
    { value: "INACTIVE", label: "Inactif" },
    { value: "BLOCKED", label: "Bloqué" },
  ];

  const rateUnits = [
    { value: "HOUR", label: "Heure" },
    { value: "DAY", label: "Jour" },
    { value: "PROJECT", label: "Projet" },
    { value: "PERFORMANCE", label: "Représentation" },
  ];

  const availabilityStatuses = [
    { value: "AVAILABLE", label: "Disponible" },
    { value: "BUSY", label: "Occupé" },
    { value: "UNAVAILABLE", label: "Indisponible" },
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
            label="Nom complet"
            error={errors.name?.message}
            required
          >
            <Input
              {...register("name")}
              placeholder="Nom du contact"
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
                {contactTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Email"
            error={errors.email?.message}
          >
            <Input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
            />
          </FormField>

          <FormField
            label="Téléphone"
            error={errors.phone?.message}
          >
            <Input
              {...register("phone")}
              placeholder="+33 1 23 45 67 89"
            />
          </FormField>
        </div>

        <FormField
          label="Description"
          error={errors.description?.message}
        >
          <Textarea
            {...register("description")}
            rows={3}
            placeholder="Description du contact..."
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Site web"
            error={errors.website?.message}
          >
            <Input
              {...register("website")}
              placeholder="https://example.com"
            />
          </FormField>

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
                {contactStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Adresse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Rue"
            error={errors.address?.street?.message}
          >
            <Input
              {...register("address.street")}
              placeholder="123 Rue de la Paix"
            />
          </FormField>

          <FormField
            label="Ville"
            error={errors.address?.city?.message}
          >
            <Input
              {...register("address.city")}
              placeholder="Paris"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Code postal"
            error={errors.address?.postalCode?.message}
          >
            <Input
              {...register("address.postalCode")}
              placeholder="75001"
            />
          </FormField>

          <FormField
            label="Pays"
            error={errors.address?.country?.message}
          >
            <Input
              {...register("address.country")}
              placeholder="France"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Réseaux sociaux">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Facebook"
            error={errors.socialMedia?.facebook?.message}
          >
            <Input
              {...register("socialMedia.facebook")}
              placeholder="https://facebook.com/username"
            />
          </FormField>

          <FormField
            label="Twitter"
            error={errors.socialMedia?.twitter?.message}
          >
            <Input
              {...register("socialMedia.twitter")}
              placeholder="https://twitter.com/username"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Instagram"
            error={errors.socialMedia?.instagram?.message}
          >
            <Input
              {...register("socialMedia.instagram")}
              placeholder="https://instagram.com/username"
            />
          </FormField>

          <FormField
            label="LinkedIn"
            error={errors.socialMedia?.linkedin?.message}
          >
            <Input
              {...register("socialMedia.linkedin")}
              placeholder="https://linkedin.com/in/username"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Informations professionnelles">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isIntermittent"
              checked={watch("isIntermittent")}
              onCheckedChange={(checked) => setValue("isIntermittent", checked as boolean)}
            />
            <Label htmlFor="isIntermittent">Intermittent du spectacle</Label>
          </div>

          {watch("isIntermittent") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Numéro d'intermittent"
                error={errors.intermittentNumber?.message}
              >
                <Input
                  {...register("intermittentNumber")}
                  placeholder="123456789"
                />
              </FormField>

              <FormField
                label="SIRET"
                error={errors.siret?.message}
              >
                <Input
                  {...register("siret")}
                  placeholder="12345678901234"
                />
              </FormField>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Code APE"
              error={errors.apeCode?.message}
            >
              <Input
                {...register("apeCode")}
                placeholder="9001Z"
              />
            </FormField>

            <FormField
              label="Numéro de TVA"
              error={errors.vatNumber?.message}
            >
              <Input
                {...register("vatNumber")}
                placeholder="FR12345678901"
              />
            </FormField>
          </div>
        </div>
      </FormSection>

      <FormSection title="Informations bancaires">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="IBAN"
            error={errors.bankDetails?.iban?.message}
          >
            <Input
              {...register("bankDetails.iban")}
              placeholder="FR1420041010050500013M02606"
            />
          </FormField>

          <FormField
            label="BIC"
            error={errors.bankDetails?.bic?.message}
          >
            <Input
              {...register("bankDetails.bic")}
              placeholder="PSSTFRPPPAR"
            />
          </FormField>
        </div>

        <FormField
          label="Nom de la banque"
          error={errors.bankDetails?.bankName?.message}
        >
          <Input
            {...register("bankDetails.bankName")}
            placeholder="Banque Populaire"
          />
        </FormField>
      </FormSection>

      <FormSection title="Compétences">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Ajouter une compétence"
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
            <Button type="button" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Tags">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Ajouter un tag"
              onKeyPress={(e) => e.key === "Enter" && addTag()}
            />
            <Button type="button" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Groupes">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              placeholder="Ajouter un groupe"
              onKeyPress={(e) => e.key === "Enter" && addGroup()}
            />
            <Button type="button" onClick={addGroup}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {groups.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <Badge key={group} variant="default" className="flex items-center space-x-1">
                  <span>{group}</span>
                  <button
                    type="button"
                    onClick={() => removeGroup(group)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Tarifs">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              value={newRate.type}
              onChange={(e) => setNewRate({ ...newRate, type: e.target.value })}
              placeholder="Type de tarif"
            />
            <Input
              type="number"
              value={newRate.amount}
              onChange={(e) => setNewRate({ ...newRate, amount: parseFloat(e.target.value) || 0 })}
              placeholder="Montant"
            />
            <Select
              value={newRate.currency}
              onValueChange={(value) => setNewRate({ ...newRate, currency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newRate.unit}
              onValueChange={(value) => setNewRate({ ...newRate, unit: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rateUnits.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="button" onClick={addRate}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le tarif
          </Button>

          {rates.length > 0 && (
            <div className="space-y-2">
              {rates.map((rate, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {rate.type} - {rate.amount} {rate.currency}/{rate.unit}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRate(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Disponibilités">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="date"
              value={newAvailability.startDate}
              onChange={(e) => setNewAvailability({ ...newAvailability, startDate: e.target.value })}
              placeholder="Date de début"
            />
            <Input
              type="date"
              value={newAvailability.endDate}
              onChange={(e) => setNewAvailability({ ...newAvailability, endDate: e.target.value })}
              placeholder="Date de fin"
            />
            <Select
              value={newAvailability.status}
              onValueChange={(value) => setNewAvailability({ ...newAvailability, status: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availabilityStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            value={newAvailability.reason}
            onChange={(e) => setNewAvailability({ ...newAvailability, reason: e.target.value })}
            placeholder="Raison (optionnel)"
          />

          <Button type="button" onClick={addAvailability}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter la disponibilité
          </Button>

          {availability.length > 0 && (
            <div className="space-y-2">
              {availability.map((avail, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {new Date(avail.startDate).toLocaleDateString("fr-FR")} - {new Date(avail.endDate).toLocaleDateString("fr-FR")} ({avail.status})
                    </span>
                    {avail.reason && (
                      <span className="text-sm text-gray-500">- {avail.reason}</span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAvailability(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Notes">
        <FormField
          label="Notes personnelles"
          error={errors.notes?.message}
        >
          <Textarea
            {...register("notes")}
            rows={4}
            placeholder="Notes sur ce contact..."
          />
        </FormField>
      </FormSection>

      <FormActions
        onCancel={onCancel}
        onSave={() => {}}
        saveText="Enregistrer le contact"
        loading={loading}
      />
    </Form>
  );
}

