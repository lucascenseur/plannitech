#!/bin/bash

# Script de configuration rapide pour VPS
# Usage: ./vps-setup.sh

set -e

echo "🚀 Configuration VPS pour Spectacle SaaS"
echo "======================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification des prérequis
log_info "Vérification des prérequis..."

if ! command -v git &> /dev/null; then
    log_info "Installation de Git..."
    sudo apt update
    sudo apt install -y git
fi

# Installation de Node.js via NVM (recommandé)
log_info "Installation de Node.js via NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18
nvm alias default 18

# Installation de PostgreSQL
log_info "Installation de PostgreSQL..."
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Configuration de PostgreSQL
log_info "Configuration de PostgreSQL..."
sudo -u postgres createuser --interactive --pwprompt spectacle_user
sudo -u postgres createdb spectacle_saas

# Installation de Nginx
log_info "Installation de Nginx..."
sudo apt install -y nginx

# Installation de PM2
log_info "Installation de PM2..."
npm install -g pm2

# Installation de Certbot
log_info "Installation de Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Configuration du firewall
log_info "Configuration du firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Création du répertoire de l'application
log_info "Création du répertoire de l'application..."
sudo mkdir -p /var/www/spectacle-saas
sudo chown -R $USER:$USER /var/www/spectacle-saas

log_success "Configuration VPS terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Clonez votre repository :"
echo "   git clone https://github.com/votre-username/spectacle-saas.git /var/www/spectacle-saas"
echo ""
echo "2. Configurez les variables d'environnement :"
echo "   cp .env.example .env"
echo "   nano .env"
echo ""
echo "3. Installez les dépendances :"
echo "   cd /var/www/spectacle-saas"
echo "   npm install"
echo ""
echo "4. Configurez la base de données :"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo ""
echo "5. Build et démarrez l'application :"
echo "   npm run build"
echo "   pm2 start npm --name 'spectacle-saas' -- start"
echo ""
echo "6. Configurez Nginx (voir nginx-config.conf)"
echo ""
echo "7. Obtenez un certificat SSL :"
echo "   sudo certbot --nginx -d votre-domaine.com"
echo ""
log_warning "N'oubliez pas de configurer votre domaine DNS !"

