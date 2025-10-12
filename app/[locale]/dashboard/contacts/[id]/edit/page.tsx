"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n';
import { ContactForm } from '@/components/forms/ContactForm';

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const { locale, id } = params;
  
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`/api/contacts/${id}`);
        if (!response.ok) {
          throw new Error('Contact not found');
        }
        const data = await response.json();
        setContact(data.contact);
      } catch (error) {
        console.error('Error fetching contact:', error);
        router.push(`/${locale}/dashboard/team`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContact();
    }
  }, [id, locale, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg">{t('edit_contact.not_found')}</div>
        <button 
          onClick={() => router.push(`/${locale}/dashboard/team`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('edit_contact.back_to_contacts')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('edit_contact.title')}</h1>
        <p className="text-gray-600">{t('edit_contact.description')}</p>
      </div>
      
      <ContactForm 
        contact={contact} 
        locale={locale as string}
      />
    </div>
  );
}
