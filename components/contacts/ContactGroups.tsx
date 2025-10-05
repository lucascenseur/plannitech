"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContactGroup, ContactTag, Contact } from "@/types/contact";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Tag,
  Palette,
  Search,
  Filter,
  X,
  Check,
  Star,
  StarOff
} from "lucide-react";

interface ContactGroupsProps {
  groups: ContactGroup[];
  tags: ContactTag[];
  onGroupCreate: (group: Omit<ContactGroup, "id" | "contactCount" | "createdAt" | "createdBy">) => void;
  onGroupUpdate: (id: string, group: Partial<ContactGroup>) => void;
  onGroupDelete: (id: string) => void;
  onTagCreate: (tag: Omit<ContactTag, "id" | "contactCount" | "createdAt" | "createdBy">) => void;
  onTagUpdate: (id: string, tag: Partial<ContactTag>) => void;
  onTagDelete: (id: string) => void;
  onGroupAssign: (contactId: string, groupId: string) => void;
  onGroupUnassign: (contactId: string, groupId: string) => void;
  onTagAssign: (contactId: string, tagId: string) => void;
  onTagUnassign: (contactId: string, tagId: string) => void;
}

export function ContactGroups({
  groups,
  tags,
  onGroupCreate,
  onGroupUpdate,
  onGroupDelete,
  onTagCreate,
  onTagUpdate,
  onTagDelete,
  onGroupAssign,
  onGroupUnassign,
  onTagAssign,
  onTagUnassign,
}: ContactGroupsProps) {
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null);
  const [editingTag, setEditingTag] = useState<ContactTag | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "groups" | "tags">("all");

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGroupSubmit = (data: any) => {
    if (editingGroup) {
      onGroupUpdate(editingGroup.id, data);
    } else {
      onGroupCreate(data);
    }
    setShowGroupDialog(false);
    setEditingGroup(null);
  };

  const handleTagSubmit = (data: any) => {
    if (editingTag) {
      onTagUpdate(editingTag.id, data);
    } else {
      onTagCreate(data);
    }
    setShowTagDialog(false);
    setEditingTag(null);
  };

  const handleGroupEdit = (group: ContactGroup) => {
    setEditingGroup(group);
    setShowGroupDialog(true);
  };

  const handleTagEdit = (tag: ContactTag) => {
    setEditingTag(tag);
    setShowTagDialog(true);
  };

  const handleGroupDelete = (groupId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      onGroupDelete(groupId);
    }
  };

  const handleTagDelete = (tagId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce tag ?")) {
      onTagDelete(tagId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groupes et tags</h1>
          <p className="text-gray-600">
            Organisez vos contacts avec des groupes et des tags
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowTagDialog(true)}>
            <Tag className="h-4 w-4 mr-2" />
            Nouveau tag
          </Button>
          <Button onClick={() => setShowGroupDialog(true)}>
            <Users className="h-4 w-4 mr-2" />
            Nouveau groupe
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher des groupes ou tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="groups">Groupes</SelectItem>
                <SelectItem value="tags">Tags</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Groups */}
      {(filterType === "all" || filterType === "groups") && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Groupes</CardTitle>
                <CardDescription>
                  {filteredGroups.length} groupe{filteredGroups.length > 1 ? "s" : ""}
                </CardDescription>
              </div>
              <Button onClick={() => setShowGroupDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau groupe
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: group.color }}
                        />
                        <h3 className="font-medium">{group.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGroupEdit(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGroupDelete(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {group.description && (
                      <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {group.contactCount} contact{group.contactCount > 1 ? "s" : ""}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Créé le {new Date(group.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun groupe
                </h3>
                <p className="text-gray-600">
                  Créez votre premier groupe pour organiser vos contacts.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {(filterType === "all" || filterType === "tags") && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  {filteredTags.length} tag{filteredTags.length > 1 ? "s" : ""}
                </CardDescription>
              </div>
              <Button onClick={() => setShowTagDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau tag
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTags.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTags.map((tag) => (
                  <div key={tag.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <h3 className="font-medium">{tag.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTagEdit(tag)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTagDelete(tag.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {tag.contactCount} contact{tag.contactCount > 1 ? "s" : ""}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Créé le {new Date(tag.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun tag
                </h3>
                <p className="text-gray-600">
                  Créez votre premier tag pour catégoriser vos contacts.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Group Dialog */}
      <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? "Modifier le groupe" : "Nouveau groupe"}
            </DialogTitle>
            <DialogDescription>
              {editingGroup ? "Modifiez les informations du groupe" : "Créez un nouveau groupe pour organiser vos contacts"}
            </DialogDescription>
          </DialogHeader>
          <GroupForm
            initialData={editingGroup}
            onSubmit={handleGroupSubmit}
            onCancel={() => {
              setShowGroupDialog(false);
              setEditingGroup(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "Modifier le tag" : "Nouveau tag"}
            </DialogTitle>
            <DialogDescription>
              {editingTag ? "Modifiez les informations du tag" : "Créez un nouveau tag pour catégoriser vos contacts"}
            </DialogDescription>
          </DialogHeader>
          <TagForm
            initialData={editingTag}
            onSubmit={handleTagSubmit}
            onCancel={() => {
              setShowTagDialog(false);
              setEditingTag(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant pour le formulaire de groupe
function GroupForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: ContactGroup | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    color: initialData?.color || "#3B82F6",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const colors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
    "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du groupe</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nom du groupe"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description du groupe"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Couleur</Label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                formData.color === color ? "border-gray-900" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}

// Composant pour le formulaire de tag
function TagForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: ContactTag | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    color: initialData?.color || "#3B82F6",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const colors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
    "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du tag</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nom du tag"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Couleur</Label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                formData.color === color ? "border-gray-900" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}

