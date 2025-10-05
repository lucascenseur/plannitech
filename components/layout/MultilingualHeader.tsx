"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  Menu,
  X,
  Globe,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MultilingualHeaderProps {
  currentPage?: string;
  locale: string;
}

export function MultilingualHeader({ currentPage, locale }: MultilingualHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fonction pour générer l'URL de changement de langue en gardant la page actuelle
  const getLanguageUrl = (newLocale: string) => {
    // Déterminer la page actuelle basée sur currentPage
    const pageMap: { [key: string]: string } = {
      'home': 'landing',
      'features': 'features',
      'pricing': 'pricing',
      'blog': 'blog',
      'demo': 'demo',
      'contact': 'contact'
    };
    
    const currentPagePath = pageMap[currentPage || 'home'] || 'landing';
    return `/${newLocale}/${currentPagePath}`;
  };

  // Configuration des langues supportées
  // Pour ajouter de nouvelles langues, il suffit d'ajouter un objet ici
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    // Exemples d'ajout de nouvelles langues :
    // { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    // { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    // { code: 'pt', name: 'Português', flag: '🇵🇹' },
    // { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    // { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    // { code: 'ja', name: '日本語', flag: '🇯🇵' },
    // { code: 'ko', name: '한국어', flag: '🇰🇷' },
    // { code: 'zh', name: '中文', flag: '🇨🇳' },
    // { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    // { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  // Fonction pour obtenir la langue actuelle
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === locale) || languages[0];
  };

  // Définir les traductions selon la locale
  const getTranslations = (locale: string) => {
    switch (locale) {
      case 'en':
        return {
          home: "Home",
          features: "Features",
          pricing: "Pricing",
          blog: "Blog",
          demo: "Demo",
          contact: "Contact",
          login: "Login",
          signup: "Sign Up"
        };
      case 'es':
        return {
          home: "Inicio",
          features: "Características",
          pricing: "Precios",
          blog: "Blog",
          demo: "Demo",
          contact: "Contacto",
          login: "Iniciar sesión",
          signup: "Registrarse"
        };
      default: // fr
        return {
          home: "Accueil",
          features: "Fonctionnalités",
          pricing: "Tarifs",
          blog: "Blog",
          demo: "Démo",
          contact: "Contact",
          login: "Connexion",
          signup: "Inscription"
        };
    }
  };

  const t = getTranslations(locale);

  const navigation = [
    { name: t.home, href: `/${locale}/landing`, current: currentPage === "home" },
    { name: t.features, href: `/${locale}/features`, current: currentPage === "features" },
    { name: t.pricing, href: `/${locale}/pricing`, current: currentPage === "pricing" },
    { name: t.contact, href: `/${locale}/contact`, current: currentPage === "contact" }
  ];

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}/landing`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Plannitech</span>
          </Link>

          {/* Desktop Navigation - Centré */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  item.current 
                    ? 'text-blue-600' 
                    : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector - Intégré avec les boutons */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{getCurrentLanguage().flag}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((language) => (
                  <DropdownMenuItem key={language.code} asChild>
                    <Link href={getLanguageUrl(language.code)} className="flex items-center space-x-2 w-full">
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href={`/${locale}/auth/signin`}>
              <Button variant="ghost" size="sm">
                {t.login}
              </Button>
            </Link>
            <Link href={`/${locale}/auth/signup`}>
              <Button size="sm">
                {t.signup}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Language Selector Mobile - Plus discret */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <span>{getCurrentLanguage().flag}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((language) => (
                <DropdownMenuItem key={language.code} asChild>
                  <Link href={getLanguageUrl(language.code)} className="flex items-center space-x-2 w-full">
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-base font-medium transition-colors hover:text-blue-600 ${
                  item.current 
                    ? 'text-blue-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t space-y-3">
              <Link href={`/${locale}/auth/signin`} className="block">
                <Button variant="ghost" className="w-full justify-start">
                  {t.login}
                </Button>
              </Link>
              <Link href={`/${locale}/auth/signup`} className="block">
                <Button className="w-full">
                  {t.signup}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
