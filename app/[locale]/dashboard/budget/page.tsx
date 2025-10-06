import { Metadata } from "next";
import { BudgetList } from "@/components/budget/BudgetList";
import { FinancialDashboard } from "@/components/budget/FinancialDashboard";

interface BudgetPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: BudgetPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Budget - Plannitech",
    description: "Gestion budgétaire et financière",
    alternates: {
      canonical: `/${locale}/dashboard/budget`,
      languages: {
        'fr': '/fr/dashboard/budget',
        'en': '/en/dashboard/budget',
        'es': '/es/dashboard/budget',
      },
    },
  };
}

export default async function BudgetPage({ params }: BudgetPageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'en' ? 'Budget' : locale === 'es' ? 'Presupuesto' : 'Budget'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? 'Manage your project budgets and expenses' 
            : locale === 'es' 
            ? 'Gestiona los presupuestos y gastos de tus proyectos'
            : 'Gérez vos budgets et dépenses de projets'
          }
        </p>
      </div>
      
      <FinancialDashboard 
        budgets={[]}
        expenses={[]}
        loading={false}
      />
      <BudgetList 
        budgets={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        onCreate={() => {}}
        loading={false}
      />
    </div>
  );
}
