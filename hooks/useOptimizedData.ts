"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseOptimizedDataOptions<T> {
  fetchFunction: (params?: any) => Promise<{ data: T[]; total: number }>;
  cacheKey: string;
  initialParams?: any;
  staleTime?: number; // in milliseconds
  retryCount?: number;
  retryDelay?: number;
}

interface UseOptimizedDataReturn<T> {
  data: T[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: (params?: any) => Promise<void>;
  invalidateCache: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setParams: (params: any) => void;
}

// Cache global pour stocker les données
const globalCache = new Map<string, {
  data: any[];
  total: number;
  timestamp: number;
  params: any;
}>();

export function useOptimizedData<T>({
  fetchFunction,
  cacheKey,
  initialParams = {},
  staleTime = 5 * 60 * 1000, // 5 minutes par défaut
  retryCount = 3,
  retryDelay = 1000
}: UseOptimizedDataOptions<T>): UseOptimizedDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [params, setParams] = useState(initialParams);

  // Calculer les valeurs dérivées
  const totalPages = Math.ceil(total / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Générer une clé de cache unique
  const cacheKeyWithParams = useMemo(() => {
    const paramsString = JSON.stringify({ ...params, page: currentPage, limit: itemsPerPage });
    return `${cacheKey}-${paramsString}`;
  }, [cacheKey, params, currentPage, itemsPerPage]);

  // Vérifier si le cache est valide
  const isCacheValid = useCallback((cacheEntry: any) => {
    if (!cacheEntry) return false;
    const now = Date.now();
    return (now - cacheEntry.timestamp) < staleTime;
  }, [staleTime]);

  // Fonction de fetch avec retry
  const fetchWithRetry = useCallback(async (fetchParams: any, attempt = 1): Promise<{ data: T[]; total: number }> => {
    try {
      const result = await fetchFunction(fetchParams);
      return result;
    } catch (error) {
      if (attempt < retryCount) {
        console.warn(`Fetch attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchWithRetry(fetchParams, attempt + 1);
      }
      throw error;
    }
  }, [fetchFunction, retryCount, retryDelay]);

  // Fonction de fetch principale
  const fetchData = useCallback(async (fetchParams: any, useCache = true) => {
    setLoading(true);
    setError(null);

    try {
      // Vérifier le cache d'abord
      if (useCache) {
        const cachedData = globalCache.get(cacheKeyWithParams);
        if (cachedData && isCacheValid(cachedData)) {
          setData(cachedData.data);
          setTotal(cachedData.total);
          setLoading(false);
          return;
        }
      }

      // Fetch depuis l'API
      const result = await fetchWithRetry(fetchParams);
      
      // Mettre à jour le state
      setData(result.data);
      setTotal(result.total);

      // Mettre en cache
      globalCache.set(cacheKeyWithParams, {
        data: result.data,
        total: result.total,
        timestamp: Date.now(),
        params: fetchParams
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      
      toast({
        title: 'Erreur de chargement',
        description: 'Impossible de charger les données. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [cacheKeyWithParams, isCacheValid, fetchWithRetry]);

  // Fonction de refetch
  const refetch = useCallback(async (newParams?: any) => {
    const fetchParams = { ...params, ...newParams, page: currentPage, limit: itemsPerPage };
    await fetchData(fetchParams, false); // Force refresh, ignore cache
  }, [params, currentPage, itemsPerPage, fetchData]);

  // Fonction pour invalider le cache
  const invalidateCache = useCallback(() => {
    // Supprimer toutes les entrées de cache pour cette clé
    for (const [key] of globalCache) {
      if (key.startsWith(cacheKey)) {
        globalCache.delete(key);
      }
    }
  }, [cacheKey]);

  // Fonction pour changer de page
  const handleSetPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Fonction pour changer le nombre d'éléments par page
  const handleSetItemsPerPage = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset à la première page
  }, []);

  // Fonction pour changer les paramètres
  const handleSetParams = useCallback((newParams: any) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setCurrentPage(1); // Reset à la première page
  }, []);

  // Effect pour fetch les données quand les paramètres changent
  useEffect(() => {
    const fetchParams = { ...params, page: currentPage, limit: itemsPerPage };
    fetchData(fetchParams);
  }, [currentPage, itemsPerPage, params, fetchData]);

  return {
    data,
    total,
    loading,
    error,
    refetch,
    invalidateCache,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    totalPages,
    itemsPerPage,
    setPage: handleSetPage,
    setItemsPerPage: handleSetItemsPerPage,
    setParams: handleSetParams
  };
}

// Hook pour la gestion du cache global
export function useCacheManager() {
  const clearAllCache = useCallback(() => {
    globalCache.clear();
  }, []);

  const clearCacheByKey = useCallback((key: string) => {
    for (const [cacheKey] of globalCache) {
      if (cacheKey.startsWith(key)) {
        globalCache.delete(cacheKey);
      }
    }
  }, []);

  const getCacheStats = useCallback(() => {
    return {
      totalEntries: globalCache.size,
      keys: Array.from(globalCache.keys()),
      memoryUsage: JSON.stringify(Array.from(globalCache.values())).length
    };
  }, []);

  return {
    clearAllCache,
    clearCacheByKey,
    getCacheStats
  };
}
