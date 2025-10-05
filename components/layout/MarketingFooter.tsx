"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";

export function MarketingFooter() {
  const footerSections = [
    {
      title: "Produit",
      links: [
        { name: "Fonctionnalités", href: "/features" },
        { name: "Tarifs", href: "/pricing" },
        { name: "Démo", href: "/demo" },
        { name: "API", href: "#" },
        { name: "Intégrations", href: "#" }
      ]
    },
    {
      title: "Ressources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Documentation", href: "#" },
        { name: "Centre d'aide", href: "#" },
        { name: "Tutoriels", href: "#" },
        { name: "Statut", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact", href: "/contact" },
        { name: "Support technique", href: "#" },
        { name: "Formation", href: "#" },
        { name: "Communauté", href: "#" }
      ]
    },
    {
      title: "Légal",
      links: [
        { name: "Conditions d'utilisation", href: "#" },
        { name: "Politique de confidentialité", href: "#" },
        { name: "RGPD", href: "#" },
        { name: "Mentions légales", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Plannitech</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              La solution complète pour la gestion du spectacle vivant.
            </p>
            <div className="text-sm text-gray-400">
              <p>contact@plannitech.com</p>
              <p>+33 1 23 45 67 89</p>
            </div>
          </div>

          {/* Liens par section */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4 text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-semibold text-white mb-2">Newsletter</h3>
              <p className="text-gray-400 text-sm">
                Recevez nos derniers conseils et actualités directement dans votre boîte mail.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 Plannitech. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

