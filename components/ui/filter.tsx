"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Calendar, Users, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "checkbox" | "date" | "number";
  options?: { value: string; label: string }[];
}

interface FilterProps {
  options: FilterOption[];
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
  className?: string;
}

export function FilterPanel({ options, onApply, onClear, className }: FilterProps) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({});
    onClear();
    setIsOpen(false);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== "" && value !== false
  ).length;

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtres
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute top-12 left-0 z-50 w-80 shadow-lg">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>
              Appliquez des filtres pour affiner vos résultats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {options.map((option) => (
              <div key={option.key} className="space-y-2">
                <Label>{option.label}</Label>
                {option.type === "text" && (
                  <Input
                    placeholder={`Rechercher ${option.label.toLowerCase()}...`}
                    value={filters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                  />
                )}
                {option.type === "select" && option.options && (
                  <Select
                    value={filters[option.key] || ""}
                    onValueChange={(value) => handleFilterChange(option.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Sélectionner ${option.label.toLowerCase()}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {option.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {option.type === "checkbox" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={option.key}
                      checked={filters[option.key] || false}
                      onCheckedChange={(checked) => handleFilterChange(option.key, checked)}
                    />
                    <Label htmlFor={option.key}>{option.label}</Label>
                  </div>
                )}
                {option.type === "date" && (
                  <Input
                    type="date"
                    value={filters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                  />
                )}
                {option.type === "number" && (
                  <Input
                    type="number"
                    placeholder={`Entrer ${option.label.toLowerCase()}...`}
                    value={filters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                  />
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleClear}>
                <X className="h-4 w-4 mr-2" />
                Effacer
              </Button>
              <Button onClick={handleApply}>
                Appliquer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface QuickFilterProps {
  filters: { key: string; label: string; value: any }[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function QuickFilters({ filters, onRemove, onClearAll, className }: QuickFilterProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="text-sm text-gray-600">Filtres actifs:</span>
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="flex items-center space-x-1">
          <span>{filter.label}: {filter.value}</span>
          <button
            onClick={() => onRemove(filter.key)}
            className="ml-1 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={onClearAll}>
        Effacer tout
      </Button>
    </div>
  );
}

