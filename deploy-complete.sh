#!/bin/bash

# 🚀 Script de déploiement complet pour Plannitech
# Date: 5 octobre 2025
# Version: 1.0.0

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="plannitech"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/lucascenseur/plannitech.git"
DOMAIN="plannitech.com"
EMAIL="admin@plannitech.com"
NODE_VERSION="18.20.8"
PM2_APP_NAME="plannitech"

# Fonction pour afficher les messages
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Fonction pour installer Node.js
install_nodejs() {
    log "Installation de Node.js $NODE_VERSION..."
    
    if command_exists node; then
        CURRENT_VERSION=$(node --version | cut -d'v' -f2)
        if [[ "$CURRENT_VERSION" == "$NODE_VERSION" ]]; then
            success "Node.js $NODE_VERSION déjà installé"
            return
        fi
    fi
    
    # Installation de Node.js via NodeSource
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Vérification de l'installation
    if command_exists node; then
        success "Node.js $(node --version) installé"
    else
        error "Échec de l'installation de Node.js"
    fi
}

# Fonction pour installer les dépendances système
install_system_dependencies() {
    log "Installation des dépendances système..."
    
    sudo apt-get update
    sudo apt-get install -y \
        curl \
        wget \
        git \
        nginx \
        certbot \
        python3-certbot-nginx \
        ufw \
        postgresql \
        postgresql-contrib \
        build-essential \
        python3-dev \
        libpq-dev
    
    success "Dépendances système installées"
}

# Fonction pour installer PM2
install_pm2() {
    log "Installation de PM2..."
    
    if command_exists pm2; then
        success "PM2 déjà installé"
        return
    fi
    
    sudo npm install -g pm2
    pm2 startup systemd -u $USER --hp $HOME
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
    
    success "PM2 installé et configuré"
}

# Fonction pour configurer PostgreSQL
setup_postgresql() {
    log "Configuration de PostgreSQL..."
    
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Création de la base de données
    sudo -u postgres psql -c "CREATE DATABASE $APP_NAME;" || true
    sudo -u postgres psql -c "CREATE USER $APP_NAME WITH PASSWORD 'Plannitech78370!';" || true
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $APP_NAME TO $APP_NAME;" || true
    
    success "PostgreSQL configuré"
}

# Fonction pour configurer UFW
setup_firewall() {
    log "Configuration du pare-feu UFW..."
    
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw allow 3000
    sudo ufw --force enable
    
    success "Pare-feu configuré"
}

# Fonction pour cloner et configurer l'application
setup_application() {
    log "Configuration de l'application..."
    
    # Création du répertoire
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
    
    # Clonage du repository
    if [ -d "$APP_DIR/.git" ]; then
        log "Mise à jour du repository existant..."
        cd $APP_DIR
        git fetch origin
        git reset --hard origin/main
    else
        log "Clonage du repository..."
        git clone $REPO_URL $APP_DIR
        cd $APP_DIR
    fi
    
    # Configuration des variables d'environnement
    cat > .env.production << EOF
NODE_ENV=production
NEXTAUTH_URL=https://$DOMAIN
NEXTAUTH_SECRET=8393fc665b1384e03942866c4e6e8828
NEXT_PUBLIC_APP_URL=https://$DOMAIN
NEXT_PUBLIC_APP_NAME=Plannitech
DATABASE_URL=postgresql://$APP_NAME:Plannitech78370!@localhost:5432/$APP_NAME
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=$EMAIL
EMAIL_SERVER_PASSWORD=votre-mot-de-passe-app
EMAIL_FROM=noreply@$DOMAIN
EOF
    
    success "Application configurée"
}

# Fonction pour installer les dépendances et builder
build_application() {
    log "Installation des dépendances et build..."
    
    cd $APP_DIR
    
    # Nettoyage
    rm -rf node_modules package-lock.json .next
    
    # Installation des dépendances
    npm cache clean --force
    npm install --legacy-peer-deps --no-optional
    
    # Build de l'application
    NODE_OPTIONS="--max-old-space-size=4096" npm run build -- --no-lint
    
    # Vérification du build
    if [ -f ".next/BUILD_ID" ] && [ -f ".next/prerender-manifest.json" ]; then
        success "Build réussi"
    else
        error "Échec du build"
    fi
}

# Fonction pour configurer PM2
setup_pm2() {
    log "Configuration de PM2..."
    
    cd $APP_DIR
    
    # Arrêt des processus existants
    pm2 stop $PM2_APP_NAME 2>/dev/null || true
    pm2 delete $PM2_APP_NAME 2>/dev/null || true
    
    # Configuration PM2
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PM2_APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/$PM2_APP_NAME-error.log',
    out_file: '/var/log/pm2/$PM2_APP_NAME-out.log',
    log_file: '/var/log/pm2/$PM2_APP_NAME-combined.log',
    time: true
  }]
};
EOF
    
    # Démarrage de l'application
    pm2 start ecosystem.config.js
    pm2 save
    
    success "PM2 configuré et application démarrée"
}

# Fonction pour configurer Nginx
setup_nginx() {
    log "Configuration de Nginx..."
    
    # Configuration Nginx
    sudo tee /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Optimisations
    client_max_body_size 100M;
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF
    
    # Activation du site
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test de la configuration
    sudo nginx -t
    
    # Redémarrage de Nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    success "Nginx configuré"
}

