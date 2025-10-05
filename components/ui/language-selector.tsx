"use client";

import { useState } from 'react';
import { useLocale } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe } from 'lucide-react';
import Link from 'next/link';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

export function LanguageSelector({ className, variant = 'default' }: LanguageSelectorProps) {
  const { currentLocale, switchLocale, localeNames, localeFlags } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {Object.entries(localeNames).map(([locale, name]) => (
          <Link
            key={locale}
            href={switchLocale(locale as any)}
            className={`text-sm px-2 py-1 rounded transition-colors ${
              currentLocale === locale
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {localeFlags[locale as keyof typeof localeFlags]} {locale.toUpperCase()}
          </Link>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={className}>
            <Globe className="w-4 h-4 mr-1" />
            {localeFlags[currentLocale]} {currentLocale.toUpperCase()}
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.entries(localeNames).map(([locale, name]) => (
            <DropdownMenuItem key={locale} asChild>
              <Link
                href={switchLocale(locale as any)}
                className="flex items-center space-x-2 w-full"
                onClick={() => handleLanguageChange(locale)}
              >
                <span>{localeFlags[locale as keyof typeof localeFlags]}</span>
                <span>{name}</span>
                {currentLocale === locale && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <Globe className="w-4 h-4 mr-2" />
          {localeFlags[currentLocale]} {localeNames[currentLocale]}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(localeNames).map(([locale, name]) => (
          <DropdownMenuItem key={locale} asChild>
            <Link
              href={switchLocale(locale as any)}
              className="flex items-center space-x-3 w-full"
              onClick={() => handleLanguageChange(locale)}
            >
              <span className="text-lg">{localeFlags[locale as keyof typeof localeFlags]}</span>
              <div className="flex-1">
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-500">{locale.toUpperCase()}</div>
              </div>
              {currentLocale === locale && (
                <span className="text-blue-600">✓</span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

