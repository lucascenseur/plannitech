"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Mail, 
  Crown, 
  Settings, 
  Users, 
  Shield,
  MoreHorizontal,
  Trash2,
  Edit
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface OrganizationMember {
  id: string;
  userId: string;
  role: string;
  status: string;
  permissions: any;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  joinedAt: string;
  invitedBy?: {
    id: string;
    name: string;
  };
}

interface CollaboratorsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function CollaboratorsPage({ params }: CollaboratorsPageProps) {
  const [locale, setLocale] = useState('fr');
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, hasPermission } = useAuth();

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les membres de l'organisation
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Récupérer l'ID de l'organisation actuelle
        const currentOrgId = user?.organizations?.[0]?.organizationId || '1';
        
        const response = await fetch(`/api/organizations/${currentOrgId}/members`);
        if (response.ok) {
          const data = await response.json();
          setMembers(data.members || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des membres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [user]);

  const handleInviteUser = async (inviteData: any) => {
    try {
      const currentOrgId = user?.organizations?.[0]?.organizationId || '1';
      
      const response = await fetch(`/api/organizations/${currentOrgId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteData),
      });

      if (response.ok) {
        // Recharger les membres
        const membersResponse = await fetch(`/api/organizations/${currentOrgId}/members`);
        if (membersResponse.ok) {
          const data = await membersResponse.json();
          setMembers(data.members || []);
        }
        setShowInviteDialog(false);
        alert(locale === 'en' ? 'User invited successfully!' : locale === 'es' ? '¡Usuario invitado con éxito!' : 'Utilisateur invité avec succès !');
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de l\'invitation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'invitation:', error);
      alert('Erreur lors de l\'invitation');
    }
  };

  const handleUpdateMember = async (memberId: string, updateData: any) => {
    try {
      const currentOrgId = user?.organizations?.[0]?.organizationId || '1';
      
      const response = await fetch(`/api/organizations/${currentOrgId}/members`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, ...updateData }),
      });

      if (response.ok) {
        // Recharger les membres
        const membersResponse = await fetch(`/api/organizations/${currentOrgId}/members`);
        if (membersResponse.ok) {
          const data = await membersResponse.json();
          setMembers(data.members || []);
        }
        alert(locale === 'en' ? 'Member updated successfully!' : locale === 'es' ? '¡Miembro actualizado con éxito!' : 'Membre mis à jour avec succès !');
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirm(locale === 'en' ? 'Are you sure you want to remove this member?' : locale === 'es' ? '¿Estás seguro de que quieres eliminar este miembro?' : 'Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      try {
        const currentOrgId = user?.organizations?.[0]?.organizationId || '1';
        
        const response = await fetch(`/api/organizations/${currentOrgId}/members?memberId=${memberId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMembers(prev => prev.filter(member => member.id !== memberId));
          alert(locale === 'en' ? 'Member removed successfully!' : locale === 'es' ? '¡Miembro eliminado con éxito!' : 'Membre supprimé avec succès !');
        } else {
          const error = await response.json();
          alert(error.message || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'ADMIN': return <Settings className="w-4 h-4 text-blue-600" />;
      case 'MANAGER': return <Shield className="w-4 h-4 text-green-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'bg-yellow-100 text-yellow-800';
      case 'ADMIN': return 'bg-blue-100 text-blue-800';
      case 'MANAGER': return 'bg-green-100 text-green-800';
      case 'MEMBER': return 'bg-gray-100 text-gray-800';
      case 'VIEWER': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INVITED': return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          {locale === 'en' ? 'Loading collaborators...' : locale === 'es' ? 'Cargando colaboradores...' : 'Chargement des collaborateurs...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Collaborators' : locale === 'es' ? 'Colaboradores' : 'Collaborateurs'}
          </h1>
          <p className="text-gray-600 mt-1">
            {locale === 'en' ? 'Manage your team members and their permissions' : locale === 'es' ? 'Gestiona los miembros de tu equipo y sus permisos' : 'Gérez les membres de votre équipe et leurs permissions'}
          </p>
        </div>
        
        {hasPermission('canManageUsers') && (
          <Button onClick={() => setShowInviteDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'Invite User' : locale === 'es' ? 'Invitar Usuario' : 'Inviter un utilisateur'}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>
              {locale === 'en' ? 'Team Members' : locale === 'es' ? 'Miembros del Equipo' : 'Membres de l\'équipe'}
            </span>
            <Badge variant="secondary">
              {members.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            {locale === 'en' ? 'Manage who has access to your organization' : locale === 'es' ? 'Gestiona quién tiene acceso a tu organización' : 'Gérez qui a accès à votre organisation'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {locale === 'en' ? 'No team members yet' : locale === 'es' ? 'Aún no hay miembros del equipo' : 'Aucun membre d\'équipe pour le moment'}
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.user.avatar} />
                      <AvatarFallback>
                        {member.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{member.user.name}</h4>
                        {getRoleIcon(member.role)}
                      </div>
                      <p className="text-sm text-gray-500">{member.user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {hasPermission('canManageUsers') && member.role !== 'OWNER' && (
                    <div className="flex items-center space-x-2">
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleUpdateMember(member.id, { role: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">
                            {locale === 'en' ? 'Admin' : locale === 'es' ? 'Admin' : 'Admin'}
                          </SelectItem>
                          <SelectItem value="MANAGER">
                            {locale === 'en' ? 'Manager' : locale === 'es' ? 'Gerente' : 'Manager'}
                          </SelectItem>
                          <SelectItem value="MEMBER">
                            {locale === 'en' ? 'Member' : locale === 'es' ? 'Miembro' : 'Membre'}
                          </SelectItem>
                          <SelectItem value="VIEWER">
                            {locale === 'en' ? 'Viewer' : locale === 'es' ? 'Espectador' : 'Observateur'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'invitation */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? 'Invite User' : locale === 'es' ? 'Invitar Usuario' : 'Inviter un utilisateur'}
            </DialogTitle>
          </DialogHeader>
          <InviteUserForm
            onSubmit={handleInviteUser}
            onCancel={() => setShowInviteDialog(false)}
            locale={locale}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant pour le formulaire d'invitation
function InviteUserForm({ onSubmit, onCancel, locale }: any) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'MEMBER',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">
          {locale === 'en' ? 'Email Address' : locale === 'es' ? 'Dirección de Email' : 'Adresse email'}
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={locale === 'en' ? 'user@example.com' : locale === 'es' ? 'usuario@ejemplo.com' : 'utilisateur@exemple.com'}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="role">
          {locale === 'en' ? 'Role' : locale === 'es' ? 'Rol' : 'Rôle'}
        </Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">
              {locale === 'en' ? 'Admin' : locale === 'es' ? 'Admin' : 'Admin'}
            </SelectItem>
            <SelectItem value="MANAGER">
              {locale === 'en' ? 'Manager' : locale === 'es' ? 'Gerente' : 'Manager'}
            </SelectItem>
            <SelectItem value="MEMBER">
              {locale === 'en' ? 'Member' : locale === 'es' ? 'Miembro' : 'Membre'}
            </SelectItem>
            <SelectItem value="VIEWER">
              {locale === 'en' ? 'Viewer' : locale === 'es' ? 'Espectador' : 'Observateur'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {locale === 'en' ? 'Cancel' : locale === 'es' ? 'Cancelar' : 'Annuler'}
        </Button>
        <Button type="submit">
          <Mail className="w-4 h-4 mr-2" />
          {locale === 'en' ? 'Send Invitation' : locale === 'es' ? 'Enviar Invitación' : 'Envoyer l\'invitation'}
        </Button>
      </div>
    </form>
  );
}
