# Guide de Test - Spectacle SaaS

## 🚀 Lancement de l'application

L'application est maintenant configurée en mode test et fonctionne sans base de données.

### 1. Démarrer le serveur

```bash
export PATH="$PWD/node-v18.20.8-darwin-arm64/bin:$PATH" && npm run dev
```

### 2. Accéder à l'application

Ouvrez votre navigateur sur : **http://localhost:3000**

## 🔐 Comptes de Test

### Compte Administrateur (Tous les accès)
- **Email** : `admin@test.com`
- **Mot de passe** : `admin123`
- **Rôle** : `OWNER`
- **Accès** : Complet à tous les modules

### Compte Utilisateur Standard
- **Email** : N'importe quel email valide (ex: `user@test.com`)
- **Mot de passe** : N'importe quel mot de passe (ex: `password123`)
- **Rôle** : `ADMIN`
- **Accès** : Accès avancé aux modules

## 🧪 Tests à Effectuer

### 1. Authentification
- [ ] Se connecter avec le compte admin
- [ ] Se connecter avec un compte utilisateur
- [ ] Tester la déconnexion
- [ ] Vérifier la redirection automatique

### 2. Onboarding
- [ ] Compléter le processus d'onboarding
- [ ] Tester les 3 étapes (Organisation, Secteur, Objectifs)
- [ ] Vérifier la redirection vers le dashboard

### 3. Dashboard
- [ ] Vérifier l'affichage du dashboard
- [ ] Tester la navigation dans la sidebar
- [ ] Vérifier les widgets et statistiques

### 4. Modules Principaux
- [ ] **Projets** : Créer, modifier, archiver des projets
- [ ] **Planning** : Gérer le calendrier et les événements
- [ ] **Contacts** : Gérer la base de données des contacts
- [ ] **Budget** : Gérer les budgets et dépenses
- [ ] **Technique** : Gérer les fiches techniques
- [ ] **Facturation** : Gérer les abonnements

### 5. Interface Utilisateur
- [ ] Tester la responsivité (mobile, tablette, desktop)
- [ ] Vérifier les animations et transitions
- [ ] Tester les formulaires et validations
- [ ] Vérifier les messages d'erreur et de succès

## 🔧 Configuration Actuelle

### Mode Test Activé
- ✅ Authentification simplifiée (pas de base de données)
- ✅ API routes désactivées (renommées en `.bak`)
- ✅ Données simulées pour les tests
- ✅ Interface complète fonctionnelle

### Fonctionnalités Disponibles
- ✅ Interface utilisateur complète
- ✅ Navigation et routing
- ✅ Formulaires et validations
- ✅ Composants Shadcn/ui
- ✅ Design responsive
- ✅ Authentification NextAuth.js

### Limitations du Mode Test
- ❌ Pas de persistance des données
- ❌ Pas de base de données
- ❌ Pas d'intégration Stripe réelle
- ❌ Pas d'envoi d'emails
- ❌ Données simulées uniquement

## 🐛 Dépannage

### Erreurs Courantes

1. **"Module not found: Can't resolve 'bcryptjs'"**
   - Solution : `npm install bcryptjs`

2. **"[next-auth][error][NO_SECRET]"**
   - Solution : Le secret est configuré dans `next.config.js`

3. **"Cannot read properties of undefined (reading 'OWNER')"**
   - Solution : Corrigé en créant l'enum UserRole dans `types/auth.ts`

### Redémarrage du Serveur
Si vous rencontrez des erreurs, redémarrez le serveur :
```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer :
export PATH="$PWD/node-v18.20.8-darwin-arm64/bin:$PATH" && npm run dev
```

## 📝 Notes Importantes

- L'application fonctionne en mode test sans base de données
- Toutes les données sont simulées
- Les API routes sont désactivées pour éviter les erreurs
- L'interface est complètement fonctionnelle
- Vous pouvez tester tous les composants et la navigation

## 🎯 Prochaines Étapes

Pour passer en mode production :
1. Configurer une base de données (PostgreSQL)
2. Restaurer les API routes (renommer `.bak` en `.ts`)
3. Configurer les variables d'environnement
4. Intégrer Stripe pour les paiements
5. Configurer l'envoi d'emails

---

**L'application est maintenant prête pour les tests ! 🎉**

