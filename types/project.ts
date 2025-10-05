import { z } from "zod";

// Schémas de validation Zod
export const projectSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  type: z.enum(["CONCERT", "THEATRE", "DANSE", "CIRQUE", "AUTRE"]),
  status: z.enum(["DRAFT", "DEVELOPMENT", "PRODUCTION", "TOUR", "ARCHIVED"]),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  venue: z.string().optional(),
  budget: z.number().min(0, "Le budget doit être positif").optional(),
  teamSize: z.number().min(1, "L'équipe doit compter au moins 1 personne").optional(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const projectUpdateSchema = projectSchema.partial();

export const projectFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  venue: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Types TypeScript
export type Project = z.infer<typeof projectSchema> & {
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
  contacts?: ProjectContact[];
  planningItems?: PlanningItem[];
  budgetItems?: BudgetItem[];
  technicalSheets?: TechnicalSheet[];
  documents?: Document[];
};

export type ProjectFormData = z.infer<typeof projectSchema>;
export type ProjectUpdateData = z.infer<typeof projectUpdateSchema>;
export type ProjectFilters = z.infer<typeof projectFiltersSchema>;

// Types pour les relations
export interface ProjectContact {
  id: string;
  projectId: string;
  contactId: string;
  role: string;
  contact: {
    id: string;
    name: string;
    email: string;
    type: string;
  };
}

export interface PlanningItem {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  type: string;
  status: string;
}

export interface BudgetItem {
  id: string;
  projectId: string;
  category: string;
  description: string;
  amount: number;
  status: string;
  date: Date;
}

export interface TechnicalSheet {
  id: string;
  projectId: string;
  title: string;
  type: string;
  status: string;
  lastModified: Date;
}

export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

// Types pour les vues
export interface ProjectListView {
  id: string;
  name: string;
  type: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  venue?: string;
  budget?: number;
  teamSize?: number;
  progress: number;
  createdBy: string;
  createdAt: Date;
}

export interface ProjectKanbanView {
  id: string;
  name: string;
  type: string;
  status: string;
  startDate: Date;
  venue?: string;
  budget?: number;
  teamSize?: number;
  progress: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  tags: string[];
}

// Types pour les actions bulk
export interface BulkAction {
  type: "DELETE" | "ARCHIVE" | "UPDATE_STATUS" | "UPDATE_TYPE" | "EXPORT";
  projectIds: string[];
  data?: any;
}

// Types pour l'import/export
export interface ProjectCSVRow {
  name: string;
  description?: string | undefined;
  type: string;
  status: string;
  startDate: string;
  endDate?: string | undefined;
  venue?: string | undefined;
  budget?: string | undefined;
  teamSize?: string | undefined;
  isPublic: string;
  tags?: string | undefined;
}

export interface ImportResult {
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

