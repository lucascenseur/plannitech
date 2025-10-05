"use client";

import { useState, useEffect } from "react";
import { TechnicalSheetList } from "@/components/technical/TechnicalSheetList";
import { FirePlanEditor } from "@/components/technical/FirePlanEditor";
import { EquipmentInventory } from "@/components/technical/EquipmentInventory";
import { ChecklistManager } from "@/components/technical/ChecklistManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { 
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
  Package,
  CheckSquare,
  Wrench,
  TrendingUp,
  TrendingDown,
  Copy,
  Archive,
  History,
  Star,
  Plus,
  Download,
  Upload,
  Settings as SettingsIcon
} from "lucide-react";
import { 
  TechnicalSheetListView, 
  FirePlanListView, 
  EquipmentListView, 
  ChecklistListView,
  TechnicalConductorListView,
  TemplateListView,
  TechnicalStats,
  EquipmentStats,
  ChecklistStats
} from "@/types/technical";

export default function TechnicalPage() {
  const { canManageProjects } = usePermissions();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("sheets");
  const [technicalSheets, setTechnicalSheets] = useState<TechnicalSheetListView[]>([]);
  const [firePlans, setFirePlans] = useState<FirePlanListView[]>([]);
  const [equipment, setEquipment] = useState<EquipmentListView[]>([]);
  const [checklists, setChecklists] = useState<ChecklistListView[]>([]);
  const [conductors, setConductors] = useState<TechnicalConductorListView[]>([]);
  const [templates, setTemplates] = useState<TemplateListView[]>([]);
  const [stats, setStats] = useState<TechnicalStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Charger toutes les données en parallèle
      const [
        sheetsResponse,
        firePlansResponse,
        equipmentResponse,
        checklistsResponse,
        conductorsResponse,
        templatesResponse,
        statsResponse
      ] = await Promise.all([
        fetch("/api/technical/sheets"),
        fetch("/api/technical/fire-plans"),
        fetch("/api/technical/equipment"),
        fetch("/api/technical/checklists"),
        fetch("/api/technical/conductors"),
        fetch("/api/technical/templates"),
        fetch("/api/technical/stats")
      ]);

      if (sheetsResponse.ok) {
        const data = await sheetsResponse.json();
        setTechnicalSheets(data);
      }

      if (firePlansResponse.ok) {
        const data = await firePlansResponse.json();
        setFirePlans(data);
      }

      if (equipmentResponse.ok) {
        const data = await equipmentResponse.json();
        setEquipment(data);
      }

      if (checklistsResponse.ok) {
        const data = await checklistsResponse.json();
        setChecklists(data);
      }

      if (conductorsResponse.ok) {
        const data = await conductorsResponse.json();
        setConductors(data);
      }

      if (templatesResponse.ok) {
        const data = await templatesResponse.json();
        setTemplates(data);
      }

      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSheetEdit = (id: string) => {
    router.push(`/technical/sheets/${id}/edit`);
  };

  const handleSheetView = (id: string) => {
    router.push(`/technical/sheets/${id}`);
  };

  const handleSheetDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/technical/sheets/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          sheetIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleSheetExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/technical/sheets/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetIds: ids,
          format: "PDF",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `technical-sheets-${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleSheetCreate = () => {
    router.push("/technical/sheets/new");
  };

  const handleSheetDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/technical/sheets/${id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
    }
  };

  const handleSheetArchive = async (ids: string[]) => {
    try {
      const response = await fetch("/api/technical/sheets/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ARCHIVE",
          sheetIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
    }
  };

  const handleSheetVersion = (id: string) => {
    router.push(`/technical/sheets/${id}/versions`);
  };

  const handleFirePlanEdit = (id: string) => {
    router.push(`/technical/fire-plans/${id}/edit`);
  };

  const handleFirePlanView = (id: string) => {
    router.push(`/technical/fire-plans/${id}`);
  };

  const handleFirePlanDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/technical/fire-plans/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          firePlanIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleFirePlanExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/technical/fire-plans/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firePlanIds: ids,
          format: "PDF",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fire-plans-${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleFirePlanCreate = () => {
    router.push("/technical/fire-plans/new");
  };

  const handleFirePlanDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/technical/fire-plans/${id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
    }
  };

  const handleEquipmentEdit = (id: string) => {
    router.push(`/technical/equipment/${id}/edit`);
  };

  const handleEquipmentView = (id: string) => {
    router.push(`/technical/equipment/${id}`);
  };

  const handleEquipmentDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/technical/equipment/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          equipmentIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleEquipmentExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/technical/equipment/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentIds: ids,
          format: "CSV",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `equipment-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleEquipmentCreate = () => {
    router.push("/technical/equipment/new");
  };

  const handleEquipmentDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/technical/equipment/${id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
    }
  };

  const handleEquipmentMaintenance = (id: string) => {
    router.push(`/technical/equipment/${id}/maintenance`);
  };

  const handleEquipmentAvailability = (id: string) => {
    router.push(`/technical/equipment/${id}/availability`);
  };

  const handleChecklistEdit = (id: string) => {
    router.push(`/technical/checklists/${id}/edit`);
  };

  const handleChecklistView = (id: string) => {
    router.push(`/technical/checklists/${id}`);
  };

  const handleChecklistDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/technical/checklists/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          checklistIds: ids,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleChecklistExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/technical/checklists/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklistIds: ids,
          format: "PDF",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `checklists-${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleChecklistCreate = () => {
    router.push("/technical/checklists/new");
  };

  const handleChecklistDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/technical/checklists/${id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
    }
  };

  const handleChecklistStart = async (id: string) => {
    try {
      const response = await fetch(`/api/technical/checklists/${id}/start`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors du démarrage:", error);
    }
  };

  const handleChecklistPause = async (id: string) => {
    try {
      const response = await fetch(`/api/technical/checklists/${id}/pause`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la pause:", error);
    }
  };

  const handleChecklistComplete = async (id: string) => {
    try {
      const response = await fetch(`/api/technical/checklists/${id}/complete`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la finalisation:", error);
    }
  };

  const handleChecklistReset = async (id: string) => {
    try {
      const response = await fetch(`/api/technical/checklists/${id}/reset`, {
        method: "POST",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
    }
  };

  if (!canManageProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Accès non autorisé
              </h1>
              <p className="text-gray-600">
                Vous n'avez pas les permissions nécessaires pour gérer les outils techniques.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      id: "sheets",
      label: "Fiches techniques",
      content: (
        <TechnicalSheetList
          sheets={technicalSheets}
          onEdit={handleSheetEdit}
          onView={handleSheetView}
          onDelete={handleSheetDelete}
          onExport={handleSheetExport}
          onImport={() => {}}
          onCreate={handleSheetCreate}
          onDuplicate={handleSheetDuplicate}
          onArchive={handleSheetArchive}
          onVersion={handleSheetVersion}
          loading={loading}
        />
      ),
    },
    {
      id: "fire-plans",
      label: "Plans de feu",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Plans de feu</h1>
              <p className="text-gray-600">
                Créez et gérez vos plans de feu avec des schémas
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
              <Button onClick={handleFirePlanCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau plan
              </Button>
            </div>
          </div>
          {/* Ici on pourrait ajouter une liste des plans de feu */}
        </div>
      ),
    },
    {
      id: "equipment",
      label: "Inventaire",
      content: (
        <EquipmentInventory
          equipment={equipment}
          onEdit={handleEquipmentEdit}
          onView={handleEquipmentView}
          onDelete={handleEquipmentDelete}
          onExport={handleEquipmentExport}
          onImport={() => {}}
          onCreate={handleEquipmentCreate}
          onDuplicate={handleEquipmentDuplicate}
          onMaintenance={handleEquipmentMaintenance}
          onAvailability={handleEquipmentAvailability}
          loading={loading}
        />
      ),
    },
    {
      id: "checklists",
      label: "Check-lists",
      content: (
        <ChecklistManager
          checklists={checklists}
          onEdit={handleChecklistEdit}
          onView={handleChecklistView}
          onDelete={handleChecklistDelete}
          onExport={handleChecklistExport}
          onImport={() => {}}
          onCreate={handleChecklistCreate}
          onDuplicate={handleChecklistDuplicate}
          onStart={handleChecklistStart}
          onPause={handleChecklistPause}
          onComplete={handleChecklistComplete}
          onReset={handleChecklistReset}
          loading={loading}
        />
      ),
    },
    {
      id: "conductors",
      label: "Conducteurs",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Conducteurs techniques</h1>
              <p className="text-gray-600">
                Gérez vos conducteurs techniques
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau conducteur
              </Button>
            </div>
          </div>
          {/* Ici on pourrait ajouter une liste des conducteurs */}
        </div>
      ),
    },
    {
      id: "templates",
      label: "Templates",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
              <p className="text-gray-600">
                Gérez vos templates réutilisables
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau template
              </Button>
            </div>
          </div>
          {/* Ici on pourrait ajouter une liste des templates */}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outils techniques</h1>
          <p className="text-gray-600">
            Gérez vos fiches techniques, plans de feu, inventaire et check-lists
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="sheets" />
    </div>
  );
}