"use client";

import React, { useState, useEffect } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { EventForm } from "@/components/calendar/EventForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface PlanningPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function PlanningPage({ params }: PlanningPageProps) {
  const [locale, setLocale] = useState('fr');
  const [events, setEvents] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les événements
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCreate = () => {
    setShowCreateDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Planning' : locale === 'es' ? 'Planificación' : 'Planning'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Manage your events and planning' 
              : locale === 'es' 
              ? 'Gestiona tus eventos y planificación'
              : 'Gérez vos événements et votre planning'
            }
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Create Event' : locale === 'es' ? 'Crear Evento' : 'Créer un événement'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {locale === 'en' ? 'Create Event' : locale === 'es' ? 'Crear Evento' : 'Créer un événement'}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Formulaire de création d'événement à implémenter</p>
              <Button onClick={() => setShowCreateDialog(false)} className="mt-4">
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <CalendarView events={events} loading={loading} />
    </div>
  );
}
