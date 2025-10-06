import { z } from "zod";

// Schémas de validation Zod
export const teamMemberSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  role: z.enum(["MANAGER", "TECHNICIAN", "ARTIST", "ADMINISTRATIVE", "SECURITY", "OTHER"]),
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]).default("ACTIVE"),
  hourlyRate: z.number().min(0, "Le taux horaire doit être positif").optional(),
  isIntermittent: z.boolean().default(false),
  intermittentNumber: z.string().optional(),
  skills: z.array(z.string()).default([]),
  availability: z.object({
    monday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }),
    tuesday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }),
    wednesday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }),
    thursday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }),
    friday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }),
    saturday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }),
    sunday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }),
  }).optional(),
  notes: z.string().optional(),
});

export const venueSchema = z.object({
  name: z.string().min(1, "Le nom du lieu est requis"),
  type: z.enum(["THEATER", "CONCERT_HALL", "STUDIO", "OUTDOOR", "CONFERENCE_ROOM", "OTHER"]),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  capacity: z.number().min(1, "La capacité doit être positive").optional(),
  technicalInfo: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  hourlyRate: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const providerSchema = z.object({
  name: z.string().min(1, "Le nom du prestataire est requis"),
  type: z.enum(["SOUND", "LIGHTING", "VIDEO", "CATERING", "SECURITY", "TRANSPORT", "EQUIPMENT", "OTHER"]),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  address: z.string().optional(),
  siret: z.string().optional(),
  hourlyRate: z.number().min(0).optional(),
  equipment: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Le titre de la tâche est requis"),
  description: z.string().optional(),
  type: z.enum(["SETUP", "PERFORMANCE", "BREAKDOWN", "REHEARSAL", "MEETING", "TRAVEL", "OTHER"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PENDING"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  estimatedHours: z.number().min(0).optional(),
  actualHours: z.number().min(0).optional(),
  venueId: z.string().optional(),
  projectId: z.string().optional(),
  assignedMembers: z.array(z.string()).default([]),
  assignedProviders: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const taskTemplateSchema = z.object({
  name: z.string().min(1, "Le nom du template est requis"),
  description: z.string().optional(),
  type: z.enum(["SETUP", "PERFORMANCE", "BREAKDOWN", "REHEARSAL", "MEETING", "TRAVEL", "OTHER"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  duration: z.number().min(0, "La durée doit être positive"), // en heures
  startTime: z.string().optional(), // format HH:MM
  endTime: z.string().optional(), // format HH:MM
  defaultVenueId: z.string().optional(),
  defaultMembers: z.array(z.string()).default([]),
  defaultProviders: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  notes: z.string().optional(),
  category: z.string().optional(), // pour organiser les templates
  isRecurring: z.boolean().default(false),
  recurringPattern: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
  tags: z.array(z.string()).default([]),
});

// Types TypeScript
export type TeamMember = z.infer<typeof teamMemberSchema> & {
  id: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  totalHoursWorked?: number;
  totalEarnings?: number;
};

export type Venue = z.infer<typeof venueSchema> & {
  id: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  totalBookings?: number;
  totalRevenue?: number;
};

export type Provider = z.infer<typeof providerSchema> & {
  id: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  totalHoursWorked?: number;
  totalEarnings?: number;
};

export type Task = z.infer<typeof taskSchema> & {
  id: string;
  organizationId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  assignedMembers?: TeamMember[];
  assignedProviders?: Provider[];
  venue?: Venue;
  project?: any;
  totalCost?: number;
  totalHours?: number;
};

export type TaskTemplate = z.infer<typeof taskTemplateSchema> & {
  id: string;
  organizationId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount?: number; // nombre de fois utilisé
  lastUsed?: Date;
};

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
export type VenueFormData = z.infer<typeof venueSchema>;
export type ProviderFormData = z.infer<typeof providerSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type TaskTemplateFormData = z.infer<typeof taskTemplateSchema>;

// Types pour les calculs légaux français
export interface FrenchLaborLaw {
  maxDailyHours: number; // 10h par jour
  maxWeeklyHours: number; // 48h par semaine
  maxAnnualHours: number; // 2184h par an
  minRestBetweenShifts: number; // 11h de repos entre deux journées
  minWeeklyRest: number; // 35h de repos par semaine
  overtimeRate: number; // 1.25 pour les heures sup (36-43h), 1.5 pour 44h+
  nightWorkRate: number; // 1.2 pour le travail de nuit (22h-6h)
  sundayWorkRate: number; // 1.2 pour le travail le dimanche
  holidayWorkRate: number; // 2.0 pour les jours fériés
}

export const FRENCH_LABOR_LAW: FrenchLaborLaw = {
  maxDailyHours: 10,
  maxWeeklyHours: 48,
  maxAnnualHours: 2184,
  minRestBetweenShifts: 11,
  minWeeklyRest: 35,
  overtimeRate: 1.25,
  nightWorkRate: 1.2,
  sundayWorkRate: 1.2,
  holidayWorkRate: 2.0,
};

// Types pour les calculs de temps
export interface TimeCalculation {
  regularHours: number;
  overtimeHours: number;
  nightHours: number;
  sundayHours: number;
  holidayHours: number;
  totalHours: number;
  regularPay: number;
  overtimePay: number;
  nightPay: number;
  sundayPay: number;
  holidayPay: number;
  totalPay: number;
  restTime: number;
  isCompliant: boolean;
  violations: string[];
}

// Types pour les statistiques d'équipe
export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  totalHoursWorked: number;
  totalEarnings: number;
  averageHoursPerMember: number;
  averageEarningsPerMember: number;
  complianceRate: number;
  upcomingTasks: number;
  overdueTasks: number;
}

// Types pour les vues
export interface TeamMemberListView {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  hourlyRate: number;
  totalHours: number;
  totalEarnings: number;
  isIntermittent: boolean;
  skills: string[];
  lastActivity: Date;
}

export interface TaskListView {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  startDate: Date;
  endDate: Date;
  assignedMembers: string[];
  estimatedHours: number;
  actualHours: number;
  totalCost: number;
  venue: string;
  project: string;
}

// Types pour les plannings et export PDF
export interface PlanningView {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  assignedMembers: string[];
  assignedProviders: string[];
  venue: string;
  project: string;
  requirements: string[];
  notes: string;
  totalCost: number;
}

export interface PlanningPeriod {
  startDate: Date;
  endDate: Date;
  type: 'DAY' | 'WEEK' | 'MONTH' | 'CUSTOM';
  tasks: PlanningView[];
}

export interface PlanningExportOptions {
  period: PlanningPeriod;
  includeMembers: boolean;
  includeProviders: boolean;
  includeCosts: boolean;
  includeRequirements: boolean;
  includeNotes: boolean;
  format: 'PDF' | 'EXCEL' | 'CSV';
  template: 'DEFAULT' | 'COMPACT' | 'DETAILED';
  language: 'fr' | 'en' | 'es';
}

export interface PlanningPDFData {
  organization: {
    name: string;
    address: string;
    logo?: string;
  };
  period: {
    start: Date;
    end: Date;
    type: string;
  };
  tasks: PlanningView[];
  summary: {
    totalTasks: number;
    totalHours: number;
    totalCost: number;
    members: string[];
    venues: string[];
  };
  generatedAt: Date;
}
