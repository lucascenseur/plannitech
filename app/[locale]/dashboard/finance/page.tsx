"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsNavigation } from "@/components/ui/tabs-navigation";
import { 
  DollarSign, 
  BarChart3, 
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Euro,
  Clock,
  Users,
  Calendar,
  FileText,
  PieChart,
  LineChart,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";

interface FinancePageProps {
  params: Promise<{
    locale: string;
  }>;
}

interface FinancialReport {
  id: string;
  title: string;
  type: 'budget' | 'expense' | 'revenue' | 'profit_loss';
  period: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  totalAmount: number;
  currency: string;
  createdAt: string;
  description?: string;
  categories: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}

interface PayrollExport {
  id: string;
  period: string;
  status: 'draft' | 'generated' | 'sent' | 'paid';
  totalAmount: number;
  employeeCount: number;
  createdAt: string;
  fileUrl?: string;
  description?: string;
}

export default function FinancePage({ params }: FinancePageProps) {
  const [locale, setLocale] = useState('fr');
  const [activeTab, setActiveTab] = useState('overview');
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);
  const [payrollExports, setPayrollExports] = useState<PayrollExport[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuration des onglets
  const tabs = [
    {
      id: 'overview',
      label: locale === 'en' ? 'Overview' : locale === 'es' ? 'Resumen' : 'Aperçu',
      icon: BarChart3,
      count: 0
    },
    {
      id: 'reports',
      label: locale === 'en' ? 'Financial Reports' : locale === 'es' ? 'Reportes Financieros' : 'Rapports Financiers',
      icon: FileText,
      count: financialReports.length
    },
    {
      id: 'payroll',
      label: locale === 'en' ? 'Payroll Export' : locale === 'es' ? 'Exportar Nómina' : 'Export Paie',
      icon: Download,
      count: payrollExports.length
    }
  ];

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simuler des appels API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Données de démonstration
        setFinancialReports([
          {
            id: '1',
            title: 'Rapport Financier Q1 2024',
            type: 'profit_loss',
            period: 'Q1 2024',
            status: 'approved',
            totalAmount: 125000,
            currency: 'EUR',
            createdAt: '2024-03-31',
            description: 'Rapport trimestriel des revenus et dépenses',
            categories: [
              { name: 'Revenus', amount: 150000, percentage: 100 },
              { name: 'Salaires', amount: 45000, percentage: 30 },
              { name: 'Équipement', amount: 25000, percentage: 16.7 },
              { name: 'Transport', amount: 15000, percentage: 10 },
              { name: 'Autres', amount: 10000, percentage: 6.7 }
            ]
          }
        ]);
        
        setPayrollExports([
          {
            id: '1',
            period: 'Mars 2024',
            status: 'sent',
            totalAmount: 45000,
            employeeCount: 12,
            createdAt: '2024-03-31',
            fileUrl: '/exports/payroll-march-2024.xlsx',
            description: 'Export paie pour le mois de mars'
          }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'sent': case 'paid': return 'bg-green-100 text-green-800';
      case 'review': case 'generated': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: { [key: string]: string } } = {
      en: {
        draft: 'Draft', review: 'Under Review', approved: 'Approved', archived: 'Archived',
        generated: 'Generated', sent: 'Sent', paid: 'Paid'
      },
      es: {
        draft: 'Borrador', review: 'En Revisión', approved: 'Aprobado', archived: 'Archivado',
        generated: 'Generado', sent: 'Enviado', paid: 'Pagado'
      },
      fr: {
        draft: 'Brouillon', review: 'En Révision', approved: 'Approuvé', archived: 'Archivé',
        generated: 'Généré', sent: 'Envoyé', paid: 'Payé'
      }
    };
    return statusMap[locale]?.[status] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: { [key: string]: string } } = {
      en: {
        budget: 'Budget', expense: 'Expense', revenue: 'Revenue', profit_loss: 'Profit & Loss'
      },
      es: {
        budget: 'Presupuesto', expense: 'Gasto', revenue: 'Ingreso', profit_loss: 'Ganancias y Pérdidas'
      },
      fr: {
        budget: 'Budget', expense: 'Dépense', revenue: 'Revenu', profit_loss: 'Bénéfices et Pertes'
      }
    };
    return typeMap[locale]?.[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {locale === 'en' ? 'Loading financial data...' : locale === 'es' ? 'Cargando datos financieros...' : 'Chargement des données financières...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Finance & Tracking' : locale === 'es' ? 'Finanzas y Seguimiento' : 'Finances & Suivi'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'Oversee budgets, generate financial reports, and export payroll data' 
              : locale === 'es' 
              ? 'Supervisa presupuestos, genera informes financieros y exporta datos de nómina'
              : 'Supervisez les budgets, générez des rapports financiers et exportez les données de paie'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Filter' : locale === 'es' ? 'Filtrar' : 'Filtrer'}
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Export' : locale === 'es' ? 'Exportar' : 'Exporter'}
          </button>
          <Link
            href={`/${locale}/dashboard/finance/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'New Report' : locale === 'es' ? 'Nuevo Reporte' : 'Nouveau Rapport'}
          </Link>
        </div>
      </div>

      {/* Navigation par onglets */}
      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Contenu conditionnel selon l'onglet actif */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistiques financières */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white text-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === 'en' ? 'Total Revenue' : locale === 'es' ? 'Ingresos Totales' : 'Revenus Totaux'}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">€150,000</div>
                <p className="text-xs text-gray-600">
                  +12% {locale === 'en' ? 'from last month' : locale === 'es' ? 'del mes pasado' : 'du mois dernier'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white text-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === 'en' ? 'Total Expenses' : locale === 'es' ? 'Gastos Totales' : 'Dépenses Totales'}
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">€95,000</div>
                <p className="text-xs text-gray-600">
                  +8% {locale === 'en' ? 'from last month' : locale === 'es' ? 'del mes pasado' : 'du mois dernier'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white text-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === 'en' ? 'Net Profit' : locale === 'es' ? 'Beneficio Neto' : 'Bénéfice Net'}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">€55,000</div>
                <p className="text-xs text-gray-600">
                  +18% {locale === 'en' ? 'from last month' : locale === 'es' ? 'del mes pasado' : 'du mois dernier'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white text-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === 'en' ? 'Active Projects' : locale === 'es' ? 'Proyectos Activos' : 'Projets Actifs'}
                </CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">8</div>
                <p className="text-xs text-gray-600">
                  {locale === 'en' ? 'in progress' : locale === 'es' ? 'en progreso' : 'en cours'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques et analyses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white text-gray-900">
              <CardHeader>
                <CardTitle>
                  {locale === 'en' ? 'Revenue vs Expenses' : locale === 'es' ? 'Ingresos vs Gastos' : 'Revenus vs Dépenses'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>{locale === 'en' ? 'Chart will be displayed here' : locale === 'es' ? 'El gráfico se mostrará aquí' : 'Le graphique s\'affichera ici'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white text-gray-900">
              <CardHeader>
                <CardTitle>
                  {locale === 'en' ? 'Expense Categories' : locale === 'es' ? 'Categorías de Gastos' : 'Catégories de Dépenses'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                    <p>{locale === 'en' ? 'Pie chart will be displayed here' : locale === 'es' ? 'El gráfico circular se mostrará aquí' : 'Le graphique en secteurs s\'affichera ici'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {financialReports.map((report) => (
              <Card key={report.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <p className="text-sm text-gray-600">{getTypeText(report.type)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusText(report.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Period:</span>
                      <span className="text-gray-900">{report.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="text-gray-900 font-semibold">{report.totalAmount.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{report.createdAt}</span>
                    </div>
                    {report.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/finance/reports/${report.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/finance/reports/${report.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {payrollExports.map((export_) => (
              <Card key={export_.id} className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{export_.period}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {export_.employeeCount} {locale === 'en' ? 'employees' : locale === 'es' ? 'empleados' : 'employés'}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(export_.status)}>
                      {getStatusText(export_.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-gray-900 font-semibold">{export_.totalAmount.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{export_.createdAt}</span>
                    </div>
                    {export_.fileUrl && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">File:</span>
                        <Link href={export_.fileUrl} className="text-blue-600 hover:text-blue-800">
                          {locale === 'en' ? 'Download' : locale === 'es' ? 'Descargar' : 'Télécharger'}
                        </Link>
                      </div>
                    )}
                    {export_.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{export_.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/finance/payroll/${export_.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/finance/payroll/${export_.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-blue-50 text-blue-900 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <DollarSign className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              {locale === 'en' ? 'Quick Actions' : locale === 'es' ? 'Acciones Rápidas' : 'Actions Rapides'}
            </h3>
            <p className="text-blue-700 mt-1">
              {locale === 'en' 
                ? 'Generate reports and manage your finances efficiently.'
                : locale === 'es'
                ? 'Genera reportes y gestiona tus finanzas eficientemente.'
                : 'Générez des rapports et gérez vos finances efficacement.'
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/dashboard/finance/reports/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Generate Report' : locale === 'es' ? 'Generar Reporte' : 'Générer un Rapport'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/finance/payroll/export`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Download className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Export Payroll' : locale === 'es' ? 'Exportar Nómina' : 'Exporter la Paie'}
              </Link>
              <Link 
                href={`/${locale}/dashboard/finance/budget`}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50"
              >
                <Target className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Budget Management' : locale === 'es' ? 'Gestión de Presupuesto' : 'Gestion Budget'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
