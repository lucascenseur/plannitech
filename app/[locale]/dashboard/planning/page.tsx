import { Metadata } from "next";
import { CalendarView } from "@/components/calendar/CalendarView";
import { EventForm } from "@/components/calendar/EventForm";

interface PlanningPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PlanningPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Planning - Plannitech",
    description: "Gestion du planning et des événements",
    alternates: {
      canonical: `/${locale}/dashboard/planning`,
      languages: {
        'fr': '/fr/dashboard/planning',
        'en': '/en/dashboard/planning',
        'es': '/es/dashboard/planning',
      },
    },
  };
}

export default async function PlanningPage({ params }: PlanningPageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
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
      
      <CalendarView />
    </div>
  );
}
