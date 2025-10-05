# 🚀 Guide de Déploiement Plannitech

## 📋 Prérequis
- VPS avec Ubuntu 20.04+ ou Debian 11+
- Domaine configuré pointant vers votre VPS
- Accès SSH à votre VPS
- Repository GitHub : https://github.com/lucascenseur/plannitech

## 🔧 Configuration du VPS

### 1. Connexion au VPS
```bash
ssh root@votre-ip-vps
# ou
ssh utilisateur@votre-ip-vps
```

### 2. Mise à jour du système
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Installation de Node.js 18
```bash
# Installation de Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérification
node --version
npm --version
```

### 4. Installation de PM2
```bash
# Installation globale de PM2
sudo npm install -g pm2

# Configuration PM2 pour démarrer au boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### 5. Installation de Nginx
```bash
# Installation de Nginx
sudo apt install nginx -y

# Démarrage et activation
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérification
sudo systemctl status nginx
```

### 6. Installation de Git
```bash
sudo apt install git -y
```

### 7. Installation de Certbot (SSL)
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 8. Configuration du firewall
```bash
# Configuration UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Vérification
sudo ufw status
```

## 📦 Déploiement de l'application

### 1. Création du répertoire de l'application
```bash
# Créer le répertoire
sudo mkdir -p /var/www/plannitech
sudo chown -R $USER:$USER /var/www/plannitech
cd /var/www/plannitech
```

### 2. Cloner le repository
```bash
# Cloner le repository
git clone https://github.com/lucascenseur/plannitech.git .

# Vérifier que les fichiers sont présents
ls -la
```

### 3. Configuration des variables d'environnement
```bash
# Créer le fichier .env.production
nano .env.production
```

**Contenu du fichier .env.production :**
```env
# Production Environment Variables
NODE_ENV=production
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=votre-secret-super-securise-ici

# Database (si vous utilisez une DB)
DATABASE_URL=postgresql://user:password@localhost:5432/plannitech

# Stripe (si vous l'utilisez)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Email (si vous utilisez un service email)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=votre-email@gmail.com
EMAIL_SERVER_PASSWORD=votre-mot-de-passe-app
EMAIL_FROM=noreply@votre-domaine.com
```

### 4. Installation des dépendances
```bash
# Installer les dépendances
npm ci --production

# Vérifier l'installation
npm list --depth=0
```

### 5. Build de l'application
```bash
# Build de l'application Next.js
npm run build

# Vérifier que le build a réussi
ls -la .next/
```

### 6. Démarrage avec PM2
```bash
# Démarrer l'application
pm2 start ecosystem.config.js

# Vérifier le statut
pm2 status
pm2 logs plannitech

