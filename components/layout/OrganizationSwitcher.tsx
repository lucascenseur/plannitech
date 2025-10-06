"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  Settings, 
  Users, 
  Crown,
  Check
} from "lucide-react";

interface Organization {
  id: string;
  name: string;
  type: string;
  role: string;
  memberCount: number;
  plan: string;
  logo?: string;
}

interface OrganizationSwitcherProps {
  currentOrganizationId: string;
  onOrganizationChange: (organizationId: string) => void;
  locale: string;
}

export function OrganizationSwitcher({ 
  currentOrganizationId, 
  onOrganizationChange, 
  locale 
}: OrganizationSwitcherProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('/api/organizations');
        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.organizations || []);
          
          const current = data.organizations?.find((org: Organization) => org.id === currentOrganizationId);
          setCurrentOrg(current || data.organizations?.[0]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des organisations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [currentOrganizationId]);

  const handleOrganizationSelect = (orgId: string) => {
    onOrganizationChange(orgId);
    const selectedOrg = organizations.find(org => org.id === orgId);
    if (selectedOrg) {
      setCurrentOrg(selectedOrg);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'FREE': return 'bg-gray-100 text-gray-800';
      case 'STARTER': return 'bg-blue-100 text-blue-800';
      case 'PROFESSIONAL': return 'bg-purple-100 text-purple-800';
      case 'ENTERPRISE': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'ADMIN': return <Settings className="w-4 h-4 text-blue-600" />;
      case 'MANAGER': return <Users className="w-4 h-4 text-green-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500">
          {locale === 'en' ? 'Loading...' : locale === 'es' ? 'Cargando...' : 'Chargement...'}
        </span>
      </div>
    );
  }

  if (!currentOrg) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500">
          {locale === 'en' ? 'No organization' : locale === 'es' ? 'Sin organización' : 'Aucune organisation'}
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
          <div className="flex items-center space-x-2">
            {currentOrg.logo ? (
              <img 
                src={currentOrg.logo} 
                alt={currentOrg.name}
                className="w-6 h-6 rounded"
              />
            ) : (
              <Building2 className="w-5 h-5 text-gray-600" />
            )}
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">
                {currentOrg.name}
              </div>
              <div className="flex items-center space-x-1">
                <Badge className={`text-xs ${getPlanColor(currentOrg.plan)}`}>
                  {currentOrg.plan}
                </Badge>
                {getRoleIcon(currentOrg.role)}
                <span className="text-xs text-gray-500">
                  {currentOrg.role}
                </span>
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-80">
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            {locale === 'en' ? 'Organizations' : locale === 'es' ? 'Organizaciones' : 'Organisations'}
          </div>
          
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleOrganizationSelect(org.id)}
              className="flex items-center justify-between p-3 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                {org.logo ? (
                  <img 
                    src={org.logo} 
                    alt={org.name}
                    className="w-8 h-8 rounded"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-sm">{org.name}</div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{org.memberCount} {locale === 'en' ? 'members' : locale === 'es' ? 'miembros' : 'membres'}</span>
                    <span>•</span>
                    <span>{org.role}</span>
                  </div>
                </div>
              </div>
              
              {org.id === currentOrganizationId && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem className="flex items-center space-x-2 p-2 cursor-pointer">
                <Plus className="w-4 h-4" />
                <span className="text-sm">
                  {locale === 'en' ? 'Create organization' : locale === 'es' ? 'Crear organización' : 'Créer une organisation'}
                </span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {locale === 'en' ? 'Create Organization' : locale === 'es' ? 'Crear Organización' : 'Créer une organisation'}
                </DialogTitle>
              </DialogHeader>
              <CreateOrganizationForm 
                onSuccess={() => {
                  // Recharger les organisations
                  window.location.reload();
                }}
                locale={locale}
              />
            </DialogContent>
          </Dialog>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Composant pour créer une nouvelle organisation
function CreateOrganizationForm({ onSuccess, locale }: { onSuccess: () => void; locale: string }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'COMPANY',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {locale === 'en' ? 'Organization Name' : locale === 'es' ? 'Nombre de la Organización' : 'Nom de l\'organisation'}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {locale === 'en' ? 'Description' : locale === 'es' ? 'Descripción' : 'Description'}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {locale === 'en' ? 'Type' : locale === 'es' ? 'Tipo' : 'Type'}
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="COMPANY">
            {locale === 'en' ? 'Company' : locale === 'es' ? 'Empresa' : 'Entreprise'}
          </option>
          <option value="FREELANCER">
            {locale === 'en' ? 'Freelancer' : locale === 'es' ? 'Freelancer' : 'Freelance'}
          </option>
          <option value="ASSOCIATION">
            {locale === 'en' ? 'Association' : locale === 'es' ? 'Asociación' : 'Association'}
          </option>
          <option value="VENUE">
            {locale === 'en' ? 'Venue' : locale === 'es' ? 'Lugar' : 'Lieu'}
          </option>
          <option value="OTHER">
            {locale === 'en' ? 'Other' : locale === 'es' ? 'Otro' : 'Autre'}
          </option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          {locale === 'en' ? 'Cancel' : locale === 'es' ? 'Cancelar' : 'Annuler'}
        </Button>
        <Button type="submit">
          {locale === 'en' ? 'Create' : locale === 'es' ? 'Crear' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
