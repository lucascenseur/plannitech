"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFilter {
  key: string;
  label: string;
  value: string;
}

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilter?: (filters: SearchFilter[]) => void;
  filters?: SearchFilter[];
  className?: string;
}

export function SearchBar({ 
  placeholder = "Rechercher...", 
  onSearch, 
  onFilter,
  filters = [],
  className 
}: SearchProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>(filters);

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const removeFilter = (filterKey: string) => {
    const newFilters = activeFilters.filter(f => f.key !== filterKey);
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>
          Rechercher
        </Button>
        {onFilter && (
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Filtres actifs:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="flex items-center space-x-1">
              <span>{filter.label}: {filter.value}</span>
              <button
                onClick={() => removeFilter(filter.key)}
                className="ml-1 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveFilters([]);
              onFilter?.([]);
            }}
          >
            Effacer tout
          </Button>
        </div>
      )}
    </div>
  );
}

