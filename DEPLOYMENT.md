# 🚀 Guide de Déploiement Plannitech

## 📋 Prérequis
- VPS avec Ubuntu 20.04+ ou Debian 11+
- Domaine configuré pointant vers votre VPS
- Accès SSH à votre VPS

## 🔧 Configuration du VPS

### 1. Connexion au VPS
```bash
ssh root@votre-ip-vps
```

### 2. Exécution du script de configuration
```bash
# Télécharger et exécuter le script de configuration
wget https://raw.githubusercontent.com/votre-repo/plannitech/main/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

### 3. Configuration manuelle (si nécessaire)
```bash
# Créer un utilisateur non-root (recommandé)
adduser plannitech
usermod -aG sudo plannitech
su - plannitech
```

## 📦 Déploiement de l'application

### 1. Cloner le repository
```bash
cd /var/www/plannitech
git clone https://github.com/votre-username/plannitech.git .
```

### 2. Configuration des variables d'environnement
```bash
# Créer le fichier .env.production
nano .env.production

# Ajouter vos variables (voir .env.production.example)
NODE_ENV=production
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=votre-secret-super-securise
# ... autres variables
```

### 3. Installation et build
```bash
# Installer les dépendances
npm ci --production

# Build de l'application
npm run build
```

### 4. Démarrage avec PM2
```bash
# Démarrer l'application
pm2 start ecosystem.config.js

# Vérifier le statut
pm2 status
pm2 logs plannitech
```

## 🌐 Configuration Nginx

### 1. Copier la configuration Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/plannitech
sudo ln -s /etc/nginx/sites-available/plannitech /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

### 2. Modifier la configuration pour votre domaine
```bash
sudo nano /etc/nginx/sites-available/plannitech
# Remplacer "votre-domaine.com" par votre vrai domaine
```

### 3. Tester et redémarrer Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 Configuration SSL avec Let's Encrypt

### 1. Obtenir le certificat SSL
```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

### 2. Vérifier le renouvellement automatique
```bash
sudo certbot renew --dry-run
```

## 🔄 Déploiement continu

### 1. Script de déploiement automatique
```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Exécuter le déploiement
./deploy.sh
```

### 2. Configuration Git pour déploiement automatique
```bash
# Ajouter un webhook GitHub (optionnel)
# Ou configurer un cron job pour pull automatique
```

## 📊 Monitoring et Maintenance

### 1. Commandes PM2 utiles
```bash
# Voir les logs
pm2 logs plannitech

# Redémarrer l'application
pm2 restart plannitech

# Voir les métriques
pm2 monit

# Sauvegarder la configuration PM2
pm2 save
```

### 2. Monitoring système
```bash
# Voir l'utilisation des ressources
htop

# Voir les logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🚨 Dépannage

### Problèmes courants

1. **Application ne démarre pas**
   ```bash
   pm2 logs plannitech
   # Vérifier les variables d'environnement
   ```

2. **Erreur 502 Bad Gateway**
   ```bash
   # Vérifier que l'application tourne sur le port 3000
   pm2 status
   netstat -tlnp | grep :3000
   ```

3. **Problème de permissions**
   ```bash
   sudo chown -R $USER:$USER /var/www/plannitech
   ```

4. **Nginx ne démarre pas**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

## 📈 Optimisations

### 1. Cache Redis (optionnel)
```bash
sudo apt install redis-server
# Configurer Redis dans votre application
```

### 2. CDN (optionnel)
- Configurer Cloudflare ou AWS CloudFront
- Optimiser les images avec Next.js Image Optimization

### 3. Base de données
- Configurer PostgreSQL ou MySQL
- Optimiser les requêtes
- Configurer les sauvegardes

## 🔐 Sécurité

### 1. Firewall
```bash
sudo ufw status
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

### 2. Mise à jour régulière
```bash
sudo apt update && sudo apt upgrade -y
npm update
```

### 3. Monitoring de sécurité
- Configurer fail2ban
- Monitoring des logs
- Sauvegardes régulières

## 📞 Support

En cas de problème :
1. Vérifier les logs : `pm2 logs plannitech`
2. Vérifier Nginx : `sudo nginx -t`
3. Vérifier les ports : `netstat -tlnp`
4. Vérifier les permissions : `ls -la /var/www/plannitech`