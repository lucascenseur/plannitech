"use client";

import { useLocale } from '@/lib/i18n';
import { useMemo } from 'react';

// Type pour les traductions
type Translation = Record<string, any>;

// Cache des traductions
const translationCache: Record<string, Translation> = {};

// Fonction pour charger les traductions
async function loadTranslations(locale: string): Promise<Translation> {
  if (translationCache[locale]) {
    return translationCache[locale];
  }

  try {
    const translations = await import(`@/locales/${locale}.json`);
    translationCache[locale] = translations.default;
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    // Fallback vers le français
    if (locale !== 'fr') {
      return loadTranslations('fr');
    }
    return {};
  }
}

// Hook principal de traduction
export function useTranslation() {
  const { currentLocale } = useLocale();
  
  const t = useMemo(() => {
    return (key: string, fallback?: string): string => {
      const keys = key.split('.');
      let value: any = translationCache[currentLocale] || {};
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return fallback || key;
        }
      }
      
      return typeof value === 'string' ? value : (fallback || key);
    };
  }, [currentLocale]);

  return { t, locale: currentLocale };
}

// Hook pour charger les traductions
export function useTranslations() {
  const { currentLocale } = useLocale();
  
  const loadTranslationsForLocale = async (locale: string = currentLocale) => {
    return await loadTranslations(locale);
  };

  return { loadTranslationsForLocale };
}

