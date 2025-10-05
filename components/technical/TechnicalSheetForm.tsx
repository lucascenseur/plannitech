"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  X, 
  Edit, 
  Trash2,
  FileText,
  Lightbulb,
  Volume2,
  Video,
  Stage,
  Shield,
  Settings,
  Target,
  BarChart3,
  Calendar,
  FileText as FileTextIcon,
  Calculator,
  TrendingUp,
  TrendingDown,
  Copy,
  Save,
  Eye,
  Download
} from "lucide-react";
import { technicalSheetSchema, TechnicalSheetFormData, TechnicalSheet } from "@/types/technical";

interface TechnicalSheetFormProps {
  initialData?: Partial<TechnicalSheetFormData>;
  onSubmit: (data: TechnicalSheetFormData) => void;
  onCancel: () => void;
  loading?: boolean | undefined;
  title?: string;
  description?: string;
}

export function TechnicalSheetForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  title = "Nouvelle fiche technique",
  description = "Créez une nouvelle fiche technique pour votre projet",
}: TechnicalSheetFormProps) {
  const [sections, setSections] = useState(initialData?.sections || []);
  const [equipment, setEquipment] = useState(initialData?.equipment || []);
  const [requirements, setRequirements] = useState(initialData?.requirements || []);
  const [newSection, setNewSection] = useState({
    title: "",
    content: "",
    order: 0,
    isRequired: false,
  });
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    quantity: 1,
    unit: "unité",
    description: "",
    specifications: {},
  });
  const [newRequirement, setNewRequirement] = useState({
    title: "",
    description: "",
    isRequired: true,
    category: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TechnicalSheetFormData>({
    resolver: zodResolver(technicalSheetSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      projectId: initialData?.projectId || "",
      type: initialData?.type || "LIGHTING",
      status: initialData?.status || "DRAFT",
      version: initialData?.version || "1.0",
      sections: initialData?.sections || [],
      equipment: initialData?.equipment || [],
      requirements: initialData?.requirements || [],
      notes: initialData?.notes || "",
    },
  });

  const addSection = () => {
    if (newSection.title.trim()) {
      const section = {
        id: `section_${Date.now()}`,
        title: newSection.title.trim(),
        content: newSection.content,
        order: sections.length + 1,
        isRequired: newSection.isRequired,
      };
      const updatedSections = [...sections, section];
      setSections(updatedSections);
      setValue("sections", updatedSections);
      setNewSection({ title: "", content: "", order: 0, isRequired: false });
    }
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = sections.filter(s => s.id !== sectionId);
    setSections(updatedSections);
    setValue("sections", updatedSections);
  };

  const updateSection = (sectionId: string, updates: any) => {
    const updatedSections = sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    );
    setSections(updatedSections);
    setValue("sections", updatedSections);
  };

  const addEquipment = () => {
    if (newEquipment.name.trim()) {
      const equipmentItem = {
        id: `equipment_${Date.now()}`,
        name: newEquipment.name.trim(),
        quantity: newEquipment.quantity,
        unit: newEquipment.unit,
        description: newEquipment.description,
        specifications: newEquipment.specifications,
      };
      const updatedEquipment = [...equipment, equipmentItem];
      setEquipment(updatedEquipment);
      setValue("equipment", updatedEquipment);
      setNewEquipment({ name: "", quantity: 1, unit: "unité", description: "", specifications: {} });
    }
  };

  const removeEquipment = (equipmentId: string) => {
    const updatedEquipment = equipment.filter(e => e.id !== equipmentId);
    setEquipment(updatedEquipment);
    setValue("equipment", updatedEquipment);
  };

  const updateEquipment = (equipmentId: string, updates: any) => {
    const updatedEquipment = equipment.map(e => 
      e.id === equipmentId ? { ...e, ...updates } : e
    );
    setEquipment(updatedEquipment);
    setValue("equipment", updatedEquipment);
  };

  const addRequirement = () => {
    if (newRequirement.title.trim()) {
      const requirement = {
        id: `requirement_${Date.now()}`,
        title: newRequirement.title.trim(),
        description: newRequirement.description,
        isRequired: newRequirement.isRequired,
        category: newRequirement.category,
      };
      const updatedRequirements = [...requirements, requirement];
      setRequirements(updatedRequirements);
      setValue("requirements", updatedRequirements);
      setNewRequirement({ title: "", description: "", isRequired: true, category: "" });
    }
  };

  const removeRequirement = (requirementId: string) => {
    const updatedRequirements = requirements.filter(r => r.id !== requirementId);
    setRequirements(updatedRequirements);
    setValue("requirements", updatedRequirements);
  };

  const updateRequirement = (requirementId: string, updates: any) => {
    const updatedRequirements = requirements.map(r => 
      r.id === requirementId ? { ...r, ...updates } : r
    );
    setRequirements(updatedRequirements);
    setValue("requirements", updatedRequirements);
  };

  const handleFormSubmit = (data: TechnicalSheetFormData) => {
    onSubmit({ ...data, sections, equipment, requirements });
  };

  const technicalTypes = [
    { value: "LIGHTING", label: "Éclairage", icon: Lightbulb },
    { value: "SOUND", label: "Son", icon: Volume2 },
    { value: "VIDEO", label: "Vidéo", icon: Video },
    { value: "STAGE", label: "Scène", icon: Stage },
    { value: "SAFETY", label: "Sécurité", icon: Shield },
    { value: "OTHER", label: "Autre", icon: Settings },
  ];

  const technicalStatuses = [
    { value: "DRAFT", label: "Brouillon" },
    { value: "REVIEW", label: "En révision" },
    { value: "APPROVED", label: "Approuvé" },
    { value: "ARCHIVED", label: "Archivé" },
  ];

  const equipmentUnits = [
    "unité",
    "mètre",
    "mètre carré",
    "mètre cube",
    "kilogramme",
    "litre",
    "heure",
    "jour",
    "semaine",
    "mois",
  ];

  const requirementCategories = [
    "Électricité",
    "Sécurité",
    "Accès",
    "Dimensions",
    "Température",
    "Humidité",
    "Bruit",
    "Autre",
  ];

  const totalEquipment = equipment.reduce((sum, item) => sum + item.quantity, 0);
  const requiredSections = sections.filter(s => s.isRequired).length;
  const requiredRequirements = requirements.filter(r => r.isRequired).length;

  return (
    <Form
      title={title}
      description={description}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="equipment">Équipement</TabsTrigger>
          <TabsTrigger value="requirements">Exigences</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <FormSection title="Informations générales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nom de la fiche technique"
                error={errors.name?.message}
                required
              >
                <Input
                  {...register("name")}
                  placeholder="Nom de la fiche technique"
                />
              </FormField>

              <FormField
                label="Projet"
                error={errors.projectId?.message}
                required
              >
                <Select
                  value={watch("projectId")}
                  onValueChange={(value) => setValue("projectId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Ici on pourrait charger les projets depuis l'API */}
                    <SelectItem value="proj1">Projet 1</SelectItem>
                    <SelectItem value="proj2">Projet 2</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {technicalTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    {technicalStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Version"
                error={errors.version?.message}
                required
              >
                <Input
                  {...register("version")}
                  placeholder="1.0"
                />
              </FormField>

              <FormField
                label="Description"
                error={errors.description?.message}
              >
                <Textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Description de la fiche technique..."
                />
              </FormField>
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
                placeholder="Notes sur cette fiche technique..."
              />
            </FormField>
          </FormSection>
        </TabsContent>

        <TabsContent value="sections" className="space-y-6">
          <FormSection title="Sections de la fiche technique">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  placeholder="Titre de la section"
                />
                <Textarea
                  value={newSection.content}
                  onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                  placeholder="Contenu de la section"
                  rows={2}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRequired"
                    checked={newSection.isRequired}
                    onCheckedChange={(checked) => setNewSection({ ...newSection, isRequired: checked as boolean })}
                  />
                  <Label htmlFor="isRequired">Obligatoire</Label>
                </div>
              </div>
              <Button onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une section
              </Button>

              {sections.length > 0 && (
                <div className="space-y-2">
                  {sections.map((section) => (
                    <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{section.title}</div>
                        {section.content && (
                          <div className="text-sm text-gray-600 mt-1">{section.content}</div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">Ordre: {section.order}</Badge>
                          {section.isRequired && (
                            <Badge variant="default">Obligatoire</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateSection(section.id, { order: section.order + 1 })}
                        >
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateSection(section.id, { order: section.order - 1 })}
                        >
                          <TrendingDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormSection>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          <FormSection title="Équipement nécessaire">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                  placeholder="Nom de l'équipement"
                />
                <Input
                  type="number"
                  value={newEquipment.quantity}
                  onChange={(e) => setNewEquipment({ ...newEquipment, quantity: parseFloat(e.target.value) || 0 })}
                  placeholder="Quantité"
                />
                <Select
                  value={newEquipment.unit}
                  onValueChange={(value) => setNewEquipment({ ...newEquipment, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addEquipment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              {equipment.length > 0 && (
                <div className="space-y-2">
                  {equipment.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">
                            {item.quantity} {item.unit}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateEquipment(item.id, { quantity: item.quantity + 1 })}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateEquipment(item.id, { quantity: Math.max(0, item.quantity - 1) })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeEquipment(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormSection>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <FormSection title="Exigences techniques">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  value={newRequirement.title}
                  onChange={(e) => setNewRequirement({ ...newRequirement, title: e.target.value })}
                  placeholder="Titre de l'exigence"
                />
                <Input
                  value={newRequirement.description}
                  onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                  placeholder="Description"
                />
                <Select
                  value={newRequirement.category}
                  onValueChange={(value) => setNewRequirement({ ...newRequirement, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {requirementCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRequired"
                    checked={newRequirement.isRequired}
                    onCheckedChange={(checked) => setNewRequirement({ ...newRequirement, isRequired: checked as boolean })}
                  />
                  <Label htmlFor="isRequired">Obligatoire</Label>
                </div>
              </div>
              <Button onClick={addRequirement}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une exigence
              </Button>

              {requirements.length > 0 && (
                <div className="space-y-2">
                  {requirements.map((requirement) => (
                    <div key={requirement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{requirement.title}</div>
                        {requirement.description && (
                          <div className="text-sm text-gray-600 mt-1">{requirement.description}</div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{requirement.category}</Badge>
                          {requirement.isRequired && (
                            <Badge variant="default">Obligatoire</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateRequirement(requirement.id, { isRequired: !requirement.isRequired })}
                        >
                          <Target className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeRequirement(requirement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormSection>
        </TabsContent>
      </Tabs>

      <FormSection title="Résumé">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{sections.length}</div>
              <div className="text-sm text-gray-600 mt-2">
                {requiredSections} obligatoire{requiredSections > 1 ? "s" : ""}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Équipement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalEquipment}</div>
              <div className="text-sm text-gray-600 mt-2">
                {equipment.length} type{equipment.length > 1 ? "s" : ""}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exigences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{requirements.length}</div>
              <div className="text-sm text-gray-600 mt-2">
                {requiredRequirements} obligatoire{requiredRequirements > 1 ? "s" : ""}
              </div>
            </CardContent>
          </Card>
        </div>
      </FormSection>

      <FormActions
        onCancel={onCancel}
        onSave={() => {}}
        saveText="Enregistrer la fiche technique"
        loading={loading}
      />
    </Form>
  );
}

