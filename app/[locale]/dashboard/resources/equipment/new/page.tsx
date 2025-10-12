"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from '@/lib/i18n';
import { EquipmentForm } from '@/components/forms/EquipmentForm';

export default function NewEquipmentPage() {
  const params = useParams();
  const { t } = useLocale();
  const { locale } = params;

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('new_equipment.title')}</h1>
        <p className="text-gray-600">{t('new_equipment.description')}</p>
      </div>
      
      <EquipmentForm 
        locale={locale as string}
      />
    </div>
  );
}
