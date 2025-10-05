"use client";

import Link from "next/link";
import { Calendar, Mail, Phone, MapPin } from "lucide-react";

interface MultilingualFooterProps {
  locale: string;
}

export function MultilingualFooter({ locale }: MultilingualFooterProps) {
  // Définir les traductions selon la locale
  const getTranslations = (locale: string) => {
    switch (locale) {
      case 'en':
        return {
          description: "The complete solution for live performance management. Organize, plan and monetize your cultural events.",
          quickLinks: "Quick Links",
          features: "Features",
          pricing: "Pricing",
          blog: "Blog",
          demo: "Demo",
          contact: "Contact",
          support: "Support",
          help: "Help Center",
          documentation: "Documentation",
          api: "API",
          company: "Company",
          about: "About",
          careers: "Careers",
          press: "Press",
          legal: "Legal",
          privacy: "Privacy Policy",
          terms: "Terms of Service",
          cookies: "Cookie Policy",
          newsletter: "Newsletter",
          newsletterDescription: "Stay updated with the latest news and features.",
          subscribe: "Subscribe",
          emailPlaceholder: "Your email address",
          copyright: "© 2025 Plannitech. All rights reserved.",
          madeWith: "Made with ❤️ for the live performance industry"
        };
      case 'es':
        return {
          description: "La solución completa para la gestión de espectáculos en vivo. Organiza, planifica y monetiza tus eventos culturales.",
          quickLinks: "Enlaces Rápidos",
          features: "Características",
          pricing: "Precios",
          blog: "Blog",
          demo: "Demo",
          contact: "Contacto",
          support: "Soporte",
          help: "Centro de Ayuda",
          documentation: "Documentación",
          api: "API",
          company: "Empresa",
          about: "Acerca de",
          careers: "Carreras",
          press: "Prensa",
          legal: "Legal",
          privacy: "Política de Privacidad",
          terms: "Términos de Servicio",
          cookies: "Política de Cookies",
          newsletter: "Boletín",
          newsletterDescription: "Mantente actualizado con las últimas noticias y características.",
          subscribe: "Suscribirse",
          emailPlaceholder: "Tu dirección de email",
          copyright: "© 2025 Plannitech. Todos los derechos reservados.",
          madeWith: "Hecho con ❤️ para la industria del espectáculo en vivo"
        };
      default: // fr
        return {
          description: "La solution complète pour la gestion du spectacle vivant. Organisez, planifiez et monétisez vos événements culturels.",
          quickLinks: "Liens rapides",
          features: "Fonctionnalités",
          pricing: "Tarifs",
          blog: "Blog",
          demo: "Démo",
          contact: "Contact",
          support: "Support",
          help: "Centre d'aide",
          documentation: "Documentation",
          api: "API",
          company: "Entreprise",
          about: "À propos",
          careers: "Carrières",
          press: "Presse",
          legal: "Légal",
          privacy: "Politique de confidentialité",
          terms: "Conditions d'utilisation",
          cookies: "Politique des cookies",
          newsletter: "Newsletter",
          newsletterDescription: "Restez informé des dernières actualités et fonctionnalités.",
          subscribe: "S'abonner",
          emailPlaceholder: "Votre adresse email",
          copyright: "© 2025 Plannitech. Tous droits réservés.",
          madeWith: "Fait avec ❤️ pour l'industrie du spectacle vivant"
        };
    }
  };

  const t = getTranslations(locale);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Plannitech</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              {t.description}
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">contact@plannitech.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/features`} className="text-gray-300 hover:text-white transition-colors">
                  {t.features}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pricing`} className="text-gray-300 hover:text-white transition-colors">
                  {t.pricing}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-gray-300 hover:text-white transition-colors">
                  {t.blog}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/demo`} className="text-gray-300 hover:text-white transition-colors">
                  {t.demo}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-300 hover:text-white transition-colors">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.support}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t.help}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t.documentation}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t.api}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.company}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t.careers}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t.press}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t.newsletter}</h3>
              <p className="text-gray-300">{t.newsletterDescription}</p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {t.subscribe}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                {t.privacy}
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                {t.terms}
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                {t.cookies}
              </Link>
            </div>
            <div className="text-gray-300 text-sm text-center">
              <p>{t.copyright}</p>
              <p className="mt-1">{t.madeWith}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

