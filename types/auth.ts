// Enum des rôles utilisateur
export enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN", 
  MANAGER = "MANAGER",
  COLLABORATOR = "COLLABORATOR",
  GUEST = "GUEST"
}

export interface Organization {
  id: string;
  name: string;
  legalName?: string | undefined;
  description?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  postalCode?: string | undefined;
  country?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  website?: string | undefined;
  logo?: string | undefined;
  siret?: string | undefined;
  apeCode?: string | undefined;
  vatNumber?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationUser {
  id: string;
  organizationId: string;
  userId: string;
  role: UserRole;
  permissions?: Record<string, boolean> | undefined;
  createdAt: Date;
  updatedAt: Date;
  organization: Organization;
}

export interface User {
  id: string;
  name?: string | undefined;
  email: string;
  emailVerified?: Date | undefined;
  image?: string | undefined;
  phone?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  postalCode?: string | undefined;
  country?: string | undefined;
  siret?: string | undefined;
  apeCode?: string | undefined;
  isIntermittent: boolean;
  createdAt: Date;
  updatedAt: Date;
  organizations?: OrganizationUser[] | undefined;
}

export interface AuthUser extends User {
  organizations: OrganizationUser[];
  currentOrganization?: Organization | undefined;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  siret?: string;
  apeCode?: string;
  isIntermittent?: boolean;
}

export interface OnboardingData {
  organizationName: string;
  organizationType: "company" | "association" | "individual";
  industry: string;
  teamSize: "1" | "2-5" | "6-20" | "21-50" | "50+";
  goals: string[];
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: AuthError | null;
}

export interface Permission {
  canManageUsers: boolean;
  canManageProjects: boolean;
  canManageBudget: boolean;
  canManageContracts: boolean;
  canManageOrganization: boolean;
  canViewAnalytics: boolean;
  canManageSubscriptions: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
  [UserRole.OWNER]: {
    canManageUsers: true,
    canManageProjects: true,
    canManageBudget: true,
    canManageContracts: true,
    canManageOrganization: true,
    canViewAnalytics: true,
    canManageSubscriptions: true,
  },
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageProjects: true,
    canManageBudget: true,
    canManageContracts: true,
    canManageOrganization: false,
    canViewAnalytics: true,
    canManageSubscriptions: false,
  },
  [UserRole.MANAGER]: {
    canManageUsers: false,
    canManageProjects: true,
    canManageBudget: true,
    canManageContracts: true,
    canManageOrganization: false,
    canViewAnalytics: true,
    canManageSubscriptions: false,
  },
  [UserRole.COLLABORATOR]: {
    canManageUsers: false,
    canManageProjects: true,
    canManageBudget: false,
    canManageContracts: false,
    canManageOrganization: false,
    canViewAnalytics: false,
    canManageSubscriptions: false,
  },
  [UserRole.GUEST]: {
    canManageUsers: false,
    canManageProjects: false,
    canManageBudget: false,
    canManageContracts: false,
    canManageOrganization: false,
    canViewAnalytics: false,
    canManageSubscriptions: false,
  },
};
