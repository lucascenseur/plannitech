"use client";

import React, { useState } from 'react';
import { TechnicalSheetsList } from '@/components/technical-sheets/TechnicalSheetsList';
import { useLocale } from '@/lib/i18n';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function TechnicalSheetsPage() {
  const { currentLocale } = useLocale();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentLocale === 'en' ? 'Technical Sheets' : currentLocale === 'es' ? 'Fichas Técnicas' : 'Fiches Techniques'}
          </h1>
          <p className="text-gray-600">
            {currentLocale === 'en' 
              ? 'Manage all your technical sheets'
              : currentLocale === 'es'
              ? 'Gestiona todas tus fichas técnicas'
              : 'Gérez toutes vos fiches techniques'
            }
          </p>
        </div>
        
        <Link
          href={`/${currentLocale}/dashboard/technical-sheets/new`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {currentLocale === 'en' ? 'New Technical Sheet' : currentLocale === 'es' ? 'Nueva Ficha Técnica' : 'Nouvelle Fiche Technique'}
        </Link>
      </div>

      <TechnicalSheetsList locale={currentLocale} />
    </div>
  );
}
