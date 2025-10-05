import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

export const locales = ['fr', 'en', 'es'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇺🇸',
  es: '🇪🇸',
};

// Configuration des langues supportées
export const supportedLocales = {
  fr: {
    name: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR',
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR',
  },
};

// Fonction pour obtenir la locale actuelle
export function getCurrentLocale(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;
  return locales.includes(locale) ? locale : defaultLocale;
}

// Fonction pour obtenir le chemin sans la locale
export function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split('/');
  const locale = segments[1];
  
  if (locales.includes(locale as Locale)) {
    return '/' + segments.slice(2).join('/');
  }
  
  return pathname;
}

// Fonction pour générer les URLs alternatives (hreflang)
export function generateAlternateUrls(pathname: string, baseUrl: string = 'https://plannitech.com') {
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  
  return locales.map(locale => ({
    locale,
    url: `${baseUrl}/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
  }));
}

// Hook pour la gestion des langues
export function useLocale() {
  const pathname = usePathname();
  const currentLocale = getCurrentLocale(pathname);
  
  const switchLocale = (newLocale: Locale) => {
    const pathWithoutLocale = getPathWithoutLocale(pathname);
    return `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  };
  
  return {
    currentLocale,
    switchLocale,
    locales,
    localeNames,
    localeFlags,
  };
}

