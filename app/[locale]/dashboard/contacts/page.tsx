"use client";

import React, { useState, useEffect } from "react";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactForm } from "@/components/contacts/ContactForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface ContactsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function ContactsPage({ params }: ContactsPageProps) {
  const [locale, setLocale] = useState('fr');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (response.ok) {
          const data = await response.json();
          setContacts(data.contacts || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleCreate = () => {
    setShowCreateDialog(true);
  };

  const handleCreateContact = async (contactData: any) => {
    try {
      console.log('Données du contact à créer:', contactData);
      
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Contact créé avec succès:', result);
        setContacts(prev => [...prev, result.contact]);
        setShowCreateDialog(false);
        alert(locale === 'en' ? 'Contact created successfully!' : locale === 'es' ? '¡Contacto creado con éxito!' : 'Contact créé avec succès !');
      } else {
        const error = await response.json();
        console.error('Erreur lors de la création:', error);
        alert(locale === 'en' ? 'Error creating contact' : locale === 'es' ? 'Error al crear contacto' : 'Erreur lors de la création du contact');
      }
    } catch (error) {
      console.error('Erreur lors de la création du contact:', error);
      alert(locale === 'en' ? 'Error creating contact' : locale === 'es' ? 'Error al crear contacto' : 'Erreur lors de la création du contact');
    }
  };

  const handleEdit = (id: string) => {
    console.log("Éditer le contact:", id);
  };

  const handleView = (id: string) => {
    console.log("Voir le contact:", id);
  };

  const handleDelete = (ids: string[]) => {
    console.log("Supprimer les contacts:", ids);
  };

  const handleExport = (ids: string[]) => {
    console.log("Exporter les contacts:", ids);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Contacts' : locale === 'es' ? 'Contactos' : 'Contacts'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Manage your contacts and collaborators' 
              : locale === 'es' 
              ? 'Gestiona tus contactos y colaboradores'
              : 'Gérez vos contacts et collaborateurs'
            }
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Create Contact' : locale === 'es' ? 'Crear Contacto' : 'Créer un contact'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {locale === 'en' ? 'Create Contact' : locale === 'es' ? 'Crear Contacto' : 'Créer un contact'}
              </DialogTitle>
            </DialogHeader>
            <ContactForm 
              onSubmit={handleCreateContact}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <ContactList 
        contacts={contacts || []}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onToggleFavorite={(id) => console.log("Toggle favorite:", id)}
        onExport={handleExport}
        onImport={() => console.log("Importer des contacts")}
        onCreate={handleCreate}
        loading={loading}
      />
    </div>
  );
}
