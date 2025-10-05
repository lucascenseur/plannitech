"use client";

import { useState, useEffect } from "react";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactForm } from "@/components/contacts/ContactForm";
import { ContactProfile } from "@/components/contacts/ContactProfile";
import { ContactGroups } from "@/components/contacts/ContactGroups";
import { ContactImportExport } from "@/components/contacts/ContactImportExport";
import { ContactFavorites } from "@/components/contacts/ContactFavorites";
import { ContactPDFExport } from "@/components/contacts/ContactPDFExport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Star, 
  Download, 
  Upload, 
  Plus,
  Settings,
  Heart,
  FileText,
  Tag,
  User
} from "lucide-react";
import { Contact, ContactListView, ContactFormData, ContactImportResult, ContactExport } from "@/types/contact";

export default function ContactsPage() {
  const { canManageProjects } = usePermissions();
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactListView[]>([]);
  const [favorites, setFavorites] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showContactProfile, setShowContactProfile] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);

  // Charger les contacts
  useEffect(() => {
    loadContacts();
    loadFavorites();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      // En mode test, on utilise des données simulées
      const mockContacts: ContactListView[] = [
        {
          id: "1",
          name: "Marie Dubois",
          email: "marie.dubois@email.com",
          phone: "+33123456789",
          type: "ARTIST",
          status: "ACTIVE",
          isIntermittent: true,
          isFavorite: false,
          skills: ["danse", "chorégraphie", "direction artistique"],
          tags: ["danse", "contemporain", "professionnel"],
          groups: [{
            id: "1",
            name: "Artistes",
            description: "Groupe des artistes",
            color: "#3B82F6",
            contactCount: 1,
            createdAt: new Date("2024-01-01"),
            createdBy: {
              id: "1",
              name: "Admin"
            }
          }],
          lastCollaboration: new Date("2024-01-15"),
          rating: 4.8,
          createdAt: new Date("2024-01-01")
        },
        {
          id: "2",
          name: "Jean Martin",
          email: "jean.martin@tech.com",
          phone: "+33987654321",
          type: "TECHNICIAN",
          status: "ACTIVE",
          isIntermittent: false,
          isFavorite: true,
          skills: ["son", "éclairage", "vidéo"],
          tags: ["technique", "son", "événementiel"],
          groups: [{
            id: "2",
            name: "Techniciens",
            description: "Groupe des techniciens",
            color: "#10B981",
            contactCount: 1,
            createdAt: new Date("2024-01-01"),
            createdBy: {
              id: "1",
              name: "Admin"
            }
          }],
          lastCollaboration: new Date("2024-02-10"),
          rating: 4.5,
          createdAt: new Date("2024-01-15")
        },
        {
          id: "3",
          name: "Sophie Leroy",
          email: "sophie.leroy@venue.com",
          phone: "+33555666777",
          type: "VENUE",
          status: "ACTIVE",
          isIntermittent: false,
          isFavorite: false,
          skills: ["gestion", "administration", "programmation"],
          tags: ["lieu", "théâtre", "culture"],
          groups: [{
            id: "3",
            name: "Lieux",
            description: "Groupe des lieux",
            color: "#F59E0B",
            contactCount: 1,
            createdAt: new Date("2024-01-01"),
            createdBy: {
              id: "1",
              name: "Admin"
            }
          }],
          lastCollaboration: new Date("2024-01-20"),
          rating: 4.2,
          createdAt: new Date("2024-01-10")
        }
      ];
      
      setContacts(mockContacts);
    } catch (error) {
      console.error("Erreur lors du chargement des contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      // En mode test, on utilise des données simulées
      const mockFavorites: Contact[] = [
        {
          id: "1",
          name: "Marie Dubois",
          email: "marie.dubois@email.com",
          phone: "+33123456789",
          type: "ARTIST",
          status: "ACTIVE",
          isIntermittent: true,
          isFavorite: true,
          skills: ["danse", "chorégraphie", "direction artistique"],
          tags: ["danse", "contemporain", "professionnel"],
          groups: [{
            id: "1",
            name: "Artistes",
            description: "Groupe des artistes",
            color: "#3B82F6",
            contactCount: 1,
            createdAt: new Date("2024-01-01"),
            createdBy: {
              id: "1",
              name: "Admin"
            }
          }],
          lastCollaboration: new Date("2024-01-15"),
          rating: 4.8,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          organizationId: "1",
          createdById: "1",
          description: "Artiste expérimentée avec 10 ans d'expérience",
          website: "https://mariedubois.com",
          address: {
            street: "123 Rue de la Danse",
            city: "Paris",
            postalCode: "75001",
            country: "France"
          },
          socialMedia: {
            facebook: "marie.dubois.danse",
            instagram: "marie_dubois_art"
          },
          intermittentNumber: "123456789",
          siret: "12345678901234",
          apeCode: "9001Z",
          vatNumber: "FR12345678901",
          metadata: {}
        }
      ];
      
      setFavorites(mockFavorites);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
    }
  };

  const handleContactEdit = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      setSelectedContact(contact as Contact);
      setShowContactForm(true);
    }
  };

  const handleContactView = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      setSelectedContact(contact as Contact);
      setShowContactProfile(true);
    }
  };

  const handleContactDelete = async (ids: string[]) => {
    try {
      const response = await fetch("/api/contacts/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          contactIds: ids,
        }),
      });

      if (response.ok) {
        await loadContacts();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}/favorite`, {
        method: "PUT",
      });

      if (response.ok) {
        await loadContacts();
        await loadFavorites();
      }
    } catch (error) {
      console.error("Erreur lors du changement de favori:", error);
    }
  };

  const handleContactExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/contacts/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactIds: ids,
          format: "CSV",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleContactImport = async (data: any[]): Promise<ContactImportResult> => {
    try {
      const response = await fetch("/api/contacts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        const result = await response.json();
        await loadContacts();
        return result;
      } else {
        throw new Error("Erreur lors de l'import");
      }
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      throw error;
    }
  };

  const handleContactSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await loadContacts();
        setShowContactForm(false);
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Erreur lors de la création du contact:", error);
    }
  };

  const handleContactUpdate = async (data: ContactFormData) => {
    if (!selectedContact) return;

    try {
      const response = await fetch(`/api/contacts/${selectedContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await loadContacts();
        setShowContactForm(false);
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contact:", error);
    }
  };

  const handleContactCreate = () => {
    setSelectedContact(null);
    setShowContactForm(true);
  };

  const handleContactImportClick = () => {
    setShowImportExport(true);
  };

  const handlePDFExport = async (exportData: ContactExport) => {
    try {
      const response = await fetch("/api/contacts/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `contacts-${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
    }
  };

  const handlePDFPreview = async (exportData: ContactExport) => {
    try {
      const response = await fetch("/api/contacts/export/pdf/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Erreur lors de l'aperçu PDF:", error);
    }
  };

  const handlePDFShare = async (exportData: ContactExport) => {
    try {
      const response = await fetch("/api/contacts/export/pdf/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
      });

      if (response.ok) {
        const { shareUrl } = await response.json();
        navigator.clipboard.writeText(shareUrl);
      }
    } catch (error) {
      console.error("Erreur lors du partage PDF:", error);
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
                Vous n'avez pas les permissions nécessaires pour gérer les contacts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      id: "list",
      label: "Liste",
      content: (
        <ContactList
          contacts={contacts}
          onEdit={handleContactEdit}
          onView={handleContactView}
          onDelete={handleContactDelete}
          onToggleFavorite={handleToggleFavorite}
          onExport={handleContactExport}
          onImport={handleContactImportClick}
          onCreate={handleContactCreate}
          loading={loading}
        />
      ),
    },
    {
      id: "favorites",
      label: "Favoris",
      content: (
        <ContactFavorites
          favorites={favorites}
          onRemoveFavorite={handleToggleFavorite}
          onView={handleContactView}
          onEdit={handleContactEdit}
          onToggleFavorite={handleToggleFavorite}
          loading={loading}
        />
      ),
    },
    {
      id: "groups",
      label: "Groupes & Tags",
      content: (
        <ContactGroups
          groups={[]}
          tags={[]}
          onGroupCreate={() => {}}
          onGroupUpdate={() => {}}
          onGroupDelete={() => {}}
          onTagCreate={() => {}}
          onTagUpdate={() => {}}
          onTagDelete={() => {}}
          onGroupAssign={() => {}}
          onGroupUnassign={() => {}}
          onTagAssign={() => {}}
          onTagUnassign={() => {}}
        />
      ),
    },
    {
      id: "import-export",
      label: "Import/Export",
      content: (
        <ContactImportExport
          onImport={handleContactImport}
          onExport={handleContactExport}
          onShare={() => {}}
          contactIds={contacts.map(c => c.id)}
        />
      ),
    },
    {
      id: "pdf-export",
      label: "Export PDF",
      content: (
        <ContactPDFExport
          contacts={contacts as Contact[]}
          onExport={handlePDFExport}
          onPreview={handlePDFPreview}
          onShare={handlePDFShare}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">
            Gérez vos contacts : artistes, techniciens, lieux, prestataires
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowFavorites(true)}>
            <Star className="h-4 w-4 mr-2" />
            Favoris
          </Button>
          <Button variant="outline" onClick={() => setShowImportExport(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import/Export
          </Button>
          <Button variant="outline" onClick={() => setShowPDFExport(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleContactCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contact
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="list" />

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ContactForm
              initialData={selectedContact ? {
                name: selectedContact.name,
                email: selectedContact.email || "",
                phone: selectedContact.phone || "",
                type: selectedContact.type,
                status: selectedContact.status,
                description: selectedContact.description || "",
                website: selectedContact.website || "",
                address: selectedContact.address || {
                  street: "",
                  city: "",
                  postalCode: "",
                  country: "",
                },
                socialMedia: selectedContact.socialMedia || {
                  facebook: "",
                  twitter: "",
                  instagram: "",
                  linkedin: "",
                },
                isIntermittent: selectedContact.isIntermittent,
                intermittentNumber: selectedContact.intermittentNumber || "",
                siret: selectedContact.siret || "",
                apeCode: selectedContact.apeCode || "",
                vatNumber: selectedContact.vatNumber || "",
                bankDetails: selectedContact.bankDetails || {
                  iban: "",
                  bic: "",
                  bankName: "",
                },
                skills: selectedContact.skills || [],
                rates: selectedContact.rates || [],
                availability: selectedContact.availability || [],
                tags: selectedContact.tags || [],
                groups: selectedContact.groups || [],
                isFavorite: selectedContact.isFavorite,
                notes: selectedContact.notes || "",
              } : undefined}
              onSubmit={selectedContact ? handleContactUpdate : handleContactSubmit}
              onCancel={() => {
                setShowContactForm(false);
                setSelectedContact(null);
              }}
              title={selectedContact ? "Modifier le contact" : "Nouveau contact"}
              description={selectedContact ? "Modifiez les informations du contact" : "Créez un nouveau contact dans votre base"}
            />
          </div>
        </div>
      )}

      {/* Contact Profile Modal */}
      {showContactProfile && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ContactProfile
              contact={selectedContact}
              onEdit={() => {
                setShowContactProfile(false);
                setShowContactForm(true);
              }}
              onToggleFavorite={() => handleToggleFavorite(selectedContact.id)}
              onAddCollaboration={() => {}}
              onAddRate={() => {}}
              onAddAvailability={() => {}}
              onExport={() => handleContactExport([selectedContact.id])}
              onShare={() => {}}
            />
          </div>
        </div>
      )}

      {/* Import/Export Modal */}
      {showImportExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ContactImportExport
              onImport={handleContactImport}
              onExport={handleContactExport}
              onShare={() => {}}
              contactIds={contacts.map(c => c.id)}
            />
          </div>
        </div>
      )}

      {/* PDF Export Modal */}
      {showPDFExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ContactPDFExport
              contacts={contacts as Contact[]}
              onExport={handlePDFExport}
              onPreview={handlePDFPreview}
              onShare={handlePDFShare}
            />
          </div>
        </div>
      )}
    </div>
  );
}