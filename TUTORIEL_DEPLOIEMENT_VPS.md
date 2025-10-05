# 🚀 Tutoriel de Déploiement Plannitech sur VPS

## 📋 Prérequis

- **VPS Ubuntu/Debian** avec accès root
- **Nom de domaine** configuré et pointant vers votre VPS
- **Accès SSH** à votre serveur
- **Git** installé sur votre machine locale

## 🎯 Méthode 1 : Déploiement Automatique (Recommandé)

### Étape 1 : Télécharger le script de déploiement

```bash
# Se connecter à votre VPS
ssh root@votre-ip-serveur

# Télécharger le script de déploiement
curl -o deploy-complete.sh https://raw.githubusercontent.com/lucascenseur/plannitech/main/deploy-complete.sh

# Rendre le script exécutable
chmod +x deploy-complete.sh
```

### Étape 2 : Configurer le script

Éditez le script pour personnaliser les paramètres :

```bash
nano deploy-complete.sh
```

**Variables importantes à modifier :**

```bash
# Ligne 25 : URL de votre dépôt GitHub
REPO_URL="https://github.com/lucascenseur/plannitech.git"

# Ligne 26 : Nom de votre domaine
DOMAIN="votre-domaine.com"

# Ligne 27 : Version de Node.js (18, 20, ou 22)
NODE_VERSION="18"
```

### Étape 3 : Exécuter le déploiement

```bash
# Lancer le script de déploiement complet
./deploy-complete.sh
```

Le script va automatiquement :
- ✅ Installer Node.js, Nginx, PM2, Certbot
- ✅ Cloner votre application
- ✅ Installer les dépendances
- ✅ Builder l'application
- ✅ Configurer PM2
- ✅ Configurer Nginx
- ✅ Obtenir le certificat SSL

### Étape 4 : Configurer les variables d'environnement

```bash
# Éditer le fichier .env.production
nano /var/www/plannitech/.env.production
```

**Variables essentielles à configurer :**

```env
NODE_ENV=production
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=votre-secret-tres-long-et-securise
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
NEXT_PUBLIC_APP_NAME=Plannitech

# Base de données (si vous en utilisez une)
DATABASE_URL=postgresql://user:password@localhost:5432/plannitech

# Stripe (si vous l'utilisez)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Email (si vous l'utilisez)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=votre-email@gmail.com
EMAIL_SERVER_PASSWORD=votre-mot-de-passe-app
EMAIL_FROM=noreply@votre-domaine.com
```

### Étape 5 : Redémarrer l'application

```bash
# Redémarrer PM2 avec la nouvelle configuration
pm2 restart plannitech-app

# Vérifier le statut
pm2 status
```

## 🛠️ Méthode 2 : Déploiement Manuel

### Étape 1 : Installation des prérequis

```bash
# Mise à jour du système
apt update && apt upgrade -y

# Installation des packages de base
apt install -y git nginx curl ufw

# Installation de Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Installation de PM2
npm install -g pm2
```

### Étape 2 : Configuration du pare-feu

```bash
# Configuration UFW
ufw allow OpenSSH
ufw allow 'Nginx HTTP'
ufw allow 'Nginx HTTPS'
ufw allow 3000/tcp
ufw --force enable
```

### Étape 3 : Déploiement de l'application

```bash
# Cloner le dépôt
git clone https://github.com/lucascenseur/plannitech.git /var/www/plannitech
cd /var/www/plannitech

# Installation des dépendances
npm install --legacy-peer-deps

# Build de l'application
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Étape 4 : Configuration PM2

```bash
# Démarrer l'application avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Étape 5 : Configuration Nginx

```bash
# Créer la configuration Nginx
cat > /etc/nginx/sites-available/plannitech << 'EOF'
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Activer la configuration
ln -s /etc/nginx/sites-available/plannitech /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### Étape 6 : Configuration SSL

```bash
# Installation de Certbot
apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

## 🔧 Commandes de Gestion

### Gestion PM2

```bash
# Voir le statut des applications
pm2 status

# Voir les logs
pm2 logs plannitech-app

# Redémarrer l'application
pm2 restart plannitech-app

# Arrêter l'application
pm2 stop plannitech-app

# Supprimer l'application
pm2 delete plannitech-app
```

### Gestion Nginx

```bash
# Tester la configuration
nginx -t

# Recharger la configuration
systemctl reload nginx

# Redémarrer Nginx
systemctl restart nginx

# Voir le statut
systemctl status nginx
```

### Mise à jour de l'application

```bash
# Se connecter au serveur
ssh root@votre-ip-serveur

# Aller dans le dossier de l'application
cd /var/www/plannitech

# Récupérer les dernières modifications
git pull origin main

# Installer les nouvelles dépendances
npm install --legacy-peer-deps

# Rebuilder l'application
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Redémarrer l'application
pm2 restart plannitech-app
```

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs PM2
pm2 logs plannitech-app

# Vérifier les logs Nginx
tail -f /var/log/nginx/error.log

# Vérifier que le port 3000 est ouvert
netstat -tlnp | grep 3000
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que l'application fonctionne
curl http://localhost:3000

# Vérifier la configuration Nginx
nginx -t

# Redémarrer Nginx
systemctl restart nginx
```

### Problème de certificat SSL

```bash
# Vérifier le statut du certificat
certbot certificates

# Renouveler le certificat
certbot renew --dry-run
```

## 📊 Monitoring

### Vérifier les performances

```bash
# Utilisation CPU et mémoire
htop

# Espace disque
df -h

# Logs système
journalctl -f
```

### Sauvegarde

```bash
# Sauvegarder l'application
tar -czf plannitech-backup-$(date +%Y%m%d).tar.gz /var/www/plannitech

# Sauvegarder la configuration Nginx
cp /etc/nginx/sites-available/plannitech ~/nginx-config-backup.conf
```

## 🎉 Félicitations !

Votre application Plannitech est maintenant déployée et accessible sur `https://votre-domaine.com` !

### Prochaines étapes :

1. **Tester l'application** : Visitez votre domaine pour vérifier que tout fonctionne
2. **Configurer la base de données** : Si vous utilisez une DB, configurez-la
3. **Configurer les emails** : Mettez en place l'envoi d'emails
4. **Configurer Stripe** : Si vous utilisez les paiements
5. **Mettre en place la surveillance** : Configurez des alertes de monitoring

### Support

Si vous rencontrez des problèmes :
- Vérifiez les logs : `pm2 logs plannitech-app`
- Consultez la documentation : `DEPLOYMENT.md`
- Vérifiez la configuration : `nginx -t`

---

**Note** : Ce tutoriel suppose que vous avez déjà un VPS configuré et un nom de domaine pointant vers votre serveur. Si ce n'est pas le cas, configurez d'abord votre DNS avant de commencer le déploiement.
