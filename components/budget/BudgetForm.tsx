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
  Plus, 
  X, 
  Edit, 
  Trash2,
  DollarSign,
  Target,
  BarChart3,
  Calendar,
  FileText,
  Calculator,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { budgetSchema, BudgetFormData, Budget } from "@/types/budget";

interface BudgetFormProps {
  initialData?: Partial<BudgetFormData>;
  onSubmit: (data: BudgetFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function BudgetForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  title = "Nouveau budget",
  description = "Créez un nouveau budget pour votre projet",
}: BudgetFormProps) {
  const [categories, setCategories] = useState(initialData?.categories || []);
  const [items, setItems] = useState(initialData?.items || []);
  const [newCategory, setNewCategory] = useState({
    name: "",
    amount: 0,
    percentage: 0,
    description: "",
  });
  const [newItem, setNewItem] = useState({
    categoryId: "",
    name: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    isRecurring: false,
    frequency: "ONCE" as const,
    startDate: "",
    endDate: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      projectId: initialData?.projectId || "",
      type: initialData?.type || "PREVIEW",
      status: initialData?.status || "DRAFT",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      totalAmount: initialData?.totalAmount || 0,
      currency: initialData?.currency || "EUR",
      categories: initialData?.categories || [],
      items: initialData?.items || [],
      notes: initialData?.notes || "",
    },
  });

  const addCategory = () => {
    if (newCategory.name.trim() && newCategory.amount > 0) {
      const category = {
        id: `cat_${Date.now()}`,
        name: newCategory.name.trim(),
        amount: newCategory.amount,
        percentage: newCategory.percentage,
        description: newCategory.description,
      };
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      setValue("categories", updatedCategories);
      setNewCategory({ name: "", amount: 0, percentage: 0, description: "" });
      updateTotalAmount();
    }
  };

  const removeCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(c => c.id !== categoryId);
    setCategories(updatedCategories);
    setValue("categories", updatedCategories);
    // Supprimer les items de cette catégorie
    const updatedItems = items.filter(item => item.categoryId !== categoryId);
    setItems(updatedItems);
    setValue("items", updatedItems);
    updateTotalAmount();
  };

  const updateCategory = (categoryId: string, updates: any) => {
    const updatedCategories = categories.map(c => 
      c.id === categoryId ? { ...c, ...updates } : c
    );
    setCategories(updatedCategories);
    setValue("categories", updatedCategories);
    updateTotalAmount();
  };

  const addItem = () => {
    if (newItem.name.trim() && newItem.categoryId && newItem.unitPrice > 0) {
      const item = {
        id: `item_${Date.now()}`,
        categoryId: newItem.categoryId,
        name: newItem.name.trim(),
        description: newItem.description,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        totalPrice: newItem.quantity * newItem.unitPrice,
        isRecurring: newItem.isRecurring,
        frequency: newItem.frequency,
        startDate: newItem.startDate,
        endDate: newItem.endDate,
      };
      const updatedItems = [...items, item];
      setItems(updatedItems);
      setValue("items", updatedItems);
      setNewItem({
        categoryId: "",
        name: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        isRecurring: false,
        frequency: "ONCE",
        startDate: "",
        endDate: "",
      });
      updateTotalAmount();
    }
  };

  const removeItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    setValue("items", updatedItems);
    updateTotalAmount();
  };

  const updateItem = (itemId: string, updates: any) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    setItems(updatedItems);
    setValue("items", updatedItems);
    updateTotalAmount();
  };

  const updateTotalAmount = () => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setValue("totalAmount", total);
  };

  const handleFormSubmit = (data: BudgetFormData) => {
    onSubmit({ ...data, categories, items });
  };

  const budgetTypes = [
    { value: "PREVIEW", label: "Prévisionnel" },
    { value: "ACTUAL", label: "Réel" },
    { value: "REVISED", label: "Révisé" },
  ];

  const budgetStatuses = [
    { value: "DRAFT", label: "Brouillon" },
    { value: "APPROVED", label: "Approuvé" },
    { value: "REJECTED", label: "Rejeté" },
    { value: "ARCHIVED", label: "Archivé" },
  ];

  const frequencies = [
    { value: "ONCE", label: "Une fois" },
    { value: "DAILY", label: "Quotidien" },
    { value: "WEEKLY", label: "Hebdomadaire" },
    { value: "MONTHLY", label: "Mensuel" },
    { value: "YEARLY", label: "Annuel" },
  ];

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const categoryTotals = categories.map(category => ({
    ...category,
    actualAmount: items
      .filter(item => item.categoryId === category.id)
      .reduce((sum, item) => sum + item.totalPrice, 0),
  }));

  return (
    <Form
      title={title}
      description={description}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <FormSection title="Informations générales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Nom du budget"
            error={errors.name?.message}
            required
          >
            <Input
              {...register("name")}
              placeholder="Nom du budget"
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
                {budgetTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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
                {budgetStatuses.map((status) => (
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
            required
          >
            <Input
              {...register("endDate")}
              type="date"
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
            placeholder="Description du budget..."
          />
        </FormField>
      </FormSection>

      <FormSection title="Catégories">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Nom de la catégorie"
            />
            <Input
              type="number"
              value={newCategory.amount}
              onChange={(e) => setNewCategory({ ...newCategory, amount: parseFloat(e.target.value) || 0 })}
              placeholder="Montant"
            />
            <Input
              type="number"
              value={newCategory.percentage}
              onChange={(e) => setNewCategory({ ...newCategory, percentage: parseFloat(e.target.value) || 0 })}
              placeholder="Pourcentage"
            />
            <Button onClick={addCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {categories.length > 0 && (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-600">{category.description}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(category.amount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {category.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCategory(category.id, { amount: category.amount + 100 })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeCategory(category.id)}
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

      <FormSection title="Items du budget">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Select
              value={newItem.categoryId}
              onValueChange={(value) => setNewItem({ ...newItem, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Nom de l'item"
            />
            <Input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
              placeholder="Quantité"
            />
            <Input
              type="number"
              value={newItem.unitPrice}
              onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
              placeholder="Prix unitaire"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={newItem.isRecurring}
                onCheckedChange={(checked) => setNewItem({ ...newItem, isRecurring: checked as boolean })}
              />
              <Label htmlFor="isRecurring">Récurrent</Label>
            </div>
            <Button onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {newItem.isRecurring && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={newItem.frequency}
                onValueChange={(value) => setNewItem({ ...newItem, frequency: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newItem.startDate}
                onChange={(e) => setNewItem({ ...newItem, startDate: e.target.value })}
                placeholder="Date de début"
              />
              <Input
                type="date"
                value={newItem.endDate}
                onChange={(e) => setNewItem({ ...newItem, endDate: e.target.value })}
                placeholder="Date de fin"
              />
            </div>
          )}

          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-600">{item.description}</div>
                      )}
                      <div className="text-sm text-gray-500">
                        {item.quantity} × {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(item.unitPrice)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(item.totalPrice)}
                      </div>
                      {item.isRecurring && (
                        <div className="text-sm text-gray-600">
                          {frequencies.find(f => f.value === item.frequency)?.label}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeItem(item.id)}
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

      <FormSection title="Résumé">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total du budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(totalAmount)}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {items.length} item{items.length > 1 ? "s" : ""} • {categories.length} catégorie{categories.length > 1 ? "s" : ""}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Répartition par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryTotals.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(category.actualAmount)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {((category.actualAmount / totalAmount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            placeholder="Notes sur ce budget..."
          />
        </FormField>
      </FormSection>

      <FormActions
        onCancel={onCancel}
        onSave={() => {}}
        saveText="Enregistrer le budget"
        loading={loading}
      />
    </Form>
  );
}

