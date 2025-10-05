import { Metadata } from "next";
import { Locale } from "./translations";

// Configuration SEO par langue
const seoConfig = {
  fr: {
    siteName: "Plannitech",
    baseUrl: "https://plannitech.com",
    defaultTitle: "Plannitech - Gestion du spectacle vivant",
    defaultDescription: "Plateforme SaaS complète pour la gestion du spectacle vivant. Planning, budget, contacts, outils techniques et plus encore.",
    keywords: "spectacle vivant, gestion événementielle, planning, budget, contacts, outils techniques, SaaS, culture, art, théâtre, concert, festival",
    locale: "fr_FR",
    country: "France",
    region: "FR"
  },
  en: {
    siteName: "Plannitech",
    baseUrl: "https://plannitech.com",
    defaultTitle: "Plannitech - Live Performance Management",
    defaultDescription: "Complete SaaS platform for live performance management. Planning, budget, contacts, technical tools and more.",
    keywords: "live performance, event management, planning, budget, contacts, technical tools, SaaS, culture, art, theater, concert, festival",
    locale: "en_US",
    country: "United States",
    region: "US"
  },
  es: {
    siteName: "Plannitech",
    baseUrl: "https://plannitech.com",
    defaultTitle: "Plannitech - Gestión de espectáculos en vivo",
    defaultDescription: "Plataforma SaaS completa para la gestión de espectáculos en vivo. Planificación, presupuesto, contactos, herramientas técnicas y más.",
    keywords: "espectáculos en vivo, gestión de eventos, planificación, presupuesto, contactos, herramientas técnicas, SaaS, cultura, arte, teatro, concierto, festival",
    locale: "es_ES",
    country: "Spain",
    region: "ES"
  }
};

