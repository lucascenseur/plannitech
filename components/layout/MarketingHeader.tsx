"use client";

import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useTranslation } from "@/hooks/useTranslation";

interface MarketingHeaderProps {
  currentPage?: string;
}

export function MarketingHeader({ currentPage }: MarketingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.home'), href: "/", current: currentPage === "home" },
    { name: t('navigation.features'), href: "/features", current: currentPage === "features" },
    { name: t('navigation.pricing'), href: "/pricing", current: currentPage === "pricing" },
    { name: t('navigation.blog'), href: "/blog", current: currentPage === "blog" },
    { name: t('navigation.demo'), href: "/demo", current: currentPage === "demo" },
    { name: t('navigation.contact'), href: "/contact", current: currentPage === "contact" }
  ];

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Plannitech</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
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
          <LanguageSelector variant="compact" />
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm">
              {t('navigation.login')}
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">
              {t('home.hero.cta')}
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
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
              <div className="mb-4">
                <LanguageSelector variant="minimal" />
              </div>
              <Link href="/auth/signin" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  {t('navigation.login')}
                </Button>
              </Link>
              <Link href="/auth/signup" className="block">
                <Button className="w-full">
                  {t('home.hero.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
