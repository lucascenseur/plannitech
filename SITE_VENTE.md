# 🚀 Site de Vente Plannitech

## 📋 Vue d'ensemble

Site de vente complet pour **Plannitech**, une plateforme SaaS de gestion du spectacle vivant. Le site inclut toutes les pages marketing nécessaires pour convertir les visiteurs en clients.

## 🎯 Pages Disponibles

### Pages Principales
- **`/`** → Redirige vers `/landing` (page d'accueil)
- **`/landing`** → Page d'accueil avec hero, fonctionnalités, témoignages
- **`/features`** → Fonctionnalités détaillées avec grille interactive
- **`/pricing`** → Tarifs avec toggle mensuel/annuel et FAQ
- **`/contact`** → Formulaire de contact et informations équipe
- **`/blog`** → Blog avec articles et recherche
- **`/demo`** → Démonstrations interactives

### Pages d'Application
- **`/auth/signin`** → Connexion
- **`/auth/signup`** → Inscription
- **`/onboarding`** → Configuration initiale
- **`/dashboard`** → Tableau de bord principal
- **`/projects`** → Gestion des projets
- **`/contacts`** → Base de données contacts
- **`/budget`** → Gestion financière
- **`/technical`** → Outils techniques
- **`/billing`** → Facturation et abonnements

## 🎨 Design et UX

### Palette de Couleurs
- **Primaire** : Bleu (#2563eb)
- **Secondaire** : Vert, Violet, Orange, Rouge, Jaune
- **Neutres** : Gris clair/foncé
- **Arrière-plans** : Dégradés bleu clair

### Composants UI
- **Shadcn/ui** : Composants modernes et accessibles
- **Tailwind CSS** : Styling utilitaire
- **Lucide Icons** : Icônes cohérentes
- **Responsive** : Mobile-first design

## 📊 Fonctionnalités Marketing

### Landing Page
- ✅ Hero section avec CTA
- ✅ Statistiques impressionnantes
- ✅ Grille de fonctionnalités
- ✅ Témoignages clients
- ✅ CTA final

### Page Fonctionnalités
- ✅ 6 catégories principales
- ✅ Détails par fonctionnalité
- ✅ Intégrations tierces
- ✅ Fonctionnalités avancées

### Page Tarifs
- ✅ 3 plans (Freelance, Team, Pro)
- ✅ Toggle mensuel/annuel
- ✅ Add-ons disponibles
- ✅ FAQ tarifs
- ✅ Comparaison des plans

### Page Contact
- ✅ Formulaire complet
- ✅ Informations équipe
- ✅ Horaires d'ouverture
- ✅ FAQ contact

### Blog
- ✅ Articles organisés par catégorie
- ✅ Recherche d'articles
- ✅ Article en vedette
- ✅ Newsletter CTA

### Démo
- ✅ Sélection de démos
- ✅ Player vidéo
- ✅ Contrôles de navigation
- ✅ Témoignages

## 🔧 Configuration

### Variables d'Environnement
```bash
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/plannitech"

# NextAuth
NEXTAUTH_URL="https://plannitech.com"
NEXTAUTH_SECRET="your-secret-key"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Configuration du Site
Le fichier `site-config.ts` contient :
- Navigation
- Plans de tarification
- Fonctionnalités
- Témoignages
- FAQ
- Équipe
- Contact

## 🚀 Déploiement

### Scripts Disponibles
- **`deploy.sh`** → Déploiement automatique complet
- **`vps-setup.sh`** → Configuration VPS de base
- **`enhance-test-mode.sh`** → Amélioration mode test

### Étapes de Déploiement
1. **Configuration VPS** : `./vps-setup.sh`
2. **Déploiement** : `./deploy.sh`
3. **Configuration domaine** : DNS → VPS
4. **SSL** : `sudo certbot --nginx -d plannitech.com`

## 📈 Optimisations SEO

### Meta Tags
- ✅ Titres optimisés
- ✅ Descriptions uniques
- ✅ Mots-clés pertinents
- ✅ Open Graph

### Performance
- ✅ Images optimisées
- ✅ Lazy loading
- ✅ Code splitting
- ✅ CDN ready

### Accessibilité
- ✅ Navigation clavier
- ✅ Contraste suffisant
- ✅ Alt text images
- ✅ Structure sémantique

## 🎯 Conversion

### CTAs Principaux
- **"Essai gratuit"** → `/auth/signup`
- **"Voir la démo"** → `/demo`
- **"Commencer maintenant"** → `/auth/signup`
- **"Parler à un expert"** → `/contact`

### Funnel de Conversion
1. **Visiteur** → Landing page
2. **Intéressé** → Features/Pricing
3. **Convaincu** → Demo/Contact
4. **Client** → Signup/Onboarding

## 📊 Analytics

### Métriques à Suivre
- **Traffic** : Visiteurs uniques, pages vues
- **Conversion** : Taux d'inscription, essais
- **Engagement** : Temps sur site, pages/session
- **Revenue** : MRR, churn, LTV

### Outils Recommandés
- **Google Analytics** : Tracking général
- **Hotjar** : Heatmaps et enregistrements
- **Mixpanel** : Événements utilisateur
- **Stripe** : Métriques de paiement

## 🔒 Sécurité

### Mesures Implémentées
- ✅ HTTPS obligatoire
- ✅ Headers de sécurité
- ✅ Validation des formulaires
- ✅ Protection CSRF
- ✅ Rate limiting

### Conformité
- ✅ RGPD compliant
- ✅ Cookies policy
- ✅ Privacy policy
- ✅ Terms of service

## 📞 Support

### Documentation
- **README.md** → Guide général
- **DEPLOYMENT.md** → Guide déploiement
- **SITE_VENTE.md** → Guide site de vente

### Contact
- **Email** : support@plannitech.com
- **Téléphone** : +33 1 23 45 67 89
- **Chat** : Disponible 24/7

## 🎉 Résultat

Un site de vente professionnel et complet pour **Plannitech** avec :
- ✅ Design moderne et responsive
- ✅ Toutes les pages marketing nécessaires
- ✅ Optimisations SEO et performance
- ✅ Funnel de conversion optimisé
- ✅ Prêt pour la production

**Le site est maintenant prêt à convertir vos visiteurs en clients !** 🚀

