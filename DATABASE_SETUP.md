# Configuration de la Base de Données

## 🚀 Instructions pour configurer PostgreSQL avec Prisma

### 1. Installation des dépendances

```bash
# Installer Prisma CLI globalement
npm install -g prisma

# Installer les dépendances du projet
npm install
```

### 2. Configuration de la base de données

#### Sur votre VPS :

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE plannitech;

# Créer un utilisateur
CREATE USER plannitech WITH PASSWORD 'Plannitech78370!';

# Donner les privilèges
GRANT ALL PRIVILEGES ON DATABASE plannitech TO plannitech;

# Quitter PostgreSQL
\q
```

#### Variables d'environnement

Créer ou mettre à jour le fichier `.env.production` :

```env
# Base de données
DATABASE_URL="postgresql://plannitech:Plannitech78370!@localhost:5432/plannitech"

# NextAuth
NEXTAUTH_SECRET="votre-secret-super-securise"
NEXTAUTH_URL="https://plannitech.com"

# Email
EMAIL_FROM=noreply@plannitech.com
```

### 3. Initialisation de la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la base de données
npm run db:push

# Initialiser avec des données de démonstration
npm run db:init
```

### 4. Vérification

```bash
# Ouvrir Prisma Studio pour voir les données
npm run db:studio
```

## 📊 Structure de la base de données

### Tables principales :
- **User** : Utilisateurs de l'application
- **Organization** : Organisations/entreprises
- **OrganizationUser** : Liaison utilisateurs-organisations avec rôles
- **Project** : Projets/spectacles
- **Contact** : Contacts (artistes, techniciens, lieux)
- **BudgetItem** : Éléments de budget
- **PlanningItem** : Événements de planning
- **TechnicalSheet** : Fiches techniques

### Relations :
- Un utilisateur peut appartenir à plusieurs organisations
- Chaque organisation a ses propres projets, contacts, budgets
- Les projets peuvent avoir plusieurs contacts assignés
- Les budgets sont liés aux projets et contacts

## 🔧 Commandes utiles

```bash
# Réinitialiser la base de données
npm run db:reset

# Créer une migration
npm run db:migrate

# Voir les données
npm run db:studio

# Générer le client après modification du schéma
npm run db:generate
```

## 🚨 Résolution de problèmes

### Erreur "Environment variable not found: DATABASE_URL"

```bash
# Charger les variables d'environnement
export $(cat .env.production | xargs)

# Ou copier le fichier
cp .env.production .env
```

### Erreur de connexion PostgreSQL

```bash
# Vérifier que PostgreSQL fonctionne
sudo systemctl status postgresql

# Redémarrer PostgreSQL
sudo systemctl restart postgresql

# Tester la connexion
psql 'postgresql://plannitech:Plannitech78370!@localhost:5432/plannitech' -c "SELECT version();"
```

### Erreur "prisma: not found"

```bash
# Installer Prisma CLI
npm install -g prisma

# Ou utiliser npx
npx prisma db push
```

## 📝 Données de démonstration

Après l'initialisation, vous aurez :

- **Utilisateur admin** : `admin@plannitech.com` / `admin123`
- **Organisation** : "Mon Organisation"
- **Projet de démonstration** : "Concert de démonstration"
- **Contact de démonstration** : "Artiste Démo"
- **Éléments de budget** et **événements de planning**

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Chaque organisation a ses données isolées
- Les permissions sont gérées par rôle
- Les API vérifient l'authentification et les permissions

## 📈 Performance

- Index sur les colonnes fréquemment utilisées
- Relations optimisées avec Prisma
- Requêtes avec `include` pour éviter les N+1
- Pagination disponible sur les listes
