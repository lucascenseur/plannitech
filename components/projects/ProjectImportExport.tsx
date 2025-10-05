"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ProjectCSVRow, ImportResult } from "@/types/project";
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Eye,
  EyeOff
} from "lucide-react";

interface ProjectImportExportProps {
  onImport: (data: ProjectCSVRow[]) => Promise<ImportResult>;
  onExport: (projectIds: string[]) => Promise<void>;
  projectIds?: string[];
}

export function ProjectImportExport({
  onImport,
  onExport,
  projectIds = [],
}: ProjectImportExportProps) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ProjectCSVRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setImportFile(file);
      parseCSVFile(file);
    } else {
      alert("Veuillez sélectionner un fichier CSV valide");
    }
  };

  const parseCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",").map(h => h.trim());
      
      const data: ProjectCSVRow[] = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = line.split(",").map(v => v.trim());
          return {
            name: values[0] || "",
            description: values[1] || "",
            type: values[2] || "CONCERT",
            status: values[3] || "DRAFT",
            startDate: values[4] || "",
            endDate: values[5] || "",
            venue: values[6] || "",
            budget: values[7] || "",
            teamSize: values[8] || "",
            isPublic: values[9] || "false",
            tags: values[10] || "",
          };
        });
      
      setImportData(data);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (importData.length === 0) return;
    
    setIsImporting(true);
    try {
      const result = await onImport(importData);
      setImportResult(result);
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(projectIds);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const resetImport = () => {
    setImportFile(null);
    setImportData([]);
    setImportResult(null);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const template = "name,description,type,status,startDate,endDate,venue,budget,teamSize,isPublic,tags\n" +
      "Concert Jazz,Concert de jazz moderne,CONCERT,DEVELOPMENT,2024-06-15,2024-06-15,Théâtre Municipal,5000,5,false,Jazz,Musique\n" +
      "Spectacle Danse,Performance de danse contemporaine,DANSE,PRODUCTION,2024-06-22,2024-06-22,Salle des Fêtes,3000,3,true,Danse,Contemporain";
    
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-projets.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle>Importer des projets</CardTitle>
          <CardDescription>
            Importez vos projets depuis un fichier CSV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!importFile ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="csv-file">Fichier CSV</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le modèle
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{importFile.name}</span>
                  <Badge variant="secondary">{importData.length} projets</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={resetImport}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {importData.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showPreview ? "Masquer" : "Aperçu"}
                    </Button>
                  </div>

                  {showPreview && (
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="text-sm text-gray-600 mb-2">
                        Aperçu des données (5 premiers projets):
                      </div>
                      <div className="space-y-2">
                        {importData.slice(0, 5).map((row, index) => (
                          <div key={index} className="text-sm">
                            <strong>{row.name}</strong> - {row.type} - {row.status}
                          </div>
                        ))}
                        {importData.length > 5 && (
                          <div className="text-sm text-gray-500">
                            ... et {importData.length - 5} autres projets
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button onClick={handleImport} disabled={isImporting}>
                {isImporting ? "Import en cours..." : "Importer les projets"}
              </Button>
            </div>
          )}

          {importResult && (
            <div className="space-y-2">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Import terminé: {importResult.success} projets importés avec succès
                </AlertDescription>
              </Alert>

              {importResult.errors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {importResult.errors.length} erreurs détectées
                  </AlertDescription>
                </Alert>
              )}

              {importResult.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {importResult.warnings.length} avertissements
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Exporter des projets</CardTitle>
          <CardDescription>
            Exportez vos projets vers un fichier CSV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? "Export en cours..." : "Exporter les projets"}
            </Button>
            {projectIds.length > 0 && (
              <span className="text-sm text-gray-600">
                {projectIds.length} projet{projectIds.length > 1 ? "s" : ""} sélectionné{projectIds.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

