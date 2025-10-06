import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Stockage temporaire en mémoire
let budgets: any[] = [];
let expenses: any[] = [];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Filtrer les budgets et dépenses par organisation de l'utilisateur
    const userOrgId = session.user?.organizations?.[0]?.organizationId || '1';
    const userBudgets = budgets.filter(budget => budget.organizationId === userOrgId);
    const userExpenses = expenses.filter(expense => expense.organizationId === userOrgId);

    return NextResponse.json({ budgets: userBudgets, expenses: userExpenses });
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const newBudget = {
      id: (budgets.length + 1).toString(),
      name: body.name,
      projectId: body.projectId || null,
      totalAmount: body.totalAmount || 0,
      spentAmount: 0,
      remainingAmount: body.totalAmount || 0,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    budgets.push(newBudget);

    return NextResponse.json({ 
      message: 'Budget créé avec succès',
      budget: newBudget 
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du budget:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
