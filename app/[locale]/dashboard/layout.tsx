import { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: DashboardLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Dashboard - Plannitech",
    description: "Tableau de bord Plannitech pour la gestion de spectacles",
    alternates: {
      canonical: `/${locale}/dashboard`,
      languages: {
        'fr': '/fr/dashboard',
        'en': '/en/dashboard',
        'es': '/es/dashboard',
      },
    },
  };
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { locale } = await params;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
