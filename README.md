# Spectacle SaaS - Gestion du spectacle vivant

Plateforme SaaS moderne pour la gestion complète du spectacle vivant, construite avec Next.js 14, TypeScript, et Prisma.

## 🚀 Stack Technique

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: API Routes Next.js + Prisma ORM
- **Base de données**: PostgreSQL (Supabase/Railway)
- **Authentification**: NextAuth.js
- **UI**: Tailwind CSS + Shadcn/ui
- **Paiements**: Stripe
- **Déploiement**: Vercel

## 📁 Structure du Projet

```
spectacle-saas/
├── app/                    # App Router Next.js 14
│   ├── (auth)/            # Pages d'authentification
│   ├── (dashboard)/       # Interface principale
│   ├── (admin)/           # Administration
│   └── api/               # Routes API backend
├── components/            # Composants réutilisables
│   └── ui/               # Composants Shadcn/ui
├── lib/                  # Utilitaires et configurations
├── prisma/               # Schéma base de données
└── hooks/                # Hooks React personnalisés
```

## 🛠️ Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd spectacle-saas
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp env.example .env.local
   ```
   
   Remplir les variables d'environnement :
   - `DATABASE_URL` : URL de votre base PostgreSQL
   - `NEXTAUTH_SECRET` : Clé secrète pour NextAuth
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` : OAuth Google
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` : OAuth GitHub
   - `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` : Clés Stripe

4. **Configuration de la base de données**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

## 🎯 Fonctionnalités

### Gestion des Événements
- Création et édition d'événements
- Planning et calendrier
- Gestion des salles et lieux
- Types d'événements (concert, théâtre, danse, etc.)

### Gestion des Artistes
- Base de données des artistes
- Informations techniques (rider)
- Historique des collaborations
- Réseaux sociaux

### Billetterie Intégrée
- Système de réservation
- Paiements sécurisés avec Stripe
- Gestion des tarifs
- Codes promotionnels

### Analytics & Rapports
- Tableaux de bord
- Statistiques de vente
- Rapports financiers
- Métriques de performance

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build
npm run start

# Linting et formatage
npm run lint
npm run format

# Base de données
npm run db:generate    # Générer le client Prisma
npm run db:push       # Pousser le schéma vers la DB
npm run db:migrate    # Créer une migration
npm run db:studio     # Ouvrir Prisma Studio
npm run db:seed       # Peupler la base avec des données de test
```

## 🗄️ Modèle de Données

Le schéma Prisma inclut les modèles suivants :

- **User** : Utilisateurs de la plateforme
- **Organization** : Organisations/entreprises
- **Event** : Événements et spectacles
- **Artist** : Artistes et intervenants
- **Venue** : Salles et lieux
- **Booking** : Réservations
- **Invoice** : Factures
- **Payment** : Paiements

## 🔐 Authentification

La plateforme utilise NextAuth.js avec support pour :
- Authentification par email/mot de passe
- OAuth Google
- OAuth GitHub

## 💳 Intégration Stripe

- Création de PaymentIntent
- Webhooks pour les événements de paiement
- Gestion des échecs de paiement
- Support multi-devises

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Variables d'environnement requises

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret"
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
```

## 📚 Documentation API

Les routes API sont disponibles sous `/api/` :

- `POST /api/stripe/create-payment-intent` : Créer un paiement
- `POST /api/stripe/webhook` : Webhook Stripe
- `GET /api/events` : Lister les événements
- `POST /api/events` : Créer un événement

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour le spectacle vivant**

