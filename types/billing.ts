import { z } from "zod";

// Schémas de validation Zod
export const subscriptionPlanSchema = z.object({
  id: z.string().min(1, "L'ID du plan est requis"),
  name: z.string().min(1, "Le nom du plan est requis"),
  description: z.string().optional(),
  price: z.number().min(0, "Le prix doit être positif"),
  currency: z.string().default("EUR"),
  interval: z.enum(["month", "year"]).default("month"),
  stripePriceId: z.string().optional(),
  stripeProductId: z.string().optional(),
  features: z.array(z.string()).optional(),
  limits: z.object({
    projects: z.number().min(0).default(0),
    users: z.number().min(0).default(0),
    storage: z.number().min(0).default(0), // in GB
    apiCalls: z.number().min(0).default(0),
    support: z.enum(["email", "priority", "dedicated"]).default("email"),
  }),
  isActive: z.boolean().default(true),
  isPopular: z.boolean().default(false),
  trialDays: z.number().min(0).default(0),
  metadata: z.record(z.any()).optional(),
});

export const subscriptionSchema = z.object({
  id: z.string().min(1, "L'ID de l'abonnement est requis"),
  organizationId: z.string().min(1, "L'organisation est requise"),
  planId: z.string().min(1, "Le plan est requis"),
  status: z.enum(["active", "canceled", "incomplete", "incomplete_expired", "past_due", "trialing", "unpaid"]),
  currentPeriodStart: z.string().min(1, "La date de début de période est requise"),
  currentPeriodEnd: z.string().min(1, "La date de fin de période est requise"),
  trialStart: z.string().optional(),
  trialEnd: z.string().optional(),
  cancelAtPeriodEnd: z.boolean().default(false),
  canceledAt: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  stripePriceId: z.string().optional(),
  stripeProductId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const subscriptionUpdateSchema = z.object({
  planId: z.string().optional(),
  status: z.enum(["active", "canceled", "incomplete", "incomplete_expired", "past_due", "trialing", "unpaid"]).optional(),
  cancelAtPeriodEnd: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export const invoiceSchema = z.object({
  id: z.string().min(1, "L'ID de la facture est requis"),
  organizationId: z.string().min(1, "L'organisation est requise"),
  subscriptionId: z.string().min(1, "L'abonnement est requis"),
  number: z.string().min(1, "Le numéro de facture est requis"),
  status: z.enum(["draft", "open", "paid", "void", "uncollectible"]),
  amount: z.number().min(0, "Le montant doit être positif"),
  currency: z.string().default("EUR"),
  tax: z.number().min(0).default(0),
  total: z.number().min(0, "Le total doit être positif"),
  paidAt: z.string().optional(),
  dueDate: z.string().optional(),
  stripeInvoiceId: z.string().optional(),
  stripePaymentIntentId: z.string().optional(),
  pdfUrl: z.string().optional(),
  hostedInvoiceUrl: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const paymentMethodSchema = z.object({
  id: z.string().min(1, "L'ID de la méthode de paiement est requis"),
  organizationId: z.string().min(1, "L'organisation est requise"),
  type: z.enum(["card", "bank_account", "sepa_debit", "ideal", "sofort"]),
  brand: z.string().optional(),
  last4: z.string().optional(),
  expMonth: z.number().optional(),
  expYear: z.number().optional(),
  isDefault: z.boolean().default(false),
  stripePaymentMethodId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const usageSchema = z.object({
  id: z.string().min(1, "L'ID de l'usage est requis"),
  organizationId: z.string().min(1, "L'organisation est requise"),
  period: z.string().min(1, "La période est requise"),
  projects: z.number().min(0).default(0),
  users: z.number().min(0).default(0),
  storage: z.number().min(0).default(0), // in GB
  apiCalls: z.number().min(0).default(0),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const billingAddressSchema = z.object({
  line1: z.string().min(1, "L'adresse est requise"),
  line2: z.string().optional(),
  city: z.string().min(1, "La ville est requise"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Le code postal est requis"),
  country: z.string().min(1, "Le pays est requis"),
});

export const taxIdSchema = z.object({
  type: z.enum(["eu_vat", "au_abn", "au_arn", "br_cnpj", "br_cpf", "ca_bn", "ca_gst_hst", "ca_pst_bc", "ca_pst_mb", "ca_pst_sk", "ca_qst", "ch_vat", "cl_tin", "es_cif", "eu_oss_vat", "gb_vat", "ge_vat", "hk_br", "hu_tin", "id_npwp", "il_vat", "in_gst", "is_vat", "jp_cn", "jp_rn", "kr_brn", "li_uid", "mx_rfc", "my_frp", "my_itn", "my_sst", "no_vat", "nz_gst", "ru_inn", "ru_kpp", "sa_vat", "sg_gst", "sg_uen", "si_tin", "th_vat", "tw_vat", "ua_vat", "us_ein", "za_vat"]),
  value: z.string().min(1, "La valeur est requise"),
});

// Types TypeScript
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema> & {
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  subscriptions?: Subscription[] | undefined;
  usage?: Usage[] | undefined;
};

export type Subscription = z.infer<typeof subscriptionSchema> & {
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  plan: SubscriptionPlan;
  invoices?: Invoice[] | undefined;
  paymentMethods?: PaymentMethod[] | undefined;
  usage?: Usage[] | undefined;
};

export type Invoice = z.infer<typeof invoiceSchema> & {
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  subscription: Subscription;
  organization: {
    id: string;
    name: string;
    email: string;
  };
};

export type PaymentMethod = z.infer<typeof paymentMethodSchema> & {
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  organization: {
    id: string;
    name: string;
    email: string;
  };
};

export type Usage = z.infer<typeof usageSchema> & {
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  organization: {
    id: string;
    name: string;
    email: string;
  };
  plan: SubscriptionPlan;
  subscription: Subscription;
};

export type BillingAddress = z.infer<typeof billingAddressSchema>;
export type TaxId = z.infer<typeof taxIdSchema>;

// Types pour les vues
export interface SubscriptionPlanListView {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits: {
    projects: number;
    users: number;
    storage: number;
    apiCalls: number;
    support: string;
  };
  isActive: boolean;
  isPopular: boolean;
  trialDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionListView {
  id: string;
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
  };
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialStart?: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceListView {
  id: string;
  number: string;
  status: string;
  amount: number;
  currency: string;
  tax: number;
  total: number;
  paidAt?: Date;
  dueDate?: Date;
  pdfUrl?: string;
  hostedInvoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethodListView {
  id: string;
  type: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageListView {
  id: string;
  period: string;
  projects: number;
  users: number;
  storage: number;
  apiCalls: number;
  limits: {
    projects: number;
    users: number;
    storage: number;
    apiCalls: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les statistiques
export interface BillingStats {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  trialSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  byPlan: Array<{
    planId: string;
    planName: string;
    count: number;
    revenue: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    subscriptions: number;
    churn: number;
  }>;
}

export interface UsageStats {
  totalProjects: number;
  totalUsers: number;
  totalStorage: number;
  totalApiCalls: number;
  byPlan: Array<{
    planId: string;
    planName: string;
    projects: number;
    users: number;
    storage: number;
    apiCalls: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    projects: number;
    users: number;
    storage: number;
    apiCalls: number;
  }>;
}

// Types pour les exports
export interface BillingExport {
  format: "CSV" | "PDF" | "EXCEL";
  data: {
    subscriptions?: Subscription[];
    invoices?: Invoice[];
    usage?: Usage[];
  };
  includeDetails: boolean;
  includeMetadata: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Types pour les filtres
export interface SubscriptionFilters {
  search?: string;
  planId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface InvoiceFilters {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface UsageFilters {
  search?: string;
  planId?: string;
  startDate?: string;
  endDate?: string;
}

// Types pour les limitations
export interface PlanLimits {
  projects: number;
  users: number;
  storage: number; // in GB
  apiCalls: number;
  support: "email" | "priority" | "dedicated";
  features: string[];
}

export interface UsageLimits {
  projects: number;
  users: number;
  storage: number; // in GB
  apiCalls: number;
}

export interface LimitCheck {
  isExceeded: boolean;
  exceededLimits: string[];
  remainingLimits: UsageLimits;
  upgradeRequired: boolean;
  suggestedPlan?: string;
}

// Types pour les webhooks Stripe
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string;
    idempotency_key: string;
  };
}

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  description?: string;
  metadata: Record<string, string>;
  created: number;
  default_source?: string;
  invoice_settings?: {
    default_payment_method?: string;
  };
  address?: BillingAddress;
  tax_ids?: TaxId[];
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  trial_start?: number;
  trial_end?: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        product: string;
        unit_amount: number;
        currency: string;
        recurring: {
          interval: string;
          interval_count: number;
        };
      };
      quantity: number;
    }>;
  };
  metadata: Record<string, string>;
}

export interface StripeInvoice {
  id: string;
  customer: string;
  subscription?: string;
  status: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  tax: number;
  total: number;
  paid_at?: number;
  due_date?: number;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
  metadata: Record<string, string>;
}

export interface StripePaymentMethod {
  id: string;
  customer: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  metadata: Record<string, string>;
}

// Types pour les intégrations
export interface StripeIntegration {
  enabled: boolean;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  testMode: boolean;
}

export interface BillingIntegration {
  stripe: StripeIntegration;
  taxProvider?: string;
  invoiceProvider?: string;
  paymentProvider?: string;
}

