import fs from 'fs';
import path from 'path';
import { Locale, Namespace, Translations } from './translations';

/**
 * Charge les traductions depuis les fichiers JSON
 * @param locale - Code de la langue
 * @param namespace - Namespace des traductions
 * @returns Traductions chargées
 */
export async function getServerTranslations(locale: Locale, namespace: Namespace): Promise<Translations> {
  try {
    const filePath = path.join(process.cwd(), 'locales', `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Fichier de traduction manquant: ${filePath}`);
      return {};
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const allTranslations = JSON.parse(fileContent);
    
    // Retourner le namespace spécifique ou toutes les traductions
    return allTranslations[namespace] || allTranslations;
  } catch (error) {
    console.error(`Erreur lors du chargement des traductions ${locale}-${namespace}:`, error);
    return {};
  }
}

/**
 * Charge toutes les traductions pour une locale
 * @param locale - Code de la langue
 * @returns Toutes les traductions pour la locale
 */
export async function getAllTranslations(locale: Locale): Promise<Translations> {
  try {
    const filePath = path.join(process.cwd(), 'locales', `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Fichier de traduction manquant: ${filePath}`);
      return {};
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Erreur lors du chargement de toutes les traductions ${locale}:`, error);
    return {};
  }
}

/**
 * Vérifie si un fichier de traduction existe
 * @param locale - Code de la langue
 * @returns true si le fichier existe
 */
export function translationFileExists(locale: Locale): boolean {
  const filePath = path.join(process.cwd(), 'locales', `${locale}.json`);
  return fs.existsSync(filePath);
}

/**
 * Liste tous les fichiers de traduction disponibles
 * @returns Liste des locales disponibles
 */
export function getAvailableLocales(): Locale[] {
  const localesDir = path.join(process.cwd(), 'locales');
  
  if (!fs.existsSync(localesDir)) {
    return [];
  }
  
  const files = fs.readdirSync(localesDir);
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''))
    .filter((locale): locale is Locale => 
      ['fr', 'en', 'es'].includes(locale)
    );
}

