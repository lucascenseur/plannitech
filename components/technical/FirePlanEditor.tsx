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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2,
  Save,
  Download,
  Upload,
  Eye,
  Copy,
  Lightbulb,
  Volume2,
  Video,
  Stage,
  Shield,
  Settings,
  Target,
  BarChart3,
  Calendar,
  FileText,
  Calculator,
  TrendingUp,
  TrendingDown,
  Copy as CopyIcon,
  Save as SaveIcon,
  Eye as EyeIcon,
  Download as DownloadIcon
} from "lucide-react";
import { FirePlan, DiagramElement, DiagramConnection } from "@/types/technical";

interface FirePlanEditorProps {
  initialData?: Partial<FirePlan>;
  onSubmit: (data: FirePlan) => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function FirePlanEditor({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  title = "Nouveau plan de feu",
  description = "Créez un nouveau plan de feu pour votre projet",
}: FirePlanEditorProps) {
  const [elements, setElements] = useState<DiagramElement[]>(initialData?.elements || []);
  const [connections, setConnections] = useState<DiagramConnection[]>(initialData?.connections || []);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [newElement, setNewElement] = useState({
    type: "light",
    label: "",
    properties: {},
  });

  const elementTypes = [
    { value: "light", label: "Éclairage", icon: Lightbulb },
    { value: "sound", label: "Son", icon: Volume2 },
    { value: "video", label: "Vidéo", icon: Video },
    { value: "stage", label: "Scène", icon: Stage },
    { value: "safety", label: "Sécurité", icon: Shield },
    { value: "other", label: "Autre", icon: Settings },
  ];

  const addElement = () => {
    if (newElement.type && newElement.label.trim()) {
      const element: DiagramElement = {
        id: `element_${Date.now()}`,
        type: newElement.type,
        position: { x: Math.random() * 400, y: Math.random() * 300 },
        size: { width: 100, height: 60 },
        properties: newElement.properties,
        label: newElement.label.trim(),
      };
      setElements([...elements, element]);
      setNewElement({ type: "light", label: "", properties: {} });
    }
  };

  const removeElement = (elementId: string) => {
    setElements(elements.filter(e => e.id !== elementId));
    setConnections(connections.filter(c => c.from !== elementId && c.to !== elementId));
  };

  const updateElement = (elementId: string, updates: Partial<DiagramElement>) => {
    setElements(elements.map(e => e.id === elementId ? { ...e, ...updates } : e));
  };

  const addConnection = (from: string, to: string, type: string = "line") => {
    const connection: DiagramConnection = {
      id: `connection_${Date.now()}`,
      from,
      to,
      type,
      properties: {},
    };
    setConnections([...connections, connection]);
  };

  const removeConnection = (connectionId: string) => {
    setConnections(connections.filter(c => c.id !== connectionId));
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      elements,
      connections,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={handleFormSubmit} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Éditeur</TabsTrigger>
          <TabsTrigger value="elements">Éléments</TabsTrigger>
          <TabsTrigger value="connections">Connexions</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan de feu</CardTitle>
              <CardDescription>
                Dessinez votre plan de feu en ajoutant des éléments et des connexions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Zone de dessin du plan de feu</p>
                  <p className="text-sm text-gray-500">
                    {elements.length} élément{elements.length > 1 ? "s" : ""} • {connections.length} connexion{connections.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Éléments du plan</CardTitle>
              <CardDescription>
                Ajoutez et gérez les éléments de votre plan de feu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    value={newElement.type}
                    onValueChange={(value) => setNewElement({ ...newElement, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'élément" />
                    </SelectTrigger>
                    <SelectContent>
                      {elementTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={newElement.label}
                    onChange={(e) => setNewElement({ ...newElement, label: e.target.value })}
                    placeholder="Label de l'élément"
                  />
                  <Button onClick={addElement}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>

                {elements.length > 0 && (
                  <div className="space-y-2">
                    {elements.map((element) => (
                      <div key={element.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            {elementTypes.find(t => t.value === element.type)?.icon && (
                              <elementTypes.find(t => t.value === element.type)!.icon className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{element.label}</div>
                            <div className="text-sm text-gray-600">
                              {elementTypes.find(t => t.value === element.type)?.label}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedElement(element.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeElement(element.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connexions</CardTitle>
              <CardDescription>
                Gérez les connexions entre les éléments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connections.length > 0 ? (
                  <div className="space-y-2">
                    {connections.map((connection) => (
                      <div key={connection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                            <Target className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {elements.find(e => e.id === connection.from)?.label} → {elements.find(e => e.id === connection.to)?.label}
                            </div>
                            <div className="text-sm text-gray-600">
                              Type: {connection.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeConnection(connection.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Aucune connexion définie
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

