"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { 
  Archive, 
  Trash2, 
  Download, 
  Edit, 
  X,
  MoreHorizontal
} from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onExport: () => void;
  onUpdateStatus: (status: string) => void;
  onUpdateType: (type: string) => void;
}

export function BulkActions({
  selectedCount,
  onClearSelection,
  onDelete,
  onArchive,
  onExport,
  onUpdateStatus,
  onUpdateType,
}: BulkActionsProps) {
  const [showMoreActions, setShowMoreActions] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedCount} projet{selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4 mr-1" />
            Désélectionner tout
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Actions principales */}
          <Button
            variant="outline"
            size="sm"
            onClick={onArchive}
            className="text-orange-600 hover:text-orange-800"
          >
            <Archive className="h-4 w-4 mr-1" />
            Archiver
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="text-green-600 hover:text-green-800"
          >
            <Download className="h-4 w-4 mr-1" />
            Exporter
          </Button>

          <ConfirmDialog
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            }
            title="Supprimer les projets"
            description={`Êtes-vous sûr de vouloir supprimer ${selectedCount} projet${selectedCount > 1 ? "s" : ""} ? Cette action est irréversible.`}
            confirmText="Supprimer"
            variant="destructive"
            onConfirm={onDelete}
          />

          {/* Actions avancées */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMoreActions(!showMoreActions)}
            >
              <MoreHorizontal className="h-4 w-4 mr-1" />
              Plus d'actions
            </Button>

            {showMoreActions && (
              <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-48 z-10">
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Changer le statut
                    </label>
                    <Select onValueChange={onUpdateStatus}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="DEVELOPMENT">Développement</SelectItem>
                        <SelectItem value="PRODUCTION">Production</SelectItem>
                        <SelectItem value="TOUR">Tournée</SelectItem>
                        <SelectItem value="ARCHIVED">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Changer le type
                    </label>
                    <Select onValueChange={onUpdateType}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONCERT">Concert</SelectItem>
                        <SelectItem value="THEATRE">Théâtre</SelectItem>
                        <SelectItem value="DANSE">Danse</SelectItem>
                        <SelectItem value="CIRQUE">Cirque</SelectItem>
                        <SelectItem value="AUTRE">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

