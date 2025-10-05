/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour la production
  output: 'standalone',
  experimental: {
    // Optimisations pour Next.js 14.2.33
    optimizePackageImports: ['@radix-ui/react-select', '@radix-ui/react-checkbox', '@radix-ui/react-label'],
  },
  env: {
    NEXTAUTH_SECRET: 'test-secret-key-for-development'
  },
  // Redirection automatique vers la langue par défaut
  async redirects() {
    return [
      {
        source: '/',
        destination: '/fr',
        permanent: false,
      },
    ];
  },
  // Configuration des headers pour le SEO multilingue
  async headers() {
    return [
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;