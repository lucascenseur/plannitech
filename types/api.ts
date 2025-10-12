// Types pour les réponses API alignés avec le schéma Prisma

export interface ProjectResponse {
  id: string;
  title: string;
  description?: string;
  type: 'SPECTACLE' | 'EVENT' | 'TOUR';
  status: 'DRAFT' | 'IN_PROGRESS' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  currency: string;
  organizationId: string;
  createdById: string;
  venueId?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
  venue?: VenueResponse;
  contacts?: ProjectContactResponse[];
  createdBy?: {
    name?: string;
    email: string;
  };
}

export interface VenueResponse {
  id: string;
  name: string;
  type: string;
  address: string;
  capacity: number;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'BOOKED' | 'UNAVAILABLE';
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  facilities: string[];
  stageWidth?: number;
  stageDepth?: number;
  stageHeight?: number;
  rateDay?: number;
  rateWeek?: number;
  rating: number;
  organizationId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: {
    name?: string;
    email: string;
  };
}

export interface ContactResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: 'ARTIST' | 'TECHNICAL' | 'VENUE' | 'SUPPLIER' | 'OTHER';
  company?: string;
  role?: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastContact?: Date;
  organizationId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: {
    name?: string;
    email: string;
  };
}

export interface TechnicalSheetResponse {
  id: string;
  title: string;
  projectId: string;
  type: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'REJECTED';
  requirements: any;
  team: any;
  notes?: string;
  organizationId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  project?: ProjectResponse;
  createdBy?: {
    name?: string;
    email: string;
  };
}

export interface PlanningItemResponse {
  id: string;
  title: string;
  description?: string;
  type: 'SETUP' | 'REHEARSAL' | 'PERFORMANCE' | 'BREAKDOWN' | 'TRANSPORT' | 'CATERING' | 'OTHER';
  startTime: Date;
  endTime: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  projectId?: string;
  assignedToId?: string;
  equipmentId?: string;
  location?: string;
  notes?: string;
  organizationId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  project?: ProjectResponse;
  assignedTo?: ContactResponse;
  equipment?: EquipmentResponse;
  createdBy?: {
    name?: string;
    email: string;
  };
}

export interface EquipmentResponse {
  id: string;
  name: string;
  type: string;
  category: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  location?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  cost?: number;
  organizationId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: {
    name?: string;
    email: string;
  };
}

export interface ProjectContactResponse {
  id: string;
  projectId: string;
  contactId: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
  contact: ContactResponse;
}

export interface ActivityResponse {
  id: string;
  type: 'show' | 'venue' | 'team' | 'equipment' | 'planning';
  action: 'created' | 'updated' | 'deleted' | 'assigned';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name?: string;
    email: string;
  };
  metadata: any;
}

export interface SearchResultResponse {
  id: string;
  type: 'show' | 'venue' | 'team' | 'equipment' | 'planning';
  title: string;
  description: string;
  href: string;
  icon: string;
}

export interface ConflictResponse {
  id: string;
  type: 'resource_overlap' | 'equipment_overload' | 'schedule_conflict';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  items?: any[];
  equipment?: EquipmentResponse;
  count?: number;
  createdAt: string;
}

// Types pour les requêtes API
export interface CreateProjectRequest {
  title: string;
  description?: string;
  type: 'SPECTACLE' | 'EVENT' | 'TOUR';
  startDate?: string;
  endDate?: string;
  budget?: number;
  venueId?: string;
  metadata?: any;
}

export interface CreateVenueRequest {
  name: string;
  type: string;
  address: string;
  capacity: number;
  status?: 'AVAILABLE' | 'MAINTENANCE' | 'BOOKED' | 'UNAVAILABLE';
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  facilities?: string[];
  stageWidth?: number;
  stageDepth?: number;
  stageHeight?: number;
  rateDay?: number;
  rateWeek?: number;
  rating?: number;
}

export interface CreateContactRequest {
  name: string;
  email?: string;
  phone?: string;
  type: 'ARTIST' | 'TECHNICAL' | 'VENUE' | 'SUPPLIER' | 'OTHER';
  company?: string;
  role?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreateTechnicalSheetRequest {
  title: string;
  projectId: string;
  type: string;
  status?: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'REJECTED';
  requirements?: any;
  team?: any;
  notes?: string;
}

export interface CreatePlanningItemRequest {
  title: string;
  description?: string;
  type: 'SETUP' | 'REHEARSAL' | 'PERFORMANCE' | 'BREAKDOWN' | 'TRANSPORT' | 'CATERING' | 'OTHER';
  startTime: string;
  endTime: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  projectId?: string;
  assignedToId?: string;
  equipmentId?: string;
  location?: string;
  notes?: string;
}

// Types pour les réponses paginées
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Types pour les filtres de recherche
export interface SearchFilters {
  search?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
