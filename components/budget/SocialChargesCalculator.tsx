"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { SearchBar } from "@/components/ui/search";
import { FilterPanel, QuickFilters } from "@/components/ui/filter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SocialCharges, IntermittentListView } from "@/types/budget";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download, 
  Upload,
  Calculator,
  Calendar,
  User,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Copy,
  Send,
  Receipt,
  Building,
  Percent
} from "lucide-react";

interface SocialChargesCalculatorProps {
  socialCharges: SocialCharges[];
  intermittents: IntermittentListView[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onExport: (ids: string[]) => void;
  onImport: () => void;
  onCreate: () => void;
  onCalculate: (projectId: string, period: string) => void;
  onDuplicate: (id: string) => void;
  loading?: boolean | undefined;
}

export function SocialChargesCalculator({
  socialCharges,
  intermittents,
  onEdit,
  onView,
  onDelete,
  onExport,
  onImport,
  onCreate,
  onCalculate,
  onDuplicate,
  loading = false,
}: SocialChargesCalculatorProps) {
  const [selectedCharges, setSelectedCharges] = useState<string[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculationData, setCalculationData] = useState({
    projectId: "",
    period: "",
    totalGross: 0,
    totalNet: 0,
    employerCharges: 0,
    employeeCharges: 0,
    totalCharges: 0,
    breakdown: [] as Array<{
      type: string;
      rate: number;
      amount: number;
      description: string;
    }>,
  });

  const calculateCharges = () => {
    if (!calculationData.projectId || !calculationData.period) return;

    // Récupérer les intermittents du projet pour la période
    const projectIntermittents = intermittents.filter(
      intermittent => intermittent.project.id === calculationData.projectId
    );

    const totalGross = projectIntermittents.reduce(
      (sum, intermittent) => sum + intermittent.totalAmount,
      0
    );

    // Calcul des charges sociales (exemple avec des taux fictifs)
    const charges = [
      {
        type: "Cotisations sociales",
        rate: 22.0,
        amount: totalGross * 0.22,
        description: "Cotisations sociales employeur",
      },
      {
        type: "Assurance chômage",
        rate: 4.0,
        amount: totalGross * 0.04,
        description: "Assurance chômage employeur",
      },
      {
        type: "Formation professionnelle",
        rate: 1.0,
        amount: totalGross * 0.01,
        description: "Formation professionnelle employeur",
      },
      {
        type: "FNAL",
        rate: 0.5,
        amount: totalGross * 0.005,
        description: "Fonds national d'aide au logement",
      },
      {
        type: "CET",
        rate: 0.3,
        amount: totalGross * 0.003,
        description: "Contribution exceptionnelle temporaire",
      },
    ];

    const employerCharges = charges.reduce((sum, charge) => sum + charge.amount, 0);
    const employeeCharges = totalGross * 0.15; // 15% de charges salariales
    const totalCharges = employerCharges + employeeCharges;
    const totalNet = totalGross - employeeCharges;

    setCalculationData({
      ...calculationData,
      totalGross,
      totalNet,
      employerCharges,
      employeeCharges,
      totalCharges,
      breakdown: charges,
    });
  };

  const columns = [
    {
      key: "project" as keyof SocialCharges,
      label: "Projet",
      sortable: true,
      render: (value: any, row: SocialCharges) => (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={selectedCharges.includes(row.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedCharges([...selectedCharges, row.id]);
              } else {
                setSelectedCharges(selectedCharges.filter(id => id !== row.id));
              }
            }}
          />
          <div>
            <div className="font-medium">{value.name}</div>
            <div className="text-sm text-gray-500">
              {row.period}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "totalGross" as keyof SocialCharges,
      label: "Total brut",
      sortable: true,
      render: (value: number) => (
        <div className="text-right font-medium">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(value)}
        </div>
      ),
    },
    {
      key: "totalNet" as keyof SocialCharges,
      label: "Total net",
      sortable: true,
      render: (value: number) => (
        <div className="text-right font-medium text-green-600">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(value)}
        </div>
      ),
    },
    {
      key: "employerCharges" as keyof SocialCharges,
      label: "Charges employeur",
      sortable: true,
      render: (value: number) => (
        <div className="text-right font-medium text-red-600">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(value)}
        </div>
      ),
    },
    {
      key: "employeeCharges" as keyof SocialCharges,
      label: "Charges salariales",
      sortable: true,
      render: (value: number) => (
        <div className="text-right font-medium text-orange-600">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(value)}
        </div>
      ),
    },
    {
      key: "totalCharges" as keyof SocialCharges,
      label: "Total charges",
      sortable: true,
      render: (value: number) => (
        <div className="text-right font-medium text-blue-600">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(value)}
        </div>
      ),
    },
    {
      key: "actions" as keyof SocialCharges,
      label: "Actions",
      sortable: false,
      render: (value: any, row: SocialCharges) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => onView(row.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(row.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDuplicate(row.id)}>
            <Copy className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Supprimer le calcul"
            description="Êtes-vous sûr de vouloir supprimer ce calcul de charges ? Cette action est irréversible."
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={() => onDelete([row.id])}
          />
        </div>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    if (selectedCharges.length === 0) return;

    switch (action) {
      case "delete":
        onDelete(selectedCharges);
        break;
      case "export":
        onExport(selectedCharges);
        break;
      case "duplicate":
        selectedCharges.forEach(id => onDuplicate(id));
        break;
    }
    setSelectedCharges([]);
  };

  const totalCharges = socialCharges.reduce((sum, charge) => sum + charge.totalCharges, 0);
  const totalGross = socialCharges.reduce((sum, charge) => sum + charge.totalGross, 0);
  const totalNet = socialCharges.reduce((sum, charge) => sum + charge.totalNet, 0);
  const averageRate = totalGross > 0 ? (totalCharges / totalGross) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Charges sociales</h1>
          <p className="text-gray-600">
            Calculez les charges sociales pour vos intermittents
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" onClick={() => setShowCalculator(true)}>
            <Calculator className="h-4 w-4 mr-2" />
            Calculer
          </Button>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau calcul
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total brut</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(totalGross)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total net</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(totalNet)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total charges</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(totalCharges)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Percent className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Taux moyen</p>
                <p className="text-2xl font-bold">{averageRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">
                  {socialCharges.length} calcul{socialCharges.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Calculateur de charges sociales</h2>
                <Button variant="outline" onClick={() => setShowCalculator(false)}>
                  Fermer
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectId">Projet</Label>
                  <Select
                    value={calculationData.projectId}
                    onValueChange={(value) => setCalculationData({ ...calculationData, projectId: value })}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Période</Label>
                  <Input
                    id="period"
                    value={calculationData.period}
                    onChange={(e) => setCalculationData({ ...calculationData, period: e.target.value })}
                    placeholder="Ex: 2024-01"
                  />
                </div>
              </div>

              <Button onClick={calculateCharges} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculer les charges
              </Button>

              {calculationData.totalGross > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Résumé</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total brut:</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(calculationData.totalGross)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total net:</span>
                          <span className="font-medium text-green-600">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(calculationData.totalNet)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Charges employeur:</span>
                          <span className="font-medium text-red-600">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(calculationData.employerCharges)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Charges salariales:</span>
                          <span className="font-medium text-orange-600">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(calculationData.employeeCharges)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-bold">Total charges:</span>
                          <span className="font-bold text-blue-600">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(calculationData.totalCharges)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Détail des charges</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {calculationData.breakdown.map((charge, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{charge.type}:</span>
                              <span>
                                {charge.rate}% • {new Intl.NumberFormat("fr-FR", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(charge.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCalculator(false)}>
                      Annuler
                    </Button>
                    <Button onClick={() => {
                      onCalculate(calculationData.projectId, calculationData.period);
                      setShowCalculator(false);
                    }}>
                      Enregistrer le calcul
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Charges Table */}
      <DataTable
        data={socialCharges}
        columns={columns}
        searchable={false}
        pagination={true}
        pageSize={10}
      />

      {/* Bulk Actions */}
      {selectedCharges.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedCharges.length} calcul{selectedCharges.length > 1 ? "s" : ""} sélectionné{selectedCharges.length > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCharges([])}
                >
                  Désélectionner tout
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("duplicate")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Dupliquer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("export")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  }
                  title="Supprimer les calculs"
                  description={`Êtes-vous sûr de vouloir supprimer ${selectedCharges.length} calcul${selectedCharges.length > 1 ? "s" : ""} ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  variant="destructive"
                  onConfirm={() => handleBulkAction("delete")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