# Sauvegarder la configuration PM2
pm2 save
```

## 🌐 Configuration Nginx

### 1. Créer la configuration Nginx
```bash
# Créer le fichier de configuration
sudo nano /etc/nginx/sites-available/plannitech
```

**Contenu du fichier :**
```nginx
server {
    listen 80;
    server_name plannitech.com;

    # Redirection vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # Configuration SSL (à configurer avec Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    # Configuration SSL optimisée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Proxy vers l'application Next.js
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

    # Cache des assets statiques
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Cache des images
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

### 2. Activer la configuration
```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/plannitech /etc/nginx/sites-enabled/

# Supprimer la configuration par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

## 🔒 Configuration SSL avec Let's Encrypt

### 1. Obtenir le certificat SSL
```bash
# Obtenir le certificat SSL
sudo certbot --nginx -d plannitech.com -d www.plannitech.com

# Suivre les instructions à l'écran
```

### 2. Vérifier le renouvellement automatique
```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Vérifier le cron job
sudo crontab -l
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

# Voir les processus
pm2 list
```

### 2. Monitoring système
```bash
# Voir l'utilisation des ressources
htop

# Voir les logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Voir les logs de l'application
pm2 logs plannitech --lines 100
```

### 3. Redémarrage du serveur
```bash
# Redémarrer l'application
pm2 restart plannitech

# Redémarrer Nginx
sudo systemctl restart nginx

# Redémarrer le serveur complet
sudo reboot
```

## 🚨 Dépannage

### Problèmes courants

1. **Application ne démarre pas**
   ```bash
   pm2 logs plannitech
   # Vérifier les variables d'environnement
   cat .env.production
   ```

2. **Erreur 502 Bad Gateway**
   ```bash
   # Vérifier que l'application tourne sur le port 3000
   pm2 status
   netstat -tlnp | grep :3000
   
   # Vérifier les logs Nginx
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Problème de permissions**
   ```bash
   sudo chown -R $USER:$USER /var/www/plannitech
   sudo chmod -R 755 /var/www/plannitech
   ```

4. **Nginx ne démarre pas**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   sudo journalctl -u nginx
   ```

5. **Problème de SSL**
   ```bash
   # Vérifier le certificat
   sudo certbot certificates
   
   # Renouveler le certificat
   sudo certbot renew --force-renewal
   ```

6. **Problème de build**
   ```bash
   # Nettoyer et rebuilder
   rm -rf .next/
   npm run build
   ```

## 📈 Optimisations

### 1. Cache Redis (optionnel)
```bash
# Installation Redis
sudo apt install redis-server -y

# Configuration Redis
sudo nano /etc/redis/redis.conf

# Redémarrage Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

### 2. CDN (optionnel)
- Configurer Cloudflare ou AWS CloudFront
- Optimiser les images avec Next.js Image Optimization

### 3. Base de données
```bash
# Installation PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Configuration PostgreSQL
sudo -u postgres createuser --interactive
sudo -u postgres createdb plannitech
```

### 4. Monitoring avancé
```bash
# Installation de monitoring
sudo apt install htop iotop nethogs -y

# Configuration de logs
sudo nano /etc/logrotate.d/plannitech
```

## 🔐 Sécurité

### 1. Firewall avancé
```bash
# Configuration UFW avancée
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Mise à jour régulière
```bash
# Script de mise à jour automatique
sudo crontab -e

# Ajouter cette ligne pour les mises à jour automatiques
0 2 * * * apt update && apt upgrade -y
```

### 3. Sauvegardes
```bash
# Script de sauvegarde
sudo nano /usr/local/bin/backup-plannitech.sh

# Contenu du script de sauvegarde
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/plannitech_$DATE.tar.gz /var/www/plannitech
find /backups -name "plannitech_*.tar.gz" -mtime +7 -delete
```

## 📞 Support

### Commandes de diagnostic
```bash
# Vérifier le statut de tous les services
sudo systemctl status nginx
pm2 status
sudo systemctl status redis-server

# Vérifier les ports
netstat -tlnp | grep :80
netstat -tlnp | grep :443
netstat -tlnp | grep :3000

# Vérifier les logs
sudo journalctl -u nginx -f
pm2 logs plannitech -f
```

### En cas de problème :
1. Vérifier les logs : `pm2 logs plannitech`
2. Vérifier Nginx : `sudo nginx -t`
3. Vérifier les ports : `netstat -tlnp`
4. Vérifier les permissions : `ls -la /var/www/plannitech`
5. Vérifier les variables d'environnement : `cat .env.production`

## 🎯 Checklist de déploiement

- [ ] VPS configuré (Ubuntu/Debian)
- [ ] Node.js 18 installé
- [ ] PM2 installé et configuré
- [ ] Nginx installé et configuré
- [ ] Firewall configuré
- [ ] Repository cloné
- [ ] Variables d'environnement configurées
- [ ] Dépendances installées
- [ ] Application buildée
- [ ] PM2 démarré
- [ ] Nginx configuré
- [ ] SSL configuré
- [ ] Domaine pointant vers le VPS
- [ ] Tests de fonctionnement

## 🚀 Commandes rapides

```bash
# Redémarrage complet
pm2 restart plannitech && sudo systemctl restart nginx

# Mise à jour de l'application
cd /var/www/plannitech && git pull && npm ci --production && npm run build && pm2 restart plannitech

# Vérification du statut
pm2 status && sudo systemctl status nginx

# Logs en temps réel
pm2 logs plannitech -f
```

---

**🎉 Félicitations ! Votre application Plannitech est maintenant déployée et accessible sur votre domaine !**