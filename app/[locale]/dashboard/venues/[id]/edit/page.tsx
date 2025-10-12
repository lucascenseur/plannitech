"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n';
import { VenueForm } from '@/components/forms/VenueForm';

export default function EditVenuePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const { locale, id } = params;
  
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`/api/venues/${id}`);
        if (!response.ok) {
          throw new Error('Venue not found');
        }
        const data = await response.json();
        setVenue(data.venue);
      } catch (error) {
        console.error('Error fetching venue:', error);
        router.push(`/${locale}/dashboard/shows`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVenue();
    }
  }, [id, locale, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg">{t('edit_venue.not_found')}</div>
        <button 
          onClick={() => router.push(`/${locale}/dashboard/shows`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('edit_venue.back_to_venues')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('edit_venue.title')}</h1>
        <p className="text-gray-600">{t('edit_venue.description')}</p>
      </div>
      
      <VenueForm 
        venue={venue} 
        locale={locale as string}
      />
    </div>
  );
}
