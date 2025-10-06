"use client";

import React, { useState, useEffect } from "react";
import { TechnicalSheetList } from "@/components/technical/TechnicalSheetList";
import { EquipmentInventory } from "@/components/technical/EquipmentInventory";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface TechnicalPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function TechnicalPage({ params }: TechnicalPageProps) {
  const [locale, setLocale] = useState('fr');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les données techniques
  useEffect(() => {
    const fetchTechnicalData = async () => {
      try {
        // Simuler le chargement de données
        setSheets([]);
        setEquipment([]);
      } catch (error) {
        console.error('Erreur lors du chargement des données techniques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicalData();
  }, []);

  const handleCreate = () => {
    setShowCreateDialog(true);
  };

  const handleEdit = (id: string) => {
    console.log("Éditer l'élément technique:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Supprimer l'élément technique:", id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Technical' : locale === 'es' ? 'Técnico' : 'Technique'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Manage technical sheets and equipment' 
              : locale === 'es' 
              ? 'Gestiona fichas técnicas y equipos'
              : 'Gérez les fiches techniques et équipements'
            }
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Create Sheet' : locale === 'es' ? 'Crear Ficha' : 'Créer une fiche'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {locale === 'en' ? 'Create Technical Sheet' : locale === 'es' ? 'Crear Ficha Técnica' : 'Créer une fiche technique'}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Formulaire de création de fiche technique à implémenter</p>
              <Button onClick={() => setShowCreateDialog(false)} className="mt-4">
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <TechnicalSheetList 
        sheets={sheets || []}
        onEdit={handleEdit}
        onView={(id) => console.log("Voir la fiche:", id)}
        onDelete={handleDelete}
        onExport={(ids) => console.log("Exporter les fiches:", ids)}
        onImport={() => console.log("Importer des fiches")}
        onCreate={handleCreate}
        onDuplicate={(id) => console.log("Dupliquer la fiche:", id)}
        onArchive={(ids) => console.log("Archiver les fiches:", ids)}
        onVersion={(id) => console.log("Versions de la fiche:", id)}
        loading={loading}
      />
      <EquipmentInventory 
        equipment={equipment || []}
        onEdit={handleEdit}
        onView={(id) => console.log("Voir l'équipement:", id)}
        onDelete={handleDelete}
        onExport={(ids) => console.log("Exporter l'équipement:", ids)}
        onImport={() => console.log("Importer de l'équipement")}
        onCreate={handleCreate}
        onDuplicate={(id) => console.log("Dupliquer l'équipement:", id)}
        onArchive={(ids) => console.log("Archiver l'équipement:", ids)}
        onMaintenance={(id) => console.log("Maintenance de l'équipement:", id)}
        onLocation={(id) => console.log("Localisation de l'équipement:", id)}
        onHistory={(id) => console.log("Historique de l'équipement:", id)}
        loading={loading}
      />
    </div>
  );
}
