"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs } from "@/components/ui/tabs";
import { ContactCSVRow, ContactImportResult, ContactExport } from "@/types/contact";
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Plus,
  Trash2,
  Eye,
  Edit,
  Save,
  Share
} from "lucide-react";

interface ContactImportExportProps {
  onImport: (data: ContactCSVRow[]) => Promise<ContactImportResult>;
  onExport: (exportData: ContactExport) => void;
  onShare: (exportData: ContactExport) => void;
  contactIds: string[];
}

export function ContactImportExport({
  onImport,
  onExport,
  onShare,
  contactIds,
}: ContactImportExportProps) {
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ContactCSVRow[]>([]);
  const [importResult, setImportResult] = useState<ContactImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"CSV" | "VCARD" | "PDF">("CSV");
  const [exportFields, setExportFields] = useState<string[]>([
    "name", "email", "phone", "type", "description"
  ]);
  const [exportOptions, setExportOptions] = useState({
    includeSkills: true,
    includeRates: true,
    includeAvailability: true,
    includeCollaborations: true,
  });
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableFields = [
    { value: "name", label: "Nom" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Téléphone" },
    { value: "type", label: "Type" },
    { value: "description", label: "Description" },
    { value: "website", label: "Site web" },
    { value: "street", label: "Rue" },
    { value: "city", label: "Ville" },
    { value: "postalCode", label: "Code postal" },
    { value: "country", label: "Pays" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "isIntermittent", label: "Intermittent" },
    { value: "intermittentNumber", label: "Numéro intermittent" },
    { value: "siret", label: "SIRET" },
    { value: "apeCode", label: "Code APE" },
    { value: "vatNumber", label: "Numéro TVA" },
    { value: "skills", label: "Compétences" },
    { value: "tags", label: "Tags" },
    { value: "groups", label: "Groupes" },
    { value: "notes", label: "Notes" },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      parseCSVFile(file);
    }
  };

  const parseCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
      
      const data: ContactCSVRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
          const row: ContactCSVRow = {
            name: values[0] || "",
            email: values[1] || "",
            phone: values[2] || "",
            type: values[3] || "OTHER",
            description: values[4] || "",
            website: values[5] || "",
            street: values[6] || "",
            city: values[7] || "",
            postalCode: values[8] || "",
            country: values[9] || "",
            facebook: values[10] || "",
            twitter: values[11] || "",
            instagram: values[12] || "",
            linkedin: values[13] || "",
            isIntermittent: values[14] || "false",
            intermittentNumber: values[15] || "",
            siret: values[16] || "",
            apeCode: values[17] || "",
            vatNumber: values[18] || "",
            skills: values[19] || "",
            tags: values[20] || "",
            groups: values[21] || "",
            notes: values[22] || "",
          };
          data.push(row);
        }
      }
      setImportData(data);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (importData.length === 0) return;

    try {
      setImporting(true);
      const result = await onImport(importData);
      setImportResult(result);
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const exportData: ContactExport = {
        format: exportFormat,
        contacts: [], // À remplir avec les contacts sélectionnés
        fields: exportFields,
        includeSkills: exportOptions.includeSkills,
        includeRates: exportOptions.includeRates,
        includeAvailability: exportOptions.includeAvailability,
        includeCollaborations: exportOptions.includeCollaborations,
      };
      await onExport(exportData);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const exportData: ContactExport = {
        format: exportFormat,
        contacts: [], // À remplir avec les contacts sélectionnés
        fields: exportFields,
        includeSkills: exportOptions.includeSkills,
        includeRates: exportOptions.includeRates,
        includeAvailability: exportOptions.includeAvailability,
        includeCollaborations: exportOptions.includeCollaborations,
      };
      await onShare(exportData);
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };

  const toggleField = (field: string) => {
    if (exportFields.includes(field)) {
      setExportFields(exportFields.filter(f => f !== field));
    } else {
      setExportFields([...exportFields, field]);
    }
  };

  const tabs = [
    {
      id: "import",
      label: "Importer",
      content: (
        <div className="space-y-6">
          {/* File Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Importer des contacts</CardTitle>
              <CardDescription>
                Importez vos contacts depuis un fichier CSV ou vCard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Sélectionner un fichier
                </Button>
                {importFile && (
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{importFile.name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setImportFile(null);
                        setImportData([]);
                        setImportResult(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.vcf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {importData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {importData.length} contact{importData.length > 1 ? "s" : ""} détecté{importData.length > 1 ? "s" : ""}
                    </h4>
                    <Button onClick={handleImport} disabled={importing}>
                      {importing ? "Import en cours..." : "Importer"}
                    </Button>
                  </div>

                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">Nom</th>
                          <th className="px-3 py-2 text-left">Email</th>
                          <th className="px-3 py-2 text-left">Type</th>
                          <th className="px-3 py-2 text-left">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importData.slice(0, 10).map((row, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-3 py-2">{row.name}</td>
                            <td className="px-3 py-2">{row.email}</td>
                            <td className="px-3 py-2">{row.type}</td>
                            <td className="px-3 py-2">
                              <Badge variant="outline">Prêt</Badge>
                            </td>
                          </tr>
                        ))}
                        {importData.length > 10 && (
                          <tr className="border-t">
                            <td colSpan={4} className="px-3 py-2 text-center text-gray-500">
                              ... et {importData.length - 10} autres
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {importResult && (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Import terminé : {importResult.success} contact{importResult.success > 1 ? "s" : ""} importé{importResult.success > 1 ? "s" : ""}
                    </AlertDescription>
                  </Alert>

                  {importResult.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {importResult.errors.length} erreur{importResult.errors.length > 1 ? "s" : ""} détectée{importResult.errors.length > 1 ? "s" : ""}
                      </AlertDescription>
                    </Alert>
                  )}

                  {importResult.warnings.length > 0 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {importResult.warnings.length} avertissement{importResult.warnings.length > 1 ? "s" : ""}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "export",
      label: "Exporter",
      content: (
        <div className="space-y-6">
          {/* Export Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Exporter des contacts</CardTitle>
              <CardDescription>
                Exportez vos contacts vers différents formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Format d'export</Label>
                  <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSV">CSV</SelectItem>
                      <SelectItem value="VCARD">vCard</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Contacts sélectionnés</Label>
                  <div className="text-sm text-gray-600">
                    {contactIds.length} contact{contactIds.length > 1 ? "s" : ""} sélectionné{contactIds.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Champs à inclure</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableFields.map((field) => (
                    <div key={field.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={field.value}
                        checked={exportFields.includes(field.value)}
                        onCheckedChange={() => toggleField(field.value)}
                      />
                      <Label htmlFor={field.value} className="text-sm">
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Options d'export</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSkills"
                      checked={exportOptions.includeSkills}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeSkills: checked as boolean })}
                    />
                    <Label htmlFor="includeSkills">Inclure les compétences</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeRates"
                      checked={exportOptions.includeRates}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeRates: checked as boolean })}
                    />
                    <Label htmlFor="includeRates">Inclure les tarifs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeAvailability"
                      checked={exportOptions.includeAvailability}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeAvailability: checked as boolean })}
                    />
                    <Label htmlFor="includeAvailability">Inclure les disponibilités</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeCollaborations"
                      checked={exportOptions.includeCollaborations}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeCollaborations: checked as boolean })}
                    />
                    <Label htmlFor="includeCollaborations">Inclure les collaborations</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button onClick={handleExport} disabled={exporting || contactIds.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? "Export en cours..." : "Télécharger"}
                </Button>
                <Button variant="outline" onClick={handleShare} disabled={contactIds.length === 0}>
                  <Share className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import/Export</h1>
          <p className="text-gray-600">
            Importez et exportez vos contacts depuis et vers différents formats
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="import" />
    </div>
  );
}
