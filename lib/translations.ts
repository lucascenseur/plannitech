import { getServerTranslations } from './server-translations';

// Types pour la sécurité TypeScript
export type Locale = 'fr' | 'en' | 'es';
export type Namespace = 'common' | 'auth' | 'dashboard' | 'navigation' | 'seo' | 'errors';

// Configuration des langues supportées
export const supportedLocales: Locale[] = ['fr', 'en', 'es'];
export const defaultLocale: Locale = 'fr';

// Interface pour les traductions
export interface Translations {
  [key: string]: string | Translations;
}

// Cache des traductions pour les performances
const translationCache = new Map<string, Translations>();

/**
 * Charge les traductions pour une locale et un namespace donnés
 * @param locale - Code de la langue (fr, en, es)
 * @param namespace - Namespace des traductions (common, auth, dashboard, etc.)
 * @returns Objet contenant les traductions
 */
export async function getTranslations(locale: Locale, namespace: Namespace): Promise<Translations> {
  const cacheKey = `${locale}-${namespace}`;
  
  // Vérifier le cache d'abord
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    // Charger les traductions depuis le fichier JSON
    const translations = await getServerTranslations(locale, namespace);
    
    // Mettre en cache
    translationCache.set(cacheKey, translations);
    
    return translations;
  } catch (error) {
    console.error(`Erreur lors du chargement des traductions ${locale}-${namespace}:`, error);
    
    // Fallback vers le français si disponible
    if (locale !== 'fr') {
      try {
        const fallbackTranslations = await getServerTranslations('fr', namespace);
        return fallbackTranslations;
      } catch (fallbackError) {
        console.error(`Erreur lors du chargement du fallback fr-${namespace}:`, fallbackError);
        return {};
      }
    }
    
    return {};
  }
}

/**
 * Obtient une traduction spécifique avec support des clés imbriquées
 * @param translations - Objet des traductions
 * @param key - Clé de la traduction (peut être imbriquée avec des points)
 * @param fallback - Valeur de fallback si la clé n'existe pas
 * @returns Traduction ou valeur de fallback
 */
export function getTranslation(
  translations: Translations, 
  key: string, 
  fallback?: string
): string {
  const keys = key.split('.');
  let current: any = translations;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return fallback || key;
    }
  }
  
  return typeof current === 'string' ? current : (fallback || key);
}

/**
 * Obtient les traductions pour plusieurs namespaces
 * @param locale - Code de la langue
 * @param namespaces - Liste des namespaces à charger
 * @returns Objet contenant toutes les traductions
 */
export async function getMultipleTranslations(
  locale: Locale, 
  namespaces: Namespace[]
): Promise<Record<Namespace, Translations>> {
  const results = await Promise.all(
    namespaces.map(async (namespace) => ({
      namespace,
      translations: await getTranslations(locale, namespace)
    }))
  );
  
  return results.reduce((acc, { namespace, translations }) => {
    acc[namespace] = translations;
    return acc;
  }, {} as Record<Namespace, Translations>);
}

/**
 * Valide qu'une locale est supportée
 * @param locale - Code de la langue à valider
 * @returns true si la locale est supportée
 */
export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}

/**
 * Obtient la locale par défaut si la locale fournie n'est pas valide
 * @param locale - Code de la langue
 * @returns Locale valide
 */
export function getValidLocale(locale: string): Locale {
  return isValidLocale(locale) ? locale : defaultLocale;
}

/**
 * Génère les URLs alternates pour le SEO
 * @param pathname - Chemin actuel
 * @param baseUrl - URL de base du site
 * @returns URLs alternates pour toutes les langues
 */
export function generateAlternateUrls(pathname: string, baseUrl: string = 'https://plannitech.com') {
  return supportedLocales.map(locale => ({
    hrefLang: locale,
    href: `${baseUrl}/${locale}${pathname.replace(/^\/[a-z]{2}/, '')}`
  }));
}