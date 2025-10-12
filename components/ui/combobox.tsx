"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  apiEndpoint: string;
  placeholder: string;
  emptyMessage: string;
  onCreateNew: () => void;
  displayField: string;
  contextField?: string;
  searchFields: string[];
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  selectedValues?: string[];
  onSelectedValuesChange?: (values: string[]) => void;
}

export function Combobox({
  value,
  onValueChange,
  apiEndpoint,
  placeholder,
  emptyMessage,
  onCreateNew,
  displayField,
  contextField,
  searchFields,
  className,
  disabled = false,
  multiple = false,
  selectedValues = [],
  onSelectedValuesChange
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [options, setOptions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Charger les options depuis l'API
  const fetchOptions = React.useCallback(async (query: string) => {
    if (query.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchFields.forEach(field => {
        searchParams.append('search', query);
      });
      
      const response = await fetch(`${apiEndpoint}?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const data = await response.json();
      const items = data.contacts || data.venues || data.shows || data.members || data.equipment || [];
      setOptions(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, searchFields]);

  // Debounce la recherche
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOptions(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchOptions]);

  const handleSelect = (selectedValue: string) => {
    if (multiple && onSelectedValuesChange) {
      const newValues = selectedValues.includes(selectedValue)
        ? selectedValues.filter(v => v !== selectedValue)
        : [...selectedValues, selectedValue];
      onSelectedValuesChange(newValues);
    } else {
      onValueChange(selectedValue);
      setOpen(false);
    }
  };

  const getDisplayText = (item: any) => {
    const mainText = item[displayField] || '';
    const contextText = contextField ? item[contextField] : '';
    return contextText ? `${mainText} - ${contextText}` : mainText;
  };

  const isSelected = (itemValue: string) => {
    if (multiple) {
      return selectedValues.includes(itemValue);
    }
    return value === itemValue;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {multiple ? (
            selectedValues.length > 0 ? (
              `${selectedValues.length} élément(s) sélectionné(s)`
            ) : (
              placeholder
            )
          ) : (
            value || placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Rechercher...`}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Chargement...</span>
              </div>
            )}
            
            {error && (
              <div className="flex items-center justify-center py-6">
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            {!loading && !error && options.length === 0 && searchQuery.length >= 2 && (
              <CommandEmpty>
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-4">{emptyMessage}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onCreateNew();
                      setOpen(false);
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer nouveau
                  </Button>
                </div>
              </CommandEmpty>
            )}

            {!loading && !error && options.length > 0 && (
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected(item.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div>
                        <div className="font-medium">{getDisplayText(item)}</div>
                        {contextField && item[contextField] && (
                          <div className="text-xs text-muted-foreground">
                            {item[contextField]}
                          </div>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {!loading && !error && searchQuery.length < 2 && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  Tapez au moins 2 caractères pour rechercher
                </p>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
