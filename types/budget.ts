import { z } from "zod";

// Schémas de validation Zod
export const budgetSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Le projet est requis"),
  type: z.enum(["PREVIEW", "ACTUAL", "REVISED"]),
  status: z.enum(["DRAFT", "APPROVED", "REJECTED", "ARCHIVED"]).default("DRAFT"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  totalAmount: z.number().min(0, "Le montant total doit être positif"),
  currency: z.string().default("EUR"),
  categories: z.array(z.object({
    id: z.string(),
    name: z.string(),
    amount: z.number().min(0),
    percentage: z.number().min(0).max(100),
    description: z.string().optional(),
  })),
  items: z.array(z.object({
    id: z.string(),
    categoryId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    quantity: z.number().min(0),
    unitPrice: z.number().min(0),
    totalPrice: z.number().min(0),
    isRecurring: z.boolean().default(false),
    frequency: z.enum(["ONCE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const budgetUpdateSchema = budgetSchema.partial();

export const expenseSchema = z.object({
  budgetId: z.string().min(1, "Le budget est requis"),
  categoryId: z.string().min(1, "La catégorie est requise"),
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  amount: z.number().min(0, "Le montant doit être positif"),
  currency: z.string().default("EUR"),
  date: z.string().min(1, "La date est requise"),
  type: z.enum(["EXPENSE", "INCOME", "TRANSFER"]),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "PAID"]).default("PENDING"),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CHECK", "CARD", "STRIPE"]).optional(),
  paymentReference: z.string().optional(),
  receipt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const expenseUpdateSchema = expenseSchema.partial();

export const invoiceSchema = z.object({
  projectId: z.string().min(1, "Le projet est requis"),
  clientId: z.string().min(1, "Le client est requis"),
  number: z.string().min(1, "Le numéro est requis"),
  date: z.string().min(1, "La date est requise"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]).default("DRAFT"),
  subtotal: z.number().min(0, "Le sous-total doit être positif"),
  taxRate: z.number().min(0).max(100, "Le taux de taxe doit être entre 0 et 100"),
  taxAmount: z.number().min(0, "Le montant de la taxe doit être positif"),
  total: z.number().min(0, "Le total doit être positif"),
  currency: z.string().default("EUR"),
  items: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, "La description est requise"),
    quantity: z.number().min(0, "La quantité doit être positive"),
    unitPrice: z.number().min(0, "Le prix unitaire doit être positif"),
    total: z.number().min(0, "Le total doit être positif"),
  })),
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const invoiceUpdateSchema = invoiceSchema.partial();

export const quoteSchema = z.object({
  projectId: z.string().min(1, "Le projet est requis"),
  clientId: z.string().min(1, "Le client est requis"),
  number: z.string().min(1, "Le numéro est requis"),
  date: z.string().min(1, "La date est requise"),
  validUntil: z.string().min(1, "La date de validité est requise"),
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]).default("DRAFT"),
  subtotal: z.number().min(0, "Le sous-total doit être positif"),
  taxRate: z.number().min(0).max(100, "Le taux de taxe doit être entre 0 et 100"),
  taxAmount: z.number().min(0, "Le montant de la taxe doit être positif"),
  total: z.number().min(0, "Le total doit être positif"),
  currency: z.string().default("EUR"),
  items: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, "La description est requise"),
    quantity: z.number().min(0, "La quantité doit être positive"),
    unitPrice: z.number().min(0, "Le prix unitaire doit être positif"),
    total: z.number().min(0, "Le total doit être positif"),
  })),
  notes: z.string().optional(),
  terms: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const quoteUpdateSchema = quoteSchema.partial();

export const intermittentSchema = z.object({
  contactId: z.string().min(1, "Le contact est requis"),
  projectId: z.string().min(1, "Le projet est requis"),
  role: z.string().min(1, "Le rôle est requis"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  hours: z.number().min(0, "Le nombre d'heures doit être positif"),
  hourlyRate: z.number().min(0, "Le taux horaire doit être positif"),
  totalAmount: z.number().min(0, "Le montant total doit être positif"),
  currency: z.string().default("EUR"),
  status: z.enum(["PENDING", "APPROVED", "PAID", "CANCELLED"]).default("PENDING"),
  paymentDate: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CHECK", "CARD", "STRIPE"]).optional(),
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const intermittentUpdateSchema = intermittentSchema.partial();

export const socialChargesSchema = z.object({
  projectId: z.string().min(1, "Le projet est requis"),
  period: z.string().min(1, "La période est requise"),
  totalGross: z.number().min(0, "Le total brut doit être positif"),
  totalNet: z.number().min(0, "Le total net doit être positif"),
  employerCharges: z.number().min(0, "Les charges employeur doivent être positives"),
  employeeCharges: z.number().min(0, "Les charges salariales doivent être positives"),
  totalCharges: z.number().min(0, "Le total des charges doit être positif"),
  breakdown: z.array(z.object({
    type: z.string(),
    rate: z.number().min(0).max(100),
    amount: z.number().min(0),
    description: z.string().optional(),
  })),
  metadata: z.record(z.any()).optional(),
});

export const socialChargesUpdateSchema = socialChargesSchema.partial();

// Types TypeScript
export type Budget = z.infer<typeof budgetSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
    type: string;
  };
  expenses?: Expense[];
  actualAmount?: number;
  variance?: number;
  variancePercentage?: number;
};

export type Expense = z.infer<typeof expenseSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  budget: {
    id: string;
    name: string;
    project: {
      id: string;
      name: string;
    };
  };
  category: {
    id: string;
    name: string;
  };
};

