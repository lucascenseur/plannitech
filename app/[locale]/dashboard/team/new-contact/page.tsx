"use client";

import React from 'react';
import { ContactForm } from '@/components/forms/ContactForm';
import { useLocale } from '@/lib/i18n';

export default function NewContactPage() {
  const { currentLocale } = useLocale();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {currentLocale === 'en' ? 'New Contact' : currentLocale === 'es' ? 'Nuevo Contacto' : 'Nouveau Contact'}
        </h1>
        <p className="text-gray-600">
          {currentLocale === 'en' 
            ? 'Create a new contact for your team'
            : currentLocale === 'es'
            ? 'Crear un nuevo contacto para tu equipo'
            : 'Créer un nouveau contact pour votre équipe'
          }
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
