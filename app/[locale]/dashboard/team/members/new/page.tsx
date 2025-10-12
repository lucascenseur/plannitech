"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from '@/lib/i18n';
import { TeamMemberForm } from '@/components/forms/TeamMemberForm';

export default function NewTeamMemberPage() {
  const params = useParams();
  const { t } = useLocale();
  const { locale } = params;

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('new_team_member.title')}</h1>
        <p className="text-gray-600">{t('new_team_member.description')}</p>
      </div>
      
      <TeamMemberForm 
        locale={locale as string}
      />
    </div>
  );
}
