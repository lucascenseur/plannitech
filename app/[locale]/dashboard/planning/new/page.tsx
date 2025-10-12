"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from '@/lib/i18n';
import { PlanningItemForm } from '@/components/forms/PlanningItemForm';

export default function NewPlanningItemPage() {
  const params = useParams();
  const { t } = useLocale();
  const { locale } = params;

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('new_planning_item.title')}</h1>
        <p className="text-gray-600">{t('new_planning_item.description')}</p>
      </div>
      
      <PlanningItemForm 
        locale={locale as string}
      />
    </div>
  );
}
