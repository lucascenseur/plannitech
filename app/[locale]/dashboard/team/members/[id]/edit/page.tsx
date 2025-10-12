"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n';
import { TeamMemberForm } from '@/components/forms/TeamMemberForm';

export default function EditTeamMemberPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const { locale, id } = params;
  
  const [teamMember, setTeamMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const response = await fetch(`/api/team/members/${id}`);
        if (!response.ok) {
          throw new Error('Team member not found');
        }
        const data = await response.json();
        setTeamMember(data.member);
      } catch (error) {
        console.error('Error fetching team member:', error);
        router.push(`/${locale}/dashboard/team`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeamMember();
    }
  }, [id, locale, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (!teamMember) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg">{t('edit_team_member.not_found')}</div>
        <button 
          onClick={() => router.push(`/${locale}/dashboard/team`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('edit_team_member.back_to_team')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('edit_team_member.title')}</h1>
        <p className="text-gray-600">{t('edit_team_member.description')}</p>
      </div>
      
      <TeamMemberForm 
        teamMember={teamMember} 
        locale={locale as string}
      />
    </div>
  );
}