export type Invoice = z.infer<typeof invoiceSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
    type: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
  };
  payments?: Payment[];
  totalPaid?: number;
  remainingAmount?: number;
};

export type Quote = z.infer<typeof quoteSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
    type: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
  };
};

export type Intermittent = z.infer<typeof intermittentSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  contact: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
    type: string;
  };
};

export type SocialCharges = z.infer<typeof socialChargesSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
    type: string;
  };
};

export type Payment = {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  date: Date;
  method: string;
  reference: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  stripePaymentIntentId?: string;
  metadata?: Record<string, any>;
};

// Types pour les vues
export interface BudgetListView {
  id: string;
  name: string;
  project: {
    id: string;
    name: string;
  };
  type: string;
  status: string;
  totalAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface ExpenseListView {
  id: string;
  name: string;
  amount: number;
  currency: string;
  date: Date;
  type: string;
  status: string;
  category: {
    id: string;
    name: string;
  };
  budget: {
    id: string;
    name: string;
    project: {
      id: string;
      name: string;
    };
  };
  createdAt: Date;
}

export interface InvoiceListView {
  id: string;
  number: string;
  client: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  total: number;
  currency: string;
  status: string;
  date: Date;
  dueDate: Date;
  totalPaid: number;
  remainingAmount: number;
  createdAt: Date;
}

export interface QuoteListView {
  id: string;
  number: string;
  client: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  total: number;
  currency: string;
  status: string;
  date: Date;
  validUntil: Date;
  createdAt: Date;
}

export interface IntermittentListView {
  id: string;
  contact: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  role: string;
  hours: number;
  hourlyRate: number;
  totalAmount: number;
  currency: string;
  status: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

// Types pour les statistiques
export interface BudgetStats {
  totalBudgets: number;
  totalAmount: number;
  totalActual: number;
  totalVariance: number;
  averageVariance: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byProject: Array<{
    projectId: string;
    projectName: string;
    budgetAmount: number;
    actualAmount: number;
    variance: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    budget: number;
    actual: number;
    variance: number;
  }>;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  averageAmount: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  totalPaid: number;
  totalOutstanding: number;
  averageAmount: number;
  byStatus: Record<string, number>;
  byClient: Array<{
    clientId: string;
    clientName: string;
    totalAmount: number;
    totalPaid: number;
    outstanding: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    issued: number;
    paid: number;
    outstanding: number;
  }>;
}

export interface IntermittentStats {
  totalIntermittents: number;
  totalHours: number;
  totalAmount: number;
  averageHourlyRate: number;
  byStatus: Record<string, number>;
  byProject: Array<{
    projectId: string;
    projectName: string;
    totalHours: number;
    totalAmount: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    hours: number;
    amount: number;
  }>;
}

// Types pour les exports
export interface BudgetExport {
  format: "CSV" | "PDF" | "EXCEL";
  budgets: Budget[];
  includeExpenses: boolean;
  includeVariance: boolean;
  includeCharts: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface ExpenseExport {
  format: "CSV" | "PDF" | "EXCEL";
  expenses: Expense[];
  includeReceipts: boolean;
  includeCategories: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface InvoiceExport {
  format: "CSV" | "PDF" | "EXCEL";
  invoices: Invoice[];
  includeItems: boolean;
  includePayments: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Types pour les graphiques
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface DashboardData {
  budgets: BudgetStats;
  expenses: ExpenseStats;
  invoices: InvoiceStats;
  intermittents: IntermittentStats;
  charts: {
    budgetVsActual: ChartData;
    expensesByCategory: ChartData;
    invoicesByStatus: ChartData;
    monthlyTrend: ChartData;
  };
}

// Types pour les filtres
export interface BudgetFilters {
  search?: string;
  projectId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface ExpenseFilters {
  search?: string;
  budgetId?: string;
  categoryId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface InvoiceFilters {
  search?: string;
  clientId?: string;
  projectId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface QuoteFilters {
  search?: string;
  clientId?: string;
  projectId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface IntermittentFilters {
  search?: string;
  contactId?: string;
  projectId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

