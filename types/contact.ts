import { z } from "zod";

// Schémas de validation Zod
export const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional(),
  type: z.enum(["ARTIST", "TECHNICIAN", "VENUE", "SUPPLIER", "OTHER"]),
  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).default("ACTIVE"),
  description: z.string().optional(),
  website: z.string().url("URL invalide").optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  socialMedia: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  isIntermittent: z.boolean().default(false),
  intermittentNumber: z.string().optional(),
  siret: z.string().optional(),
  apeCode: z.string().optional(),
  vatNumber: z.string().optional(),
  bankDetails: z.object({
    iban: z.string().optional(),
    bic: z.string().optional(),
    bankName: z.string().optional(),
  }).optional(),
  skills: z.array(z.string()).optional(),
  rates: z.array(z.object({
    type: z.string(),
    amount: z.number(),
    currency: z.string().default("EUR"),
    unit: z.enum(["HOUR", "DAY", "PROJECT", "PERFORMANCE"]),
  })).optional(),
  availability: z.array(z.object({
    startDate: z.string(),
    endDate: z.string(),
    status: z.enum(["AVAILABLE", "BUSY", "UNAVAILABLE"]),
    reason: z.string().optional(),
  })).optional(),
  tags: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  isFavorite: z.boolean().default(false),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const contactUpdateSchema = contactSchema.partial();

export const contactFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  isIntermittent: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  availability: z.string().optional(),
  rateRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
});

// Types TypeScript
export type Contact = z.infer<typeof contactSchema> & {
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
  organization: {
    id: string;
    name: string;
  };
  collaborations?: Collaboration[];
  documents?: Document[];
  groups?: ContactGroup[];
  tags?: ContactTag[];
};

export type ContactFormData = z.infer<typeof contactSchema>;
export type ContactUpdateData = z.infer<typeof contactUpdateSchema>;
export type ContactFilters = z.infer<typeof contactFiltersSchema>;

// Types pour les relations
export interface Collaboration {
  id: string;
  contactId: string;
  projectId: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  rating?: number;
  feedback?: string;
  project: {
    id: string;
    name: string;
    type: string;
  };
}

export interface Document {
  id: string;
  contactId: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: {
    id: string;
    name: string;
  };
}

export interface ContactGroup {
  id: string;
  name: string;
  description?: string;
  color: string;
  contactCount: number;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface ContactTag {
  id: string;
  name: string;
  color: string;
  contactCount: number;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
}

// Types pour les vues
export interface ContactListView {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: string;
  status: string;
  isIntermittent: boolean;
  isFavorite: boolean;
  skills: string[];
  tags: string[];
  groups: string[];
  lastCollaboration?: Date;
  rating?: number;
  createdAt: Date;
}

export interface ContactCardView {
  id: string;
  name: string;
  type: string;
  status: string;
  avatar?: string;
  skills: string[];
  tags: string[];
  isFavorite: boolean;
  rating?: number;
  lastActivity: Date;
}

// Types pour l'import/export
export interface ContactCSVRow {
  name: string;
  email?: string;
  phone?: string;
  type: string;
  description?: string;
  website?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  isIntermittent: string;
  intermittentNumber?: string;
  siret?: string;
  apeCode?: string;
  vatNumber?: string;
  skills?: string;
  tags?: string;
  groups?: string;
  notes?: string;
}

export interface ContactImportResult {
  success: number;
  errors: Array<{
    row: number;
    errors: string[];
  }>;
  warnings: Array<{
    row: number;
    message: string;
  }>;
}

// Types pour les compétences
export interface Skill {
  id: string;
  name: string;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  yearsOfExperience?: number;
  certifications?: string[];
  description?: string;
}

// Types pour les tarifs
export interface Rate {
  id: string;
  contactId: string;
  type: string;
  amount: number;
  currency: string;
  unit: "HOUR" | "DAY" | "PROJECT" | "PERFORMANCE";
  validFrom: Date;
  validTo?: Date;
  conditions?: string;
  isActive: boolean;
}

// Types pour les disponibilités
export interface Availability {
  id: string;
  contactId: string;
  startDate: Date;
  endDate: Date;
  status: "AVAILABLE" | "BUSY" | "UNAVAILABLE";
  reason?: string;
  location?: string;
  notes?: string;
}

// Types pour les statistiques
export interface ContactStats {
  totalContacts: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  bySkills: Record<string, number>;
  byTags: Record<string, number>;
  byGroups: Record<string, number>;
  favorites: number;
  intermittents: number;
  recentActivity: number;
  averageRating: number;
}

// Types pour les favoris
export interface FavoriteContact {
  id: string;
  contactId: string;
  userId: string;
  addedAt: Date;
  contact: Contact;
}

// Types pour les recherches
export interface ContactSearchResult {
  id: string;
  name: string;
  type: string;
  status: string;
  skills: string[];
  tags: string[];
  groups: string[];
  score: number;
  highlights: string[];
}

// Types pour les exports
export interface ContactExport {
  format: "CSV" | "VCARD" | "PDF";
  contacts: Contact[];
  fields: string[];
  includeSkills: boolean;
  includeRates: boolean;
  includeAvailability: boolean;
  includeCollaborations: boolean;
}

// Types pour les templates
export interface ContactTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  fields: Record<string, any>;
  isDefault: boolean;
  createdAt: Date;
  createdBy: string;
}

