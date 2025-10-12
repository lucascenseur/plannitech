"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n';
import { TechnicalSheetForm } from '@/components/forms/TechnicalSheetForm';

export default function EditTechnicalSheetPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const { locale, id } = params;
  
  const [technicalSheet, setTechnicalSheet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicalSheet = async () => {
      try {
        const response = await fetch(`/api/technical-sheets/${id}`);
        if (!response.ok) {
          throw new Error('Technical sheet not found');
        }
        const data = await response.json();
        setTechnicalSheet(data.technicalSheet);
      } catch (error) {
        console.error('Error fetching technical sheet:', error);
        router.push(`/${locale}/dashboard/shows`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTechnicalSheet();
    }
  }, [id, locale, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (!technicalSheet) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg">{t('edit_technical_sheet.not_found')}</div>
        <button 
          onClick={() => router.push(`/${locale}/dashboard/shows`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('edit_technical_sheet.back_to_technical_sheets')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('edit_technical_sheet.title')}</h1>
        <p className="text-gray-600">{t('edit_technical_sheet.description')}</p>
      </div>
      
      <TechnicalSheetForm 
        technicalSheet={technicalSheet} 
        locale={locale as string}
      />
    </div>
  );
}
