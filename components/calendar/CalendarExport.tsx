"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarExport, Event } from "@/types/planning";
import { 
  Download, 
  Calendar, 
  Globe, 
  Apple, 
  Mail,
  Share,
  Copy,
  Check
} from "lucide-react";

interface CalendarExportProps {
  events: Event[];
  onExport: (exportData: CalendarExport) => void;
  onShare: (exportData: CalendarExport) => void;
}

export function CalendarExport({ events, onExport, onShare }: CalendarExportProps) {
  const [exportFormat, setExportFormat] = useState<"ICAL" | "GOOGLE">("ICAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeAttendees, setIncludeAttendees] = useState(true);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(event => event.id));
    }
  };

  const handleSelectEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const exportData: CalendarExport = {
        format: exportFormat,
        events: events.filter(event => selectedEvents.includes(event.id)),
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      const response = await fetch("/api/planning/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setExportUrl(url);
        
        // Télécharger automatiquement
        const a = document.createElement("a");
        a.href = url;
        a.download = `planning-${new Date().toISOString().split('T')[0]}.${exportFormat === "ICAL" ? "ics" : "csv"}`;
        a.click();
        
        onExport(exportData);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const exportData: CalendarExport = {
        format: exportFormat,
        events: events.filter(event => selectedEvents.includes(event.id)),
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      const response = await fetch("/api/planning/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
      });

      if (response.ok) {
        const { shareUrl } = await response.json();
        setExportUrl(shareUrl);
        onShare(exportData);
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };

  const handleCopyUrl = async () => {
    if (exportUrl) {
      try {
        await navigator.clipboard.writeText(exportUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Erreur lors de la copie:", error);
      }
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "ICAL":
        return <Calendar className="h-4 w-4" />;
      case "GOOGLE":
        return <Globe className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getFormatLabel = (format: string) => {
    const labels = {
      ICAL: "iCal (.ics)",
      GOOGLE: "Google Calendar",
    };
    return labels[format as keyof typeof labels] || format;
  };

  const getFormatDescription = (format: string) => {
    const descriptions = {
      ICAL: "Compatible avec Apple Calendar, Outlook, Thunderbird",
      GOOGLE: "Import direct dans Google Calendar",
    };
    return descriptions[format as keyof typeof descriptions] || "";
  };

  return (
    <div className="space-y-6">
      {/* Export Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Exporter le planning</CardTitle>
          <CardDescription>
            Exportez votre planning vers d'autres applications de calendrier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Format d'export</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 border rounded-lg cursor-pointer ${
                  exportFormat === "ICAL" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
                onClick={() => setExportFormat("ICAL")}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {getFormatIcon("ICAL")}
                  <span className="font-medium">{getFormatLabel("ICAL")}</span>
                </div>
                <p className="text-sm text-gray-600">{getFormatDescription("ICAL")}</p>
              </div>
              
              <div
                className={`p-4 border rounded-lg cursor-pointer ${
                  exportFormat === "GOOGLE" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
                onClick={() => setExportFormat("GOOGLE")}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {getFormatIcon("GOOGLE")}
                  <span className="font-medium">{getFormatLabel("GOOGLE")}</span>
                </div>
                <p className="text-sm text-gray-600">{getFormatDescription("GOOGLE")}</p>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Date de début</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Date de fin</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label>Options d'export</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-details"
                  checked={includeDetails}
                  onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
                />
                <Label htmlFor="include-details">Inclure les détails</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-attendees"
                  checked={includeAttendees}
                  onCheckedChange={(checked) => setIncludeAttendees(checked as boolean)}
                />
                <Label htmlFor="include-attendees">Inclure les participants</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-location"
                  checked={includeLocation}
                  onCheckedChange={(checked) => setIncludeLocation(checked as boolean)}
                />
                <Label htmlFor="include-location">Inclure les lieux</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sélectionner les événements</CardTitle>
              <CardDescription>
                Choisissez les événements à inclure dans l'export
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleSelectAll}>
              {selectedEvents.length === events.length ? "Tout désélectionner" : "Tout sélectionner"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={selectedEvents.includes(event.id)}
                  onCheckedChange={() => handleSelectEvent(event.id)}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(event.startDate).toLocaleDateString("fr-FR")} - {new Date(event.endDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Badge variant="outline">{event.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions d'export</CardTitle>
          <CardDescription>
            Téléchargez ou partagez votre planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button onClick={handleExport} disabled={exporting || selectedEvents.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Export en cours..." : "Télécharger"}
            </Button>
            
            <Button variant="outline" onClick={handleShare} disabled={selectedEvents.length === 0}>
              <Share className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>

          {exportUrl && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Lien de partage généré</h4>
                  <p className="text-sm text-gray-600">Copiez ce lien pour partager votre planning</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copié" : "Copier"}
                </Button>
              </div>
              <div className="mt-2 p-2 bg-white border rounded text-sm font-mono text-gray-600 break-all">
                {exportUrl}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Help */}
      <Card>
        <CardHeader>
          <CardTitle>Intégration avec d'autres applications</CardTitle>
          <CardDescription>
            Guide d'intégration avec les principales applications de calendrier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Apple className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Apple Calendar</span>
              </div>
              <p className="text-sm text-gray-600">
                Ouvrez le fichier .ics dans Apple Calendar pour importer automatiquement les événements.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Outlook className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Microsoft Outlook</span>
              </div>
              <p className="text-sm text-gray-600">
                Importez le fichier .ics via Fichier > Ouvrir et exporter > Importer/Exporter.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-5 w-5 text-red-600" />
                <span className="font-medium">Google Calendar</span>
              </div>
              <p className="text-sm text-gray-600">
                Utilisez le format Google Calendar pour un import direct ou importez le fichier .ics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

