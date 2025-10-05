#!/bin/bash

# Script de configuration VPS pour Plannitech
echo "🔧 Configuration du VPS pour Plannitech..."

# Variables
APP_NAME="plannitech"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="votre-domaine.com"  # Remplacez par votre domaine

# 1. Mise à jour du système
echo "📦 Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# 2. Installation de Node.js 18
echo "📦 Installation de Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Installation de PM2
echo "📦 Installation de PM2..."
sudo npm install -g pm2

# 4. Installation de Nginx
echo "📦 Installation de Nginx..."
sudo apt install nginx -y

# 5. Installation de Git
echo "📦 Installation de Git..."
sudo apt install git -y

# 6. Installation de Certbot pour SSL
echo "📦 Installation de Certbot..."
sudo apt install certbot python3-certbot-nginx -y

# 7. Création du répertoire de l'application
echo "📁 Création du répertoire de l'application..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# 8. Configuration de PM2 pour démarrer au boot
echo "⚙️ Configuration de PM2..."
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# 9. Configuration du firewall
echo "🔥 Configuration du firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

echo "✅ Configuration VPS terminée !"
echo "📋 Prochaines étapes :"
echo "1. Clonez votre repository dans $APP_DIR"
echo "2. Configurez vos variables d'environnement"
echo "3. Lancez 'npm run build'"
echo "4. Démarrez avec 'pm2 start ecosystem.config.js'"
echo "5. Configurez Nginx avec le fichier nginx.conf"
echo "6. Obtenez un certificat SSL avec 'sudo certbot --nginx -d $DOMAIN'"
