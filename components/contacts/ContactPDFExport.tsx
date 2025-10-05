"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Contact, ContactExport } from "@/types/contact";
import { 
  Download, 
  FileText, 
  Settings, 
  Eye, 
  Share,
  Plus,
  X,
  Check,
  Star,
  Phone,
  Mail,
  MapPin,
  Globe,
  Users,
  Award,
  Calendar,
  DollarSign
} from "lucide-react";

interface ContactPDFExportProps {
  contacts: Contact[];
  onExport: (exportData: ContactExport) => void;
  onPreview: (exportData: ContactExport) => void;
  onShare: (exportData: ContactExport) => void;
}

export function ContactPDFExport({
  contacts,
  onExport,
  onPreview,
  onShare,
}: ContactPDFExportProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [template, setTemplate] = useState<"standard" | "detailed" | "minimal">("standard");
  const [includeSections, setIncludeSections] = useState({
    personalInfo: true,
    contactInfo: true,
    professionalInfo: true,
    skills: true,
    rates: true,
    availability: true,
    collaborations: true,
    documents: false,
    notes: true,
  });
  const [customHeader, setCustomHeader] = useState("");
  const [customFooter, setCustomFooter] = useState("");
  const [pageSize, setPageSize] = useState<"A4" | "A3" | "Letter">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [exporting, setExporting] = useState(false);

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  const handleSelectContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const exportData: ContactExport = {
        format: "PDF",
        contacts: contacts.filter(contact => selectedContacts.includes(contact.id)),
        fields: Object.keys(includeSections).filter(key => includeSections[key as keyof typeof includeSections]),
        includeSkills: includeSections.skills,
        includeRates: includeSections.rates,
        includeAvailability: includeSections.availability,
        includeCollaborations: includeSections.collaborations,
      };
      await onExport(exportData);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    } finally {
      setExporting(false);
    }
  };

  const handlePreview = async () => {
    try {
      const exportData: ContactExport = {
        format: "PDF",
        contacts: contacts.filter(contact => selectedContacts.includes(contact.id)),
        fields: Object.keys(includeSections).filter(key => includeSections[key as keyof typeof includeSections]),
        includeSkills: includeSections.skills,
        includeRates: includeSections.rates,
        includeAvailability: includeSections.availability,
        includeCollaborations: includeSections.collaborations,
      };
      await onPreview(exportData);
    } catch (error) {
      console.error("Erreur lors de l'aperçu:", error);
    }
  };

  const handleShare = async () => {
    try {
      const exportData: ContactExport = {
        format: "PDF",
        contacts: contacts.filter(contact => selectedContacts.includes(contact.id)),
        fields: Object.keys(includeSections).filter(key => includeSections[key as keyof typeof includeSections]),
        includeSkills: includeSections.skills,
        includeRates: includeSections.rates,
        includeAvailability: includeSections.availability,
        includeCollaborations: includeSections.collaborations,
      };
      await onShare(exportData);
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      ARTIST: "Artiste",
      TECHNICIAN: "Technicien",
      VENUE: "Lieu",
      SUPPLIER: "Prestataire",
      OTHER: "Autre",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      ARTIST: "bg-purple-100 text-purple-800",
      TECHNICIAN: "bg-blue-100 text-blue-800",
      VENUE: "bg-green-100 text-green-800",
      SUPPLIER: "bg-orange-100 text-orange-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[type as keyof typeof colors] || colors.OTHER;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-yellow-100 text-yellow-800",
      BLOCKED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.ACTIVE;
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Export PDF</h1>
          <p className="text-gray-600">
            Générez des fiches techniques PDF pour vos contacts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePreview} disabled={selectedContacts.length === 0}>
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          <Button variant="outline" onClick={handleShare} disabled={selectedContacts.length === 0}>
            <Share className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button onClick={handleExport} disabled={exporting || selectedContacts.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Export en cours..." : "Exporter PDF"}
          </Button>
        </div>
      </div>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Modèle de document</CardTitle>
          <CardDescription>
            Choisissez le modèle pour vos fiches techniques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer ${
                template === "standard" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setTemplate("standard")}
            >
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Standard</span>
              </div>
              <p className="text-sm text-gray-600">
                Fiche complète avec toutes les informations principales
              </p>
            </div>
            
            <div
              className={`p-4 border rounded-lg cursor-pointer ${
                template === "detailed" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setTemplate("detailed")}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="h-5 w-5 text-green-600" />
                <span className="font-medium">Détaillé</span>
              </div>
              <p className="text-sm text-gray-600">
                Fiche exhaustive avec tous les détails et l'historique
              </p>
            </div>
            
            <div
              className={`p-4 border rounded-lg cursor-pointer ${
                template === "minimal" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setTemplate("minimal")}
            >
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Minimal</span>
              </div>
              <p className="text-sm text-gray-600">
                Fiche concise avec les informations essentielles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sélectionner les contacts</CardTitle>
              <CardDescription>
                {selectedContacts.length} contact{selectedContacts.length > 1 ? "s" : ""} sélectionné{selectedContacts.length > 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleSelectAll}>
              {selectedContacts.length === contacts.length ? "Tout désélectionner" : "Tout sélectionner"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={selectedContacts.includes(contact.id)}
                  onCheckedChange={() => handleSelectContact(contact.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{contact.firstName} {contact.lastName}</h4>
                    <Badge className={getTypeColor(contact.type)}>
                      {getTypeLabel(contact.type)}
                    </Badge>
                    <Badge className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {contact.email && <span>{contact.email}</span>}
                    {contact.phone && <span className="ml-2">{contact.phone}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sections to Include */}
      <Card>
        <CardHeader>
          <CardTitle>Sections à inclure</CardTitle>
          <CardDescription>
            Choisissez les sections à inclure dans le PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personalInfo"
                  checked={includeSections.personalInfo}
                  onCheckedChange={(checked) => setIncludeSections({ ...includeSections, personalInfo: checked as boolean })}
                />
                <Label htmlFor="personalInfo">Informations personnelles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contactInfo"
                  checked={includeSections.contactInfo}
                  onCheckedChange={(checked) => setIncludeSections({ ...includeSections, contactInfo: checked as boolean })}
                />
                <Label htmlFor="contactInfo">Informations de contact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="professionalInfo"
                  checked={includeSections.professionalInfo}
                  onCheckedChange={(checked) => setIncludeSections({ ...includeSections, professionalInfo: checked as boolean })}
                />
                <Label htmlFor="professionalInfo">Informations professionnelles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skills"
                  checked={includeSections.skills}
                  onCheckedChange={(checked) => setIncludeSections({ ...includeSections, skills: checked as boolean })}
                />
                <Label htmlFor="skills">Compétences</Label>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rates"
                  checked={includeSections.rates}
                  onCheckedChange={(checked) => setIncludeSections({ ...includeSections, rates: checked as boolean })}
                />
                <Label htmlFor="rates">Tarifs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="availability"
                  checked={includeSections.availability}
                  onCheckedChange={(checked) => setIncludeSections({ ...includeSections, availability: checked as boolean })}
                />
                <Label htmlFor="availability">Disponibilités</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="collaborations"
                  checked={includeSections.collaborations}
                  onCheckedChange={(checked) => setIncludeSections({ ...includeSections, collaborations: checked as boolean })}
                />
                <Label htmlFor="collaborations">Collaborations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notes"
                  checked={includeSections.notes}
                  onCheckedChange={(checked) => setIncludeSections({ ...includeSections, notes: checked as boolean })}
                />
                <Label htmlFor="notes">Notes</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du document</CardTitle>
          <CardDescription>
            Personnalisez l'apparence de vos fiches techniques
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pageSize">Taille de page</Label>
              <Select value={pageSize} onValueChange={(value) => setPageSize(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="A3">A3</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orientation">Orientation</Label>
              <Select value={orientation} onValueChange={(value) => setOrientation(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Paysage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customHeader">En-tête personnalisé (optionnel)</Label>
            <Textarea
              id="customHeader"
              value={customHeader}
              onChange={(e) => setCustomHeader(e.target.value)}
              placeholder="Texte à inclure en en-tête de chaque page"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customFooter">Pied de page personnalisé (optionnel)</Label>
            <Textarea
              id="customFooter"
              value={customFooter}
              onChange={(e) => setCustomFooter(e.target.value)}
              placeholder="Texte à inclure en pied de page de chaque page"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {selectedContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu du document</CardTitle>
            <CardDescription>
              Aperçu de la fiche technique qui sera générée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="space-y-4">
                {selectedContacts.slice(0, 2).map((contactId) => {
                  const contact = contacts.find(c => c.id === contactId);
                  if (!contact) return null;

                  return (
                    <div key={contact.id} className="bg-white p-4 rounded border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {getInitials(`${contact.firstName} ${contact.lastName}`)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">{contact.firstName} {contact.lastName}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getTypeColor(contact.type)}>
                                {getTypeLabel(contact.type)}
                              </Badge>
                              <Badge className={getStatusColor(contact.status)}>
                                {contact.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {contact.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                            <span className="text-sm font-medium">{contact.rating}/5</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {includeSections.contactInfo && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700">Contact</h4>
                            {contact.email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>{contact.email}</span>
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                            {contact.website && (
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-gray-400" />
                                <span>{contact.website}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {includeSections.skills && contact.skills && contact.skills.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700">Compétences</h4>
                            <div className="flex flex-wrap gap-1">
                              {contact.skills.slice(0, 5).map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {contact.skills.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{contact.skills.length - 5}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {selectedContacts.length > 2 && (
                  <div className="text-center py-4 text-gray-500">
                    ... et {selectedContacts.length - 2} autre{selectedContacts.length - 2 > 1 ? "s" : ""} contact{selectedContacts.length - 2 > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
