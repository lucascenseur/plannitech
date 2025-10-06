"use client";

import React, { useState, useEffect } from "react";
import { BudgetList } from "@/components/budget/BudgetList";
import { FinancialDashboard } from "@/components/budget/FinancialDashboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface BudgetPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function BudgetPage({ params }: BudgetPageProps) {
  const [locale, setLocale] = useState('fr');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch('/api/budgets');
        if (response.ok) {
          const data = await response.json();
          setBudgets(data.budgets || []);
          setExpenses(data.expenses || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des budgets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const handleCreate = () => {
    setShowCreateDialog(true);
  };

  const handleEdit = (id: string) => {
    console.log("Éditer le budget:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Supprimer le budget:", id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Create Budget' : locale === 'es' ? 'Crear Presupuesto' : 'Créer un budget'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {locale === 'en' ? 'Create Budget' : locale === 'es' ? 'Crear Presupuesto' : 'Créer un budget'}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Formulaire de création de budget à implémenter</p>
              <Button onClick={() => setShowCreateDialog(false)} className="mt-4">
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <FinancialDashboard 
        budgets={budgets}
        expenses={expenses}
        loading={loading}
      />
      <BudgetList 
        budgets={budgets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        loading={loading}
      />
    </div>
  );
}
