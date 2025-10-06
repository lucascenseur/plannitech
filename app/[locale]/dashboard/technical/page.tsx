import { Metadata } from "next";
import { TechnicalSheetList } from "@/components/technical/TechnicalSheetList";
import { EquipmentInventory } from "@/components/technical/EquipmentInventory";

interface TechnicalPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: TechnicalPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Technique - Plannitech",
    description: "Gestion technique et équipements",
    alternates: {
      canonical: `/${locale}/dashboard/technical`,
      languages: {
        'fr': '/fr/dashboard/technical',
        'en': '/en/dashboard/technical',
        'es': '/es/dashboard/technical',
      },
    },
  };
}

export default async function TechnicalPage({ params }: TechnicalPageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Technical' : locale === 'es' ? 'Técnico' : 'Technique'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Manage technical sheets and equipment' 
            : locale === 'es' 
            ? 'Gestiona fichas técnicas y equipos'
            : 'Gérez les fiches techniques et équipements'
          }
        </p>
      </div>
      
      <TechnicalSheetList 
        sheets={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        onCreate={() => {}}
        loading={false}
      />
      <EquipmentInventory 
        equipment={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        onCreate={() => {}}
        loading={false}
      />
    </div>
  );
}