// Génération des métadonnées SEO optimisées
export function generateSEOMetadata({
  locale,
  title,
  description,
  keywords,
  path,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData
}: {
  locale: Locale;
  title: string;
  description: string;
  keywords: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
}): Metadata {
  const config = seoConfig[locale];
  const canonicalUrl = `${config.baseUrl}/${locale}${path}`;
  
  // Générer les URLs alternates pour toutes les langues
  const alternateUrls = {
    'fr': `${config.baseUrl}/fr${path}`,
    'en': `${config.baseUrl}/en${path}`,
    'es': `${config.baseUrl}/es${path}`,
  };

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Plannitech Team' }],
    creator: 'Plannitech',
    publisher: 'Plannitech',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(config.baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      type: 'website',
      locale: config.locale,
      url: canonicalUrl,
      title: ogTitle || title,
      description: ogDescription || description,
      siteName: config.siteName,
      images: [
        {
          url: ogImage || `${config.baseUrl}/images/og-${locale}${path.replace(/\//g, '-')}.jpg`,
          width: 1200,
          height: 630,
          alt: ogTitle || title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle || title,
      description: twitterDescription || description,
      images: [twitterImage || `${config.baseUrl}/images/twitter-${locale}${path.replace(/\//g, '-')}.jpg`],
      creator: '@plannitech',
      site: '@plannitech',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
    other: {
      'geo.region': config.region,
      'geo.country': config.country,
      'language': locale === 'fr' ? 'French' : locale === 'en' ? 'English' : 'Spanish',
    },
  };
}

// Données structurées par type de page
export function generateStructuredData({
  locale,
  type,
  title,
  description,
  url,
  additionalData = {}
}: {
  locale: Locale;
  type: 'website' | 'software' | 'organization' | 'service';
  title: string;
  description: string;
  url: string;
  additionalData?: any;
}) {
  const config = seoConfig[locale];
  
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'website' ? 'WebSite' : 
             type === 'software' ? 'SoftwareApplication' :
             type === 'organization' ? 'Organization' : 'Service',
    "name": title,
    "description": description,
    "url": url,
    "inLanguage": locale,
    "publisher": {
      "@type": "Organization",
      "name": "Plannitech",
      "url": config.baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${config.baseUrl}/images/logo.png`
      }
    }
  };

  // Ajouter des données spécifiques selon le type
  if (type === 'software') {
    return {
      ...baseStructuredData,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": locale === 'fr' ? "Essai gratuit 14 jours" : 
                      locale === 'en' ? "14-day free trial" : 
                      "Prueba gratuita de 14 días"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      ...additionalData
    };
  }

  if (type === 'organization') {
    return {
      ...baseStructuredData,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": config.country,
        "addressRegion": config.region
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+33-1-23-45-67-89",
        "contactType": "customer service",
        "availableLanguage": ["French", "English", "Spanish"]
      },
      ...additionalData
    };
  }

  return { ...baseStructuredData, ...additionalData };
}

// Configuration SEO spécifique par page
export const pageSEOConfig = {
  landing: {
    fr: {
      title: "Plannitech - Solution Complète pour le Spectacle Vivant",
      description: "Plateforme SaaS complète pour la gestion du spectacle vivant. Planning intelligent, gestion financière, contacts et outils techniques. Essai gratuit 14 jours.",
      keywords: "spectacle vivant, gestion événementielle, planning culture, budget spectacle, contacts artistes, outils techniques, SaaS culture, théâtre, concert, festival"
    },
    en: {
      title: "Plannitech - Complete Live Performance Management Solution",
      description: "Complete SaaS platform for live performance management. Smart planning, financial management, contacts and technical tools. 14-day free trial.",
      keywords: "live performance, event management, cultural planning, performance budget, artist contacts, technical tools, cultural SaaS, theater, concert, festival"
    },
    es: {
      title: "Plannitech - Solución Completa para Espectáculos en Vivo",
      description: "Plataforma SaaS completa para la gestión de espectáculos en vivo. Planificación inteligente, gestión financiera, contactos y herramientas técnicas. Prueba gratuita de 14 días.",
      keywords: "espectáculos en vivo, gestión de eventos, planificación cultural, presupuesto espectáculo, contactos artistas, herramientas técnicas, SaaS cultural, teatro, concierto, festival"
    }
  },
  features: {
    fr: {
      title: "Fonctionnalités Plannitech - Gestion Complète du Spectacle Vivant",
      description: "Découvrez toutes les fonctionnalités de Plannitech : planning intelligent, gestion financière, contacts, outils techniques. La solution complète pour le spectacle vivant.",
      keywords: "fonctionnalités spectacle vivant, planning événementiel, gestion financière culture, outils techniques spectacle, SaaS culture, gestion artistes, planification événements"
    },
    en: {
      title: "Plannitech Features - Complete Live Performance Management",
      description: "Discover all Plannitech features: smart planning, financial management, contacts, technical tools. The complete solution for live performance.",
      keywords: "live performance features, event planning, cultural financial management, technical tools, cultural SaaS, artist management, event planning"
    },
    es: {
      title: "Características Plannitech - Gestión Completa de Espectáculos en Vivo",
      description: "Descubre todas las características de Plannitech: planificación inteligente, gestión financiera, contactos, herramientas técnicas. La solución completa para espectáculos en vivo.",
      keywords: "características espectáculos en vivo, planificación eventos, gestión financiera cultural, herramientas técnicas, SaaS cultural, gestión artistas, planificación eventos"
    }
  },
  pricing: {
    fr: {
      title: "Tarifs Plannitech - Plans Flexibles pour le Spectacle Vivant",
      description: "Découvrez nos tarifs flexibles pour la gestion du spectacle vivant. Plans Freelance, Team et Pro. Essai gratuit 14 jours, sans engagement.",
      keywords: "tarifs spectacle vivant, prix gestion événementielle, abonnement SaaS culture, plans spectacle, facturation culture, coût gestion artistes"
    },
    en: {
      title: "Plannitech Pricing - Flexible Plans for Live Performance",
      description: "Discover our flexible pricing for live performance management. Freelance, Team and Pro plans. 14-day free trial, no commitment.",
      keywords: "live performance pricing, event management pricing, cultural SaaS subscription, performance plans, cultural billing, artist management cost"
    },
    es: {
      title: "Precios Plannitech - Planes Flexibles para Espectáculos en Vivo",
      description: "Descubre nuestros precios flexibles para la gestión de espectáculos en vivo. Planes Freelance, Team y Pro. Prueba gratuita de 14 días, sin compromiso.",
      keywords: "precios espectáculos en vivo, precios gestión eventos, suscripción SaaS cultural, planes espectáculo, facturación cultural, costo gestión artistas"
    }
  },
  contact: {
    fr: {
      title: "Contact Plannitech - Support et Assistance Spectacle Vivant",
      description: "Contactez l'équipe Plannitech pour toute question sur la gestion du spectacle vivant. Support technique, formation et assistance personnalisée.",
      keywords: "contact spectacle vivant, support gestion événementielle, assistance SaaS culture, formation spectacle, aide technique culture"
    },
    en: {
      title: "Contact Plannitech - Live Performance Support and Assistance",
      description: "Contact the Plannitech team for any questions about live performance management. Technical support, training and personalized assistance.",
      keywords: "live performance contact, event management support, cultural SaaS assistance, performance training, cultural technical help"
    },
    es: {
      title: "Contacto Plannitech - Soporte y Asistencia para Espectáculos en Vivo",
      description: "Contacta con el equipo de Plannitech para cualquier pregunta sobre la gestión de espectáculos en vivo. Soporte técnico, formación y asistencia personalizada.",
      keywords: "contacto espectáculos en vivo, soporte gestión eventos, asistencia SaaS cultural, formación espectáculo, ayuda técnica cultural"
    }
  }
};

