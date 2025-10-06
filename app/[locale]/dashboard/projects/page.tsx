import { Metadata } from "next";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectForm } from "@/components/projects/ProjectForm";

interface ProjectsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Projets - Plannitech",
    description: "Gestion des projets",
    alternates: {
      canonical: `/${locale}/dashboard/projects`,
      languages: {
        'fr': '/fr/dashboard/projects',
        'en': '/en/dashboard/projects',
        'es': '/es/dashboard/projects',
      },
    },
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Projects' : locale === 'es' ? 'Proyectos' : 'Projets'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Manage your projects' 
            : locale === 'es' 
            ? 'Gestiona tus proyectos'
            : 'Gérez vos projets'
          }
        </p>
      </div>
      
      <ProjectList 
        projects={[]}
        onEdit={() => {}}
        onView={() => {}}
        onDelete={() => {}}
        onArchive={() => {}}
        onExport={() => {}}
        onCreate={() => {}}
        loading={false}
      />
    </div>
  );
}
