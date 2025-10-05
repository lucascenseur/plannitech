# 🧪 Comptes de test pour Spectacle SaaS

## 🔐 Comptes disponibles

### 👑 Administrateur (Tous les accès)
- **Email** : `admin@test.com`
- **Mot de passe** : `admin123`
- **Rôle** : OWNER
- **Accès** : Toutes les fonctionnalités

### 👤 Utilisateur standard
- **Email** : N'importe quel email valide
- **Mot de passe** : N'importe quel mot de passe
- **Rôle** : ADMIN
- **Accès** : Fonctionnalités avancées

## 🚀 Comment se connecter

1. **Ouvrir l'application** : `http://localhost:3000`
2. **Cliquer sur "Connexion"** dans le header
3. **Saisir les identifiants** :
   - Pour l'admin : `admin@test.com` / `admin123`
   - Pour un utilisateur : n'importe quel email/mot de passe
4. **Cliquer sur "Se connecter"**

## 🎯 Fonctionnalités testables

### 📊 Dashboard
- Vue d'ensemble des projets
- Statistiques et métriques
- Planning hebdomadaire
- Tâches récentes

### 🎭 Gestion des projets
- Création de nouveaux projets
- Édition des projets existants
- Vue Kanban des statuts
- Import/Export CSV

### 📅 Planning
- Calendrier mensuel/hebdomadaire/quotidien
- Création d'événements
- Gestion des conflits
- Export iCal/Google Calendar

### 👥 Contacts
- Base de données des artistes
- Gestion des compétences et tarifs
- Historique de collaboration
- Import/Export vCard

### 💰 Budget
- Budgets prévisionnels
- Suivi des dépenses
- Génération de devis/factures
- Gestion des intermittents

### 🔧 Outils techniques
- Fiches techniques par projet
- Plans de feu et schémas
- Inventaire matériel
- Check-lists montage/démontage

### 💳 Facturation
- Plans d'abonnement
- Gestion des factures
- Portail de facturation Stripe
- Statistiques financières

## 🛠️ Configuration technique

- **Base de données** : Désactivée (mode test)
- **Authentification** : NextAuth.js simplifié
- **Stripe** : Configuration de test
- **Variables d'environnement** : Configurées pour le développement

## 📝 Notes importantes

- ⚠️ **Mode test uniquement** : Aucune donnée n'est persistée
- 🔄 **Rechargement automatique** : Les modifications de code rechargent l'application
- 🎨 **Design responsive** : Testé sur mobile, tablette et desktop
- 🚀 **Performance** : Optimisé pour le développement

## 🐛 Dépannage

Si vous rencontrez des problèmes :

1. **Vérifier que le serveur fonctionne** : `http://localhost:3000`
2. **Vérifier les logs** dans le terminal
3. **Redémarrer le serveur** si nécessaire
4. **Vider le cache** du navigateur

## 📞 Support

Pour toute question ou problème, consultez :
- Les logs du serveur dans le terminal
- La documentation Next.js
- Les composants Shadcn/ui

