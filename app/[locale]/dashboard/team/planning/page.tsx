"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon,
  Download,
  FileText,
  Table,
  BarChart3,
  Clock,
  Users,
  MapPin,
  Euro,
  Settings,
  Eye,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PlanningPageProps {
  params: Promise<{
    locale: string;
  }>;
}

interface PlanningTask {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  assignedMembers: string[];
  assignedProviders: string[];
  venue: string;
  project: string;
  totalCost: number;
}

interface ExportOptions {
  format: 'PDF' | 'CSV';
  includeMembers: boolean;
  includeProviders: boolean;
  includeCosts: boolean;
  includeRequirements: boolean;
  includeNotes: boolean;
  template: 'DEFAULT' | 'COMPACT' | 'DETAILED';
}

export default function PlanningPage({ params }: PlanningPageProps) {
  const [locale, setLocale] = useState('fr');
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'DAY' | 'WEEK' | 'MONTH' | 'CUSTOM'>('WEEK');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'PDF',
    includeMembers: true,
    includeProviders: true,
    includeCosts: true,
    includeRequirements: false,
    includeNotes: false,
    template: 'DEFAULT'
  });
  const [isExporting, setIsExporting] = useState(false);

  // Initialiser la locale
  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  // Charger les tâches
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/team/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des tâches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Calculer les dates selon la période sélectionnée
  useEffect(() => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'DAY':
        setStartDate(now);
        setEndDate(now);
        break;
      case 'WEEK':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1); // Lundi
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Dimanche
        setStartDate(weekStart);
        setEndDate(weekEnd);
        break;
      case 'MONTH':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setStartDate(monthStart);
        setEndDate(monthEnd);
        break;
    }
  }, [selectedPeriod]);

  // Filtrer les tâches selon la période
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.startDate);
    return taskDate >= startDate && taskDate <= endDate;
  });

  // Calculer les statistiques
  const stats = {
    totalTasks: filteredTasks.length,
    totalHours: filteredTasks.reduce((sum, task) => sum + task.duration, 0),
    totalCost: filteredTasks.reduce((sum, task) => sum + task.totalCost, 0),
    uniqueMembers: new Set(filteredTasks.flatMap(task => task.assignedMembers)).size,
    uniqueVenues: new Set(filteredTasks.map(task => task.venue).filter(Boolean)).size,
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/team/planning/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          ...exportOptions
        }),
      });

      if (response.ok) {
        // Télécharger le fichier
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `planning-${format(startDate, 'yyyy-MM-dd')}-${format(endDate, 'yyyy-MM-dd')}.${exportOptions.format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de l\'export');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SETUP': return <Settings className="w-4 h-4" />;
      case 'PERFORMANCE': return <BarChart3 className="w-4 h-4" />;
      case 'BREAKDOWN': return <Settings className="w-4 h-4" />;
      case 'REHEARSAL': return <Users className="w-4 h-4" />;
      case 'MEETING': return <FileText className="w-4 h-4" />;
      case 'TRAVEL': return <MapPin className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          {locale === 'en' ? 'Loading planning...' : locale === 'es' ? 'Cargando planificación...' : 'Chargement du planning...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'en' ? 'Planning & Export' : locale === 'es' ? 'Planificación y Exportación' : 'Planning et Export'}
          </h1>
          <p className="text-gray-600 mt-1">
            {locale === 'en' ? 'View and export your team planning' : locale === 'es' ? 'Ver y exportar la planificación de tu equipo' : 'Visualisez et exportez le planning de votre équipe'}
          </p>
        </div>
        <Button onClick={handleExport} disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting 
            ? (locale === 'en' ? 'Exporting...' : locale === 'es' ? 'Exportando...' : 'Export en cours...')
            : (locale === 'en' ? 'Export Planning' : locale === 'es' ? 'Exportar Planificación' : 'Exporter le Planning')
          }
        </Button>
      </div>

      {/* Contrôles de période */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>
              {locale === 'en' ? 'Planning Period' : locale === 'es' ? 'Período de Planificación' : 'Période de Planning'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label>
                {locale === 'en' ? 'Period:' : locale === 'es' ? 'Período:' : 'Période :'}
              </Label>
              <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">
                    {locale === 'en' ? 'Day' : locale === 'es' ? 'Día' : 'Jour'}
                  </SelectItem>
                  <SelectItem value="WEEK">
                    {locale === 'en' ? 'Week' : locale === 'es' ? 'Semana' : 'Semaine'}
                  </SelectItem>
                  <SelectItem value="MONTH">
                    {locale === 'en' ? 'Month' : locale === 'es' ? 'Mes' : 'Mois'}
                  </SelectItem>
                  <SelectItem value="CUSTOM">
                    {locale === 'en' ? 'Custom' : locale === 'es' ? 'Personalizado' : 'Personnalisé'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label>
                {locale === 'en' ? 'From:' : locale === 'es' ? 'Desde:' : 'Du :'}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "dd/MM/yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2">
              <Label>
                {locale === 'en' ? 'To:' : locale === 'es' ? 'Hasta:' : 'Au :'}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "dd/MM/yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Tasks' : locale === 'es' ? 'Tareas' : 'Tâches'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Hours' : locale === 'es' ? 'Horas' : 'Heures'}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Cost' : locale === 'es' ? 'Costo' : 'Coût'}
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Members' : locale === 'es' ? 'Miembros' : 'Membres'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {locale === 'en' ? 'Venues' : locale === 'es' ? 'Lugares' : 'Lieux'}
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVenues}</div>
          </CardContent>
        </Card>
      </div>

      {/* Options d'export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>
              {locale === 'en' ? 'Export Options' : locale === 'es' ? 'Opciones de Exportación' : 'Options d\'Export'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label>
                  {locale === 'en' ? 'Format' : locale === 'es' ? 'Formato' : 'Format'}
                </Label>
                <Select value={exportOptions.format} onValueChange={(value: any) => setExportOptions({ ...exportOptions, format: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>
                  {locale === 'en' ? 'Template' : locale === 'es' ? 'Plantilla' : 'Modèle'}
                </Label>
                <Select value={exportOptions.template} onValueChange={(value: any) => setExportOptions({ ...exportOptions, template: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEFAULT">
                      {locale === 'en' ? 'Default' : locale === 'es' ? 'Por Defecto' : 'Par Défaut'}
                    </SelectItem>
                    <SelectItem value="COMPACT">
                      {locale === 'en' ? 'Compact' : locale === 'es' ? 'Compacto' : 'Compact'}
                    </SelectItem>
                    <SelectItem value="DETAILED">
                      {locale === 'en' ? 'Detailed' : locale === 'es' ? 'Detallado' : 'Détaillé'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {locale === 'en' ? 'Include in export:' : locale === 'es' ? 'Incluir en exportación:' : 'Inclure dans l\'export :'}
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeMembers"
                      checked={exportOptions.includeMembers}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeMembers: !!checked })}
                    />
                    <Label htmlFor="includeMembers">
                      {locale === 'en' ? 'Team Members' : locale === 'es' ? 'Miembros del Equipo' : 'Membres d\'Équipe'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeProviders"
                      checked={exportOptions.includeProviders}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeProviders: !!checked })}
                    />
                    <Label htmlFor="includeProviders">
                      {locale === 'en' ? 'Providers' : locale === 'es' ? 'Proveedores' : 'Prestataires'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeCosts"
                      checked={exportOptions.includeCosts}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeCosts: !!checked })}
                    />
                    <Label htmlFor="includeCosts">
                      {locale === 'en' ? 'Costs' : locale === 'es' ? 'Costos' : 'Coûts'}
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {locale === 'en' ? 'Additional information:' : locale === 'es' ? 'Información adicional:' : 'Informations supplémentaires :'}
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeRequirements"
                      checked={exportOptions.includeRequirements}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeRequirements: !!checked })}
                    />
                    <Label htmlFor="includeRequirements">
                      {locale === 'en' ? 'Requirements' : locale === 'es' ? 'Requisitos' : 'Exigences'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeNotes"
                      checked={exportOptions.includeNotes}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeNotes: !!checked })}
                    />
                    <Label htmlFor="includeNotes">
                      {locale === 'en' ? 'Notes' : locale === 'es' ? 'Notas' : 'Notes'}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des tâches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>
              {locale === 'en' ? 'Tasks in Period' : locale === 'es' ? 'Tareas en Período' : 'Tâches dans la Période'}
            </span>
          </CardTitle>
          <CardDescription>
            {filteredTasks.length} {locale === 'en' ? 'tasks found' : locale === 'es' ? 'tareas encontradas' : 'tâches trouvées'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(task.type)}
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500">{task.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">
                      {locale === 'en' ? 'Date & Time' : locale === 'es' ? 'Fecha y Hora' : 'Date et Heure'}
                    </p>
                    <p>{format(new Date(task.startDate), "dd/MM/yyyy", { locale: fr })}</p>
                    <p>{task.startTime} - {task.endTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      {locale === 'en' ? 'Duration' : locale === 'es' ? 'Duración' : 'Durée'}
                    </p>
                    <p>{task.duration}h</p>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      {locale === 'en' ? 'Location' : locale === 'es' ? 'Ubicación' : 'Lieu'}
                    </p>
                    <p>{task.venue || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      {locale === 'en' ? 'Assigned' : locale === 'es' ? 'Asignado' : 'Assigné'}
                    </p>
                    <p>{task.assignedMembers.length} membres</p>
                    <p>{task.assignedProviders.length} prestataires</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
