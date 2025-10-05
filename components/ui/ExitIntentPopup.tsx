"use client";

import { useState, useEffect } from "react";
import { X, Gift, Timer, CheckCircle } from "lucide-react";
import Link from "next/link";

interface ExitIntentPopupProps {
  locale: string;
}

export function ExitIntentPopup({ locale }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);

  // Traductions inline pour éviter les problèmes d'import
  const getTranslations = () => {
    const translations = {
      fr: {
        title: "Attendez !",
        subtitle: "Ne partez pas sans votre bonus !",
        offer: "Offre Spéciale",
        limitedTime: "Offre limitée dans le temps",
        mainOffer: "30 jours GRATUITS au lieu de 14 !",
        description: "Profitez de 30 jours d'essai gratuit + configuration personnalisée par nos experts",
        benefits: {
          trial: "30 jours d'essai gratuit (au lieu de 14)",
          setup: "Configuration personnalisée incluse",
          support: "Support prioritaire 24/7",
          training: "Formation gratuite de 2h"
        },
        cta: {
          primary: "🚀 Profiter de l'offre maintenant",
          secondary: "Non merci, continuer à naviguer"
        },
        disclaimer: "Aucune carte requise • Annulation possible à tout moment"
      },
      en: {
        title: "Wait!",
        subtitle: "Don't leave without your bonus!",
        offer: "Special Offer",
        limitedTime: "Limited time offer",
        mainOffer: "30 days FREE instead of 14!",
        description: "Get 30 days free trial + personalized setup by our experts",
        benefits: {
          trial: "30 days free trial (instead of 14)",
          setup: "Personalized setup included",
          support: "Priority 24/7 support",
          training: "Free 2h training session"
        },
        cta: {
          primary: "🚀 Claim offer now",
          secondary: "No thanks, continue browsing"
        },
        disclaimer: "No card required • Cancel anytime"
      },
      es: {
        title: "¡Espera!",
        subtitle: "¡No te vayas sin tu bono!",
        offer: "Oferta Especial",
        limitedTime: "Oferta por tiempo limitado",
        mainOffer: "¡30 días GRATIS en lugar de 14!",
        description: "Obtén 30 días de prueba gratuita + configuración personalizada por nuestros expertos",
        benefits: {
          trial: "30 días de prueba gratuita (en lugar de 14)",
          setup: "Configuración personalizada incluida",
          support: "Soporte prioritario 24/7",
          training: "Sesión de formación gratuita de 2h"
        },
        cta: {
          primary: "🚀 Aprovechar la oferta ahora",
          secondary: "No gracias, continuar navegando"
        },
        disclaimer: "No se requiere tarjeta • Cancela en cualquier momento"
      }
    };
    
    return translations[locale as keyof typeof translations] || translations.fr;
  };

  const t = getTranslations();

  useEffect(() => {
    // Timer pour le temps passé sur la page
    const timer = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);

    // Détecter l'exit intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible && timeOnPage > 10) {
        setIsVisible(true);
        clearInterval(timer);
      }
    };

    // Détecter la tentative de fermeture d'onglet
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isVisible && timeOnPage > 15) {
        setIsVisible(true);
        e.preventDefault();
        e.returnValue = '';
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isVisible, timeOnPage]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
          {/* Close button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          {/* Header avec effet waou */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-6 h-6" />
                <span className="text-sm font-medium">{t.offer || 'Offre Spéciale'}</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {t.title || 'Attendez !'}
              </h3>
              <p className="text-blue-100">
                {t.subtitle || 'Ne partez pas sans votre bonus !'}
              </p>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Timer className="w-4 h-4" />
                {t.limitedTime || 'Offre limitée dans le temps'}
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {t.mainOffer || '30 jours GRATUITS au lieu de 14 !'}
              </h4>
              
              <p className="text-gray-600 mb-6">
                {t.description || 'Profitez de 30 jours d\'essai gratuit + configuration personnalisée par nos experts'}
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  {t.benefits.trial}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  {t.benefits.setup}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  {t.benefits.support}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  {t.benefits.training}
                </span>
              </div>
            </div>
            
            {/* CTA */}
            <div className="space-y-3">
              <Link href={`/${locale}/auth/signup`} className="block">
                <button 
                  onClick={() => setIsVisible(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {t.cta.primary}
                </button>
              </Link>
              <button 
                onClick={() => setIsVisible(false)}
                className="w-full border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                {t.cta.secondary}
              </button>
              <p className="text-xs text-gray-500 text-center">
                {t.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
