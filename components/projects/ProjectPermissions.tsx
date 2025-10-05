"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Shield, 
  Eye, 
  EyeOff,
  Mail,
  UserPlus
} from "lucide-react";

interface ProjectPermissionsProps {
  projectId: string;
  projectName: string;
}

interface ProjectMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string;
  isOwner: boolean;
}

export function ProjectPermissions({ projectId, projectName }: ProjectPermissionsProps) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("COLLABORATOR");

  useEffect(() => {
    loadMembers();
  }, [projectId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/members`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des membres:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (response.ok) {
        setInviteEmail("");
        setInviteRole("COLLABORATOR");
        setShowInviteForm(false);
        await loadMembers();
      }
    } catch (error) {
      console.error("Erreur lors de l'invitation:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/members/${memberId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadMembers();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await loadMembers();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      OWNER: "Propriétaire",
      ADMIN: "Administrateur",
      MANAGER: "Gestionnaire",
      COLLABORATOR: "Collaborateur",
      GUEST: "Invité",
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      OWNER: "bg-red-100 text-red-800",
      ADMIN: "bg-purple-100 text-purple-800",
      MANAGER: "bg-blue-100 text-blue-800",
      COLLABORATOR: "bg-green-100 text-green-800",
      GUEST: "bg-gray-100 text-gray-800",
    };
    return colors[role as keyof typeof colors] || colors.GUEST;
  };

  const getPermissionIcon = (permission: string) => {
    const icons = {
      READ: Eye,
      WRITE: Edit,
      DELETE: Trash2,
      ADMIN: Shield,
    };
    const Icon = icons[permission as keyof typeof icons] || Eye;
    return <Icon className="h-3 w-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permissions du projet</CardTitle>
              <CardDescription>
                Gérez les accès au projet "{projectName}"
              </CardDescription>
            </div>
            <Button onClick={() => setShowInviteForm(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Inviter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showInviteForm && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="email@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Rôle</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COLLABORATOR">Collaborateur</SelectItem>
                      <SelectItem value="MANAGER">Gestionnaire</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                      <SelectItem value="GUEST">Invité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handleInvite} disabled={!inviteEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer l'invitation
                </Button>
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Membres de l'équipe</CardTitle>
          <CardDescription>
            {members.length} membre{members.length > 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{member.name}</span>
                      {member.isOwner && (
                        <Badge variant="outline" className="text-xs">
                          Propriétaire
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {member.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center space-x-1 text-xs text-gray-500"
                      >
                        {getPermissionIcon(permission)}
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>

                  <Select
                    value={member.role}
                    onValueChange={(value) => handleUpdateRole(member.id, value)}
                    disabled={member.isOwner}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">Propriétaire</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                      <SelectItem value="MANAGER">Gestionnaire</SelectItem>
                      <SelectItem value="COLLABORATOR">Collaborateur</SelectItem>
                      <SelectItem value="GUEST">Invité</SelectItem>
                    </SelectContent>
                  </Select>

                  {!member.isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des permissions</CardTitle>
          <CardDescription>
            Vue d'ensemble des accès au projet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(
              members.reduce((acc, member) => {
                acc[member.role] = (acc[member.role] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(role)}>
                    {getRoleLabel(role)}
                  </Badge>
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