# Fonction pour configurer SSL
setup_ssl() {
    log "Configuration du SSL avec Let's Encrypt..."
    
    # Installation du certificat SSL
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL
    
    # Configuration de la redirection HTTPS
    sudo tee /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/$DOMAIN/chain.pem;

    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de sécurité
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Optimisations
    client_max_body_size 100M;
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF
    
    # Redémarrage de Nginx
    sudo nginx -t && sudo systemctl restart nginx
    
    success "SSL configuré avec Let's Encrypt"
}

# Fonction pour configurer le renouvellement automatique du SSL
setup_ssl_renewal() {
    log "Configuration du renouvellement automatique SSL..."
    
    # Test du renouvellement
    sudo certbot renew --dry-run
    
    success "Renouvellement automatique SSL configuré"
}

# Fonction pour optimiser le système
optimize_system() {
    log "Optimisation du système..."
    
    # Configuration des limites système
    echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
    echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf
    
    # Configuration du swap
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    
    # Optimisation de PostgreSQL
    sudo tee -a /etc/postgresql/*/main/postgresql.conf << EOF
# Optimisations pour Plannitech
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
EOF
    
    sudo systemctl restart postgresql
    
    success "Système optimisé"
}

# Fonction pour créer un script de maintenance
create_maintenance_script() {
    log "Création du script de maintenance..."
    
    cat > $APP_DIR/maintenance.sh << 'EOF'
#!/bin/bash
# Script de maintenance pour Plannitech

APP_DIR="/var/www/plannitech"
PM2_APP_NAME="plannitech"

echo "🔧 Maintenance de Plannitech..."

# Mise à jour du code
cd $APP_DIR
git pull origin main

# Nettoyage et reinstallation
rm -rf node_modules package-lock.json .next
npm cache clean --force
npm install --legacy-peer-deps --no-optional

# Rebuild
NODE_OPTIONS="--max-old-space-size=4096" npm run build -- --no-lint

# Redémarrage PM2
pm2 restart $PM2_APP_NAME

# Vérification du statut
pm2 status

echo "✅ Maintenance terminée"
EOF
    
    chmod +x $APP_DIR/maintenance.sh
    
    success "Script de maintenance créé"
}

# Fonction pour afficher le statut final
show_status() {
    log "Vérification du statut final..."
    
    echo -e "\n${PURPLE}🎉 DÉPLOIEMENT TERMINÉ !${NC}\n"
    
    echo -e "${GREEN}📊 Statut des services :${NC}"
    echo "• Nginx: $(sudo systemctl is-active nginx)"
    echo "• PostgreSQL: $(sudo systemctl is-active postgresql)"
    echo "• PM2: $(pm2 status | grep $PM2_APP_NAME | awk '{print $10}')"
    
    echo -e "\n${GREEN}🌐 URLs :${NC}"
    echo "• Application: https://$DOMAIN"
    echo "• Status PM2: pm2 status"
    echo "• Logs PM2: pm2 logs $PM2_APP_NAME"
    
    echo -e "\n${GREEN}🔧 Commandes utiles :${NC}"
    echo "• Maintenance: $APP_DIR/maintenance.sh"
    echo "• Logs Nginx: sudo tail -f /var/log/nginx/error.log"
    echo "• Logs PM2: pm2 logs $PM2_APP_NAME"
    echo "• Redémarrage: pm2 restart $PM2_APP_NAME"
    
    echo -e "\n${GREEN}📁 Fichiers importants :${NC}"
    echo "• Application: $APP_DIR"
    echo "• Configuration Nginx: /etc/nginx/sites-available/$APP_NAME"
    echo "• Variables d'environnement: $APP_DIR/.env.production"
    echo "• Configuration PM2: $APP_DIR/ecosystem.config.js"
    
    echo -e "\n${YELLOW}⚠️  N'oubliez pas de :${NC}"
    echo "• Configurer vos variables d'environnement dans .env.production"
    echo "• Configurer votre base de données si nécessaire"
    echo "• Configurer vos clés Stripe et email"
    
    success "Déploiement complet terminé !"
}

# Fonction principale
main() {
    echo -e "${PURPLE}🚀 DÉPLOIEMENT COMPLET DE PLANNITECH${NC}"
    echo -e "${PURPLE}=====================================${NC}\n"
    
    # Vérification des privilèges
    if [[ $EUID -eq 0 ]]; then
        error "Ne pas exécuter ce script en tant que root"
    fi
    
    # Installation des dépendances système
    install_system_dependencies
    
    # Installation de Node.js
    install_nodejs
    
    # Installation de PM2
    install_pm2
    
    # Configuration de PostgreSQL
    setup_postgresql
    
    # Configuration du pare-feu
    setup_firewall
    
    # Configuration de l'application
    setup_application
    
    # Build de l'application
    build_application
    
    # Configuration de PM2
    setup_pm2
    
    # Configuration de Nginx
    setup_nginx
    
    # Configuration du SSL
    setup_ssl
    
    # Configuration du renouvellement SSL
    setup_ssl_renewal
    
    # Optimisation du système
    optimize_system
    
    # Création du script de maintenance
    create_maintenance_script
    
    # Affichage du statut final
    show_status
}

# Exécution du script principal
main "$@"
