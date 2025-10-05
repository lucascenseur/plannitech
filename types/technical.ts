import { z } from "zod";

// Schémas de validation Zod
export const technicalSheetSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Le projet est requis"),
  type: z.enum(["LIGHTING", "SOUND", "VIDEO", "STAGE", "SAFETY", "OTHER"]),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "ARCHIVED"]).default("DRAFT"),
  version: z.string().default("1.0"),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    order: z.number(),
    isRequired: z.boolean().default(false),
  })),
  equipment: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().min(0),
    unit: z.string(),
    description: z.string().optional(),
    specifications: z.record(z.any()).optional(),
  })),
  requirements: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    isRequired: z.boolean().default(true),
    category: z.string(),
  })),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const technicalSheetUpdateSchema = technicalSheetSchema.partial();

export const firePlanSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Le projet est requis"),
  type: z.enum(["LIGHTING", "SOUND", "VIDEO", "STAGE", "SAFETY", "OTHER"]),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "ARCHIVED"]).default("DRAFT"),
  version: z.string().default("1.0"),
  diagram: z.string().optional(), // Base64 encoded diagram
  elements: z.array(z.object({
    id: z.string(),
    type: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    size: z.object({
      width: z.number(),
      height: z.number(),
    }),
    properties: z.record(z.any()).optional(),
    label: z.string().optional(),
  })),
  connections: z.array(z.object({
    id: z.string(),
    from: z.string(),
    to: z.string(),
    type: z.string(),
    properties: z.record(z.any()).optional(),
  })),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const firePlanUpdateSchema = firePlanSchema.partial();

export const equipmentSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  category: z.enum(["LIGHTING", "SOUND", "VIDEO", "STAGE", "SAFETY", "OTHER"]),
  type: z.string().min(1, "Le type est requis"),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "RETIRED"]).default("AVAILABLE"),
  location: z.string().optional(),
  specifications: z.record(z.any()).optional(),
  purchaseDate: z.string().optional(),
  warrantyExpiry: z.string().optional(),
  maintenanceSchedule: z.array(z.object({
    id: z.string(),
    type: z.string(),
    date: z.string(),
    description: z.string(),
    completed: z.boolean().default(false),
  })).optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const equipmentUpdateSchema = equipmentSchema.partial();

export const checklistSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Le projet est requis"),
  type: z.enum(["SETUP", "TEARDOWN", "MAINTENANCE", "SAFETY", "OTHER"]),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"]).default("DRAFT"),
  version: z.string().default("1.0"),
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
    isRequired: z.boolean().default(true),
    category: z.string().optional(),
    estimatedTime: z.number().optional(), // in minutes
    assignedTo: z.string().optional(),
    completed: z.boolean().default(false),
    completedAt: z.string().optional(),
    completedBy: z.string().optional(),
    notes: z.string().optional(),
  })),
  estimatedDuration: z.number().optional(), // in minutes
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const checklistUpdateSchema = checklistSchema.partial();

export const technicalConductorSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Le projet est requis"),
  type: z.enum(["LIGHTING", "SOUND", "VIDEO", "STAGE", "SAFETY", "OTHER"]),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "ARCHIVED"]).default("DRAFT"),
  version: z.string().default("1.0"),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    order: z.number(),
    isRequired: z.boolean().default(false),
    estimatedTime: z.number().optional(), // in minutes
  })),
  equipment: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().min(0),
    unit: z.string(),
    description: z.string().optional(),
    specifications: z.record(z.any()).optional(),
  })),
  requirements: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    isRequired: z.boolean().default(true),
    category: z.string(),
  })),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const technicalConductorUpdateSchema = technicalConductorSchema.partial();

export const templateSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  type: z.enum(["TECHNICAL_SHEET", "FIRE_PLAN", "CHECKLIST", "CONDUCTOR"]),
  category: z.string().optional(),
  isPublic: z.boolean().default(false),
  content: z.record(z.any()),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const templateUpdateSchema = templateSchema.partial();

