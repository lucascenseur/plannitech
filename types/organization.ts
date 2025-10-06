import { z } from "zod";

// Schémas de validation Zod
export const organizationSchema = z.object({
  name: z.string().min(1, "Le nom de l'organisation est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  type: z.enum(["COMPANY", "FREELANCER", "ASSOCIATION", "VENUE", "OTHER"]),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).default("ACTIVE"),
  website: z.string().optional(),
  logo: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  contact: z.object({
    email: z.string().email("Email invalide").optional(),
    phone: z.string().optional(),
  }).optional(),
  settings: z.object({
    timezone: z.string().default("Europe/Paris"),
    currency: z.string().default("EUR"),
    language: z.string().default("fr"),
    dateFormat: z.string().default("DD/MM/YYYY"),
  }).optional(),
  billing: z.object({
    plan: z.enum(["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"]).default("FREE"),
    status: z.enum(["ACTIVE", "CANCELLED", "PAST_DUE", "UNPAID"]).default("ACTIVE"),
    billingCycle: z.enum(["MONTHLY", "YEARLY"]).default("MONTHLY"),
    nextBillingDate: z.string().optional(),
    maxUsers: z.number().default(1),
    maxProjects: z.number().default(5),
    maxStorage: z.number().default(1000), // en MB
  }).optional(),
  features: z.object({
    advancedReporting: z.boolean().default(false),
    customBranding: z.boolean().default(false),
    apiAccess: z.boolean().default(false),
    prioritySupport: z.boolean().default(false),
    whiteLabel: z.boolean().default(false),
  }).optional(),
});

export const organizationMemberSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "MEMBER", "VIEWER"]),
  status: z.enum(["ACTIVE", "INVITED", "SUSPENDED"]).default("INVITED"),
  permissions: z.object({
    canManageProjects: z.boolean().default(false),
    canManageContacts: z.boolean().default(false),
    canManageBudget: z.boolean().default(false),
    canManageTechnical: z.boolean().default(false),
    canManagePlanning: z.boolean().default(false),
    canManageUsers: z.boolean().default(false),
    canManageBilling: z.boolean().default(false),
    canViewReports: z.boolean().default(false),
  }).optional(),
  invitedAt: z.string().optional(),
  joinedAt: z.string().optional(),
  invitedBy: z.string().optional(),
});

export const organizationInviteSchema = z.object({
  email: z.string().email("Email invalide"),
  role: z.enum(["ADMIN", "MANAGER", "MEMBER", "VIEWER"]),
  message: z.string().optional(),
  expiresAt: z.string().optional(),
});

// Types TypeScript
export type Organization = z.infer<typeof organizationSchema> & {
  id: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  members?: OrganizationMember[];
  projects?: any[];
  contacts?: any[];
  budgets?: any[];
  events?: any[];
};

export type OrganizationMember = z.infer<typeof organizationMemberSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  organization: Organization;
  invitedBy?: {
    id: string;
    name: string;
    email: string;
  };
};

export type OrganizationInvite = z.infer<typeof organizationInviteSchema> & {
  id: string;
  organizationId: string;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED";
  createdAt: Date;
  expiresAt: Date;
  invitedBy: string;
  organization: Organization;
};

export type OrganizationFormData = z.infer<typeof organizationSchema>;
export type OrganizationMemberFormData = z.infer<typeof organizationMemberSchema>;
export type OrganizationInviteFormData = z.infer<typeof organizationInviteSchema>;

// Types pour les plans de facturation
export interface BillingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    maxUsers: number;
    maxProjects: number;
    maxStorage: number; // en MB
    advancedReporting: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    whiteLabel: boolean;
  };
  limits: {
    projects: number;
    contacts: number;
    events: number;
    storage: number;
  };
  popular?: boolean;
}

export const BILLING_PLANS: BillingPlan[] = [
  {
    id: "FREE",
    name: "Gratuit",
    description: "Parfait pour commencer",
    price: { monthly: 0, yearly: 0 },
    features: {
      maxUsers: 1,
      maxProjects: 5,
      maxStorage: 1000,
      advancedReporting: false,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
      whiteLabel: false,
    },
    limits: {
      projects: 5,
      contacts: 100,
      events: 50,
      storage: 1000,
    },
  },
  {
    id: "STARTER",
    name: "Starter",
    description: "Pour les petites équipes",
    price: { monthly: 29, yearly: 290 },
    features: {
      maxUsers: 5,
      maxProjects: 25,
      maxStorage: 5000,
      advancedReporting: true,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
      whiteLabel: false,
    },
    limits: {
      projects: 25,
      contacts: 500,
      events: 250,
      storage: 5000,
    },
  },
  {
    id: "PROFESSIONAL",
    name: "Professionnel",
    description: "Pour les équipes en croissance",
    price: { monthly: 79, yearly: 790 },
    features: {
      maxUsers: 15,
      maxProjects: 100,
      maxStorage: 20000,
      advancedReporting: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: true,
      whiteLabel: false,
    },
    limits: {
      projects: 100,
      contacts: 2000,
      events: 1000,
      storage: 20000,
    },
    popular: true,
  },
  {
    id: "ENTERPRISE",
    name: "Entreprise",
    description: "Pour les grandes organisations",
    price: { monthly: 199, yearly: 1990 },
    features: {
      maxUsers: -1, // Illimité
      maxProjects: -1, // Illimité
      maxStorage: 100000,
      advancedReporting: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: true,
      whiteLabel: true,
    },
    limits: {
      projects: -1,
      contacts: -1,
      events: -1,
      storage: 100000,
    },
  },
];

// Types pour les permissions
export interface UserPermissions {
  canManageProjects: boolean;
  canManageContacts: boolean;
  canManageBudget: boolean;
  canManageTechnical: boolean;
  canManagePlanning: boolean;
  canManageUsers: boolean;
  canManageBilling: boolean;
  canViewReports: boolean;
}

export const ROLE_PERMISSIONS: Record<string, UserPermissions> = {
  OWNER: {
    canManageProjects: true,
    canManageContacts: true,
    canManageBudget: true,
    canManageTechnical: true,
    canManagePlanning: true,
    canManageUsers: true,
    canManageBilling: true,
    canViewReports: true,
  },
  ADMIN: {
    canManageProjects: true,
    canManageContacts: true,
    canManageBudget: true,
    canManageTechnical: true,
    canManagePlanning: true,
    canManageUsers: true,
    canManageBilling: false,
    canViewReports: true,
  },
  MANAGER: {
    canManageProjects: true,
    canManageContacts: true,
    canManageBudget: true,
    canManageTechnical: true,
    canManagePlanning: true,
    canManageUsers: false,
    canManageBilling: false,
    canViewReports: true,
  },
  MEMBER: {
    canManageProjects: true,
    canManageContacts: true,
    canManageBudget: false,
    canManageTechnical: false,
    canManagePlanning: true,
    canManageUsers: false,
    canManageBilling: false,
    canViewReports: false,
  },
  VIEWER: {
    canManageProjects: false,
    canManageContacts: false,
    canManageBudget: false,
    canManageTechnical: false,
    canManagePlanning: false,
    canManageUsers: false,
    canManageBilling: false,
    canViewReports: true,
  },
};

// Types pour les vues
export interface OrganizationListView {
  id: string;
  name: string;
  type: string;
  status: string;
  memberCount: number;
  projectCount: number;
  plan: string;
  role: string;
  isOwner: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationCardView {
  id: string;
  name: string;
  type: string;
  status: string;
  memberCount: number;
  projectCount: number;
  plan: string;
  role: string;
  isOwner: boolean;
  logo?: string;
  lastActivity: Date;
}
