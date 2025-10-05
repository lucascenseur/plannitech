import { z } from "zod";

// Schémas de validation Zod
export const eventSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(100, "Le titre ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  allDay: z.boolean().default(false),
  location: z.string().optional(),
  type: z.enum(["REHEARSAL", "PERFORMANCE", "SETUP", "BREAKDOWN", "MEETING", "OTHER"]),
  status: z.enum(["CONFIRMED", "TENTATIVE", "CANCELLED"]).default("CONFIRMED"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  projectId: z.string().optional(),
  contactIds: z.array(z.string()).optional(),
  teamIds: z.array(z.string()).optional(),
  isRecurring: z.boolean().default(false),
  recurrence: z.object({
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    interval: z.number().min(1).default(1),
    endDate: z.string().optional(),
    count: z.number().min(1).optional(),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    dayOfMonth: z.number().min(1).max(31).optional(),
  }).optional(),
  reminders: z.array(z.object({
    type: z.enum(["EMAIL", "PUSH", "SMS"]),
    minutes: z.number().min(0),
  })).optional(),
  metadata: z.record(z.any()).optional(),
});

export const eventUpdateSchema = eventSchema.partial();

export const availabilitySchema = z.object({
  contactId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(["AVAILABLE", "BUSY", "UNAVAILABLE"]),
  reason: z.string().optional(),
});

export const conflictSchema = z.object({
  eventId: z.string(),
  conflictType: z.enum(["SCHEDULE", "RESOURCE", "TEAM"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  description: z.string(),
  affectedEvents: z.array(z.string()),
  resolution: z.string().optional(),
});

// Types TypeScript
export type Event = z.infer<typeof eventSchema> & {
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
  project?: {
    id: string;
    name: string;
    type: string;
  };
  contacts?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  team?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  conflicts?: Conflict[];
};

export type EventFormData = z.infer<typeof eventSchema>;
export type EventUpdateData = z.infer<typeof eventUpdateSchema>;
export type Availability = z.infer<typeof availabilitySchema>;
export type Conflict = z.infer<typeof conflictSchema>;

// Types pour les vues calendrier
export interface CalendarView {
  type: "month" | "week" | "day";
  date: Date;
  events: Event[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: string;
  status: string;
  priority: string;
  color: string;
  project?: {
    id: string;
    name: string;
  };
  contacts?: Array<{
    id: string;
    name: string;
  }>;
}

export interface TeamPlanningView {
  teamMember: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  events: CalendarEvent[];
  availability: {
    start: Date;
    end: Date;
    status: string;
  }[];
  conflicts: Conflict[];
}

// Types pour les récurrences
export interface RecurrenceRule {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  interval: number;
  endDate?: Date;
  count?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

// Types pour les notifications
export interface EventNotification {
  id: string;
  eventId: string;
  type: "REMINDER" | "CHANGE" | "CANCELLATION" | "CONFLICT";
  message: string;
  scheduledFor: Date;
  sent: boolean;
  recipients: string[];
}

// Types pour l'export
export interface CalendarExport {
  format: "ICAL" | "GOOGLE";
  events: Event[];
  startDate: Date;
  endDate: Date;
}

// Types pour les filtres
export interface PlanningFilters {
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  projectId?: string;
  contactId?: string;
  teamId?: string;
  startDate?: string;
  endDate?: string;
  showConflicts?: boolean;
  showAvailability?: boolean;
}

// Types pour les statistiques
export interface PlanningStats {
  totalEvents: number;
  eventsThisWeek: number;
  eventsThisMonth: number;
  conflicts: number;
  availability: {
    available: number;
    busy: number;
    unavailable: number;
  };
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}

// Types pour les vues
export interface PlanningView {
  id: string;
  name: string;
  type: "calendar" | "team" | "project" | "resource";
  filters: PlanningFilters;
  layout: "month" | "week" | "day" | "agenda";
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

// Types pour les ressources
export interface Resource {
  id: string;
  name: string;
  type: "VENUE" | "EQUIPMENT" | "VEHICLE" | "OTHER";
  capacity?: number;
  location?: string;
  availability: {
    start: Date;
    end: Date;
    status: "AVAILABLE" | "BUSY" | "MAINTENANCE";
  }[];
  conflicts: Conflict[];
}

// Types pour les templates
export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  duration: number; // en minutes
  defaultLocation?: string;
  defaultTeam?: string[];
  defaultContacts?: string[];
  defaultReminders?: Array<{
    type: "EMAIL" | "PUSH" | "SMS";
    minutes: number;
  }>;
  metadata: Record<string, any>;
}