export const documentVersionSchema = z.object({
  documentId: z.string().min(1, "L'ID du document est requis"),
  documentType: z.enum(["TECHNICAL_SHEET", "FIRE_PLAN", "CHECKLIST", "CONDUCTOR"]),
  version: z.string().min(1, "La version est requise"),
  changes: z.string().optional(),
  content: z.record(z.any()),
  isCurrent: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

export const documentVersionUpdateSchema = documentVersionSchema.partial();

// Types TypeScript
export type TechnicalSheet = z.infer<typeof technicalSheetSchema> & {
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
  versions?: DocumentVersion[];
  equipment?: Equipment[];
};

export type FirePlan = z.infer<typeof firePlanSchema> & {
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
  versions?: DocumentVersion[];
};

export type Equipment = z.infer<typeof equipmentSchema> & {
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
  availability?: EquipmentAvailability[];
  maintenance?: EquipmentMaintenance[];
};

export type Checklist = z.infer<typeof checklistSchema> & {
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
  versions?: DocumentVersion[];
  progress?: number;
  completedItems?: number;
  totalItems?: number;
};

export type TechnicalConductor = z.infer<typeof technicalConductorSchema> & {
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
  versions?: DocumentVersion[];
};

export type Template = z.infer<typeof templateSchema> & {
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
  usageCount?: number;
};

export type DocumentVersion = z.infer<typeof documentVersionSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
};

// Types pour les relations
export interface EquipmentAvailability {
  id: string;
  equipmentId: string;
  startDate: Date;
  endDate: Date;
  status: "AVAILABLE" | "RESERVED" | "IN_USE" | "MAINTENANCE";
  projectId?: string;
  project?: {
    id: string;
    name: string;
  };
  notes?: string;
}

export interface EquipmentMaintenance {
  id: string;
  equipmentId: string;
  type: string;
  date: Date;
  description: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
  cost?: number;
  notes?: string;
}

// Types pour les vues
export interface TechnicalSheetListView {
  id: string;
  name: string;
  type: string;
  status: string;
  version: string;
  project: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FirePlanListView {
  id: string;
  name: string;
  type: string;
  status: string;
  version: string;
  project: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentListView {
  id: string;
  name: string;
  category: string;
  type: string;
  brand?: string;
  model?: string;
  status: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistListView {
  id: string;
  name: string;
  type: string;
  status: string;
  version: string;
  project: {
    id: string;
    name: string;
  };
  progress: number;
  completedItems: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnicalConductorListView {
  id: string;
  name: string;
  type: string;
  status: string;
  version: string;
  project: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateListView {
  id: string;
  name: string;
  type: string;
  category?: string;
  isPublic: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les statistiques
export interface TechnicalStats {
  totalSheets: number;
  totalFirePlans: number;
  totalEquipment: number;
  totalChecklists: number;
  totalConductors: number;
  totalTemplates: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byProject: Array<{
    projectId: string;
    projectName: string;
    sheets: number;
    firePlans: number;
    checklists: number;
    conductors: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    sheets: number;
    firePlans: number;
    checklists: number;
    conductors: number;
  }>;
}

export interface EquipmentStats {
  totalEquipment: number;
  available: number;
  inUse: number;
  maintenance: number;
  retired: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  byLocation: Record<string, number>;
  maintenanceDue: number;
  warrantyExpiring: number;
}

export interface ChecklistStats {
  totalChecklists: number;
  active: number;
  completed: number;
  draft: number;
  archived: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  averageCompletion: number;
  overdue: number;
}

// Types pour les exports
export interface TechnicalExport {
  format: "PDF" | "CSV" | "EXCEL";
  documents: (TechnicalSheet | FirePlan | Checklist | TechnicalConductor)[];
  includeVersions: boolean;
  includeEquipment: boolean;
  includeDiagrams: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface EquipmentExport {
  format: "PDF" | "CSV" | "EXCEL";
  equipment: Equipment[];
  includeAvailability: boolean;
  includeMaintenance: boolean;
  includeSpecifications: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Types pour les filtres
export interface TechnicalSheetFilters {
  search?: string;
  projectId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface FirePlanFilters {
  search?: string;
  projectId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface EquipmentFilters {
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  location?: string;
  brand?: string;
  startDate?: string;
  endDate?: string;
}

export interface ChecklistFilters {
  search?: string;
  projectId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface TechnicalConductorFilters {
  search?: string;
  projectId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface TemplateFilters {
  search?: string;
  type?: string;
  category?: string;
  isPublic?: boolean;
  startDate?: string;
  endDate?: string;
}

// Types pour les diagrammes
export interface DiagramElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: Record<string, any>;
  label?: string;
}

export interface DiagramConnection {
  id: string;
  from: string;
  to: string;
  type: string;
  properties: Record<string, any>;
}

export interface DiagramData {
  elements: DiagramElement[];
  connections: DiagramConnection[];
  metadata?: Record<string, any>;
}

// Types pour les intégrations
export interface DrawIOIntegration {
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
}

export interface ExcalidrawIntegration {
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
}

export interface TechnicalIntegrations {
  drawIO: DrawIOIntegration;
  excalidraw: ExcalidrawIntegration;
}

