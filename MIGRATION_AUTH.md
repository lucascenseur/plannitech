# 🔄 Migration vers l'authentification réelle

## 📋 Étapes de migration

### 1. **Sauvegarder les données existantes**
```bash
# Sauvegarder la base de données actuelle
pg_dump plannitech > backup_before_migration.sql
```

### 2. **Configurer la base de données**
```bash
# Créer la base de données PostgreSQL
createdb plannitech

# Configurer les variables d'environnement
cp .env.production.example .env.production
# Éditer .env.production avec vos vraies valeurs
```

### 3. **Installer les dépendances manquantes**
```bash
npm install @next-auth/prisma-adapter bcryptjs tsx
npm install -D @types/bcryptjs
```

### 4. **Initialiser la base de données**
```bash
# Générer le client Prisma
npm run db:generate

# Appliquer le schéma à la base de données
npm run db:push

# Initialiser avec des données de démonstration
npm run db:init
```

### 5. **Activer l'authentification réelle**
```bash
# Remplacer l'ancien système d'auth par le nouveau
mv lib/auth.ts lib/auth-test.ts
mv lib/auth-real.ts lib/auth.ts
```

### 6. **Redémarrer l'application**
```bash
# En développement
npm run dev

# En production
pm2 restart plannitech
```

## 🔐 Configuration de l'authentification

### Variables d'environnement requises :
```env
NODE_ENV=production
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=votre-secret-tres-long-et-securise
DATABASE_URL=postgresql://user:password@localhost:5432/plannitech
```

### Compte administrateur par défaut :
- **Email** : `admin@plannitech.com`
- **Mot de passe** : `admin123`
- **Organisation** : `Plannitech Demo`

⚠️ **Important** : Changez le mot de passe admin en production !

## 🚀 Fonctionnalités disponibles

### ✅ Inscription des utilisateurs
- Formulaire d'inscription avec validation
- Création automatique d'organisation
- Attribution du rôle OWNER

### ✅ Connexion sécurisée
- Authentification via NextAuth
- Sessions JWT
- Gestion des rôles et permissions

### ✅ Gestion des organisations
- Chaque utilisateur a sa propre organisation
- Rôles : OWNER, ADMIN, MANAGER, COLLABORATOR, GUEST
- Permissions granulaires

### ✅ Base de données complète
- Modèles pour tous les aspects métier
- Relations entre utilisateurs, organisations, projets
- Données de démonstration

## 🔧 Commandes utiles

```bash
# Voir les données en base
npm run db:studio

# Réinitialiser la base de données
npm run db:push --force-reset
npm run db:init

# Générer le client Prisma
npm run db:generate
```

## 🐛 Dépannage

### Problème : "Cannot connect to database"
- Vérifiez que PostgreSQL est démarré
- Vérifiez la variable DATABASE_URL
- Vérifiez les permissions de la base de données

### Problème : "NextAuth configuration error"
- Vérifiez NEXTAUTH_SECRET
- Vérifiez NEXTAUTH_URL
- Vérifiez que le fichier auth.ts est correct

### Problème : "User not found"
- Vérifiez que l'utilisateur existe en base
- Vérifiez les relations OrganizationUser
- Utilisez `npm run db:studio` pour inspecter

## 📞 Support

En cas de problème :
1. Vérifiez les logs : `pm2 logs plannitech`
2. Vérifiez la base de données : `npm run db:studio`
3. Consultez ce guide de migration
4. Vérifiez les variables d'environnement

---

**🎉 Félicitations ! Votre application utilise maintenant un système d'authentification réel et sécurisé !**
