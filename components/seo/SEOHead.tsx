import { Metadata } from "next";

interface SEOHeadProps {
  locale: string;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle?: string | undefined;
  ogDescription?: string | undefined;
  ogImage?: string | undefined;
  twitterTitle?: string | undefined;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
}

export function SEOHead({
  locale,
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData
}: SEOHeadProps) {
  const baseUrl = 'https://plannitech.com';
  const currentLocale = locale;
  
  // Générer les URLs pour toutes les langues
  const alternateUrls = {
    'fr': canonicalUrl.replace(`/${currentLocale}/`, '/fr/'),
    'en': canonicalUrl.replace(`/${currentLocale}/`, '/en/'),
    'es': canonicalUrl.replace(`/${currentLocale}/`, '/es/'),
  };

  return (
    <>
      {/* Meta tags de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Plannitech Team" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang pour toutes les langues */}
      <link rel="alternate" hrefLang="fr" href={alternateUrls.fr} />
      <link rel="alternate" hrefLang="en" href={alternateUrls.en} />
      <link rel="alternate" hrefLang="es" href={alternateUrls.es} />
      <link rel="alternate" hrefLang="x-default" href={alternateUrls.fr} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={currentLocale === 'fr' ? 'fr_FR' : currentLocale === 'en' ? 'en_US' : 'es_ES'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:site_name" content="Plannitech" />
      <meta property="og:image" content={ogImage || `${baseUrl}/images/og-${currentLocale}.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogTitle || title} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@plannitech" />
      <meta name="twitter:creator" content="@plannitech" />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:image" content={twitterImage || `${baseUrl}/images/twitter-${currentLocale}.jpg`} />
      
      {/* Données structurées JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Meta tags spécifiques par langue */}
      {currentLocale === 'fr' && (
        <>
          <meta name="geo.region" content="FR" />
          <meta name="geo.country" content="France" />
          <meta name="language" content="French" />
        </>
      )}
      
      {currentLocale === 'en' && (
        <>
          <meta name="geo.region" content="US" />
          <meta name="geo.country" content="United States" />
          <meta name="language" content="English" />
        </>
      )}
      
      {currentLocale === 'es' && (
        <>
          <meta name="geo.region" content="ES" />
          <meta name="geo.country" content="Spain" />
          <meta name="language" content="Spanish" />
        </>
      )}
      
      {/* Meta tags de performance */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Meta tags de sécurité */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </>
  );
}

